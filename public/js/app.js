/* ═══════════════════════════════════════════════════════════════════
   ChemCore — Main Application
   SPA router, page rendering, theming, and all page content
   ═══════════════════════════════════════════════════════════════════ */

// ── Service Worker Registration (PWA) ─────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered:', registration);
      })
      .catch((error) => {
        console.log('[SW] Registration failed:', error);
      });
  });
}

// ── Navigation ───────────────────────────────────────────────────
let currentPage = 'dashboard';

// ── User State (Persisted) ───────────────────────────────────────
let userProfile = JSON.parse(localStorage.getItem('chemcore_profile')) || {
  name: 'Dr. Sarah Chen, PE',
  title: 'Senior Process Engineer · 12 years in Oil & Gas and Petrochemicals',
  avatar: '👷',
  badges: ['PE Licensed', 'Six Sigma Black Belt', 'PMP Certified']
};

let userProjects = JSON.parse(localStorage.getItem('chemcore_projects')) || [];
let userThreads = JSON.parse(localStorage.getItem('chemcore_threads')) || [];

function saveUserState() {
  localStorage.setItem('chemcore_profile', JSON.stringify(userProfile));
  localStorage.setItem('chemcore_projects', JSON.stringify(userProjects));
  localStorage.setItem('chemcore_threads', JSON.stringify(userThreads));
}

function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });

  const titles = {
    dashboard: 'Dashboard', calculators: 'Engineering Calculators',
    properties: 'Properties Database', knowledge: 'Knowledge Base',
    industry: 'Industry Verticals', regulatory: 'Regulatory & Compliance',
    portfolio: 'Portfolio', development: 'Professional Development',
    blog: 'Blog & Insights', community: 'Community',
    solver: '🧮 Problem Solver'
  };
  document.getElementById('page-title').textContent = titles[page] || 'Dashboard';
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'calculators') showCalc('unit-converter');
  if (page === 'properties') loadPropertiesPage();
  if (page === 'knowledge') loadKnowledgePage();
  if (page === 'industry') loadIndustryPage();
  if (page === 'regulatory') loadRegulatoryPage();
  if (page === 'portfolio') loadPortfolioPage();
  if (page === 'development') loadDevPage();
  if (page === 'blog') loadBlogPage();
  if (page === 'community') loadCommunityPage();
  if (page === 'solver') initSolverPage();
}

// ── Sidebar ──────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

// ── Theme Toggle ─────────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') !== 'light';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const icon = isDark ? '☀️' : '🌙';
  const label = isDark ? 'Light Mode' : 'Dark Mode';
  document.getElementById('theme-toggle').textContent = icon;
  document.getElementById('theme-icon-sidebar').textContent = icon;
  const sidebarLabel = document.querySelector('.sidebar-footer-btn .nav-label');
  if (sidebarLabel) sidebarLabel.textContent = label;
  localStorage.setItem('chemcore-theme', isDark ? 'light' : 'dark');
}

function loadSavedTheme() {
  const saved = localStorage.getItem('chemcore-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    const icon = saved === 'light' ? '☀️' : '🌙';
    const label = saved === 'light' ? 'Light Mode' : 'Dark Mode';
    document.getElementById('theme-toggle').textContent = icon;
    document.getElementById('theme-icon-sidebar').textContent = icon;
    const sidebarLabel = document.querySelector('.sidebar-footer-btn .nav-label');
    if (sidebarLabel) sidebarLabel.textContent = label;
  }
}

// ── Toast ────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── Properties Page ──────────────────────────────────────────────
let currentPropTab = 'constants';

function loadPropertiesPage() {
  showPropTab(currentPropTab);
}

