import { useMemo, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import BossCard from "../components/BossCard";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Power,
  Sword,
  Flame,
  Target,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useBosses from "../hooks/useBosses";
import { bosses as fallbackBossesSeed } from "../data/bosses";

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

const rankColor = (rank, fallback) => {
  switch (rank) {
    case "E-Rank":
      return fallback ? "#22c55e40" : "#22c55e";
    case "D-Rank":
      return fallback ? "#3b82f640" : "#3b82f6";
    case "C-Rank":
      return fallback ? "#facc1540" : "#facc15";
    case "B-Rank":
      return fallback ? "#a855f740" : "#a855f7";
    case "A-Rank":
      return fallback ? "#f9731640" : "#f97316";
    default:
      return fallback ? "#ef444440" : "#ef4444";
  }
};

function Gates() {
  const { player } = usePlayer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fallbackBosses, setFallbackBosses] = useState(fallbackBossesSeed);

  const {
    bosses: remoteBosses,
    loading: remoteLoading,
    error: remoteError,
    toggleDay: toggleRemoteDay,
    supabaseReady,
  } = useBosses();

  const usingRemoteBosses = supabaseReady && remoteBosses.length > 0;

  const bosses = useMemo(
    () => (usingRemoteBosses ? remoteBosses : fallbackBosses),
    [usingRemoteBosses, remoteBosses, fallbackBosses],
  );

  const currentBoss = bosses[currentIndex] ?? bosses[0];
  const isUnlocked = player?.xp >= (currentBoss?.xpRequired ?? Infinity);

  const handleDayComplete = async (bossId, dayIndex) => {
    if (!currentBoss) return;

    if (usingRemoteBosses) {
      await toggleRemoteDay(bossId, dayIndex + 1);
      return;
    }

    setFallbackBosses((prev) =>
      prev.map((boss) => {
        if (boss.id !== bossId) return boss;
        const nextDays = boss.days.map((day, idx) =>
          idx === dayIndex ? { ...day, completed: !day.completed } : day,
        );
        return { ...boss, days: nextDays };
      }),
    );
  };

  const nextBoss = () => {
    setCurrentIndex((prev) => (prev + 1) % bosses.length);
  };

  const prevBoss = () => {
    setCurrentIndex((prev) => (prev - 1 + bosses.length) % bosses.length);
  };

  const gradientColor = rankColor(currentBoss?.rank, false);
  const gradientBorder = rankColor(currentBoss?.rank, true);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold tracking-[0.6em] text-white/35 uppercase">
            Dungeon Break
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-black tracking-[0.35em] bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(239,68,68,0.35)]">
            GATES
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.5em] text-white/60">
            ゲート
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_25px_rgba(255,255,255,0.08)] mb-12"
          variants={pageStagger}
        >
          <motion.div variants={cardRise}>
            <NavLink
              to="/awakening"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Power className="w-4 h-4" /> Awakening
            </NavLink>
          </motion.div>
          <motion.div variants={cardRise}>
            <NavLink
              to="/quests"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Sword className="w-4 h-4" /> Quests
            </NavLink>
          </motion.div>
          <motion.div variants={cardRise}>
            <NavLink
              to="/habits"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Flame className="w-4 h-4" /> Habits
            </NavLink>
          </motion.div>
          <motion.div variants={cardRise}>
            <NavLink
              to="/equippables"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Loadout
            </NavLink>
          </motion.div>
        </motion.div>

        <div className="flex flex-col gap-3 mb-6 text-xs text-gray-400">
          {supabaseReady ? (
            <div className="flex items-center justify-between">
              <span>
                {remoteLoading
                  ? "Syncing live gates from Supabase..."
                  : usingRemoteBosses
                    ? "Connected to Supabase — showing live gate progress."
                    : "No remote gates yet — displaying local demo data."}
              </span>
              <span className="px-2 py-0.5 rounded-full border border-purple-500/40 text-purple-300">
                Live Sync
              </span>
            </div>
          ) : (
            <div className="text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
              Supabase credentials missing — displaying local gate demo data
              only.
            </div>
          )}
          {remoteError && (
            <div className="text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
              {remoteError.message}
            </div>
          )}
        </div>

        <motion.div
          className="text-center mb-12"
          key={currentBoss?.id ?? "current-boss"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-block relative">
            <h1
              className="font-display text-4xl md:text-6xl font-bold mb-4 text-glow relative z-10"
              style={{
                color: gradientColor,
                textShadow: "0 0 30px currentColor, 0 0 60px currentColor",
              }}
            >
              {currentBoss?.name?.toUpperCase() ?? "UNKNOWN GATE"}
            </h1>
            <div
              className="absolute -inset-4 blur-2xl opacity-20 rounded-full"
              style={{ background: gradientColor }}
            />
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-8">
          <button
            onClick={prevBoss}
            className="p-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <ChevronLeft className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
          </button>

          <div className="flex-1 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="hidden md:block">
                <div
                  className="aspect-[3/4] rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(180deg, ${gradientBorder.replace(
                      "40",
                      "0d",
                    )} 0%, rgba(0,0,0,0.9) 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle at center, ${gradientColor}, transparent 70%)`,
                    }}
                  />
                  <div className="text-center p-4 relative z-10">
                    <div
                      className="font-display text-2xl font-bold mb-2 opacity-30"
                      style={{ color: gradientColor }}
                    >
                      {currentBoss?.rank}
                    </div>
                    <div className="w-px h-12 bg-white/10 mx-auto mb-2" />
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                      Gate Status: Active
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="md:col-span-1"
                key={`${currentBoss?.id ?? "boss"}-${player?.xp ?? 0}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <BossCard
                  boss={currentBoss}
                  playerXp={player?.xp ?? 0}
                  onDayComplete={(bossId, dayIndex) =>
                    handleDayComplete(bossId, dayIndex)
                  }
                />
              </motion.div>

              <div className="hidden md:block">
                <div
                  className="aspect-[3/4] rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(180deg, ${gradientBorder.replace(
                      "40",
                      "0d",
                    )} 0%, rgba(0,0,0,0.9) 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle at center, ${gradientColor}, transparent 70%)`,
                    }}
                  />
                  <div className="text-center p-4 relative z-10">
                    <div
                      className="font-display text-2xl font-bold mb-2 opacity-30"
                      style={{ color: gradientColor }}
                    >
                      {currentBoss?.rank}
                    </div>
                    <div className="w-px h-12 bg-white/10 mx-auto mb-2" />
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                      Gate Status: Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={nextBoss}
            className="p-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {bosses.map((boss, index) => (
            <button
              key={boss.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-10 text-sm text-gray-400">
          {isUnlocked
            ? "Gate unlocked. The System awaits your command."
            : `Earn ${Math.max(
                0,
                (currentBoss?.xpRequired ?? 0) - (player?.xp ?? 0),
              ).toLocaleString()} XP to unlock this gate.`}
        </div>
      </div>
    </div>
  );
}

export default Gates;
