import { TradeCorridor, ChokePoint, DisruptionEvent, CascadeNodeDetail, RerouteSimulationResult, SupplierNoticeDraft } from '../types';

export const CHOKE_POINTS: ChokePoint[] = [
  {
    id: 'bab-el-mandeb',
    name: 'Bab-el-Mandeb Strait',
    region: 'Red Sea / Gulf of Aden',
    coordinates: { lat: 12.5855, lng: 43.3312 },
    bufferRadiusKm: 140,
    strategicImportance: 'Gateway between the Indian Ocean and the Mediterranean via the Red Sea; carries 12% of global seaborne trade and 30% of global container traffic.',
    globalTradeSharePercent: 12.0,
    dailyVesselTransit: 65,
    currentRiskScore: 94,
    militaryThreatIndex: 'Severe',
    status: 'restricted',
    keyCommodities: ['Crude Oil', 'Refined Petroleum', 'Automotive Parts', 'Consumer Electronics', 'Apparel'],
    historicalPrecedents: '2023-2024 Houthi anti-ship missile and drone campaign causing 65%+ diversion to Cape of Good Hope.',
    geofencePolygon: [
      { lat: 13.4, lng: 42.6 },
      { lat: 13.5, lng: 43.8 },
      { lat: 12.2, lng: 44.2 },
      { lat: 11.8, lng: 43.1 },
      { lat: 12.4, lng: 42.4 },
    ],
  },
  {
    id: 'suez-canal',
    name: 'Suez Canal',
    region: 'Egypt / Sinai',
    coordinates: { lat: 30.5852, lng: 32.2654 },
    bufferRadiusKm: 110,
    strategicImportance: 'Artificial waterway connecting Mediterranean Sea to Red Sea. Handles 1.2 billion tonnes of cargo annually ($9.6B/day trade toll during blockages).',
    globalTradeSharePercent: 15.0,
    dailyVesselTransit: 72,
    currentRiskScore: 88,
    militaryThreatIndex: 'High',
    status: 'impaired',
    keyCommodities: ['Liquid Natural Gas (LNG)', 'Containers', 'Grain', 'Chemicals', 'Semiconductors'],
    historicalPrecedents: '2021 Ever Given 6-day grounding stalling $54B in trade; 2024 Red Sea spillover transit drops of 50%.',
    geofencePolygon: [
      { lat: 31.4, lng: 31.9 },
      { lat: 31.3, lng: 32.8 },
      { lat: 29.8, lng: 32.7 },
      { lat: 29.7, lng: 32.2 },
    ],
  },
  {
    id: 'strait-of-malacca',
    name: 'Strait of Malacca',
    region: 'Southeast Asia (Malaysia / Indonesia / Singapore)',
    coordinates: { lat: 2.5000, lng: 101.5000 },
    bufferRadiusKm: 180,
    strategicImportance: 'Main shipping channel between Indian Ocean and Pacific Ocean. World’s busiest maritime corridor carrying 84,000+ vessels annually.',
    globalTradeSharePercent: 25.0,
    dailyVesselTransit: 230,
    currentRiskScore: 68,
    militaryThreatIndex: 'Moderate',
    status: 'open',
    keyCommodities: ['Crude Oil (80% of China oil imports)', 'Semiconductors', 'Lithium Batteries', 'Palm Oil', 'Rare Earth Elements'],
    historicalPrecedents: 'Vessel collisions in Philips Channel, piracy resurgence in Singapore Strait, strategic vulnerability during South China Sea tensions.',
    geofencePolygon: [
      { lat: 4.8, lng: 98.2 },
      { lat: 3.2, lng: 101.2 },
      { lat: 1.2, lng: 104.2 },
      { lat: 1.0, lng: 103.5 },
      { lat: 2.8, lng: 100.0 },
    ],
  },
  {
    id: 'strait-of-hormuz',
    name: 'Strait of Hormuz',
    region: 'Persian Gulf (Oman / Iran)',
    coordinates: { lat: 26.5667, lng: 56.2500 },
    bufferRadiusKm: 120,
    strategicImportance: 'World’s most critical petroleum transit choke-point. Transits 21 million barrels of crude oil per day (21% of global petroleum consumption).',
    globalTradeSharePercent: 21.0,
    dailyVesselTransit: 90,
    currentRiskScore: 91,
    militaryThreatIndex: 'Severe',
    status: 'restricted',
    keyCommodities: ['Crude Oil', 'Condensate', 'LNG (Qatar)', 'Petrochemical Feedstocks', 'Fertilizers'],
    historicalPrecedents: 'Tanker seizures, mine attacks in Gulf of Oman, ongoing missile alert warnings during regional escalations.',
    geofencePolygon: [
      { lat: 27.2, lng: 55.4 },
      { lat: 27.1, lng: 57.0 },
      { lat: 25.8, lng: 57.1 },
      { lat: 25.7, lng: 55.8 },
    ],
  },
  {
    id: 'panama-canal',
    name: 'Panama Canal',
    region: 'Central America (Panama)',
    coordinates: { lat: 9.1012, lng: -79.6953 },
    bufferRadiusKm: 90,
    strategicImportance: 'Inter-oceanic canal connecting Atlantic and Pacific Oceans. Cuts 8,000 nautical miles off Cape Horn voyage for Americas trade.',
    globalTradeSharePercent: 6.0,
    dailyVesselTransit: 28,
    currentRiskScore: 82,
    militaryThreatIndex: 'Low',
    status: 'restricted',
    keyCommodities: ['Grain (US Midwest to Asia)', 'LNG & LPG', 'Auto Carriers', 'Refrigerated Fruits & Meat'],
    historicalPrecedents: '2023-2024 severe El Niño drought shrinking Gatún Lake water levels, forcing draft cuts from 50ft to 44ft and transit cuts to 24 slots.',
    geofencePolygon: [
      { lat: 9.5, lng: -80.1 },
      { lat: 9.4, lng: -79.4 },
      { lat: 8.8, lng: -79.4 },
      { lat: 8.8, lng: -80.0 },
    ],
  },
  {
    id: 'bosporus-strait',
    name: 'Turkish Straits (Bosporus & Dardanelles)',
    region: 'Eurasia (Turkey)',
    coordinates: { lat: 41.1167, lng: 29.0833 },
    bufferRadiusKm: 85,
    strategicImportance: 'Only maritime passage connecting Black Sea to Aegean/Mediterranean; governed by Montreux Convention.',
    globalTradeSharePercent: 4.5,
    dailyVesselTransit: 115,
    currentRiskScore: 79,
    militaryThreatIndex: 'High',
    status: 'restricted',
    keyCommodities: ['Wheat & Agricultural Staples', 'Sunflower Oil', 'Russian Urals Crude', 'Steel & Iron Ore'],
    historicalPrecedents: 'Black Sea naval hostilities, drifting sea mines, war-risk insurance surcharges.',
  },
  {
    id: 'strait-of-gibraltar',
    name: 'Strait of Gibraltar',
    region: 'Mediterranean / Atlantic (Spain / Morocco)',
    coordinates: { lat: 35.9667, lng: -5.6000 },
    bufferRadiusKm: 100,
    strategicImportance: 'Western entrance to the Mediterranean Sea from the Atlantic Ocean; 100,000+ vessel passages annually.',
    globalTradeSharePercent: 9.0,
    dailyVesselTransit: 300,
    currentRiskScore: 45,
    militaryThreatIndex: 'Low',
    status: 'open',
    keyCommodities: ['Manufactured Goods', 'North African Phosphates', 'Petroleum', 'Automotive Ro-Ro'],
    historicalPrecedents: 'High traffic density congestion and Orca vessel interactions in outer approaches.',
  },
];

