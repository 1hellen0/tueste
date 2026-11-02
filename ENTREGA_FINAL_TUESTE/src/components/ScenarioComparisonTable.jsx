import React from 'react';
import { PRESET_SCENARIOS, calculateDashboardMetrics } from '../utils/financialFormulas';
import { Check, ArrowRight, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function ScenarioComparisonTable({ onSelectScenario, customMetrics, customParams }) {
  // Precalcular métricas de los 4 escenarios predeterminados
  const hoy = calculateDashboardMetrics(PRESET_SCENARIOS.HOY.params);
  const agencia = calculateDashboardMetrics(PRESET_SCENARIOS.AGENCIA.params);
  const recomBase = calculateDashboardMetrics(PRESET_SCENARIOS.RECOM_BASE.params);
  const hipotesis = calculateDashboardMetrics(PRESET_SCENARIOS.HIPOTESIS.params);

  const rows = [
    {
      category: 'Parámetros de Entrada',
      items: [
        { label: 'Inversión mensual en Meta Ads', hoy: '$8.000', ag: '$16.000', rb: '$8.000', hip: '$6.000', live: `$${customParams.metaSpend.toLocaleString()}` },
        { label: 'Fee mensual agencia Impulso Digital', hoy: '$1.000', ag: '$1.000', rb: '$1.000', hip: '$1.000', live: `$${customParams.agencyFee.toLocaleString()}` },
        { label: 'Gasto total mensual adquisición', hoy: '$9.000', ag: '$17.000', rb: '$9.000', hip: '$7.000', live: `$${(customParams.metaSpend + customParams.agencyFee).toLocaleString()}` },
        { label: 'Clientes nuevos captados Meta', hoy: '165', ag: '235', rb: '165', hip: '132,5', live: Math.round(customMetrics.metaCustomers).toString() },
        { label: 'Clientes nuevos orgánicos fijos', hoy: '47', ag: '47', rb: '47', hip: '47', live: customParams.organicCustomers.toString() },
        { label: 'Total clientes nuevos al mes', hoy: '212', ag: '282', rb: '212', hip: '179,5', live: Math.round(customMetrics.totalNewCustomers).toString() },
        { label: 'Descuento 1er pedido cliente suelto', hoy: '0,0%', ag: '30,0%', rb: '0,0%', hip: '0,0%', live: `${(customParams.firstOrderDiscount * 100).toFixed(0)}%` },
        { label: 'Política de envío gratis', hoy: 'Gratis en todo', ag: 'Gratis en todo', rb: 'Gratis solo > $45', hip: 'Gratis solo > $45', live: customParams.shippingThresholdPolicy ? 'Gratis solo > $45' : 'Gratis en todo' },
        { label: 'Mix clientes suscriptores', hoy: '15,0% (Oficial)', ag: '15,0% (Oficial)', rb: '15,0% (Oficial)', hip: '20,0% (Hipótesis)', live: `${(customParams.subscribersMix * 100).toFixed(0)}%` }
      ]
    },
    {
      category: 'Cascada Unitaria 1er Pedido Suelto',
      items: [
        { label: 'Precio cobrado al cliente', hoy: '$34,00', ag: '$23,80', rb: '$38,50', hip: '$38,50', live: `$${customMetrics.unitLooseFirst.grossPrice.toFixed(2)}` },
        { label: 'Costo del café (grano y tueste)', hoy: '$10,88', ag: '$10,88', rb: '$10,88', hip: '$10,88', live: `$${customMetrics.unitLooseFirst.coffeeCost.toFixed(2)}` },
        { label: 'CM1 ($)', hoy: '$23,12', ag: '$12,92', rb: '$27,62', hip: '$27,62', live: `$${customMetrics.unitLooseFirst.cm1.toFixed(2)}` },
        { label: 'Total costos de entrega y variables', hoy: '$7,23', ag: '$6,77', rb: '$7,43', hip: '$7,43', live: `$${customMetrics.unitLooseFirst.totalVariableDelivery.toFixed(2)}` },
        { label: 'MARGEN CM2 ($)', hoy: '$15,89', ag: '$6,15', rb: '$20,19', hip: '$20,19', live: `$${customMetrics.unitLooseFirst.cm2.toFixed(2)}`, highlight: true },
        { label: 'MARGEN CM2 (%)', hoy: '46,7%', ag: '25,8%', rb: '52,4%', hip: '52,4%', live: `${(customMetrics.unitLooseFirst.cm2Pct * 100).toFixed(1)}%` },
        { label: 'ROAS de Break-Even Requerido', hoy: '2,14x', ag: '3,87x', rb: '1,91x', hip: '1,91x', live: `${customMetrics.unitLooseFirst.roasBreakEven.toFixed(2)}x` },
      ]
    },
    {
      category: 'Economía Unitaria & Adquisición',
      items: [
        { label: 'ROAS real de adquisición 1er pedido', hoy: '0,70x', ag: '0,35x', rb: '0,79x', hip: '0,85x', live: `${customMetrics.realRoas.toFixed(2)}x` },
        { label: 'CAC de anuncios (Solo Meta / Clientes)', hoy: '$48,48', ag: '$68,09', rb: '$48,48', hip: '$45,28', live: `$${customMetrics.cacAds.toFixed(2)}` },
        { label: 'CAC REAL FULLY-LOADED ((Meta+Fee)/Cli)', hoy: '$54,55', ag: '$72,34', rb: '$54,55', hip: '$52,83', live: `$${customMetrics.cacReal.toFixed(2)}`, highlight: true },
        { label: 'CAC Marginal frente al tramo base', hoy: '-', ag: '$114,29', rb: '$0,00', hip: 'Optimizado', live: `$${customMetrics.marginalCac.toFixed(2)}` },
        { label: 'LTV 12 meses cliente suelto', hoy: '$47,67', ag: '$37,93', rb: '$60,56', hip: '$60,56', live: `$${customMetrics.ltvLoose.toFixed(2)}` },
        { label: 'LTV 12 meses suscriptor', hoy: '$95,84', ag: '$95,84', rb: '$95,84', hip: '$95,84', live: `$${customMetrics.ltvSub.toFixed(2)}` },
        { label: 'LTV 12 MESES CLIENTE PROMEDIO', hoy: '$54,90', ag: '$46,62', rb: '$65,86', hip: '$67,62', live: `$${customMetrics.ltvBlended.toFixed(2)}`, highlight: true },
        { label: 'RATIO LTV:CAC REAL', hoy: '1,01x', ag: '0,64x', rb: '1,21x', hip: '1,28x', live: `${customMetrics.ltvToCac.toFixed(2)}x`, highlight: true, isRatio: true },
        { label: 'PAYBACK EN CAJA', hoy: 'Mes 12', ag: 'No recupera en 12m', rb: 'Mes 10', hip: 'Mes 9', live: customMetrics.paybackMonth, highlight: true },
        { label: 'Saldo bancario empresa Mes 3 (Piso $5k)', hoy: '$22.800', ag: '$1.212 (Peligro)', rb: '$26.450', hip: '$28.120', live: `$${customMetrics.companySimulation[2]?.bankBalance.toFixed(0)}` }
      ]
    }
  ];

  return (
    <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-forest-800 mb-5">
        <div>
          <h3 className="font-bold text-cream-100 text-base">Matriz Comparativa de Decisión Estratégica</h3>
          <p className="text-xs text-cream-400 mt-0.5">
            Evaluación lado a lado de los escenarios oficiales del Caso A — Tueste y tu configuración activa
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-forest-750 text-cream-200">
              <th className="py-3 px-3 font-bold w-1/4">Parámetro / Métrica Clave</th>
              <th className="py-3 px-3 font-bold text-center bg-forest-950/40 rounded-t-lg">
                <div className="text-blue-300">1. HOY ($8k)</div>
                <div className="text-[10px] text-cream-400 font-normal">Mix Oficial 85/15</div>
                <button
                  onClick={() => onSelectScenario('HOY')}
                  className="mt-1.5 px-2 py-0.5 rounded text-[10px] bg-forest-800 hover:bg-forest-700 text-cream-200 transition"
                >
                  Cargar
                </button>
              </th>
              <th className="py-3 px-3 font-bold text-center bg-red-950/30 rounded-t-lg">
                <div className="text-red-300">2. AGENCIA ($16k)</div>
                <div className="text-[10px] text-cream-400 font-normal">30% Desc / 85/15</div>
                <button
                  onClick={() => onSelectScenario('AGENCIA')}
                  className="mt-1.5 px-2 py-0.5 rounded text-[10px] bg-red-900/50 hover:bg-red-800 text-red-200 transition"
                >
                  Cargar
                </button>
              </th>
              <th className="py-3 px-3 font-bold text-center bg-emerald-950/30 rounded-t-lg">
                <div className="text-emerald-300">3. RECOM. BASE</div>
                <div className="text-[10px] text-cream-400 font-normal">Mix Oficial 85/15</div>
                <button
                  onClick={() => onSelectScenario('RECOM_BASE')}
                  className="mt-1.5 px-2 py-0.5 rounded text-[10px] bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 transition"
                >
                  Cargar
                </button>
              </th>
              <th className="py-3 px-3 font-bold text-center bg-purple-950/30 rounded-t-lg">
                <div className="text-purple-300">3B. HIPÓTESIS</div>
                <div className="text-[10px] text-cream-400 font-normal">Mix 80/20 · Pauta $6k</div>
                <button
                  onClick={() => onSelectScenario('HIPOTESIS')}
                  className="mt-1.5 px-2 py-0.5 rounded text-[10px] bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition"
                >
                  Cargar
                </button>
              </th>
              <th className="py-3 px-3 font-bold text-center bg-gold-950/20 border-l border-gold-800/40 rounded-t-lg">
                <div className="text-gold-300">PERSONALIZADO</div>
                <div className="text-[10px] text-cream-400 font-normal">Tus Sliders</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/60">
            {rows.map((sec, sIdx) => (
              <React.Fragment key={sIdx}>
                <tr className="bg-forest-950/80 font-bold text-gold-400/90 text-[11px] uppercase tracking-wider">
                  <td colSpan={6} className="py-2 px-3">{sec.category}</td>
                </tr>
                {sec.items.map((it, rIdx) => {
                  return (
                    <tr 
                      key={rIdx} 
                      className={`hover:bg-forest-850/40 transition-colors ${
                        it.highlight ? 'font-semibold bg-forest-950/30' : 'text-cream-200'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-cream-200">{it.label}</td>
                      <td className="py-2.5 px-3 text-center bg-forest-950/20">{it.hoy}</td>
                      <td className="py-2.5 px-3 text-center bg-red-950/20 text-red-300">{it.ag}</td>
                      <td className="py-2.5 px-3 text-center bg-emerald-950/20 text-emerald-300">{it.rb}</td>
                      <td className="py-2.5 px-3 text-center bg-purple-950/20 text-purple-300">{it.hip}</td>
                      <td className="py-2.5 px-3 text-center bg-gold-950/10 border-l border-gold-800/30 font-bold text-gold-400">
                        {it.live}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Fila Resumen / Veredicto */}
            <tr className="bg-forest-950 border-t-2 border-forest-700 text-center font-bold">
              <td className="py-3.5 px-3 text-left text-cream-100 uppercase tracking-wider text-[11px]">
                Veredicto Estratégico
              </td>
              <td className="py-3.5 px-3 text-blue-300">Frágil (Payback M12)</td>
              <td className="py-3.5 px-3 text-red-400 bg-red-950/40">DESTRUCCIÓN DE CAJA</td>
              <td className="py-3.5 px-3 text-emerald-300 bg-emerald-950/40">MEJORA ESTRUCTURAL (BASE)</td>
              <td className="py-3.5 px-3 text-purple-300 bg-purple-950/40">ÓPTIMO (SENSIBILIDAD)</td>
              <td className="py-3.5 px-3 text-gold-400 border-l border-gold-800/30">
                {customMetrics.isHealthy ? 'CRECIMIENTO RENTABLE' : customMetrics.isWarning ? 'ZONA INTERMEDIA' : 'DESTRUCTOR DE CAJA'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
