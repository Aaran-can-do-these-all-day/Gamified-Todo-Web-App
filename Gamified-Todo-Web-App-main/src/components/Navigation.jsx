import React from "react";
import { NavLink } from "react-router-dom";
import { Power, Flame, Sword, Target, ShieldPlus } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Merged navItems configuration
 */
const navItems = [
  {
    path: "/awakening",
    label: "Awakening",
    vertical: "ARISE",
    japanese: "限界を超えて",
    codename: "A-01",
    icon: Power,
    iconColor: "text-cyan-200",
    ringColor: "border-cyan-400/60",
    textAccent: "text-cyan-100",
    accentLine: "from-cyan-400/80 via-cyan-200/20 to-transparent",
    accentDot: "bg-cyan-400",
    // Stronger opacity color for the halo
    halo: "rgba(59, 201, 255, 0.8)", 
    glow: "radial-gradient(60% 40% at 50% 110%, rgba(14,165,233,0.28), rgba(14,165,233,0.06) 25%, transparent 40%)",
    shadow: "0px 40px 70px rgba(14,165,233,0.30)",
    edgeGlow: {
      left: "from-cyan-400/35 via-blue-400/20 to-transparent",
      right: "from-blue-400/30 via-cyan-300/15 to-transparent",
      bottom: "from-blue-500/25 via-cyan-400/20 to-transparent",
    },
    shards: [
      "absolute left-3 top-16 h-[50%] w-16 rounded-[28px] border border-cyan-200/40 bg-gradient-to-b from-cyan-400/80 via-blue-500/70 to-blue-900/80 -rotate-[5deg]",
      "absolute left-10 top-12 h-[54%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 opacity-90 -rotate-[2deg]",
      "absolute left-12 top-16 h-[50%] w-16 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-cyan-200/15 to-transparent rotate-[5deg] opacity-70 -z-10",
    ],
  },
  {
    path: "/habits",
    label: "Habits",
    vertical: "HABITS",
    japanese: "毎日の習慣", 
    codename: "H-02",
    icon: Flame,
    iconColor: "text-amber-200",
    ringColor: "border-amber-400/60",
    textAccent: "text-amber-100",
    accentLine: "from-amber-400/80 via-amber-200/20 to-transparent",
    accentDot: "bg-amber-400",
    halo: "rgba(255, 193, 79, 0.8)",
    glow: "radial-gradient(60% 40% at 50% 110%, rgba(249,115,22,0.28), rgba(249,115,22,0.06) 25%, transparent 40%)",
    shadow: "0px 40px 70px rgba(249,115,22,0.32)",
    edgeGlow: {
      left: "from-orange-400/35 via-amber-400/20 to-transparent",
      right: "from-amber-400/30 via-orange-300/15 to-transparent",
      bottom: "from-red-500/25 via-amber-400/20 to-transparent",
    },
    shards: [
      "absolute left-3 top-16 h-[50%] w-16 rounded-[28px] border border-amber-200/40 bg-gradient-to-b from-orange-500/80 via-amber-500/70 to-red-600/80 -rotate-[5deg]",
      "absolute left-10 top-12 h-[54%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-stone-900/80 via-amber-900/70 to-black/80 opacity-90 -rotate-[2deg]",
      "absolute left-12 top-16 h-[50%] w-16 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-amber-200/15 to-transparent rotate-[5deg] opacity-70 -z-10",
    ],
  },
  {
    path: "/quests",
    label: "Quests",
    vertical: "QUESTS",
    japanese: "クエスト",
    codename: "Q-03",
    icon: Sword,
    iconColor: "text-fuchsia-200",
    ringColor: "border-fuchsia-400/60",
    textAccent: "text-fuchsia-100",
    accentLine: "from-fuchsia-400/80 via-purple-200/20 to-transparent",
    accentDot: "bg-fuchsia-400",
    halo: "rgba(198, 129, 255, 0.8)",
    glow: "radial-gradient(60% 40% at 50% 110%, rgba(168,85,247,0.28), rgba(168,85,247,0.06) 25%, transparent 40%)",
    shadow: "0px 40px 70px rgba(168,85,247,0.35)",
    edgeGlow: {
      left: "from-fuchsia-400/35 via-purple-400/20 to-transparent",
      right: "from-purple-400/30 via-fuchsia-300/15 to-transparent",
      bottom: "from-indigo-500/25 via-fuchsia-400/20 to-transparent",
    },
    shards: [
      "absolute left-3 top-16 h-[50%] w-16 rounded-[28px] border border-fuchsia-200/40 bg-gradient-to-b from-fuchsia-500/80 via-purple-500/70 to-indigo-600/80 -rotate-[5deg]",
      "absolute left-10 top-12 h-[54%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-slate-900/90 via-purple-900/70 to-black/80 opacity-90 -rotate-[2deg]",
      "absolute left-12 top-16 h-[50%] w-16 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-fuchsia-200/15 to-transparent rotate-[5deg] opacity-70 -z-10",
    ],
  },
  {
    path: "/gates",
    label: "Gates",
    vertical: "GATES",
    japanese: "ゲート",
    codename: "G-04",
    icon: Target,
    iconColor: "text-rose-200",
    ringColor: "border-rose-500/60",
    textAccent: "text-rose-100",
    accentLine: "from-rose-500/80 via-rose-200/20 to-transparent",
    accentDot: "bg-rose-500",
    halo: "rgba(255, 105, 105, 0.8)",
    glow: "radial-gradient(60% 40% at 50% 110%, rgba(248,113,113,0.28), rgba(248,113,113,0.06) 25%, transparent 40%)",
    shadow: "0px 40px 70px rgba(248,113,113,0.35)",
    edgeGlow: {
      left: "from-rose-400/35 via-red-400/20 to-transparent",
      right: "from-red-400/30 via-rose-300/15 to-transparent",
      bottom: "from-orange-500/25 via-rose-400/20 to-transparent",
    },
    shards: [
      "absolute left-3 top-16 h-[50%] w-16 rounded-[28px] border border-rose-200/40 bg-gradient-to-b from-rose-500/85 via-red-500/70 to-orange-600/80 -rotate-[5deg]",
      "absolute left-10 top-12 h-[54%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-zinc-900/90 via-rose-900/70 to-black/80 opacity-90 -rotate-[2deg]",
      "absolute left-12 top-16 h-[50%] w-16 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-rose-200/15 to-transparent rotate-[5deg] opacity-70 -z-10",
    ],
  },
  {
    path: "/equippables",
    label: "Loadout",
    vertical: "ARSENAL",
    japanese: "影の装備",
    codename: "L-05",
    icon: ShieldPlus,
    iconColor: "text-purple-200",
    ringColor: "border-purple-400/60",
    textAccent: "text-purple-100",
    accentLine: "from-purple-400/80 via-purple-200/20 to-transparent",
    accentDot: "bg-purple-400",
    halo: "rgba(156, 123, 255, 0.8)",
    glow: "radial-gradient(60% 40% at 50% 110%, rgba(167,139,250,0.28), rgba(167,139,250,0.06) 25%, transparent 40%)",
    shadow: "0px 40px 70px rgba(167,139,250,0.32)",
    edgeGlow: {
      left: "from-purple-400/35 via-indigo-400/20 to-transparent",
      right: "from-indigo-400/30 via-purple-300/15 to-transparent",
      bottom: "from-slate-500/25 via-purple-400/20 to-transparent",
    },
    shards: [
      "absolute left-3 top-16 h-[50%] w-16 rounded-[28px] border border-purple-200/40 bg-gradient-to-b from-purple-500/80 via-indigo-500/70 to-slate-800/80 -rotate-[5deg]",
      "absolute left-10 top-12 h-[54%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-black/80 via-purple-900/60 to-black/80 opacity-90 -rotate-[2deg]",
      "absolute left-12 top-16 h-[50%] w-16 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-purple-100/15 to-transparent rotate-[5deg] opacity-70 -z-10",
    ],
  },
];

