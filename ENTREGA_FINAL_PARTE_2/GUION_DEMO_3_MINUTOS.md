# Guion de demostración — Tueste Parte 2 (3 minutos)

> Recorrido local y académico. Pedidos, pago, atribución, inventario de premios y métricas se muestran como **simulados**. No hay autenticación, envío real de WhatsApp ni sincronización entre dispositivos.

## Preparación previa

1. Abrir la aplicación con `npm run dev`.
2. Entrar al panel administrativo de Diego, abrir **Growth / Referidos** y verificar que se trata de datos simulados. Si es necesario, usar **Reiniciar demo de referidos**; este control no borra pedidos, clientes, catálogo ni inventario comercial.
3. En **Tienda**, ir a **Referidos**. Para probar activación real, usa un pedido aprobado existente de prueba o crea uno con un correo nuevo y sigue los pasos administrativos. El participante `invitador.demo@tueste.test` es un escenario ficticio precargado y no sustituye la demostración real de doble confirmación.
4. Si se desea mostrar recompensas físicas enviadas, configurar existencias ficticias en Growth. El inventario comienza en cero.

## Recorrido

### 0:00–0:35 — Doble confirmación

Para enseñar activación real con un pedido del prototipo: usar un pedido simulado aprobado, abrir Administración → **Gestión de Pedidos**, avanzar por preparación y envío hasta **Entregado**, y volver a la tienda. Ingresar el correo del comprador en **Referidos** y pulsar **Confirmé que recibí mi café**. Explicar que cualquiera de las confirmaciones puede ocurrir primero; el enlace no se activa hasta que ambas correspondan al mismo pedido aprobado.

Para un recorrido corto sin crear pedido, usar el invitador ficticio precargado y aclarar que su activación es solo de demostración.

### 0:35–1:05 — Enlace y WhatsApp

En el panel personal, mostrar el enlace y progreso. Pulsar **Compartir por WhatsApp** para abrir el mensaje preparado. Indicar que el prototipo solo registra el clic y no confirma envío.

### 1:05–1:45 — Página invitada y checkout

Abrir el enlace en el mismo navegador. La página explica el descuento de **$8 en la primera compra elegible desde $17**. Agregar una bolsa de $17 y abrir checkout: $8 de descuento + $4,50 de envío = **$13,50**. Probar pago aprobado. La orden registra atribución; no se modifica el precio del producto ni se acumula crédito del invitador.

### 1:45–2:20 — Crédito y recompensa

Volver al panel del invitador: mostrar el amigo aprobado, $8 de crédito local y muestra pendiente. El crédito puede cubrir subtotal futuro, no envío. La muestra y la bolsa no se envían por separado. El inventario físico de referidos es independiente del inventario comercial.

### 2:20–2:45 — Pedido de entrega

Si hay existencias configuradas, crear un pedido futuro del invitador. En el detalle del pedido, confirmar explícitamente que premios viajarán sin costo incremental; se reservan unidades. Marcar **Enviado** para consumirlas; marcar **Entregado** para cerrar el estado. Cancelar antes del envío libera la reserva.

### 2:45–3:00 — Growth de Diego y límites

Mostrar el embudo histórico del caso separado de eventos locales, CAC de referencia de $50, tope individual de $25 y variantes A/B. Recordar que las métricas de esta demostración son simuladas y no prueban resultados ni significancia estadística.
