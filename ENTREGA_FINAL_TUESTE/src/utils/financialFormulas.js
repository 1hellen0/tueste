/**
 * Motor de Cálculo Financiero y Unit Economics — Caso A: Tueste
 * Funciones puras independientes de la UI para garantizar compatibilidad 
 * con la Calculadora Nivel 1 (.xlsx) y Google Sheets (< 1% diferencia).
 */

export const HISTORICAL_META = [
  { spend: 0, customers: 0, label: 'Base $0' },
  { spend: 4000, customers: 100, label: 'Marzo ($4k)' },
  { spend: 8000, customers: 165, label: 'Jul-Sep ($8k)' },
  { spend: 12000, customers: 210, label: 'Octubre ($12k)' },
  { spend: 16000, customers: 235, label: 'Abril ($16k)' },
  { spend: 20000, customers: 250, label: 'Junio ($20k)' }
];

export const LOOSE_ORDERS_CALENDAR = [
  1.00, 0.15, 0.20, 0.20, 0.20, 0.20, 0.20, 0.15, 0.15, 0.15, 0.20, 0.20
];

export const DEFAULT_PARAMETERS = {
  metaSpend: 8000,
  pricePerBag: 17.00,
  bagsPerOrder: 2,
  coffeeCostPerBag: 5.44,
  shippingCost: 4.50,
  gatewayPct: 0.045,
  packagingCost: 1.20,
  subscribersMix: 0.15,
  churnRate: 0.09,
  annualLooseOrders: 3.00,
  agencyFee: 1000,
  firstOrderDiscount: 0.00,
  organicCustomers: 47,
  shippingThresholdPolicy: false, // false = gratis en todo, true = cobrado < $45
  pack3BagsActive: false,         // true = habilitar pack 3 bolsas $48
  reportedMetaRoas: 3.00,
};

export const PRESET_SCENARIOS = {
  HOY: {
    id: 'HOY',
    name: 'Situación Actual (Septiembre)',
    badge: 'DATO OFICIAL BASE',
    badgeColor: 'blue',
    description: 'Pauta de $8.000 en Meta, mix 85/15, envío gratis en todo y sin descuentos.',
    params: {
      ...DEFAULT_PARAMETERS,
      metaSpend: 8000,
      firstOrderDiscount: 0.00,
      shippingThresholdPolicy: false,
      pack3BagsActive: false,
      subscribersMix: 0.15,
    }
  },
  AGENCIA: {
    id: 'AGENCIA',
    name: 'Propuesta Agencia Impulso Digital',
    badge: 'PROPUESTA RIESGO',
    badgeColor: 'red',
    description: 'Duplicar pauta a $16.000 con 30% de descuento en el 1er pedido. Envío gratis en todo.',
    params: {
      ...DEFAULT_PARAMETERS,
      metaSpend: 16000,
      firstOrderDiscount: 0.30,
      shippingThresholdPolicy: false,
      pack3BagsActive: false,
      subscribersMix: 0.15,
    }
  },
  RECOM_BASE: {
    id: 'RECOM_BASE',
    name: 'Equipo Recom. Base (Mix Oficial 85/15)',
    badge: 'RECOMENDACIÓN OFICIAL',
    badgeColor: 'emerald',
    description: 'Misma pauta ($8.000) y mix oficial 85/15. Envío gratis solo > $45 y Pack 3 bolsas a $48.',
    params: {
      ...DEFAULT_PARAMETERS,
      metaSpend: 8000,
      firstOrderDiscount: 0.00,
      shippingThresholdPolicy: true,
      pack3BagsActive: true,
      subscribersMix: 0.15,
    }
  },
  HIPOTESIS: {
    id: 'HIPOTESIS',
    name: 'Hipótesis Sensibilidad (Mix 80/20 + Pauta $6k)',
    badge: 'HIPÓTESIS DE SENSIBILIDAD',
    badgeColor: 'amber',
    description: 'Optimización de checkout (+5% suscriptores), pauta eficiente a $6.000 pausando retargeting 180d.',
    params: {
      ...DEFAULT_PARAMETERS,
      metaSpend: 6000,
      firstOrderDiscount: 0.00,
      shippingThresholdPolicy: true,
      pack3BagsActive: true,
      subscribersMix: 0.20,
    }
  }
};