export const TRADE_CORRIDORS: TradeCorridor[] = [
  {
    id: 'corridor-asia-europe-suez',
    name: 'Asia-Europe Maritime Highway (via Suez)',
    mode: 'maritime',
    origin: 'Shanghai / Yantian, China',
    destination: 'Rotterdam / Hamburg, Europe',
    path: [
      { lat: 31.23, lng: 121.47 }, // Shanghai
      { lat: 22.31, lng: 114.16 }, // Hong Kong / Yantian
      { lat: 10.0, lng: 110.0 },
      { lat: 1.35, lng: 103.81 }, // Singapore / Malacca
      { lat: 5.9, lng: 80.5 },    // Sri Lanka tip
      { lat: 11.5, lng: 55.0 },   // Arabian Sea
      { lat: 12.58, lng: 43.33 }, // Bab-el-Mandeb (Hotspot)
      { lat: 21.0, lng: 38.5 },   // Red Sea
      { lat: 30.58, lng: 32.26 }, // Suez Canal
      { lat: 35.0, lng: 20.0 },   // Central Med
      { lat: 36.0, lng: -5.3 },   // Gibraltar
      { lat: 43.5, lng: -9.5 },   // Cape Finisterre
      { lat: 50.0, lng: -1.0 },   // English Channel
      { lat: 51.92, lng: 4.47 },  // Rotterdam
    ],
    status: 'compromised',
    riskScore: 92,
    annualVolumeTEU: '24.5 Million TEU',
    avgTransitDays: 24,
    chokePointsTraversed: ['strait-of-malacca', 'bab-el-mandeb', 'suez-canal', 'strait-of-gibraltar'],
    color: '#ef4444', // Red (Compromised)
    description: 'Primary seaborne lifeline between Asian manufacturing hubs and European retail/industrial centers. Subject to acute kinetic missile disruption in Red Sea.',
  },
  {
    id: 'corridor-cape-bypass',
    name: 'Cape of Good Hope Bypass Corridor',
    mode: 'bypass',
    origin: 'Shanghai, China',
    destination: 'Rotterdam, Europe',
    path: [
      { lat: 31.23, lng: 121.47 }, // Shanghai
      { lat: 1.35, lng: 103.81 },  // Malacca
      { lat: -5.0, lng: 85.0 },    // Mid Indian Ocean
      { lat: -25.0, lng: 55.0 },   // South Indian Ocean
      { lat: -34.8, lng: 20.0 },   // Cape Agulhas / Cape of Good Hope
      { lat: -15.0, lng: 5.0 },    // South Atlantic
      { lat: 10.0, lng: -20.0 },   // Mid Atlantic
      { lat: 36.0, lng: -15.0 },   // Off Iberian coast
      { lat: 48.0, lng: -6.0 },    // Approaches to English Channel
      { lat: 51.92, lng: 4.47 },   // Rotterdam
    ],
    status: 'active_bypass',
    riskScore: 22,
    annualVolumeTEU: '18.2 Million TEU (Spike due to rerouting)',
    avgTransitDays: 37,
    chokePointsTraversed: ['strait-of-malacca'],
    color: '#06b6d4', // Cyan (Active Bypass)
    description: 'Extended maritime circuit adding 3,500+ nautical miles (+10 to +14 days transit). Low geopolitical risk, but elevated bunker fuel burn ($850k/vessel) and equipment shortages.',
  },
  {
    id: 'corridor-transpacific',
    name: 'Trans-Pacific Eastbound Corridor',
    mode: 'maritime',
    origin: 'Shenzhen / Shanghai / Busan',
    destination: 'Los Angeles / Long Beach, USA',
    path: [
      { lat: 22.54, lng: 114.05 }, // Shenzhen
      { lat: 31.23, lng: 121.47 }, // Shanghai
      { lat: 35.1, lng: 129.04 },  // Busan
      { lat: 35.0, lng: 145.0 },
      { lat: 38.0, lng: -175.0 },  // Mid Pacific
      { lat: 36.0, lng: -140.0 },
      { lat: 33.74, lng: -118.27 },// Port of Los Angeles
    ],
    status: 'optimal',
    riskScore: 38,
    annualVolumeTEU: '21.8 Million TEU',
    avgTransitDays: 14,
    chokePointsTraversed: [],
    color: '#10b981', // Green (Optimal)
    description: 'Dominant trans-oceanic artery for US consumer retail, tech hardware, and auto components. Vulnerable to Taiwan Strait naval tension and US West Coast port labor strikes.',
  },
  {
    id: 'corridor-transatlantic',
    name: 'Trans-Atlantic Gateway Corridor',
    mode: 'maritime',
    origin: 'Antwerp / Rotterdam / Bremerhaven',
    destination: 'New York / New Jersey, USA',
    path: [
      { lat: 51.21, lng: 4.40 },   // Antwerp
      { lat: 50.5, lng: -1.5 },
      { lat: 49.0, lng: -20.0 },
      { lat: 45.0, lng: -45.0 },
      { lat: 41.0, lng: -65.0 },
      { lat: 40.68, lng: -74.04 }, // Port of New York
    ],
    status: 'optimal',
    riskScore: 28,
    annualVolumeTEU: '8.4 Million TEU',
    avgTransitDays: 11,
    chokePointsTraversed: [],
    color: '#10b981', // Green (Optimal)
    description: 'High-value corridor for precision machinery, pharmaceuticals, chemicals, and luxury vehicles.',
  },
  {
    id: 'corridor-eurasian-rail',
    name: 'Eurasian Silk Road Express (New Eurasian Land Bridge)',
    mode: 'rail',
    origin: 'Chongqing / Xi’an, China',
    destination: 'Duisburg / Hamburg, Germany',
    path: [
      { lat: 29.56, lng: 106.55 }, // Chongqing
      { lat: 34.34, lng: 108.94 }, // Xi'an
      { lat: 44.5, lng: 85.0 },    // Khorgos Border (China-Kazakhstan)
      { lat: 51.16, lng: 71.47 },  // Astana
      { lat: 55.75, lng: 37.61 },  // Moscow bypass
      { lat: 52.22, lng: 21.01 },  // Malaszewicze / Warsaw
      { lat: 51.43, lng: 6.76 },   // Duisburg
    ],
    status: 'congested',
    riskScore: 64,
    annualVolumeTEU: '1.6 Million TEU',
    avgTransitDays: 17,
    chokePointsTraversed: [],
    color: '#f59e0b', // Amber (Congested / Sanctions Sensitive)
    description: 'High-speed overland intermodal rail connecting inland Chinese industrial clusters to Central Europe. Sanctions compliance bottlenecks and gauge change delays.',
  },
  {
    id: 'corridor-panama-interoceanic',
    name: 'Panama Inter-Oceanic Link',
    mode: 'maritime',
    origin: 'Busan / Shanghai',
    destination: 'Savannah / New York, USA',
    path: [
      { lat: 31.23, lng: 121.47 },
      { lat: 20.0, lng: -160.0 },
      { lat: 12.0, lng: -110.0 },
      { lat: 8.9, lng: -79.6 },    // Panama Canal
      { lat: 18.0, lng: -75.0 },   // Caribbean
      { lat: 26.0, lng: -79.0 },
      { lat: 32.08, lng: -81.09 }, // Savannah, Georgia
    ],
    status: 'congested',
    riskScore: 78,
    annualVolumeTEU: '6.2 Million TEU',
    avgTransitDays: 26,
    chokePointsTraversed: ['panama-canal'],
    color: '#f59e0b', // Amber (Congested)
    description: 'Essential link for East Asian exporters reaching US Gulf & East Coast ports without US continental rail transshipment. Crippled by drought-induced slot rationing.',
  },
  {
    id: 'corridor-hormuz-energy',
    name: 'Persian Gulf Energy Lifeline',
    mode: 'maritime',
    origin: 'Ras Tanura, Saudi Arabia / Ras Laffan, Qatar',
    destination: 'Tokyo / Ningbo / Singapore',
    path: [
      { lat: 26.64, lng: 50.16 }, // Ras Tanura
      { lat: 26.56, lng: 56.25 }, // Strait of Hormuz
      { lat: 22.0, lng: 62.0 },   // Arabian Sea
      { lat: 6.0, lng: 80.0 },    // South of Sri Lanka
      { lat: 2.5, lng: 101.5 },   // Strait of Malacca
      { lat: 12.0, lng: 115.0 },  // South China Sea
      { lat: 35.44, lng: 139.63 },// Yokohama / Tokyo Bay
    ],
    status: 'compromised',
    riskScore: 89,
    annualVolumeTEU: '850 Million Barrels Crude / Annum',
    avgTransitDays: 19,
    chokePointsTraversed: ['strait-of-hormuz', 'strait-of-malacca'],
    color: '#ef4444',
    description: 'Vital hydrocarbon lifeline powering Japanese, Korean, and Chinese industrial power grids. Threatened by Iranian naval drone interceptions and tanker interdictions.',
  },
];

