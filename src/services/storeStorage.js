import { getCheckoutQuote, getReferralToken, recordApprovedReferralOrder, updateReferralDelivery, updateReferralOrderFulfillment, cancelReferralPurchase } from './referralProgram.js';

/**
 * ==============================================================================
 * TUESTE E-COMMERCE — SERVICIO DE ALMACENAMIENTO Y PERSISTENCIA (FASE B)
 * ==============================================================================
 * 
 * PROPÓSITO:
 * Proporcionar una capa de persistencia en el navegador (localStorage) para el
 * prototipo funcional de tienda, gestionando catálogo de productos, inventario,
 * carrito de compras, registro de pedidos simulados y clientes de prueba.
 * 
 * ⚠️ DECLARACIÓN DE ARQUITECTURA Y LIMITACIONES:
 * - Este servicio utiliza `localStorage` del navegador con un fallback en memoria
 *   para entornos de testing (Node.js).
 * - `localStorage` es almacenamiento local en el cliente, NO una base de datos
 *   multiusuario concurrente ni un backend seguro para producción.
 * - NO almacena ni procesa números reales de tarjetas de crédito, CVV ni datos bancarios.
 * - Toda transacción y pasarela es 100% simulada con fines exclusivamente académicos.
 * - Los pedidos simulados se almacenan con la marca `isSimulatedOrder: true` para
 *   mantenerlos estrictamente aislados de las series históricas del Caso Tueste.
 * ==============================================================================
 */

// Claves de almacenamiento en localStorage
export const STORAGE_KEYS = {
  PRODUCTS: 'tueste_store_products',
  CART: 'tueste_store_cart',
  ORDERS: 'tueste_store_orders',
  CUSTOMERS: 'tueste_store_customers',
  INITIALIZED: 'tueste_store_initialized_v1'
};

// Polífill / Fallback en memoria para Node.js y entornos sin window
const memoryStorage = {};
const storageAdapter = {
  getItem: (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.warn('Error leyendo localStorage, usando fallback:', e);
      }
    }
    return memoryStorage[key] || null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn('Error escribiendo localStorage, usando fallback:', e);
      }
    }
    memoryStorage[key] = String(value);
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn('Error eliminando en localStorage:', e);
      }
    }
    delete memoryStorage[key];
  },
  clear: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.clear();
      } catch (e) {
        console.warn('Error limpiando localStorage:', e);
      }
    }
    Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]);
  }
};

/**
 * CATÁLOGO SEMILLA OFICIAL DEL CASO (CON DEMO DATA RECONCILIADA)
 * - Precio oficial por bolsa: $17.00 USD (340g).
 * - Precio pedido 2 bolsas: $34.00 USD ($17 x 2).
 * - Propuesta Comercial Pack 3 bolsas: $48.00 USD (Ahorro $3, envío gratis).
 * - Suscripción 2 bolsas/mes: $30.60 USD (10% descuento mensual).
 * - Regla de envío oficial: $4.50 USD estándar; GRATIS para pedidos >= $45.00 USD.
 */
