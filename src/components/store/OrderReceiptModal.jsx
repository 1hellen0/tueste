import React from 'react';
import { 
  CheckCircle2, 
  X, 
  ShoppingBag, 
  Truck, 
  Calendar, 
  User, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  Printer
} from 'lucide-react';

export default function OrderReceiptModal({
  order,
  isOpen,
  onClose,
  onGoToAdmin
}) {
  if (!isOpen || !order) return null;

  const { orderId, createdAt, customer, items, totals, payment } = order;
  const formattedDate = new Date(createdAt).toLocaleString('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-[#30231C]/85 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#F3EDE4] border border-[#DED3C5] rounded-3xl shadow-2xl overflow-hidden my-8 animate-fadeIn text-[#30231C]">
        
        {/* Success Header in Forest Green #25432F */}
        <div className="p-6 bg-[#25432F] text-[#F3EDE4] border-b border-[#1c3324] text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#1c3324] text-[#F5B700] border border-[#F5B700]/30 flex items-center justify-center mx-auto shadow-lg shadow-[#F5B700]/20">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1c3324] text-[#F5B700] border border-[#F5B700]/30">
              Compra Simulada Confirmada
            </span>
            <h3 className="text-xl font-serif font-black text-[#F3EDE4] tracking-tight">
              ¡Gracias por tu pedido, {customer.name}!
            </h3>
            <p className="text-xs text-[#DED3C5] font-mono">
              Número de Pedido: <strong className="text-[#F5B700] font-bold">{orderId}</strong>
            </p>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-5 text-xs text-[#30231C] max-h-[60vh] overflow-y-auto">
          
          {/* Metadata Card */}
          <div className="p-4 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-[#665348] block">Fecha y Hora:</span>
              <span className="font-medium text-[#30231C]">{formattedDate}</span>
            </div>
            <div>
              <span className="text-[#665348] block">Método de Pago:</span>
              <span className="font-bold text-[#25432F]">{payment?.method || 'Tarjeta'} (Simulado)</span>
            </div>
            <div>
              <span className="text-[#665348] block">Código de Autorización:</span>
              <span className="font-mono font-bold text-[#482B23]">{payment?.authorizationCode}</span>
            </div>
            <div>
              <span className="text-[#665348] block">Estado de Cumplimiento:</span>
              <span className="font-bold text-[#25432F]">En Preparación</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-[#DED3C5]">
              <span className="text-[#665348] block">Dirección de Entrega:</span>
              <span className="font-medium text-[#30231C]">{customer.address}, {customer.city} ({customer.email})</span>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#665348]">
              Desglose de Productos
            </h4>
            
            <div className="rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] divide-y divide-[#DED3C5] overflow-hidden">
              {(items || []).map((it, idx) => {
                const itPrice = Number(it.price || 0);
                const itQty = Number(it.quantity || 1);
                const itSubtotal = Number(it.subtotal ?? it.itemSubtotal ?? (itPrice * itQty) ?? 0);

                return (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-serif font-bold text-xs text-[#30231C] block">{it.name}</span>
                      <span className="text-[11px] text-[#665348]">
                        Cantidad: {itQty} × ${itPrice.toFixed(2)} USD
                      </span>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#482B23]">
                      ${itSubtotal.toFixed(2)} USD
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="p-4 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] space-y-1.5">
            <div className="flex justify-between text-[#665348]">
              <span>Subtotal Productos:</span>
              <span className="font-mono text-[#30231C]">${Number(totals?.subtotal || 0).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-[#665348]">
              <span>Costo de Envío:</span>
              <span className={`font-mono ${totals?.freeShippingApplied ? 'text-[#25432F] font-bold' : 'text-[#30231C]'}`}>
                {totals?.freeShippingApplied ? 'GRATIS ($0.00 USD)' : `$${Number(totals?.shippingCost || 0).toFixed(2)} USD`}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif font-black text-[#30231C] pt-2 border-t border-[#DED3C5]">
              <span>Total Pagado:</span>
              <span className="font-mono text-xl text-[#482B23]">${Number(totals?.total || 0).toFixed(2)} USD</span>
            </div>
          </div>

          {/* Pedagogical Sandbox Disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#25432F]/10 border border-[#25432F]/30 text-[11px] text-[#25432F] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#25432F] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Simulación Exitosa:</strong> Esta orden se ha guardado en el gestor comercial de la administración (`localStorage`) y se ha descontado el stock de demostración. Puedes consultarla en la sección de <strong>Gestión de Pedidos</strong>.
            </p>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 border-t border-[#DED3C5] bg-[#EBE4DA] flex flex-col sm:flex-row items-center gap-3">
          <button
            id="receipt-print-btn"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#DED3C5] hover:bg-[#DED3C5] text-xs font-bold text-[#30231C] transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Recibo</span>
          </button>

          <button
            id="receipt-admin-btn"
            onClick={() => {
              onClose();
              if (onGoToAdmin) onGoToAdmin();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25432F] hover:bg-[#1c3324] text-[#F5B700] text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ver Pedido en Administración</span>
          </button>

          <button
            id="receipt-close-btn"
            onClick={onClose}
            className="w-full sm:flex-1 px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-[#F5B700]/20"
          >
            <span>Seguir Comprando</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>
    </div>
  );
}