export const DISRUPTION_EVENTS: DisruptionEvent[] = [
  {
    id: 'red-sea-kinetic-strikes',
    title: 'Bab-el-Mandeb Kinetic Attacks & Rerouting Cascade',
    location: 'Southern Red Sea / Bab-el-Mandeb Strait',
    coordinates: { lat: 12.5855, lng: 43.3312 },
    chokePointId: 'bab-el-mandeb',
    severity: 'critical',
    type: 'kinetic',
    status: 'active',
    dateReported: '2024-01-15 (Ongoing Active Conflict)',
    headline: 'Houthi Anti-Ship Ballistic Missiles & US/UK Coalition Naval Interdictions Force 80% Diversion to Cape of Good Hope',
    summary: 'Sustained anti-ship missile and autonomous drone strikes against commercial container vessels transiting the Bab-el-Mandeb have forced premier ocean carriers (Maersk, MSC, Hapag-Lloyd, CMA CGM) to suspend Red Sea transits. Commercial insurance war-risk premiums have spiked by 350%, adding upwards of $1.2M in round-trip operating overhead per vessel.',
    geopoliticalSentimentScore: 94,
    affectedCommodities: ['Automotive Sub-assemblies', 'Semiconductor Chips', 'Consumer Electronics', 'Apparel & Fast Fashion', 'Refined Fuels'],
    hsCodes: [
      { code: 'HS 8708', name: 'Parts & Accessories of Motor Vehicles', priority: 'Critical' },
      { code: 'HS 8542', name: 'Electronic Integrated Circuits & Processors', priority: 'Critical' },
      { code: 'HS 6109', name: 'Apparel & Clothing Accessories', priority: 'Medium' },
      { code: 'HS 2710', name: 'Petroleum Oils & Distillates', priority: 'High' },
      { code: 'HS 8471', name: 'Automatic Data Processing Machines', priority: 'High' },
    ],
    spotFreightImpact: {
      containerIndexDeltaPercent: 240,
      delayDaysAvg: 13.5,
      dailyTradeLossEstimated: '$4.8 Billion / day',
      insuranceWarRiskHikePercent: 350,
    },
    rootCauses: [
      {
        category: 'Kinetic & Conflict',
        description: 'Ansar Allah (Houthi) asymmetric warfare leveraging low-cost loitering munitions and anti-ship ballistic missiles targeting commercial merchant shipping.',
      },
      {
        category: 'Sanctions & Policy',
        description: 'US-led Operation Prosperity Guardian multinational naval escort forces clashing with regional proxy forces; heightened state-actor war risks.',
      },
      {
        category: 'Infrastructure Bottleneck',
        description: 'Bunker fuel bunkering shortages at South African ports (Durban, Port Elizabeth) unable to absorb sudden 400% surge in vessel bypass traffic.',
      },
    ],
    recoveryTimeline: {
      expectedDays: 60,
      confidenceInterval: '45 - 90 Days (Dependent on Gaza ceasefire & diplomatic settlement)',
      escalationRiskPercent: 78,
    },
    keyActors: ['Yemen Houthi Forces', 'US 5th Fleet', 'UK Royal Navy', 'Maersk Line', 'CMA CGM', 'Lloyd’s Joint War Committee'],
    recommendedPlaybooks: [
      'Bypass via Cape of Good Hope with advance bunker hedging in Singapore',
      'Air-freight emergency conversion for high-density automotive semiconductors (HS 8542)',
      'Immediate contractual Force Majeure notice to Tier-1 automotive assembly clients',
      'Inland European bonded warehouse buffer inventory drawdown',
    ],
  },
  {
    id: 'panama-drought-crisis',
    title: 'Panama Canal Gatún Lake Climate Deficit & Slot Rationing',
    location: 'Panama Canal Locks (Gatún & Miraflores)',
    coordinates: { lat: 9.1012, lng: -79.6953 },
    chokePointId: 'panama-canal',
    severity: 'high',
    type: 'climate',
    status: 'active',
    dateReported: '2023-11-20 (Seasonal Drought Impact)',
    headline: 'Freshwater Shortage Restricts Daily Vessel Transits to 24; Auction Bids for Priority Transit Slots Exceed $4 Million',
    summary: 'Severe drought induced by El Niño and shifting tropical meteorological patterns severely depleted Gatún Lake freshwater reservoirs required to operate the canal gravity lock system. The Panama Canal Authority (ACP) capped draft to 44 feet and restricted transits, stranding over 130 bulk carriers and container ships in Atlantic and Pacific anchorages.',
    geopoliticalSentimentScore: 78,
    affectedCommodities: ['Grain & Soybeans', 'Liquefied Natural Gas (LNG)', 'US Gulf Coast Chemicals', 'Refrigerated Food & Produce'],
    hsCodes: [
      { code: 'HS 1201', name: 'Soya Beans, whether or not broken', priority: 'High' },
      { code: 'HS 2711', name: 'Petroleum Gases & Liquefied Gas (LNG)', priority: 'Critical' },
      { code: 'HS 1005', name: 'Maize (Corn)', priority: 'High' },
      { code: 'HS 0803', name: 'Bananas & Tropical Fruit', priority: 'Medium' },
    ],
    spotFreightImpact: {
      containerIndexDeltaPercent: 110,
      delayDaysAvg: 9.2,
      dailyTradeLossEstimated: '$1.4 Billion / day',
      insuranceWarRiskHikePercent: 15,
    },
    rootCauses: [
      {
        category: 'Climate & Maritime',
        description: 'Persistent hydrological drought in Chagres basin with historic low reservoir inflows; insufficient municipal and canal water conservation infrastructure.',
      },
      {
        category: 'Infrastructure Bottleneck',
        description: 'Canal locks discharge ~52 million gallons of freshwater into the oceans per transit; lack of closed-circuit water recirculation basins.',
      },
    ],
    recoveryTimeline: {
      expectedDays: 45,
      confidenceInterval: '30 - 60 Days (Tied to onset of tropical rainy season & La Niña)',
      escalationRiskPercent: 32,
    },
    keyActors: ['Panama Canal Authority (ACP)', 'US Grain Export Council', 'Cheniere Energy', 'ONE (Ocean Network Express)'],
    recommendedPlaybooks: [
      'Shift US Gulf LNG exports to Cape Horn or Cape of Good Hope routes',
      'Deploy US West Coast Intermodal rail land-bridge (LA/Long Beach to Chicago/NY)',
      'Auction slot pre-booking with contractual surcharge pass-through',
    ],
  },
  {
    id: 'hormuz-tanker-standoff',
    title: 'Strait of Hormuz Naval Interdiction & Geopolitical Standoff',
    location: 'Strait of Hormuz / Gulf of Oman',
    coordinates: { lat: 26.5667, lng: 56.2500 },
    chokePointId: 'strait-of-hormuz',
    severity: 'critical',
    type: 'kinetic',
    status: 'evolving',
    dateReported: '2024-04-12 (Heightened War Readiness)',
    headline: 'IRGC Fast-Attack Boats and Helicopter Commandos Board Commercial Tankers; Brent Crude Risk Premium Widens',
    summary: 'Escalating direct military confrontation and retaliatory strikes across the Persian Gulf have triggered heightened naval seizures and radar spoofing in the narrow traffic separation scheme of Hormuz. Tanker owners require naval convoy escorts; electronic warfare jamming has disrupted GPS navigation for 100+ VLCC tankers.',
    geopoliticalSentimentScore: 96,
    affectedCommodities: ['Crude Petroleum (Brent/Dubai)', 'Naphtha Feedstock', 'Aviation Fuel', 'Qatari LNG', 'Polyethylene'],
    hsCodes: [
      { code: 'HS 2709', name: 'Petroleum Oils, Crude', priority: 'Critical' },
      { code: 'HS 2711', name: 'Liquefied Natural Gas (LNG)', priority: 'Critical' },
      { code: 'HS 3901', name: 'Polymers of Ethylene (Plastic Pellets)', priority: 'High' },
      { code: 'HS 2814', name: 'Ammonia, Anhydrous (Fertilizer)', priority: 'High' },
    ],
    spotFreightImpact: {
      containerIndexDeltaPercent: 185,
      delayDaysAvg: 8.0,
      dailyTradeLossEstimated: '$8.2 Billion / day',
      insuranceWarRiskHikePercent: 420,
    },
    rootCauses: [
      {
        category: 'Kinetic & Conflict',
        description: 'State-level kinetic tit-for-tat between regional powers; threat of asymmetric closure of international maritime straits.',
      },
      {
        category: 'Sanctions & Policy',
        description: 'Western enforcement of crude price caps and secondary sanctions on shadow tanker fleets triggering retaliatory interdictions.',
      },
    ],
    recoveryTimeline: {
      expectedDays: 75,
      confidenceInterval: '60 - 120 Days (Dependent on multilateral diplomatic de-escalation)',
      escalationRiskPercent: 84,
    },
    keyActors: ['IRGC Navy', 'US Central Command (CENTCOM)', 'Saudi Aramco', 'ADNOC', 'Japanese Shipowners Association'],
    recommendedPlaybooks: [
      'Activate Saudi East-West Petroline pipeline to Yanbu on Red Sea (5M bpd capacity)',
      'Activate UAE Habshan-Fujairah pipeline bypassing Hormuz completely',
      'Strategic petroleum reserve release authorization for Sovereign Logistics planners',
    ],
  },
  {
    id: 'taiwan-strait-blockade-sim',
    title: 'Taiwan Strait Maritime Exclusion Drills & Electronics Risk',
    location: 'Taiwan Strait / East China Sea',
    coordinates: { lat: 24.2000, lng: 119.8000 },
    severity: 'high',
    type: 'regulatory',
    status: 'monitoring',
    dateReported: '2024-05-24 (Military Exercise Live-Fire)',
    headline: 'Naval Encirclement Drills Create Temporary Maritime & Air Exclusion Zones; Semiconductor Buffer Lead Times Double',
    summary: 'Joint theater military exercises involving naval blockades, anti-submarine warfare drills, and missile closures across 6 maritime zones around the island have disrupted cargo flows through one of the world’s most dense high-tech manufacturing corridors. Air-cargo flights rerouted around Luzon Strait.',
    geopoliticalSentimentScore: 89,
    affectedCommodities: ['Advanced Logic Microchips (3nm/5nm)', 'Foundry Silicon Wafers', 'Substrates', 'Flat Panel Displays'],
    hsCodes: [
      { code: 'HS 8542', name: 'Integrated Circuits & Microassemblies', priority: 'Critical' },
      { code: 'HS 3818', name: 'Chemical Elements Doped for Electronics (Silicon)', priority: 'Critical' },
      { code: 'HS 9013', name: 'Liquid Crystal Devices & Lasers', priority: 'High' },
    ],
    spotFreightImpact: {
      containerIndexDeltaPercent: 75,
      delayDaysAvg: 6.5,
      dailyTradeLossEstimated: '$11.5 Billion / day (High Tech Value)',
      insuranceWarRiskHikePercent: 180,
    },
    rootCauses: [
      {
        category: 'Kinetic & Conflict',
        description: 'Large-scale joint military exercises with carrier strike groups simulating quarantine and denial-of-access scenarios.',
      },
      {
        category: 'Sanctions & Policy',
        description: 'Technology export controls and cross-strait political tensions.',
      },
    ],
    recoveryTimeline: {
      expectedDays: 21,
      confidenceInterval: '14 - 30 Days (Cycle of recurring military exercise notifications)',
      escalationRiskPercent: 62,
    },
    keyActors: ['PLA Eastern Theater Command', 'Taiwan MND', 'TSMC', 'Hon Hai Foxconn', 'US INDOPACOM'],
    recommendedPlaybooks: [
      'Pre-buffer Tier-1 fab inventory in Japanese and European bonded vaults',
      'Air-freight rerouting via southern corridor through Manila / Singapore FIR',
      'Supplier dual-sourcing activation with US (Arizona) and Japan (Kumamoto) fabs',
    ],
  },
  {
    id: 'malacca-congestion-alert',
    title: 'Strait of Malacca Singapore Roadstead Extreme Congestion',
    location: 'Singapore Strait / Port of Tanjung Pelepas',
    coordinates: { lat: 1.2500, lng: 103.8000 },
    chokePointId: 'strait-of-malacca',
    severity: 'medium',
    type: 'infrastructure',
    status: 'active',
    dateReported: '2024-06-08 (Compounding Red Sea Spillover)',
    headline: 'Cape Reroutings Cause “Vessel Bunching” in Singapore; Container Dwell Times Exceed 7.5 Days with 450,000 TEU Queue',
    summary: 'The compounding effect of vessels bypassing the Red Sea and racing to make up lost schedule integrity has triggered catastrophic berth congestion at Southeast Asian transshipment hubs. Singapore roadsteads report over 80 mega-container vessels waiting at anchor.',
    geopoliticalSentimentScore: 66,
    affectedCommodities: ['Transshipment Containers', 'Consumer Goods', 'Chemical Precursors', 'Battery Cells'],
    hsCodes: [
      { code: 'HS 8507', name: 'Electric Accumulators (Lithium-ion Batteries)', priority: 'High' },
      { code: 'HS 8708', name: 'Auto Components', priority: 'High' },
      { code: 'HS 8473', name: 'Parts of Computing Equipment', priority: 'Medium' },
    ],
    spotFreightImpact: {
      containerIndexDeltaPercent: 65,
      delayDaysAvg: 7.8,
      dailyTradeLossEstimated: '$2.2 Billion / day',
      insuranceWarRiskHikePercent: 20,
    },
    rootCauses: [
      {
        category: 'Infrastructure Bottleneck',
        description: 'Vessel schedule reliability collapsed from 65% to 51%, creating unpredictable arrival spikes and crane crane-density saturation.',
      },
    ],
    recoveryTimeline: {
      expectedDays: 35,
      confidenceInterval: '25 - 45 Days',
      escalationRiskPercent: 25,
    },
    keyActors: ['PSA Singapore', 'Port of Tanjung Pelepas', 'Ocean Alliance', 'Gemini Cooperation'],
    recommendedPlaybooks: [
      'Offload cargo at Port Klang or Batam feeder terminals to bypass Singapore hub',
      'Pre-clear customs via ASEAN Single Window digital paperwork',
    ],
  },
  {
    id: 'black-sea-mine-threat',
    title: 'Black Sea Agricultural Corridor Naval Mining & Grain Stranding',
    location: 'Western Black Sea / Odesa / Sulina Canal',
    coordinates: { lat: 45.3000, lng: 30.5000 },
    chokePointId: 'bosporus-strait',
    severity: 'high',
    type: 'kinetic',
    status: 'active',
    dateReported: '2023-09-14 (War Zone Classification)',
    headline: 'Drifting Naval Mines and Port Infrastructure Drone Strikes Threaten Global Food Staple Corridors',
    summary: 'Persistent kinetic drone strikes on Danube river ports (Reni, Izmail) and drifting Soviet-era sea mines along the Romanian-Bulgarian maritime corridor restrict bulk grain carriers. Sovereign food security planners in North Africa and Middle East face 35% grain price volatility.',
    geopoliticalSentimentScore: 88,
    affectedCommodities: ['Wheat', 'Corn', 'Sunflower Oil', 'Barley', 'Fertilizer'],
    hsCodes: [
      { code: 'HS 1001', name: 'Wheat and Meslin', priority: 'Critical' },
      { code: 'HS 1512', name: 'Sunflower-Seed & Safflower Oil', priority: 'High' },
      { code: 'HS 3102', name: 'Mineral or Chemical Fertilizers (Nitrogenous)', priority: 'High' },
    ],
    spotFreightImpact: {
      containerIndexDeltaPercent: 130,
      delayDaysAvg: 11.0,
      dailyTradeLossEstimated: '$850 Million / day',
      insuranceWarRiskHikePercent: 290,
    },
    rootCauses: [
      {
        category: 'Kinetic & Conflict',
        description: 'Naval blockades, anti-ship missiles, and port terminal strikes along the Black Sea shoreline.',
      },
      {
        category: 'Sanctions & Policy',
        description: 'Collapse of UN Black Sea Grain Initiative; insurance coverage exclusions by western underwriters.',
      },
    ],
    recoveryTimeline: {
      expectedDays: 90,
      confidenceInterval: '60 - 180 Days (Tied to cessation of Black Sea naval hostilities)',
      escalationRiskPercent: 70,
    },
    keyActors: ['Ukrainian Defense Forces', 'Russian Black Sea Fleet', 'Turkish Navy Escorts', 'UN WFP', 'Bunge', 'Cargill'],
    recommendedPlaybooks: [
      'Divert grain volumes through Danube river barges and Constanța rail line',
      'Activate sovereign grain reserve swaps with Argentine and Australian suppliers',
      'Utilize Turkish-escorted territorial waters shallow-draft coastal shipping',
    ],
  },
  {
    id: 'baltic-infrastructure-sabotage',
    title: 'Baltic Sea Undersea Gas & Telecom Infrastructure Sabotage',
    location: 'Gulf of Finland / Baltic Sea',
    coordinates: { lat: 59.8000, lng: 24.5000 },
    severity: 'medium',
    type: 'infrastructure',
    status: 'monitoring',
    dateReported: '2023-10-10',
    headline: 'Anchor Dragging and Undersea Cable Ruptures Impair Critical Energy and Communication Links',
    summary: 'Ruptures to the Balticconnector gas pipeline and commercial submarine fiber-optic cables by shadow fleet bulk carriers have prompted NATO naval patrols and intensified maritime inspections across the Gulf of Finland.',
    geopoliticalSentimentScore: 74,
    affectedCommodities: ['Natural Gas', 'Refined Petroleum Products', 'Forest Products & Pulp', 'Industrial Minerals'],
    hsCodes: [
      { code: 'HS 2711', name: 'Natural Gas in Gaseous State', priority: 'High' },
      { code: 'HS 4703', name: 'Chemical Wood Pulp', priority: 'Medium' },
    ],
    spotFreightImpact: {
      containerIndexDeltaPercent: 30,
      delayDaysAvg: 4.0,
      dailyTradeLossEstimated: '$320 Million / day',
      insuranceWarRiskHikePercent: 85,
    },
    rootCauses: [
      {
        category: 'Sanctions & Policy',
        description: 'Grey-zone hybrid warfare against sovereign subsea energy and telecommunication infrastructure.',
      },
    ],
    recoveryTimeline: {
      expectedDays: 40,
      confidenceInterval: '30 - 60 Days',
      escalationRiskPercent: 45,
    },
    keyActors: ['NATO Standing Maritime Group', 'Finnish Border Guard', 'Estonian Navy', 'Gasgrid Finland'],
    recommendedPlaybooks: [
      'Utilize LNG regasification floating terminal (FSRU) at Inkoo',
      'Switch communications to redundant satellite and overland Scandinavian fiber routes',
    ],
  },
];

