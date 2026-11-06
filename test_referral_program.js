import assert from 'node:assert/strict';

const values = new Map();
globalThis.window = {
  localStorage: {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    clear: () => values.clear()
  },
  location: { search: '', origin: 'http://localhost', pathname: '/' },
  CustomEvent: class CustomEvent {
    constructor(type) { this.type = type; }
  },
  dispatchEvent: () => true
};

const referral = await import('./src/services/referralProgram.js');
const store = await import('./src/services/storeStorage.js');

function check(condition, message) {
  assert.ok(condition, message);
  console.log(`OK ${message}`);
}

function createApprovedOrder(email, token = null, id = `T-${Math.random()}`, useReferralCredit = false) {
  const item = { productId: 'PROD-01', name: 'Café demo', price: 17, quantity: 1, bagsCount: 1, subtotal: 17 };
  const orders = store.getOrders();
  const quote = referral.getCheckoutQuote({
    items: [item],
    email,
    orders,
    referralToken: token,
    useCredit: useReferralCredit,
    baseTotals: store.calculateCartTotals([item])
  });
  return store.processSimulatedCheckout({
    customer: { name: email, email, address: 'Dirección ficticia' },
    cartItems: [item],
    simulateApproval: true,
    idempotencyKey: id,
    referralToken: token,
    useReferralCredit
  });
}

values.clear();
referral.ensureReferralDemoScenario();
const seeded = referral.getReferralState();
const demoLink = seeded.links.find(item => item.token === 'tueste-demo');
check(Boolean(demoLink), 'el escenario precargado crea un enlace en el almacenamiento aislado de Parte 2');
check(referral.calculateReferralCostCents({ bagCents: 544 }).totalCents === 2304, 'costo normal del referido que desbloquea bolsa es $23.04');
check(referral.calculateReferralCostCents({ discountCents: 0, creditCents: 0, sampleCents: 0, additionalCents: 2500 }).withinLimit, 'el límite permite exactamente $25.00 atribuibles');
check(!referral.calculateReferralCostCents({ discountCents: 0, creditCents: 0, sampleCents: 0, additionalCents: 2501 }).withinLimit, 'un costo superior a $25.00 queda bloqueado');

let quote = referral.getCheckoutQuote({
  items: [{ price: 17, quantity: 1 }],
  email: 'amigo1@example.test',
  orders: [],
  referralToken: 'tueste-demo',
  baseTotals: { subtotal: 17, shippingCost: 0 }
});
check(quote.mode === 'referral_discount' && quote.discount === 8 && quote.total === 13.5, 'descuento de $8 y envío de $4.50 con subtotal original menor a $60');
const freeShippingQuote = referral.getCheckoutQuote({
  items: [{ price: 60, quantity: 1 }],
  email: 'amigo60@example.test',
  orders: [],
  referralToken: 'tueste-demo',
  baseTotals: { subtotal: 60, shippingCost: 0 }
});
check(freeShippingQuote.shippingCost === 0 && freeShippingQuote.total === 52, 'envío gratis referido se determina desde el subtotal original de $60');
const subscriptionQuote = referral.getCheckoutQuote({
  items: [{ price: 30.6, quantity: 1, isSubscription: true }],
  email: 'suscriptor@example.test',
  orders: [],
  referralToken: 'tueste-demo',
  baseTotals: { subtotal: 30.6, shippingCost: 4.5 }
});
check(subscriptionQuote.discount === 8 && subscriptionQuote.total === 27.1, 'suscripción elegible recibe descuento inicial, sin mecanismo de renovación');
const rejectedFriend = store.processSimulatedCheckout({
  customer: { name: 'rechazado@example.test', email: 'rechazado@example.test', address: 'Dirección ficticia' },
  cartItems: [{ productId: 'PROD-01', name: 'Café demo', price: 17, quantity: 1, bagsCount: 1, subtotal: 17 }],
  simulateApproval: false,
  idempotencyKey: 'IDEM-REJECTED-FRIEND',
  referralToken: 'tueste-demo'
});
check(!rejectedFriend.success && referral.getReferralState().purchases.length === 0, 'pago rechazado no consume descuento ni crea compra referida');
const retryRejectedFriend = createApprovedOrder('rechazado@example.test', 'tueste-demo', 'IDEM-RETRY-FRIEND');
check(retryRejectedFriend.success && retryRejectedFriend.order.totals.discount === 8, 'el amigo conserva elegibilidad tras un pago rechazado');

