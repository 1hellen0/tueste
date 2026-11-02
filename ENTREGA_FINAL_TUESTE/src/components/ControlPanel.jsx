import React from 'react';
import { Sliders, ToggleLeft, ToggleRight, DollarSign, Percent, Package, Truck, Users } from 'lucide-react';

export default function ControlPanel({ params, onChangeParam }) {
  return (
    <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between pb-4 border-b border-forest-800 mb-5">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-gold-400" />
          <div>
            <h3 className="font-bold text-cream-100 text-sm">Controles Dinámicos del Modelo</h3>
            <p className="text-xs text-cream-400">Modifica supuestos clave para proyectar impacto en tiempo real</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Bloque 1: Adquisición & Marketing */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cream-300 uppercase tracking-wider pb-1 border-b border-forest-800/60">
            <DollarSign className="w-3.5 h-3.5 text-gold-400" />
            <span>Adquisición & Marketing</span>
          </div>

          {/* Inversión en Meta */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Inversión Meta Ads</span>
              <span className="font-bold text-gold-400 font-mono">${params.metaSpend.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={params.metaSpend}
              onChange={(e) => onChangeParam('metaSpend', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-cream-400/80 mt-1">
              <span>$0</span>
              <span>$4k</span>
              <span>$8k (Hoy)</span>
              <span>$16k (Ag.)</span>
              <span>$20k</span>
            </div>
          </div>

          {/* Fee Agencia */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Fee Mensual Agencia</span>
              <span className="font-bold text-cream-100 font-mono">${params.agencyFee.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="0"
              max="2500"
              step="100"
              value={params.agencyFee}
              onChange={(e) => onChangeParam('agencyFee', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
          </div>

          {/* Descuento Primer Pedido */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Descuento 1er Pedido</span>
              <span className={`font-bold font-mono ${params.firstOrderDiscount > 0 ? 'text-red-400' : 'text-cream-100'}`}>
                {(params.firstOrderDiscount * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.40"
              step="0.05"
              value={params.firstOrderDiscount}
              onChange={(e) => onChangeParam('firstOrderDiscount', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-cream-400/80 mt-1">
              <span>0% (Base)</span>
              <span>15%</span>
              <span>30% (Agencia)</span>
            </div>
          </div>
        </div>

        {/* Bloque 2: Precios & Costos del Café */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cream-300 uppercase tracking-wider pb-1 border-b border-forest-800/60">
            <Package className="w-3.5 h-3.5 text-gold-400" />
            <span>Precios & Costos Café</span>
          </div>

          {/* Precio Bolsa */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Precio Bolsa (340g)</span>
              <span className="font-bold text-cream-100 font-mono">${params.pricePerBag.toFixed(2)} USD</span>
            </div>
            <input
              type="range"
              min="12"
              max="25"
              step="0.50"
              value={params.pricePerBag}
              onChange={(e) => onChangeParam('pricePerBag', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
          </div>

          {/* Costo Café por Bolsa */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Costo Café por Bolsa</span>
              <span className="font-bold text-cream-100 font-mono">${params.coffeeCostPerBag.toFixed(2)} USD</span>
            </div>
            <input
              type="range"
              min="3.50"
              max="8.00"
              step="0.10"
              value={params.coffeeCostPerBag}
              onChange={(e) => onChangeParam('coffeeCostPerBag', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
          </div>

          {/* Costo Envío Logística */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Costo de Envío</span>
              <span className="font-bold text-cream-100 font-mono">${params.shippingCost.toFixed(2)} USD</span>
            </div>
            <input
              type="range"
              min="2.50"
              max="7.00"
              step="0.25"
              value={params.shippingCost}
              onChange={(e) => onChangeParam('shippingCost', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
          </div>
        </div>

        {/* Bloque 3: Retención & Suscripciones */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cream-300 uppercase tracking-wider pb-1 border-b border-forest-800/60">
            <Users className="w-3.5 h-3.5 text-gold-400" />
            <span>Comportamiento de Clientes</span>
          </div>

          {/* Mix Suscriptores */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Mix Suscriptores</span>
              <span className="font-bold text-gold-400 font-mono">{(params.subscribersMix * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.01"
              value={params.subscribersMix}
              onChange={(e) => onChangeParam('subscribersMix', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-cream-400/80 mt-1">
              <span>15% (Oficial)</span>
              <span>20% (Hipótesis)</span>
              <span>30%</span>
            </div>
          </div>

          {/* Churn Rate */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Cancelación Mensual (Churn)</span>
              <span className="font-bold text-cream-100 font-mono">{(params.churnRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.03"
              max="0.20"
              step="0.01"
              value={params.churnRate}
              onChange={(e) => onChangeParam('churnRate', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-cream-400/80 mt-1">
              <span>Vida media: {(1 / params.churnRate).toFixed(1)} meses</span>
            </div>
          </div>

          {/* Pedidos Anuales Sueltos */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-cream-200">Pedidos Sueltos en 12m</span>
              <span className="font-bold text-cream-100 font-mono">{params.annualLooseOrders.toFixed(1)} pedidos</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.5"
              value={params.annualLooseOrders}
              onChange={(e) => onChangeParam('annualLooseOrders', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-forest-950 rounded-lg"
            />
          </div>
        </div>

        {/* Bloque 4: Políticas de Oferta de Diego */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cream-300 uppercase tracking-wider pb-1 border-b border-forest-800/60">
            <Truck className="w-3.5 h-3.5 text-gold-400" />
            <span>Políticas de Envío & Pack</span>
          </div>

          {/* Toggle Envío Gratis condicionado */}
          <div className="p-3 rounded-xl bg-forest-950/60 border border-forest-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-cream-100">Umbral Envío Gratis ($45)</span>
              <button
                type="button"
                onClick={() => onChangeParam('shippingThresholdPolicy', !params.shippingThresholdPolicy)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  params.shippingThresholdPolicy ? 'bg-gold-500' : 'bg-forest-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-forest-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                    params.shippingThresholdPolicy ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-cream-400 leading-tight">
              {params.shippingThresholdPolicy 
                ? 'Activo: Compras < $45 pagan $4,50 de envío (Eleva CM2 a $20,19)' 
                : 'Inactivo: Envío gratis en todas las órdenes (CM2 $15,89)'}
            </p>
          </div>

          {/* Toggle Pack 3 bolsas */}
          <div className="p-3 rounded-xl bg-forest-950/60 border border-forest-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-cream-100">Pack 3 Bolsas ($48 USD)</span>
              <button
                type="button"
                onClick={() => onChangeParam('pack3BagsActive', !params.pack3BagsActive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  params.pack3BagsActive ? 'bg-emerald-500' : 'bg-forest-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-forest-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                    params.pack3BagsActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-cream-400 leading-tight">
              {params.pack3BagsActive 
                ? 'Habilitado: Supera el umbral ($48 > $45), envío gratis incluido (CM2 $23,62)' 
                : 'Deshabilitado: Solo pedidos habituales de 2 bolsas'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
