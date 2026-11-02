import React from 'react';
import { RotateCcw, Calculator, Sparkles, AlertCircle } from 'lucide-react';
import { PRESET_SCENARIOS } from '../utils/financialFormulas';

export default function Header({ 
  currentScenario, 
  onSelectScenario, 
  onResetParams, 
  onOpenAuditModal,
  isCustomized
}) {
  return (
    <header className="bg-forest-900/90 backdrop-blur border-b border-forest-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
      {/* Title & Active badge */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-cream-100 tracking-tight">
              Tablero de Control Financiero
            </h2>
            {isCustomized ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PARÁMETROS PERSONALIZADOS
              </span>
            ) : (
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                currentScenario === 'HOY' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                currentScenario === 'AGENCIA' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                currentScenario === 'RECOM_BASE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              }`}>
                {PRESET_SCENARIOS[currentScenario]?.badge || 'ESCENARIO'}
              </span>
            )}
          </div>
          <p className="text-xs text-cream-400 mt-0.5">
            {isCustomized 
              ? 'Manipulando sliders dinámicos en tiempo real' 
              : PRESET_SCENARIOS[currentScenario]?.description}
          </p>
        </div>
      </div>

      {/* Preset pills & action buttons */}
      <div className="flex items-center flex-wrap gap-2">
        <div className="bg-forest-950 p-1 rounded-xl border border-forest-800 flex items-center gap-1 shadow-inner">
          {Object.values(PRESET_SCENARIOS).map((sc) => {
            const isSelected = !isCustomized && currentScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-forest-700 to-forest-800 text-gold-300 shadow-md border border-forest-600'
                    : 'text-cream-400 hover:text-cream-100 hover:bg-forest-900/60'
                }`}
              >
                {sc.id === 'HOY' && '1. Hoy ($8k)'}
                {sc.id === 'AGENCIA' && '2. Agencia ($16k)'}
                {sc.id === 'RECOM_BASE' && '3. Recom. Base (85/15)'}
                {sc.id === 'HIPOTESIS' && '3B. Hipótesis (80/20)'}
              </button>
            );
          })}
        </div>

        {/* Audit Modal button */}
        <button
          onClick={onOpenAuditModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-forest-850 hover:bg-forest-800 text-cream-200 border border-forest-700 transition"
          title="Ver auditoría y cuentas a mano"
        >
          <Calculator className="w-3.5 h-3.5 text-gold-400" />
          <span>Cuentas a Mano</span>
        </button>

        {/* Reset button */}
        <button
          onClick={onResetParams}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-coffee-800/80 hover:bg-coffee-700 text-cream-100 border border-coffee-600 shadow-sm transition"
          title="Restaurar a los valores oficiales de Septiembre"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
          <span>Restaurar Valores del Caso</span>
        </button>
      </div>
    </header>
  );
}
