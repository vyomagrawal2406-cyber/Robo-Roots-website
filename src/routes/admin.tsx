import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { Section } from "@/components/site";
import { GALLERY_CATEGORIES, LESSON_MODULES, type GalleryCategory } from "@/content/site";
import { addMedia, deleteMedia, listMedia, parseLink, thumbUrl } from "@/lib/media";
import type { MediaDoc, MediaKind } from "@/lib/media";
import {
  ACCEPT_FILES,
  MAX_FILE_MB,
  addLesson,
  deleteLesson,
  listLessons,
  removeFile,
  resourceLabel,
  updateLesson,
  uploadFile,
  type Lesson,
} from "@/lib/lessons";
import {
  isAdmin,
  listAdmins,
  setAdmin,
  signIn,
  signOut,
  supabaseReady,
  watchUser,
} from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | RoboRoots" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const field =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring";
const btn = "rounded-full px-5 py-3 font-bold disabled:opacity-60";
const label = "grid gap-1 text-sm font-semibold";
const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));

function Admin() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!supabaseReady) return;
    let unsub: (() => void) | undefined;
    watchUser(async (e) => {
      setEmail(e);
      setAllowed(undefined);
      setAllowed(e ? await isAdmin().catch(() => false) : false);
    }).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  if (!supabaseReady)
    return (
      <Section className="max-w-xl">
        <h1 className="text-3xl text-primary">Admin</h1>
        <p className="mt-4 text-muted-foreground">
          Supabase is not connected yet. Add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in
          src/content/site.ts (see SUPABASE_SETUP.md) and reload.
        </p>
      </Section>
    );

  if (email === undefined || (email && allowed === undefined))
    return (
      <Section className="max-w-xl">
        <p className="text-muted-foreground">Loading...</p>
      </Section>
    );

  if (!email) return <Login />;

  if (!allowed)
    return (
      <Section className="max-w-xl text-center">
        <h1 className="text-3xl text-primary">Not authorized</h1>
        <p className="mt-3 text-muted-foreground">
          {email} is signed in but is not on the admin list. Ask an existing admin to add you.
        </p>
        <button
          onClick={() => signOut()}
          className={`${btn} mt-6 border-2 border-primary text-primary`}
        >
          Sign out
        </button>
      </Section>
    );

  return <Dashboard email={email} />;
}

function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await signIn(f.email, f.password);
    } catch (err) {
      const m = errText(err);
      setMsg(m.includes("Invalid login") ? "Wrong email or password." : m);
    }
    setBusy(false);
  };

  return (
    <Section className="max-w-md">
      <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-card p-6 shadow-card">
        <h1 className="text-3xl text-primary">RoboRoots Admin</h1>
        <p className="-mt-2 text-sm text-muted-foreground">
          Sign in to add lessons, slides and gallery items.
        </p>
        <label className={label}>
          Email
          <input
            required
            type="email"
            autoComplete="username"
            className={field}
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
        </label>
        <label className={label}>
          Password
          <input
            required
            type="password"
            autoComplete="current-password"
            className={field}
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
          />
        </label>
        {msg && <p className="text-sm font-semibold text-destructive">{msg}</p>}
        <button disabled={busy} className={`${btn} bg-primary text-primary-foreground`}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </Section>
  );
}

const TABS = ["Lessons", "Gallery", "Admins"] as const;

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Lessons");
  return (
    <Section className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl text-primary">Admin</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="truncate text-muted-foreground">{email}</span>
          <button onClick={() => signOut()} className="font-bold text-primary underline">
            Sign out
          </button>
        </div>
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Lessons" && <LessonManager />}
      {tab === "Gallery" && <MediaManager />}
      {tab === "Admins" && <AdminManager me={email} />}
    </Section>
  );
}

type ResMode = "none" | "upload" | "link";
const emptyLesson = {
  title: "",
  description: "",
  module: LESSON_MODULES[0]!,
  video_url: "",
  link: "",
};

