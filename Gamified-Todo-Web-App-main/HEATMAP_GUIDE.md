# GitHub-Style Heatmap Implementation Guide

## Overview
The heatmap component has been enhanced to work like GitHub's contribution graph, showing varying intensities based on task completion counts rather than just binary complete/incomplete states.

## Features

### 1. **Intensity-Based Colors**
- **5 intensity levels** (like GitHub):
  - Level 0: Empty (dark gray) - 0 tasks
  - Level 1: Light color - 1-2 tasks
  - Level 2: Medium color - 3-4 tasks
  - Level 3: Bright color - 5-6 tasks
  - Level 4: Brightest color - 7+ tasks

### 2. **Color Themes**
Four color themes available:
- **Green** (default) - Eco/health habits
- **Orange** - Fitness/energy habits
- **Purple** - Learning/mental habits
- **Blue** - Focus/productivity habits

### 3. **Real-Time Statistics**
Each heatmap displays:
- Total tasks completed
- Current streak (consecutive days)
- Active days count
- Task count per cell on hover

### 4. **Interactive Features**
- **Hover tooltip** - Shows date and task count
- **Click to toggle** - Toggle completion for past dates
- **Today indicator** - White ring highlights current day
- **Intensity legend** - Shows what each color level means

## Usage

### Basic Implementation

```jsx
import Heatmap from './components/Heatmap'
import { getTaskCountsForRange } from './utils/taskCountTracker'

function MyComponent() {
  const taskCounts = getTaskCountsForRange(84) // Last 84 days
  
  return (
    <Heatmap
      title={{ text: "My Habits", icon: "🔥" }}
      data={Object.keys(taskCounts)} // Array of dates
      taskCounts={taskCounts} // Object: { "2025-12-07": 5, ... }
      color="green"
      weeks={12}
    />
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `Object/String` | - | `{ text: "Title", icon: "🔥" }` or just a string |
| `data` | `Array<string>` | `[]` | Array of ISO date strings with activity |
| `taskCounts` | `Object` | `{}` | Date -> count mapping: `{ "2025-12-07": 3 }` |
| `color` | `String` | `"green"` | Color theme: `"green"`, `"orange"`, `"purple"`, `"blue"` |
| `weeks` | `Number` | `12` | Number of weeks to display |
| `onToggle` | `Function` | - | Callback when cell clicked: `(date) => {}` |
| `showDone` | `Boolean` | `true` | Show the legend indicator |

## Task Count Tracking

### Automatic Tracking

Task counts are automatically tracked when tasks are completed through the `PlayerContext`:

```jsx
import { usePlayer } from './context/PlayerContext'

function TaskCard({ task }) {
  const { completeTask } = usePlayer()
  
  const handleComplete = () => {
    // This automatically increments today's task count
    completeTask(task.xp, task.gold)
  }
  
  return <button onClick={handleComplete}>Complete</button>
}
```

### Manual Tracking

You can also manually track task completions:

```jsx
import { incrementTaskCount, getTodayISO } from './utils/taskCountTracker'

// Increment today's count
incrementTaskCount() // Adds 1 to today

// Increment specific date
incrementTaskCount('2025-12-07', 3) // Adds 3 to Dec 7

// Get counts for a range
const counts = getTaskCountsForRange(30) // Last 30 days
```

### Utility Functions

```javascript
// Get all task counts
const counts = getTaskCounts()

// Get count for specific date
const todayCount = getTaskCountForDate('2025-12-07')

// Get statistics
const stats = getTaskCountStats(84)
// Returns: { total, average, max, activeDays, currentStreak }

// Cleanup old data (keeps last 365 days)
cleanupOldTaskCounts(365)

// Reset all counts (use with caution!)
resetTaskCounts()
```

## Integration with Supabase

### Database Schema Enhancement

To store task counts in Supabase, you can enhance the habits table:

```sql
-- Add task_counts column to habits table
ALTER TABLE habits 
ADD COLUMN task_counts JSONB DEFAULT '{}'::JSONB;

-- Example data structure:
-- { "2025-12-07": 5, "2025-12-06": 3, "2025-12-05": 7 }
```

### API Integration

```javascript
// src/api/habits.js

