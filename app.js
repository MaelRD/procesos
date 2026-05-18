// ── Icons ──────────────────────────────────────────────────────────────────
const I = {
  play: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  clock: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  layers: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  arrow: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  back: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>`,
  search: (s = 15) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  check: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  spark: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2z"/></svg>`,
  x: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  present: (s = 14) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
};

// ── State ──────────────────────────────────────────────────────────────────
let state = {
  page: "home",
  dept: null,
  guide: null,
  filter: "all",
  presentStep: 0,
};
let presentGuideId = null;

function setState(patch) {
  Object.assign(state, patch);
  render();
}
function navigate(page, extra = {}) {
  setState({ page, ...extra });
  window.scrollTo(0, 0);
}

function getDept(id) {
  return DEPARTMENTS.find((d) => d.id === id) || { id: 'unknown', name: 'General', hue: 200, count: 0, lead: '' };
}

// ── Render ─────────────────────────────────────────────────────────────────
// Esta función principal controla qué página se muestra y actualiza la UI
function render() {
  // Quitar la clase "active" de todas las páginas y botones de navegación
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
    
  if (state.page === "home") {
    // Mostrar la página de inicio
    document.getElementById("page-home").classList.add("active");
    // Resaltar el botón correcto en la barra de navegación superior
    if (state.dept) {
      const btn = document.getElementById("nav-" + state.dept);
      if (btn) btn.classList.add("active");
    } else {
      document.getElementById("nav-home").classList.add("active");
    }
    renderHome(); // Dibujar el contenido de la página de inicio
  } else if (state.page === "guide") {
    // Mostrar la página de la guía detallada
    document.getElementById("page-guide").classList.add("active");
    renderGuide(); // Dibujar el contenido de la guía
  }
  updateProgressBar();
}

function updateProgressBar() {
  const wrap = document.getElementById("progress-bar-wrap");
  const bar = document.getElementById("top-progress");
  if (!wrap || !bar) return;
  if (state.page === "guide" && state.guide) {
    const g = GUIDES.find((x) => x.id === state.guide);
    const total = Math.min(g.steps, getStepsForGuide(g.id).length);
    const prog = getGuideProgress(state.guide);
    bar.style.width = (prog / total) * 100 + "%";
    wrap.style.display = "block";
  } else {
    wrap.style.display = "none";
  }
}

