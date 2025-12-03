-- Solo Leveling Supabase schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players hold the primary progression stats
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT DEFAULT 'Rising from the Ashes',
  xp INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  tasks_completed_today INTEGER NOT NULL DEFAULT 0,
  tasks_remaining INTEGER NOT NULL DEFAULT 0,
  attributes JSONB NOT NULL DEFAULT '{}'::JSONB,
  next_boss_xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks table with XP / Gold rewards
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Normal',
  icon TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  gold_reward INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_player ON tasks(player_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(player_id, completed);

-- Habits with heatmap data
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT,
  color TEXT DEFAULT 'green',
  xp_per_day INTEGER NOT NULL DEFAULT 0,
  gold_per_day INTEGER NOT NULL DEFAULT 0,
  heatmap JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_player ON habits(player_id);

-- Boss gates with multi-day progress tracking
CREATE TABLE IF NOT EXISTS bosses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rank TEXT NOT NULL,
  xp_required INTEGER NOT NULL DEFAULT 0,
  reward_gold INTEGER NOT NULL DEFAULT 0,
  reward_item TEXT,
  days JSONB NOT NULL DEFAULT '[]'::JSONB,
  losses INTEGER NOT NULL DEFAULT 0,
  system_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bosses_player ON bosses(player_id);
CREATE INDEX IF NOT EXISTS idx_bosses_xp_required ON bosses(player_id, xp_required);

-- Seed data ---------------------------------------------------------------

INSERT INTO players (
  id, name, title, xp, gold, streak, tasks_completed_today, tasks_remaining,
  attributes, next_boss_xp
) VALUES (
  '11111111-2222-3333-4444-555555555555',
  'Demo Player',
  'Shadow in Training',
  4500,
  820,
  5,
  3,
  2,
  '{
    "fit": 6,
    "soc": 5,
    "int": 7,
    "dis": 4,
    "foc": 6,
    "fin": 3
  }',
  6000
) ON CONFLICT (id) DO NOTHING;

-- Tasks for the demo player
INSERT INTO tasks (
  id, player_id, title, difficulty, icon, start_time, end_time,
  xp_reward, gold_reward, completed
) VALUES
  (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeee1',
    '11111111-2222-3333-4444-555555555555',
    'Study Programming',
    'Normal',
    '</>',
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '2 hours',
    300,
    60,
    TRUE
  ),
  (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeee2',
    '11111111-2222-3333-4444-555555555555',
    'Morning Workout',
    'Easy',
    '💪',
    NOW() - INTERVAL '8 hours',
    NOW() - INTERVAL '7 hours',
    150,
    30,
    TRUE
  ),
  (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeee3',
    '11111111-2222-3333-4444-555555555555',
    'Deep Work Sprint',
    'Hard',
    '💻',
    NOW() + INTERVAL '1 hour',
    NOW() + INTERVAL '3 hours',
    400,
    80,
    FALSE
  ),
  (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeee4',
    '11111111-2222-3333-4444-555555555555',
    'Read Atomic Habits',
    'Easy',
    '📖',
    NOW() + INTERVAL '4 hours',
    NOW() + INTERVAL '5 hours',
    120,
    24,
    FALSE
  )
ON CONFLICT (id) DO NOTHING;

-- Habits
INSERT INTO habits (
  id, player_id, title, icon, color, xp_per_day, gold_per_day, heatmap
) VALUES
  (
    'bbbbbbbb-cccc-dddd-eeee-fffffffffff1',
    '11111111-2222-3333-4444-555555555555',
    'Touch Grass',
    '🌱',
    'green',
    30,
    10,
    '["2025-05-05","2025-05-06","2025-05-08","2025-05-09"]'
  ),
  (
    'bbbbbbbb-cccc-dddd-eeee-fffffffffff2',
    '11111111-2222-3333-4444-555555555555',
    'Workout',
    '💪',
    'orange',
    50,
    15,
    '["2025-05-03","2025-05-05","2025-05-07","2025-05-09"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Boss gates
INSERT INTO bosses (
  id, player_id, name, rank, xp_required, reward_gold, reward_item, days, losses, system_message
) VALUES
  (
    'cccccccc-dddd-eeee-ffff-000000000001',
    '11111111-2222-3333-4444-555555555555',
    'The Goblin King',
    'E-Rank',
    500,
    100,
    'Rusty Sword',
    '[{"dayNumber":1,"completed":true},{"dayNumber":2,"completed":false}]',
    0,
    'Complete two 3-hour focus blocks to break his morale.'
  ),
  (
    'cccccccc-dddd-eeee-ffff-000000000002',
    '11111111-2222-3333-4444-555555555555',
    'Lycan Alpha',
    'D-Rank',
    1500,
    250,
    'Silver Claws',
    '[{"dayNumber":1,"completed":true},{"dayNumber":2,"completed":true},{"dayNumber":3,"completed":false},{"dayNumber":4,"completed":false}]',
    1,
    'Maintain 4 hours of deep work for 4 consecutive days to flush him out.'
  ),
  (
    'cccccccc-dddd-eeee-ffff-000000000003',
    '11111111-2222-3333-4444-555555555555',
    'Shadow Monarch',
    'S-Rank',
    10000,
    1000,
    'Shadow Extraction',
    '[{"dayNumber":1,"completed":false},{"dayNumber":2,"completed":false},{"dayNumber":3,"completed":false},{"dayNumber":4,"completed":false},{"dayNumber":5,"completed":false},{"dayNumber":6,"completed":false},{"dayNumber":7,"completed":false}]',
    0,
    'Only a true monarch of discipline may extract his own shadows.'
  )
ON CONFLICT (id) DO NOTHING;
