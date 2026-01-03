import { useState } from "react";
import TopNav from "../components/TopNav";
import { usePlayer } from "../context/PlayerContext";
import useTasks from "../hooks/useTasks";
import RewardCard from "../components/RewardCard";
import RewardModal from "../components/RewardModal";
import { Plus, Coins, Gift, Clock, Zap, Home, Power, Sword, Flame, Target, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const pageStagger = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const cardRise = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

const initialRewards = [
  {
    id: 1,
    title: "1 Hour Free Time",
    icon: "⏰",
    cost: 150,
    claimed: false,
    image: null,
  },
  {
    id: 2,
    title: "Watch 1 Episode",
    icon: "📺",
    cost: 150,
    claimed: false,
    image: null,
  },
  {
    id: 3,
    title: "Game for 30 mins",
    icon: "🎮",
    cost: 50,
    claimed: false,
    image: null,
  },
  {
    id: 4,
    title: "Game for 1 hour",
    icon: "🎮",
    cost: 100,
    claimed: false,
    image: null,
  },
  {
    id: 5,
    title: "Order Takeout",
    icon: "🍔",
    cost: 200,
    claimed: false,
    image: null,
  },
  {
    id: 6,
    title: "Movie Night",
    icon: "🎬",
    cost: 300,
    claimed: false,
    image: null,
  },
];

const initialTaskLog = [
  {
    id: 1,
    title: "Read Deepwork",
    date: "May 7, 2025 2:30 PM",
    xp: 13,
    credits: 25,
  },
  { id: 2, title: "Gym", date: "May 7, 2025 1:00 PM", xp: 19, credits: 38 },
  {
    id: 3,
    title: "Study Web development",
    date: "May 7, 2025 11:00 AM",
    xp: 50,
    credits: 100,
  },
  {
    id: 4,
    title: "Workout",
    date: "May 3, 2025 12:45 PM",
    xp: 19,
    credits: 38,
  },
  {
    id: 5,
    title: "Study Programming",
    date: "May 3, 2025 10:45 AM",
    xp: 25,
    credits: 50,
  },
];

function Rewards() {
  const { player, spendGold } = usePlayer();
  const { tasks } = useTasks();
  const [rewards, setRewards] = useState(initialRewards);
  const [taskLog] = useState(initialTaskLog);
  const [filter, setFilter] = useState("rewards");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleClaim = (id) => {
    const reward = rewards.find((r) => r.id === id);
    if (reward && spendGold(reward.cost)) {
      setRewards(
        rewards.map((r) => (r.id === id ? { ...r, claimed: true } : r)),
      );
    } else {
      alert("Not enough gold!");
    }
  };

  const handleCreateReward = (newReward) => {
    setCreating(true);
    setError("");

    try {
      // In a real app, this would be an API call
      const reward = {
        id: Date.now(),
        title: newReward.title,
        icon: newReward.icon,
        cost: newReward.cost,
        xpCost: newReward.xpCost,
        expiryDate: newReward.expiryDate,
        category: newReward.category,
        image: newReward.image,
        requiredTaskId: newReward.requiredTaskId,
        claimed: false,
      };

      setRewards((prev) => [reward, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || "Failed to create reward.");
    } finally {
      setCreating(false);
    }
  };

  const claimedRewards = rewards.filter((r) => r.claimed);

  const totalGoldSpent = claimedRewards.reduce(
    (sum, reward) => sum + (reward.cost ?? 0),
    0,
  );
  const totalAvailableGold = player?.gold ?? 0;
  const totalGoldCollected = totalGoldSpent + totalAvailableGold;
  const totalXpClaimed = taskLog.reduce((sum, task) => sum + (task.xp ?? 0), 0);
  const totalXpReduced = 0; // Placeholder until a penalty/xp-reduction source is added
  const totalPenalties = 0; // Placeholder until penalty data is available

  const formatNumber = (value) => Number(value ?? 0).toLocaleString();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <TopNav />
      <motion.div
        className="max-w-7xl mx-auto px-4 py-8"
        initial="hidden"
        animate="show"
        variants={pageStagger}
      >
        <motion.div className="text-center mb-12" variants={cardRise}>
          <p className="text-xs font-semibold tracking-[0.6em] text-white/35 uppercase">
            Treasure Vault
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-black tracking-[0.35em] bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(251,191,36,0.35)]">
            REWARDS
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.5em] text-white/60">
            報酬
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-10"
          variants={pageStagger}
        >
          <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4 shadow-[0_0_25px_rgba(251,191,36,0.15)]"
            variants={cardRise}
          >
            <div className="flex items-center gap-3 text-amber-300">
              <Coins className="w-5 h-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Total Gold Collected
              </p>
            </div>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNumber(totalGoldCollected)} G
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-400/10 via-yellow-400/5 to-transparent p-4"
            variants={cardRise}
          >
            <div className="flex items-center gap-3 text-yellow-300">
              <Coins className="w-5 h-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Total Available Gold
              </p>
            </div>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNumber(totalAvailableGold)} G
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-4"
            variants={cardRise}
          >
            <div className="flex items-center gap-3 text-blue-300">
              <Zap className="w-5 h-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Total XP Claimed
              </p>
            </div>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNumber(totalXpClaimed)} XP
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent p-4"
            variants={cardRise}
          >
            <div className="flex items-center gap-3 text-red-300">
              <Zap className="w-5 h-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Total XP Reduced
              </p>
            </div>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNumber(totalXpReduced)} XP
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-4"
            variants={cardRise}
          >
            <div className="flex items-center gap-3 text-purple-300">
              <Target className="w-5 h-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Total Penalties
              </p>
            </div>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNumber(totalPenalties)}
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-8">
          <div>
            

            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setFilter("rewards")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === "rewards"
                    ? "bg-purple-600 text-white"
                    : "bg-dark-700 text-gray-400"
                }`}
              >
                🎁 Rewards
              </button>
              <button
                onClick={() => setFilter("claimed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === "claimed"
                    ? "bg-purple-600 text-white"
                    : "bg-dark-700 text-gray-400"
                }`}
              >
                🏆 Claimed Rewards
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-2 text-sm font-medium ml-auto"
              >
                <Plus className="w-4 h-4" /> New Reward
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 text-sm">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">Available Gold:</span>
              <span className="text-yellow-400 font-bold">
                {player.gold.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filter === "rewards"
                ? rewards.filter((r) => !r.claimed)
                : claimedRewards
              ).map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RewardCard reward={reward} onClaim={handleClaim} tasks={tasks} />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-cyan-400">
                  Task Log
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {taskLog.map((task, index) => (
                <motion.div
                  key={task.id}
                  className="card-dark p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">✏️</span>
                        <h3 className="font-medium text-white">{task.title}</h3>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{task.date}</p>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      ...
                    </button>
                  </div>

                  <div className="flex gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Task XP:</span>
                      <span className="text-blue-400">{task.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400">Task's Credits:</span>
                      <span className="text-yellow-400">
                        {task.credits} Credits
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <RewardModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateReward}
          submitting={creating}
          error={error}
          tasks={tasks}
        />
      )}
    </div>
  );
}

export default Rewards;

