// ShopScreen.js - Permanent upgrade shop
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';
import { PERMANENT_UPGRADES } from '../game/upgrades';
import { Colors } from '../theme/colors';

export default function ShopScreen({ navigation }) {
  const { gold, buyPermUpgrade, permaStats, closeShop } = useGameStore();

  const handleBuy = (upgrade) => {
    const success = buyPermUpgrade(upgrade);
    if (!success) {
      Alert.alert('Not enough gold!', `You need ${upgrade.cost} gold to buy this.`);
    } else {
      Alert.alert('Purchased!', `${upgrade.name} applied permanently.`);
    }
  };

  const handleClose = () => {
    closeShop();
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>UPGRADE SHOP</Text>
        <View style={styles.goldChip}>
          <Text style={styles.goldText}>💰 {gold}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Permanent upgrades persist across all runs</Text>

      {/* Current perma stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Current Base Stats</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statItem}>❤️ {permaStats.maxHp} HP</Text>
          <Text style={styles.statItem}>⚔️ {permaStats.atk} ATK</Text>
          <Text style={styles.statItem}>💨 {Math.round((1200 / permaStats.atkSpeed) * 100)}% SPD</Text>
        </View>
      </View>

      {/* Upgrades list */}
      <View style={styles.upgradeList}>
        {PERMANENT_UPGRADES.map((upgrade, i) => (
          <Animated.View
            entering={FadeInDown.delay(i * 100).duration(400)}
            key={upgrade.id}
          >
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeIcon}>{upgrade.icon}</Text>
              <View style={styles.upgradeInfo}>
                <Text style={styles.upgradeName}>{upgrade.name}</Text>
                <Text style={styles.upgradeDesc}>{upgrade.description}</Text>
              </View>
              <TouchableOpacity
                style={[styles.buyBtn, gold < upgrade.cost && styles.buyBtnDisabled]}
                onPress={() => handleBuy(upgrade)}
                activeOpacity={0.8}
              >
                <Text style={styles.buyBtnText}>💰 {upgrade.cost}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  backBtn: {
    padding: 6,
  },
  backText: {
    color: Colors.accentLight,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  goldChip: {
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gold + '60',
  },
  goldText: {
    color: Colors.gold,
    fontWeight: '700',
    fontSize: 14,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsTitle: {
    color: Colors.accentLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  upgradeList: {
    gap: 12,
  },
  upgradeCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  upgradeIcon: {
    fontSize: 32,
  },
  upgradeInfo: {
    flex: 1,
  },
  upgradeName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  upgradeDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  buyBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buyBtnDisabled: {
    backgroundColor: Colors.bgElevated,
    shadowOpacity: 0,
    elevation: 0,
  },
  buyBtnText: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 13,
  },
});
