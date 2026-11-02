# Requisitos Académicos Oficiales — Caso A: Tueste

**Asignatura / Reto**: Caso A — Tueste: ¿Cuánto puede pagar un negocio por conseguir un cliente?  
**Autor del Caso**: FC Studio - Isidro Fernández C.  
**Documento Fuente**: `Caso A - Tueste.pdf` (13 páginas verificadas íntegramente)  
**Estado de Validación**: 100% de datos, tablas y reglas confirmados contra el documento original.

---

## 1. Contexto y Desafío Estratégico

Diego Ramírez fundó **Tueste**, un e-commerce directo al cliente (DTC) de café de especialidad tostado localmente.
- **Situación actual**: Ventas mensuales de $28.000 USD (Shopify).
- **Caja disponible hoy**: $35.000 USD en el banco (sin inversionistas).
- **Objetivo del fundador**: Comprar en diciembre una segunda tostadora de $14.000 USD.
- **Dilema inmediato**: La agencia *Impulso Digital* propone duplicar el presupuesto publicitario de Meta a **$16.000 USD** para Black Friday y lanzar un **30% de descuento en el primer pedido**, argumentando que el ROAS de 3,0x reportado por Meta garantiza rentabilidad.
- **Conflicto interno**: Camila (operaciones) advierte que en septiembre el saldo del banco **cayó $3.200 USD** a pesar del supuesto ROAS 3,0x.
- **Pregunta central de Diego**: *«¿Firmo o no? Y si no, ¿qué hago?»*

---

## 2. Requisitos Oficiales por Niveles

### NIVEL 1 · La Calculadora de Diego (Todos tienen que llegar · Rúbrica de 100 Puntos)
*Dificultad: 1 de 3. Tiempo límite: Minuto 85 de la sesión.*

#### Entregables obligatorios:
1. **Calculadora en Google Sheets**:
   - **Pestaña "Supuestos"**: Celdas editables y destacadas visualmente (pintadas de otro color) para todos los datos de entrada.
   - **Pestaña "Resultados"**: Totalmente automatizada con fórmulas que apunten a "Supuestos". Al cambiar cualquier celda de supuestos (ej. costo de envío), todos los resultados deben recalcularse dinámicamente.
2. **Métricas obligatorias calculadas**:
   - Margen de contribución unitario y porcentual (CM1 y CM2).
   - ROAS de break-even ($1 / \text{CM2\%}$).
   - CAC de anuncios ($\text{Inversión} / \text{Clientes nuevos Meta}$).
   - CAC real ($\text{Inversión} + \text{Fee agencia}) / \text{Clientes nuevos Meta}$.
   - ROAS real del primer pedido ($\text{Ventas reales 1er pedido} / \text{Inversión}$).
   - LTV a 12 meses sobre contribución (cliente suelto, suscriptor y promedio ponderado 85/15).
   - Ratio LTV:CAC.
   - Payback en meses (tiempo que tarda un cliente en devolver su CAC en caja acumulada).
   - CAC marginal ($\Delta \text{Inversión} / \Delta \text{Clientes nuevos}$).
3. **Tres escenarios comparativos lado a lado**:
   - **Escenario 1 (Hoy)**: Inversión en Meta de $8.000 USD (165 clientes nuevos de Meta, ROAS reportado 3,0x).
   - **Escenario 2 (Agencia)**: Inversión en Meta de $16.000 USD con 30% de descuento en el primer pedido (235 clientes nuevos según historial).
   - **Escenario 3 (Equipo)**: Propuesta del equipo con dos cambios estratégicos/operativos y su impacto cuantificado en números.
4. **Curva de Caja de un Cliente**:
   - Gráfico del mes 0 al mes 12 para los tres escenarios, con la línea horizontal del cero visible (curva J).
5. **Recomendación Estratégica (1 página)**:
   - Decisión ejecutiva explícita para Diego: **escalar**, **arreglar** o **pausar**.
   - Los dos cambios propuestos y su impacto financiero modelado.
   - Identificación explícita de la **trampa del caso** sustentada con un número.
6. **Verificación a Mano**:
   - Una fila verificada a mano (ej. CAC real), con la cuenta aritmética explícita escrita en la hoja.