export const CASCADE_MIND_MAPS: Record<string, CascadeNodeDetail[]> = {
  'red-sea-kinetic-strikes': [
    {
      id: 'node-trigger',
      title: 'Houthi Kinetic Drone & Anti-Ship Missile Strikes',
      stage: 'Trigger',
      category: 'Geopolitics',
      description: 'Asymmetric militant warfare in Bab-el-Mandeb targeting international merchant commercial vessels.',
      criticality: 'critical',
      totalValueAtRisk: '$12.4B Global Seaborne Trade',
      impactedContractsCount: 1420,
      impactedPurchaseOrders: [],
      contingencyActions: [
        'Initiate War Risk insurance claim notification',
        'Direct all fleet operators to hold positions in Gulf of Oman and Red Sea outer anchorages',
      ],
    },
    {
      id: 'node-1st-order',
      title: 'Bab-el-Mandeb & Suez Transit Avoidance',
      stage: '1st Order',
      category: 'Maritime',
      description: 'Major container lines (Maersk, MSC, Hapag-Lloyd, CMA CGM) declare Force Majeure and divert 80%+ of voyages around Africa.',
      criticality: 'critical',
      totalValueAtRisk: '$8.2B Active Shipments',
      impactedContractsCount: 940,
      impactedPurchaseOrders: [
        {
          id: 'PO-88412',
          vendor: 'TSMC Advanced Packaging',
          item: 'Automotive Radar ASIC Chips (HS 8542)',
          poValue: '$14,200,000',
          delayEstimate: '+14 Days',
          facility: 'Sindelfingen Assembly Complex (Mercedes-Benz)',
          status: 'Delayed',
        },
        {
          id: 'PO-90314',
          vendor: 'Contemporary Amperex Technology (CATL)',
          item: 'LFP Battery Cells & Module Packs',
          poValue: '$28,400,000',
          delayEstimate: '+13 Days',
          facility: 'Wolfsburg EV Plant (Volkswagen Group)',
          status: 'Delayed',
        },
      ],
      contingencyActions: [
        'Secure extended bunker fuel supply contracts at Port Louis (Mauritius) and Durban',
        'Notify cargo owners of Emergency Transit Surcharge (ETS) of $1,500/FEU',
      ],
    },
    {
      id: 'node-2nd-order-cape',
      title: 'Cape of Good Hope +14-Day Circuit Overhead',
      stage: '2nd Order',
      category: 'Maritime',
      description: 'Vessels face +3,500 nautical miles, +$850k extra fuel burn, and severe winter weather in the Southern Ocean.',
      criticality: 'high',
      totalValueAtRisk: '$4.1B Operating Overhead',
      impactedContractsCount: 420,
      impactedPurchaseOrders: [
        {
          id: 'PO-77209',
          vendor: 'Foxconn Yantian Facility',
          item: 'High-Density Server Motherboards',
          poValue: '$18,900,000',
          delayEstimate: '+15 Days',
          facility: 'Frankfurt Datacenter Cluster',
          status: 'Stranded',
        },
      ],
      contingencyActions: [
        'Increase vessel sailing speed from 14 knots to 17.5 knots to recover 3 days at higher fuel burn',
        'Authorize priority dry-docking in Singapore upon return voyage',
      ],
    },
    {
      id: 'node-2nd-order-ports',
      title: 'Rotterdam & Antwerp Berth Congestion Gridlock',
      stage: '2nd Order',
      category: 'Port Logistics',
      description: 'Vessel arrival bunched clusters trigger yard density exceeding 92%; truck turn-times surge to 4.2 hours.',
      criticality: 'high',
      totalValueAtRisk: '$2.8B Terminal Cargo',
      impactedContractsCount: 310,
      impactedPurchaseOrders: [
        {
          id: 'PO-65120',
          vendor: 'Denso Corporation',
          item: 'Brake Actuators & Electronic Calipers',
          poValue: '$9,800,000',
          delayEstimate: '+10 Days',
          facility: 'Brussels Assembly Facility (Audi)',
          status: 'Expedited Air',
        },
      ],
      contingencyActions: [
        'Implement 24/7 off-dock container storage buffer in Venlo and Duisburg inland ports',
        'Waive demurrage and detention fees through carrier negotiations',
      ],
    },
    {
      id: 'node-3rd-order-auto',
      title: 'European Automotive Just-In-Time Assembly Shutdown',
      stage: '3rd Order',
      category: 'Manufacturing',
      description: 'Assembly line stoppages at Tesla Grünheide and Volvo Ghent due to stockout of Tier-2 wiring harnesses and gearbox sensors.',
      criticality: 'critical',
      totalValueAtRisk: '$5.4B Plant Output',
      impactedContractsCount: 88,
      impactedPurchaseOrders: [
        {
          id: 'PO-99124',
          vendor: 'Leoni Wiring Systems',
          item: 'High-Voltage Wiring Harnesses',
          poValue: '$6,400,000',
          delayEstimate: '+18 Days',
          facility: 'Grünheide Gigafactory (Tesla)',
          status: 'Stranded',
        },
        {
          id: 'PO-33418',
          vendor: 'Bosch Automotive Electronics',
          item: 'Engine Control Units (ECU)',
          poValue: '$11,700,000',
          delayEstimate: '+12 Days',
          facility: 'Munich Plant 1 (BMW Group)',
          status: 'Hedged',
        },
      ],
      contingencyActions: [
        'Charter Antonov-124 cargo aircraft for emergency air-freight bridge from Penang to Frankfurt',
        'Shift shifts to partial production runs utilizing buffer stock',
      ],
    },
    {
      id: 'node-terminal-retail',
      title: 'Retail Empty Equipment Shortages & Consumer Price Spikes',
      stage: 'Terminal Impact',
      category: 'Supply Security',
      description: 'Empty containers trapped in Europe cannot return to Asia in time; export container shortages in Shanghai drive spot rates past $7,000/FEU.',
      criticality: 'high',
      totalValueAtRisk: '$7.8B Retail Merchandise',
      impactedContractsCount: 1800,
      impactedPurchaseOrders: [
        {
          id: 'PO-44109',
          vendor: 'IKEA Supply AG Shenzhen',
          item: 'Flatpack Furniture & Kitchen Cabinetry',
          poValue: '$8,200,000',
          delayEstimate: '+19 Days',
          facility: 'European Regional Distribution Centers',
          status: 'Delayed',
        },
      ],
      contingencyActions: [
        'Reposition empty containers via non-revenue positioning vessels',
        'Activate dual-sourcing contracts with Eastern European furniture manufacturers',
      ],
    },
  ],

  'panama-drought-crisis': [
    {
      id: 'node-panama-trigger',
      title: 'Gatún Lake Severe Drought & Freshwater Depletion',
      stage: 'Trigger',
      category: 'Geopolitics',
      description: 'El Niño weather patterns trigger 45% precipitation drop in Panama Canal catchment basin.',
      criticality: 'critical',
      totalValueAtRisk: '$3.5B Commodity Trade',
      impactedContractsCount: 520,
      impactedPurchaseOrders: [],
      contingencyActions: ['Monitor ACP daily reservoir draft advisories', 'Lock in auction bidding contingency funds'],
    },
    {
      id: 'node-panama-1st',
      title: 'Transit Cap Cut to 24 Daily Slots & 44-ft Draft Limit',
      stage: '1st Order',
      category: 'Maritime',
      description: 'Vessels forced to offload 20% of container weight or wait up to 21 days at anchor for transit slot auctions.',
      criticality: 'critical',
      totalValueAtRisk: '$2.1B Stranded Freight',
      impactedContractsCount: 380,
      impactedPurchaseOrders: [
        {
          id: 'PO-P102',
          vendor: 'ADM Midwest Ag Services',
          item: 'Soybeans & Winter Wheat (HS 1201)',
          poValue: '$12,400,000',
          delayEstimate: '+16 Days',
          facility: 'Guangzhou Feed Mills, China',
          status: 'Stranded',
        },
      ],
      contingencyActions: ['Reroute grain bulkers via Cape of Good Hope or Strait of Magellan', 'Utilize Panama Railroad Company for box offloading'],
    },
    {
      id: 'node-panama-2nd',
      title: 'US West Coast Rail Land-Bridge Gridlock',
      stage: '2nd Order',
      category: 'Port Logistics',
      description: 'Exporters divert East Coast ocean cargo to LA/Long Beach ports, overwhelming BNSF and Union Pacific intermodal rail capacity.',
      criticality: 'high',
      totalValueAtRisk: '$4.8B Intermodal Freight',
      impactedContractsCount: 650,
      impactedPurchaseOrders: [
        {
          id: 'PO-P205',
          vendor: 'Samsung Heavy Electronics',
          item: 'Home Appliances & Refrigerator Compressors',
          poValue: '$16,500,000',
          delayEstimate: '+9 Days',
          facility: 'Dallas Regional Logistics Park',
          status: 'Delayed',
        },
      ],
      contingencyActions: ['Shift priority rail shipments to expedited priority team-driver long-haul trucking', 'Negotiate Gulf Coast direct calls via Cape of Good Hope'],
    },
    {
      id: 'node-panama-terminal',
      title: 'US Gulf Coast LNG Export Delivery Defaults',
      stage: 'Terminal Impact',
      category: 'Supply Security',
      description: 'LNG carriers cannot meet delivery delivery windows in Tokyo and Seoul, triggering spot market replacement gas price surge.',
      criticality: 'critical',
      totalValueAtRisk: '$6.2B Energy Contracts',
      impactedContractsCount: 45,
      impactedPurchaseOrders: [
        {
          id: 'PO-P301',
          vendor: 'Cheniere Energy Sabine Pass',
          item: 'Liquefied Natural Gas (LNG - HS 2711)',
          poValue: '$48,000,000',
          delayEstimate: '+21 Days',
          facility: 'Tokyo Gas Negishi Terminal',
          status: 'Delayed',
        },
      ],
      contingencyActions: ['Swap cargo allocations with Australian and Qatari liquefaction facilities', 'Invoke Incoterms Ex-Ship delivery window renegotiations'],
    },
  ],
};

