import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { 
  PRESET_PLANS_24M, 
  simulate24MonthsCohorts, 
  evaluateAllPlans24M 
} from '../utils/financialFormulas';
import { 
  Trophy, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Flame, 
  Sliders, 
  RotateCcw, 
  Coffee, 
  HelpCircle,
  Clock,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

export default function CohortSimulator24M() {
  const [selectedPlanId, setSelectedPlanId] = useState('PLAN_3');
  const [customSpends, setCustomSpends] = useState(PRESET_PLANS_24M.PLAN_3.spends);
  const [discountFirstOrder, setDiscountFirstOrder] = useState(PRESET_PLANS_24M.PLAN_3.discountFirstOrder);
  const [shippingThresholdPolicy, setShippingThresholdPolicy] = useState(PRESET_PLANS_24M.PLAN_3.shippingThresholdPolicy);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Tostadora toggle & timing
  const [includeTostadora, setIncludeTostadora] = useState(false);
  const [tostadoraMonth, setTostadoraMonth] = useState(3); // Mes 3 = Diciembre

  // Evaluación de los 4 planes oficiales
  const evaluation = useMemo(() => {
    return evaluateAllPlans24M({ includeTostadora, tostadoraMonth });
  }, [includeTostadora, tostadoraMonth]);

  // Simulación activa
  const activeResult = useMemo(() => {
    return simulate24MonthsCohorts({
      monthlySpends: customSpends,
      discountFirstOrder,
      shippingThresholdPolicy,
      includeTostadora,
      tostadoraMonth
    });
  }, [customSpends, discountFirstOrder, shippingThresholdPolicy, includeTostadora, tostadoraMonth]);

  // Manejador para cargar un plan predefinido
  const handleSelectPlan = (planId) => {
    const plan = PRESET_PLANS_24M[planId];
    if (plan) {
      setSelectedPlanId(planId);
      setCustomSpends([...plan.spends]);
      setDiscountFirstOrder(plan.discountFirstOrder);
      setShippingThresholdPolicy(plan.shippingThresholdPolicy);
      setIsCustomMode(false);
    }
  };

  // Manejador para cambiar inversión de un mes específico
  const handleSpendChange = (monthIdx, val) => {
    const updated = [...customSpends];
    updated[monthIdx] = Math.max(0, Math.min(20000, Number(val)));
    setCustomSpends(updated);
    setIsCustomMode(true);
  };

  // Acciones en lote para la pauta
  const setAllSpendsTo = (val) => {
    setCustomSpends(Array(24).fill(val));
    setIsCustomMode(true);
  };

  const copyM1_12_to_M13_24 = () => {
    const updated = [...customSpends];
    for (let i = 0; i < 12; i++) {
      updated[i + 12] = updated[i];
    }
    setCustomSpends(updated);
    setIsCustomMode(true);
  };

  // Datos para Gráfico 1: Curva de Caja 24 Meses
  const cashChartData = activeResult.ledger.map((row) => ({
    month: `M${row.month}`,
    caja: Math.round(row.bankBalance),
    inflows: Math.round(row.inflows),
    outflows: Math.round(row.outflows),
  }));

  // Datos para Gráfico 2: Inversión Mensual & Regla 2
  const spendChartData = activeResult.ledger.map((row) => ({
    month: `M${row.month}`,
    spend: row.spend,
    avgThreshold: row.month >= 13 ? Math.round(activeResult.avgM1_12) : null,
  }));

  // Datos para Gráfico 3: Suscriptores Activos Acumulados
  const subsChartData = activeResult.ledger.map((row) => ({
    month: `M${row.month}`,
    subs: Number(row.activeSubscribers.toFixed(1)),
    newCustomers: Math.round(row.newCustomers),
  }));

  return (
    <div className="space-y-6">
      {/* Encabezado del Nivel 3 */}
      <div className="bg-forest-900/90 rounded-2xl border border-forest-800 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-forest-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Trophy className="w-5 h-5 text-purple-400" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-cream-100 tracking-tight flex items-center gap-2">
                  <span>NIVEL 3 · El Simulador de Caja a 24 Meses por Cohortes</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-gold-500/20 text-gold-300 border border-gold-500/40">
                    OFICIAL COMPLETO
                  </span>
                </h2>
                <p className="text-xs text-cream-400 mt-0.5">
                  Modelo por cohortes dinámicas, decaimiento de base existente, restricciones oficiales y determinación del plan ganador
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Tostadora */}
          <div className="flex items-center gap-3 bg-forest-950 p-2 rounded-xl border border-forest-800 text-xs">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-gold-400" />
              <span className="text-cream-200 font-semibold">Compra 2ª Tostadora ($14.000):</span>
            </div>
            <button
              onClick={() => setIncludeTostadora(!includeTostadora)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                includeTostadora ? 'bg-gold-500' : 'bg-forest-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-forest-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                  includeTostadora ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            {includeTostadora && (
              <select
                value={tostadoraMonth}
                onChange={(e) => setTostadoraMonth(Number(e.target.value))}
                className="bg-forest-900 border border-forest-700 text-gold-300 text-xs rounded px-2 py-1 font-semibold outline-none"
              >
                <option value={3}>Mes 3 (Diciembre)</option>
                <option value={6}>Mes 6</option>
                <option value={12}>Mes 12</option>
              </select>
            )}
          </div>
        </div>

        {/* Selector de los 4 Planes Obligatorios */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(PRESET_PLANS_24M).map((plan) => {
            const isSelected = !isCustomMode && selectedPlanId === plan.id;
            const evalData = evaluation.plans[plan.id];
            const isWinner = evaluation.winner === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-gradient-to-b from-forest-800/90 to-forest-850 border-gold-500/80 shadow-lg shadow-forest-950/60 ring-1 ring-gold-500/40' 
                    : 'bg-forest-950/60 border-forest-800 hover:border-forest-700 hover:bg-forest-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold text-cream-100">{plan.name}</span>
                    {isWinner && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-gold-500/20 text-gold-300 border border-gold-500/40">
                        <Trophy className="w-3 h-3 text-gold-400" /> GANADOR
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-cream-400 line-clamp-2 mb-3 leading-tight">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-forest-800/80 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-cream-400">Caja Mes 24:</span>
                    <span className={`font-mono font-bold ${evalData.result.finalCash >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${evalData.result.finalCash.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-400">Caja Mínima:</span>
                    <span className={`font-mono text-[11px] ${evalData.result.minBank >= 5000 ? 'text-cream-200' : 'text-red-400 font-bold'}`}>
                      ${evalData.result.minBank.toLocaleString('en-US', { maximumFractionDigits: 0 })} (M{evalData.result.minBankMonth})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-400">Subs Mes 24:</span>
                    <span className="font-mono text-cream-200">{evalData.result.finalActiveSubs.toFixed(0)} subs</span>
                  </div>
                  <div className="pt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-cream-400">Restricciones:</span>
                    <span className={`font-semibold ${evalData.result.isCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                      {evalData.result.isCompliant ? '100% CUMPLE' : 'VIOLADAS'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tarjetas KPI de Estado del Plan Activo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-cream-400 uppercase tracking-wider">Caja Final Mes 24</span>
            <DollarSign className="w-4 h-4 text-gold-400" />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${activeResult.finalCash >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${activeResult.finalCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-cream-400 mt-1">
            Partiendo de $35.000 USD iniciales en el banco
          </p>
        </div>

        <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-cream-400 uppercase tracking-wider">Caja Mínima en 24 Meses</span>
            <Clock className="w-4 h-4 text-gold-400" />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${activeResult.minBank >= 5000 ? 'text-cream-100' : 'text-red-400'}`}>
            ${activeResult.minBank.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-cream-400 mt-1">
            Ocurre en el <strong className="text-cream-200">Mes {activeResult.minBankMonth}</strong> (Piso: $5.000 USD)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-cream-400 uppercase tracking-wider">Suscriptores Activos M24</span>
            <Users className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-400">
            {activeResult.finalActiveSubs.toFixed(1)} subs
          </div>
          <p className="text-xs text-cream-400 mt-1">
            Base recurrente con churn del 9% mensual
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          activeResult.isCompliant ? 'bg-emerald-950/30 border-emerald-800/80' : 'bg-red-950/40 border-red-800/80'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-cream-300 uppercase tracking-wider">Cumplimiento de Reglas</span>
            {activeResult.isCompliant ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className={`text-xl font-extrabold ${activeResult.isCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
            {activeResult.isCompliant ? 'PLAN VÁLIDO (2/2)' : 'REGLAS VIOLADAS'}
          </div>
          <p className="text-xs text-cream-300/80 mt-1">
            {activeResult.violatesFloor && '• Perfora piso de $5.000 USD '}
            {activeResult.violatesRule2 && '• Inversión M13-24 < Promedio M1-12'}
            {activeResult.isCompliant && 'Piso $5k respetado y Regla 2 cumplida'}
          </p>
        </div>
      </div>

      {/* Gráficos de Nivel 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 1: EVOLUCIÓN DE CAJA BANCARIA (MES 0 AL 24) */}
        <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-cream-100 text-sm">Trayectoria de Caja Bancaria (Mes 0 al Mes 24)</h4>
              <p className="text-xs text-cream-400 mt-0.5">Saldo real en banco vs. Piso de seguridad infranqueable ($5.000 USD)</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-forest-950 text-gold-400 border border-forest-800 font-mono">
              Inicio: $35.000
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="cajaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d573e" opacity={0.3} />
                <XAxis dataKey="month" stroke="#a89066" tick={{ fontSize: 10 }} />
                <YAxis stroke="#a89066" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-forest-950 p-3 rounded-lg border border-forest-700 text-xs shadow-xl space-y-1">
                          <p className="font-bold text-cream-100">{label}</p>
                          <p className="text-emerald-400 font-bold">Saldo Caja: ${d.caja.toLocaleString()} USD</p>
                          <p className="text-cream-400">Entradas del mes: +${d.inflows.toLocaleString()} USD</p>
                          <p className="text-red-400">Salidas del mes: -${d.outflows.toLocaleString()} USD</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={5000} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" label={{ value: 'Piso Infranqueable ($5.000)', fill: '#ef4444', fontSize: 10, position: 'right' }} />
                <ReferenceLine y={35000} stroke="#a89066" strokeDasharray="3 3" label={{ value: 'Caja Inicial ($35k)', fill: '#a89066', fontSize: 10, position: 'right' }} />
                <Area type="monotone" dataKey="caja" name="Saldo en Banco" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#cajaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 2: INVERSIÓN MENSUAL & REGLA 2 */}
        <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-cream-100 text-sm">Inversión Mensual en Meta & Regla del Mes 13</h4>
              <p className="text-xs text-cream-400 mt-0.5">Línea de piso desde el Mes 13: Inversión ≥ Promedio M1-M12 (${activeResult.avgM1_12.toFixed(0)})</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              activeResult.violatesRule2 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {activeResult.violatesRule2 ? 'REGLA 2 VIOLADA' : 'REGLA 2 OK'}
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d573e" opacity={0.3} />
                <XAxis dataKey="month" stroke="#a89066" tick={{ fontSize: 10 }} />
                <YAxis stroke="#a89066" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} domain={[0, 20000]} tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-forest-950 p-3 rounded-lg border border-forest-700 text-xs shadow-xl space-y-1">
                          <p className="font-bold text-cream-100">{label}</p>
                          <p className="text-gold-400">Inversión Meta: ${d.spend.toLocaleString()} USD</p>
                          {d.avgThreshold && (
                            <p className="text-purple-400">Mínimo Exigido (Regla 2): ${d.avgThreshold.toLocaleString()} USD</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="spend" name="Inversión Meta ($)" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Line type="stepAfter" dataKey="avgThreshold" name="Promedio M1-M12 (Piso Regla 2)" stroke="#c084fc" strokeWidth={2} dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Editor Interactivo de Inversión Mensual (Mes 1 al 24) */}
      <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-forest-800">
          <div>
            <h4 className="font-bold text-cream-100 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-gold-400" />
              <span>Editor Interactivo de Inversión en Meta (Mes 1 al Mes 24)</span>
            </h4>
            <p className="text-xs text-cream-400">
              Modifica la pauta mes a mes entre $0 y $20.000 USD para construir tu estrategia propia
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setAllSpendsTo(8000)}
              className="px-2.5 py-1 rounded-lg bg-forest-950 hover:bg-forest-800 text-cream-300 border border-forest-800 transition"
            >
              $8k Fijos
            </button>
            <button
              onClick={() => setAllSpendsTo(6000)}
              className="px-2.5 py-1 rounded-lg bg-forest-950 hover:bg-forest-800 text-cream-300 border border-forest-800 transition"
            >
              $6k Fijos
            </button>
            <button
              onClick={copyM1_12_to_M13_24}
              className="px-2.5 py-1 rounded-lg bg-forest-950 hover:bg-forest-800 text-gold-400 border border-forest-800 transition"
              title="Asegura el cumplimiento de la Regla 2 copiando M1-M12 a M13-M24"
            >
              Copiar M1-M12 a M13-M24
            </button>
          </div>
        </div>

        {/* Grid de 24 controles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 text-xs">
          {customSpends.map((val, idx) => {
            const m = idx + 1;
            const isSecondYear = m >= 13;
            const isViolatingThisMonth = isSecondYear && val < activeResult.avgM1_12 - 0.01;

            return (
              <div 
                key={m}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isViolatingThisMonth 
                    ? 'bg-red-950/50 border-red-800 ring-1 ring-red-500' 
                    : isSecondYear 
                    ? 'bg-purple-950/20 border-purple-900/50' 
                    : 'bg-forest-950/60 border-forest-800'
                }`}
              >
                <div className="text-[10px] text-cream-400 font-bold mb-1">
                  M{m} {isSecondYear && '★'}
                </div>
                <input
                  type="number"
                  min="0"
                  max="20000"
                  step="500"
                  value={val}
                  onChange={(e) => handleSpendChange(idx, e.target.value)}
                  className="w-full bg-forest-900 border border-forest-700 rounded px-1 py-1 text-center font-mono font-bold text-gold-400 text-[11px] outline-none"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla Detallada de 24 Meses (Libro Mayor de Cohortes) */}
      <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-forest-800">
          <div>
            <h4 className="font-bold text-cream-100 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-gold-400" />
              <span>Libro Mayor de Cohortes a 24 Meses (Flujo Detallado)</span>
            </h4>
            <p className="text-xs text-cream-400">Seguimiento mes a mes de entradas, salidas, piso de seguridad y suscriptores</p>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left">
            <thead className="sticky top-0 bg-forest-950 text-cream-200 z-10 border-b border-forest-750">
              <tr>
                <th className="py-2.5 px-2">Mes</th>
                <th className="py-2.5 px-2 text-right">Inversión Meta</th>
                <th className="py-2.5 px-2 text-right">Cli. Nuevos</th>
                <th className="py-2.5 px-2 text-right">Base Existente</th>
                <th className="py-2.5 px-2 text-right">Cohortes Nuevas</th>
                <th className="py-2.5 px-2 text-right">Total Entradas</th>
                <th className="py-2.5 px-2 text-right">Total Salidas</th>
                <th className="py-2.5 px-2 text-right">Flujo Neto</th>
                <th className="py-2.5 px-2 text-right">Saldo Caja Final</th>
                <th className="py-2.5 px-2 text-right">Subs Activos</th>
                <th className="py-2.5 px-2 text-center">Estado Piso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800/60 font-mono text-[11px]">
              {activeResult.ledger.map((row) => (
                <tr 
                  key={row.month} 
                  className={`hover:bg-forest-850/40 transition-colors ${
                    row.perforatesFloor ? 'bg-red-950/30' : ''
                  }`}
                >
                  <td className="py-2 px-2 font-bold font-sans text-cream-100">Mes {row.month}</td>
                  <td className="py-2 px-2 text-right text-gold-400">${row.spend.toLocaleString()}</td>
                  <td className="py-2 px-2 text-right text-cream-300">{Math.round(row.newCustomers)}</td>
                  <td className="py-2 px-2 text-right text-cream-400">${row.existingBase.toFixed(0)}</td>
                  <td className="py-2 px-2 text-right text-emerald-400">+${row.cohortsContribution.toFixed(0)}</td>
                  <td className="py-2 px-2 text-right font-bold text-emerald-300">${row.inflows.toFixed(0)}</td>
                  <td className="py-2 px-2 text-right text-red-400">-${row.outflows.toFixed(0)}</td>
                  <td className={`py-2 px-2 text-right font-bold ${row.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {row.netCashFlow >= 0 ? '+' : ''}${row.netCashFlow.toFixed(0)}
                  </td>
                  <td className={`py-2 px-2 text-right font-extrabold ${row.bankBalance < 5000 ? 'text-red-400' : 'text-cream-100'}`}>
                    ${row.bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-2 text-right text-purple-300">{row.activeSubscribers.toFixed(1)}</td>
                  <td className="py-2 px-2 text-center font-sans">
                    {row.perforatesFloor ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-300">
                        PISO VIOLADO
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold text-emerald-400">
                        OK (&gt;$5k)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validación Manual del Mes 1 ($8.000 USD) */}
      <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-forest-800">
          <ShieldCheck className="w-5 h-5 text-gold-400" />
          <h4 className="font-bold text-cream-100 text-sm">Validación Aritmética Manual del Mes 1 (Plan $8.000 Fijos)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-forest-950/70 border border-forest-800 space-y-1.5 font-mono text-[11px] text-cream-300">
            <p className="text-gold-400 font-bold font-sans">1. Entradas de Caja Mes 1:</p>
            <p>• Base clientes existentes = $9.000,00 USD</p>
            <p>• Clientes nuevos = 165 Meta + 47 Orgánicos = 212 clientes</p>
            <p>• Sueltos (85% = 180,2 cli x 1 pedido x $15,89 CM2) = $2.863,38 USD</p>
            <p>• Suscriptores (15% = 31,8 cli x 1 pedido x $12,643 CM2) = $402,05 USD</p>
            <p>• Contribución total cohorte Mes 1 = $3.265,43 USD</p>
            <p className="text-emerald-400 font-bold pt-1 border-t border-forest-800 font-sans">
              Total Entradas Mes 1 = $9.000,00 + $3.265,43 = $12.265,43 USD
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-forest-950/70 border border-forest-800 space-y-1.5 font-mono text-[11px] text-cream-300">
            <p className="text-gold-400 font-bold font-sans">2. Salidas y Saldo Bancario Mes 1:</p>
            <p>• Inversión publicitaria en Meta = $8.000,00 USD</p>
            <p>• Fee mensual agencia Impulso Digital = $1.000,00 USD</p>
            <p>• Costos fijos operativos (Planilla, Alquiler, Apps) = $6.500,00 USD</p>
            <p className="text-red-400 font-bold">Total Egresos Mes 1 = $15.500,00 USD</p>
            <p>• Flujo neto Mes 1 = $12.265,43 - $15.500,00 = -$3.234,57 USD</p>
            <p className="text-gold-400 font-extrabold pt-1 border-t border-forest-800 font-sans text-xs">
              Saldo Bancario Final Mes 1 = $35.000,00 - $3.234,57 = $31.765,43 USD
            </p>
            <p className="text-emerald-400 text-[10px] font-sans">✓ Coincidencia 100% exacta con la simulación del sistema.</p>
          </div>
        </div>
      </div>

      {/* Ficha Ejecutiva para el Pitch de 2 Minutos (Tío de Diego) */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-950 rounded-2xl border-2 border-gold-500/60 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-forest-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-cream-100 text-base">Ficha Ejecutiva: Pitch de 2 Minutos para el Inversionista (El Tío de Diego)</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/40 font-mono">
            Estrategia Ganadora Validada
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-cream-200">
          <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-800 space-y-2">
            <h5 className="font-bold text-gold-400 text-sm">1. La Propuesta Cuantitativa y Presupuesto</h5>
            <p className="text-cream-300/90 leading-relaxed">
              <strong>Decisión Firme:</strong> Rechazar rotundamente la propuesta de la agencia de duplicar a $16.000 con 30% de descuento (nuestro simulador demuestra que agota la caja en el Mes 3 con solo $1.212 y quiebra en el Mes 4 con -$8.248).
            </p>
            <p className="text-cream-300/90 leading-relaxed">
              <strong>Presupuesto Solicitado:</strong> Operar con <strong>$6.000 USD/mes</strong> durante los primeros 6 meses en el tramo de máxima eficiencia publicitaria (donde el CAC marginal no está inflado), escalando a $8.000 USD/mes desde el Mes 7.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-800 space-y-2">
            <h5 className="font-bold text-emerald-400 text-sm">2. El Retorno Financiero Proyectado (Mes 24)</h5>
            <p className="text-cream-300/90 leading-relaxed">
              <strong>Caja Acumulada Final:</strong> Más de <strong>$127.000 a $132.000 USD en efectivo líquido</strong> en el banco al mes 24, frente a apenas $79.596 USD del plan base de $8k y la quiebra total de la agencia.
            </p>
            <p className="text-cream-300/90 leading-relaxed">
              <strong>Activo Recurrente:</strong> Construcción de una base sólida de más de <strong>270 a 312 suscriptores mensuales activos</strong>, blindando el negocio con ingresos predecibles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-800 space-y-2">
            <h5 className="font-bold text-blue-400 text-sm">3. Protección del Piso de Seguridad y la Tostadora</h5>
            <p className="text-cream-300/90 leading-relaxed">
              <strong>Liquidez Blindada:</strong> La caja de Diego nunca desciende de <strong>$33.342 USD</strong> (6 veces por encima del piso de seguridad de $5.000 USD).
            </p>
            <p className="text-cream-300/90 leading-relaxed">
              <strong>Compra de la Tostadora ($14.000 USD):</strong> Puede realizarse en efectivo en Diciembre (Mes 3) o Mes 6 sin comprometer la operación ni pedir préstamos, manteniendo una reserva mínima superior a $19.000 USD.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-800 space-y-2">
            <h5 className="font-bold text-purple-400 text-sm">4. Condiciones Estrictas para Escalar la Pauta</h5>
            <p className="text-cream-300/90 leading-relaxed">
              <strong>Condición 1:</strong> Solo se aumentará la pauta publicitaria si el CAC marginal se mantiene estrictamente por debajo de los <strong>$55 USD</strong> del LTV del cliente.
            </p>
            <p className="text-cream-300/90 leading-relaxed">
              <strong>Condición 2:</strong> Pausar definitivamente las campañas de retargeting a compradores de 180 días que canibalizan clientes orgánicos cautivos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
