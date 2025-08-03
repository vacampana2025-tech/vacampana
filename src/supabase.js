import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jdvjlbrwbzywigoyiefm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdmpsYnJ3Ynp5d2lnb3lpZWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTIzMzEsImV4cCI6MjA2OTU4ODMzMX0.0QLSrKbHj-l4l3FUOxjmhYjdtbGNKQfairi1a3fEdZM';
export const supabase = createClient(supabaseUrl, supabaseKey);