/**
 * Interpola linealmente los clientes nuevos de Meta según la curva histórica oficial.
 */
export function interpolateMetaCustomers(spend) {
  if (spend <= 0) return 0;
  if (spend >= HISTORICAL_META[HISTORICAL_META.length - 1].spend) {
    const last = HISTORICAL_META[HISTORICAL_META.length - 1];
    const prev = HISTORICAL_META[HISTORICAL_META.length - 2];
    const slope = (last.customers - prev.customers) / (last.spend - prev.spend);
    return last.customers + (spend - last.spend) * slope;
  }

  for (let i = 0; i < HISTORICAL_META.length - 1; i++) {
    const p1 = HISTORICAL_META[i];
    const p2 = HISTORICAL_META[i + 1];
    if (spend >= p1.spend && spend <= p2.spend) {
      const slope = (p2.customers - p1.customers) / (p2.spend - p1.spend);
      return p1.customers + (spend - p1.spend) * slope;
    }
  }
  return 0;
}

/**
 * Calcula el CAC marginal del tramo actual de inversión.
 */
export function getMarginalCac(spend) {
  if (spend <= 0) return 0;
  for (let i = 1; i < HISTORICAL_META.length; i++) {
    const pPrev = HISTORICAL_META[i - 1];
    const pCurr = HISTORICAL_META[i];
    if (spend <= pCurr.spend || i === HISTORICAL_META.length - 1) {
      const deltaSpend = pCurr.spend - pPrev.spend;
      const deltaCustomers = pCurr.customers - pPrev.customers;
      return deltaCustomers > 0 ? deltaSpend / deltaCustomers : 0;
    }
  }
  return 0;
}

/**
 * Cascada de contribución unitaria por tipo de pedido.
 */
export function calculateUnitOrder({
  type = 'loose_base', // 'loose_base', 'subscription', 'loose_discount', 'pack_3', 'loose_pays_shipping'
  pricePerBag = 17.00,
  bagsPerOrder = 2,
  coffeeCostPerBag = 5.44,
  shippingCost = 4.50,
  gatewayPct = 0.045,
  packagingCost = 1.20,
  discountPct = 0.00
}) {
  let grossPrice = 0;
  let coffeeCost = 0;
  let shippingTueste = 0;
  let packaging = 0;

  if (type === 'subscription') {
    grossPrice = (pricePerBag * bagsPerOrder) * 0.90; // 10% desc suscripción
    coffeeCost = coffeeCostPerBag * bagsPerOrder;
    shippingTueste = shippingCost;
    packaging = packagingCost;
  } else if (type === 'pack_3') {
    grossPrice = 48.00;
    coffeeCost = coffeeCostPerBag * 3;
    shippingTueste = shippingCost; // Gratis porque $48 >= $45
    packaging = 1.40; // Caja más grande
  } else if (type === 'loose_pays_shipping') {
    grossPrice = (pricePerBag * bagsPerOrder) + shippingCost; // $34 + $4.50 = $38.50
    coffeeCost = coffeeCostPerBag * bagsPerOrder;
    shippingTueste = shippingCost;
    packaging = packagingCost;
  } else {
    // loose_base o loose_discount
    const baseList = pricePerBag * bagsPerOrder;
    grossPrice = baseList * (1 - discountPct);
    coffeeCost = coffeeCostPerBag * bagsPerOrder; // Café no varía con descuento
    shippingTueste = shippingCost;
    packaging = packagingCost;
  }

  const cm1 = grossPrice - coffeeCost;
  const cm1Pct = grossPrice > 0 ? (cm1 / grossPrice) : 0;
  const gatewayFee = grossPrice * gatewayPct;
  const totalVariableDelivery = shippingTueste + gatewayFee + packaging;
  const cm2 = cm1 - totalVariableDelivery;
  const cm2Pct = grossPrice > 0 ? (cm2 / grossPrice) : 0;
  const roasBreakEven = cm2Pct > 0 ? (1 / cm2Pct) : 0;

  return {
    grossPrice,
    coffeeCost,
    cm1,
    cm1Pct,
    shippingTueste,
    gatewayFee,
    packaging,
    totalVariableDelivery,
    cm2,
    cm2Pct,
    roasBreakEven
  };
}

/**
 * Calcula todas las métricas integradas para los parámetros dados.
 */
