import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const SUPABASE_URL = ""https://yhqrwaeidcsqpcimodmf.supabase.co"";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_GpLtJXUmLlejptThXKz5jg_3_SyqRDo";
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
