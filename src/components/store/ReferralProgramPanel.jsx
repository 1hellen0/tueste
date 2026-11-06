import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Gift, Copy, Share2, CheckCircle2, Clock, Users, Sparkles } from 'lucide-react';
import { getOrders, getCustomers } from '../../services/storeStorage';
import {
  confirmCustomerDelivery,
  getCheckoutQuote,
  getOrdersForCustomer,
  getParticipantProgress,
  getReferralParticipantForToken,
  getReferralQueryToken,
  getReferralState,
  getReferralToken,
  recordInvitationAction,
  recordProgramVisit,
  recordReferralVisit,
  recordShareClick
} from '../../services/referralProgram';

export default function ReferralProgramPanel() {
  const queryToken = getReferralQueryToken();
  const [capturedToken, setCapturedToken] = useState(null);
  const referralToken = getReferralToken() || capturedToken;
  const landingReferrer = useMemo(() => getReferralParticipantForToken(referralToken), [referralToken]);
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState('');
  const seenPurchaseEvent = useRef(null);

  const refresh = (nextEmail = email) => {
    setProgress(getParticipantProgress(nextEmail));
    setOrders(getOrdersForCustomer(nextEmail, getOrders()));
  };

  useEffect(() => {
    if (queryToken) {
      recordReferralVisit(queryToken);
      setCapturedToken(queryToken);
    }
    const priorEvents = getReferralState().events.filter(event => event.type === 'referred_purchase_approved');
    seenPurchaseEvent.current = priorEvents.length ? priorEvents[priorEvents.length - 1].eventId : null;
    const handleUpdate = () => {
      refresh();
      const state = getReferralState();
      const recent = state.events.filter(event => event.type === 'referred_purchase_approved').slice(-1)[0];
      if (recent && recent.eventId !== seenPurchaseEvent.current) {
        seenPurchaseEvent.current = recent.eventId;
        setToast('¡Compra referida aprobada! Tu progreso se actualizó. (Simulado)');
        window.setTimeout(() => setToast(''), 3500);
      }
    };
    window.addEventListener('tueste:referrals-updated', handleUpdate);
    return () => window.removeEventListener('tueste:referrals-updated', handleUpdate);
  }, [queryToken]);

  const handleOpenProgram = (event) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setMessage('Ingresa el correo usado en tu compra simulada.');
      return;
    }
    recordProgramVisit(normalized, referralToken);
    const customer = getCustomers().find(item => item.email === normalized);
    const nextProgress = getParticipantProgress(normalized);
    setProgress(nextProgress);
    setOrders(getOrdersForCustomer(normalized, getOrders()));
    setMessage(customer ? 'Programa consultado en este navegador. Identidad de demostración, sin autenticación.' : 'No encontramos compras aprobadas con ese correo. Datos y referidos simulados.');
  };

  const handleConfirm = (orderId) => {
    const result = confirmCustomerDelivery(orderId, email, getOrders());
    setMessage(result.success
      ? 'Confirmación guardada. Si Diego ya marcó la entrega, el enlace queda habilitado.'
      : result.error);
    refresh();
  };

  const shareUrl = progress?.link && typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(progress.link.token)}`
    : '';
  const whatsappUrl = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(`¡Te invito a probar Tueste! Usa mi enlace y recibe $8 de descuento en tu primera compra elegible desde $17: ${shareUrl}`)}`
    : '';

  const handleShare = () => {
    if (!progress?.link) return;
    recordShareClick(progress.participant.participantId, 'whatsapp');
    recordInvitationAction(email);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setMessage('Se abrió WhatsApp con un mensaje preparado. No se registra ni se afirma que fue enviado.');
  };

  return (
    <section id="programa-referidos" className="scroll-mt-24 space-y-5">
      {landingReferrer && (
        <div className="rounded-3xl bg-[#25432F] text-[#F3EDE4] p-5 sm:p-7 border border-[#F5B700]/40 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#F5B700] text-[#30231C] p-2"><Gift className="w-5 h-5" /></div>
            <div>
              <p className="uppercase text-[10px] tracking-widest text-[#F5B700] font-bold">Invitación de {landingReferrer.name || 'un cliente Tueste'}</p>
              <h2 className="font-serif text-2xl font-black mt-1">Tu primera compra tiene $8 de descuento</h2>
              <p className="text-sm text-[#DED3C5] mt-2">Compra elegible desde $17. Aplica a café individual o suscripción. Beneficio simulado en este navegador; no se combina con crédito de invitador.</p>
              <p className="text-[11px] mt-3 text-[#F5B700]">El descuento se conserva durante 30 días desde la última visita válida al enlace.</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-[#EBE4DA] border border-[#DED3C5] p-5 sm:p-7 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-[#482B23] text-[#F5B700] p-2"><Sparkles className="w-5 h-5" /></div>
          <div>
            <p className="uppercase text-[10px] tracking-widest text-[#665348] font-bold">Tueste · Referidos</p>
            <h2 className="font-serif text-xl sm:text-2xl font-black text-[#30231C]">Comparte buen café</h2>
          </div>
        </div>
        <p className="text-xs text-[#665348] mb-4">Panel de demostración local. Ingresa el correo utilizado en un pedido aprobado; no hay autenticación ni sincronización entre dispositivos.</p>
        <form onSubmit={handleOpenProgram} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="Correo usado en tu pedido"
            className="min-w-0 flex-1 rounded-xl border border-[#DED3C5] bg-[#F3EDE4] px-4 py-3 text-sm text-[#30231C] outline-none focus:border-[#482B23]"
          />
          <button className="rounded-xl bg-[#482B23] text-[#F5B700] px-5 py-3 text-sm font-bold hover:bg-[#382019]">Ver mi programa</button>
        </form>

        {message && <p role="status" className="mt-3 text-xs text-[#25432F]">{message}</p>}
        {toast && <div role="status" className="mt-3 rounded-xl bg-[#25432F] px-4 py-3 text-sm font-bold text-white">{toast}</div>}

        {orders.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs font-bold text-[#30231C]">Seguimiento de pedidos · simulados</p>
            {orders.map(order => {
              const confirmation = getReferralState().deliveries.find(item => item.orderId === order.orderId);
              return (
                <div key={order.orderId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#DED3C5] bg-[#F3EDE4] p-3">
                  <div className="text-xs">
                    <strong className="font-mono">{order.orderId}</strong>
                    <span className="ml-2 text-[#665348]">{order.fulfillmentStatus || 'PENDING_PREPARATION'}</span>
                  </div>
                  {confirmation?.customerConfirmedAt
                    ? <span className="text-xs font-semibold text-[#25432F] flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Recepción confirmada</span>
                    : <button onClick={() => handleConfirm(order.orderId)} className="rounded-lg border border-[#25432F] px-3 py-2 text-xs font-bold text-[#25432F]">Confirmé que recibí mi café</button>}
                </div>
              );
            })}
          </div>
        )}

        {progress && (
          <div className="mt-5 border-t border-[#DED3C5] pt-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#665348]">Estado</p>
                <p className="font-bold text-[#25432F]">{progress.link ? 'Programa habilitado' : 'Pendiente de doble confirmación'}</p>
              </div>
              {progress.link && (
                <button onClick={handleShare} className="rounded-xl bg-[#25432F] px-4 py-3 text-sm font-bold text-white flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Compartir por WhatsApp
                </button>
              )}
            </div>
            {progress.link && (
              <div className="flex flex-col sm:flex-row gap-2">
                <input readOnly value={shareUrl} className="min-w-0 flex-1 rounded-lg bg-white border border-[#DED3C5] px-3 py-2 text-xs text-[#30231C]" aria-label="Enlace personal simulado" />
                <button onClick={() => navigator.clipboard?.writeText(shareUrl)} className="rounded-lg border border-[#482B23] px-3 py-2 text-xs font-bold text-[#482B23] flex items-center justify-center gap-1"><Copy className="w-3.5 h-3.5" /> Copiar</button>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Metric icon={<Users className="w-4 h-4" />} label="Amigos compradores" value={progress.purchases.length} />
              <Metric icon={<Gift className="w-4 h-4" />} label="Crédito local" value={`$${progress.credit.toFixed(2)}`} />
              <Metric icon={<Sparkles className="w-4 h-4" />} label="Premios físicos" value={progress.rewards.filter(item => ['sample', 'bag'].includes(item.type) && !['void', 'delivered'].includes(item.status)).length} />
              <Metric icon={<Clock className="w-4 h-4" />} label="Próxima bolsa" value={`${3 - (progress.purchases.length % 3)} compras`} />
            </div>
            {progress.rewards.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold">Progreso y recompensas · simulados</p>
                {progress.rewards.map(reward => (
                  <div key={reward.rewardId} className="flex justify-between gap-2 text-xs bg-white rounded-lg px-3 py-2">
                    <span>{reward.type === 'sample' ? 'Muestra 100 g' : reward.type === 'bag' ? 'Bolsa 340 g' : 'Crédito Tueste'}</span>
                    <span className="font-semibold">{reward.status}</span>
                  </div>
                ))}
              </div>
            )}
            {progress.assignment && <p className="text-[11px] text-[#665348]">Experimento {progress.assignment.variantId} · invitación {progress.assignment.status} (datos simulados).</p>}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-white border border-[#DED3C5] p-3">
      <div className="flex items-center gap-1.5 text-[#665348]">{icon}<span className="text-[10px]">{label}</span></div>
      <p className="font-mono font-black text-[#482B23] mt-1">{value}</p>
    </div>
  );
}
