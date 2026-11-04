// Supabase client + admin auth. Loaded lazily and only in the browser (pages are server-rendered).
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/content/site";

const url: string = import.meta.env["VITE_SUPABASE_URL"] || SUPABASE_URL;
const key: string =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  import.meta.env["VITE_SUPABASE_ANON_KEY"] ||
  SUPABASE_PUBLISHABLE_KEY;

export const supabaseReady = Boolean(url && key);

let client: Promise<SupabaseClient> | undefined;
export function sb() {
  client ??= import("@supabase/supabase-js").then(({ createClient }) => createClient(url, key));
  return client;
}

// Throws the Supabase error message so callers can show it.
export function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export async function signIn(email: string, password: string) {
  const s = await sb();
  const { error } = await s.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  await (await sb()).auth.signOut();
}

export async function watchUser(cb: (email: string | null) => void) {
  const s = await sb();
  const { data } = s.auth.onAuthStateChange((_e, session) => cb(session?.user.email ?? null));
  return () => data.subscription.unsubscribe();
}

export async function isAdmin() {
  const s = await sb();
  return Boolean(check(await s.rpc("is_admin")));
}

export async function listAdmins(): Promise<string[]> {
  const s = await sb();
  const rows = check(await s.from("admins").select("email").order("added_at"));
  return (rows ?? []).map((r: { email: string }) => r.email);
}

export async function setAdmin(email: string, admin: boolean) {
  const s = await sb();
  const e = email.trim().toLowerCase();
  check(
    admin
      ? await s.from("admins").upsert({ email: e })
      : await s.from("admins").delete().eq("email", e),
  );
}
