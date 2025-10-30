/**
 * Servicio de Almacenamiento
 * Encapsula el acceso a AsyncStorage para persistir:
 * - Ventas del día (clave `sales_data`)
 * - Cálculos de IVA (clave `iva_calculations`)
 *
 * Formatos:
 * - Venta: {
 *     id: string,
 *     date: ISOString,
 *     transferencias: Array<{ description?: string, amount: number }> | { description?: string, amount: number },
 *     getnet: Array<{ description?: string, amount: number }> | { description?: string, amount: number },
 *     mercadoPago: Array<{ description?: string, amount: number }> | { description?: string, amount: number },
 *     deudas: Array<{ description?: string, amount: number }> | { description?: string, amount: number },
 *     efectivo: { amounts: Record<string,string>, total: number },
 *     gastos: Array<{ description?: string, amount: number }> | { description?: string, amount: number }
 *   }
 * - Cálculo IVA: {
 *     id: string,
 *     fecha: ISOString,
 *     calculos: Array<{ cliente: string, montoTotal: number, neto: number, iva: number, porcentajeIva: number }>,
 *     totales: { totalMonto: number, totalNeto: number, totalIva: number }
 *   }
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'sales_data';
const IVA_STORAGE_KEY = 'iva_calculations';

export class StorageService {
  /**
   * Guarda una nueva venta y devuelve el objeto persistido.
   * @param {object} saleData Datos de la venta (sin id y date).
   * @returns {Promise<object>} Venta creada con id y fecha.
   */
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

  /**
   * Obtiene todas las ventas almacenadas.
   * @returns {Promise<Array<object>>} Lista de ventas.
   */
  static async getAllSales() {
    try {
      const sales = await AsyncStorage.getItem(STORAGE_KEY);
      return sales ? JSON.parse(sales) : [];
    } catch (error) {
      console.error('Error getting sales:', error);
      return [];
    }
  }

  /**
   * Obtiene ventas por fecha (día completo, comparando toDateString).
   * @param {string|Date} date Fecha objetivo.
   * @returns {Promise<Array<object>>} Ventas del día indicado.
   */
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

  /**
   * Elimina una venta por id.
   * @param {string} saleId Identificador de la venta.
   * @returns {Promise<void>}
   */
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

  /**
   * Obtiene las ventas del día actual.
   * @returns {Promise<Array<object>>}
   */
  static async getTodaysSales() {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await this.getSalesByDate(today);
    } catch (error) {
      console.error('Error getting today\'s sales:', error);
      return [];
    }
  }

  /**
   * Busca ventas por texto en fecha legible y descripción.
   * @param {string} searchText Texto de búsqueda.
   * @returns {Promise<Array<object>>}
   */
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

  /**
   * Guarda un nuevo cálculo de IVA y devuelve el objeto persistido.
   * @param {object} calculationData Datos del cálculo (sin id).
   * @returns {Promise<object>} Cálculo creado con id.
   */
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

  /**
   * Obtiene todos los cálculos de IVA almacenados.
   * @returns {Promise<Array<object>>}
   */
  static async getAllIvaCalculations() {
    try {
      const calculations = await AsyncStorage.getItem(IVA_STORAGE_KEY);
      return calculations ? JSON.parse(calculations) : [];
    } catch (error) {
      console.error('Error getting IVA calculations:', error);
      return [];
    }
  }

  /**
   * Elimina un cálculo de IVA por id.
   * @param {string} calculationId Identificador del cálculo.
   * @returns {Promise<void>}
   */
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

  /**
   * Obtiene cálculos de IVA por fecha (día completo, comparando toDateString).
   * @param {string|Date} date Fecha objetivo.
   * @returns {Promise<Array<object>>}
   */
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
