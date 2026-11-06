export const REFERRAL_STORAGE_KEY = 'tueste_referrals_v1';
export const REFERRAL_RULES = {
  attributionWindowDays: 30,
  friendDiscountCents: 800,
  friendMinimumSubtotalCents: 1700,
  freeShippingThresholdCents: 6000,
  standardShippingCents: 450,
  referrerCreditCents: 800,
  sampleCostCents: 160,
  bagCostCents: 544,
  maxRewardCostCents: 2500
};

export function calculateReferralCostCents({ discountCents = 800, creditCents = 800, sampleCents = 160, bagCents = 0, additionalCents = 0 } = {}) {
  const totalCents = discountCents + creditCents + sampleCents + bagCents + additionalCents;
  return { totalCents, withinLimit: totalCents <= REFERRAL_RULES.maxRewardCostCents };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const memory = {};

function getRaw() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('No se pudo leer el almacenamiento de referidos:', error);
  }
  return memory[REFERRAL_STORAGE_KEY] || null;
}

function setRaw(value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(REFERRAL_STORAGE_KEY, value);
      return;
    }
  } catch (error) {
    console.warn('No se pudo escribir el almacenamiento de referidos:', error);
  }
  memory[REFERRAL_STORAGE_KEY] = String(value);
}

function createEmptyState() {
  return {
    version: 1,
    participants: [],
    links: [],
    deliveries: [],
    purchases: [],
    rewards: [],
    costs: [],
    events: [],
    assignments: [],
    verifiedRewardOrders: [],
    inventory: { sample: { onHand: 0, reserved: 0, shipped: 0 }, bag: { onHand: 0, reserved: 0, shipped: 0 } },
    pendingAdjustments: []
  };
}

export function getReferralState() {
  const raw = getRaw();
  if (!raw) return createEmptyState();
  try {
    const parsed = JSON.parse(raw);
    return parsed && parsed.version === 1 ? { ...createEmptyState(), ...parsed } : createEmptyState();
  } catch (error) {
    console.error('Los datos locales de referidos no se pudieron interpretar:', error);
    return createEmptyState();
  }
}

function save(state) {
  setRaw(JSON.stringify(state));
  if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
    window.dispatchEvent(new window.CustomEvent('tueste:referrals-updated'));
  }
  return state;
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function cents(value) {
  return Math.round(Number(value || 0) * 100);
}

function dollars(value) {
  return Math.round(value) / 100;
}

function event(state, type, data = {}) {
  const key = data.dedupeKey;
  if (key && state.events.some(item => item.dedupeKey === key)) return null;
  const record = { eventId: makeId('EVT'), type, occurredAt: new Date().toISOString(), isSimulated: true, ...data };
  state.events.push(record);
  return record;
}

function addCost(state, purchaseId, category, amountCents, status = 'committed', rewardId = null) {
  if (state.costs.some(item => item.purchaseId === purchaseId && item.category === category && item.rewardId === rewardId && item.status !== 'recovered')) return null;
  const entry = {
    costEntryId: makeId('COST'),
    purchaseId,
    category,
    amountCents,
    committedCents: status === 'committed' ? amountCents : 0,
    incurredCents: status === 'incurred' ? amountCents : 0,
    recoveredCents: 0,
    status,
    rewardId,
    createdAt: new Date().toISOString()
  };
  state.costs.push(entry);
  return entry;
}

function referralCosts(state, purchaseId) {
  return state.costs
    .filter(cost => cost.purchaseId === purchaseId)
    .reduce((sum, cost) => sum + cost.committedCents + cost.incurredCents - cost.recoveredCents, 0);
}

function addReward(state, { participantId, purchaseId, type, costCents, sourceKey }) {
  const existing = state.rewards.find(reward => reward.sourceKey === sourceKey);
  if (existing) {
    if (existing.status === 'void' && existing.assignedOrderId == null) {
      existing.status = 'earned';
      existing.purchaseId = purchaseId;
      existing.earnedAt = new Date().toISOString();
      existing.costCents = costCents;
      existing.assignedOrderId = null;
      const cost = addCost(state, purchaseId, `reward_${type}`, costCents, 'committed', existing.rewardId);
      existing.costEntryId = cost?.costEntryId || existing.costEntryId;
      return existing;
    }
    return existing;
  }
  const reward = {
    rewardId: makeId('RWD'),
    participantId,
    purchaseId,
    type,
    costCents,
    sourceKey,
    status: 'earned',
    assignedOrderId: null,
    earnedAt: new Date().toISOString(),
    shippedAt: null,
    deliveredAt: null,
    costEntryId: null
  };
  const cost = addCost(state, purchaseId, `reward_${type}`, costCents, 'committed', reward.rewardId);
  reward.costEntryId = cost?.costEntryId || null;
  state.rewards.push(reward);
  return reward;
}

