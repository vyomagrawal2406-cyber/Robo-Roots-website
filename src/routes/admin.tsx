import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { Section } from "@/components/site";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/content/site";
import {
  OWNER_EMAIL,
  addMedia,
  deleteMedia,
  firebaseReady,
  isAdmin,
  listAdmins,
  listMedia,
  parseLink,
  setAdmin,
  signIn,
  signOut,
  thumbUrl,
  watchUser,
  type MediaDoc,
  type MediaKind,
} from "@/lib/media";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | RoboRoots" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const field =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring";
const btn = "rounded-full px-5 py-3 font-bold disabled:opacity-60";

function Admin() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!firebaseReady) return;
    let unsub: (() => void) | undefined;
    watchUser(async (e) => {
      setEmail(e);
      setAllowed(e ? await isAdmin(e).catch(() => false) : false);
    }).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  if (!firebaseReady)
    return (
      <Section className="max-w-xl">
        <h1 className="text-3xl text-primary">Admin</h1>
        <p className="mt-4 text-muted-foreground">
          Firebase is not connected yet. Add the VITE_FIREBASE_* settings (see FIREBASE_SETUP.md)
          and reload.
        </p>
      </Section>
    );

  if (email === undefined)
    return (
      <Section className="max-w-xl">
        <p className="text-muted-foreground">Loading...</p>
      </Section>
    );

  if (!email)
    return (
      <Section className="max-w-xl text-center">
        <h1 className="text-3xl text-primary">RoboRoots Admin</h1>
        <p className="mt-3 text-muted-foreground">
          Sign in with an approved Google account to add photos and videos to the Gallery.
        </p>
        <button
          onClick={() => signIn().catch(console.error)}
          className={`${btn} mt-6 bg-primary text-primary-foreground`}
        >
          Sign in with Google
        </button>
      </Section>
    );

  if (!allowed)
    return (
      <Section className="max-w-xl text-center">
        <h1 className="text-3xl text-primary">Not authorized</h1>
        <p className="mt-3 text-muted-foreground">
          {email} is not an admin. Ask {OWNER_EMAIL} to add you.
        </p>
        <button
          onClick={() => signOut()}
          className={`${btn} mt-6 border-2 border-primary text-primary`}
        >
          Sign out
        </button>
      </Section>
    );

  return (
    <Section className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl text-primary">Gallery Admin</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{email}</span>
          <button onClick={() => signOut()} className="font-bold text-primary underline">
            Sign out
          </button>
        </div>
      </div>
      <MediaManager />
      {email.toLowerCase() === OWNER_EMAIL && <AdminManager />}
    </Section>
  );
}

function MediaManager() {
  const [items, setItems] = useState<MediaDoc[]>([]);
  const [f, setF] = useState({
    url: "",
    cap: "",
    kind: "video" as MediaKind,
    category: "Workshop" as GalleryCategory,
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = () => listMedia().then(setItems).catch(console.error);
  useEffect(() => void refresh(), []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!parseLink(f.url))
      return setMsg(
        "That link was not recognised. Paste a Google Drive file link or a YouTube link.",
      );
    setBusy(true);
    try {
      await addMedia(f);
      setF({ ...f, url: "", cap: "" });
      setMsg("Added! It is now live on the Gallery page.");
      await refresh();
    } catch (err) {
      setMsg(`Could not save: ${(err as Error).message}`);
    }
    setBusy(false);
  };

  return (
    <>
      <form
        onSubmit={submit}
        className="mt-8 grid gap-4 rounded-2xl bg-card p-5 shadow-card sm:p-6"
      >
        <h2 className="text-xl text-primary">Add a photo or video</h2>
        <label className="grid gap-1 text-sm font-semibold">
          Google Drive or YouTube link
          <input
            required
            className={field}
            value={f.url}
            onChange={(e) => setF({ ...f, url: e.target.value })}
            placeholder="https://drive.google.com/file/d/..."
          />
        </label>
        <p className="-mt-2 text-xs text-muted-foreground">
          For Drive: right-click the file, Share, set "General access" to "Anyone with the link",
          then Copy link.
        </p>
        <label className="grid gap-1 text-sm font-semibold">
          Caption
          <input
            required
            className={field}
            value={f.cap}
            onChange={(e) => setF({ ...f, cap: e.target.value })}
            placeholder="Students testing their robot"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-semibold">
            Type
            <select
              className={field}
              value={f.kind}
              onChange={(e) => setF({ ...f, kind: e.target.value as MediaKind })}
            >
              <option value="video">Video</option>
              <option value="image">Photo</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Category
            <select
              className={field}
              value={f.category}
              onChange={(e) => setF({ ...f, category: e.target.value as GalleryCategory })}
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        {msg && <p className="text-sm font-semibold text-secondary">{msg}</p>}
        <button disabled={busy} className={`${btn} bg-accent text-accent-foreground`}>
          {busy ? "Saving..." : "Add to Gallery"}
        </button>
      </form>

      <h2 className="mt-10 text-xl text-primary">Added items ({items.length})</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((m) => (
          <li
            key={m.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <img
              src={thumbUrl(m.url)}
              alt=""
              className="h-14 w-20 shrink-0 rounded-md bg-muted object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{m.cap}</p>
              <p className="text-xs text-muted-foreground">
                {m.kind === "video" ? "Video" : "Photo"} · {m.category}
              </p>
            </div>
            <button
              aria-label="Delete"
              className="grid h-10 w-10 place-items-center text-destructive"
              onClick={async () => {
                if (!confirm(`Remove "${m.cap}" from the Gallery?`)) return;
                await deleteMedia(m.id).catch((err) => alert((err as Error).message));
                refresh();
              }}
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function AdminManager() {
  const [admins, setAdmins] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const refresh = () => listAdmins().then(setAdmins).catch(console.error);
  useEffect(() => void refresh(), []);

  return (
    <div className="mt-12 rounded-2xl border border-border p-5 sm:p-6">
      <h2 className="text-xl text-primary">Who can edit</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {OWNER_EMAIL} (owner) always has access. Add other Google accounts below.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          await setAdmin(email, true).catch((err) => alert((err as Error).message));
          setEmail("");
          refresh();
        }}
      >
        <input
          required
          type="email"
          className={field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@gmail.com"
        />
        <button className={`${btn} shrink-0 bg-primary text-primary-foreground`}>Add admin</button>
      </form>
      <ul className="mt-4 grid gap-2">
        {admins.map((a) => (
          <li
            key={a}
            className="flex items-center justify-between gap-3 rounded-lg bg-muted px-4 py-2 text-sm"
          >
            <span className="truncate">{a}</span>
            <button
              className="font-bold text-destructive"
              onClick={async () => {
                await setAdmin(a, false);
                refresh();
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
