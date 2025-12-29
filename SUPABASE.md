# SUPABASE INTEGRATION GUIDE

This document explains how Supabase powers the Solo Leveling experience, how to configure credentials, and how data flows through the React app.

---

## 1. Environment Variables

1. Create `solo-leveling--web-app/.env.local` (auto-loaded by Vite).
2. Add the following keys:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> Keep the anon key safe—never commit it.

---

## 2. Database Schema

The schema lives in `supabase/schema.sql` and creates four tables:

| Table     | Purpose                                                |
|-----------|--------------------------------------------------------|
| `players` | Global profile data (xp, gold, streaks, attributes).   |
| `tasks`   | Time-blocked quests + reward metadata.                 |
| `habits`  | Heatmap-backed routines stored as JSON arrays.         |
| `bosses`  | Multi-day gate/boss progress per player.               |

`schema.sql` also seeds a demo player, four tasks, two habits, and three bosses so you can test right away.

Apply the schema with either:
- Supabase SQL Editor → paste `schema.sql`.
- Supabase CLI → `supabase db push`.

---

## 3. Client & Utilities

`src/api/supabase.js` centralizes client creation and exports:

- `supabase`: shared client (null when env vars missing).
- `requireSupabaseClient(action)`: throws a helpful error if credentials are absent.
- `handleSupabaseError(action, error)`: normalizes API errors for the UI.
- `isSupabaseReady`: boolean flag used across hooks to toggle fallback UI.

---

## 4. API Modules

Each domain has a thin data-access layer under `src/api/`:

| Module          | Responsibilities                                                                                           |
|-----------------|------------------------------------------------------------------------------------------------------------|
| `tasks.js`      | Reward calculation utility + `getTasks`, `createTask`, `completeTask`.                                     |
| `habits.js`     | `getHabits` and `toggleHabitDate` (updates the heatmap JSON).                                              |
| `bosses.js`     | `getBosses` and `updateBossDay` (idempotent toggle that expands the `days` JSON as needed).                |
| `players.js`    | Fetch/update player record, adjust resources, and update attributes atomically.                            |

All modules call `requireSupabaseClient` to guard against missing configuration and log errors through `handleSupabaseError`.

---

## 5. React Hooks & Fallback Logic

Hooks under `src/hooks/` orchestrate data fetching and expose UI-friendly helpers:

| Hook            | Exposes                                                                                         |
|-----------------|-------------------------------------------------------------------------------------------------|
| `useTasks`      | `{ tasks, loading, error, createTask, completeTask, refresh }` + schedule labels & deadlines.   |
| `useHabits`     | `{ habits, toggleDate, loading, error }` with `Set` helpers for heatmap lookups.                |
| `useBosses`     | `{ bosses, toggleDay, loading, error }`, auto-enriches completion rate and unlock state.        |
| `usePlayerData` | Keeps Supabase and `PlayerContext` in sync, with helpers to update attributes/resources.        |

**Fallback UX:** Every hook checks `isSupabaseReady`. If credentials are missing (or the tables are empty), pages fall back to local demo data and show a banner explaining that live sync is disabled. This keeps the app usable even before Supabase is configured.

---

## 6. Page Integration

| Page      | Hook Usage                                                                                        | Notes                                                                 |
|-----------|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| Quests    | `useTasks` feeds `TaskCard`; local demo tasks appear when Supabase is disabled.                    | Refresh button triggers `useTasks().refresh`.                         |
| Habits    | `useHabits` powers the heatmaps; toggles hit Supabase when available, else mutate local state.     | Banner communicates sync status/errors.                               |
| Gates     | `useBosses` drives `BossCard`; player XP from context determines unlock status.                    | XP delta message guides player when gate is locked.                   |
| (Future) Rewards / Dashboard | Hooks can be wired similarly once Supabase tables are added for rewards/history. |                                                                       |

---

## 7. Typical Data Flow

1. User opens a page.
2. Corresponding hook checks `isSupabaseReady`.
   - If false: return fallback data + warning banner.
   - If true: fetch from Supabase, store in hook state, and surface errors if any.
3. Mutations (`createTask`, `toggleDate`, etc.) call the API module, optimistically update local state, and rely on Supabase’s response to stay authoritative.
4. Pages show the same UI regardless of source—only the status banners differ.

---

## 8. Troubleshooting

| Symptom                                    | Likely Cause / Fix                                                   |
|--------------------------------------------|----------------------------------------------------------------------|
| “Supabase is not configured” toast/banner  | Missing `.env` keys. Add them and restart `npm run dev`.             |
| Network error messages from hooks          | Wrong URL/key or Supabase tables not created. Re-run `schema.sql`.   |
| Data loads but mutations fail              | Ensure the service role has CRUD privileges (default anon policy works if RLS disabled). |
| Boss days don’t toggle                     | Table `bosses.days` must be JSON arrays; run the provided seed.      |

---

## 9. Going Further

- Enable Row Level Security (RLS) in Supabase and create policies keyed by `player_id` to prevent cross-player access.
- Replace fallback seeds with dynamic onboarding (e.g., create a fresh player row when a new user signs in).
- Extend `players` with streak multipliers or reward history tables to persist more of the game loop.

---

**Need help?** Open `src/api/*` or the corresponding hooks to see precise request payloads. Everything routes through those shared utilities, so new features (Rewards, Logs, etc.) can follow the same pattern.

Happy leveling! ⚔️