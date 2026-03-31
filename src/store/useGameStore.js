// useGameStore.js - Central Zustand game state store
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateEnemy, calcDamage, calcGoldReward, chance } from '../game/engine';
import { pickUpgradeChoices } from '../game/upgrades';
import { SPELLS } from '../game/spells';
import { generateMap, TILES } from '../game/mapGenerator';

const SAVE_KEY = 'eternal_dungeon_save';

const DEFAULT_PLAYER = {
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 100,
  maxHp: 100,
  mana: 50,
  maxMana: 50,
  atk: 12,
  def: 2,
  spellbook: ['heal', 'fireball'], // IDs of unlocked spells
  gold: 0,
  critChance: 0.05,
  bonusAtk: 0,
  bonusDef: 0,
  lifesteal: 0,
  goldMultiplier: 1,
  enemySlowFactor: 1,
  skills: [],
  lastAtkTime: 0,
  isAttacking: false,
};

const DEFAULT_PERMA = {
  maxHp: 100,
  atk: 12,
  atkSpeed: 1200,
  def: 2,
};

export const useGameStore = create((set, get) => ({
  // ── Persistent state ──────────────────────────────────────
  gold: 0,
  permaStats: { ...DEFAULT_PERMA },

  // ── Run state ─────────────────────────────────────────────
  phase: 'home', // 'home' | 'explore' | 'combat' | 'upgrade' | 'shop' | 'dead'
  player: null,
  
  // -- Map State (Exploration) --
  currentMap: null, // 2D array of tiles
  mapWidth: 0,
  mapHeight: 0,
  playerPos: { x: 0, y: 0 },
  enemiesOnMap: [], // Array of { id, x, y, ...enemyStats }
  
  // -- Combat State --
  enemy: null, // Current enemy being fought
  depth: 1,
  upgradeChoices: [],
  combatLog: [],
  floatingNumbers: [], // [{id, value, isCrit, x}]
  isPlayerDead: false,
  runGoldEarned: 0,

  // ── Persistence ───────────────────────────────────────────
  loadSave: async () => {
    try {
      const raw = await AsyncStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        set({ gold: saved.gold || 0, permaStats: saved.permaStats || { ...DEFAULT_PERMA } });
      }
    } catch (e) {
      console.warn('Failed to load save:', e);
    }
  },

  saveGame: async () => {
    const { gold, permaStats } = get();
    try {
      await AsyncStorage.setItem(SAVE_KEY, JSON.stringify({ gold, permaStats }));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  },

  // ── Start a new run ───────────────────────────────────────
  startRun: () => {
    const { permaStats } = get();
    const player = {
      ...DEFAULT_PLAYER,
      maxHp: permaStats.maxHp,
      hp: permaStats.maxHp,
      atk: permaStats.atk,
      def: permaStats.def,
    };
    
    const depth = 1;
    const mapData = generateMap(depth);
    
    set({
      phase: 'explore',
      player,
      enemy: null,
      depth,
      combatLog: [`Welcome to the deep. Step carefully...`],
      floatingNumbers: [],
      isPlayerDead: false,
      runGoldEarned: 0,
      upgradeChoices: [],
      currentMap: mapData.grid,
      mapWidth: mapData.width,
      mapHeight: mapData.height,
      playerPos: mapData.playerPos,
      enemiesOnMap: mapData.enemiesOnMap,
    });
  },
  
  // ── Exploration Movement ──────────────────────────────────
  movePlayer: (dx, dy) => {
    const state = get();
    if (state.phase !== 'explore') return;

    const newX = state.playerPos.x + dx;
    const newY = state.playerPos.y + dy;

    // Check bounds
    if (newX < 0 || newX >= state.mapWidth || newY < 0 || newY >= state.mapHeight) {
      return;
    }

    // Check collision with walls
    if (state.currentMap[newY][newX] === TILES.WALL) {
      return;
    }

    // Check collision with enemies (Bump to Attack)
    const enemyIdx = state.enemiesOnMap.findIndex(e => e.x === newX && e.y === newY);
    if (enemyIdx !== -1) {
      // Initiate combat!
      const enemy = state.enemiesOnMap[enemyIdx];
      // Remove enemy from map so they don't respawn if we flee (or maybe we keep them and remove on death)
      // For now, let's keep them and let handleEnemyDeath remove them, BUT we need a way to track *which* enemy we are fighting.
      // We'll set the combat enemy and transition phase.
      
      set((s) => ({
        phase: 'combat',
        enemy: { ...enemy, mapIndex: enemyIdx },
        combatLog: [`You encountered a ${enemy.type}!`, ...s.combatLog].slice(0, 20),
        floatingNumbers: [],
      }));
      return;
    }

    // Move player
    set((s) => ({
      playerPos: { x: newX, y: newY },
    }));
  },

  // ── Player attacks enemy (Turn-based) ─────────────────────
  playerAttack: () => {
    const { player, enemy } = get();
    if (!player || !enemy || enemy.hp <= 0 || player.hp <= 0) return false;

    // Trigger attack animation
    set((state) => ({
      player: { ...state.player, isAttacking: true },
    }));

    setTimeout(() => {
      set((state) => ({ player: { ...get().player, isAttacking: false } }));
    }, 300);

    const isCrit = chance(player.critChance || 0.05);
    const totalAtk = player.atk + (player.bonusAtk || 0);
    const dmg = calcDamage(totalAtk, enemy.def, isCrit);
    const newEnemyHp = Math.max(0, enemy.hp - dmg);

    const log = isCrit
      ? `💥 CRIT! You hit ${enemy.type} for ${dmg}!`
      : `⚔️ You hit ${enemy.type} for ${dmg}.`;

    const figNum = {
      id: Date.now() + Math.random(),
      value: dmg,
      isCrit,
      side: 'enemy',
    };

    set((state) => ({
      enemy: { ...state.enemy, hp: newEnemyHp },
      combatLog: [log, ...state.combatLog].slice(0, 20),
      floatingNumbers: [...state.floatingNumbers, figNum].slice(-6),
    }));

    if (newEnemyHp <= 0) {
      setTimeout(() => get().handleEnemyDeath(), 800);
    } else {
      // Enemy counter-attack after a delay (Turn-based)
      setTimeout(() => get().enemyAttack(), 800);
    }
    return true;
  },

  // ── Player casts a spell ──────────────────────────────────
  castSpell: (spellId) => {
    const { player, enemy, combatLog } = get();
    const spell = SPELLS[spellId];
    if (!player || !enemy || !spell || player.mana < spell.mpCost) return false;

    const result = spell.execute(player, enemy);
    
    set((state) => ({
      player: { 
        ...state.player, 
        mana: state.player.mana - spell.mpCost,
        ...(result.playerUpdates || {}) 
      },
      enemy: result.enemyUpdates ? { ...state.enemy, ...result.enemyUpdates } : state.enemy,
      combatLog: [result.log, ...state.combatLog].slice(0, 20),
      floatingNumbers: [...state.floatingNumbers, ...(result.floatingNumbers || [])].slice(-6),
    }));

    const updatedEnemy = get().enemy;
    if (updatedEnemy.hp <= 0) {
      setTimeout(() => get().handleEnemyDeath(), 800);
    } else {
      setTimeout(() => get().enemyAttack(), 800);
    }
    return true;
  },

  // ── Enemy attacks player ──────────────────────────────────
  enemyAttack: () => {
    const { player, enemy, combatLog } = get();
    if (!player || !enemy || enemy.hp <= 0 || player.hp <= 0) return;

    // Trigger attack animation state
    set((state) => ({
      enemy: { ...state.enemy, isAttacking: true },
    }));

    setTimeout(() => {
      if (get().enemy) {
        set((state) => ({
          enemy: { ...state.enemy, isAttacking: false },
        }));
      }
    }, 300);

    const dmg = calcDamage(enemy.atk, player.def + (player.bonusDef || 0));
    const newHp = Math.max(0, player.hp - dmg);
    const log = `🩸 ${enemy.type} hits you for ${dmg}.`;

    const figNum = {
      id: Date.now() + Math.random(),
      value: dmg,
      isCrit: false,
      side: 'player',
    };

    set((state) => ({
      player: { ...state.player, hp: newHp },
      enemy: state.enemy, // preserve animation state
      combatLog: [log, ...state.combatLog].slice(0, 20),
      floatingNumbers: [...state.floatingNumbers, figNum].slice(-6),
    }));

    if (newHp <= 0) {
      get().handlePlayerDeath();
    }
  },

  // ── Enemy died ────────────────────────────────────────────
  handleEnemyDeath: () => {
    const { enemy, depth, player, gold, runGoldEarned, enemiesOnMap } = get();
    const goldMult = player.goldMultiplier || 1;
    const earned = Math.floor(calcGoldReward(depth, enemy.atk) * goldMult);
    
    // XP gain
    const xpGained = 20 + depth * 5;
    let newXp = player.xp + xpGained;
    let newLevel = player.level;
    let newMaxXp = player.maxXp;
    
    if (newXp >= newMaxXp) {
      newLevel++;
      newXp -= newMaxXp;
      newMaxXp = Math.floor(newMaxXp * 1.5);
    }

    const choices = pickUpgradeChoices(player);
    const newLog = `✨ ${enemy.type} defeated! +${earned}g, +${xpGained} XP.`;

    // Remove from map
    const newEnemiesOnMap = enemiesOnMap.filter((_, i) => i !== enemy.mapIndex);

    set((state) => ({
      phase: 'upgrade',
      gold: state.gold + earned,
      runGoldEarned: state.runGoldEarned + earned,
      player: { ...state.player, xp: newXp, level: newLevel, maxXp: newMaxXp },
      upgradeChoices: choices,
      enemiesOnMap: newEnemiesOnMap,
      combatLog: [newLog, ...state.combatLog].slice(0, 20),
    }));
    get().saveGame();
  },

  // ── Select an upgrade ─────────────────────────────────────
  selectUpgrade: (upgrade) => {
    const { player } = get();
    const newPlayer = upgrade.apply(player);

    set({
      phase: 'explore',
      player: newPlayer,
      upgradeChoices: [],
      floatingNumbers: [],
    });
  },

  // ── Player died ───────────────────────────────────────────
  handlePlayerDeath: () => {
    set({ phase: 'dead', isPlayerDead: true });
    get().saveGame();
  },

  // ── Remove floating number ────────────────────────────────
  removeFloatingNumber: (id) => {
    set((state) => ({
      floatingNumbers: state.floatingNumbers.filter((f) => f.id !== id),
    }));
  },

  // ── Go to shop ────────────────────────────────────────────
  openShop: () => set({ phase: 'shop' }),
  closeShop: () => set({ phase: 'home' }),

  // ── Buy permanent upgrade ─────────────────────────────────
  buyPermUpgrade: (upgrade) => {
    const { gold, permaStats } = get();
    if (gold < upgrade.cost) return false;
    const newPerma = upgrade.apply(permaStats);
    set({ gold: gold - upgrade.cost, permaStats: newPerma });
    get().saveGame();
    return true;
  },

  // ── Go home ───────────────────────────────────────────────
  goHome: () => set({ phase: 'home', player: null, enemy: null }),
}));
