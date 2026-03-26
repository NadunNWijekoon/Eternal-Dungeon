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

function UpgradeCard({ upgrade, index, onSelect }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 120;
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 12, stiffness: 150 });
      opacity.value = withSpring(1);
    }, delay);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animStyle]}>
      <TouchableOpacity
        style={[styles.card, upgrade.recommended && styles.cardRecommended]}
        onPress={() => onSelect(upgrade)}
        activeOpacity={0.8}
      >
        {upgrade.recommended && (
          <View style={styles.recBadge}>
            <Text style={styles.recText}>⭐ RECOMMENDED</Text>
          </View>
        )}
        <Text style={styles.cardIcon}>{upgrade.icon}</Text>
        <Text style={styles.cardName}>{upgrade.name}</Text>
        <Text style={styles.cardDesc}>{upgrade.description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function UpgradeScreen({ navigation }) {
  const { upgradeChoices, selectUpgrade, phase, depth } = useGameStore();

  useEffect(() => {
    if (phase === 'battle') {
      navigation.navigate('Game');
    }
  }, [phase]);

  const handleSelect = (upgrade) => {
    selectUpgrade(upgrade);
    navigation.navigate('Game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={styles.headerEmoji}>✨</Text>
        <Text style={styles.title}>VICTORY!</Text>
        <Text style={styles.subtitle}>Depth {depth - 1} cleared — choose your reward</Text>
      </Animated.View>

      <View style={styles.choices}>
        {upgradeChoices.map((upgrade, index) => (
          <UpgradeCard
            key={upgrade.id}
            upgrade={upgrade}
            index={index}
            onSelect={handleSelect}
          />
        ))}
      </View>

      <Text style={styles.hint}>Choose wisely — your next enemy is stronger.</Text>
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
  choices: {
    gap: 14,
  },
  cardWrapper: {},
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
  },
  cardRecommended: {
    borderColor: Colors.gold,
    backgroundColor: '#1a1800',
  },
  recBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardIcon: {
    fontSize: 38,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  hint: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
