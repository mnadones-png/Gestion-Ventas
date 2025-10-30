# Gestión de Ventas – Verdulería

Aplicación móvil (Expo/React Native) para registrar ventas diarias por método de pago, calcular IVA de montos, y consultar históricos con detalle. Pensada para el flujo operativo de una verdulería, pero útil para cualquier pequeño comercio.

## Características
- Registro de ventas del día por categorías: `Transferencias`, `Getnet`, `Mercado Pago`, `Deudas`, `Efectivo` y `Gastos`.
- Cálculo de IVA: ingresa el monto total con IVA y obtén neto e IVA; guarda múltiples cálculos.
- Historial de Ventas e IVA: listas con búsqueda, detalle y opción de eliminar.
- Navegación sencilla con `Stack Navigator` y diseño enfocado en claridad.
- Persistencia local con `AsyncStorage` (funciona sin conexión).

## Tecnologías
- `React Native` + `Expo`
- `@react-navigation/stack` para navegación
- `@react-native-async-storage/async-storage` para almacenamiento
- `react-native-safe-area-context` para compatibilidad visual

## Estructura de la App
- `App.js`: configura el `Stack Navigator` y las pantallas.
- `screens/`
  - `HomeScreen.js`: menú principal.
  - `RegisterSalesScreen.js`: formulario para registrar ventas del día.
  - `SalesHistoryScreen.js`: listado de ventas guardadas con búsqueda.
  - `SalesDetailScreen.js`: detalle de una venta específica.
  - `IvaCalculatorScreen.js`: cálculo de IVA y lista de cálculos.
  - `IvaHistoryScreen.js`: historial de cálculos de IVA.
  - `IvaDetailScreen.js`: detalle de cálculo de IVA.
- `utils/storageService.js`: servicio que persiste y consulta ventas y cálculos.

## Requisitos
- Node.js 18+
- Expo CLI (opcional, se puede usar `npx expo`)
- Dispositivo o emulador Android/iOS, o navegador para modo web.

## Instalación
```bash
npm install
```

## Ejecución
- Iniciar servidor de desarrollo:
```bash
npm start
```
- Abrir en Android:
```bash
npm run android
```
- Abrir en iOS (macOS requerido):
```bash
npm run ios
```
- Modo web:
```bash
npm run web
```

## Uso Rápido
1. Abre la app y entra a `Registrar Ventas` para cargar ventas del día por método de pago. El efectivo se ingresa por denominación.
2. Presiona `Guardar` para persistir la venta. Se limpia el formulario al confirmar.
3. Consulta ventas anteriores en `Historial de Ventas` y entra al `Detalle` para ver el desglose y eliminar si es necesario.
4. Para cálculos de IVA, ve a `Cálculo IVA`, ingresa cliente y monto total con IVA, calcula y guarda. Revisa el `Historial de IVA` para ver detalles y eliminar.

## Almacenamiento de Datos
Se guarda en `AsyncStorage` con dos claves:
- `sales_data`: lista de ventas. Cada venta incluye: `id`, `date` (ISO), `transferencias`, `getnet`, `mercadoPago`, `deudas` (arrays u objetos con `{ description?, amount }`), `efectivo` (`{ amounts: Record<string,string>, total: number }`) y `gastos` (array u objeto).
- `iva_calculations`: lista de cálculos de IVA. Cada cálculo: `id`, `fecha` (ISO), `calculos` (array con formulario por cliente) y `totales` (resumen de montos).

## Notas de Desarrollo
- Los montos se formatean para visualización y luego se normalizan a `number` al guardar.
- Las pantallas están documentadas con bloques JSDoc para facilitar mantenimiento.
- `Settings` incluye acciones placeholder (p. ej., limpieza total) listas para implementar.

## Contribuir
Los PRs son bienvenidos. Para cambios grandes, abre un issue y describe el alcance.

## Créditos
Desarrollado para "Verdulería Rafita" como sistema interno de gestión.