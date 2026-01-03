import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const missingEnvMessage =
  "Supabase credentials are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable database features.";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(missingEnvMessage);
}

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const isSupabaseReady = Boolean(supabase);

/**
 * Ensures a usable Supabase client is available before running a data action.
 * @param {string} action Description of the action for clearer errors
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
function requireSupabaseClient(action = "use Supabase features") {
  if (!supabase) {
    throw new Error(
      `Cannot ${action} because Supabase is not configured. ${missingEnvMessage}`,
    );
  }
  return supabase;
}

/**
 * Normalizes Supabase errors so UI surfaces friendlier messages.
 * @param {string} action Description of what failed
 * @param {object} error Supabase error object
 */
function handleSupabaseError(action, error) {
  console.error(`[Supabase] ${action} failed`, error);
  return new Error(error?.message || `Unable to ${action}. Please try again.`);
}

export {
  supabase,
  isSupabaseReady,
  requireSupabaseClient,
  handleSupabaseError,
};
