// UpgradeScreen.js - Post-battle upgrade selection
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';
import { Colors } from '../theme/colors';

function StatOption({ label, bonus, icon, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.statOption, disabled && styles.disabledOption]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <View style={styles.statInfo}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statBonus}>{bonus}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function UpgradeScreen({ navigation }) {
  const {
    player,
    isLevelingUp,
    lastXpGained,
    lastGoldGained,
    assignLevelUpStat,
    phase,
    depth,
  } = useGameStore();

  useEffect(() => {
    if (phase === 'explore') {
      navigation.navigate('Explore');
    }
  }, [phase]);

  const handleStatSelection = (statType) => {
    assignLevelUpStat(statType);
    // If we wanted Skill cards too, we'd wait, but for now we just finish.
  };

  const xpProgress = (player.xp / player.maxXp) * 100;

  const handleSelect = (upgrade) => {
    selectUpgrade(upgrade);
    navigation.navigate('Game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={styles.headerEmoji}>🏆</Text>
        <Text style={styles.title}>VICTORY!</Text>
        <Text style={styles.subtitle}>Enemies on Floor {depth} defeated</Text>
      </Animated.View>

      <View style={styles.summaryBox}>
        <View style={styles.rewardRow}>
          <Text style={styles.rewardLabel}>Gold Found:</Text>
          <Text style={styles.rewardValue}>+ {lastGoldGained} 💰</Text>
        </View>
        <View style={styles.rewardRow}>
          <Text style={styles.rewardLabel}>XP Gained:</Text>
          <Text style={styles.rewardValue}>+ {lastXpGained} ✨</Text>
        </View>

        <View style={styles.xpBarContainer}>
          <Text style={styles.xpLabel}>Level {player.level} Progress</Text>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpProgress}%` }]} />
          </View>
          <Text style={styles.xpValue}>{player.xp} / {player.maxXp} XP</Text>
        </View>
      </View>

      {isLevelingUp ? (
        <Animated.View entering={FadeInDown.delay(300)} style={styles.levelUpContainer}>
          <Text style={styles.levelUpTitle}>✨ LEVEL UP! ✨</Text>
          <Text style={styles.levelUpPrompt}>Choose a blessing for your soul:</Text>
          <View style={styles.statGrid}>
            <StatOption icon="❤️" label="Vitality" bonus="+20 Max HP" onPress={() => handleStatSelection('hp')} />
            <StatOption icon="🧪" label="Wisdom" bonus="+15 Max MP" onPress={() => handleStatSelection('mp')} />
            <StatOption icon="⚔️" label="Might" bonus="+3 Attack" onPress={() => handleStatSelection('atk')} />
            <StatOption icon="🛡️" label="Fortitude" bonus="+1 Defense" onPress={() => handleStatSelection('def')} />
          </View>
        </Animated.View>
      ) : (
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => useGameStore.getState().selectUpgrade({ apply: p => p })}
        >
          <Text style={styles.continueBtnText}>Continue Exploration 🏃</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.hint}>Your journey continues deeper into the darkness.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: {
    color: Colors.accentLight,
    marginTop: 6,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  summaryBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rewardLabel: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  rewardValue: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  xpBarContainer: {
    marginTop: 20,
  },
  xpLabel: {
    color: Colors.accentLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  xpTrack: {
    height: 12,
    backgroundColor: Colors.bgElevated,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.vibrantPurple,
  },
  xpValue: {
    textAlign: 'right',
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  levelUpContainer: {
    alignItems: 'center',
  },
  levelUpTitle: {
    color: Colors.gold,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  levelUpPrompt: {
    color: Colors.textPrimary,
    fontSize: 14,
    marginBottom: 16,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  statOption: {
    width: '45%',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  statBonus: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  continueBtn: {
    backgroundColor: Colors.success,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hint: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
