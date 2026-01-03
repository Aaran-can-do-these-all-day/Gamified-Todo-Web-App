# Solo Leveling - Gamified Productivity System

A gamified productivity app inspired by the "Solo Leveling" anime/manhwa that turns your daily life into an RPG adventure.

## Overview

This app transforms productivity into a game where you:
- Earn XP and Gold by completing tasks and habits
- Level up your character and unlock ranks
- Fight bosses through multi-day challenges
- Track habits with visual heatmaps
- Spend earned gold on real-world rewards

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts (Radar charts)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.jsx       # Main layout with navigation
│   ├── PlayerCard.jsx   # Player profile card
│   ├── RadarChart.jsx   # Statistics radar chart
│   ├── SystemPanel.jsx  # System messages and status
│   ├── TaskCard.jsx     # Quest/task cards
│   ├── Heatmap.jsx      # Habit tracking heatmap
│   ├── PomodoroTimer.jsx # Pomodoro timer
│   ├── BossCard.jsx     # Boss challenge cards
│   ├── RewardCard.jsx   # Reward claim cards
│   └── HabitGoalCard.jsx # Habit goal tracking
├── pages/               # Page components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Quests.jsx       # Task management
│   ├── Habits.jsx       # Habit tracking
│   ├── Gates.jsx        # Boss challenges
│   ├── Awakening.jsx    # Vision/Anti-Vision
│   └── Rewards.jsx      # Reward center
├── context/
│   └── PlayerContext.jsx # Global player state
├── App.jsx              # Route configuration
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Features

### Dashboard
- Player profile with level, rank, XP progress
- Statistics radar chart (FIT, SOC, INT, DIS, FOC, FIN)
- System panel with streak status, warnings, quest progress

### Quests
- Task cards with difficulty levels (Easy, Normal, Hard, S-Rank)
- Time blocking with start/end times
- XP and Gold rewards
- Pomodoro timer for focused work

### Habits
- GitHub-style heatmap tracking
- Multiple habit categories with color coding
- Habit goals with XP rewards/penalties
- Streak tracking

### Gates (Bosses)
- Multi-day boss challenges
- Different rank gates (E, D, C, B, A, S)
- System messages with story elements
- Progress tracking per boss

### Awakening
- Anti-Vision: Visualize consequences of inaction
- Vision: Define your ideal future
- Action Plan: 1-1-1 Rule for daily actions

### Rewards
- Spend gold on real-world rewards
- Task log history
- Claimed rewards tracking

## Game Mechanics

### XP & Leveling
- Level = floor(sqrt(xp / 100)) + 1
- XP for next level = level^2 * 100

### Ranks
- E-Rank Hunter (Level 1+)
- D-Rank Hunter (Level 5+)
- C-Rank Hunter (Level 10+)
- B-Rank Hunter (Level 20+)
- A-Rank Hunter (Level 35+)
- S-Rank Hunter (Level 50+)
- National Level (Level 75+)
- Shadow Monarch (Level 100+)

### Task Rewards
- Difficulty multipliers: Easy=1, Normal=1.5, Hard=2, S-Rank=3
- XP = round((duration_minutes / 30) * multiplier * 100)
- Gold = round((duration_minutes / 30) * multiplier * 20)

## Running the App

```bash
npm install
npm run dev
```

The app runs on port 5000.

## Future Enhancements

- Supabase database integration for persistence
- User authentication
- Mobile app version (Flutter)
- Social features / Discord integration
- Streak multipliers
- More boss challenges

## Design Inspiration

Based on the "Solo Leveling" manhwa aesthetic with:
- Dark theme with purple/magenta accents
- Neon glow effects
- Japanese text accents
- Gaming UI elements
