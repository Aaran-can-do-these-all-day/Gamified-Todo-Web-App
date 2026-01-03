export const bosses = [
  {
    id: 1,
    name: "The Goblin King",
    rank: "E-Rank",
    xpRequired: 500,
    rewardGold: 100,
    rewardItem: "Rusty Sword",
    days: [{ completed: false }, { completed: false }],
    losses: 0,
    systemMessage:
      "The Goblin King senses your hesitation... Use the system productively for at least 3 hours for 2 days in a row.",
  },
  {
    id: 2,
    name: "Hollow Magician",
    rank: "C-Rank",
    xpRequired: 3000,
    rewardGold: 300,
    rewardItem: "Magic Staff",
    days: [{ completed: false }, { completed: false }, { completed: false }],
    losses: 0,
    systemMessage:
      "The Hollow Magician hides behind a mana barrier. Earn 300 XP to breach his domain.",
  },
  {
    id: 3,
    name: "Lycan Alpha",
    rank: "D-Rank",
    xpRequired: 1500,
    rewardGold: 200,
    rewardItem: "Silver Claws",
    days: [
      { completed: true },
      { completed: true },
      { completed: false },
      { completed: false },
    ],
    losses: 0,
    systemMessage:
      "The Lycan Alpha is watching you from the darkness... Focus for at least 4 hours per day for 4 days in a row.",
  },
  {
    id: 4,
    name: "Shadow Monarch",
    rank: "S-Rank",
    xpRequired: 10000,
    rewardGold: 1000,
    rewardItem: "Shadow Extraction",
    days: [
      { completed: false },
      { completed: false },
      { completed: false },
      { completed: false },
      { completed: false },
      { completed: false },
      { completed: false },
    ],
    losses: 0,
    systemMessage:
      "The ultimate challenge awaits. Only those who have truly leveled up can face the Shadow Monarch.",
  },
];