function settleInviteeRewards(state, purchaseId, participantId, bagEligible, milestoneNumber) {
  const costs = [
    { category: 'friend_discount', amount: REFERRAL_RULES.friendDiscountCents },
    { category: 'referrer_credit', amount: REFERRAL_RULES.referrerCreditCents }
  ];
  const costQuote = calculateReferralCostCents({ bagCents: bagEligible ? REFERRAL_RULES.bagCostCents : 0 });
  const total = costQuote.totalCents;
  if (!costQuote.withinLimit) return { allowed: false, total };
  costs.forEach(item => addCost(state, purchaseId, item.category, item.amount, item.category === 'friend_discount' ? 'incurred' : 'committed'));
  addReward(state, { participantId, purchaseId, type: 'sample', costCents: REFERRAL_RULES.sampleCostCents, sourceKey: `sample:${purchaseId}` });
  const credit = {
    rewardId: makeId('RWD'),
    participantId,
    purchaseId,
    type: 'credit',
    amountCents: REFERRAL_RULES.referrerCreditCents,
    remainingCents: REFERRAL_RULES.referrerCreditCents,
    sourceKey: `credit:${purchaseId}`,
    status: 'earned',
    assignedOrderId: null,
    earnedAt: new Date().toISOString()
  };
  const adjustments = state.pendingAdjustments.filter(item => item.participantId === participantId && item.remainingCents > 0);
  let creditOffset = 0;
  adjustments.forEach(adjustment => {
    const offset = Math.min(REFERRAL_RULES.referrerCreditCents - creditOffset, adjustment.remainingCents);
    if (offset <= 0) return;
    adjustment.remainingCents -= offset;
    adjustment.status = adjustment.remainingCents === 0 ? 'recovered' : 'pending';
    creditOffset += offset;
    const priorCost = state.costs.find(item => item.purchaseId === adjustment.purchaseId && item.category === 'referrer_credit');
    if (priorCost) priorCost.recoveredCents += offset;
  });
  credit.remainingCents -= creditOffset;
  if (credit.remainingCents === 0) credit.status = 'offset';
  state.rewards.push(credit);
  if (bagEligible) addReward(state, { participantId, purchaseId, type: 'bag', costCents: REFERRAL_RULES.bagCostCents, sourceKey: `bag:${participantId}:${milestoneNumber}` });
  return { allowed: true, total };
}

function validPurchases(state, participantId) {
  return state.purchases.filter(purchase => purchase.participantId === participantId && purchase.status === 'valid');
}

function getOrCreateParticipant(state, email, customerId = null, name = '') {
  const normalized = normalizeEmail(email);
  if (!customerId && typeof window !== 'undefined') {
    try {
      const customers = JSON.parse(window.localStorage.getItem('tueste_store_customers') || '[]');
      customerId = customers.find(item => item.email === normalized)?.id || null;
    } catch (error) {
      console.warn('No se pudo vincular el cliente existente al participante simulado:', error);
    }
  }
  let participant = state.participants.find(item => item.email === normalized);
  if (!participant) {
    participant = {
      participantId: customerId || makeId('PART'),
      customerId,
      email: normalized,
      name,
      status: 'active',
      activatedAt: new Date().toISOString()
    };
    state.participants.push(participant);
  }
  let link = state.links.find(item => item.participantId === participant.participantId && item.active);
  if (!link) {
    link = { linkId: makeId('LINK'), participantId: participant.participantId, token: makeId('R').replace(/[^a-z0-9]/gi, '').toLowerCase(), active: true, createdAt: new Date().toISOString() };
    state.links.push(link);
  }
  return { participant, link };
}

export function ensureReferralDemoScenario() {
  const state = getReferralState();
  if (!state.participants.some(item => item.email === 'invitador.demo@tueste.test')) {
    const { participant, link } = getOrCreateParticipant(state, 'invitador.demo@tueste.test', 'DEMO-PARTICIPANT', 'Invitador de demostración');
    participant.isDemo = true;
    link.token = 'tueste-demo';
    link.isDemo = true;
    event(state, 'demo_scenario_seeded', { dedupeKey: 'demo_scenario_seeded' });
    save(state);
  }
  return getReferralState();
}

