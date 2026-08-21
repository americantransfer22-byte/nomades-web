// Usa la librería cargada como <script> global (window.supabase) en index.html,
// en vez de un import ESM desde CDN — más robusto y evita pantallas en blanco
// si el CDN de módulos falla.
const url = 'https://hphqqhkbzsxikivfwhkt.supabase.co'
const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaHFxaGtienN4aWtpdmZ3aGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDQxNjIsImV4cCI6MjEwMjc4MDE2Mn0.kbXy0BLdVkiOcoay9Elx0glkAEj1lzS01VbEahLtOJk'

export const supabase = window.supabase.createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
})
