import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Eye, ShieldAlert, Zap, X } from "lucide-react";

function DailyBriefingModal({ isOpen, onClose, onInitialize, equippedVision, equippedAntiVision }) {
  const [step, setStep] = useState(1);

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

  const actionPlan = [
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
            {/* Equipped Vision */}
            <section className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Eye className="h-6 w-6 text-cyan-400" />
                <h3 className="text-xl font-bold tracking-wider text-cyan-300">
                  EQUIPPED VISION
                </h3>
              </div>
              {equippedVision ? (
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl">{equippedVision.icon}</span>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                        {equippedVision.colorTier} • Level {equippedVision.level}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {equippedVision.name}
                      </p>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-gray-300">{equippedVision.summary}</p>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      Directives
                    </p>
                    {equippedVision.directives.map((directive, i) => (
                      <p key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-cyan-400">▹</span>
                        {directive}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No vision equipped</p>
              )}
            </section>

            {/* Equipped Anti-Vision */}
            <section className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-amber-400" />
                <h3 className="text-xl font-bold tracking-wider text-amber-300">
                  ANTI-VISION COUNTER
                </h3>
              </div>
              {equippedAntiVision ? (
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl">{equippedAntiVision.icon}</span>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                        {equippedAntiVision.colorTier} • Level {equippedAntiVision.level}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {equippedAntiVision.name}
                      </p>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-gray-300">{equippedAntiVision.summary}</p>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      Active Antidotes
                    </p>
                    {equippedAntiVision.antidotes.map((antidote, i) => (
                      <p key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-amber-400">✦</span>
                        {antidote}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No counter armed</p>
              )}
            </section>

            {/* Momentum Rule */}
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

            {/* Action Plan */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-xl font-bold tracking-wider text-white">
                TODAY'S ACTION PLAN
              </h3>
              <div className="space-y-3">
                {actionPlan.map((question, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <p className="text-sm text-gray-300">{question}</p>
                  </div>
                ))}
              </div>
            </section>
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
