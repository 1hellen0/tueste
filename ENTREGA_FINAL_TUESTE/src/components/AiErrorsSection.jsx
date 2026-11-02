import React from 'react';
import { AlertTriangle, Bug, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AiErrorsSection() {
  const errors = [
    {
      id: 1,
      title: 'Fórmulas referenciando texto en hoja Supuestos',
      code: 'Supuestos!C8 = "=B6*B7" y C10 = "=B8*(1-B9)"',
      consequence: 'Generó error "#¡VALOR!" en Excel y Google Sheets al intentar multiplicar texto con números.',
      cause: 'Desplazamiento de índice de columnas en el generador de fórmulas, apuntando a la columna B (etiquetas descriptivas) en lugar de la columna C (valores numéricos).',
      correction: 'Se corrigió a "=C6*C7" y "=C8*(1-C9)", restaurando la cascada dinámica.'
    },
    {
      id: 2,
      title: 'Suma de magnitudes incompatibles (Dólares con Personas)',
      code: 'Escenarios!C10 = "=C7+C8"',
      consequence: 'Arrojó un total absurdo de 8.165 clientes mensuales al sumar $8.000 USD de inversión con 165 clientes.',
      cause: 'Desalineación en el mapeo de filas de la tabla de escenarios entre la fila de gasto en anuncios y la fila de clientes orgánicos.',
      correction: 'Se corrigió a "=C8+C9", sumando 165 clientes de Meta con 47 clientes orgánicos fijos para un total exacto de 212 clientes.'
    },
    {
      id: 3,
      title: 'Hardcoding de Payback como "Mes 9" desconectado de la curva acumulada',
      code: 'Resultados!F28 = "Mes 9" y Escenarios!C28 = "Mes 9"',
      consequence: 'Reportó un retorno de inversión en el mes 9 cuando la caja acumulada real en dicho mes era de -$9,40 USD.',
      cause: 'Uso de división lineal simplista de contribución ($54,90 / 12 = $4,575/mes) e ignorar que en los meses 8, 9 y 10 la recompra cae a 0,15 pedidos/mes. Solo en el Mes 12 se cruza el cero con +$0,25 USD.',
      correction: 'Se recalculó mes a mes la curva de caja y se actualizó a "Mes 12 (+$0,25)". Para el cliente suelto puro, se asignó "No recupera en 12m" (LTV $47,67 < CAC $54,55).'
    },
    {
      id: 4,
      title: 'Referencia a celda de mes único para LTV de suscriptores',
      code: 'Resultados!F22 = "=\'Curva de caja\'!E15"',
      consequence: 'Subestimó el LTV del suscriptor a la contribución de un solo mes ($3,01) en lugar del valor acumulado en 12 meses.',
      cause: 'Selección estática de una fila aislada en la hoja de Curva de caja en lugar de aplicar la sumatoria de retención compuesta.',
      correction: 'Se aplicó la fórmula analítica de serie geométrica con retención mensual "=D15*(1-(1-Supuestos!C24)^12)/Supuestos!C24", arrojando con precisión $95,84 USD.'
    }
  ];

  return (
    <div className="bg-forest-900/80 rounded-2xl border border-forest-800 p-5 shadow-sm backdrop-blur space-y-5">
      <div className="pb-4 border-b border-forest-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-cream-100 text-base">Sección Obligatoria: «En qué se equivocó o nos confundió la IA»</h3>
          </div>
          <p className="text-xs text-cream-400 mt-0.5">
            Registro estricto y transparente de los 4 errores de código y modelado financiero realmente observados durante el desarrollo
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          4 Errores Reales Documentados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {errors.map((err) => (
          <div key={err.id} className="p-4 rounded-xl bg-forest-950/70 border border-forest-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-sm text-cream-100 flex items-center gap-2">
                <Bug className="w-4 h-4 text-red-400 shrink-0" />
                <span>Error Real #{err.id}: {err.title}</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-forest-900/90 p-2.5 rounded-lg border border-forest-800/80 font-mono text-[11px] text-red-300">
                <span className="text-cream-400 block text-[10px] uppercase font-sans font-semibold mb-0.5">Código Erróneo:</span>
                {err.code}
              </div>

              <div>
                <span className="text-cream-400 font-semibold block text-[11px]">Consecuencia:</span>
                <p className="text-cream-300 mt-0.5">{err.consequence}</p>
              </div>

              <div>
                <span className="text-cream-400 font-semibold block text-[11px]">Causa Técnica / Conceptual:</span>
                <p className="text-cream-300/90 mt-0.5">{err.cause}</p>
              </div>

              <div className="pt-2 border-t border-forest-800 flex items-start gap-1.5 text-emerald-300">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span><strong>Corrección Validada:</strong> {err.correction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
