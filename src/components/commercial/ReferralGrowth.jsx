import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Gift, RotateCcw, PackageCheck } from 'lucide-react';
import {
  ensureReferralDemoScenario,
  getOriginalCaseFunnel,
  getReferralDashboardMetrics,
  getRewardInventory,
  resetReferralDemoScenario,
  setReferralDemoInventory
} from '../../services/referralProgram';

const CAC = 50;

export default function ReferralGrowth() {
  const [metrics, setMetrics] = useState(null);
  const [inventory, setInventory] = useState({ sample: { onHand: 0, reserved: 0, shipped: 0 }, bag: { onHand: 0, reserved: 0, shipped: 0 } });
  const [sample, setSample] = useState(0);
  const [bag, setBag] = useState(0);
  const [feedback, setFeedback] = useState('');

  const refresh = () => {
    setMetrics(getReferralDashboardMetrics());
    const current = getRewardInventory();
    setInventory(current);
    setSample(current.sample.onHand);
    setBag(current.bag.onHand);
  };

  useEffect(() => {
    ensureReferralDemoScenario();
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener('tueste:referrals-updated', handleUpdate);
    return () => window.removeEventListener('tueste:referrals-updated', handleUpdate);
  }, []);

  const saveInventory = () => {
    const result = setReferralDemoInventory({ sample, bag });
    setFeedback(result.success ? 'Existencias de demostración guardadas; inventario comercial sin cambios.' : result.error);
    refresh();
  };

  const reset = () => {
    resetReferralDemoScenario();
    refresh();
    setFeedback('Se reinició únicamente el almacenamiento de referidos. Pedidos, clientes, productos e inventario comercial no se modificaron.');
  };

  const funnel = getOriginalCaseFunnel();
  const stageRates = [null, 35, (120 / 350) * 100, (100 / 120) * 100, null, 50, 40];

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-bold text-xl text-aura-cream flex items-center gap-2"><BarChart3 className="w-5 h-5 text-aura-gold" /> Growth / Referidos</h2>
          <p className="text-xs text-aura-beige mt-1">Módulo de Parte 2 · eventos y costos locales claramente simulados.</p>
        </div>
        <button onClick={reset} className="px-3 py-2 rounded-lg border border-aura-border text-xs text-aura-cream hover:border-aura-gold flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reiniciar demo de referidos</button>
      </header>

      <div className="p-4 rounded-xl border border-aura-gold/40 bg-aura-surface text-xs text-aura-beige">
        CAC de referencia Parte 2: <strong className="text-aura-gold">($4.000 + $1.000) / 100 = ${CAC}</strong>. Tope de recompensas atribuibles: <strong className="text-aura-gold">$25 por amigo comprador</strong>. El mes gratis no forma parte del programa automático.
      </div>

      <section className="space-y-3">
        <h3 className="font-serif font-bold text-aura-cream">Embudo histórico del caso <span className="text-[10px] uppercase text-aura-gold">(datos oficiales; no son eventos de la demo)</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {funnel.map((item, index) => (
            <div key={item.label} className="p-4 rounded-xl aura-card border border-aura-border">
              <p className="text-[11px] text-aura-beige">{item.label}</p>
              <p className="font-mono font-black text-2xl text-aura-gold">{item.value.toLocaleString()}</p>
              {stageRates[index] != null && <p className="text-[10px] text-aura-beige mt-1">{stageRates[index].toFixed(1)}% de la etapa previa</p>}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-aura-beige">Meta: descubrimiento del programa 12% → 35%; con tasas posteriores constantes, 6 → aproximadamente 17,5 compras referidas por cada 100 compradores.</p>
      </section>

      <section className="space-y-3">
        <h3 className="font-serif font-bold text-aura-cream flex items-center gap-2"><Users className="w-4 h-4 text-aura-gold" /> Eventos de demostración</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          <GrowthMetric label="Compras referidas válidas" value={metrics.approvedPurchases} />
          <GrowthMetric label="North-star · compras / 100 invitados (7d)" value={metrics.weeklyNorthStarPer100 == null ? 'Sin ventana' : metrics.weeklyNorthStarPer100.toFixed(1)} />
          <GrowthMetric label="Costos comprometidos" value={`$${metrics.rewardsCommitted.toFixed(2)}`} />
          <GrowthMetric label="Costos incurridos" value={`$${metrics.rewardsIncurred.toFixed(2)}`} />
          <GrowthMetric label="Costos recuperados" value={`$${metrics.rewardsRecovered.toFixed(2)}`} />
          <GrowthMetric label="Premios físicos pendientes" value={metrics.pendingPhysical} />
          <GrowthMetric label="Recompensas bloqueadas" value={metrics.blockedRewards} />
        </div>
      </section>

      <section className="p-4 rounded-xl aura-card border border-aura-border space-y-4">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-aura-gold" />
          <h3 className="font-serif font-bold text-aura-cream">Inventario de premios de demostración</h3>
        </div>
        <p className="text-[11px] text-aura-beige">Existencia inicial configurada en cero. Este inventario está separado del catálogo comercial; al asignar un premio se reserva, al marcar el pedido como enviado se consume. Configura existencias totales ficticias para la demostración.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <InventoryField label={`Muestras 100 g · disponible ${Math.max(0, inventory.sample.onHand - inventory.sample.reserved - inventory.sample.shipped)} · reservado ${inventory.sample.reserved} · enviado ${inventory.sample.shipped}`} value={sample} onChange={setSample} />
          <InventoryField label={`Bolsas 340 g · disponible ${Math.max(0, inventory.bag.onHand - inventory.bag.reserved - inventory.bag.shipped)} · reservado ${inventory.bag.reserved} · enviado ${inventory.bag.shipped}`} value={bag} onChange={setBag} />
        </div>
        <button onClick={saveInventory} className="rounded-lg bg-aura-wood px-4 py-2 text-xs font-bold text-aura-gold">Guardar existencias simuladas</button>
      </section>

      <section className="p-4 rounded-xl aura-card border border-aura-border">
        <h3 className="font-serif font-bold text-aura-cream">Experimento A/B · ventanas de 7 días completas</h3>
        <p className="text-[11px] text-aura-beige mt-1">A: invitación informativa simulada al día siguiente. B: invitación tras doble confirmación. Ninguna variante habilita enlace antes de la activación. Datos locales; no se infiere significancia estadística.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {metrics.variants.map(item => (
            <div key={item.variantId} className="p-3 rounded-lg bg-aura-surface border border-aura-border text-xs">
              <strong className="text-aura-gold">Variante {item.variantId}</strong>
              <p className="mt-2 text-aura-beige">Invitaciones con ventana completa: {item.completeWindows}</p>
              <p className="text-aura-beige">Visitaron el programa: {item.visits}</p>
              <p className="text-aura-beige">Descubrimiento: {item.discoveryRate == null ? 'Aún sin ventanas completas' : `${(item.discoveryRate * 100).toFixed(1)}%`}</p>
              <p className="text-aura-beige">Acción de invitación / visitantes: {item.actionRate == null ? 'Sin datos' : `${(item.actionRate * 100).toFixed(1)}%`}</p>
            </div>
          ))}
        </div>
      </section>

      {feedback && <p role="status" className="text-xs text-aura-gold">{feedback}</p>}
    </div>
  );
}

function GrowthMetric({ label, value }) {
  return <div className="p-3 rounded-xl aura-card border border-aura-border"><p className="text-[10px] text-aura-beige">{label}</p><p className="font-mono font-bold text-lg text-aura-gold mt-1">{value}</p></div>;
}

function InventoryField({ label, value, onChange }) {
  return <label className="text-[11px] text-aura-beige">Existencias totales · {label}<input type="number" min="0" step="1" value={value} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded-lg bg-aura-surface border border-aura-border px-3 py-2 text-aura-cream" /></label>;
}
