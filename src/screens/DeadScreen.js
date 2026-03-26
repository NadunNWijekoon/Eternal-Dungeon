// DeadScreen.js - Game over / death screen
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
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';
import { Colors } from '../theme/colors';

export default function DeadScreen({ navigation }) {
  const { depth, runGoldEarned, gold, goHome, startRun, phase } = useGameStore();

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleRestart = () => {
    startRun();
    navigation.navigate('Game');
  };

  const handleHome = () => {
    goHome();
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        <Animated.Text style={[styles.skull, pulseStyle]}>💀</Animated.Text>
        <Text style={styles.title}>YOU DIED</Text>
        <Text style={styles.subtitle}>Your soul fades into the dungeon...</Text>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Run Summary</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Depth Reached</Text>
            <Text style={styles.statValue}>{depth - 1}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Gold Earned</Text>
            <Text style={[styles.statValue, { color: Colors.gold }]}>+{runGoldEarned}</Text>
          </View>
          <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.statLabel}>Total Gold</Text>
            <Text style={[styles.statValue, { color: Colors.gold }]}>{gold}</Text>
          </View>
        </View>

        <Text style={styles.tip}>
          💡 Gold persists — upgrade at the shop to go deeper!
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleRestart} activeOpacity={0.8}>
            <Text style={styles.btnPrimaryText}>⚔️  Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={handleHome} activeOpacity={0.8}>
            <Text style={styles.btnSecondaryText}>🏠  Main Menu</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  content: {
    alignItems: 'center',
  },
  skull: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: Colors.danger,
    letterSpacing: 5,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 30,
  },
  statsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  statsTitle: {
    color: Colors.accentLight,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  tip: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 28,
    fontStyle: 'italic',
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
  },
  btnSecondaryText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
