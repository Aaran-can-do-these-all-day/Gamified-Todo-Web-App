import { useMemo } from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  Power,
  Flame,
  Gift,
  AlertTriangle,
  CheckCircle,
  Target,
  Plus,
  MessageCircle,
} from "lucide-react";

const DAILY_DIRECTIVES = [
  "Complete all tasks before 6 PM.",
  "Do 50 pushups immediately.",
  "Read 10 pages of a book.",
  "Drink 2 liters of water today.",
  "No social media for 2 hours.",
  "Meditate for 10 minutes.",
  "Write down 3 goals for tomorrow.",
  "Clean your workspace.",
];

function SystemPanel() {
  const { player, streakMultiplier } = usePlayer();

  const dailyDirective = useMemo(() => {
    return DAILY_DIRECTIVES[
      Math.floor(Math.random() * DAILY_DIRECTIVES.length)
    ];
  }, []);

  const remainingQuests = [
    { icon: "📚", name: "Study Programming" },
    { icon: "💪", name: "Workout" },
    { icon: "💻", name: "Learn JavaScript" },
    { icon: "📖", name: "Read Atomic Habits" },
  ];

  return (
    <div className="bg-dark-800/80 rounded-lg border border-white/10 h-full flex flex-col max-h-[750px]">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-end mb-4">
          <Power className="w-5 h-5 text-gray-400" />
        </div>

        <div className="bg-dark-700/60 rounded-lg p-4 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-dark-600 flex items-center justify-center">
              <span className="text-xs">⚙️</span>
            </div>
            <span className="text-white font-medium">The System</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1 text-yellow-400 text-sm mb-1">
                <Flame className="w-3 h-3" />
                <span className="font-medium">STREAK STATUS</span>
                <Flame className="w-3 h-3" />
              </div>
              <p className="text-sm text-gray-300">
                Streak:{" "}
                <span className="text-cyan-400 font-bold">
                  {player.streak} Days
                </span>
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-red-400 text-sm mb-1">
                <Gift className="w-3 h-3" />
                <span className="font-medium">SYSTEM GIFT</span>
                <Gift className="w-3 h-3" />
              </div>
              <p className="text-sm text-green-400">
                {streakMultiplier ? streakMultiplier.toFixed(1) : "1.0"}x Boost
                Activated
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" /> Logged-In
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-yellow-400 text-sm mb-1">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-medium">SYSTEM WARNING</span>
                <AlertTriangle className="w-3 h-3" />
              </div>
              <p className="text-sm text-yellow-400">
                Your Quest is Not Yet Complete!
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-purple-400 text-sm mb-1">
                <Target className="w-3 h-3" />
                <span className="font-medium">DAILY DIRECTIVE</span>
                <Target className="w-3 h-3" />
              </div>
              <p className="text-sm text-purple-300">{dailyDirective}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 italic mb-3">
          Your path is still uncertain. The System urges you to continue...
        </p>

        <div className="text-sm text-gray-400 mb-1">―――――――――</div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-400">■</span>
            <span className="text-gray-400">Progress:</span>
            <span className="text-white">[{player.tasksCompletedToday}/4]</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-purple-400">■</span>
            <span className="text-gray-400">Remaining Quests:</span>
          </div>
          <ul className="ml-4 space-y-0.5">
            {remainingQuests.map((quest, i) => (
              <li
                key={i}
                className="text-sm text-gray-300 flex items-center gap-1"
              >
                <span className="text-gray-500">📌</span>
                <span>{quest.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-gray-400 mb-2">―――――――――</div>

        <div className="mb-3">
          <div className="flex items-center gap-1 text-sm text-red-400 mb-1">
            <Target className="w-3 h-3" />
            <span>A new challenge awaits!</span>
            <Target className="w-3 h-3" />
          </div>
          <p className="text-sm">
            <span className="text-gray-400">Next Gate unlocks at:</span>{" "}
            <span className="text-cyan-400">
              {player.nextBossXp.toLocaleString()} XP
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-400">XP Needed:</span>{" "}
            <span className="text-red-400">
              {Math.max(0, player.nextBossXp - player.xp).toLocaleString()} XP
            </span>
          </p>
        </div>

        <p className="text-sm text-gray-500 italic">
          The System awaits your next move...
        </p>

        <div className="mt-4 pt-4 border-t border-white/10">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            Join the Hunter Guild (Discord)
          </a>
        </div>
      </div>

      <button className="w-full py-3 border-t border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        New page
      </button>
    </div>
  );
}

export default SystemPanel;
