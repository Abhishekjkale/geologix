import { GoogleGenAI } from '@google/genai';
import { DISRUPTION_EVENTS, CASCADE_MIND_MAPS, SAMPLE_REROUTE_SIMULATION, SAMPLE_NOTICES } from '../data/geospatialData';
import { DisruptionEvent, CascadeNodeDetail, RerouteSimulationResult, SupplierNoticeDraft } from '../types';

// Initialize Gemini client safely with environment variable
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function analyzeDisruptionWithAI(
  incidentId: string,
  userPrompt?: string
): Promise<{
  analysis: Partial<DisruptionEvent>;
  executiveSummary: string;
  geopoliticalSentiment: number;
  aiInsights: string[];
}> {
  const existingEvent = DISRUPTION_EVENTS.find(e => e.id === incidentId) || DISRUPTION_EVENTS[0];
  const ai = getGeminiClient();

  if (!ai) {
    // High-fidelity fallback when GEMINI_API_KEY is not supplied in dev
    return {
      analysis: existingEvent,
      executiveSummary: `${existingEvent.headline}. GeoLogix AI geopolitical sentiment index ranks this threat at ${existingEvent.geopoliticalSentimentScore}/100. Average voyage delays are +${existingEvent.spotFreightImpact.delayDaysAvg} days with spot container index surging +${existingEvent.spotFreightImpact.containerIndexDeltaPercent}%.`,
      geopoliticalSentiment: existingEvent.geopoliticalSentimentScore,
      aiInsights: [
        `Primary choke-point transit risk elevated to ${existingEvent.severity.toUpperCase()}.`,
        `Direct exposure on key HS Codes: ${existingEvent.hsCodes.map(h => `${h.code} (${h.name})`).join(', ')}.`,
        `Estimated recovery window: ${existingEvent.recoveryTimeline.confidenceInterval}.`,
        `Recommended operational playbook: ${existingEvent.recommendedPlaybooks[0] || 'Cape of Good Hope rerouting'}.`,
      ],
    };
  }

  try {
    const prompt = `You are GeoLogix AI, an enterprise-grade geopolitical supply chain risk intelligence engine.
Analyze the following disruption event and provide an in-depth, structured intelligence assessment:
Incident: ${existingEvent.title}
Location: ${existingEvent.location}
Reported context: ${existingEvent.summary}
${userPrompt ? `User Specific Query: ${userPrompt}` : ''}

Respond in strict JSON with the following structure:
{
  "executiveSummary": "2-3 sentences summarizing the strategic supply chain fallout",
  "geopoliticalSentiment": number from 0 to 100 (100 = maximum instability),
  "rootCauses": [
    {"category": "Kinetic & Conflict" | "Climate & Maritime" | "Sanctions & Policy" | "Infrastructure Bottleneck", "description": "detail"}
  ],
  "hsCodes": [
    {"code": "HS XXXX", "name": "Commodity Name", "priority": "Critical" | "High" | "Medium"}
  ],
  "spotFreightImpact": {
    "containerIndexDeltaPercent": number,
    "delayDaysAvg": number,
    "dailyTradeLossEstimated": "string e.g. $4.8 Billion / day",
    "insuranceWarRiskHikePercent": number
  },
  "recoveryTimeline": {
    "expectedDays": number,
    "confidenceInterval": "string description",
    "escalationRiskPercent": number
  },
  "aiInsights": [
    "string actionable takeaway 1",
    "string actionable takeaway 2",
    "string actionable takeaway 3",
    "string actionable takeaway 4"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      analysis: {
        ...existingEvent,
        rootCauses: parsed.rootCauses || existingEvent.rootCauses,
        hsCodes: parsed.hsCodes || existingEvent.hsCodes,
        spotFreightImpact: parsed.spotFreightImpact || existingEvent.spotFreightImpact,
        recoveryTimeline: parsed.recoveryTimeline || existingEvent.recoveryTimeline,
      },
      executiveSummary: parsed.executiveSummary || existingEvent.summary,
      geopoliticalSentiment: parsed.geopoliticalSentiment ?? existingEvent.geopoliticalSentimentScore,
      aiInsights: parsed.aiInsights || [
        'Kinetic deterrence in the maritime strait remains unstable.',
        'High-density automotive electronics facing Tier-2 assembly backlogs.',
      ],
    };
  } catch (err) {
    console.error('Gemini analyzeDisruption error:', err);
    return {
      analysis: existingEvent,
      executiveSummary: existingEvent.summary,
      geopoliticalSentiment: existingEvent.geopoliticalSentimentScore,
      aiInsights: existingEvent.recommendedPlaybooks,
    };
  }
}

export async function simulateRerouteWithAI(params: {
  origin: string;
  destination: string;
  commodityType: string;
  avoidChokePoint?: string;
  vesselClass?: string;
}): Promise<RerouteSimulationResult> {
  const ai = getGeminiClient();

  if (!ai) {
    return {
      ...SAMPLE_REROUTE_SIMULATION,
      origin: params.origin || SAMPLE_REROUTE_SIMULATION.origin,
      destination: params.destination || SAMPLE_REROUTE_SIMULATION.destination,
    };
  }

  try {
    const prompt = `You are GeoLogix AI, simulating global supply chain maritime bypass routes.
Calculate a comparative route simulation for:
Origin: ${params.origin}
Destination: ${params.destination}
Commodity: ${params.commodityType}
Choke Point to Avoid / Disrupted: ${params.avoidChokePoint || 'Bab-el-Mandeb / Suez Canal'}
Vessel Class: ${params.vesselClass || 'Ultra Large Container Vessel (20,000 TEU)'}

Respond in strict JSON with this exact structure:
{
  "originalRouteName": "e.g. Asia-Europe Suez Highway",
  "bypassRouteName": "e.g. Cape of Good Hope Bypass Corridor",
  "originalTransitDays": number (e.g. 24),
  "bypassTransitDays": number (e.g. 37),
  "transitDaysDelta": number (e.g. 13),
  "originalNauticalMiles": number (e.g. 10450),
  "bypassNauticalMiles": number (e.g. 14200),
  "distanceDeltaMiles": number (e.g. 3750),
  "fuelCostDeltaUsd": number (extra bunker fuel cost in USD, e.g. 580000),
  "canalTollDeltaUsd": number (negative saved canal fees in USD, e.g. -420000),
  "netVoyageCostDeltaUsd": number (net financial delta in USD, e.g. 160000),
  "carbonEmissionsDeltaTons": number (extra CO2 in metric tons, e.g. 3850),
  "originalRiskScore": number (0-100, e.g. 92),
  "bypassRiskScore": number (0-100, e.g. 22),
  "riskReductionPoints": number (e.g. 70),
  "spotRatePerTeuDeltaUsd": number (e.g. 1850),
  "feasibilityScorePercent": number (0-100, e.g. 94),
  "executiveRecommendation": "2-3 sentences advising Chief Risk Officer and Logistics Director on trade-offs",
  "keyMitigations": [
    "Mitigation 1",
    "Mitigation 2",
    "Mitigation 3",
    "Mitigation 4"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      origin: params.origin,
      destination: params.destination,
      originalRouteName: parsed.originalRouteName || 'Primary Corrupted Maritime Route',
      bypassRouteName: parsed.bypassRouteName || 'Strategic Oceanic Bypass Corridor',
      originalTransitDays: parsed.originalTransitDays || 24,
      bypassTransitDays: parsed.bypassTransitDays || 37,
      transitDaysDelta: parsed.transitDaysDelta || 13,
      originalNauticalMiles: parsed.originalNauticalMiles || 10450,
      bypassNauticalMiles: parsed.bypassNauticalMiles || 14200,
      distanceDeltaMiles: parsed.distanceDeltaMiles || 3750,
      fuelCostDeltaUsd: parsed.fuelCostDeltaUsd || 580000,
      canalTollDeltaUsd: parsed.canalTollDeltaUsd || -420000,
      netVoyageCostDeltaUsd: parsed.netVoyageCostDeltaUsd || 160000,
      carbonEmissionsDeltaTons: parsed.carbonEmissionsDeltaTons || 3850,
      originalRiskScore: parsed.originalRiskScore || 92,
      bypassRiskScore: parsed.bypassRiskScore || 22,
      riskReductionPoints: parsed.riskReductionPoints || 70,
      spotRatePerTeuDeltaUsd: parsed.spotRatePerTeuDeltaUsd || 1850,
      feasibilityScorePercent: parsed.feasibilityScorePercent || 94,
      executiveRecommendation: parsed.executiveRecommendation || SAMPLE_REROUTE_SIMULATION.executiveRecommendation,
      keyMitigations: parsed.keyMitigations || SAMPLE_REROUTE_SIMULATION.keyMitigations,
    };
  } catch (err) {
    console.error('Gemini simulateReroute error:', err);
    return {
      ...SAMPLE_REROUTE_SIMULATION,
      origin: params.origin,
      destination: params.destination,
    };
  }
}

export async function generateSupplierNoticeWithAI(params: {
  noticeType: 'force_majeure' | 'carrier_directive' | 'air_freight_hedge' | 'executive_board_memo';
  incidentTitle: string;
  affectedCorridor: string;
  cargoCategory: string;
  contractRef?: string;
  recipientOrg?: string;
}): Promise<SupplierNoticeDraft> {
  const existingNotice = SAMPLE_NOTICES.find(n => n.type === params.noticeType) || SAMPLE_NOTICES[0];
  const ai = getGeminiClient();

  if (!ai) {
    return {
      ...existingNotice,
      contractReference: params.contractRef || existingNotice.contractReference,
      recipient: params.recipientOrg || existingNotice.recipient,
      id: `notice-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
  }

  try {
    const prompt = `You are the Lead Legal Counsel and VP of Global Supply Chain Risk at an enterprise multinational.
Draft a highly professional, legally rigorous contractual document of type: "${params.noticeType}".

Context:
- Disruption Event: ${params.incidentTitle}
- Affected Trade Corridor: ${params.affectedCorridor}
- Impacted Cargo: ${params.cargoCategory}
- Contract Reference: ${params.contractRef || 'Master Supply Agreement § 18.2'}
- Recipient: ${params.recipientOrg || 'Global OEM Manufacturing Partners & Logistics Consortia'}

Notice Type Specifics:
- force_majeure: Formal invocation of Force Majeure under UN CISG Art. 79, ICC 2020 Force Majeure Clauses, or BIMCO Conwartime terms. Detail why the event is unforeseeable, beyond control, and excuses performance delays.
- carrier_directive: Mandatory diversion instructions to ocean carriers (Maersk, MSC, Hapag-Lloyd) ordering bypass via Cape of Good Hope or alternative routes with cargo protection clauses.
- air_freight_hedge: Internal executive authorization to carve out emergency air-freight bridge budget for bottleneck Tier-1 semiconductor/auto parts.
- executive_board_memo: Strategic C-suite risk briefing for Chief Risk Officer (CRO) and Board of Directors evaluating margin preservation, working capital impact, and nearshoring hedges.

Return JSON:
{
  "title": "Document Title",
  "subject": "Formal Subject Line",
  "contractReference": "Contract clause or charter item",
  "legalBasis": "Applicable conventions or corporate governance standards",
  "signoffRole": "Authorizing title (e.g. Chief Risk Officer, General Counsel)",
  "content": "Full, complete, formatted text of the legal notice with numbered sections"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      id: `notice-${Date.now()}`,
      type: params.noticeType,
      title: parsed.title || existingNotice.title,
      recipient: params.recipientOrg || existingNotice.recipient,
      subject: parsed.subject || existingNotice.subject,
      date: new Date().toISOString().split('T')[0],
      contractReference: parsed.contractReference || existingNotice.contractReference,
      legalBasis: parsed.legalBasis || existingNotice.legalBasis,
      content: parsed.content || existingNotice.content,
      signoffRole: parsed.signoffRole || existingNotice.signoffRole,
    };
  } catch (err) {
    console.error('Gemini generateSupplierNotice error:', err);
    return {
      ...existingNotice,
      id: `notice-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
  }
}

export async function generateCascadeAnalysisWithAI(
  scenarioName: string
): Promise<CascadeNodeDetail[]> {
  const existingCascade = CASCADE_MIND_MAPS[scenarioName] || CASCADE_MIND_MAPS['red-sea-kinetic-strikes'];
  const ai = getGeminiClient();

  if (!ai) {
    return existingCascade;
  }

  try {
    const prompt = `You are GeoLogix AI. Generate a multi-order cascading supply chain impact tree for scenario: "${scenarioName}".
Map out the domino effect through:
1. Trigger (Geopolitical / Kinetic / Climate catalyst)
2. 1st Order (Strait closure / canal restriction / port shutdown)
3. 2nd Order (Carrier bypass detour / port container bunching)
4. 3rd Order (Manufacturing plant shutdown / component stockouts)
5. Terminal Impact (Retail equipment deficits / severe consumer price inflation)

Respond in strict JSON with an array of node objects matching this schema:
[
  {
    "id": "node-unique-id",
    "title": "Short descriptive node title",
    "stage": "Trigger" | "1st Order" | "2nd Order" | "3rd Order" | "Terminal Impact",
    "category": "Geopolitics" | "Maritime" | "Port Logistics" | "Manufacturing" | "Supply Security",
    "description": "Clear description of the cascading ripple effect",
    "criticality": "critical" | "high" | "medium",
    "totalValueAtRisk": "e.g. $4.8B Cargo at Risk",
    "impactedContractsCount": number,
    "impactedPurchaseOrders": [
      {
        "id": "PO-XXXXX",
        "vendor": "Vendor Name",
        "item": "Component Name (HS code)",
        "poValue": "$XX,XXX,000",
        "delayEstimate": "+XX Days",
        "facility": "Factory or plant name",
        "status": "Delayed" | "Stranded" | "Expedited Air" | "Hedged"
      }
    ],
    "contingencyActions": [
      "Action 1",
      "Action 2"
    ]
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return existingCascade;
  } catch (err) {
    console.error('Gemini generateCascadeAnalysis error:', err);
    return existingCascade;
  }
}
