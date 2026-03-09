// ── HERO SLIDER STATE ─────────────────────────────────────────────────────────
let heroSlide = 0;
let heroTimer = null;

function startHeroTimer() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => setHeroSlide((heroSlide + 1) % HERO_SLIDES.length), 5000);
}

function setHeroSlide(i) {
  heroSlide = i;
  const s = HERO_SLIDES[i];
  const el = id => document.getElementById(id);
  if (!el('hero-title')) return;
  document.querySelectorAll('.hero-bg-slide').forEach((el,idx) => el.classList.toggle('active', idx===i));
  document.querySelectorAll('.hero-dot').forEach((el,idx) => el.classList.toggle('active', idx===i));
  animateText('hero-badge', `<span class="hero-badge-dot"></span>${s.badge}`);
  animateText('hero-title', s.title);
  animateText('hero-desc', s.desc);
  const vi = document.getElementById('hero-visual');
  if (vi) { vi.style.opacity='0'; setTimeout(()=>{vi.textContent=s.icon;vi.style.opacity='0.12';},300); }
  startHeroTimer();
}

function animateText(elemId, txt) {
  const el = document.getElementById(elemId);
  if (!el) return;
  el.style.opacity = '0'; el.style.transform = 'translateY(6px)';
  setTimeout(() => { el.innerHTML = txt; el.style.transition='all 0.35s ease'; el.style.opacity='1'; el.style.transform='translateY(0)'; }, 200);
}

// ── RIGHT SIDEBAR ─────────────────────────────────────────────────────────────
function renderRightSidebar() {
  const el = document.getElementById('right-sidebar');
  if (!el) return;
  el.innerHTML = `
    ${renderQuickAI()}
    ${renderTopTopics()}
    ${renderQuickConsts()}
  `;
}

function renderQuickAI() {
  return `
  <div class="quick-ai-panel">
    <div class="qa-title">🤖 Quick AI Ask</div>
    <div class="qa-chips">
      ${["Explain VLE","CSTR vs PFR","McCabe-Thiele","Nusselt No.","Heat Exchanger design","Damköhler number"].map(q=>
        `<span class="qa-chip" onclick="openChatWith('${q}')">${q}</span>`).join('')}
    </div>
    <div class="qa-row">
      <input class="qa-input" id="qa-in" type="text" placeholder="Type a question..."
        onkeydown="if(event.key==='Enter'){const v=this.value.trim();if(v){openChatWith(v);this.value=''}}">
      <button class="qa-send-btn" onclick="const v=document.getElementById('qa-in').value.trim();if(v){openChatWith(v);document.getElementById('qa-in').value=''}">➤</button>
    </div>
  </div>`;
}

function renderTopTopics() {
  const topics = [
    {icon:'⚖️', title:'Vapor-Liquid Equil.', sub:'Thermodynamics · VLE', score:'9.8', q:'Explain vapor-liquid equilibrium in detail with examples'},
    {icon:'🏭', title:'Distillation Design', sub:'Unit Ops · McCabe-Thiele', score:'9.6', q:'Explain McCabe-Thiele method for distillation column design'},
    {icon:'⚗️', title:'Non-isothermal Rxn', sub:'Reactor Design', score:'9.4', q:'Explain energy balance for non-isothermal reactors'},
    {icon:'🔥', title:'Shell & Tube HX', sub:'Heat Transfer · TEMA', score:'9.1', q:'Explain shell and tube heat exchanger design and LMTD method'},
    {icon:'🌊', title:'Turbulent Pipe Flow', sub:'Fluid Mechanics', score:'8.9', q:'Explain turbulent pipe flow and Moody chart usage'},
  ];
  return `
  <div class="sidebar-panel">
    <div class="sp-hdr"><div class="sp-bar"></div><div class="sp-title">Top Study Topics</div></div>
    ${topics.map((t,i) => `
    <div class="ranked-item" onclick="openChatWith('${t.q}')">
      <div class="rank-num">${i+1}</div>
      <div class="rank-thumb">${t.icon}</div>
      <div class="rank-info">
        <div class="rank-title">${t.title}</div>
        <div class="rank-sub">${t.sub}</div>
      </div>
      <div class="rank-score">★ ${t.score}</div>
    </div>`).join('')}
  </div>`;
}

