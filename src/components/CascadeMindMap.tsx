import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  NodeProps,
} from '@xyflow/react';
import { CASCADE_MIND_MAPS, DISRUPTION_EVENTS } from '../data/geospatialData';
import { CascadeNodeDetail } from '../types';
import { 
  GitFork, 
  Layers, 
  ShieldAlert, 
  DollarSign, 
  FileText, 
  Building2, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Clock, 
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';

interface CascadeMindMapProps {
  initialScenarioId?: string;
  onOpenRerouteWorkflow?: () => void;
}

// Custom Node for React Flow
const CascadeCustomNode = ({ data, selected }: NodeProps) => {
  const detail = data.detail as CascadeNodeDetail;

  const stageBadgeColors: Record<string, string> = {
    'Trigger': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    '1st Order': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    '2nd Order': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    '3rd Order': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'Terminal Impact': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  };

  const criticalityBorder: Record<string, string> = {
    'critical': 'border-rose-500 shadow-rose-950/50',
    'high': 'border-amber-500 shadow-amber-950/50',
    'medium': 'border-slate-700 shadow-slate-950/50',
  };

  return (
    <div
      className={`w-72 rounded-xl bg-[#0e1628] border-2 ${
        selected ? 'ring-2 ring-cyan-400 border-cyan-400' : criticalityBorder[detail.criticality] || 'border-slate-700'
      } shadow-2xl p-3.5 transition-all cursor-pointer hover:border-cyan-400`}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-2.5 !h-2.5" />
      
      {/* Node Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
          stageBadgeColors[detail.stage] || 'bg-slate-800 text-slate-300 border-slate-700'
        }`}>
          {detail.stage}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {detail.category}
        </span>
      </div>

      {/* Node Title & Description */}
      <h4 className="text-xs font-bold text-white leading-snug mb-1.5">
        {detail.title}
      </h4>
      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
        {detail.description}
      </p>

      {/* Node Value at Risk Pill */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1 text-slate-400">
          <DollarSign className="h-3 w-3 text-rose-400" />
          <span className="font-mono font-semibold text-rose-300">{detail.totalValueAtRisk}</span>
        </div>
        {detail.impactedPurchaseOrders.length > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 text-[10px] font-mono">
            {detail.impactedPurchaseOrders.length} POs Stranded
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !w-2.5 !h-2.5" />
    </div>
  );
};

export const CascadeMindMap: React.FC<CascadeMindMapProps> = ({
  initialScenarioId = 'red-sea-kinetic-strikes',
  onOpenRerouteWorkflow,
}) => {
  const [activeScenario, setActiveScenario] = useState<string>(
    CASCADE_MIND_MAPS[initialScenarioId] ? initialScenarioId : 'red-sea-kinetic-strikes'
  );
  const [selectedNode, setSelectedNode] = useState<CascadeNodeDetail | null>(null);
  const [customScenarioQuery, setCustomScenarioQuery] = useState('');
  const [generatingCustom, setGeneratingCustom] = useState(false);
  const [nodeList, setNodeList] = useState<CascadeNodeDetail[]>(
    CASCADE_MIND_MAPS[initialScenarioId] || CASCADE_MIND_MAPS['red-sea-kinetic-strikes']
  );

  const nodeTypes = useMemo(() => ({ cascadeNode: CascadeCustomNode }), []);

  // Compute Layout Positions (Tree structure: Root -> 1st Order -> 2nd Order -> 3rd Order -> Terminal)
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = nodeList.map((detail, index) => {
      // Coordinate layout logic
      let x = 300;
      let y = 50;

      if (detail.stage === 'Trigger') {
        x = 350;
        y = 50;
      } else if (detail.stage === '1st Order') {
        x = 350;
        y = 230;
      } else if (detail.stage === '2nd Order') {
        // Spread 2nd order nodes horizontally
        const order2Nodes = nodeList.filter(n => n.stage === '2nd Order');
        const posInStage = order2Nodes.findIndex(n => n.id === detail.id);
        x = 120 + posInStage * 380;
        y = 420;
      } else if (detail.stage === '3rd Order') {
        x = 180;
        y = 620;
      } else if (detail.stage === 'Terminal Impact') {
        x = 450;
        y = 800;
      } else {
        x = 250 + (index % 3) * 320;
        y = 100 + Math.floor(index / 3) * 220;
      }

      return {
        id: detail.id,
        type: 'cascadeNode',
        position: { x, y },
        data: { detail },
      };
    });

    // Build Directed Edges according to standard cascade lineage
    const edges: any[] = [];
    for (let i = 0; i < nodeList.length - 1; i++) {
      const current = nodeList[i];
      const next = nodeList[i + 1];

      // Connect if chronological or logically linked
      if (current && next) {
        edges.push({
          id: `edge-${current.id}-${next.id}`,
          source: current.id,
          target: next.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#06b6d4', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#06b6d4',
          },
        });
      }
    }

    // If there are multiple 2nd order nodes, connect 1st order to all of them
    const firstOrder = nodeList.find(n => n.stage === '1st Order');
    const secondOrders = nodeList.filter(n => n.stage === '2nd Order');
    if (firstOrder && secondOrders.length > 1) {
      secondOrders.forEach(sec => {
        const edgeId = `edge-${firstOrder.id}-${sec.id}`;
        if (!edges.some(e => e.id === edgeId)) {
          edges.push({
            id: edgeId,
            source: firstOrder.id,
            target: sec.id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#06b6d4', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
          });
        }
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [nodeList]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when nodeList changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle Scenario Switching
  const handleSelectScenario = (scenarioKey: string) => {
    setActiveScenario(scenarioKey);
    const selected = CASCADE_MIND_MAPS[scenarioKey] || CASCADE_MIND_MAPS['red-sea-kinetic-strikes'];
    setNodeList(selected);
    setSelectedNode(selected[1] || selected[0]);
  };

  // Generate Custom Cascade with Gemini API
  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customScenarioQuery.trim() || generatingCustom) return;

    setGeneratingCustom(true);
    try {
      const response = await fetch('/api/cascade-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioName: customScenarioQuery }),
      });

      if (response.ok) {
        const generatedNodes = await response.json();
        if (Array.isArray(generatedNodes) && generatedNodes.length > 0) {
          setNodeList(generatedNodes);
          setSelectedNode(generatedNodes[0]);
          setActiveScenario('custom');
        }
      }
    } catch (err) {
      console.error('Custom cascade generation error:', err);
    } finally {
      setGeneratingCustom(false);
    }
  };

  const handleNodeClick = useCallback((_: any, node: any) => {
    const detail = node.data?.detail as CascadeNodeDetail;
    if (detail) {
      setSelectedNode(detail);
    }
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-105px)] bg-[#070b13] flex flex-col overflow-hidden">
      {/* Top Controls Bar */}
      <div className="p-3 border-b border-slate-800 bg-[#0d1424] flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <GitFork className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Cascading Geopolitical Impact Visualizer
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                React Flow Multi-Tier Engine
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive node lineage: [Trigger] &rarr; [Strait Closure] &rarr; [Cape Rerouting] &rarr; [Port Congestion] &rarr; [Plant Stoppages]
            </p>
          </div>
        </div>

        {/* Pre-mapped Scenario Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium hidden md:inline">Scenarios:</span>
          <button
            onClick={() => handleSelectScenario('red-sea-kinetic-strikes')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeScenario === 'red-sea-kinetic-strikes'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Red Sea Missile Fallout
          </button>
          <button
            onClick={() => handleSelectScenario('panama-drought-crisis')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeScenario === 'panama-drought-crisis'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Panama Drought Restriction
          </button>
        </div>

        {/* Custom AI Cascade Generator Input */}
        <form onSubmit={handleGenerateCustom} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={customScenarioQuery}
              onChange={(e) => setCustomScenarioQuery(e.target.value)}
              placeholder="e.g. Taiwan Strait Naval Quarantine..."
              className="w-56 md:w-64 bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={generatingCustom || !customScenarioQuery.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs transition-colors"
          >
            {generatingCustom ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                <span>AI Generate</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Main Split View: React Flow Canvas on Left / Drilldown Drawer on Right */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* React Flow Graph Area */}
        <div className="flex-1 h-full bg-[#080d19]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.8}
          >
            <Background color="#1e293b" gap={24} size={1} />
            <Controls />
            <MiniMap 
              nodeColor={(n: any) => {
                const detail = n.data?.detail as CascadeNodeDetail;
                if (detail?.criticality === 'critical') return '#ef4444';
                if (detail?.criticality === 'high') return '#f59e0b';
                return '#3b82f6';
              }} 
            />
          </ReactFlow>
        </div>

        {/* Right Drill-Down Drawer (PO & Contract Inspection) */}
        {selectedNode && (
          <div className="w-96 md:w-[420px] h-full border-l border-slate-800 bg-[#0c1322] flex flex-col z-20 shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 bg-[#0f172a] flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    selectedNode.criticality === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {selectedNode.stage} • {selectedNode.criticality} Risk
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedNode.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Description */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 leading-relaxed text-xs">
                {selectedNode.description}
              </div>

              {/* High-Level Exposure Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Value at Risk</div>
                  <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
                    {selectedNode.totalValueAtRisk}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Impacted MSAs / Contracts</div>
                  <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
                    {selectedNode.impactedContractsCount} Legal Pacts
                  </div>
                </div>
              </div>

              {/* Impacted Purchase Orders Drill-Down */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-rose-400" />
                    Impacted Purchase Orders ({selectedNode.impactedPurchaseOrders.length})
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Live ERP Audit</span>
                </div>

                {selectedNode.impactedPurchaseOrders.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedNode.impactedPurchaseOrders.map((po) => (
                      <div
                        key={po.id}
                        className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono font-bold text-white text-xs px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                            {po.id}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            po.status === 'Stranded'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : po.status === 'Delayed'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}>
                            {po.status}
                          </span>
                        </div>

                        <div className="font-semibold text-slate-200 text-xs mb-1">
                          {po.item}
                        </div>

                        <div className="text-[11px] text-slate-400 mb-2">
                          Vendor: <strong className="text-slate-300">{po.vendor}</strong>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[11px] pt-2 border-t border-slate-800 text-slate-400">
                          <div>
                            Value: <strong className="text-rose-300 font-mono">{po.poValue}</strong>
                          </div>
                          <div className="text-right">
                            Delay: <strong className="text-amber-300 font-mono">{po.delayEstimate}</strong>
                          </div>
                          <div className="col-span-2 text-[10px] text-slate-500 truncate mt-0.5">
                            Dest: {po.facility}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
                    Root geopolitical trigger node. Drill down into downstream 1st, 2nd, and 3rd order nodes to inspect stranded component POs.
                  </div>
                )}
              </div>

              {/* Contingency Actions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Prescribed Mitigation Directives
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.contingencyActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Workflow Button */}
              {onOpenRerouteWorkflow && (
                <button
                  onClick={onOpenRerouteWorkflow}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/30 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Execute AI Rerouting Playbook for this Node</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