function showPropTab(tab) {
  currentPropTab = tab;
  document.querySelectorAll('#prop-tabs .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });

  const content = document.getElementById('prop-table-content');
  if (tab === 'constants') {
    content.innerHTML = `<table class="data-table"><thead><tr><th>Symbol</th><th>Name</th><th>Value</th><th>Unit</th><th>Category</th></tr></thead><tbody>
      ${CHEMCORE_DATA.constants.map(c => `<tr><td class="formula-cell">${c.sym}</td><td>${c.name}</td><td class="formula-cell">${c.val}</td><td>${c.unit}</td><td><span class="badge badge-primary">${c.cat}</span></td></tr>`).join('')}
    </tbody></table>`;
  } else if (tab === 'steam') {
    content.innerHTML = `<table class="data-table"><thead><tr><th>T (°C)</th><th>P (kPa)</th><th>h_f (kJ/kg)</th><th>h_fg (kJ/kg)</th><th>h_g (kJ/kg)</th><th>s_f (kJ/kg·K)</th><th>s_g (kJ/kg·K)</th></tr></thead><tbody>
      ${CHEMCORE_DATA.steamTable.map(s => `<tr><td class="formula-cell">${s.T}</td><td class="formula-cell">${s.P}</td><td>${s.hf}</td><td>${s.hfg}</td><td>${s.hg}</td><td>${s.sf}</td><td>${s.sg}</td></tr>`).join('')}
    </tbody></table>`;
  } else if (tab === 'antoine') {
    content.innerHTML = `<table class="data-table"><thead><tr><th>Chemical</th><th>A</th><th>B</th><th>C</th><th>T_min (°C)</th><th>T_max (°C)</th></tr></thead><tbody>
      ${CHEMCORE_DATA.antoineConstants.map(a => `<tr><td>${a.name}</td><td class="formula-cell">${a.A}</td><td class="formula-cell">${a.B}</td><td class="formula-cell">${a.C}</td><td>${a.Tmin}</td><td>${a.Tmax}</td></tr>`).join('')}
    </tbody></table>`;
  } else if (tab === 'cp') {
    content.innerHTML = `<table class="data-table"><thead><tr><th>Substance</th><th>Cp (${CHEMCORE_DATA.heatCapacities[0].unit})</th><th>T_ref</th><th>State</th></tr></thead><tbody>
      ${CHEMCORE_DATA.heatCapacities.map(h => `<tr><td>${h.name}</td><td class="formula-cell">${h.Cp}</td><td>${h.Tref}</td><td><span class="badge ${h.state==='Gas'?'badge-warning':h.state==='Liquid'?'badge-primary':'badge-accent'}">${h.state}</span></td></tr>`).join('')}
    </tbody></table>`;
  } else if (tab === 'corrosion') {
    content.innerHTML = `<table class="data-table"><thead><tr><th>Chemical</th><th>Carbon Steel</th><th>SS 304</th><th>SS 316</th><th>Hastelloy</th><th>Titanium</th><th>PVC</th></tr></thead><tbody>
      ${CHEMCORE_DATA.corrosionGuide.map(c => {
        const colorMap = { Excellent:'var(--success)', Good:'var(--primary-light)', Fair:'var(--warning)', Poor:'var(--danger)' };
        const cell = v => `<td style="color:${colorMap[v]||'inherit'};font-weight:600">${v}</td>`;
        return `<tr><td>${c.chemical}</td>${cell(c.cs)}${cell(c.ss304)}${cell(c.ss316)}${cell(c.hastelloy)}${cell(c.titanium)}${cell(c.pvc)}</tr>`;
      }).join('')}
    </tbody></table>`;
  }
}

function filterProperties(query) {
  if (!query) { showPropTab(currentPropTab); return; }
  const rows = document.querySelectorAll('#prop-table-content tbody tr');
  const q = query.toLowerCase();
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// ── Knowledge Base ───────────────────────────────────────────────
let currentKBTopic = 'mass-energy';

function loadKnowledgePage() {
  showKBTopic(currentKBTopic);
}

function showKBTopic(topic) {
  currentKBTopic = topic;
  document.querySelectorAll('.kb-topic').forEach(t => {
    t.classList.toggle('active', t.dataset.topic === topic);
  });

  const article = CHEMCORE_DATA.kbArticles[topic];
  const el = document.getElementById('kb-article-content');

  if (article.content === 'dynamic') {
    el.innerHTML = `<h2>${article.title}</h2><div class="grid-2" style="margin-top:var(--space-lg)">
      ${CHEMCORE_DATA.formulas.map(f => `
        <div class="equation-card" style="display:flex;flex-direction:column;gap:12px">
          <div class="equation-name">${f.name} <span class="badge badge-primary" style="margin-left:8px">${f.subject}</span></div>
          <div class="equation-formula">${f.eq}</div>
          <div class="equation-desc" style="flex:1">${f.desc}</div>
          <div class="equation-tags">${f.tags.map(t => `<span class="equation-tag">${t}</span>`).join('')}</div>
          <button class="btn-ai" onclick="openChatWith('Explain the formula ${f.name}: ${f.eq} — derivation, meaning and practical usage.')">
            <span class="btn-ai-icon">🤖</span> Explain with AI
          </button>
        </div>`).join('')}</div>`;
  } else {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-lg);gap:var(--space-md)">
        <h2 style="margin-bottom:0">${article.title}</h2>
        <button class="btn-ai" style="margin-top:0" onclick="openChatWith('Explain the knowledge base topic: ${article.title}. Summary: ${article.content.replace(/<[^>]*>/g, '').substring(0, 300)}...')">
          <span class="btn-ai-icon">🤖</span> Explain Topic with AI
        </button>
      </div>
      ${article.content}`;
  }
}

// ── Industry Page ────────────────────────────────────────────────
function loadIndustryPage() {
  const grid = document.getElementById('industry-grid');
  if (grid.children.length > 0) return;
  grid.innerHTML = CHEMCORE_DATA.industries.map(ind => `
    <div class="industry-card" style="display:flex;flex-direction:column;gap:var(--space-md)">
      <div style="display:flex;align-items:center;gap:var(--space-md)">
        <div class="industry-icon" style="background:${ind.color};margin-bottom:0">${ind.icon}</div>
        <h3 style="margin-bottom:0">${ind.name}</h3>
      </div>
      <p style="flex:1">${ind.desc}</p>
      <div class="industry-topics">${ind.topics.map(t => `<span class="badge badge-primary">${t}</span>`).join('')}</div>
      <button class="btn-ai" onclick="openChatWith('Explain the ${ind.name} industry vertical in chemical engineering, focusing on: ${ind.topics.join(', ')}.')">
        <span class="btn-ai-icon">🤖</span> Industry Guide
      </button>
    </div>`).join('');
}

// ── Regulatory Page ──────────────────────────────────────────────
function loadRegulatoryPage() {
  const el = document.getElementById('regulatory-content');
  if (el.children.length > 0) return;
  el.innerHTML = CHEMCORE_DATA.regulations.map(reg => `
    <div class="reg-card" style="display:flex;flex-direction:column;gap:var(--space-md)">
      <div class="reg-card-header">
        <div class="reg-card-icon" style="background:${reg.color}">${reg.icon}</div>
        <div><h3 style="font-size:var(--text-lg)">${reg.title}</h3></div>
      </div>
      <ul style="padding-left:var(--space-xl);display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xs);flex:1">
        ${reg.items.map(i => `<li style="color:var(--text-secondary);font-size:var(--text-sm)">${i}</li>`).join('')}
      </ul>
      <button class="btn-ai" onclick="openChatWith('Explain the regulatory requirements for ${reg.title}, specifically: ${reg.items.join(', ')}.')">
        <span class="btn-ai-icon">🛡️</span> Explain Compliance
      </button>
    </div>`).join('');
}

// ── Portfolio Page ───────────────────────────────────────────────
let currentPortfolioTab = 'projects';

function loadPortfolioPage() {
  // Sync profile UI
  document.getElementById('portfolio-name').textContent = userProfile.name;
  document.getElementById('portfolio-title').textContent = userProfile.title;
  document.getElementById('portfolio-avatar').textContent = userProfile.avatar;
  document.getElementById('portfolio-badges').innerHTML = userProfile.badges.map(b => `<span class="badge badge-primary">${b}</span>`).join('');
  
  showPortfolioTab(currentPortfolioTab);
}

function showPortfolioTab(tab) {
  currentPortfolioTab = tab;
  document.querySelectorAll('[data-ptab]').forEach(t => {
    t.classList.toggle('active', t.dataset.ptab === tab);
  });

  const el = document.getElementById('portfolio-tab-content');
  const btnAdd = document.getElementById('btn-add-project');
  if (btnAdd) btnAdd.style.display = tab === 'projects' ? 'inline-flex' : 'none';

  if (tab === 'projects') {
    const allProjects = [...CHEMCORE_DATA.projects, ...userProjects];
    el.innerHTML = allProjects.map((p, i) => `
      <div class="project-card animate-fadeInUp" style="animation-delay: ${i * 50}ms">
        <div class="project-image">${p.icon}</div>
        <div class="project-info" style="display:flex;flex-direction:column;gap:var(--space-xs);flex:1">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <h3 style="margin-bottom:0">${p.title}</h3>
            ${i >= CHEMCORE_DATA.projects.length ? `<button class="btn btn-ghost btn-sm" onclick="deleteProject(${i - CHEMCORE_DATA.projects.length})" title="Delete project">🗑️</button>` : ''}
          </div>
          <p style="margin-bottom:var(--space-sm)">${p.desc}</p>
          <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-sm)">
            <span class="badge badge-success">${p.impact}</span>
          </div>
          <div class="project-tags" style="margin-bottom:var(--space-md)">${p.tags.map(t => `<span class="badge badge-primary">${t}</span>`).join('')}</div>
          <button class="btn-ai" onclick="openChatWith('Explain the engineering principles behind the project: ${p.title}. Its description is: ${p.desc}')">
            <span class="btn-ai-icon">🧪</span> AI Breakdown
          </button>
        </div>
      </div>`).join('');
  } else if (tab === 'case-studies') {
    el.innerHTML = CHEMCORE_DATA.caseStudies.map(cs => `
      <div class="case-study-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-lg)">
          <h3 style="margin-bottom:0">${cs.title}</h3>
          <button class="btn-ai" style="margin-top:0" onclick="openChatWith('Deep dive into the case study: ${cs.title}. Action taken: ${cs.action}. Result achieved: ${cs.result}.')">
            <span class="btn-ai-icon">🔍</span> AI Case Review
          </button>
        </div>
        ${['Situation','Task','Action','Result'].map((label, i) => `
          <div class="case-study-step">
            <div class="case-study-step-marker">${label[0]}</div>
            <div>
              <strong style="color:var(--text-primary)">${label}</strong>
              <p style="margin-top:var(--space-xs)">${cs[label.toLowerCase()]}</p>
            </div>
          </div>`).join('')}
        <div class="project-tags" style="margin-top:var(--space-md)">${cs.tags.map(t => `<span class="badge badge-accent">${t}</span>`).join('')}</div>
      </div>`).join('');
  } else if (tab === 'certifications') {
    el.innerHTML = `
      <div class="grid-3">
        <div class="card card-interactive" style="text-align:center;padding:var(--space-2xl)">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">🏗️</div>
          <h3>PE License</h3>
          <p style="margin-top:var(--space-sm)">Professional Engineer — State of Texas, License #142857</p>
          <span class="badge badge-success" style="margin-top:var(--space-md)">Active</span>
        </div>
        <div class="card card-interactive" style="text-align:center;padding:var(--space-2xl)">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">📊</div>
          <h3>Six Sigma Black Belt</h3>
          <p style="margin-top:var(--space-sm)">ASQ Certified — Process improvement methodology</p>
          <span class="badge badge-success" style="margin-top:var(--space-md)">Active</span>
        </div>
        <div class="card card-interactive" style="text-align:center;padding:var(--space-2xl)">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">📋</div>
          <h3>PMP Certified</h3>
          <p style="margin-top:var(--space-sm)">Project Management Professional — PMI</p>
          <span class="badge badge-success" style="margin-top:var(--space-md)">Active</span>
        </div>
      </div>
      <div class="card" style="margin-top:var(--space-xl);text-align:center;padding:var(--space-xl)">
        <h3 style="margin-bottom:var(--space-md)">Download Resume</h3>
        <p style="margin-bottom:var(--space-lg)">Get a clean PDF version of my complete resume and project portfolio.</p>
        <button class="btn btn-primary btn-lg" onclick="showToast('Resume download would start here','info')">📄 Download CV (PDF)</button>
      </div>`;
  }
}

// ── Professional Development ─────────────────────────────────────
let currentDevTab = 'books';

function loadDevPage() {
  showDevTab(currentDevTab);
}

function showDevTab(tab) {
  currentDevTab = tab;
  document.querySelectorAll('[data-dtab]').forEach(t => {
    t.classList.toggle('active', t.dataset.dtab === tab);
  });

  const el = document.getElementById('dev-tab-content');
  if (tab === 'books') {
    const colors = ['var(--primary-subtle)', 'hsla(280,100%,65%,0.1)', 'var(--success-subtle)', 'var(--warning-subtle)', 'var(--danger-subtle)', 'var(--primary-subtle)'];
    el.innerHTML = `<div class="book-grid">${CHEMCORE_DATA.books.map((b,i) => `
      <div class="book-card" style="display:flex;flex-direction:column">
        <div class="book-cover" style="background:${colors[i%colors.length]}">${b.icon}</div>
        <div class="book-title">${b.title}</div>
        <div class="book-author">${b.author}</div>
        <p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-sm);flex:1">${b.desc}</p>
        <button class="btn-ai" style="margin-top:var(--space-md)" onclick="openChatWith('Summarize the key chemical engineering concepts covered in the book: ${b.title} by ${b.author}.')">
          <span class="btn-ai-icon">📖</span> Book Insights
        </button>
      </div>`).join('')}</div>`;
  } else if (tab === 'interview') {
    el.innerHTML = `<div class="interview-list">${CHEMCORE_DATA.interviewQuestions.map(q => `
      <div class="accordion-item">
        <button class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
          <span>${q.q}</span>
          <span class="accordion-arrow">▼</span>
        </button>
        <div class="accordion-body">
          <span class="badge badge-primary" style="margin-bottom:var(--space-md)">${q.cat}</span>
          <p>${q.a}</p>
        </div>
      </div>`).join('')}</div>`;
  } else if (tab === 'conferences') {
    el.innerHTML = `<div class="conference-list">${CHEMCORE_DATA.conferences.map(c => `
      <div class="conference-item">
        <div class="conference-date">
          <span class="conference-date-month">${c.month}</span>
          <span class="conference-date-day">${c.day}</span>
        </div>
        <div style="flex:1">
          <h4 style="font-size:var(--text-base)">${c.name}</h4>
          <p style="font-size:var(--text-sm);margin-top:2px">${c.desc}</p>
          <div style="margin-top:var(--space-sm);display:flex;gap:var(--space-md)">
            <span class="badge badge-primary">${c.org}</span>
            <span style="font-size:var(--text-xs);color:var(--text-muted)">📍 ${c.location}</span>
          </div>
        </div>
      </div>`).join('')}</div>`;
  } else if (tab === 'salary') {
    el.innerHTML = `
      <div class="card" style="margin-bottom:var(--space-lg)">
        <h3 style="margin-bottom:var(--space-md)">Chemical Engineer Salary Ranges (US, 2026)</h3>
        <p style="margin-bottom:var(--space-lg)">Based on aggregated, anonymized data from industry surveys and public sources.</p>
        <table class="data-table"><thead><tr><th>Experience Level</th><th>Range</th><th>Median</th></tr></thead><tbody>
          ${CHEMCORE_DATA.salaryData.map(s => `<tr><td>${s.level}</td><td class="formula-cell">${s.range}</td><td style="color:var(--success);font-weight:700">${s.median}</td></tr>`).join('')}
        </tbody></table>
      </div>
      <div class="card">
        <h4 style="margin-bottom:var(--space-md)">Salary by Industry Sector</h4>
        ${[{name:'Oil & Gas',range:'$75,000 - $180,000',pct:90},{name:'Pharmaceuticals',range:'$70,000 - $165,000',pct:82},{name:'Semiconductors',range:'$80,000 - $170,000',pct:85},{name:'Water/Environmental',range:'$60,000 - $130,000',pct:65},{name:'Food & Beverage',range:'$58,000 - $125,000',pct:62}].map(s => `
          <div style="margin-bottom:var(--space-md)">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:var(--text-sm);font-weight:500">${s.name}</span>
              <span style="font-size:var(--text-xs);color:var(--text-muted)">${s.range}</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${s.pct}%"></div></div>
          </div>`).join('')}
      </div>`;
  }
}

// ── Blog Page ────────────────────────────────────────────────────
let currentBlogFilter = 'all';

function loadBlogPage() {
  filterBlog(currentBlogFilter);
}

function filterBlog(filter) {
  currentBlogFilter = filter;
  document.querySelectorAll('.chip-group .chip').forEach(c => {
    c.classList.toggle('active', c.textContent.toLowerCase().includes(filter === 'all' ? 'all' : filter));
  });

  const posts = filter === 'all' ? CHEMCORE_DATA.blogPosts : CHEMCORE_DATA.blogPosts.filter(p => p.category === filter);
  const colors = ['var(--primary-subtle)', 'hsla(130,100%,60%,0.1)', 'var(--success-subtle)', 'var(--warning-subtle)'];

  document.getElementById('blog-grid').innerHTML = posts.map((p,i) => `
    <div class="blog-card" style="display:flex;flex-direction:column">
      <div class="blog-card-image" style="background:${colors[i%colors.length]}">${p.icon}</div>
      <div class="blog-card-body" style="flex:1;display:flex;flex-direction:column">
        <div class="blog-card-category">${p.category}</div>
        <h3 class="blog-card-title">${p.title}</h3>
        <p class="blog-card-excerpt" style="flex:1">${p.excerpt}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--space-md)">
          <div class="blog-card-meta">
            <span>${p.date}</span>
          </div>
          <button class="btn-ai" style="margin-top:0" onclick="event.stopPropagation();openChatWith('Provide a summarized perspective and key takeaways from the topic: ${p.title}. Context: ${p.excerpt}')">
            <span class="btn-ai-icon">✨</span> AI Insight
          </button>
        </div>
      </div>
    </div>`).join('');
}

// ── Community Page ───────────────────────────────────────────────
function loadCommunityPage() {
  const grid = document.getElementById('society-grid');
  if (grid.children.length === 0) {
    grid.innerHTML = CHEMCORE_DATA.societies.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener" class="society-card" style="text-decoration:none;color:inherit">
        <div class="society-logo">${s.icon}</div>
        <div>
          <h4 style="font-size:var(--text-base)">${s.name}</h4>
          <p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">${s.fullName}</p>
          <p style="font-size:var(--text-xs);color:var(--text-secondary);margin-top:4px">${s.desc}</p>
        </div>
      </a>`).join('');
  }

  const defaultTopics = [
    { id:1, title:'How to calculate two-phase pressure drop in a pipeline?', author:'ProcessEng_Mike', replies:12, views:340, badge:'Fluid Mechanics', date: '2 days ago' },
    { id:2, title:'Best software for batch reactor simulation?', author:'ReactionQueen', replies:8, views:210, badge:'Reaction Eng.', date: '3 days ago' },
    { id:3, title:'Corrosion issues with 316L SS in hot phosphoric acid', author:'MaterialsGuru', replies:15, views:520, badge:'Materials', date: '5 days ago' },
    { id:4, title:'Career transition from O&G to renewables — tips?', author:'GreenChemE', replies:23, views:890, badge:'Career', date: '1 week ago' },
  ];

  const allTopics = [...userThreads, ...defaultTopics];

  document.getElementById('forum-content').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:var(--space-md)">
      ${allTopics.map((t, i) => `
        <div class="card card-interactive forum-thread-card animate-fadeInUp" style="cursor:pointer; animation-delay: ${i * 40}ms" onclick="openThread(${t.id})">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-md)">
            <div style="flex:1">
              <h4 style="font-size:var(--text-base); color:var(--text-primary)">${t.title}</h4>
              <div style="display:flex; gap:var(--space-md); margin-top:var(--space-sm); align-items:center">
                <span style="font-size:var(--text-xs); color:var(--text-muted)">by ${t.author} • ${t.date || 'Just now'}</span>
                <span class="badge badge-accent">${t.badge}</span>
              </div>
            </div>
            <div style="display:flex; gap:var(--space-xl); text-align:center">
              <div>
                <div style="font-size:var(--text-sm); font-weight:700; color:var(--primary)">${t.replies}</div>
                <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase">replies</div>
              </div>
              <div>
                <div style="font-size:var(--text-sm); font-weight:700; color:var(--text-primary)">${t.views}</div>
                <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase">views</div>
              </div>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

function showNewDiscussion() {
  openModal(`
    <div class="modal-header">
      <h2 class="modal-title">New Discussion</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Topic Title</label>
        <input type="text" id="forum-topic-title" class="form-input" placeholder="e.g. Guidance on P&ID revision standards">
      </div>
      <div class="form-group" style="margin-top:var(--space-lg)">
        <label>Initial Question / Content</label>
        <textarea id="forum-topic-content" class="form-input" rows="5" placeholder="Describe your question in detail..."></textarea>
      </div>
      <div class="form-group" style="margin-top:var(--space-lg)">
        <label>Category Tag</label>
        <div class="forum-tag-select">
          ${['Fluid Mechanics', 'Heat Transfer', 'Mass Transfer', 'Thermodynamics', 'Reaction Eng.', 'Safety', 'Materials', 'Career'].map(tag => `
            <div class="forum-tag-chip" onclick="this.parentElement.querySelectorAll('.forum-tag-chip').forEach(c=>c.classList.remove('active'));this.classList.add('active')">${tag}</div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveThread()">Post Topic</button>
    </div>
  `);
}

function saveThread() {
  const title = document.getElementById('forum-topic-title').value;
  const content = document.getElementById('forum-topic-content').value;
  const tag = document.querySelector('.forum-tag-chip.active')?.textContent || 'General';

  if (!title || !content) { showToast('Please fill title and content', 'error'); return; }

  const newThread = {
    id: Date.now(),
    title,
    content,
    author: userProfile.name,
    replies: 0,
    views: 1,
    badge: tag,
    date: 'Just now'
  };

  userThreads.unshift(newThread);
  saveUserState();
  closeModal();
  loadCommunityPage();
  showToast('Thread posted successfully!', 'success');
}

function openThread(id) {
  const t = [...userThreads, { id:1, title:'How to calculate two-phase pressure drop', content:'I am seeing high pressure drop in my vertical pipeline...', author:'ProcessEng_Mike', replies:12, views:340, badge:'Fluid Mechanics' }, { id:2, title:'Best software for batch reactor simulation', content:'Which software would you recommend for complex batch kinetics?', author:'ReactionQueen', replies:8, views:210, badge:'Reaction Eng.' }, { id:3, title:'Corrosion issues with 316L SS', content:'Looking for advice on materials for hot H3PO4...', author:'MaterialsGuru', replies:15, views:520, badge:'Materials' }, { id:4, title:'Career transition from O&G', content:'How hard is the transition to modern renewables sector?', author:'GreenChemE', replies:23, views:890, badge:'Career' }].find(x => x.id == id);
  if (!t) return;

  openModal(`
    <div class="modal-header">
      <h2 class="modal-title">Discussion View</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <span class="badge badge-accent">${t.badge}</span>
      <h1 style="margin-top:var(--space-md)">${t.title}</h1>
      <p style="font-size:var(--text-sm); color:var(--text-muted)">by ${t.author}</p>
      <div class="card" style="margin-top:var(--space-lg); background:var(--bg-card)">
        <p style="line-height:1.6">${t.content || 'No content description available.'}</p>
      </div>
      
      <div style="margin-top:var(--space-xl); border-top:1px solid var(--border-subtle); padding-top:var(--space-xl)">
        <h3 style="margin-bottom:var(--space-md)">Replies</h3>
        <div style="background:var(--bg-elevated); padding:var(--space-md); border-radius:var(--radius-md); border-left:4px solid var(--warning)">
          <p style="font-size:var(--text-sm); font-style:italic">Replies are simulated for demonstration. In a real system, these would be live user comments.</p>
        </div>
        <div class="card" style="margin-top:var(--space-md); background:rgba(180, 255, 180, 0.05)">
          <strong>🤖 AI Engineering Response:</strong>
          <p style="font-size:var(--text-sm); margin-top:var(--space-xs); line-height:1.5">For this specific problem, I recommend checking the <strong>Lockhart-Martinelli correlation</strong> if it's two-phase flow, or the <strong>Kirkbride equation</strong> for distillation related issues. Would you like me to perform a detailed calculation?</p>
          <button class="btn-ai" style="margin-top:var(--space-md); width:auto" onclick="openChatWith('Following up on the forum topic: ${t.title}. The question was: ${t.content || t.title}. Please provide a detailed engineering response.')">Ask AI for more details</button>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    </div>
  `);
}

// ── Quick Property Lookup ────────────────────────────────────────
function handleQuickPropSearch(query) {
  const resultEl = document.getElementById('quick-prop-result');
  if (!query || query.length < 2) {
    resultEl.classList.add('hidden');
    return;
  }

  // Search in antoine, constants, and heat capacities
  const q = query.toLowerCase();
  const allData = [
    ...CHEMCORE_DATA.antoineConstants.map(i => ({ ...i, cat: 'Antoine' })),
    ...CHEMCORE_DATA.constants.map(i => ({ ...i, cat: 'Constant' })),
    ...CHEMCORE_DATA.heatCapacities.map(i => ({ ...i, cat: 'Heat Capacity' }))
  ];

  const results = allData.filter(i => 
    (i.name || '').toLowerCase().includes(q) || 
    (i.sym || '').toLowerCase() === q ||
    (i.chem || '').toLowerCase().includes(q)
  ).slice(0, 1);

  if (results.length > 0) {
    const item = results[0];
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `
      <div class="result-box animate-fadeIn" style="margin-top:var(--space-md);padding:var(--space-md);background:var(--bg-hover);border-radius:var(--radius-md);border:1px solid var(--primary-glow)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
          <h4 style="margin:0;color:var(--primary)">${item.name || item.sym}</h4>
          <span class="badge badge-primary">${item.cat || item.state || 'Property'}</span>
        </div>
        <div class="grid-2">
          ${item.val ? `<div><span style="font-size:10px;color:var(--text-muted)">Value</span><div style="font-size:var(--text-lg);font-weight:700">${item.val} ${item.unit}</div></div>` : ''}
          ${item.Cp ? `<div><span style="font-size:10px;color:var(--text-muted)">Heat Capacity (Cp)</span><div style="font-size:var(--text-lg);font-weight:700">${item.Cp} ${item.unit}</div></div>` : ''}
          ${item.A ? `<div><span style="font-size:10px;color:var(--text-muted)">Antoine A</span><div style="font-size:var(--text-base);font-weight:700">${item.A}</div></div>` : ''}
          ${item.B ? `<div><span style="font-size:10px;color:var(--text-muted)">Antoine B</span><div style="font-size:var(--text-base);font-weight:700">${item.B}</div></div>` : ''}
        </div>
        <button class="btn btn-ghost btn-xs" style="margin-top:var(--space-md);width:100%" onclick="navigate('properties')">View Full Database →</button>
      </div>`;
  } else {
    resultEl.classList.add('hidden');
  }
}

// ── Dashboard Dynamic Content ────────────────────────────────────
function loadDashboard() {
  console.log('--- Initializing Dashboard ---');
  try {
    // Featured formulas
    const featuredFormulasEl = document.getElementById('featured-formulas');
    if (!featuredFormulasEl) {
      console.warn('featured-formulas container not found');
    } else {
      const featured = CHEMCORE_DATA.formulas.slice(0, 6);
      console.log('Loading %d featured formulas', featured.length);
      featuredFormulasEl.innerHTML = featured.map(f => `
        <div class="equation-card card-interactive" style="display:flex;flex-direction:column;gap:12px;height:100%">
          <div class="equation-name" style="color:var(--primary)">${f.name}</div>
          <div class="equation-formula" style="background:var(--bg-surface);padding:var(--space-md);border-radius:var(--radius-md);border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:var(--text-xs)">${f.eq}</div>
          <div class="equation-desc" style="flex:1;font-size:var(--text-xs);color:var(--text-secondary)">${f.desc}</div>
          <button class="btn-ai" onclick="openChatWith('Explain the engineering principles of ${f.name} (${f.eq}) and its industrial applications.')">
            <span class="btn-ai-icon">🧪</span> AI Insights
          </button>
        </div>`).join('');
    }

    // Latest blog posts
    const blogEl = document.getElementById('latest-blog-posts');
    if (blogEl) {
      const latest = CHEMCORE_DATA.blogPosts.slice(0, 3);
      console.log('Loading %d blog posts', latest.length);
      blogEl.innerHTML = latest.map((p, i) => `
        <div class="blog-card card-interactive" onclick="navigate('blog')" style="display:flex;flex-direction:column;height:100%">
          <div class="blog-card-image" style="background:rgba(180, 255, 180, 0.05);height:140px;display:flex;align-items:center;justify-content:center;font-size:3rem">${p.icon}</div>
          <div class="blog-card-body" style="padding:var(--space-md);flex:1">
            <div class="blog-card-category" style="color:var(--primary)">${p.category}</div>
            <h3 class="blog-card-title" style="font-size:var(--text-sm)">${p.title}</h3>
          </div>
        </div>`).join('');
    }

    // Trending Sidebar 
    const trendingEl = document.getElementById('trending-ranking');
    if (trendingEl) {
      const trending = [
        { name: 'Bernoulli Equation', cat: 'Fluid Dynamics', views: '4.2k' },
        { name: 'Nusselt Number', cat: 'Heat Transfer', views: '3.8k' },
        { name: 'Raoult\'s Law', cat: 'Mass Transfer', views: '2.9k' },
        { name: 'Hazen-Williams', cat: 'Hydraulics', views: '2.5k' },
        { name: 'Gibbs\' Free Energy', cat: 'Thermodynamics', views: '1.8k' }
      ];
      trendingEl.innerHTML = trending.map((t, i) => `
        <div class="ranking-item" onclick="navigate('knowledge')">
          <div class="ranking-number">${i + 1}</div>
          <div class="ranking-info">
            <div class="ranking-title">${t.name}</div>
            <div class="ranking-meta">${t.cat} • ${t.views} views</div>
          </div>
        </div>`).join('');
    }

    // Upcoming Events Mini
    const eventsEl = document.getElementById('upcoming-events-mini');
    if (eventsEl) {
      const events = [
        { title: 'AIChE Annual Meeting', date: 'Oct 24', loc: 'Houston, TX' },
        { title: 'ChemEng Expo 2026', date: 'Nov 12', loc: 'Virtual' }
      ];
      eventsEl.innerHTML = events.map(e => `
        <div class="event-row" onclick="navigate('community')">
          <div style="font-size:var(--text-xs);font-weight:700;color:var(--primary)">${e.date}</div>
          <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${e.title}</div>
          <div style="font-size:10px;color:var(--text-muted)">📍 ${e.loc}</div>
        </div>`).join('');
    }
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

// ── Hero Slider ──────────────────────────────────────────────────
let heroSlideIndex = 0;
let heroSliderInterval;

function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.hero-dot');
  
  if (slides.length === 0) return;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    heroSlideIndex = index;
  }

  function nextSlide() {
    let next = (heroSlideIndex + 1) % slides.length;
    showSlide(next);
  }

  // Auto-slide every 5 seconds
  clearInterval(heroSliderInterval);
  heroSliderInterval = setInterval(nextSlide, 5000);

  // Manual dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      showSlide(idx);
      clearInterval(heroSliderInterval);
      heroSliderInterval = setInterval(nextSlide, 5000);
    });
  });

  // Initial show
  showSlide(0);
}