export function calculateDashboardMetrics(params) {
  const p = { ...DEFAULT_PARAMETERS, ...params };

  // 1. Clientes Meta y Adquisición
  const metaCustomers = interpolateMetaCustomers(p.metaSpend);
  const totalNewCustomers = metaCustomers + p.organicCustomers;
  const totalAdSpend = p.metaSpend + p.agencyFee;
  const cacAds = metaCustomers > 0 ? p.metaSpend / metaCustomers : 0;
  const cacReal = metaCustomers > 0 ? totalAdSpend / metaCustomers : 0;
  const marginalCac = getMarginalCac(p.metaSpend);

  // 2. Cascadas Unitarias
  // Primer pedido cliente suelto
  let looseFirstOrderType = 'loose_base';
  if (p.firstOrderDiscount > 0) {
    looseFirstOrderType = 'loose_discount';
  } else if (p.shippingThresholdPolicy) {
    looseFirstOrderType = 'loose_pays_shipping';
  }

  const unitLooseFirst = calculateUnitOrder({
    type: looseFirstOrderType,
    pricePerBag: p.pricePerBag,
    bagsPerOrder: p.bagsPerOrder,
    coffeeCostPerBag: p.coffeeCostPerBag,
    shippingCost: p.shippingCost,
    gatewayPct: p.gatewayPct,
    packagingCost: p.packagingCost,
    discountPct: p.firstOrderDiscount
  });

  // Pedidos siguientes cliente suelto
  const looseSubsequentOrderType = p.shippingThresholdPolicy ? 'loose_pays_shipping' : 'loose_base';
  const unitLooseSubsequent = calculateUnitOrder({
    type: looseSubsequentOrderType,
    pricePerBag: p.pricePerBag,
    bagsPerOrder: p.bagsPerOrder,
    coffeeCostPerBag: p.coffeeCostPerBag,
    shippingCost: p.shippingCost,
    gatewayPct: p.gatewayPct,
    packagingCost: p.packagingCost,
    discountPct: 0.00
  });

  // Suscripción
  const unitSubscription = calculateUnitOrder({
    type: 'subscription',
    pricePerBag: p.pricePerBag,
    bagsPerOrder: p.bagsPerOrder,
    coffeeCostPerBag: p.coffeeCostPerBag,
    shippingCost: p.shippingCost,
    gatewayPct: p.gatewayPct,
    packagingCost: p.packagingCost,
    discountPct: 0.00
  });

  // Pack 3 bolsas (referencia)
  const unitPack3 = calculateUnitOrder({
    type: 'pack_3',
    coffeeCostPerBag: p.coffeeCostPerBag,
    shippingCost: p.shippingCost,
    gatewayPct: p.gatewayPct
  });

  // 3. LTV a 12 meses
  // Cliente suelto: 1 primer pedido + 2 pedidos subsecuentes = 3 pedidos en total
  const ltvLoose = (1 * unitLooseFirst.cm2) + ((p.annualLooseOrders - 1) * unitLooseSubsequent.cm2);
  
  // Suscriptor: serie geométrica de 12 meses con retención mensual
  const retentionMonths = p.churnRate > 0 ? (1 - Math.pow(1 - p.churnRate, 12)) / p.churnRate : 12;
  const ltvSub = unitSubscription.cm2 * retentionMonths;

  // Promedio ponderado
  const looseMix = 1 - p.subscribersMix;
  const ltvBlended = (looseMix * ltvLoose) + (p.subscribersMix * ltvSub);
  const ltvToCac = cacReal > 0 ? ltvBlended / cacReal : 0;

  // 4. ROAS de Adquisición Real
  // Supuesto oficial: primer pedido toma precio lista base $34 (o cobrado)
  const revenueFirstOrderPerClient = (looseMix * unitLooseFirst.grossPrice) + (p.subscribersMix * unitSubscription.grossPrice);
  const totalRevenueNewClients = metaCustomers * revenueFirstOrderPerClient;
  const realRoas = p.metaSpend > 0 ? totalRevenueNewClients / p.metaSpend : 0;

  // 5. Curva de Caja Acumulada del Cliente (Mes 0 al 12)
  const cashCurve = [];
  let cumulativeCash = -cacReal;
  cashCurve.push({
    month: 0,
    contribution: 0,
    cumulativeCash: cumulativeCash,
    isPayback: false
  });

  let paybackMonth = null;

  for (let m = 1; m <= 12; m++) {
    const looseOrdersInMonth = LOOSE_ORDERS_CALENDAR[m - 1] || 0.10;
    const subRetentionInMonth = Math.pow(1 - p.churnRate, m - 1);

    const looseCm2 = (m === 1) ? unitLooseFirst.cm2 : unitLooseSubsequent.cm2;
    const monthlyContribution = (looseMix * looseOrdersInMonth * looseCm2) + (p.subscribersMix * subRetentionInMonth * unitSubscription.cm2);

    const prevCash = cumulativeCash;
    cumulativeCash += monthlyContribution;

    let isPayback = false;
    if (prevCash < 0 && cumulativeCash >= 0 && paybackMonth === null) {
      paybackMonth = m;
      isPayback = true;
    }

    cashCurve.push({
      month: m,
      contribution: monthlyContribution,
      cumulativeCash: cumulativeCash,
      isPayback: isPayback
    });
  }

  // 6. Balance Neto Mes 1 Nuevos Clientes
  const mes1ContributionNewClients = metaCustomers * ((looseMix * unitLooseFirst.cm2) + (p.subscribersMix * unitSubscription.cm2));
  const mes1NetCash = mes1ContributionNewClients - totalAdSpend;

  // 7. Simulación de Caja Empresa (4 Meses)
  const initialBank = 35000;
  const monthlyFixedCosts = 6500;
  const companySimulation = [];
  let currentBank = initialBank;

  for (let m = 1; m <= 4; m++) {
    const existingBase = 9000 * Math.pow(0.97, m - 1);
    
    // Contribución de cohortes acumuladas
    let cohortContribution = 0;
    for (let c = 1; c <= m; c++) {
      const age = m - c;
      const looseOrders = LOOSE_ORDERS_CALENDAR[age] || 0.10;
      const subRet = Math.pow(1 - p.churnRate, age);
      
      const sCm2Meta = (age === 0) ? unitLooseFirst.cm2 : unitLooseSubsequent.cm2;
      const metaContrib = metaCustomers * ((looseMix * looseOrders * sCm2Meta) + (p.subscribersMix * subRet * unitSubscription.cm2));
      
      const sCm2Org = unitLooseSubsequent.cm2;
      const orgContrib = p.organicCustomers * ((looseMix * looseOrders * sCm2Org) + (p.subscribersMix * subRet * unitSubscription.cm2));

      cohortContribution += (metaContrib + orgContrib);
    }

    const totalInflows = existingBase + cohortContribution;
    const totalOutflows = p.metaSpend + p.agencyFee + monthlyFixedCosts;
    const netFlow = totalInflows - totalOutflows;
    currentBank += netFlow;

    companySimulation.push({
      month: m,
      inflows: totalInflows,
      outflows: totalOutflows,
      netFlow: netFlow,
      bankBalance: currentBank,
      perforatesFloor: currentBank < 5000,
      isBankrupt: currentBank < 0
    });
  }

  return {
    metaCustomers,
    totalNewCustomers,
    cacAds,
    cacReal,
    marginalCac,
    unitLooseFirst,
    unitLooseSubsequent,
    unitSubscription,
    unitPack3,
    ltvLoose,
    ltvSub,
    ltvBlended,
    ltvToCac,
    realRoas,
    reportedRoas: p.reportedMetaRoas,
    paybackMonth: paybackMonth ? `Mes ${paybackMonth}` : 'No recupera en 12m',
    paybackNumeric: paybackMonth,
    mes1NetCash,
    cashCurve,
    companySimulation,
    isHealthy: ltvToCac >= 3.0,
    isWarning: ltvToCac >= 1.0 && ltvToCac < 3.0,
    isDanger: ltvToCac < 1.0,
  };
}

