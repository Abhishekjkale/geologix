import React, { useState } from 'react';
import { 
  SAMPLE_REROUTE_SIMULATION, 
  SAMPLE_NOTICES, 
  CHOKE_POINTS 
} from '../data/geospatialData';
import { RerouteSimulationResult, SupplierNoticeDraft, DisruptionEvent } from '../types';
import { 
  Sparkles, 
  Ship, 
  Clock, 
  DollarSign, 
  TrendingDown, 
  FileCheck2, 
  Copy, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Download,
  Fuel,
  CloudRain,
  Compass
} from 'lucide-react';

interface AiWorkflowsStudioProps {
  initialEvent?: DisruptionEvent | null;
}

export const AiWorkflowsStudio: React.FC<AiWorkflowsStudioProps> = ({ initialEvent }) => {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'reroute' | 'scoring' | 'notices'>('reroute');

  // Reroute Simulator State
  const [originPort, setOriginPort] = useState('Shanghai (Yangshan Deep-Water), China');
  const [destPort, setDestPort] = useState('Rotterdam (Maasvlakte II), Netherlands');
  const [commodity, setCommodity] = useState('Automotive Parts & Microelectronics (HS 8708 / HS 8542)');
  const [avoidChoke, setAvoidChoke] = useState('Bab-el-Mandeb Strait & Suez Canal');
  const [vesselType, setVesselType] = useState('Ultra Large Container Vessel (20,000 TEU)');
  const [simResult, setSimResult] = useState<RerouteSimulationResult>(SAMPLE_REROUTE_SIMULATION);
  const [simulating, setSimulating] = useState(false);

  // Dynamic Route Scoring State
  const [scoreOrigin, setScoreOrigin] = useState('East Asia (Shenzhen/Shanghai)');
  const [scoreDestination] = useState('Northern Europe (Rotterdam/Hamburg)');
  const [transitDaysInput, setTransitDaysInput] = useState(24);
  const [selectedChokeExposure, setSelectedChokeExposure] = useState<string[]>(['bab-el-mandeb', 'suez-canal']);
  const [cargoValueAtRiskUsd, setCargoValueAtRiskUsd] = useState(85); // Millions

  // Supplier Notice Generator State
  const [noticeType, setNoticeType] = useState<'force_majeure' | 'carrier_directive' | 'air_freight_hedge' | 'executive_board_memo'>('force_majeure');
  const [recipient, setRecipient] = useState('Global OEM Manufacturing Partners & Logistics Consortia');
  const [contractRef, setContractRef] = useState('Master Supply Agreement § 18.2');
  const [generatingNotice, setGeneratingNotice] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<SupplierNoticeDraft>(SAMPLE_NOTICES[0]);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Execute Gemini Simulation for Alternative Routing
  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);

    try {
      const response = await fetch('/api/simulate-reroute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: originPort,
          destination: destPort,
          commodityType: commodity,
          avoidChokePoint: avoidChoke,
          vesselClass: vesselType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSimResult(data);
      }
    } catch (err) {
      console.error('Reroute simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  // Generate Notice via Gemini API
  const handleGenerateNotice = async () => {
    setGeneratingNotice(true);
    try {
      const response = await fetch('/api/generate-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noticeType,
          incidentTitle: initialEvent?.title || 'Bab-el-Mandeb Kinetic Strikes & Maritime Insecurity',
          affectedCorridor: 'Asia-Europe Maritime Highway',
          cargoCategory: commodity,
          contractRef,
          recipientOrg: recipient,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentNotice(data);
      }
    } catch (err) {
      console.error('Notice generator error:', err);
    } finally {
      setGeneratingNotice(false);
    }
  };

  // Copy notice text to clipboard
  const handleCopyNotice = () => {
    navigator.clipboard.writeText(`${currentNotice.title}\n\nSubject: ${currentNotice.subject}\nDate: ${currentNotice.date}\nContract: ${currentNotice.contractReference}\nLegal Basis: ${currentNotice.legalBasis}\n\n${currentNotice.content}\n\nSign-off: ${currentNotice.signoffRole}`);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  // Dynamic Route Risk Score computation (0 - 100)
  const calculatedRiskScore = Math.min(100, Math.round(
    (selectedChokeExposure.reduce((acc, id) => {
      const cp = CHOKE_POINTS.find(c => c.id === id);
      return acc + (cp ? cp.currentRiskScore : 30);
    }, 0) / Math.max(1, selectedChokeExposure.length)) * 0.7 +
    (transitDaysInput > 20 ? 15 : 5) +
    (cargoValueAtRiskUsd > 50 ? 15 : 5)
  ));

  return (
    <div className="w-full h-[calc(100vh-105px)] bg-[#080d17] flex flex-col overflow-y-auto text-slate-200">
      {/* Top Workflow Tabs Bar */}
      <div className="p-3 border-b border-slate-800 bg-[#0c1322] flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Automated AI Risk Workflows & Decision Playbooks
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Gemini 3.8 Flash Powered
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              PRD FR-4: Alternative routing simulation, dynamic 0-100 vulnerability indexing, and one-click contractual notice drafting.
            </p>
          </div>
        </div>

        {/* Workflow Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveWorkflowTab('reroute')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-medium ${
              activeWorkflowTab === 'reroute'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ship className="h-3.5 w-3.5" />
            <span>Alternative Routing Simulator</span>
          </button>

          <button
            onClick={() => setActiveWorkflowTab('scoring')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-medium ${
              activeWorkflowTab === 'scoring'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Dynamic Route Risk Indexing</span>
          </button>

          <button
            onClick={() => setActiveWorkflowTab('notices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-medium ${
              activeWorkflowTab === 'notices'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Supplier & Legal Notice Generator</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-5 flex-1 max-w-7xl w-full mx-auto">
        {/* ===================== TAB 1: ALTERNATIVE ROUTING SIMULATOR ===================== */}
        {activeWorkflowTab === 'reroute' && (
          <div className="space-y-6">
            {/* Input Configuration Panel */}
            <form onSubmit={handleRunSimulation} className="p-4 rounded-xl bg-[#0f1728] border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-cyan-400" />
                  Bypass Route Parameter Configuration
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Bunker Base: $620/MT VLSFO</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Origin Port</label>
                  <input
                    type="text"
                    value={originPort}
                    onChange={(e) => setOriginPort(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Destination Port</label>
                  <input
                    type="text"
                    value={destPort}
                    onChange={(e) => setDestPort(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Commodity / Cargo Class</label>
                  <input
                    type="text"
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Choke-Point Avoidance</label>
                  <input
                    type="text"
                    value={avoidChoke}
                    onChange={(e) => setAvoidChoke(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  Vessel Class: <strong className="text-slate-200">{vesselType}</strong>
                </div>
                <button
                  type="submit"
                  disabled={simulating}
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition-colors"
                >
                  {simulating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Computing Hydrodynamic & Risk Deltas...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                      <span>Simulate Alternative Bypass with Gemini</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Side-by-Side Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Corrupted Route Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/20 via-[#0e1628] to-[#0f172a] border border-rose-900/40 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase font-bold">
                      Primary Corrupted Corridor
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {simResult.originalRouteName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Vulnerability Score</div>
                    <div className="text-xl font-bold font-mono text-rose-400">
                      {simResult.originalRiskScore} / 100
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-3 border-y border-slate-800/80">
                  <div>
                    <div className="text-[10px] text-slate-400">Voyage Distance</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">
                      {simResult.originalNauticalMiles.toLocaleString()} NM
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Transit Duration</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">
                      {simResult.originalTransitDays} Days
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Choke-Point Toll</div>
                    <div className="font-mono font-bold text-rose-300 mt-0.5">
                      +$420,000 (Suez Fee)
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-rose-300/90 leading-relaxed flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>Subject to kinetic missile interception, high-risk insurance premiums, and unpredictable convoy holding delays.</span>
                </div>
              </div>

              {/* Strategic Bypass Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/20 via-[#0e1628] to-[#0f172a] border border-cyan-800/40 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-bold">
                      Recommended Strategic Bypass
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {simResult.bypassRouteName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Vulnerability Score</div>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      {simResult.bypassRiskScore} / 100
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-3 border-y border-slate-800/80">
                  <div>
                    <div className="text-[10px] text-slate-400">Voyage Distance</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">
                      {simResult.bypassNauticalMiles.toLocaleString()} NM
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Transit Duration</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">
                      {simResult.bypassTransitDays} Days
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Canal Toll Saved</div>
                    <div className="font-mono font-bold text-emerald-300 mt-0.5">
                      -$420,000 Saved
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-emerald-300/90 leading-relaxed flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Zero kinetic conflict exposure. Complete predictability for supply chain scheduling and customer OTIF metrics.</span>
                </div>
              </div>
            </div>

            {/* Critical Financial & Operational Deltas (PRD Core Metrics) */}
            <div className="p-4 rounded-xl bg-[#0e1628] border border-slate-800 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-cyan-400" />
                Comparative Trade-Off Analytics (Delta Breakdown)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Transit Delta</div>
                  <div className="text-base font-bold font-mono text-amber-400 mt-1">
                    +{simResult.transitDaysDelta} Days
                  </div>
                  <div className="text-[10px] text-slate-500">Lead time extension</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Distance Delta</div>
                  <div className="text-base font-bold font-mono text-slate-200 mt-1">
                    +{simResult.distanceDeltaMiles.toLocaleString()} NM
                  </div>
                  <div className="text-[10px] text-slate-500">Extra nautical miles</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Bunker Fuel Burn</div>
                  <div className="text-base font-bold font-mono text-rose-400 mt-1">
                    +${(simResult.fuelCostDeltaUsd / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-slate-500">Extra marine fuel</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Voyage Cost</div>
                  <div className="text-base font-bold font-mono text-cyan-400 mt-1">
                    +${(simResult.netVoyageCostDeltaUsd / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-slate-500">Toll savings offset</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Risk Reduction</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                    -{simResult.riskReductionPoints} Pts
                  </div>
                  <div className="text-[10px] text-slate-500">92 &rarr; 22 safety score</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">CO2 Emissions</div>
                  <div className="text-base font-bold font-mono text-slate-300 mt-1">
                    +{simResult.carbonEmissionsDeltaTons.toLocaleString()} t
                  </div>
                  <div className="text-[10px] text-slate-500">Scope 3 carbon delta</div>
                </div>
              </div>
            </div>

            {/* AI Executive Recommendation */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-[#10192e] to-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Gemini AI Strategic Recommendation for Chief Risk Officer & Logistics Director</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {simResult.executiveRecommendation}
              </p>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Actionable Operational Mitigations:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {simResult.keyMitigations.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: DYNAMIC ROUTE RISK SCORING ===================== */}
        {activeWorkflowTab === 'scoring' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#0f1728] border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-cyan-400" />
                    Dynamic 0-100 Route Vulnerability Index Calculator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time exposure modeling factoring choke-point transit duration, cargo criticality, and regional stability.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Composite Risk Score</div>
                  <div className={`text-2xl font-bold font-mono ${
                    calculatedRiskScore > 80 ? 'text-rose-400' : calculatedRiskScore > 60 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {calculatedRiskScore} / 100
                  </div>
                </div>
              </div>

              {/* Slider for Transit Days Exposure */}
              <div className="space-y-4 pt-3 border-t border-slate-800">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Estimated Voyage Transit Duration (Days):</span>
                    <span className="font-mono font-bold text-cyan-400">{transitDaysInput} Days</span>
                  </div>
                  <input
                    type="range"
                    min={7}
                    max={50}
                    value={transitDaysInput}
                    onChange={(e) => setTransitDaysInput(Number(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>7 Days (Express)</span>
                    <span>24 Days (Standard Suez)</span>
                    <span>37+ Days (Cape Bypass)</span>
                  </div>
                </div>

                {/* Slider for Cargo Value */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Total Cargo Consignment Value at Risk:</span>
                    <span className="font-mono font-bold text-rose-400">${cargoValueAtRiskUsd}M USD</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={250}
                    value={cargoValueAtRiskUsd}
                    onChange={(e) => setCargoValueAtRiskUsd(Number(e.target.value))}
                    className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>$5M (Bulk)</span>
                    <span>$85M (Auto & Electronics)</span>
                    <span>$250M (Semiconductor Machinery)</span>
                  </div>
                </div>

                {/* Choke Point Checkboxes */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Traversed Strategic Choke-Points:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {CHOKE_POINTS.map(cp => {
                      const isChecked = selectedChokeExposure.includes(cp.id);
                      return (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setSelectedChokeExposure(selectedChokeExposure.filter(id => id !== cp.id));
                            } else {
                              setSelectedChokeExposure([...selectedChokeExposure, cp.id]);
                            }
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            isChecked
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="font-semibold text-[11px] truncate">{cp.name}</div>
                          <div className="text-[10px] font-mono mt-0.5">
                            Risk Index: {cp.currentRiskScore}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Summary Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Vulnerability Assessment Summary
              </h4>
              <p className="text-slate-300 leading-relaxed mb-3">
                {calculatedRiskScore > 75 ? (
                  <>CRITICAL RISK: Route crosses high-threat kinetic zones with an aggregate exposure score of {calculatedRiskScore}/100. Recommend immediate carrier diversion or insurance hedging.</>
                ) : calculatedRiskScore > 50 ? (
                  <>ELEVATED CONGESTION RISK: Route exhibits moderate operational bottlenecks with an exposure score of {calculatedRiskScore}/100. Secondary buffer inventory required.</>
                ) : (
                  <>OPTIMAL SECURE CORRIDOR: Minimal kinetic conflict exposure ({calculatedRiskScore}/100). Low vulnerability audit verified.</>
                )}
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span>Active Audit Nodes: 7</span>
                <span>•</span>
                <span>100% Auditability Standard Satisfied</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: SUPPLIER & LEGAL NOTICE GENERATOR ===================== */}
        {activeWorkflowTab === 'notices' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#0f1728] border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-cyan-400" />
                    One-Click Contractual Notice & Legal Action Generator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Draft enforceable Force Majeure notices, carrier divert directives, and C-suite briefings with Gemini AI.
                  </p>
                </div>
                <button
                  onClick={handleGenerateNotice}
                  disabled={generatingNotice}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 transition-colors shadow-lg shadow-cyan-900/30"
                >
                  {generatingNotice ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Drafting Legal Document...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                      <span>Regenerate with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Notice Type Selector Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <button
                  onClick={() => {
                    setNoticeType('force_majeure');
                    const found = SAMPLE_NOTICES.find(n => n.type === 'force_majeure');
                    if (found) setCurrentNotice(found);
                  }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                    noticeType === 'force_majeure'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <div className="font-bold">1. Force Majeure Notice</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">UN CISG Art. 79 & BIMCO</div>
                </button>

                <button
                  onClick={() => {
                    setNoticeType('carrier_directive');
                    const found = SAMPLE_NOTICES.find(n => n.type === 'carrier_directive');
                    if (found) setCurrentNotice(found);
                  }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                    noticeType === 'carrier_directive'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <div className="font-bold">2. Carrier Divert Directive</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Mandatory Cape bypass order</div>
                </button>

                <button
                  onClick={() => {
                    setNoticeType('air_freight_hedge');
                    const found = SAMPLE_NOTICES.find(n => n.type === 'air_freight_hedge') || {
                      ...SAMPLE_NOTICES[0],
                      type: 'air_freight_hedge',
                      title: 'Emergency Air-Freight Hedging Authorization',
                      subject: 'INTERNAL ACTION: Air-Freight Carve-Out for Critical Semiconductors (HS 8542)',
                      legalBasis: 'Corporate Logistics Emergency Expenditure Delegation § 4.3',
                      content: `MEMORANDUM FOR SUPPLY CHAIN FINANCE:

Authorize immediate transfer of $2,400,000 from oceanic contingency reserves to charter Antonov AN-124 cargo aircraft from Penang to Frankfurt.

This air bridge hedges 142,000 ASML stepper processor units, preventing an estimated $34M assembly line stoppage at European automotive plants.`,
                      signoffRole: 'VP of Global Supply Chain & Logistics Operations',
                    };
                    setCurrentNotice(found);
                  }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                    noticeType === 'air_freight_hedge'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <div className="font-bold">3. Air-Freight Hedge Memo</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Emergency chip airlift bridge</div>
                </button>

                <button
                  onClick={() => {
                    setNoticeType('executive_board_memo');
                    const found = SAMPLE_NOTICES.find(n => n.type === 'executive_board_memo');
                    if (found) setCurrentNotice(found);
                  }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                    noticeType === 'executive_board_memo'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <div className="font-bold">4. Executive Board Briefing</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">CRO margin preservation brief</div>
                </button>
              </div>

              {/* Document Meta Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Recipient Organization / Entity</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Contract / MSA Reference Clause</label>
                  <input
                    type="text"
                    value={contractRef}
                    onChange={(e) => setContractRef(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Rendered Notice Preview Box */}
              <div className="p-4 rounded-xl bg-[#090e18] border border-slate-800 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {currentNotice.title}
                    </h4>
                    <div className="text-[11px] text-cyan-400 mt-0.5 font-mono">
                      Legal Basis: {currentNotice.legalBasis}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyNotice}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      {copiedNotice ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedNotice ? 'Copied to Clipboard' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 mb-4 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
                  <div><strong className="text-slate-300">SUBJECT:</strong> {currentNotice.subject}</div>
                  <div><strong className="text-slate-300">DATE:</strong> {currentNotice.date}</div>
                  <div><strong className="text-slate-300">RECIPIENT:</strong> {recipient || currentNotice.recipient}</div>
                  <div><strong className="text-slate-300">CONTRACT REF:</strong> {contractRef || currentNotice.contractReference}</div>
                </div>

                {/* Preformatted Document Content */}
                <textarea
                  value={currentNotice.content}
                  onChange={(e) => setCurrentNotice({ ...currentNotice, content: e.target.value })}
                  rows={14}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500 resize-y"
                />

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <div>
                    Authorizing Sign-off: <strong className="text-slate-200">{currentNotice.signoffRole}</strong>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Enforceable Under International Trade Law
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
