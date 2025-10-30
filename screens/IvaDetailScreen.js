import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../utils/storageService';

export default function IvaDetailScreen({ navigation, route }) {
  const { calculation } = route.params;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteCalculation = () => {
    Alert.alert(
      'Eliminar Cálculo',
      '¿Estás seguro de que quieres eliminar este cálculo de IVA? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteIvaCalculation(calculation.id);
              Alert.alert('Éxito', 'Cálculo eliminado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el cálculo');
            }
          },
        },
      ]
    );
  };

  const renderCalculationItem = (item, index) => (
    <View key={index} style={styles.calculationItem}>
      <View style={styles.calculationHeader}>
        <Text style={styles.clientText}>{item.cliente}</Text>
        <Text style={styles.dateText}>{item.fecha}</Text>
      </View>
      <View style={styles.calculationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Monto Total:</Text>
          <Text style={styles.detailValue}>${item.montoTotal.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Monto Neto:</Text>
          <Text style={styles.detailValue}>${item.montoNeto.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IVA (19%):</Text>
          <Text style={styles.detailValue}>${item.iva.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(calculation.fecha)}</Text>
          <Text style={styles.totalText}>Total: ${calculation.totales.totalMonto.toLocaleString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cálculos Individuales</Text>
          {calculation.calculos.map(renderCalculationItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen Total</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Monto:</Text>
              <Text style={styles.summaryValue}>${calculation.totales.totalMonto.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Neto:</Text>
              <Text style={styles.summaryValue}>${calculation.totales.totalNeto.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total IVA:</Text>
              <Text style={styles.summaryValue}>${calculation.totales.totalIva.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>TOTAL GENERAL:</Text>
              <Text style={styles.totalValue}>${calculation.totales.totalMonto.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCalculation}>
          <Text style={styles.deleteButtonText}>Eliminar Cálculo</Text>
        </TouchableOpacity>
      </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 15,
  },
  calculationItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  calculationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calculationDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryContainer: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#2E8B57',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