7. **Sección Obligatoria de IA**:
   - Apartado «En qué se equivocó o nos confundió la IA», con al menos un ejemplo concreto (qué afirmó la IA, por qué era erróneo y cómo se subsanó).

---

### NIVEL 2 · El Tablero de Tueste (Bonus +10 Puntos)
*Dificultad: 2 de 3. Para equipos que terminan el Nivel 1 con tiempo.*

Una página web interactiva (desarrollada en React + Tailwind CSS / HTML + JS) con el modelo completo de Tueste:
1. **Controles Dinámicos (Sliders / Inputs)**:
   - Inversión en Meta ($0 a $20.000 USD, con historial).
   - Precio de la bolsa ($17 base).
   - Costo del café ($5,44 por bolsa).
   - Costo del envío ($4,50 base).
   - Porcentaje de suscriptores (15% base).
   - Cancelación mensual de suscriptores (churn 9% base).
   - Pedidos en 12 meses del cliente suelto (3 base).
   - Fee de la agencia ($1.000 base).
   - Descuento del primer pedido (0% a 30%).
2. **Indicadores en Vivo (KPIs)**:
   - Los 6 números fundamentales: Margen de contribución, ROAS de break-even, CAC real, LTV, LTV:CAC y Payback.
   - Métricas complementarias: ROAS real del primer pedido y CAC marginal de la inversión seleccionada.
3. **Visualizaciones Obligatorias (Mínimo 3 gráficos)**:
   - **Gráfico 1**: Curva de caja de un cliente (mes 0 al 12).
   - **Gráfico 2**: LTV frente a CAC con directrices de referencia 1:1 y 3:1.
   - **Gráfico 3**: Clientes nuevos según inversión con el CAC marginal de cada tramo.
   - **Gráfico 4 (El Gráfico de la Trampa)**: Gráfico unificado que expone juntos:
     - ROAS de Ads Manager (3,0x).
     - ROAS real del primer pedido (~0,70x).
     - ROAS de break-even (~2,14x base / 3,87x con descuento).
4. **Umbrales y Semáforos**:
   - Línea de referencia del ROAS de break-even.
   - Semáforo para LTV:CAC: Rojo (< 1x), Amarillo (1x a 2,9x), Verde (≥ 3x).
5. **Consistencia y Usabilidad**:
   - Coincidencia con Google Sheets con menos del 1% de diferencia.
   - Botón interactivo de "Volver a datos del caso".
   - Abre con link o archivo local sin instalaciones complejas.
   - Cada número lleva nombre técnico y unidad explícita (prohibido "Variable X").

---

### NIVEL 3 · El Simulador de Caja de Tueste (Bonus +15 Puntos + 5 Mejor Plan)
*Dificultad: 3 de 3. Muy pocos equipos lo van a terminar.*

El simulador responde **cuánto invertir en Meta cada mes para que Tueste termine los 24 meses con la mayor cantidad de dinero posible sin quedarse sin caja**.

#### Mecánica del Modelo:
1. **Decisión Mensual**: En cada uno de los 24 meses se define la inversión en Meta entre $0 y $20.000 USD.
2. **Curva de Adquisición**:
   - Los clientes nuevos de Meta se obtienen del historial de la Sección 5 mediante **interpolación lineal**.
   - Con $0 de inversión llegan 0 clientes de anuncios. Entre $0 y $4.000 se traza una recta desde el origen $(0, 0)$.
   - A los clientes de Meta se suman siempre **47 clientes orgánicos mensuales** fijos (no dependen de la pauta).
3. **Seguimiento por Cohortes**:
   - Cada grupo mensual se sigue por separado:
     - **85% pedidos sueltos**: Mes 1 a 12 según la tabla de retención ($1,00; 0,15; 0,20\dots$); meses 13 a 24 compran a razón de **0,10 pedidos/cliente/mes**.
     - **15% suscriptores**: Cada mes retiene el **91%** de los activos (churn mensual del 9%).
4. **Flujo de Caja Mensual**:
   - **Contribución total del mes** = Contribución de clientes existentes ($9.000 USD iniciales en mes 1, decreciendo 3% mensual compuesto: $\text{Factor} = 0,97$) + Contribución acumulada de todas las cohortes nuevas activas ese mes.
   - **Salidas del mes** = Inversión en Meta + Fee de agencia ($1.000 USD si hubo inversión; $0 USD si inversión = 0) + Costos fijos ($6.500 USD).
   - **Caja final del mes** = Caja mes anterior + Contribución total − Salidas.
   - **Caja inicial (Mes 0)** = $35.000 USD.

