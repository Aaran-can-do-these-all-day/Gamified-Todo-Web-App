import { useMemo } from "react";
import TopNav from "../components/TopNav";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldPlus,
  Eye,
  Zap,
  ShieldAlert,
  Swords,
  Sparkles,
  Info,
  Lock,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import {
  antiVisionFragments,
  shadowRoster,
  visionLoadouts,
  loadoutSlots,
} from "../data/equippables";

const sectionCard =
  "rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/60 p-6 backdrop-blur";

function StatTag({ label, value }) {
  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-black/40 px-4 py-3">
      <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{label}</span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );
}

function VisionCard({ data, equipped, onEquip }) {
  return (
    <div
      className={`flex h-full flex-col gap-4 rounded-2xl border bg-white/5 px-5 py-4 transition-all duration-300 ${equipped ? "border-cyan-400/70 bg-cyan-400/5 shadow-[0_0_35px_rgba(34,211,238,0.35)]" : "border-white/10 hover:border-white/25"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.icon}</span>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">{data.tier}</p>
            <h3 className="text-xl font-semibold text-white">{data.name}</h3>
          </div>
        </div>
        <button
          onClick={() => onEquip(data.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${equipped ? "bg-cyan-400 text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          {equipped ? "Equipped" : "Equip"}
        </button>
      </div>

      <p className="text-sm text-gray-300">{data.summary}</p>

      <div className="flex flex-wrap gap-3 text-xs text-gray-300">
        <span className="rounded-full border border-white/10 px-3 py-1 uppercase tracking-[0.35em] text-white/70">
          {data.focus}
        </span>
        {Object.entries(data.statBoosts).map(([key, val]) => (
          <span key={key} className="rounded-full border border-white/10 px-3 py-1">
            +{val} {key.toUpperCase()}
          </span>
        ))}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-2">
          Directives
        </p>
        <ul className="space-y-2 text-sm text-gray-300">
          {data.directives.map((directive) => (
            <li key={directive} className="flex items-start gap-2">
              <span className="text-cyan-300">▹</span>
              <span>{directive}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-xs text-gray-300">
        <p className="font-semibold text-white/80">Resonance</p>
        <p>{data.resonance}</p>
      </div>
    </div>
  );
}

function AntiVisionCard({ data, armed, onArm }) {
  return (
    <div
      className={`flex h-full flex-col gap-4 rounded-2xl border px-5 py-4 transition-all duration-300 ${armed ? "border-amber-400/70 bg-amber-400/5 shadow-[0_0_28px_rgba(251,191,36,0.4)]" : "border-white/10 bg-black/30 hover:border-white/20"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.icon}</span>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">{data.severity}</p>
            <h3 className="text-lg font-semibold text-white">{data.name}</h3>
          </div>
        </div>
        <button
          onClick={() => onArm(data.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${armed ? "bg-amber-400 text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          {armed ? "Counter Armed" : "Arm Counter"}
        </button>
      </div>

      <p className="text-sm text-gray-300">{data.summary}</p>

      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-2">
          Triggers
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-white/70">
          {data.triggers.map((trigger) => (
            <span key={trigger} className="rounded-full border border-white/10 px-3 py-1">
              {trigger}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-2">
          Antidotes
        </p>
        <ul className="space-y-1 text-sm text-gray-300">
          {data.antidotes.map((antidote) => (
            <li key={antidote} className="flex items-start gap-2">
              <span className="text-amber-300">✦</span>
              <span>{antidote}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ShadowCard({ data, equipped, disabled, locked, onToggle }) {
  return (
    <div
      className={`flex h-full flex-col gap-3 rounded-2xl border px-5 py-4 transition-all duration-300 ${equipped ? "border-purple-400/70 bg-purple-500/5 shadow-[0_0_28px_rgba(168,85,247,0.4)]" : "border-white/10 bg-black/30 hover:border-white/20"} ${locked ? "opacity-40" : disabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.icon}</span>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">{data.class}</p>
            <h3 className="text-lg font-semibold text-white">{data.name || data.codename}</h3>
            {data.title && <p className="text-xs text-gray-400">{data.title}</p>}
          </div>
        </div>
        {locked ? (
          <div className="rounded-full bg-white/10 px-4 py-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-400">Locked</span>
          </div>
        ) : (
          <button
            onClick={() => onToggle(data.id)}
            disabled={disabled && !equipped}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${equipped ? "bg-purple-400 text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
          >
            {equipped ? "Assigned" : "Assign"}
          </button>
        )}
      </div>

      {data.buff && (
        <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-400 mb-1">{data.buff.name}</p>
          <p className="text-sm text-gray-300">{data.buff.description}</p>
        </div>
      )}

      {data.theme && (
        <p className="text-xs text-gray-400 italic">"{data.theme}"</p>
      )}

      {locked ? (
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-2 mt-1">
          <span>🔒 Requires: {data.requirement?.streakDays || 0} day {data.requirement?.category || "general"} streak</span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className={`px-2 py-1 rounded ${data.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400' : data.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {data.rarity}
          </span>
          <span>Loyalty {data.loyalty}%</span>
        </div>
      )}
    </div>
  );
}

function Equippables() {
  const { 
    player, 
    rank, 
    equipVision, 
    equipAntiVision, 
    equipShadow, 
    unequipShadow 
  } = usePlayer();

  const maxShadows = loadoutSlots.find((slot) => slot.id === "shadow")?.max ?? 2;

  const equippedVisionId = player.equippedVisionId || visionLoadouts[0]?.id;
  const armedAntiVisionId = player.equippedAntiVisionId || antiVisionFragments[0]?.id;
  const equippedShadowIds = player.equippedShadows || [];
  const unlockedShadowIds = player.unlockedShadows || [];

  const equippedVision = useMemo(
    () => visionLoadouts.find((vision) => vision.id === equippedVisionId),
    [equippedVisionId],
  );
  const armedAntiVision = useMemo(
    () => antiVisionFragments.find((fragment) => fragment.id === armedAntiVisionId),
    [armedAntiVisionId],
  );

  const handleToggleShadow = (shadowId) => {
    const isEquipped = equippedShadowIds.includes(shadowId);
    if (isEquipped) {
      unequipShadow(shadowId);
    } else if (equippedShadowIds.length < maxShadows) {
      equipShadow(shadowId);
    }
  };

  const loadoutOverview = [
    {
      label: "Vision",
      value: equippedVision?.name || "Unassigned",
      accent: "text-cyan-300",
      icon: Eye,
    },
    {
      label: "Anti-Vision Counter",
      value: armedAntiVision?.name || "Unarmed",
      accent: "text-amber-300",
      icon: ShieldAlert,
    },
    {
      label: "Shadows",
      value: `${equippedShadowIds.length}/${maxShadows} Assigned`,
      accent: "text-purple-300",
      icon: Swords,
    },
  ];

  return (
    <div className="min-h-screen bg-[#03040a]">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/60">Loadout Systems</p>
              <h1 className="mt-3 text-4xl font-black tracking-[0.3em] text-white">Equippable Items</h1>
              <p className="mt-2 text-sm text-gray-300">
                Prototype view — data is stored locally until Supabase sync goes live.
              </p>
            </div>
            <div className="flex gap-4">
              <StatTag label="Rank" value={rank.name} />
              <StatTag label="XP" value={`${player.xp.toLocaleString()} XP`} />
              <StatTag label="Gold" value={`${player.gold.toLocaleString()} G`} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-300">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2">
              <Info className="h-4 w-4 text-cyan-300" />
              <span>Mode: Static Draft (local state only)</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2">
              <Sparkles className="h-4 w-4 text-purple-300" />
              <span>Supabase upgrade next</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {loadoutOverview.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <span className={`rounded-full border border-white/10 bg-black/70 p-3 ${item.accent}`}>
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">{item.label}</p>
                  <p className="text-base font-semibold text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        <section className={sectionCard}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/60">VISIONS</p>
              <h2 className="text-2xl font-bold text-white tracking-[0.2em]">Primary Archetypes</h2>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/70">
              <Eye className="h-4 w-4 text-cyan-300" />
              Slot allows 1 equipped vision.
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {visionLoadouts.map((vision) => (
              <VisionCard
                key={vision.id}
                data={vision}
                equipped={vision.id === equippedVisionId}
                onEquip={equipVision}
              />
            ))}
          </div>
        </section>

        <section className={sectionCard}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/60">ANTI-VISION</p>
              <h2 className="text-2xl font-bold text-white tracking-[0.2em]">Threat Countermeasures</h2>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/70">
              <ShieldAlert className="h-4 w-4 text-amber-300" />
              One counter may be armed at a time.
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {antiVisionFragments.map((fragment) => (
              <AntiVisionCard
                key={fragment.id}
                data={fragment}
                armed={fragment.id === armedAntiVisionId}
                onArm={equipAntiVision}
              />
            ))}
          </div>
        </section>

        <section className={sectionCard}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/60">SHADOWS</p>
              <h2 className="text-2xl font-bold text-white tracking-[0.2em]">Companion Roster</h2>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/70">
              <Swords className="h-4 w-4 text-purple-300" />
              Up to {maxShadows} shadows can be assigned.
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {shadowRoster.map((shadow) => {
              const isLocked = !unlockedShadowIds.includes(shadow.id);
              const isEquipped = equippedShadowIds.includes(shadow.id);
              const isDisabled = !isEquipped && equippedShadowIds.length >= maxShadows;
              
              return (
                <ShadowCard
                  key={shadow.id}
                  data={shadow}
                  equipped={isEquipped}
                  disabled={isDisabled}
                  locked={isLocked}
                  onToggle={handleToggleShadow}
                />
              );
            })}
          </div>
        </section>

        <footer className="mb-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300">
          <div className="flex flex-wrap items-center gap-3">{loadoutSlots.map((slot) => (
            <span key={slot.id} className="rounded-full border border-white/10 px-4 py-2 text-xs">
              {slot.label}: {slot.max} slot{slot.max > 1 ? "s" : ""}
            </span>
          ))}</div>
          <div className="flex flex-wrap gap-3">
            <NavLink to="/awakening" className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10">
              Edit Vision Journal
            </NavLink>
            <NavLink to="/gates" className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10">
              Challenge New Gate
            </NavLink>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Equippables;

