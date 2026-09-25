/* ===== Tecnocopy — catálogo, configurador de proposta e interações ===== */
(() => {
  "use strict";

  const WA = "5561992716965";
  const TEL = "+5561992716965";
  const ADDRESS = "SCRN 708/709, Bloco C, Loja 36 — Asa Norte, Brasília/DF, 70741-630";
  const MAPS = "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Tecnocopy SCRN 708/709 Bloco C Loja 36 Asa Norte Brasília DF 70741-630");
  const OPEN = { from: 8, to: 18 }; // horário comercial, seg–sex

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

  /* ---------------- Ícones ---------------- */
  const I = {
    mono: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 8V5h10v3M7 16v3h10v-3" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="12" r="1.2" fill="currentColor"/></svg>',
    color: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 8V5h10v3M7 16v3h10v-3" stroke="currentColor" stroke-width="1.8"/><path d="M8 12h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    pc: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 19h6M12 15v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M4 17h16" stroke="currentColor" stroke-width="1.8"/></svg>',
    scan: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 12h16" stroke="currentColor" stroke-width="1.8"/></svg>',
    label: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 5h9l5 5v9H5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="9" cy="9" r="1.4" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-10" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.7-1.2 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.5.3 0 .2 0 .8-.2 1.5z" fill="currentColor"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 3h4l2 5-3 2a13 13 0 0 0 6 6l2-3 5 2v4a1 1 0 0 1-1 1A17 17 0 0 1 4 4a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.8"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
  };

  /* ---------------- Dados ---------------- */
  const CATS = [
    { id: "multifuncionais", label: "Multifuncionais" },
    { id: "impressoras", label: "Impressoras" },
    { id: "computadores", label: "Computadores" },
    { id: "scanners", label: "Scanners" },
    { id: "etiquetas", label: "Etiquetas e fiscais" },
  ];

  const CATALOG = [
    { id: "mfp-mono-a4", name: "Multifuncional Mono A4", cat: "multifuncionais", icon: "mono", hot: true,
      desc: "Imprime, copia e digitalha em preto e branco. Ideal para escritórios de até 10 usuários.",
      specs: ["P&B", "A4", "até 35 pág/min", "impressão frente e verso"] },
    { id: "mfp-mono-a3", name: "Multifuncional Mono A3", cat: "multifuncionais", icon: "mono", hot: true,
      desc: "Alto volume com papel A3. Para setores que imprimem plantas, planilhas e malotes.",
      specs: ["P&B", "A3", "até 45 pág/min", "alimentador automático"] },
    { id: "mfp-color-a4", name: "Multifuncional Color A4", cat: "multifuncionais", icon: "color", hot: true,
      desc: "Colorida para propostas, apresentações e material de vitrine.",
      specs: ["Colorida", "A4", "Wi-Fi e rede", "digitalização em cor"] },
    { id: "mfp-heavy", name: "Multifuncional Alto Volume", cat: "multifuncionais", icon: "mono",
      desc: "Projetada para centenas de impressões por dia, com bandejas extras.",
      specs: ["P&B", "A3", "acima de 60 pág/min", "2 bandejas + bypass"] },
    { id: "imp-mono-desk", name: "Impressora Mono Desktop", cat: "impressoras", icon: "mono",
      desc: "Compacta para um posto de trabalho ou sala de apoio.",
      specs: ["P&B", "A4", "USB e rede", "toner de baixo custo"] },
    { id: "imp-color-photo", name: "Impressora Colorida Foto", cat: "impressoras", icon: "color",
      desc: "Acabamento fino para fotos, cardápios e materiais de marketing.",
      specs: ["Colorida", "A4 e foto", "tanque de tinta", "Wi-Fi"] },
    { id: "imp-thermal", name: "Impressora Térmica Não Fiscal", cat: "impressoras", icon: "label",
      desc: "Comprovantes e etiquetas de entrega sem uso de tinta.",
      specs: ["Térmica", "80 mm", "sem consumo de toner"] },
    { id: "desk-win", name: "Desktop Windows", cat: "computadores", icon: "pc", hot: true,
      desc: "Estação de trabalho para rotina de escritório, pacote Office e sistemas web.",
      specs: ["SSD", "8 GB RAM", "Windows 11 Pro", "monitor opcional"] },
    { id: "desk-power", name: "Desktop de Desempenho", cat: "computadores", icon: "pc",
      desc: "Para CAD, planilhas pesadas, edição e múltiplos sistemas abertos.",
      specs: ["SSD NVMe", "16–32 GB RAM", "placa de vídeo", "Windows 11 Pro"] },
    { id: "notebook", name: "Notebook Corporativo", cat: "computadores", icon: "note", hot: true,
      desc: "Mobilidade para equipes externas, home office e atendimento em campo.",
      specs: ["SSD", "8–16 GB RAM", "14 polegadas", "Windows 11 Pro"] },
    { id: "all-in-one", name: "All-in-One", cat: "computadores", icon: "pc",
      desc: "Computador e monitor integrados, ocupa pouco espaço no balcão.",
      specs: ["24 polegadas", "SSD", "touch opcional"] },
    { id: "scan-flat", name: "Scanner Flatbed", cat: "scanners", icon: "scan",
      desc: "Digitalização de documentos frágeis, livros e documentos de identidade.",
      specs: ["A4", "600 dpi", "OCR incluso"] },
    { id: "scan-feeder", name: "Scanner de Produção", cat: "scanners", icon: "scan",
      desc: "Grandes volumes com alimentador automático — digitalização de acervo.",
      specs: ["A4/A3", "duplex", "até 60 folhas", "OCR incluso"] },
    { id: "lbl-termica", name: "Impressora de Etiquetas", cat: "etiquetas", icon: "label",
      desc: "Etiquetas de produto, expedição e patrimônio em rolo.",
      specs: ["Térmica", "4 a 6 polegadas", "uso industrial"] },
    { id: "lbl-eco", name: "Etiquetas e Ribbons", cat: "etiquetas", icon: "label",
      desc: "Consumíveis dimensionados para o seu volume de expedição.",
      specs: ["Branca e térmica", "diversos tamanhos", "ribbon cera/resina"] },
    { id: "ecf", name: "Equipamento Fiscal (ECF)", cat: "etiquetas", icon: "label",
      desc: "Emissão de cupom fiscal para varejo e food service.",
      specs: ["SAT / MF-e", "porta bobina", "suporte a TEF"] },
  ];

  const NEEDS = [
    { cat: "multifuncionais", icon: "mono", title: "Multifuncionais", desc: "Impressão, cópia e digitalização no mesmo equipamento." },
    { cat: "impressoras", icon: "color", title: "Impressoras", desc: "P&B, coloridas e térmicas para cada tipo de documento." },
    { cat: "computadores", icon: "pc", title: "Computadores", desc: "Desktops, all-in-ones e notebooks para a equipe." },
    { cat: "etiquetas", icon: "label", title: "Etiquetas e fiscal", desc: "Etiquetas de expedição, patrimônio e cupom fiscal." },
  ];

  const TERMS = [
    { id: "12", months: 12, label: "12 meses", note: "contrato anual" },
    { id: "24", months: 24, label: "24 meses", note: "o mais escolhido" },
    { id: "36", months: 36, label: "36 meses", note: "melhor condição" },
  ];

  const SVCS = [
    { id: "suprimentos", label: "Toners e insumos", desc: "Reposição prevista em contrato (exceto papel)." },
    { id: "manutencao", label: "Manutenção completa", desc: "Preventiva e corretiva sem custo de visita ou peça." },
    { id: "suporte", label: "Suporte técnico", desc: "Chamados por telefone e WhatsApp no horário comercial." },
    { id: "reserva", label: "Equipamento reserva", desc: "Substituição rápida em caso de defeito persistente." },
    { id: "instalacao", label: "Instalação e rede", desc: "Entrega, instalação e configuração em rede incluídas." },
    { id: "relatorio", label: "Relatório de uso", desc: "Acompanhamento mensal de volume e custos." },
  ];
  const SVC_DEFAULT = ["suprimentos", "manutencao", "suporte"];

  const byId = id => CATALOG.find(c => c.id === id);
  const catLabel = id => (CATS.find(c => c.id === id) || {}).label || id;

  /* ---------------- Estado ---------------- */
  const state = {
    q: "",
    cat: "todos",
    picked: [],
    qtys: {},
    term: "24",
    svcs: [...SVC_DEFAULT],
  };
  const MAX_QTY = 30;
  const qtyOf = id => state.qtys[id] || 1;

  /* ---------------- Equipamentos: famílias ---------------- */
  const needGrid = $("#needGrid");
  if (needGrid) {
    needGrid.innerHTML = NEEDS.map(n => `
      <button class="need reveal" type="button" data-cat="${n.cat}">
        <span class="ico">${I[n.icon]}</span>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.desc)}</p>
        <span class="go">Ver modelos →</span>
      </button>`).join("");
    needGrid.addEventListener("click", e => {
      const btn = e.target.closest(".need");
      if (!btn) return;
      setCat(btn.dataset.cat);
      $("#catalogGrid")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------------- Catálogo: busca + filtro ---------------- */
  const catalogGrid = $("#catalogGrid"), catalogEmpty = $("#catalogEmpty");
  const chips = $("#catalogChips");

  if (chips) {
    chips.innerHTML = [{ id: "todos", label: "Todos" }, ...CATS]
      .map(c => `<button class="chip${c.id === state.cat ? " is-on" : ""}" type="button" data-cat="${c.id}">${esc(c.label)}</button>`)
      .join("");
    chips.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (b) setCat(b.dataset.cat);
    });
  }

  function setCat(cat) {
    state.cat = cat;
    $$(".chip", chips).forEach(c => c.classList.toggle("is-on", c.dataset.cat === cat));
    renderCatalog();
  }

  function matches(item) {
    if (state.cat !== "todos" && item.cat !== state.cat) return false;
    const q = state.q.trim().toLowerCase();
    if (!q) return true;
    return (item.name + " " + item.desc + " " + item.specs.join(" ") + " " + catLabel(item.cat))
      .toLowerCase().includes(q);
  }

  function renderCatalog() {
    if (!catalogGrid) return;
    const list = CATALOG.filter(matches);
    catalogGrid.innerHTML = list.map(it => {
      const on = state.picked.includes(it.id);
      return `<article class="card" data-id="${it.id}">
        <div class="card-top"><h3>${esc(it.name)}</h3><span class="tag">${esc(catLabel(it.cat))}</span></div>
        <p>${esc(it.desc)}</p>
        <ul>${it.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
        <button class="card-add${on ? " is-on" : ""}" type="button" data-add="${it.id}">
          ${on ? I.check + "Na proposta" : I.plus + "Adicionar à proposta"}
        </button>
      </article>`;
    }).join("");
    if (catalogEmpty) catalogEmpty.hidden = list.length > 0;
  }

  $("#catalogSearch")?.addEventListener("input", e => {
    state.q = e.target.value;
    renderCatalog();
  });

  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add) toggleItem(add.dataset.add);
  });

  function toggleItem(id) {
    if (!byId(id)) return;
    if (state.picked.includes(id)) {
      state.picked = state.picked.filter(x => x !== id);
      delete state.qtys[id];
    } else {
      state.picked.push(id);
      state.qtys[id] = 1;
      toast(`${byId(id).name} adicionado à proposta`);
    }
    syncAll();
  }

  /* ---------------- Passo 1: escolha rápida + quantidades ---------------- */
  const pickEquip = $("#pickEquip"), qtyList = $("#qtyList");

  if (pickEquip) {
    pickEquip.innerHTML = CATALOG.filter(c => c.hot).map(c =>
      `<button type="button" data-add="${c.id}"><span>${esc(c.name)}</span></button>`).join("");
  }

  function renderQtys() {
    if (!qtyList) return;
    if (!state.picked.length) {
      qtyList.innerHTML = `<p class="qty-none">Nenhum equipamento escolhido ainda. Use as opções acima ou o catálogo.</p>`;
      return;
    }
    qtyList.innerHTML = state.picked.map(id => {
      const it = byId(id);
      return `<div class="qty" data-id="${id}">
        <div>
          <span class="qty-name">${esc(it.name)}</span>
          <span class="qty-sub">${esc(catLabel(it.cat))} · ${it.specs[0]}</span>
        </div>
        <div class="qty-ctrl">
          <button type="button" data-step="-1" aria-label="Diminuir unidades de ${esc(it.name)}">−</button>
          <output>${qtyOf(id)}</output>
          <button type="button" data-step="1" aria-label="Aumentar unidades de ${esc(it.name)}">+</button>
        </div>
        <button class="qty-rm" type="button" data-rm="${id}" aria-label="Remover ${esc(it.name)}">✕</button>
      </div>`;
    }).join("");
  }

  qtyList?.addEventListener("click", e => {
    const step = e.target.closest("[data-step]");
    const rm = e.target.closest("[data-rm]");
    if (step) {
      const id = step.closest(".qty").dataset.id;
      const next = Math.min(MAX_QTY, Math.max(1, qtyOf(id) + Number(step.dataset.step)));
      state.qtys[id] = next;
      syncAll();
    } else if (rm) {
      toggleItem(rm.dataset.rm);
    }
  });

  /* ---------------- Passo 2: prazo e serviços ---------------- */
  const termList = $("#termList"), svcList = $("#svcList");

  if (termList) {
    termList.setAttribute("role", "radiogroup");
    termList.innerHTML = TERMS.map(t => `
      <button class="term${t.id === state.term ? " is-on" : ""}" type="button" role="radio"
        aria-checked="${t.id === state.term}" data-term="${t.id}">
        <strong>${esc(t.label)}</strong><span>${esc(t.note)}</span>
      </button>`).join("");
    termList.addEventListener("click", e => {
      const b = e.target.closest("[data-term]");
      if (!b) return;
      state.term = b.dataset.term;
      $$(".term", termList).forEach(x => {
        const on = x.dataset.term === state.term;
        x.classList.toggle("is-on", on);
        x.setAttribute("aria-checked", on);
      });
      renderSummary();
    });
  }

  if (svcList) {
    svcList.innerHTML = SVCS.map(s => `
      <button class="svc${state.svcs.includes(s.id) ? " is-on" : ""}" type="button" role="checkbox"
        aria-checked="${state.svcs.includes(s.id)}" data-svc="${s.id}">
        <span class="box">${I.check}</span>
        <span><strong>${esc(s.label)}</strong><span>${esc(s.desc)}</span></span>
      </button>`).join("");
    svcList.addEventListener("click", e => {
      const b = e.target.closest("[data-svc]");
      if (!b) return;
      const id = b.dataset.svc;
      state.svcs = state.svcs.includes(id) ? state.svcs.filter(x => x !== id) : [...state.svcs, id];
      const on = state.svcs.includes(id);
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-checked", on);
      renderSummary();
    });
  }

  /* ---------------- Resumo ---------------- */
  const sumItems = $("#sumItems"), sumEmpty = $("#sumEmpty"), sumTerm = $("#sumTerm"), sumSvc = $("#sumSvc");

  function renderSummary() {
    if (!sumItems) return;
    sumItems.innerHTML = state.picked.map(id => {
      const it = byId(id);
      return `<li><b>${qtyOf(id)}× ${esc(it.name)}</b><span>${esc(catLabel(it.cat))}</span></li>`;
    }).join("");
    sumEmpty.hidden = state.picked.length > 0;
    const t = TERMS.find(x => x.id === state.term);
    sumTerm.textContent = t ? t.label : "—";
    sumSvc.textContent = state.svcs.length
      ? state.svcs.map(id => (SVCS.find(s => s.id === id) || {}).label).join(", ")
      : "—";
  }

  function syncAll() {
    renderQtys();
    renderSummary();
    $$("[data-add]").forEach(b => {
      const on = state.picked.includes(b.dataset.add);
      b.classList.toggle("is-on", on);
      if (b.classList.contains("card-add")) {
        b.innerHTML = on ? I.check + "Na proposta" : I.plus + "Adicionar à proposta";
      } else {
        const it = byId(b.dataset.add);
        if (it) b.innerHTML = `<span>${on ? "✓ " : ""}${esc(it.name)}</span>`;
      }
    });
  }

  /* ---------------- Enviar proposta ---------------- */
  function proposalText() {
    const name = ($("#qName")?.value || "").trim();
    const phone = ($("#qPhone")?.value || "").trim();
    const company = ($("#qCompany")?.value || "").trim();
    const segment = $("#qSegment")?.value || "";
    const t = TERMS.find(x => x.id === state.term);

    let m = "*Nova proposta de locação — Tecnocopy*\n\n";
    if (name || company || segment || phone) {
      m += "*Cliente*\n";
      if (company) m += `Empresa: ${company}\n`;
      if (segment) m += `Segmento: ${segment}\n`;
      if (name) m += `Contato: ${name}\n`;
      if (phone) m += `WhatsApp: ${phone}\n`;
      m += "\n";
    }
    m += "*Equipamentos*\n";
    m += state.picked.map(id => `• ${qtyOf(id)}× ${byId(id).name} (${catLabel(byId(id).cat)})`).join("\n");
    m += `\n\n*Contrato:* ${t ? t.label : "a definir"}`;
    m += "\n*Serviços inclusos*\n";
    m += state.svcs.length
      ? state.svcs.map(id => `• ${(SVCS.find(s => s.id === id) || {}).label}`).join("\n")
      : "• a definir";
    m += "\n\nAguardo o retorno com valores e condições.";
    return m;
  }

  $("#btnSendProposal")?.addEventListener("click", () => {
    if (!state.picked.length) {
      toast("Escolha ao menos um equipamento antes de enviar.");
      $("#necessidades")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const total = state.picked.reduce((s, id) => s + qtyOf(id), 0);
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(proposalText())}`, "_blank", "noopener");
    toast(`Proposta com ${total} equipamento${total > 1 ? "s" : ""} enviada ao WhatsApp`);
  });

  $("#btnResetProposal")?.addEventListener("click", () => {
    state.picked = []; state.qtys = {}; state.svcs = [...SVC_DEFAULT]; state.term = "24";
    $$(".term", termList).forEach(x => {
      const on = x.dataset.term === "24";
      x.classList.toggle("is-on", on); x.setAttribute("aria-checked", on);
    });
    $$(".svc", svcList).forEach(b => {
      const on = state.svcs.includes(b.dataset.svc);
      b.classList.toggle("is-on", on); b.setAttribute("aria-checked", on);
    });
    ["qName", "qPhone", "qCompany", "qSegment"].forEach(id => { const el = $("#" + id); if (el) el.value = ""; });
    syncAll();
    toast("Seleção limpa.");
  });

  /* ---------------- WhatsApp: modal ---------------- */
  const modal = $("#modal"), modalBody = $("#modalBody");
  const WA_MSG = {
    geral: "Olá! Gostaria de informações sobre locação de impressoras e equipamentos de TI.",
    diagnostico: "Olá! Quero agendar um diagnóstico para dimensionar a locação de equipamentos na minha empresa.",
  };

  function openModal(kind) {
    if (!modal) return;
    const msg = WA_MSG[kind] || WA_MSG.geral;
    const title = kind === "diagnostico" ? "Agendar diagnóstico" : "Falar com a Tecnocopy";
    const sub = kind === "diagnostico"
      ? "Levantamos seu volume de impressão e indicamos os equipamentos certos."
      : "Atendimento comercial de segunda a sexta, das 8:00 às 18:00.";
    modalBody.innerHTML = `
      <h3>${esc(title)}</h3>
      <p class="m-sub">${esc(sub)}</p>
      <div class="m-opts">
        <a class="m-opt is-wa" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">
          <span class="ico">${I.wa}</span><span><strong>WhatsApp</strong><span>(61) 99271-6965 — resposta no horário comercial</span></span>
        </a>
        <a class="m-opt" href="tel:${TEL}">
          <span class="ico">${I.phone}</span><span><strong>Ligar agora</strong><span>(61) 99271-6965</span></span>
        </a>
        <a class="m-opt" href="${MAPS}" target="_blank" rel="noopener">
          <span class="ico">${I.pin}</span><span><strong>Ir até a loja</strong><span>${esc(ADDRESS)}</span></span>
        </a>
      </div>`;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("in"));
    document.body.style.overflow = "hidden";
    $(".modal-x", modal)?.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove("in");
    document.body.style.overflow = "";
    setTimeout(() => { modal.hidden = true; }, 260);
  }

  $$("[data-wa]").forEach(b => b.addEventListener("click", e => {
    e.preventDefault();
    openModal(b.dataset.wa);
  }));
  modal?.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------------- Toast ---------------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
      setTimeout(() => { toastEl.hidden = true; }, 320);
    }, 2800);
  }

  /* ---------------- Horário comercial ---------------- */
  function updateHours() {
    const now = new Date();
    const day = now.getDay();
    const h = now.getHours() + now.getMinutes() / 60;
    const open = day >= 1 && day <= 5 && h >= OPEN.from && h < OPEN.to;
    const dot = $("#openDot"), label = $("#openLabel");
    if (dot) { dot.classList.toggle("is-open", open); dot.classList.toggle("is-closed", !open); }
    if (label) label.textContent = open ? "Aberto agora" : "Fechado agora";
    const ch = $("#cHours");
    if (ch) ch.innerHTML = `Seg a sex, 8:00 – 18:00<br><span style="color:${open ? "#7ee0a8" : "#ffb26b"}">${open ? "Atendendo agora" : "Resposta no próximo dia útil"}</span>`;
  }

  /* ---------------- Navegação, scroll e rodapé ---------------- */
  const burger = $("#burger"), nav = $("#nav");
  burger?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  $$("#nav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    burger?.setAttribute("aria-expanded", "false");
  }));

  const toTop = $("#toTop"), hdr = $("#hdr");
  function onScroll() {
    const y = window.scrollY;
    toTop?.classList.toggle("show", y > 700);
    hdr?.classList.toggle("is-stuck", y > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  $("#mapLink")?.setAttribute("href", MAPS);
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- Reveal ---------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------------- Init ---------------- */
  renderCatalog();
  syncAll();
  updateHours();
  setInterval(updateHours, 60000);
  onScroll();
})();
