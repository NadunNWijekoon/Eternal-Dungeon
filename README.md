# 🏰 Eternal Dungeon

> **Descend. Fight. Survive.**  
> An offline roguelike dungeon crawler built with React Native + Expo.

---

## 📱 Overview

Eternal Dungeon is a fast-paced, addictive mobile roguelike where you auto-fight increasingly powerful enemies, collect gold, choose upgrades, and see how deep you can descend — all fully offline, no internet required.

---

## 🎮 Gameplay Loop

```
🏠 Home → ⚔️ Battle → ✨ Choose Upgrade → ⚔️ Deeper Battle → 💀 Die → 🏠 Home
                                                                     (gold & perma-upgrades kept)
```

1. **Enter the dungeon** — tap *Begin Descent* from the home screen  
2. **Auto-combat begins** — your hero and the enemy attack each other automatically  
3. **Enemy defeated** — choose 1 of 3 upgrade cards (one is ⭐ Recommended for your build)  
4. **Go deeper** — each room gets harder; enemy stats scale with depth  
5. **Death** — gold earned is saved; your permanent upgrades carry over forever  
6. **Shop** — spend gold between runs for permanent stat boosts

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

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
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
    │   └── upgrades.js           # All upgrades + smart recommendation logic
    ├── store/
    │   └── useGameStore.js       # Zustand store — all game state & save/load
    ├── theme/
    │   └── colors.js             # Dark theme color palette
    └── screens/
        ├── HomeScreen.js         # Title screen
        ├── GameScreen.js         # Auto-combat battle view
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