export function resetReferralDemoScenario() {
  const empty = createEmptyState();
  save(empty);
  return ensureReferralDemoScenario();
}

export function setReferralDemoInventory({ sample, bag }) {
  const state = getReferralState();
  for (const [key, value] of [['sample', sample], ['bag', bag]]) {
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity < 0) {
      return { success: false, error: 'Las existencias de demostración deben ser enteros no negativos.' };
    }
    const current = state.inventory[key];
    if (quantity < current.reserved + current.shipped) {
      return { success: false, error: `No se puede fijar una existencia menor que las unidades reservadas o enviadas de ${key}.` };
    }
    state.inventory[key] = { ...current, onHand: quantity };
  }
  save(state);
  return { success: true, state };
}

export function getReferralLinkForEmail(email, customerId = null, name = '') {
  const state = getReferralState();
  const participant = state.participants.find(item => item.email === normalizeEmail(email));
  if (!participant) return null;
  const link = state.links.find(item => item.participantId === participant.participantId && item.active);
  return link ? { ...link, participant } : null;
}

export function getReferralToken() {
  if (typeof window === 'undefined') return null;
  const queryToken = getReferralQueryToken();
  const state = getReferralState();
  const attribution = state.lastAttribution;
  if (queryToken) {
    const attributionIsFresh = attribution
      && Date.now() - new Date(attribution.visitedAt).getTime() <= REFERRAL_RULES.attributionWindowDays * DAY_MS;
    if (attribution?.token === queryToken) return attributionIsFresh ? queryToken : null;
    if (attributionIsFresh) return attribution.token;
    return queryToken;
  }
  if (!attribution || Date.now() - new Date(attribution.visitedAt).getTime() > REFERRAL_RULES.attributionWindowDays * DAY_MS) return null;
  return attribution.token;
}

export function getReferralQueryToken() {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('ref');
}

export function recordReferralVisit(token) {
  const state = getReferralState();
  const link = state.links.find(item => item.token === token && item.active);
  if (!link) return { success: false, error: 'El enlace de referido no es válido.' };
  state.lastAttribution = { token, visitedAt: new Date().toISOString() };
  event(state, 'friend_store_visit', { linkId: link.linkId, participantId: link.participantId });
  save(state);
  return { success: true };
}

export function getReferralParticipantForToken(token) {
  if (!token) return null;
  const state = getReferralState();
  const link = state.links.find(item => item.token === token && item.active);
  return link ? state.participants.find(item => item.participantId === link.participantId) || null : null;
}

export function getCheckoutQuote({ items = [], email, orders = [], referralToken = null, useCredit = false, baseTotals = null }) {
  const subtotalCents = items.reduce((sum, item) => sum + cents(item.price) * Number(item.quantity || 0), 0);
  const baseShipping = baseTotals?.shippingCost ?? (subtotalCents >= REFERRAL_RULES.freeShippingThresholdCents ? 0 : dollars(REFERRAL_RULES.standardShippingCents));
  const original = {
    subtotal: dollars(subtotalCents),
    shippingCost: baseShipping,
    discount: 0,
    creditApplied: 0
  };
  const state = getReferralState();
  const normalizedEmail = normalizeEmail(email);
  const link = state.links.find(item => item.token === referralToken && item.active);
  const referrer = link ? state.participants.find(item => item.participantId === link.participantId) : null;
  const alreadyPurchased = orders.some(order => order.status === 'CONFIRMED' && normalizeEmail(order.customer?.email) === normalizedEmail);
  const currentParticipant = state.participants.find(item => item.email === normalizedEmail);
  const attribution = Boolean(normalizedEmail) && referrer && referrer.email !== normalizedEmail && !alreadyPurchased && subtotalCents >= REFERRAL_RULES.friendMinimumSubtotalCents;
  if (attribution) {
    const shipping = subtotalCents >= REFERRAL_RULES.freeShippingThresholdCents ? 0 : dollars(REFERRAL_RULES.standardShippingCents);
    const total = Math.max(0, subtotalCents - REFERRAL_RULES.friendDiscountCents) + cents(shipping);
    return {
      ...original,
      discount: dollars(REFERRAL_RULES.friendDiscountCents),
      total: dollars(total),
      mode: 'referral_discount',
      referralToken,
      referrerParticipantId: referrer.participantId,
      referrerEmail: referrer.email,
      valid: true,
      message: 'Descuento de referido aplicado. Simulación local.'
    };
  }

  const creditCents = state.rewards
    .filter(reward => reward.participantId === currentParticipant?.participantId && reward.type === 'credit' && reward.status === 'earned')
    .reduce((sum, reward) => sum + reward.remainingCents, 0);
  const canUseCredit = useCredit && currentParticipant && creditCents > 0 && !attribution;
  const creditApplied = canUseCredit ? Math.min(subtotalCents, creditCents) : 0;
  const shipping = original.shippingCost;
  return {
    ...original,
    creditApplied: dollars(creditApplied),
    total: dollars(Math.max(0, subtotalCents - creditApplied) + cents(shipping)),
    mode: canUseCredit ? 'referrer_credit' : 'standard',
    referrerParticipantId: currentParticipant?.participantId || null,
    creditAppliedCents: creditApplied,
    valid: false,
    message: referralToken && !attribution
      ? 'El enlace no aplica: revisa elegibilidad, compra previa o autorreferido.'
      : canUseCredit ? 'Crédito local aplicado al subtotal; no cubre envío.' : null
  };
}

