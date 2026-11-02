import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  User, 
  Mail, 
  MapPin, 
  Phone,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { processSimulatedCheckout } from '../../services/storeStorage';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onOrderCompleted
}) {
  if (!isOpen) return null;

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: '',
    city: 'San José',
    phone: ''
  });

  const [paymentChoice, setPaymentChoice] = useState('APPROVED'); // 'APPROVED' | 'REJECTED'
  const [cardBrand, setCardBrand] = useState('Visa Demo');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionNotice, setRejectionNotice] = useState(null);

  const handleInputChange = (field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
    if (rejectionNotice) {
      setRejectionNotice(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!customer.name.trim()) errors.name = 'El nombre completo es requerido.';
    if (!customer.email.trim()) {
      errors.email = 'El correo electrónico es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      errors.email = 'Ingrese un correo electrónico válido.';
    }
    if (!customer.address.trim()) errors.address = 'La dirección de envío es requerida.';
    return errors;
  };

  const handleExecutePayment = (simulateApproval) => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setRejectionNotice(null);

    // Pequeño delay de 400ms para emular respuesta de pasarela
    setTimeout(() => {
      const idempotencyKey = `IDEM-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const result = processSimulatedCheckout({
        customer,
        cartItems: cart.items,
        simulateApproval: simulateApproval,
        idempotencyKey,
        cardBrand,
        cardLast4: '4242'
      });

      setIsSubmitting(false);

      if (result.success) {
        // Orden aprobada: cerrar modal y disparar comprobante
        onOrderCompleted(result.order);
      } else {
        // Orden rechazada: mostrar banner de declinación explicativo
        setRejectionNotice({
          reason: result.reason || 'Transacción rechazada por el emisor bancario simulado.',
          code: result.order?.payment?.authorizationCode || 'ERR-SIM-DECLINED'
        });
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-[#30231C]/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#F3EDE4] border border-[#DED3C5] rounded-3xl shadow-2xl overflow-hidden my-8 animate-fadeIn text-[#30231C]">
        
        {/* Modal Header in Chocolate #482B23 */}
        <div className="p-6 bg-[#482B23] text-[#F3EDE4] border-b border-[#382019] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5B700] text-[#30231C] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#F3EDE4]">Checkout y Pago Simulado</h3>
              <p className="text-xs text-[#DED3C5]">
                Finaliza tu compra emulada de café de especialidad
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#DED3C5] hover:text-[#F3EDE4] hover:bg-[#382019] flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Order Summary Snapshot */}
          <div className="p-4 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#665348] block">Resumen del Pedido:</span>
              <span className="font-serif font-bold text-sm text-[#30231C]">
                {cart.itemsCount} producto(s) · {cart.freeShippingApplied ? 'Envío Gratis' : 'Envío $4.50 USD'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#665348] block">Total Liquidado:</span>
              <span className="font-mono text-2xl font-black text-[#482B23]">
                ${cart.total?.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Rejection Notification Banner */}
          {rejectionNotice && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 space-y-2 animate-shake">
              <div className="flex items-center gap-2 font-bold text-sm text-red-800">
                <XCircle className="w-5 h-5 text-red-600" />
                <span>Pago Simulado Declinado por el Banco</span>
              </div>
              <p className="text-xs leading-relaxed">
                {rejectionNotice.reason}
              </p>
              <div className="text-[11px] font-mono text-red-700 bg-red-100 p-2 rounded">
                Código de Respuesta: {rejectionNotice.code} · Tu carrito y el stock de la tienda se han conservado 100% intactos.
              </div>
            </div>
          )}

          {/* Customer Data Form */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#30231C] border-b border-[#DED3C5] pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#482B23]" />
              <span>1. Información de Envío y Contacto</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#30231C] mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#665348]" />
                  <input
                    id="checkout-name-input"
                    type="text"
                    placeholder="Ej. Diego Meléndez"
                    value={customer.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl bg-[#F3EDE4] border text-xs text-[#30231C] placeholder-[#665348]/60 focus:outline-none transition ${
                      formErrors.name ? 'border-red-500' : 'border-[#DED3C5] focus:border-[#482B23]'
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <span className="text-[10px] text-red-600 mt-0.5 block">{formErrors.name}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#30231C] mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#665348]" />
                  <input
                    id="checkout-email-input"
                    type="email"
                    placeholder="diego@ejemplo.com"
                    value={customer.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl bg-[#F3EDE4] border text-xs text-[#30231C] placeholder-[#665348]/60 focus:outline-none transition ${
                      formErrors.email ? 'border-red-500' : 'border-[#DED3C5] focus:border-[#482B23]'
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <span className="text-[10px] text-red-600 mt-0.5 block">{formErrors.email}</span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#30231C] mb-1">
                  Dirección de Entrega *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#665348]" />
                  <textarea
                    id="checkout-address-input"
                    rows={2}
                    placeholder="Calle, avenida, número de casa, señas exactas..."
                    value={customer.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl bg-[#F3EDE4] border text-xs text-[#30231C] placeholder-[#665348]/60 focus:outline-none transition resize-none ${
                      formErrors.address ? 'border-red-500' : 'border-[#DED3C5] focus:border-[#482B23]'
                    }`}
                  />
                </div>
                {formErrors.address && (
                  <span className="text-[10px] text-red-600 mt-0.5 block">{formErrors.address}</span>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Selector & Gateway Emulator */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#30231C] border-b border-[#DED3C5] pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#482B23]" />
                <span>2. Método de Pago Simulado</span>
              </span>
              <span className="text-[10px] font-bold text-[#25432F] bg-[#25432F]/10 px-2 py-0.5 rounded-full border border-[#25432F]/30">
                100% Sin Cobros Reales
              </span>
            </h4>

            {/* Test Mode Selector: Approve or Reject */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#30231C] block">
                Selecciona el Resultado de la Simulación de Pasarela:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="checkout-approved-choice"
                  type="button"
                  onClick={() => setPaymentChoice('APPROVED')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    paymentChoice === 'APPROVED'
                      ? 'bg-[#25432F]/10 border-[#25432F] shadow-sm'
                      : 'bg-[#EBE4DA] border-[#DED3C5] hover:border-[#482B23]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    paymentChoice === 'APPROVED' ? 'bg-[#25432F] text-[#F3EDE4]' : 'border border-[#665348]'
                  }`}>
                    {paymentChoice === 'APPROVED' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#25432F] block">
                      Simular Pago Aprobado
                    </span>
                    <span className="text-[11px] text-[#665348] leading-tight block mt-0.5">
                      Descuenta stock, vacía carrito y genera comprobante con código de autorización.
                    </span>
                  </div>
                </button>

                <button
                  id="checkout-rejected-choice"
                  type="button"
                  onClick={() => setPaymentChoice('REJECTED')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    paymentChoice === 'REJECTED'
                      ? 'bg-red-50 border-red-500 shadow-sm'
                      : 'bg-[#EBE4DA] border-[#DED3C5] hover:border-[#482B23]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    paymentChoice === 'REJECTED' ? 'bg-red-600 text-white' : 'border border-[#665348]'
                  }`}>
                    {paymentChoice === 'REJECTED' && <XCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-red-800 block">
                      Simular Pago Rechazado
                    </span>
                    <span className="text-[11px] text-[#665348] leading-tight block mt-0.5">
                      Fondos insuficientes; preserva stock y carrito intactos para auditoría.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Simulated Card Display */}
            <div className="p-4 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#30231C]">Tarjeta de Demostración:</span>
                <span className="font-mono text-xs font-bold text-[#482B23]">{cardBrand} •••• 4242</span>
              </div>
              <p className="text-[11px] text-[#665348] leading-snug">
                Entorno sandbox protegido. No es necesario ingresar números de tarjeta reales, fechas de expiración ni CVV.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer with Action Buttons */}
        <div className="p-6 border-t border-[#DED3C5] bg-[#EBE4DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#665348]">
            <ShieldCheck className="w-4 h-4 text-[#25432F]" />
            <span>Transacción 100% segura y académica</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="checkout-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/2 sm:w-auto px-4 py-3 rounded-xl border border-[#DED3C5] text-[#30231C] hover:bg-[#DED3C5] text-xs font-bold transition"
            >
              Cancelar
            </button>

            <button
              id="checkout-submit-btn"
              type="button"
              onClick={() => handleExecutePayment(paymentChoice === 'APPROVED')}
              disabled={isSubmitting}
              className={`w-1/2 sm:w-auto px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                paymentChoice === 'APPROVED'
                  ? 'bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] shadow-[#F5B700]/25'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25'
              }`}
            >
              {isSubmitting ? (
                <span>Procesando pago...</span>
              ) : (
                <>
                  <span>
                    {paymentChoice === 'APPROVED' ? `Confirmar y Pagar $${cart.total?.toFixed(2)} USD` : 'Simular Fallo de Pago'}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