export const SEED_PRODUCTS = [
  {
    id: 'PROD-01',
    sku: 'TUE-COL-HUI-340',
    name: 'Tueste Origen Huila — Colombia',
    description: 'Café de especialidad de origen único con notas a caramelo, durazno maduro y acidez cítrica brillante. Tostado en pequeños lotes.',
    price: 17.00,
    weightGrams: 340,
    bagsCount: 1,
    category: 'origen_unico',
    origin: 'Huila, Colombia',
    altitude: '1.750 msnm',
    process: 'Lavado',
    stock: 120,
    imageUrl: '/images/coffee_colombia.jpg',
    isOfficialPrice: true,
    isDemoData: true // Nombre de finca y stock son datos de demostración
  },
  {
    id: 'PROD-02',
    sku: 'TUE-GUA-ANT-340',
    name: 'Tueste Antigua — Guatemala',
    description: 'Cuerpo denso, notas a chocolate amargo, avellanas tostadas y toque especiado sutil. Tueste medio ideal para espresso o cafetera de filtro.',
    price: 17.00,
    weightGrams: 340,
    bagsCount: 1,
    category: 'origen_unico',
    origin: 'Valle de Antigua, Guatemala',
    altitude: '1.600 msnm',
    process: 'Lavado tradicional',
    stock: 95,
    imageUrl: '/images/coffee_guatemala.jpg',
    isOfficialPrice: true,
    isDemoData: true
  },
  {
    id: 'PROD-03',
    sku: 'TUE-CRI-TAR-340',
    name: 'Tueste Tarrazú — Costa Rica',
    description: 'Perfil limpio y aromático, notas de manzana roja, miel de caña y postgusto dulce y persistente.',
    price: 17.00,
    weightGrams: 340,
    bagsCount: 1,
    category: 'origen_unico',
    origin: 'Tarrazú, Costa Rica',
    altitude: '1.800 msnm',
    process: 'Honey Amarillo',
    stock: 110,
    imageUrl: '/images/coffee_costarica.jpg',
    isOfficialPrice: true,
    isDemoData: true
  },
  {
    id: 'PROD-04',
    sku: 'TUE-ESP-GEI-340',
    name: 'Tueste Selección Especial — Geisha',
    description: 'Edición limitada de microlote premium. Fragancia floral a jazmín, bergamota, té negro y frutas tropicales.',
    price: 17.00,
    weightGrams: 340,
    bagsCount: 1,
    category: 'microlote',
    origin: 'Boquete, Tierras Altas',
    altitude: '1.900 msnm',
    process: 'Natural Lento',
    stock: 45,
    imageUrl: '/images/coffee_geisha.jpg',
    isOfficialPrice: true,
    isDemoData: true
  },
  {
    id: 'PROD-05',
    sku: 'TUE-PCK-3BAGS-001',
    name: 'Pack Degustación 3 Bolsas (Propuesta Comercial)',
    description: 'Trilogía de orígenes selectos (3 bolsas x 340g). Precio promocional de $48 USD (ahorro de $3 frente al precio individual). Califica automáticamente para Envío Gratis.',
    price: 48.00,
    weightGrams: 1020,
    bagsCount: 3,
    category: 'packs',
    origin: 'Selección de 3 Orígenes',
    altitude: 'Variadas',
    process: 'Mixto',
    stock: 60,
    imageUrl: '/images/coffee_pack3.jpg',
    isOfficialPrice: true,
    isOfficialPackProposal: true,
    qualifiesFreeShipping: true,
    isDemoData: true
  },
  {
    id: 'PROD-06',
    sku: 'TUE-SUB-CLUB-002',
    name: 'Suscripción Club Tueste Mensual (2 Bolsas / Mes)',
    description: 'Suscripción recurrente oficial con 10% de descuento ($30.60 USD mensuales en lugar de $34.00). Dos bolsas frescas entregadas a domicilio mensualmente. Churn mensual del 9%.',
    price: 30.60,
    weightGrams: 680,
    bagsCount: 2,
    category: 'suscripciones',
    origin: 'Rotación Mensual de Cosecha',
    altitude: 'Alta especialidad',
    process: 'Selección de Tostador',
    stock: 999, // Servicio recurrente sin límite de stock unitario
    imageUrl: '/images/coffee_subscription.jpg',
    isOfficialPrice: true,
    isSubscription: true,
    isDemoData: true
  }
];

// Reglas financieras oficiales de la tienda
export const STORE_RULES = {
  STANDARD_SHIPPING_COST: 4.50,
  FREE_SHIPPING_THRESHOLD: 45.00,
  SINGLE_BAG_PRICE: 17.00,
  DEFAULT_BAGS_PER_ORDER: 2,
  DEFAULT_TICKET: 34.00,
  PACK_3_PRICE: 48.00,
  SUBSCRIPTION_PRICE: 30.60,
  COFFEE_COST_PER_BAG: 5.44,
  PACKAGING_COST_PER_ORDER: 1.20,
  GATEWAY_FEE_PCT: 0.045
};

/**
 * Inicializa el almacenamiento con datos semilla si es la primera ejecución
 */
