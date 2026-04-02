import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { TILES } from '../game/mapGenerator';
import { Colors } from '../theme/colors';
import { Image } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive design for mobile phones (Pixel 7, Galaxy S20 optimized)
// These phones typically have ~411-412dp width in portrait
const GRID_SIZE = 9; // 9x9 grid for better visibility
const MAX_TILE_SIZE = Math.floor((width - 40) / GRID_SIZE);
const TILE_SIZE = Math.min(MAX_TILE_SIZE, 45); // Cap at 45px for readability

export default function ExploreScreen({ navigation }) {
  const { currentMap, playerPos, enemiesOnMap, movePlayer, phase, depth, player, combatLog } = useGameStore();

  useEffect(() => {
    if (phase === 'combat') {
      navigation.navigate('Game');
    } else if (phase === 'home') {
      navigation.navigate('Home');
    }
  }, [phase, navigation]);

  if (!currentMap) return <View style={styles.container} />;

  // Render viewport (9x9 around player, centered on player)
  const viewRadius = Math.floor(GRID_SIZE / 2);
  const viewport = [];
  for (let y = playerPos.y - viewRadius; y <= playerPos.y + viewRadius; y++) {
    const row = [];
    for (let x = playerPos.x - viewRadius; x <= playerPos.x + viewRadius; x++) {
      let tileType = TILES.EMPTY;
      if (y >= 0 && y < currentMap.length && x >= 0 && x < currentMap[0].length) {
        tileType = currentMap[y][x];
      }
      
      // Check for entities
      let content = null;
      let style = styles.tileFloor;
      let highlight = null;
      
      const isPlayerHere = x === playerPos.x && y === playerPos.y;
      const enemy = enemiesOnMap.find(e => e.x === x && e.y === y);
      
      if (tileType === TILES.WALL) {
        style = styles.tileWall;
        content = <Image source={require('../../assets/tiles/wall.png')} style={styles.tileImage} />;
      } else if (isPlayerHere) {
        style = styles.tilePlayerHere;
        highlight = styles.playerHighlight;
        content = (
          <>
            <Image source={require('../../assets/tiles/floor.png')} style={styles.tileImageAbsolute} />
            <Image source={require('../../assets/tiles/player.png')} style={styles.tileImage} />
          </>
        );
      } else {
        content = <Image source={require('../../assets/tiles/floor.png')} style={styles.tileImage} />;
        if (enemy) {
          content = (
            <>
              <Image source={require('../../assets/tiles/floor.png')} style={styles.tileImageAbsolute} />
              <Text style={styles.tileEmoji}>{enemy.emoji}</Text>
            </>
          );
        }
      }
      
      row.push(
        <View key={`${x},${y}`} style={[styles.tile, style]}>
          {highlight && <View style={highlight} />}
          {content}
        </View>
      );
    }
    viewport.push(<View key={`row_${y}`} style={styles.row}>{row}</View>);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header HUD */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerText}>⛏️ DEPTH {depth}</Text>
            <Text style={styles.positionText}>Position: ({playerPos.x}, {playerPos.y})</Text>
          </View>
          <Text style={styles.levelText}>Lvl {player?.level}</Text>
        </View>
        
        <View style={styles.statsBar}>
          <Text style={styles.statItem}>
            HP: <Text style={{ color: player?.hp < player?.maxHp * 0.3 ? Colors.danger : Colors.success }}>
              {player?.hp}/{player?.maxHp}
            </Text>
          </Text>
          <Text style={styles.statItem}>
            MP: <Text style={{ color: Colors.neonCyan }}>{player?.mana}/{player?.maxMana}</Text>
          </Text>
          <Text style={styles.statItem}>
            XP: {player?.xp}/{player?.maxXp}
          </Text>
        </View>
      </View>

      {/* Map Grid */}
      <View style={styles.mapWrapper}>
        <View style={styles.mapContainer}>
          {viewport}
        </View>
      </View>
      
      {/* Combat Log / Event Display */}
      <View style={styles.logContainer}>
        <Text style={styles.logLabel}>📜 Event:</Text>
        <Text style={styles.logText}>{combatLog[0] || 'Exploring the dungeon...'}</Text>
      </View>

      {/* D-Pad Controls */}
      <View style={styles.dpadContainer}>
        <Text style={styles.dpadLabel}>Navigate</Text>
        <View style={styles.dpadRow}>
          <TouchableOpacity style={styles.dpadBtn} onPress={() => movePlayer(0, -1)}>
            <Text style={styles.dpadText}>⬆️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dpadRow}>
          <TouchableOpacity style={styles.dpadBtn} onPress={() => movePlayer(-1, 0)}>
            <Text style={styles.dpadText}>⬅️</Text>
          </TouchableOpacity>
          <View style={styles.dpadCenter} />
          <TouchableOpacity style={styles.dpadBtn} onPress={() => movePlayer(1, 0)}>
            <Text style={styles.dpadText}>➡️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dpadRow}>
          <TouchableOpacity style={styles.dpadBtn} onPress={() => movePlayer(0, 1)}>
            <Text style={styles.dpadText}>⬇️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerText: {
    color: Colors.accent,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  positionText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  levelText: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
    paddingVertical: 4,
    backgroundColor: 'rgba(124, 77, 255, 0.08)',
    borderRadius: 6,
  },
  statItem: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  mapWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  mapContainer: {
    backgroundColor: Colors.bgCard,
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tileFloor: {
    backgroundColor: '#37474f',
  },
  tileWall: {
    backgroundColor: '#263238',
  },
  tilePlayerHere: {
    backgroundColor: Colors.bgCard,
  },
  playerHighlight: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: Colors.gold,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 79, 0.15)',
  },
  tileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tileImageAbsolute: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tileEmoji: {
    fontSize: TILE_SIZE * 0.65,
    fontWeight: 'bold',
  },
  logContainer: {
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    borderRadius: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  logLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  logText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontStyle: 'italic',
  },
  dpadContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  dpadLabel: {
    color: Colors.accentLight,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dpadBtn: {
    width: 56,
    height: 56,
    backgroundColor: Colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.accent,
    activeOpacity: 0.6,
  },
  dpadText: {
    fontSize: 24,
  },
  dpadCenter: {
    width: 56,
    height: 56,
    margin: 4,
  },
});