function renderQuickConsts() {
  const quick = CONSTANTS.slice(0, 6);
  return `
  <div class="sidebar-panel">
    <div class="sp-hdr"><div class="sp-bar" style="background:var(--accent2)"></div><div class="sp-title">Quick Constants</div></div>
    ${quick.map(c=>`
    <div class="const-item">
      <span class="const-sym">${c.sym}</span>
      <span class="const-name">${c.name}</span>
      <span class="const-val">${c.val}</span>
    </div>`).join('')}
  </div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ═════════════════════════════════════════════════════════════════════════════
function renderHome() {
  return `
  <!-- HERO -->
  <div class="hero-spotlight">
    ${HERO_SLIDES.map((s,i)=>`<div class="hero-bg-slide${i===0?' active':''}"></div>`).join('')}
    <div id="hero-visual" class="hero-visual-icon">${HERO_SLIDES[0].icon}</div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-badge" id="hero-badge"><span class="hero-badge-dot"></span>${HERO_SLIDES[0].badge}</div>
      <div class="hero-title" id="hero-title">${HERO_SLIDES[0].title}</div>
      <div class="hero-desc" id="hero-desc">${HERO_SLIDES[0].desc}</div>
      <div class="hero-tags">
        <div class="hero-tag"><div class="hero-tag-dot" style="background:var(--accent)"></div>Core Subject</div>
        <div class="hero-tag"><div class="hero-tag-dot" style="background:var(--yellow)"></div>120+ Formulas</div>
        <div class="hero-tag"><div class="hero-tag-dot" style="background:var(--accent3)"></div>Exam Ready</div>
      </div>
      <div class="hero-btns">
        <button class="btn-hero primary" onclick="openChat()">▶ Study with AI</button>
        <button class="btn-hero ghost" onclick="navigate('calculators')">🧮 Calculators</button>
      </div>
    </div>
    <div class="hero-dots">
      ${HERO_SLIDES.map((_,i)=>`<div class="hero-dot${i===0?' active':''}" onclick="setHeroSlide(${i})"></div>`).join('')}
    </div>
  </div>

  <!-- STATS -->
  <div class="stats-row">
    <div class="stat-item"><div class="stat-num">27+</div><div class="stat-label">Key formulas</div></div>
    <div class="stat-item"><div class="stat-num">6</div><div class="stat-label">Calculators</div></div>
    <div class="stat-item"><div class="stat-num">18</div><div class="stat-label">Constants</div></div>
    <div class="stat-item"><div class="stat-num">AI</div><div class="stat-label">Powered tutor</div></div>
  </div>

  <!-- SUBJECTS ROW -->
  <div class="page-section">
    <div class="section-hdr">
      <div class="sh-bar"></div>
      <div class="sh-title">Core Subjects</div>
      <div class="sh-all" onclick="navigate('subjects')">View All →</div>
    </div>
    <div class="card-scroll-row">
      ${SUBJECTS.map(s=>`
      <div class="subj-card" style="display:flex;flex-direction:column;height:auto;padding-bottom:12px">
        <div style="display:flex;gap:var(--space-sm);align-items:center;margin-bottom:12px">
          <div class="sc-thumb" style="background:${s.bg};margin-bottom:0">${s.icon}</div>
          <div class="sc-body">
            <div class="sc-title">${s.name}</div>
            <div class="sc-sub">${s.tags.slice(0,2).join(' · ')}</div>
          </div>
        </div>
        ${s.badge ? `<div class="sc-badge" style="background:${s.badgeColor};color:${s.badgeText}">${s.badge}</div>` : ''}
        <button class="btn-ai" style="width:100%;justify-content:center" onclick="openChatWith('Give me an overview of ${s.name} in chemical engineering')">
          <span class="btn-ai-icon">🤖</span> AI Study
        </button>
      </div>`).join('')}
    </div>
  </div>

  <!-- FORMULAS ROW -->
  <div class="page-section">
    <div class="section-hdr">
      <div class="sh-bar" style="background:var(--accent2)"></div>
      <div class="sh-title">Key Equations</div>
      <div class="sh-all" style="color:var(--accent2)" onclick="navigate('formulas')">View All →</div>
    </div>
    <div class="card-scroll-row">
      ${FORMULAS.slice(0,8).map(f=>`
      <div class="formula-scroll-card" style="display:flex;flex-direction:column;height:auto">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent2),var(--accent))"></div>
        <div class="fsc-cat" style="color:var(--accent)">${f.subject}</div>
        <div class="fsc-name">${f.name}</div>
        <div class="fsc-eq">${f.eq}</div>
        <div class="fsc-desc" style="flex:1">${f.desc}</div>
        <button class="btn-ai" style="margin-top:12px;width:100%;justify-content:center" onclick="openChatWith('Explain the formula: ${f.name} (${f.eq})')">
          <span class="btn-ai-icon">🤖</span> AI Explain
        </button>
      </div>`).join('')}
    </div>
  </div>

  <!-- CALCULATORS PREVIEW -->
  <div class="page-section">
    <div class="section-hdr">
      <div class="sh-bar" style="background:var(--accent3)"></div>
      <div class="sh-title">Quick Calculators</div>
      <div class="sh-all" style="color:var(--accent3)" onclick="navigate('calculators')">All Calculators →</div>
    </div>
    <div class="calc-grid">
      ${renderIGCalc()}
      ${renderReCalc()}
    </div>
  </div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: SUBJECTS
// ═════════════════════════════════════════════════════════════════════════════
function renderSubjects() {
  return `
  <div class="section-hdr" style="margin-bottom:20px">
    <div class="sh-bar"></div>
    <div class="sh-title">All Subjects</div>
  </div>
  <div class="subjects-grid">
    ${SUBJECTS.map(s => `
    <div class="subj-full-card" style="display:flex;flex-direction:column">
      <div class="sfc-hero" style="background:${s.bg}">${s.icon}
        ${s.badge ? `<div class="sfc-badge" style="background:${s.badgeColor};color:${s.badgeText};z-index:2;position:absolute;top:8px;right:8px">${s.badge}</div>` : ''}
      </div>
      <div class="sfc-body" style="flex:1;display:flex;flex-direction:column">
        <div class="sfc-title">${s.name}</div>
        <div class="sfc-desc" style="flex:1">${s.desc}</div>
        <div class="sfc-tags">${s.tags.map(t=>`<span class="sfc-tag">${t}</span>`).join('')}</div>
        <button class="btn-ai" style="width:100%;justify-content:center;margin-top:var(--space-md)" onclick="openChatWith('Teach me about ${s.name} in chemical engineering. Start with key concepts and important formulas.')">
          <span class="btn-ai-icon">🤖</span> AI Masterclass
        </button>
      </div>
    </div>`).join('')}
  </div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: FORMULAS
// ═════════════════════════════════════════════════════════════════════════════
function renderFormulas(activeSubject = 'All') {
  const subjects = ['All', ...new Set(FORMULAS.map(f => f.subject))];
  const filtered = activeSubject === 'All' ? FORMULAS : FORMULAS.filter(f => f.subject === activeSubject);
  const colors = {
    'Thermodynamics': ['var(--accent)', 'var(--yellow)'],
    'Fluid Mechanics': ['var(--accent2)', 'var(--accent)'],
    'Heat Transfer': ['var(--accent3)', 'var(--red)'],
    'Mass Transfer': ['var(--green)', 'var(--accent)'],
    'Reaction Engineering': ['var(--yellow)', 'var(--accent3)'],
    'Process Control': ['var(--accent2)', 'var(--accent3)'],
  };
  return `
  <div class="section-hdr" style="margin-bottom:16px">
    <div class="sh-bar" style="background:var(--accent2)"></div>
    <div class="sh-title">Equation Reference</div>
  </div>
  <div class="subject-tabs">
    ${subjects.map(s=>`
    <button class="subj-tab${s===activeSubject?' active':''}" onclick="renderPage('formulas','${s}')">${s}</button>
    `).join('')}
  </div>
  <div class="formulas-grid">
    ${filtered.map(f => {
      const [c1, c2] = colors[f.subject] || ['var(--accent)', 'var(--accent2)'];
      return `
      <div class="formula-full-card" style="display:flex;flex-direction:column">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${c1},${c2})"></div>
        <div class="ffc-subject" style="color:${c1}">${f.subject}</div>
        <div class="ffc-name">${f.name}</div>
        <div class="ffc-eq">${f.eq}</div>
        <div class="ffc-desc" style="flex:1">${f.desc}</div>
        <div class="ffc-tags">${f.tags.map(t=>`<span class="ffc-tag">${t}</span>`).join('')}</div>
        <button class="btn-ai" style="margin-top:var(--space-md);width:100%;justify-content:center" onclick="openChatWith('Explain ${f.name}: ${f.eq} — derivation, meaning, and a worked example')">
          <span class="btn-ai-icon">🤖</span> AI Derivation & Example
        </button>
      </div>`;
    }).join('')}
  </div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: CALCULATORS
// ═════════════════════════════════════════════════════════════════════════════
function renderCalculators() {
  return `
  <div class="section-hdr" style="margin-bottom:20px">
    <div class="sh-bar" style="background:var(--accent3)"></div>
    <div class="sh-title">Process Calculators</div>
  </div>
  <div class="calc-grid">
    ${renderIGCalc()}
    ${renderReCalc()}
    ${renderHTCalc()}
    ${renderARCalc()}
    ${renderLMTDCalc()}
    ${renderCSTRCalc()}
  </div>`;
}

function renderIGCalc() {
  return `
  <div class="calc-panel">
    <div class="calc-panel-hdr">
      <div style="display:flex;align-items:center;gap:10px;flex:1">
        <span class="cp-icon">🌡️</span>
        <span class="cp-title">Ideal Gas Law</span>
      </div>
      <button class="btn-ai" style="margin-top:0;padding:4px 10px" onclick="openChatWith('Explain the Ideal Gas Law (PV=nRT), its assumptions, and when it fails (real gases).')">
        <span class="btn-ai-icon">🤖</span> AI Help
      </button>
    </div>
    <div style="text-align:center;padding:10px;background:var(--bg-surface);border-radius:var(--radius-sm);margin:8px 0;font-family:var(--font-mono);color:var(--primary-light)">PV = nRT</div>
    <div class="calc-panel-body">
      <div class="c-row"><span class="c-label">Solve for</span>
        <select class="c-select" id="ig-solve"><option value="P">Pressure (P)</option><option value="V">Volume (V)</option><option value="n">Moles (n)</option><option value="T">Temperature (T)</option></select>
      </div>
      <div class="c-row"><span class="c-label">P (Pa)</span><input class="c-input" type="number" id="ig-P" placeholder="101325"></div>
      <div class="c-row"><span class="c-label">V (m³)</span><input class="c-input" type="number" id="ig-V" placeholder="0.0224"></div>
      <div class="c-row"><span class="c-label">n (mol)</span><input class="c-input" type="number" id="ig-n" placeholder="1.0"></div>
      <div class="c-row"><span class="c-label">T (K)</span><input class="c-input" type="number" id="ig-T" placeholder="273.15"></div>
      <div class="calc-result-row">
        <div class="calc-result-box" id="ig-res">—</div>
        <button class="calc-btn" onclick="calcIG()">Calculate</button>
      </div>
    </div>
  </div>`;
}

function renderReCalc() {
  return `
  <div class="calc-panel">
    <div class="calc-panel-hdr">
      <div style="display:flex;align-items:center;gap:10px;flex:1">
        <span class="cp-icon">🌊</span>
        <span class="cp-title">Reynolds Number</span>
      </div>
      <button class="btn-ai" style="margin-top:0;padding:4px 10px" onclick="openChatWith('Explain Reynolds Number (Re), its physical significance, and how to interpret laminar vs turbulent flow.')">
        <span class="btn-ai-icon">🤖</span> AI Help
      </button>
    </div>
    <div style="text-align:center;padding:10px;background:var(--bg-surface);border-radius:var(--radius-sm);margin:8px 0;font-family:var(--font-mono);color:var(--primary-light)">Re = ρvD/μ</div>
    <div class="calc-panel-body">
      <div class="c-row"><span class="c-label">ρ (kg/m³)</span><input class="c-input" type="number" id="re-r" placeholder="1000"></div>
      <div class="c-row"><span class="c-label">v (m/s)</span><input class="c-input" type="number" id="re-v" placeholder="0.5"></div>
      <div class="c-row"><span class="c-label">D (m)</span><input class="c-input" type="number" id="re-d" placeholder="0.05"></div>
      <div class="c-row"><span class="c-label">μ (Pa·s)</span><input class="c-input" type="number" id="re-m" placeholder="0.001"></div>
      <div class="calc-spacer"></div>
      <div class="calc-result-row">
        <div class="calc-result-box" id="re-res">—</div>
        <button class="calc-btn" onclick="calcRe()">Calculate</button>
      </div>
    </div>
  </div>`;
}

function renderHTCalc() {
  return `
  <div class="calc-panel">
    <div class="calc-panel-hdr">
      <span class="cp-icon">🔥</span>
      <span class="cp-title">Heat Duty</span>
      <span class="cp-eq">Q = mCpΔT</span>
    </div>
    <div class="calc-panel-body">
      <div class="c-row"><span class="c-label">m (kg)</span><input class="c-input" type="number" id="ht-m" placeholder="5.0"></div>
      <div class="c-row"><span class="c-label">Cp (J/kg·K)</span><input class="c-input" type="number" id="ht-c" placeholder="4186"></div>
      <div class="c-row"><span class="c-label">T₁ (K)</span><input class="c-input" type="number" id="ht-t1" placeholder="293"></div>
      <div class="c-row"><span class="c-label">T₂ (K)</span><input class="c-input" type="number" id="ht-t2" placeholder="373"></div>
      <div class="calc-spacer"></div>
      <div class="calc-result-row">
        <div class="calc-result-box" id="ht-res">—</div>
        <button class="calc-btn" onclick="calcHT()">Calculate</button>
      </div>
    </div>
  </div>`;
}

function renderARCalc() {
  return `
  <div class="calc-panel">
    <div class="calc-panel-hdr">
      <span class="cp-icon">⚗️</span>
      <span class="cp-title">Arrhenius Equation</span>
      <span class="cp-eq">k = A·e^(−Ea/RT)</span>
    </div>
    <div class="calc-panel-body">
      <div class="c-row"><span class="c-label">A (s⁻¹)</span><input class="c-input" type="number" id="ar-a" placeholder="1e8"></div>
      <div class="c-row"><span class="c-label">Ea (J/mol)</span><input class="c-input" type="number" id="ar-e" placeholder="50000"></div>
      <div class="c-row"><span class="c-label">T (K)</span><input class="c-input" type="number" id="ar-t" placeholder="300"></div>
      <div class="calc-spacer"></div><div class="calc-spacer"></div>
      <div class="calc-result-row">
        <div class="calc-result-box" id="ar-res">—</div>
        <button class="calc-btn" onclick="calcAR()">Calculate</button>
      </div>
    </div>
  </div>`;
}

function renderLMTDCalc() {
  return `
  <div class="calc-panel">
    <div class="calc-panel-hdr">
      <span class="cp-icon">♨️</span>
      <span class="cp-title">LMTD Calculator</span>
      <span class="cp-eq">ΔT_lm</span>
    </div>
    <div class="calc-panel-body">
      <div class="c-row"><span class="c-label">Flow type</span>
        <select class="c-select" id="lm-flow"><option value="counter">Counter-current</option><option value="co">Co-current</option></select>
      </div>
      <div class="c-row"><span class="c-label">Th,in (K)</span><input class="c-input" type="number" id="lm-th1" placeholder="400"></div>
      <div class="c-row"><span class="c-label">Th,out (K)</span><input class="c-input" type="number" id="lm-th2" placeholder="320"></div>
      <div class="c-row"><span class="c-label">Tc,in (K)</span><input class="c-input" type="number" id="lm-tc1" placeholder="290"></div>
      <div class="c-row"><span class="c-label">Tc,out (K)</span><input class="c-input" type="number" id="lm-tc2" placeholder="360"></div>
      <div class="calc-result-row">
        <div class="calc-result-box" id="lm-res">—</div>
        <button class="calc-btn" onclick="calcLMTD()">Calculate</button>
      </div>
    </div>
  </div>`;
}

function renderCSTRCalc() {
  return `
  <div class="calc-panel">
    <div class="calc-panel-hdr">
      <span class="cp-icon">🔁</span>
      <span class="cp-title">CSTR Sizing</span>
      <span class="cp-eq">V = FA₀X/(−rA)</span>
    </div>
    <div class="calc-panel-body">
      <div class="c-row"><span class="c-label">FA₀ (mol/s)</span><input class="c-input" type="number" id="cs-fa0" placeholder="0.5"></div>
      <div class="c-row"><span class="c-label">X (0–1)</span><input class="c-input" type="number" id="cs-x" placeholder="0.8" step="0.01" min="0" max="1"></div>
      <div class="c-row"><span class="c-label">−rA (mol/m³s)</span><input class="c-input" type="number" id="cs-ra" placeholder="0.2"></div>
      <div class="calc-spacer"></div><div class="calc-spacer"></div>
      <div class="calc-result-row">
        <div class="calc-result-box" id="cs-res">—</div>
        <button class="calc-btn" onclick="calcCSTR()">Calculate</button>
      </div>
    </div>
  </div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: REFERENCE
// ═════════════════════════════════════════════════════════════════════════════
function renderReference(activeCat = 'all') {
  const cats = ['all', 'universal', 'fluid', 'thermal'];
  const filtered = activeCat === 'all' ? CONSTANTS : CONSTANTS.filter(c => c.cat === activeCat);
  return `
  <div class="section-hdr" style="margin-bottom:16px">
    <div class="sh-bar" style="background:var(--yellow)"></div>
    <div class="sh-title">Physical Constants &amp; Properties</div>
  </div>
  <div class="ref-table-wrap">
    <div class="ref-filter-row">
      ${cats.map(c=>`<button class="filter-pill${c===activeCat?' active':''}" onclick="renderPage('reference','${c}')">${c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join('')}
    </div>
    <table class="ref-table">
      <thead><tr><th>Name</th><th>Symbol</th><th>Value</th><th>Units</th><th>Type</th></tr></thead>
      <tbody>
        ${filtered.map(c=>`
        <tr>
          <td>${c.name}</td>
          <td class="td-sym">${c.sym}</td>
          <td class="td-val">${c.val}</td>
          <td class="td-unit">${c.unit}</td>
          <td><span class="td-cat">${c.cat}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}