function LessonManager() {
  const [items, setItems] = useState<Lesson[]>([]);
  const [f, setF] = useState(emptyLesson);
  const [mode, setMode] = useState<ResMode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = () =>
    listLessons()
      .then(setItems)
      .catch((e) => setMsg(errText(e)));
  useEffect(() => void refresh(), []);

  const reset = () => {
    setF(emptyLesson);
    setFile(null);
    setMode("upload");
    setEditing(null);
  };

  const startEdit = (l: Lesson) => {
    setEditing(l);
    setF({
      title: l.title,
      description: l.description,
      module: l.module,
      video_url: l.video_url ?? "",
      link: l.resource_path ? "" : (l.resource_url ?? ""),
    });
    setFile(null);
    setMode(l.resource_path ? "upload" : l.resource_url ? "link" : "none");
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    const video = f.video_url.trim();
    if (video && !parseLink(video))
      return setMsg("That video link was not recognised. Paste a YouTube or Google Drive link.");
    const keepFile = editing?.resource_path && mode === "upload" && !file;
    if (mode === "upload" && !file && !keepFile) return setMsg("Choose a file to upload.");
    if (mode === "link" && !f.link.trim()) return setMsg("Paste the slides/notes link.");
    if (!video && mode === "none") return setMsg("Add a video link, a file, or both.");

    setBusy(true);
    try {
      let resource = {
        resource_url: editing?.resource_url ?? null,
        resource_name: editing?.resource_name ?? null,
        resource_path: editing?.resource_path ?? null,
      };
      if (mode === "none")
        resource = { resource_url: null, resource_name: null, resource_path: null };
      if (mode === "link")
        resource = { resource_url: f.link.trim(), resource_name: null, resource_path: null };
      if (mode === "upload" && file) {
        setMsg("Uploading file...");
        const up = await uploadFile(file);
        resource = { resource_url: up.url, resource_name: file.name, resource_path: up.path };
      }
      const row = {
        title: f.title.trim(),
        description: f.description.trim(),
        module: f.module,
        video_url: video || null,
        ...resource,
      };
      if (editing) {
        await updateLesson(editing.id, row);
        if (editing.resource_path && editing.resource_path !== row.resource_path)
          await removeFile(editing.resource_path);
      } else {
        await addLesson(row);
      }
      setMsg(
        editing ? "Saved! The Learn page is updated." : "Added! It is now live on the Learn page.",
      );
      reset();
      await refresh();
    } catch (err) {
      setMsg(`Could not save: ${errText(err)}`);
    }
    setBusy(false);
  };

  return (
    <>
      <form
        onSubmit={submit}
        className="mt-6 grid gap-4 rounded-2xl bg-card p-5 shadow-card sm:p-6"
      >
        <h2 className="text-xl text-primary">{editing ? "Edit lesson" : "Add a lesson"}</h2>
        <label className={label}>
          Title
          <input
            required
            className={field}
            value={f.title}
            onChange={(e) => setF({ ...f, title: e.target.value })}
            placeholder="Lesson 1: What is a robot?"
          />
        </label>
        <label className={label}>
          Module
          <select
            className={field}
            value={f.module}
            onChange={(e) => setF({ ...f, module: e.target.value })}
          >
            {LESSON_MODULES.map((m, k) => (
              <option key={m} value={m}>
                {k < LESSON_MODULES.length - 1 ? `${k + 1}. ${m}` : m}
              </option>
            ))}
          </select>
        </label>
        <label className={label}>
          Short description (optional)
          <textarea
            rows={3}
            className={field}
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
          />
        </label>
        <label className={label}>
          YouTube video link
          <input
            className={field}
            value={f.video_url}
            onChange={(e) => setF({ ...f, video_url: e.target.value })}
            placeholder="https://youtu.be/..."
          />
        </label>
        <p className="-mt-2 text-xs text-muted-foreground">
          Upload the video to YouTube as "Unlisted" (or Public), then paste its link here.
        </p>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold">Slides / PDF / notes</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["upload", "Upload a file"],
                ["link", "Paste a link"],
                ["none", "None"],
              ] as const
            ).map(([v, t]) => (
              <button
                type="button"
                key={v}
                onClick={() => setMode(v)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${mode === v ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}
              >
                {t}
              </button>
            ))}
          </div>
          {mode === "upload" && (
            <>
              <input
                type="file"
                accept={ACCEPT_FILES}
                className={field}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                PDF, PowerPoint or Word, up to {MAX_FILE_MB} MB. PDFs display best on phones, so
                exporting slides as PDF is recommended.
                {editing?.resource_path && !file && ` Current file: ${editing.resource_name}.`}
              </p>
            </>
          )}
          {mode === "link" && (
            <>
              <input
                className={field}
                value={f.link}
                onChange={(e) => setF({ ...f, link: e.target.value })}
                placeholder="https://docs.google.com/presentation/d/..."
              />
              <p className="text-xs text-muted-foreground">
                Google Slides, Google Drive or any public link. Set sharing to "Anyone with the link
                can view".
              </p>
            </>
          )}
        </fieldset>

        {msg && <p className="text-sm font-semibold text-secondary">{msg}</p>}
        <div className="flex flex-wrap gap-3">
          <button disabled={busy} className={`${btn} bg-accent text-accent-foreground`}>
            {busy ? "Saving..." : editing ? "Save changes" : "Add lesson"}
          </button>
          {editing && (
            <button type="button" onClick={reset} className={`${btn} border-2 border-border`}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 flex items-center justify-between gap-3">
        <h2 className="text-xl text-primary">Lessons ({items.length})</h2>
        <Link to="/learn" className="text-sm font-bold text-primary underline">
          View Learn page
        </Link>
      </div>
      {LESSON_MODULES.map((m) => {
        const group = items.filter((l) => l.module === m);
        if (!group.length) return null;
        return (
          <div key={m} className="mt-5">
            <p className="eyebrow">{m}</p>
            <ul className="mt-2 grid gap-3">
              {group.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  {l.video_url ? (
                    <img
                      src={thumbUrl(l.video_url)}
                      alt=""
                      className="h-14 w-20 shrink-0 rounded-md bg-muted object-cover"
                    />
                  ) : (
                    <span className="grid h-14 w-20 shrink-0 place-items-center rounded-md bg-muted text-primary">
                      <FileText />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{l.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {[
                        l.video_url && "Video",
                        l.resource_url && resourceLabel(l.resource_url, l.resource_name),
                      ]
                        .filter(Boolean)
                        .join(" + ")}
                    </p>
                  </div>
                  <button
                    aria-label="Edit"
                    className="grid h-10 w-10 place-items-center text-primary"
                    onClick={() => startEdit(l)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    aria-label="Delete"
                    className="grid h-10 w-10 place-items-center text-destructive"
                    onClick={async () => {
                      if (!confirm(`Delete "${l.title}"? This also removes its uploaded file.`))
                        return;
                      await deleteLesson(l).catch((err) => alert(errText(err)));
                      if (editing?.id === l.id) reset();
                      refresh();
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
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
  const refresh = () =>
    listMedia()
      .then(setItems)
      .catch((e) => setMsg(errText(e)));
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
      setMsg(`Could not save: ${errText(err)}`);
    }
    setBusy(false);
  };

  return (
    <>
      <form
        onSubmit={submit}
        className="mt-6 grid gap-4 rounded-2xl bg-card p-5 shadow-card sm:p-6"
      >
        <h2 className="text-xl text-primary">Add a photo or video to the Gallery</h2>
        <label className={label}>
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
        <label className={label}>
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
          <label className={label}>
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
          <label className={label}>
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
                await deleteMedia(m.id).catch((err) => alert(errText(err)));
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

function AdminManager({ me }: { me: string }) {
  const [admins, setAdmins] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const refresh = () => listAdmins().then(setAdmins).catch(console.error);
  useEffect(() => void refresh(), []);

  return (
    <div className="mt-6 rounded-2xl border border-border p-5 sm:p-6">
      <h2 className="text-xl text-primary">Who can edit</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        To add someone: first create their login in Supabase (Authentication, Users, Add user), then
        add the same email here.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          await setAdmin(email, true).catch((err) => alert(errText(err)));
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
          placeholder="name@example.com"
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
            {a === me.toLowerCase() ? (
              <span className="text-xs text-muted-foreground">You</span>
            ) : (
              <button
                className="font-bold text-destructive"
                onClick={async () => {
                  if (!confirm(`Remove ${a} as an admin?`)) return;
                  await setAdmin(a, false).catch((err) => alert(errText(err)));
                  refresh();
                }}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
