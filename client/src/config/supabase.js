import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nojjikajrrteniuupvap.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vamppa2FqcnJ0ZW5pdXVwdmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTA1NTUsImV4cCI6MjA1NjMyNjU1NX0.VghlkrUIHrcWyx4ABuEJ8xEGcjORzRHum8CRF4gAZGg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