/**
 * =========================================================================
 * NIVEL 3: SIMULADOR DE CAJA A 24 MESES POR COHORTES
 * =========================================================================
 */

export const PRESET_PLANS_24M = {
  PLAN_1: {
    id: 'PLAN_1',
    name: 'Plan 1: $8.000 Fijos (Oficial Base)',
    badge: 'ESTÁNDAR BASE',
    badgeColor: 'blue',
    description: 'Inversión constante de $8.000 USD/mes durante los 24 meses. Mix oficial 85/15 y envío gratis tradicional.',
    spends: Array(24).fill(8000),
    discountFirstOrder: 0.0,
    shippingThresholdPolicy: false,
  },
  PLAN_2: {
    id: 'PLAN_2',
    name: 'Plan 2: Propuesta Agencia ($16.000 Fijos)',
    badge: 'DESTRUCCIÓN DE CAJA',
    badgeColor: 'red',
    description: 'Inversión de $16.000 USD/mes con 30% de descuento en primer pedido de sueltos. Envío gratis en todo.',
    spends: Array(24).fill(16000),
    discountFirstOrder: 0.30,
    shippingThresholdPolicy: false,
  },
  PLAN_3: {
    id: 'PLAN_3',
    name: 'Plan 3: Estrategia Propia 1 (Pauta Eficiente $6.000)',
    badge: 'ALTA EFICIENCIA',
    badgeColor: 'emerald',
    description: 'Pauta fija de $6.000 USD/mes (máxima eficiencia) + Pack 3 bolsas y envíos cobrados < $45.',
    spends: Array(24).fill(6000),
    discountFirstOrder: 0.0,
    shippingThresholdPolicy: true,
  },
  PLAN_4: {
    id: 'PLAN_4',
    name: 'Plan 4: Estrategia Propia 2 (Escalamiento Óptimo $6k-$8k)',
    badge: 'CRECIMIENTO ÓPTIMO (GANADOR)',
    badgeColor: 'purple',
    description: 'Meses 1-6 a $6.000 USD (acumula liquidez) y Meses 7-24 escalado a $8.000 USD con las políticas de Diego.',
    spends: [...Array(6).fill(6000), ...Array(18).fill(8000)],
    discountFirstOrder: 0.0,
    shippingThresholdPolicy: true,
  }
};

