import React from 'react';
import { Package, Check, Sparkles, ArrowRight, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

export default function StoreSubscription({ onSelectSubscription }) {
  return (
    <div id="suscripcion" className="rounded-3xl bg-[#25432F] text-[#F3EDE4] overflow-hidden shadow-2xl border border-[#1c3324]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-12">
        
        {/* Left Column: Subscription Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c3324] text-[#F5B700] border border-[#F5B700]/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Club de Suscripción Oficial Tueste</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F3EDE4] tracking-tight leading-tight">
              Café Fresco. En Tu Puerta Cada Mes.
            </h2>
            <p className="text-sm sm:text-base text-[#DED3C5] leading-relaxed max-w-xl">
              Disfruta de <strong>2 bolsas (680g)</strong> de café recién tostado en grano o molido por solo <strong className="text-[#F5B700] text-lg font-mono">$30.60 USD/mes</strong>. Ahorras un 10% frente al precio individual habitual ($34.00 USD), con envío gratis incluido.
            </p>
          </div>

          {/* Checklist of Real Case Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-[#F3EDE4]">
              <div className="w-5 h-5 rounded-full bg-[#F5B700] text-[#30231C] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span><strong>10% de ahorro</strong> en cada entrega</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#F3EDE4]">
              <div className="w-5 h-5 rounded-full bg-[#F5B700] text-[#30231C] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span><strong>Envío Gratis</strong> a domicilio</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#F3EDE4]">
              <div className="w-5 h-5 rounded-full bg-[#F5B700] text-[#30231C] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Rotación mensual de <strong>orígenes selectos</strong></span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#F3EDE4]">
              <div className="w-5 h-5 rounded-full bg-[#F5B700] text-[#30231C] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Pausa o cancela sin penalizaciones</span>
            </div>
          </div>

          {/* Golden Yellow Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onSelectSubscription}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] font-black text-sm transition-all shadow-xl shadow-[#F5B700]/25 hover:scale-[1.02]"
            >
              <Package className="w-5 h-5" />
              <span>Suscribirme al Club ($30.60/mes)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <span className="text-xs text-[#DED3C5]/80 font-mono text-center sm:text-left">
              Fórmula oficial: $34.00 × 0.90 = $30.60 USD
            </span>
          </div>

          {/* Prototype Honest Disclaimer */}
          <div className="p-3 rounded-xl bg-[#1c3324]/80 border border-[#DED3C5]/15 text-[11px] text-[#DED3C5] flex items-start gap-2 max-w-xl">
            <ShieldCheck className="w-4 h-4 text-[#F5B700] shrink-0 mt-0.5" />
            <span>
              <strong>Aviso del Prototipo Académico:</strong> El sistema emula la suscripción y los pedidos de demostración en almacenamiento local (localStorage). No realiza cobros bancarios periódicos reales ni compromete tarjetas de crédito.
            </span>
          </div>
        </div>

        {/* Right Column: Hero Pour-Over Brewing Photo */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#DED3C5]/20 group">
            <img 
              src="/images/roastify_pourover.jpg" 
              alt="Preparación artesanal de café pour-over" 
              className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25432F]/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#25432F]/90 backdrop-blur-md border border-[#F5B700]/30 text-xs">
              <span className="text-[#F5B700] font-bold block text-[10px] uppercase">Ritual de Preparación</span>
              <p className="text-[#F3EDE4] text-xs">Compatible con V60, Chemex, Aeropress, Prensa Francesa y Espresso.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
