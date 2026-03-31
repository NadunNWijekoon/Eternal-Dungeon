// spells.js - Magic system definitions

export const SPELLS = {
  heal: {
    id: 'heal',
    name: 'Heal',
    emoji: '✨',
    mpCost: 10,
    description: 'Restore 30 HP.',
    target: 'self',
    execute: (player, enemy) => {
      const healAmount = 30;
      const newHp = Math.min(player.maxHp, player.hp + healAmount);
      return {
        playerUpdates: { hp: newHp },
        enemyUpdates: null,
        log: `✨ You cast Heal and restore ${newHp - player.hp} HP!`,
      };
    },
  },
  fireball: {
    id: 'fireball',
    name: 'Fireball',
    emoji: '🔥',
    mpCost: 15,
    description: 'Deal 25 damage to the enemy.',
    target: 'enemy',
    execute: (player, enemy) => {
      const damage = 25;
      const newEnemyHp = Math.max(0, enemy.hp - damage);
      return {
        playerUpdates: null,
        enemyUpdates: { hp: newEnemyHp },
        log: `🔥 You cast Fireball! It deals ${damage} damage to the ${enemy.type}.`,
        floatingNumbers: [{ id: Date.now(), value: damage, isCrit: false, side: 'enemy' }]
      };
    },
  },
  ice_shard: {
    id: 'ice_shard',
    name: 'Ice Shard',
    emoji: '❄️',
    mpCost: 12,
    description: 'Deal 15 damage and reduce enemy attack by 2 for the rest of combat.',
    target: 'enemy',
    execute: (player, enemy) => {
      const damage = 15;
      const newEnemyHp = Math.max(0, enemy.hp - damage);
      const newEnemyAtk = Math.max(1, enemy.atk - 2);
      return {
        playerUpdates: null,
        enemyUpdates: { hp: newEnemyHp, atk: newEnemyAtk },
        log: `❄️ You cast Ice Shard! Deals ${damage} damage and chills the ${enemy.type}.`,
        floatingNumbers: [{ id: Date.now(), value: damage, isCrit: false, side: 'enemy' }]
      };
    },
  }
};