// ── Simulated Sensor Data ───────────────────────────────────────
function updateSimulatedMetrics() {
  const yieldEl = document.getElementById('metric-yield');
  if (!yieldEl) return;

  const y = parseFloat(yieldEl.textContent);
  const powerEl = document.getElementById('metric-power');
  const p = powerEl ? parseFloat(powerEl.textContent) : 0;
  
  if (yieldEl) yieldEl.textContent = (y + (Math.random() * 0.2 - 0.1)).toFixed(1) + '%';
  if (powerEl) powerEl.textContent = (p + (Math.random() * 2 - 1)).toFixed(0) + ' kW';
  
  setTimeout(updateSimulatedMetrics, 3000);
}

// ── Modal System ────────────────────────────────────────────────
function openModal(content) {
  const overlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = content;
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
  document.body.style.overflow = '';
}

// ── Portfolio Customization ──────────────────────────────────────
function showEditProfileModal() {
  openModal(`
    <div class="modal-header">
      <h2 class="modal-title">Edit Engineer Profile</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Display Name</label>
        <input type="text" id="edit-profile-name" class="form-input" value="${userProfile.name}">
      </div>
      <div class="form-group" style="margin-top:var(--space-md)">
        <label>Professional Title</label>
        <input type="text" id="edit-profile-title" class="form-input" value="${userProfile.title}">
      </div>
      <div class="form-group" style="margin-top:var(--space-md)">
        <label>Avatar Emoji</label>
        <input type="text" id="edit-profile-avatar" class="form-input" value="${userProfile.avatar}">
      </div>
      <div class="form-group" style="margin-top:var(--space-md)">
        <label>Badges (comma separated)</label>
        <input type="text" id="edit-profile-badges" class="form-input" value="${userProfile.badges.join(', ')}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveProfile()">Save Profile</button>
    </div>
  `);
}