export function recordApprovedReferralOrder(order, quote) {
  const state = getReferralState();
  if (state.purchases.some(item => item.orderId === order.orderId)) return { success: true, duplicate: true, state };
  assignExperiment(state, order);
  if (quote?.mode === 'referral_discount' && quote.valid) {
    const participant = state.participants.find(item => item.participantId === quote.referrerParticipantId);
    if (!participant || participant.email === normalizeEmail(order.customer?.email)) return { success: false, error: 'Atribución inválida o autorreferido.' };
    const currentValid = validPurchases(state, participant.participantId).length;
    const bagEligible = (currentValid + 1) % 3 === 0;
    const purchase = {
      referralPurchaseId: makeId('PUR'),
      orderId: order.orderId,
      participantId: participant.participantId,
      inviteeEmail: normalizeEmail(order.customer?.email),
      linkToken: quote.referralToken,
      discountCents: REFERRAL_RULES.friendDiscountCents,
      status: 'valid',
      createdAt: order.createdAt,
      isSimulated: true
    };
    const milestoneNumber = Math.floor((currentValid + 1) / 3);
    const costs = settleInviteeRewards(state, purchase.referralPurchaseId, participant.participantId, bagEligible, milestoneNumber);
    if (!costs.allowed) {
      purchase.status = 'reward_blocked';
      event(state, 'reward_blocked', { referralPurchaseId: purchase.referralPurchaseId, reason: 'CAP_EXCEEDED' });
    }
    state.purchases.push(purchase);
    if (costs.allowed) {
      event(state, 'referred_purchase_approved', { referralPurchaseId: purchase.referralPurchaseId, orderId: order.orderId });
    }
    save(state);
    return { success: true, purchase, state };
  }
  if (quote?.mode === 'referrer_credit' && quote.creditAppliedCents > 0) {
    const available = state.rewards
      .filter(reward => reward.participantId === quote.referrerParticipantId && reward.type === 'credit' && reward.status === 'earned')
      .sort((a, b) => a.earnedAt.localeCompare(b.earnedAt));
    let remaining = quote.creditAppliedCents;
    for (const credit of available) {
      const used = Math.min(credit.remainingCents, remaining);
      credit.remainingCents -= used;
      remaining -= used;
      const entry = state.costs.find(item => item.purchaseId === credit.purchaseId && item.category === 'referrer_credit');
      if (entry) {
        entry.committedCents = Math.max(0, entry.committedCents - used);
        entry.incurredCents += used;
        entry.status = 'incurred';
      }
      if (credit.remainingCents === 0) credit.status = 'used';
      if (remaining === 0) break;
    }
    order.referralCredit = { participantId: quote.referrerParticipantId, amountCents: quote.creditAppliedCents };
    event(state, 'referrer_credit_redeemed', { orderId: order.orderId, amountCents: quote.creditAppliedCents });
    save(state);
  }
  save(state);
  return { success: true, state };
}

