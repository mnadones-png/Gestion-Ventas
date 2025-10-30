/**
 * Pantalla: Configuración
 * Ofrece switches y acciones administrativas (placeholder) como limpiar datos,
 * alternar notificaciones, respaldo automático y modo oscuro.
 * La limpieza completa está preparada para implementar con StorageService.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../utils/storageService';

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleClearAllData = () => {
    Alert.alert(
      'Eliminar Todos los Datos',
      '¿Estás seguro de que quieres eliminar todos los datos de ventas y cálculos de IVA? Esta acción no se puede deshacer.',
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
              // Aquí podrías implementar la lógica para limpiar todos los datos
              Alert.alert('Éxito', 'Todos los datos han sido eliminados');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar los datos');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Datos',
      'Esta funcionalidad permitirá exportar todos los datos en formato CSV o JSON.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Exportar',
          onPress: () => {
            Alert.alert('Información', 'Funcionalidad de exportación en desarrollo');
          },
        },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Importar Datos',
      'Esta funcionalidad permitirá importar datos desde archivos CSV o JSON.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Importar',
          onPress: () => {
            Alert.alert('Información', 'Funcionalidad de importación en desarrollo');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Acerca de Verduría Rafita',
      'Versión 1.0.0\n\nSistema de Gestión de Ventas\nDesarrollado para Verduría Rafita\n\n© 2024 Todos los derechos reservados',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Ayuda',
      'Para obtener ayuda:\n\n• Consulta el manual de usuario\n• Contacta al soporte técnico\n• Revisa las preguntas frecuentes',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (title, subtitle, onPress, rightComponent) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || <Text style={styles.settingArrow}>›</Text>}
    </TouchableOpacity>
  );

  const renderSwitchItem = (title, subtitle, value, onValueChange) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#2E8B57' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Configuración</Text>
        
        {/* Configuración General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {renderSwitchItem(
            'Notificaciones',
            'Recibir notificaciones sobre recordatorios',
            notificationsEnabled,
            setNotificationsEnabled
          )}
          {renderSwitchItem(
            'Respaldo Automático',
            'Crear respaldos automáticos de los datos',
            autoBackupEnabled,
            setAutoBackupEnabled
          )}
          {renderSwitchItem(
            'Modo Oscuro',
            'Usar tema oscuro en la aplicación',
            darkModeEnabled,
            setDarkModeEnabled
          )}
        </View>

        {/* Gestión de Datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Datos</Text>
          {renderSettingItem(
            'Exportar Datos',
            'Exportar todas las ventas y cálculos',
            handleExportData
          )}
          {renderSettingItem(
            'Importar Datos',
            'Importar datos desde archivos',
            handleImportData
          )}
          {renderSettingItem(
            'Eliminar Todos los Datos',
            'Borrar permanentemente todos los datos',
            handleClearAllData
          )}
        </View>

        {/* Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          {renderSettingItem(
            'Acerca de',
            'Información de la aplicación',
            handleAbout
          )}
          {renderSettingItem(
            'Ayuda',
            'Obtener ayuda y soporte',
            handleHelp
          )}
          {renderSettingItem(
            'Versión',
            '1.0.0',
            null
          )}
        </View>

        {/* Estadísticas de la Aplicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Ventas Totales</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Cálculos de IVA</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Días de Uso</Text>
            </View>
          </View>
        </View>

        {/* Información de la Empresa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verduría Rafita</Text>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Verduría Rafita</Text>
            <Text style={styles.companyDescription}>
              Sistema de Gestión de Ventas
            </Text>
            <Text style={styles.companyVersion}>
              Versión 1.0.0
            </Text>
          </View>
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 15,
    marginLeft: 5,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingArrow: {
    fontSize: 20,
    color: '#999',
    marginLeft: 10,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  companyInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 5,
  },
  companyDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  companyVersion: {
    fontSize: 14,
    color: '#999',
  },
});
