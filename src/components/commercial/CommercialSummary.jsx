import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  AlertTriangle, 
  Package, 
  Users, 
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  CreditCard
} from 'lucide-react';
import { 
  getCommercialSummary, 
  getOrders, 
  resetToDemoDefaults 
} from '../../services/storeStorage';

export default function CommercialSummary({ onNavigateSubtab }) {
  const [summary, setSummary] = useState(getCommercialSummary());
  const [recentOrders, setRecentOrders] = useState([]);
  const [resetMessage, setResetMessage] = useState('');

  const refreshData = () => {
    setSummary(getCommercialSummary());
    const allOrders = getOrders();
    setRecentOrders(allOrders.slice(0, 5));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleResetData = () => {
    if (window.confirm('¿Restablecer el inventario, pedidos y clientes a los valores de fábrica de demostración?')) {
      resetToDemoDefaults();
      refreshData();
      setResetMessage('Datos de demostración restablecidos correctamente.');
      setTimeout(() => setResetMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Aviso de Prototipo y Protección Académica */}
      <div className="p-4 rounded-xl bg-aura-surface border border-aura-border text-aura-beige text-xs flex items-start gap-3 shadow-md">
        <ShieldAlert className="w-5 h-5 text-aura-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold font-serif text-aura-gold text-sm">
            Entorno de Gestión Comercial Simulada (Prototipo Fase D)
          </p>
          <p className="text-aura-beige leading-relaxed">
            Las cifras de ventas, pedidos y clientes presentadas a continuación se originan exclusivamente en compras de demostración
            guardadas en el almacenamiento local del navegador (<code className="text-aura-gold font-mono">localStorage</code>).
            <strong className="text-aura-cream"> No corresponden a ventas reales de Tueste</strong> y se mantienen estrictamente
            aisladas de las series históricas y proyecciones de los Niveles 1, 2 y 3.
          </p>
        </div>
      </div>

      {resetMessage && (
        <div className="p-3 rounded-lg bg-aura-surface border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <span>{resetMessage}</span>
          <button onClick={() => setResetMessage('')} className="text-aura-beige hover:text-aura-cream">✕</button>
        </div>
      )}

      {/* Grid de 5 Tarjetas KPI Obligatorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total de Pedidos */}
        <div className="p-4 rounded-xl aura-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-aura-beige font-semibold">Total Pedidos</span>
            <div className="w-8 h-8 rounded-lg bg-aura-surface border border-aura-border flex items-center justify-center text-aura-gold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-aura-cream font-mono">{summary.totalOrders}</span>
            <p className="text-[11px] text-aura-beige mt-0.5">Operaciones registradas</p>
          </div>
        </div>

        {/* KPI 2: Pedidos Confirmados */}
        <div className="p-4 rounded-xl aura-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Confirmados</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{summary.confirmedOrdersCount}</span>
            <p className="text-[11px] text-aura-beige mt-0.5">Pagos aprobados</p>
          </div>
        </div>

        {/* KPI 3: Pedidos Rechazados */}
        <div className="p-4 rounded-xl aura-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-red-400 font-semibold">Rechazados</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-red-400 font-mono">{summary.rejectedOrdersCount}</span>
            <p className="text-[11px] text-aura-beige mt-0.5">Sin deducción de stock</p>
          </div>
        </div>

        {/* KPI 4: Ventas Simuladas Confirmadas */}
        <div className="p-4 rounded-xl aura-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-aura-gold font-semibold">Ventas Simuladas</span>
            <div className="w-8 h-8 rounded-lg bg-aura-gold/20 text-aura-gold flex items-center justify-center border border-aura-gold/40">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-aura-gold font-mono">
              ${summary.confirmedSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-aura-beige mt-0.5">Ingresos confirmados (USD)</p>
          </div>
        </div>

        {/* KPI 5: Productos con Inventario Bajo */}
        <div className="p-4 rounded-xl aura-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Inventario Bajo</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl font-bold font-mono ${summary.lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {summary.lowStockCount}
            </span>
            <p className="text-[11px] text-aura-beige mt-0.5">
              {summary.lowStockCount > 0 ? 'Stock ≤ 15 unidades' : 'Inventario en nivel óptimo'}
            </p>
          </div>
        </div>
      </div>

      {/* Sección Doble: Últimos Pedidos y Alertas de Inventario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3): Últimos Pedidos Simulados */}
        <div className="lg:col-span-2 p-5 rounded-xl aura-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-aura-gold" />
              <h3 className="font-bold font-serif text-aura-cream text-sm tracking-wide">Últimos Pedidos Simulados</h3>
            </div>
            {onNavigateSubtab && (
              <button
                onClick={() => onNavigateSubtab('orders')}
                className="text-xs text-aura-gold hover:text-aura-goldLight font-semibold flex items-center gap-1 transition"
              >
                <span>Ver todos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-aura-beige text-xs">
              No hay pedidos simulados registrados todavía. Realiza una compra en la tienda pública para observarla aquí.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-aura-border text-aura-beige font-semibold uppercase text-[10px]">
                    <th className="pb-2">ID Pedido</th>
                    <th className="pb-2">Cliente</th>
                    <th className="pb-2">Ítems</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aura-border/40">
                  {recentOrders.map((order) => {
                    const isConfirmed = order.status === 'CONFIRMED';
                    return (
                      <tr key={order.orderId} className="hover:bg-[#2a1e17] transition">
                        <td className="py-2.5 font-mono text-aura-cream font-semibold">
                          {order.orderId}
                        </td>
                        <td className="py-2.5 text-aura-cream">
                          {order.customer?.name || 'Cliente Demo'}
                        </td>
                        <td className="py-2.5 text-aura-beige">
                          {order.items?.length || 0} producto(s)
                        </td>
                        <td className="py-2.5 font-mono font-bold text-aura-cream">
                          ${order.totals?.total?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isConfirmed 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {isConfirmed ? 'CONFIRMADO' : 'RECHAZADO'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Columna Derecha (1/3): Estado de Inventario y Accesos */}
        <div className="p-5 rounded-xl aura-card space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-aura-gold" />
                <h3 className="font-bold font-serif text-aura-cream text-sm tracking-wide">Estado de Inventario</h3>
              </div>
              {onNavigateSubtab && (
                <button
                  onClick={() => onNavigateSubtab('inventory')}
                  className="text-xs text-aura-gold hover:text-aura-goldLight font-semibold flex items-center gap-1 transition"
                >
                  <span>Gestionar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {summary.lowStockProducts.length === 0 ? (
              <div className="p-3 rounded-lg bg-aura-surface border border-aura-border text-emerald-400 text-xs">
                ✅ Todos los productos cuentan con existencias suficientes en almacén.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-amber-400 font-semibold">Productos que requieren reposición:</p>
                {summary.lowStockProducts.map(p => (
                  <div key={p.id} className="p-2.5 rounded-lg bg-aura-surface border border-aura-border flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-aura-cream">{p.name}</p>
                      <p className="text-[10px] text-aura-beige font-mono">{p.sku}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {p.stock} unid.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de Restablecimiento de Fábrica */}
          <div className="pt-4 border-t border-aura-border">
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-aura-surface hover:bg-aura-card text-aura-cream text-xs font-semibold border border-aura-border hover:border-aura-copper transition"
              title="Restablecer datos de prueba a valores de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5 text-aura-gold" />
              <span>Restablecer Datos de Demostración</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
