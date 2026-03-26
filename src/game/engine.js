// engine.js - Core game logic utilities

/**
 * Generate enemy stats scaled to the current dungeon depth.
 * Difficulty increases exponentially after depth 5.
 */
export function generateEnemy(depth) {
  const types = [
    {
      type: 'Skeleton',
      emoji: '💀',
      baseHp: 40,
      baseAtk: 8,
      baseDef: 2,
      color: '#b0bec5',
      description: 'A reanimated warrior. Balanced and relentless.',
    },
    {
      type: 'Slime',
      emoji: '🟢',
      baseHp: 70,
      baseAtk: 5,
      baseDef: 5,
      color: '#66bb6a',
      description: 'Slow but absorbs hits. Hard to kill.',
    },
    {
      type: 'Archer',
      emoji: '🏹',
      baseHp: 30,
      baseAtk: 14,
      baseDef: 1,
      color: '#ffa726',
      description: 'Fires from a distance. High damage, frail.',
    },
    {
      type: 'Dark Knight',
      emoji: '⚔️',
      baseHp: 90,
      baseAtk: 18,
      baseDef: 8,
      color: '#7e57c2',
      description: 'A cursed warrior. Only appears in deep dungeons.',
    },
    {
      type: 'Wraith',
      emoji: '👻',
      baseHp: 50,
      baseAtk: 22,
      baseDef: 3,
      color: '#ec407a',
      description: 'Ethereal and swift. Strikes unpredictably.',
    },
  ];

  // Unlock harder enemies at deeper levels
  const available =
    depth < 3
      ? types.slice(0, 2)
      : depth < 6
      ? types.slice(0, 3)
      : types;

  const base = available[Math.floor(Math.random() * available.length)];
  const scale = 1 + (depth - 1) * 0.25;

  return {
    id: Date.now(),
    type: base.type,
    emoji: base.emoji,
    color: base.color,
    description: base.description,
    maxHp: Math.floor(base.baseHp * scale),
    hp: Math.floor(base.baseHp * scale),
    atk: Math.floor(base.baseAtk * scale),
    def: Math.floor(base.baseDef * scale),
  };
}

/**
 * Calculate damage from attacker to defender.
 * Positive variance of +/- 20% is applied.
 */
export function calcDamage(attackerAtk, defenderDef, isCritical = false) {
  const base = Math.max(1, attackerAtk - defenderDef);
  const variance = base * 0.2;
  const raw = base + (Math.random() * variance * 2 - variance);
  const multiplier = isCritical ? 2 : 1;
  return Math.max(1, Math.floor(raw * multiplier));
}

/**
 * Determine gold reward for killing an enemy.
 */
export function calcGoldReward(depth, enemyAtk) {
  const base = 5 + Math.floor(depth * 1.5) + Math.floor(enemyAtk * 0.5);
  const bonus = Math.floor(Math.random() * 5);
  return base + bonus;
}

/**
 * Returns true with the given probability (0-1).
 */
export function chance(p) {
  return Math.random() < p;
}