#### Las Reglas del Juego (Restricciones):
1. **Piso de Seguridad**: La caja **NUNCA puede bajar de $5.000 USD**.
2. **Continuidad del Negocio**: Desde el mes 13, la inversión de cada mes **no puede ser menor que el promedio de lo invertido en los meses 1 a 12**.
3. **Estrategia de Inversión**: Se puede usar inversión fija o un sendero escalonado (ej. $X los primeros 6 meses y $Y después). Se pueden activar los cambios del Nivel 1 desde el mes decidido con el supuesto justificado.
4. **Criterio de Victoria**: Gana el plan que termine con **más caja en el mes 24** sin violar ninguna regla. Desempate: mayor número de suscriptores activos en el mes 24.

#### Entregables de Nivel 3:
1. **Tabla de 24 meses**: Columnas de inversión, clientes nuevos, contribución clientes actuales, contribución cohortes nuevas, salidas, caja final y alerta visual si la caja baja de $5.000 USD.
2. **Revisión del Mes 1**: Cálculo a mano del Mes 1 para el plan de $8.000 USD fijos, contrastado y verificado contra la hoja de cálculo.
3. **Tabla comparativa de al menos 4 planes**:
   - Plan 1: $8.000 fijos.
   - Plan 2: Propuesta agencia ($16.000 fijos).
   - Plan 3: Plan propio 1.
   - Plan 4: Plan propio 2.
   - Métricas: Caja mínima (y mes en que ocurre), Caja en mes 24, Suscriptores activos en mes 24.
4. **Gráfico de caja mes a mes** con la línea del piso de $5.000 USD.
5. **Pitch de 2 minutos** ante un inversionista (el tío de Diego): Presupuesto solicitado, justificación cuantitativa, análisis de riesgos y condiciones para aumentarlo.

---

## 3. Rúbrica Oficial de Evaluación (100 Puntos + 30 Bonus)

| Criterio | Puntos | Aspectos Evaluados |
| :--- | :---: | :--- |
| **Rigor Numérico** | 25 | Fórmulas correctas, supuestos documentados, fila verificada a mano con cuenta aritmética visible. |
| **Criterio de Negocio** | 30 | Identificación de la trampa, recomendación fundamentada en números y reconocimiento de riesgos reales. |
| **Uso de la IA** | 15 | Corrección crítica de errores de la IA, registro de fallos y rechazo de datos inventados. |
| **Claridad** | 20 | Propuesta ejecutiva estructurada, defendible en 3 minutos, comprensible para el fundador. |
| **Visual** | 10 | Gráficos autoexplicativos que comunican la historia sin intervención verbal. |
| **Bonus Nivel 2** | +10 | Tablero web interactivo funcional que expone visualmente la trampa del ROAS. |
| **Bonus Nivel 3** | +15 | Simulador de 24 meses por cohortes con revisión del Mes 1 y cumplimiento de reglas de caja. |
| **Bonus Especial** | +5 | Otorgado al mejor plan del caso que respete todas las reglas operativas. |

---

## 4. Supuestos Permitidos Oficiales (Sección 7 del PDF)

1. **ROAS del primer pedido**: Se puede asumir un ticket de $34 USD para todos los clientes nuevos, aunque el suscriptor pague $30,60 USD.
2. **Estabilidad de comportamiento**: La mezcla 85/15 y la curva de compra de los clientes no cambian con el nivel de inversión publicitaria.
3. **Descuento de Black Friday**: Aplica únicamente al primer pedido de los clientes de pedidos sueltos, y no incrementa cuántos clientes llegan (se utiliza el historial). Es un supuesto optimista que debe registrarse como riesgo.
4. **Interpolación lineal**: Se asume una línea recta entre puntos contiguos del historial de inversión. En $0 USD de inversión llegan 0 clientes de anuncios.
5. **Sin estacionalidad**: Todos los meses del año tienen el mismo comportamiento base.
6. **Otros supuestos**: Cualquier supuesto adicional debe ser explícitamente formulado, escrito y justificado. Los datos inventados por la IA restan puntos.
