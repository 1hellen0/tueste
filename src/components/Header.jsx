import React, { useState } from 'react';
import { 
  RotateCcw, 
  Calculator, 
  Sparkles, 
  AlertCircle, 
  Coffee, 
  Search, 
  Bell, 
  Flag, 
  ChevronDown,
  Layers
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../utils/financialFormulas';

export default function Header({ 
  currentScenario, 
  onSelectScenario, 
  onResetParams, 
  onOpenAuditModal,
  isCustomized,
  onGoToStore
}) {
  const [searchValue, setSearchValue] = useState('');
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);

  return (
    <header className="bg-aura-bg/95 backdrop-blur-md border-b border-aura-border px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg shadow-black/40">
      {/* 1. Brand Logo & Title (AURA ROAST Inspired) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-aura-copper to-aura-wood flex items-center justify-center text-aura-gold shadow-md shadow-black/60 border border-aura-copper/30">
          {/* Coffee bean outline icon */}
          <svg className="w-6 h-6 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 3.86 2.184 7.21 5.385 8.91C8.258 17.398 9.5 13.5 12 12c2.5 1.5 3.742 5.398 4.615 8.91C19.816 19.21 22 15.86 22 12c0-5.523-4.477-10-10-10z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2c0 5 1.5 8.5 0 10s-1.5 5 0 10" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold tracking-wider text-aura-cream uppercase">
              TUESTE
            </h1>
            <span className="text-[10px] font-mono tracking-widest text-aura-copper uppercase font-semibold px-1.5 py-0.5 rounded bg-aura-card border border-aura-copper/30">
              ROASTERS
            </span>
          </div>
          <p className="text-[11px] text-aura-textMuted tracking-wide font-sans">
            Specialty Coffee & Unit Economics Dashboard
          </p>
        </div>
      </div>

      {/* 2. Center Pill Search Bar (Exact Aura Roast Style) */}
      <div className="hidden md:flex items-center relative w-72 lg:w-96">
        <Search className="w-4 h-4 text-aura-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar orígenes, métricas, cohortes..."
          className="w-full pl-9 pr-4 py-1.5 rounded-full bg-aura-card/80 border border-aura-border text-xs text-aura-cream placeholder:text-aura-textMuted/70 focus:outline-none focus:border-aura-copperGlow transition shadow-inner"
        />
      </div>

      {/* 3. Right Controls: Scenarios, Actions, User Capsule & Store Button */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Selector de Escenarios con píldora Aura */}
        <div className="relative">
          <button
            onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-aura-card border border-aura-border hover:border-aura-copper/50 text-xs text-aura-cream transition shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-aura-gold" />
            <span className="font-medium">
              {isCustomized ? 'Personalizado' : PRESET_SCENARIOS[currentScenario]?.badge || 'Escenario'}
            </span>
            <ChevronDown className="w-3 h-3 text-aura-textMuted" />
          </button>

          {isScenarioDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-aura-card border border-aura-border rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-fadeIn">
              <p className="text-[10px] uppercase font-bold tracking-wider text-aura-copper px-2 py-1">
                Seleccionar Escenario
              </p>
              {Object.values(PRESET_SCENARIOS).map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectScenario(sc.id);
                    setIsScenarioDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex flex-col ${
                    !isCustomized && currentScenario === sc.id
                      ? 'bg-aura-wood text-aura-gold font-bold border border-aura-copper/40'
                      : 'text-aura-cream hover:bg-aura-cardLight'
                  }`}
                >
                  <span className="font-semibold">{sc.name}</span>
                  <span className="text-[10px] text-aura-textMuted">{sc.badge} · {sc.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón Auditoría / Cuentas a Mano */}
        <button
          onClick={onOpenAuditModal}
          className="p-2 rounded-full bg-aura-card border border-aura-border hover:border-aura-gold/40 text-aura-gold transition shadow-sm"
          title="Ver cuentas a mano y auditoría aritmética"
        >
          <Flag className="w-3.5 h-3.5" />
        </button>

        {/* Notificaciones / Alertas */}
        <button
          onClick={onResetParams}
          className="relative p-2 rounded-full bg-aura-card border border-aura-border hover:border-aura-copper/40 text-aura-textMuted hover:text-aura-cream transition shadow-sm"
          title="Restaurar a valores oficiales de Septiembre (Hoy)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-aura-copper" />
        </button>

        {/* Cápsula de Usuario (Exacto estilo Elara Vance / Head of Sourcing) */}
        <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-aura-card border border-aura-border shadow-sm">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-aura-gold to-aura-copper flex items-center justify-center text-aura-bgDeep font-bold text-xs ring-1 ring-aura-copper/40">
            D
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[11px] font-bold text-aura-cream leading-tight">Diego</p>
            <p className="text-[9px] text-aura-copper font-medium tracking-wide">Co-Fundador & Sourcing</p>
          </div>
        </div>

        {/* Switch a Tienda Pública */}
        <button
          onClick={onGoToStore}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-aura-copper to-aura-gold hover:from-aura-copperGlow hover:to-aura-goldGlow text-aura-bgDeep shadow-md shadow-aura-copper/20 transition"
          title="Ir a la Tienda Pública"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>☕ Tienda</span>
        </button>
      </div>
    </header>
  );
}
