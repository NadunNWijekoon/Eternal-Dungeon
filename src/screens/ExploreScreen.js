import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { TILES } from '../game/mapGenerator';
import { Colors } from '../theme/colors';
import { Image } from 'react-native';

const { width } = Dimensions.get('window');
const TILE_SIZE = Math.floor(width / 11); // Show 11x11 grid

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

  // Render viewport (e.g. 11x11 around player)
  const viewRadius = 5;
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
      
      if (tileType === TILES.WALL) {
        style = styles.tileWall;
        content = <Image source={require('../../assets/tiles/wall.png')} style={styles.tileImage} />;
      } else if (x === playerPos.x && y === playerPos.y) {
        content = (
          <>
            <Image source={require('../../assets/tiles/floor.png')} style={styles.tileImageAbsolute} />
            <Image source={require('../../assets/tiles/player.png')} style={styles.tileImage} />
          </>
        );
      } else {
        const enemy = enemiesOnMap.find(e => e.x === x && e.y === y);
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
          {content}
        </View>
      );
    }
    viewport.push(<View key={`row_${y}`} style={styles.row}>{row}</View>);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Depth {depth} - Explorer</Text>
        <Text style={styles.statsText}>
          Level {player?.level} | XP: {player?.xp}/{player?.maxXp}
        </Text>
        <Text style={styles.statsText}>
          HP: {player?.hp}/{player?.maxHp} | MP: {player?.mana}/{player?.maxMana}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        {viewport}
      </View>
      
      <View style={styles.logContainer}>
        <Text style={styles.logText}>{combatLog[0] || '...'}</Text>
      </View>

      <View style={styles.dpadContainer}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: Colors.accent,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 5,
  },
  mapContainer: {
    backgroundColor: Colors.bgCard,
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileFloor: {
    backgroundColor: '#37474f', // Generic floor dark gray
  },
  tileWall: {
    backgroundColor: '#263238', 
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
    fontSize: TILE_SIZE * 0.7,
  },
  logContainer: {
    height: 40,
    justifyContent: 'center',
  },
  logText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  dpadContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  dpadRow: {
    flexDirection: 'row',
  },
  dpadBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dpadCenter: {
    width: 60,
    height: 60,
    margin: 5,
  },
  dpadText: {
    fontSize: 24,
  },
});
