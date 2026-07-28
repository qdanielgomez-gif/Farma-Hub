/**
 * Farma Básica — Lógica de interfaz
 */
/* ── State ── */
let activeDrugId = null;
let PHARMA_DATA = null;
let PHARMACO_NUTRITION = null;
let PHARMACO_SIDE_EFFECTS = null;
let stepById = {};
let nutritionById = {};
let sideEffectsById = {};

let activeView = "mechanism";
let activeStepId = null;
let activeNutritionId = null;
let activeSideEffectsId = null;
let lastFocusedElement = null;

let lockSelectedTermId = null;
let lockMatches = {};
let architectCanvasOrder = [];
let architectToolboxPieces = [];
let architectStartedAt = null;
let credibilityScore = 100;
let credibilityCaseIndex = 0;
let credibilityAnswered = false;
let credibilityFinished = false;

const CREDIBILITY_ROUND_SIZE = 20;
const CREDIBILITY_FAIL_THRESHOLD = 55;
let credibilityRoundCases = [];
let credibilityAdvanceTimer = null;

/** Banco de casos — Pestaña Credibilidad (teoría pestañas 1–3 GLP-1) */
const CREDIBILITY_CASES = [
  {
    id: "nauseas-titulacion",
    source: "Efectos GI · Alteración de apetito",
    title: "Náuseas al iniciar GLP-1RA",
    scenario:
      "Paciente con DM2 inicia semaglutide. Semana 1: náuseas y plenitud por retraso del vaciado gástrico (frecuente 25–44%). ¿Tu consejo?",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Titular lentamente y comidas pequeñas, frecuentes y ricas en proteína.", avatar: "¡Bien! Eso coincide con la titulación y el manejo nutricional del módulo." },
      { id: "b", type: "suboptimal", delta: -10, label: "Suspender el GLP-1RA ante la primera náusea leve sin ajustar dosis.", avatar: "Los síntomas GI suelen mejorar con dosis estable; no abandones de inmediato." },
      { id: "c", type: "critical", delta: -30, label: "Duplicar la dosis ya para acelerar la pérdida de peso.", avatar: "¡No! Escalar rápido empeora náuseas y vómito." },
    ],
  },
  {
    id: "hipoglucemia-insulina",
    source: "Efectos metabólicos · Mecanismo",
    title: "DM2 con insulina + GLP-1RA",
    scenario:
      "Adulto con DM2 en insulina basal inicia liraglutide. GLP-1RA ↑ insulina de forma dependiente de glucosa, pero con insulina hay riesgo de hipoglucemia.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Reducir insulina o sulfonilurea al iniciar GLP-1RA y vigilar glucosa.", avatar: "Correcto: ajustar terapia concomitante en DM2." },
      { id: "b", type: "suboptimal", delta: -10, label: "Mantener la misma dosis de insulina sin plan de seguimiento.", avatar: "Conviene monitorizar y ajustar la insulinoterapia." },
      { id: "c", type: "critical", delta: -30, label: "Asegurar que GLP-1RA nunca causa hipoglucemia y omitir controles.", avatar: "¡Peligro! Con insulina o sulfonilureas sí puede haber hipoglucemia." },
    ],
  },
  {
    id: "masa-magra",
    source: "Alteración de peso · Nutrición",
    title: "Pérdida de peso y fatiga",
    scenario:
      "Paciente con GLP-1RA perdió 8% de peso en 3 meses. Fatiga y caída del cabello. Sin soporte, ~25% del peso perdido puede ser masa magra.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Proteína 1.2–1.5 g/kg/d, entrenamiento de fuerza y vigilar micronutrientes.", avatar: "¡Excelente! Proteges masa muscular y evitas malnutrición." },
      { id: "b", type: "suboptimal", delta: -10, label: "Porciones pequeñas «compatibles con GLP-1» sin densidad nutricional.", avatar: "Insuficiente: puede dar falsa sensación de dieta adecuada." },
      { id: "c", type: "critical", delta: -30, label: "Celebrar la pérdida rápida sin evaluar proteína ni masa magra.", avatar: "Ignorar sarcopenia empeora fatiga y adherencia." },
    ],
  },
  {
    id: "glp1ra-vs-idpp4",
    source: "Mecanismo · Fármaco",
    title: "Confusión en examen: GLP-1RA vs iDPP-4",
    scenario:
      "Estudiante afirma que sitagliptina (iDPP-4) y semaglutide (GLP-1RA) actúan igual porque ambos «activan GLP-1». ¿Cómo corriges?",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "GLP-1RA imita la hormona; iDPP-4 prolonga GLP-1 endógena bloqueando DPP-4 (mecanismos distintos).", avatar: "¡Exacto! Ese tip de examen está en la pestaña de mecanismo." },
      { id: "b", type: "suboptimal", delta: -10, label: "Decir que son equivalentes y intercambiables sin matizar.", avatar: "No son lo mismo: uno imita, el otro eleva incretina endógena." },
      { id: "c", type: "critical", delta: -30, label: "Afirmar que iDPP-4 también es un análogo sintético de GLP-1.", avatar: "Falso: los iDPP-4 no imitan la hormona." },
    ],
  },
  {
    id: "estrenimiento-fibra",
    source: "Alteración de alimentación · Efectos GI",
    title: "Estreñimiento con GLP-1RA",
    scenario:
      "Paciente con liraglutide refiere estreñimiento (17–24% es frecuente) y baja ingesta de fibra y líquidos por síntomas GI previos.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Aumentar fibra y líquidos tolerables en porciones pequeñas densas en nutrientes.", avatar: "Bien: la cascada nutricional lo menciona como ciclo a romper." },
      { id: "b", type: "suboptimal", delta: -10, label: "Recomendar seguir comiendo menos sin revisar fibra ni hidratación.", avatar: "Puede empeorar distensión y menor ingesta." },
      { id: "c", type: "critical", delta: -30, label: "Indicar ayuno prolongado para «descansar» el intestino.", avatar: "Eso agrava déficit nutricional con GLP-1RA." },
    ],
  },
  {
    id: "dosis-obesidad-dm2",
    source: "Efecto terapéutico · Mecanismo",
    title: "Dosis para obesidad vs DM2",
    scenario:
      "Paciente con obesidad pregunta por semaglutide. Recuerdas que 2.4 mg está aprobado para obesidad y dosis menores se usan en DM2.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Explicar que la dosis depende de la indicación (obesidad vs DM2) y titular según guía.", avatar: "Correcto según el paso terapéutico del diagrama." },
      { id: "b", type: "suboptimal", delta: -10, label: "Usar siempre la dosis más baja para evitar cualquier efecto GI.", avatar: "La titulación lenta es mejor que subdosisar sin criterio." },
      { id: "c", type: "critical", delta: -30, label: "Iniciar directamente 2.4 mg sin titulación en DM2 recién diagnosticada.", avatar: "Saltar titulación aumenta náuseas y abandono." },
    ],
  },
  {
    id: "suspension-sin-plan",
    source: "Alteración de apetito · Peso",
    title: "Quiere suspender el GLP-1RA",
    scenario:
      "Paciente a 10 meses quiere dejar exenatide por costo. Sin plan nutricional, muchos recuperan peso tras suspender (abandono 50–85% a 1–2 años).",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Planificar transición con nutrición estructurada y seguimiento del peso.", avatar: "Bien: evitas recuperación ponderal por falta de plan." },
      { id: "b", type: "suboptimal", delta: -10, label: "Suspender de inmediato sin consejo dietético ni seguimiento.", avatar: "Riesgo de recuperar peso perdido." },
      { id: "c", type: "critical", delta: -30, label: "Decir que no habrá cambio de peso al suspender.", avatar: "Falso: puede haber recuperación sin plan nutricional." },
    ],
  },
  {
    id: "micronutrientes-6m",
    source: "Alteración de nutrientes",
    title: "Déficits a los 6 meses",
    scenario:
      "Paciente con ingesta <1200–1800 kcal/d por hiporexia con GLP-1RA. A los 6 meses, déficits reportados en 12.7% (hierro, calcio, magnesio, zinc, vitaminas).",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Evaluar ingesta, considerar suplementación guiada y densidad nutricional.", avatar: "Acorde a la cascada de alteración de nutrientes." },
      { id: "b", type: "suboptimal", delta: -10, label: "Asumir que perder peso basta y no revisar micronutrientes.", avatar: "La baja ingesta puede causar déficits subclínicos." },
      { id: "c", type: "critical", delta: -30, label: "Restringir aún más calorías para acelerar resultados.", avatar: "Aumenta riesgo de malnutrición y abandono." },
    ],
  },
  {
    id: "diarrea-titulacion",
    source: "Efectos GI",
    title: "Diarrea al escalar dosis",
    scenario:
      "Paciente reporta diarrea (19–30% en estudios) tras subir dosis de dulaglutide. Síntomas más frecuentes al iniciar y escalar.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Valorar titulación más lenta y comidas fraccionadas; vigilar hidratación.", avatar: "Coherente con manejo GI del módulo." },
      { id: "b", type: "suboptimal", delta: -10, label: "Ignorar el síntoma porque «es normal» sin evaluar severidad.", avatar: "Debes valorar intensidad y adherencia." },
      { id: "c", type: "critical", delta: -30, label: "Escalar de nuevo la dosis para «adaptarse» más rápido.", avatar: "Empeora tolerancia GI." },
    ],
  },
  {
    id: "masld-seguimiento",
    source: "Efecto terapéutico · Hígado",
    title: "MASLD y GLP-1RA",
    scenario:
      "Paciente con DM2 y hígado graso (MASLD). Los GLP-1RA pueden reducir esteatosis hepática, en parte por pérdida de peso.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Incluir beneficio hepático potencial y metas de peso en el plan.", avatar: "Correcto según efecto terapéutico del diagrama." },
      { id: "b", type: "suboptimal", delta: -10, label: "Tratar solo glucosa sin mencionar el componente hepático.", avatar: "Pierdes oportunidad educativa sobre MASLD." },
      { id: "c", type: "critical", delta: -30, label: "Afirmar que GLP-1RA curan MASH en todos los casos sin evidencia individual.", avatar: "Sobreinterpretas: «puede mejorar» en biopsia, no cura garantizada." },
    ],
  },
  {
    id: "via-sc-oral",
    source: "Mecanismo · Fármaco",
    title: "Rechazo a inyección SC",
    scenario:
      "Paciente rechaza semaglutide inyectable. Los análogos pueden administrarse SC o, en semaglutide, vía oral con potenciador de absorción.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Explorar alternativa oral (semaglutide) o otro GLP-1RA según indicación y tolerancia.", avatar: "Bien: conoces las vías del paso «Fármaco»." },
      { id: "b", type: "suboptimal", delta: -10, label: "Abandonar la clase GLP-1RA sin discutir opciones.", avatar: "Hay alternativas dentro de la misma clase." },
      { id: "c", type: "critical", delta: -30, label: "Recomendar iDPP-4 diciendo que es el mismo GLP-1RA injectable.", avatar: "Confundes clases: iDPP-4 ≠ agonista." },
    ],
  },
  {
    id: "dependiente-glucosa",
    source: "Mecanismo · Páncreas",
    title: "Miedo a hipoglucemia en monoterapia",
    scenario:
      "Paciente con DM2 inicia GLP-1RA sin insulina. Pregunta si «bajará demasiado la glucosa». El efecto es dependiente de glucosa en células β.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Explicar efecto dependiente de glucosa: más insulina solo si hay hiperglucemia.", avatar: "Exacto al mecanismo pancreático del diagrama." },
      { id: "b", type: "suboptimal", delta: -10, label: "Responder de forma vaga sin explicar el concepto.", avatar: "Pierdes oportunidad de educar y generar confianza." },
      { id: "c", type: "critical", delta: -30, label: "Prometer que nunca habrá hipoglucemia aunque después agreguen sulfonilurea.", avatar: "Con sulfonilureas o insulina sí hay riesgo." },
    ],
  },
  {
    id: "adulto-mayor-sarcopenia",
    source: "Efectos sobre nutrición · Peso",
    title: "Adulto mayor con GLP-1RA",
    scenario:
      "Adulto ≥65 años pierde peso con tirzepatide. ~25% del peso perdido puede ser masa magra; riesgo de sarcopenia funcional.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Priorizar proteína adecuada y entrenamiento de fuerza supervisado.", avatar: "Clave en adultos mayores según efectos nutricionales." },
      { id: "b", type: "suboptimal", delta: -10, label: "Fomentar solo restricción calórica sin proteína ni ejercicio.", avatar: "Aumenta sarcopenia en este grupo." },
      { id: "c", type: "critical", delta: -30, label: "Desalentar actividad física por el peso perdido.", avatar: "La fuerza es parte del manejo recomendado." },
    ],
  },
  {
    id: "b12-metformina",
    source: "Alteración de nutrientes",
    title: "DM2 con metformina + GLP-1RA",
    scenario:
      "Paciente con hiporexia por GLP-1RA y metformina crónica. El tip clínico sugiere vigilar B12 si también toma metformina.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Vigilar B12 y estado nutricional global por baja ingesta.", avatar: "Correcto: doble riesgo nutricional." },
      { id: "b", type: "suboptimal", delta: -10, label: "Solo controlar peso mensual sin laboratorio.", avatar: "Fatiga puede deberse a déficit de B12 u otros nutrientes." },
      { id: "c", type: "critical", delta: -30, label: "Descartar cualquier déficit porque GLP-1RA «no afecta vitaminas».", avatar: "La baja ingesta sí puede causar déficits." },
    ],
  },
  {
    id: "dolor-abdominal",
    source: "Efectos metabólicos · GI",
    title: "Dolor abdominal persistente",
    scenario:
      "Paciente con GLP-1RA y dolor abdominal intenso persistente. Pancreatitis aguda es rara pero posible; también dolor abdominal frecuente al titular.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Evaluar gravedad, considerar suspensión temporal y descartar pancreatitis/enfermedad biliar.", avatar: "Equilibrado con efectos adversos del módulo." },
      { id: "b", type: "suboptimal", delta: -10, label: "Atribuir todo a «normal» sin exploración.", avatar: "Debes distinguir tolerancia vs evento grave." },
      { id: "c", type: "critical", delta: -30, label: "Continuar el fármaco sin evaluar porque pancreatitis es imposible.", avatar: "Minimizas un EA raro pero documentado." },
    ],
  },
  {
    id: "proteina-43pct",
    source: "Alteración de nutrientes",
    title: "Ingesta proteica insuficiente",
    scenario:
      "Solo 43% de usuarios alcanzan ≥1.2 g/kg/d de proteína con GLP-1RA; muchos fallan también vitamina D, potasio, magnesio e hierro.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Diseñar plan con objetivo proteico 1.2–1.5 g/kg/d y alimentos densos en nutrientes.", avatar: "Alineado con cascada nutricional y tips clínicos." },
      { id: "b", type: "suboptimal", delta: -10, label: "Confiar en que «come menos pero sano» sin cuantificar proteína.", avatar: "La mayoría no alcanza metas sin guía." },
      { id: "c", type: "critical", delta: -30, label: "Desaconsejar proteína extra porque el fármaco ya reduce apetito.", avatar: "Justo cuando más se necesita proteger masa magra." },
    ],
  },
  {
    id: "saciedad-hiporexia",
    source: "Alteración de apetito · Mecanismo cerebral",
    title: "Saciedad extrema",
    scenario:
      "Paciente con hiporexia marcada por activación central de GLP-1R (hipotálamo, POMC/CART). Difícil completar comidas habituales.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Comidas pequeñas y frecuentes ricas en proteína; vigilar ingesta total.", avatar: "Tip clínico exacto de alteración de apetito." },
      { id: "b", type: "suboptimal", delta: -10, label: "Animar a comer grandes platos una vez al día.", avatar: "Empeora náuseas y plenitud gástrica." },
      { id: "c", type: "critical", delta: -30, label: "Decir que no comer casi nada acelera resultados sin riesgo.", avatar: "Promueves malnutrición y abandono." },
    ],
  },
  {
    id: "litiasis-biliar",
    source: "Efectos metabólicos",
    title: "Pérdida ponderal rápida",
    scenario:
      "Paciente pierde peso rápido con GLP-1RA. Pérdida ponderal rápida puede asociar cambios biliares y riesgo de litiasis/colecistitis.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Educar sobre síntomas biliares y seguimiento; evitar pérdida demasiado acelerada.", avatar: "Coherente con efectos metabólicos adversos." },
      { id: "b", type: "suboptimal", delta: -10, label: "No mencionar posibles síntomas biliares.", avatar: "Omite un EA documentado en el módulo." },
      { id: "c", type: "critical", delta: -30, label: "Indicar ayuno prolongado además del GLP-1RA.", avatar: "Aumenta riesgo biliar y desnutrición." },
    ],
  },
  {
    id: "hba1c-beneficio",
    source: "Efecto terapéutico · DM2",
    title: "Control glucémico en DM2",
    scenario:
      "Paciente con DM2 pregunta cómo GLP-1RA mejora HbA1c. Restaura efecto incretínico: ↑ insulina y ↓ glucagon en páncreas.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Explicar mejor secreción de insulina y menor glucagon con beneficio ponderal adicional.", avatar: "Resume mecanismo y beneficio terapéutico." },
      { id: "b", type: "suboptimal", delta: -10, label: "Decir solo «baja azúcar» sin mecanismo.", avatar: "Respuesta incompleta para nivel universitario." },
      { id: "c", type: "critical", delta: -30, label: "Afirmar que actúan igual que sulfonilureas sin dependencia de glucosa.", avatar: "Confundes mecanismos y riesgo de hipoglucemia." },
    ],
  },
  {
    id: "vomito-dehidratacion",
    source: "Efectos GI · Nutrición",
    title: "Vómito recurrente",
    scenario:
      "Paciente con vómito (8–24% en estudios) tras titular GLP-1RA y baja ingesta de líquidos. Riesgo de deshidratación y déficit nutricional.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Pausar titulación, hidratación, comidas fraccionadas; evaluar si continuar.", avatar: "Manejo prudente de GI + nutrición." },
      { id: "b", type: "suboptimal", delta: -10, label: "Solo recomendar antiemético sin revisar dosis ni alimentación.", avatar: "Incomplete sin abordar titulación y líquidos." },
      { id: "c", type: "critical", delta: -30, label: "Subir dosis para superar el «periodo de adaptación».", avatar: "Contraindicado con vómito recurrente." },
    ],
  },
  {
    id: "cabello-fatiga",
    source: "Otros efectos · Nutrición",
    title: "Alopecia y mareo",
    scenario:
      "Paciente con caída del cabello, fatiga y mareo en GLP-1RA. Puede deberse a déficit nutricional subclínico (proteína, hierro, B12).",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Descartar déficit proteico, hierro y B12; reforzar ingesta densa en nutrientes.", avatar: "Tip clínico de «otros síntomas» del módulo." },
      { id: "b", type: "suboptimal", delta: -10, label: "Atribuir todo al estrés sin evaluación nutricional.", avatar: "Puede retrasar corrección de déficits." },
      { id: "c", type: "critical", delta: -30, label: "Asegurar que es imposible tener déficits con GLP-1RA.", avatar: "Contradice datos de malnutrición del módulo." },
    ],
  },
  {
    id: "sulfonilurea-combo",
    source: "Efectos metabólicos · DM2",
    title: "GLP-1RA + sulfonilurea",
    scenario:
      "Paciente con DM2 en glibenclamida inicia exenatide. Combinación con sulfonilurea aumenta riesgo de hipoglucemia.",
    options: [
      { id: "a", type: "optimal", delta: 15, label: "Reducir sulfonilurea al iniciar GLP-1RA y educar sobre hipoglucemia.", avatar: "Mismo principio que con insulina en el módulo." },
      { id: "b", type: "suboptimal", delta: -10, label: "Mantener sulfonilurea sin ajuste «para no descontrolar».", avatar: "Aumenta riesgo de hipoglucemia." },
      { id: "c", type: "critical", delta: -30, label: "Duplicar sulfonilurea porque GLP-1RA «protege» de hipoglucemia.", avatar: "Completamente incorrecto y peligroso." },
    ],
  },
];

