import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ValueAlerts from './components/ValueAlerts';
import KpiGrid from './components/KpiGrid';
import ControlPanel from './components/ControlPanel';
import ChartsSection from './components/ChartsSection';
import ScenarioComparisonTable from './components/ScenarioComparisonTable';
import CompanyCashSimulation from './components/CompanyCashSimulation';
import AiErrorsSection from './components/AiErrorsSection';
import ManualAuditModal from './components/ManualAuditModal';
import CohortSimulator24M from './components/CohortSimulator24M';

import { 
  DEFAULT_PARAMETERS, 
  PRESET_SCENARIOS, 
  calculateDashboardMetrics 
} from './utils/financialFormulas';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentScenario, setCurrentScenario] = useState('HOY');
  const [params, setParams] = useState(PRESET_SCENARIOS.HOY.params);
  const [isCustomized, setIsCustomized] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Recálculo dinámico instantáneo con useMemo
  const metrics = useMemo(() => {
    return calculateDashboardMetrics(params);
  }, [params]);

  // Manejador para cambiar de escenario predefinido
  const handleSelectScenario = (scenarioId) => {
    const sc = PRESET_SCENARIOS[scenarioId];
    if (sc) {
      setCurrentScenario(scenarioId);
      setParams({ ...sc.params });
      setIsCustomized(false);
    }
  };

  // Manejador para cambiar un parámetro individual en los sliders
  const handleParamChange = (key, value) => {
    setParams((prev) => ({
      ...prev,
      [key]: value
    }));
    setIsCustomized(true);
  };

  // Restaurar valores oficiales de septiembre (Hoy)
  const handleResetParams = () => {
    setCurrentScenario('HOY');
    setParams({ ...PRESET_SCENARIOS.HOY.params });
    setIsCustomized(false);
  };

  return (
    <div className="flex h-screen bg-forest-950 text-cream-100 font-sans overflow-hidden">
      {/* Barra lateral de navegación */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        metrics={metrics} 
      />

      {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header 
          currentScenario={currentScenario}
          onSelectScenario={handleSelectScenario}
          onResetParams={handleResetParams}
          onOpenAuditModal={() => setIsAuditModalOpen(true)}
          isCustomized={isCustomized}
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Tab 1: Tablero Principal */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <ValueAlerts 
                metrics={metrics} 
                currentScenario={currentScenario} 
                params={params} 
              />

              <KpiGrid 
                metrics={metrics} 
                params={params} 
              />

              <ControlPanel 
                params={params} 
                onChangeParam={handleParamChange} 
              />

              {/* Vista previa de gráficos en el dashboard */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-cream-100 tracking-tight">
                    Visualizaciones Clave de Unit Economics
                  </h3>
                  <button
                    onClick={() => setActiveTab('charts')}
                    className="text-xs text-gold-400 hover:text-gold-300 font-semibold transition"
                  >
                    Ver los 4 gráficos en detalle →
                  </button>
                </div>
                <ChartsSection metrics={metrics} params={params} />
              </div>
            </div>
          )}

          {/* Tab Nivel 3: Simulador Oficial 24 Meses por Cohortes */}
          {activeTab === 'cohort_simulator' && (
            <div className="space-y-6">
              <CohortSimulator24M />
            </div>
          )}

          {/* Tab 2: Gráficos & Trampa ROAS */}
          {activeTab === 'charts' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-forest-900 border border-forest-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-cream-100 text-lg">Visualizaciones Obligatorias de Nivel 2</h3>
                  <p className="text-xs text-cream-400 mt-0.5">
                    Curva de caja mes a mes, LTV vs CAC, Saturación de Meta y la Brecha de la Trampa del ROAS
                  </p>
                </div>
              </div>
              <ChartsSection metrics={metrics} params={params} />
            </div>
          )}

          {/* Tab 3: Matriz de Escenarios */}
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <ScenarioComparisonTable 
                onSelectScenario={handleSelectScenario}
                customMetrics={metrics}
                customParams={params}
              />
            </div>
          )}

          {/* Tab 4: Simulación de Caja */}
          {activeTab === 'cash_simulation' && (
            <div className="space-y-6">
              <CompanyCashSimulation 
                metrics={metrics} 
                params={params} 
              />
            </div>
          )}

          {/* Tab 5: Auditoría & Errores IA */}
          {activeTab === 'ai_audit' && (
            <div className="space-y-6">
              <AiErrorsSection />
            </div>
          )}
        </main>
      </div>

      {/* Modal de Auditoría a Mano */}
      <ManualAuditModal 
        isOpen={isAuditModalOpen} 
        onClose={() => setIsAuditModalOpen(false)} 
      />
    </div>
  );
}
