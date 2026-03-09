/* ═══════════════════════════════════════════════════════════════════
   ChemCore — AI Chat Engine
   AI chatbot linked to the knowledge base, formulas, and properties
   ═══════════════════════════════════════════════════════════════════ */

// ── State ────────────────────────────────────────────────────────
let chatOpen = false;
let chatHistory = [];
let chatLoading = false;
let chatMode = 'general';

// ── Toggle Chat ──────────────────────────────────────────────────
function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chat-panel');
  const fab = document.getElementById('chat-fab');

  if (chatOpen) {
    panel.classList.add('open');
    fab.classList.add('active');
    fab.innerHTML = '✕';
    document.getElementById('chat-input').focus();
    // Show welcome if first open
    if (chatHistory.length === 0) showWelcomeMessage();
  } else {
    panel.classList.remove('open');
    fab.classList.remove('active');
    fab.innerHTML = '⚗️';
  }
}

function openChat() {
  if (!chatOpen) toggleChat();
}

function openChatWith(query) {
  if (!chatOpen) toggleChat();
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = query;
    // Small delay to ensure panel is open and input is ready
    setTimeout(() => {
      sendChatMessage();
    }, 100);
  }
}

function clearChat() {
  chatHistory = [];
  document.getElementById('chat-messages').innerHTML = '';
  showWelcomeMessage();
}

// ── Mode Toggle ──────────────────────────────────────────────
function toggleChatMode() {
  chatMode = chatMode === 'general' ? 'solver' : 'general';
  chatHistory = []; // Clear history on mode switch

  const isSolver = chatMode === 'solver';
  document.getElementById('chat-header-name').textContent = isSolver ? 'ChemE-Solver' : 'ChemCore AI';
  document.getElementById('chat-header-status').textContent = isSolver
    ? 'Felder & Rousseau · Numerical Solver Mode'
    : 'General Assistant · Knowledge Base Linked';
  document.getElementById('chat-avatar').textContent = isSolver ? '📚' : '\u2697\ufe0f';
  document.getElementById('chat-footer').innerHTML = isSolver
    ? 'Specialized in <a>Felder, Rousseau & Bullard</a> problems · Solver Mode'
    : 'Powered by <a>ChemCore Knowledge Base</a> · AI-enhanced answers';

  const toggleBtn = document.getElementById('mode-toggle-btn');
  if (isSolver) {
    toggleBtn.textContent = '⛏️ General Mode';
    toggleBtn.style.background = 'var(--primary-subtle)';
    toggleBtn.style.color = 'var(--primary)';
    toggleBtn.style.borderColor = 'var(--primary-glow)';
  } else {
    toggleBtn.textContent = '📚 Solver Mode';
    toggleBtn.style.background = 'var(--bg-elevated)';
    toggleBtn.style.color = 'var(--text-secondary)';
    toggleBtn.style.borderColor = 'var(--border-default)';
  }

  const panel = document.getElementById('chat-panel');
  panel.style.transition = 'border-color 0.3s';
  panel.style.borderColor = isSolver ? 'var(--primary)' : 'var(--border-default)';

  showWelcomeMessage();
}

// ── Welcome Message ──────────────────────────────────────────────
function showWelcomeMessage() {
  const messagesEl = document.getElementById('chat-messages');
  messagesEl.innerHTML = '';

  appendBotMessage(`<p><strong>Hi! I'm ChemCore AI</strong> 🧪</p>
<p>I'm your chemical engineering assistant. I have access to the entire knowledge base — formulas, properties, steam tables, corrosion data, and more.</p>
<p>Ask me anything about:</p>
<ul>
<li>Engineering equations & calculations</li>
<li>Chemical properties & material compatibility</li>
<li>Process design & safety standards</li>
<li>Career advice & interview prep</li>
</ul>`);

  appendSuggestions([
    'What is the Darcy-Weisbach equation?',
    'NaOH corrosion compatibility',
    'Explain HAZOP methodology',
    'Steam properties at 200°C',
    'CSTR vs PFR difference',
  ]);
}

// ── Send Message ─────────────────────────────────────────────────
function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || chatLoading) return;

  input.value = '';
  input.style.height = '40px';
  appendUserMessage(text);
  chatHistory.push({ role: 'user', content: text });

  // Remove suggestion chips
  const suggestions = document.querySelector('.chat-suggestions');
  if (suggestions) suggestions.remove();

  processQuery(text);
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