/**
 * Simulación Financiera Completa de 24 Meses por Cohortes
 */
export function simulate24MonthsCohorts({
  monthlySpends = Array(24).fill(8000),
  discountFirstOrder = 0.0,
  shippingThresholdPolicy = false,
  includeTostadora = false,
  tostadoraMonth = 3, // Mes 3 (Diciembre) por defecto
  subscribersMix = 0.15,
  churnRate = 0.09,
  organicCustomers = 47,
  initialBank = 35000,
  monthlyFixedCosts = 6500,
  initialExistingBase = 9000,
  existingBaseMonthlyDecay = 0.03
}) {
  // Asegurar array de 24 meses
  const spends = Array(24).fill(0).map((_, i) => (typeof monthlySpends[i] === 'number' ? monthlySpends[i] : 8000));

  // Márgenes unitarios según política
  const cm2LooseBase = shippingThresholdPolicy ? 20.1875 : 15.89;
  const cm2LooseFirst = discountFirstOrder > 0 ? 6.149 : cm2LooseBase;
  const cm2Sub = 12.643;
  const looseMix = 1 - subscribersMix;

  let currentBank = initialBank;
  let minBank = initialBank;
  let minBankMonth = 0;
  let violatesFloor = false;

  // Verificación Regla 2: Inversión mes 13-24 >= Promedio mes 1-12
  const sumM1_12 = spends.slice(0, 12).reduce((a, b) => a + b, 0);
  const avgM1_12 = sumM1_12 / 12;
  const rule2Violations = [];

  for (let m = 13; m <= 24; m++) {
    const spend = spends[m - 1];
    if (spend < avgM1_12 - 0.01) {
      rule2Violations.push({ month: m, spend, required: avgM1_12 });
    }
  }
  const violatesRule2 = rule2Violations.length > 0;

  const ledger = [];

  for (let m = 1; m <= 24; m++) {
    const spend = spends[m - 1];
    const fee = spend > 0 ? 1000 : 0;
    
    // Tostadora ($14.000) si aplica
    const tostadoraCost = (includeTostadora && m === tostadoraMonth) ? 14000 : 0;
    const outflows = spend + fee + monthlyFixedCosts + tostadoraCost;

    // Base existente (caída compuesta del 3% mensual)
    const existingBase = initialExistingBase * Math.pow(1 - existingBaseMonthlyDecay, m - 1);

    // Cohortes acumuladas que aportan en el mes m
    let cohortsContribution = 0;
    let activeSubscribersThisMonth = 0;
    let newCustomersThisMonth = 0;

    for (let c = 1; c <= m; c++) {
      const age = m - c; // 0 para el mes de nacimiento
      const spendInBirthMonth = spends[c - 1];
      const metaInBirth = interpolateMetaCustomers(spendInBirthMonth);
      const totalBirth = metaInBirth + organicCustomers;

      if (c === m) {
        newCustomersThisMonth = totalBirth;
      }

      // Suscriptores activos de esta cohorte
      const subRetention = Math.pow(1 - churnRate, age);
      const subsFromCoh = totalBirth * subscribersMix * subRetention;
      activeSubscribersThisMonth += subsFromCoh;

      // Pedidos cliente suelto
      const ordersLoose = age < 12 ? LOOSE_ORDERS_CALENDAR[age] : 0.10;

      // Contribución
      let contribLooseMeta = 0;
      if (age === 0 && discountFirstOrder > 0) {
        contribLooseMeta = metaInBirth * looseMix * ordersLoose * cm2LooseFirst;
      } else {
        contribLooseMeta = metaInBirth * looseMix * ordersLoose * cm2LooseBase;
      }

      const contribLooseOrg = organicCustomers * looseMix * ordersLoose * cm2LooseBase;
      const contribSub = totalBirth * subscribersMix * subRetention * cm2Sub;

      cohortsContribution += (contribLooseMeta + contribLooseOrg + contribSub);
    }

    const totalInflows = existingBase + cohortsContribution;
    const netCashFlow = totalInflows - outflows;
    currentBank += netCashFlow;

    if (currentBank < minBank) {
      minBank = currentBank;
      minBankMonth = m;
    }

    if (currentBank < 5000) {
      violatesFloor = true;
    }

    ledger.push({
      month: m,
      spend,
      fee,
      fixedCosts: monthlyFixedCosts,
      tostadoraCost,
      outflows,
      existingBase,
      cohortsContribution,
      inflows: totalInflows,
      netCashFlow,
      bankBalance: currentBank,
      activeSubscribers: activeSubscribersThisMonth,
      newCustomers: newCustomersThisMonth,
      perforatesFloor: currentBank < 5000,
      isBankrupt: currentBank < 0,
      avgM1_12: avgM1_12,
      isRule2Applicable: m >= 13,
      violatesRule2ThisMonth: m >= 13 && spend < avgM1_12 - 0.01
    });
  }

  const finalCash = ledger[23].bankBalance;
  const finalActiveSubs = ledger[23].activeSubscribers;

  return {
    spends,
    ledger,
    finalCash,
    minBank,
    minBankMonth,
    finalActiveSubs,
    violatesFloor,
    violatesRule2,
    avgM1_12,
    rule2Violations,
    isCompliant: !violatesFloor && !violatesRule2,
    includeTostadora,
    tostadoraMonth
  };
}

