import React, { useState, useEffect } from 'react';
import { DisruptionEvent, ChokePoint } from '../types';
import { 
  Sparkles, 
  AlertOctagon, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  GitFork, 
  ArrowRight, 
  Send, 
  Layers, 
  FileText,
  Activity,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react';

interface DisruptionIntelligencePanelProps {
  event: DisruptionEvent;
  chokePoint?: ChokePoint;
  onOpenCascade: (eventId: string) => void;
  onOpenRerouteWorkflow: (event: DisruptionEvent) => void;
  onClose?: () => void;
}

export const DisruptionIntelligencePanel: React.FC<DisruptionIntelligencePanelProps> = ({
  event,
  chokePoint,
  onOpenCascade,
  onOpenRerouteWorkflow,
  onClose,
}) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiSummary, setAiSummary] = useState<string>(event.summary);
  const [sentimentScore, setSentimentScore] = useState<number>(event.geopoliticalSentimentScore);
  const [aiInsights, setAiInsights] = useState<string[]>(event.recommendedPlaybooks);
  const [queryHistory, setQueryHistory] = useState<{ query: string; answer: string }[]>([]);

  // Automatically request Gemini API analysis on event load
  useEffect(() => {
    let isMounted = true;
    async function fetchAiIntelligence() {
      setLoadingAI(true);
      try {
        const response = await fetch('/api/disruption-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ incidentId: event.id }),
        });
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            if (data.executiveSummary) setAiSummary(data.executiveSummary);
            if (data.geopoliticalSentiment) setSentimentScore(data.geopoliticalSentiment);
            if (data.aiInsights) setAiInsights(data.aiInsights);
          }
        }
      } catch (err) {
        console.warn('AI analysis fallback engaged:', err);
      } finally {
        if (isMounted) setLoadingAI(false);
      }
    }

    fetchAiIntelligence();
    return () => { isMounted = false; };
  }, [event.id]);

  const handleCustomAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || loadingAI) return;

    const userQuery = customPrompt.trim();
    setCustomPrompt('');
    setLoadingAI(true);

    try {
      const response = await fetch('/api/disruption-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: event.id,
          userPrompt: userQuery,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQueryHistory(prev => [
          ...prev,
          {
            query: userQuery,
            answer: data.executiveSummary || 'Scenario simulation processed with real-time routing indices.',
          },
        ]);
        if (data.aiInsights && data.aiInsights.length > 0) {
          setAiInsights(data.aiInsights);
        }
      }
    } catch (err) {
      console.error('Custom query error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0b101b] border-l border-slate-800 text-slate-200 overflow-y-auto">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-[#0e1626] sticky top-0 z-10 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              event.severity === 'critical'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {event.severity} Disruption
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {event.id.toUpperCase()}
            </span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            {event.title}
          </h2>
          <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
            <span>{event.location}</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono text-[11px]">{event.dateReported}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-5">
        {/* Geopolitical Sentiment Score Gauge */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-[#101726] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Geopolitical Sentiment & Threat Index
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">
              {sentimentScore} / 100
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
              style={{ width: `${sentimentScore}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>0 (Equilibrium)</span>
            <span>50 (Volatile)</span>
            <span className="text-rose-400 font-bold">100 (Kinetic Interdiction)</span>
          </div>
        </div>

        {/* Executive Summary (Gemini 3.8 Flash Driven) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>Gemini 3.8 Flash Contextual Intelligence</span>
            </div>
            {loadingAI && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                <RefreshCw className="h-3 w-3 animate-spin" /> Synthesizing...
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {aiSummary}
          </p>
        </div>

        {/* Economic Impact & Spot Freight Volatility Metrics */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-rose-400" />
            Freight Toll & Spot Freight Volatility
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Spot Freight Rate Surge</div>
              <div className="text-lg font-bold font-mono text-rose-400 mt-1">
                +{event.spotFreightImpact.containerIndexDeltaPercent}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Container TEU spot index</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Mean Lead Time Delay</div>
              <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                +{event.spotFreightImpact.delayDaysAvg} Days
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Per individual vessel voyage</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Daily Trade Toll</div>
              <div className="text-sm font-bold font-mono text-rose-300 mt-1">
                {event.spotFreightImpact.dailyTradeLossEstimated}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Global stalled commerce</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">War-Risk Insurance Hike</div>
              <div className="text-sm font-bold font-mono text-amber-300 mt-1">
                +{event.spotFreightImpact.insuranceWarRiskHikePercent}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Underwriter surcharges</div>
            </div>
          </div>
        </div>

        {/* Affected Commodity HS Codes */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            Impacted Commodity HS Codes (Harmonized Tariff System)
          </h3>
          <div className="space-y-1.5">
            {event.hsCodes.map((hs, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-[11px]">
                    {hs.code}
                  </span>
                  <span className="text-slate-200 text-xs font-medium">{hs.name}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  hs.priority === 'Critical'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : hs.priority === 'High'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {hs.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Root Cause Deconstruction */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <AlertOctagon className="h-3.5 w-3.5 text-amber-400" />
            Root Cause Deconstruction
          </h3>
          <div className="space-y-2">
            {event.rootCauses.map((rc, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/90 text-xs">
                <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  {rc.category}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {rc.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Timeline & Escalation Risk */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              Estimated Normalcy Recovery Window
            </span>
            <span className="font-mono text-cyan-300 font-bold">
              ~{event.recoveryTimeline.expectedDays} Days
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mb-2">
            Confidence Range: <strong className="text-slate-200">{event.recoveryTimeline.confidenceInterval}</strong>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
            <span className="text-slate-400">Escalation Probability:</span>
            <span className="font-mono font-bold text-rose-400">
              {event.recoveryTimeline.escalationRiskPercent}%
            </span>
          </div>
        </div>

        {/* Action Playbook CTAs */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => onOpenCascade(event.id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/40 transition-colors"
          >
            <GitFork className="h-4 w-4" />
            <span>Open Cascading Impact Mind Map (React Flow)</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </button>

          <button
            onClick={() => onOpenRerouteWorkflow(event)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-medium text-xs transition-colors"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Launch AI Rerouting Simulation & Legal Notices</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </button>
        </div>

        {/* Interactive Follow-Up AI Query */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Ask Gemini Operational Questions</span>
          </div>

          <form onSubmit={handleCustomAiQuery} className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Impact on German auto assembly lines?"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loadingAI || !customPrompt.trim()}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Send className="h-3 w-3" />
            </button>
          </form>

          {/* User Query History */}
          {queryHistory.length > 0 && (
            <div className="mt-3 space-y-2">
              {queryHistory.map((q, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
                  <div className="text-cyan-300 font-medium mb-1">Q: {q.query}</div>
                  <div className="text-slate-300 leading-relaxed">{q.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
