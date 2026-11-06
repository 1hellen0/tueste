import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Users, 
  CreditCard,
  Store,
  ArrowLeft
} from 'lucide-react';
import CommercialSummary from './CommercialSummary';
import OrdersManager from './OrdersManager';
import InventoryManager from './InventoryManager';
import CustomersManager from './CustomersManager';
import PaymentsLog from './PaymentsLog';
import ReferralGrowth from './ReferralGrowth';
import { getCommercialSummary } from '../../services/storeStorage';

export default function CommercialHub({ initialSubtab = 'summary', onGoToStore }) {
  const [activeSubtab, setActiveSubtab] = useState(initialSubtab);
  const [stats, setStats] = useState({ ordersCount: 0, lowStockCount: 0, customersCount: 0 });

  useEffect(() => {
    setActiveSubtab(initialSubtab);
  }, [initialSubtab]);

  useEffect(() => {
    const s = getCommercialSummary();
    setStats({
      ordersCount: s.totalOrders,
      lowStockCount: s.lowStockCount,
      customersCount: s.totalCustomers
    });
  }, [activeSubtab]);

  const tabs = [
    { id: 'summary', label: 'Resumen Comercial', icon: BarChart3 },
    { 
      id: 'orders', 
      label: 'Pedidos', 
      icon: ShoppingBag, 
      badge: stats.ordersCount > 0 ? stats.ordersCount : null 
    },
    { 
      id: 'inventory', 
      label: 'Inventario y Productos', 
      icon: Package, 
      badge: stats.lowStockCount > 0 ? `${stats.lowStockCount} bajo` : null,
      badgeColor: 'amber'
    },
    { 
      id: 'customers', 
      label: 'Clientes', 
      icon: Users,
      badge: stats.customersCount > 0 ? stats.customersCount : null
    },
    { id: 'payments', label: 'Pagos Simulados', icon: CreditCard },
    { id: 'referrals', label: 'Growth / Referidos', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Barra de Subnavegación Comercial AURA ROAST */}
      <div className="p-2.5 rounded-2xl bg-aura-card border border-aura-border shadow-2xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubtab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubtab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-aura-copper to-aura-gold text-aura-bgDeep font-bold shadow-md shadow-aura-copper/25 aura-glow-copper'
                    : 'text-aura-textMuted hover:text-aura-cream hover:bg-aura-cardLight'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-aura-bgDeep stroke-[2.2]' : 'text-aura-gold'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive 
                      ? 'bg-aura-bgDeep text-aura-gold' 
                      : tab.badgeColor === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-aura-wood text-aura-cream border border-aura-copper/30'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {onGoToStore && (
          <button
            onClick={onGoToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aura-cardLight hover:bg-aura-wood text-aura-cream text-xs font-medium border border-aura-border transition"
            title="Ir a la Tienda Pública"
          >
            <Store className="w-3.5 h-3.5 text-aura-gold" />
            <span>Ver Tienda</span>
          </button>
        )}
      </div>

      {/* Renderizado de la Subvista Activa */}
      {activeSubtab === 'summary' && (
        <CommercialSummary onNavigateSubtab={(subtab) => setActiveSubtab(subtab)} />
      )}
      {activeSubtab === 'orders' && <OrdersManager />}
      {activeSubtab === 'inventory' && <InventoryManager />}
      {activeSubtab === 'customers' && <CustomersManager />}
      {activeSubtab === 'payments' && <PaymentsLog />}
      {activeSubtab === 'referrals' && <ReferralGrowth />}
    </div>
  );
}
