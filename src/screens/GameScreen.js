import React, { useEffect, useRef } from 'react';
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
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';
import { Colors } from '../theme/colors';
import Battlefield from '../game/Battlefield';

// ── HP Bar Component ───────────────────────────────────────────────
function HpBar({ current, max, color }) {
  const ratio = Math.max(0, Math.min(1, current / max));
  const barWidth = useSharedValue(ratio);

  useEffect(() => {
    barWidth.value = withTiming(ratio, { duration: 400 });
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

// ── Cooldown Button Component ──────────────────────────────────────
function AttackButton({ onPress, cd, lastAtkTime }) {
  const progress = useSharedValue(1);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastAtkTime;
    const remaining = Math.max(0, cd - elapsed);
    
    if (remaining > 0) {
      // Start from current elapsed percentage
      progress.value = elapsed / cd;
      progress.value = withTiming(1, { duration: remaining, easing: Easing.linear });
    } else {
      progress.value = 1;
    }
  }, [lastAtkTime, cd]);

  const overlayStyle = useAnimatedStyle(() => ({
    width: `${(1 - progress.value) * 100}%`,
  }));

  const isReady = progress.value >= 0.99;

  return (
    <TouchableOpacity
      style={[styles.attackBtn, !isReady && styles.attackBtnDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!isReady}
    >
      <View style={styles.attackBtnContent}>
        <Animated.View style={[styles.attackCooldownOverlay, overlayStyle]} />
        <Text style={styles.attackBtnText}>⚔️ ATTACK</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Main GameScreen ────────────────────────────────────────────────
export default function GameScreen({ navigation }) {
  const {
    player, enemy, depth, phase, combatLog, floatingNumbers,
    playerAttack, enemyAttack, removeFloatingNumber, goHome,
  } = useGameStore();

  const enemyAtkTimer = useRef(null);

  // Enemy auto combat
  useEffect(() => {
    const scheduleEnemyAttack = () => {
      if (useGameStore.getState().phase !== 'battle') return;
      const speed = 1800 * (player?.enemySlowFactor || 1);
      enemyAtkTimer.current = setTimeout(() => {
        useGameStore.getState().enemyAttack();
        scheduleEnemyAttack();
      }, speed);
    };

    if (phase === 'battle') {
      scheduleEnemyAttack();
    }
    return () => clearTimeout(enemyAtkTimer.current);
  }, [phase, enemy?.id, player?.enemySlowFactor]);

  // Phase transitions
  useEffect(() => {
    if (phase === 'upgrade') {
      navigation.navigate('Upgrade');
    } else if (phase === 'dead') {
      navigation.navigate('Dead');
    }
  }, [phase]);

  if (!player || !enemy) return null;

  const hpRatio = player.hp / player.maxHp;
  const hpColor = hpRatio > 0.5 ? Colors.success : hpRatio > 0.25 ? Colors.gold : Colors.danger;

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

      {/* Visual Battlefield */}
      <Animated.View entering={FadeIn.duration(600)} style={styles.battlefieldContainer}>
        <Battlefield
          player={player}
          enemy={enemy}
          floatingNumbers={floatingNumbers}
          removeFloatingNumber={removeFloatingNumber}
          depth={depth}
        />
      </Animated.View>

      {/* Stats & HP HUD */}
      <View style={styles.statsHud}>
         <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>HERO HP</Text>
              <HpBar current={player.hp} max={player.maxHp} color={hpColor} />
              <Text style={styles.statValue}>{player.hp}/{player.maxHp}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { textAlign: 'right' }]}>{enemy.type} HP</Text>
              <HpBar current={enemy.hp} max={enemy.maxHp} color={Colors.enemyBar} />
              <Text style={[styles.statValue, { textAlign: 'right' }]}>{enemy.hp}/{enemy.maxHp}</Text>
            </View>
         </View>
      </View>

      {/* Action Section */}
      <View style={styles.actionSection}>
        <AttackButton
          onPress={playerAttack}
          cd={player.atkSpeed || 1200}
          lastAtkTime={player.lastAtkTime}
        />
        
        <View style={styles.miniStats}>
          <Text style={styles.statPill}>⚔️ {player.atk + (player.bonusAtk || 0)}</Text>
          <Text style={styles.statPill}>🛡️ {player.def + (player.bonusDef || 0)}</Text>
          {player.lifesteal > 0 && <Text style={styles.statPill}>🩸 {player.lifesteal}</Text>}
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

      {/* Footer */}
      <TouchableOpacity style={styles.fleeBtn} onPress={goHome}>
        <Text style={styles.fleeBtnText}>🏃 Flee to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 10,
  },
  depthText: {
    color: Colors.neonCyan,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 3,
  },
  goldText: {
    color: Colors.gold,
    fontWeight: '800',
    fontSize: 16,
  },
  battlefieldContainer: {
    // Ensuring the battlefield is centered and has some space
  },
  statsHud: {
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 1,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  hpTrack: {
    height: 10,
    backgroundColor: Colors.bgElevated,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  hpFill: {
    height: '100%',
    borderRadius: 5,
  },
  actionSection: {
    gap: 12,
    marginBottom: 10,
  },
  attackBtn: {
    height: 60,
    backgroundColor: Colors.vibrantPurple,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    elevation: 8,
    shadowColor: Colors.vibrantPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  attackBtnDisabled: {
    backgroundColor: Colors.bgElevated,
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  attackBtnContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  attackCooldownOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.cooldownFill,
  },
  attackBtnText: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  statPill: {
    backgroundColor: Colors.bgCard,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logSection: {
    flex: 1,
    backgroundColor: 'rgba(18,18,28,0.8)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logScroll: {
    flex: 1,
  },
  logEntry: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  logLatest: {
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  fleeBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  fleeBtnText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
