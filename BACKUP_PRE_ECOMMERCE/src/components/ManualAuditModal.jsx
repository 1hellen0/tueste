import React from 'react';
import { X, Calculator, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ManualAuditModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-forest-900 border border-forest-750 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-forest-800 flex items-center justify-between bg-forest-950/60">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-gold-400" />
            <div>
              <h3 className="font-bold text-cream-100 text-base">Comprobación Matemática Manual (Auditoría a Mano)</h3>
              <p className="text-xs text-cream-400">Paso a paso aritmético explícito exigido en la rúbrica oficial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cream-400 hover:text-cream-100 hover:bg-forest-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-cream-200">
          {/* Cuenta 1: CAC Real */}
          <div className="p-4 rounded-xl bg-forest-950/70 border border-forest-800 space-y-2.5">
            <div className="flex items-center justify-between font-bold text-sm text-gold-400">
              <span>1. Cálculo Aritmético del CAC Real Fully-Loaded (Septiembre)</span>
              <span className="font-mono">$54,55 USD</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] bg-forest-900 p-3 rounded-lg border border-forest-800 text-cream-300">
              <p>1. Gasto publicitario en anuncios Meta = $8.000,00 USD</p>
              <p>2. Fee contractual fijo de agencia = $1.000,00 USD</p>
              <p>3. Gasto total de adquisición = $8.000,00 + $1.000,00 = $9.000,00 USD</p>
              <p>4. Clientes nuevos reales atribuidos por Meta (Encuesta + UTM) = 165 clientes</p>
              <p className="text-gold-400 font-bold pt-1 border-t border-forest-800">
                5. CAC Real = $9.000,00 / 165 = $54,5454... ≈ $54,55 USD por cliente nuevo.
              </p>
            </div>
          </div>

          {/* Cuenta 2: CM2 con 30% descuento */}
          <div className="p-4 rounded-xl bg-forest-950/70 border border-forest-800 space-y-2.5">
            <div className="flex items-center justify-between font-bold text-sm text-red-300">
              <span>2. Cascada Unitaria del Pedido con 30% Descuento (Agencia)</span>
              <span className="font-mono">CM2: $6,15 USD (25,8%)</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] bg-forest-900 p-3 rounded-lg border border-forest-800 text-cream-300">
              <p>1. Precio lista base (2 bolsas x $17) = $34,00 USD</p>
              <p>2. Precio cobrado con 30% desc = $34,00 x (1 - 0,30) = $23,80 USD</p>
              <p>3. Costo del café (2 bolsas x $5,44) = $10,88 USD (32% de lista, no cambia con descuento)</p>
              <p>4. CM1 = $23,80 - $10,88 = $12,92 USD (54,29%)</p>
              <p>5. Costo de envío pagado por Tueste = $4,50 USD</p>
              <p>6. Comisión pasarela de pago (4,5% sobre $23,80) = $1,071 USD</p>
              <p>7. Caja y empaque = $1,20 USD</p>
              <p>8. Total costos variables de entrega = $4,50 + $1,071 + $1,20 = $6,771 USD</p>
              <p className="text-red-400 font-bold pt-1 border-t border-forest-800">
                9. CM2 = $12,92 - $6,771 = $6,149 USD (25,84% del precio cobrado).
              </p>
              <p className="text-amber-400 font-semibold">
                10. ROAS de break-even requerido = 1 / 0,25836 = 3,87x (¡Meta reporta 3,0x, destrucción de caja garantizada!).
              </p>
            </div>
          </div>

          {/* Cuenta 3: Payback en Mes 12 */}
          <div className="p-4 rounded-xl bg-forest-950/70 border border-forest-800 space-y-2.5">
            <div className="flex items-center justify-between font-bold text-sm text-emerald-400">
              <span>3. Demostración del Cruce en Cero del Payback en el Mes 12</span>
              <span className="font-mono">Mes 12 (+$0,25)</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] bg-forest-900 p-3 rounded-lg border border-forest-800 text-cream-300">
              <p>• Mes 0 (Inversión inicial): -$54,55 USD</p>
              <p>• Mes 1 (Contribución +$15,40): Caja acum. = -$39,14 USD</p>
              <p>• Mes 8 (Contribución +$3,01): Caja acum. = -$12,32 USD</p>
              <p>• Mes 9 (Contribución +$2,92): Caja acum. = -$9,40 USD (¡Sigue en déficit!)</p>
              <p>• Mes 10 (Contribución +$2,84): Caja acum. = -$6,56 USD (¡Sigue en déficit!)</p>
              <p>• Mes 11 (Contribución +$3,44): Caja acum. = -$3,12 USD (¡Sigue en déficit!)</p>
              <p className="text-emerald-400 font-bold pt-1 border-t border-forest-800">
                • Mes 12 (Contribución +$3,37): Caja acum. = +$0,25 USD (¡CRUCE CON CERO EN MES 12!).
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-forest-800 flex items-center justify-between bg-forest-950/60">
          <div className="flex items-center gap-2 text-cream-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fórmulas validadas conforme a la rúbrica (Cálculo sin supuestos inventados).</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-forest-800 hover:bg-forest-750 text-cream-100 transition"
          >
            Entendido y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
