import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  Ban,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/storeStorage';
import OrderDetailModal from './OrderDetailModal';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState({ message: '', type: '' });

  const loadOrders = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleQuickStatusChange = (orderId, targetStatus) => {
    const res = updateOrderStatus(orderId, targetStatus);
    if (res.success) {
      setActionFeedback({
        message: `Pedido ${orderId} actualizado a ${targetStatus}.`,
        type: 'success'
      });
      loadOrders();
    } else {
      setActionFeedback({
        message: res.error || 'Error al cambiar estado.',
        type: 'error'
      });
    }
    setTimeout(() => setActionFeedback({ message: '', type: '' }), 4000);
  };

  // Filtrado y búsqueda
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'CONFIRMED') return order.status === 'CONFIRMED';
    if (statusFilter === 'REJECTED') return order.status === 'REJECTED';
    if (statusFilter === 'SHIPPED') return order.fulfillmentStatus === 'SHIPPED';
    if (statusFilter === 'DELIVERED') return order.fulfillmentStatus === 'DELIVERED';
    if (statusFilter === 'IN_PREPARATION') return order.fulfillmentStatus === 'IN_PREPARATION';
    if (statusFilter === 'CANCELLED') return order.fulfillmentStatus === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera y Contadores */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-serif text-aura-cream flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-aura-gold" />
            <span>Gestión de Pedidos Simulados</span>
          </h2>
          <p className="text-xs text-aura-beige mt-0.5">
            Consulta, filtrado, detalle y transiciones de cumplimiento en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-aura-surface border border-aura-border text-aura-cream">
            Total: <strong className="text-aura-gold">{orders.length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
            Aprobados: <strong>{orders.filter(o => o.status === 'CONFIRMED').length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300">
            Rechazados: <strong>{orders.filter(o => o.status === 'REJECTED').length}</strong>
          </span>
        </div>
      </div>

      {actionFeedback.message && (
        <div className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between ${
          actionFeedback.type === 'success' 
            ? 'bg-aura-surface text-emerald-400 border border-emerald-500/40' 
            : 'bg-red-950/40 text-red-300 border border-red-500/40'
        }`}>
          <span>{actionFeedback.message}</span>
          <button onClick={() => setActionFeedback({ message: '', type: '' })}>✕</button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-xl aura-card flex flex-col md:flex-row gap-4 justify-between items-center shadow-md">
        {/* Buscador */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-aura-beige absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ID, nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-aura-surface border border-aura-border text-xs text-aura-cream placeholder:text-aura-beige/60 focus:outline-none focus:border-aura-gold transition"
          />
        </div>

        {/* Filtros de Estado */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-aura-beige mr-1 hidden sm:inline" />
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'CONFIRMED', label: 'Confirmados' },
            { id: 'REJECTED', label: 'Rechazados' },
            { id: 'IN_PREPARATION', label: 'En Prep.' },
            { id: 'SHIPPED', label: 'Enviados' },
            { id: 'DELIVERED', label: 'Entregados' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === tab.id
                  ? 'bg-aura-gold text-aura-bg font-bold shadow'
                  : 'bg-aura-surface text-aura-cream hover:text-aura-cream hover:bg-aura-card border border-aura-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="rounded-xl aura-card overflow-hidden shadow-md">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-aura-beige text-xs space-y-2">
            <ShoppingBag className="w-8 h-8 text-aura-beige/50 mx-auto" />
            <p className="font-semibold text-aura-cream">No se encontraron pedidos con los criterios seleccionados.</p>
            <p className="text-[11px]">Intenta ajustar el término de búsqueda o el filtro de estado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-aura-border bg-aura-surface text-aura-cream font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">ID Pedido</th>
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Productos</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Pago</th>
                  <th className="py-3 px-4">Cumplimiento</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-border/40">
                {filteredOrders.map((order) => {
                  const isConfirmed = order.status === 'CONFIRMED';
                  const isRejected = order.status === 'REJECTED';
                  const fulfillment = order.fulfillmentStatus || (isConfirmed ? 'PENDING_PREPARATION' : 'N/A');

                  return (
                    <tr key={order.orderId} className="hover:bg-[#2a1e17] transition">
                      <td className="py-3 px-4 font-mono font-bold text-aura-cream">
                        {order.orderId}
                      </td>
                      <td className="py-3 px-4 text-aura-beige whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-aura-cream">{order.customer?.name}</p>
                        <p className="text-[11px] text-aura-beige">{order.customer?.city || 'Ciudad'}</p>
                      </td>
                      <td className="py-3 px-4 text-aura-beige max-w-[180px] truncate" title={order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}>
                        {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-aura-gold whitespace-nowrap">
                        ${order.totals?.total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isConfirmed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {isConfirmed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{isConfirmed ? 'APROBADO' : 'RECHAZADO'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isRejected ? (
                          <span className="text-[11px] text-aura-beige/60 italic">Sin cumplimiento</span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            fulfillment === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            fulfillment === 'SHIPPED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                            fulfillment === 'IN_PREPARATION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            fulfillment === 'CANCELLED' ? 'bg-zinc-700 text-zinc-300' :
                            'bg-aura-gold/20 text-aura-gold border border-aura-gold/40'
                          }`}>
                            {fulfillment === 'DELIVERED' ? 'Entregado' :
                             fulfillment === 'SHIPPED' ? 'Despachado' :
                             fulfillment === 'IN_PREPARATION' ? 'En Preparación' :
                             fulfillment === 'CANCELLED' ? 'Cancelado' :
                             'Pendiente'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenDetail(order)}
                            className="p-1.5 rounded-lg bg-aura-surface hover:bg-aura-card text-aura-gold border border-aura-border hover:border-aura-gold transition"
                            title="Ver detalle completo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Acciones rápidas de transición según estado actual */}
                          {isConfirmed && fulfillment === 'PENDING_PREPARATION' && (
                            <button
                              onClick={() => handleQuickStatusChange(order.orderId, 'IN_PREPARATION')}
                              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40 transition"
                              title="Iniciar preparación"
                            >
                              Preparar
                            </button>
                          )}
                          {isConfirmed && fulfillment === 'IN_PREPARATION' && (
                            <button
                              onClick={() => handleQuickStatusChange(order.orderId, 'SHIPPED')}
                              className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-bold border border-blue-500/40 transition"
                              title="Despachar pedido"
                            >
                              Enviar
                            </button>
                          )}
                          {isConfirmed && fulfillment === 'SHIPPED' && (
                            <button
                              onClick={() => handleQuickStatusChange(order.orderId, 'DELIVERED')}
                              className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 transition"
                              title="Marcar como entregado"
                            >
                              Entregar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle Completo */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOrderUpdated={() => {
          loadOrders();
        }}
      />
    </div>
  );
}