export function initializeStoreStorage(forceReset = false) {
  const isInitialized = storageAdapter.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized || forceReset) {
    storageAdapter.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    if (!storageAdapter.getItem(STORAGE_KEYS.ORDERS) || forceReset) {
      storageAdapter.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!storageAdapter.getItem(STORAGE_KEYS.CUSTOMERS) || forceReset) {
      storageAdapter.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    }
    if (!storageAdapter.getItem(STORAGE_KEYS.CART) || forceReset) {
      storageAdapter.setItem(STORAGE_KEYS.CART, JSON.stringify({ items: [] }));
    }
    storageAdapter.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

/**
 * Restablece los datos de la tienda a sus valores iniciales de demostración
 */
export function resetToDemoDefaults() {
  initializeStoreStorage(true);
  return {
    success: true,
    message: 'Datos de la tienda restablecidos a los valores iniciales de demostración.'
  };
}

// ==============================================================================
// GESTIÓN DE PRODUCTOS E INVENTARIO
// ==============================================================================

/**
 * Obtiene la lista completa de productos disponibles
 */
export function getProducts() {
  initializeStoreStorage(false);
  try {
    const raw = storageAdapter.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [...SEED_PRODUCTS];
  } catch (e) {
    console.error('Error parseando productos de localStorage:', e);
    return [...SEED_PRODUCTS];
  }
}

/**
 * Obtiene un producto por su identificador
 */
export function getProductById(productId) {
  const products = getProducts();
  return products.find(p => p.id === productId) || null;
}

/**
 * Actualiza el stock de un producto específico (función administrativa)
 */
export function updateProductStock(productId, newStock) {
  if (typeof newStock !== 'number' || newStock < 0 || !Number.isInteger(newStock)) {
    return {
      success: false,
      error: 'La cantidad de inventario debe ser un número entero mayor o igual a 0.'
    };
  }

  const products = getProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) {
    return { success: false, error: `Producto no encontrado: ${productId}` };
  }

  products[index].stock = newStock;
  storageAdapter.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return {
    success: true,
    product: products[index]
  };
}

// ==============================================================================
// GESTIÓN DEL CARRITO DE COMPRAS
// ==============================================================================

/**
 * Obtiene el carrito actual
 */
export function getCart() {
  initializeStoreStorage(false);
  try {
    const raw = storageAdapter.getItem(STORAGE_KEYS.CART);
    const cart = raw ? JSON.parse(raw) : { items: [] };
    return recalculateCart(cart);
  } catch (e) {
    return { items: [], subtotal: 0, shippingCost: 0, total: 0, freeShippingApplied: false };
  }
}

/**
 * Recalcula subtotales, costo de envío y total con las reglas comerciales oficiales
 */
export function calculateCartTotals(items = []) {
  let subtotal = 0;
  let totalBags = 0;

  for (const item of items) {
    if (typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      throw new Error(`Cantidad inválida para producto ${item.productId}: ${item.quantity}`);
    }
    subtotal += item.price * item.quantity;
    totalBags += (item.bagsCount || 1) * item.quantity;
  }

  // Redondear a 2 decimales para evitar artefactos de punto flotante
  subtotal = Math.round(subtotal * 100) / 100;

  // Regla de envío: Gratis si subtotal >= $45.00, sino $4.50
  const freeShippingApplied = subtotal >= STORE_RULES.FREE_SHIPPING_THRESHOLD;
  const shippingCost = items.length === 0 ? 0 : (freeShippingApplied ? 0 : STORE_RULES.STANDARD_SHIPPING_COST);
  const total = Math.round((subtotal + shippingCost) * 100) / 100;

  return {
    itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
    totalBags,
    subtotal,
    shippingCost,
    total,
    freeShippingApplied,
    amountNeededForFreeShipping: freeShippingApplied ? 0 : Math.max(0, Math.round((STORE_RULES.FREE_SHIPPING_THRESHOLD - subtotal) * 100) / 100)
  };
}

function recalculateCart(cart) {
  const items = cart.items || [];
  const totals = calculateCartTotals(items);
  return {
    items,
    ...totals
  };
}

/**
 * Agrega un producto al carrito verificando stock disponible
 */