export function verifyRewardFulfillment(order) {
  if (!order || order.status !== 'CONFIRMED' || !['PENDING_PREPARATION', 'IN_PREPARATION'].includes(order.fulfillmentStatus)) {
    return { success: false, error: 'Los premios solo se asignan a pedidos aprobados que aún no se han enviado ni cancelado.' };
  }
  const state = getReferralState();
  const participant = state.participants.find(item => item.email === normalizeEmail(order.customer?.email));
  if (!participant) return { success: false, error: 'El cliente aún no tiene un programa de referidos habilitado.' };
  if (!state.verifiedRewardOrders.includes(order.orderId)) state.verifiedRewardOrders.push(order.orderId);
  const before = state.rewards.filter(item => item.participantId === participant.participantId && item.status === 'earned').length;
  assignPendingRewards(state, participant.participantId, order);
  const after = state.rewards.filter(item => item.participantId === participant.participantId && item.status === 'assigned' && item.assignedOrderId === order.orderId).length;
  save(state);
  return { success: true, assigned: after, pending: Math.max(0, before - after), verified: true };
}

export function updateReferralDelivery(order) {
  const state = getReferralState();
  if (!order || order.status !== 'CONFIRMED' || order.fulfillmentStatus === 'CANCELLED') return state;
  const key = order.orderId;
  let confirmation = state.deliveries.find(item => item.orderId === key);
  if (!confirmation) {
    confirmation = { orderId: key, customerConfirmedAt: null, activatedAt: null };
    state.deliveries.push(confirmation);
  }
  if (order.fulfillmentStatus === 'DELIVERED' && confirmation.customerConfirmedAt && !confirmation.activatedAt) {
    const customer = order.customer || {};
    const { participant, link } = getOrCreateParticipant(state, customer.email, null, customer.name);
    confirmation.activatedAt = new Date().toISOString();
    confirmation.participantId = participant.participantId;
    confirmation.status = 'enabled';
    event(state, 'referral_program_activated', { orderId: key, participantId: participant.participantId, dedupeKey: `activation:${key}` });
    scheduleExperimentInvitation(state, participant);
    save(state);
    return { ...state, activatedLink: link };
  }
  confirmation.status = order.fulfillmentStatus === 'DELIVERED' ? 'awaiting_customer' : confirmation.customerConfirmedAt ? 'awaiting_delivery' : 'pending';
  save(state);
  return state;
}

function assignExperiment(state, order) {
  const email = normalizeEmail(order.customer?.email);
  if (!email || state.assignments.some(item => item.email === email && item.experimentId === 'referral-discovery-90d')) return;
  const variantId = Math.random() < 0.5 ? 'A' : 'B';
  const invitedAt = variantId === 'A'
    ? new Date(new Date(order.createdAt).getTime() + DAY_MS).toISOString()
    : null;
  const assignment = {
    assignmentId: makeId('AB'),
    experimentId: 'referral-discovery-90d',
    participantId: null,
    email,
    variantId,
    assignedAt: new Date().toISOString(),
    invitedAt,
    status: variantId === 'A' ? 'scheduled' : 'awaiting_activation',
    visitedAt: null,
    invitationActionAt: null
  };
  state.assignments.push(assignment);
  if (variantId === 'A') event(state, 'experiment_invitation_scheduled', { assignmentId: assignment.assignmentId, variantId, invitedAt, dedupeKey: `ab-scheduled:${assignment.assignmentId}` });
}

function scheduleExperimentInvitation(state, participant) {
  let assignment = state.assignments.find(item => item.email === participant.email);
  if (!assignment) return;
  assignment.participantId = participant.participantId;
  if (assignment.variantId === 'B' && !assignment.invitedAt) {
    assignment.invitedAt = new Date().toISOString();
    assignment.status = 'invited';
    event(state, 'experiment_invitation', { assignmentId: assignment.assignmentId, variantId: 'B', dedupeKey: `ab-invite:${assignment.assignmentId}` });
  }
}

export function confirmCustomerDelivery(orderId, email, orders) {
  const order = orders.find(item => item.orderId === orderId);
  if (!order || order.status !== 'CONFIRMED') return { success: false, error: 'Pedido no encontrado o pago simulado no aprobado.' };
  if (normalizeEmail(order.customer?.email) !== normalizeEmail(email)) return { success: false, error: 'El correo no coincide con el pedido.' };
  const state = getReferralState();
  let confirmation = state.deliveries.find(item => item.orderId === orderId);
  if (confirmation?.customerConfirmedAt && confirmation.activatedAt) return { success: true, duplicate: true, state };
  if (!confirmation) {
    confirmation = { orderId, customerConfirmedAt: new Date().toISOString(), activatedAt: null };
    state.deliveries.push(confirmation);
  } else {
    confirmation.customerConfirmedAt = confirmation.customerConfirmedAt || new Date().toISOString();
  }
  save(state);
  updateReferralDelivery(order);
  const updated = getReferralState();
  return { success: true, state: updated };
}

