// Photos and videos that admins add from /admin. Stored in Supabase (table "media")
// so they show up on the Gallery page without editing code.
import type { GalleryCategory } from "@/content/site";
import { check, sb, supabaseReady } from "@/lib/supabase";

export type MediaKind = "image" | "video";
export type MediaDoc = {
  id: string;
  kind: MediaKind;
  url: string;
  cap: string;
  category: GalleryCategory;
  created_at: string;
};

export async function listMedia(): Promise<MediaDoc[]> {
  if (!supabaseReady) return [];
  const s = await sb();
  return check(await s.from("media").select("*").order("created_at", { ascending: false })) ?? [];
}

export async function addMedia(m: Omit<MediaDoc, "id" | "created_at">) {
  const s = await sb();
  check(await s.from("media").insert(m));
}

export async function deleteMedia(id: string) {
  const s = await sb();
  check(await s.from("media").delete().eq("id", id));
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
