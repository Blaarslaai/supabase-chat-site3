import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://spromglwpcotgowampza.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwcm9tZ2x3cGNvdGdvd2FtcHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExNDIwNDUsImV4cCI6MjAzNjcxODA0NX0.mmurHPdGZ4hIj_rarkuPRv6Py45Ka1fs4_x-uDhqm7w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
