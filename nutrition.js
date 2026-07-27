/**
 * Farma Básica — Farmaco-nutrición
 * Fuente: Huynh et al., 2024 — PLoS ONE 19(4): e0302500
 */
const PHARMACO_NUTRITION = {
  drug: {
    title: "Metformina",
    subtitle:
      "Huynh DT, Nguyen NT, Do MD (2024). Vitamin B12 deficiency in diabetic patients treated with metformin. PLoS ONE 19(4): e0302500.",
    module: "Módulo: Farmaco-nutrición",
  },

  source: {
    short: "Huynh et al., 2024",
    full:
      "Huynh DT, Nguyen NT, Do MD (2024). Vitamin B12 deficiency in diabetic patients treated with metformin. PLoS ONE 19(4): e0302500.",
    doi: "10.1371/journal.pone.0302500",
  },

  categories: [
    {
      id: "peso",
      label: "Alteración de Peso",
      hint: "Mecanismo glucémico → balance energético",
      color: "yellow",
      title: "Sitio y Mecanismo ➔ Alteración de Peso",
      cascades: [
        {
          mechanism:
            "Metformina ↓ gluconeogénesis hepática + ↑ sensibilidad a la insulina en tejidos periféricos (músculo, hígado).",
          effect:
            "→ Mejor control glucémico y menor riesgo de complicaciones crónicas de DM2.",
          cite: "Huynh et al., 2024, Introducción (mecanismo, ref. 6 Bailey CJ).",
        },
        {
          mechanism:
            "Beneficio demostrado en pacientes con sobrepeso tratados con metformina (contexto UKPDS).",
          effect:
            "→ Perfil ponderal favorable/neutro vs fármacos que promueven aumento de peso en DM2.",
          cite: "Huynh et al., 2024, Introducción (ref. 7 UKPDS 34).",
        },
        {
          mechanism:
            "En la cohorte estudiada, el BMI no difería entre pacientes con y sin deficiencia de B12 (24.1 vs 24.7 kg/m²; p=0.29).",
          effect:
            "→ La deficiencia inducida por metformina no se manifestó como cambio de peso en este estudio transversal.",
          cite: "Huynh et al., 2024, Tabla 1.",
        },
        {
          mechanism:
            "BMI no se asoció estadísticamente con deficiencia de B12 (OR 0.95; p=0.44) en regresión univariada.",
          effect:
            "→ El riesgo de deficiencia de B12 no correlaciona con el peso corporal en esta población.",
          cite: "Huynh et al., 2024, Tabla 2.",
        },
      ],
      clinicalTip:
        "Metformina: control glucémico sin ganancia ponderal típica de sulfonilureas/insulina (UKPDS, citado por Huynh). Vigilar B12 en uso prolongado aunque el peso no cambie.",
    },
    {
      id: "nutrientes",
      label: "Alteración de Nutrientes",
      hint: "Vía ileal · Vitamina B12",
      color: "teal",
      title: "Sitio y Mecanismo ➔ Alteración de Nutrientes",
      cascades: [
        {
          mechanism:
            "Metformina → ↓ secreción de factor intrínseco + inhibición de la absorción del complejo IF-B12 en íleon.",
          effect:
            "→ Menor captación de cobalamina en íleon distal; deficiencia documentada en 18.6% (B12 <300 pg/mL).",
          cite: "Huynh et al., 2024, Introducción (mecanismos propuestos, refs. 8,9); Resultados.",
        },
        {
          mechanism:
            "Metformina altera metabolismo y reabsorción de ácidos biliares en intestino.",
          effect:
            "→ Interferencia en enterohepática de cobalamina y malabsorción de vitamina B12.",
          cite: "Huynh et al., 2024, Introducción (refs. 8,9 Mazokopakis; Infante).",
        },
        {
          mechanism:
            "Metformina interfiere en la unión del complejo IF-B12 al receptor cubilina.",
          effect:
            "→ Bloqueo del paso final de absorción ileal de B12 → ↓ reservas sistémicas.",
          cite: "Huynh et al., 2024, Introducción (refs. 8,9).",
        },
        {
          mechanism:
            "Dosis > mediana (>1000 mg/día): OR 4.10; uso ≥48 meses + dosis alta: OR 5.25 para deficiencia de B12.",
          effect:
            "→ Mayor dosis y duración = mayor depleción de B12; cada +1 mg/día aumenta riesgo 0.2%.",
          cite: "Huynh et al., 2024, Resultados; Tablas 2–3; Fig. 1.",
        },
        {
          mechanism:
            "Deficiencia crónica de B12 → ↓ conversión homocisteína→metionina y ↓ metilmalonil-CoA→succinil-CoA.",
          effect:
            "→ ↑ homocisteína y ↑ ácido metilmalónico → anemia, hipoacusia, neuropatía (confundible con neuropatía diabética).",
          cite: "Huynh et al., 2024, Introducción (refs. 10,11); Discusión (ref. 30 Green).",
        },
      ],
      clinicalTip:
        "Screening anual de B12 en uso crónico de metformina (ref. 18 ADA, citada por Huynh). Alto riesgo: ≥48 meses y ≥1000 mg/día. Prevalencia en Vietnam: 18.6%.",
    },
    {
      id: "apetito",
      label: "Alteración de Apetito",
      hint: "Tolerancia · GI · Neuropatía autonómica",
      color: "coral",
      title: "Sitio y Mecanismo ➔ Alteración de Apetito",
      cascades: [
        {
          mechanism:
            "Efectos adversos de metformina (incluida deficiencia de B12) reducen la tolerancia al fármaco.",
          effect:
            "→ Hiporexia o abandono terapéutico por molestias crónicas; menor adherencia nutricional.",
          cite: "Huynh et al., 2024, Introducción.",
        },
        {
          mechanism:
            "Mecanismos propuestos de malabsorción ileal (↓ factor intrínseco, alteración de ácidos biliares) afectan función GI.",
          effect:
            "→ Saciedad precoz, molestias digestivas y reducción del apetito como efecto secundario funcional.",
          cite: "Huynh et al., 2024, Introducción (refs. 8,9); exclusión de patología GI previa en Métodos.",
        },
        {
          mechanism:
            "Deficiencia prolongada de B12 → neuropatía periférica, autonómica y cardíaca.",
          effect:
            "→ Disfunción autonómica que puede alterar señales de hambre/saciedad y ritmo de ingesta.",
          cite: "Huynh et al., 2024, Introducción (refs. 10,11); referencia 32 Bell citada en Huynh.",
        },
        {
          mechanism:
            "Neuropatía por B12 frecuentemente mal diagnosticada como neuropatía diabética periférica.",
          effect:
            "→ Paciente con síntomas sensitivos/autonómicos persistentes a pesar de control glucémico; apetito y ingesta alterados en contexto neurológico.",
          cite: "Huynh et al., 2024, Introducción; Discusión (refs. 31,32).",
        },
      ],
      clinicalTip:
        "Si hay intolerancia GI o pérdida de apetito con metformina crónica, medir B12 antes de atribuir todo a neuropatía diabética (Huynh et al., 2024).",
    },
    {
      id: "gusto",
      label: "Alteración de Gusto y Sabor",
      hint: "Neuropatía sensorial · B12",
      color: "lavender",
      title: "Sitio y Mecanismo ➔ Alteración de Gusto y Sabor",
      cascades: [
        {
          mechanism:
            "Deficiencia crónica de vitamina B12 inducida por metformina → daño neurológico periférico.",
          effect:
            "→ Neuropatía sensorial que puede alterar percepción táctil/gustativa (disgeusia en contexto de neuropatía).",
          cite: "Huynh et al., 2024, Introducción (refs. 10,11); Discusión.",
        },
        {
          mechanism:
            "Consecuencias documentadas de B12 baja: neuropatía e hipoacusia.",
          effect:
            "→ Alteración de vías sensoriales (gusto y audición) por compromiso de nervios periféricos.",
          cite: "Huynh et al., 2024, Introducción (consecuencias de B12 baja, refs. 10,11).",
        },
        {
          mechanism:
            "Deficiencia de B12 puede causar o empeorar neuropatía simétrica distal y autonómica.",
          effect:
            "→ Disgeusia, parestesias orales o sabor metálico/atípico al confundirse con complicación diabética.",
          cite: "Huynh et al., 2024, referencia 32 Bell (citada en bibliografía del artículo).",
        },
        {
          mechanism:
            "↑ homocisteína y ↑ ácido metilmalónico por déficit de B12 a nivel celular.",
          effect:
            "→ Toxicidad metabólica neuronal que agrava síntomas sensitivos incluida alteración organoléptica.",
          cite: "Huynh et al., 2024, Discusión (ref. 30 Green; refs. 31,32 Wile & Bell).",
        },
      ],
      clinicalTip:
        "Disgeusia + neuropatía en DM2 con metformina: descartar B12 (<300 pg/mL en el estudio) antes de asumir solamente neuropatía diabética (Huynh et al., 2024).",
    },
  ],

  abbreviations: [
    {
      acronym: "B12",
      fullName: "Vitamina B12 (cobalamina)",
      what:
        "Micronutriente esencial para eritropoyesis y metabolismo de homocisteína y ácidos grasos.",
      role:
        "Deficiencia en 18.6% con metformina (Huynh et al., 2024); umbral <300 pg/mL con folato normal.",
    },
    {
      acronym: "IF",
      fullName: "Factor intrínseco",
      what:
        "Glicoproteína gástrica necesaria para formar el complejo absorbible con B12.",
      role:
        "Metformina ↓ secreción de IF → ↓ absorción ileal de B12 (Huynh et al., 2024, refs. 8,9).",
    },
    {
      acronym: "Cubilina",
      fullName: "Receptor cubilina (ileal)",
      what:
        "Receptor en enterocitos ileales que internaliza el complejo IF-B12.",
      role:
        "Metformina interfiere en la unión IF-B12-cubilina → malabsorción (Huynh et al., 2024, refs. 8,9).",
    },
    {
      acronym: "MMA",
      fullName: "Ácido metilmalónico",
      what:
        "Metabolito que se acumula cuando B12 no convierte metilmalonil-CoA en succinil-CoA.",
      role:
        "Marcador tisular de deficiencia de B12; no medido en Huynh pero descrito en su Discusión (ref. 30).",
    },
  ],
};