const inviterEmail = 'invitador.demo@tueste.test';
const inviterOrder = createApprovedOrder(inviterEmail, null, 'IDEM-INVITER');
check(inviterOrder.success && inviterOrder.order.status === 'CONFIRMED', 'checkout normal permanece aprobado en el almacén aislado');
const duplicate = store.processSimulatedCheckout({
  customer: { name: inviterEmail, email: inviterEmail, address: 'Dirección ficticia' },
  cartItems: [{ productId: 'PROD-01', name: 'Café demo', price: 17, quantity: 1, bagsCount: 1, subtotal: 17 }],
  simulateApproval: true,
  idempotencyKey: 'IDEM-INVITER'
});
check(duplicate.isDuplicate, 'la clave de idempotencia impide procesar dos veces el mismo intento');

const shipped = store.updateOrderStatus(inviterOrder.order.orderId, 'DELIVERED');
check(shipped.success, 'pedido aprobado puede marcarse como entregado');
const confirm = referral.confirmCustomerDelivery(inviterOrder.order.orderId, inviterEmail, store.getOrders());
check(confirm.success && Boolean(referral.getParticipantProgress(inviterEmail)?.link), 'doble confirmación habilita el enlace una sola vez');
const confirmAgain = referral.confirmCustomerDelivery(inviterOrder.order.orderId, inviterEmail, store.getOrders());
check(confirmAgain.success && confirmAgain.duplicate, 'la confirmación repetida no duplica la activación');

let referredOrders = [];
for (let index = 1; index <= 3; index += 1) {
  const result = createApprovedOrder(`amigo${index}@example.test`, 'tueste-demo', `IDEM-FRIEND-${index}`);
  check(result.success && result.order.totals.discount === 8, `amigo ${index}: descuento solo en compra simulada aprobada`);
  referredOrders.push(result.order);
}
let state = referral.getReferralState();
const thirdPurchase = state.purchases.find(item => item.orderId === referredOrders[1].orderId);
const thirdCosts = state.costs.filter(item => item.purchaseId === thirdPurchase.referralPurchaseId)
  .reduce((sum, item) => sum + item.committedCents + item.incurredCents - item.recoveredCents, 0);
check(thirdCosts === 2304 && thirdCosts <= 2500, 'costo individual del tercer referido incluye descuento, crédito, muestra y bolsa: $23.04');
check(state.purchases.length === 4 && state.purchases.every(item => item.status === 'valid'), 'compras referidas únicas avanzan el progreso, incluida la compra aprobada tras rechazo previo');
const duplicateReferral = createApprovedOrder('amigo1@example.test', 'tueste-demo', 'IDEM-FRIEND-DUPLICATE');
check(duplicateReferral.success && duplicateReferral.order.referral == null, 'compra posterior del mismo correo no vuelve a recibir descuento');

const inventorySet = referral.setReferralDemoInventory({ sample: 4, bag: 1 });
check(inventorySet.success, 'inventario de premios se configura separadamente y acepta existencias no negativas');
const invalidInventory = referral.setReferralDemoInventory({ sample: -1, bag: 1 });
check(!invalidInventory.success, 'inventario de premios rechaza cantidades negativas');

const creditOrder = createApprovedOrder(inviterEmail, null, 'IDEM-CREDIT-USE', true);
check(creditOrder.success && creditOrder.order.totals.referralCreditApplied === 17, 'crédito local cubre subtotal hasta el saldo, sin cubrir envío');
state = referral.getReferralState();
check(state.inventory.sample.reserved === 0 && state.inventory.bag.reserved === 0, 'los premios no se asignan sin verificar logística sin costo incremental');
const verification = referral.verifyRewardFulfillment(creditOrder.order);
check(verification.success && verification.assigned === 5, 'verificación logística local asigna premios con existencias configuradas');
referral.verifyRewardFulfillment(creditOrder.order);
state = referral.getReferralState();
check(state.inventory.sample.reserved === 4 && state.inventory.bag.reserved === 1, 'premios pendientes se reservan al asignarse a un pedido elegible');
store.updateOrderStatus(creditOrder.order.orderId, 'CANCELLED');
state = referral.getReferralState();
check(state.inventory.sample.reserved === 0 && state.inventory.bag.reserved === 0, 'cancelación anterior al envío libera reservas');

