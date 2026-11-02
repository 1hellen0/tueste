import openpyxl

def test_workbook():
    wb = openpyxl.load_workbook("Calculadora_Tueste_Nivel_1.xlsx", data_only=False)
    sheet_names = wb.sheetnames
    print(f"Hojas encontradas ({len(sheet_names)}): {sheet_names}")
    
    expected_sheets = ["Supuestos", "Resultados", "Escenarios", "Curva de caja", "Recomendación"]
    for s in expected_sheets:
        assert s in sheet_names, f"Falta la hoja obligatoria: {s}"
    print("[OK] Todas las 5 hojas obligatorias existen.")

    # 1. Verificar Supuestos
    ws_sup = wb["Supuestos"]
    assert ws_sup["C6"].value == 17.00, f"Error en precio bolsa: {ws_sup['C6'].value}"
    assert ws_sup["C7"].value == 2, f"Error en bolsas pedido: {ws_sup['C7'].value}"
    assert ws_sup["C8"].value == "=C6*C7", f"Error en fórmula C8: {ws_sup['C8'].value}"
    assert ws_sup["C10"].value == "=C8*(1-C9)", f"Error en fórmula C10: {ws_sup['C10'].value}"
    assert ws_sup["C14"].value == 5.44, f"Error en costo café bolsa: {ws_sup['C14'].value}"
    assert ws_sup["C15"].value == "=C14*C7", f"Error en costo café pedido: {ws_sup['C15'].value}"
    assert ws_sup["C16"].value == 4.50, f"Error en costo envío: {ws_sup['C16'].value}"
    assert ws_sup["C17"].value == 0.045, f"Error en pasarela: {ws_sup['C17'].value}"
    assert ws_sup["C18"].value == 1.20, f"Error en empaque: {ws_sup['C18'].value}"
    assert ws_sup["C22"].value == 0.85, f"Error en mix sueltos: {ws_sup['C22'].value}"
    assert ws_sup["C23"].value == 0.15, f"Error en mix suscriptores: {ws_sup['C23'].value}"
    assert ws_sup["C24"].value == 0.09, f"Error en churn: {ws_sup['C24'].value}"
    assert ws_sup["C42"].value == "=SUM(C30:C41)", f"Error en suma pedidos sueltos: {ws_sup['C42'].value}"
    
    # Comprobar valores de calendario suelto
    cal_values = [ws_sup[f"C{r}"].value for r in range(30, 42)]
    assert sum(cal_values) == 3.00, f"Los pedidos sueltos no suman 3.00: {sum(cal_values)}"
    print("[OK] Hoja Supuestos validada exitosamente (Calendario suma exactamente 3.00 pedidos).")

    # 2. Verificar Resultados
    ws_res = wb["Resultados"]
    assert ws_res["C7"].value == "=Supuestos!C8"
    assert ws_res["C9"].value == "=C7-C8"
    assert ws_res["C15"].value == "=C9-C14"
    assert ws_res["C16"].value == "=C15/C7"
    assert ws_res["C17"].value == "=1/C16"
    
    # CAC y ROAS
    assert ws_res["C23"].value == "=C20/C21"
    assert ws_res["C24"].value == "=(C20+C22)/C21"
    assert ws_res["C26"].value == "=(C21*Supuestos!C8)/C20"
    
    # LTV y Payback
    assert ws_res["F20"].value == "=C15*Supuestos!C26"
    assert ws_res["F22"].value == "=D15*(1-(1-Supuestos!C24)^12)/Supuestos!C24"
    assert ws_res["F23"].value == "=Supuestos!C22*F20+Supuestos!C23*F22"
    assert ws_res["F25"].value == "=F23/F24"
    assert "No recupera en 12m" in ws_res["F27"].value, f"F27 incorrecto: {ws_res['F27'].value}"
    assert "Mes 12" in ws_res["F28"].value, f"F28 incorrecto: {ws_res['F28'].value}"
    print("[OK] Hoja Resultados validada exitosamente (Payback corregido a Mes 12).")

    # 3. Verificar Escenarios
    ws_esc = wb["Escenarios"]
    assert "HOY" in ws_esc["C6"].value
    assert "AGENCIA" in ws_esc["D6"].value
    assert "RECOMENDADO BASE" in ws_esc["E6"].value and "85/15" in ws_esc["E6"].value
    assert "HIPÓTESIS SENSIBILIDAD" in ws_esc["F6"].value and "80/20" in ws_esc["F6"].value
    
    # Total clientes fórmula de suma de personas, no dólares
    assert ws_esc["C10"].value == "=C8+C9", f"Error en fórmula C10 de Escenarios: {ws_esc['C10'].value}"
    assert ws_esc["D10"].value == "=D8+D9", f"Error en fórmula D10 de Escenarios: {ws_esc['D10'].value}"
    assert ws_esc["E10"].value == "=E8+E9", f"Error en fórmula E10 de Escenarios: {ws_esc['E10'].value}"
    assert ws_esc["F10"].value == "=F8+F9", f"Error en fórmula F10 de Escenarios: {ws_esc['F10'].value}"
    
    # Payback por escenario
    assert ws_esc["C28"].value == "Mes 12", f"Payback Hoy erróneo: {ws_esc['C28'].value}"
    assert ws_esc["D28"].value == "No recupera en 12m", f"Payback Agencia erróneo: {ws_esc['D28'].value}"
    assert ws_esc["E28"].value == "Mes 10", f"Payback Recom Base erróneo: {ws_esc['E28'].value}"
    assert ws_esc["F28"].value == "Mes 9", f"Payback Hipótesis erróneo: {ws_esc['F28'].value}"
    print("[OK] Hoja Escenarios validada exitosamente (Base 85/15 separado de Hipótesis 80/20).")

    # 4. Verificar Curva de Caja
    ws_curva = wb["Curva de caja"]
    assert ws_curva["F7"].value == "=-Escenarios!C22"
    assert ws_curva["G7"].value == "=-Escenarios!D22"
    assert ws_curva["H7"].value == "=-Escenarios!E22"
    assert ws_curva["I7"].value == "=-Escenarios!F22"
    assert len(ws_curva._charts) > 0, "No se encontró el gráfico embebido en Curva de caja."
    chart = ws_curva._charts[0]
    assert chart.title is not None, "El gráfico no tiene título configurado."
    print("[OK] Hoja Curva de caja validada exitosamente (4 columnas y gráfico embebido).")

    # 5. Verificar Recomendación
    ws_rec = wb["Recomendación"]
    rec_texts = []
    for r in range(5, 75):
        cell_val = ws_rec[f"B{r}"].value
        if cell_val:
            rec_texts.append(str(cell_val))
    full_rec = " ".join(rec_texts)
    
    assert "NO FIRMAR" in full_rec, "Falta decisión NO FIRMAR."
    assert "ARREGLAR" in full_rec, "Falta veredicto ARREGLAR."
    assert "$1.212" in full_rec, "Falta cifra de saldo bancario Mes 3 ($1.212)."
    assert "-$8.248" in full_rec, "Falta cifra de saldo bancario Mes 4 (-$8.248)."
    assert "ERROR REAL OBSERVADO 1" in full_rec, "Falta Error 1."
    assert "ERROR REAL OBSERVADO 2" in full_rec, "Falta Error 2."
    assert "ERROR REAL OBSERVADO 3" in full_rec, "Falta Error 3."
    assert "ERROR REAL OBSERVADO 4" in full_rec, "Falta Error 4."
    print("[OK] Hoja Recomendación validada exitosamente (Simulación de caja y errores reales presentes).")

    print("\n=======================================================")
    print("TODAS LAS PRUEBAS DE ESTRUCTURA Y CONSISTENCIA PASARON AL 100%.")
    print("=======================================================")

if __name__ == "__main__":
    test_workbook()
