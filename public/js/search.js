/* ═══════════════════════════════════════════════════════════════════
   ChemCore — Search Engine
   Global search across equations, chemicals, articles, and tools
   ═══════════════════════════════════════════════════════════════════ */

function buildSearchIndex() {
  const index = [];

  // Index formulas
  CHEMCORE_DATA.formulas.forEach(f => {
    index.push({
      type: 'formula',
      icon: '📐',
      title: f.name,
      desc: f.eq + ' — ' + f.subject,
      keywords: [f.name, f.eq, f.subject, f.desc, ...f.tags].join(' ').toLowerCase(),
      action: () => { navigate('knowledge'); showKBTopic('formulas'); }
    });
  });

  // Index constants
  CHEMCORE_DATA.constants.forEach(c => {
    index.push({
      type: 'constant',
      icon: '🔬',
      title: c.name,
      desc: c.sym + ' = ' + c.val + ' ' + c.unit,
      keywords: [c.name, c.sym, c.val, c.unit, c.cat].join(' ').toLowerCase(),
      action: () => { navigate('properties'); showPropTab('constants'); }
    });
  });

  // Index steam table entries
  CHEMCORE_DATA.steamTable.forEach(s => {
    index.push({
      type: 'data',
      icon: '💨',
      title: `Steam at ${s.T}°C`,
      desc: `P=${s.P} kPa, hg=${s.hg} kJ/kg`,
      keywords: `steam ${s.T} celsius ${s.P} kpa saturated water vapor`,
      action: () => { navigate('properties'); showPropTab('steam'); }
    });
  });

  // Index Antoine constants
  CHEMCORE_DATA.antoineConstants.forEach(a => {
    index.push({
      type: 'data',
      icon: '🧪',
      title: `Antoine: ${a.name}`,
      desc: `A=${a.A}, B=${a.B}, C=${a.C} (${a.Tmin}-${a.Tmax}°C)`,
      keywords: `antoine ${a.name} vapor pressure ${a.Tmin} ${a.Tmax}`.toLowerCase(),
      action: () => { navigate('properties'); showPropTab('antoine'); }
    });
  });

  // Index heat capacities
  CHEMCORE_DATA.heatCapacities.forEach(h => {
    index.push({
      type: 'data',
      icon: '🌡️',
      title: `Cp: ${h.name}`,
      desc: `${h.Cp} ${h.unit} at ${h.Tref}`,
      keywords: `heat capacity cp ${h.name} ${h.state} specific heat`.toLowerCase(),
      action: () => { navigate('properties'); showPropTab('cp'); }
    });
  });

  // Index corrosion guide
  CHEMCORE_DATA.corrosionGuide.forEach(c => {
    index.push({
      type: 'data',
      icon: '🛡️',
      title: `Corrosion: ${c.chemical}`,
      desc: `SS316: ${c.ss316}, Hastelloy: ${c.hastelloy}`,
      keywords: `corrosion ${c.chemical} material compatibility resistance`.toLowerCase(),
      action: () => { navigate('properties'); showPropTab('corrosion'); }
    });
  });

  // Index blog posts
  CHEMCORE_DATA.blogPosts.forEach(b => {
    index.push({
      type: 'article',
      icon: '📝',
      title: b.title,
      desc: b.category + ' · ' + b.readTime + ' read',
      keywords: [b.title, b.category, b.excerpt].join(' ').toLowerCase(),
      action: () => { navigate('blog'); }
    });
  });

  // Index calculators
  Object.entries(CALCULATORS).forEach(([id, calc]) => {
    index.push({
      type: 'tool',
      icon: '🧮',
      title: calc.title,
      desc: calc.desc.substring(0, 80) + '...',
      keywords: [calc.title, calc.desc].join(' ').toLowerCase(),
      action: () => navigateCalc(id)
    });
  });

  // Index KB articles
  Object.entries(CHEMCORE_DATA.kbArticles).forEach(([id, article]) => {
    index.push({
      type: 'article',
      icon: '📚',
      title: article.title,
      desc: 'Knowledge Base',
      keywords: [article.title, id, article.content !== 'dynamic' ? article.content.replace(/<[^>]+>/g, '') : ''].join(' ').toLowerCase(),
      action: () => { navigate('knowledge'); showKBTopic(id); }
    });
  });

  // Index interview questions
  CHEMCORE_DATA.interviewQuestions.forEach(q => {
    index.push({
      type: 'article',
      icon: '💡',
      title: q.q,
      desc: q.cat + ' · Interview Prep',
      keywords: [q.q, q.a, q.cat, 'interview'].join(' ').toLowerCase(),
      action: () => { navigate('development'); showDevTab('interview'); }
    });
  });

  return index;
}

let searchIndex = null;
let searchTimeout = null;

function handleSearch(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => performSearch(query), 150);
}

function performSearch(query) {
  const resultsEl = document.getElementById('search-results');
  if (!query || query.length < 2) {
    resultsEl.classList.add('hidden');
    return;
  }

  if (!searchIndex) searchIndex = buildSearchIndex();

  const terms = query.toLowerCase().split(/\s+/);
  const matches = searchIndex.filter(item =>
    terms.every(term => item.keywords.includes(term))
  ).slice(0, 10);

  if (matches.length === 0) {
    resultsEl.innerHTML = `
      <div class="search-result-item">
        <div class="search-result-icon">🔍</div>
        <div class="search-result-text">
          <div class="search-result-title">No results found</div>
          <div class="search-result-desc">Try different keywords</div>
        </div>
      </div>`;
  } else {
    resultsEl.innerHTML = matches.map((m, i) => `
      <div class="search-result-item" onmousedown="searchResultClick(${i})">
        <div class="search-result-icon">${m.icon}</div>
        <div class="search-result-text">
          <div class="search-result-title">${highlightMatch(m.title, query)}</div>
          <div class="search-result-desc">${m.desc}</div>
        </div>
        <span class="search-result-badge">${m.type}</span>
      </div>`).join('');
  }

  resultsEl.classList.remove('hidden');
  window._lastSearchMatches = matches;
}

function searchResultClick(index) {
  const matches = window._lastSearchMatches;
  if (matches && matches[index]) {
    matches[index].action();
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').classList.add('hidden');
  }
}

function showSearchResults() {
  const val = document.getElementById('search-input').value;
  if (val.length >= 2) {
    performSearch(val);
  }
}

function hideSearchResults() {
  setTimeout(() => {
    document.getElementById('search-results').classList.add('hidden');
  }, 200);
}

function highlightMatch(text, query) {
  const terms = query.split(/\s+/).filter(t => t.length > 1);
  let result = text;
  terms.forEach(term => {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    result = result.replace(regex, '<strong style="color:var(--primary-light)">$1</strong>');
  });
  return result;
}

// Ctrl+K shortcut
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('search-input').focus();
  }
  if (e.key === 'Escape') {
    document.getElementById('search-input').blur();
    document.getElementById('search-results').classList.add('hidden');
  }
});
