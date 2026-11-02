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
import PublicStoreView from './components/store/PublicStoreView';
import CommercialHub from './components/commercial/CommercialHub';
import AuraDashboardHero from './components/aura/AuraDashboardHero';

import { 
  DEFAULT_PARAMETERS, 
  PRESET_SCENARIOS, 
  calculateDashboardMetrics 
} from './utils/financialFormulas';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const v = new URLSearchParams(window.location.search).get('view');
      if (v === 'admin') return 'admin';
    }
    return 'store';
  }); // 'store' por defecto según el requisito
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

  // Si la vista actual es la tienda pública (vista inicial por defecto)
  if (currentView === 'store') {
    return (
      <PublicStoreView 
        onGoToAdmin={() => setCurrentView('admin')} 
      />
    );
  }

  // Vista de Administración Rediseñada al Estilo AURA ROAST (Fase E1)
  return (
    <div className="flex h-screen bg-aura-bg text-aura-cream font-sans overflow-hidden">
      {/* Barra lateral de navegación vertical (AURA ROAST Icon Rail) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        metrics={metrics}
        onGoToStore={() => setCurrentView('store')}
      />

      {/* Área de contenido principal con atmósfera espresso y cobre */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-aura-bg aura-container">
        <Header 
          currentScenario={currentScenario}
          onSelectScenario={handleSelectScenario}
          onResetParams={handleResetParams}
          onOpenAuditModal={() => setIsAuditModalOpen(true)}
          isCustomized={isCustomized}
          onGoToStore={() => setCurrentView('store')}
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Tab 1: Tablero Principal (Composición AURA ROAST Fiel) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <ValueAlerts 
                metrics={metrics} 
                currentScenario={currentScenario} 
                params={params} 
              />

              {/* HÉROE AURA ROAST: Syphon Apparatus + Lot Blend Matrix + Roast Optimization Rate + Variety Log + Profile Optimizer */}
              <AuraDashboardHero 
                metrics={metrics}
                params={params}
                onChangeParam={handleParamChange}
                onOpenAuditModal={() => setIsAuditModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />

              {/* Módulos de Detalle: KPIs y Sliders Completos */}
              <div className="space-y-6 pt-6 border-t border-aura-border/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-aura-cream">
                      Métricas Unitarias Detalladas (CM1, CM2, CAC, LTV)
                    </h3>
                    <p className="text-xs text-aura-textMuted">
                      Fórmulas oficiales del Caso A - Tueste validadas al 100%.
                    </p>
                  </div>
                </div>

                <KpiGrid 
                  metrics={metrics} 
                  params={params} 
                />

                <ControlPanel 
                  params={params} 
                  onChangeParam={handleParamChange} 
                />

                {/* Vista previa de gráficos Recharts en el dashboard */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-base font-bold text-aura-cream tracking-tight">
                      Visualizaciones Clave de Unit Economics
                    </h3>
                    <button
                      onClick={() => setActiveTab('charts')}
                      className="text-xs text-aura-gold hover:text-aura-goldGlow font-semibold transition flex items-center gap-1"
                    >
                      <span>Ver los 4 gráficos en detalle</span>
                      <span>→</span>
                    </button>
                  </div>
                  <ChartsSection metrics={metrics} params={params} />
                </div>
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
              <div className="p-4 rounded-xl aura-surface border border-aura-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-aura-cream text-lg font-serif">Visualizaciones Obligatorias de Nivel 2</h3>
                  <p className="text-xs text-aura-textMuted mt-0.5">
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

          {/* Sección de Gestión Comercial (Fase D) */}
          {activeTab.startsWith('commercial_') && (
            <div className="space-y-6">
              <CommercialHub 
                initialSubtab={activeTab.replace('commercial_', '')} 
                onGoToStore={() => setCurrentView('store')}
              />
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
