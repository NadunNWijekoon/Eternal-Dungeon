// useGameStore.js - Central Zustand game state store
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateEnemy, calcDamage, calcGoldReward, chance } from '../game/engine';
import { pickUpgradeChoices } from '../game/upgrades';

const SAVE_KEY = 'eternal_dungeon_save';

const DEFAULT_PLAYER = {
  hp: 100,
  maxHp: 100,
  atk: 12,
  def: 2,
  atkSpeed: 1200, // ms between player attacks
  gold: 0,
  critChance: 0.05,
  bonusAtk: 0,
  bonusDef: 0,
  lifesteal: 0,
  goldMultiplier: 1,
  enemySlowFactor: 1,
  skills: [],
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
  phase: 'home', // 'home' | 'battle' | 'upgrade' | 'shop' | 'dead'
  player: null,
  enemy: null,
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
      atkSpeed: permaStats.atkSpeed,
      def: permaStats.def,
    };
    const enemy = generateEnemy(1);
    set({
      phase: 'battle',
      player,
      enemy,
      depth: 1,
      combatLog: [`Depth 1: A wild ${enemy.type} appears!`],
      floatingNumbers: [],
      isPlayerDead: false,
      runGoldEarned: 0,
      upgradeChoices: [],
    });
  },

  // ── Player attacks enemy ──────────────────────────────────
  playerAttack: () => {
    const { player, enemy, combatLog } = get();
    if (!player || !enemy || enemy.hp <= 0) return;

    const isCrit = chance(player.critChance || 0.05);
    const totalAtk = player.atk + (player.bonusAtk || 0);
    const dmg = calcDamage(totalAtk, enemy.def, isCrit);
    const newEnemyHp = Math.max(0, enemy.hp - dmg);

    // Lifesteal
    const healAmt = player.lifesteal || 0;
    const newPlayerHp = Math.min(player.maxHp, player.hp + healAmt);

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
      player: healAmt > 0 ? { ...state.player, hp: newPlayerHp } : state.player,
      combatLog: [log, ...state.combatLog].slice(0, 20),
      floatingNumbers: [...state.floatingNumbers, figNum].slice(-6),
    }));

    if (newEnemyHp <= 0) {
      get().handleEnemyDeath();
    }
  },

  // ── Enemy attacks player ──────────────────────────────────
  enemyAttack: () => {
    const { player, enemy, combatLog } = get();
    if (!player || !enemy || enemy.hp <= 0 || player.hp <= 0) return;

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
      combatLog: [log, ...state.combatLog].slice(0, 20),
      floatingNumbers: [...state.floatingNumbers, figNum].slice(-6),
    }));

    if (newHp <= 0) {
      get().handlePlayerDeath();
    }
  },

  // ── Enemy died ────────────────────────────────────────────
  handleEnemyDeath: () => {
    const { enemy, depth, player, gold, runGoldEarned } = get();
    const goldMult = player.goldMultiplier || 1;
    const earned = Math.floor(calcGoldReward(depth, enemy.atk) * goldMult);
    const choices = pickUpgradeChoices(player);
    const newLog = `✨ ${enemy.type} defeated! You earned ${earned} gold.`;

    set((state) => ({
      phase: 'upgrade',
      gold: state.gold + earned,
      runGoldEarned: state.runGoldEarned + earned,
      upgradeChoices: choices,
      combatLog: [newLog, ...state.combatLog].slice(0, 20),
    }));
    get().saveGame();
  },

  // ── Select an upgrade ─────────────────────────────────────
  selectUpgrade: (upgrade) => {
    const { player, depth } = get();
    const newPlayer = upgrade.apply(player);
    const nextEnemy = generateEnemy(depth + 1);

    set({
      phase: 'battle',
      player: newPlayer,
      enemy: nextEnemy,
      depth: depth + 1,
      upgradeChoices: [],
      floatingNumbers: [],
      combatLog: [`Depth ${depth + 1}: A wild ${nextEnemy.type} appears!`],
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
