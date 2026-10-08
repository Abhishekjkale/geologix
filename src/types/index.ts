export type PersonaType = 'cro' | 'logistics_director' | 'sovereign_planner';

export type DisruptionSeverity = 'critical' | 'high' | 'medium' | 'low';
export type DisruptionType = 'kinetic' | 'climate' | 'piracy' | 'regulatory' | 'infrastructure';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TradeCorridor {
  id: string;
  name: string;
  mode: 'maritime' | 'rail' | 'multimodal' | 'bypass';
  origin: string;
  destination: string;
  path: LatLng[];
  status: 'optimal' | 'congested' | 'compromised' | 'active_bypass';
  riskScore: number; // 0-100
  annualVolumeTEU: string;
  avgTransitDays: number;
  chokePointsTraversed: string[];
  color: string;
  description: string;
}

export interface ChokePoint {
  id: string;
  name: string;
  region: string;
  coordinates: LatLng;
  bufferRadiusKm: number;
  strategicImportance: string;
  globalTradeSharePercent: number;
  dailyVesselTransit: number;
  currentRiskScore: number; // 0-100
  militaryThreatIndex: 'Low' | 'Moderate' | 'High' | 'Severe';
  status: 'open' | 'restricted' | 'impaired' | 'closed';
  keyCommodities: string[];
  geofencePolygon?: LatLng[];
  historicalPrecedents: string;
}

export interface DisruptionEvent {
  id: string;
  title: string;
  location: string;
  coordinates: LatLng;
  chokePointId?: string;
  severity: DisruptionSeverity;
  type: DisruptionType;
  status: 'active' | 'evolving' | 'monitoring' | 'resolved';
  dateReported: string;
  headline: string;
  summary: string;
  geopoliticalSentimentScore: number; // 0 - 100 (100 = maximum instability)
  affectedCommodities: string[];
  hsCodes: { code: string; name: string; priority: 'Critical' | 'High' | 'Medium' }[];
  spotFreightImpact: {
    containerIndexDeltaPercent: number;
    delayDaysAvg: number;
    dailyTradeLossEstimated: string;
    insuranceWarRiskHikePercent: number;
  };
  rootCauses: {
    category: 'Kinetic & Conflict' | 'Climate & Maritime' | 'Sanctions & Policy' | 'Infrastructure Bottleneck';
    description: string;
  }[];
  recoveryTimeline: {
    expectedDays: number;
    confidenceInterval: string;
    escalationRiskPercent: number;
  };
  keyActors: string[];
  recommendedPlaybooks: string[];
}

export interface CascadeNodeDetail {
  id: string;
  title: string;
  stage: 'Trigger' | '1st Order' | '2nd Order' | '3rd Order' | 'Terminal Impact';
  category: 'Geopolitics' | 'Maritime' | 'Port Logistics' | 'Manufacturing' | 'Supply Security';
  description: string;
  criticality: 'critical' | 'high' | 'medium';
  totalValueAtRisk: string;
  impactedContractsCount: number;
  impactedPurchaseOrders: {
    id: string;
    vendor: string;
    item: string;
    poValue: string;
    delayEstimate: string;
    facility: string;
    status: 'Delayed' | 'Stranded' | 'Expedited Air' | 'Hedged';
  }[];
  contingencyActions: string[];
}

export interface RerouteSimulationResult {
  origin: string;
  destination: string;
  originalRouteName: string;
  bypassRouteName: string;
  originalTransitDays: number;
  bypassTransitDays: number;
  transitDaysDelta: number;
  originalNauticalMiles: number;
  bypassNauticalMiles: number;
  distanceDeltaMiles: number;
  fuelCostDeltaUsd: number;
  canalTollDeltaUsd: number; // usually negative if avoiding Suez/Panama
  netVoyageCostDeltaUsd: number;
  carbonEmissionsDeltaTons: number;
  originalRiskScore: number;
  bypassRiskScore: number;
  riskReductionPoints: number;
  spotRatePerTeuDeltaUsd: number;
  feasibilityScorePercent: number;
  executiveRecommendation: string;
  keyMitigations: string[];
}

export interface SupplierNoticeDraft {
  id: string;
  type: 'force_majeure' | 'carrier_directive' | 'air_freight_hedge' | 'executive_board_memo';
  title: string;
  recipient: string;
  subject: string;
  date: string;
  contractReference: string;
  legalBasis: string;
  content: string;
  signoffRole: string;
  customizationTokens?: Record<string, string>;
}
