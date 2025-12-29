import { useMemo, useRef, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import DailyBriefingModal from "./DailyBriefingModal";
import useScrollIndicator from "../hooks/useScrollIndicator";
import ScrollIndicator from "./ScrollIndicator";
import useVisions from "../hooks/useVisions";
import useActionPlan from "../hooks/useActionPlan";
import {
  getAntiProcrastinationWarning,
  getTodayMotivation,
  generateQuests,
  getTodayAlignmentHistory,
  calculateAlignmentScore,
  generateAlignmentSummary,
} from "../utils/motivationEngine";
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
  const { player, streakMultiplier, activateSystem, deactivateSystem } = usePlayer();
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const { visionAnswers, antiVisionAnswers } = useVisions();
  const { actionPlan, updateActionPlan } = useActionPlan();

  const dailyDirective = useMemo(() => {
    return DAILY_DIRECTIVES[
      Math.floor(Math.random() * DAILY_DIRECTIVES.length)
    ];
  }, []);

  const scrollRef = useRef(null);
  const { canScroll, atBottom } = useScrollIndicator(scrollRef);

  const handlePowerButtonClick = () => {
    setShowBriefingModal(true);
  };

  const handleSystemInitialize = () => {
    activateSystem();
    setShowBriefingModal(false);
  };

  const motivationText = useMemo(
    () => getTodayMotivation(antiVisionAnswers, visionAnswers, actionPlan),
    [antiVisionAnswers, visionAnswers, actionPlan],
  );

  const generatedQuests = useMemo(
    () => generateQuests(visionAnswers),
    [visionAnswers],
  );

  const inactiveHours = useMemo(() => {
    const last = player?.lastLoginDate ? new Date(player.lastLoginDate) : null;
    if (!last) return 0;
    const diffMs = Date.now() - last.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  }, [player?.lastLoginDate]);

  const warningText = useMemo(
    () => getAntiProcrastinationWarning(inactiveHours, 0, Object.values(antiVisionAnswers || {})[0] || ""),
    [inactiveHours, antiVisionAnswers],
  );

  const history = useMemo(
    () => getTodayAlignmentHistory(actionPlan, []),
    [actionPlan],
  );

  const alignmentScore = useMemo(
    () => calculateAlignmentScore(history),
    [history],
  );

  const alignmentSummary = useMemo(
    () => generateAlignmentSummary(alignmentScore),
    [alignmentScore],
  );

  // If system is not activated, show minimal UI with Power Button
  if (!player.systemActivated) {
    return (
      <>
        <div className="bg-dark-800/80 rounded-lg border border-white/10 h-full flex flex-col items-center justify-center p-8 max-h-[620px]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 -mt-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-4 border border-cyan-500/30">
              <Power className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 ">System Standby</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              The System awaits activation. Complete your Daily Briefing to unlock your Hunter powers.
            </p>
          </div>
          
          <button
            onClick={handlePowerButtonClick}
            className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
          >
            <Power className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Activate System
          </button>
        </div>

        <DailyBriefingModal
          isOpen={showBriefingModal}
          onClose={() => setShowBriefingModal(false)}
          onInitialize={handleSystemInitialize}
          visionAnswers={visionAnswers}
          antiVisionAnswers={antiVisionAnswers}
          actionPlan={actionPlan}
          onActionPlanChange={updateActionPlan}
          motivationText={motivationText}
          warningText={warningText}
          quests={generatedQuests}
          alignmentScore={alignmentScore}
          alignmentSummary={alignmentSummary}
        />
      </>
    );
  }

  const remainingQuests = [
    { icon: "📚", name: "Study Programming" },
    { icon: "💪", name: "Workout" },
    { icon: "💻", name: "Learn JavaScript" },
    { icon: "📖", name: "Read Atomic Habits" },
  ];

  // Full System UI when activated
  return (
    <div className="bg-dark-800/80 rounded-lg border border-white/10 h-full flex flex-col max-h-[620px]">
      <div className="relative p-3 sm:p-3.5 flex-1 overflow-y-auto scrollbar-hide" ref={scrollRef}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={deactivateSystem}
            className="group flex items-center gap-2 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium text-xs rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
          >
            <Power className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
            Power Off
          </button>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <Power className="w-4 h-4" />
            <span>System Active</span>
          </div>
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

        <ScrollIndicator visible={canScroll && !atBottom} />
      </div>

    </div>
  );
}

export default SystemPanel;
