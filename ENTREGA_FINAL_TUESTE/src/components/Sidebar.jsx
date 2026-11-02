import React from 'react';
import { 
  Coffee, 
  LayoutDashboard, 
  Sliders, 
  BarChart3, 
  GitCompare, 
  AlertTriangle, 
  FileSpreadsheet, 
  ShieldCheck, 
  DollarSign,
  TrendingUp,
  Trophy
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, metrics }) {
  const navItems = [
    { id: 'dashboard', label: 'Tablero Principal', icon: LayoutDashboard },
    { id: 'cohort_simulator', label: 'Simulador 24M (Nivel 3)', icon: Trophy, badge: 'N3' },
    { id: 'charts', label: 'Gráficos & Trampa ROAS', icon: BarChart3 },
    { id: 'scenarios', label: 'Matriz de Escenarios', icon: GitCompare },
    { id: 'cash_simulation', label: 'Caja Mensual (Nivel 2)', icon: DollarSign },
    { id: 'ai_audit', label: 'Auditoría & Errores IA', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 bg-forest-900 border-r border-forest-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand header */}
        <div className="p-5 border-b border-forest-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-coffee-700 flex items-center justify-center text-forest-950 shadow-lg shadow-gold-500/20">
            <Coffee className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-cream-100 text-lg leading-tight tracking-tight">Tueste</h1>
            <p className="text-xs text-gold-400 font-semibold tracking-wide">Unit Economics · Nivel 3</p>
          </div>
        </div>

        {/* Status card */}
        <div className="p-4 mx-3 mt-4 rounded-xl bg-forest-950/60 border border-forest-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-cream-400 font-semibold">Salud del Modelo</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
              metrics.isHealthy ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              metrics.isWarning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {metrics.isHealthy ? 'SALUDABLE' : metrics.isWarning ? 'FRÁGIL' : 'QUEMADOR'}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-cream-300">LTV:CAC Real</span>
            <span className={`font-bold ${metrics.isHealthy ? 'text-emerald-400' : metrics.isWarning ? 'text-amber-400' : 'text-red-400'}`}>
              {metrics.ltvToCac.toFixed(2)}x
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs mt-1">
            <span className="text-cream-300">Payback</span>
            <span className="font-semibold text-cream-100">{metrics.paybackMonth}</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 mt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-forest-800 to-forest-850 text-gold-400 border border-forest-700 shadow-md shadow-forest-950/40' 
                    : 'text-cream-300 hover:text-cream-100 hover:bg-forest-850/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-cream-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive 
                      ? 'bg-gold-500 text-forest-950 font-extrabold' 
                      : 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-forest-800 text-[11px] text-cream-400/80 space-y-2 bg-forest-950/40">
        <div className="flex items-center gap-2 text-cream-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
          <span>Fórmulas Validadas 100%</span>
        </div>
        <p className="leading-relaxed">
          Conciliado con <code className="text-gold-400/90 font-mono">Calculadora_Nivel_1.xlsx</code> con diferencia &lt; 0.1%.
        </p>
      </div>
    </aside>
  );
}
