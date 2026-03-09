/* ═══════════════════════════════════════════════════════════════════
   ChemCore — Calculator Engine
   All engineering calculators and their UI generation
   ═══════════════════════════════════════════════════════════════════ */

const CALCULATORS = {
  'unit-converter': {
    title: 'Unit Converter',
    desc: 'Convert between SI and US customary units for all common engineering quantities.',
    render() {
      const cats = Object.keys(CHEMCORE_DATA.unitCategories);
      return `
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" id="uc-category" onchange="ucCategoryChange()">
            ${cats.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div id="uc-fields">${this.renderFields(cats[0])}</div>
        <div id="uc-result"></div>`;
    },
    renderFields(cat) {
      if (cat === 'Temperature') {
        return `
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">From</label>
              <select class="form-select" id="uc-from"><option>°C</option><option>°F</option><option>K</option><option>°R</option></select>
            </div>
            <div class="form-group">
              <label class="form-label">To</label>
              <select class="form-select" id="uc-to"><option>°F</option><option>°C</option><option>K</option><option>°R</option></select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Value</label>
            <input type="number" class="form-input" id="uc-value" placeholder="Enter value" oninput="calcUnitConvert()">
          </div>`;
      }
      const units = CHEMCORE_DATA.unitCategories[cat];
      return `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">From</label>
            <select class="form-select" id="uc-from" onchange="calcUnitConvert()">
              ${units.map(u => `<option value="${u.factor}">${u.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">To</label>
            <select class="form-select" id="uc-to" onchange="calcUnitConvert()">
              ${units.map((u,i) => `<option value="${u.factor}" ${i===1?'selected':''}>${u.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Value</label>
          <input type="number" class="form-input" id="uc-value" placeholder="Enter value" oninput="calcUnitConvert()">
        </div>`;
    }
  },
  'pressure-drop': {
    title: 'Pressure Drop (Darcy-Weisbach)',
    desc: 'Calculate pressure drop in pipe flow using the Darcy-Weisbach equation: ΔP = f·(L/D)·(ρv²/2)',
    render() {
      return `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Pipe Diameter (m)</label>
            <input type="number" class="form-input" id="pd-diameter" value="0.1" step="0.01">
          </div>
          <div class="form-group">
            <label class="form-label">Pipe Length (m)</label>
            <input type="number" class="form-input" id="pd-length" value="100" step="1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Flow Velocity (m/s)</label>
            <input type="number" class="form-input" id="pd-velocity" value="2" step="0.1">
          </div>
          <div class="form-group">
            <label class="form-label">Fluid Density (kg/m³)</label>
            <input type="number" class="form-input" id="pd-density" value="997" step="1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Dynamic Viscosity (Pa·s)</label>
            <input type="number" class="form-input" id="pd-viscosity" value="0.001" step="0.0001">
          </div>
          <div class="form-group">
            <label class="form-label">Roughness ε (m)</label>
            <input type="number" class="form-input" id="pd-roughness" value="0.000045" step="0.000001">
          </div>
        </div>
        <button class="btn btn-primary" onclick="calcPressureDrop()">Calculate</button>
        <div id="pd-result"></div>`;
    }
  },
  'pump-sizing': {
    title: 'Pump Sizing & NPSH',
    desc: 'Calculate required pump head and Net Positive Suction Head Available (NPSHa).',
    render() {
      return `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Flow Rate Q (m³/hr)</label>
            <input type="number" class="form-input" id="ps-flow" value="50" step="1">
          </div>
          <div class="form-group">
            <label class="form-label">Static Head Δz (m)</label>
            <input type="number" class="form-input" id="ps-head" value="15" step="0.5">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Friction Losses hf (m)</label>
            <input type="number" class="form-input" id="ps-friction" value="5" step="0.5">
          </div>
          <div class="form-group">
            <label class="form-label">Pressure Diff ΔP (kPa)</label>
            <input type="number" class="form-input" id="ps-dp" value="200" step="10">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Fluid Density (kg/m³)</label>
            <input type="number" class="form-input" id="ps-density" value="997" step="1">
          </div>
          <div class="form-group">
            <label class="form-label">Pump Efficiency η (%)</label>
            <input type="number" class="form-input" id="ps-eff" value="75" step="1">
          </div>
        </div>
        <h4 style="margin-top:var(--space-lg);">NPSH Available</h4>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Suction Pressure (kPa abs)</label>
            <input type="number" class="form-input" id="ps-ps" value="101.3" step="1">
          </div>
          <div class="form-group">
            <label class="form-label">Vapor Pressure (kPa abs)</label>
            <input type="number" class="form-input" id="ps-pvap" value="3.17" step="0.1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Suction Head (m)</label>
            <input type="number" class="form-input" id="ps-zs" value="2" step="0.5">
          </div>
          <div class="form-group">
            <label class="form-label">Suction Losses (m)</label>
            <input type="number" class="form-input" id="ps-hfs" value="0.5" step="0.1">
          </div>
        </div>
        <button class="btn btn-primary" onclick="calcPumpSizing()">Calculate</button>
        <div id="ps-result"></div>`;
    }
  },
  'orifice': {
    title: 'Orifice Plate Sizing',
    desc: 'Size an orifice plate for flow measurement using ISO 5167.',
    render() {
      return `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Pipe Diameter D (m)</label>
            <input type="number" class="form-input" id="or-D" value="0.1" step="0.01">
          </div>
          <div class="form-group">
            <label class="form-label">Flow Rate Q (m³/hr)</label>
            <input type="number" class="form-input" id="or-Q" value="20" step="1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Fluid Density (kg/m³)</label>
            <input type="number" class="form-input" id="or-rho" value="997" step="1">
          </div>
          <div class="form-group">
            <label class="form-label">Differential Pressure ΔP (kPa)</label>
            <input type="number" class="form-input" id="or-dp" value="25" step="1">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Discharge Coefficient Cd</label>
          <input type="number" class="form-input" id="or-Cd" value="0.61" step="0.01">
        </div>
        <button class="btn btn-primary" onclick="calcOrifice()">Calculate</button>
        <div id="or-result"></div>`;
    }
  },
  'lmtd': {
    title: 'LMTD Calculator',
    desc: 'Log Mean Temperature Difference for heat exchanger design.',
    render() {
      return `
        <div class="chip-group" style="margin-bottom:var(--space-lg)">
          <button class="chip active" id="lmtd-counter" onclick="setLMTDType('counter')">Counter-current</button>
          <button class="chip" id="lmtd-co" onclick="setLMTDType('co')">Co-current</button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Hot Fluid Inlet T₁ (°C)</label>
            <input type="number" class="form-input" id="lmtd-T1" value="150" step="1">
          </div>
          <div class="form-group">
            <label class="form-label">Hot Fluid Outlet T₂ (°C)</label>
            <input type="number" class="form-input" id="lmtd-T2" value="90" step="1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Cold Fluid Inlet t₁ (°C)</label>
            <input type="number" class="form-input" id="lmtd-t1" value="30" step="1">
          </div>
          <div class="form-group">
            <label class="form-label">Cold Fluid Outlet t₂ (°C)</label>
            <input type="number" class="form-input" id="lmtd-t2" value="70" step="1">
          </div>
        </div>
        <button class="btn btn-primary" onclick="calcLMTD()">Calculate</button>
        <div id="lmtd-result"></div>`;
    }
  },
  'hx-sizing': {
    title: 'Heat Exchanger Sizing',
    desc: 'Preliminary shell-and-tube heat exchanger sizing using Q = UAΔT_lm.',
    render() {
      return `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Heat Duty Q (kW)</label>
            <input type="number" class="form-input" id="hx-Q" value="500" step="10">
          </div>
          <div class="form-group">
            <label class="form-label">Overall U (W/m²·K)</label>
            <input type="number" class="form-input" id="hx-U" value="300" step="10">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">LMTD (°C)</label>
          <input type="number" class="form-input" id="hx-lmtd" value="45" step="1">
        </div>
        <button class="btn btn-primary" onclick="calcHXSizing()">Calculate</button>
        <div id="hx-result"></div>`;
    }
  },
  'insulation': {
    title: 'Insulation Thickness',
    desc: 'Calculate heat loss and required insulation thickness for piping.',
    render() {
      return `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Pipe OD (m)</label>
            <input type="number" class="form-input" id="ins-od" value="0.114" step="0.001">
          </div>
          <div class="form-group">
            <label class="form-label">Pipe Length (m)</label>
            <input type="number" class="form-input" id="ins-L" value="10" step="1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Process Temp (°C)</label>
            <input type="number" class="form-input" id="ins-Tp" value="200" step="5">
          </div>
          <div class="form-group">
            <label class="form-label">Ambient Temp (°C)</label>
            <input type="number" class="form-input" id="ins-Ta" value="25" step="1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Insulation k (W/m·K)</label>
            <input type="number" class="form-input" id="ins-k" value="0.04" step="0.005">
          </div>
          <div class="form-group">
            <label class="form-label">Insulation Thickness (m)</label>
            <input type="number" class="form-input" id="ins-thick" value="0.05" step="0.005">
          </div>
        </div>
        <button class="btn btn-primary" onclick="calcInsulation()">Calculate</button>
        <div id="ins-result"></div>`;
    }
  },
  'psychrometric': {
    title: 'Psychrometric Calculator',
    desc: 'Calculate air/water vapor properties: humidity ratio, dew point, wet bulb, enthalpy.',
    render() {
      return `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Dry Bulb Temperature (°C)</label>
            <input type="number" class="form-input" id="psy-Tdb" value="30" step="1">
          </div>
          <div class="form-group">
            <label class="form-label">Relative Humidity (%)</label>
            <input type="number" class="form-input" id="psy-RH" value="60" step="1">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Atmospheric Pressure (kPa)</label>
          <input type="number" class="form-input" id="psy-P" value="101.325" step="0.1">
        </div>
        <button class="btn btn-primary" onclick="calcPsychrometric()">Calculate</button>
        <div id="psy-result"></div>`;
    }
  },
  'batch-reactor': {
    title: 'Batch Reactor Time',
    desc: 'Calculate required batch time for a given conversion (first or second order reaction).',
    render() {
      return `
        <div class="form-group">
          <label class="form-label">Reaction Order</label>
          <select class="form-select" id="br-order">
            <option value="1">First Order (−rA = kCA)</option>
            <option value="2">Second Order (−rA = kCA²)</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rate Constant k</label>
            <input type="number" class="form-input" id="br-k" value="0.1" step="0.01">
          </div>
          <div class="form-group">
            <label class="form-label">Initial Conc. CA₀ (mol/L)</label>
            <input type="number" class="form-input" id="br-ca0" value="2" step="0.1">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Desired Conversion X (0-1)</label>
          <input type="number" class="form-input" id="br-X" value="0.9" step="0.01" min="0" max="0.99">
        </div>
        <button class="btn btn-primary" onclick="calcBatchReactor()">Calculate</button>
        <div id="br-result"></div>`;
    }
  },
  'reactor': {
    title: 'PFR vs CSTR Volume Comparison',
    desc: 'Compare reactor volumes for PFR and CSTR at same conversion (first or second order).',
    render() {
      return `
        <div class="form-group">
          <label class="form-label">Reaction Order</label>
          <select class="form-select" id="rx-order">
            <option value="1">First Order (−rA = kCA)</option>
            <option value="2">Second Order (−rA = kCA²)</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rate Constant k</label>
            <input type="number" class="form-input" id="rx-k" value="0.1" step="0.01">
          </div>
          <div class="form-group">
            <label class="form-label">Molar Feed FA₀ (mol/s)</label>
            <input type="number" class="form-input" id="rx-fa0" value="5" step="0.5">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Initial Conc. CA₀ (mol/L)</label>
            <input type="number" class="form-input" id="rx-ca0" value="2" step="0.1">
          </div>
          <div class="form-group">
            <label class="form-label">Desired Conversion X</label>
            <input type="number" class="form-input" id="rx-X" value="0.9" step="0.01" min="0" max="0.99">
          </div>
        </div>
        <button class="btn btn-primary" onclick="calcReactorComparison()">Calculate</button>
        <div id="rx-result"></div>`;
    }
  }
};

// ── Calculator Logic ─────────────────────────────────────────────

function ucCategoryChange() {
  const cat = document.getElementById('uc-category').value;
  document.getElementById('uc-fields').innerHTML = CALCULATORS['unit-converter'].renderFields(cat);
  document.getElementById('uc-result').innerHTML = '';
}

function calcUnitConvert() {
  const cat = document.getElementById('uc-category').value;
  const val = parseFloat(document.getElementById('uc-value').value);
  if (isNaN(val)) return;

  let result;
  if (cat === 'Temperature') {
    const from = document.getElementById('uc-from').value;
    const to = document.getElementById('uc-to').value;
    result = convertTemp(val, from, to);
  } else {
    const fromFactor = parseFloat(document.getElementById('uc-from').value);
    const toFactor = parseFloat(document.getElementById('uc-to').value);
    result = (val * fromFactor) / toFactor;
  }

  const toUnit = document.getElementById('uc-to').selectedOptions[0].text;
  document.getElementById('uc-result').innerHTML = renderResult(result, toUnit, []);
}

function convertTemp(val, from, to) {
  let celsius;
  if (from === '°C') celsius = val;
  else if (from === '°F') celsius = (val - 32) * 5/9;
  else if (from === 'K') celsius = val - 273.15;
  else celsius = (val - 491.67) * 5/9;

  if (to === '°C') return celsius;
  if (to === '°F') return celsius * 9/5 + 32;
  if (to === 'K') return celsius + 273.15;
  return (celsius + 273.15) * 9/5;
}

function calcPressureDrop() {
  const D = parseFloat(document.getElementById('pd-diameter').value);
  const L = parseFloat(document.getElementById('pd-length').value);
  const v = parseFloat(document.getElementById('pd-velocity').value);
  const rho = parseFloat(document.getElementById('pd-density').value);
  const mu = parseFloat(document.getElementById('pd-viscosity').value);
  const eps = parseFloat(document.getElementById('pd-roughness').value);

  const Re = rho * v * D / mu;
  let f;
  if (Re < 2100) {
    f = 64 / Re;
  } else {
    // Swamee-Jain approximation of Colebrook
    f = 0.25 / Math.pow(Math.log10(eps/(3.7*D) + 5.74/Math.pow(Re, 0.9)), 2);
  }
  const dP = f * (L/D) * (rho * v*v / 2);
  const regime = Re < 2100 ? 'Laminar' : Re < 4000 ? 'Transitional' : 'Turbulent';

  document.getElementById('pd-result').innerHTML = renderResult(dP/1000, 'kPa', [
    ['Reynolds Number', Re.toFixed(0)],
    ['Flow Regime', regime],
    ['Friction Factor (Darcy)', f.toFixed(6)],
    ['ΔP', (dP/1000).toFixed(3) + ' kPa (' + (dP/6894.76).toFixed(3) + ' psi)'],
    ['Velocity Head (ρv²/2)', (rho*v*v/2).toFixed(1) + ' Pa'],
  ]);
}

function calcPumpSizing() {
  const Q = parseFloat(document.getElementById('ps-flow').value) / 3600;
  const dz = parseFloat(document.getElementById('ps-head').value);
  const hf = parseFloat(document.getElementById('ps-friction').value);
  const dP = parseFloat(document.getElementById('ps-dp').value) * 1000;
  const rho = parseFloat(document.getElementById('ps-density').value);
  const eff = parseFloat(document.getElementById('ps-eff').value) / 100;
  const Ps = parseFloat(document.getElementById('ps-ps').value) * 1000;
  const Pvap = parseFloat(document.getElementById('ps-pvap').value) * 1000;
  const zs = parseFloat(document.getElementById('ps-zs').value);
  const hfs = parseFloat(document.getElementById('ps-hfs').value);

  const g = 9.807;
  const headP = dP / (rho * g);
  const TDH = dz + hf + headP;
  const power = rho * g * Q * TDH / eff;
  const NPSHa = (Ps - Pvap) / (rho * g) + zs - hfs;

  document.getElementById('ps-result').innerHTML = renderResult(TDH.toFixed(2), 'm', [
    ['Total Dynamic Head', TDH.toFixed(2) + ' m'],
    ['Pressure Head', headP.toFixed(2) + ' m'],
    ['Hydraulic Power', (rho*g*Q*TDH/1000).toFixed(2) + ' kW'],
    ['Shaft Power (@ η=' + (eff*100).toFixed(0) + '%)', (power/1000).toFixed(2) + ' kW'],
    ['NPSHa', NPSHa.toFixed(2) + ' m'],
    ['Flow Rate', (Q*3600).toFixed(1) + ' m³/hr (' + (Q*3600*4.403).toFixed(1) + ' GPM)'],
  ]);
}

function calcOrifice() {
  const D = parseFloat(document.getElementById('or-D').value);
  const Q = parseFloat(document.getElementById('or-Q').value) / 3600;
  const rho = parseFloat(document.getElementById('or-rho').value);
  const dP = parseFloat(document.getElementById('or-dp').value) * 1000;
  const Cd = parseFloat(document.getElementById('or-Cd').value);

  const Aorifice = Q / (Cd * Math.sqrt(2 * dP / rho));
  const dorifice = Math.sqrt(4 * Aorifice / Math.PI);
  const beta = dorifice / D;

  document.getElementById('or-result').innerHTML = renderResult((dorifice*1000).toFixed(2), 'mm', [
    ['Orifice Diameter', (dorifice*1000).toFixed(2) + ' mm'],
    ['Orifice Area', (Aorifice*1e6).toFixed(2) + ' mm²'],
    ['Beta Ratio (d/D)', beta.toFixed(4)],
    ['Status', beta > 0.75 ? '⚠️ Beta > 0.75 — may need to resize pipe' : '✅ Beta ratio acceptable'],
  ]);
}

let lmtdType = 'counter';
function setLMTDType(type) {
  lmtdType = type;
  document.getElementById('lmtd-counter').classList.toggle('active', type === 'counter');
  document.getElementById('lmtd-co').classList.toggle('active', type === 'co');
}

function calcLMTD() {
  const T1 = parseFloat(document.getElementById('lmtd-T1').value);
  const T2 = parseFloat(document.getElementById('lmtd-T2').value);
  const t1 = parseFloat(document.getElementById('lmtd-t1').value);
  const t2 = parseFloat(document.getElementById('lmtd-t2').value);

  let dT1, dT2;
  if (lmtdType === 'counter') {
    dT1 = T1 - t2;
    dT2 = T2 - t1;
  } else {
    dT1 = T1 - t1;
    dT2 = T2 - t2;
  }

  if (dT1 <= 0 || dT2 <= 0) {
    document.getElementById('lmtd-result').innerHTML = '<div class="calc-result"><p style="color:var(--danger)">⚠️ Temperature cross detected. Check inlet/outlet temperatures.</p></div>';
    return;
  }

  const lmtd = Math.abs(dT1 - dT2) < 0.01 ? dT1 : (dT1 - dT2) / Math.log(dT1 / dT2);
  const Qratio = (T1 - T2) / (t2 - t1);

  document.getElementById('lmtd-result').innerHTML = renderResult(lmtd.toFixed(2), '°C', [
    ['LMTD', lmtd.toFixed(2) + ' °C'],
    ['ΔT₁', dT1.toFixed(1) + ' °C'],
    ['ΔT₂', dT2.toFixed(1) + ' °C'],
    ['Flow Arrangement', lmtdType === 'counter' ? 'Counter-current' : 'Co-current'],
    ['Heat Capacity Rate Ratio', Qratio.toFixed(3)],
  ]);
}

function calcHXSizing() {
  const Q = parseFloat(document.getElementById('hx-Q').value) * 1000;
  const U = parseFloat(document.getElementById('hx-U').value);
  const lmtd = parseFloat(document.getElementById('hx-lmtd').value);

  const A = Q / (U * lmtd);
  const nTubes20 = A / (Math.PI * 0.01905 * 4.877);

  document.getElementById('hx-result').innerHTML = renderResult(A.toFixed(2), 'm²', [
    ['Required HX Area', A.toFixed(2) + ' m² (' + (A*10.764).toFixed(1) + ' ft²)'],
    ['Heat Duty', (Q/1000).toFixed(1) + ' kW'],
    ['Overall U', U + ' W/(m²·K)'],
    ['Est. Tubes (¾" OD × 16ft)', Math.ceil(nTubes20).toString()],
  ]);
}

function calcInsulation() {
  const OD = parseFloat(document.getElementById('ins-od').value);
  const L = parseFloat(document.getElementById('ins-L').value);
  const Tp = parseFloat(document.getElementById('ins-Tp').value);
  const Ta = parseFloat(document.getElementById('ins-Ta').value);
  const k = parseFloat(document.getElementById('ins-k').value);
  const thick = parseFloat(document.getElementById('ins-thick').value);

  const r1 = OD / 2;
  const r2 = r1 + thick;
  const ho = 10;
  const Rins = Math.log(r2/r1) / (2 * Math.PI * k * L);
  const Rconv = 1 / (ho * 2 * Math.PI * r2 * L);
  const Rtotal = Rins + Rconv;
  const Qloss = (Tp - Ta) / Rtotal;
  const Tsurface = Ta + Qloss * Rconv;

  document.getElementById('ins-result').innerHTML = renderResult(Qloss.toFixed(1), 'W', [
    ['Heat Loss', Qloss.toFixed(1) + ' W (' + (Qloss/L).toFixed(1) + ' W/m)'],
    ['Surface Temperature', Tsurface.toFixed(1) + ' °C'],
    ['Insulation Resistance', Rins.toFixed(4) + ' K/W'],
    ['Convection Resistance', Rconv.toFixed(4) + ' K/W'],
    ['Insulation OD', (r2*2*1000).toFixed(1) + ' mm'],
  ]);
}

function calcPsychrometric() {
  const Tdb = parseFloat(document.getElementById('psy-Tdb').value);
  const RH = parseFloat(document.getElementById('psy-RH').value) / 100;
  const P = parseFloat(document.getElementById('psy-P').value);

  const Psat = 0.61078 * Math.exp(17.27 * Tdb / (Tdb + 237.3));
  const Pw = RH * Psat;
  const W = 0.622 * Pw / (P - Pw);
  const Tdp = 237.3 * Math.log(Pw/0.61078) / (17.27 - Math.log(Pw/0.61078));
  const h = 1.006 * Tdb + W * (2501 + 1.86 * Tdb);

  document.getElementById('psy-result').innerHTML = renderResult(W.toFixed(5), 'kg/kg', [
    ['Humidity Ratio ω', (W*1000).toFixed(2) + ' g/kg dry air'],
    ['Dew Point', Tdp.toFixed(1) + ' °C'],
    ['Saturation Pressure', Psat.toFixed(3) + ' kPa'],
    ['Partial Pressure H₂O', Pw.toFixed(3) + ' kPa'],
    ['Specific Enthalpy', h.toFixed(1) + ' kJ/kg'],
  ]);
}

function calcBatchReactor() {
  const order = parseInt(document.getElementById('br-order').value);
  const k = parseFloat(document.getElementById('br-k').value);
  const CA0 = parseFloat(document.getElementById('br-ca0').value);
  const X = parseFloat(document.getElementById('br-X').value);

  let t;
  if (order === 1) {
    t = -Math.log(1 - X) / k;
  } else {
    t = X / (k * CA0 * (1 - X));
  }

  const unit = k < 1 ? 'seconds' : 'seconds';
  document.getElementById('br-result').innerHTML = renderResult(t.toFixed(2), 's', [
    ['Batch Time', t.toFixed(2) + ' s (' + (t/60).toFixed(2) + ' min)'],
    ['Reaction Order', order === 1 ? 'First' : 'Second'],
    ['Rate Constant k', k + (order === 1 ? ' s⁻¹' : ' L/(mol·s)')],
    ['Final Concentration', (CA0*(1-X)).toFixed(4) + ' mol/L'],
    ['Conversion', (X*100).toFixed(1) + '%'],
  ]);
}

function calcReactorComparison() {
  const order = parseInt(document.getElementById('rx-order').value);
  const k = parseFloat(document.getElementById('rx-k').value);
  const FA0 = parseFloat(document.getElementById('rx-fa0').value);
  const CA0 = parseFloat(document.getElementById('rx-ca0').value);
  const X = parseFloat(document.getElementById('rx-X').value);

  let Vcstr, Vpfr;
  const v0 = FA0 / CA0;

  if (order === 1) {
    Vcstr = v0 * X / (k * (1 - X));
    Vpfr = (v0 / k) * (-Math.log(1 - X));
  } else {
    Vcstr = v0 * X / (k * CA0 * Math.pow(1 - X, 2));
    Vpfr = (v0 / (k * CA0)) * (X / (1 - X));
  }

  const ratio = Vcstr / Vpfr;

  document.getElementById('rx-result').innerHTML = `
    <div class="calc-result">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);">
        <div>
          <div class="calc-result-label">CSTR Volume</div>
          <div class="calc-result-value">${(Vcstr*1000).toFixed(1)}<span class="calc-result-unit">L</span></div>
        </div>
        <div>
          <div class="calc-result-label">PFR Volume</div>
          <div class="calc-result-value">${(Vpfr*1000).toFixed(1)}<span class="calc-result-unit">L</span></div>
        </div>
      </div>
      <div class="calc-result-details">
        <div class="calc-detail-row"><span>V_CSTR / V_PFR</span><span>${ratio.toFixed(3)}</span></div>
        <div class="calc-detail-row"><span>Space Time τ (CSTR)</span><span>${(Vcstr/v0).toFixed(2)} s</span></div>
        <div class="calc-detail-row"><span>Space Time τ (PFR)</span><span>${(Vpfr/v0).toFixed(2)} s</span></div>
        <div class="calc-detail-row"><span>Verdict</span><span>${ratio > 1 ? 'PFR is more efficient ✅' : 'Volumes are equal'}</span></div>
      </div>
    </div>`;
}

// ── Result Renderer ──────────────────────────────────────────────
function renderResult(value, unit, details) {
  return `
    <div class="calc-result">
      <div class="calc-result-label">Result</div>
      <div class="calc-result-value">${value}<span class="calc-result-unit">${unit}</span></div>
      ${details.length ? `
        <div class="calc-result-details">
          ${details.map(([label, val]) => `<div class="calc-detail-row"><span>${label}</span><span>${val}</span></div>`).join('')}
        </div>` : ''}
    </div>`;
}

function showCalc(id) {
  document.querySelectorAll('.calc-category').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-calc="${id}"]`)?.classList.add('active');

  const calc = CALCULATORS[id];
  if (!calc) return;

  const workspace = document.getElementById('calc-workspace');
  workspace.innerHTML = `
    <div class="calc-workspace-header">
      <h3 class="calc-workspace-title">${calc.title}</h3>
      <p class="calc-workspace-desc">${calc.desc}</p>
    </div>
    <div class="calc-form">${calc.render()}</div>`;
}

function navigateCalc(id) {
  navigate('calculators');
  setTimeout(() => showCalc(id), 50);
}