function saveProfile() {
  userProfile.name = document.getElementById('edit-profile-name').value;
  userProfile.title = document.getElementById('edit-profile-title').value;
  userProfile.avatar = document.getElementById('edit-profile-avatar').value;
  userProfile.badges = document.getElementById('edit-profile-badges').value.split(',').map(b => b.trim()).filter(b => b);
  
  saveUserState();
  closeModal();
  loadPortfolioPage();
  showToast('Profile updated successfully!', 'success');
}

function showAddProjectModal() {
  openModal(`
    <div class="modal-header">
      <h2 class="modal-title">Add New Project</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" id="new-project-title" class="form-input" placeholder="e.g. Distillation Column Revamp">
      </div>
      <div class="form-group" style="margin-top:var(--space-md)">
        <label>Emoji Icon</label>
        <input type="text" id="new-project-icon" class="form-input" placeholder="🏗️">
      </div>
      <div class="form-group" style="margin-top:var(--space-md)">
        <label>Description</label>
        <textarea id="new-project-desc" class="form-input" rows="3" placeholder="Briefly describe the project..."></textarea>
      </div>
      <div class="form-group" style="margin-top:var(--space-md)">
        <label>Quantifiable Impact</label>
        <input type="text" id="new-project-impact" class="form-input" placeholder="e.g. 15% reduction in steam usage">
      </div>
      <div class="form-group" style="margin-top:var(--space-md)">
        <label>Tags (comma separated)</label>
        <input type="text" id="new-project-tags" class="form-input" placeholder="Thermodynamics, Optimization">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveProject()">Add Project</button>
    </div>
  `);
}