export const SAMPLE_REROUTE_SIMULATION: RerouteSimulationResult = {
  origin: 'Shanghai Port (Yangshan Deep-Water), China',
  destination: 'Port of Rotterdam (Maasvlakte II), Netherlands',
  originalRouteName: 'Asia-Europe Suez Corridor (via Bab-el-Mandeb)',
  bypassRouteName: 'Cape of Good Hope South-African Circuit Bypass',
  originalTransitDays: 24,
  bypassTransitDays: 37,
  transitDaysDelta: 13,
  originalNauticalMiles: 10450,
  bypassNauticalMiles: 14200,
  distanceDeltaMiles: 3750,
  fuelCostDeltaUsd: 580000,      // Extra bunker fuel burned
  canalTollDeltaUsd: -420000,     // Saved Suez canal transit fee
  netVoyageCostDeltaUsd: 160000,  // Net voyage financial delta (+160k)
  carbonEmissionsDeltaTons: 3850,
  originalRiskScore: 92,
  bypassRiskScore: 22,
  riskReductionPoints: 70,
  spotRatePerTeuDeltaUsd: 1850,
  feasibilityScorePercent: 94,
  executiveRecommendation: 'STRONG RECOMMENDATION: Divert all Tier-1 high-value container vessels via Cape of Good Hope. The 13-day transit latency is fully offset by complete elimination of kinetic drone/missile attack exposure, 70-point risk score drop, and avoidance of Suez insurance surcharges ($450k/vessel).',
  keyMitigations: [
    'Execute advance bunker hedging at Port Louis (Mauritius) to avoid Durban fuel price gouging.',
    'Issue formal Force Majeure notification to Tier-1 automotive and retail contract customers.',
    'Authorize $2.4M emergency air-freight carve-out for critical microprocessors (HS 8542).',
    'Pre-book Rotterdam off-dock container dwell space in Venlo logistics hub.',
  ],
};

