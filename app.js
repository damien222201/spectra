/* ============================================================
   SPECTRA — app logic
   ============================================================ */

const CATEGORY_META = [
  { match: "alkali metal",            label: "Alkali metal",            varName: "--c-alkali" },
  { match: "alkaline earth metal",    label: "Alkaline earth metal",    varName: "--c-alkaline" },
  { match: "lanthanide",              label: "Lanthanide",              varName: "--c-lanthanide" },
  { match: "actinide",                label: "Actinide",                varName: "--c-actinide" },
  { match: "transition metal",        label: "Transition metal",        varName: "--c-transition" },
  { match: "post-transition metal",   label: "Post-transition metal",   varName: "--c-posttrans" },
  { match: "metalloid",               label: "Metalloid",               varName: "--c-metalloid" },
  { match: "diatomic nonmetal",       label: "Reactive nonmetal",       varName: "--c-nonmetal" },
  { match: "polyatomic nonmetal",     label: "Reactive nonmetal",       varName: "--c-nonmetal" },
  { match: "noble gas",               label: "Noble gas",               varName: "--c-noble" },
  { match: "halogen",                 label: "Halogen",                 varName: "--c-halogen" },
];

function categoryMeta(category){
  const c = (category || "").toLowerCase();
  for (const m of CATEGORY_META){
    if (c.includes(m.match)) return m;
  }
  return { match: "unknown", label: "Unknown", varName: "--c-unknown" };
}

function catColorVar(category){
  return `var(${categoryMeta(category).varName})`;
}

// ---- state ----
const state = {
  query: "",
  activeCategories: new Set(), // empty = show all
  selectedNumber: null,
};

const els = document.getElementById("elements-grid");
const panel = document.getElementById("panel");
const scrim = document.getElementById("scrim");
const searchInput = document.getElementById("search-input");
const legendEl = document.getElementById("legend");
const noResultsTpl = document.getElementById("no-results-tpl");

// ---- build legend ----
function buildLegend(){
  const seen = new Map();
  ELEMENTS.forEach(e => {
    const m = categoryMeta(e.category);
    if (!seen.has(m.label)) seen.set(m.label, m.varName);
  });
  legendEl.innerHTML = "";
  seen.forEach((varName, label) => {
    const btn = document.createElement("button");
    btn.className = "legend-item";
    btn.type = "button";
    btn.dataset.label = label;
    btn.innerHTML = `<span class="legend-swatch" style="background:var(${varName})"></span>${label}`;
    btn.addEventListener("click", () => toggleCategory(label));
    legendEl.appendChild(btn);
  });
}

function toggleCategory(label){
  if (state.activeCategories.has(label)) state.activeCategories.delete(label);
  else state.activeCategories.add(label);
  renderLegendState();
  renderGrid();
}

function renderLegendState(){
  [...legendEl.children].forEach(btn => {
    const active = state.activeCategories.has(btn.dataset.label);
    btn.classList.toggle("active", active);
    btn.classList.toggle("dimmed", state.activeCategories.size > 0 && !active);
  });
}

// ---- grid ----
function matchesFilter(e){
  const q = state.query.trim().toLowerCase();
  const matchesQuery = !q ||
    e.name.toLowerCase().includes(q) ||
    e.symbol.toLowerCase().includes(q) ||
    String(e.number) === q;
  const label = categoryMeta(e.category).label;
  const matchesCategory = state.activeCategories.size === 0 || state.activeCategories.has(label);
  return matchesQuery && matchesCategory;
}

function buildGrid(){
  els.innerHTML = "";
  // main table occupies rows 1-7 (period), cols 1-18 (group) using xpos/ypos
  // lanthanides/actinides get a spacer row then their own rows (ypos 9,10 in this dataset -> we remap)
  const maxYpos = Math.max(...ELEMENTS.map(e => e.ypos));
  const totalRows = maxYpos + 1; // +1 for spacer row between period 7 and lanthanide row
  els.style.gridTemplateRows = `repeat(${totalRows}, minmax(46px, 1fr))`;

  ELEMENTS.forEach(e => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.style.setProperty("--cat-color", catColorVar(e.category));
    let row = e.ypos;
    if (e.ypos >= 8) row = e.ypos + 1; // push lanthanide/actinide rows down past spacer
    cell.style.gridColumn = String(e.xpos);
    cell.style.gridRow = String(row);
    cell.dataset.number = e.number;
    cell.dataset.phase = e.phase || "Unknown";
    cell.setAttribute("aria-label", `${e.name}, atomic number ${e.number}`);
    cell.innerHTML = `
      <span class="num">${e.number}</span>
      <span class="phase-dot" data-phase="${e.phase || ''}"></span>
      <span class="sym">${e.symbol}</span>
      <span class="name">${e.name}</span>
      <span class="mass">${e.atomic_mass ? e.atomic_mass.toFixed(2) : '—'}</span>
    `;
    cell.addEventListener("click", () => openPanel(e.number));
    els.appendChild(cell);
  });

  // Ln/Ac row labels, placed at col 3 on their rows, pointing convention
  const lnRow = ELEMENTS.find(e => e.category.toLowerCase().includes("lanthanide")).ypos + 1;
  const acRow = ELEMENTS.find(e => e.category.toLowerCase().includes("actinide")).ypos + 1;
  addRowLabel(lnRow, "57–71");
  addRowLabel(acRow, "89–103");

  renderGrid();
}