export function getOrdersForCustomer(email, orders) {
  const normalized = normalizeEmail(email);
  return orders.filter(order => order.status === 'CONFIRMED' && normalizeEmail(order.customer?.email) === normalized);
}

export function recordProgramVisit(email, token = null) {
  const state = getReferralState();
  const normalized = normalizeEmail(email);
  const assignment = state.assignments.find(item => item.email === normalized);
  const unique = `program-visit:${normalized}:${assignment?.experimentId || 'none'}`;
  event(state, 'program_visit', { email: normalized, token, assignmentId: assignment?.assignmentId || null, dedupeKey: unique });
  if (assignment && assignment.invitedAt && Date.now() <= new Date(assignment.invitedAt).getTime() + 7 * DAY_MS) {
    assignment.visitedAt = new Date().toISOString();
    event(state, 'experiment_program_visit', { assignmentId: assignment.assignmentId, variantId: assignment.variantId, dedupeKey: `ab-visit:${assignment.assignmentId}` });
  }
  save(state);
  return state;
}

export function recordShareClick(participantId, channel = 'whatsapp') {
  const state = getReferralState();
  const share = event(state, 'share_click', { participantId, channel });
  if (share) save(state);
  return share;
}

export function recordInvitationAction(email) {
  const state = getReferralState();
  const participant = state.participants.find(item => item.email === normalizeEmail(email));
  if (!participant) return false;
  const assignment = state.assignments.find(item => item.participantId === participant.participantId);
  const now = Date.now();
  const isInMeasurementWindow = assignment?.invitedAt
    && now >= new Date(assignment.invitedAt).getTime()
    && now <= new Date(assignment.invitedAt).getTime() + 7 * DAY_MS;
  if (assignment && isInMeasurementWindow) {
    assignment.invitationActionAt = assignment.invitationActionAt || new Date().toISOString();
    event(state, 'experiment_invitation_action', { assignmentId: assignment.assignmentId, variantId: assignment.variantId, dedupeKey: `ab-action:${assignment.assignmentId}` });
  }
  save(state);
  return true;
}

export function getReferralDashboardMetrics(now = Date.now()) {
  const state = getReferralState();
  let changed = false;
  state.assignments.forEach(assignment => {
    if (assignment.variantId === 'A' && assignment.status === 'scheduled' && assignment.invitedAt && now >= new Date(assignment.invitedAt).getTime()) {
      assignment.status = 'invited';
      event(state, 'experiment_invitation', { assignmentId: assignment.assignmentId, variantId: 'A', invitedAt: assignment.invitedAt, dedupeKey: `ab-invite:${assignment.assignmentId}` });
      changed = true;
    }
  });
  if (changed) save(state);
  const valid = state.purchases.filter(item => item.status === 'valid');
  const weekStart = now - 7 * DAY_MS;
  const weeklyAssignments = state.assignments.filter(item => item.invitedAt
    && new Date(item.invitedAt).getTime() >= weekStart
    && new Date(item.invitedAt).getTime() <= now);
  const weeklyParticipantIds = new Set(weeklyAssignments.map(item => item.participantId));
  const weeklyPurchases = valid.filter(item => weeklyParticipantIds.has(item.participantId)
    && new Date(item.createdAt).getTime() >= weekStart
    && new Date(item.createdAt).getTime() <= now).length;
  const totalCost = state.costs.reduce((sum, cost) => sum + cost.committedCents + cost.incurredCents - cost.recoveredCents, 0);
  const variants = ['A', 'B'].map(variantId => {
    const assignments = state.assignments.filter(item => item.variantId === variantId && item.invitedAt && item.status === 'invited');
    const complete = assignments.filter(item => now >= new Date(item.invitedAt).getTime() + 7 * DAY_MS);
    const visited = complete.filter(item => item.visitedAt);
    const visitors = complete.filter(item => item.visitedAt);
    const actions = visitors.filter(item => item.invitationActionAt);
    return {
      variantId,
      assigned: assignments.length,
      completeWindows: complete.length,
      visits: visited.length,
      discoveryRate: complete.length ? visited.length / complete.length : null,
      invitationActions: actions.length,
      actionRate: visitors.length ? actions.length / visitors.length : null,
      isSimulated: true
    };
  });
  return {
    referrals: valid.length,
    approvedPurchases: valid.length,
    weeklyNorthStarPer100: weeklyAssignments.length ? (weeklyPurchases / weeklyAssignments.length) * 100 : null,
    weeklyInvitations: weeklyAssignments.length,
    weeklyPurchases,
    rewardsCommitted: dollars(state.costs.reduce((sum, item) => sum + item.committedCents, 0)),
    rewardsIncurred: dollars(state.costs.reduce((sum, item) => sum + item.incurredCents, 0)),
    rewardsRecovered: dollars(state.costs.reduce((sum, item) => sum + item.recoveredCents, 0)),
    netAttributedCost: dollars(totalCost),
    blockedRewards: state.rewards.filter(item => item.status === 'blocked').length,
    pendingPhysical: state.rewards.filter(item => ['sample', 'bag'].includes(item.type) && item.status === 'earned').length,
    variants,
    state
  };
}

