import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import RegisterSalesScreen from './screens/RegisterSalesScreen';
import SalesHistoryScreen from './screens/SalesHistoryScreen';
import SalesDetailScreen from './screens/SalesDetailScreen';
import IvaCalculatorScreen from './screens/IvaCalculatorScreen';
import IvaHistoryScreen from './screens/IvaHistoryScreen';
import IvaDetailScreen from './screens/IvaDetailScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2E8B57', // Verde verduría
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Verduleria Rafita' }}
          />
          <Stack.Screen 
            name="RegisterSales" 
            component={RegisterSalesScreen} 
            options={{ title: 'Registrar Ventas' }}
          />
          <Stack.Screen 
            name="SalesHistory" 
            component={SalesHistoryScreen} 
            options={{ title: 'Historial de Ventas' }}
          />
          <Stack.Screen 
            name="SalesDetail" 
            component={SalesDetailScreen} 
            options={{ title: 'Detalle de Venta' }}
          />
          <Stack.Screen 
            name="IvaCalculator" 
            component={IvaCalculatorScreen} 
            options={{ title: 'Cálculo de IVA' }}
          />
          <Stack.Screen 
            name="IvaHistory" 
            component={IvaHistoryScreen} 
            options={{ title: 'Historial de IVA' }}
          />
          <Stack.Screen 
            name="IvaDetail" 
            component={IvaDetailScreen} 
            options={{ title: 'Detalle de Cálculo IVA' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Configuración' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}