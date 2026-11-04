// Lessons (a video and/or slides/notes) that admins add from /admin. Shown on /learn.
import { check, sb, supabaseReady } from "@/lib/supabase";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  module: string;
  video_url: string | null;
  resource_url: string | null;
  resource_name: string | null;
  resource_path: string | null;
  created_at: string;
};
export type NewLesson = Omit<Lesson, "id" | "created_at">;

const BUCKET = "resources";
export const MAX_FILE_MB = 50;
export const ACCEPT_FILES = ".pdf,.ppt,.pptx,.doc,.docx";

export async function listLessons(): Promise<Lesson[]> {
  if (!supabaseReady) return [];
  const s = await sb();
  return check(await s.from("lessons").select("*").order("created_at", { ascending: true })) ?? [];
}

export async function addLesson(l: NewLesson) {
  const s = await sb();
  check(await s.from("lessons").insert(l));
}

export async function updateLesson(id: string, l: Partial<NewLesson>) {
  const s = await sb();
  check(await s.from("lessons").update(l).eq("id", id));
}

export async function deleteLesson(l: Lesson) {
  const s = await sb();
  check(await s.from("lessons").delete().eq("id", l.id));
  if (l.resource_path) await removeFile(l.resource_path);
}

// Uploads a PDF/PPT to Supabase Storage and returns its public URL and storage path.
export async function uploadFile(file: File) {
  if (file.size > MAX_FILE_MB * 1024 * 1024)
    throw new Error(`File is larger than ${MAX_FILE_MB} MB. Try exporting a smaller PDF.`);
  const s = await sb();
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${Date.now()}-${safe}`;
  check(await s.storage.from(BUCKET).upload(path, file, { contentType: file.type }));
  const { data } = s.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function removeFile(path: string) {
  const s = await sb();
  await s.storage.from(BUCKET).remove([path]);
}

// How to show a slides/notes link inside the page. Returns null if it can only be opened.
export function resourceEmbed(url: string): string | null {
  const g = url.match(/docs\.google\.com\/(presentation|document|spreadsheets)\/d\/([\w-]+)/);
  if (g)
    return `https://docs.google.com/${g[1]}/d/${g[2]}/${g[1] === "presentation" ? "embed" : "preview"}`;
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]{20,})/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  const path = url.split(/[?#]/)[0]!.toLowerCase();
  if (path.endsWith(".pdf")) return url;
  if (/\.(pptx?|docx?)$/.test(path))
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  return null;
}

export function resourceLabel(url: string, name?: string | null) {
  const n = (name || url.split(/[?#]/)[0]!).toLowerCase();
  if (n.endsWith(".pdf")) return "PDF";
  if (/\.pptx?$/.test(n) || n.includes("/presentation/")) return "Slides";
  if (/\.docx?$/.test(n) || n.includes("/document/")) return "Notes";
  return "Resource";
}