export function getParticipantProgress(email) {
  const state = getReferralState();
  const participant = state.participants.find(item => item.email === normalizeEmail(email));
  if (!participant) return null;
  const purchases = validPurchases(state, participant.participantId);
  const rewards = state.rewards.filter(item => item.participantId === participant.participantId);
  const creditCents = rewards.filter(item => item.type === 'credit').reduce((sum, reward) => sum + (reward.remainingCents || 0), 0);
  const link = state.links.find(item => item.participantId === participant.participantId && item.active);
  const accumulatedCosts = purchases.map(purchase => ({
    purchase,
    costCents: referralCosts(state, purchase.referralPurchaseId)
  }));
  return {
    participant,
    link,
    purchases,
    rewards,
    credit: dollars(creditCents),
    accumulatedCosts,
    deliveries: state.deliveries.filter(item => item.participantId === participant.participantId),
    assignment: state.assignments.find(item => item.participantId === participant.participantId)
  };
}

export function getRewardInventory() {
  return getReferralState().inventory;
}

function assignPendingRewards(state, participantId, order) {
  const availableFor = type => {
    const inventory = state.inventory[type];
    return inventory.onHand - inventory.reserved - inventory.shipped;
  };
  const pending = state.rewards.filter(item => item.participantId === participantId && ['sample', 'bag'].includes(item.type) && item.status === 'earned');
  pending.forEach(reward => {
    const type = reward.type === 'sample' ? 'sample' : 'bag';
    if (availableFor(type) <= 0) return;
    const entry = state.costs.find(item => item.rewardId === reward.rewardId);
    if (!entry || referralCosts(state, reward.purchaseId) > REFERRAL_RULES.maxRewardCostCents) {
      reward.status = 'blocked';
      return;
    }
    state.inventory[type].reserved += 1;
    reward.status = 'assigned';
    reward.assignedOrderId = order.orderId;
    event(state, 'reward_assigned', { rewardId: reward.rewardId, orderId: order.orderId, dedupeKey: `assign:${reward.rewardId}` });
  });
}

export function updateReferralOrderFulfillment(order) {
  const state = getReferralState();
  const tied = state.rewards.filter(item => item.assignedOrderId === order?.orderId && item.status === 'assigned');
  let changed = false;
  if (order?.fulfillmentStatus === 'CANCELLED') {
    tied.forEach(reward => {
      const type = reward.type === 'sample' ? 'sample' : 'bag';
      state.inventory[type].reserved = Math.max(0, state.inventory[type].reserved - 1);
      reward.status = 'earned';
      reward.assignedOrderId = null;
      changed = true;
    });
  } else if (order?.fulfillmentStatus === 'SHIPPED') {
    tied.forEach(reward => {
      const type = reward.type === 'sample' ? 'sample' : 'bag';
      state.inventory[type].reserved = Math.max(0, state.inventory[type].reserved - 1);
      state.inventory[type].shipped += 1;
      reward.status = 'shipped';
      reward.shippedAt = new Date().toISOString();
      const entry = state.costs.find(item => item.rewardId === reward.rewardId);
      if (entry) {
        entry.committedCents = Math.max(0, entry.committedCents - reward.costCents);
        entry.incurredCents += reward.costCents;
        entry.status = 'incurred';
      }
      event(state, 'reward_shipped', { rewardId: reward.rewardId, orderId: order.orderId, dedupeKey: `shipped:${reward.rewardId}` });
      changed = true;
    });
  } else if (order?.fulfillmentStatus === 'DELIVERED') {
    state.rewards.filter(item => item.assignedOrderId === order.orderId && item.status === 'shipped').forEach(reward => {
      reward.status = 'delivered';
      reward.deliveredAt = new Date().toISOString();
      changed = true;
    });
  }
  if (changed) save(state);
  return state;
}

