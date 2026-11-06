# Documentación técnica — Tueste Parte 2

## Alcance e integración

Parte 2 se integra a la SPA React/Vite existente. La tienda ROASTIFY incorpora una sección móvil de invitaciones, confirmación local de entrega y panel personal. AURA ROAST incorpora **Growth / Referidos** y una acción explícita en el detalle del pedido para verificar que un premio físico se incluirá sin logística o preparación incremental.

La lógica se encuentra aislada en `src/services/referralProgram.js` bajo la clave versionada `tueste_referrals_v1`. La clave es independiente de `tueste_store_products`, `tueste_store_cart`, `tueste_store_orders` y `tueste_store_customers`. El botón de reinicio actúa solo sobre datos de referidos y vuelve a crear su participante ficticio; no invoca `resetToDemoDefaults()`.

El checkout existente conserva productos e inventario comercial. Para un enlace válido aplica un descuento local de $8 a la primera compra con subtotal original mínimo de $17; el envío gratis de ese pedido se decide con subtotal original desde $60. Un pedido normal conserva las reglas existentes. El crédito del invitador se resta solo del subtotal, no del envío, y no se combina con descuento de referido. Las renovaciones de suscripción no existen en el simulador actual: solo se puede demostrar el pedido inicial.

## Activación y atribución

Un pedido debe ser `CONFIRMED`, marcado `DELIVERED` por administración y tener confirmación del cliente asociada al mismo `orderId`. Las confirmaciones se admiten en cualquier orden; la activación tiene clave idempotente por pedido. El cliente se vincula por correo normalizado con el directorio existente. Esto **no es autenticación** ni verificación de identidad.

El enlace transporta un token local. Una visita válida guarda la última atribución por 30 días; una visita posterior válida renueva el plazo. Se atribuye una compra aprobada al último enlace guardado antes de la primera compra elegible. El correo de pedido se usa para limitar una compra inicial y autorreferidos simples. El almacenamiento es manipulable y no sincroniza pestañas/dispositivos de forma confiable como lo haría un backend.

## Recompensas, costos e inventario

Cada compra referida aprobada concede $8 de crédito local y una muestra de 100 g. En cada hito 3/6/9/etc. se concede una bolsa de 340 g. Los premios físicos comienzan pendientes; se asignan a un pedido aprobado futuro del invitador solo después de que administración confirme en ese pedido que no existe costo incremental de logística o preparación. No caducan automáticamente.

El inventario de premios reside únicamente en el estado de Parte 2 y comienza en cero. Se puede ajustar como existencias **ficticias**; una asignación reserva, el envío consume una unidad y la cancelación antes del envío libera la reserva. El límite de costo se evalúa por compra referida individual: descuento $8 + crédito $8 + muestra $1,60 = $17,60; el referido de hito agrega $5,44 para un total de $23,04. La reserva se cuenta como costo comprometido desde que se concede. El mes gratis se excluye.

El estado mantiene costos comprometidos, incurridos y recuperados por separado. La cancelación de un pedido referido anula recompensas no enviadas, libera reservas, recalcula hitos y genera ajuste pendiente si el crédito ya se utilizó. El ajuste no reduce el saldo disponible a negativo y solo se registra como recuperado cuando créditos futuros efectivamente lo compensan. Los premios enviados/entregados conservan historial.

## Eventos y experimento A/B

Se registran eventos locales de visita, clic de compartir, compra aprobada, recompensa, costo y asignación. El aviso al invitador es emergente y temporal; no se persiste un historial de notificaciones. Abrir WhatsApp no equivale a enviar.

La asignación 50/50 es aleatoria y persistente por comprador. A programa invitación informativa simulada un día después de la compra; B la registra tras doble confirmación. Ninguna variante crea enlace antes de activar el programa. La visita se cuenta en la ventana de siete días; el panel compara solo ventanas completas. Los resultados son datos de demostración, sin afirmaciones de validez estadística.

El embudo histórico fijo se muestra separado de los eventos del prototipo. Las aperturas de correo son datos del caso y no se generan ni se afirman como aperturas reales.

## Recorrido de demostración

Growth crea un invitador ficticio `invitador.demo@tueste.test` con enlace `?ref=tueste-demo`. Es un participante del estado aislado de Parte 2, no un cliente o pedido comercial. Se puede reiniciar desde Growth sin restablecer datos comerciales. Para demostrar doble confirmación con un comprador, completar un pedido simulado, marcarlo entregado en administración y confirmar recepción desde la sección pública con el correo del pedido.

La asignación de premios debe verificarse desde el detalle de un pedido futuro del invitador; si el inventario de premios está en cero, los premios se mantienen pendientes. Todo el recorrido debe hacerse en el mismo navegador y origen.

## Limitaciones conocidas

- Sin backend, autenticación, verificación de correo, protección contra manipulación ni transacciones concurrentes.
- No existe renovación automática de suscripciones, integración de correo, envío real de WhatsApp ni notificaciones entre dispositivos.
- Los pedidos guardan datos de cliente, no `customerId`; el enlace con participantes se hace por correo normalizado.
- El último enlace se conserva en almacenamiento local; no se garantiza atribución entre dispositivos ni pestañas fuera de la última visita local.
- Las existencias de premios deben ser configuradas para la demo y son ficticias.
- El botón de verificación de logística representa una afirmación administrativa local; no mide costos reales.
- Los eventos locales y el A/B no permiten inferencia de adquisición ni significancia estadística.

## Validación ejecutada

| Comando / revisión | Resultado |
|---|---|
| `npm run test` | Aprobadas las pruebas de reglas de referidos en almacenamiento `localStorage` simulado y aislado. |
| `npm run build` | Compilación Vite exitosa; queda el aviso preexistente/de bundle de chunk JavaScript mayor a 500 kB. |
| `npm run test:audit` | Aprobada la suite de fórmulas y cohortes de Parte 1. |
| `npm run test:calc` | Aprobada la validación del libro Excel Nivel 1. |
| `npm run test:storage` | No ejecutada: el script llama `resetToDemoDefaults()` y modifica almacenamiento; se evitó deliberadamente. |
| Auditoría funcional navegador | A 390 px no hubo overflow horizontal. Se verificó pedido aprobado → entrega → confirmación del cliente → enlace personal → landing del amigo → checkout aprobado con subtotal $17, descuento $8 y total $13,50 → recompensa única de $8 de crédito y premio pendiente. Growth mostró embudo oficial separado de eventos demo y variantes A/B. El reinicio cambió solo la clave de referidos y dejó intactas las claves comerciales observadas. |

Las pruebas nuevas cubren descuento y umbral de envío, pago rechazado, primera compra, doble confirmación, idempotencia, costo individual de $23,04, tope de $25, crédito, asignación explícita, inventario de premios, cancelación, reserva/envío/entrega y ventanas A/B. La fixture de la prueba A/B se aisló para evitar contaminación por asignaciones aleatorias de otras compras; `npm run test` pasó ocho ejecuciones consecutivas después del ajuste. Estas verificaciones no representan pruebas de seguridad o producción.
