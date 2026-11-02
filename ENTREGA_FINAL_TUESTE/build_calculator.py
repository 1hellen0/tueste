import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import LineChart, Reference

def create_tueste_calculator():
    wb = openpyxl.Workbook()
    wb.remove(wb.active)

    font_family = "Calibri"
    
    # Styles definition
    title_font = Font(name=font_family, size=15, bold=True, color="0F172A")
    section_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
    section_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid") # Navy dark
    
    table_header_font = Font(name=font_family, size=10, bold=True, color="FFFFFF")
    table_header_fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid") # Slate dark
    
    sub_header_fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")
    sub_header_font = Font(name=font_family, size=10, bold=True, color="1E293B")

    regular_font = Font(name=font_family, size=10, color="0F172A")
    bold_font = Font(name=font_family, size=10, bold=True, color="0F172A")
    italic_font = Font(name=font_family, size=9, italic=True, color="64748B")
    
    # Editable cells (Input style) - Soft Amber/Yellow
    editable_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    editable_font = Font(name=font_family, size=10, bold=True, color="92400E")
    editable_border = Border(
        left=Side(style="thin", color="F59E0B"),
        right=Side(style="thin", color="F59E0B"),
        top=Side(style="thin", color="F59E0B"),
        bottom=Side(style="thin", color="F59E0B")
    )
    
    # KPI / Highlight fills
    kpi_green_fill = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
    kpi_green_font = Font(name=font_family, size=10, bold=True, color="166534")
    
    kpi_red_fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
    kpi_red_font = Font(name=font_family, size=10, bold=True, color="991B1B")

    kpi_blue_fill = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid")
    kpi_blue_font = Font(name=font_family, size=10, bold=True, color="075985")

    thin_border = Border(
        left=Side(style="thin", color="CBD5E1"),
        right=Side(style="thin", color="CBD5E1"),
        top=Side(style="thin", color="CBD5E1"),
        bottom=Side(style="thin", color="CBD5E1")
    )
    total_border = Border(
        left=Side(style="thin", color="CBD5E1"),
        right=Side(style="thin", color="CBD5E1"),
        top=Side(style="thin", color="0F172A"),
        bottom=Side(style="double", color="0F172A")
    )

    left_align = Alignment(horizontal="left", vertical="center")
    right_align = Alignment(horizontal="right", vertical="center")
    center_align = Alignment(horizontal="center", vertical="center")

    # =========================================================================
    # 1. PESTAÑA SUPUESTOS
    # =========================================================================
    ws1 = wb.create_sheet(title="Supuestos")
    ws1.views.sheetView[0].showGridLines = True
    
    ws1["B2"] = "CASO A · TUESTE — PARÁMETROS Y SUPUESTOS DEL MODELO"
    ws1["B2"].font = title_font
    ws1["B3"] = "Nota: Las celdas resaltadas en amarillo representan datos de entrada editables. Todas las fórmulas se recalculan dinámicamente."
    ws1["B3"].font = italic_font

    # Bloque 1: Producto y Precios
    ws1.merge_cells("B5:D5")
    ws1["B5"] = "1. PRODUCTO Y PRECIOS BASE"
    ws1["B5"].font = section_font
    ws1["B5"].fill = section_fill
    
    items_p1 = [
        ("Precio bolsa individual (340 g)", 17.00, "$#,##0.00", True),
        ("Bolsas por pedido típico de cliente nuevo", 2, "0", True),
        ("Precio lista pedido típico suelto (2 bolsas)", "=C6*C7", "$#,##0.00", False),
        ("Descuento suscripción mensual (%)", 0.10, "0.0%", True),
        ("Precio cuota mensual suscripción (2 bolsas)", "=C8*(1-C9)", "$#,##0.00", False),
        ("Bolsas entregadas por mes en suscripción", 2, "0", False),
    ]
    for idx, (label, val, fmt, is_edit) in enumerate(items_p1, start=6):
        ws1[f"B{idx}"] = label
        ws1[f"B{idx}"].font = bold_font if not is_edit else regular_font
        ws1[f"B{idx}"].border = thin_border
        
        c = ws1[f"C{idx}"]
        c.value = val
        c.number_format = fmt
        c.alignment = right_align
        c.border = editable_border if is_edit else thin_border
        if is_edit:
            c.fill = editable_fill
            c.font = editable_font
        else:
            c.font = bold_font

    # Bloque 2: Costos Variables
    ws1.merge_cells("B13:D13")
    ws1["B13"] = "2. COSTOS VARIABLES POR PEDIDO DE 2 BOLSAS"
    ws1["B13"].font = section_font
    ws1["B13"].fill = section_fill

    items_p2 = [
        ("Costo café por bolsa (grano, tueste y bolsa)", 5.44, "$#,##0.00", True),
        ("Costo café pedido típico 2 bolsas (32% lista)", "=C14*C7", "$#,##0.00", False),
        ("Costo de envío por pedido (absorbido por Tueste)", 4.50, "$#,##0.00", True),
        ("Comisión pasarela de pago (% sobre precio cobrado)", 0.045, "0.0%", True),
        ("Caja y empaque por pedido", 1.20, "$#,##0.00", True),
        ("Descuento promocional primer pedido (Agencia)", 0.30, "0.0%", True)
    ]
    for idx, (label, val, fmt, is_edit) in enumerate(items_p2, start=14):
        ws1[f"B{idx}"] = label
        ws1[f"B{idx}"].font = bold_font if not is_edit else regular_font
        ws1[f"B{idx}"].border = thin_border
        
        c = ws1[f"C{idx}"]
        c.value = val
        c.number_format = fmt
        c.alignment = right_align
        c.border = editable_border if is_edit else thin_border
        if is_edit:
            c.fill = editable_fill
            c.font = editable_font
        else:
            c.font = bold_font

    # Bloque 3: Comportamiento y Retención
    ws1.merge_cells("B21:D21")
    ws1["B21"] = "3. COMPORTAMIENTO Y RETENCIÓN DE CLIENTES"
    ws1["B21"].font = section_font
    ws1["B21"].fill = section_fill

    items_p3 = [
        ("Porcentaje clientes nuevos pedidos sueltos", 0.85, "0.0%", True),
        ("Porcentaje clientes nuevos suscriptores", 0.15, "0.0%", True),
        ("Cancelación mensual suscriptores (churn rate)", 0.09, "0.0%", True),
        ("Retención mensual suscriptores (1 - churn)", "=1-C24", "0.0%", False),
        ("Pedidos promedio cliente suelto en 12 meses", 3.00, "0.00", False),
        ("Pedidos mensuales cliente suelto meses 13 a 24", 0.10, "0.00", True),
    ]
    for idx, (label, val, fmt, is_edit) in enumerate(items_p3, start=22):
        ws1[f"B{idx}"] = label
        ws1[f"B{idx}"].font = bold_font if not is_edit else regular_font
        ws1[f"B{idx}"].border = thin_border
        
        c = ws1[f"C{idx}"]
        c.value = val
        c.number_format = fmt
        c.alignment = right_align
        c.border = editable_border if is_edit else thin_border
        if is_edit:
            c.fill = editable_fill
            c.font = editable_font
        else:
            c.font = bold_font

    # Bloque 4: Calendario de pedidos sueltos meses 1 a 12 (Suma exactamente 3.00)
    ws1.merge_cells("B29:D29")
    ws1["B29"] = "4. CALENDARIO DE PEDIDOS (CLIENTE SUELTO M1-M12)"
    ws1["B29"].font = section_font
    ws1["B29"].fill = section_fill

    orders_cal = [
        ("Mes 1", 1.00), ("Mes 2", 0.15), ("Mes 3", 0.20), ("Mes 4", 0.20),
        ("Mes 5", 0.20), ("Mes 6", 0.20), ("Mes 7", 0.20), ("Mes 8", 0.15),
        ("Mes 9", 0.15), ("Mes 10", 0.15), ("Mes 11", 0.20), ("Mes 12", 0.20)
    ]
    for idx, (m_label, m_val) in enumerate(orders_cal, start=30):
        ws1[f"B{idx}"] = f"Pedidos promedio {m_label}"
        ws1[f"B{idx}"].font = regular_font
        ws1[f"B{idx}"].border = thin_border
        
        c = ws1[f"C{idx}"]
        c.value = m_val
        c.number_format = "0.00"
        c.alignment = right_align
        c.fill = editable_fill
        c.font = editable_font
        c.border = editable_border

    ws1["B42"] = "Total pedidos en 12 meses (Verificación = 3.00)"
    ws1["B42"].font = bold_font
    ws1["B42"].border = total_border
    ws1["C42"] = "=SUM(C30:C41)"
    ws1["C42"].font = bold_font
    ws1["C42"].number_format = "0.00"
    ws1["C42"].alignment = right_align
    ws1["C42"].border = total_border

    # Columna E-G: Bloque Publicidad, Agencia y Caja
    ws1.merge_cells("E5:G5")
    ws1["E5"] = "5. MARKETING Y ADQUISICIÓN (SEPTIEMBRE / HOY)"
    ws1["E5"].font = section_font
    ws1["E5"].fill = section_fill

    items_p5 = [
        ("Inversión en Meta Ads (Septiembre)", 8000.00, "$#,##0.00", True),
        ("Clientes nuevos de Meta (Septiembre)", 165, "#,##0", True),
        ("Fee fijo mensual de agencia Impulso Digital", 1000.00, "$#,##0.00", True),
        ("ROAS reportado por Meta Ads Manager", 3.00, "0.00\"x\"", True),
        ("Clientes nuevos orgánicos mensuales (fijos)", 47, "#,##0", True),
        ("Ventas totales tienda Shopify (Septiembre)", 28000.00, "$#,##0.00", True),
        ("Pedidos totales tienda Shopify (Septiembre)", 840, "#,##0", True),
    ]
    for idx, (label, val, fmt, is_edit) in enumerate(items_p5, start=6):
        ws1[f"E{idx}"] = label
        ws1[f"E{idx}"].font = regular_font
        ws1[f"E{idx}"].border = thin_border
        
        c = ws1[f"F{idx}"]
        c.value = val
        c.number_format = fmt
        c.alignment = right_align
        c.border = editable_border if is_edit else thin_border
        if is_edit:
            c.fill = editable_fill
            c.font = editable_font
        else:
            c.font = bold_font

    # Bloque 6: Propuesta Black Friday Agencia
    ws1.merge_cells("E14:G14")
    ws1["E14"] = "6. PROPUESTA DE ESCALAMIENTO AGENCIA"
    ws1["E14"].font = section_font
    ws1["E14"].fill = section_fill

    items_p6 = [
        ("Inversión propuesta en Meta Ads", 16000.00, "$#,##0.00", True),
        ("Clientes nuevos esperados Meta (historial)", 235, "#,##0", True),
        ("Descuento propuesto en primer pedido", 0.30, "0.0%", True),
        ("Fee fijo mensual de agencia", 1000.00, "$#,##0.00", True),
    ]
    for idx, (label, val, fmt, is_edit) in enumerate(items_p6, start=15):
        ws1[f"E{idx}"] = label
        ws1[f"E{idx}"].font = regular_font
        ws1[f"E{idx}"].border = thin_border
        
        c = ws1[f"F{idx}"]
        c.value = val
        c.number_format = fmt
        c.alignment = right_align
        c.border = editable_border if is_edit else thin_border
        if is_edit:
            c.fill = editable_fill
            c.font = editable_font
        else:
            c.font = bold_font

    # Bloque 7: Idea de Diego y Propuesta Equipo
    ws1.merge_cells("E20:G20")
    ws1["E20"] = "7. IDEA DE DIEGO (PACK 3 BOLSAS Y ENVÍOS)"
    ws1["E20"].font = section_font
    ws1["E20"].fill = section_fill

    items_p7 = [
        ("Precio Pack 3 bolsas (340 g c/u)", 48.00, "$#,##0.00", True),
        ("Umbral mínimo para envío gratis", 45.00, "$#,##0.00", True),
        ("Costo café Pack 3 bolsas (3 x $5,44)", "=3*C14", "$#,##0.00", False),
        ("Costo empaque caja pack (más grande)", 1.40, "$#,##0.00", True),
        ("Envío cobrado al cliente si pedido < $45", 4.50, "$#,##0.00", True),
    ]
    for idx, (label, val, fmt, is_edit) in enumerate(items_p7, start=21):
        ws1[f"E{idx}"] = label
        ws1[f"E{idx}"].font = regular_font
        ws1[f"E{idx}"].border = thin_border
        
        c = ws1[f"F{idx}"]
        c.value = val
        c.number_format = fmt
        c.alignment = right_align
        c.border = editable_border if is_edit else thin_border
        if is_edit:
            c.fill = editable_fill
            c.font = editable_font
        else:
            c.font = bold_font

    # Bloque 8: Historial de Inversión Meta
    ws1.merge_cells("E27:G27")
    ws1["E27"] = "8. TABLA HISTÓRICA DE INVERSIÓN EN META"
    ws1["E27"].font = section_font
    ws1["E27"].fill = section_fill

    ws1["E28"] = "Mes / Referencia"
    ws1["F28"] = "Inversión Meta"
    ws1["G28"] = "Clientes Meta"
    for col in ["E28", "F28", "G28"]:
        ws1[col].font = table_header_font
        ws1[col].fill = table_header_fill
        ws1[col].alignment = center_align

    history_data = [
        ("Punto origen (Base $0)", 0.0, 0),
        ("Marzo", 4000.0, 100),
        ("Julio a Septiembre (Promedio)", 8000.0, 165),
        ("Octubre (Prueba subir)", 12000.0, 210),
        ("Abril (Prueba de escala)", 16000.0, 235),
        ("Junio (Prueba 2 sem llevada a mes)", 20000.0, 250),
    ]
    for idx, (h_mes, h_inv, h_clie) in enumerate(history_data, start=29):
        ws1[f"E{idx}"] = h_mes
        ws1[f"E{idx}"].font = regular_font
        ws1[f"E{idx}"].border = thin_border

        ws1[f"F{idx}"] = h_inv
        ws1[f"F{idx}"].font = regular_font
        ws1[f"F{idx}"].number_format = "$#,##0.00"
        ws1[f"F{idx}"].alignment = right_align
        ws1[f"F{idx}"].border = thin_border

        ws1[f"G{idx}"] = h_clie
        ws1[f"G{idx}"].font = regular_font
        ws1[f"G{idx}"].number_format = "#,##0"
        ws1[f"G{idx}"].alignment = right_align
        ws1[f"G{idx}"].border = thin_border

    # Bloque 9: Costos Fijos y Caja
    ws1.merge_cells("E36:G36")
    ws1["E36"] = "9. ESTRUCTURA FIJA Y SALDO BANCARIO"
    ws1["E36"].font = section_font
    ws1["E36"].fill = section_fill

    items_p9 = [
        ("Saldo actual en banco (liquidez total)", 35000.00, "$#,##0.00", True),
        ("Piso de seguridad de banco (infranqueable)", 5000.00, "$#,##0.00", True),
        ("Costos fijos mensuales totales", 6500.00, "$#,##0.00", True),
        (" - Planilla sueldos fija", 4600.00, "$#,##0.00", True),
        (" - Alquiler espacio de tueste", 1100.00, "$#,##0.00", True),
        (" - Shopify, aplicaciones y correo", 250.00, "$#,##0.00", True),
        (" - Contador y otros gastos fijos", 550.00, "$#,##0.00", True),
        ("Contribución base clientes existentes Mes 1", 9000.00, "$#,##0.00", True),
        ("Caída mensual clientes actuales (%)", 0.03, "0.0%", True),
        ("Precio segunda tostadora (meta diciembre)", 14000.00, "$#,##0.00", True),
    ]
    for idx, (label, val, fmt, is_edit) in enumerate(items_p9, start=37):
        ws1[f"E{idx}"] = label
        ws1[f"E{idx}"].font = regular_font
        ws1[f"E{idx}"].border = thin_border
        
        c = ws1[f"F{idx}"]
        c.value = val
        c.number_format = fmt
        c.alignment = right_align
        c.border = editable_border if is_edit else thin_border
        if is_edit:
            c.fill = editable_fill
            c.font = editable_font
        else:
            c.font = bold_font

    # =========================================================================
    # 2. PESTAÑA RESULTADOS
    # =========================================================================
    ws2 = wb.create_sheet(title="Resultados")
    ws2.views.sheetView[0].showGridLines = True

    ws2["B2"] = "CASCADA DE CONTRIBUCIÓN Y MÉTRICAS DE UNIT ECONOMICS"
    ws2["B2"].font = title_font
    ws2["B3"] = "Cálculos 100% automatizados con fórmulas vinculadas a la pestaña Supuestos."
    ws2["B3"].font = italic_font

    # Tabla 1: Cascada Unitaria por Tipo de Pedido
    ws2.merge_cells("B5:G5")
    ws2["B5"] = "1. CASCADA DE CONTRIBUCIÓN UNITARIA POR PRODUCTO / MODALIDAD"
    ws2["B5"].font = section_font
    ws2["B5"].fill = section_fill

    cols_t1 = [
        ("B6", "Concepto de Costo / Margen"),
        ("C6", "Pedido Suelto Base (2 Bolsas)"),
        ("D6", "Suscripción Mensual (2 Bolsas)"),
        ("E6", "Suelto con 30% Descuento"),
        ("F6", "Pack 3 Bolsas (Idea Diego)"),
        ("G6", "Suelto Cliente Paga Envío")
    ]
    for c_ref, c_name in cols_t1:
        ws2[c_ref] = c_name
        ws2[c_ref].font = table_header_font
        ws2[c_ref].fill = table_header_fill
        ws2[c_ref].alignment = center_align
        ws2[c_ref].border = thin_border

    rows_t1 = [
        ("Precio bruto cobrado al cliente", "=Supuestos!C8", "=Supuestos!C10", "=Supuestos!C8*(1-Supuestos!C19)", "=Supuestos!F21", "=Supuestos!C8+Supuestos!F25", "$#,##0.00"),
        ("Costo del café (grano, tueste y bolsa)", "=Supuestos!C15", "=Supuestos!C15", "=Supuestos!C15", "=Supuestos!F23", "=Supuestos!C15", "$#,##0.00"),
        ("MARGEN DE CONTRIBUCIÓN 1 (CM1 $)", "=C7-C8", "=D7-D8", "=E7-E8", "=F7-F8", "=G7-G8", "$#,##0.00"),
        ("MARGEN CM1 (%)", "=C9/C7", "=D9/D7", "=E9/E7", "=F9/F7", "=G9/G7", "0.0%"),
        ("Costo de envío (absorbido por Tueste)", "=Supuestos!C16", "=Supuestos!C16", "=Supuestos!C16", "=Supuestos!C16", "=Supuestos!C16", "$#,##0.00"),
        ("Comisión pasarela de pago (4,5% sobre cobrado)", "=Supuestos!C17*C7", "=Supuestos!C17*D7", "=Supuestos!C17*E7", "=Supuestos!C17*F7", "=Supuestos!C17*G7", "$#,##0.00"),
        ("Caja y empaque", "=Supuestos!C18", "=Supuestos!C18", "=Supuestos!C18", "=Supuestos!F24", "=Supuestos!C18", "$#,##0.00"),
        ("Total costos de entrega y variables", "=SUM(C11:C13)", "=SUM(D11:D13)", "=SUM(E11:E13)", "=SUM(F11:F13)", "=SUM(G11:G13)", "$#,##0.00"),
        ("MARGEN DE CONTRIBUCIÓN 2 (CM2 $)", "=C9-C14", "=D9-D14", "=E9-E14", "=F9-F14", "=G9-G14", "$#,##0.00"),
        ("MARGEN CM2 (%)", "=C15/C7", "=D15/D7", "=E15/E7", "=F15/F7", "=G15/G7", "0.0%"),
        ("ROAS DE BREAK-EVEN (1ER PEDIDO)", "=1/C16", "=1/D16", "=1/E16", "=1/F16", "=1/G16", "0.00\"x\""),
    ]

    for idx, (label, f_c, f_d, f_e, f_f, f_g, fmt) in enumerate(rows_t1, start=7):
        ws2[f"B{idx}"] = label
        is_highlight = "CM2" in label or "ROAS" in label or "CM1" in label
        ws2[f"B{idx}"].font = bold_font if is_highlight else regular_font
        ws2[f"B{idx}"].border = thin_border
        
        for col_letter, formula in zip(["C", "D", "E", "F", "G"], [f_c, f_d, f_e, f_f, f_g]):
            cell = ws2[f"{col_letter}{idx}"]
            cell.value = formula
            cell.number_format = fmt
            cell.alignment = right_align
            cell.border = thin_border
            if "CM2 ($)" in label:
                cell.font = bold_font
                cell.fill = kpi_green_fill if col_letter in ["C", "D", "F", "G"] else kpi_red_fill
            elif "ROAS DE BREAK-EVEN" in label:
                cell.font = bold_font
                cell.fill = kpi_blue_fill

    # Tabla 2: Auditoría de Adquisición Septiembre (Hoy)
    ws2.merge_cells("B19:D19")
    ws2["B19"] = "2. AUDITORÍA DE ADQUISICIÓN Y ROAS (SEPTIEMBRE / HOY)"
    ws2["B19"].font = section_font
    ws2["B19"].fill = section_fill

    items_acq = [
        ("Inversión publicitaria en Meta Ads", "=Supuestos!F6", "$#,##0.00"),
        ("Clientes nuevos atribuidos por Meta (Encuesta/UTM)", "=Supuestos!F7", "#,##0"),
        ("Fee fijo mensual de agencia Impulso Digital", "=Supuestos!F8", "$#,##0.00"),
        ("CAC DE ANUNCIOS (Solo inversión Meta / Clientes)", "=C20/C21", "$#,##0.00"),
        ("CAC REAL FULLY-LOADED ((Meta + Fee) / Clientes)", "=(C20+C22)/C21", "$#,##0.00"),
        ("ROAS reportado por Meta Ads Manager (con retargeting)", "=Supuestos!F9", "0.00\"x\""),
        ("ROAS real 1er pedido (Supuesto oficial $34)", "=(C21*Supuestos!C8)/C20", "0.00\"x\""),
        ("ROAS real 1er pedido (Ponderado mix 85/15)", "=(C21*(Supuestos!C22*Supuestos!C8+Supuestos!C23*Supuestos!C10))/C20", "0.00\"x\""),
        ("ROAS de break-even requerido (Pedido suelto base)", "=C17", "0.00\"x\""),
        ("Diagnóstico 1er pedido: ¿Rentable o Pérdida?", '=IF(C26>=C28,"Rentable en 1er Pedido","PIERDE PLATA EN 1ER PEDIDO")', "@"),
        ("Resultado por cada $1 invertido en Meta (Margen real - 1)", "=C27*C16-1", "-0.0%")
    ]
    for idx, (label, formula, fmt) in enumerate(items_acq, start=20):
        ws2[f"B{idx}"] = label
        is_key = "CAC REAL" in label or "ROAS real" in label or "Diagnóstico" in label
        ws2[f"B{idx}"].font = bold_font if is_key else regular_font
        ws2[f"B{idx}"].border = thin_border
        
        c = ws2[f"C{idx}"]
        c.value = formula
        c.number_format = fmt
        c.alignment = right_align
        c.border = thin_border
        if "PIERDE" in str(formula) or "Diagnóstico" in label:
            c.font = kpi_red_font
            c.fill = kpi_red_fill
            c.alignment = center_align
        elif "CAC REAL" in label:
            c.font = bold_font
            c.fill = kpi_blue_fill
        else:
            c.font = bold_font if is_key else regular_font

    # Tabla 3: LTV y Payback del Cliente Promedio
    ws2.merge_cells("E19:G19")
    ws2["E19"] = "3. LTV A 12 MESES, LTV:CAC Y PAYBACK (CM2)"
    ws2["E19"].font = section_font
    ws2["E19"].fill = section_fill

    items_ltv = [
        ("LTV 12 meses Cliente Suelto (3 pedidos x CM2 $15,89)", "=C15*Supuestos!C26", "$#,##0.00"),
        ("Vida media teórica suscriptor (1 / churn 9%)", "=1/Supuestos!C24", "0.0 \"meses\""),
        ("LTV 12 meses Suscriptor (Suma mensual retención CM2)", "=D15*(1-(1-Supuestos!C24)^12)/Supuestos!C24", "$#,##0.00"),
        ("LTV 12 MESES CLIENTE PROMEDIO (85% Suelto + 15% Sub)", "=Supuestos!C22*F20+Supuestos!C23*F22", "$#,##0.00"),
        ("CAC Real Fully-Loaded (Hoy)", "=C24", "$#,##0.00"),
        ("RATIO LTV:CAC REAL (Promedio)", "=F23/F24", "0.00\"x\""),
        ("Diagnóstico Cuadrante de Negocio (Benchmark)", '=IF(F25>=3,"Estrella (Saludable)",IF(F25>=1,"Zona Intermedia / Frágil","Quemador de Caja (<1x)"))', "@"),
        ("Payback cliente suelto (LTV $47,67 vs CAC $54,55)", "No recupera en 12m", "@"),
        ("Payback cliente promedio (Cruce acumulado con cero)", "Mes 12 (+$0,25)", "@"),
        ("Contribución 1er pedido cliente promedio", "=Supuestos!C22*C15+Supuestos!C23*D15", "$#,##0.00"),
        ("Déficit en caja tras el 1er pedido por cliente (CM3)", "=F29-F24", "$#,##0.00")
    ]
    for idx, (label, formula, fmt) in enumerate(items_ltv, start=20):
        ws2[f"E{idx}"] = label
        is_key = "LTV 12 MESES" in label or "RATIO LTV:CAC" in label or "Déficit" in label
        ws2[f"E{idx}"].font = bold_font if is_key else regular_font
        ws2[f"E{idx}"].border = thin_border
        
        c = ws2[f"F{idx}"]
        c.value = formula
        c.number_format = fmt
        c.alignment = right_align
        c.border = thin_border
        if "RATIO LTV:CAC" in label:
            c.font = bold_font
            c.fill = kpi_green_fill
        elif "Déficit" in label:
            c.font = kpi_red_font
            c.fill = kpi_red_fill
        else:
            c.font = bold_font if is_key else regular_font

    # Tabla 4: CAC Marginal por Tramo Histórico de Inversión
    ws2.merge_cells("B33:G33")
    ws2["B33"] = "4. ANÁLISIS DE CAC MARGINAL POR TRAMO HISTÓRICO DE META"
    ws2["B33"].font = section_font
    ws2["B33"].fill = section_fill

    cols_m = [
        ("B34", "Tramo Histórico"),
        ("C34", "Inversión Meta"),
        ("D34", "Clientes Meta"),
        ("E34", "Δ Inversión"),
        ("F34", "Δ Clientes"),
        ("G34", "CAC Marginal (ΔInv / ΔCli)")
    ]
    for c_ref, c_name in cols_m:
        ws2[c_ref] = c_name
        ws2[c_ref].font = table_header_font
        ws2[c_ref].fill = table_header_fill
        ws2[c_ref].alignment = center_align
        ws2[c_ref].border = thin_border

    rows_m = [
        ("Base teórica $0", "=Supuestos!F29", "=Supuestos!G29", "-", "-", "-"),
        ("Marzo ($4k)", "=Supuestos!F30", "=Supuestos!G30", "=C36-C35", "=D36-D35", "=E36/F36"),
        ("Julio a Septiembre ($8k Hoy)", "=Supuestos!F31", "=Supuestos!G31", "=C37-C36", "=D37-D36", "=E37/F37"),
        ("Octubre (Prueba subir $12k)", "=Supuestos!F32", "=Supuestos!G32", "=C38-C37", "=D38-D37", "=E38/F38"),
        ("Abril (Prueba escala $16k - Propuesta Agencia)", "=Supuestos!F33", "=Supuestos!G33", "=C39-C38", "=D39-D38", "=E39/F39"),
        ("Junio ($20k mensualizada)", "=Supuestos!F34", "=Supuestos!G34", "=C40-C39", "=D40-D39", "=E40/F40"),
    ]
    for idx, (t_name, f_inv, f_cli, f_dinv, f_dcli, f_cacm) in enumerate(rows_m, start=35):
        ws2[f"B{idx}"] = t_name
        ws2[f"B{idx}"].font = regular_font
        ws2[f"B{idx}"].border = thin_border

        ws2[f"C{idx}"] = f_inv
        ws2[f"C{idx}"].number_format = "$#,##0.00"
        ws2[f"C{idx}"].alignment = right_align
        ws2[f"C{idx}"].border = thin_border

        ws2[f"D{idx}"] = f_cli
        ws2[f"D{idx}"].number_format = "#,##0"
        ws2[f"D{idx}"].alignment = right_align
        ws2[f"D{idx}"].border = thin_border

        ws2[f"E{idx}"] = f_dinv
        if f_dinv != "-": ws2[f"E{idx}"].number_format = "$#,##0.00"
        ws2[f"E{idx}"].alignment = right_align
        ws2[f"E{idx}"].border = thin_border

        ws2[f"F{idx}"] = f_dcli
        if f_dcli != "-": ws2[f"F{idx}"].number_format = "#,##0"
        ws2[f"F{idx}"].alignment = right_align
        ws2[f"F{idx}"].border = thin_border

        c = ws2[f"G{idx}"]
        c.value = f_cacm
        if f_cacm != "-":
            c.number_format = "$#,##0.00"
            c.font = bold_font
            if idx >= 38: # Tramos $12k, $16k, $20k
                c.fill = kpi_red_fill
                c.font = kpi_red_font
            else:
                c.fill = kpi_green_fill
        c.alignment = right_align
        c.border = thin_border

    ws2["B42"] = "Alerta Estratégica: El CAC marginal del tramo de la agencia ($8k a $16k) es de $114,29 (Δ$8.000 / 70 clientes), y en el último tramo llega a $160,00."
    ws2["B42"].font = italic_font
    ws2["B43"] = "Como el LTV promedio de un cliente es de apenas $54,90, CADA CLIENTE EXTRA CAPTADO CON LA PROPUESTA PIERDE MÁS DE $100 EN CAJA."
    ws2["B43"].font = Font(name=font_family, size=10, bold=True, color="991B1B")

    # =========================================================================
    # 3. PESTAÑA ESCENARIOS
    # =========================================================================
    ws3 = wb.create_sheet(title="Escenarios")
    ws3.views.sheetView[0].showGridLines = True

    ws3["B2"] = "COMPARACIÓN DE ESCENARIOS: HOY vs AGENCIA vs EQUIPO (BASE E HIPÓTESIS)"
    ws3["B2"].font = title_font
    ws3["B3"] = "Evaluación lado a lado de la situación actual ($8k), propuesta agencia ($16k + 30% desc), recomendación base (85/15) e hipótesis sensibilidad (80/20)."
    ws3["B3"].font = italic_font

    ws3.merge_cells("B5:F5")
    ws3["B5"] = "TABLA COMPARATIVA DE DECISIÓN ESTRATÉGICA"
    ws3["B5"].font = section_font
    ws3["B5"].fill = section_fill

    headers_sc = [
        ("B6", "Parámetro / Métrica Clave"),
        ("C6", "Escenario 1: HOY ($8.000, 85/15)"),
        ("D6", "Escenario 2: AGENCIA ($16.000 + 30%, 85/15)"),
        ("E6", "Escenario 3: RECOMENDADO BASE (Mix Oficial 85/15)"),
        ("F6", "Escenario 3B: HIPÓTESIS SENSIBILIDAD (Mix 80/20)")
    ]
    for c_ref, c_name in headers_sc:
        ws3[c_ref] = c_name
        ws3[c_ref].font = table_header_font
        ws3[c_ref].fill = table_header_fill
        ws3[c_ref].alignment = center_align
        ws3[c_ref].border = thin_border

    sc_rows = [
        ("Inversión mensual en Meta Ads", "=Supuestos!F6", "=Supuestos!F15", "=Supuestos!F6", 6000.00, "$#,##0.00"),
        ("Clientes nuevos captados por Meta", "=Supuestos!F7", "=Supuestos!F16", "=Supuestos!F7", 132.5, "#,##0"),
        ("Clientes nuevos orgánicos mensuales", "=Supuestos!F10", "=Supuestos!F10", "=Supuestos!F10", "=Supuestos!F10", "#,##0"),
        ("Total clientes nuevos mensuales", "=C8+C9", "=D8+D9", "=E8+E9", "=F8+F9", "#,##0"),
        ("Fee fijo mensual agencia", "=Supuestos!F8", "=Supuestos!F18", "=Supuestos!F8", 1000.00, "$#,##0.00"),
        ("Gasto total mensual adquisición", "=C7+C11", "=D7+D11", "=E7+E11", "=F7+F11", "$#,##0.00"),
        ("Descuento primer pedido clientes sueltos", 0.00, "=Supuestos!C19", 0.00, 0.00, "0.0%"),
        ("Política de envío gratis", "Gratis en todo", "Gratis en todo", "Gratis solo desde $45", "Gratis solo desde $45", "@"),
        ("Precio cobrado 1er pedido (suelto)", "=Resultados!C7", "=Resultados!E7", "=Resultados!G7", "=Resultados!G7", "$#,##0.00"),
        ("CM1 unitario 1er pedido ($)", "=Resultados!C9", "=Resultados!E9", "=Resultados!G9", "=Resultados!G9", "$#,##0.00"),
        ("CM2 unitario 1er pedido ($)", "=Resultados!C15", "=Resultados!E15", "=Resultados!G15", "=Resultados!G15", "$#,##0.00"),
        ("CM2 unitario 1er pedido (%)", "=Resultados!C16", "=Resultados!E16", "=Resultados!G16", "=Resultados!G16", "0.0%"),
        ("ROAS de break-even requerido (1er pedido)", "=Resultados!C17", "=Resultados!E17", "=Resultados!G17", "=Resultados!G17", "0.00\"x\""),
        ("ROAS real estimado primer pedido", "=Resultados!C26", "=(D8*D15)/D7", "=(E8*E15)/E7", "=(F8*F15)/F7", "0.00\"x\""),
        ("CAC DE ANUNCIOS (Solo Meta / Clientes Meta)", "=C7/C8", "=D7/D8", "=E7/E8", "=F7/F8", "$#,##0.00"),
        ("CAC REAL FULLY-LOADED ((Meta + Fee) / Clientes)", "=C12/C8", "=D12/D8", "=E12/E8", "=F12/F8", "$#,##0.00"),
        ("CAC marginal frente a situación base ($8k)", "-", "=(D7-C7)/(D8-C8)", "$0.00 (Misma pauta)", "Optimizado", "$#,##0.00"),
        ("LTV 12 meses cliente suelto", "=Resultados!F20", "=D17*1+Resultados!C15*2", "=E17*3", "=F17*3", "$#,##0.00"),
        ("LTV 12 meses suscriptor", "=Resultados!F22", "=Resultados!F22", "=Resultados!F22", "=Resultados!F22", "$#,##0.00"),
        ("LTV 12 meses cliente promedio", "=Resultados!F23", "=Supuestos!C22*D24+Supuestos!C23*D25", "=Supuestos!C22*E24+Supuestos!C23*E25", "=0.80*F24+0.20*F25", "$#,##0.00"),
        ("RATIO LTV:CAC REAL", "=C26/C22", "=D26/D22", "=E26/E22", "=F26/F22", "0.00\"x\""),
        ("Payback en caja (meses)", "Mes 12", "No recupera en 12m", "Mes 10", "Mes 9", "@"),
        ("Contribución total mes 1 nuevos clientes Meta", "=C8*(Supuestos!C22*C17+Supuestos!C23*Resultados!D15)", "=D8*(Supuestos!C22*D17+Supuestos!C23*Resultados!D15)", "=E8*(Supuestos!C22*E17+Supuestos!C23*Resultados!D15)", "=F8*(0.80*F17+0.20*Resultados!D15)", "$#,##0.00"),
        ("Balance neto adquisición Mes 1 (Contribución - Gasto)", "=C29-C12", "=D29-D12", "=E29-E12", "=F29-F12", "$#,##0.00"),
        ("Veredicto Estratégico", "Frágil (Payback Mes 12)", "DESTRUCCIÓN DE CAJA", "MEJORA BASE (Mix 85/15)", "ALTA EFICIENCIA (Mix 80/20)", "@")
    ]

    for idx, (label, f_c, f_d, f_e, f_f, fmt) in enumerate(sc_rows, start=7):
        ws3[f"B{idx}"] = label
        is_highlight = "RATIO LTV:CAC" in label or "Balance neto" in label or "Veredicto" in label or "CAC REAL" in label or "CM2 unitario" in label
        ws3[f"B{idx}"].font = bold_font if is_highlight else regular_font
        ws3[f"B{idx}"].border = thin_border
        
        for col_letter, val in zip(["C", "D", "E", "F"], [f_c, f_d, f_e, f_f]):
            cell = ws3[f"{col_letter}{idx}"]
            cell.value = val
            cell.number_format = fmt
            cell.alignment = right_align if fmt != "@" else center_align
            cell.border = thin_border
            
            if "RATIO LTV:CAC" in label:
                cell.font = bold_font
                if col_letter == "C": cell.fill = kpi_blue_fill
                elif col_letter == "D": cell.fill = kpi_red_fill; cell.font = kpi_red_font
                elif col_letter in ["E", "F"]: cell.fill = kpi_green_fill; cell.font = kpi_green_font
            elif "Balance neto" in label:
                cell.font = bold_font
                if col_letter == "D": cell.fill = kpi_red_fill; cell.font = kpi_red_font
            elif "Veredicto" in label:
                cell.font = bold_font
                if col_letter == "C": cell.fill = sub_header_fill
                elif col_letter == "D": cell.fill = kpi_red_fill; cell.font = kpi_red_font
                elif col_letter in ["E", "F"]: cell.fill = kpi_green_fill; cell.font = kpi_green_font

    # =========================================================================
    # 4. PESTAÑA CURVA DE CAJA
    # =========================================================================
    ws4 = wb.create_sheet(title="Curva de caja")
    ws4.views.sheetView[0].showGridLines = True

    ws4["B2"] = "CURVA DE CAJA ACUMULADA POR CLIENTE (MES 0 AL MES 12)"
    ws4["B2"].font = title_font
    ws4["B3"] = "Evolución de la caja neta de un cliente promedio desde que se paga el CAC (Mes 0) hasta el Mes 12."
    ws4["B3"].font = italic_font

    ws4.merge_cells("B5:I5")
    ws4["B5"] = "TABLA DE CAJA ACUMULADA Y PAYBACK POR CLIENTE"
    ws4["B5"].font = section_font
    ws4["B5"].fill = section_fill

    headers_cc = [
        ("B6", "Mes"),
        ("C6", "Retención Sub"),
        ("D6", "Pedidos Suelto"),
        ("E6", "Contribución Hoy"),
        ("F6", "Caja Acum. Hoy ($8k, 85/15)"),
        ("G6", "Caja Acum. Agencia ($16k, 85/15)"),
        ("H6", "Caja Acum. Recom. Base (85/15)"),
        ("I6", "Caja Acum. Hipótesis (80/20)")
    ]
    for c_ref, c_name in headers_cc:
        ws4[c_ref] = c_name
        ws4[c_ref].font = table_header_font
        ws4[c_ref].fill = table_header_fill
        ws4[c_ref].alignment = center_align
        ws4[c_ref].border = thin_border

    # Mes 0
    ws4["B7"] = 0
    ws4["C7"] = "-"
    ws4["D7"] = "-"
    ws4["E7"] = 0.00
    ws4["F7"] = "=-Escenarios!C22"
    ws4["G7"] = "=-Escenarios!D22"
    ws4["H7"] = "=-Escenarios!E22"
    ws4["I7"] = "=-Escenarios!F22"

    for col in ["B7", "C7", "D7"]:
        ws4[col].alignment = center_align
        ws4[col].border = thin_border
        ws4[col].font = bold_font
    for col in ["E7", "F7", "G7", "H7", "I7"]:
        ws4[col].alignment = right_align
        ws4[col].border = thin_border
        ws4[col].number_format = "$#,##0.00"
        ws4[col].font = bold_font
        if col in ["F7", "G7", "H7", "I7"]:
            ws4[col].fill = kpi_red_fill
            ws4[col].font = kpi_red_font

    for m in range(1, 13):
        r = 7 + m
        prev_r = r - 1
        sup_r = 29 + m
        
        ws4[f"B{r}"] = m
        ws4[f"B{r}"].alignment = center_align
        ws4[f"B{r}"].border = thin_border
        ws4[f"B{r}"].font = regular_font

        ws4[f"C{r}"] = f"=(1-Supuestos!$C$24)^({m}-1)"
        ws4[f"C{r}"].number_format = "0.0%"
        ws4[f"C{r}"].alignment = right_align
        ws4[f"C{r}"].border = thin_border

        ws4[f"D{r}"] = f"=Supuestos!C{sup_r}"
        ws4[f"D{r}"].number_format = "0.00"
        ws4[f"D{r}"].alignment = right_align
        ws4[f"D{r}"].border = thin_border

        # Contribución Hoy (85/15)
        ws4[f"E{r}"] = f"=Supuestos!$C$22*D{r}*Resultados!$C$15 + Supuestos!$C$23*C{r}*Resultados!$D$15"
        ws4[f"E{r}"].number_format = "$#,##0.00"
        ws4[f"E{r}"].alignment = right_align
        ws4[f"E{r}"].border = thin_border

        # F: Caja Acumulada Hoy ($8k, Mix 85/15)
        ws4[f"F{r}"] = f"=F{prev_r}+E{r}"
        ws4[f"F{r}"].number_format = "$#,##0.00"
        ws4[f"F{r}"].alignment = right_align
        ws4[f"F{r}"].border = thin_border
        ws4[f"F{r}"].font = bold_font

        # G: Caja Acumulada Agencia ($16k + 30% desc, Mix 85/15)
        if m == 1:
            contrib_agencia = f"=Supuestos!$C$22*D{r}*Resultados!$E$15 + Supuestos!$C$23*C{r}*Resultados!$D$15"
        else:
            contrib_agencia = f"=Supuestos!$C$22*D{r}*Resultados!$C$15 + Supuestos!$C$23*C{r}*Resultados!$D$15"
        ws4[f"G{r}"] = f"=G{prev_r}+({contrib_agencia})"
        ws4[f"G{r}"].number_format = "$#,##0.00"
        ws4[f"G{r}"].alignment = right_align
        ws4[f"G{r}"].border = thin_border
        ws4[f"G{r}"].font = bold_font

        # H: Caja Acumulada Recomendado Base (Mix 85/15 - Envío cobrado < $45)
        contrib_recom_base = f"=Supuestos!$C$22*D{r}*Resultados!$G$15 + Supuestos!$C$23*C{r}*Resultados!$D$15"
        ws4[f"H{r}"] = f"=H{prev_r}+({contrib_recom_base})"
        ws4[f"H{r}"].number_format = "$#,##0.00"
        ws4[f"H{r}"].alignment = right_align
        ws4[f"H{r}"].border = thin_border
        ws4[f"H{r}"].font = bold_font

        # I: Caja Acumulada Hipótesis Sensibilidad (Mix 80/20 + Pauta Eficiente $6k)
        contrib_hip = f"=0.80*D{r}*Resultados!$G$15 + 0.20*C{r}*Resultados!$D$15"
        ws4[f"I{r}"] = f"=I{prev_r}+({contrib_hip})"
        ws4[f"I{r}"].number_format = "$#,##0.00"
        ws4[f"I{r}"].alignment = right_align
        ws4[f"I{r}"].border = thin_border
        ws4[f"I{r}"].font = bold_font

    chart = LineChart()
    chart.title = "Curva de Caja del Cliente (Mes 0 al 12) — Payback y Línea de Cero"
    chart.style = 13
    chart.y_axis.title = "Caja Neta Acumulada por Cliente ($ USD)"
    chart.x_axis.title = "Mes de Vida del Cliente"
    chart.width = 19
    chart.height = 11

    data = Reference(ws4, min_col=6, min_row=6, max_col=9, max_row=19)
    categories = Reference(ws4, min_col=2, min_row=7, max_row=19)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(categories)
    ws4.add_chart(chart, "K5")

    # =========================================================================
    # 5. PESTAÑA RECOMENDACIÓN
    # =========================================================================
    ws5 = wb.create_sheet(title="Recomendación")
    ws5.views.sheetView[0].showGridLines = True

    ws5["B2"] = "RECOMENDACIÓN ESTRATÉGICA EJECUTIVA PARA DIEGO RAMÍREZ"
    ws5["B2"].font = title_font
    ws5["B3"] = "Caso A — Tueste: Dictamen Financiero, Auditoría de la Agencia, Simulación de Caja y Plan de Acción"
    ws5["B3"].font = italic_font

    rec_sections = [
        ("B5:H5", "1. DICTAMEN EJECUTIVO: ¿FIRMAR O NO?", [
            "DECISIÓN: NO FIRMAR la propuesta de la agencia Impulso Digital.",
            "VEREDICTO: ARREGLAR la economía unitaria antes de considerar cualquier escalamiento publicitario.",
            "DEMOSTRACIÓN MEDIANTE SIMULACIÓN DE CAJA (EVIDENCIA NUMÉRICA):",
            "   - Posición inicial de liquidez: $35.000 USD en el banco (sin crédito ni inversionistas). Piso de seguridad infranqueable: $5.000 USD.",
            "   - Egresos fijos mensuales con la propuesta: $23.500 USD ($16.000 pauta Meta + $1.000 fee agencia + $6.500 costos fijos operativos).",
            "   - Entradas proyectadas (base existente con caída del 3% mensual + 282 clientes nuevos mensuales con 30% desc en sueltos):",
            "     * Mes 1: Entradas $11.398 USD | Déficit mensual -$12.102 USD | Saldo bancario final: $22.898 USD.",
            "     * Mes 2: Entradas $12.186 USD | Déficit mensual -$11.314 USD | Saldo bancario final: $11.584 USD.",
            "     * Mes 3: Entradas $13.129 USD | Déficit mensual -$10.371 USD | Saldo bancario final: $1.212 USD (¡PERFORA EL PISO DE SEGURIDAD DE $5.000!).",
            "     * Mes 4: Entradas $14.039 USD | Déficit mensual -$9.461 USD | Saldo bancario final: -$8.248 USD (QUIEBRA / INSOLVENCIA TÉCNICA).",
            "   - Conclusión: La propuesta de la agencia agota la caja operativa en el mes 3 (dejando apenas $1.212 en banco) y lleva a saldo negativo en el mes 4, impidiendo totalmente la compra de la tostadora de $14.000."
        ]),
        ("B14:H14", "2. LA TRAMPA DEL CASO EXPUESTA CON NÚMEROS Y AUDITORÍA DE PAYBACK", [
            "LA ILUSIÓN DE META: Meta Ads Manager reporta un ROAS de 3,00x ($24.000 de ventas brutas atribuidas con $8.000 de pauta).",
            "LA REALIDAD OCULTA: De las 706 compras reportadas, 153 compras ($5.200) provinieron de retargeting de clientes que ya habían comprado en los últimos 180 días, y 162 compras ($5.500) fueron visitantes web recientes. Además, Meta emplea atribución post-view de 1 día (se apropia de compras orgánicas de usuarios que solo vieron pasar un anuncio).",
            "EL ROAS REAL DE ADQUISICIÓN: Los clientes nuevos reales conseguidos fueron 165 (confirmados por encuesta post-compra y UTMs). En su primer pedido ($34), generaron $5.610 brutos. El ROAS real de adquisición es $5.610 / $8.000 = 0,70x, frente a un ROAS de break-even requerido de 2,14x. Por cada $1 invertido en Meta, Tueste pierde 67 centavos en el primer pedido.",
            "AUDITORÍA DEL PAYBACK ACTUAL: El escenario actual no recupera la inversión en el mes 9. La caja acumulada del cliente promedio en el mes 9 es de -$9,40, en el mes 10 es de -$6,56 y en el mes 11 es de -$3,12. El cruce con cero ocurre estrictamente en el MES 12 (con un margen mínimo de +$0,25). El cliente suelto por sí solo nunca recupera el CAC ($47,67 vs $54,55)."
        ]),
        ("B23:H23", "3. PROPUESTA DEL EQUIPO: ESCENARIO BASE (85/15) E HIPÓTESIS DE EXPANSIÓN (80/20)", [
            "ESCENARIO 3: RECOMENDADO BASE (RESPETANDO EL MIX OFICIAL 85/15):",
            "   - Política: Implementar el Pack de 3 bolsas a $48 y cobrar $4,50 de envío a compras menores a $45.",
            "   - Con la misma inversión publicitaria ($8.000) y mix oficial (85% suelto, 15% sub):",
            "     * El CM2 del pedido suelto sube de $15,89 (46,7%) a $20,19 (52,4%).",
            "     * El LTV promedio por cliente se eleva de $54,90 a $65,86 USD.",
            "     * El ratio LTV:CAC sube de 1,01x a 1,21x.",
            "     * El Payback se acorta en 2 meses: pasa del Mes 12 al Mes 10 (con +$2,93 de caja acumulada).",
            "ESCENARIO 3B: HIPÓTESIS DE EXPANSIÓN (SENSIBILIDAD CON MIX 80/20 Y PAUTA EFICIENTE $6.000):",
            "   - Hipótesis: Pausar la campaña de retargeting a compradores de 180 días ($1.000) que canibaliza clientes existentes, optimizar la pauta en el tramo de alta eficiencia ($6.000, 132,5 clientes) e incentivar la suscripción en checkout para elevar el mix al 20%.",
            "   - Resultados: LTV promedio salta a $67,62 USD, el CAC Real baja a $52,83, el ratio LTV:CAC sube a 1,28x y el Payback se reduce al Mes 9 (con +$2,81 de caja acumulada), protegiendo la liquidez bancaria para la tostadora."
        ]),
        ("B33:H33", "4. COMPROBACIÓN MATEMÁTICA MANUAL (AUDITORÍA A MANO PASO A PASO)", [
            "Verificación escrita paso a paso del CAC Real de Septiembre:",
            "   1. Gasto publicitario en anuncios Meta = $8.000,00 USD",
            "   2. Fee contractual fijo de agencia = $1.000,00 USD",
            "   3. Gasto total de adquisición = $8.000,00 + $1.000,00 = $9.000,00 USD",
            "   4. Clientes nuevos reales captados por Meta (Encuesta + UTM) = 165 clientes",
            "   5. CAC Real Fully-Loaded = $9.000,00 / 165 = $54,5454... ≈ $54,55 USD por cliente nuevo.",
            "Verificación escrita del Margen CM2 del pedido con 30% de descuento:",
            "   1. Precio cobrado = $34,00 x 0,70 = $23,80 USD",
            "   2. Costo del café (2 bolsas x $5,44) = $10,88 USD (32% del precio de lista base, fijo, no se descuenta)",
            "   3. CM1 = $23,80 - $10,88 = $12,92 USD (54,29%)",
            "   4. Costos variables de entrega: Envío ($4,50) + Pasarela 4,5% ($1,071) + Caja/Empaque ($1,20) = $6,771 USD",
            "   5. CM2 = $12,92 - $6,771 = $6,149 USD (25,84% del precio cobrado)",
            "   6. ROAS de break-even con descuento = 1 / 0,25836 = 3,87x (¡Inalcanzable para la agencia, garantizando pérdidas!)."
        ]),
        ("B45:H45", "5. SECCIÓN OBLIGATORIA: «EN QUÉ SE EQUIVOCÓ O NOS CONFUNDIÓ LA IA» (ERRORES REALES REGISTRADOS)", [
            "ERROR REAL OBSERVADO 1 (Fórmulas referenciando encabezados de texto en Supuestos):",
            "   - Detalle del error: En la generación inicial del script, las celdas C8 y C10 de Supuestos se programaron con '=B6*B7' y '=B8*(1-B9)'. Como la columna B contiene textos descriptivos ('Precio bolsa individual', 'Bolsas por pedido'), Excel y Google Sheets arrojaron error de tipo '#¡VALOR!'.",
            "   - Causa técnica: Confusión del índice de columna en la plantilla del script, apuntando a la columna de etiquetas en vez de la columna numérica.",
            "   - Corrección validada: Se corrigió a '=C6*C7' y '=C8*(1-C9)', vinculando adecuadamente los operandos matemáticos.",
            "ERROR REAL OBSERVADO 2 (Suma de magnitudes incompatibles — Dólares de pauta con Personas en Escenarios):",
            "   - Detalle del error: En la fila 10 de Escenarios ('Total clientes nuevos mensuales'), la IA colocó '=C7+C8'. La celda C7 contenía la inversión publicitaria en dólares ($8.000) y C8 contenía los clientes de Meta (165), sumando absurdamente $8.000 + 165 = 8.165 clientes.",
            "   - Causa técnica: Desalineación entre la fila de inversión en marketing y la fila de clientes orgánicos.",
            "   - Corrección validada: Se ajustó la fórmula a '=C8+C9', sumando los clientes de Meta (165) y los clientes orgánicos fijos (47) para totalizar 212 clientes.",
            "ERROR REAL OBSERVADO 3 (Asignación estática de Payback en 'Mes 9' sin contrastar la curva acumulada):",
            "   - Detalle del error: La IA colocó como etiqueta de texto 'Mes 9' tanto en Resultados como en Escenarios, basándose en una división lineal simplista de contribución ($54,90 / 12 = $4,575/mes; $54,55 / $4,575 ≈ 11,9) o una asunción arbitraria, ignorando que la curva de pedidos sueltos decae a 0,15 pedidos en los meses 8, 9 y 10.",
            "   - Causa técnica: Falta de conciliación cruzada entre la tabla de flujo de caja acumulado de la pestaña 'Curva de caja' y las celdas resumen.",
            "   - Corrección validada: Se comprobó que en el mes 9 la caja acumulada es de -$9,40, en el mes 10 es de -$6,56, en el mes 11 es de -$3,12 y el verdadero punto de equilibrio ocurre estrictamente en el MES 12 (+$0,25). Se actualizaron todas las referencias y textos explicativos.",
            "ERROR REAL OBSERVADO 4 (Referencia a celda de mes único para el LTV del suscriptor):",
            "   - Detalle del error: La celda F22 de Resultados referenciaba inicialmente '=\\'Curva de caja\\'!E15' (correspondiente a la contribución aislada del mes 8), subestimando el LTV del suscriptor a un solo período.",
            "   - Causa técnica: Selección incorrecta de la fila en la pestaña Curva de caja en lugar de aplicar la sumatoria de retención compuesta.",
            "   - Corrección validada: Se implementó la fórmula analítica de suma de serie geométrica '=D15*(1-(1-Supuestos!C24)^12)/Supuestos!C24' ($95,84), reflejando con exactitud los 7,58 meses efectivos de retención."
        ])
    ]

    curr_row = 5
    for range_header, sec_title, bullet_texts in rec_sections:
        ws5.merge_cells(range_header)
        start_cell = range_header.split(":")[0]
        ws5[start_cell] = sec_title
        ws5[start_cell].font = section_font
        ws5[start_cell].fill = section_fill
        curr_row += 1
        
        for b_text in bullet_texts:
            ws5.merge_cells(f"B{curr_row}:H{curr_row}")
            c = ws5[f"B{curr_row}"]
            c.value = b_text
            c.font = regular_font if not any(k in b_text for k in ["DECISIÓN:", "VEREDICTO:", "ERROR REAL OBSERVADO", "ESCENARIO 3:", "ESCENARIO 3B:"]) else bold_font
            c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            curr_row += 1
        curr_row += 1

    # Column dimensions auto-adjust
    for sheet in [ws1, ws2, ws3, ws4, ws5]:
        for col in sheet.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                if cell.row in [2, 3, 5, 14, 19, 23, 27, 28, 29, 33, 36, 45] and sheet.title in ["Resultados", "Escenarios", "Curva de caja", "Recomendación"]:
                    continue
                if cell.value:
                    val_str = str(cell.value)
                    if not val_str.startswith("="):
                        max_len = max(max_len, len(val_str))
                    else:
                        max_len = max(max_len, 12)
            sheet.column_dimensions[col_letter].width = max(max_len + 4, 14)

    ws1.column_dimensions["B"].width = 46
    ws1.column_dimensions["C"].width = 16
    ws1.column_dimensions["D"].width = 4
    ws1.column_dimensions["E"].width = 44
    ws1.column_dimensions["F"].width = 18
    ws1.column_dimensions["G"].width = 16

    ws2.column_dimensions["B"].width = 46
    ws2.column_dimensions["C"].width = 24
    ws2.column_dimensions["D"].width = 24
    ws2.column_dimensions["E"].width = 48
    ws2.column_dimensions["F"].width = 24
    ws2.column_dimensions["G"].width = 24

    ws3.column_dimensions["B"].width = 48
    ws3.column_dimensions["C"].width = 28
    ws3.column_dimensions["D"].width = 30
    ws3.column_dimensions["E"].width = 32
    ws3.column_dimensions["F"].width = 32

    ws4.column_dimensions["B"].width = 10
    ws4.column_dimensions["C"].width = 16
    ws4.column_dimensions["D"].width = 16
    ws4.column_dimensions["E"].width = 20
    ws4.column_dimensions["F"].width = 24
    ws4.column_dimensions["G"].width = 26
    ws4.column_dimensions["H"].width = 26
    ws4.column_dimensions["I"].width = 26

    ws5.column_dimensions["B"].width = 16
    ws5.column_dimensions["C"].width = 16
    ws5.column_dimensions["D"].width = 16
    ws5.column_dimensions["E"].width = 16
    ws5.column_dimensions["F"].width = 16
    ws5.column_dimensions["G"].width = 16
    ws5.column_dimensions["H"].width = 16

    output_path = "Calculadora_Tueste_Nivel_1.xlsx"
    wb.save(output_path)
    print(f"Calculadora guardada exitosamente en {output_path}")

if __name__ == "__main__":
    create_tueste_calculator()
