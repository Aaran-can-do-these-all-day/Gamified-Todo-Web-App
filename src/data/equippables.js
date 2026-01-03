export const visionLoadouts = [
  {
    id: "vision-event-horizon",
    name: "Event Horizon Protocol",
    icon: "🜂",
    slot: "vision",
    tier: "Mythic",
    level: 5,
    boostValue: 1.8,
    colorTier: "Refined",
    focus: "Discipline",
    category: "discipline",
    summary: "A crystalline battle plan that weaponizes ruthless morning clarity.",
    equipped: true,
    statBoosts: { foc: 3, dis: 2 },
    directives: [
      "Wake before 5:30 AM and log the system before dopamine hijacks attention.",
      "Block the first 3 hours for Deep Work or the protocol dissolves.",
      "Ship one tangible deliverable before noon to maintain charge.",
    ],
    resonance: "When active, gates unlock 10% faster and streak decay slows.",
    ritual: "Finalize tomorrow's first mission before powering down for the night.",
  },
  {
    id: "vision-celestial-stride",
    name: "Celestial Stride",
    icon: "✦",
    slot: "vision",
    tier: "Legendary",
    level: 3,
    boostValue: 1.4,
    colorTier: "Awakened",
    focus: "Momentum",
    category: "health",
    equipped: false,
    statBoosts: { fit: 2, soc: 1 },
    summary: "Turns daily movement into a confidence feedback loop.",
    directives: [
      "Complete a 20-minute sweat session before screens.",
      "Log one social check-in that fuels the mission, not ego.",
      "Close the day with a win recap inside the journal vault.",
    ],
    resonance: "Stacks with streak multipliers to boost XP payouts by 5%.",
    ritual: "Unroll the training mat + play the Celestial mantra audio track.",
  },
  {
    id: "vision-oracle-stride",
    name: "Oracle Glass",
    icon: "🜁",
    slot: "vision",
    tier: "Rare",
    level: 7,
    boostValue: 2.2,
    colorTier: "Radiant",
    focus: "Focus",
    category: "learning",
    equipped: false,
    statBoosts: { int: 2, foc: 1 },
    summary: "A tactical overlay for research sprints and codex study.",
    directives: [
      "Distill every study block into a 3-bullet intel brief.",
      "Archive reference links into the Hunter vault within 5 minutes.",
      "Share one distilled insight with the guild to cement mastery.",
    ],
    resonance: "Unlocks Research Shadows who can auto-scout reference material.",
    ritual: "Flash the oracle glyph on screensaver before diving into knowledge work.",
  },
];

export const antiVisionFragments = [
  {
    id: "anti-limbo",
    name: "Limbo Static",
    icon: "☓",
    severity: "Critical",
    level: 4,
    boostValue: 1.6,
    colorTier: "Awakened",
    category: "discipline",
    summary: "An entropy field created when dopamine wins the morning.",
    penalties: [
      "-3 Focus after 10 minutes of reactive scrolling.",
      "Doubles the XP required to clear today's gate.",
      "Summons the Doubt Warden shadow to block rewards.",
    ],
    triggers: ["Phone within reach of the bed", "Undefined first task", "Notifications enabled"],
    antidotes: [
      "Lock phone in the Faraday cage before sleep.",
      "Set the System Directive card on keyboard before shutdown.",
      "Cold-start Pomodoro within 2 minutes of waking.",
    ],
  },
  {
    id: "anti-fog",
    name: "Spectral Fog",
    icon: "☁",
    severity: "High",
    level: 6,
    boostValue: 2.0,
    colorTier: "Refined",
    category: "focus",
    summary: "Slow drip procrastination disguised as busywork.",
    penalties: [
      "Gold income reduced by 40% for the day.",
      "Shadows refuse to obey complex orders.",
    ],
    triggers: ["Inbox grazing", "Multi-tasking", "Skipping briefings"],
    antidotes: [
      "Activate Momentum Rule — complete a 2-minute micro action.",
      "Announce the day's single win target to the guild chat.",
    ],
  },
  {
    id: "anti-collapse",
    name: "City Collapse",
    icon: "⚠",
    severity: "Maximum",
    level: 9,
    boostValue: 2.6,
    colorTier: "Transcendent",
    category: "general",
    summary: "The future self's nightmare reel. Miss three check-ins and the city falls.",
    penalties: [
      "Lose 1,000 XP and 300 Gold.",
      "Streak resets to zero and Shadows disperse.",
      "Boss progression locks for 48 hours.",
    ],
    triggers: ["Skipping daily briefing", "Breaking sleep protocols", "No mission logged"],
    antidotes: [
      "Manual Override Ritual: cold shower + journal confession + recommit.",
      "Trigger emergency guild accountability ping.",
    ],
  },
];

// Import canonical shadow roster from shadows.js
import { SHADOW_ROSTER, MAX_EQUIPPED_SHADOWS } from "./shadows";

export const shadowRoster = SHADOW_ROSTER;
export const maxEquippedShadows = MAX_EQUIPPED_SHADOWS;

export const loadoutSlots = [
  { id: "vision", label: "Vision", max: 1 },
  { id: "antiVision", label: "Anti-Vision Counter", max: 1 },
  { id: "shadow", label: "Shadow Companions", max: 2 },
];
