# Entrega final — Tueste, Parte 2

Esta carpeta contiene los documentos académicos finales de Parte 2. La aplicación no se duplica aquí: se ejecuta desde la raíz del proyecto existente.

## Contenido de esta carpeta

- `GROWTH_SHEET_PARTE_2.md` — loop, embudo y proyección condicionada, North-star, canales de 90 días, A/B, costos y ejemplo documentado de error de IA corregido.
- `GUION_DEMO_3_MINUTOS.md` — preparación y recorrido cronometrado de la demostración.
- `DOCUMENTACION_PARTE_2.md` — integración, reglas, persistencia, validación y limitaciones.
- `BITACORA_DESARROLLO.md` — bitácora completa del desarrollo, validación e historial del proyecto.
- `README_ENTREGA.md` — estas instrucciones de ejecución y presentación.

## Ejecutar el proyecto

Desde PowerShell, abre la carpeta raíz del proyecto (la carpeta que contiene `package.json`) y ejecuta:

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

`npm install` solo es necesario si las dependencias aún no están instaladas. Abre en el navegador la URL que Vite indique en la terminal, normalmente `http://127.0.0.1:5174/`. Si ese puerto está ocupado, Vite puede seleccionar otro; usa la URL que muestre.

La atribución y el flujo de demostración dependen del origen local y del almacenamiento de ese navegador. Conserva la misma URL/origen durante todo el recorrido.

## Presentación académica

Para un recorrido completo en un navegador:

1. **Tienda ROASTIFY:** abre la URL local, cambia el viewport a 390 px si se quiere mostrar el diseño móvil y entra a **Referidos**.
2. **Pedido del invitador:** usa un pedido aprobado de prueba existente, o crea una compra simulada normal con un correo nuevo y un producto elegible.
3. **Entrega administrativa:** abre **Panel Financiero (Diego) → Gestión de Pedidos**. Avanza el pedido aprobado por preparación y envío hasta **Entregado**.
4. **Doble confirmación:** vuelve a la tienda, busca el programa con el mismo correo y pulsa **Confirmé que recibí mi café**. Comprueba que se habilite el enlace.
5. **Compra del amigo:** abre el enlace personal en el mismo navegador/origen. Agrega una bolsa de $17 y completa el checkout simulado aprobado con un correo nuevo. Debe mostrar $8 de descuento y total de $13,50 con envío estándar.
6. **Recompensa:** vuelve a **Referidos** con el correo del invitador y muestra el comprador atribuido, crédito y premio pendiente.
7. **Growth:** abre **Panel Financiero (Diego) → Growth / Referidos**. Distingue el embudo oficial del caso de los eventos de demostración y muestra la sección del experimento A/B.

El recorrido está descrito por intervalos en `GUION_DEMO_3_MINUTOS.md`. Si se parte de datos limpios, crear antes una orden aprobada de prueba para poder ilustrar la confirmación de entrega; no afirmar que un participante ficticio precargado representa ese recorrido.

## Reinicio y protección de datos

El botón **Reiniciar demo de referidos** en Growth reinicia únicamente la clave `tueste_referrals_v1` y vuelve a crear el escenario ficticio del programa. No uses `npm run test:storage` para preparar la demostración: el script restablece almacenamiento comercial. Tampoco es necesario borrar pedidos, clientes, catálogo o inventario.

El inventario de premios físicos de demostración empieza en cero; puede permanecer como premio pendiente. Solo configura existencias claramente ficticias si la presentación necesita mostrar asignación. La confirmación administrativa de logística sin costo incremental es una condición simulada, no una comprobación de costos reales.

## Validaciones reportadas

- `npm run test`: suite aislada de reglas de referidos; pasó tras aislar la fixture A/B.
- `npm run test:audit`: validación de cálculos financieros existentes.
- `npm run test:calc`: validación del libro Excel de Parte 1.
- La auditoría funcional de navegador comprobó el recorrido referido, descuento, recompensa, vistas A/B/Growth y responsive a 390 px.
- `npm run test:storage` no se ejecutó para evitar su reinicio de datos comerciales.

Los resultados son del prototipo y no equivalen a evidencia de producción o a una campaña real.

## Limitaciones del prototipo local

- `localStorage` es local y modificable; no hay backend, autenticación real, sincronización entre dispositivos, transacciones seguras ni verificación de correo.
- El mensaje de WhatsApp se prepara/abre, pero la aplicación no confirma su envío.
- No hay integración de correo ni notificaciones persistentes; las métricas y compras de la demo son simuladas.
- Las variantes A/B se muestran con ventanas completas de siete días; el almacenamiento local no permite conclusiones estadísticas fiables.
- El inventario físico y la verificación de logística son datos de demostración. La renovación automática de suscripciones no forma parte del flujo probado.
- No se modificaron las fórmulas, el simulador de cohortes ni el libro financiero de Parte 1 para preparar esta entrega.