function autoResize(el) {
  el.style.height = '40px';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

function askSuggestion(text) {
  document.getElementById('chat-input').value = text;
  sendChatMessage();
}

// ── Process Query ────────────────────────────────────────────────
async function processQuery(query) {
  chatLoading = true;
  updateSendButton();
  showTypingIndicator();

  // Search the knowledge base for context
  const kbContext = searchKnowledgeBase(query);

  try {
    // Try the AI backend first
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        context: kbContext.contextText,
        history: chatHistory.slice(-10),
        mode: chatMode
      })
    });

    removeTypingIndicator();

    if (response.ok) {
      const data = await response.json();
      if (data.reply) {
        let reply = formatBotReply(data.reply);
        if (kbContext.links.length > 0) {
          reply += renderKBLinks(kbContext.links);
        }
        appendBotMessage(reply);
        chatHistory.push({ role: 'assistant', content: data.reply });
      } else {
        throw new Error('Empty reply');
      }
    } else {
      // Fallback to local knowledge base
      const localReply = generateLocalReply(query, kbContext);
      appendBotMessage(localReply);
      chatHistory.push({ role: 'assistant', content: localReply });
    }
  } catch (err) {
    removeTypingIndicator();
    // Fallback to local knowledge base
    const localReply = generateLocalReply(query, kbContext);
    appendBotMessage(localReply);
    chatHistory.push({ role: 'assistant', content: localReply });
  }

  chatLoading = false;
  updateSendButton();
  appendFollowUpSuggestions(query);
}