let activeNutritionId = PHARMACO_NUTRITION.categories[0].id;
let lastFocusedElement = null;

const els = {
  drugTitle: document.getElementById("drug-title"),
  drugSubtitle: document.getElementById("drug-subtitle"),
  moduleBadge: document.getElementById("module-badge"),
  nutritionSource: document.getElementById("nutrition-source"),
  nutritionCategories: document.getElementById("nutrition-categories"),
  nutritionCategoryLabel: document.getElementById("nutrition-category-label"),
  nutritionTitle: document.getElementById("nutrition-title"),
  nutritionCascade: document.getElementById("nutrition-cascade"),
  nutritionTipText: document.getElementById("nutrition-tip-text"),
  nutritionCard: document.getElementById("nutrition-card"),
  abbrevChips: document.getElementById("abbrev-chips"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalClose: document.getElementById("modal-close"),
  modalAcronym: document.getElementById("modal-acronym"),
  modalFullName: document.getElementById("modal-full-name"),
  modalBody: document.getElementById("modal-body"),
};

const nutritionById = Object.fromEntries(
  PHARMACO_NUTRITION.categories.map((c) => [c.id, c])
);

function init() {
  renderHeader();
  renderNutritionPanel();
  renderNutritionCard(activeNutritionId);
  renderAbbrevChips();
  bindGlobalEvents();
}

function renderHeader() {
  const { drug } = PHARMACO_NUTRITION;
  els.drugTitle.textContent = drug.title;
  els.drugSubtitle.textContent = drug.subtitle;
  els.moduleBadge.textContent = drug.module;
}

function renderNutritionPanel() {
  const { source } = PHARMACO_NUTRITION;
  els.nutritionSource.textContent = `${source.full} DOI: ${source.doi}`;
  els.nutritionCategories.innerHTML = "";

  PHARMACO_NUTRITION.categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nutrition-cat";
    btn.dataset.id = cat.id;
    btn.dataset.color = cat.color;
    btn.setAttribute("aria-selected", cat.id === activeNutritionId ? "true" : "false");
    btn.innerHTML = `
      <span class="nutrition-cat__label">${cat.label}</span>
      <span class="nutrition-cat__hint">${cat.hint}</span>
    `;
    btn.addEventListener("click", () => selectNutritionCategory(cat.id));
    els.nutritionCategories.appendChild(btn);
  });

  updateActiveNutritionCategory();
}