export async function updateHabitTaskCounts(habitId, taskCounts) {
  const client = requireSupabaseClient('update habit task counts')
  
  const { data, error } = await client
    .from('habits')
    .update({ task_counts: taskCounts })
    .eq('id', habitId)
    .select()
    .single()
    
  if (error) throw handleSupabaseError('update task counts', error)
  return mapHabitRow(data)
}
```

## Examples

### Example 1: Simple Heatmap

```jsx
<Heatmap
  title="Daily Tasks"
  data={["2025-12-01", "2025-12-02", "2025-12-07"]}
  color="green"
/>
```

### Example 2: With Task Counts

```jsx
<Heatmap
  title={{ text: "Workout Sessions", icon: "💪" }}
  taskCounts={{
    "2025-12-07": 3,  // 3 workouts today (bright orange)
    "2025-12-06": 1,  // 1 workout yesterday (light orange)
    "2025-12-05": 5,  // 5 workouts (very bright orange)
  }}
  color="orange"
  weeks={8}
/>
```

### Example 3: All Tasks Combined

```jsx
import { getTaskCountsForRange } from './utils/taskCountTracker'

function OverviewHeatmap() {
  const allTaskCounts = getTaskCountsForRange(84)
  
  return (
    <Heatmap
      title={{ text: "All Task Completions", icon: "⚡" }}
      data={Object.keys(allTaskCounts)}
      taskCounts={allTaskCounts}
      color="purple"
      weeks={12}
    />
  )
}
```

## Customization

### Custom Color Theme

To add a new color theme, edit `src/components/Heatmap.jsx`:

```javascript
function getIntensityColor(count, baseColor = 'green') {
  const colors = {
    // ... existing colors ...
    red: [
      'bg-dark-600 border-dark-500',
      'bg-red-900/40 border-red-800/50',
      'bg-red-700/60 border-red-600/60',
      'bg-red-500/80 border-red-400/70',
      'bg-red-400 border-red-300',
    ],
  }
  // ...
}
```

### Custom Intensity Levels

Modify the level calculation:

```javascript
function getIntensityColor(count, baseColor = 'green') {
  let level = 0
  if (count === 0) level = 0
  else if (count <= 1) level = 1      // 1 task
  else if (count <= 3) level = 2      // 2-3 tasks
  else if (count <= 5) level = 3      // 4-5 tasks
  else level = 4                       // 6+ tasks
  // ...
}
```

## Best Practices

1. **Clean up old data periodically**
   ```javascript
   useEffect(() => {
     cleanupOldTaskCounts(365) // Keep 1 year of history
   }, [])
   ```

2. **Sync with Supabase**
   - Store task counts in Supabase for persistence
   - Use localStorage as a fallback/cache

3. **Performance**
   - Use `useMemo` to calculate task counts
   - Debounce rapid updates
   - Limit displayed weeks to 12-16

4. **User Experience**
   - Show loading states while fetching data
   - Display empty state when no data available
   - Provide clear tooltips and legends

## Troubleshooting

### Issue: Colors not showing
**Solution:** Check that Tailwind is generating the color classes. Add them to safelist if needed:

```javascript
// tailwind.config.js
module.exports = {
  safelist: [
    'bg-green-900/40', 'bg-green-700/60', 'bg-green-500/80', 'bg-green-400',
    'bg-orange-900/40', 'bg-orange-700/60', 'bg-orange-500/80', 'bg-orange-400',
    // ... add all intensity color variants
  ]
}
```

### Issue: Task counts not persisting
**Solution:** Check localStorage and browser console for errors. Verify `taskCountTracker.js` is imported correctly.

### Issue: Streak calculation incorrect
**Solution:** Ensure dates are in ISO format (YYYY-MM-DD) and timezone handling is consistent.

## Migration from Old System

If upgrading from the binary (completed/not completed) system:

```javascript
// Convert old data to new format
const oldData = ["2025-12-07", "2025-12-06", "2025-12-05"]
const newTaskCounts = {}
oldData.forEach(date => {
  newTaskCounts[date] = 1 // Assume 1 task per day
})

// Use with heatmap
<Heatmap taskCounts={newTaskCounts} />
```

## Future Enhancements

- [ ] Monthly/yearly view toggle
- [ ] Export heatmap as image
- [ ] Different visualization styles (bars, circles)
- [ ] Color themes based on categories
- [ ] Contribution percentage badges
- [ ] Compare multiple habits side-by-side
- [ ] Animation when adding new data points

---

**Version:** 2.0  
**Last Updated:** December 7, 2025  
**Author:** Solo Leveling Development Team
