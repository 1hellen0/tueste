# Tueste — Growth Sheet, Parte 2

## Loop de adquisición

Comprador recibe una invitación → visita el programa → comparte el enlace personal por WhatsApp → un amigo llega a la tienda → compra por el checkout simulado → recibe $8 de descuento → el invitador obtiene $8 de crédito local y una muestra → el nuevo comprador puede convertirse en invitador tras la doble confirmación de entrega.

Todos los eventos y compras de la aplicación son **simulados**. El botón de WhatsApp abre un mensaje precompuesto; no confirma que se envió.

## Embudo, cuello de botella y meta

Datos originales del caso: 1.000 compradores contactados, 350 aperturas (35%), 120 visitas al programa (34,3% de quienes abrieron; 12% de contactados), 100 invitadores (83,3% de visitantes), 300 invitaciones (3 por invitador), 150 visitas de amigos (50% de invitaciones) y 60 compras (40% de visitas; 20% de invitaciones). La mayor pérdida absoluta está antes de visitar el programa: solo 120 de 1.000 contactados llegan a esa etapa.

Meta a 90 días: aumentar el descubrimiento de 12% a 35%. **Estimación condicionada:** manteniendo las tasas del caso posteriores al descubrimiento, cada visitante del programa produce 0,5 compras referidas (100/120 invitadores × 3 invitaciones × 150/300 visitas de amigos × 60/150 compras = 0,5). Así, 12 visitantes por cada 100 compradores producen 6 compras; 35 visitantes producirían 17,5 compras referidas por cada 100 compradores. No es un resultado medido.

## North-star semanal

**Compras referidas válidas y aprobadas por cada 100 compradores invitados con una ventana completa de siete días.** Numerador: pedidos referidos aprobados en los siete días; denominador: compradores con invitación dentro de la ventana comparable. El panel calcula una métrica local equivalente solo con eventos de demostración disponibles; no es una medición de campaña ni evidencia estadística.

## Canales para 90 días

| Periodo | Canal / superficie | Acción propuesta | Lectura |
|---|---|---|---|
| Días 1–30 | Sitio ROASTIFY | Hacer visible el programa después de la confirmación de entrega y desde navegación móvil. | Visitas / compradores invitados. |
| Días 1–30 | WhatsApp | Mensaje precompuesto para compartir enlace personal. | Clic de compartir; no asumir envío. |
| Días 1–30 | Meta Ads | Mantenerlo como canal de referencia pagada y comparar adquisición referida con CAC de referencia de $50. No se configura pauta desde el prototipo. | Clientes nuevos y costo por cliente, fuera de la analítica simulada. |
| Días 31–60 | Seguimiento postcompra | Probar las invitaciones informativas A/B. | Visita al programa por comprador invitado; ventanas completas. |
| Días 61–90 | Optimización móvil | Priorizar los pasos con mayor abandono y comprobar el costo individual de los premios. | Conversión, acción de invitación y costos por referido. |

No se asignan presupuestos ni resultados de canal que no fueron proporcionados.

## Experimento A/B

- **A:** invitación informativa simulada un día después de la compra.
- **B:** invitación simulada después de la doble confirmación.
- Asignación aleatoria 50/50 persistente por comprador; ventana de siete días desde la invitación.
- Métrica principal: compradores que visitan el programa / compradores invitados con ventana completa.
- Contramétrica principal: visitantes con al menos una acción de invitación / visitantes con ventana de medición completa. Vigilar que el crecimiento de visitas no ocurra a costa de menos invitaciones compartidas.
- Contramétricas adicionales: bajas simuladas, costos comprometidos e incurridos, duplicados/autorreferidos e incidencias de checkout.
- Ninguna variante habilita un enlace personal antes de la doble confirmación. Datos locales no permiten afirmar significancia estadística.

## Costos de recompensa por referido válido

CAC de referencia Parte 2: ($4.000 Meta Ads + $1.000 agencia) / 100 clientes = **$50**. Tope atribuible: **$25 por referido individual**.

| Concepto | Costo de referencia |
|---|---:|
| Descuento para el amigo | $8,00 |
| Crédito local al invitador | $8,00 |
| Muestra de 100 g | $1,60 |
| Bolsa de 340 g en el hito | $5,44 |
| Total normal (descuento + crédito + muestra) | **$17,60** |
| Referido que desbloquea bolsa (total individual) | **$23,04** |

El costo se reserva al conceder la recompensa; se separan costos comprometidos, incurridos y recuperados. La bolsa se atribuye completamente al tercer (o sexto, noveno, etc.) referido que desbloquea ese hito. Los costos de referencia no se consideran inclusivos de envíos separados: el premio queda pendiente hasta que un administrador confirme en el pedido que viajará sin costo incremental. El mes gratis se excluye; su impacto de $47,18 excede el tope.

## Ejemplo documentado de error de IA y corrección

La bitácora del proyecto documenta errores reales de IA de la Parte 1. Un ejemplo: se había presentado el payback como “Mes 9” mediante texto estático, aunque la caja acumulada seguía negativa en los meses 9, 10 y 11 y cruzaba a positivo por primera vez en el mes 12. Se corrigió conciliando el resultado con la curva de caja y usando el mes de cruce real. Fuente: `BITACORA_DESARROLLO.md`, sección “Documentación Exhaustiva de Errores Reales de IA Observados”.

Separadamente, durante las pruebas de Parte 2 se detectó y corrigió un doble registro del costo de la muestra. Es un defecto encontrado durante la implementación; no se atribuye a IA.
