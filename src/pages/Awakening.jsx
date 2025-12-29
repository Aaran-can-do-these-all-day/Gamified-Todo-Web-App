import { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Sword,
  Flame,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useVisions from "../hooks/useVisions";
import { VISION_TYPES } from "../api/visions";

const antiVisionQuestions = [
  {
    id: 1,
    question:
      "What does a normal day in my life look like if I don't take action?",
    hint: "Be specific—what time do you wake up, what do you feel, what do you do?",
  },
  {
    id: 2,
    question:
      "If I continue my current habits and avoid taking action, what will my life look like in 1 year? In 5 years? 20 years?",
  },
  {
    id: 3,
    question: "How will I feel knowing I wasted my time and potential?",
  },
  {
    id: 4,
    question:
      "If my younger self saw me right now, would they be proud or ashamed?",
  },
];

const visionQuestions = [
  {
    id: 1,
    question: "What does my dream day look like in detail?",
  },
  {
    id: 2,
    question: "What kind of person do I want to become?",
  },
  {
    id: 3,
    question: "What specific things will I have achieved?",
  },
];

const actionPlanQuestions = [
  "What is ONE thing I must do today to avoid my anti-vision?",
  "What is ONE thing I must do today to move toward my vision?",
  "What is ONE thing I must eliminate today that is slowing me down?",
];

function QuestionCard({
  question,
  hint,
  answer,
  onAnswerChange,
  isExpanded,
  onToggle,
  disabled = false,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#191919] overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <span className="text-red-400 text-xl font-display">?</span>
        <div className="flex-1">
          <h3 className="font-medium text-white font-display tracking-wide">
            {question}
          </h3>
          {hint && <p className="text-sm text-gray-400 italic mt-1">{hint}</p>}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4">
              <textarea
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={disabled}
                placeholder="Write your answer here..."
                className={`w-full h-32 bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Awakening() {
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showAntiProcrastination, setShowAntiProcrastination] = useState(false);
  const {
    antiVisionAnswers,
    visionAnswers,
    loading: visionsLoading,
    saving: visionsSaving,
    error: visionsError,
    source: visionSource,
    supabaseReady: visionsConnected,
    updateAnswer: updateVisionAnswer,
  } = useVisions();

  const toggleQuestion = (key) => {
    setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAntiVisionAnswer = useCallback(
    (questionId, value) =>
      updateVisionAnswer(VISION_TYPES.ANTI_VISION, questionId, value),
    [updateVisionAnswer],
  );

  const handleVisionAnswer = useCallback(
    (questionId, value) =>
      updateVisionAnswer(VISION_TYPES.VISION, questionId, value),
    [updateVisionAnswer],
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold tracking-[0.6em] text-white/35 uppercase">
            System Awakening
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-black tracking-[0.35em] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(168,85,247,0.35)]">
            AWAKENING
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.5em] text-white/60">
            限界を超えて
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <NavLink
            to="/"
            className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Return Home
          </NavLink>
          <NavLink
            to="/quests"
            className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Sword className="w-4 h-4" /> Quests
          </NavLink>
          <NavLink
            to="/habits"
            className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Flame className="w-4 h-4" /> Habits
          </NavLink>
          <NavLink
            to="/gates"
            className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Target className="w-4 h-4" /> Gates
          </NavLink>
        </div>

        <div className="mb-8 space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
            <span>
              Storage: {visionSource === "supabase" ? "Supabase Sync" : "Local Draft"}
            </span>
            <span className={visionsSaving ? "text-amber-300" : "text-emerald-300"}>
              {visionsSaving ? "Saving..." : visionsLoading ? "Loading" : "Saved"}
            </span>
          </div>
          {!visionsConnected && (
            <p className="text-sm text-amber-300">
              Supabase disabled — answers are stored locally on this device.
            </p>
          )}
          {visionsError && (
            <p className="text-sm text-red-400">{visionsError.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-red-400 text-xl">❌</span>
              <h2 className="text-xl font-display font-bold tracking-wider text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]">
                ANTI-VISION
              </h2>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 mb-6 backdrop-blur-sm">
              <p className="text-gray-300 text-sm leading-relaxed">
                Instead of writing a bland list, close your eyes and visualize
                it. However most people visualize their worst-case scenario in a{" "}
                <span className="font-semibold text-red-300">detached</span>{" "}
                way. That's a mistake. You need to make it{" "}
                <span className="font-semibold text-red-300">
                  painfully real
                </span>{" "}
                and emotionally charged so that your brain associates inaction
                with suffering. Remember{" "}
                <span className="font-semibold text-red-300">
                  tomorrow never ever comes
                </span>{" "}
                so never use that as an excuse.
              </p>
            </div>

            <div className="space-y-4">
              {antiVisionQuestions.map((q) => (
                <QuestionCard
                  key={`anti-${q.id}`}
                  question={q.question}
                  hint={q.hint}
                  answer={antiVisionAnswers[q.id] || ""}
                  onAnswerChange={(val) => handleAntiVisionAnswer(q.id, val)}
                  isExpanded={expandedQuestions[`anti-${q.id}`]}
                  onToggle={() => toggleQuestion(`anti-${q.id}`)}
                  disabled={visionsLoading}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-blue-400 text-xl">✓</span>
              <h2 className="text-xl font-display font-bold tracking-wider text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                VISION
              </h2>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 mb-6 backdrop-blur-sm">
              <p className="text-gray-300 text-sm leading-relaxed">
                The mistake most people make? Their vision isn't emotionally
                compelling enough to make them crave it.
              </p>
            </div>

            <div className="space-y-4 mb-12">
              {visionQuestions.map((q) => (
                <QuestionCard
                  key={`vision-${q.id}`}
                  question={q.question}
                  answer={visionAnswers[q.id] || ""}
                  onAnswerChange={(val) => handleVisionAnswer(q.id, val)}
                  isExpanded={expandedQuestions[`vision-${q.id}`]}
                  onToggle={() => toggleQuestion(`vision-${q.id}`)}
                  disabled={visionsLoading}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-purple-400 text-xl">⚡</span>
              <h2 className="text-xl font-display font-bold tracking-wider text-purple-400 drop-shadow-[0_0_10px_rgba(192,38,211,0.5)]">
                ACTION PLAN
              </h2>
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 mb-6 backdrop-blur-sm">
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Most action plans fail because they are{" "}
                <span className="font-semibold text-purple-300">too big</span>,{" "}
                <span className="font-semibold text-purple-300">too vague</span>
                , or{" "}
                <span className="font-semibold text-purple-300">too slow</span>.
                The solution?{" "}
                <span className="underline decoration-purple-500/50 underline-offset-4">
                  The 1-1-1 Rule
                </span>
                . Every morning, ask yourself:
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                {actionPlanQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-purple-400 mt-0.5">▸</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div 
              className="rounded-xl border border-white/10 bg-[#191919] overflow-hidden hover:border-white/20 transition-all cursor-pointer"
              onClick={() => setShowAntiProcrastination(!showAntiProcrastination)}
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{showAntiProcrastination ? '▼' : '▶'}</span>
                  <h3 className="font-display font-bold tracking-wide text-gray-200">
                    ANTI-PROCRASTINATION
                  </h3>
                </div>
              </div>
              
              <AnimatePresence>
                {showAntiProcrastination && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 pt-0 border-t border-white/5">
                        <div className="mt-4">
                            <h4 className="text-lg font-bold text-purple-400 mb-2">THE MOMENTUM RULE</h4>
                            <p className="text-gray-300 text-sm mb-4">
                                Procrastination dies the moment momentum begins.
                                <br />
                                Every morning, ask yourself:
                            </p>
                            <ul className="space-y-3 text-sm text-gray-300 mb-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 mt-0.5">▸</span>
                                    <span>What is the smallest possible action I can take that gets the ball rolling?</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 mt-0.5">▸</span>
                                    <span>What can I start that takes less than 2 minutes?</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 mt-0.5">▸</span>
                                    <span>What can I do right now instead of waiting to feel ready?</span>
                                </li>
                            </ul>
                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
                                <p className="text-sm font-medium text-purple-300">
                                    Small action → momentum → motivation.
                                    <br />
                                    Always in that order.
                                </p>
                            </div>
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Awakening;
