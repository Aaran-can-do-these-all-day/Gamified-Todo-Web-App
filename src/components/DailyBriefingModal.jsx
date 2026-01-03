import { motion, AnimatePresence } from "framer-motion";
import { Power, Eye, ShieldAlert, Zap, X, AlertTriangle, Target } from "lucide-react";
import { summarize } from "../utils/motivationEngine";

function DailyBriefingModal({
  isOpen,
  onClose,
  onInitialize,
  equippedVision,
  equippedAntiVision,
  visionAnswers = {},
  antiVisionAnswers = {},
  actionPlan = {},
  onActionPlanChange,
  motivationText,
  warningText,
  quests = [],
  alignmentScore,
  alignmentSummary,
}) {

  const momentumRule = {
    title: "The Momentum Rule",
    description: "Procrastination dies the moment momentum begins.",
    actions: [
      "What is the smallest possible action I can take that gets the ball rolling?",
      "What can I start that takes less than 2 minutes?",
      "What can I do right now instead of waiting to feel ready?",
    ],
    mantra: "Small action → momentum → motivation. Always in that order.",
  };

  const actionPlanPrompts = [
    "What is ONE thing I must do today to avoid my anti-vision?",
    "What is ONE thing I must do today to move toward my vision?",
    "What is ONE thing I must eliminate today that is slowing me down?",
  ];

  const handleInitialize = () => {
    onInitialize();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-8 shadow-[0_0_80px_rgba(139,92,246,0.4)]"
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-purple-500/20 p-4">
                <Power className="h-10 w-10 text-purple-400" />
              </div>
            </div>
            <h2 className="text-3xl font-black tracking-[0.3em] text-white">
              DAILY BRIEFING
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.4em] text-white/60">
              System Activation Ritual
            </p>
          </div>

          <div className="space-y-6">
            {/* Daily Motivation */}
            {motivationText ? (
              <section className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-purple-300" />
                  <h3 className="text-lg font-bold tracking-wider text-white">Daily Motivation</h3>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">{motivationText}</p>
              </section>
            ) : null}

            {/* Awakening Reminder */}
            <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-5 w-5 text-cyan-300" />
                <h3 className="text-lg font-bold tracking-wider text-cyan-200">Awakening Reminder</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60">Vision Cue</p>
                  <p className="text-sm text-gray-100 mt-1">
                    {summarize(Object.values(visionAnswers || {})[0] || "", 120) || "Set your vision to anchor today."}
                  </p>
                </div>
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-200/80">Anti-Vision Guard</p>
                  <p className="text-sm text-amber-100 mt-1">
                    {summarize(Object.values(antiVisionAnswers || {})[0] || "", 120) || "Define what you must avoid."}
                  </p>
                </div>
              </div>
            </section>

            {/* Alignment */}
            {typeof alignmentScore === "number" ? (
              <section className="rounded-2xl border border-green-400/30 bg-green-400/5 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-green-300" />
                  <h3 className="text-lg font-bold tracking-wider text-green-100">Alignment Score</h3>
                </div>
                <div className="flex items-center justify-between text-white mb-1">
                  <span className="text-2xl font-black">{alignmentScore}</span>
                  <span className="text-xs uppercase tracking-[0.25em] text-green-200/80">0 - 100</span>
                </div>
                <p className="text-sm text-green-50">{alignmentSummary}</p>
              </section>
            ) : null}

            {/* Action Plan */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h3 className="text-xl font-bold tracking-wider text-white">TODAY'S ACTION PLAN</h3>
              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-gray-300 mb-2">{actionPlanPrompts[0]}</p>
                  <textarea
                    className="w-full rounded-lg bg-white/5 border border-white/10 text-sm text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    rows={2}
                    value={actionPlan.avoid || ""}
                    onChange={(e) => onActionPlanChange?.("avoid", e.target.value)}
                    placeholder="Example: Avoid doom scrolling before noon."
                  />
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-gray-300 mb-2">{actionPlanPrompts[1]}</p>
                  <textarea
                    className="w-full rounded-lg bg-white/5 border border-white/10 text-sm text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    rows={2}
                    value={actionPlan.do || ""}
                    onChange={(e) => onActionPlanChange?.("do", e.target.value)}
                    placeholder="Example: Ship one focused 25-minute build session."
                  />
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-gray-300 mb-2">{actionPlanPrompts[2]}</p>
                  <textarea
                    className="w-full rounded-lg bg-white/5 border border-white/10 text-sm text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    rows={2}
                    value={actionPlan.remove || ""}
                    onChange={(e) => onActionPlanChange?.("remove", e.target.value)}
                    placeholder="Example: Remove Slack/notifications for 2 hours."
                  />
                </div>
              </div>
              <div className="rounded-xl border border-purple-400/30 bg-purple-400/10 p-4">
                <p className="text-sm text-purple-100 mb-2">Notes & Blockers</p>
                <textarea
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-sm text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  rows={2}
                  value={actionPlan.notes || ""}
                  onChange={(e) => onActionPlanChange?.("notes", e.target.value)}
                  placeholder="What might block you today? How will you remove it?"
                />
              </div>
            </section>

            {/* Momentum Rule (moved to end) */}
            <section className="rounded-2xl border border-purple-400/30 bg-purple-400/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Zap className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold tracking-wider text-purple-300">
                  {momentumRule.title}
                </h3>
              </div>
              <p className="mb-4 text-sm text-gray-300">{momentumRule.description}</p>
              <div className="space-y-2">
                {momentumRule.actions.map((action, i) => (
                  <p key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-purple-400">▸</span>
                    {action}
                  </p>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-center">
                <p className="text-sm font-medium text-purple-300">
                  {momentumRule.mantra}
                </p>
              </div>
            </section>

            {/* Quests */}
            {quests?.length ? (
              <section className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-5 w-5 text-blue-300" />
                  <h3 className="text-lg font-bold tracking-wider text-blue-100">Suggested Quests</h3>
                </div>
                <div className="space-y-2">
                  {quests.map((q) => (
                    <div key={q.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <div className="flex items-center justify-between text-sm text-white">
                        <span className="font-semibold">{q.title}</span>
                        <span className="text-xs uppercase tracking-wide text-gray-300">{q.difficulty}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{q.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Anti-Procrastination Warning */}
            {warningText ? (
              <section className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-300" />
                  <h3 className="text-lg font-bold tracking-wider text-amber-100">Warning</h3>
                </div>
                <p className="text-sm text-amber-50">{warningText}</p>
              </section>
            ) : null}
          </div>

          {/* Initialize Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleInitialize}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-12 py-4 font-bold uppercase tracking-[0.3em] text-white shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(168,85,247,0.8)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Power className="h-5 w-5" />
                Initialize System
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Once initialized, the system remains active until the next day.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DailyBriefingModal;