/**
 * Simulación de los 4 Planes Obligatorios de Nivel 3 y Determinación del Ganador
 */
export function evaluateAllPlans24M(options = {}) {
  const plans = {};
  
  Object.keys(PRESET_PLANS_24M).forEach((key) => {
    const preset = PRESET_PLANS_24M[key];
    plans[key] = {
      ...preset,
      result: simulate24MonthsCohorts({
        monthlySpends: preset.spends,
        discountFirstOrder: preset.discountFirstOrder,
        shippingThresholdPolicy: preset.shippingThresholdPolicy,
        includeTostadora: options.includeTostadora || false,
        tostadoraMonth: options.tostadoraMonth || 3,
        subscribersMix: 0.15,
        churnRate: 0.09,
        organicCustomers: 47
      })
    };
  });

  // Determinar plan ganador: mayor caja final en mes 24 sin violar reglas (desempate: suscriptores)
  const compliantPlans = Object.values(plans).filter((p) => p.result.isCompliant);
  
  let winner = null;
  if (compliantPlans.length > 0) {
    compliantPlans.sort((a, b) => {
      if (Math.abs(b.result.finalCash - a.result.finalCash) > 0.01) {
        return b.result.finalCash - a.result.finalCash;
      }
      return b.result.finalActiveSubs - a.result.finalActiveSubs;
    });
    winner = compliantPlans[0].id;
  }

  return {
    plans,
    winner,
    compliantPlans
  };
}

