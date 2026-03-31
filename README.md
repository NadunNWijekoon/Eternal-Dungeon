# 🏰 Eternal Dungeon

> **Descend. Fight. Survive.**  
> An offline roguelike dungeon crawler built with React Native + Expo.

---

## 📱 Overview

Eternal Dungeon is an **"Ultima"-style CRPG** roguelike where you explore procedurally generated 2D dungeons, engage in **tactical turn-based combat**, cast powerful spells, and see how deep you can descend — all fully offline, no internet required.

---

## 🕹️ New: Classic CRPG Overhaul

Experience the dungeon with our new **Procedural 2D Grid**:
- **Exploration**: Navigate a procedurally generated dungeon grid with a top-down view using the on-screen D-Pad.
- **Classic 16-bit Aesthetic**: Retro pixel-art tiles for walls, floors, the hero, and enemies.
- **Tactical Combat**: A dedicated turn-based combat screen requiring strategic use of [Attack], [Magic], or [Flee].
- **Robust Magic System**: Manage your Mana (MP) and unleash spells like *Fireball* or patch yourself up with *Heal*.

---

## 🎮 Gameplay Loop

```
🏠 Home → 🗺️ Explore Grid → ⚔️ Tactical Combat → ✨ Progress & Level Up → 💀 Die → 🏠 Home
                                                                     (gold & perma-upgrades kept)
```

1. **Enter the dungeon** — tap *Begin Descent* from the home screen
2. **Explore** — Move around the 2D grid dungeon to discover paths and map out the area.
3. **Tactical Combat** — Bumping into an enemy transitions you to turn-based combat. Choose your action: Attack, Magic, or Flee.
4. **Enemy turns** — Enemies attack logically after your action resolves.
5. **Leveling Up** — Gain XP from defeated enemies to raise your Level, Max HP, and Max MP.
6. **Go deeper** — each room gets harder; enemy stats scale with depth.
7. **Death** — gold earned is saved; your permanent upgrades carry over forever.
8. **Shop** — spend gold between runs for permanent stat boosts.

---

## ⚔️ Enemies

| Enemy | 💀 Type | Description |
|---|---|---|
| Skeleton | Balanced | Relentless reanimated warrior |
| Slime | Tanky | Slow but absorbs lots of hits |
| Archer | High ATK | Frail but hits very hard |
| Dark Knight | Elite | Heavy armor, appears at depth 6+ |
| Wraith | Speedy | Ethereal; strikes unpredictably |

---

## 🧩 Upgrade System

### ✨ Temporary (Per Run)
Chosen from 3 random cards after each enemy kill. One is flagged as **⭐ Recommended** based on your current health, attack power, and playstyle.

| Upgrade | Effect |
|---|---|
| 🔥 Flame Strike | +8 bonus attack damage |
| ❄️ Frost Aura | Enemies attack 20% slower |
| 💥 Critical Surge | +20% crit chance |
| 🩸 Vampiric Edge | +2 HP on each hit (lifesteal) |
| 🛡️ Stone Skin | -3 incoming damage |
| 💰 Gold Rush | +50% gold earned |
| 💊 Healing Surge | Restore 30 HP instantly |

### 🔒 Permanent (Across All Runs)
Bought in the **Upgrade Shop** using gold carried between runs.

| Upgrade | Cost | Effect |
|---|---|---|
| ❤️ +Max Health | 30g | +20 permanent HP |
| ⚔️ +Attack Power | 40g | +5 permanent ATK |
| 💨 +Attack Speed | 35g | Attack 15% faster |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/client) app on your phone (iOS or Android)

### Install & Run

```bash
# 1. Navigate to the project directory
cd "c:\Me\Proj\Eternal Dungeon"

### Install & Run

```bash
# 1. Install dependencies
# (Use --legacy-peer-deps to handle React 18.3.1 peer conflicts in SDK 52)
npm install --legacy-peer-deps

# 2. Start the development server
npx expo start --clear
```

Then scan the QR code with **Expo Go** on your phone.

### Emulator / Simulator

```bash
npx expo start --android   # Android emulator
npx expo start --ios       # iOS simulator (macOS only)
```

---

## 🗂️ Project Structure

```
Eternal Dungeon/
├── App.js                        # Navigation entry point (React Navigation)
├── app.json                      # Expo configuration
├── babel.config.js               # Babel + Reanimated plugin
├── package.json
└── src/
    ├── game/
    │   ├── engine.js             # Enemy generation, damage calc, gold rewards
    │   ├── upgrades.js           # All upgrades + smart recommendation logic
    │   ├── mapGenerator.js       # NEW: Procedural BSP 2D dungeon generator
    │   ├── spells.js             # NEW: Magic system and definitions
    │   └── Battlefield.js        # Animated visual arena component
    ├── store/
    │   └── useGameStore.js       # Zustand store — CRPG state, grid coords, etc.
    ├── theme/
    │   └── colors.js             # Arcade-neon color palette
    └── screens/
        ├── HomeScreen.js         # Title screen
        ├── ExploreScreen.js      # NEW: Top-down 2D grid exploration map
        ├── GameScreen.js         # Turn-based tactical combat view
        ├── UpgradeScreen.js      # Post-battle reward selection
        ├── ShopScreen.js         # Persistent upgrade shop
        └── DeadScreen.js         # Game-over / run summary
```

---

## 🛠️ Tech Stack

| Library | Purpose |
|---|---|
| [React Native](https://reactnative.dev/) | Core mobile framework |
| [Expo](https://expo.dev/) | Build toolchain & device APIs |
| [React Navigation](https://reactnavigation.org/) | Screen routing |
| [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight state management |
| [Reanimated 3](https://docs.swmansion.com/react-native-reanimated/) | 60fps animations (HP bars, floats, shakes) |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Offline persistent saves |
| [Node.js 18+](https://nodejs.org/) | Recommended runtime |

---

## 🛠️ Internal configuration (SDK 52 Fixes)

To ensure stability with Expo SDK 52 and React 18.3.1, this project includes:

- **Dependency Overrides**: Forced `react` and `react-dom` to version `18.3.1` in `package.json` to resolve `ERESOLVE` peer conflicts.
- **Entry Point**: The `main` field is explicitly set to `expo/AppEntry.js` to ensure the root component is registered correctly (fixing potential `ConfigError` issues).

---

## 📦 Offline-First

- Zero internet dependency — fully playable offline
- Progress (gold + permanent upgrades) automatically saved to device storage
- Save file survives app restarts and phone reboots

---

## 🗺️ Roadmap

- [ ] Sound effects (attack, hit, level up)
- [ ] Haptic feedback
- [ ] Boss enemies every 5 floors
- [ ] Daily offline challenges
- [ ] Local leaderboard
- [ ] Achievement system

---

## 📄 License

MIT — free to use and modify.
