import {
  initializeStoreStorage,
  resetToDemoDefaults,
  getProducts,
  getProductById,
  updateProductStock,
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  calculateCartTotals,
  processSimulatedCheckout,
  getOrders,
  getOrderById,
  getCustomers,
  updateOrderStatus,
  getCommercialSummary,
  getPaymentsLog,
  STORE_RULES
} from './src/services/storeStorage.js';

import {
  calculateDashboardMetrics,
  PRESET_SCENARIOS,
  evaluateAllPlans24M
} from './src/utils/financialFormulas.js';

console.log('================================================================================');
console.log('SUITE DE PRUEBAS AUTOMATIZADAS — FASE B: PERSISTENCIA E-COMMERCE TUESTE');
console.log('================================================================================\n');

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
  testsTotal++;
  if (!condition) {
    console.error(`❌ [FALLO] ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ [OK] ${message}`);
    testsPassed++;
  }
}

// -----------------------------------------------------------------------------
// 1. INICIALIZACIÓN Y RESTAURACIÓN DE DATOS INICIALES
// -----------------------------------------------------------------------------
console.log('--- 1. Inicialización y Catálogo Oficial ---');
resetToDemoDefaults();
const products = getProducts();
assert(products.length === 6, 'El catálogo semilla contiene exactamente 6 productos.');

const p1 = getProductById('PROD-01');
assert(p1 && p1.price === 17.00 && p1.stock === 120, 'Bolsa individual oficial cuesta $17.00 USD con stock inicial 120.');

const pack3 = getProductById('PROD-05');
assert(pack3 && pack3.price === 48.00 && pack3.bagsCount === 3, 'Pack 3 bolsas cuesta $48.00 USD (propuesta comercial oficial).');

const sub = getProductById('PROD-06');
assert(sub && sub.price === 30.60 && sub.bagsCount === 2, 'Suscripción cuesta $30.60 USD mensuales (10% descuento oficial).');

// -----------------------------------------------------------------------------
// 2. OPERACIONES DE INVENTARIO Y REGLAS DE CANTIDAD
// -----------------------------------------------------------------------------
console.log('\n--- 2. Operaciones de Inventario y Validación de Cantidades ---');
const updateStockRes = updateProductStock('PROD-01', 150);
assert(updateStockRes.success && getProductById('PROD-01').stock === 150, 'Actualización manual de inventario a 150 unidades.');

const negativeStockRes = updateProductStock('PROD-01', -5);
assert(!negativeStockRes.success, 'Rechazo de inventario negativo.');

const floatStockRes = updateProductStock('PROD-01', 10.5);
assert(!floatStockRes.success, 'Rechazo de inventario no entero.');

// -----------------------------------------------------------------------------
// 3. CARRITO DE COMPRAS Y CÁLCULO DE ENVÍO OFICIAL
// -----------------------------------------------------------------------------
console.log('\n--- 3. Carrito de Compras y Reglas de Envío ($45.00) ---');
clearCart();
let cart = getCart();
assert(cart.items.length === 0 && cart.total === 0, 'Carrito vacío inicial.');

// Agregar 2 bolsas = $34.00 (Envío estándar de $4.50 aplica porque subtotal < $45)
addToCart('PROD-01', 2);
cart = getCart();
assert(cart.subtotal === 34.00, 'Subtotal de 2 bolsas = $34.00 USD.');
assert(cart.shippingCost === 4.50, 'Costo de envío estándar = $4.50 USD (Subtotal < $45).');
assert(cart.total === 38.50, 'Total con envío = $38.50 USD ($34 + $4.50).');
assert(!cart.freeShippingApplied, 'Envío gratis NO aplicado para subtotal de $34.00.');

// Agregar 1 bolsa más -> 3 bolsas = $51.00 (Califica para Envío Gratis >= $45)
addToCart('PROD-01', 1);
cart = getCart();
assert(cart.subtotal === 51.00, 'Subtotal de 3 bolsas = $51.00 USD.');
assert(cart.shippingCost === 0.00, 'Costo de envío = $0.00 USD (Envío Gratis aplicado).');
assert(cart.total === 51.00, 'Total con envío gratis = $51.00 USD.');
assert(cart.freeShippingApplied === true, 'Envío gratis confirmado para subtotal >= $45.00.');

// Probar Pack 3 bolsas ($48.00)
clearCart();
addToCart('PROD-05', 1);
cart = getCart();
assert(cart.subtotal === 48.00 && cart.shippingCost === 0.00 && cart.total === 48.00, 'Pack 3 bolsas ($48.00) califica automáticamente para envío gratis.');

// Intentar agregar más del stock disponible
const overStockRes = addToCart('PROD-04', 500); // PROD-04 solo tiene 45 en stock
assert(!overStockRes.success, 'Rechazo de adición al carrito que excede el stock disponible.');