export function cancelReferralPurchase(orderId) {
  const state = getReferralState();
  const purchase = state.purchases.find(item => item.orderId === orderId);
  if (!purchase || purchase.status === 'cancelled') return { success: true, duplicate: true, state };
  purchase.status = 'cancelled';
  state.costs.filter(item => item.purchaseId === purchase.referralPurchaseId).forEach(cost => {
    if (cost.category === 'friend_discount') {
      cost.recoveredCents += cost.incurredCents;
      cost.incurredCents = 0;
      cost.status = 'recovered';
    }
  });
  const rewards = state.rewards.filter(item => item.purchaseId === purchase.referralPurchaseId);
  rewards.forEach(reward => {
    if (reward.type === 'credit') {
      const used = reward.amountCents - reward.remainingCents;
      if (reward.remainingCents > 0) {
        const cost = state.costs.find(item => item.purchaseId === purchase.referralPurchaseId && item.category === 'referrer_credit');
        if (cost) {
          const recover = Math.min(cost.committedCents, reward.remainingCents);
          cost.committedCents -= recover;
          cost.recoveredCents += recover;
          cost.status = cost.committedCents ? 'committed' : 'recovered';
        }
        reward.remainingCents = 0;
      }
      if (used > 0) state.pendingAdjustments.push({ adjustmentId: makeId('ADJ'), participantId: reward.participantId, purchaseId: purchase.referralPurchaseId, amountCents: used, remainingCents: used, status: 'pending' });
      reward.status = used > 0 ? 'adjustment_pending' : 'void';
    } else if (['sample', 'bag'].includes(reward.type) && !['shipped', 'delivered'].includes(reward.status)) {
      if (reward.status === 'assigned') {
        const type = reward.type === 'sample' ? 'sample' : 'bag';
        state.inventory[type].reserved = Math.max(0, state.inventory[type].reserved - 1);
      }
      const cost = state.costs.find(item => item.rewardId === reward.rewardId);
      if (cost) {
        cost.recoveredCents += cost.committedCents;
        cost.committedCents = 0;
        cost.status = 'recovered';
      }
      reward.status = 'void';
      reward.assignedOrderId = null;
    }
  });
  const count = validPurchases(state, purchase.participantId).length;
  const eligibleMilestones = new Set(Array.from({ length: Math.floor(count / 3) }, (_, index) => `bag:${purchase.participantId}:${index + 1}`));
  state.rewards.filter(item => item.participantId === purchase.participantId && item.type === 'bag' && !eligibleMilestones.has(item.sourceKey) && !['shipped', 'delivered'].includes(item.status)).forEach(reward => {
    if (reward.status === 'assigned') {
      state.inventory.bag.reserved = Math.max(0, state.inventory.bag.reserved - 1);
    }
    const cost = state.costs.find(item => item.rewardId === reward.rewardId);
    if (cost) {
      cost.recoveredCents += cost.committedCents;
      cost.committedCents = 0;
      cost.status = 'recovered';
    }
    reward.status = 'void';
    reward.assignedOrderId = null;
  });
  event(state, 'referred_purchase_cancelled', { referralPurchaseId: purchase.referralPurchaseId, orderId, dedupeKey: `cancel:${purchase.referralPurchaseId}` });
  save(state);
  return { success: true, state };
}

export function getOriginalCaseFunnel() {
  return [
    { label: 'Contactados', value: 1000 },
    { label: 'Aperturas de correo (caso)', value: 350 },
    { label: 'Visitas al programa', value: 120 },
    { label: 'Invitadores', value: 100 },
    { label: 'Invitaciones enviadas', value: 300 },
    { label: 'Visitas de amigos', value: 150 },
    { label: 'Compras referidas', value: 60 }
  ];
}
