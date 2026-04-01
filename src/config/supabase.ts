import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Public client — respects RLS policies
export const supabasePublic = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Admin client — bypasses RLS for admin operations
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