export function addToCart(productId, quantity = 1) {
  if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
    return { success: false, error: 'La cantidad debe ser un número entero mayor a 0.' };
  }

  const product = getProductById(productId);
  if (!product) {
    return { success: false, error: 'Producto no encontrado.' };
  }

  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(i => i.productId === productId);
  const currentQtyInCart = existingItemIndex >= 0 ? cart.items[existingItemIndex].quantity : 0;
  const targetQuantity = currentQtyInCart + quantity;

  if (targetQuantity > product.stock) {
    return {
      success: false,
      error: `Inventario insuficiente. Stock disponible: ${product.stock} unidades (ya tienes ${currentQtyInCart} en el carrito).`
    };
  }

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity = targetQuantity;
    cart.items[existingItemIndex].subtotal = Math.round(product.price * targetQuantity * 100) / 100;
  } else {
    cart.items.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      bagsCount: product.bagsCount,
      quantity: quantity,
      subtotal: Math.round(product.price * quantity * 100) / 100,
      imageUrl: product.imageUrl,
      isSubscription: product.isSubscription || false
    });
  }

  const updatedCart = recalculateCart(cart);
  storageAdapter.setItem(STORAGE_KEYS.CART, JSON.stringify(updatedCart));
  return { success: true, cart: updatedCart };
}

/**
 * Modifica la cantidad de un producto en el carrito
 */
export function updateCartQuantity(productId, quantity) {
  if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
    return { success: false, error: 'La cantidad debe ser un entero mayor o igual a 0.' };
  }

  if (quantity === 0) {
    return removeFromCart(productId);
  }

  const product = getProductById(productId);
  if (!product) {
    return { success: false, error: 'Producto no encontrado.' };
  }

  if (quantity > product.stock) {
    return {
      success: false,
      error: `Inventario insuficiente. Solo quedan ${product.stock} unidades disponibles.`
    };
  }

  const cart = getCart();
  const itemIndex = cart.items.findIndex(i => i.productId === productId);
  if (itemIndex === -1) {
    return { success: false, error: 'El producto no está en el carrito.' };
  }

  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].subtotal = Math.round(product.price * quantity * 100) / 100;

  const updatedCart = recalculateCart(cart);
  storageAdapter.setItem(STORAGE_KEYS.CART, JSON.stringify(updatedCart));
  return { success: true, cart: updatedCart };
}

/**
 * Elimina un producto del carrito
 */
export function removeFromCart(productId) {
  const cart = getCart();
  cart.items = cart.items.filter(i => i.productId !== productId);
  const updatedCart = recalculateCart(cart);
  storageAdapter.setItem(STORAGE_KEYS.CART, JSON.stringify(updatedCart));
  return { success: true, cart: updatedCart };
}

/**
 * Vacía el carrito
 */
export function clearCart() {
  const emptyCart = {
    items: [],
    itemsCount: 0,
    totalBags: 0,
    subtotal: 0,
    shippingCost: 0,
    total: 0,
    freeShippingApplied: false,
    amountNeededForFreeShipping: STORE_RULES.FREE_SHIPPING_THRESHOLD
  };
  storageAdapter.setItem(STORAGE_KEYS.CART, JSON.stringify(emptyCart));
  return { success: true, cart: emptyCart };
}

// ==============================================================================
// GESTIÓN DE PEDIDOS Y PAGOS SIMULADOS
// ==============================================================================

/**
 * Genera un identificador único de pedido con prefijo oficial y timestamp
 */
export function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestampSeq = String(Date.now()).slice(-4);
  return `TUE-${year}${month}${day}-${timestampSeq}${randomSuffix}`;
}

/**
 * Obtiene todos los pedidos registrados
 */
