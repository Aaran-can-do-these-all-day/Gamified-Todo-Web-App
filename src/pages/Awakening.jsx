import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Sword, Flame, Target, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const antiVisionQuestions = [
  {
    id: 1,
    question: 'What does a normal day in my life look like if I don\'t take action?',
    hint: 'Be specific—what time do you wake up, what do you feel, what do you do?',
  },
  {
    id: 2,
    question: 'If I continue my current habits and avoid taking action, what will my life look like in 1 year? In 5 years? 20 years?',
  },
  {
    id: 3,
    question: 'How will I feel knowing I wasted my time and potential?',
  },
  {
    id: 4,
    question: 'If my younger self saw me right now, would they be proud or ashamed?',
  },
]

const visionQuestions = [
  {
    id: 1,
    question: 'What does my dream day look like in detail?',
  },
  {
    id: 2,
    question: 'What kind of person do I want to become?',
  },
  {
    id: 3,
    question: 'What specific things will I have achieved?',
  },
]

const actionPlanQuestions = [
  'What is ONE thing I must do today to avoid my anti-vision?',
  'What is ONE thing I must do today to move toward my vision?',
  'What is ONE thing I must eliminate today that is slowing me down?',
]

function QuestionCard({ question, hint, answer, onAnswerChange, isExpanded, onToggle }) {
  return (
    <div className="card-dark overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <span className="text-red-400 text-xl">?</span>
        <div className="flex-1">
          <h3 className="font-medium text-white">{question}</h3>
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
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4">
              <textarea
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full h-32 bg-dark-600 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Awakening() {
  const [antiVisionAnswers, setAntiVisionAnswers] = useState({})
  const [visionAnswers, setVisionAnswers] = useState({})
  const [expandedQuestions, setExpandedQuestions] = useState({})

  const toggleQuestion = (key) => {
    setExpandedQuestions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-dark-900" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <span className="font-display text-lg text-gray-400">ARISE</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600"
            >
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center">
                <span className="text-3xl">⚔️</span>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-xl">⭐</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <motion.h1 
          className="font-display text-3xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The Awakening Protocol
        </motion.h1>

        <div className="flex flex-wrap gap-3 mb-8">
          <NavLink to="/" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" /> Return Home
          </NavLink>
          <NavLink to="/quests" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Sword className="w-4 h-4" /> Quests
          </NavLink>
          <NavLink to="/habits" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Flame className="w-4 h-4" /> Habits
          </NavLink>
          <NavLink to="/gates" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Target className="w-4 h-4" /> Gates
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-400 text-xl">❌</span>
              <h2 className="text-xl font-semibold text-red-400">Anti - Vision</h2>
            </div>
            
            <div className="card-dark p-4 mb-4">
              <p className="text-gray-300 text-sm">
                Instead of writing a bland list, close your eyes and visualize it. However most people visualize their worst-case scenario in a <span className="font-semibold">detached</span> way. That's a mistake. You need to make it <span className="font-semibold">painfully real</span> and emotionally charged so that your brain associates inaction with suffering. Remember <span className="font-semibold">tomorrow never ever comes</span> so never use that as an excuse.
              </p>
            </div>

            <div className="space-y-3">
              {antiVisionQuestions.map((q) => (
                <QuestionCard
                  key={`anti-${q.id}`}
                  question={q.question}
                  hint={q.hint}
                  answer={antiVisionAnswers[q.id] || ''}
                  onAnswerChange={(val) => setAntiVisionAnswers(prev => ({ ...prev, [q.id]: val }))}
                  isExpanded={expandedQuestions[`anti-${q.id}`]}
                  onToggle={() => toggleQuestion(`anti-${q.id}`)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-400 text-xl">✓</span>
              <h2 className="text-xl font-semibold text-blue-400">Vision</h2>
            </div>

            <div className="card-dark p-4 mb-4">
              <p className="text-gray-300 text-sm">
                The mistake most people make? Their vision isn't emotionally compelling enough to make them crave it.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {visionQuestions.map((q) => (
                <QuestionCard
                  key={`vision-${q.id}`}
                  question={q.question}
                  answer={visionAnswers[q.id] || ''}
                  onAnswerChange={(val) => setVisionAnswers(prev => ({ ...prev, [q.id]: val }))}
                  isExpanded={expandedQuestions[`vision-${q.id}`]}
                  onToggle={() => toggleQuestion(`vision-${q.id}`)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-400 text-xl">✓</span>
              <h2 className="text-xl font-semibold text-blue-400">Action Plan</h2>
            </div>

            <div className="card-dark p-4 mb-4">
              <p className="text-gray-300 text-sm mb-2">
                Most action plans fail because they are <span className="font-semibold">too big</span>, <span className="font-semibold">too vague</span>, or <span className="font-semibold">too slow</span>. The solution? <span className="underline">The 1-1-1 Rule</span>. Every morning, ask yourself:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                {actionPlanQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-400">▸</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-dark p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400">▶</span>
                <h3 className="font-medium text-gray-300">Anti-Procrastination</h3>
              </div>
              <p className="text-sm text-gray-400">
                Click to expand techniques for beating procrastination...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Awakening
