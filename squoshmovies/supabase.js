import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./constants.js";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export default supabaseClient;

