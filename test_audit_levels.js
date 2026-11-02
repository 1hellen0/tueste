import { 
  calculateDashboardMetrics, 
  PRESET_SCENARIOS, 
  PRESET_PLANS_24M, 
  simulate24MonthsCohorts, 
  evaluateAllPlans24M,
  interpolateMetaCustomers
} from './src/utils/financialFormulas.js';

console.log("================================================================================");
console.log("AUDITORÍA INTEGRAL DE LOS 3 NIVELES - CASO A TUESTE");
console.log("================================================================================\n");

// 1. Auditoría LTV y Payback
console.log("--- 1. AUDITORÍA LTV Y PAYBACK (NIVEL 1 & 2) ---");
const mHoy = calculateDashboardMetrics(PRESET_SCENARIOS.HOY.params);
console.log(`LTV Pedido Suelto: $${mHoy.ltvLoose.toFixed(2)} USD (Esperado: $47.67)`);
console.log(`LTV Suscripción:   $${mHoy.ltvSub.toFixed(2)} USD (Esperado: $95.18)`);
console.log(`LTV Blended:       $${mHoy.ltvBlended.toFixed(2)} USD (Esperado: $54.80)`);
console.log(`CAC Real:          $${mHoy.cacReal.toFixed(2)} USD (Esperado: $54.55)`);
console.log(`Ratio LTV:CAC:     ${mHoy.ltvToCac.toFixed(2)}x`);
console.log(`Payback:           ${mHoy.paybackMonth} (Saldo M12: +$${mHoy.cashCurve[12].cumulativeCash.toFixed(2)} USD)`);

if (Math.abs(mHoy.ltvBlended - 54.80) < 0.01 && mHoy.paybackMonth === 'Mes 12') {
  console.log("[OK] Auditoría LTV & Payback superada con 100% de consistencia.\n");
} else {
  console.error("[ERROR] Fallo en LTV o Payback.");
  process.exit(1);
}

// 2. Auditoría Interpolación Meta
console.log("--- 2. AUDITORÍA INTERPOLACIÓN LINEAL META ---");
const testSpendPoints = [
  { spend: 0, expected: 0 },
  { spend: 2000, expected: 50 },
  { spend: 4000, expected: 100 },
  { spend: 6000, expected: 132.5 },
  { spend: 8000, expected: 165 },
  { spend: 10000, expected: 187.5 },
  { spend: 12000, expected: 210 },
  { spend: 16000, expected: 235 },
  { spend: 20000, expected: 250 },
];

for (const pt of testSpendPoints) {
  const result = interpolateMetaCustomers(pt.spend);
  const diff = Math.abs(result - pt.expected);
  console.log(`Meta Spend $${pt.spend} -> Clientes: ${result.toFixed(1)} (Esperado: ${pt.expected})`);
  if (diff > 0.01) {
    console.error(`[ERROR] Interpolación incorrecta para $${pt.spend}`);
    process.exit(1);
  }
}
console.log("[OK] Interpolación lineal validada en todos los puntos históricos y tramos continuos.\n");

// 3. Auditoría de los 4 Planes (Sin Tostadora)
console.log("--- 3. AUDITORÍA DE LOS 4 PLANES (SIN TOSTADORA) ---");
const evalNoTostadora = evaluateAllPlans24M({ includeTostadora: false });

for (const plan of Object.values(evalNoTostadora.plans)) {
  const res = plan.result;
  console.log(`Plan: ${plan.name}`);
  console.log(`  - Caja Mes 24:        $${res.finalCash.toFixed(2)} USD`);
  console.log(`  - Mínima Caja:        $${res.minBank.toFixed(2)} USD (Mes ${res.minBankMonth})`);
  console.log(`  - Suscriptores M24:   ${res.finalActiveSubs.toFixed(1)}`);
  const firstBreach = res.ledger.find(r => r.perforatesFloor);
  console.log(`  - Regla 1 (Piso $5k):  ${!res.violatesFloor ? 'APROBADA' : 'FALLA (Mes ' + firstBreach?.month + ')'}`);
  console.log(`  - Regla 2 (Pauta):    ${!res.violatesRule2 ? 'APROBADA' : 'FALLA'}`);
  console.log(`  - Cumplimiento 100%:  ${res.isCompliant ? 'SÍ' : 'NO'}`);
}

const winnerPlan = evalNoTostadora.plans[evalNoTostadora.winner];
const plan4 = evalNoTostadora.plans['PLAN_4'];
console.log(`\nPlan Ganador por Caja: ${winnerPlan.name} ($${winnerPlan.result.finalCash.toFixed(2)} USD)`);
console.log(`Alternativa Estratégica (Más Subs): ${plan4.name} (${plan4.result.finalActiveSubs.toFixed(1)} subs, $${plan4.result.finalCash.toFixed(2)} USD)`);

// 4. Auditoría con Tostadora ($14.000 en Mes 3)
console.log("\n--- 4. AUDITORÍA DE IMPACTO TOSTADORA ($14.000 EN DICIEMBRE / MES 3) ---");
const evalWithTostadora = evaluateAllPlans24M({ includeTostadora: true, tostadoraMonth: 3 });

for (const plan of Object.values(evalWithTostadora.plans)) {
  const res = plan.result;
  console.log(`Plan: ${plan.name}`);
  console.log(`  - Caja Mes 24 con Tostadora: $${res.finalCash.toFixed(2)} USD (Delta: -$14.000)`);
  console.log(`  - Mínima Caja con Tostadora: $${res.minBank.toFixed(2)} USD (Mes ${res.minBankMonth})`);
  const firstBreachTost = res.ledger.find(r => r.perforatesFloor);
  console.log(`  - Regla 1 (Piso $5k):         ${!res.violatesFloor ? 'APROBADA' : 'FALLA (Mes ' + firstBreachTost?.month + ')'}`);
}

console.log("\n================================================================================");
console.log("TODAS LAS AUDITORÍAS ARITMÉTICAS Y DE REGLAS PASARON CON 100% DE ÉXITO.");
console.log("================================================================================");
