// HomeScreen.js - Title screen with Start Run and Shop
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
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';
import { Colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const { gold, loadSave, startRun, openShop, phase } = useGameStore();

  useEffect(() => {
    loadSave();
  }, []);

  useEffect(() => {
    if (phase === 'explore') {
      navigation.navigate('Explore');
    } else if (phase === 'combat' || phase === 'battle' || phase === 'upgrade') {
      navigation.navigate('Game');
    } else if (phase === 'shop') {
      navigation.navigate('Shop');
    }
  }, [phase]);

  const glow = useSharedValue(0.6);
  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.heroSection}>
        <Animated.Text style={[styles.dungeonEmoji, glowStyle]}>🏰</Animated.Text>
        <Text style={styles.title}>ETERNAL{'\n'}DUNGEON</Text>
        <Text style={styles.subtitle}>Descend. Fight. Survive.</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statLabel}>💰 Gold</Text>
          <Text style={styles.statValue}>{gold}</Text>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.btnPrimary} onPress={startRun} activeOpacity={0.8}>
          <Text style={styles.btnPrimaryText}>⚔️  Begin Descent</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={openShop} activeOpacity={0.8}>
          <Text style={styles.btnSecondaryText}>🛒  Upgrade Shop</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>All progress saves locally • No internet needed</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  dungeonEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
    lineHeight: 50,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: Colors.accentLight,
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statChip: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: '800',
  },
  buttonGroup: {
    gap: 14,
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
  footer: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
