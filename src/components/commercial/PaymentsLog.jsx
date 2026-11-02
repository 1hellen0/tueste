import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Clock,
  Lock
} from 'lucide-react';
import { getPaymentsLog } from '../../services/storeStorage';

export default function PaymentsLog() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    setPayments(getPaymentsLog());
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.authorizationCode && payment.authorizationCode.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'APPROVED') return payment.status === 'APPROVED';
    if (statusFilter === 'DECLINED') return payment.status === 'DECLINED';
    return true;
  });

  const totalProcessed = payments.length;
  const totalApproved = payments.filter(p => p.status === 'APPROVED').length;
  const totalDeclined = payments.filter(p => p.status === 'DECLINED').length;
  const totalVolume = payments
    .filter(p => p.status === 'APPROVED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Cabecera y Métricas de Pagos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-serif text-aura-cream flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-aura-gold" />
            <span>Auditoría de Pagos Simulados</span>
          </h2>
          <p className="text-xs text-aura-beige mt-0.5">
            Bitácora de transacciones bancarias simuladas, códigos de autorización y rechazos de laboratorio.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-aura-surface border border-aura-border text-aura-cream">
            Transacciones: <strong className="text-aura-gold">{totalProcessed}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
            Aprobadas: <strong>{totalApproved}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300">
            Rechazadas: <strong>{totalDeclined}</strong>
          </span>
        </div>
      </div>

      {/* Banner de Seguridad Estricta */}
      <div className="p-4 rounded-xl aura-card flex items-start gap-3 text-xs text-aura-beige shadow-sm">
        <Lock className="w-5 h-5 text-aura-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold font-serif text-aura-gold text-sm">
            Protocolo de Seguridad y Simulación de Pasarela
          </p>
          <p className="leading-relaxed text-aura-beige">
            Este sistema es un simulador pedagógico: <strong className="text-aura-cream">no procesa tarjetas de crédito reales, no solicita códigos CVV ni se comunica con pasarelas bancarias comerciales</strong>. Toda transacción opera bajo números de prueba en memoria y códigos de autorización ficticios (<code className="text-aura-gold font-mono">AUTH-SIM-XXXXXX</code>).
          </p>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="p-4 rounded-xl aura-card flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-aura-beige absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-aura-surface border border-aura-border text-xs text-aura-cream placeholder:text-aura-beige/60 focus:outline-none focus:border-aura-gold transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'Todas' },
            { id: 'APPROVED', label: 'Aprobadas' },
            { id: 'DECLINED', label: 'Rechazadas' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
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

      {/* Tabla de Pagos */}
      <div className="rounded-xl aura-card overflow-hidden shadow-md">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-aura-beige text-xs space-y-2">
            <CreditCard className="w-8 h-8 text-aura-beige/50 mx-auto" />
            <p className="font-semibold text-aura-cream">No hay registros de pago que coincidan con la búsqueda.</p>
            <p className="text-[11px]">Ejecuta una compra en la tienda pública para generar una transacción simulada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-aura-border bg-aura-surface text-aura-cream font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">ID Pedido</th>
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Medio Simulado</th>
                  <th className="py-3 px-4">Importe</th>
                  <th className="py-3 px-4">Resultado</th>
                  <th className="py-3 px-4">Autorización / Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-border/40">
                {filteredPayments.map((p, idx) => {
                  const isApproved = p.status === 'APPROVED';

                  return (
                    <tr key={idx} className="hover:bg-[#2a1e17] transition">
                      <td className="py-3 px-4 font-mono font-bold text-aura-cream">
                        {p.orderId}
                      </td>
                      <td className="py-3 px-4 text-aura-beige whitespace-nowrap">
                        {new Date(p.processedAt).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-aura-cream">{p.customerName}</p>
                        <p className="text-[10px] text-aura-beige">{p.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4 text-aura-beige font-mono whitespace-nowrap">
                        {p.brand} •••• {p.last4}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-aura-gold whitespace-nowrap">
                        ${p.amount.toFixed(2)} USD
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{isApproved ? 'APROBADO' : 'RECHAZADO'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isApproved ? (
                          <span className="font-mono text-[11px] text-emerald-400 font-semibold bg-aura-surface px-2 py-0.5 rounded border border-aura-border">
                            {p.authorizationCode}
                          </span>
                        ) : (
                          <span className="text-[11px] text-red-300 italic">
                            {p.declineReason || 'Declinado por el banco simulado'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
