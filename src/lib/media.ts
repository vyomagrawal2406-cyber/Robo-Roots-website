// Photos and videos that admins add from /admin. Stored in Firebase (Firestore)
// so they show up on the Gallery page without editing code.
import type { GalleryCategory } from "@/content/site";

export const OWNER_EMAIL = "vyomagrawal2406@gmail.com";

export type MediaKind = "image" | "video";
export type MediaDoc = {
  id: string;
  kind: MediaKind;
  url: string;
  cap: string;
  category: GalleryCategory;
  createdAt: number;
};

const config = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"],
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"],
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"],
  appId: import.meta.env["VITE_FIREBASE_APP_ID"],
};
export const firebaseReady = Boolean(config.apiKey && config.projectId);

// Firebase is loaded lazily and only in the browser (pages are server-rendered).
async function fb() {
  const [{ initializeApp, getApps }, fs, auth] = await Promise.all([
    import("firebase/app"),
    import("firebase/firestore"),
    import("firebase/auth"),
  ]);
  const app = getApps()[0] ?? initializeApp(config);
  return { fs, db: fs.getFirestore(app), authLib: auth, auth: auth.getAuth(app) };
}

export async function listMedia(): Promise<MediaDoc[]> {
  if (!firebaseReady) return [];
  const { fs, db } = await fb();
  const snap = await fs.getDocs(
    fs.query(fs.collection(db, "media"), fs.orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MediaDoc, "id">) }));
}

export async function addMedia(m: Omit<MediaDoc, "id" | "createdAt">) {
  const { fs, db } = await fb();
  await fs.addDoc(fs.collection(db, "media"), { ...m, createdAt: Date.now() });
}

export async function deleteMedia(id: string) {
  const { fs, db } = await fb();
  await fs.deleteDoc(fs.doc(db, "media", id));
}

// Extra admins are stored as documents in "admins", keyed by lowercase email.
export async function listAdmins(): Promise<string[]> {
  const { fs, db } = await fb();
  const snap = await fs.getDocs(fs.collection(db, "admins"));
  return snap.docs.map((d) => d.id);
}

export async function setAdmin(email: string, isAdmin: boolean) {
  const { fs, db } = await fb();
  const ref = fs.doc(db, "admins", email.trim().toLowerCase());
  await (isAdmin ? fs.setDoc(ref, { addedAt: Date.now() }) : fs.deleteDoc(ref));
}

export async function isAdmin(email: string) {
  if (email.toLowerCase() === OWNER_EMAIL) return true;
  const { fs, db } = await fb();
  return (await fs.getDoc(fs.doc(db, "admins", email.toLowerCase()))).exists();
}

export async function watchUser(cb: (email: string | null) => void) {
  const { authLib, auth } = await fb();
  return authLib.onAuthStateChanged(auth, (u) => cb(u?.email ?? null));
}

export async function signIn() {
  const { authLib, auth } = await fb();
  await authLib.signInWithPopup(auth, new authLib.GoogleAuthProvider());
}

export async function signOut() {
  const { authLib, auth } = await fb();
  await authLib.signOut(auth);
}

// Turns a pasted Google Drive or YouTube link into embeddable URLs.
export function parseLink(url: string): { source: "drive" | "youtube"; id: string } | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt?.[1]) return { source: "youtube", id: yt[1] };
  const drive = url.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/,
  );
  if (drive?.[1]) return { source: "drive", id: drive[1] };
  return null;
}

export function thumbUrl(url: string) {
  const p = parseLink(url);
  if (!p) return url;
  return p.source === "youtube"
    ? `https://i.ytimg.com/vi/${p.id}/hqdefault.jpg`
    : `https://drive.google.com/thumbnail?id=${p.id}&sz=w1200`;
}

export function embedUrl(url: string) {
  const p = parseLink(url);
  if (!p) return url;
  return p.source === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${p.id}?autoplay=1&rel=0`
    : `https://drive.google.com/file/d/${p.id}/preview`;
}