export const SAMPLE_NOTICES: SupplierNoticeDraft[] = [
  {
    id: 'notice-force-majeure-suez',
    type: 'force_majeure',
    title: 'Notice of Force Majeure Event — Red Sea / Maritime Hostilities',
    recipient: 'Global Tier-1 Automotive Manufacturers & OEM Customers',
    subject: 'FORMAL NOTICE OF FORCE MAJEURE: Disruption of Maritime Shipping Transits via Red Sea / Bab-el-Mandeb',
    date: '2024-02-01',
    contractReference: 'Master Supply Agreement (MSA) § 18.2 (Force Majeure & Maritime Exclusions)',
    legalBasis: 'UN Convention on Contracts for the International Sale of Goods (CISG) Art. 79 & BIMCO Conwartime 2013',
    content: `Dear Valued Partner,

We hereby provide formal notice pursuant to Section 18.2 of our Master Supply Agreement that an event of Force Majeure has occurred and is currently preventing the timely delivery of scheduled automotive components and sub-assemblies.

1. NATURE OF EVENT:
Active and persistent military conflict, including unmanned aerial vehicle (UAV) and anti-ship ballistic missile attacks by regional combatant forces against commercial merchant shipping in the Bab-el-Mandeb Strait and Southern Red Sea, has rendered the Suez Canal transit corridor unsafe for commercial vessel navigation.

2. IMPACT ON TRANSIT & CARRIER ACTIONS:
Major global ocean carriers (including Maersk Line, MSC, and CMA CGM) have officially suspended Red Sea navigation and instituted mandatory reroutings via the Cape of Good Hope. This diversion adds approximately 3,750 nautical miles and 12 to 16 calendar days to standard transit times between Asian manufacturing facilities and European receiving hubs.

3. MITIGATION ACTIONS TAKEN:
(a) Immediate activation of priority bypass routing around Southern Africa;
(b) Establishment of daily container tracking telemetry via GeoLogix AI;
(c) Allocation of emergency air-freight capacity for critical-path semiconductor chips (HS 8542);
(d) Cooperation with regional bonded warehouses in Rotterdam and Antwerp to expedite offload.

4. DELAY NOTIFICATION & LEGAL POSITION:
Performance under the contract is excused during the continuation of this uncontrollable event. We are continuously monitoring developments and will provide updated revised Estimated Time of Arrival (ETA) schedules within 48 hours.

Sincerely,
Office of the Chief Risk Officer & VP of Global Logistics`,
    signoffRole: 'Chief Risk Officer & General Counsel',
  },
  {
    id: 'notice-carrier-directive-reroute',
    type: 'carrier_directive',
    title: 'Emergency Ocean Carrier Directive — Mandatory Cape Divert Order',
    recipient: 'Ocean Freight Carrier Consortia (2M / Ocean Alliance / THE Alliance)',
    subject: 'IMMEDIATE OPERATIONAL DIRECTIVE: Mandatory Cape of Good Hope Divert for Bill of Lading BL-994103 Series',
    date: '2024-02-02',
    contractReference: 'Ocean Carrier Master Service Agreement (Ocean Freight Rider § 7.4)',
    legalBasis: 'International Maritime Organization (IMO) Safety of Life at Sea (SOLAS) Convention',
    content: `ATTENTION: VESSEL OPERATIONS & CARGO ROUTING DESK

Pursuant to Section 7.4 (Cargo Security & War Risk Protocols) of our Ocean Transport Agreement, you are hereby formally directed to execute immediate alternative routing for all active and scheduled container consignments designated below:

1. CARGO IDENTIFIERS:
- Bill of Lading Series: BL-994100 through BL-994250
- High-Value Containers: 340 FEU High-Cube (Semiconductors, EV Powertrains, Precision Machinery)

2. MANDATORY DIRECTIVE:
You are instructed NOT to enter the Red Sea or transit the Bab-el-Mandeb Strait under any circumstances. All nominated vessels carrying our booked containers must divert immediately via the Cape of Good Hope bypass corridor.

3. BUNKERING & SCHEDULE COMMITMENTS:
We acknowledge the contractual Emergency Bunker Adjustment Factor (EBAF) subject to verified bunker purchasing receipts at Port Louis or Durban. Carrier must guarantee priority terminal berthing at Rotterdam Maasvlakte II upon arrival without secondary holding in outer anchorages.

Please confirm receipt and acknowledge execution of this routing directive within four (4) hours of receipt.

Authorized by:
Global Logistics Operations Directorate`,
    signoffRole: 'Global Logistics Director',
  },
  {
    id: 'notice-board-memo-cro',
    type: 'executive_board_memo',
    title: 'Executive Risk Briefing — Geopolitical Choke-Point Exposure Audit',
    recipient: 'Executive Committee & Board Risk Oversight Committee',
    subject: 'EXECUTIVE INTELLIGENCE BRIEFING: Geopolitical Supply Chain Exposure & Margin Hedging Strategy',
    date: '2024-02-05',
    contractReference: 'Board Risk Charter Item 4.1 — Geopolitical Vulnerability Review',
    legalBasis: 'Corporate Governance & Supply Chain Resilience Disclosure Standards',
    content: `EXECUTIVE SUMMARY:

1. PORTFOLIO EXPOSURE AUDIT:
GeoLogix AI risk modeling indicates that 68% of our active primary seaborne supply routes currently traverse high-threat maritime choke-points (Bab-el-Mandeb: Risk 94/100, Strait of Hormuz: Risk 91/100, Panama Canal: Risk 82/100). Total merchandise value in transit through contested zones is estimated at $142.8M.

2. FINANCIAL IMPACT ASSESSMENT:
- Spot freight rates from Shanghai to Northern Europe have surged +240% (from $1,550/FEU to $5,270/FEU).
- Additional voyage lead times average +13.5 days, tying up an incremental $28M in safety stock working capital.
- War-risk insurance surcharges have increased fourfold.

3. RECOMMENDED STRATEGIC HEDGES:
(a) Margin Preservation: Lock in 6-month fixed container slot contracts on Cape routes to insulate against spot market spikes, preserving an estimated 25% of operating margin.
(b) Sovereign & Dual-Sourcing: Accelerate nearshoring of Tier-2 automotive electronics to European and Mexican assembly clusters.
(c) Buffer Stocking: Authorize a 15-day inventory buffer increase for top 20 revenue-generating SKUs.

Respectfully submitted,
Chief Risk Officer (CRO)`,
    signoffRole: 'Chief Risk Officer',
  },
];
