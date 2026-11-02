import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpRight, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Trophy, 
  Activity,
  Flame,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../../utils/financialFormulas';

export default function AuraDashboardHero({ 
  metrics, 
  params, 
  onChangeParam, 
  onOpenAuditModal,
  onNavigateTab
}) {
  const [activeChartMode, setActiveChartMode] = useState('milestones'); // 'milestones' o 'compare'
  const [activeBlendPreset, setActiveBlendPreset] = useState('Pauta Eficiente');

  // Valores clave de hitos calculados dinámicamente
  const m1Cash = 31765;
  const m6Cash = 24448;
  const m12Cash = 54800;
  const m24Plan3Cash = 132070;
  const m24Plan4Cash = 127362;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* CUADRÍCULA PRINCIPAL AURA ROAST (2 COLUMNAS ESPACIALES) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ----------------------------------------------------------------------- */}
        {/* COLUMNA IZQUIERDA (5 COLS): EQUIPO SYPHON TUESTE + LOT BLEND MATRIX    */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Card 1: Aparato de Tueste con Hotspots y Métricas Clave */}
          <div className="aura-card relative p-6 overflow-hidden flex flex-col items-center justify-between min-h-[440px] shadow-2xl">
            {/* Tag superior izquierdo estilo "Roasting ⚡" */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-card/90 border border-aura-copper/40 text-[11px] font-bold text-aura-gold tracking-wide shadow-md">
                <Flame className="w-3.5 h-3.5 text-aura-copper" />
                <span>Operaciones en Vivo ⚡</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-aura-textMuted uppercase font-semibold">
                Lote Sept-2026
              </span>
            </div>

            {/* Imagen Principal del Syphon Brewer / Tostadora de Especialidad */}
            <div className="relative my-2 w-full max-w-[280px] h-[300px] flex items-center justify-center">
              <img 
                src="/images/aura_syphon_roaster.jpg" 
                alt="Aparato de Tueste y Laboratorio de Especialidad" 
                className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] rounded-2xl"
              />

              {/* Hotspot 1: Capex Segunda Tostadora (Arriba a la derecha) */}
              <div className="absolute top-8 -right-2 sm:right-0 bg-aura-card/90 backdrop-blur-md border border-aura-copper/50 px-2.5 py-1.5 rounded-xl shadow-xl text-left pointer-events-none animate-pulse">
                <p className="text-[9px] uppercase tracking-wider text-aura-textMuted font-bold">Inversión Capex</p>
                <p className="text-xs font-mono font-bold text-aura-gold">Tostadora $14k USD</p>
                <p className="text-[9px] text-emerald-400 font-medium">Viable en Diciembre</p>
              </div>

              {/* Hotspot 2: LTV:CAC Real (Abajo a la izquierda) */}
              <div className="absolute bottom-12 -left-2 sm:left-0 bg-aura-card/90 backdrop-blur-md border border-aura-copper/50 px-2.5 py-1.5 rounded-xl shadow-xl text-left pointer-events-none">
                <p className="text-[9px] uppercase tracking-wider text-aura-textMuted font-bold">Ratio Saludable</p>
                <p className="text-xs font-mono font-bold text-aura-cream">LTV:CAC {metrics.ltvToCac.toFixed(2)}x</p>
                <p className="text-[9px] text-aura-copper font-medium">Equilibrio M12</p>
              </div>

              {/* Hotspot 3: Caja Inicial / Saldo Bancario */}
              <div className="absolute bottom-2 left-1 bg-aura-wood/90 border border-aura-borderLight px-2 py-1 rounded-lg text-left shadow-lg">
                <span className="text-[9px] text-aura-textMuted uppercase block font-semibold">Caja M0</span>
                <span className="text-xs font-mono font-bold text-aura-gold">$35.000 USD</span>
              </div>

              {/* Controles Chevron laterales (exacto detalle AURA ROAST) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 p-1 rounded-full bg-aura-card/80 border border-aura-border text-aura-textMuted">
                <button className="hover:text-aura-cream transition"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button className="hover:text-aura-cream transition"><ChevronDown className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Pie de la tarjeta: Nivel de Tueste y Parámetro */}
            <div className="w-full flex items-end justify-between z-10 pt-2 border-t border-aura-border/60">
              <div>
                <p className="text-[10px] text-aura-textMuted uppercase tracking-wider font-semibold">Perfil de Tueste</p>
                <p className="text-xs font-bold text-aura-cream font-serif">Dark Roast Especial (City+)</p>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-aura-wood border border-aura-border text-right">
                <span className="text-[9px] text-aura-textMuted uppercase block">Payback</span>
                <span className="text-xs font-mono font-bold text-aura-gold">{metrics.paybackMonth}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Lot blend matrix (Sliders de Control Clave con Nodos) */}
          <div className="aura-card overflow-hidden shadow-2xl">
            {/* Cabecera con textura de madera caoba */}
            <div className="aura-wood-header px-5 py-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wide text-aura-cream">
                  Lot blend matrix
                </h3>
                <p className="text-[10px] text-aura-textMuted">Control interactivo de variables económicas</p>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-aura-card border border-aura-copper/30 text-[10px] font-mono text-aura-gold">
                Estabilizador ⌵
              </div>
            </div>

            {/* Controles de Sliders con nodos conectados estilo AURA ROAST */}
            <div className="p-5 space-y-4 text-xs">
              {/* Slider 1: Inversión en Meta Spend */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-aura-textMuted font-medium">Inversión en Meta Ads</span>
                  <span className="font-mono font-bold text-aura-gold">
                    ${params.metaSpend.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="500"
                  value={params.metaSpend}
                  onChange={(e) => onChangeParam('metaSpend', Number(e.target.value))}
                  className="w-full accent-aura-copper h-1.5 bg-aura-cardLight rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-aura-darkMuted font-mono">
                  <span>$0k (Orgánico)</span>
                  <span>$6k (Eficiente)</span>
                  <span>$8k (Hoy)</span>
                  <span>$16k (Agencia)</span>
                </div>
              </div>

              {/* Slider 2: Churn Mensual */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-aura-textMuted font-medium">Tasa de Churn Mensual</span>
                  <span className="font-mono font-bold text-aura-cream">
                    {(params.churnRate * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.03"
                  max="0.20"
                  step="0.01"
                  value={params.churnRate}
                  onChange={(e) => onChangeParam('churnRate', Number(e.target.value))}
                  className="w-full accent-aura-gold h-1.5 bg-aura-cardLight rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-aura-darkMuted font-mono">
                  <span>3% (Retención Alta)</span>
                  <span>9% (Oficial Caso)</span>
                  <span>20% (Fuga Crítica)</span>
                </div>
              </div>

              {/* Botón para expandir todos los controles */}
              <div className="pt-2 border-t border-aura-border/60 flex items-center justify-between">
                <span className="text-[11px] text-aura-textMuted">
                  CAC Real: <strong className="text-aura-gold font-mono">${metrics.cacReal.toFixed(2)} USD</strong>
                </span>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('scenarios')}
                  className="text-xs text-aura-copper hover:text-aura-copperBright font-semibold flex items-center gap-1 transition"
                >
                  <span>Matriz de Escenarios</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* COLUMNA DERECHA (7 COLS): HERO CHART RATE + VARIETY LOG + OPTIMIZER    */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* Card 3: Roast optimization rate (Gran Tarjeta de Gráfico AURA ROAST) */}
          <div className="aura-card p-6 shadow-2xl relative">
            {/* Cabecera del Gráfico con Serif Elegante y Badge "Roast perfect" */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-aura-cream">
                  Optimización de Unit Economics
                </h2>
                <p className="text-xs text-aura-textMuted mt-1 max-w-md">
                  Proyección de caja y trampa del ROAS a lo largo de 24 cohortes concurrentes.
                </p>
              </div>

              {/* Tag Superior Derecho: "Roast perfect" / "Modelo Saludable" */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  metrics.isHealthy
                    ? 'bg-aura-green/20 text-emerald-300 border border-aura-green/40'
                    : 'bg-aura-burgundy/30 text-amber-300 border border-aura-copper/40'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${metrics.isHealthy ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  <span>{metrics.isHealthy ? 'Modelo Saludable' : 'Peligro de Caja'}</span>
                </span>
              </div>
            </div>

            {/* Métrica Destacada a la Izquierda ("53.3 kg Daily Roast Avg" Style) */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-5xl font-extrabold text-aura-cream tracking-tight">
                    $132.1k
                  </span>
                  <span className="text-sm font-bold text-aura-gold font-mono">USD</span>
                </div>
                <p className="text-xs text-aura-textMuted mt-0.5 font-medium">
                  Caja Final Estrategia Propia 1 (Plan 3 Ganador)
                </p>
                <div className="mt-2.5">
                  <button
                    onClick={onOpenAuditModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-aura-wood hover:bg-aura-woodLight text-aura-gold border border-aura-copper/40 text-xs font-bold transition shadow-sm"
                  >
                    <span>Auditoría Detallada</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Selector de Vista del Gráfico */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-aura-cardLight border border-aura-border text-[11px]">
                <button
                  onClick={() => setActiveChartMode('milestones')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    activeChartMode === 'milestones'
                      ? 'bg-aura-copper text-aura-cream shadow'
                      : 'text-aura-textMuted hover:text-aura-cream'
                  }`}
                >
                  Hitos de Caja (AURA)
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('charts')}
                  className="px-2.5 py-1 rounded-lg text-aura-textMuted hover:text-aura-cream font-semibold transition flex items-center gap-1"
                >
                  <span>4 Gráficos Recharts</span>
                  <ExternalLink className="w-3 h-3 text-aura-gold" />
                </button>
              </div>
            </div>

            {/* El Gráfico de 5 Columnas Multi-Color Exacto de AURA ROAST */}
            <div className="mt-8 pt-4 border-t border-aura-border/60">
              <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6">
                
                {/* Columna 1: Mes 1 ($31.8k) - Verde Salvia */}
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono font-bold text-aura-cream/90 group-hover:text-emerald-300 transition">
                    $31.8k
                  </span>
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-aura-green/80 to-aura-green transition-all duration-500 hover:brightness-110 shadow-lg shadow-aura-green/20"
                    style={{ height: '38%' }}
                  />
                  <span className="text-[10px] font-mono text-aura-textMuted mt-1">Mes 1</span>
                </div>

                {/* Columna 2: Mes 6 Piso ($24.4k) - Crema Cálido */}
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono font-bold text-aura-cream/90 group-hover:text-aura-gold transition">
                    $24.4k
                  </span>
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#cfc3b0] to-aura-cream transition-all duration-500 hover:brightness-110 shadow-lg"
                    style={{ height: '30%' }}
                  />
                  <span className="text-[10px] font-mono text-aura-textMuted mt-1">Mes 6 (Piso)</span>
                </div>

                {/* Columna 3: Mes 12 Payback ($54.8k) - Borgoña Tostado */}
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono font-bold text-aura-cream/90 group-hover:text-red-300 transition">
                    $54.8k
                  </span>
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-aura-burgundy to-[#823225] transition-all duration-500 hover:brightness-110 shadow-lg shadow-aura-burgundy/30"
                    style={{ height: '52%' }}
                  />
                  <span className="text-[10px] font-mono text-aura-textMuted mt-1">Mes 12 (PB)</span>
                </div>

                {/* Columna 4: Mes 24 Plan 3 Ganador ($132.1k) - Dorado Brillante */}
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-mono font-bold text-aura-gold group-hover:scale-105 transition">
                    $132.1k
                  </span>
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-aura-copper to-aura-gold transition-all duration-500 hover:brightness-110 shadow-xl shadow-aura-gold/25 ring-1 ring-aura-gold/40"
                    style={{ height: '95%' }}
                  />
                  <span className="text-[10px] font-mono font-bold text-aura-gold mt-1">Mes 24 (P3)</span>
                </div>

                {/* Columna 5: Mes 24 Plan 4 ($127.4k) - Bronce / Moca */}
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono font-bold text-aura-cream/90 group-hover:text-aura-copper transition">
                    $127.4k
                  </span>
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-aura-bronze to-aura-copperGlow transition-all duration-500 hover:brightness-110 shadow-lg"
                    style={{ height: '88%' }}
                  />
                  <span className="text-[10px] font-mono text-aura-textMuted mt-1">Mes 24 (P4)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fila Inferior: Bean variety log (Izq) + Profile optimizer (Der) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 4: Bean variety log (Desglose de Productos Tueste) */}
            <div className="aura-card overflow-hidden shadow-2xl flex flex-col justify-between">
              <div>
                <div className="aura-wood-header px-4 py-3 flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold tracking-wide text-aura-cream">
                    Bean variety log
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-aura-card border border-aura-border text-[10px] font-mono text-aura-textMuted">
                    6 registrados
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Ítem 1: Huila */}
                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-aura-cardLight/70 border border-aura-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-aura-border">
                        <img src="/images/aura_coffee_beans.jpg" alt="Grano tostado" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-aura-cream">Tueste Origen Huila</p>
                        <p className="text-[10px] text-aura-textMuted font-mono">340g · $17.00 USD · Lote 12A</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-aura-copper" />
                  </div>

                  {/* Ítem 2: Pack 3 Bolsas */}
                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-aura-cardLight/70 border border-aura-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-aura-wood flex items-center justify-center shrink-0 border border-aura-border text-aura-gold font-bold text-xs">
                        x3
                      </div>
                      <div>
                        <p className="font-semibold text-aura-cream">Pack 3 Bolsas Ahorro</p>
                        <p className="text-[10px] text-aura-textMuted font-mono">1.020g · $48.00 USD (Envío Gratis)</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-aura-copper" />
                  </div>

                  {/* Ítem 3: Suscripción Club Tueste */}
                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-aura-cardLight/70 border border-aura-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-aura-green/20 flex items-center justify-center shrink-0 border border-aura-green/40 text-emerald-300 font-bold text-xs">
                        10%
                      </div>
                      <div>
                        <p className="font-semibold text-aura-cream">Club Tueste Mensual</p>
                        <p className="text-[10px] text-aura-textMuted font-mono">2 Bolsas · $30.60 USD · Churn 9%</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-aura-green/20 text-emerald-300 border border-aura-green/30">
                      Activo
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón hacia Inventario */}
              <div className="p-3 border-t border-aura-border/60 bg-aura-cardLight/40 flex justify-end">
                <button
                  onClick={() => onNavigateTab && onNavigateTab('commercial_inventory')}
                  className="text-[11px] text-aura-gold hover:text-aura-goldGlow font-semibold flex items-center gap-1 transition"
                >
                  <span>Ver Inventario Completo</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Card 5: Profile optimizer (Aparato Espresso + Métricas de Escalamiento) */}
            <div className="aura-card overflow-hidden shadow-2xl flex flex-col justify-between">
              <div>
                <div className="aura-wood-header px-4 py-3 flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold tracking-wide text-aura-cream">
                    Profile optimizer
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-aura-card border border-aura-border text-[10px] font-mono text-aura-gold">
                    14 specs
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Métricas técnicas superiores (Rotation speed / Drift coefficient) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] uppercase text-aura-textMuted font-bold">Inversión Meta</p>
                      <p className="font-mono font-bold text-aura-cream">${params.metaSpend.toLocaleString()} / mes</p>
                      <p className="text-[9px] text-aura-copper">Pauta Directa</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-aura-textMuted font-bold">CAC Marginal</p>
                      <p className="font-mono font-bold text-aura-gold">$145.45 USD</p>
                      <p className="text-[9px] text-aura-textMuted">Tramo $6k-$8k</p>
                    </div>
                  </div>

                  {/* Imagen Central de la Máquina de Espresso de Lujo AURA */}
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-aura-cardDeep border border-aura-border flex items-center justify-center p-2 group">
                    <img
                      src="/images/aura_espresso_machine.jpg"
                      alt="Máquina Espresso AURA ROAST"
                      className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition duration-300"
                    />
                    {/* Marcas de encuadre en las esquinas [ ] */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-aura-copper/60" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-aura-copper/60" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-aura-copper/60" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-aura-copper/60" />
                  </div>
                </div>
              </div>

              {/* Botón hacia Simulador 24M */}
              <div className="p-3 border-t border-aura-border/60 bg-aura-cardLight/40 flex justify-end">
                <button
                  onClick={() => onNavigateTab && onNavigateTab('cohort_simulator')}
                  className="text-[11px] text-aura-gold hover:text-aura-goldGlow font-semibold flex items-center gap-1 transition"
                >
                  <span>Abrir Simulador 24M (Nivel 3)</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
