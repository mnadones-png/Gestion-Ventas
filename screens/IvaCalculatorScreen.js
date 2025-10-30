/**
 * Pantalla: Cálculo de IVA
 * Calcula neto e IVA a partir de un monto total con IVA y un cliente.
 * Permite acumular múltiples cálculos en una lista y guardarlos mediante StorageService.
 *
 * Estado:
 * - cliente: string
 * - monto: string (formateado, total con IVA)
 * - calculos: Array<{ cliente, fecha, montoTotal, neto, iva, porcentajeIva }>
 */
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

export default function IvaCalculatorScreen({ navigation }) {
  const [cliente, setCliente] = useState('');
  const [monto, setMonto] = useState('');
  const [calculos, setCalculos] = useState([]);

  const formatAmount = (amount) => {
    if (!amount || amount === '') return '';
    const cleanAmount = amount.toString().replace(/[,\s]/g, '');
    const numValue = parseFloat(cleanAmount);
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('es-DE');
  };

  const calculateIva = () => {
    if (!cliente.trim() || !monto.trim()) {
      return;
    }

    const montoNumerico = parseFloat(monto.replace(/[,\s]/g, '')) || 0;
    
    // Fórmula: Base = precioFinal / 1.19
    const base = montoNumerico / 1.19;
    const iva = montoNumerico - base;
    
    const nuevoCalculo = {
      id: Date.now(),
      cliente: cliente.trim(),
      montoTotal: montoNumerico,
      montoNeto: base,
      iva: iva,
      fecha: new Date().toLocaleString('es-ES')
    };

    setCalculos(prev => [nuevoCalculo, ...prev]);
    setCliente('');
    setMonto('');
  };

  const clearAll = () => {
    setCalculos([]);
  };

  const saveCalculations = async () => {
    if (calculos.length === 0) {
      Alert.alert('Error', 'No hay cálculos para guardar');
      return;
    }

    try {
      const totales = getTotales();
      const calculationData = {
        calculos: calculos,
        totales: totales,
        fecha: new Date().toISOString()
      };

      await StorageService.saveIvaCalculation(calculationData);
      
      Alert.alert(
        'Éxito',
        'Cálculos de IVA guardados correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              setCalculos([]);
              setCliente('');
              setMonto('');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cálculos');
    }
  };

  const getTotales = () => {
    const totalMonto = calculos.reduce((sum, calc) => sum + calc.montoTotal, 0);
    const totalNeto = calculos.reduce((sum, calc) => sum + calc.montoNeto, 0);
    const totalIva = calculos.reduce((sum, calc) => sum + calc.iva, 0);
    
    return { totalMonto, totalNeto, totalIva };
  };

  const renderCalculoItem = (item) => (
    <View key={item.id} style={styles.calculoItem}>
      <View style={styles.calculoHeader}>
        <Text style={styles.clienteText}>{item.cliente}</Text>
        <Text style={styles.fechaText}>{item.fecha}</Text>
      </View>
      <View style={styles.calculoDetails}>
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

  const totales = getTotales();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Cálculo de IVA</Text>
        
        {/* Formulario de entrada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuevo Cálculo</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Cliente"
              value={cliente}
              onChangeText={setCliente}
            />
            <TextInput
              style={styles.input}
              placeholder="Monto Total (con IVA)"
              value={monto}
              onChangeText={(value) => {
                const formattedValue = formatAmount(value);
                setMonto(formattedValue);
              }}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.calculateButton} onPress={calculateIva}>
            <Text style={styles.calculateButtonText}>Calcular IVA</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de cálculos */}
        {calculos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cálculos Realizados</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={saveCalculations}>
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
                  <Text style={styles.clearButtonText}>Limpiar</Text>
                </TouchableOpacity>
              </View>
            </View>
            {calculos.map(renderCalculoItem)}
          </View>
        )}

        {/* Resumen de totales */}
        {calculos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen Total</Text>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Monto:</Text>
                <Text style={styles.summaryValue}>${totales.totalMonto.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Neto:</Text>
                <Text style={styles.summaryValue}>${totales.totalNeto.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total IVA:</Text>
                <Text style={styles.summaryValue}>${totales.totalIva.toLocaleString()}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>TOTAL GENERAL:</Text>
                <Text style={styles.totalValue}>${totales.totalMonto.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Información sobre la fórmula */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <Text style={styles.infoText}>
            Fórmula utilizada: Base = Precio Final ÷ 1.19
          </Text>
          <Text style={styles.infoText}>
            IVA = Precio Final - Base
          </Text>
          <Text style={styles.infoText}>
            El monto ingresado se considera como precio final (incluye IVA)
          </Text>
        </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  calculateButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 6,
    padding: 8,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    borderRadius: 6,
    padding: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  calculoItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  calculoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clienteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fechaText: {
    fontSize: 12,
    color: '#666',
  },
  calculoDetails: {
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
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
  },
});