const noisePattern =
  "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:4px_4px]";
const sheenGradient =
  "bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]";

/**
 * NavigationPoster
 */
function NavigationPoster({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      aria-label={`Maps to ${item.label}`}
      className="group relative block w-full max-w-[260px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70 isolate rounded-[28px] transition-all duration-500 hover:z-10"
    >
      {/* 💥 EXTERNAL HALO / GLOW 💥 */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div
          className="h-[480px] w-[380px] rounded-full blur-[70px] transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at center, ${item.halo} 0%, rgba(0,0,0,0) 70%)`,
            opacity: 0.7, // Base opacity - increases on hover via group-hover
          }}
        />
      </div>

      {/* Inner Card Content - Clipped & Styled */}
      <div
        className="relative flex min-h-[460px] flex-col overflow-hidden rounded-[28px] border-[3px] border-white/25 bg-gradient-to-b from-[#0c0b14]/80 via-[#090812] to-[#04030c] p-5 transition-transform duration-500 group-hover:-translate-y-2"
        style={{
          boxShadow: item.shadow,
          WebkitClipPath: "inset(0 round 32px)",
          clipPath: "inset(0 round 32px)",
        }}
      >
        {/* Visuals layer: noise, sheen, shards, and the clipped edge glow */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            WebkitClipPath: "inset(0 round 32px)",
            clipPath: "inset(0 round 32px)",
          }}
        >
          <div className={`absolute inset-0 opacity-30 ${noisePattern}`} />
          <div
            className={`absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${sheenGradient}`}
          />
          
          {/* Edge Glows (Inside the card borders) */}
          <div
            className={`absolute inset-y-4 left-0 w-24 bg-gradient-to-r ${item.edgeGlow.left} blur-[48px] opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
          />
          <div
            className={`absolute inset-y-4 right-0 w-24 bg-gradient-to-l ${item.edgeGlow.right} blur-[48px] opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
          />
          <div
            className={`absolute bottom-0 left-4 right-4 h-24 bg-gradient-to-t ${item.edgeGlow.bottom} blur-[48px] opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
          />
          
          <div className="absolute inset-y-4 left-4 right-4 pointer-events-none">
            {item.shards.map((cls, idx) => (
              <div key={idx} className={cls} />
            ))}
          </div>
        </div>

        {/* Foreground content */}
        <div className="relative flex flex-1 flex-col z-20">
          <div className="relative flex flex-1 items-center justify-center py-8">
            <div className="relative z-30 flex items-center gap-5">
              <div className="relative flex h-[220px] w-14 flex-col items-center justify-center gap-1 rounded-[20px] border-2 border-white/30 bg-black/85 px-2 py-5 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.12)]">
                <span className="absolute top-4 h-6 w-0.5 bg-white/50" />
                <span className="absolute bottom-4 h-6 w-0.5 bg-white/35" />
                {item.vertical.split("").map((letter, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold tracking-[0.45em]"
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <div className="h-[180px] w-0.5 bg-white/20" />

              <div className="flex flex-col items-center gap-2">
                <span className="writing-vertical text-[11px] tracking-[0.4em] text-white/70">
                  {item.japanese}
                </span>
                <span
                  className={`h-20 w-[2px] bg-gradient-to-b ${item.accentLine}`}
                />
                <span className={`h-2 w-2 rounded-full ${item.accentDot}`} />
              </div>
            </div>
          </div>

          <div className="relative mt-6 rounded-[18px] border-2 border-white/15 bg-gradient-to-r from-white/5 via-white/10 to-white/5 px-4 py-3 backdrop-blur z-30">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-10 w-14 items-center justify-center rounded-full border ${item.ringColor} bg-black/70`}
                >
                  <Icon className={`h-4 w-4 ${item.iconColor}`} aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-white leading-tight">
                    {item.label}
                  </p>
                  <p
                    className={`text-[11px] uppercase tracking-[0.4em] ${item.textAccent}`}
                  >
                    Enter
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <p className="text-[10px] font-semibold tracking-[0.35em] text-white/60">
                  {item.codename}
                </p>
                <svg
                  className="h-4 w-4 text-white/60 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function NavigationCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap justify-center gap-8 py-10" // added py-10 for spacing
    >
      {navItems.map((item) => (
        <motion.div key={item.path} variants={itemVariant}>
          <NavigationPoster item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default NavigationCards;