export function getOrders() {
  initializeStoreStorage(false);
  try {
    const raw = storageAdapter.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Obtiene un pedido por su identificador
 */
export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(o => o.orderId === orderId) || null;
}

/**
 * Procesa una compra con pago simulado (aprobado o rechazado)
 * Garantiza:
 * 1. Control de inventario previo.
 * 2. Si se aprueba, descuenta inventario UNA SOLA VEZ.
 * 3. Si se rechaza, NO descuenta inventario.
 * 4. Evita pedidos duplicados por reenvío con `idempotencyKey`.
 * 5. NO almacena información de tarjetas reales.
 */
export function processSimulatedCheckout({
  customer,
  cartItems = null,
  simulateApproval = true,
  idempotencyKey = null,
  paymentDetails = {},
  referralToken = getReferralToken(),
  useReferralCredit = false
}) {
  // 1. Validar datos mínimos de cliente
  if (!customer || !customer.name || !customer.email || !customer.address) {
    return {
      success: false,
      error: 'Datos de cliente incompletos. Se requiere nombre, correo electrónico y dirección.'
    };
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.email.trim())) {
    return {
      success: false,
      error: 'El correo electrónico ingresado no es válido.'
    };
  }

  // 2. Control de idempotencia (evitar pedidos duplicados en ráfaga)
  const existingOrders = getOrders();
  if (idempotencyKey) {
    const duplicate = existingOrders.find(o => o.idempotencyKey === idempotencyKey);
    if (duplicate) {
      return {
        success: duplicate.status === 'CONFIRMED',
        isDuplicate: true,
        order: duplicate,
        message: 'Pedido ya procesado previamente con esta clave de idempotencia.'
      };
    }
  }

  // 3. Obtener ítems del pedido (desde parámetro o desde el carrito actual)
  const itemsToProcess = cartItems || getCart().items;
  if (!itemsToProcess || itemsToProcess.length === 0) {
    return {
      success: false,
      error: 'El carrito está vacío. Agregue productos antes de procesar el pago.'
    };
  }

  // 4. Verificación estricta de stock disponible para cada producto
  const products = getProducts();
  const stockErrors = [];

  for (const item of itemsToProcess) {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) {
      stockErrors.push(`El producto ${item.productId} ya no existe en el catálogo.`);
    } else if (item.quantity > prod.stock) {
      stockErrors.push(`Stock insuficiente para "${prod.name}". Solicitado: ${item.quantity}, Disponible: ${prod.stock}.`);
    }
  }

  if (stockErrors.length > 0) {
    return {
      success: false,
      error: stockErrors.join(' ')
    };
  }

  // 5. Cálculo oficial de totales del pedido
  const baseTotals = calculateCartTotals(itemsToProcess);
  const referralQuote = getCheckoutQuote({
    items: itemsToProcess,
    email: customer.email,
    orders: existingOrders,
    referralToken,
    useCredit: useReferralCredit,
    baseTotals
  });
  const totals = {
    ...baseTotals,
    subtotal: referralQuote.subtotal,
    shippingCost: referralQuote.shippingCost,
    total: referralQuote.total,
    discount: referralQuote.discount,
    referralCreditApplied: referralQuote.creditApplied,
    originalSubtotal: referralQuote.subtotal
  };

  // 6. Simulación de Pasarela de Pagos (Stripe / Pasarela simulada)
  const orderId = generateOrderId();
  const nowIso = new Date().toISOString();

  // Simulación de respuesta bancaria
  const isApproved = Boolean(simulateApproval);
  const paymentRecord = {
    method: paymentDetails.method || 'SIMULATED_CARD',
    brand: paymentDetails.cardBrand || 'Visa Demo',
    last4: paymentDetails.last4 || '4242', // Solo últimos 4 dígitos ficticios
    authorizationCode: isApproved ? `AUTH-SIM-${Math.floor(100000 + Math.random() * 900000)}` : null,
    status: isApproved ? 'APPROVED' : 'DECLINED',
    declineReason: isApproved ? null : (paymentDetails.declineReason || 'Fondos insuficientes simulados (Simulated Card Decline)'),
    processedAt: nowIso,
    gateway: 'Tueste Simulated Payment Engine v1.0',
    isRealTransaction: false
  };

  // 7. Si el pago es RECHAZADO:
  // Registrar el pedido como RECHAZADO, NO descontar inventario y conservar el carrito
  if (!isApproved) {
    const rejectedOrder = {
      orderId,
      idempotencyKey: idempotencyKey || orderId,
      createdAt: nowIso,
      status: 'REJECTED',
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone ? customer.phone.trim() : '',
        address: customer.address.trim(),
        city: customer.city ? customer.city.trim() : 'Ciudad'
      },
      items: itemsToProcess.map(i => ({ ...i })),
      totals,
      payment: paymentRecord,
      referral: referralQuote.mode === 'referral_discount' && referralQuote.valid
        ? { mode: referralQuote.mode, inviterParticipantId: referralQuote.referrerParticipantId, token: referralQuote.referralToken, discount: referralQuote.discount }
        : referralQuote.mode === 'referrer_credit'
          ? { mode: referralQuote.mode, participantId: referralQuote.referrerParticipantId, creditApplied: referralQuote.creditApplied }
          : null,
      isSimulatedOrder: true
    };

    existingOrders.unshift(rejectedOrder);
    storageAdapter.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(existingOrders));

    return {
      success: false,
      status: 'REJECTED',
      orderId: rejectedOrder.orderId,
      order: rejectedOrder,
      error: `La transacción simulada fue rechazada: ${paymentRecord.declineReason}. No se descontó inventario ni se realizó ningún cobro.`
    };
  }

  // 8. Si el pago es APROBADO:
  // Descontar inventario atómicamente
  for (const item of itemsToProcess) {
    const prod = products.find(p => p.id === item.productId);
    if (prod && !prod.isSubscription) { // Las suscripciones son servicios recurrentes
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }
  storageAdapter.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  // Crear registro oficial de pedido confirmado
  const confirmedOrder = {
    orderId,
    idempotencyKey: idempotencyKey || orderId,
    createdAt: nowIso,
    status: 'CONFIRMED',
    fulfillmentStatus: 'PENDING_PREPARATION',
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone ? customer.phone.trim() : '',
      address: customer.address.trim(),
      city: customer.city ? customer.city.trim() : 'Ciudad'
    },
    items: itemsToProcess.map(i => ({ ...i })),
    totals,
    payment: paymentRecord,
    referral: referralQuote.mode === 'referral_discount' && referralQuote.valid
      ? { mode: referralQuote.mode, inviterParticipantId: referralQuote.referrerParticipantId, token: referralQuote.referralToken, discount: referralQuote.discount }
      : referralQuote.mode === 'referrer_credit'
        ? { mode: referralQuote.mode, participantId: referralQuote.referrerParticipantId, creditApplied: referralQuote.creditApplied }
        : null,
    isSimulatedOrder: true
  };

  existingOrders.unshift(confirmedOrder);
  storageAdapter.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(existingOrders));

  // Actualizar directorio de clientes de prueba
  updateCustomersDirectory(confirmedOrder);
  recordApprovedReferralOrder(confirmedOrder, referralQuote);

  // Vaciar el carrito tras compra confirmada
  clearCart();

  return {
    success: true,
    status: 'CONFIRMED',
    orderId: confirmedOrder.orderId,
    order: confirmedOrder,
    message: 'Compra simulada procesada y confirmada con éxito. Inventario actualizado.'
  };
}

