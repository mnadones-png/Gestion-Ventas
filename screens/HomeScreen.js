/**
 * Pantalla: Inicio
 * Presenta el menú principal de la app y navega a:
 * Registrar Ventas, Historial de Ventas, Cálculo de IVA, Historial de IVA y Configuración.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.companyName}>Verdulería Rafita</Text>
          <Text style={styles.subtitle}>Sistema de Gestión de Ventas</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuButton, styles.primaryButton]}
            onPress={() => navigation.navigate('RegisterSales')}
          >
            <Text style={styles.buttonText}>Registrar Ventas del Día</Text>
            <Text style={styles.buttonSubtext}>Ingresa las ventas realizadas hoy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('SalesHistory')}
          >
            <Text style={styles.buttonText}>Historial de Ventas</Text>
            <Text style={styles.buttonSubtext}>Consulta ventas anteriores</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.tertiaryButton]}
            onPress={() => navigation.navigate('IvaCalculator')}
          >
            <Text style={styles.buttonText}>Cálculo IVA</Text>
            <Text style={styles.buttonSubtext}>Calcular IVA de ventas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.quaternaryButton]}
            onPress={() => navigation.navigate('IvaHistory')}
          >
            <Text style={styles.buttonText}>Historial de IVA</Text>
            <Text style={styles.buttonSubtext}>Ver cálculos anteriores</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={[styles.menuButton, styles.senaryButton]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.buttonText}>Configuración</Text>
            <Text style={styles.buttonSubtext}>Ajustes de la aplicación</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '300',
  },
  companyName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    fontWeight: '300',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuButton: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#2E8B57',
  },
  secondaryButton: {
    backgroundColor: '#458B74',
  },
  tertiaryButton: {
    backgroundColor: '#5F9F80',
  },
  quaternaryButton: {
    backgroundColor: '#7AB890',
  },
  senaryButton: {
    backgroundColor: '#9DD0B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSubtext: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
});
