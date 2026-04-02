import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const ARENA_HEIGHT = 280;

// ── Animated Unit Component ─────────────────────────────────────────
function AnimatedUnit({
  unit,
  isPlayer,
}) {
  const lunge = useSharedValue(0);
  const shake = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const prevHp = useRef(unit?.hp);

  // Attack Lunge Animation
  useEffect(() => {
    if (unit?.isAttacking) {
      const direction = isPlayer ? 60 : -60;
      lunge.value = withSequence(
        withTiming(direction, { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0, { duration: 300, easing: Easing.inOut(Easing.quad) })
      );
      scale.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(1, { duration: 300 })
      );
    }
  }, [unit?.isAttacking]);

  // Hit Shake Animation
  useEffect(() => {
    if (unit?.hp < prevHp.current) {
       shake.value = withSequence(
         withTiming(-10, { duration: 60 }),
         withTiming(10, { duration: 60 }),
         withTiming(-7, { duration: 60 }),
         withTiming(0, { duration: 60 })
       );
    }
    prevHp.current = unit?.hp;
  }, [unit?.hp]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: lunge.value + (isPlayer ? shake.value : -shake.value) },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!unit) return null;

  return (
    <Animated.View style={[styles.unitContainer, isPlayer ? styles.playerPos : styles.enemyPos, animatedStyle]}>
      <Text style={styles.unitEmoji}>{unit.emoji || (isPlayer ? '🧙' : '💀')}</Text>
      <View style={styles.unitInfo}>
        <Text style={[styles.unitName, { color: unit.color || Colors.accentLight }]}>
          {unit.type || 'HERO'}
        </Text>
      </View>
    </Animated.View>
  );
}

// ── Helper: Map depth to environment ──────────────────────────────
const getBgImage = (depth) => {
  if (!depth) return require('../../assets/images/forest.png');
  // Cycle environments every 9 levels (3 levels per biome)
  const cycle = depth % 9;
  if (cycle === 0 || cycle > 6) return require('../../assets/images/dungeon.png'); // 7, 8, 9, 0
  if (cycle > 3) return require('../../assets/images/village.png'); // 4, 5, 6
  return require('../../assets/images/forest.png'); // 1, 2, 3
};

// ── Hero Character Center Pointer ───────────────────────────────
function HeroCharacter({ player }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withSequence(
      withTiming(1.1, { duration: 600 }),
      withTiming(1, { duration: 600 })
    );
    const interval = setInterval(() => {
      pulse.value = withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 })
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={[styles.heroContainer, pulseStyle]}>
      <View style={styles.heroPulseRing} />
      <Image
        source={require('../../assets/tiles/player.png')}
        style={styles.heroImage}
        resizeMode="contain"
      />
      <Text style={styles.heroLabel}>HERO</Text>
    </Animated.View>
  );
}

// ── Main Battlefield Arena ──────────────────────────────────────────
export default function Battlefield({ player, enemy, floatingNumbers, removeFloatingNumber, depth }) {
  const bgImg = getBgImage(depth);

  return (
    <ImageBackground source={bgImg} style={styles.arena} imageStyle={styles.bgImageStyle}>
      {/* Atmospheric dark gradient overlay for lower half to make sprites pop */}
      <View style={styles.bottomShadow} />

      {/* Hero Character Center Pointer */}
      <HeroCharacter player={player} />

      {/* Units */}
      <AnimatedUnit
        unit={player}
        isPlayer={true}
      />
      
      <AnimatedUnit
        unit={enemy}
        isPlayer={false}
      />

      {/* Floating Numbers (Internalized) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {floatingNumbers.map((f) => (
           <InternalFloatingNumber key={f.id} f={f} onDone={() => removeFloatingNumber(f.id)} />
        ))}
      </View>

      {/* Scanline / Vibe Overlay */}
      <View style={styles.scanline} pointerEvents="none" />
    </ImageBackground>
  );
}

function InternalFloatingNumber({ f, onDone }) {
  const transY = useSharedValue(0);
  const opac = useSharedValue(1);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    transY.value = withTiming(-100, { duration: 900, easing: Easing.out(Easing.quad) });
    scale.value = withSpring(1.5);
    opac.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(1, { duration: 500 }),
      withTiming(0, { duration: 300 })
    );
    const t = setTimeout(onDone, 950);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opac.value,
    transform: [{ translateY: transY.value }, { scale: scale.value }],
    left: f.side === 'enemy' ? '70%' : '20%',
    top: '40%',
  }));

  return (
    <Animated.Text style={[styles.floatNum, { color: f.isCrit ? Colors.crit : f.side === 'player' ? Colors.danger : Colors.neonCyan }, style]}>
      {f.isCrit ? `💥${f.value}!` : `-${f.value}`}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  arena: {
    height: ARENA_HEIGHT,
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(124, 77, 255, 0.3)',
    justifyContent: 'center',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  bgImageStyle: {
    opacity: 0.9, // slight dim
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.4)', // Fades the floor slightly to help text pop
  },
  unitContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  playerPos: {
    left: 30,
    bottom: 60,
  },
  enemyPos: {
    right: 30,
    top: 50,
  },
  unitEmoji: {
    fontSize: 72,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
  },
  unitInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  unitName: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  floatNum: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  scanline: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 242, 254, 0.01)', // Very faint overlay
  },
  heroContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -60,
    marginTop: -70,
    width: 120,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  heroPulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(124, 77, 255, 0.4)',
    opacity: 0.6,
  },
  heroImage: {
    width: 100,
    height: 100,
    tintColor: Colors.accentLight,
  },
  heroLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '900',
    color: Colors.accentLight,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
