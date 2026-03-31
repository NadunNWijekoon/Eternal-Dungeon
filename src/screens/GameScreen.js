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

// ── Simple Action Button ──────────────────────────────────────────
function ActionButton({ onPress, label, color, disabled, icon }) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, { backgroundColor: color || Colors.vibrantPurple }, disabled && styles.actionBtnDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.actionBtnText}>{icon} {label}</Text>
    </TouchableOpacity>
  );
}

// ── Spell Item Component ───────────────────────────────────────────
function SpellItem({ spell, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.spellItem, disabled && styles.spellItemDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.spellHeader}>
        <Text style={styles.spellName}>{spell.emoji} {spell.name}</Text>
        <Text style={styles.spellCost}>{spell.mpCost} MP</Text>
      </View>
      <Text style={styles.spellDesc}>{spell.description}</Text>
    </TouchableOpacity>
  );
}

// ── Main GameScreen ────────────────────────────────────────────────
export default function GameScreen({ navigation }) {
  const {
    player, enemy, depth, phase, combatLog, floatingNumbers,
    playerAttack, castSpell, removeFloatingNumber, goHome,
  } = useGameStore();

  const [showMagicMenu, setShowMagicMenu] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Phase transitions
  useEffect(() => {
    if (phase === 'upgrade') {
      navigation.navigate('Upgrade');
    } else if (phase === 'dead') {
      navigation.navigate('Dead');
    } else if (phase === 'explore') {
      navigation.navigate('Explore');
    }
  }, [phase]);

  const handleAttack = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const ok = playerAttack();
    if (ok) {
      // Wait for animations and enemy turn
      setTimeout(() => setIsProcessing(false), 1600);
    } else {
      setIsProcessing(false);
    }
  };

  const handleCast = (spellId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const ok = castSpell(spellId);
    if (ok) {
      setShowMagicMenu(false);
      setTimeout(() => setIsProcessing(false), 1600);
    } else {
      setIsProcessing(false);
    }
  };

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
         <View style={[styles.statRow, { marginTop: 10 }]}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MANA</Text>
              <HpBar current={player.mana} max={player.maxMana} color={Colors.neonCyan} />
              <Text style={styles.statValue}>{player.mana}/{player.maxMana} MP</Text>
            </View>
            <View style={styles.statBox}>
               {/* Empty for symmetry */}
            </View>
         </View>
      </View>

      {/* Action Section */}
      <View style={styles.actionSectionOuter}>
        {!showMagicMenu ? (
          <View style={styles.mainMenu}>
            <ActionButton 
              label="ATTACK" 
              icon="⚔️" 
              onPress={handleAttack} 
              disabled={isProcessing} 
            />
            <ActionButton 
              label="MAGIC" 
              icon="✨" 
              color={Colors.neonCyan}
              onPress={() => setShowMagicMenu(true)} 
              disabled={isProcessing} 
            />
            <ActionButton 
              label="FLEE" 
              icon="🏃" 
              color={Colors.danger}
              onPress={() => goHome()} 
              disabled={isProcessing} 
            />
          </View>
        ) : (
          <View style={styles.magicMenu}>
            <View style={styles.magicHeader}>
              <Text style={styles.magicTitle}>SPELLBOOK</Text>
              <TouchableOpacity onPress={() => setShowMagicMenu(false)}>
                <Text style={styles.closeMagic}>CLOSE [X]</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.spellScroll}>
              {player.spellbook.map(sid => {
                const sp = require('../game/spells').SPELLS[sid];
                return (
                  <SpellItem 
                    key={sid} 
                    spell={sp} 
                    disabled={player.mana < sp.mpCost || isProcessing} 
                    onPress={() => handleCast(sid)}
                  />
                );
              })}
            </ScrollView>
          </View>
        )}
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
  actionBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionBtnDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.bgElevated,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  actionSectionOuter: {
    marginBottom: 10,
    minHeight: 120,
  },
  mainMenu: {
    flexDirection: 'row',
    gap: 10,
  },
  magicMenu: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  magicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  magicTitle: {
    color: Colors.neonCyan,
    fontWeight: '900',
    fontSize: 14,
  },
  closeMagic: {
    color: Colors.danger,
    fontWeight: '700',
    fontSize: 12,
  },
  spellScroll: {
    gap: 10,
  },
  spellItem: {
    width: 200,
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  spellItemDisabled: {
    opacity: 0.3,
  },
  spellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  spellName: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  spellCost: {
    color: Colors.neonCyan,
    fontWeight: '800',
    fontSize: 12,
  },
  spellDesc: {
    color: Colors.textSecondary,
    fontSize: 11,
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