// ── HOME ───────────────────────────────────────────────────────────────────
// Genera dinámicamente el contenido de la página de inicio (Hero, Departamentos, Guías)
function renderHome() {
  const activeDept = state.dept;
  // Filtramos la lista global de guías según el departamento seleccionado
  let guides = activeDept
    ? GUIDES.filter((g) => g.dept === activeDept)
    : GUIDES;
  // Si hay filtro por video, aplicamos este segundo filtro
  if (state.filter === "video") guides = guides.filter((g) => g.video);
  
  // Determinamos cuál guía mostrar en la sección "Hero" principal
  const featured = guides.find((g) => g.badge) || guides[0];

  // Actualizar el contador de guías visual
  const countBadge = document.getElementById("guides-count-badge");
  if (countBadge) countBadge.textContent = guides.length;

  // Hero: Dibujamos el bloque principal superior
  const heroWrap = document.getElementById("hero-wrap");
  if (featured) {
    const fdept = getDept(featured.dept);
    heroWrap.innerHTML = `
      <div class="hero">
        <div class="hero-bg">
          <div class="hero-gradient" style="background:linear-gradient(135deg,${deptColor(fdept.hue, 25)},${deptColor(fdept.hue, 46)})"></div>
          <div class="hero-overlay"></div>
        </div>
        <div style="max-width:1280px;margin:0 auto;padding:0 24px">
          <div class="hero-content">
            <div class="hero-badge">${I.spark(11)}&nbsp;${featured.badge || "Destacada"} · ${fdept.name}</div>
            <h1 class="hero-title serif">${featured.title}</h1>
            <p class="hero-excerpt">${featured.excerpt}</p>
            <div class="hero-meta">
              <button class="btn-primary" onclick="navigate('guide',{guide:'${featured.id}'})">Abrir guía &nbsp;${I.arrow(14)}</button>
              <div class="meta-chips">
                <span class="meta-chip">${I.layers(13)}&nbsp;${featured.steps} pasos</span>
                <span class="meta-chip">${I.clock(13)}&nbsp;${featured.minutes} min</span>
                ${featured.video ? `<span class="meta-chip">${I.play(12)}&nbsp;Video</span>` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>`;
  } else {
    // Estado vacío seguro por si un departamento no tiene ninguna guía
    heroWrap.innerHTML = `
      <div class="hero" style="min-height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 0 0 20px 20px; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--bdr);">
        <div style="text-align: center; color: var(--txt3);">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;">${I.search(32)}</div>
          <div style="font-size: 15px;">No hay guías para este filtro.</div>
        </div>
      </div>`;
  }

  // Departments
  document.getElementById("depts-wrap").innerHTML = `
    <div class="section-header">
      <h2 class="section-title serif">Departamentos</h2>
      <span class="section-sub mono">${DEPARTMENTS.length} departamentos · ${GUIDES.length} guías</span>
    </div>
    <div class="dept-grid">${DEPARTMENTS.map((d) => {
      const active = state.dept === d.id;
      return `<div class="dept-card" onclick="setState({dept:'${d.id}',filter:'all'})" style="outline:${active ? "2px solid var(--acc)" : "none"}">
        <div class="dept-card-glow" style="background:radial-gradient(circle at top right,${deptTint(d.hue, 0.28)},transparent 60%)"></div>
        <div class="dept-card-inner">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div class="dept-icon-wrap" style="background:${deptTint(d.hue, 0.22)};border:1px solid ${deptTint(d.hue, 0.4)};color:${deptColor(d.hue, 75)}">${d.name[0]}</div>
            <span class="mono" style="font-size:11px;color:var(--txt3)">${String(d.count).padStart(2, "0")}</span>
          </div>
          <div class="dept-name serif">${d.name}</div>
          <div class="dept-lead">${d.lead}</div>
        </div>
      </div>`;
    }).join("")}</div>`;

  if (activeDept) {
    const clearBtn = `<button onclick="setState({dept:null})" style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid var(--bdr2);font-size:12.5px;color:var(--txt2);margin-bottom:16px">${I.x(11)}&nbsp;Limpiar filtro</button>`;
    document.getElementById("dept-clear").innerHTML = clearBtn;
  } else {
    document.getElementById("dept-clear").innerHTML = "";
  }

  // Guide cards: Dibujamos todas las guías en la cuadrícula inferior (incluyendo la destacada)
  const others = featured ? guides.slice(0, 8) : [];
  document.getElementById("guides-grid").innerHTML = others.length
    ? others
        .map((g) => {
          const d = getDept(g.dept);
          const prog = getGuideProgress(g.id);
          const total = Math.min(g.steps, getStepsForGuide(g.id).length);
          const pct = Math.round((prog / total) * 100);
          return `<div class="guide-card" onclick="navigate('guide',{guide:'${g.id}'})">
      <div class="guide-thumb" style="background:linear-gradient(135deg,${deptColor(d.hue, 28)},${deptColor(d.hue, 48)})">
        <div class="guide-thumb-dept">${d.name}</div>
        ${g.badge ? `<div class="guide-thumb-badge">${g.badge}</div>` : ""}
        ${g.video ? `<div class="guide-thumb-video">${I.play(11)}&nbsp;Video</div>` : ""}
        ${pct > 0 ? `<div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(0,0,0,.3)"><div style="height:100%;width:${pct}%;background:var(--acc)"></div></div>` : ""}
      </div>
      <div class="guide-body">
        <div class="guide-title serif">${g.title}</div>
        <div class="guide-excerpt">${g.excerpt}</div>
      </div>
      <div class="guide-foot">
        <span style="display:inline-flex;align-items:center;gap:5px">${I.clock(11)}&nbsp;${g.updated}</span>
        <span class="guide-foot-tag">${I.layers(10)}&nbsp;${g.steps} pasos</span>
      </div>
    </div>`;
        })
        .join("")
    : `<div style="grid-column:1/-1;padding:32px;text-align:center;color:var(--txt3)">Sin guías para este filtro.</div>`;

  // Filters
  document.getElementById("filter-row").innerHTML = [
    ["all", "Todas"],
    ["video", "Con video"],
  ]
    .map(
      ([k, l]) =>
        `<button class="filter-btn${state.filter === k ? " active" : ""}" onclick="setState({filter:'${k}'})">${l}</button>`,
    )
    .join("");

  // Sidebar
  document.getElementById("sidebar-content").innerHTML = `
    <div class="sidebar-sticky">
      <div class="sidebar-section">
        <div class="sidebar-title">
          <div class="sidebar-dot"></div>
          <h3 class="sidebar-h serif">Novedades</h3>
          <span class="sidebar-meta mono">últimas 2 sem.</span>
        </div>
        <div class="timeline">${RECENT.map((r) => {
          const d = getDept(r.dept);
          const isNew = r.type === "new";
          return `<div class="timeline-item">
            <div class="timeline-dot" style="border-color:${isNew ? "var(--acc)" : deptColor(d.hue, 60)}">${isNew ? '<div style="width:5px;height:5px;border-radius:50%;background:var(--acc)"></div>' : ""}</div>
            <div class="timeline-label">
              <span class="timeline-type" style="color:${isNew ? "var(--acc2)" : "var(--txt3)"}">${isNew ? "NUEVA" : "ACTUALIZADA"}</span>
              <span class="timeline-dept">· ${d.name}</span>
            </div>
            <div class="timeline-title">${r.title}</div>
            <div class="timeline-who">${r.who} · ${r.when}</div>
          </div>`;
        }).join("")}</div>
      </div>
    </div>`;
}

// ── GUIDE DETAIL ───────────────────────────────────────────────────────────
function renderGuide() {
  const guide = GUIDES.find((g) => g.id === state.guide);
  if (!guide) {
    navigate("home");
    return;
  }
  const dept = getDept(guide.dept);
  const steps = getStepsForGuide(guide.id).slice(0, guide.steps);
  const prog = getGuideProgress(guide.id);

  document.getElementById("guide-hero").innerHTML = `
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,${deptColor(dept.hue, 26)},${deptColor(dept.hue, 46)})"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,11,15,.96) 30%,transparent)"></div>
    <div class="guide-hero-content">
      <button class="back-btn" onclick="navigate('home')">${I.back(11)}&nbsp;Volver</button>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span style="padding:4px 12px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.25);border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">${dept.name}</span>
        <span style="font-size:12px;color:rgba(255,255,255,.55)">· ${guide.updated}</span>
      </div>
      <h1 class="serif" style="font-size:40px;font-weight:800;line-height:1.1;letter-spacing:-.5px;color:#fff;max-width:800px;margin-bottom:16px">${guide.title}</h1>
      <p style="font-size:15px;color:rgba(255,255,255,.72);line-height:1.65;max-width:660px;margin-bottom:24px">${guide.excerpt}</p>
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
        <div style="display:inline-flex;align-items:center;gap:14px;color:rgba(255,255,255,.6);font-size:12.5px">
          <span style="display:inline-flex;align-items:center;gap:5px">${I.layers(13)}&nbsp;${guide.steps} pasos</span>
          <span style="display:inline-flex;align-items:center;gap:5px">${I.clock(13)}&nbsp;${guide.minutes} min</span>
          ${guide.video ? `<span style="display:inline-flex;align-items:center;gap:5px">${I.play(12)}&nbsp;Video</span>` : ""}
        </div>
        <button class="btn-ghost" onclick="startPresent('${guide.id}')" style="margin-left:auto">${I.present(13)}&nbsp;Presentar</button>
      </div>
    </div>`;

  // TOC
  document.getElementById("guide-toc").innerHTML = `
    <div class="toc-card">
      <div class="toc-progress-label mono">PROGRESO</div>
      <div class="toc-progress-nums">
        <span class="toc-progress-big serif" id="toc-prog-num">${prog}</span>
        <span class="toc-progress-of">/ ${steps.length} pasos</span>
      </div>
      <div class="progress-track"><div class="progress-fill" id="toc-prog-bar" style="width:${(prog / steps.length) * 100}%"></div></div>
    </div>
    <div class="toc-nav-section mono">EN ESTA GUÍA</div>
    <nav class="toc-nav">${steps
      .map((s, i) => {
        const done = i < prog;
        const active = i === prog;
        return `<div class="toc-link ${done ? "done" : active ? "active" : "pending"}" onclick="scrollToStep(${i})">
        <div class="toc-step-circle" style="background:${done ? "var(--acc)" : "transparent"};border:${done ? "none" : "1.5px solid " + (active ? "var(--acc2)" : "var(--bdr2)")};color:#fff">
          ${done ? I.check(10) : `<span style="font-size:9px;font-weight:700;color:${active ? "var(--acc2)" : "var(--txt3)"}">${s.n}</span>`}
        </div>
        <span style="line-height:1.3;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden">${s.title}</span>
      </div>`;
      })
      .join("")}</nav>`;

  // Steps
  const remaining = steps.length - prog;
  document.getElementById("guide-steps").innerHTML =
    steps
      .map((s, i) => {
        const done = i < prog;
        return `<div class="step-item fade-in" id="step-${i}" style="animation-delay:${i * 0.04}s">
      <div class="step-num-wrap">
        <div class="step-num serif" style="color:${done ? "var(--acc2)" : "var(--txt3)"};opacity:${done ? 1 : 0.45}">${String(s.n).padStart(2, "0")}</div>
        <div class="step-num-label mono">PASO</div>
      </div>
      <div class="step-content">
        <div class="step-title-row">
          <h3 class="step-h serif">${s.title}</h3>
          ${done ? `<span class="step-done-badge">${I.check(9)}&nbsp;Completado</span>` : ""}
        </div>
        <p class="step-body">${s.body}</p>
        <div class="step-img-wrap">
          ${s.img
            ? `<img src="${s.img}" alt="${s.title}" class="step-img" loading="lazy">`
            : `<div class="step-img-placeholder">Captura de pantalla · paso ${s.n}</div>`}
        </div>
        ${!done ? `<button class="step-complete-btn" onclick="completeStep(${i})">${I.check(13)}&nbsp;Marcar como completado</button>` : ""}
      </div>
    </div>`;
      })
      .join("") +
    (remaining > 0
      ? `
    <div class="continue-card">
      <div style="flex:1">
        <div class="continue-label">CONTINUAR</div>
        <div class="continue-title serif">Quedan ${remaining} paso${remaining !== 1 ? "s" : ""} más</div>
        <div class="continue-sub">Sigue avanzando para completar esta guía.</div>
      </div>
      <button class="btn-accent" onclick="completeStep(${prog})">${I.arrow(13)}&nbsp;Siguiente paso</button>
    </div>`
      : `<div style="padding:32px;text-align:center;color:var(--acc2);font-size:15px;font-weight:600">${I.check(18)}&nbsp; ¡Guía completada!</div>`);
}

function completeStep(i) {
  const guide = GUIDES.find((g) => g.id === state.guide);
  if (!guide) return;
  const guideSteps = getStepsForGuide(guide.id);
  const next = Math.min(i + 1, Math.min(guide.steps, guideSteps.length));
  setProgress(state.guide, next);
  renderGuide();
  updateProgressBar();
  setTimeout(() => scrollToStep(Math.min(next, guideSteps.length - 1)), 120);
}

function scrollToStep(i) {
  const el = document.getElementById("step-" + i);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── PRESENT MODE ───────────────────────────────────────────────────────────
function startPresent(guideId) {
  presentGuideId = guideId;
  state.presentStep = getGuideProgress(guideId) || 0;
  document.getElementById("present-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
  renderPresent();
}

function closePresent() {
  document.getElementById("present-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

function presentNav(dir) {
  const guide = GUIDES.find((g) => g.id === presentGuideId);
  if (!guide) return;
  const max = Math.min(guide.steps, getStepsForGuide(presentGuideId).length) - 1;
  state.presentStep = Math.max(0, Math.min(max, state.presentStep + dir));
  renderPresent();
}

function renderPresent() {
  const guide = GUIDES.find((g) => g.id === presentGuideId);
  if (!guide) return;
  const dept = getDept(guide.dept);
  const steps = getStepsForGuide(presentGuideId).slice(0, guide.steps);
  const s = steps[state.presentStep];
  const curr = state.presentStep;
  document.getElementById("present-step-num").textContent = String(
    s.n,
  ).padStart(2, "0");
  document.getElementById("present-step-label").textContent =
    `PASO ${s.n} DE ${steps.length}`;
  document.getElementById("present-step-title").textContent = s.title;
  document.getElementById("present-step-body").textContent = s.body;
  document.getElementById("present-dept").textContent = dept.name;
  document.getElementById("present-counter").textContent =
    `${String(curr + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
  document.getElementById("present-dots").innerHTML = steps
    .map(
      (_, i) =>
        `<div class="present-dot" style="background:${i < curr ? "var(--acc)" : i === curr ? "var(--acc2)" : "rgba(255,255,255,.12)"}"></div>`,
    )
    .join("");
}

// ── SEARCH ─────────────────────────────────────────────────────────────────
function openSearch() {
  document.getElementById("search-modal").classList.add("active");
  setTimeout(() => document.getElementById("search-input").focus(), 50);
}

function closeSearch() {
  document.getElementById("search-modal").classList.remove("active");
  document.getElementById("search-input").value = "";
  document.getElementById("search-results").innerHTML = "";
}

function doSearch(q) {
  const r = document.getElementById("search-results");
  if (!q.trim()) {
    r.innerHTML = "";
    return;
  }
  const results = GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(q.toLowerCase()) ||
      g.excerpt.toLowerCase().includes(q.toLowerCase()),
  );
  if (!results.length) {
    r.innerHTML = `<div class="search-empty">Sin resultados para "${q}"</div>`;
    return;
  }
  r.innerHTML = results
    .map((g) => {
      const d = getDept(g.dept);
      return `<div class="search-result-item" onclick="closeSearch();navigate('guide',{guide:'${g.id}'})">
      <div class="search-result-title">${g.title}</div>
      <div class="search-result-meta">${d.name} · ${g.steps} pasos · ${g.minutes} min</div>
    </div>`;
    })
    .join("");
}

// ── KEYBOARD ───────────────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
  if (e.key === "Escape") {
    closeSearch();
    closePresent();
  }
  if (document.getElementById("present-overlay").classList.contains("active")) {
    if (e.key === "ArrowRight") presentNav(1);
    if (e.key === "ArrowLeft") presentNav(-1);
  }
});

// ── INIT ───────────────────────────────────────────────────────────────────
render();
