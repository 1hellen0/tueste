import React, { useState } from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  AlertCircle,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { updateOrderStatus } from '../../services/storeStorage';

export default function OrderDetailModal({ order, isOpen, onClose, onOrderUpdated }) {
  if (!isOpen || !order) return null;

  const [currentOrder, setCurrentOrder] = useState(order);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const isConfirmed = currentOrder.status === 'CONFIRMED';
  const isRejected = currentOrder.status === 'REJECTED';
  const fulfillmentStatus = currentOrder.fulfillmentStatus || (isConfirmed ? 'PENDING_PREPARATION' : 'N/A');

  const handleStatusChange = (newStatus) => {
    const res = updateOrderStatus(currentOrder.orderId, newStatus);
    if (res.success) {
      setCurrentOrder(res.order);
      setFeedback({ 
        message: `Estado actualizado exitosamente a: ${newStatus}`, 
        type: 'success' 
      });
      if (onOrderUpdated) onOrderUpdated(res.order);
    } else {
      setFeedback({ 
        message: res.error || 'Error actualizando estado.', 
        type: 'error' 
      });
    }
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const getFulfillmentBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Entregado</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Despachado / En Ruta</span>;
      case 'IN_PREPARATION':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> En Preparación</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 flex items-center gap-1"><Ban className="w-3.5 h-3.5" /> Cancelado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pendiente de Preparación</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-aura-card border border-aura-border rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="p-5 border-b border-aura-border flex items-center justify-between bg-aura-surface">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold font-serif text-aura-cream font-mono">{currentOrder.orderId}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isConfirmed 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {isConfirmed ? 'PAGO APROBADO' : 'PAGO RECHAZADO'}
              </span>
            </div>
            <p className="text-xs text-aura-beige mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-aura-gold" />
              <span>{new Date(currentOrder.createdAt).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-aura-beige hover:text-aura-cream hover:bg-aura-card transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback.message && (
          <div className={`p-3 text-xs font-semibold flex items-center gap-2 border-b ${
            feedback.type === 'success' 
              ? 'bg-aura-surface border-emerald-500/30 text-emerald-300' 
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Contenido desplazable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Datos del Cliente y Envío */}
          <div className="p-4 rounded-xl bg-aura-surface border border-aura-border space-y-2">
            <div className="flex items-center gap-2 text-aura-gold text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Destinatario y Envío</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-aura-beige">Cliente:</span>
                <p className="font-semibold text-aura-cream">{currentOrder.customer?.name}</p>
                <p className="text-aura-beige">{currentOrder.customer?.email}</p>
                {currentOrder.customer?.phone && <p className="text-aura-beige/80">Tel: {currentOrder.customer?.phone}</p>}
              </div>
              <div>
                <span className="text-aura-beige">Dirección de Entrega:</span>
                <p className="font-semibold text-aura-cream">{currentOrder.customer?.address}</p>
                <p className="text-aura-beige">{currentOrder.customer?.city || 'Ciudad'}</p>
              </div>
            </div>
          </div>

          {/* 2. Productos del Pedido */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-aura-gold text-xs font-bold uppercase tracking-wider">
              <Package className="w-4 h-4" />
              <span>Productos ({currentOrder.items?.length || 0})</span>
            </div>
            <div className="divide-y divide-aura-border border border-aura-border rounded-xl overflow-hidden bg-aura-surface">
              {currentOrder.items?.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#2a1e17] transition">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-aura-cream">{item.name}</p>
                    <p className="text-[11px] text-aura-beige font-mono">
                      SKU: {item.sku} · {item.quantity} unidad(es) × ${item.price?.toFixed(2)} USD
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-aura-gold">${(item.price * item.quantity).toFixed(2)} USD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Desglose Financiero */}
          <div className="p-4 rounded-xl bg-aura-surface border border-aura-border space-y-2 text-xs">
            <div className="flex justify-between text-aura-beige">
              <span>Subtotal productos:</span>
              <span className="font-mono text-aura-cream">${currentOrder.totals?.subtotal?.toFixed(2) || '0.00'} USD</span>
            </div>
            <div className="flex justify-between text-aura-beige">
              <span>Costo de envío:</span>
              <span className="font-mono">
                {currentOrder.totals?.shippingCost === 0 ? (
                  <span className="text-emerald-400 font-semibold">GRATIS</span>
                ) : (
                  `$${currentOrder.totals?.shippingCost?.toFixed(2)} USD`
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-aura-border flex justify-between items-baseline font-bold text-sm">
              <span className="text-aura-cream">Total Liquidado:</span>
              <span className="text-aura-gold font-mono text-base">
                ${currentOrder.totals?.total?.toFixed(2) || '0.00'} USD
              </span>
            </div>
          </div>

          {/* 4. Auditoría de Pago Simulado */}
          <div className="p-4 rounded-xl bg-aura-surface border border-aura-border space-y-2 text-xs">
            <div className="flex items-center gap-2 text-aura-gold font-bold uppercase tracking-wider text-[11px]">
              <CreditCard className="w-4 h-4" />
              <span>Transacción de Pago Simulado</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-aura-beige">Medio: </span>
                <span className="text-aura-cream font-semibold">
                  {currentOrder.payment?.brand || 'Visa Demo'} •••• {currentOrder.payment?.last4 || '4242'}
                </span>
              </div>
              <div>
                <span className="text-aura-beige">Pasarela: </span>
                <span className="text-aura-beige font-mono text-[10px]">
                  {currentOrder.payment?.gateway || 'Simulated Engine'}
                </span>
              </div>
              {currentOrder.payment?.authorizationCode && (
                <div className="sm:col-span-2">
                  <span className="text-aura-beige">Código de Autorización: </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {currentOrder.payment.authorizationCode}
                  </span>
                </div>
              )}
              {currentOrder.payment?.declineReason && (
                <div className="sm:col-span-2 text-red-300 bg-red-500/10 p-2 rounded border border-red-500/20">
                  <span className="font-semibold">Motivo de declinación: </span>
                  <span>{currentOrder.payment.declineReason}</span>
                </div>
              )}
            </div>
          </div>

          {/* 5. Gestión del Estado de Cumplimiento (Fulfillment) */}
          <div className="p-4 rounded-xl bg-aura-surface border border-aura-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-aura-cream font-semibold">
                Estado Actual de Cumplimiento:
              </span>
              <div>{getFulfillmentBadge(fulfillmentStatus)}</div>
            </div>

            {isRejected ? (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                ⚠️ Este pedido fue <strong>RECHAZADO</strong> por la pasarela simulada. No se descontó inventario y las reglas de negocio bloquean su despacho o confirmación sin un nuevo pago simulado aprobado.
              </div>
            ) : fulfillmentStatus === 'DELIVERED' ? (
              <div className="p-3 rounded-lg bg-aura-card border border-aura-border text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Pedido entregado satisfactoriamente al cliente. Estado terminal finalizado.</span>
              </div>
            ) : fulfillmentStatus === 'CANCELLED' ? (
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs flex items-center gap-2">
                <Ban className="w-4 h-4 shrink-0" />
                <span>Pedido cancelado administrativamente. Estado terminal.</span>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-aura-border">
                <p className="text-[11px] text-aura-beige font-medium">Avanzar al siguiente estado:</p>
                <div className="flex flex-wrap gap-2">
                  {fulfillmentStatus === 'PENDING_PREPARATION' && (
                    <button
                      onClick={() => handleStatusChange('IN_PREPARATION')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Iniciar Preparación</span>
                    </button>
                  )}
                  {(fulfillmentStatus === 'PENDING_PREPARATION' || fulfillmentStatus === 'IN_PREPARATION') && (
                    <button
                      onClick={() => handleStatusChange('SHIPPED')}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Despachar / Enviar</span>
                    </button>
                  )}
                  {fulfillmentStatus === 'SHIPPED' && (
                    <button
                      onClick={() => handleStatusChange('DELIVERED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmar Entrega</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('¿Confirmas la cancelación de este pedido?')) {
                        handleStatusChange('CANCELLED');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-semibold transition"
                  >
                    Cancelar Pedido
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-4 border-t border-aura-border bg-aura-surface flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-aura-gold hover:bg-aura-goldLight text-aura-bg text-xs font-bold transition"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