function selectNutritionCategory(categoryId) {
  activeNutritionId = categoryId;
  updateActiveNutritionCategory();
  renderNutritionCard(categoryId);
}

function updateActiveNutritionCategory() {
  els.nutritionCategories.querySelectorAll(".nutrition-cat").forEach((btn) => {
    const isActive = btn.dataset.id === activeNutritionId;
    btn.classList.toggle("nutrition-cat--active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function renderNutritionCard(categoryId) {
  const cat = nutritionById[categoryId];
  if (!cat) return;

  els.nutritionCategoryLabel.textContent = cat.label;
  els.nutritionTitle.textContent = cat.title;

  els.nutritionCascade.innerHTML = cat.cascades
    .map(
      (step) => `
      <li>
        <span class="cascade__mechanism">${step.mechanism}</span>
        <span class="cascade__effect">${step.effect}</span>
        <span class="cascade__cite">${step.cite}</span>
      </li>
    `
    )
    .join("");

  els.nutritionTipText.textContent = cat.clinicalTip;

  els.nutritionCard.style.animation = "none";
  void els.nutritionCard.offsetWidth;
  els.nutritionCard.style.animation = "";
}

function renderAbbrevChips() {
  els.abbrevChips.innerHTML = "";

  PHARMACO_NUTRITION.abbreviations.forEach((abbr) => {
    const item = document.createElement("li");
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = abbr.acronym;
    chip.setAttribute("aria-label", `Ver definición de ${abbr.acronym}`);
    chip.addEventListener("click", () => openModal(abbr));
    item.appendChild(chip);
    els.abbrevChips.appendChild(item);
  });
}

function openModal(abbr) {
  lastFocusedElement = document.activeElement;
  els.modalAcronym.textContent = abbr.acronym;
  els.modalFullName.textContent = abbr.fullName;
  els.modalBody.innerHTML = `
    <p><strong>¿Qué es?</strong> ${abbr.what}</p>
    <p><strong>¿Qué hace aquí?</strong> ${abbr.role}</p>
  `;
  els.modalOverlay.hidden = false;
  els.modalOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  els.modalClose.focus();
}

function closeModal() {
  els.modalOverlay.hidden = true;
  els.modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function bindGlobalEvents() {
  els.modalClose.addEventListener("click", closeModal);
  els.modalOverlay.addEventListener("click", (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !els.modalOverlay.hidden) closeModal();
  });
}

init();
