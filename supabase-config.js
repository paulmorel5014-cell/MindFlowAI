// =============================================
// SUPABASE CONFIG — Cut & Dry Barber Shop
// =============================================
// 1. Créez un projet sur https://supabase.com
// 2. Allez dans Settings > API
// 3. Copiez votre Project URL et votre anon public key ci-dessous
// 4. Exécutez le fichier migrations/001_bookings.sql dans l'éditeur SQL Supabase

const SUPABASE_URL  = 'VOTRE_SUPABASE_URL';   // ex: https://xyzxyz.supabase.co
const SUPABASE_ANON = 'VOTRE_ANON_KEY';        // clé publique (anon)

// Ne pas modifier en dessous
window.__supabaseClient =
  (typeof supabase !== 'undefined' && SUPABASE_URL !== 'VOTRE_SUPABASE_URL')
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
    : null;
