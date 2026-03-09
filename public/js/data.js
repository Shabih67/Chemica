/* ═══════════════════════════════════════════════════════════════════
   ChemCore — Data Layer
   All reference data, constants, and content for the platform
   ═══════════════════════════════════════════════════════════════════ */

const CHEMCORE_DATA = {
  // ── Physical Constants ─────────────────────────────────────────
  constants: [
    { sym:'R', name:'Universal Gas Constant', val:'8.314', unit:'J/(mol·K)', cat:'Universal' },
    { sym:'k_B', name:'Boltzmann Constant', val:'1.381×10⁻²³', unit:'J/K', cat:'Universal' },
    { sym:'N_A', name:"Avogadro's Number", val:'6.022×10²³', unit:'mol⁻¹', cat:'Universal' },
    { sym:'F', name:'Faraday Constant', val:'96485', unit:'C/mol', cat:'Universal' },
    { sym:'P₀', name:'Standard Atmosphere', val:'101325', unit:'Pa', cat:'Universal' },
    { sym:'h', name:'Planck Constant', val:'6.626×10⁻³⁴', unit:'J·s', cat:'Universal' },
    { sym:'σ', name:'Stefan-Boltzmann', val:'5.67×10⁻⁸', unit:'W/(m²·K⁴)', cat:'Universal' },
    { sym:'g', name:'Gravitational Accel.', val:'9.807', unit:'m/s²', cat:'Universal' },
    { sym:'ρ_w', name:'Water Density (25°C)', val:'997.0', unit:'kg/m³', cat:'Fluid' },
    { sym:'μ_w', name:'Water Viscosity (25°C)', val:'8.9×10⁻⁴', unit:'Pa·s', cat:'Fluid' },
    { sym:'ρ_air', name:'Air Density (STP)', val:'1.225', unit:'kg/m³', cat:'Fluid' },
    { sym:'μ_air', name:'Air Viscosity (STP)', val:'1.81×10⁻⁵', unit:'Pa·s', cat:'Fluid' },
    { sym:'Cp_w', name:'Water Cp (liquid)', val:'4186', unit:'J/(kg·K)', cat:'Thermal' },
    { sym:'Cp_air', name:'Air Cp (25°C)', val:'1005', unit:'J/(kg·K)', cat:'Thermal' },
    { sym:'k_w', name:'Water Thermal Cond.', val:'0.607', unit:'W/(m·K)', cat:'Thermal' },
    { sym:'k_steel', name:'Carbon Steel Cond.', val:'50.2', unit:'W/(m·K)', cat:'Thermal' },
    { sym:'k_ss', name:'Stainless Steel Cond.', val:'16.2', unit:'W/(m·K)', cat:'Thermal' },
    { sym:'ΔHvap_w', name:'Water Heat of Vap.', val:'2257', unit:'kJ/kg', cat:'Thermal' },
    { sym:'Pr_w', name:'Water Prandtl (25°C)', val:'6.13', unit:'—', cat:'Dimensionless' },
    { sym:'R_air', name:'Specific Gas Const. Air', val:'287', unit:'J/(kg·K)', cat:'Universal' },
  ],

  // ── Steam Tables (Saturated) ───────────────────────────────────
  steamTable: [
    { T:100, P:101.3, hf:419.1, hfg:2256.4, hg:2675.6, sf:1.307, sg:7.354 },
    { T:120, P:198.5, hf:503.7, hfg:2202.1, hg:2705.9, sf:1.528, sg:7.129 },
    { T:140, P:361.3, hf:589.1, hfg:2144.8, hg:2733.9, sf:1.739, sg:6.929 },
    { T:160, P:617.8, hf:675.5, hfg:2082.6, hg:2758.1, sf:1.943, sg:6.740 },
    { T:180, P:1002.2, hf:763.2, hfg:2015.3, hg:2778.2, sf:2.139, sg:6.585 },
    { T:200, P:1553.8, hf:852.4, hfg:1940.7, hg:2793.2, sf:2.331, sg:6.430 },
    { T:220, P:2318, hf:943.6, hfg:1858.5, hg:2802.1, sf:2.518, sg:6.284 },
    { T:240, P:3344, hf:1037.3, hfg:1766.5, hg:2803.8, sf:2.702, sg:6.143 },
    { T:260, P:4688, hf:1134.4, hfg:1662.5, hg:2796.9, sf:2.884, sg:6.001 },
    { T:280, P:6412, hf:1236.0, hfg:1543.6, hg:2779.6, sf:3.068, sg:5.858 },
    { T:300, P:8581, hf:1344.0, hfg:1404.9, hg:2749.0, sf:3.255, sg:5.705 },
    { T:320, P:11274, hf:1461.5, hfg:1238.6, hg:2700.1, sf:3.449, sg:5.536 },
    { T:340, P:14586, hf:1594.2, hfg:1027.9, hg:2622.0, sf:3.660, sg:5.336 },
    { T:360, P:18651, hf:1760.5, hfg:720.5, hg:2481.0, sf:3.915, sg:5.054 },
  ],

  // ── Antoine Constants ──────────────────────────────────────────
  antoineConstants: [
    { name:'Water', A:8.07131, B:1730.63, C:233.426, Tmin:1, Tmax:100, unit:'mmHg/°C' },
    { name:'Methanol', A:8.08097, B:1582.271, C:239.726, Tmin:15, Tmax:84, unit:'mmHg/°C' },
    { name:'Ethanol', A:8.20417, B:1642.89, C:230.300, Tmin:20, Tmax:93, unit:'mmHg/°C' },
    { name:'Acetone', A:7.02447, B:1161.0, C:224.0, Tmin:-20, Tmax:77, unit:'mmHg/°C' },
    { name:'Benzene', A:6.90565, B:1211.033, C:220.790, Tmin:8, Tmax:103, unit:'mmHg/°C' },
    { name:'Toluene', A:6.95464, B:1344.800, C:219.482, Tmin:6, Tmax:137, unit:'mmHg/°C' },
    { name:'n-Hexane', A:6.87776, B:1171.53, C:224.366, Tmin:-25, Tmax:92, unit:'mmHg/°C' },
    { name:'n-Heptane', A:6.89385, B:1264.37, C:216.636, Tmin:-2, Tmax:124, unit:'mmHg/°C' },
    { name:'Chloroform', A:6.95465, B:1170.966, C:226.232, Tmin:-10, Tmax:80, unit:'mmHg/°C' },
    { name:'Acetic Acid', A:7.38782, B:1533.313, C:222.309, Tmin:30, Tmax:140, unit:'mmHg/°C' },
    { name:'Diethyl Ether', A:6.92032, B:1064.066, C:228.799, Tmin:-60, Tmax:35, unit:'mmHg/°C' },
  ],

  // ── Heat Capacities ────────────────────────────────────────────
  heatCapacities: [
    { name:'Water (liquid)', Cp:4186, unit:'J/(kg·K)', Tref:'25°C', state:'Liquid' },
    { name:'Water (steam)', Cp:2010, unit:'J/(kg·K)', Tref:'100°C', state:'Gas' },
    { name:'Air', Cp:1005, unit:'J/(kg·K)', Tref:'25°C', state:'Gas' },
    { name:'Nitrogen', Cp:1040, unit:'J/(kg·K)', Tref:'25°C', state:'Gas' },
    { name:'Oxygen', Cp:918, unit:'J/(kg·K)', Tref:'25°C', state:'Gas' },
    { name:'Carbon Dioxide', Cp:844, unit:'J/(kg·K)', Tref:'25°C', state:'Gas' },
    { name:'Methane', Cp:2220, unit:'J/(kg·K)', Tref:'25°C', state:'Gas' },
    { name:'Ethanol', Cp:2440, unit:'J/(kg·K)', Tref:'25°C', state:'Liquid' },
    { name:'Methanol', Cp:2530, unit:'J/(kg·K)', Tref:'25°C', state:'Liquid' },
    { name:'Sulfuric Acid', Cp:1340, unit:'J/(kg·K)', Tref:'25°C', state:'Liquid' },
    { name:'NaOH (aq, 50%)', Cp:3140, unit:'J/(kg·K)', Tref:'25°C', state:'Liquid' },
    { name:'Acetone', Cp:2170, unit:'J/(kg·K)', Tref:'25°C', state:'Liquid' },
    { name:'Benzene', Cp:1740, unit:'J/(kg·K)', Tref:'25°C', state:'Liquid' },
    { name:'Toluene', Cp:1700, unit:'J/(kg·K)', Tref:'25°C', state:'Liquid' },
    { name:'Carbon Steel', Cp:502, unit:'J/(kg·K)', Tref:'25°C', state:'Solid' },
    { name:'Stainless Steel 304', Cp:500, unit:'J/(kg·K)', Tref:'25°C', state:'Solid' },
    { name:'Aluminum', Cp:897, unit:'J/(kg·K)', Tref:'25°C', state:'Solid' },
    { name:'Copper', Cp:385, unit:'J/(kg·K)', Tref:'25°C', state:'Solid' },
  ],

  // ── Corrosion Guide ────────────────────────────────────────────
  corrosionGuide: [
    { chemical:'Sulfuric Acid (<80%)', cs:'Poor', ss304:'Fair', ss316:'Good', hastelloy:'Excellent', titanium:'Good', pvc:'Good' },
    { chemical:'Sulfuric Acid (>80%)', cs:'Fair', ss304:'Poor', ss316:'Poor', hastelloy:'Excellent', titanium:'Poor', pvc:'Poor' },
    { chemical:'Hydrochloric Acid', cs:'Poor', ss304:'Poor', ss316:'Poor', hastelloy:'Excellent', titanium:'Poor', pvc:'Good' },
    { chemical:'Nitric Acid', cs:'Poor', ss304:'Good', ss316:'Good', hastelloy:'Good', titanium:'Excellent', pvc:'Fair' },
    { chemical:'Sodium Hydroxide', cs:'Good', ss304:'Excellent', ss316:'Excellent', hastelloy:'Excellent', titanium:'Poor', pvc:'Good' },
    { chemical:'Acetic Acid', cs:'Poor', ss304:'Good', ss316:'Excellent', hastelloy:'Excellent', titanium:'Excellent', pvc:'Good' },
    { chemical:'Phosphoric Acid', cs:'Poor', ss304:'Fair', ss316:'Good', hastelloy:'Excellent', titanium:'Good', pvc:'Good' },
    { chemical:'Seawater', cs:'Poor', ss304:'Poor', ss316:'Fair', hastelloy:'Good', titanium:'Excellent', pvc:'Good' },
    { chemical:'Chlorine (wet)', cs:'Poor', ss304:'Poor', ss316:'Poor', hastelloy:'Good', titanium:'Excellent', pvc:'Fair' },
    { chemical:'Ammonia', cs:'Good', ss304:'Excellent', ss316:'Excellent', hastelloy:'Excellent', titanium:'Good', pvc:'Good' },
  ],

  // ── Unit Conversions ───────────────────────────────────────────
  unitCategories: {
    'Pressure': [
      { name:'Pascal (Pa)', factor:1 },
      { name:'kPa', factor:1000 },
      { name:'MPa', factor:1e6 },
      { name:'bar', factor:1e5 },
      { name:'atm', factor:101325 },
      { name:'psi', factor:6894.76 },
      { name:'mmHg (Torr)', factor:133.322 },
      { name:'inH₂O', factor:249.089 },
    ],
    'Temperature': 'special',
    'Flow Rate': [
      { name:'m³/s', factor:1 },
      { name:'m³/hr', factor:1/3600 },
      { name:'L/min', factor:1/60000 },
      { name:'L/s', factor:0.001 },
      { name:'GPM (US)', factor:6.309e-5 },
      { name:'ft³/s (cfs)', factor:0.02832 },
      { name:'bbl/day', factor:1.84e-6 },
    ],
    'Length': [
      { name:'meter (m)', factor:1 },
      { name:'cm', factor:0.01 },
      { name:'mm', factor:0.001 },
      { name:'inch', factor:0.0254 },
      { name:'foot', factor:0.3048 },
      { name:'yard', factor:0.9144 },
      { name:'mile', factor:1609.34 },
    ],
    'Mass': [
      { name:'kg', factor:1 },
      { name:'gram', factor:0.001 },
      { name:'tonne', factor:1000 },
      { name:'lb', factor:0.453592 },
      { name:'oz', factor:0.0283495 },
      { name:'US ton', factor:907.185 },
    ],
    'Volume': [
      { name:'m³', factor:1 },
      { name:'Liter', factor:0.001 },
      { name:'mL', factor:1e-6 },
      { name:'US Gallon', factor:0.003785 },
      { name:'ft³', factor:0.02832 },
      { name:'barrel (bbl)', factor:0.158987 },
      { name:'Imperial Gallon', factor:0.004546 },
    ],
    'Viscosity (Dynamic)': [
      { name:'Pa·s', factor:1 },
      { name:'mPa·s (cP)', factor:0.001 },
      { name:'Poise', factor:0.1 },
      { name:'lb/(ft·s)', factor:1.48816 },
    ],
    'Energy': [
      { name:'Joule (J)', factor:1 },
      { name:'kJ', factor:1000 },
      { name:'cal', factor:4.184 },
      { name:'kcal', factor:4184 },
      { name:'BTU', factor:1055.06 },
      { name:'kWh', factor:3.6e6 },
      { name:'hp·hr', factor:2.685e6 },
    ],
    'Power': [
      { name:'Watt (W)', factor:1 },
      { name:'kW', factor:1000 },
      { name:'MW', factor:1e6 },
      { name:'hp', factor:745.7 },
      { name:'BTU/hr', factor:0.29307 },
    ],
  },

  // ── Formulas ───────────────────────────────────────────────────
  formulas: [
    { id:1, subject:'Thermodynamics', name:'Ideal Gas Law', eq:'PV = nRT', desc:'P=pressure, V=volume, n=moles, R=8.314 J/(mol·K), T=temperature', tags:['gas','pressure','volume'] },
    { id:2, subject:'Thermodynamics', name:'Clausius-Clapeyron', eq:'d(ln P)/dT = ΔHvap/(RT²)', desc:'Vapor pressure vs temperature relationship for VLE', tags:['VLE','vapor','pressure'] },
    { id:3, subject:'Thermodynamics', name:'Antoine Equation', eq:'log₁₀P* = A − B/(C+T)', desc:'Empirical vapor pressure correlation', tags:['vapor','pressure'] },
    { id:4, subject:'Thermodynamics', name:"Raoult's Law", eq:'yᵢP = xᵢPᵢ*', desc:'VLE for ideal mixtures', tags:['VLE','equilibrium'] },
    { id:5, subject:'Fluid Mechanics', name:'Reynolds Number', eq:'Re = ρvD/μ', desc:'Determines flow regime. Re<2100 laminar, Re>4000 turbulent', tags:['flow','dimensionless'] },
    { id:6, subject:'Fluid Mechanics', name:"Bernoulli's Equation", eq:'P/ρg + v²/2g + z = const', desc:'Energy conservation along a streamline', tags:['energy','pressure'] },
    { id:7, subject:'Fluid Mechanics', name:'Darcy-Weisbach', eq:'ΔP = f(L/D)(ρv²/2)', desc:'Pressure drop in pipe flow. f = friction factor', tags:['pressure drop','pipe'] },
    { id:8, subject:'Fluid Mechanics', name:'Hagen-Poiseuille', eq:'Q = πD⁴ΔP/(128μL)', desc:'Volumetric flow rate in laminar pipe flow', tags:['laminar','pipe'] },
    { id:9, subject:'Heat Transfer', name:"Fourier's Law", eq:'q = −kA(dT/dx)', desc:'Conductive heat flux', tags:['conduction'] },
    { id:10, subject:'Heat Transfer', name:'LMTD', eq:'ΔTlm = (ΔT₁−ΔT₂)/ln(ΔT₁/ΔT₂)', desc:'Log mean temperature difference for HX design', tags:['heat exchanger','LMTD'] },
    { id:11, subject:'Heat Transfer', name:'Stefan-Boltzmann', eq:'q = εσA(T₁⁴−T₂⁴)', desc:'Radiative heat transfer. σ=5.67×10⁻⁸ W/m²K⁴', tags:['radiation'] },
    { id:12, subject:'Heat Transfer', name:"Newton's Cooling", eq:'q = hA(Ts−T∞)', desc:'Convective heat transfer', tags:['convection'] },
    { id:13, subject:'Mass Transfer', name:"Fick's First Law", eq:'J = −D(dC/dx)', desc:'Molar diffusive flux', tags:['diffusion','flux'] },
    { id:14, subject:'Reaction Eng.', name:'Arrhenius', eq:'k = A·exp(−Ea/RT)', desc:'Temperature dependence of rate constant', tags:['kinetics','rate'] },
    { id:15, subject:'Reaction Eng.', name:'CSTR Design', eq:'V = FA₀·X/(−rA)', desc:'CSTR volume from molar feed, conversion, and rate', tags:['CSTR','reactor'] },
    { id:16, subject:'Reaction Eng.', name:'PFR Design', eq:'V = FA₀∫dX/(−rA)', desc:'PFR volume by integrating the design equation', tags:['PFR','reactor'] },
    { id:17, subject:'Process Control', name:'PID Controller', eq:'u(t) = Kc[e + (1/τI)∫e dt + τD·de/dt]', desc:'Standard PID controller output', tags:['PID','control'] },
  ],

  // ── Blog Posts ─────────────────────────────────────────────────
  blogPosts: [
    { id:1, title:'Green Hydrogen: The Future of Chemical Engineering', category:'trends', icon:'🌿', excerpt:'How green hydrogen production is reshaping the chemical industry and creating new opportunities for process engineers.', date:'Mar 5, 2026', readTime:'8 min' },
    { id:2, title:'Carbon Capture (CCUS): A Process Engineer\'s Guide', category:'trends', icon:'🏭', excerpt:'Technical deep dive into the major carbon capture technologies — post-combustion, pre-combustion, and direct air capture.', date:'Mar 1, 2026', readTime:'12 min' },
    { id:3, title:'How I Solved a Heat Exchanger Fouling Problem Saving $50k/yr', category:'stories', icon:'🔧', excerpt:'A plant floor case study on diagnosing and fixing severe fouling in a shell-and-tube heat exchanger.', date:'Feb 25, 2026', readTime:'6 min' },
    { id:4, title:'Dear ChemE: Should I Get My PE License?', category:'advice', icon:'💡', excerpt:'Career advice on when a Professional Engineer license is worth the investment, and when it might not be necessary.', date:'Feb 20, 2026', readTime:'5 min' },
    { id:5, title:'Battery Recycling: The Next Big ChemE Frontier', category:'trends', icon:'🔋', excerpt:'Why chemical engineers are in massive demand for lithium-ion battery recycling and what skills you need.', date:'Feb 15, 2026', readTime:'7 min' },
    { id:6, title:'The Day We Pumped Acid Through the Water Line', category:'stories', icon:'⚠️', excerpt:'An anonymous recounting of a mix-up that led to a near-miss incident and the lessons learned.', date:'Feb 10, 2026', readTime:'4 min' },
    { id:7, title:'Process Safety Management (PSM): 2026 Updates', category:'safety', icon:'🛡️', excerpt:'Summary of the latest OSHA PSM regulation changes and what they mean for your facility.', date:'Feb 5, 2026', readTime:'9 min' },
    { id:8, title:'From Lab to Plant: Scaling Up Bioplastic Production', category:'trends', icon:'♻️', excerpt:'Challenges and solutions in scaling bioplastic manufacturing from bench to commercial scale.', date:'Jan 30, 2026', readTime:'10 min' },
  ],

  // ── Industry Verticals ─────────────────────────────────────────
  industries: [
    { name:'Oil & Gas', icon:'🛢️', color:'var(--warning-subtle)', desc:'Downstream processing, pipeline hydraulics, and refinery operations.', topics:['FCC Units', 'Alkylation', 'Crude Oil Assays', 'Pipeline Hydraulics', 'Refinery Optimization'] },
    { name:'Pharmaceuticals', icon:'💊', color:'hsla(280,100%,65%,0.1)', desc:'cGMP, bioreactor design, validation, and clean-in-place systems.', topics:['cGMP', 'Bioreactor Design', 'Validation Protocols', 'CIP Systems', 'Sterile Processing'] },
    { name:'Food & Beverage', icon:'🍎', color:'var(--success-subtle)', desc:'Rheology, pasteurization, aseptic processing, and food safety.', topics:['Non-Newtonian Fluids', 'Pasteurization Units', 'Aseptic Processing', 'HACCP', 'Shelf Life'] },
    { name:'Water Treatment', icon:'💧', color:'var(--primary-subtle)', desc:'RO design, membrane filtration, ion exchange, and ETP operations.', topics:['Reverse Osmosis', 'Membrane Filtration', 'Ion Exchange', 'ETP Design', 'Desalination'] },
    { name:'Polymers & Materials', icon:'🧪', color:'var(--danger-subtle)', desc:'Polymerization kinetics, extrusion design, and compounding.', topics:['Polymerization Kinetics', 'Extrusion Screw Design', 'Compounding', 'Rheology', 'Additive Manufacturing'] },
  ],

  // ── Professional Societies ─────────────────────────────────────
  societies: [
    { name:'AIChE', fullName:'American Institute of Chemical Engineers', icon:'🏛️', url:'https://www.aiche.org', desc:'The world\'s leading organization for chemical engineering professionals.' },
    { name:'IChemE', fullName:'Institution of Chemical Engineers', icon:'🎓', url:'https://www.icheme.org', desc:'Global professional engineering institution for chemical engineers.' },
    { name:'SPE', fullName:'Society of Petroleum Engineers', icon:'🛢️', url:'https://www.spe.org', desc:'International society for oil and gas industry professionals.' },
    { name:'ACS', fullName:'American Chemical Society', icon:'⚗️', url:'https://www.acs.org', desc:'World\'s largest scientific society for chemistry professionals.' },
  ],

  // ── Books ──────────────────────────────────────────────────────
  books: [
    { title:"Perry's Chemical Engineers' Handbook", author:'Perry & Green', icon:'📗', desc:'The definitive reference for chemical engineering.' },
    { title:"Coulson & Richardson's Chemical Engineering", author:'Sinnott & Towler', icon:'📘', desc:'Comprehensive textbook covering design fundamentals.' },
    { title:'Transport Phenomena', author:'Bird, Stewart & Lightfoot', icon:'📙', desc:'Classic text on transport processes.' },
    { title:'Chemical Reaction Engineering', author:'Octave Levenspiel', icon:'📕', desc:'Industry-standard for reactor design.' },
    { title:'Process Dynamics and Control', author:'Seborg, Edgar & Mellichamp', icon:'📓', desc:'Essential process control reference.' },
    { title:'Unit Operations of Chemical Engineering', author:'McCabe, Smith & Harriott', icon:'📔', desc:'Foundational unit operations text.' },
  ],

  // ── Interview Questions ────────────────────────────────────────
  interviewQuestions: [
    { q:'Why is the pressure drop high in a pipe?', a:'Could be due to: increased flow rate, pipe fouling/scaling, undersized pipe diameter, high fluid viscosity, excessive fittings/valves, or partially closed valves. Check Re number and friction factor.', cat:'Fluid Mechanics' },
    { q:'Explain reflux ratio and its effect on distillation.', a:'Reflux ratio (L/D) is liquid returned to column vs distillate withdrawn. Higher reflux → better separation but higher energy cost. Minimum reflux = infinite stages; total reflux = minimum stages. Optimal is typically 1.2-1.5× minimum.', cat:'Separation' },
    { q:'What is NPSH and why does it matter?', a:'Net Positive Suction Head is the absolute pressure at pump suction minus vapor pressure. NPSHa (available) must exceed NPSHr (required) to prevent cavitation — vapor bubble formation/collapse that damages impellers.', cat:'Fluid Mechanics' },
    { q:'How do you size a relief valve?', a:'Use API 520/521. Determine worst case scenario (fire, blocked outlet, runaway reaction), calculate required relief rate, then size orifice using flow equations for the fluid phase. Account for backpressure and two-phase flow.', cat:'Safety' },
    { q:'Explain the difference between CSTR and PFR.', a:'CSTR: perfectly mixed, concentration uniform = exit concentration, good for slow reactions and temperature control. PFR: plug flow, concentration varies along length, higher conversion per volume for positive-order reactions. CSTR needs larger volume for same conversion.', cat:'Reaction Eng.' },
    { q:'What is a HAZOP study?', a:'Hazard and Operability study uses guide words (No, More, Less, Reverse, etc.) applied to process parameters to systematically identify deviations, their causes, consequences, and safeguards. Team-based approach required by PSM.', cat:'Safety' },
  ],

  // ── Conferences ────────────────────────────────────────────────
  conferences: [
    { name:'AIChE Annual Meeting', org:'AIChE', month:'NOV', day:'15', year:'2026', location:'Boston, MA', desc:'Largest gathering of chemical engineers worldwide' },
    { name:'ACHEMA', org:'DECHEMA', month:'JUN', day:'14', year:'2027', location:'Frankfurt, Germany', desc:'World forum for the process industries' },
    { name:'OTC (Offshore Technology)', org:'OTC', month:'MAY', day:'4', year:'2026', location:'Houston, TX', desc:'Premier event for offshore energy' },
    { name:'AIChE Spring Meeting', org:'AIChE', month:'MAR', day:'22', year:'2026', location:'San Antonio, TX', desc:'Focus on process safety and operations' },
  ],

  // ── Portfolio Projects ─────────────────────────────────────────
  projects: [
    { title:'FCC Unit Revamp & Optimization', icon:'🏗️', desc:'Led the revamp of a 45,000 bbl/day Fluid Catalytic Cracking unit, improving conversion by 4.2% and reducing catalyst consumption by 15%.', tags:['Oil & Gas','Process Optimization','Simulation'], impact:'$2.8M/year savings' },
    { title:'Heat Recovery System Design', icon:'♨️', desc:'Designed a waste heat recovery network using pinch analysis, recovering 12 MW of thermal energy from flue gas and process streams.', tags:['Heat Transfer','Sustainability','Pinch Analysis'], impact:'30% energy reduction' },
    { title:'Wastewater Treatment Plant Upgrade', icon:'💧', desc:'Managed the design and commissioning of an upgraded ETP with membrane bioreactor technology, achieving 99.5% BOD removal.', tags:['Water Treatment','MBR','Environmental'], impact:'Zero liquid discharge' },
  ],

  // ── Case Studies ───────────────────────────────────────────────
  caseStudies: [
    { title:'Solving a Shell-and-Tube Heat Exchanger Fouling Issue',
      situation:'A critical cooler in an ethylene plant experienced declining performance — outlet temperature rose 15°C over 6 months.',
      task:'Diagnose root cause, implement solution, and prevent recurrence without extended shutdown.',
      action:'Analyzed fouling resistance trends, conducted tube-side inspection revealing CaCO₃ scaling. Implemented chemical cleaning protocol and installed an upstream softener.',
      result:'Restored original U-value. Saved $50,000/year in energy costs. Extended cleaning interval from 6 months to 18 months.',
      tags:['Heat Transfer','Troubleshooting','Cost Savings'] },
  ],

  // ── Regulatory Content ─────────────────────────────────────────
  regulations: [
    { title:'OSHA PSM (29 CFR 1910.119)', icon:'🛡️', color:'var(--danger-subtle)', items:['Process Hazard Analysis (PHA)','Operating Procedures','Mechanical Integrity','Management of Change (MOC)','Pre-startup Safety Review','Incident Investigation','Employee Participation','Emergency Planning'] },
    { title:'EPA RMP (40 CFR 68)', icon:'🌍', color:'var(--success-subtle)', items:['Hazard Assessment','Prevention Program','Emergency Response','Five-year Accident History','Off-site Consequence Analysis','Registration & Submission'] },
    { title:'Environmental Permitting', icon:'📋', color:'var(--primary-subtle)', items:['Title V Air Permits','NPDES Water Discharge','RCRA Hazardous Waste','CERCLA Reporting','EPCRA Tier II','State-specific Requirements'] },
    { title:'Pharmaceutical (FDA/cGMP)', icon:'💊', color:'hsla(280,100%,65%,0.1)', items:['21 CFR Part 210/211','Process Validation','Cleaning Validation','Equipment Qualification (IQ/OQ/PQ)','Change Control','CAPA Systems','Data Integrity (ALCOA+)'] },
  ],

  // ── Knowledge Base Articles ────────────────────────────────────
  kbArticles: {
    'mass-energy': {
      title: 'Mass & Energy Balances',
      content: `<h3>The Foundation of Chemical Engineering</h3>
<p>Mass and energy balances are the most fundamental tools in a chemical engineer's toolkit. Every process analysis begins with these conservation principles.</p>

<h3>Overall Mass Balance</h3>
<div class="equation-formula">Accumulation = Input − Output + Generation − Consumption</div>
<p>For a steady-state system with no chemical reaction, this simplifies to: <strong>Input = Output</strong>.</p>

<h3>Component Mass Balance</h3>
<p>For each species <em>i</em> in the system:</p>
<div class="equation-formula">ṁᵢ,in = ṁᵢ,out (at steady state, no reaction)</div>

<h3>Energy Balance (Open System)</h3>
<div class="equation-formula">Q̇ − Ẇₛ = Σṁ_out(h + v²/2 + gz)_out − Σṁ_in(h + v²/2 + gz)_in</div>
<p>Where Q̇ = heat transfer rate, Ẇₛ = shaft work, h = specific enthalpy, v = velocity, g = gravity, z = elevation.</p>

<h3>Common Simplifications</h3>
<ul>
<li><strong>No kinetic energy change:</strong> Δv² ≈ 0 (unless high-speed flow or nozzles)</li>
<li><strong>No potential energy change:</strong> Δz ≈ 0 (unless significant height differences)</li>
<li><strong>Adiabatic:</strong> Q̇ = 0 (insulated systems)</li>
<li><strong>No shaft work:</strong> Ẇₛ = 0 (heat exchangers, mixing)</li>
</ul>

<h3>Degrees of Freedom Analysis</h3>
<p>Before solving, always check: <strong>DOF = unknowns − independent equations</strong>. If DOF = 0, the system is solvable. If DOF > 0, you need more information.</p>`
    },
    'pid-guide': {
      title: 'P&ID (Piping & Instrumentation Diagram) Guide',
      content: `<h3>What is a P&ID?</h3>
<p>A P&ID is the most detailed engineering drawing used in process design. It shows all piping, equipment, instruments, and control systems required for a process.</p>

<h3>Standard Symbols</h3>
<table class="data-table">
<thead><tr><th>Symbol</th><th>Description</th><th>ISA Code</th></tr></thead>
<tbody>
<tr><td>○</td><td>Field-mounted instrument</td><td>—</td></tr>
<tr><td>○ with line</td><td>Control room instrument</td><td>—</td></tr>
<tr><td>FIC</td><td>Flow Indicating Controller</td><td>ISA 5.1</td></tr>
<tr><td>TT</td><td>Temperature Transmitter</td><td>ISA 5.1</td></tr>
<tr><td>LCV</td><td>Level Control Valve</td><td>ISA 5.1</td></tr>
<tr><td>PSV</td><td>Pressure Safety Valve</td><td>ISA 5.1</td></tr>
</tbody>
</table>

<h3>ISA Identification Letters</h3>
<p>First letter = measured variable: <strong>F</strong>=Flow, <strong>T</strong>=Temperature, <strong>P</strong>=Pressure, <strong>L</strong>=Level, <strong>A</strong>=Analysis</p>
<p>Subsequent letters = function: <strong>I</strong>=Indicating, <strong>C</strong>=Controlling, <strong>R</strong>=Recording, <strong>T</strong>=Transmitting, <strong>A</strong>=Alarm</p>

<h3>Line Types</h3>
<ul>
<li><strong>Solid thick line:</strong> Major process piping</li>
<li><strong>Solid thin line:</strong> Minor piping / tubing</li>
<li><strong>Dashed line:</strong> Signal lines (electrical, pneumatic)</li>
<li><strong>Dash-dot:</strong> Software / data link</li>
</ul>

<h3>Reading a P&ID</h3>
<ol>
<li>Start from feed streams (left side typically)</li>
<li>Follow process flow through major equipment</li>
<li>Identify control loops (instrument bubbles → valves)</li>
<li>Note safety devices (PSV, bursting discs)</li>
<li>Check utility connections (steam, cooling water)</li>
</ol>`
    },
    'equipment': {
      title: 'Equipment Design Standards',
      content: `<h3>ASME Boiler & Pressure Vessel Code</h3>
<p>The ASME BPVC is the primary standard for pressure vessel design in North America.</p>

<h3>Key ASME Sections</h3>
<ul>
<li><strong>Section II:</strong> Materials specifications</li>
<li><strong>Section V:</strong> Nondestructive Examination (NDE)</li>
<li><strong>Section VIII Div. 1:</strong> Pressure Vessels (most common)</li>
<li><strong>Section VIII Div. 2:</strong> Alternative Rules (allows higher stresses)</li>
<li><strong>Section IX:</strong> Welding & Brazing Qualifications</li>
</ul>

<h3>TEMA Standards for Heat Exchangers</h3>
<p>TEMA (Tubular Exchanger Manufacturers Association) defines three classes:</p>
<ul>
<li><strong>Class R:</strong> Severe requirements (petroleum/petrochemical) — heaviest construction</li>
<li><strong>Class C:</strong> Moderate requirements (commercial/general process)</li>
<li><strong>Class B:</strong> Economical (chemical process) — most economical</li>
</ul>

<h3>TEMA Type Designation</h3>
<p>Three-letter code: [Front Head] [Shell] [Rear Head]</p>
<p>Example: <strong>AES</strong> = Channel with removable cover + One-pass shell + Floating head</p>
<p>Common types: BEM (fixed tubesheet), AES (floating head), AKT (kettle reboiler)</p>

<h3>Design Pressure Rules</h3>
<ul>
<li>Design pressure ≥ max operating pressure + 10% (or + 25 psi, whichever is greater)</li>
<li>Design temperature ≥ max operating temperature + 25°F margin</li>
<li>Minimum wall thickness per ASME Section VIII: t = PR/(SE − 0.6P)</li>
</ul>`
    },
    'safety': {
      title: 'Safety & Relief Devices',
      content: `<h3>Process Safety Management (PSM)</h3>
<p>OSHA 29 CFR 1910.119 requires facilities handling highly hazardous chemicals to implement 14 elements of PSM.</p>

<h3>HAZOP Methodology</h3>
<p>Hazard and Operability Study — systematic team-based approach:</p>
<table class="data-table">
<thead><tr><th>Guide Word</th><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td>NO / NOT</td><td>Complete negation</td><td>No flow in the line</td></tr>
<tr><td>MORE</td><td>Quantitative increase</td><td>Higher pressure than design</td></tr>
<tr><td>LESS</td><td>Quantitative decrease</td><td>Lower temperature than needed</td></tr>
<tr><td>AS WELL AS</td><td>Qualitative modification</td><td>Contamination in feed</td></tr>
<tr><td>REVERSE</td><td>Logical opposite</td><td>Backflow in the pipe</td></tr>
<tr><td>PART OF</td><td>Qualitative decrease</td><td>Incomplete reaction</td></tr>
<tr><td>OTHER THAN</td><td>Complete substitution</td><td>Wrong material introduced</td></tr>
</tbody>
</table>

<h3>Relief Valve Sizing (API 520/521)</h3>
<div class="equation-formula">A = W √(TZ) / (C·Kd·P₁·Kb·Kc·√M)</div>
<p>Where: A=orifice area, W=mass flow, T=temperature, Z=compressibility, C=gas constant factor, Kd=discharge coefficient, P₁=relieving pressure, M=molecular weight.</p>

<h3>Layers of Protection Analysis (LOPA)</h3>
<p>LOPA quantifies risk reduction provided by independent protection layers (IPLs):</p>
<ul>
<li><strong>Process design:</strong> PFD ~0.1</li>
<li><strong>BPCS control:</strong> PFD ~0.1</li>
<li><strong>Alarms with operator response:</strong> PFD ~0.1</li>
<li><strong>SIS (Safety Instrumented System):</strong> PFD 0.01-0.001 depending on SIL</li>
<li><strong>Relief devices:</strong> PFD ~0.01</li>
</ul>`
    },
    'formulas': {
      title: 'Formula Reference',
      content: 'dynamic'
    }
  },

  // ── Salary Data ────────────────────────────────────────────────
  salaryData: [
    { level:'Entry Level (0-2 yrs)', range:'$65,000 - $80,000', median:'$72,000' },
    { level:'Mid Level (3-7 yrs)', range:'$80,000 - $110,000', median:'$95,000' },
    { level:'Senior (8-15 yrs)', range:'$110,000 - $150,000', median:'$128,000' },
    { level:'Principal/Lead (15+ yrs)', range:'$140,000 - $180,000', median:'$158,000' },
    { level:'Management/Director', range:'$150,000 - $220,000', median:'$185,000' },
  ],
};
