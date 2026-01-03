import { useMemo, useState } from "react";
import { Flame, Sparkles, Shuffle, Plus, BellRing, Activity } from "lucide-react";
import { useHabits, todayISO } from "../stores/habitStore.jsx";
import { useQuests } from "../stores/questStore.jsx";
import { linkHabitToQuest } from "../utils/habitQuestLinker";

const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch (err) {
    return "—";
  }
};

const makeDemoHabit = (index = 0) => {
  const names = ["Deep Work", "Workout", "Journal", "Learn" ];
  const categories = ["Discipline", "Health", "Mindfulness", "Learning"];
  const picked = index % names.length;
  return {
    name: `${names[picked]} ${index + 1}`,
    category: categories[picked] || "General",
    icon: "🔥",
    startDate: todayISO(),
    frequency: "daily",
    rewardXP: 12 + index * 2,
    streak: Math.max(0, (index * 2) % 6),
    streakMultiplier: 1 + (index % 3) * 0.25,
    tags: ["demo", names[picked].toLowerCase()],
  };
};

function HabitQuestDemo() {
  const { habits, addHabit } = useHabits();
  const { quests, addQuest } = useQuests();
  const [events, setEvents] = useState([]);

  const handleAddHabit = () => {
    addHabit(makeDemoHabit(habits.length));
  };

  const triggerLink = (habit) => {
    const result = linkHabitToQuest(habit, {
      missedCountLast7: Math.floor(Math.random() * 4),
      now: new Date(),
    });

    if (result.event) {
      setEvents((prev) => [result.event, ...prev].slice(0, 12));
    }

    if (result.quest) {
      addQuest(result.quest);
    }
  };

  const recentQuests = useMemo(() => quests.slice(0, 5), [quests]);

  return (
    <div className="mt-12 max-w-[95%] mx-auto rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Local Demo</p>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Habit → Quest Linker
          </h2>
          <p className="text-sm text-white/60">Pure client-side demo using habit/quest stores and unpredictability engine.</p>
        </div>
        <button
          onClick={handleAddHabit}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus className="w-4 h-4" /> Add demo habit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 space-y-3">
          {habits.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/15 bg-black/30 px-4 py-6 text-center text-white/70">
              No demo habits yet. Use "Add demo habit" to seed one.
            </div>
          )}
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg">
                  {habit.icon || "🔥"}
                </div>
                <div>
                  <p className="text-white font-semibold">{habit.name}</p>
                  <p className="text-xs text-white/50">
                    {habit.category || "General"} • Streak {habit.streak || 0} • Mult {habit.streakMultiplier || 1}x
                  </p>
                </div>
              </div>
              <button
                onClick={() => triggerLink(habit)}
                className="inline-flex items-center gap-2 rounded-lg border border-purple-400/40 bg-purple-500/15 px-3 py-2 text-sm font-medium text-white hover:bg-purple-500/25"
              >
                <Shuffle className="w-4 h-4" /> Trigger link
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center gap-2 text-white mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold">Recent quests (local)</span>
            </div>
            <div className="space-y-2">
              {recentQuests.length === 0 ? (
                <p className="text-xs text-white/50">No quests yet.</p>
              ) : (
                recentQuests.map((quest) => (
                  <div key={quest.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <p className="text-sm text-white font-semibold">{quest.title}</p>
                    <p className="text-xs text-white/60">{quest.category || "General"} • {quest.difficulty || "Normal"}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center gap-2 text-white mb-2">
              <BellRing className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold">Event feed</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {events.length === 0 ? (
                <p className="text-xs text-white/50">No events yet.</p>
              ) : (
                events.map((evt) => (
                  <div key={evt.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="uppercase tracking-wide text-white/50">{evt.type}</span>
                      <span>{formatTime(evt.timestamp)}</span>
                    </div>
                    <p className="text-sm text-white mt-1">{evt.message}</p>
                    {evt.reward && (
                      <p className="text-xs text-amber-300 mt-1">Reward: {evt.reward.label || "+XP"}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-white/40 flex items-center gap-2">
        <Activity className="w-3 h-3" />
        <span>Local-only demo; does not touch Supabase data.</span>
      </div>
    </div>
  );
}

export default HabitQuestDemo;
