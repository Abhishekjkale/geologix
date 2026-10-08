import React, { useState } from 'react';
import { Header } from './components/Header';
import { PersonaBanner } from './components/PersonaBanner';
import { GeospatialCanvas } from './components/GeospatialCanvas';
import { DisruptionIntelligencePanel } from './components/DisruptionIntelligencePanel';
import { CascadeMindMap } from './components/CascadeMindMap';
import { AiWorkflowsStudio } from './components/AiWorkflowsStudio';
import { DISRUPTION_EVENTS, CHOKE_POINTS } from './data/geospatialData';
import { DisruptionEvent, ChokePoint, PersonaType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'intelligence' | 'cascade' | 'workflows'>('canvas');
  const [persona, setPersona] = useState<PersonaType>('cro');
  const [selectedEvent, setSelectedEvent] = useState<DisruptionEvent>(DISRUPTION_EVENTS[0]);
  const [selectedChokePoint, setSelectedChokePoint] = useState<ChokePoint | undefined>(CHOKE_POINTS[0]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [selectedCascadeScenario, setSelectedCascadeScenario] = useState<string>('red-sea-kinetic-strikes');

  const handleSelectEvent = (event: DisruptionEvent) => {
    setSelectedEvent(event);
    if (event.chokePointId) {
      const cp = CHOKE_POINTS.find(c => c.id === event.chokePointId);
      if (cp) setSelectedChokePoint(cp);
    }
    setIsSidePanelOpen(true);
  };

  const handleSelectChokePoint = (cp: ChokePoint) => {
    setSelectedChokePoint(cp);
    const relatedEvent = DISRUPTION_EVENTS.find(e => e.chokePointId === cp.id);
    if (relatedEvent) {
      setSelectedEvent(relatedEvent);
    }
    setIsSidePanelOpen(true);
  };

  const handleOpenCascade = (eventId: string) => {
    setSelectedCascadeScenario(eventId);
    setActiveTab('cascade');
  };

  const handleOpenRerouteWorkflow = (event: DisruptionEvent) => {
    setSelectedEvent(event);
    setActiveTab('workflows');
  };

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Enterprise Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        persona={persona}
        setPersona={setPersona}
      />

      {/* Role-Specific Tactical Lens Banner */}
      <PersonaBanner
        persona={persona}
        onNavigateToTab={setActiveTab}
      />

      {/* Main View Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {/* VIEW 1: GEOSPATIAL CANVAS (MAP + DOCKABLE INTELLIGENCE PANEL) */}
        {activeTab === 'canvas' && (
          <div className="flex-1 flex overflow-hidden relative">
            <div className="flex-1 h-full">
              <GeospatialCanvas
                onSelectEvent={handleSelectEvent}
                selectedEventId={selectedEvent?.id}
                onSelectChokePoint={handleSelectChokePoint}
                selectedChokePointId={selectedChokePoint?.id}
              />
            </div>

            {/* Dockable Slide-over Intelligence Panel */}
            {isSidePanelOpen && selectedEvent && (
              <div className="w-96 md:w-[440px] h-[calc(100vh-105px)] shrink-0 z-30 shadow-2xl transition-all">
                <DisruptionIntelligencePanel
                  event={selectedEvent}
                  chokePoint={selectedChokePoint}
                  onOpenCascade={handleOpenCascade}
                  onOpenRerouteWorkflow={handleOpenRerouteWorkflow}
                  onClose={() => setIsSidePanelOpen(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: DEDICATED AI INTELLIGENCE ENGINE */}
        {activeTab === 'intelligence' && (
          <div className="flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full p-4">
            {/* Quick Event Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-medium whitespace-nowrap">Focus Incident:</span>
              {DISRUPTION_EVENTS.map(e => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEvent(e)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    selectedEvent.id === e.id
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {e.title.split(' ')[0]} {e.title.split(' ')[1]}
                  <span className="ml-1.5 font-mono text-[10px] text-rose-400">{e.geopoliticalSentimentScore}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <DisruptionIntelligencePanel
                event={selectedEvent}
                chokePoint={selectedChokePoint}
                onOpenCascade={handleOpenCascade}
                onOpenRerouteWorkflow={handleOpenRerouteWorkflow}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: CASCADE MIND MAP (REACT FLOW) */}
        {activeTab === 'cascade' && (
          <CascadeMindMap
            initialScenarioId={selectedCascadeScenario}
            onOpenRerouteWorkflow={() => setActiveTab('workflows')}
          />
        )}

        {/* VIEW 4: AUTOMATED AI RISK WORKFLOWS & NOTICES */}
        {activeTab === 'workflows' && (
          <AiWorkflowsStudio
            initialEvent={selectedEvent}
          />
        )}
      </main>
    </div>
  );
}