const nextOrder = createApprovedOrder(inviterEmail, null, 'IDEM-REWARD-SHIP');
referral.verifyRewardFulfillment(nextOrder.order);
store.updateOrderStatus(nextOrder.order.orderId, 'SHIPPED');
state = referral.getReferralState();
check(state.inventory.sample.shipped === 4 && state.inventory.bag.shipped === 1, 'marcar enviado consume premios reservados una sola vez');
store.updateOrderStatus(nextOrder.order.orderId, 'DELIVERED');
state = referral.getReferralState();
check(state.rewards.filter(item => item.status === 'delivered').length >= 4, 'marcar entregado conserva el historial de premios entregados');

const beforeCancel = referral.getParticipantProgress(inviterEmail).purchases.length;
referral.cancelReferralPurchase(referredOrders[1].orderId);
state = referral.getReferralState();
check(referral.getParticipantProgress(inviterEmail).purchases.length === beforeCancel - 1, 'cancelar compra referida recalcula el conteo válido');
check(state.pendingAdjustments.some(item => item.participantId === demoLink.participantId), 'crédito usado de una compra cancelada crea ajuste pendiente sin saldo negativo');
const invalidTokenQuote = referral.getCheckoutQuote({
  items: [{ price: 17, quantity: 1 }],
  email: 'otro@example.test',
  orders: [],
  referralToken: 'token-inexistente',
  baseTotals: { subtotal: 17, shippingCost: 4.5 }
});
check(invalidTokenQuote.mode === 'standard' && invalidTokenQuote.discount === 0, 'token inválido no aplica descuento');

state = referral.getReferralState();
let assignment = state.assignments.find(item => item.email === inviterEmail);
if (!assignment) {
  assignment = {
    assignmentId: 'TEST-AB',
    experimentId: 'referral-discovery-90d',
    participantId: demoLink.participantId,
    email: inviterEmail,
    variantId: 'B',
    assignedAt: new Date().toISOString(),
    invitedAt: null,
    status: 'awaiting_activation',
    visitedAt: null,
    invitationActionAt: null
  };
  state.assignments.push(assignment);
}
assignment.participantId = demoLink.participantId;
assignment.visitedAt = null;
assignment.invitationActionAt = null;
assignment.invitedAt = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
assignment.status = 'invited';
state.assignments = [assignment];
window.localStorage.setItem(referral.REFERRAL_STORAGE_KEY, JSON.stringify(state));
referral.recordProgramVisit(inviterEmail);
referral.recordInvitationAction(inviterEmail);
const incompleteAbWindow = referral.getReferralDashboardMetrics(Date.now() + 5 * 24 * 60 * 60 * 1000);
const incompleteVariant = incompleteAbWindow.variants.find(item => item.variantId === assignment.variantId);
check(incompleteVariant.completeWindows === 0, 'A/B no cuenta ventanas de siete días incompletas');
const abMetrics = referral.getReferralDashboardMetrics(Date.now() + 8 * 24 * 60 * 60 * 1000);
const assignedVariant = abMetrics.variants.find(item => item.variantId === assignment.variantId);
check(assignedVariant.completeWindows === 1 && assignedVariant.visits === 1 && assignedVariant.actionRate === 1, 'A/B cuenta visitas y acciones solo en una ventana completa');

state = referral.getReferralState();
state.lastAttribution = { token: 'tueste-demo', visitedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString() };
window.localStorage.setItem(referral.REFERRAL_STORAGE_KEY, JSON.stringify(state));
check(referral.getReferralToken() === null, 'una atribución local vencida a los 30 días ya no aplica');
referral.recordReferralVisit('tueste-demo');
check(referral.getReferralToken() === 'tueste-demo', 'una nueva visita válida renueva la atribución por 30 días');

console.log('Pruebas de referidos finalizadas con almacenamiento local simulado aislado.');