// ── Knowledge Base Search ────────────────────────────────────────
function searchKnowledgeBase(query) {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(t => t.length > 2);
  const results = { contextText: '', links: [], items: [] };

  // Search formulas
  CHEMCORE_DATA.formulas.forEach(f => {
    const text = [f.name, f.eq, f.desc, f.subject, ...f.tags].join(' ').toLowerCase();
    const score = tokens.filter(t => text.includes(t)).length;
    if (score > 0) {
      results.items.push({ score, type: 'formula', data: f,
        text: `Formula: ${f.name} — ${f.eq} (${f.desc})` });
    }
  });

  // Search constants
  CHEMCORE_DATA.constants.forEach(c => {
    const text = [c.name, c.sym, c.unit, c.cat].join(' ').toLowerCase();
    const score = tokens.filter(t => text.includes(t)).length;
    if (score > 0) {
      results.items.push({ score, type: 'constant', data: c,
        text: `Constant: ${c.name} (${c.sym}) = ${c.val} ${c.unit}` });
    }
  });

  // Search steam tables
  if (q.includes('steam') || q.includes('water') || q.includes('boil') || q.includes('saturated')) {
    const tempMatch = q.match(/(\d+)\s*°?c/i);
    if (tempMatch) {
      const T = parseInt(tempMatch[1]);
      const entry = CHEMCORE_DATA.steamTable.find(s => s.T === T);
      if (entry) {
        results.items.push({ score: 5, type: 'steam', data: entry,
          text: `Steam at ${entry.T}°C: P=${entry.P} kPa, hf=${entry.hf} kJ/kg, hfg=${entry.hfg} kJ/kg, hg=${entry.hg} kJ/kg, sf=${entry.sf}, sg=${entry.sg} kJ/(kg·K)` });
      }
    } else {
      results.items.push({ score: 2, type: 'steam', data: CHEMCORE_DATA.steamTable,
        text: `Steam table available: ${CHEMCORE_DATA.steamTable.length} entries from ${CHEMCORE_DATA.steamTable[0].T}°C to ${CHEMCORE_DATA.steamTable[CHEMCORE_DATA.steamTable.length-1].T}°C` });
    }
  }

  // Search Antoine constants
  CHEMCORE_DATA.antoineConstants.forEach(a => {
    if (q.includes(a.name.toLowerCase()) || (q.includes('antoine') && q.includes(a.name.toLowerCase().split(' ')[0]))) {
      results.items.push({ score: 4, type: 'antoine', data: a,
        text: `Antoine constants for ${a.name}: A=${a.A}, B=${a.B}, C=${a.C} (valid ${a.Tmin}–${a.Tmax}°C). Formula: log₁₀P* = A − B/(C+T)` });
    }
  });
  if (q.includes('antoine') && results.items.filter(i => i.type === 'antoine').length === 0) {
    results.items.push({ score: 2, type: 'antoine', data: null,
      text: `Antoine equation: log₁₀P* = A − B/(C+T). Available chemicals: ${CHEMCORE_DATA.antoineConstants.map(a => a.name).join(', ')}` });
  }

  // Search heat capacities
  CHEMCORE_DATA.heatCapacities.forEach(h => {
    const text = [h.name, h.state].join(' ').toLowerCase();
    const score = tokens.filter(t => text.includes(t)).length;
    if (score > 0 || (q.includes('cp') && text.includes(tokens.find(t => t !== 'cp') || ''))) {
      results.items.push({ score: score || 1, type: 'cp', data: h,
        text: `Cp of ${h.name}: ${h.Cp} ${h.unit} at ${h.Tref} (${h.state})` });
    }
  });

  // Search corrosion guide
  CHEMCORE_DATA.corrosionGuide.forEach(c => {
    const text = c.chemical.toLowerCase();
    if (tokens.some(t => text.includes(t)) || (q.includes('corrosion') && tokens.some(t => text.includes(t)))) {
      results.items.push({ score: 3, type: 'corrosion', data: c,
        text: `Corrosion guide for ${c.chemical}: Carbon Steel=${c.cs}, SS304=${c.ss304}, SS316=${c.ss316}, Hastelloy=${c.hastelloy}, Titanium=${c.titanium}, PVC=${c.pvc}` });
    }
  });

  // Search KB articles
  Object.entries(CHEMCORE_DATA.kbArticles).forEach(([id, article]) => {
    const text = [article.title, article.content !== 'dynamic' ? article.content.replace(/<[^>]+>/g, '') : ''].join(' ').toLowerCase();
    const score = tokens.filter(t => text.includes(t)).length;
    if (score >= 2 || (score >= 1 && tokens.length <= 2)) {
      results.items.push({ score, type: 'kb', data: { id, ...article },
        text: article.content !== 'dynamic' ? article.content.replace(/<[^>]+>/g, '').substring(0, 500) : `Knowledge base topic: ${article.title}` });
      results.links.push({ id, title: article.title, type: 'kb' });
    }
  });

  // Search interview questions
  CHEMCORE_DATA.interviewQuestions.forEach(iq => {
    const text = [iq.q, iq.a, iq.cat].join(' ').toLowerCase();
    const score = tokens.filter(t => text.includes(t)).length;
    if (score >= 2) {
      results.items.push({ score, type: 'interview', data: iq,
        text: `Q: ${iq.q}\nA: ${iq.a}` });
    }
  });

  // Sort by score and take top results
  results.items.sort((a, b) => b.score - a.score);
  const topItems = results.items.slice(0, 8);
  results.contextText = topItems.map(i => i.text).join('\n\n');

  // Generate navigation links
  topItems.forEach(item => {
    if (item.type === 'formula') {
      results.links.push({ title: item.data.name, type: 'formula', action: "navigate('knowledge');showKBTopic('formulas')" });
    } else if (item.type === 'steam') {
      results.links.push({ title: 'Steam Tables', type: 'data', action: "navigate('properties');showPropTab('steam')" });
    } else if (item.type === 'corrosion') {
      results.links.push({ title: 'Corrosion Guide', type: 'data', action: "navigate('properties');showPropTab('corrosion')" });
    } else if (item.type === 'antoine') {
      results.links.push({ title: 'Antoine Constants', type: 'data', action: "navigate('properties');showPropTab('antoine')" });
    } else if (item.type === 'cp') {
      results.links.push({ title: 'Heat Capacities', type: 'data', action: "navigate('properties');showPropTab('cp')" });
    } else if (item.type === 'constant') {
      results.links.push({ title: 'Physical Constants', type: 'data', action: "navigate('properties');showPropTab('constants')" });
    }
  });

  // Deduplicate links
  const seen = new Set();
  results.links = results.links.filter(l => {
    const key = l.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 4);

  return results;
}

// ── Local Reply Generator ────────────────────────────────────────
function generateLocalReply(query, kbContext) {
  const q = query.toLowerCase();
  let reply = '';

  if (kbContext.items.length === 0) {
    reply = `<p>I couldn't find specific information about that in the knowledge base. Here's what I can help with:</p>
<ul>
<li><strong>Formulas</strong> — Ask about any ChemE equation (Darcy-Weisbach, LMTD, Arrhenius, etc.)</li>
<li><strong>Properties</strong> — Look up steam tables, Antoine constants, heat capacities</li>
<li><strong>Materials</strong> — Corrosion compatibility for various chemicals</li>
<li><strong>Safety</strong> — HAZOP, relief valve sizing, LOPA, PSM</li>
<li><strong>Standards</strong> — ASME, TEMA, P&ID symbols</li>
</ul>
<p>Try asking something specific like <em>"What is the Antoine equation for water?"</em> or <em>"Is SS316 compatible with HCl?"</em></p>`;
    return reply;
  }

  const topItems = kbContext.items.slice(0, 5);
  const types = [...new Set(topItems.map(i => i.type))];

  // Build reply based on what we found
  if (types.includes('formula')) {
    const formulas = topItems.filter(i => i.type === 'formula');
    reply += `<p>Here's what I found in the formula reference:</p>`;
    formulas.forEach(f => {
      reply += `<p><strong>${f.data.name}</strong> (${f.data.subject})</p>
<p><code>${f.data.eq}</code></p>
<p>${f.data.desc}</p>`;
    });
  }

  if (types.includes('constant')) {
    const constants = topItems.filter(i => i.type === 'constant');
    reply += `<p><strong>Physical Constants:</strong></p><ul>`;
    constants.forEach(c => {
      reply += `<li><strong>${c.data.name}</strong> (${c.data.sym}) = ${c.data.val} ${c.data.unit}</li>`;
    });
    reply += `</ul>`;
  }

  if (types.includes('steam')) {
    const steam = topItems.find(i => i.type === 'steam');
    if (steam && steam.data && !Array.isArray(steam.data)) {
      const s = steam.data;
      reply += `<p><strong>Saturated Steam at ${s.T}°C:</strong></p>
<ul>
<li>Pressure: <strong>${s.P} kPa</strong></li>
<li>h_f = ${s.hf} kJ/kg | h_fg = ${s.hfg} kJ/kg | h_g = ${s.hg} kJ/kg</li>
<li>s_f = ${s.sf} | s_g = ${s.sg} kJ/(kg·K)</li>
</ul>`;
    } else {
      reply += `<p>Steam table data is available from 100°C to 360°C. Try asking for a specific temperature, e.g., <em>"Steam properties at 200°C"</em>.</p>`;
    }
  }

  if (types.includes('antoine')) {
    const antoine = topItems.filter(i => i.type === 'antoine');
    antoine.forEach(a => {
      if (a.data) {
        reply += `<p><strong>Antoine Constants — ${a.data.name}:</strong></p>
<p><code>log₁₀P* = ${a.data.A} − ${a.data.B}/(${a.data.C} + T)</code></p>
<p>Valid range: ${a.data.Tmin}°C to ${a.data.Tmax}°C (P* in ${a.data.unit})</p>`;
      }
    });
  }

  if (types.includes('corrosion')) {
    const corr = topItems.filter(i => i.type === 'corrosion');
    reply += `<p><strong>Material Compatibility:</strong></p>`;
    corr.forEach(c => {
      const d = c.data;
      reply += `<p><strong>${d.chemical}:</strong></p>
<ul>
<li>Carbon Steel: <strong>${d.cs}</strong> | SS304: <strong>${d.ss304}</strong> | SS316: <strong>${d.ss316}</strong></li>
<li>Hastelloy: <strong>${d.hastelloy}</strong> | Titanium: <strong>${d.titanium}</strong> | PVC: <strong>${d.pvc}</strong></li>
</ul>`;
    });
  }

  if (types.includes('cp')) {
    const cps = topItems.filter(i => i.type === 'cp');
    reply += `<p><strong>Heat Capacity Data:</strong></p><ul>`;
    cps.forEach(h => {
      reply += `<li><strong>${h.data.name}</strong>: Cp = ${h.data.Cp} ${h.data.unit} at ${h.data.Tref} (${h.data.state})</li>`;
    });
    reply += `</ul>`;
  }

  if (types.includes('kb')) {
    const kb = topItems.find(i => i.type === 'kb');
    if (kb && kb.data.content && kb.data.content !== 'dynamic') {
      const cleaned = kb.data.content.replace(/<[^>]+>/g, '').substring(0, 400);
      reply += `<p><strong>From the Knowledge Base — ${kb.data.title}:</strong></p><p>${cleaned}...</p>`;
    }
  }

  if (types.includes('interview')) {
    const iq = topItems.find(i => i.type === 'interview');
    if (iq) {
      reply += `<p><strong>Interview Q&A — ${iq.data.cat}:</strong></p>
<p><em>Q: ${iq.data.q}</em></p>
<p>${iq.data.a}</p>`;
    }
  }

  if (!reply) {
    reply = `<p>I found some related information but couldn't construct a clear answer. Try rephrasing your question or check the Knowledge Base directly.</p>`;
  }

  return reply + renderKBLinks(kbContext.links);
}

// ── Render KB Navigation Links ───────────────────────────────────
function renderKBLinks(links) {
  if (!links || links.length === 0) return '';
  return `<div class="chat-suggestions" style="margin-top:8px">
    ${links.map(l => {
      const action = l.action || (l.type === 'kb'
        ? `navigate('knowledge');showKBTopic('${l.id}')`
        : `navigate('properties')`);
      return `<span class="chat-kb-link" onclick="${action};toggleChat()">📖 ${l.title}</span>`;
    }).join('')}
  </div>`;
}

// ── Format API Reply ─────────────────────────────────────────────
function formatBotReply(text) {
  // Convert markdown-ish text to HTML
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul>$1</ul>');

  // Paragraphs
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<ul>') || p.startsWith('<ol>') || p.startsWith('<li>')) return p;
    return `<p>${p}</p>`;
  }).join('');

  // Single newlines to <br> within paragraphs
  html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');

  return html;
}

