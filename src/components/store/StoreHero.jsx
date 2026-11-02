import React from 'react';
import { 
  Coffee, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Package, 
  Award,
  Handshake,
  CheckCircle2 
} from 'lucide-react';

export default function StoreHero({ onExploreCatalog, onSelectPack3, onSelectSubscription }) {
  return (
    <div className="space-y-12">
      {/* Hero Master Block - ROASTIFY Luxury Coffee Composition */}
      <div className="relative overflow-hidden rounded-3xl bg-[#482B23] text-[#F3EDE4] shadow-2xl border border-[#382019]">
        
        {/* Giant Architectural Header Banner inspired by ROASTIFY */}
        <div className="px-6 sm:px-12 pt-8 sm:pt-12 pb-4 border-b border-[#382019]/60">
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black font-serif tracking-tight text-[#F5B700] uppercase opacity-95 select-none leading-none">
            Café de Especialidad
          </h1>
        </div>

        {/* Hero Body: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-12">
          
          {/* Left Column: Protagonist Coffee Bag Photo */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-[#DED3C5]/10 group">
              <img 
                src="/images/roastify_hero_bag.jpg" 
                alt="Bolsa de Café Tueste de Especialidad" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#482B23]/70 via-transparent to-transparent pointer-events-none" />
              
              {/* Product Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#25432F]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#F5B700]/30 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#F5B700] tracking-wider block">Tueste Artesanal Fresco</span>
                  <span className="font-serif font-bold text-[#F3EDE4] text-sm">Origen Huila & Antigua · 340g</span>
                </div>
                <span className="text-base font-mono font-black text-[#F5B700]">$17.00 USD</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy, Inset Photo & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Inset Thumbnail Photo */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#382019]/80 border border-[#DED3C5]/15 max-w-sm backdrop-blur-sm">
              <img 
                src="/images/roastify_pourover.jpg" 
                alt="Filtrado artesanal" 
                className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-md"
              />
              <div className="text-xs">
                <span className="text-[#F5B700] font-bold text-[10px] uppercase tracking-wider block">Métodos de Filtro & Espresso</span>
                <p className="text-[#DED3C5] leading-snug mt-0.5">Tostado en pequeños lotes semanales para máxima frescura en taza.</p>
              </div>
            </div>

            {/* Editorial Headline & Paragraph */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#F3EDE4] leading-tight">
                Café Excepcional, Tostado para el Día a Día.
              </h2>
              <p className="text-sm sm:text-base text-[#DED3C5] leading-relaxed">
                Trazabilidad transparente desde el caficultor hasta tu taza. 
                Tostamos café recién cosechado de productores selectos de Colombia, Guatemala y Costa Rica con más de 84 puntos SCA.
              </p>
            </div>

            {/* Official Packaging Price Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#382019] border border-[#DED3C5]/20 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#F3EDE4]">
                  <span>Bolsa Individual 340g</span>
                  <span className="text-[#F5B700] font-mono text-sm">$17.00 USD</span>
                </div>
                <p className="text-[11px] text-[#DED3C5]/80 leading-snug">
                  2 bolsas = $34.00 USD (Pedido habitual). Envío estándar $4.50 USD.
                </p>
              </div>

              <div 
                onClick={onSelectPack3}
                className="p-3.5 rounded-xl bg-[#25432F]/80 border border-[#F5B700]/40 space-y-1 cursor-pointer hover:border-[#F5B700] transition"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#F5B700]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Pack 3 Bolsas ($48.00)
                  </span>
                  <span className="text-[10px] bg-[#F5B700] text-[#30231C] px-1.5 py-0.5 rounded font-black">ENVÍO GRATIS</span>
                </div>
                <p className="text-[11px] text-[#DED3C5] leading-snug">
                  Ahorras $3 USD y <strong>calificas para Envío Gratis</strong> por superar $45 USD.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] font-black text-sm transition-all shadow-lg shadow-[#F5B700]/25 hover:scale-[1.02]"
              >
                <span>Comprar Café</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={onSelectSubscription}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#382019] hover:bg-[#2d1913] text-[#F3EDE4] border border-[#DED3C5]/30 font-bold text-sm transition-all"
              >
                <Package className="w-4 h-4 text-[#F5B700]" />
                <span>Suscripción ($30.60/mes)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section ("Why Coffee Lovers Choose Roastify" -> "Por qué Elegir Café Tueste") */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#30231C] tracking-tight">
            Por qué Elegir Café Tueste
          </h3>
          <p className="text-xs sm:text-sm text-[#665348]">
            Principios respaldados por el proyecto: calidad de especialidad, comercio directo y unit economics transparentes.
          </p>
        </div>

        {/* 4 Deep Forest Green Horizontal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-2xl bg-[#25432F] text-[#F3EDE4] border border-[#25432F] flex flex-col justify-between shadow-lg space-y-4 hover:translate-y-[-2px] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#1c3324] text-[#F5B700] flex items-center justify-center border border-[#F5B700]/20">
              <Coffee className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#F3EDE4] mb-1">Tostado Semanal Fresco</h4>
              <p className="text-xs text-[#DED3C5]/85 leading-relaxed">
                Tostamos en pequeños lotes artesanales semanales para preservar notas florales, aromas y cuerpo en su punto óptimo.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#25432F] text-[#F3EDE4] border border-[#25432F] flex flex-col justify-between shadow-lg space-y-4 hover:translate-y-[-2px] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#1c3324] text-[#F5B700] flex items-center justify-center border border-[#F5B700]/20">
              <Handshake className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#F3EDE4] mb-1">Origen Directo & Ético</h4>
              <p className="text-xs text-[#DED3C5]/85 leading-relaxed">
                Relación cercana con productores selectos en Huila, Antigua y Tarrazú, pagando precios justos por café superior.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#25432F] text-[#F3EDE4] border border-[#25432F] flex flex-col justify-between shadow-lg space-y-4 hover:translate-y-[-2px] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#1c3324] text-[#F5B700] flex items-center justify-center border border-[#F5B700]/20">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#F3EDE4] mb-1">Calidad Especial (+84 SCA)</h4>
              <p className="text-xs text-[#DED3C5]/85 leading-relaxed">
                Micro-lotes catados rigurosamente con perfil de curva City+ para resaltar dulzura natural sin sabores ahumados ni amargor.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#25432F] text-[#F3EDE4] border border-[#25432F] flex flex-col justify-between shadow-lg space-y-4 hover:translate-y-[-2px] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#1c3324] text-[#F5B700] flex items-center justify-center border border-[#F5B700]/20">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#F3EDE4] mb-1">Envío Gratis &ge; $45 USD</h4>
              <p className="text-xs text-[#DED3C5]/85 leading-relaxed">
                Envío gratuito automático al pedir 3 bolsas ($48) o más. Checkout simulado seguro para probar la experiencia.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
