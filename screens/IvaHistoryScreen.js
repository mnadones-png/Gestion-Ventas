/**
 * Pantalla: Historial de IVA
 * Lista cálculos de IVA guardados, permite buscar, refrescar y navegar al detalle.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../utils/storageService';

export default function IvaHistoryScreen({ navigation }) {
  const [calculations, setCalculations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadCalculations = async () => {
    try {
      const allCalculations = await StorageService.getAllIvaCalculations();
      // Ordenar por fecha más reciente
      setCalculations(allCalculations.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (error) {
      console.error('Error loading calculations:', error);
    }
  };

  useEffect(() => {
    loadCalculations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCalculations().finally(() => setRefreshing(false));
  };

  const getFilteredCalculations = () => {
    if (!searchText.trim()) return calculations;
    
    return calculations.filter(calculation => {
      const date = new Date(calculation.fecha).toLocaleDateString();
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

  const renderCalculationItem = ({ item }) => {
    const totalCalculations = item.calculos.length;
    const totalMonto = item.totales.totalMonto;
    
    return (
      <TouchableOpacity
        style={styles.calculationItem}
        onPress={() => navigation.navigate('IvaDetail', { calculation: item })}
      >
        <View style={styles.calculationHeader}>
          <Text style={styles.calculationDate}>{formatDate(item.fecha)}</Text>
          <Text style={styles.calculationTotal}>${totalMonto.toLocaleString()}</Text>
        </View>
        <View style={styles.calculationSummary}>
          <Text style={styles.calculationSummaryText}>
            {totalCalculations} cálculo{totalCalculations !== 1 ? 's' : ''} | 
            Total IVA: ${item.totales.totalIva.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay cálculos de IVA guardados</Text>
      <Text style={styles.emptySubtext}>
        Comienza calculando y guardando tus primeros cálculos de IVA
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
            Total de cálculos guardados: {getFilteredCalculations().length}
          </Text>
          {calculations.length > 0 && (
            <Text style={styles.statsText}>
              Fecha más reciente: {formatDate(calculations[0].fecha)}
            </Text>
          )}
        </View>

        <FlatList
          data={getFilteredCalculations()}
          keyExtractor={(item) => item.id}
          renderItem={renderCalculationItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={getFilteredCalculations().length === 0 ? styles.emptyListContainer : null}
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
  calculationItem: {
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
  calculationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calculationDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calculationTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  calculationSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calculationSummaryText: {
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