// ── Follow-up Suggestions ────────────────────────────────────────
function appendFollowUpSuggestions(query) {
  const q = query.toLowerCase();
  const suggestions = [];

  if (q.includes('pressure') || q.includes('darcy') || q.includes('pipe')) {
    suggestions.push('Open Pressure Drop calculator', 'What is Reynolds number?');
  } else if (q.includes('heat') || q.includes('lmtd') || q.includes('exchanger')) {
    suggestions.push('Open LMTD calculator', "Explain Fourier's law");
  } else if (q.includes('reactor') || q.includes('cstr') || q.includes('pfr')) {
    suggestions.push('Compare CSTR vs PFR', 'What is Arrhenius equation?');
  } else if (q.includes('corrosion') || q.includes('material')) {
    suggestions.push('Is Hastelloy good for HCl?', 'Show corrosion table');
  } else if (q.includes('steam') || q.includes('water')) {
    suggestions.push('Steam at 200°C properties', 'What is Antoine equation?');
  } else if (q.includes('safety') || q.includes('hazop') || q.includes('relief')) {
    suggestions.push('Explain LOPA', 'How to size a relief valve?');
  } else {
    suggestions.push('Show me key formulas', 'What materials resist H₂SO₄?');
  }

  if (suggestions.length > 0) {
    appendSuggestions(suggestions);
  }
}

