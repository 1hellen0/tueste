import React from 'react';
import { DollarSign, AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CompanyCashSimulation({ metrics, params }) {
  const simulation = metrics.companySimulation;

  return (
    <div className="aura-card p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-aura-border">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-aura-gold" />
            <h3 className="font-bold font-serif text-aura-cream text-base">Simulación de Tesorería de la Empresa (Mes 1 al Mes 4)</h3>
          </div>
          <p className="text-xs text-aura-beige mt-0.5">
            Proyección del saldo bancario real partiendo de $35.000 USD. Piso de seguridad infranqueable: $5.000 USD.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-aura-beige">Piso Infranqueable:</span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-aura-gold/20 text-aura-gold border border-aura-gold/50 font-mono">
            $5.000,00 USD
          </span>
        </div>
      </div>

      {/* Grid de tarjetas mes a mes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {simulation.map((m) => {
          const isDanger = m.bankBalance < 5000;
          const isBroke = m.bankBalance < 0;

          return (
            <div 
              key={m.month}
              className={`p-4 rounded-xl border transition-all ${
                isBroke ? 'bg-red-950/60 border-red-800' :
                isDanger ? 'bg-amber-950/40 border-amber-800' :
                'bg-aura-surface border-aura-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-aura-cream uppercase tracking-wider">
                  Mes {m.month} ({m.month * 30} días)
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isBroke ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                  isDanger ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {isBroke ? 'QUIEBRA' : isDanger ? 'PISO VIOLADO' : 'SOLVENTE'}
                </span>
              </div>

              <div className="space-y-1.5 my-3 text-xs">
                <div className="flex justify-between text-aura-beige">
                  <span>Entradas de Caja:</span>
                  <span className="font-semibold text-emerald-400 font-mono">+${m.inflows.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-aura-beige">
                  <span>Egresos Totales:</span>
                  <span className="font-semibold text-red-400 font-mono">-${m.outflows.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-aura-cream pt-1 border-t border-aura-border/60">
                  <span>Flujo Neto Mensual:</span>
                  <span className={`font-bold font-mono ${m.netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {m.netFlow >= 0 ? '+' : ''}${m.netFlow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-aura-border/60">
                <span className="text-[10px] text-aura-beige uppercase font-semibold block">Saldo Bancario Final</span>
                <span className={`text-lg font-extrabold font-mono ${
                  isBroke ? 'text-red-400' :
                  isDanger ? 'text-amber-400' :
                  'text-aura-cream'
                }`}>
                  ${m.bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota técnica de auditoría */}
      <div className="p-4 rounded-xl bg-aura-surface border border-aura-border text-xs text-aura-beige space-y-2">
        <div className="flex items-center gap-2 font-bold text-aura-gold font-serif text-sm">
          <ShieldAlert className="w-4 h-4 text-aura-gold" />
          <span>Demostración Matemática de la Quiebra con la Agencia:</span>
        </div>
        <p className="leading-relaxed text-aura-beige">
          En la propuesta de la agencia Impulso Digital ($16.000 Meta + $1.000 Fee + $6.500 Fijos = <strong className="text-aura-cream">$23.500 USD de egresos mensuales</strong>), los clientes nuevos entran con un 30% de descuento que deja un CM2 unitario de apenas <strong className="text-aura-cream">$6,15 USD</strong>.
        </p>
        <p className="leading-relaxed text-aura-beige">
          El déficit mensual es de -$12.102 en el Mes 1, -$11.314 en el Mes 2 y -$10.371 en el Mes 3. Por lo tanto, <strong className="text-aura-cream">a los 90 días (Mes 3) la cuenta retiene solo $1.212 USD</strong>, perforando el piso infranqueable de $5.000 USD y entrando en saldo negativo de <strong className="text-red-400">-$8.248 USD al Mes 4</strong>.
        </p>
      </div>
    </div>
  );
}
