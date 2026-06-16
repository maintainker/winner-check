import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://txtqaxyaksffhkxhjgbz.supabase.co";
const supabaseKey = "sb_publishable_DE1OVDxycg8YtYLCtZD0Zg_6wJgziAZ";

export default createClient(supabaseUrl, supabaseKey);
