import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../utils/storageService';

export default function SalesHistoryScreen({ navigation }) {
  const [sales, setSales] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadSales = async () => {
    try {
      const allSales = await StorageService.getAllSales();
      // Ordenar por fecha más reciente
      setSales(allSales.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading sales:', error);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSales().finally(() => setRefreshing(false));
  };

  const getFilteredSales = () => {
    if (!searchText.trim()) return sales;
    
    return sales.filter(sale => {
      const date = new Date(sale.date).toLocaleDateString();
      const searchTerm = searchText.toLowerCase();
      return date.includes(searchTerm);
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (sale) => {
    let total = 0;
    
    // Manejar múltiples transferencias
    if (Array.isArray(sale.transferencias)) {
      total += sale.transferencias.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    } else {
      total += sale.transferencias?.amount || 0;
    }
    
    // Manejar múltiples getnet
    if (Array.isArray(sale.getnet)) {
      total += sale.getnet.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    } else {
      total += sale.getnet?.amount || 0;
    }
    
    // Manejar múltiples mercado pago
    if (Array.isArray(sale.mercadoPago)) {
      total += sale.mercadoPago.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    } else {
      total += sale.mercadoPago?.amount || 0;
    }
    
    // Manejar múltiples deudas
    if (Array.isArray(sale.deudas)) {
      total += sale.deudas.reduce((sum, debt) => sum + (debt.amount || 0), 0);
    } else {
      total += sale.deudas?.amount || 0;
    }
    
    total += sale.efectivo?.total || 0;
    
    // Gastos
    if (Array.isArray(sale.gastos)) {
      total += sale.gastos.reduce((sum, gasto) => sum + (gasto.amount || 0), 0);
    } else {
      total += sale.gastos?.amount || 0;
    }
    
    return total;
  };

  const renderSaleItem = ({ item }) => {
    const total = calculateTotal(item);
    return (
      <TouchableOpacity
        style={styles.saleItem}
        onPress={() => navigation.navigate('SalesDetail', { sale: item })}
      >
        <View style={styles.saleHeader}>
          <Text style={styles.saleDate}>{formatDate(item.date)}</Text>
          <Text style={styles.saleTotal}>${total.toLocaleString()}</Text>
        </View>
        <View style={styles.saleSummary}>
          <Text style={styles.saleSummaryText}>
            Transf: ${Array.isArray(item.transferencias) 
              ? item.transferencias.reduce((sum, payment) => sum + (payment.amount || 0), 0)
              : (item.transferencias?.amount || 0)} | 
            Efectivo: ${item.efectivo?.total || 0} | 
            Gastos: ${Array.isArray(item.gastos) 
              ? item.gastos.reduce((sum, gasto) => sum + (gasto.amount || 0), 0)
              : (item.gastos?.amount || 0)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay ventas registradas</Text>
      <Text style={styles.emptySubtext}>
        Comienza registrando tus primeras ventas
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por fecha..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Total de ventas: {getFilteredSales().length}
          </Text>
          {sales.length > 0 && (
            <Text style={styles.statsText}>
              Fecha más reciente: {formatDate(sales[0].date)}
            </Text>
          )}
        </View>

        <FlatList
          data={getFilteredSales()}
          keyExtractor={(item) => item.id}
          renderItem={renderSaleItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={sales.length === 0 ? styles.emptyListContainer : null}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  saleItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saleDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saleTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  saleSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleSummaryText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  emptyListContainer: {
    flexGrow: 1,
  },
});
