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

export default function SalesDetailScreen({ navigation, route }) {
  const { sale } = route.params;

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

  const calculateTotal = () => {
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

  const handleDeleteSale = () => {
    Alert.alert(
      'Eliminar Venta',
      '¿Estás seguro de que quieres eliminar esta venta? Esta acción no se puede deshacer.',
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
              await StorageService.deleteSale(sale.id);
              Alert.alert('Éxito', 'Venta eliminada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la venta');
            }
          },
        },
      ]
    );
  };

  const renderPaymentDetails = (title, paymentData) => {
    // Si es un array de múltiples pagos
    if (Array.isArray(paymentData)) {
      const totalAmount = paymentData.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
      if (totalAmount === 0 && paymentData.every(payment => !payment.description)) {
        return null;
      }

      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {paymentData.map((payment, index) => (
            <View key={index} style={styles.debtDetail}>
              {payment.description && (
                <Text style={styles.description}>"{payment.description}"</Text>
              )}
              <Text style={styles.amount}>${(payment.amount || 0).toLocaleString()}</Text>
            </View>
          ))}
          {paymentData.length > 1 && (
            <View style={styles.debtTotal}>
              <Text style={styles.debtTotalText}>Total {title}: ${totalAmount.toLocaleString()}</Text>
            </View>
          )}
        </View>
      );
    }

    // Si es un objeto individual (compatibilidad hacia atrás)
    if (!paymentData || (paymentData.amount === 0 && !paymentData.description)) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.paymentDetail}>
          {paymentData.description && (
            <Text style={styles.description}>"{paymentData.description}"</Text>
          )}
          <Text style={styles.amount}>${paymentData.amount?.toLocaleString() || '0'}</Text>
        </View>
      </View>
    );
  };


  const renderCashDetail = () => {
    if (!sale.efectivo || (sale.efectivo.total === 0 && Object.values(sale.efectivo.amounts || {}).every(val => !val || val === '0' || val === 0))) {
      return null;
    }

    const billTypes = ['20.000', '10.000', '5.000', '2.000', '1.000'];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Efectivo</Text>
        <View style={styles.cashDetail}>
          {billTypes.map(billType => {
            const amount = sale.efectivo.amounts[billType];
            if (!amount || (amount === '0' || amount === 0)) return null;

            return (
              <View key={billType} style={styles.cashBillDetail}>
                <Text style={styles.billType}>
                  Billetes de {billType}: ${amount.toLocaleString()}
                </Text>
                <Text style={styles.billSubtotal}>${parseFloat(amount).toLocaleString()}</Text>
              </View>
            );
          })}
          <View style={styles.cashTotal}>
            <Text style={styles.cashTotalText}>Total Efectivo: ${sale.efectivo.total?.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(sale.date)}</Text>
          <Text style={styles.totalText}>Total: ${calculateTotal().toLocaleString()}</Text>
        </View>

        {renderPaymentDetails('Transferencias', sale.transferencias)}
        {renderPaymentDetails('Getnet', sale.getnet)}
        {renderPaymentDetails('Mercado Pago', sale.mercadoPago)}
        {renderPaymentDetails('Deudas', sale.deudas)}
        {renderPaymentDetails('Gastos', sale.gastos)}
        {renderCashDetail()}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transferencias:</Text>
            <Text style={styles.summaryValue}>
              ${Array.isArray(sale.transferencias) 
                ? sale.transferencias.reduce((sum, payment) => sum + (payment.amount || 0), 0).toLocaleString()
                : (sale.transferencias?.amount || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Getnet:</Text>
            <Text style={styles.summaryValue}>
              ${Array.isArray(sale.getnet) 
                ? sale.getnet.reduce((sum, payment) => sum + (payment.amount || 0), 0).toLocaleString()
                : (sale.getnet?.amount || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mercado Pago:</Text>
            <Text style={styles.summaryValue}>
              ${Array.isArray(sale.mercadoPago) 
                ? sale.mercadoPago.reduce((sum, payment) => sum + (payment.amount || 0), 0).toLocaleString()
                : (sale.mercadoPago?.amount || 0).toLocaleString()}
            </Text>
          </View>
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>Deudas:</Text>
    <Text style={styles.summaryValue}>
      ${Array.isArray(sale.deudas) 
        ? sale.deudas.reduce((total, debt) => total + (debt.amount || 0), 0).toLocaleString()
        : (sale.deudas?.amount || 0).toLocaleString()}
    </Text>
  </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Efectivo:</Text>
            <Text style={styles.summaryValue}>${(sale.efectivo?.total || 0).toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gastos:</Text>
            <Text style={styles.summaryValue}>
              ${Array.isArray(sale.gastos) 
                ? sale.gastos.reduce((sum, gasto) => sum + (gasto.amount || 0), 0).toLocaleString()
                : (sale.gastos?.amount || 0).toLocaleString()}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>${calculateTotal().toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSale}>
          <Text style={styles.deleteButtonText}>Eliminar Venta</Text>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 10,
  },
  paymentDetail: {
    gap: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cashDetail: {
    gap: 8,
  },
  cashBillDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billType: {
    fontSize: 16,
    color: '#333',
  },
  billSubtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8B57',
  },
  cashTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cashTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B8B57',
    textAlign: 'center',
  },
  summary: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 15,
    paddingTop: 15,
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
  debtDetail: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  debtTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  debtTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
});
