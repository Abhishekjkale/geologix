import React from 'react';
import { ShieldCheck, AlertTriangle, Globe2, ArrowRight } from 'lucide-react';
import { PersonaType } from '../types';

interface PersonaBannerProps {
  persona: PersonaType;
  onNavigateToTab: (tab: 'canvas' | 'intelligence' | 'cascade' | 'workflows') => void;
}

export const PersonaBanner: React.FC<PersonaBannerProps> = ({ persona, onNavigateToTab }) => {
  if (persona === 'cro') {
    return (
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-b border-rose-900/40 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <span className="font-semibold text-rose-300">Chief Risk Officer Lens:</span>{' '}
            <span className="text-slate-300">
              Board Exposure Audit: <strong className="text-white">$142.8M</strong> at risk across active maritime transit.
              Tier-2 semiconductor origins in Taiwan & East Asia face 40-day delivery uncertainty.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('workflows')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-600/30 text-rose-200 border border-rose-500/40 hover:bg-rose-600/50 transition-colors font-medium text-[11px]"
          >
            Draft Board Risk Memo <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  if (persona === 'logistics_director') {
    return (
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border-b border-cyan-900/40 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <span className="font-semibold text-cyan-300">Global Logistics Director Lens:</span>{' '}
            <span className="text-slate-300">
              OTIF Delivery Protection: Cape bypass adding <strong className="text-white">+13.5 days</strong> transit latency.
              Rotterdam terminal yard utilization at 92%; recommend early rail feeder dispatch.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('workflows')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-600/50 transition-colors font-medium text-[11px]"
          >
            Simulate Cape Bypass Reroute <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-b border-amber-900/40 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="p-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Globe2 className="h-4 w-4" />
        </span>
        <div>
          <span className="font-semibold text-amber-300">Sovereign Logistics & Trade Planner Lens:</span>{' '}
          <span className="text-slate-300">
            Strategic Reserves Alert: 21% of global petroleum transits through Hormuz (Risk 91/100). Black Sea grain corridors under war-risk surcharges.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigateToTab('intelligence')}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600/30 text-amber-200 border border-amber-500/40 hover:bg-amber-600/50 transition-colors font-medium text-[11px]"
        >
          Inspect Choke-Point Buffers <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