/**
 * Actualiza la lista de clientes registrados en localStorage
 */
function updateCustomersDirectory(order) {
  try {
    const raw = storageAdapter.getItem(STORAGE_KEYS.CUSTOMERS);
    const customers = raw ? JSON.parse(raw) : [];
    const email = order.customer.email;
    const existingIndex = customers.findIndex(c => c.email === email);

    if (existingIndex >= 0) {
      customers[existingIndex].totalOrders += 1;
      customers[existingIndex].totalSpent = Math.round((customers[existingIndex].totalSpent + order.totals.total) * 100) / 100;
      customers[existingIndex].lastOrderAt = order.createdAt;
      customers[existingIndex].name = order.customer.name;
    } else {
      customers.push({
        id: `CUST-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        name: order.customer.name,
        email: email,
        phone: order.customer.phone || '',
        address: order.customer.address,
        totalOrders: 1,
        totalSpent: order.totals.total,
        firstOrderAt: order.createdAt,
        lastOrderAt: order.createdAt,
        isDemoCustomer: true
      });
    }

    storageAdapter.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.warn('Error actualizando directorio de clientes:', e);
  }
}

/**
 * Obtiene el directorio de clientes registrados
 */
export function getCustomers() {
  initializeStoreStorage(false);
  try {
    const raw = storageAdapter.getItem(STORAGE_KEYS.CUSTOMERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Actualiza el estado de cumplimiento de un pedido (Administración)
 * Reglas de negocio obligatorias:
 * 1. No permite marcar pedidos rechazados como confirmados/pagados sin nueva transacción válida.
 * 2. Bloquea transiciones inválidas (no revertir pedidos entregados o cancelados).
 * 3. NO descuenta inventario nuevamente al cambiar el estado.
 */
export function updateOrderStatus(orderId, newStatus) {
  const allowed = ['CONFIRMED', 'PENDING_PREPARATION', 'IN_PREPARATION', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!allowed.includes(newStatus)) {
    return { success: false, error: `Estado no permitido: ${newStatus}` };
  }

  const orders = getOrders();
  const index = orders.findIndex(o => o.orderId === orderId);
  if (index === -1) {
    return { success: false, error: `Pedido no encontrado: ${orderId}` };
  }

  const order = orders[index];

  // 1. Bloqueo estricto para pedidos rechazados
  if (order.status === 'REJECTED') {
    return {
      success: false,
      error: 'Operación bloqueada: No es posible cambiar el estado de un pedido rechazado sin una nueva transacción de pago simulado aprobada.'
    };
  }

  const currentFulfillment = order.fulfillmentStatus || 'PENDING_PREPARATION';

  // 2. Bloqueo para estados terminales
  if (currentFulfillment === 'DELIVERED') {
    return {
      success: false,
      error: 'Operación bloqueada: El pedido ya fue entregado y no puede revertirse a un estado anterior.'
    };
  }

  if (currentFulfillment === 'CANCELLED') {
    return {
      success: false,
      error: 'Operación bloqueada: El pedido ha sido cancelado y no puede reactivarse.'
    };
  }

  // 3. Validación de regresiones inválidas
  if (currentFulfillment === 'SHIPPED' && (newStatus === 'PENDING_PREPARATION' || newStatus === 'IN_PREPARATION')) {
    return {
      success: false,
      error: 'Transición inválida: Un pedido despachado no puede devolverse a preparación.'
    };
  }

  // Actualizar estado sin tocar inventario (stock fue descontado al confirmar la compra)
  orders[index].fulfillmentStatus = newStatus;
  orders[index].updatedAt = new Date().toISOString();
  storageAdapter.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  if (newStatus === 'DELIVERED') updateReferralDelivery(orders[index]);
  updateReferralOrderFulfillment(orders[index]);
  if (newStatus === 'CANCELLED') cancelReferralPurchase(orderId);

  return { success: true, order: orders[index] };
}

/**
 * Obtiene el resumen comercial y métricas derivadas de las compras simuladas
 */
export function getCommercialSummary() {
  const orders = getOrders();
  const products = getProducts();
  const customers = getCustomers();

  const totalOrders = orders.length;
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');
  const rejectedOrders = orders.filter(o => o.status === 'REJECTED');

  const confirmedSales = confirmedOrders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
  const roundedSales = Math.round(confirmedSales * 100) / 100;

  const lowStockProducts = products.filter(p => !p.isSubscription && p.stock <= 15);
  const outOfStockProducts = products.filter(p => !p.isSubscription && p.stock === 0);

  return {
    totalOrders,
    confirmedOrdersCount: confirmedOrders.length,
    rejectedOrdersCount: rejectedOrders.length,
    confirmedSales: roundedSales,
    lowStockCount: lowStockProducts.length,
    outOfStockCount: outOfStockProducts.length,
    lowStockProducts,
    totalProducts: products.length,
    totalCustomers: customers.length,
    isPrototype: true
  };
}

/**
 * Obtiene el registro completo de pagos simulados para auditoría administrativa
 */
export function getPaymentsLog() {
  const orders = getOrders();
  return orders.map(order => ({
    orderId: order.orderId,
    customerName: order.customer?.name || 'Cliente Demo',
    customerEmail: order.customer?.email || '',
    amount: order.totals?.total || 0,
    status: order.payment?.status || (order.status === 'CONFIRMED' ? 'APPROVED' : 'DECLINED'),
    orderStatus: order.status,
    fulfillmentStatus: order.fulfillmentStatus || 'N/A',
    authorizationCode: order.payment?.authorizationCode || null,
    declineReason: order.payment?.declineReason || null,
    brand: order.payment?.brand || 'Visa Demo',
    last4: order.payment?.last4 || '4242',
    processedAt: order.payment?.processedAt || order.createdAt,
    isRealTransaction: false
  }));
}
