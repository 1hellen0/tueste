import React from 'react';
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
  Cell
} from 'recharts';
import { HISTORICAL_META } from '../utils/financialFormulas';

export default function ChartsSection({ metrics, params }) {
  // 1. Data para Gráfico 1: Curva de Caja Mes 0 al 12
  const cashCurveData = metrics.cashCurve.map((pt) => {
    // Curva comparativa de Situación Actual ($8k)
    // Curva comparativa de Agencia ($16k + 30%)
    // Calculados analíticamente para contexto
    const m = pt.month;
    let hoyAcum = 0;
    let agenciaAcum = 0;

    if (m === 0) {
      hoyAcum = -54.55;
      agenciaAcum = -72.34;
    } else {
      // Usamos los valores verificados de auditoría
      const hoyPuntos = [-54.55, -39.14, -35.39, -31.12, -26.99, -22.99, -19.10, -15.32, -12.32, -9.40, -6.56, -3.12, 0.25];
      const agPuntos = [-72.34, -65.22, -61.47, -57.19, -53.06, -49.06, -45.18, -41.40, -38.39, -35.47, -32.64, -29.20, -25.82];
      hoyAcum = hoyPuntos[m];
      agenciaAcum = agPuntos[m];
    }

    return {
      month: m === 0 ? 'M0 (CAC)' : `M${m}`,
      actual: Number(pt.cumulativeCash.toFixed(2)),
      hoy: hoyAcum,
      agencia: agenciaAcum,
    };
  });

  // 2. Data para Gráfico 2: LTV vs CAC por Escenarios
  const ltvCacData = [
    { name: '1. Hoy ($8k)', cac: 54.55, ltv: 54.80, ratio: 1.00, payback: 'Mes 12' },
    { name: '2. Agencia ($16k)', cac: 72.34, ltv: 46.52, ratio: 0.64, payback: 'No recupera' },
    { name: '3. Recom. Base', cac: 54.55, ltv: 65.75, ratio: 1.21, payback: 'Mes 10' },
    { name: '3B. Hipótesis', cac: 52.83, ltv: 67.49, ratio: 1.28, payback: 'Mes 9' },
    { name: 'Personalizado', cac: Number(metrics.cacReal.toFixed(2)), ltv: Number(metrics.ltvBlended.toFixed(2)), ratio: Number(metrics.ltvToCac.toFixed(2)), payback: metrics.paybackMonth }
  ];

  // 3. Data para Gráfico 3: Saturación Meta & CAC Marginal
  const metaSaturationData = [
    { tier: 'Marzo ($4k)', spend: 4000, customers: 100, marginalCac: 40.00, avgCac: 40.00 },
    { tier: 'Jul-Sep ($8k)', spend: 8000, customers: 165, marginalCac: 61.54, avgCac: 48.48 },
    { tier: 'Octubre ($12k)', spend: 12000, customers: 210, marginalCac: 88.89, avgCac: 57.14 },
    { tier: 'Abril ($16k)', spend: 16000, customers: 235, marginalCac: 160.00, avgCac: 68.09 },
    { tier: 'Junio ($20k)', spend: 20000, customers: 250, marginalCac: 266.67, avgCac: 80.00 },
  ];

  // 4. Data para Gráfico 4: La Trampa del ROAS
  const roasTrapData = [
    {
      metric: 'Meta Ads Manager (Reportado)',
      roas: Number(metrics.reportedRoas.toFixed(2)),
      description: 'Incluye 153 compras de retargeting de 180 días ($5.200) y visitas post-view',
      color: '#f59e0b'
    },
    {
      metric: 'ROAS Real de Adquisición',
      roas: Number(metrics.realRoas.toFixed(2)),
      description: 'Solo clientes nuevos reales ($5.610 ventas primer pedido / $8.000 pauta)',
      color: '#ef4444'
    },
    {
      metric: 'ROAS Break-Even Requerido',
      roas: Number(metrics.unitLooseFirst.roasBreakEven.toFixed(2)),
      description: `Mínimo para no perder dinero (${(metrics.unitLooseFirst.cm2Pct * 100).toFixed(1)}% CM2)`,
      color: '#38bdf8'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Fila 1: Gráfico 4 (La Trampa del ROAS) y Gráfico 1 (Curva de Caja) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 4: LA TRAMPA DEL ROAS */}
        <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-cream-100 text-sm flex items-center gap-2">
                <span>El Gráfico de la Trampa: ROAS de Meta vs. Realidad</span>
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Brecha de Adquisición
              </span>
            </div>
            <p className="text-xs text-cream-400 mt-1">
              Contraste entre el ROAS inflado por retargeting y el ROAS necesario para cubrir costos
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roasTrapData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d573e" opacity={0.3} />
                <XAxis type="number" stroke="#a89066" domain={[0, 4.5]} tickFormatter={(v) => `${v}x`} />
                <YAxis type="category" dataKey="metric" stroke="#cdb896" width={140} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-forest-950 p-3 rounded-lg border border-forest-700 text-xs shadow-xl">
                          <p className="font-bold text-cream-100">{data.metric}</p>
                          <p className="text-gold-400 font-extrabold text-base mt-1">{data.roas.toFixed(2)}x</p>
                          <p className="text-cream-400 text-[11px] mt-1 max-w-xs">{data.description}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={1.0} stroke="#64748b" strokeDasharray="3 3" label={{ value: '1.0x (Venta=Costo)', fill: '#94a3b8', fontSize: 10 }} />
                <Bar dataKey="roas" radius={[0, 6, 6, 0]}>
                  {roasTrapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-forest-950/70 border border-forest-800 text-[11px] text-cream-300 space-y-1">
            <p>
              • <strong>Meta dice 3,00x</strong>: Se apropia de compras de clientes que ya le compraban a Tueste.
            </p>
            <p>
              • <strong>La realidad es 0,70x</strong>: Frente a un break-even de <strong>{metrics.unitLooseFirst.roasBreakEven.toFixed(2)}x</strong>, Tueste pierde plata en cada primer pedido.
            </p>
          </div>
        </div>

        {/* GRÁFICO 1: CURVA DE CAJA DEL CLIENTE */}
        <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-cream-100 text-sm flex items-center gap-2">
                <span>Curva de Caja del Cliente (Mes 0 al 12)</span>
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                metrics.paybackNumeric && metrics.paybackNumeric <= 10 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {metrics.paybackMonth}
              </span>
            </div>
            <p className="text-xs text-cream-400 mt-1">
              Evolución acumulada de caja desde el pago del CAC (Mes 0) hasta el cruce con cero
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d573e" opacity={0.3} />
                <XAxis dataKey="month" stroke="#a89066" tick={{ fontSize: 11 }} />
                <YAxis stroke="#a89066" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-forest-950 p-3 rounded-lg border border-forest-700 text-xs shadow-xl space-y-1">
                          <p className="font-bold text-cream-100 border-b border-forest-800 pb-1">{label}</p>
                          {payload.map((pld, idx) => (
                            <p key={idx} style={{ color: pld.color }} className="font-medium">
                              {pld.name}: ${pld.value?.toFixed(2)} USD
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: '$0 (Equilibrio)', fill: '#94a3b8', fontSize: 10, position: 'right' }} />
                <Line type="monotone" dataKey="actual" name="Personalizado" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="hoy" name="Hoy ($8k)" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                <Line type="monotone" dataKey="agencia" name="Agencia ($16k)" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-forest-950/70 border border-forest-800 text-[11px] text-cream-300">
            <span>
              El cruce en cero ocurre cuando la contribución acumulada paga el CAC. La situación actual recupera en <strong>Mes 12</strong>, la agencia <strong>no recupera en 12 meses</strong> (-$25,82), y la recomendación base recupera en <strong>Mes 10</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Fila 2: Gráfico 2 (LTV vs CAC) y Gráfico 3 (Saturación & Marginal) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 2: LTV FRENTE A CAC Y CUADRANTES */}
        <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-cream-100 text-sm flex items-center gap-2">
                <span>LTV frente a CAC por Escenarios (Salud Unitaria)</span>
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Benchmarks 1:1 y 3:1
              </span>
            </div>
            <p className="text-xs text-cream-400 mt-1">
              Comparación de LTV 12m contra CAC Real Fully-Loaded en cada alternativa
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ltvCacData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d573e" opacity={0.3} />
                <XAxis dataKey="name" stroke="#a89066" tick={{ fontSize: 10 }} />
                <YAxis stroke="#a89066" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-forest-950 p-3 rounded-lg border border-forest-700 text-xs shadow-xl space-y-1">
                          <p className="font-bold text-cream-100">{d.name}</p>
                          <p className="text-blue-400">CAC Real: ${d.cac.toFixed(2)} USD</p>
                          <p className="text-emerald-400">LTV 12m: ${d.ltv.toFixed(2)} USD</p>
                          <p className="text-gold-400 font-bold">Ratio LTV:CAC: {d.ratio.toFixed(2)}x</p>
                          <p className="text-cream-400">Payback: {d.payback}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="cac" name="CAC Real Fully-Loaded" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.85} />
                <Bar dataKey="ltv" name="LTV a 12 Meses" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-forest-950/70 border border-forest-800 text-[11px] text-cream-300">
            <span>
              En la <strong>Agencia</strong>, el CAC ($72,34) supera al LTV ($46,52), con ratio <strong>0,64x</strong>. En el <strong>Equipo Base</strong>, el ratio salta a <strong>1,21x</strong> y en la <strong>Hipótesis</strong> a <strong>1,28x</strong>.
            </span>
          </div>
        </div>

        {/* GRÁFICO 3: SATURACIÓN DE META Y CAC MARGINAL */}
        <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-cream-100 text-sm flex items-center gap-2">
                <span>Curva de Saturación de Meta & CAC Marginal</span>
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Rendimientos Decrecientes
              </span>
            </div>
            <p className="text-xs text-cream-400 mt-1">
              Clientes nuevos captados vs. costo marginal por cada cliente extra
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metaSaturationData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d573e" opacity={0.3} />
                <XAxis dataKey="tier" stroke="#a89066" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#38bdf8" tick={{ fontSize: 11 }} label={{ value: 'Clientes', angle: -90, position: 'insideLeft', fill: '#38bdf8', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} label={{ value: 'CAC Marginal ($)', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-forest-950 p-3 rounded-lg border border-forest-700 text-xs shadow-xl space-y-1">
                          <p className="font-bold text-cream-100">{d.tier}</p>
                          <p className="text-blue-400">Inversión: ${d.spend.toLocaleString()} USD</p>
                          <p className="text-emerald-400">Clientes Nuevos: {d.customers}</p>
                          <p className="text-gold-400 font-bold">CAC Marginal: ${d.marginalCac.toFixed(2)} USD</p>
                          <p className="text-cream-400">CAC Promedio: ${d.avgCac.toFixed(2)} USD</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar yAxisId="left" dataKey="customers" name="Clientes Meta" fill="#38bdf8" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Line yAxisId="right" type="monotone" dataKey="marginalCac" name="CAC Marginal ($)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-forest-950/70 border border-forest-800 text-[11px] text-cream-300">
            <span>
              Entre $8k y $16k, duplicar la inversión solo aporta 70 clientes adicionales, con un <strong>CAC marginal de $114,29 USD</strong> (llegando a $160,00 en el tramo $12k-$16k). Como el LTV es &lt; $55, cada cliente adicional destruye dinero.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
