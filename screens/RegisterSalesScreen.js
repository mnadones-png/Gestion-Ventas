import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../utils/storageService';

export default function RegisterSalesScreen({ navigation }) {
  const [transferencias, setTransferencias] = useState([
    { id: 1, description: '', amount: '' }
  ]);
  const [getnet, setGetnet] = useState([
    { id: 1, description: '', amount: '' }
  ]);
  const [mercadoPago, setMercadoPago] = useState([
    { id: 1, description: '', amount: '' }
  ]);
  const [deudas, setDeudas] = useState([
    { id: 1, description: '', amount: '' }
  ]);
  const [cashBills, setCashBills] = useState({
    '20.000': '',
    '10.000': '',
    '5.000': '',
    '2.000': '',
    '1.000': ''
  });

  const [gastos, setGastos] = useState([
    { id: 1, description: '', amount: '' }
  ]);

  const updatePaymentMethod = (method, paymentId, field, value) => {
    if (method === 'transferencias') {
      setTransferencias(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, [field]: value }
            : payment
        )
      );
    } else if (method === 'getnet') {
      setGetnet(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, [field]: value }
            : payment
        )
      );
    } else if (method === 'mercadoPago') {
      setMercadoPago(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, [field]: value }
            : payment
        )
      );
    } else if (method === 'deudas') {
      setDeudas(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, [field]: value }
            : payment
        )
      );
    }
  };

  const addPaymentMethod = (method) => {
    if (method === 'transferencias') {
      const newId = Math.max(...transferencias.map(p => p.id)) + 1;
      setTransferencias(prev => [...prev, { id: newId, description: '', amount: '' }]);
    } else if (method === 'getnet') {
      const newId = Math.max(...getnet.map(p => p.id)) + 1;
      setGetnet(prev => [...prev, { id: newId, description: '', amount: '' }]);
    } else if (method === 'mercadoPago') {
      const newId = Math.max(...mercadoPago.map(p => p.id)) + 1;
      setMercadoPago(prev => [...prev, { id: newId, description: '', amount: '' }]);
    } else if (method === 'deudas') {
      const newId = Math.max(...deudas.map(p => p.id)) + 1;
      setDeudas(prev => [...prev, { id: newId, description: '', amount: '' }]);
    }
  };

  const removePaymentMethod = (method, paymentId) => {
    if (method === 'transferencias' && transferencias.length > 1) {
      setTransferencias(prev => prev.filter(payment => payment.id !== paymentId));
    } else if (method === 'getnet' && getnet.length > 1) {
      setGetnet(prev => prev.filter(payment => payment.id !== paymentId));
    } else if (method === 'mercadoPago' && mercadoPago.length > 1) {
      setMercadoPago(prev => prev.filter(payment => payment.id !== paymentId));
    } else if (method === 'deudas' && deudas.length > 1) {
      setDeudas(prev => prev.filter(payment => payment.id !== paymentId));
    } else if (method === 'gastos' && gastos.length > 1) {
      setGastos(prev => prev.filter(payment => payment.id !== paymentId));
    }
  };

  const updateGasto = (gastoId, field, value) => {
    setGastos(prev => 
      prev.map(gasto => 
        gasto.id === gastoId 
          ? { ...gasto, [field]: value }
          : gasto
      )
    );
  };

  const addGasto = () => {
    const newId = Math.max(...gastos.map(g => g.id)) + 1;
    setGastos(prev => [...prev, { id: newId, description: '', amount: '' }]);
  };

  const formatAmount = (amount) => {
    if (!amount || amount === '') return '';
    const cleanAmount = amount.toString().replace(/[,\s]/g, '');
    const numValue = parseFloat(cleanAmount);
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('es-DE');
  };

  const updateCashBills = (billType, value) => {
    setCashBills(prev => ({
      ...prev,
      [billType]: value
    }));
  };

  const calculateCashTotal = () => {
    let total = 0;
    Object.keys(cashBills).forEach(billType => {
      const amountStr = cashBills[billType];
      if (amountStr && typeof amountStr === 'string') {
        const amount = parseFloat(amountStr.replace(/[,\s]/g, '')) || 0;
        total += amount;
      }
    });
    return total;
  };


  const calculateTotalGenerated = () => {
    let total = 0;
    
    // Transferencias
    transferencias.forEach(payment => {
      const amount = payment.amount || '';
      total += parseFloat(amount.replace(/[,\s]/g, '') || 0);
    });
    
    // Getnet
    getnet.forEach(payment => {
      const amount = payment.amount || '';
      total += parseFloat(amount.replace(/[,\s]/g, '') || 0);
    });
    
    // Mercado Pago
    mercadoPago.forEach(payment => {
      const amount = payment.amount || '';
      total += parseFloat(amount.replace(/[,\s]/g, '') || 0);
    });
    
    // Deudas
    deudas.forEach(debt => {
      const debtAmount = debt.amount || '';
      total += parseFloat(debtAmount.replace(/[,\s]/g, '') || 0);
    });
    
    // Efectivo
    total += calculateCashTotal();

    // Gastos (se suman al total)
    gastos.forEach(gasto => {
      const gastoAmount = gasto.amount || '';
      total += parseFloat(gastoAmount.replace(/[,\s]/g, '') || 0);
    });
    
    return total;
  };

  const calculateTotalGastos = () => {
    let total = 0;
    gastos.forEach(gasto => {
      const amount = gasto.amount || '';
      total += parseFloat(amount.replace(/[,\s]/g, '') || 0);
    });
    return total;
  };

  const validateAndSaveSale = async () => {
    try {
      const saleData = {
        transferencias: transferencias.map(payment => ({
          description: payment.description || '',
          amount: parseFloat((payment.amount || '').replace(/[,\s]/g, '') || 0)
        })),
        getnet: getnet.map(payment => ({
          description: payment.description || '',
          amount: parseFloat((payment.amount || '').replace(/[,\s]/g, '') || 0)
        })),
        mercadoPago: mercadoPago.map(payment => ({
          description: payment.description || '',
          amount: parseFloat((payment.amount || '').replace(/[,\s]/g, '') || 0)
        })),
        deudas: deudas.map(debt => ({
          description: debt.description || '',
          amount: parseFloat((debt.amount || '').replace(/[,\s]/g, '') || 0)
        })),
        efectivo: {
          amounts: { ...cashBills },
          total: calculateCashTotal()
        },
        gastos: gastos.map(gasto => ({
          description: gasto.description || '',
          amount: parseFloat((gasto.amount || '').replace(/[,\s]/g, '') || 0)
        })),
        totalGastos: calculateTotalGastos()
      };

      await StorageService.saveSale(saleData);
      
      Alert.alert(
        'Éxito',
        'Venta registrada correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpiar formulario
              setTransferencias([{ id: 1, description: '', amount: '' }]);
              setGetnet([{ id: 1, description: '', amount: '' }]);
              setMercadoPago([{ id: 1, description: '', amount: '' }]);
              setDeudas([{ id: 1, description: '', amount: '' }]);
              setGastos([{ id: 1, description: '', amount: '' }]);
              setCashBills({
                '20.000': '',
                '10.000': '',
                '5.000': '',
                '2.000': '',
                '1.000': ''
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la venta');
    }
  };

  const renderPaymentSection = (title, paymentArray, paymentName) => (
    <View style={styles.section}>
      <View style={styles.debtsHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => addPaymentMethod(paymentName)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      {paymentArray.map((payment, index) => (
        <View key={payment.id} style={styles.debtItem}>
          <View style={styles.debtItemHeader}>
            <Text style={styles.debtNumber}>{title} {index + 1}</Text>
            {paymentArray.length > 1 && (
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => removePaymentMethod(paymentName, payment.id)}
              >
                <Text style={styles.removeButtonText}>-</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={payment.description}
              onChangeText={(value) => updatePaymentMethod(paymentName, payment.id, 'description', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Monto"
              value={payment.amount}
              onChangeText={(value) => {
                const formattedValue = formatAmount(value);
                updatePaymentMethod(paymentName, payment.id, 'amount', formattedValue);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>
      ))}
    </View>
  );


  const renderCashSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Efectivo</Text>
      <View style={styles.cashContainer}>
        {Object.keys(cashBills).map(billType => (
          <View key={billType} style={styles.cashBillRow}>
            <View style={styles.cashBillInfo}>
              <Text style={styles.cashBillLabel}>Billetes de {billType}</Text>
            </View>
            <TextInput
              style={styles.cashBillInput}
              placeholder="Monto en pesos"
              value={cashBills[billType]}
              onChangeText={(value) => {
                const formattedValue = formatAmount(value);
                updateCashBills(billType, formattedValue);
              }}
              keyboardType="numeric"
            />
          </View>
        ))}
        {calculateCashTotal() > 0 && (
          <View style={styles.totalCashContainer}>
            <Text style={styles.totalCashText}>
              Total Efectivo: ${calculateCashTotal().toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Registro de Ventas</Text>
        
        {renderPaymentSection('Transferencias', transferencias, 'transferencias')}
        {renderPaymentSection('Getnet', getnet, 'getnet')}
        {renderPaymentSection('Mercado Pago', mercadoPago, 'mercadoPago')}
        {renderPaymentSection('Deudas', deudas, 'deudas')}
        {renderCashSection()}
        
        {/* Sección de Gastos */}
        <View style={styles.section}>
          <View style={styles.debtsHeader}>
            <Text style={styles.sectionTitle}>Gastos</Text>
            <TouchableOpacity style={styles.addButton} onPress={addGasto}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          {gastos.map((gasto, index) => (
            <View key={gasto.id} style={styles.debtItem}>
              <View style={styles.debtItemHeader}>
                <Text style={styles.debtNumber}>Gasto {index + 1}</Text>
                {gastos.length > 1 && (
                  <TouchableOpacity 
                    style={styles.removeButton} 
                    onPress={() => removePaymentMethod('gastos', gasto.id)}
                  >
                    <Text style={styles.removeButtonText}>-</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Descripción del gasto"
                  value={gasto.description}
                  onChangeText={(value) => updateGasto(gasto.id, 'description', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Monto"
                  value={gasto.amount}
                  onChangeText={(value) => {
                    const formattedValue = formatAmount(value);
                    updateGasto(gasto.id, 'amount', formattedValue);
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
          ))}
          {calculateTotalGastos() > 0 && (
            <View style={styles.totalCashContainer}>
              <Text style={[styles.totalCashText, { color: '#dc3545' }]}>
                Total Gastos: ${calculateTotalGastos().toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total Generado el día de {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <Text style={styles.totalAmount}>
            ${calculateTotalGenerated().toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={validateAndSaveSale}>
          <Text style={styles.saveButtonText}>Guardar Venta</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
    textAlign: 'center',
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
  inputGroup: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  cashContainer: {
    gap: 10,
  },
  cashBillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cashBillInfo: {
    flex: 1 },
  cashBillLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cashBillQuantity: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '500',
    marginTop: 4,
  },
  cashBillInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  totalCashContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  totalCashText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  debtsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#2E8B57',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  debtItem: {
    marginBottom: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  debtItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  debtNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8B57',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
});