function addRowLabel(row, text){
  const label = document.createElement("div");
  label.className = "lan-act-label";
  label.style.gridColumn = "3";
  label.style.gridRow = String(row);
  label.textContent = text;
  els.appendChild(label);
}

function renderGrid(){
  let visibleCount = 0;
  [...els.querySelectorAll(".cell")].forEach(cell => {
    const num = Number(cell.dataset.number);
    const e = ELEMENTS.find(x => x.number === num);
    const show = matchesFilter(e);
    cell.classList.toggle("dimmed", !show);
    cell.classList.toggle("selected", state.selectedNumber === num);
    if (show) visibleCount++;
  });
  let noRes = els.querySelector(".no-results");
  if (visibleCount === 0 && !noRes){
    els.appendChild(noResultsTpl.content.cloneNode(true));
  } else if (visibleCount > 0 && noRes){
    noRes.remove();
  }
}

// ---- detail panel ----
function shellSVG(shells){
  if (!shells || !shells.length) return "";
  const size = 150;
  const cx = size/2, cy = size/2;
  const maxR = 66;
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--util)" />`;
  shells.forEach((count, i) => {
    const r = 16 + i * ((maxR-16) / Math.max(1, shells.length-1));
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--line)" stroke-width="1"/>`;
    for (let k=0; k<count; k++){
      const angle = (k / count) * Math.PI * 2 + i * 0.4;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="var(--text-hi)"/>`;
    }
  });
  svg += `</svg>`;
  return svg;
}

function spectrumHTML(e){
  // Deterministic pseudo-emission-line pattern seeded by atomic number + electronegativity.
  const meta = categoryMeta(e.category);
  let seed = e.number * 2654435761 % 2147483647;
  function rand(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  const lineCount = 14 + (e.number % 10);
  let html = "";
  for (let i=0; i<lineCount; i++){
    const w = 1 + Math.floor(rand()*4);
    const bright = 0.25 + rand()*0.75;
    html += `<span style="width:${w}px; background:var(${meta.varName}); opacity:${bright.toFixed(2)}"></span>`;
  }
  return html;
}

function formatConfig(config){
  if (!config) return "—";
  return config.replace(/(\d+)([spdf])(\d+)/g, (m, n, l, sup) => `${n}${l}<span class="sup">${sup}</span>`);
}

function renderPanel(e){
  const meta = categoryMeta(e.category);
  document.getElementById("panel-body").innerHTML = `
    <div class="panel-hero">
      <div class="hero-symbol-row">
        <div class="hero-symbol" style="--cat-color:var(${meta.varName})">${e.symbol}</div>
        <div class="hero-names">
          <span class="hero-num">Element ${e.number}</span>
          <span class="hero-name">${e.name}</span>
          <span class="hero-category" style="--cat-color:var(${meta.varName})">${meta.label}</span>
        </div>
      </div>
      <div class="spectrum">${spectrumHTML(e)}</div>
      <div class="spectrum-label">Simulated spectral fingerprint</div>
    </div>

    <div class="panel-summary">${e.summary ? e.summary.replace(/\(\/[^)]*\/\)\s*/g, '') : ''}</div>

    <div class="panel-section">
      <h3>Physical properties</h3>
      <div class="prop-grid">
        <div class="prop"><span class="k">Atomic mass</span><span class="v">${fmt(e.atomic_mass)} u</span></div>
        <div class="prop"><span class="k">Phase (STP)</span><span class="v">${e.phase || '—'}</span></div>
        <div class="prop"><span class="k">Density</span><span class="v">${fmt(e.density)} g/cm³</span></div>
        <div class="prop"><span class="k">Appearance</span><span class="v" style="text-transform:capitalize">${e.appearance || '—'}</span></div>
        <div class="prop"><span class="k">Melting point</span><span class="v">${fmtK(e.melt)}</span></div>
        <div class="prop"><span class="k">Boiling point</span><span class="v">${fmtK(e.boil)}</span></div>
        <div class="prop"><span class="k">Molar heat</span><span class="v">${fmt(e.molar_heat)} J/(mol·K)</span></div>
        <div class="prop"><span class="k">Block / period / group</span><span class="v">${e.block || '—'} · P${e.period || '—'} · G${e.group || '—'}</span></div>
      </div>
    </div>

    <div class="panel-section">
      <h3>Electron structure</h3>
      <div class="shell-diagram">${shellSVG(e.shells)}</div>
      <div class="config-box">${formatConfig(e.electron_configuration)}</div>
      <div class="prop-grid" style="margin-top:14px;">
        <div class="prop"><span class="k">Shells</span><span class="v">${(e.shells||[]).join(', ') || '—'}</span></div>
        <div class="prop"><span class="k">Electronegativity (Pauling)</span><span class="v">${fmt(e.electronegativity_pauling)}</span></div>
        <div class="prop"><span class="k">Electron affinity</span><span class="v">${fmt(e.electron_affinity)} kJ/mol</span></div>
        <div class="prop"><span class="k">1st ionization energy</span><span class="v">${e.ionization_energies && e.ionization_energies[0] ? fmt(e.ionization_energies[0]) + ' kJ/mol' : '—'}</span></div>
      </div>
    </div>

    <div class="panel-section">
      <h3>Reacts with</h3>
      ${e.reacts_with && e.reacts_with.length
        ? `<div class="chip-row">${e.reacts_with.map(r => `<span class="chip">${r}</span>`).join('')}</div>`
        : `<p class="empty-note">No significant reactivity documented — ${e.reactivity_note.toLowerCase().includes('inert') ? 'this element is chemically inert.' : 'too little bulk material has been studied.'}</p>`}
      <p class="reactivity-note" style="margin-top:12px;">${e.reactivity_note}</p>
    </div>

    <div class="panel-section">
      <h3>Common compounds</h3>
      ${e.compounds && e.compounds.length
        ? `<div class="compound-list">${e.compounds.map(c => `
            <div class="compound">
              <span class="f" style="--cat-color:var(${meta.varName})">${c.f}</span>
              <span class="n">${c.n}</span>
            </div>`).join('')}</div>`
        : `<p class="empty-note">No well-characterized compounds documented.</p>`}
    </div>

    <div class="panel-section">
      <h3>Discovery</h3>
      <div class="prop-grid">
        <div class="prop"><span class="k">Discovered by</span><span class="v" style="font-family:var(--font-body); font-size:13px;">${e.discovered_by || 'Unknown'}</span></div>
        <div class="prop"><span class="k">Named by</span><span class="v" style="font-family:var(--font-body); font-size:13px;">${e.named_by || 'Unknown'}</span></div>
      </div>
    </div>

    <div class="panel-footer">Data compiled from public chemical reference sources. Reactivity notes are simplified summaries, not a complete reaction inventory.</div>
  `;
}

function fmt(n){
  if (n === null || n === undefined) return "—";
  return typeof n === "number" ? (Number.isInteger(n) ? n : n.toFixed(3).replace(/0+$/,'').replace(/\.$/,'')) : n;
}
function fmtK(n){
  if (n === null || n === undefined) return "—";
  return `${n.toFixed(2)} K (${(n-273.15).toFixed(0)} °C)`;
}

function openPanel(number){
  state.selectedNumber = number;
  const e = ELEMENTS.find(x => x.number === number);
  if (!e) return;
  renderPanel(e);
  panel.classList.add("open");
  scrim.classList.add("open");
  updateNavButtons();
  renderGrid();
  const cell = els.querySelector(`.cell[data-number="${number}"]`);
  if (cell) cell.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
}

function closePanel(){
  panel.classList.remove("open");
  scrim.classList.remove("open");
  state.selectedNumber = null;
  renderGrid();
}

function updateNavButtons(){
  const prevBtn = document.getElementById("panel-prev");
  const nextBtn = document.getElementById("panel-next");
  prevBtn.disabled = state.selectedNumber <= 1;
  nextBtn.disabled = state.selectedNumber >= ELEMENTS.length;
}

document.getElementById("panel-prev").addEventListener("click", () => {
  if (state.selectedNumber > 1) openPanel(state.selectedNumber - 1);
});
document.getElementById("panel-next").addEventListener("click", () => {
  if (state.selectedNumber < ELEMENTS.length) openPanel(state.selectedNumber + 1);
});
document.getElementById("panel-close").addEventListener("click", closePanel);
scrim.addEventListener("click", closePanel);

document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") closePanel();
  if (panel.classList.contains("open")){
    if (ev.key === "ArrowRight" && state.selectedNumber < ELEMENTS.length) openPanel(state.selectedNumber + 1);
    if (ev.key === "ArrowLeft" && state.selectedNumber > 1) openPanel(state.selectedNumber - 1);
  }
});

// ---- search ----
searchInput.addEventListener("input", (ev) => {
  state.query = ev.target.value;
  renderGrid();
});

// ---- view toggle (color by category vs phase) ----
document.querySelectorAll(".view-toggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view-toggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.body.classList.toggle("view-phase", btn.dataset.view === "phase");
  });
});

// ---- init ----
buildLegend();
buildGrid();
