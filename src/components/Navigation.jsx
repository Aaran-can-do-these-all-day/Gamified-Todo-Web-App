import { NavLink } from "react-router-dom";
import { Power, Flame, Sword, Target } from "lucide-react";

const navItems = [
  {
    path: "/awakening",
    label: "Awakening",
    vertical: "AWAKENING",
    japanese: "限界を超えて",
    codename: "A-01",
    icon: Power,
    iconColor: "text-cyan-200",
    ringColor: "border-cyan-400/60",
    textAccent: "text-cyan-100",
    accentLine: "from-cyan-400/80 via-cyan-200/20 to-transparent",
    accentDot: "bg-cyan-400",
    shadow: "0px 40px 70px rgba(14,165,233,0.30)",
    shards: [
      "absolute -left-3 top-8 h-[78%] w-16 rounded-[28px] border border-cyan-200/40 bg-gradient-to-b from-cyan-400/80 via-blue-500/70 to-blue-900/80 -rotate-6",
      "absolute left-4 top-4 h-[86%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-blue-900/90 via-blue-700/70 to-indigo-900/70 -rotate-2",
      "absolute left-12 top-12 h-[64%] w-12 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-cyan-200/15 to-transparent rotate-6 opacity-70",
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
    shadow: "0px 40px 70px rgba(249,115,22,0.32)",
    shards: [
      "absolute -left-2 top-6 h-[80%] w-16 rounded-[28px] border border-amber-200/40 bg-gradient-to-b from-orange-500/80 via-amber-500/70 to-red-600/80 -rotate-8",
      "absolute left-5 top-2 h-[88%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-stone-900/80 via-amber-900/70 to-black/80 rotate-2",
      "absolute left-12 top-14 h-[62%] w-12 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-amber-200/15 to-transparent rotate-7 opacity-70",
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
    shadow: "0px 40px 70px rgba(168,85,247,0.35)",
    shards: [
      "absolute -left-3 top-7 h-[80%] w-16 rounded-[28px] border border-fuchsia-200/40 bg-gradient-to-b from-fuchsia-500/80 via-purple-500/70 to-indigo-600/80 -rotate-5",
      "absolute left-5 top-4 h-[85%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-slate-900/90 via-purple-900/70 to-black/80 rotate-1",
      "absolute left-12 top-12 h-[62%] w-12 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-fuchsia-200/15 to-transparent rotate-8 opacity-70",
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
    shadow: "0px 40px 70px rgba(248,113,113,0.35)",
    shards: [
      "absolute -left-3 top-7 h-[80%] w-16 rounded-[28px] border border-rose-200/40 bg-gradient-to-b from-rose-500/85 via-red-500/70 to-orange-600/80 -rotate-7",
      "absolute left-5 top-3 h-[86%] w-16 rounded-[26px] border border-white/10 bg-gradient-to-b from-zinc-900/90 via-rose-900/70 to-black/80 -rotate-1",
      "absolute left-12 top-12 h-[62%] w-12 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-rose-200/15 to-transparent rotate-9 opacity-70",
    ],
  },
];

const noisePattern =
  "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:4px_4px]";
const sheenGradient =
  "bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]";

function NavigationPoster({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      aria-label={`Navigate to ${item.label}`}
      className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70"
      style={{ boxShadow: item.shadow }}
    >
      <div className="relative flex min-h-[480px] flex-col overflow-hidden rounded-[32px] border border-white/12 bg-gradient-to-b from-zinc-900/60 via-neutral-950 to-black p-6 transition-transform duration-500 hover:-translate-y-2">
        <div className={`absolute inset-0 opacity-30 ${noisePattern}`} />
        <div
          className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${sheenGradient}`}
        />

        <div className="relative flex flex-1 flex-col">
          <div className="relative flex flex-1 items-center justify-center py-10">
            <div className="pointer-events-none absolute inset-y-4 left-6 right-6">
              {item.shards.map((cls, idx) => (
                <div key={idx} className={cls} />
              ))}
            </div>

            <div className="relative z-10 flex items-center gap-6">
              <div className="relative flex h-[260px] w-16 flex-col items-center justify-center gap-1 rounded-[22px] border border-white/25 bg-black/85 px-2 py-6 text-white shadow-[inset_0_0_24px_rgba(255,255,255,0.12)]">
                <span className="absolute top-4 h-6 w-px bg-white/40" />
                <span className="absolute bottom-4 h-6 w-px bg-white/25" />
                {item.vertical.split("").map((letter, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold tracking-[0.45em]"
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <div className="h-[220px] w-px bg-white/15" />

              <div className="flex flex-col items-center gap-3">
                <span className="writing-vertical text-xs tracking-[0.4em] text-white/70">
                  {item.japanese}
                </span>
                <span
                  className={`h-24 w-[2px] bg-gradient-to-b ${item.accentLine}`}
                />
                <span className={`h-2 w-2 rounded-full ${item.accentDot}`} />
              </div>
            </div>
          </div>

          <div className="relative mt-8 rounded-[20px] border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full border ${item.ringColor} bg-black/70`}
                >
                  <Icon className={`h-5 w-5 ${item.iconColor}`} />
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-wide text-white">
                    {item.label}
                  </p>
                  <p
                    className={`text-[11px] uppercase tracking-[0.4em] ${item.textAccent}`}
                  >
                    Enter
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-[11px] font-semibold tracking-[0.4em] text-white/60">
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

function NavigationCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {navItems.map((item) => (
        <NavigationPoster key={item.path} item={item} />
      ))}
    </div>
  );
}

export default NavigationCards;