// Probar modificación de cantidad y eliminación
updateCartQuantity('PROD-05', 2);
cart = getCart();
assert(cart.items[0].quantity === 2 && cart.subtotal === 96.00, 'Modificación de cantidad en carrito a 2 packs ($96.00).');

removeFromCart('PROD-05');
cart = getCart();
assert(cart.items.length === 0, 'Eliminación correcta de producto del carrito.');

// -----------------------------------------------------------------------------
// 4. COMPRA SIMULADA RECHAZADA (NO DESCUENTA INVENTARIO)
// -----------------------------------------------------------------------------
console.log('\n--- 4. Compra Simulada Rechazada (Blindaje de Inventario) ---');
resetToDemoDefaults();
const initialStockHuila = getProductById('PROD-01').stock; // 120
assert(initialStockHuila === 120, 'Stock base antes de prueba = 120.');

addToCart('PROD-01', 2); // 2 bolsas = $34.00 + $4.50 = $38.50

const mockCustomer = {
  name: 'Estudiante Auditor',
  email: 'auditor@tueste.demo',
  address: 'Calle Café 123',
  city: 'San José'
};

const rejectedCheckout = processSimulatedCheckout({
  customer: mockCustomer,
  simulateApproval: false, // Simular rechazo bancario
  paymentDetails: {
    cardBrand: 'Mastercard Demo',
    last4: '9999',
    declineReason: 'Fondos insuficientes simulados'
  }
});

assert(!rejectedCheckout.success, 'Checkout simulado devuelve success = false.');
assert(rejectedCheckout.status === 'REJECTED', 'Estado de orden registrado como REJECTED.');
assert(getProductById('PROD-01').stock === 120, 'El stock se mantiene INTACTO (120) tras pago rechazado.');

const ordersAfterReject = getOrders();
assert(ordersAfterReject.length === 1 && ordersAfterReject[0].status === 'REJECTED', 'Orden rechazada guardada en historial de pedidos para auditoría.');

// -----------------------------------------------------------------------------
// 5. COMPRA SIMULADA APROBADA (DESCUENTA INVENTARIO UNA SOLA VEZ)
// -----------------------------------------------------------------------------
console.log('\n--- 5. Compra Simulada Aprobada y Deducción de Stock ---');
// El carrito aún conserva los ítems porque la compra anterior fue rechazada
cart = getCart();
assert(cart.items.length === 1 && cart.items[0].quantity === 2, 'Carrito conservado tras rechazo previo.');

const approvedCheckout = processSimulatedCheckout({
  customer: mockCustomer,
  simulateApproval: true,
  paymentDetails: {
    cardBrand: 'Visa Demo',
    last4: '4242'
  }
});

assert(approvedCheckout.success, 'Checkout simulado aprobado con éxito.');
assert(approvedCheckout.status === 'CONFIRMED', 'Estado de orden registrado como CONFIRMED.');
assert(approvedCheckout.order.totals.total === 38.50, 'Total liquidado coincide con $38.50 USD ($34 + $4.50 envío).');

// Verificar que el stock se descontó exactamente en 2 unidades (120 - 2 = 118)
const stockAfterApproval = getProductById('PROD-01').stock;
assert(stockAfterApproval === 118, 'El inventario se descontó exactamente una vez (120 -> 118).');

// Verificar que el carrito se vació tras compra exitosa
cart = getCart();
assert(cart.items.length === 0, 'Carrito vaciado automáticamente tras confirmación de compra.');

// -----------------------------------------------------------------------------
// 6. CONTROL DE IDEMPOTENCIA Y PREVENCIÓN DE DUPLICADOS
// -----------------------------------------------------------------------------
console.log('\n--- 6. Prevención de Pedidos Duplicados (Idempotencia) ---');
const testIdempotencyKey = 'IDEM-KEY-UNIQUE-TEST-12345';
addToCart('PROD-02', 1);

const firstSubmission = processSimulatedCheckout({
  customer: mockCustomer,
  simulateApproval: true,
  idempotencyKey: testIdempotencyKey
});
assert(firstSubmission.success && !firstSubmission.isDuplicate, 'Primera confirmación exitosa.');
const stockGuaAfterFirst = getProductById('PROD-02').stock; // 95 - 1 = 94

// Reintento con la misma clave de idempotencia
const duplicateSubmission = processSimulatedCheckout({
  customer: mockCustomer,
  simulateApproval: true,
  idempotencyKey: testIdempotencyKey
});
assert(duplicateSubmission.isDuplicate === true, 'El reenvío fue detectado como DUPLICADO.');
assert(getProductById('PROD-02').stock === stockGuaAfterFirst, 'El inventario NO se volvió a descontar en reenvío duplicado.');

// -----------------------------------------------------------------------------
// 7. GESTIÓN DE CLIENTES DE DEMOSTRACIÓN Y ESTADO DE PEDIDOS
// -----------------------------------------------------------------------------
console.log('\n--- 7. Directorio de Clientes y Estados de Pedidos ---');
const customers = getCustomers();
const foundCustomer = customers.find(c => c.email === 'auditor@tueste.demo');
assert(foundCustomer && foundCustomer.totalOrders >= 2, 'Cliente registrado con historial de compras.');