function saveProject() {
  const title = document.getElementById('new-project-title').value;
  const icon = document.getElementById('new-project-icon').value || '📁';
  const desc = document.getElementById('new-project-desc').value;
  const impact = document.getElementById('new-project-impact').value;
  const tags = document.getElementById('new-project-tags').value.split(',').map(t => t.trim()).filter(t => t);

  if (!title || !desc) { showToast('Title and Description are required', 'error'); return; }

  userProjects.push({ title, icon, desc, impact, tags });
  saveUserState();
  closeModal();
  showPortfolioTab('projects');
  showToast('Project added to portfolio!', 'success');
}

function deleteProject(index) {
  if (confirm('Are you sure you want to delete this project?')) {
    userProjects.splice(index, 1);
    saveUserState();
    showPortfolioTab('projects');
    showToast('Project deleted', 'info');
  }
}

// ── Problem Solver Engine ────────────────────────────────────────
const SOLVER_EXAMPLES = {
  bypass: `Wastewater contains 5.15 wt% chromium. A treatment unit removes 95% of the chromium with a maximum capacity of 4500 kg/h. If a plant produces 6000 kg/h of wastewater, the excess bypasses the treatment unit and mixes with the treated effluent before going to a storage lagoon. Find the flow rate to the lagoon and the chromium mass fraction in the lagoon feed.`,
  recycle: `A reactor converts 40% of a pure A feed to product B per pass. Unreacted A is separated from B in a separator and recycled back to the reactor. The fresh feed to the process is 100 mol/h of pure A. Find the recycle ratio and flow rates of all streams assuming steady state.`,
  flash: `A liquid stream at 80°C and 200 kPa contains 60 mol% benzene and 40 mol% toluene. It is flashed into a drum at 100 kPa. Using Raoult's law, find the fraction of the feed that vaporizes (V/F) and the compositions of the liquid and vapor phases. Vapor pressures: benzene P*=180 kPa, toluene P*=74 kPa at equilibrium temperature.`,
  combustion: `Methane (CH₄) is burned with 25% excess air. Assume complete combustion. The fuel feed rate is 100 mol/h. Find: (a) the molar flow rates of all product gases, (b) the dew point of the flue gas at 1 atm, and (c) the flue gas composition on a dry basis.`,
  hx: `A shell-and-tube heat exchanger heats 2000 kg/h of water from 20°C to 80°C using condensing steam at 120°C (hfg = 2203 kJ/kg). Find: (a) the required heat duty in kW, (b) the steam condensation rate in kg/h, and (c) the LMTD assuming counter-current flow.`
};

