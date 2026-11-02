import React from 'react';
import { 
  Percent, 
  Target, 
  UserCheck, 
  Clock, 
  Flame, 
  TrendingUp, 
  DollarSign, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function KpiGrid({ metrics, params }) {
  // Semáforo LTV:CAC
  const ltvCacColor = metrics.ltvToCac >= 3.0 
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' 
    : metrics.ltvToCac >= 1.0 
    ? 'text-amber-400 border-amber-500/40 bg-amber-950/30' 
    : 'text-red-400 border-red-500/40 bg-red-950/30';

  const ltvCacBadge = metrics.ltvToCac >= 3.0 
    ? { text: 'Estrella (≥ 3x)', bg: 'bg-emerald-500/20 text-emerald-300' }
    : metrics.ltvToCac >= 1.0 
    ? { text: 'Frágil (1x - 3x)', bg: 'bg-amber-500/20 text-amber-300' }
    : { text: 'Pérdida (< 1x)', bg: 'bg-red-500/20 text-red-300' };

  const cards = [
    {
      title: 'MARGEN CM2 (1ER PEDIDO)',
      value: `$${metrics.unitLooseFirst.cm2.toFixed(2)}`,
      subValue: `${(metrics.unitLooseFirst.cm2Pct * 100).toFixed(1)}% del precio cobrado`,
      detail: `Precio $${metrics.unitLooseFirst.grossPrice.toFixed(2)} - Café $${metrics.unitLooseFirst.coffeeCost.toFixed(2)} - Entrega $${metrics.unitLooseFirst.totalVariableDelivery.toFixed(2)}`,
      icon: Percent,
      highlight: metrics.unitLooseFirst.cm2 < 10 ? 'red' : 'green',
      badge: metrics.unitLooseFirst.cm2 < 10 ? 'Margen Destruido' : 'Margen Protegido'
    },
    {
      title: 'ROAS BREAK-EVEN VS REAL',
      value: `${metrics.unitLooseFirst.roasBreakEven.toFixed(2)}x`,
      subValue: `ROAS Real: ${metrics.realRoas.toFixed(2)}x (Meta reporta ${metrics.reportedRoas.toFixed(2)}x)`,
      detail: metrics.realRoas < metrics.unitLooseFirst.roasBreakEven 
        ? `Déficit de ${(metrics.unitLooseFirst.roasBreakEven - metrics.realRoas).toFixed(2)}x en 1er pedido` 
        : 'Cubre costos en 1er pedido',
      icon: Target,
      highlight: metrics.realRoas < metrics.unitLooseFirst.roasBreakEven ? 'red' : 'green',
      badge: metrics.realRoas < metrics.unitLooseFirst.roasBreakEven ? 'Pierde en Adquisición' : 'Rentable en 1er Pedido'
    },
    {
      title: 'CAC REAL FULLY-LOADED',
      value: `$${metrics.cacReal.toFixed(2)}`,
      subValue: `Solo Anuncios: $${metrics.cacAds.toFixed(2)} | Fee: $${(metrics.cacReal - metrics.cacAds).toFixed(2)}`,
      detail: `Inversión total $${(params.metaSpend + params.agencyFee).toLocaleString()} / ${Math.round(metrics.metaCustomers)} clientes Meta`,
      icon: UserCheck,
      highlight: metrics.cacReal > 60 ? 'red' : 'blue',
      badge: metrics.cacReal > 60 ? 'CAC Elevado' : 'CAC Controlado'
    },
    {
      title: 'LTV A 12 MESES PROMEDIO',
      value: `$${metrics.ltvBlended.toFixed(2)}`,
      subValue: `Suelto: $${metrics.ltvLoose.toFixed(2)} | Sub: $${metrics.ltvSub.toFixed(2)}`,
      detail: `Mix ponderado: ${(100 - params.subscribersMix * 100).toFixed(0)}% sueltos / ${(params.subscribersMix * 100).toFixed(0)}% suscriptores`,
      icon: TrendingUp,
      highlight: 'green',
      badge: `Retención Churn ${(params.churnRate * 100).toFixed(0)}%`
    },
    {
      title: 'RATIO LTV:CAC REAL',
      value: `${metrics.ltvToCac.toFixed(2)}x`,
      subValue: `Genera $${metrics.ltvToCac.toFixed(2)} por cada $1 de CAC`,
      detail: `LTV Promedio $${metrics.ltvBlended.toFixed(2)} / CAC Real $${metrics.cacReal.toFixed(2)}`,
      icon: Flame,
      customClass: ltvCacColor,
      badgeNode: (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ltvCacBadge.bg}`}>
          {ltvCacBadge.text}
        </span>
      )
    },
    {
      title: 'PAYBACK EN CAJA',
      value: metrics.paybackMonth,
      subValue: metrics.paybackNumeric ? `Recupera CAC en Mes ${metrics.paybackNumeric}` : 'Déficit al Mes 12',
      detail: `Cruce acumulado con cero considerando retención y compras sueltas`,
      icon: Clock,
      highlight: metrics.paybackNumeric && metrics.paybackNumeric <= 10 ? 'green' : 'red',
      badge: metrics.paybackNumeric && metrics.paybackNumeric <= 10 ? 'Payback Ágil' : 'Riesgo de Iliquidez'
    },
    {
      title: 'CAC MARGINAL DE META',
      value: `$${metrics.marginalCac.toFixed(2)}`,
      subValue: `Costo por cliente adicional en este tramo`,
      detail: `Tramo actual de inversión: $${params.metaSpend.toLocaleString()}`,
      icon: DollarSign,
      highlight: metrics.marginalCac > metrics.ltvBlended ? 'red' : 'blue',
      badge: metrics.marginalCac > metrics.ltvBlended ? 'Destruye Margen Marginal' : 'Margen Sostenible'
    },
    {
      title: 'SALDO CAJA MES 3 (EMPRESA)',
      value: `$${metrics.companySimulation[2]?.bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subValue: `Piso de seguridad: $5.000 USD`,
      detail: metrics.companySimulation[2]?.perforatesFloor 
        ? '¡PISO INFRANQUEABLE PERFORADO!' 
        : 'Caja operativa segura (> $5k)',
      icon: DollarSign,
      highlight: metrics.companySimulation[2]?.perforatesFloor ? 'red' : 'green',
      badge: metrics.companySimulation[2]?.perforatesFloor ? 'Peligro Inminente' : 'Solvencia Garantizada'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const highlightBorder = 
          card.highlight === 'red' ? 'border-red-800/80 hover:border-red-600' :
          card.highlight === 'green' ? 'border-emerald-800/80 hover:border-emerald-600' :
          'border-aura-border hover:border-aura-copper';

        return (
          <div 
            key={idx}
            className={`aura-card aura-card-interactive p-4.5 border ${card.customClass || highlightBorder} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-aura-copper uppercase tracking-wider font-mono">
                  {card.title}
                </span>
                {card.badgeNode ? (
                  card.badgeNode
                ) : (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    card.highlight === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    card.highlight === 'green' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-aura-wood text-aura-gold border border-aura-copper/30'
                  }`}>
                    {card.badge}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-aura-cream font-mono tracking-tight">
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-aura-textMuted mt-1 font-medium">
                {card.subValue}
              </p>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-aura-border/70 text-[11px] text-aura-darkMuted flex items-center justify-between">
              <span className="truncate pr-2 text-aura-textMuted">{card.detail}</span>
              <Icon className="w-3.5 h-3.5 shrink-0 text-aura-gold/80" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
