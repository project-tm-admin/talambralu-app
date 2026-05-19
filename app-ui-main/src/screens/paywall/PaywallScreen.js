import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import Primary from '../../components/Primary';
import Screen from '../../components/Screen';

const PREMIUM_ENTITLEMENT_ID = 'premium';

export default function PaywallScreen() {
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const result = await Purchases.getOfferings();
        if (result.current !== null) {
          setOfferings(result.current);
        }
      } catch (e) {
        console.error('Error fetching offerings', e);
        Alert.alert('Error', 'Could not fetch packages.');
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  const handlePurchase = async (packageToBuy) => {
    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
      const isEntitled = customerInfo?.entitlements?.active?.[PREMIUM_ENTITLEMENT_ID] !== undefined;
      if (isEntitled) {
        Alert.alert('Success', 'You are now a premium member!');
      } else {
        Alert.alert('Purchase Processed', 'Your subscription is active.');
      }
      navigation.goBack();
    } catch (e) {
      if (e.code !== PURCHASES_ERROR_CODE.purchaseCancelledError) {
        console.error('Purchase failed:', e);
        Alert.alert('Error', e.message ?? 'Purchase failed. Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isEntitled = customerInfo?.entitlements?.active?.[PREMIUM_ENTITLEMENT_ID] !== undefined;
      if (isEntitled) {
        Alert.alert('Restored', 'Your premium subscription has been restored.');
        navigation.goBack();
      } else {
        Alert.alert('No Purchases Found', 'No active subscription was found to restore.');
      }
    } catch (e) {
      console.error('Restore failed:', e);
      Alert.alert('Error', e.message ?? 'Could not restore purchases. Please try again.');
    }
  };

  const renderPackage = ({ item }) => (
    <TouchableOpacity
      style={styles.packageContainer}
      onPress={() => handlePurchase(item)}
      disabled={purchasing}
    >
      <View style={styles.packageDetails}>
        <Text style={styles.packageTitle}>{item.product.title}</Text>
        <Text style={styles.packageDescription}>{item.product.description}</Text>
      </View>
      <Text style={styles.packagePrice}>{item.product.priceString}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94e77" />
      </Screen>
    );
  }

  const hasPackages = offerings?.availablePackages?.length > 0;

  return (
    <Screen scrollable={false} style={styles.container}>
      <Text style={styles.headerTitle}>Unlock Premium</Text>
      <Text style={styles.subtitle}>Get access to advanced filters, direct messaging, and more.</Text>

      {hasPackages ? (
        <FlatList
          data={offerings.availablePackages}
          keyExtractor={(item) => item.identifier}
          renderItem={renderPackage}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noPackagesContainer}>
          <Text style={styles.noPackagesText}>No subscription packages available right now.</Text>
        </View>
      )}

      <TouchableOpacity onPress={handleRestore} style={styles.restoreButton} disabled={purchasing}>
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>

      <Primary
        title="Cancel"
        onPress={() => navigation.goBack()}
        type="secondary"
        style={styles.cancelButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 30,
  },
  listContent: {
    paddingBottom: 20,
  },
  packageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  packageDetails: {
    flex: 1,
    paddingRight: 15,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: '#8e8e93',
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e94e77',
  },
  noPackagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPackagesText: {
    color: '#8e8e93',
    fontSize: 16,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  restoreText: {
    color: '#8e8e93',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  cancelButton: {
    marginTop: 8,
    marginBottom: 20,
  },
});