const lastOrder = getOrders()[0];
const stockBeforeStatusChange = getProductById(lastOrder.items[0].productId).stock;
const updateStatusRes = updateOrderStatus(lastOrder.orderId, 'SHIPPED');
assert(updateStatusRes.success && updateStatusRes.order.fulfillmentStatus === 'SHIPPED', 'Actualización de estado de pedido a SHIPPED.');

// Verificar que el inventario NO se descuenta al cambiar estado
const stockAfterStatusChange = getProductById(lastOrder.items[0].productId).stock;
assert(stockAfterStatusChange === stockBeforeStatusChange, 'El inventario NO se descuenta nuevamente al cambiar estado del pedido.');

// Intentar transición inválida hacia atrás (SHIPPED -> IN_PREPARATION)
const invalidBackwardsRes = updateOrderStatus(lastOrder.orderId, 'IN_PREPARATION');
assert(!invalidBackwardsRes.success, 'Bloqueo de regresión inválida de estado (SHIPPED -> IN_PREPARATION).');

// Transición a DELIVERED (terminal)
const deliverRes = updateOrderStatus(lastOrder.orderId, 'DELIVERED');
assert(deliverRes.success && deliverRes.order.fulfillmentStatus === 'DELIVERED', 'Transición válida a DELIVERED.');

// Intentar revertir DELIVERED
const revertDeliveredRes = updateOrderStatus(lastOrder.orderId, 'SHIPPED');
assert(!revertDeliveredRes.success, 'Bloqueo de reversión de estado terminal DELIVERED.');

// Buscar pedido rechazado y verificar que no puede marcarse como confirmado
const allOrders = getOrders();
const rejectedOrder = allOrders.find(o => o.status === 'REJECTED');
assert(rejectedOrder !== undefined, 'Existe al menos un pedido rechazado en el historial.');
const tryConfirmRejectedRes = updateOrderStatus(rejectedOrder.orderId, 'CONFIRMED');
assert(!tryConfirmRejectedRes.success, 'Bloqueo estricto: Pedido rechazado NO puede marcarse como confirmado sin nuevo pago simulado.');

// Probar getCommercialSummary()
const summary = getCommercialSummary();
assert(summary.totalOrders === allOrders.length, 'Resumen comercial: Conteo total de pedidos coincide.');
assert(summary.confirmedOrdersCount > 0 && summary.rejectedOrdersCount > 0, 'Resumen comercial: Conteo de aprobados y rechazados desglosado.');
assert(summary.confirmedSales > 0, 'Resumen comercial: Ventas confirmadas calculadas correctamente.');
assert(summary.isPrototype === true, 'Resumen comercial: Flag isPrototype activo.');

// Probar getPaymentsLog()
const paymentsLog = getPaymentsLog();
assert(paymentsLog.length === allOrders.length, 'Log de pagos: Registra todas las transacciones simuladas.');
assert(paymentsLog.some(p => p.status === 'APPROVED') && paymentsLog.some(p => p.status === 'DECLINED'), 'Log de pagos: Registra tanto pagos aprobados como rechazados.');
assert(paymentsLog.every(p => p.isRealTransaction === false), 'Log de pagos: Todas las transacciones marcadas como no reales (isRealTransaction = false).');

// -----------------------------------------------------------------------------
// 8. INTEGRIDAD DE LOS TRES NIVELES FINANCIEROS DEL CASO TUESTE
// -----------------------------------------------------------------------------
console.log('\n--- 8. Verificación de No Contaminación con Niveles Financieros 1, 2 y 3 ---');
const hoyMetrics = calculateDashboardMetrics(PRESET_SCENARIOS.HOY.params);
assert(Math.abs(hoyMetrics.ltvBlended - 54.80) < 0.01, 'LTV Nivel 1 y 2 permanece intacto en $54.80 USD.');
assert(Math.abs(hoyMetrics.cacReal - 54.55) < 0.01, 'CAC Real Nivel 1 y 2 permanece intacto en $54.55 USD.');
assert(hoyMetrics.paybackMonth === 'Mes 12', 'Payback oficial se mantiene en Mes 12.');

const cohortPlans = evaluateAllPlans24M({ includeTostadora: false });
assert(cohortPlans.plans.PLAN_3.result.finalCash > 132000, 'Plan 3 de Nivel 3 mantiene caja final > $132.000 USD.');
assert(cohortPlans.plans.PLAN_2.result.finalCash < 0, 'Plan 2 de Nivel 3 mantiene su resultado de quiebra.');

console.log('\n================================================================================');
console.log(`RESULTADO FINAL DE PRUEBAS: ${testsPassed} de ${testsTotal} PRUEBAS APROBADAS (100%).`);
console.log('================================================================================');
