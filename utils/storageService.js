import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'sales_data';
const IVA_STORAGE_KEY = 'iva_calculations';

export class StorageService {
  // Guardar una nueva venta
  static async saveSale(saleData) {
    try {
      const sales = await this.getAllSales();
      const newSale = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...saleData,
      };
      sales.push(newSale);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
      return newSale;
    } catch (error) {
      console.error('Error saving sale:', error);
      throw error;
    }
  }

  // Obtener todas las ventas
  static async getAllSales() {
    try {
      const sales = await AsyncStorage.getItem(STORAGE_KEY);
      return sales ? JSON.parse(sales) : [];
    } catch (error) {
      console.error('Error getting sales:', error);
      return [];
    }
  }

  // Obtener ventas por fecha
  static async getSalesByDate(date) {
    try {
      const sales = await this.getAllSales();
      const targetDate = new Date(date).toDateString();
      return sales.filter(sale => {
        const saleDate = new Date(sale.date).toDateString();
        return saleDate === targetDate;
      });
    } catch (error) {
      console.error('Error getting sales by date:', error);
      return [];
    }
  }

  // Eliminar una venta
  static async deleteSale(saleId) {
    try {
      const sales = await this.getAllSales();
      const filteredSales = sales.filter(sale => sale.id !== saleId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSales));
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  }

  // Obtener ventas del día actual
  static async getTodaysSales() {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await this.getSalesByDate(today);
    } catch (error) {
      console.error('Error getting today\'s sales:', error);
      return [];
    }
  }

  // Buscar ventas por texto
  static async searchSales(searchText) {
    try {
      const sales = await this.getAllSales();
      const searchTerm = searchText.toLowerCase();
      return sales.filter(sale => {
        const date = new Date(sale.date).toLocaleDateString().toLowerCase();
        const description = sale.description ? sale.description.toLowerCase() : '';
        return date.includes(searchTerm) || description.includes(searchTerm);
      });
    } catch (error) {
      console.error('Error searching sales:', error);
      return [];
    }
  }

  // ========== MÉTODOS PARA CÁLCULOS DE IVA ==========

  // Guardar un nuevo cálculo de IVA
  static async saveIvaCalculation(calculationData) {
    try {
      const calculations = await this.getAllIvaCalculations();
      const newCalculation = {
        id: Date.now().toString(),
        ...calculationData,
      };
      calculations.push(newCalculation);
      await AsyncStorage.setItem(IVA_STORAGE_KEY, JSON.stringify(calculations));
      return newCalculation;
    } catch (error) {
      console.error('Error saving IVA calculation:', error);
      throw error;
    }
  }

  // Obtener todos los cálculos de IVA
  static async getAllIvaCalculations() {
    try {
      const calculations = await AsyncStorage.getItem(IVA_STORAGE_KEY);
      return calculations ? JSON.parse(calculations) : [];
    } catch (error) {
      console.error('Error getting IVA calculations:', error);
      return [];
    }
  }

  // Eliminar un cálculo de IVA
  static async deleteIvaCalculation(calculationId) {
    try {
      const calculations = await this.getAllIvaCalculations();
      const filteredCalculations = calculations.filter(calc => calc.id !== calculationId);
      await AsyncStorage.setItem(IVA_STORAGE_KEY, JSON.stringify(filteredCalculations));
    } catch (error) {
      console.error('Error deleting IVA calculation:', error);
      throw error;
    }
  }

  // Obtener cálculos de IVA por fecha
  static async getIvaCalculationsByDate(date) {
    try {
      const calculations = await this.getAllIvaCalculations();
      const targetDate = new Date(date).toDateString();
      return calculations.filter(calc => {
        const calcDate = new Date(calc.fecha).toDateString();
        return calcDate === targetDate;
      });
    } catch (error) {
      console.error('Error getting IVA calculations by date:', error);
      return [];
    }
  }
}
