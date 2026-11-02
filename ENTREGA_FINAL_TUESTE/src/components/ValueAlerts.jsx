import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';

export default function ValueAlerts({ metrics, currentScenario, params }) {
  const isFloorBreached = metrics.companySimulation?.[2]?.perforatesFloor;
  const isBankruptM4 = metrics.companySimulation?.[3]?.isBankrupt;
  const roasDeficit = metrics.unitLooseFirst.roasBreakEven - metrics.realRoas;

  return (
    <div className="space-y-3">
      {/* Alerta de Destrucción de Caja / LTV:CAC < 1x */}
      {metrics.isDanger && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 flex items-start gap-3.5 shadow-lg shadow-red-950/50">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-red-100 flex items-center gap-2">
              <span>ALERTA CRÍTICA: DESTRUCCIÓN NETA DE CAJA (LTV:CAC = {metrics.ltvToCac.toFixed(2)}x &lt; 1,0x)</span>
              <span className="px-1.5 py-0.2 rounded bg-red-900/80 text-[10px] uppercase font-mono tracking-wider">Quemador de Caja</span>
            </div>
            <p className="text-red-200/90 leading-relaxed">
              Cada cliente captado con esta configuración cuesta más de lo que genera en 12 meses (LTV ${metrics.ltvBlended.toFixed(2)} vs CAC Real ${metrics.cacReal.toFixed(2)}). Escalar la inversión en estas condiciones acelera la iliquidez.
            </p>
          </div>
        </div>
      )}

      {/* Alerta de Perforación de Piso Bancario ($5.000) */}
      {isFloorBreached && (
        <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-800/80 text-amber-200 flex items-start gap-3.5 shadow-md">
          <DollarSign className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-amber-100 flex items-center gap-2">
              <span>ALERTA DE TESORERÍA: PISO DE SEGURIDAD PERFORADO EN EL MES 3</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-900/80 text-[10px] uppercase font-mono tracking-wider">Saldo &lt; $5.000</span>
            </div>
            <p className="text-amber-200/90 leading-relaxed">
              La simulación de liquidez de la empresa demuestra que en el <strong>Mes 3 el saldo bancario cae a ${metrics.companySimulation[2].bankBalance.toFixed(2)} USD</strong> (por debajo del piso infranqueable de $5.000)
              {isBankruptM4 && ` y en el Mes 4 entra en saldo negativo (-$${Math.abs(metrics.companySimulation[3].bankBalance).toFixed(2)} USD)`}.
              Queda imposibilitada la compra de la tostadora de $14.000.
            </p>
          </div>
        </div>
      )}

      {/* Alerta de la Trampa del ROAS (Meta vs Real) */}
      {metrics.realRoas < metrics.unitLooseFirst.roasBreakEven && (
        <div className="p-3.5 rounded-xl bg-forest-900/80 border border-forest-700/80 text-cream-200 flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-cream-100 flex items-center gap-2">
              <span>LA TRAMPA DE META AL DESCUBIERTO: ROAS REAL ({metrics.realRoas.toFixed(2)}x) vs ROAS DE EQUILIBRIO ({metrics.unitLooseFirst.roasBreakEven.toFixed(2)}x)</span>
            </div>
            <p className="text-cream-300 leading-relaxed">
              Meta Ads Manager reporta un ROAS de <strong>{metrics.reportedRoas.toFixed(2)}x</strong> atribuyéndose ventas de retargeting de clientes antiguos (153 compras) y visitas de 1 día. En realidad, los clientes nuevos reales generan un ROAS de adquisición de solo <strong>{metrics.realRoas.toFixed(2)}x</strong>. Se pierden {(roasDeficit * 100 / metrics.unitLooseFirst.roasBreakEven).toFixed(0)}% por cada dólar en el primer pedido.
            </p>
          </div>
        </div>
      )}

      {/* Banner de Éxito cuando el modelo es saludable */}
      {metrics.isHealthy && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-emerald-100">
              MODELO DE ALTA SALUD FINANCIERA (LTV:CAC = {metrics.ltvToCac.toFixed(2)}x ≥ 3,0x)
            </div>
            <p className="text-emerald-200/90 leading-relaxed">
              La relación entre el valor de vida del cliente y el costo de adquisición supera el umbral de los mejores benchmarks de la industria. El negocio puede reinvertir margen con seguridad.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
