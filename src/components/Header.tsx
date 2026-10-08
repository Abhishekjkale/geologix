import React from 'react';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  GitFork, 
  Sparkles, 
  Compass, 
  Activity, 
  UserCheck,
  TrendingDown,
  Clock,
  DollarSign
} from 'lucide-react';
import { PersonaType } from '../types';

interface HeaderProps {
  activeTab: 'canvas' | 'intelligence' | 'cascade' | 'workflows';
  setActiveTab: (tab: 'canvas' | 'intelligence' | 'cascade' | 'workflows') => void;
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  persona,
  setPersona,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0c121e]/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Bar with Branding & Global Risk Metrics */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-900/30">
            <Compass className="h-5 w-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">GeoLogix</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AI v1.0
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">• Geopolitical Supply Chain Risk Intelligence</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live AIS & Kinetic Feeds Active
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">SOC 2 Type II Encrypted</span>
            </div>
          </div>
        </div>

        {/* PRD Executive KPIs */}
        <div className="hidden lg:flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800">
            <DollarSign className="h-4 w-4 text-rose-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Suez Blockage Toll</div>
              <div className="font-mono font-bold text-rose-300">$9.6B / Day</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Choke Vulnerability</div>
              <div className="font-mono font-bold text-amber-300">68% Traversed</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800">
            <Clock className="h-4 w-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Target MTTR</div>
              <div className="font-mono font-bold text-cyan-300">&lt;2h (vs &gt;72h)</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Margin Preservation</div>
              <div className="font-mono font-bold text-emerald-300">+25% Early Reroute</div>
            </div>
          </div>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-1 px-2 text-slate-400 text-[11px] font-medium hidden md:flex">
            <UserCheck className="h-3.5 w-3.5 text-slate-400" />
            Persona:
          </div>
          <button
            onClick={() => setPersona('cro')}
            className={`px-2.5 py-1 rounded transition-all font-medium ${
              persona === 'cro'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chief Risk Officer: Margin stability & board accountability"
          >
            Chief Risk Officer
          </button>
          <button
            onClick={() => setPersona('logistics_director')}
            className={`px-2.5 py-1 rounded transition-all font-medium ${
              persona === 'logistics_director'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Global Logistics Director: OTIF delivery & canal closures"
          >
            Logistics Director
          </button>
          <button
            onClick={() => setPersona('sovereign_planner')}
            className={`px-2.5 py-1 rounded transition-all font-medium ${
              persona === 'sovereign_planner'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Sovereign Logistics & Trade Planner: Strategic national reserves & international straits"
          >
            Sovereign Planner
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'canvas'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MapIcon className="h-4 w-4" />
            <span>Geospatial Canvas (Google Maps)</span>
          </button>

          <button
            onClick={() => setActiveTab('intelligence')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'intelligence'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>AI Disruption Intelligence</span>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
          </button>

          <button
            onClick={() => setActiveTab('cascade')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'cascade'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitFork className="h-4 w-4" />
            <span>Visual Impact Mind Maps (React Flow)</span>
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'workflows'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Risk Workflows & Legal Notices</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="hidden sm:inline text-slate-500">Gemini 3.8 Flash Engine</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            60 FPS Ready
          </span>
        </div>
      </div>
    </header>
  );
};
