// upgrades.js - All upgrade definitions and recommendation logic

export const PERMANENT_UPGRADES = [
  {
    id: 'perm_hp',
    name: '+Max Health',
    description: 'Permanently increase max HP by 20.',
    cost: 30,
    icon: '❤️',
    apply: (player) => ({ ...player, maxHp: player.maxHp + 20 }),
  },
  {
    id: 'perm_atk',
    name: '+Attack Power',
    description: 'Permanently increase attack by 5.',
    cost: 40,
    icon: '⚔️',
    apply: (player) => ({ ...player, atk: player.atk + 5 }),
  },
  {
    id: 'perm_spd',
    name: '+Attack Speed',
    description: 'Permanently attack 15% faster.',
    cost: 35,
    icon: '💨',
    apply: (player) => ({ ...player, atkSpeed: player.atkSpeed * 0.85 }),
  },
];

export const TEMP_UPGRADES = [
  {
    id: 'temp_fire',
    name: 'Flame Strike',
    description: 'Attacks deal +8 fire damage for this run.',
    icon: '🔥',
    apply: (player) => ({ ...player, bonusAtk: (player.bonusAtk || 0) + 8 }),
  },
  {
    id: 'temp_freeze',
    name: 'Frost Aura',
    description: 'Enemies attack 20% slower for this run.',
    icon: '❄️',
    apply: (player) => ({ ...player, enemySlowFactor: (player.enemySlowFactor || 1) * 0.8 }),
  },
  {
    id: 'temp_crit',
    name: 'Critical Surge',
    description: '+20% critical hit chance for this run.',
    icon: '💥',
    apply: (player) => ({ ...player, critChance: (player.critChance || 0) + 0.2 }),
  },
  {
    id: 'temp_lifesteal',
    name: 'Vampiric Edge',
    description: 'Heal 2 HP on each attack for this run.',
    icon: '🩸',
    apply: (player) => ({ ...player, lifesteal: (player.lifesteal || 0) + 2 }),
  },
  {
    id: 'temp_shield',
    name: 'Stone Skin',
    description: 'Reduce incoming damage by 3 for this run.',
    icon: '🛡️',
    apply: (player) => ({ ...player, bonusDef: (player.bonusDef || 0) + 3 }),
  },
  {
    id: 'temp_gold',
    name: 'Gold Rush',
    description: 'Gain 50% more gold for this run.',
    icon: '💰',
    apply: (player) => ({ ...player, goldMultiplier: (player.goldMultiplier || 1) * 1.5 }),
  },
  {
    id: 'temp_hp',
    name: 'Healing Surge',
    description: 'Restore 30 HP right now.',
    icon: '💊',
    apply: (player) => ({
      ...player,
      hp: Math.min(player.maxHp, player.hp + 30),
    }),
  },
];

/**
 * Pick 3 random temp upgrades from the pool and flag one as recommended
 * based on current player state.
 */
export function pickUpgradeChoices(player) {
  const shuffled = [...TEMP_UPGRADES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  // Recommend:
  // - Healing if HP < 40% of max
  // - Crit if atk is already high
  // - Freeze if player is dying fast
  let recommendedId = selected[0].id;
  const hpRatio = player.hp / player.maxHp;

  if (hpRatio < 0.4) {
    const heal = selected.find((u) => u.id === 'temp_hp');
    if (heal) recommendedId = heal.id;
  } else if (player.atk >= 20) {
    const crit = selected.find((u) => u.id === 'temp_crit');
    if (crit) recommendedId = crit.id;
  } else if (hpRatio < 0.6) {
    const shield = selected.find((u) => u.id === 'temp_shield');
    if (shield) recommendedId = shield.id;
  }

  return selected.map((u) => ({ ...u, recommended: u.id === recommendedId }));
}
