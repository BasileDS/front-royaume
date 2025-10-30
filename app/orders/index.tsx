import { BackButton, ThemedText, ThemedView } from '@/components/common';
import { ReceiptLineService, useUserReceiptLines } from '@/src/features/receipts';
import { useUserStats } from '@/src/features/gains';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

export default function OrdersScreen() {
  const { receiptLines, loading, error } = useUserReceiptLines();
  const { totalXP, loading: loadingXP } = useUserStats();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes commandes</Text>
          <BackButton />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <ThemedText style={styles.loadingText}>Chargement...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes commandes</Text>
          <BackButton />
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            ❌ Erreur lors du chargement des commandes
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes commandes</Text>
        <BackButton />
      </View>

      {/* Stats totales */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{receiptLines.length}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Image
            source={require('@/assets/images/icon_xp_small.png')}
            style={styles.statIconImage}
          />
          <Text style={[styles.statValue, styles.xpValue]}>
            {loadingXP ? '...' : totalXP.toLocaleString('fr-FR')}
          </Text>
          <Text style={styles.statLabel}>XP Gagnés</Text>
        </View>
      </View>

      {/* Liste des receipt_lines */}
      {receiptLines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🧾</Text>
          <ThemedText style={styles.emptyText}>
            Aucun paiement pour le moment
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Vos paiements apparaîtront ici
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={receiptLines}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.receiptCard}>
              <View style={styles.receiptHeader}>
                <View style={styles.receiptInfo}>
                  <Text style={styles.establishmentName}>
                    {item.receipt?.establishment_name || `Établissement #${item.receipt?.establishment_id || '?'}`}
                  </Text>
                  <Text style={styles.receiptDate}>
                    {new Date(item.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View style={styles.receiptAmount}>
                  <Text style={styles.amount}>
                    {ReceiptLineService.formatAmount(item.amount)}
                  </Text>
                </View>
              </View>
              <View style={styles.receiptFooter}>
                <View style={styles.paymentBadgeContainer}>
                  {ReceiptLineService.isCashbackPayment(item.payment_method) ? (
                    <Image
                      source={require('@/assets/images/icon_paraiges_small.png')}
                      style={styles.paymentIcon}
                    />
                  ) : (
                    <Text style={styles.cardIcon}>💳</Text>
                  )}
                  <Text style={styles.paymentText}>
                    {ReceiptLineService.formatPaymentMethod(item.payment_method)}
                  </Text>
                </View>
                <Text style={styles.receiptId}>Ligne #{item.id}</Text>
              </View>
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconImage: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  xpValue: {
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  receiptCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  receiptInfo: {
    flex: 1,
  },
  establishmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 14,
    color: '#666',
  },
  receiptAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  receiptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paymentBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  paymentBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 8,
  },
  paymentIcon: {
    width: 16,
    height: 16,
  },
  cardIcon: {
    fontSize: 16,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  receiptId: {
    fontSize: 12,
    color: '#999',
  },
});
