import React from 'react';
import { 
  Home, 
  Trophy, 
  BarChart3, 
  GitCompare, 
  DollarSign, 
  AlertTriangle,
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  Coffee,
  Sparkles,
  Sliders,
  Store
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, metrics, onGoToStore }) {
  const financialItems = [
    { id: 'dashboard', label: 'Tablero Principal (AURA ROAST)', icon: Home, badge: 'Hero' },
    { id: 'cohort_simulator', label: 'Simulador 24M (Nivel 3)', icon: Trophy, badge: 'N3' },
    { id: 'charts', label: 'Gráficos & Trampa ROAS', icon: BarChart3 },
    { id: 'scenarios', label: 'Matriz de Escenarios', icon: GitCompare },
    { id: 'cash_simulation', label: 'Caja Mensual (Nivel 2)', icon: DollarSign },
    { id: 'ai_audit', label: 'Auditoría & Errores IA', icon: AlertTriangle },
  ];

  const commercialItems = [
    { id: 'commercial_summary', label: 'Resumen Comercial', icon: Coffee },
    { id: 'commercial_orders', label: 'Gestión de Pedidos', icon: ShoppingBag },
    { id: 'commercial_inventory', label: 'Inventario y Productos', icon: Package },
    { id: 'commercial_customers', label: 'Directorio de Clientes', icon: Users },
    { id: 'commercial_payments', label: 'Pagos Simulados', icon: CreditCard },
  ];

  return (
    <aside className="w-16 md:w-20 bg-aura-bg border-r border-aura-border flex flex-col items-center justify-between py-5 shrink-0 select-none z-20 shadow-2xl">
      {/* Top Brand Glyph */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-aura-copper to-aura-wood flex items-center justify-center text-aura-gold shadow-lg shadow-black/80 border border-aura-copper/40 hover:scale-105 transition"
          title="Tueste · Tablero Principal"
        >
          <Coffee className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Separador fino */}
        <div className="w-8 h-[1px] bg-aura-border" />

        {/* Grupo 1: Módulos Financieros (Icon Rail) */}
        <nav className="flex flex-col items-center space-y-2">
          {financialItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group flex items-center justify-center">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-aura-wood text-aura-gold border border-aura-copper shadow-lg shadow-aura-copper/20 aura-glow-copper scale-105'
                      : 'text-aura-textMuted hover:text-aura-cream hover:bg-aura-card/60'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-aura-gold stroke-[2.2]' : 'stroke-[1.75]'}`} />
                </button>

                {/* Floating Tooltip elegante */}
                <div className="absolute left-14 px-3 py-1.5 rounded-xl bg-aura-card border border-aura-border text-xs text-aura-cream whitespace-nowrap shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition z-50 flex items-center gap-1.5">
                  <span className="font-semibold">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-aura-wood text-aura-copper font-bold border border-aura-copper/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Separador con rombo cobrizo */}
        <div className="w-8 flex items-center justify-center py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-aura-copper/50" />
        </div>

        {/* Grupo 2: Módulos de Gestión Comercial (Fase D) */}
        <nav className="flex flex-col items-center space-y-2">
          {commercialItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group flex items-center justify-center">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-aura-wood text-aura-gold border border-aura-copper shadow-lg shadow-aura-copper/20 aura-glow-copper scale-105'
                      : 'text-aura-textMuted hover:text-aura-cream hover:bg-aura-card/60'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-aura-gold stroke-[2.2]' : 'stroke-[1.75]'}`} />
                </button>

                {/* Floating Tooltip */}
                <div className="absolute left-14 px-3 py-1.5 rounded-xl bg-aura-card border border-aura-border text-xs text-aura-cream whitespace-nowrap shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition z-50 flex items-center gap-1.5">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-aura-wood text-aura-gold font-bold border border-aura-copper/30">
                    Fase D
                  </span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switch to Public Store */}
      <div className="flex flex-col items-center space-y-3 pt-4 border-t border-aura-border">
        {onGoToStore && (
          <div className="relative group flex items-center justify-center">
            <button
              onClick={onGoToStore}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-aura-card to-aura-wood text-aura-gold hover:text-aura-cream border border-aura-copper/40 flex items-center justify-center shadow-md transition hover:scale-105"
              title="Ir a la Tienda Pública"
            >
              <Store className="w-5 h-5" />
            </button>
            <div className="absolute left-14 px-3 py-1.5 rounded-xl bg-aura-card border border-aura-border text-xs text-aura-gold whitespace-nowrap shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition z-50 font-bold">
              ☕ Ver Tienda Pública
            </div>
          </div>
        )}

        {/* Status Pill Mini */}
        <div 
          className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" 
          title="Modelo Financiero 100% Validado"
        />
      </div>
    </aside>
  );
}