// ── DOM Helpers ──────────────────────────────────────────────────
function appendUserMessage(text) {
  const messagesEl = document.getElementById('chat-messages');
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const msgEl = document.createElement('div');
  msgEl.className = 'chat-message user';
  msgEl.innerHTML = `
    <div class="chat-msg-avatar">👤</div>
    <div>
      <div class="chat-msg-content">${escapeHtml(text)}</div>
      <div class="chat-msg-time">${time}</div>
    </div>`;
  messagesEl.appendChild(msgEl);
  scrollToBottom();
}

function appendBotMessage(html) {
  const messagesEl = document.getElementById('chat-messages');
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const msgEl = document.createElement('div');
  msgEl.className = 'chat-message bot';
  msgEl.innerHTML = `
    <div class="chat-msg-avatar">⚗️</div>
    <div>
      <div class="chat-msg-content">${html}</div>
      <div class="chat-msg-time">${time}</div>
    </div>`;
  messagesEl.appendChild(msgEl);
  scrollToBottom();
}

function appendSuggestions(suggestions) {
  const messagesEl = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-suggestions';
  div.innerHTML = suggestions.map(s =>
    `<button class="chat-suggestion" onclick="askSuggestion('${s.replace(/'/g, "\\'")}')">${s}</button>`
  ).join('');
  messagesEl.appendChild(div);
  scrollToBottom();
}

function showTypingIndicator() {
  const messagesEl = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.className = 'chat-message bot';
  typing.id = 'typing-indicator';
  typing.innerHTML = `
    <div class="chat-msg-avatar">⚗️</div>
    <div class="chat-typing">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  messagesEl.appendChild(typing);
  scrollToBottom();
}

function removeTypingIndicator() {
  document.getElementById('typing-indicator')?.remove();
}

function scrollToBottom() {
  const el = document.getElementById('chat-messages');
  setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
}

function updateSendButton() {
  const btn = document.getElementById('chat-send-btn');
  btn.disabled = chatLoading;
  btn.innerHTML = chatLoading ? '⏳' : '➤';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