function initSolverPage() {
  // Page is already rendered via HTML; nothing to preload
}

function loadExample(key) {
  const input = document.getElementById('solver-problem-input');
  if (input && SOLVER_EXAMPLES[key]) {
    input.value = SOLVER_EXAMPLES[key];
    input.focus();
    showToast('Example loaded — click "Solve Problem" to run it!', 'info');
  }
}

async function solveProblem() {
  const problem = document.getElementById('solver-problem-input').value.trim();
  const fileInput = document.getElementById('solver-file-input');
  const file = fileInput.files[0];

  if (!problem && !file) {
    showToast('Please enter a problem statement or upload a file.', 'error');
    return;
  }

  const textbook = document.getElementById('solver-textbook').value;
  const chapter = document.getElementById('solver-chapter').value;
  const btn = document.getElementById('solver-btn');

  // Update button state
  btn.disabled = true;
  btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite">⚙️</span> Solving...';

  // Hide placeholder, show skeleton
  document.getElementById('solver-placeholder').style.display = 'none';
  const solutionEl = document.getElementById('solver-solution');
  solutionEl.style.display = 'flex';
  solutionEl.innerHTML = renderSolverSkeleton();

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('problem', problem);
  formData.append('textbook', textbook);
  formData.append('chapter', chapter);
  if (file) formData.append('file', file);

  try {
    const response = await fetch('/api/solve', {
      method: 'POST',
      body: formData // Note: no headers needed for FormData, browser sets them
    });

    const data = await response.json();
    
    if (data.solution) {
      renderSolverOutput(data.solution, problem || (file ? '[Uploaded File]' : ''));
    } else if (data.rawReply) {
      solutionEl.innerHTML = `
        <div class="card animate-fadeInUp" style="border-left:4px solid var(--primary)">
          <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-md)">
            <span style="font-size:1.2rem">📊</span>
            <h4 style="margin:0;color:var(--primary)">FULL SOLUTION</h4>
          </div>
          <div style="font-size:var(--text-sm);line-height:1.7;white-space:pre-wrap;color:var(--text-secondary)">${data.rawReply}</div>
          <div style="margin-top:var(--space-lg);display:flex;gap:var(--space-md)">
            <button class="btn-ai" style="flex:1" onclick="openChatWith('Following up on this solution. Can you explain the results in more detail?')">
              <span class="btn-ai-icon">🤖</span> Ask AI for Detail
            </button>
          </div>
        </div>`;
    } else {
      throw new Error(data.error || 'Failed to generate solution');
    }
  } catch (err) {
    solutionEl.innerHTML = `<div class="card" style="border-left:4px solid var(--danger)">
      <p style="color:var(--danger)">❌ Error: ${err.message}</p>
      <p style="font-size:var(--text-xs);margin-top:var(--space-sm)">If this is an API key issue, please check your .env file.</p>
    </div>`;
  }

  btn.disabled = false;
  btn.innerHTML = '🚀 Solve Problem';
}

