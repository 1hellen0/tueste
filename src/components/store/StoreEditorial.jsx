import React from 'react';
import { Coffee, Award, Star, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function StoreEditorial({ onExploreCatalog }) {
  return (
    <div id="nosotros" className="space-y-12">
      {/* Commitment to Quality Split Section inspired by ROASTIFY */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#382019] grid grid-cols-1 lg:grid-cols-12 bg-[#482B23] text-[#F3EDE4]">
        
        {/* Left Column: Photograph of coffee cup with golden crema */}
        <div className="lg:col-span-6 relative min-h-[320px] sm:min-h-[400px]">
          <img 
            src="/images/roastify_cup_crema.jpg" 
            alt="Taza de café de especialidad con crema dorada" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#482B23]/40 hidden lg:block" />
        </div>

        {/* Right Column: Editorial Chocolate Card */}
        <div className="lg:col-span-6 p-6 sm:p-12 flex flex-col justify-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#382019] text-[#F5B700] border border-[#F5B700]/30 text-xs font-bold w-fit">
            <Award className="w-3.5 h-3.5" />
            <span>Trazabilidad y Maestría de Origen</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-serif font-black text-[#F3EDE4] tracking-tight leading-tight">
            Nuestro Compromiso con la Calidad y el Tueste.
          </h3>

          <p className="text-sm sm:text-base text-[#DED3C5] leading-relaxed">
            En Tueste creemos que un café excepcional nace en la finca y se perfecciona en el tostador. 
            Trabajamos con microlotes evaluados por encima de 84 puntos SCA, seleccionando granos de maduración tardía y aplicando un perfil de tueste medio balanceado que exalta notas naturales sin enmascararlas con sobretueste.
          </p>

          <p className="text-xs sm:text-sm text-[#DED3C5]/80 leading-relaxed">
            Cada pedido es despachado en bolsas con válvula desgasificadora unidireccional y cierre hermético para garantizar que disfrutes el aroma intacto en tu hogar.
          </p>

          <div className="pt-2">
            <button
              onClick={onExploreCatalog}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] font-black text-xs transition-all shadow-lg shadow-[#F5B700]/20 hover:scale-[1.02]"
            >
              <span>Explorar Catálogo Completo</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Experiences / Editorial Quotes Band inspired by ROASTIFY bottom banner */}
      <div className="text-center space-y-6 pt-4">
        <div className="space-y-1">
          <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#30231C] tracking-tight italic">
            "Café Real. Experiencias Reales. Calidad Transparente."
          </h4>
          <p className="text-xs text-[#665348]">
            Lo que valoran quienes preparan Tueste todos los días en sus hogares.
          </p>
        </div>

        {/* 3 Review Cards in Cream/Beige */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="p-6 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-[#F5B700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#30231C] leading-relaxed italic">
              "El tueste de Huila es balance perfecto: notas a caramelo y ciruela sin gota de amargura. La suscripción de $30.60 por 2 bolsas es el mejor valor en café de especialidad."
            </p>
            <div className="pt-2 border-t border-[#DED3C5] text-xs">
              <span className="font-bold text-[#30231C] block">Camila R.</span>
              <span className="text-[#665348] text-[11px]">Suscriptora Club Tueste · San José</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-[#F5B700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#30231C] leading-relaxed italic">
              "Pedí el Pack de 3 bolsas para probar diferentes orígenes y aproveché el envío gratis. El café llegó tostado de esa misma semana; la floración en V60 es espectacular."
            </p>
            <div className="pt-2 border-t border-[#DED3C5] text-xs">
              <span className="font-bold text-[#30231C] block">Esteban M.</span>
              <span className="text-[#665348] text-[11px]">Cliente Verificado · Heredia</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] space-y-3 shadow-sm">
            <div className="flex items-center gap-1 text-[#F5B700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#30231C] leading-relaxed italic">
              "Excelente cuerpo para máquina de espresso. El origen Antigua da una crema densa y dulce. Se nota el respeto al productor en cada taza que preparo."
            </p>
            <div className="pt-2 border-t border-[#DED3C5] text-xs">
              <span className="font-bold text-[#30231C] block">Valeria G.</span>
              <span className="text-[#665348] text-[11px]">Aficionada al Espresso · Cartago</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