const els = {
  drugMenu: document.getElementById("drug-menu"),
  userGuest: document.getElementById("user-guest"),
  userLogged: document.getElementById("user-logged"),
  userBadgeName: document.getElementById("user-badge-name"),
  userBadgeId: document.getElementById("user-badge-id"),
  drugMenuNotice: document.getElementById("drug-menu-notice"),
  btnOpenRegister: document.getElementById("btn-open-register"),
  btnMyMetrics: document.getElementById("btn-my-metrics"),
  btnSwitchUser: document.getElementById("btn-switch-user"),
  userRegisterOverlay: document.getElementById("user-register-overlay"),
  registerForm: document.getElementById("register-form"),
  registerName: document.getElementById("register-name"),
  registerStudentId: document.getElementById("register-id"),
  registerFeedback: document.getElementById("register-feedback"),
  registerDeviceUsers: document.getElementById("register-device-users"),
  registerClose: document.getElementById("register-close"),
  userMetricsOverlay: document.getElementById("user-metrics-overlay"),
  userMetricsClose: document.getElementById("user-metrics-close"),
  userMetricsSubtitle: document.getElementById("user-metrics-subtitle"),
  userMetricsStats: document.getElementById("user-metrics-stats"),
  btnDownloadMetricsPdf: document.getElementById("btn-download-metrics-pdf"),
  appStudy: document.getElementById("app-study"),
  btnBackMenu: document.getElementById("btn-back-menu"),
  drugPickers: document.querySelectorAll(".drug-picker"),
  drugTitle: document.getElementById("drug-title"),
  drugSubtitle: document.getElementById("drug-subtitle"),
  moduleBadge: document.getElementById("module-badge"),
  viewTabs: document.querySelectorAll(".view-tab[data-view]"),
  tabSideEffects: document.getElementById("tab-side-effects"),
  viewMechanism: document.getElementById("view-mechanism"),
  viewNutrition: document.getElementById("view-nutrition"),
  viewSideEffects: document.getElementById("view-side-effects"),
  diagram: document.getElementById("diagram"),
  connectionsLayer: null,
  studyCard: document.getElementById("study-card"),
  studyStep: document.getElementById("study-step"),
  studyTitle: document.getElementById("study-title"),
  studyBullets: document.getElementById("study-bullets"),
  studyTipText: document.getElementById("study-tip-text"),
  nutritionSource: document.getElementById("nutrition-source"),
  nutritionCategories: document.getElementById("nutrition-categories"),
  nutritionCategoryLabel: document.getElementById("nutrition-category-label"),
  nutritionTitle: document.getElementById("nutrition-title"),
  nutritionCascade: document.getElementById("nutrition-cascade"),
  nutritionTipText: document.getElementById("nutrition-tip-text"),
  nutritionCard: document.getElementById("nutrition-card"),
  sideEffectsSource: document.getElementById("side-effects-source"),
  sideEffectsCategories: document.getElementById("side-effects-categories"),
  sideEffectsCategoryLabel: document.getElementById("side-effects-category-label"),
  sideEffectsTitle: document.getElementById("side-effects-title"),
  sideEffectsCascade: document.getElementById("side-effects-cascade"),
  sideEffectsTipText: document.getElementById("side-effects-tip-text"),
  sideEffectsCard: document.getElementById("side-effects-card"),
  physiologyLock: document.getElementById("physiology-lock"),
  studyContent: document.getElementById("study-content"),
  lockTitle: document.getElementById("lock-title"),
  lockIntro: document.getElementById("lock-intro"),
  lockTerms: document.getElementById("lock-terms"),
  lockDefinitions: document.getElementById("lock-definitions"),
  lockSubmit: document.getElementById("lock-submit"),
  lockHint: document.getElementById("lock-hint"),
  lockFail: document.getElementById("lock-fail"),
  lockRetry: document.getElementById("lock-retry"),
  tabArchitect: document.getElementById("tab-architect"),
  tabCredibility: document.getElementById("tab-credibility"),
  viewArchitect: document.getElementById("view-architect"),
  viewCredibility: document.getElementById("view-credibility"),
  architectTitle: document.getElementById("architect-title"),
  architectIntro: document.getElementById("architect-intro"),
  architectCanvas: document.getElementById("architect-canvas"),
  architectToolbox: document.getElementById("architect-toolbox"),
  architectFeedback: document.getElementById("architect-feedback"),
  architectValidate: document.getElementById("architect-validate"),
  architectReset: document.getElementById("architect-reset"),
  credibilityTitle: document.getElementById("credibility-title"),
  credibilityIntro: document.getElementById("credibility-intro"),
  credibilityPercent: document.getElementById("credibility-percent"),
  credibilityFill: document.getElementById("credibility-fill"),
  hubAvatar: document.getElementById("hub-avatar"),
  hubAvatarBubble: document.getElementById("hub-avatar-bubble"),
  credibilityCaseBadge: document.getElementById("credibility-case-badge"),
  credibilityCaseTitle: document.getElementById("credibility-case-title"),
  credibilityCaseText: document.getElementById("credibility-case-text"),
  credibilityOptions: document.getElementById("credibility-options"),
  credibilityResult: document.getElementById("credibility-result"),
  credibilityPlay: document.getElementById("credibility-play"),
  credibilityResults: document.getElementById("credibility-results"),
  credibilityFinalScore: document.getElementById("credibility-final-score"),
  credibilityFinalMeta: document.getElementById("credibility-final-meta"),
  credibilityNewRound: document.getElementById("credibility-new-round"),
  professorOverlay: document.getElementById("professor-overlay"),
  professorClose: document.getElementById("professor-close"),
  professorStats: document.getElementById("professor-stats"),
  professorAuth: document.getElementById("professor-auth"),
  professorKeyInput: document.getElementById("professor-key-input"),
  professorKeySubmit: document.getElementById("professor-key-submit"),
  professorSubtitle: document.getElementById("professor-subtitle"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalClose: document.getElementById("modal-close"),
  modalAcronym: document.getElementById("modal-acronym"),
  modalFullName: document.getElementById("modal-full-name"),
  modalBody: document.getElementById("modal-body"),
};

const VIEW_LABELS = {
  mechanism: "Mecanismo de Acción",
  nutrition: "Alteraciones en el estado nutricional",
  sideEffects: "Efectos Secundarios",
  architect: "Modo Arquitecto",
  credibility: "Credibilidad",
};

const STORAGE_KEY = "farmaBasica_stats";
const USERS_KEY = "farmaBasica_users";
const ACTIVE_USER_KEY = "farmaBasica_activeUser";
const PROFESSOR_KEY_STORAGE = "farmaBasica_professorKey";

let activeUserId = null;
let serverSyncEnabled = false;
let statsPushTimer = null;
let professorApiKey = sessionStorage.getItem(PROFESSOR_KEY_STORAGE) || "";

function getApiBase() {
  const configured = window.FARMA_API_URL;
  if (configured === false || configured === "off") return null;
  if (typeof configured === "string" && configured.length > 0) {
    return configured.replace(/\/$/, "");
  }
  if (
    location.port === "3000" &&
    (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ) {
    return "";
  }
  // Mismo origen: Render sirve la app y la API juntas
  if (location.hostname.endsWith(".onrender.com")) {
    return "";
  }
  return null;
}

async function apiFetch(path, options = {}) {
  const base = getApiBase();
  if (base === null) return null;

  const response = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Error HTTP ${response.status}`);
  }

  return response.json();
}

async function initServerConnection() {
  serverSyncEnabled = getApiBase() !== null;
  if (!serverSyncEnabled || !activeUserId) return;
  await pullStatsFromServer();
}

async function syncSessionOnServer(name, studentId) {
  if (!serverSyncEnabled) return null;

  try {
    const data = await apiFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({ name, studentId }),
    });

    if (data?.stats && data.userId) {
      const store = readAllStatsStore();
      store[data.userId] = data.stats;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }

    return data;
  } catch (error) {
    console.warn("No se pudo sincronizar la sesión con el servidor:", error);
    return null;
  }
}

async function pullStatsFromServer() {
  if (!serverSyncEnabled || !activeUserId) return;

  try {
    const data = await apiFetch(`/api/session/stats?userId=${encodeURIComponent(activeUserId)}`);
    if (data?.stats) {
      const store = readAllStatsStore();
      store[activeUserId] = data.stats;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch (error) {
    console.warn("No se pudo descargar progreso del servidor:", error);
  }
}

function scheduleServerStatsPush() {
  if (!serverSyncEnabled || !activeUserId) return;
  window.clearTimeout(statsPushTimer);
  statsPushTimer = window.setTimeout(() => {
    pushStatsToServer();
  }, 450);
}

async function pushStatsToServer() {
  if (!serverSyncEnabled || !activeUserId) return;

  try {
    await apiFetch("/api/session/stats", {
      method: "PUT",
      body: JSON.stringify({
        userId: activeUserId,
        stats: readStats(),
      }),
    });
  } catch (error) {
    console.warn("No se pudo guardar progreso en el servidor:", error);
  }
}

async function fetchProfessorDataFromServer(key) {
  if (!serverSyncEnabled) return null;
  return apiFetch("/api/students", {
    headers: { "X-Professor-Key": key },
  });
}

const ABBREV_ALIASES = {
  "complejo I": "Cx I",
  "Complejo I": "Cx I",
  "factor intrínseco": "IF",
  "vitamina B12": "B12",
  "Vitamina B12": "B12",
};

function getActiveModule() {
  return activeDrugId ? DRUG_MODULES[activeDrugId] : null;
}

function normalizeStudentId(studentId) {
  return String(studentId).trim().toUpperCase().replace(/\s+/g, "");
}

function userIdFromStudentId(studentId) {
  const matricula = normalizeStudentId(studentId);
  if (!matricula || matricula.length < 3) return null;
  return `student-${matricula.replace(/[^A-Z0-9]/g, "")}`;
}

function findUserIdByStudentId(studentId) {
  const userId = userIdFromStudentId(studentId);
  if (!userId) return null;
  const registry = readUsersRegistry();
  return registry.users[userId] ? userId : null;
}

function slugifyUserId(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function readUsersRegistry() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : { users: {} };
  } catch {
    return { users: {} };
  }
}

function writeUsersRegistry(registry) {
  localStorage.setItem(USERS_KEY, JSON.stringify(registry));
}

function loadActiveUser() {
  activeUserId = localStorage.getItem(ACTIVE_USER_KEY);
  const registry = readUsersRegistry();
  if (activeUserId && !registry.users[activeUserId]) {
    activeUserId = null;
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
  migrateLegacyStatsIfNeeded();
}

function getActiveUserProfile() {
  if (!activeUserId) return null;
  return readUsersRegistry().users[activeUserId] ?? null;
}

function setActiveUser(userId) {
  activeUserId = userId;
  localStorage.setItem(ACTIVE_USER_KEY, userId);
  updateUserPanelUI();
}

function migrateLegacyStatsIfNeeded() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed.glp1 && !parsed.metformina) return;
    const userId = activeUserId || `legacy-${Date.now().toString(36)}`;
    const registry = readUsersRegistry();
    if (!registry.users[userId]) {
      registry.users[userId] = {
        name: "Progreso anterior",
        studentId: "",
        registeredAt: Date.now(),
      };
      writeUsersRegistry(registry);
    }
    if (!activeUserId) setActiveUser(userId);
    const nested = {};
    nested[userId] = parsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nested));
  } catch {
    /* ignore corrupt legacy data */
  }
}

function readAllStatsStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function readStats() {
  if (!activeUserId) return {};
  const store = readAllStatsStore();
  return store[activeUserId] ?? {};
}

function writeStats(stats) {
  if (!activeUserId) return;
  const store = readAllStatsStore();
  store[activeUserId] = stats;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  scheduleServerStatsPush();
}

function createDefaultDrugStats() {
  return {
    lock: { passed: false, attempts: 0 },
    architect: [],
    credibility: { attempts: 0, runs: [] },
    memorama: [],
  };
}

function registerUser(name, studentId = "") {
  const trimmed = name.trim();
  const matricula = normalizeStudentId(studentId);

  if (trimmed.length < 2) {
    return { ok: false, message: "Escribe tu nombre completo." };
  }
  if (!matricula || matricula.length < 3) {
    return { ok: false, message: "La matrícula es obligatoria (mínimo 3 caracteres)." };
  }

  const registry = readUsersRegistry();
  const userId = userIdFromStudentId(matricula);
  const existing = registry.users[userId];
  const resumed = Boolean(existing);

  registry.users[userId] = {
    name: trimmed,
    studentId: matricula,
    registeredAt: existing?.registeredAt ?? Date.now(),
    lastLoginAt: Date.now(),
  };
  writeUsersRegistry(registry);
  setActiveUser(userId);

  const store = readAllStatsStore();
  if (!store[userId]) {
    store[userId] = {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  return {
    ok: true,
    resumed,
    userId,
    message: resumed
      ? serverSyncEnabled
        ? "¡Bienvenido de nuevo! Recuperamos tu progreso desde el servidor."
        : "¡Bienvenido de nuevo! Recuperamos tu progreso guardado en este navegador."
      : serverSyncEnabled
        ? "Cuenta creada. Tu progreso se guardará en el servidor."
        : "Cuenta creada. Tu progreso quedará ligado a esta matrícula en este dispositivo.",
  };
}

function isUserRegistered() {
  return Boolean(activeUserId && getActiveUserProfile());
}

function updateUserPanelUI() {
  const registered = isUserRegistered();
  if (els.userGuest) els.userGuest.hidden = registered;
  if (els.userLogged) els.userLogged.hidden = !registered;

  const profile = getActiveUserProfile();
  if (registered && profile) {
    if (els.userBadgeName) els.userBadgeName.textContent = profile.name;
    if (els.userBadgeId) {
      els.userBadgeId.textContent = profile.studentId ? `Matrícula ${profile.studentId}` : "";
      els.userBadgeId.hidden = !profile.studentId;
    }
  }

  els.drugPickers?.forEach((btn) => {
    btn.disabled = !registered;
    btn.classList.toggle("drug-picker--disabled", !registered);
  });

  if (els.drugMenuNotice) {
    els.drugMenuNotice.hidden = registered;
    if (!registered) {
      els.drugMenuNotice.textContent =
        "Regístrate con tu matrícula. Al terminar, descarga el PDF de métricas y envíaselo a tu profesor.";
    }
  }
}

function renderRegisterDeviceUsers() {
  if (!els.registerDeviceUsers) return;
  const registry = readUsersRegistry();
  const entries = Object.entries(registry.users)
    .filter(([, profile]) => profile.studentId)
    .sort((a, b) => (b[1].lastLoginAt || b[1].registeredAt) - (a[1].lastLoginAt || a[1].registeredAt));

  if (entries.length === 0) {
    els.registerDeviceUsers.innerHTML = "";
    els.registerDeviceUsers.hidden = true;
    return;
  }

  els.registerDeviceUsers.hidden = false;
  els.registerDeviceUsers.innerHTML = `
    <p class="register-device-users__heading">Cuentas en este navegador</p>
    ${entries
      .map(
        ([id, profile]) => `
      <button type="button" class="view-tab view-tab--ghost register-device-users__btn" data-resume-user="${id}">
        Continuar como ${escapeHtml(profile.name)} · ${escapeHtml(profile.studentId)}
      </button>
    `
      )
      .join("")}
  `;
}

function resumeExistingUser(userId) {
  const registry = readUsersRegistry();
  const profile = registry.users[userId];
  if (!profile) return;
  profile.lastLoginAt = Date.now();
  writeUsersRegistry(registry);
  setActiveUser(userId);
  if (serverSyncEnabled) {
    pullStatsFromServer().finally(() => {
      closeRegisterModal();
      updateUserPanelUI();
    });
    return;
  }
  closeRegisterModal();
  updateUserPanelUI();
}

function openRegisterModal() {
  if (!els.userRegisterOverlay) return;
  renderRegisterDeviceUsers();
  if (els.registerFeedback) {
    els.registerFeedback.textContent = "";
    els.registerFeedback.hidden = true;
  }
  els.userRegisterOverlay.hidden = false;
  els.userRegisterOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  els.registerStudentId?.focus();
}

function closeRegisterModal() {
  if (!els.userRegisterOverlay) return;
  els.userRegisterOverlay.hidden = true;
  els.userRegisterOverlay.setAttribute("aria-hidden", "true");
  if (els.modalOverlay?.hidden && els.userMetricsOverlay?.hidden && els.professorOverlay?.hidden) {
    document.body.style.overflow = "";
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = els.registerName?.value ?? "";
  const studentId = els.registerStudentId?.value ?? "";
  const result = registerUser(name, studentId);

  if (result.ok && serverSyncEnabled) {
    const serverSession = await syncSessionOnServer(name, studentId);
    if (serverSession?.resumed) {
      result.resumed = true;
      result.message = "¡Bienvenido de nuevo! Recuperamos tu progreso desde el servidor.";
    } else if (serverSession) {
      result.message = "Cuenta creada. Tu progreso se guardará en el servidor.";
    }
  }

  if (els.registerFeedback) {
    els.registerFeedback.hidden = false;
    els.registerFeedback.textContent = result.message ?? "";
    els.registerFeedback.dataset.type = result.ok ? (result.resumed ? "resume" : "new") : "error";
  }

  if (result.ok) {
    window.setTimeout(() => {
      els.registerForm?.reset();
      closeRegisterModal();
      updateUserPanelUI();
    }, result.resumed ? 900 : 500);
  }
}

function switchUser() {
  activeUserId = null;
  localStorage.removeItem(ACTIVE_USER_KEY);
  updateUserPanelUI();
  openRegisterModal();
}

function summarizeDrugMetrics(drugStats) {
  const lockAttempts = drugStats.lock?.attempts ?? 0;
  const lockPassed = drugStats.lock?.passed === true;
  const architectRuns = drugStats.architect ?? [];
  const architectSuccess = architectRuns.filter((r) => r.success).length;
  const architectRate =
    architectRuns.length > 0 ? Math.round((architectSuccess / architectRuns.length) * 100) : null;
  const architectAvgMs =
    architectRuns.length > 0
      ? architectRuns.reduce((sum, r) => sum + (r.timeMs || 0), 0) / architectRuns.length
      : null;
  const credibilityStats = drugStats.credibility ?? { attempts: 0, runs: [] };
  const credibilityRuns = credibilityStats.runs ?? [];
  const credibilityAvg = getCredibilityAverage(credibilityStats);

  return {
    lockAttempts,
    lockPassed,
    architectRuns: architectRuns.length,
    architectSuccess,
    architectRate,
    architectAvgMs,
    credibilityRounds: credibilityRuns.length,
    credibilityRuns,
    credibilityAvg,
    hasActivity:
      lockAttempts > 0 ||
      architectRuns.length > 0 ||
      (credibilityRuns.length ?? 0) > 0 ||
      lockPassed,
  };
}

function buildMetricsCardsHtml(drugStats, drugLabel) {
  const summary = summarizeDrugMetrics(drugStats);

  return `
    <article class="professor-card professor-card--lavender">
      <h4 class="professor-card__title">${drugLabel} · Candado</h4>
      <p class="professor-card__value">${summary.lockAttempts}</p>
      <p class="professor-card__meta">Intentos · Desbloqueado: ${summary.lockPassed ? "Sí" : "No"}</p>
    </article>
    <article class="professor-card professor-card--teal">
      <h4 class="professor-card__title">${drugLabel} · Arquitecto</h4>
      <p class="professor-card__value">${summary.architectRate ?? 0}%</p>
      <p class="professor-card__meta">${summary.architectSuccess}/${summary.architectRuns} éxitos · ${formatDuration(summary.architectAvgMs)}</p>
    </article>
    <article class="professor-card professor-card--yellow">
      <h4 class="professor-card__title">${drugLabel} · Credibilidad</h4>
      <p class="professor-card__value">${summary.credibilityAvg ?? 0}%</p>
      <p class="professor-card__meta">${summary.credibilityRounds} intento(s) · Promedio de intentos</p>
    </article>
  `;
}

function formatReportDate(timestamp = Date.now()) {
  return new Date(timestamp).toLocaleString("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function slugifyFilename(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const PDF_COLORS = {
  cream: [251, 249, 241],
  black: [24, 24, 27],
  yellow: [253, 224, 147],
  teal: [42, 157, 143],
  lavender: [199, 184, 234],
  coral: [244, 162, 97],
  sky: [168, 218, 220],
  white: [255, 255, 255],
  muted: [68, 68, 68],
};

function pdfSetFill(doc, rgb) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}

function pdfSetStroke(doc, rgb) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function pdfSetText(doc, rgb) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function pdfTextColorForCard(fillRgb) {
  return fillRgb === PDF_COLORS.teal ? PDF_COLORS.white : PDF_COLORS.black;
}

function pdfMetaColorForCard(fillRgb) {
  return fillRgb === PDF_COLORS.teal ? [230, 245, 243] : PDF_COLORS.muted;
}

function pdfEnsureSpace(doc, y, needed, margin) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed <= pageHeight - margin) return y;
  doc.addPage();
  pdfPaintPageBackground(doc);
  return margin;
}

function pdfPaintPageBackground(doc) {
  pdfSetFill(doc, PDF_COLORS.cream);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");
}

function pdfDrawShadowRect(doc, x, y, w, h, fillRgb, shadow = 1.8) {
  pdfSetFill(doc, PDF_COLORS.black);
  doc.rect(x + shadow, y + shadow, w, h, "F");
  pdfSetFill(doc, fillRgb);
  pdfSetStroke(doc, PDF_COLORS.black);
  doc.setLineWidth(0.55);
  doc.rect(x, y, w, h, "FD");
}

function pdfSafeText(text) {
  return String(text)
    .replace(/\u2192/g, " -> ")
    .replace(/·/g, " | ")
    .replace(/—/g, "-");
}

function pdfMeasureLines(doc, text, maxWidth, fontSize = 8.8) {
  doc.setFontSize(fontSize);
  return doc.splitTextToSize(pdfSafeText(text), maxWidth);
}

function pdfDrawRecommendationsSection(doc, y, title, tips, margin, contentWidth) {
  if (tips.length === 0) return y;

  y = pdfEnsureSpace(doc, y, 24, margin);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  pdfSetText(doc, PDF_COLORS.black);
  doc.text(pdfSafeText(title), margin, y);
  y += 6;

  const textX = margin + 4;
  const textWidth = contentWidth - 8;
  const lineHeight = 4.2;

  tips.forEach((tip, index) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    const bodyLines = pdfMeasureLines(doc, tip, textWidth - 6, 8.8);
    const firstLine = `${index + 1}. ${bodyLines[0] ?? ""}`;
    const restLines = bodyLines.slice(1);
    const allDisplayLines = [firstLine, ...restLines.map((line) => `   ${line}`)];
    const paddingTop = 4;
    const paddingBottom = 3.5;
    const boxH = paddingTop + allDisplayLines.length * lineHeight + paddingBottom;

    y = pdfEnsureSpace(doc, y, boxH + 4, margin);
    pdfDrawShadowRect(doc, margin, y, contentWidth, boxH, index % 2 === 0 ? PDF_COLORS.sky : PDF_COLORS.coral);

    pdfSetText(doc, PDF_COLORS.black);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    allDisplayLines.forEach((line, lineIndex) => {
      doc.text(line, textX, y + paddingTop + 3 + lineIndex * lineHeight);
    });

    y += boxH + 4;
  });

  return y + 4;
}

function buildGlp1Recommendations(summary) {
  const tips = [];

  if (!summary.hasActivity) {
    tips.push("Completa el modulo GLP-1: candado fisiologico, Modo Arquitecto y ronda de Credibilidad.");
    return tips;
  }

  if (!summary.lockPassed) {
    tips.push(
      "Candado fisiologico: repasa emparejamiento incretinas-GLP-1, glucosa postprandial, receptor y senalizacion cAMP/PKA."
    );
  } else if (summary.lockAttempts > 2) {
    tips.push("Candado superado con varios intentos: repasa definiciones de semaglutida, tirzepatida y fisiologia intestinal.");
  }

  if (summary.architectRuns === 0) {
    tips.push(
      "Modo Arquitecto: practica la secuencia Farmaco -> Receptor GLP-1 -> Organo diana -> Efecto clinico."
    );
  } else if (summary.architectRate !== null && summary.architectRate < 80) {
    tips.push(
      "Mecanismo de accion: refuerza la pestaña Mecanismo (receptor acoplado a Gi/Gs, pancreas, SNC, estomago)."
    );
  }

  if (summary.credibilityRounds === 0) {
    tips.push("Credibilidad: realiza la ronda de 20 casos para integrar mecanismo, nutricion y efectos adversos.");
  } else if (summary.credibilityAvg !== null && summary.credibilityAvg < 70) {
    tips.push(
      "Credibilidad baja: repasa pestañas Nutricion (saciedad, vaciamiento gastrico) y Efectos secundarios (GI, pancreatitis, litiasis)."
    );
    tips.push("Enfocate en titulacion lenta, red flags abdominales y contraindicaciones MEN2/CMT.");
  } else if (summary.credibilityAvg !== null && summary.credibilityAvg < 85) {
    tips.push(
      "Credibilidad moderada: refuerza diferencias entre moleculas, interacciones y manejo de efectos GI."
    );
  }

  if (
    summary.lockPassed &&
    (summary.architectRate ?? 0) >= 80 &&
    (summary.credibilityAvg ?? 0) >= 85
  ) {
    tips.push("Excelente desempeno. Refuerza casos avanzados: IR acida, interaccion con insulina y seguridad pancreatica.");
  }

  if (tips.length === 0) {
    tips.push("Sigue repasando las 5 pestañas del modulo antes de la evaluacion formal.");
  }

  return tips;
}

function buildMetforminaRecommendations(summary) {
  if (!summary.hasActivity) {
    return [
      "Metformina: recorre Mecanismo de accion (AMPK, higado) y Alteraciones nutricionales (B12, peso).",
    ];
  }
  return [
    "Metformina: repasa transporte OCT1/OCT2, contraindicaciones renales y monitorizacion de vitamina B12.",
  ];
}

function pdfDrawMetricCard(doc, x, y, w, title, value, meta, fillRgb) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const metaLines = pdfMeasureLines(doc, meta, w - 8, 8.5);
  const h = Math.max(28, 20 + metaLines.length * 3.8);
  pdfDrawShadowRect(doc, x, y, w, h, fillRgb);
  const textColor = pdfTextColorForCard(fillRgb);
  const metaColor = pdfMetaColorForCard(fillRgb);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  pdfSetText(doc, textColor);
  doc.text(pdfSafeText(title), x + 3, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(pdfSafeText(String(value)), x + 3, y + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  pdfSetText(doc, metaColor);
  metaLines.forEach((line, index) => {
    doc.text(line, x + 3, y + 21 + index * 3.8);
  });

  return h;
}

function pdfDrawDrugModuleSection(doc, y, drugLabel, summary, margin, contentWidth) {
  y = pdfEnsureSpace(doc, y, 48, margin);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  pdfSetText(doc, PDF_COLORS.black);
  doc.text(pdfSafeText(drugLabel), margin, y);
  y += 8;

  const cardW = (contentWidth - 8) / 3;
  const architectValue =
    summary.architectRuns === 0 ? "-" : `${summary.architectRate ?? 0}%`;
  const architectMeta =
    summary.architectRuns === 0
      ? "Sin partidas aun"
      : `${summary.architectSuccess}/${summary.architectRuns} exitos | ${formatDuration(summary.architectAvgMs)}`;
  const credibilityValue =
    summary.credibilityAvg === null ? "-" : `${summary.credibilityAvg}%`;

  const cardHeights = [
    pdfDrawMetricCard(
      doc,
      margin,
      y,
      cardW,
      "Candado",
      summary.lockPassed ? "OK" : summary.lockAttempts,
      summary.lockPassed
        ? `${summary.lockAttempts} intento(s) | Desbloqueado`
        : `${summary.lockAttempts} intento(s) | Pendiente`,
      PDF_COLORS.lavender
    ),
    pdfDrawMetricCard(
      doc,
      margin + cardW + 4,
      y,
      cardW,
      "Arquitecto",
      architectValue,
      architectMeta,
      PDF_COLORS.teal
    ),
    pdfDrawMetricCard(
      doc,
      margin + (cardW + 4) * 2,
      y,
      cardW,
      "Credibilidad",
      credibilityValue,
      `${summary.credibilityRounds} intento(s) | Promedio de intentos`,
      PDF_COLORS.yellow
    ),
  ];
  y += Math.max(...cardHeights) + 8;

  if (summary.credibilityRuns.length > 0) {
    const recentRuns = summary.credibilityRuns.slice(-5);
    const boxH = 8 + recentRuns.length * 4.5;
    y = pdfEnsureSpace(doc, y, boxH + 4, margin);
    pdfDrawShadowRect(doc, margin, y, contentWidth, boxH, PDF_COLORS.white);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    pdfSetText(doc, PDF_COLORS.black);
    doc.text("Ultimas rondas de credibilidad", margin + 3, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    recentRuns.forEach((run, index) => {
      const num = summary.credibilityRuns.length - recentRuns.length + index + 1;
      doc.text(pdfSafeText(`Ronda ${num}: ${run.finalScore ?? "-"}% | ${formatReportDate(run.at || Date.now())}`), margin + 3, y);
      y += 4.5;
    });
    y += 6;
  }

  return y;
}

function downloadMetricsPdf() {
  const profile = getActiveUserProfile();
  if (!profile) {
    openRegisterModal();
    return;
  }

  const jsPdfLib = window.jspdf?.jsPDF;
  if (!jsPdfLib) {
    window.alert("No se pudo cargar el generador de PDF. Recarga la pagina e intenta de nuevo.");
    return;
  }

  const stats = readStats();
  const glp1Summary = summarizeDrugMetrics(stats.glp1 ?? createDefaultDrugStats());
  const metforminaSummary = summarizeDrugMetrics(stats.metformina ?? createDefaultDrugStats());

  const hasGlp1Progress =
    glp1Summary.lockPassed ||
    glp1Summary.architectRuns > 0 ||
    glp1Summary.credibilityRounds > 0;

  if (!hasGlp1Progress) {
    window.alert("Completa al menos una actividad del modulo GLP-1 (candado, arquitecto o credibilidad) antes de generar el reporte.");
    return;
  }

  const glp1Tips = buildGlp1Recommendations(glp1Summary);
  const metforminaTips = buildMetforminaRecommendations(metforminaSummary);
  const generatedAt = Date.now();

  const doc = new jsPdfLib({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 16;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  pdfPaintPageBackground(doc);

  pdfDrawShadowRect(doc, margin, margin, contentWidth, 34, PDF_COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  pdfSetText(doc, PDF_COLORS.black);
  doc.text("Farma Basica", margin + 4, margin + 11);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  pdfSetText(doc, PDF_COLORS.muted);
  doc.text("Reporte de progreso del alumno", margin + 4, margin + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  pdfSetText(doc, PDF_COLORS.black);
  doc.text(profile.name, margin + 4, margin + 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Matricula: ${profile.studentId || "—"}`, margin + 4, margin + 31);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  pdfSetText(doc, PDF_COLORS.muted);
  const dateText = formatReportDate(generatedAt);
  doc.text(dateText, pageWidth - margin - 4, margin + 31, { align: "right" });

  let y = margin + 42;

  y = pdfDrawDrugModuleSection(doc, y, "Agonistas GLP-1", glp1Summary, margin, contentWidth);
  y = pdfDrawRecommendationsSection(
    doc,
    y,
    "Recomendaciones de estudio | GLP-1",
    glp1Tips,
    margin,
    contentWidth
  );

  if (metforminaSummary.hasActivity) {
    y = pdfDrawDrugModuleSection(doc, y + 4, "Metformina", metforminaSummary, margin, contentWidth);
    y = pdfDrawRecommendationsSection(
      doc,
      y,
      "Recomendaciones de estudio | Metformina",
      metforminaTips,
      margin,
      contentWidth
    );
  }

  y = pdfEnsureSpace(doc, y, 14, margin);
  const footerText =
    "Envia este PDF a tu profesor/a. Las recomendaciones se basan en tu desempeno en la app.";
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  const footerLines = pdfMeasureLines(doc, footerText, contentWidth - 8, 8.5);
  const footerH = 6 + footerLines.length * 4;
  pdfDrawShadowRect(doc, margin, y, contentWidth, footerH, PDF_COLORS.lavender);
  pdfSetText(doc, PDF_COLORS.black);
  footerLines.forEach((line, index) => {
    doc.text(line, margin + 4, y + 5 + index * 4);
  });

  const datePart = new Date(generatedAt).toISOString().slice(0, 10);
  const idPart = profile.studentId ? slugifyFilename(profile.studentId) : slugifyFilename(profile.name);
  doc.save(`FarmaBasica_${idPart}_${datePart}.pdf`);
}

function renderUserMetricsPanel() {
  const profile = getActiveUserProfile();
  if (!profile || !els.userMetricsStats) return;

  els.userMetricsSubtitle.textContent = profile.studentId
    ? `${profile.name} · Matrícula ${profile.studentId}`
    : profile.name;

  const stats = readStats();
  const glp1 = stats.glp1 ?? createDefaultDrugStats();
  els.userMetricsStats.innerHTML = buildMetricsCardsHtml(glp1, "GLP-1");
}

function openUserMetricsPanel() {
  if (!isUserRegistered()) {
    openRegisterModal();
    return;
  }
  renderUserMetricsPanel();
  els.userMetricsOverlay.hidden = false;
  els.userMetricsOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  els.userMetricsClose?.focus();
}

function closeUserMetricsPanel() {
  els.userMetricsOverlay.hidden = true;
  els.userMetricsOverlay.setAttribute("aria-hidden", "true");
  if (els.modalOverlay?.hidden && els.userRegisterOverlay?.hidden && els.professorOverlay?.hidden) {
    document.body.style.overflow = "";
  }
}

function getDrugStats(drugId = activeDrugId) {
  const stats = readStats();
  if (!stats[drugId]) {
    stats[drugId] = createDefaultDrugStats();
  }
  return stats[drugId];
}

function saveDrugStats(drugId, drugStats) {
  const stats = readStats();
  stats[drugId] = drugStats;
  writeStats(stats);
}

function isPhysiologyUnlocked(drugId = activeDrugId) {
  const mod = DRUG_MODULES[drugId];
  if (!mod?.requiresPhysiologyLock) return true;
  return getDrugStats(drugId).lock.passed === true;
}

function formatDuration(ms) {
  if (!ms || ms < 0) return "—";
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clearCredibilityAdvanceTimer() {
  if (credibilityAdvanceTimer) {
    window.clearTimeout(credibilityAdvanceTimer);
    credibilityAdvanceTimer = null;
  }
}

function getCredibilityAverage(credibilityStats) {
  const runs = credibilityStats?.runs ?? [];
  if (runs.length === 0) return null;
  return Math.round(runs.reduce((sum, run) => sum + (run.finalScore || 0), 0) / runs.length);
}

function applyCredibilityDelta(delta) {
  credibilityScore = Math.max(0, Math.min(100, credibilityScore + delta));
  return credibilityScore;
}

function resetInteractiveState() {
  clearCredibilityAdvanceTimer();
  lockSelectedTermId = null;
  lockMatches = {};
  architectCanvasOrder = [];
  architectToolboxPieces = [];
  architectStartedAt = null;
  credibilityScore = 100;
  credibilityCaseIndex = 0;
  credibilityAnswered = false;
  credibilityFinished = false;
  credibilityRoundCases = [];
  if (els.hubAvatarBubble) els.hubAvatarBubble.hidden = true;
  if (els.credibilityResult) els.credibilityResult.textContent = "";
  if (els.credibilityPlay) els.credibilityPlay.hidden = false;
  if (els.credibilityResults) els.credibilityResults.hidden = true;
  if (els.lockFail) els.lockFail.hidden = true;
  if (els.architectFeedback) els.architectFeedback.textContent = "";
}

function loadDrugData(drugId) {
  const mod = DRUG_MODULES[drugId];
  PHARMA_DATA = mod.pharmaData;
  PHARMACO_NUTRITION = mod.nutrition;
  PHARMACO_SIDE_EFFECTS = mod.sideEffects;
  stepById = Object.fromEntries(PHARMA_DATA.steps.map((s) => [s.id, s]));
  nutritionById = Object.fromEntries(PHARMACO_NUTRITION.categories.map((c) => [c.id, c]));
  sideEffectsById = PHARMACO_SIDE_EFFECTS
    ? Object.fromEntries(PHARMACO_SIDE_EFFECTS.categories.map((c) => [c.id, c]))
    : {};
  activeStepId = PHARMA_DATA.steps[0].id;
  activeNutritionId = PHARMACO_NUTRITION.categories[0].id;
  activeSideEffectsId = PHARMACO_SIDE_EFFECTS?.categories[0]?.id ?? null;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildAbbrevMatchers(dict) {
  const matchers = [];

  Object.entries(dict).forEach(([key, abbr]) => {
    matchers.push({ key, pattern: escapeRegex(abbr.acronym) });
  });

  Object.entries(ABBREV_ALIASES).forEach(([alias, key]) => {
    if (dict[key]) {
      matchers.push({ key, pattern: escapeRegex(alias) });
    }
  });

  return matchers.sort((a, b) => b.pattern.length - a.pattern.length);
}

function linkifyAbbreviations(text, dict) {
  const matchers = buildAbbrevMatchers(dict);
  if (matchers.length === 0) return escapeHtml(text);

  let output = text;
  const placeholders = [];

  matchers.forEach(({ key, pattern }) => {
    const isShort = pattern.length <= 4;
    const regex = new RegExp(
      `(?<![A-Za-z0-9/-])(${pattern})(?![A-Za-z0-9/-])`,
      isShort ? "g" : "gi"
    );

    output = output.replace(regex, (match) => {
      const token = `@@ABBR${placeholders.length}@@`;
      placeholders.push({ token, key, match });
      return token;
    });
  });

  output = escapeHtml(output);
  placeholders.forEach(({ token, key, match }) => {
    output = output.replace(
      token,
      `<button type="button" class="text-link-sigla" data-abbr-key="${key}">${escapeHtml(match)}</button>`
    );
  });

  return output;
}

function updateSideEffectsTabVisibility() {
  const show = getActiveModule()?.hasSideEffectsTab ?? false;
  if (els.tabSideEffects) els.tabSideEffects.hidden = !show;
}

function updateGamificationTabVisibility() {
  const show = getActiveModule()?.hasGamificationTabs ?? false;
  if (els.tabArchitect) els.tabArchitect.hidden = !show;
  if (els.tabCredibility) els.tabCredibility.hidden = !show;
}

function updateStudyVisibility() {
  const mod = getActiveModule();
  const needsLock = mod?.requiresPhysiologyLock && !isPhysiologyUnlocked();
  if (els.physiologyLock) els.physiologyLock.hidden = !needsLock;
  if (els.studyContent) els.studyContent.hidden = needsLock;
  if (needsLock) renderPhysiologyLock();
}

function showDrugMenu() {
  activeDrugId = null;
  resetInteractiveState();
  closeModal();
  closeProfessorPanel();
  closeUserMetricsPanel();
  closeRegisterModal();
  updateUserPanelUI();
  els.drugMenu.hidden = false;
  els.appStudy.hidden = true;
  document.title = "Farma Básica — Selección de fármaco";
}

function selectDrug(drugId) {
  if (!DRUG_MODULES[drugId]) return;
  if (!isUserRegistered()) {
    openRegisterModal();
    return;
  }

  activeDrugId = drugId;
  loadDrugData(drugId);
  activeView = "mechanism";
  resetInteractiveState();

  els.drugMenu.hidden = true;
  els.appStudy.hidden = false;

  updateSideEffectsTabVisibility();
  updateGamificationTabVisibility();
  updateStudyVisibility();
  renderDrugContent();
  if (isPhysiologyUnlocked()) {
    switchView("mechanism");
  }

  document.title = `Farma Básica — ${PHARMA_DATA.drug.title}`;
}

function unlockStudyAfterLock() {
  updateStudyVisibility();
  renderDrugContent();
  switchView("mechanism");
}

function renderDrugContent() {
  if (els.studyContent?.hidden) return;
  renderHeader();
  renderDiagram();
  renderStudyCard(activeStepId);
  renderNutritionPanel();
  renderNutritionCard(activeNutritionId);
  if (getActiveModule()?.hasSideEffectsTab) {
    renderSideEffectsPanel();
    renderSideEffectsCard(activeSideEffectsId);
  }
  if (getActiveModule()?.hasGamificationTabs) {
    renderArchitect();
    renderCredibility();
  }
}

function init() {
  serverSyncEnabled = getApiBase() !== null;
  loadActiveUser();
  initServerConnection().finally(() => {
    updateUserPanelUI();
  });
  showDrugMenu();
  bindGlobalEvents();
}

function renderHeader() {
  els.drugTitle.textContent = PHARMA_DATA.drug.title;
  els.drugSubtitle.textContent = PHARMA_DATA.drug.subtitle;
  updateModuleBadge();
}

function updateModuleBadge() {
  els.moduleBadge.textContent = VIEW_LABELS[activeView] ?? "Módulo activo";
}

function switchView(viewId) {
  if (viewId === activeView) return;
  if (els.studyContent?.hidden) return;
  if (viewId === "sideEffects" && !getActiveModule()?.hasSideEffectsTab) return;
  if ((viewId === "architect" || viewId === "credibility") && !getActiveModule()?.hasGamificationTabs) {
    return;
  }

  activeView = viewId;

  els.viewMechanism.hidden = viewId !== "mechanism";
  els.viewNutrition.hidden = viewId !== "nutrition";
  els.viewSideEffects.hidden = viewId !== "sideEffects";
  if (els.viewArchitect) els.viewArchitect.hidden = viewId !== "architect";
  if (els.viewCredibility) els.viewCredibility.hidden = viewId !== "credibility";

  els.viewTabs.forEach((tab) => {
    const active = tab.dataset.view === viewId;
    tab.classList.toggle("view-tab--active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
    tab.tabIndex = active ? 0 : -1;
  });

  updateModuleBadge();

  if (viewId === "mechanism") {
    requestAnimationFrame(drawConnections);
  }
  if (viewId === "architect") {
    renderArchitect();
  }
  if (viewId === "credibility") {
    renderCredibility();
  }
}

/* ── Mecanismo ── */
function createNode(step) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "node";
  btn.dataset.id = step.id;
  btn.dataset.color = step.color;
  btn.setAttribute("role", "tab");
  btn.setAttribute("aria-selected", step.id === activeStepId ? "true" : "false");
  btn.setAttribute("aria-label", `${step.label}: ${step.sublabel}`);

  btn.innerHTML = `
    <div class="node__shape node__shape--${step.shape}"></div>
    <span class="node__label-box"><span class="node__label">${step.label}</span></span>
    <span class="node__sublabel">${step.sublabel}</span>
  `;

  btn.addEventListener("click", () => selectStep(step.id));
  return btn;
}

function renderDiagram() {
  els.diagram.innerHTML = "";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "connections-layer";
  svg.setAttribute("aria-hidden", "true");
  els.diagram.appendChild(svg);
  els.connectionsLayer = svg;

  const rowsWrapper = document.createElement("div");
  rowsWrapper.className = "diagram__rows";

  PHARMA_DATA.diagram.rows.forEach((rowIds) => {
    const row = document.createElement("div");
    row.className = "diagram__row";
    rowIds.forEach((id) => {
      const step = stepById[id];
      if (step) row.appendChild(createNode(step));
    });
    rowsWrapper.appendChild(row);
  });

  els.diagram.appendChild(rowsWrapper);
  updateActiveNode();
  requestAnimationFrame(drawConnections);
}

function drawConnections() {
  const svg = els.connectionsLayer;
  const container = els.diagram;
  if (!svg || !container || activeView !== "mechanism") return;

  const width = container.offsetWidth;
  const height = container.offsetHeight;
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.replaceChildren();

  const containerRect = container.getBoundingClientRect();

  PHARMA_DATA.diagram.connections.forEach(({ from, to, label }) => {
    const fromNode = container.querySelector(`[data-id="${from}"]`);
    const toNode = container.querySelector(`[data-id="${to}"]`);
    if (!fromNode || !toNode) return;

    const fRect = fromNode.getBoundingClientRect();
    const tRect = toNode.getBoundingClientRect();
    const x1 = fRect.left + fRect.width / 2 - containerRect.left;
    const y1 = fRect.bottom - containerRect.top;
    const x2 = tRect.left + tRect.width / 2 - containerRect.left;
    const y2 = tRect.top - containerRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#18181B");
    path.setAttribute("stroke-width", "4");
    path.setAttribute("stroke-linecap", "square");
    svg.appendChild(path);

    if (label) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const padX = 8;
      const padY = 5;
      const textLen = label.length * 7 + padX * 2;
      const textH = 22;

      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("x", String(midX - textLen / 2));
      bg.setAttribute("y", String(midY - textH / 2));
      bg.setAttribute("width", String(textLen));
      bg.setAttribute("height", String(textH));
      bg.setAttribute("rx", "11");
      bg.setAttribute("class", "conn-label__bg");
      bg.setAttribute("fill", "#FFFFFF");
      bg.setAttribute("stroke", "#18181B");
      bg.setAttribute("stroke-width", "2");
      svg.appendChild(bg);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(midX));
      text.setAttribute("y", String(midY + 4));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("class", "conn-label__text");
      text.setAttribute("fill", "#18181B");
      text.setAttribute("font-size", "11");
      text.setAttribute("font-weight", "600");
      text.setAttribute("font-family", "Outfit, sans-serif");
      text.textContent = label;
      svg.appendChild(text);
    }
  });
}

function updateActiveNode() {
  els.diagram.querySelectorAll(".node").forEach((node) => {
    const isActive = node.dataset.id === activeStepId;
    node.classList.toggle("node--active", isActive);
    node.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function selectStep(stepId) {
  activeStepId = stepId;
  updateActiveNode();
  renderStudyCard(stepId);
  requestAnimationFrame(drawConnections);
}

function renderStudyCard(stepId) {
  const step = stepById[stepId];
  if (!step) return;

  const dict = PHARMA_DATA.abbreviations;
  const idx = PHARMA_DATA.steps.findIndex((s) => s.id === stepId) + 1;
  els.studyStep.textContent = `Paso ${idx} de ${PHARMA_DATA.steps.length}`;
  els.studyTitle.textContent = step.title;
  els.studyBullets.innerHTML = step.bullets
    .map((b) => `<li>${linkifyAbbreviations(b, dict)}</li>`)
    .join("");
  els.studyTipText.innerHTML = linkifyAbbreviations(step.clinicalTip, dict);

  els.studyCard.style.animation = "none";
  void els.studyCard.offsetWidth;
  els.studyCard.style.animation = "";
}

/* ── Alteraciones nutricionales ── */
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

  const dict = PHARMACO_NUTRITION.abbreviations;
  els.nutritionCategoryLabel.textContent = cat.label;
  els.nutritionTitle.textContent = cat.title;
  els.nutritionCascade.innerHTML = cat.cascades
    .map(
      (s) => `
      <li>
        <span class="cascade__mechanism">${linkifyAbbreviations(s.mechanism, dict)}</span>
        <span class="cascade__effect">${linkifyAbbreviations(s.effect, dict)}</span>
        <span class="cascade__cite">${s.cite}</span>
      </li>
    `
    )
    .join("");
  els.nutritionTipText.innerHTML = linkifyAbbreviations(cat.clinicalTip, dict);

  els.nutritionCard.style.animation = "none";
  void els.nutritionCard.offsetWidth;
  els.nutritionCard.style.animation = "";
}

/* ── Efectos secundarios ── */
function renderSideEffectsPanel() {
  if (!PHARMACO_SIDE_EFFECTS) return;

  const { source } = PHARMACO_SIDE_EFFECTS;
  els.sideEffectsSource.textContent = `${source.full} DOI: ${source.doi}`;
  els.sideEffectsCategories.innerHTML = "";

  PHARMACO_SIDE_EFFECTS.categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nutrition-cat";
    btn.dataset.id = cat.id;
    btn.dataset.color = cat.color;
    btn.setAttribute("aria-selected", cat.id === activeSideEffectsId ? "true" : "false");
    btn.innerHTML = `
      <span class="nutrition-cat__label">${cat.label}</span>
      <span class="nutrition-cat__hint">${cat.hint}</span>
    `;
    btn.addEventListener("click", () => selectSideEffectsCategory(cat.id));
    els.sideEffectsCategories.appendChild(btn);
  });

  updateActiveSideEffectsCategory();
}

function selectSideEffectsCategory(categoryId) {
  activeSideEffectsId = categoryId;
  updateActiveSideEffectsCategory();
  renderSideEffectsCard(categoryId);
}

function updateActiveSideEffectsCategory() {
  els.sideEffectsCategories.querySelectorAll(".nutrition-cat").forEach((btn) => {
    const isActive = btn.dataset.id === activeSideEffectsId;
    btn.classList.toggle("nutrition-cat--active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function renderSideEffectsCard(categoryId) {
  const cat = sideEffectsById[categoryId];
  if (!cat || !PHARMACO_SIDE_EFFECTS) return;

  const dict = PHARMACO_SIDE_EFFECTS.abbreviations;
  els.sideEffectsCategoryLabel.textContent = cat.label;
  els.sideEffectsTitle.textContent = cat.title;
  els.sideEffectsCascade.innerHTML = cat.cascades
    .map(
      (s) => `
      <li>
        <span class="cascade__mechanism">${linkifyAbbreviations(s.mechanism, dict)}</span>
        <span class="cascade__effect">${linkifyAbbreviations(s.effect, dict)}</span>
        <span class="cascade__cite">${s.cite}</span>
      </li>
    `
    )
    .join("");
  els.sideEffectsTipText.innerHTML = linkifyAbbreviations(cat.clinicalTip, dict);

  els.sideEffectsCard.style.animation = "none";
  void els.sideEffectsCard.offsetWidth;
  els.sideEffectsCard.style.animation = "";
}

/* ── Candado fisiológico ── */
function renderPhysiologyLock() {
  const lockData = getActiveModule()?.physiologyLock;
  if (!lockData || !els.physiologyLock) return;

  lockSelectedTermId = null;
  lockMatches = {};
  els.lockFail.hidden = true;
  els.lockTitle.textContent = lockData.title;
  els.lockIntro.innerHTML = linkifyAbbreviations(lockData.intro, lockData.abbreviations);

  const dict = lockData.abbreviations;
  const shuffledDefs = shuffleArray(lockData.pairs);

  els.lockTerms.innerHTML = lockData.pairs
    .map(
      (pair) => `
      <button type="button" class="match-item" data-term-id="${pair.id}">
        <span class="match-item__title">${linkifyAbbreviations(pair.term, dict)}</span>
      </button>
    `
    )
    .join("");

  els.lockDefinitions.innerHTML = shuffledDefs
    .map(
      (pair) => `
      <button type="button" class="match-item match-item--def" data-def-id="${pair.id}">
        <span class="match-item__text">${linkifyAbbreviations(pair.definition, dict)}</span>
      </button>
    `
    )
    .join("");

  updateLockBoardUI();
}

function updateLockBoardUI() {
  els.lockTerms?.querySelectorAll(".match-item").forEach((btn) => {
    const id = btn.dataset.termId;
    const matchedDefId = lockMatches[id];
    btn.classList.toggle("match-item--selected", id === lockSelectedTermId);
    btn.classList.toggle("match-item--paired", Boolean(matchedDefId));
    btn.disabled = Boolean(matchedDefId);
  });

  const usedDefIds = new Set(Object.values(lockMatches));
  els.lockDefinitions?.querySelectorAll(".match-item").forEach((btn) => {
    const id = btn.dataset.defId;
    btn.classList.toggle("match-item--paired", usedDefIds.has(id));
    btn.disabled = usedDefIds.has(id);
  });

  const total = getActiveModule()?.physiologyLock?.pairs?.length ?? 0;
  const done = Object.keys(lockMatches).length;
  els.lockHint.textContent =
    done === total
      ? "Todos emparejados. Pulsa «Comprobar emparejamientos»."
      : "Selecciona un concepto y luego su función correspondiente.";
}

function handleLockTermClick(termId) {
  if (lockMatches[termId]) return;
  lockSelectedTermId = termId;
  updateLockBoardUI();
}

function handleLockDefClick(defId) {
  if (!lockSelectedTermId) return;
  if (Object.values(lockMatches).includes(defId)) return;
  lockMatches[lockSelectedTermId] = defId;
  lockSelectedTermId = null;
  updateLockBoardUI();
}

function submitPhysiologyLock() {
  const mod = getActiveModule();
  const lockData = mod?.physiologyLock;
  if (!lockData) return;

  const stats = getDrugStats();
  const total = lockData.pairs.length;
  const matched = Object.keys(lockMatches).length;

  if (matched < total) {
    els.lockFail.hidden = false;
    stats.lock.attempts += 1;
    saveDrugStats(activeDrugId, stats);
    return;
  }

  const allCorrect = lockData.pairs.every((pair) => lockMatches[pair.id] === pair.id);
  if (!allCorrect) {
    els.lockFail.hidden = false;
    stats.lock.attempts += 1;
    saveDrugStats(activeDrugId, stats);
    return;
  }

  stats.lock.attempts += 1;
  stats.lock.passed = true;
  stats.lock.passedAt = Date.now();
  saveDrugStats(activeDrugId, stats);
  els.lockFail.hidden = true;
  unlockStudyAfterLock();
}

function retryPhysiologyLock() {
  lockSelectedTermId = null;
  lockMatches = {};
  els.lockFail.hidden = true;
  renderPhysiologyLock();
}

/* ── Modo Arquitecto ── */
function initArchitectState() {
  const data = getActiveModule()?.architect;
  if (!data) return;
  architectCanvasOrder = [];
  architectToolboxPieces = shuffleArray(data.pieces.map((p) => p.id));
  architectStartedAt = Date.now();
  els.architectFeedback.textContent = "";
}

function renderArchitect() {
  const data = getActiveModule()?.architect;
  if (!data || !els.architectCanvas) return;

  if (architectToolboxPieces.length === 0 && architectCanvasOrder.length === 0) {
    initArchitectState();
  }

  els.architectTitle.textContent = data.title;
  els.architectIntro.innerHTML = linkifyAbbreviations(data.intro, data.abbreviations);

  const pieceMap = Object.fromEntries(data.pieces.map((p) => [p.id, p]));
  const dict = data.abbreviations;

  els.architectCanvas.innerHTML = architectCanvasOrder
    .map((id, index) => {
      const piece = pieceMap[id];
      return `
        <button type="button" class="architect-piece architect-piece--canvas" data-piece-id="${id}" data-slot="${index}">
          <span class="architect-piece__label">${piece.label}</span>
          <span class="architect-piece__hint">${linkifyAbbreviations(piece.hint, dict)}</span>
        </button>
      `;
    })
    .join("");

  if (architectCanvasOrder.length === 0) {
    els.architectCanvas.innerHTML = `<p class="architect-canvas__empty">Arrastra piezas aquí en orden lógico</p>`;
  }

  els.architectToolbox.innerHTML = architectToolboxPieces
    .map(
      (id) => {
        const piece = pieceMap[id];
        return `
          <button type="button" class="architect-piece architect-piece--tool" data-piece-id="${id}" data-color="${piece.color}">
            <span class="architect-piece__label">${piece.label}</span>
            <span class="architect-piece__hint">${linkifyAbbreviations(piece.hint, dict)}</span>
          </button>
        `;
      }
    )
    .join("");
}

function movePieceToCanvas(pieceId) {
  if (!architectStartedAt) architectStartedAt = Date.now();
  const idx = architectToolboxPieces.indexOf(pieceId);
  if (idx === -1) return;
  architectToolboxPieces.splice(idx, 1);
  architectCanvasOrder.push(pieceId);
  renderArchitect();
}

function movePieceToToolbox(pieceId) {
  const idx = architectCanvasOrder.indexOf(pieceId);
  if (idx === -1) return;
  architectCanvasOrder.splice(idx, 1);
  architectToolboxPieces.push(pieceId);
  renderArchitect();
}

function validateArchitect() {
  const data = getActiveModule()?.architect;
  if (!data) return;

  const stats = getDrugStats();
  const elapsed = architectStartedAt ? Date.now() - architectStartedAt : 0;
  const success =
    architectCanvasOrder.length === data.correctOrder.length &&
    data.correctOrder.every((id, i) => architectCanvasOrder[i] === id);

  stats.architect.push({
    success,
    timeMs: elapsed,
    at: Date.now(),
  });
  saveDrugStats(activeDrugId, stats);

  if (success) {
    els.architectFeedback.innerHTML = `<span class="architect-feedback--ok">${escapeHtml(data.successMessage)} Tiempo: ${formatDuration(elapsed)}.</span>`;
  } else {
    els.architectFeedback.innerHTML =
      '<span class="architect-feedback--fail">Orden incorrecto. Recuerda: Fármaco → Receptor → Órgano → Efecto.</span>';
  }
}

function resetArchitect() {
  initArchitectState();
  renderArchitect();
}

/* ── Casos de Credibilidad (Pestaña 5) ── */
function initCredibilityRound() {
  clearCredibilityAdvanceTimer();
  credibilityScore = 100;
  credibilityCaseIndex = 0;
  credibilityAnswered = false;
  credibilityFinished = false;
  credibilityRoundCases = shuffleArray(CREDIBILITY_CASES).slice(0, CREDIBILITY_ROUND_SIZE);
  if (els.hubAvatarBubble) els.hubAvatarBubble.hidden = true;
  if (els.credibilityResult) els.credibilityResult.textContent = "";
  if (els.credibilityPlay) els.credibilityPlay.hidden = false;
  if (els.credibilityResults) els.credibilityResults.hidden = true;
  updateCredibilityBar();
}

function setCredibilityPlayVisible(showPlay) {
  if (els.credibilityPlay) els.credibilityPlay.hidden = !showPlay;
  if (els.credibilityResults) els.credibilityResults.hidden = showPlay;
}

function saveCredibilityRoundResult(outcome = "completed") {
  const stats = getDrugStats();
  if (!stats.credibility) stats.credibility = { attempts: 0, runs: [] };
  const finalScore = Math.max(0, Math.min(100, Math.round(credibilityScore)));
  stats.credibility.runs.push({ finalScore, at: Date.now(), outcome });
  stats.credibility.attempts = stats.credibility.runs.length;
  saveDrugStats(activeDrugId, stats);
  return finalScore;
}

function restartCredibilityAfterFail() {
  const stats = getDrugStats();
  const attempts = stats.credibility?.runs?.length ?? 0;
  const avg = getCredibilityAverage(stats.credibility);
  initCredibilityRound();
  renderCredibility();
  if (els.credibilityResult) {
    els.credibilityResult.textContent = `Casos nuevos. Intento ${attempts + 1} · Promedio acumulado: ${avg ?? "-"}%`;
  }
}

function handleCredibilityEarlyFail() {
  const finalScore = saveCredibilityRoundResult("failed");
  const stats = getDrugStats();
  const avg = getCredibilityAverage(stats.credibility);

  if (els.credibilityResult) {
    els.credibilityResult.textContent = `Intento terminado en ${finalScore}% (minimo ${CREDIBILITY_FAIL_THRESHOLD + 1}% para continuar).`;
  }
  pokeHubAvatar(
    "critical",
    `Credibilidad en ${finalScore}%. Intento registrado. Repasa teoria y reiniciamos con casos nuevos.`
  );

  credibilityAdvanceTimer = window.setTimeout(() => {
    credibilityAdvanceTimer = null;
    credibilityAnswered = false;
    restartCredibilityAfterFail();
  }, 1800);
}

function finishCredibilityRound() {
  clearCredibilityAdvanceTimer();
  credibilityFinished = true;
  const finalScore = saveCredibilityRoundResult("completed");
  const stats = getDrugStats();
  const avg = getCredibilityAverage(stats.credibility);
  if (els.credibilityFinalScore) {
    els.credibilityFinalScore.textContent = `Ronda completada. Credibilidad final: ${finalScore}%`;
  }
  if (els.credibilityFinalMeta) {
    els.credibilityFinalMeta.textContent = `Intentos registrados: ${stats.credibility?.runs?.length ?? 1} · Promedio de intentos: ${avg ?? finalScore}%`;
  }
  setCredibilityPlayVisible(false);
  updateCredibilityBar();
  pokeHubAvatar(
    finalScore >= 70 ? "optimal" : finalScore >= 40 ? "suboptimal" : "critical",
    finalScore >= 70
      ? "¡Buen desempeño en la ronda! Tus decisiones reflejan la teoría del módulo."
      : finalScore >= 40
        ? "Ronda completa. Repasa mecanismo, nutrición y efectos secundarios."
        : "Credibilidad muy baja. Vuelve a las pestañas 1–3 antes de la revancha."
  );
}

function initCredibilityState() {
  initCredibilityRound();
}

function pokeHubAvatar(mood, message) {
  if (!els.hubAvatarBubble || !els.hubAvatar) return;
  els.hubAvatarBubble.textContent = message;
  els.hubAvatarBubble.hidden = false;
  els.hubAvatarBubble.dataset.mood = mood;
  els.hubAvatar.classList.remove("hub-avatar--optimal", "hub-avatar--suboptimal", "hub-avatar--critical");
  els.hubAvatar.classList.add(`hub-avatar--${mood}`);
  els.hubAvatar.classList.add("hub-avatar--poke");
  window.setTimeout(() => els.hubAvatar.classList.remove("hub-avatar--poke"), 450);
}

function updateCredibilityBar() {
  credibilityScore = Math.max(0, Math.min(100, credibilityScore));
  const clamped = credibilityScore;
  if (els.credibilityPercent) els.credibilityPercent.textContent = `${clamped}%`;
  if (els.credibilityFill) {
    els.credibilityFill.style.width = `${clamped}%`;
    els.credibilityFill.dataset.level =
      clamped >= 70 ? "high" : clamped >= 40 ? "mid" : "low";
  }
}

function renderCredibility() {
  const data = getActiveModule()?.credibility;
  if (!data || !els.credibilityOptions) return;

  if (credibilityRoundCases.length === 0 && !credibilityFinished) {
    initCredibilityRound();
  }

  const dict = data.abbreviations ?? {};
  els.credibilityTitle.textContent = data.title;
  els.credibilityIntro.innerHTML = `${linkifyAbbreviations(data.intro, dict)} <strong>Si la credibilidad baja a ${CREDIBILITY_FAIL_THRESHOLD}% o menos, el intento termina, se registra y comienzan casos nuevos.</strong>`;
  updateCredibilityBar();

  if (credibilityFinished) {
    return;
  }

  const currentCase = credibilityRoundCases[credibilityCaseIndex];
  if (!currentCase) {
    finishCredibilityRound();
    return;
  }

  setCredibilityPlayVisible(true);
  els.credibilityCaseBadge.textContent = `Paciente ${credibilityCaseIndex + 1} de ${CREDIBILITY_ROUND_SIZE} · ${currentCase.source}`;
  els.credibilityCaseTitle.textContent = currentCase.title;
  els.credibilityCaseText.innerHTML = linkifyAbbreviations(currentCase.scenario, dict);

  const shuffledOptions = shuffleArray(currentCase.options);
  els.credibilityOptions.innerHTML = shuffledOptions
    .map(
      (opt) => `
      <button
        type="button"
        class="credibility-option"
        data-option-id="${opt.id}"
        data-option-type="${opt.type}"
        ${credibilityAnswered ? "disabled" : ""}
      >
        <span class="credibility-option__text">${linkifyAbbreviations(opt.label, dict)}</span>
      </button>
    `
    )
    .join("");
}

function handleCredibilityChoice(optionId) {
  if (credibilityAnswered || credibilityFinished) return;

  const currentCase = credibilityRoundCases[credibilityCaseIndex];
  const option = currentCase?.options.find((o) => o.id === optionId);
  if (!option) return;

  clearCredibilityAdvanceTimer();
  credibilityAnswered = true;
  const scoreBefore = credibilityScore;
  applyCredibilityDelta(option.delta);
  updateCredibilityBar();
  pokeHubAvatar(option.type, option.avatar);

  els.credibilityOptions.querySelectorAll(".credibility-option").forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.optionId === optionId) {
      btn.classList.add("credibility-option--picked");
      btn.classList.add(`credibility-option--feedback-${option.type}`);
    }
  });

  const deltaLabel = option.delta > 0 ? `+${option.delta}%` : `${option.delta}%`;
  els.credibilityResult.textContent = `Credibilidad ${deltaLabel} (${scoreBefore}% → ${credibilityScore}%).`;

  if (credibilityScore <= CREDIBILITY_FAIL_THRESHOLD) {
    handleCredibilityEarlyFail();
    return;
  }

  credibilityAdvanceTimer = window.setTimeout(() => {
    credibilityAdvanceTimer = null;
    credibilityCaseIndex += 1;
    credibilityAnswered = false;
    els.credibilityResult.textContent = "";

    if (credibilityCaseIndex >= CREDIBILITY_ROUND_SIZE) {
      finishCredibilityRound();
      renderCredibility();
      return;
    }

    renderCredibility();
  }, 1400);
}

function startNewCredibilityRound() {
  initCredibilityRound();
  renderCredibility();
}

function resetCredibility() {
  startNewCredibilityRound();
}

/* ── Panel del profesor ── */
function renderProfessorCards(registry, store) {
  const userIds = Object.keys(registry.users);

  if (userIds.length === 0) {
    els.professorStats.innerHTML = `
      <article class="professor-card professor-card--lavender">
        <h4 class="professor-card__title">Sin alumnos registrados</h4>
        <p class="professor-card__meta">Los datos aparecerán cuando los alumnos entren con su matrícula.</p>
      </article>
    `;
    return;
  }

  els.professorStats.innerHTML = userIds
    .map((userId) => {
      const profile = registry.users[userId];
      const userStats = store[userId] ?? {};
      const glp1 = userStats.glp1 ?? createDefaultDrugStats();
      const cred = glp1.credibility ?? { attempts: 0, runs: [] };
      const runs = cred.runs ?? [];
      const avg = getCredibilityAverage(cred);
      const idLine = profile.studentId ? ` · ${profile.studentId}` : "";
      return `
        <article class="professor-card professor-card--yellow">
          <h4 class="professor-card__title">${escapeHtml(profile.name)}${escapeHtml(idLine)}</h4>
          <p class="professor-card__value">${avg ?? "—"}${avg === null ? "" : "%"}</p>
          <p class="professor-card__meta">
            Candado: ${glp1.lock?.passed ? "✓" : "—"} (${glp1.lock?.attempts ?? 0} intentos) ·
            Credibilidad: ${runs.length} intento(s) · Promedio ${avg ?? "—"}${avg === null ? "" : "%"}
          </p>
        </article>
      `;
    })
    .join("");
}

function updateProfessorSubtitle() {
  if (!els.professorSubtitle) return;
  els.professorSubtitle.textContent = serverSyncEnabled
    ? "Datos del servidor · todos los alumnos del curso"
    : "Datos de este navegador · activa el servidor para ver a todos";
}

function setProfessorAuthVisible(visible) {
  if (!els.professorAuth) return;
  els.professorAuth.hidden = !visible;
  if (visible) {
    els.professorStats.innerHTML = "";
    els.professorKeyInput?.focus();
  }
}

async function loadProfessorPanelData() {
  updateProfessorSubtitle();

  if (serverSyncEnabled && !professorApiKey) {
    setProfessorAuthVisible(true);
    return;
  }

  setProfessorAuthVisible(false);

  if (serverSyncEnabled) {
    try {
      const data = await fetchProfessorDataFromServer(professorApiKey);
      renderProfessorCards({ users: data.users }, data.stats);
      return;
    } catch (error) {
      professorApiKey = "";
      sessionStorage.removeItem(PROFESSOR_KEY_STORAGE);
      els.professorStats.innerHTML = `
        <article class="professor-card professor-card--lavender">
          <h4 class="professor-card__title">No se pudo cargar</h4>
          <p class="professor-card__meta">${escapeHtml(error.message || "Error de conexión")}</p>
        </article>
      `;
      setProfessorAuthVisible(true);
      return;
    }
  }

  renderProfessorCards(readUsersRegistry(), readAllStatsStore());
}

async function handleProfessorAuthSubmit(event) {
  event.preventDefault();
  const key = els.professorKeyInput?.value?.trim() ?? "";
  if (!key) return;

  professorApiKey = key;
  sessionStorage.setItem(PROFESSOR_KEY_STORAGE, key);
  await loadProfessorPanelData();
}

async function renderProfessorPanel() {
  await loadProfessorPanelData();
}

function openProfessorPanel() {
  renderProfessorPanel();
  els.professorOverlay.hidden = false;
  els.professorOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (serverSyncEnabled && !professorApiKey) {
    els.professorKeyInput?.focus();
  } else {
    els.professorClose.focus();
  }
}

function closeProfessorPanel() {
  els.professorOverlay.hidden = true;
  els.professorOverlay.setAttribute("aria-hidden", "true");
  if (els.modalOverlay.hidden) document.body.style.overflow = "";
}

function getAbbrevDictionary(viewId = activeView) {
  if (viewId === "mechanism") return PHARMA_DATA?.abbreviations ?? null;
  if (viewId === "nutrition") return PHARMACO_NUTRITION?.abbreviations ?? null;
  if (viewId === "sideEffects") return PHARMACO_SIDE_EFFECTS?.abbreviations ?? null;
  if (viewId === "architect") return getActiveModule()?.architect?.abbreviations ?? null;
  if (viewId === "credibility") return getActiveModule()?.credibility?.abbreviations ?? null;
  if (viewId === "lock") return getActiveModule()?.physiologyLock?.abbreviations ?? null;
  return null;
}

function getAbbrevFromKey(key, viewId = activeView) {
  return getAbbrevDictionary(viewId)?.[key] ?? null;
}

function handleSiglaClick(event) {
  const btn = event.target.closest(".text-link-sigla");
  if (!btn) return;

  let viewId = "mechanism";
  if (btn.closest("#nutrition-card")) viewId = "nutrition";
  if (btn.closest("#side-effects-card")) viewId = "sideEffects";
  if (btn.closest("#view-architect")) viewId = "architect";
  if (btn.closest("#view-credibility")) viewId = "credibility";
  if (btn.closest("#physiology-lock")) viewId = "lock";

  const abbr = getAbbrevFromKey(btn.dataset.abbrKey, viewId);
  if (abbr) openModal(abbr);
}

/* ── Modal ── */
function openModal(abbr) {
  lastFocusedElement = document.activeElement;
  els.modalAcronym.textContent = abbr.acronym;
  els.modalFullName.textContent = abbr.fullName;
  els.modalBody.innerHTML = `
    <p><strong>¿Qué es?</strong> ${escapeHtml(abbr.what)}</p>
    <p><strong>¿Qué hace aquí?</strong> ${escapeHtml(abbr.role)}</p>
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
  els.professorClose?.addEventListener("click", closeProfessorPanel);
  els.professorAuth?.addEventListener("submit", handleProfessorAuthSubmit);
  els.professorOverlay?.addEventListener("click", (e) => {
    if (e.target === els.professorOverlay) closeProfessorPanel();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!els.userRegisterOverlay.hidden) closeRegisterModal();
      else if (!els.userMetricsOverlay.hidden) closeUserMetricsPanel();
      else if (!els.professorOverlay.hidden) closeProfessorPanel();
      else if (!els.modalOverlay.hidden) closeModal();
    }
    if (e.shiftKey && (e.key === "P" || e.key === "p")) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      if (els.professorOverlay.hidden) openProfessorPanel();
      else closeProfessorPanel();
    }
  });
  els.viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });
  els.drugPickers.forEach((btn) => {
    btn.addEventListener("click", () => selectDrug(btn.dataset.drug));
  });
  els.btnBackMenu.addEventListener("click", showDrugMenu);
  els.btnOpenRegister?.addEventListener("click", openRegisterModal);
  els.btnMyMetrics?.addEventListener("click", openUserMetricsPanel);
  els.btnDownloadMetricsPdf?.addEventListener("click", downloadMetricsPdf);
  els.btnSwitchUser?.addEventListener("click", switchUser);
  els.registerForm?.addEventListener("submit", handleRegisterSubmit);
  els.registerDeviceUsers?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-resume-user]");
    if (btn) resumeExistingUser(btn.dataset.resumeUser);
  });
  els.registerClose?.addEventListener("click", closeRegisterModal);
  els.userRegisterOverlay?.addEventListener("click", (e) => {
    if (e.target === els.userRegisterOverlay) closeRegisterModal();
  });
  els.userMetricsClose?.addEventListener("click", closeUserMetricsPanel);
  els.userMetricsOverlay?.addEventListener("click", (e) => {
    if (e.target === els.userMetricsOverlay) closeUserMetricsPanel();
  });
  document.addEventListener("click", handleSiglaClick);
  window.addEventListener("resize", drawConnections);

  els.lockSubmit?.addEventListener("click", submitPhysiologyLock);
  els.lockRetry?.addEventListener("click", retryPhysiologyLock);
  els.lockTerms?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-term-id]");
    if (btn) handleLockTermClick(btn.dataset.termId);
  });
  els.lockDefinitions?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-def-id]");
    if (btn) handleLockDefClick(btn.dataset.defId);
  });

  els.architectToolbox?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-piece-id]");
    if (btn && btn.closest("#architect-toolbox")) movePieceToCanvas(btn.dataset.pieceId);
  });
  els.architectCanvas?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-piece-id]");
    if (btn && btn.closest("#architect-canvas") && !btn.classList.contains("architect-canvas__empty")) {
      movePieceToToolbox(btn.dataset.pieceId);
    }
  });
  els.architectValidate?.addEventListener("click", validateArchitect);
  els.architectReset?.addEventListener("click", resetArchitect);

  els.credibilityOptions?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-option-id]");
    if (btn) handleCredibilityChoice(btn.dataset.optionId);
  });
  els.credibilityNewRound?.addEventListener("click", startNewCredibilityRound);
}

init();