// ── File Upload Helpers ─────────────────────────────────────────
function handleFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('File too large (Max 5MB)', 'error');
    event.target.value = '';
    return;
  }

  const statusEl = document.getElementById('file-upload-status');
  const nameDisplay = document.getElementById('file-name-display');
  
  statusEl.style.display = 'flex';
  nameDisplay.textContent = `📄 ${file.name}`;
  showToast('File attached! Click Solve to process.', 'success');
}

function clearUploadedFile() {
  const fileInput = document.getElementById('solver-file-input');
  const statusEl = document.getElementById('file-upload-status');
  
  fileInput.value = '';
  statusEl.style.display = 'none';
  showToast('File removed', 'info');
}


function renderSolverSkeleton() {
  return `
    <div class="card animate-fadeInUp" style="border-left:3px solid var(--primary)">
      <div style="display:flex;align-items:center;gap:var(--space-md)">
        <div style="width:24px;height:24px;border:3px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite"></div>
        <span style="color:var(--primary);font-weight:700">Analyzing problem & generating solution...</span>
      </div>
      <div style="margin-top:var(--space-md);display:flex;flex-direction:column;gap:8px">
        ${[90,70,80,60,75,55].map(w => `<div style="height:10px;background:var(--bg-elevated);border-radius:4px;width:${w}%;animation:pulse 1.4s ease-in-out infinite"></div>`).join('')}
      </div>
    </div>`;
}

