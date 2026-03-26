// GameScreen.js - Main battle screen with auto-combat and HUD
import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
} from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';
import { Colors } from '../theme/colors';

// ── HP Bar Component ───────────────────────────────────────────────
function HpBar({ current, max, color }) {
  const ratio = Math.max(0, Math.min(1, current / max));
  const barWidth = useSharedValue(ratio);

  useEffect(() => {
    barWidth.value = withTiming(ratio, { duration: 400, easing: Easing.out(Easing.quad) });
  }, [ratio]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%`,
    backgroundColor: color,
  }));

  return (
    <View style={styles.hpTrack}>
      <Animated.View style={[styles.hpFill, barStyle]} />
    </View>
  );
}

// ── Floating Damage Number ─────────────────────────────────────────
function FloatingNumber({ item, onDone }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-60, { duration: 900, easing: Easing.out(Easing.quad) });
    opacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 800 })
    );
    const t = setTimeout(onDone, 950);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text
      style={[
        styles.floatNum,
        { color: item.isCrit ? Colors.crit : item.side === 'player' ? Colors.danger : Colors.accentLight },
        style,
      ]}
    >
      {item.isCrit ? `💥${item.value}!` : `-${item.value}`}
    </Animated.Text>
  );
}

// ── EnemyCard Component ────────────────────────────────────────────
function EnemyCard({ enemy }) {
  const shake = useSharedValue(0);
  const prevHp = useRef(enemy.hp);

  useEffect(() => {
    if (enemy.hp < prevHp.current) {
      shake.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-5, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
    prevHp.current = enemy.hp;
  }, [enemy.hp]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  return (
    <Animated.View style={[styles.enemyCard, { borderColor: enemy.color + '40' }, shakeStyle]}>
      <Text style={styles.enemyEmoji}>{enemy.emoji}</Text>
      <Text style={[styles.enemyName, { color: enemy.color }]}>{enemy.type}</Text>
      <Text style={styles.enemyDesc}>{enemy.description}</Text>
      <View style={styles.hpRow}>
        <Text style={styles.hpLabel}>HP</Text>
        <HpBar current={enemy.hp} max={enemy.maxHp} color={Colors.enemyBar} />
        <Text style={styles.hpText}>{enemy.hp}/{enemy.maxHp}</Text>
      </View>
      <View style={styles.enemyStats}>
        <Text style={styles.enemyStatText}>⚔️ {enemy.atk}  🛡️ {enemy.def}</Text>
      </View>
    </Animated.View>
  );
}

// ── Main GameScreen ────────────────────────────────────────────────
export default function GameScreen({ navigation }) {
  const {
    player, enemy, depth, phase, combatLog, floatingNumbers,
    playerAttack, enemyAttack, removeFloatingNumber, goHome,
  } = useGameStore();

  const playerAtkTimer = useRef(null);
  const enemyAtkTimer = useRef(null);

  // Auto combat intervals
  const schedulePlayerAttack = useCallback(() => {
    if (!player || !enemy) return;
    playerAtkTimer.current = setTimeout(() => {
      useGameStore.getState().playerAttack();
      if (useGameStore.getState().phase === 'battle') schedulePlayerAttack();
    }, player.atkSpeed);
  }, [player?.atkSpeed]);

  const scheduleEnemyAttack = useCallback(() => {
    if (!player || !enemy) return;
    const speed = 1800 * (player.enemySlowFactor || 1);
    enemyAtkTimer.current = setTimeout(() => {
      useGameStore.getState().enemyAttack();
      if (useGameStore.getState().phase === 'battle') scheduleEnemyAttack();
    }, speed);
  }, [player?.enemySlowFactor]);

  useEffect(() => {
    if (phase === 'battle') {
      schedulePlayerAttack();
      scheduleEnemyAttack();
    }
    return () => {
      clearTimeout(playerAtkTimer.current);
      clearTimeout(enemyAtkTimer.current);
    };
  }, [phase, enemy?.id]);

  useEffect(() => {
    if (phase === 'upgrade') {
      navigation.navigate('Upgrade');
    } else if (phase === 'dead') {
      navigation.navigate('Dead');
    }
  }, [phase]);

  if (!player || !enemy) return null;

  const hpRatio = player.hp / player.maxHp;
  const hpColor =
    hpRatio > 0.5 ? Colors.success : hpRatio > 0.25 ? Colors.gold : Colors.danger;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header HUD */}
      <View style={styles.hud}>
        <View style={styles.hudLeft}>
          <Text style={styles.depthText}>DEPTH {depth}</Text>
        </View>
        <View style={styles.hudRight}>
          <Text style={styles.goldText}>💰 {useGameStore.getState().gold}</Text>
        </View>
      </View>

      {/* Enemy */}
      <View style={styles.enemySection}>
        {enemy && <EnemyCard enemy={enemy} />}

        {/* Floating numbers for enemy */}
        <View style={styles.floatZoneEnemy} pointerEvents="none">
          {floatingNumbers
            .filter((f) => f.side === 'enemy')
            .map((f) => (
              <FloatingNumber
                key={f.id}
                item={f}
                onDone={() => removeFloatingNumber(f.id)}
              />
            ))}
        </View>
      </View>

      {/* Player HUD */}
      <View style={styles.playerSection}>
        <View style={styles.playerCard}>
          <View style={styles.playerTop}>
            <Text style={styles.playerEmoji}>🧙</Text>
            <View style={styles.playerInfo}>
              <Text style={styles.playerLabel}>HERO</Text>
              <View style={styles.hpRow}>
                <Text style={styles.hpLabel}>HP</Text>
                <HpBar current={player.hp} max={player.maxHp} color={hpColor} />
                <Text style={styles.hpText}>{player.hp}/{player.maxHp}</Text>
              </View>
            </View>
          </View>

          {/* Floating numbers for player */}
          <View style={styles.floatZonePlayer} pointerEvents="none">
            {floatingNumbers
              .filter((f) => f.side === 'player')
              .map((f) => (
                <FloatingNumber
                  key={f.id}
                  item={f}
                  onDone={() => removeFloatingNumber(f.id)}
                />
              ))}
          </View>

          <View style={styles.playerStats}>
            <Text style={styles.statPill}>⚔️ {player.atk + (player.bonusAtk || 0)}</Text>
            <Text style={styles.statPill}>🛡️ {player.def + (player.bonusDef || 0)}</Text>
            {(player.critChance || 0) > 0.05 && (
              <Text style={styles.statPill}>💥 {Math.round((player.critChance || 0) * 100)}%</Text>
            )}
            {(player.lifesteal || 0) > 0 && (
              <Text style={styles.statPill}>🩸 {player.lifesteal}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Combat Log */}
      <View style={styles.logSection}>
        <ScrollView style={styles.logScroll} showsVerticalScrollIndicator={false}>
          {combatLog.map((entry, i) => (
            <Text key={i} style={[styles.logEntry, i === 0 && styles.logLatest]}>
              {entry}
            </Text>
          ))}
        </ScrollView>
      </View>

      {/* Flee button */}
      <TouchableOpacity style={styles.fleeBtn} onPress={goHome} activeOpacity={0.7}>
        <Text style={styles.fleeBtnText}>🏃 Flee</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  hudLeft: {},
  hudRight: {},
  depthText: {
    color: Colors.accentLight,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
  },
  goldText: {
    color: Colors.gold,
    fontWeight: '700',
    fontSize: 14,
  },
  enemySection: {
    flex: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enemyCard: {
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  enemyEmoji: {
    fontSize: 56,
    marginBottom: 6,
  },
  enemyName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  enemyDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
    textAlign: 'center',
  },
  hpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    marginVertical: 4,
  },
  hpLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    width: 22,
  },
  hpTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    borderRadius: 4,
  },
  hpText: {
    color: Colors.textSecondary,
    fontSize: 11,
    width: 52,
    textAlign: 'right',
  },
  enemyStats: {
    marginTop: 6,
  },
  enemyStatText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  floatZoneEnemy: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  floatZonePlayer: {
    position: 'absolute',
    right: 0,
    top: 0,
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
  floatNum: {
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  playerSection: {
    flex: 1,
    justifyContent: 'center',
  },
  playerCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  playerEmoji: {
    fontSize: 36,
  },
  playerInfo: {
    flex: 1,
  },
  playerLabel: {
    color: Colors.accentLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  playerStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  statPill: {
    backgroundColor: Colors.bgElevated,
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  logSection: {
    flex: 0.8,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logScroll: {
    flex: 1,
  },
  logEntry: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 3,
  },
  logLatest: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  fleeBtn: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fleeBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