function renderSolverOutput(sol, problem) {
  const solutionEl = document.getElementById('solver-solution');
  if (!sol) {
    solutionEl.innerHTML = `<div class="card" style="border-left:4px solid var(--danger)"><h4>Parsing Error</h4><p>The AI returned a response that couldn't be parsed into the specific engineering format. Refresh and try again, or check the raw reply below.</p></div>`;
    return;
  }

  // Defensive defaults
  const d = sol.dof || { unknowns: '?', equations: '?', dof: 0, status: 'Unknown' };
  const dofColor = d.dof === 0 ? 'var(--success)' : d.dof < 0 ? 'var(--danger)' : 'var(--warning)';
  const dofLabel = d.dof === 0 ? 'Exactly Specified ✅' : d.dof < 0 ? 'Overspecified ⚠️' : 'Underspecified ❌';

  const sections = [
    { icon:'🏷️', title:'Problem Classification', color:'var(--primary)', content: `<p style="font-size:var(--text-base);font-weight:600;color:var(--text-primary)">${sol.classification || 'Unclassified'}</p>` },
    { icon:'📋', title:'Given Data', color:'hsla(130,100%,60%,0.8)', content: `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px">${(sol.given||[]).map(g=>`<li style="font-size:var(--text-sm);font-family:var(--font-mono)">${g}</li>`).join('') || '<li>No explicit data extracted</li>'}</ul>` },
    { icon:'💡', title:'Assumptions', color:'var(--warning)', content: `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:4px">${(sol.assumptions||[]).map(a=>`<li style="font-size:var(--text-sm)">${a}</li>`).join('') || '<li>No assumptions listed</li>'}</ul>` },
    { icon:'📐', title:'System Sketch', color:'var(--accent)', content: `<pre style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);white-space:pre-wrap;background:var(--bg-elevated);padding:var(--space-md);border-radius:var(--radius-md)">${sol.sketch || 'No schematic provided'}</pre>` },
    {
      icon:'⚖️', title:'Degrees of Freedom', color: dofColor,
      content: `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-md);text-align:center;margin-bottom:var(--space-md)">
        <div><div style="font-size:1.5rem;font-weight:800;color:var(--text-primary)">${d.unknowns}</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Unknowns</div></div>
        <div><div style="font-size:1.5rem;font-weight:800;color:var(--text-primary)">${d.equations}</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Equations</div></div>
        <div><div style="font-size:1.5rem;font-weight:800;color:${dofColor}">${d.dof}</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">DOF</div></div>
      </div>
      <div style="background:var(--bg-elevated);padding:var(--space-sm) var(--space-md);border-radius:var(--radius-md);font-size:var(--text-sm);border-left:3px solid ${dofColor};font-weight:600;color:${dofColor}">${dofLabel}</div>`
    },
    {
      icon:'🔢', title:'Step-by-Step Solution', color:'var(--success)',
      content: `<div style="display:flex;flex-direction:column;gap:var(--space-md)">${(sol.steps||[]).map(s => `
        <div style="border-left:3px solid var(--border-strong);padding-left:var(--space-md)">
          <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:4px">
            <span style="min-width:24px;height:24px;background:var(--primary-subtle);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--primary)">${s.n}</span>
            <span style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${s.label}</span>
          </div>
          <code style="display:block;font-size:12px;color:var(--text-secondary);background:var(--bg-elevated);padding:8px 12px;border-radius:var(--radius-sm);margin:4px 0">${s.calc}</code>
          <div style="font-size:var(--text-sm);color:var(--success);font-weight:600;margin-top:4px">→ ${s.result}</div>
        </div>`).join('') || '<p>No steps generated</p>'}</div>`
    },
    {
      icon:'🏆', title:'Final Results', color:'var(--primary)',
      content: `<div style="background:linear-gradient(135deg,var(--primary-subtle),hsla(130,100%,60%,0.05));border-radius:var(--radius-md);padding:var(--space-lg);border:1px solid var(--primary-glow)">
        ${(sol.results||[]).map(r=>`<p style="font-family:var(--font-mono);font-size:var(--text-sm);margin-bottom:8px;color:var(--text-primary)">${r}</p>`).join('') || '<p>No final results listed</p>'}
      </div>`
    },
    { icon:'🔍', title:'Verification & Insights', color:'hsla(195,100%,50%,0.8)', content: `<p style="font-size:var(--text-sm);line-height:1.7;color:var(--text-secondary)">${sol.verification || 'No review available'}</p>` }
  ];

  solutionEl.innerHTML = sections.map((s, i) => `
    <div class="card animate-fadeInUp" style="border-left:4px solid ${s.color};animation-delay:${i * 80}ms">
      <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-md)">
        <span style="font-size:1.2rem">${s.icon}</span>
        <h4 style="margin:0;font-size:var(--text-base);color:${s.color};text-transform:uppercase;letter-spacing:0.05em">${s.title}</h4>
      </div>
      ${s.content}
    </div>`).join('') + `
    <div style="display:flex;gap:var(--space-md);flex-wrap:wrap">
      <button class="btn-ai" style="flex:1" onclick="openChatWith('I just solved this problem: ${problem.replace(/'/g, ' ').substring(0, 200)}. Can you explain the key engineering principles?')">
        <span class="btn-ai-icon">🤖</span> Explain with AI
      </button>
      <button class="btn btn-secondary btn-sm" onclick="document.getElementById('solver-problem-input').value='';document.getElementById('solver-placeholder').style.display='';document.getElementById('solver-solution').style.display='none'">
        🔄 New Problem
      </button>
    </div>`;
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  
  // Use a tiny delay to ensure all data and scripts are initialized
  setTimeout(() => {
    loadDashboard();
    initHeroSlider();
    updateSimulatedMetrics();
    // Pre-sync profile header
    if (document.getElementById('portfolio-name')) {
      document.getElementById('portfolio-name').textContent = userProfile.name;
    }
  }, 100);
});
