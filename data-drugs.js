/**
 * Módulos de datos por fármaco — Farma Básica
 */
const DRUG_MODULES = {
  metformina: {
    hasSideEffectsTab: false,
    pharmaData: {
      drug: {
        title: "Metformina",
        subtitle: "Biguanida · 1ª línea en diabetes tipo 2",
      },
      diagram: {
        rows: [["farmaco"], ["receptor"], ["via"], ["terapeutico", "adverso"]],
        connections: [
          { from: "farmaco", to: "receptor" },
          { from: "receptor", to: "via" },
          { from: "via", to: "terapeutico" },
          { from: "via", to: "adverso" },
        ],
      },
      steps: [
        {
          id: "farmaco",
          label: "Fármaco",
          sublabel: "Oral · Renal",
          shape: "pill",
          color: "sky",
          title: "Fármaco — ¿Qué es y cómo llega al cuerpo?",
          abbrevKeys: ["OCT1"],
          bullets: [
            "Biguanida oral, primera línea en diabetes tipo 2.",
            "Se absorbe en el intestino, no se metaboliza en el hígado y se elimina por el riñón.",
            "Transporte principal por OCT1 (y otros transportadores en riñón: OCT2/MATE1).",
          ],
          clinicalTip:
            "No estimula insulina → no causa hipoglucemia en monoterapia (a diferencia de sulfonilureas).",
        },
        {
          id: "receptor",
          label: "Diana",
          sublabel: "Complejo I",
          shape: "rounded",
          color: "teal",
          title: "Diana — Complejo I mitocondrial",
          abbrevKeys: ["Cx I", "AMPK", "SUR1", "KATP"],
          bullets: [
            "Bloquea el complejo I de la mitocondria (cadena respiratoria).",
            "Eso reduce ATP y aumenta AMP → activa AMPK (sensor de energía celular).",
            "No actúa en SUR1/KATP (diana de las sulfonilureas).",
          ],
          clinicalTip:
            "En examen: metformina ≠ sulfonilureas. SUR1/KATP cierran canales en β-célula y suben insulina.",
        },
        {
          id: "via",
          label: "Efecto",
          sublabel: "Intestino · Músculo · Hígado",
          shape: "circle",
          color: "lavender",
          title: "Efecto — ¿Dónde actúa?",
          abbrevKeys: ["GLUT4", "GLP-1R", "AMPK"],
          bullets: [
            "Intestino: menos absorción de glucosa; más GLP-1.",
            "Músculo: AMPK sube GLUT4 → entra más glucosa.",
            "Hígado: menos producción de glucosa (gluconeogénesis).",
          ],
          clinicalTip:
            "A largo plazo, el efecto más importante es que el músculo use más glucosa.",
        },
        {
          id: "terapeutico",
          label: "Beneficio",
          sublabel: "Control glucémico",
          shape: "arc",
          color: "yellow",
          title: "Efecto terapéutico",
          abbrevKeys: [],
          bullets: [
            "Baja glucosa en ayunas y HbA1c.",
            "Mejora sensibilidad a la insulina sin hipoglucemia en monoterapia.",
            "UKPDS: menos complicaciones y mortalidad vs sulfonilureas/insulina en DM2 con sobrepeso.",
          ],
          clinicalTip:
            "1ª línea en DM2. Único oral clásico con beneficio cardiovascular demostrado (UKPDS).",
        },
        {
          id: "adverso",
          label: "Riesgo",
          sublabel: "GI · B12",
          shape: "rounded",
          color: "coral",
          title: "Efectos adversos",
          abbrevKeys: ["B12"],
          bullets: [
            "Frecuentes: náuseas, diarrea, molestias abdominales (mejoran con titulación y comida).",
            "Raro y grave: acidosis láctica si falla el riñón (IRA, eGFR bajo, contraste yodado).",
            "Crónico: puede causar deficiencia de vitamina B12.",
          ],
          clinicalTip:
            "Acidosis láctica: lactato alto, sin cetonuria (≠ cetoacidosis). Suspender si hay IRA.",
        },
      ],
      abbreviations: {
        OCT1: {
          acronym: "OCT1",
          fullName: "Organic cation transporter 1",
          what: "Transportador que lleva metformina al intestino, hígado y otros tejidos.",
          role: "Clave para absorción oral y distribución del fármaco.",
        },
        "Cx I": {
          acronym: "Cx I",
          fullName: "Complejo I mitocondrial",
          what: "Primera enzima de la cadena respiratoria; produce ATP.",
          role: "Diana principal de la metformina: al bloquearlo sube AMP y se activa AMPK.",
        },
        AMPK: {
          acronym: "AMPK",
          fullName: "Quinasa activada por AMP",
          what: "Sensor celular de energía; se enciende cuando hay poco ATP.",
          role: "En músculo sube GLUT4; en hígado ayuda a bajar producción de glucosa.",
        },
        GLUT4: {
          acronym: "GLUT4",
          fullName: "Transportador de glucosa tipo 4",
          what: "Proteína que mete glucosa al músculo y tejido adiposo.",
          role: "Metformina (vía AMPK) aumenta GLUT4 en membrana → más captación de glucosa.",
        },
        "GLP-1R": {
          acronym: "GLP-1R",
          fullName: "Receptor de GLP-1",
          what: "Receptor de la incretina GLP-1 en intestino, páncreas y cerebro.",
          role: "Metformina aumenta GLP-1 intestinal → ayuda a bajar glucosa hepática.",
        },
        SUR1: {
          acronym: "SUR1",
          fullName: "Receptor de sulfonilurea 1",
          what: "Subunidad del canal KATP en células β del páncreas.",
          role: "Diana de sulfonilureas, NO de metformina. Comparación clínica en examen.",
        },
        KATP: {
          acronym: "KATP",
          fullName: "Canal de potasio sensible a ATP",
          what: "Canal que mantiene la β-célula en reposo.",
          role: "Las sulfonilureas lo cierran vía SUR1 → liberan insulina → riesgo de hipoglucemia.",
        },
        B12: {
          acronym: "B12",
          fullName: "Vitamina B12 (cobalamina)",
          what: "Vitamina para sangre y nervios; se absorbe en íleon con factor intrínseco.",
          role: "Metformina crónica puede reducir B12 → anemia y neuropatía.",
        },
      },
    },
    nutrition: {
      source: {
        full:
          "Huynh DT, Nguyen NT, Do MD (2024). Vitamin B12 deficiency in diabetic patients treated with metformin. PLoS ONE 19(4): e0302500.",
        doi: "10.1371/journal.pone.0302500",
      },
      categories: [
        {
          id: "peso",
          label: "Alteración de Peso",
          hint: "Balance energético",
          color: "yellow",
          title: "Sitio y Mecanismo ➔ Alteración de Peso",
          cascades: [
            {
              mechanism:
                "Metformina mejora control glucémico sin estimular insulina en exceso.",
              effect: "→ Peso neutro o modesta pérdida vs sulfonilureas/insulina.",
              cite: "Huynh et al., 2024, Introducción (refs. 6–7).",
            },
            {
              mechanism: "En el estudio, el BMI no difería con o sin deficiencia de B12.",
              effect: "→ La depleción de B12 no se tradujo en cambio de peso aquí.",
              cite: "Huynh et al., 2024, Tabla 1 (p=0.29).",
            },
          ],
          clinicalTip:
            "Metformina no suele subir peso. Aun así, vigilar B12 en uso prolongado.",
        },
        {
          id: "nutrientes",
          label: "Alteración de Nutrientes",
          hint: "Vitamina B12",
          color: "teal",
          title: "Sitio y Mecanismo ➔ Alteración de Nutrientes",
          cascades: [
            {
              mechanism:
                "Metformina ↓ factor intrínseco y absorción del complejo IF-B12 en íleon.",
              effect: "→ Deficiencia de B12 en 18.6% de pacientes (<300 pg/mL).",
              cite: "Huynh et al., 2024, Introducción (refs. 8,9); Resultados.",
            },
            {
              mechanism: "Dosis ≥1000 mg/día y uso ≥48 meses aumentan el riesgo.",
              effect: "→ OR 4.10 (dosis alta); OR 5.25 (dosis alta + uso prolongado).",
              cite: "Huynh et al., 2024, Tablas 2–3.",
            },
            {
              mechanism: "B12 baja crónica → anemia, hipoacusia, neuropatía.",
              effect: "→ Puede confundirse con neuropatía diabética.",
              cite: "Huynh et al., 2024, Introducción (refs. 10,11).",
            },
          ],
          clinicalTip:
            "Medir B12 anual en uso crónico (ref. 18 ADA, citada por Huynh). Alto riesgo: ≥1000 mg/día y ≥4 años.",
        },
        {
          id: "apetito",
          label: "Alteración de Apetito",
          hint: "Tolerancia · GI",
          color: "coral",
          title: "Sitio y Mecanismo ➔ Alteración de Apetito",
          cascades: [
            {
              mechanism: "Efectos adversos de metformina reducen tolerancia al fármaco.",
              effect: "→ Hiporexia o abandono del tratamiento.",
              cite: "Huynh et al., 2024, Introducción.",
            },
            {
              mechanism: "Malabsorción ileal (↓ IF, ácidos biliares) → molestias GI.",
              effect: "→ Saciedad precoz y menor ingesta.",
              cite: "Huynh et al., 2024, Introducción (refs. 8,9).",
            },
            {
              mechanism: "Neuropatía por B12 baja puede afectar vías autonómicas.",
              effect: "→ Alteración del ritmo de apetito.",
              cite: "Huynh et al., 2024, refs. 10,11,32.",
            },
          ],
          clinicalTip:
            "Pérdida de apetito crónica con metformina: medir B12 antes de atribuir todo a neuropatía diabética.",
        },
        {
          id: "gusto",
          label: "Alteración de Gusto",
          hint: "Neuropatía · B12",
          color: "lavender",
          title: "Sitio y Mecanismo ➔ Alteración de Gusto y Sabor",
          cascades: [
            {
              mechanism: "Deficiencia de B12 → neuropatía sensorial periférica.",
              effect: "→ Disgeusia, parestesias orales o sabor metálico.",
              cite: "Huynh et al., 2024, Introducción (refs. 10,11).",
            },
            {
              mechanism: "B12 baja también se asocia a hipoacusia.",
              effect: "→ Alteración de vías sensoriales (gusto y audición).",
              cite: "Huynh et al., 2024, Introducción.",
            },
            {
              mechanism: "↑ homocisteína por déficit de B12 daña nervios.",
              effect: "→ Empeora síntomas sensitivos incluido gusto.",
              cite: "Huynh et al., 2024, Discusión (ref. 30).",
            },
          ],
          clinicalTip:
            "Disgeusia + DM2 + metformina crónica: descartar B12 (<300 pg/mL en el estudio).",
        },
      ],
      abbreviations: {
        B12: {
          acronym: "B12",
          fullName: "Vitamina B12 (cobalamina)",
          what: "Vitamina esencial para eritropoyesis y función nerviosa.",
          role: "Deficiencia en 18.6% con metformina (Huynh et al., 2024).",
        },
        IF: {
          acronym: "IF",
          fullName: "Factor intrínseco",
          what: "Proteína gástrica que transporta B12 al íleon.",
          role: "Metformina ↓ IF → malabsorción de B12 (refs. 8,9).",
        },
        Cubilina: {
          acronym: "Cubilina",
          fullName: "Receptor cubilina (ileal)",
          what: "Receptor que internaliza el complejo IF-B12 en enterocitos.",
          role: "Metformina interfiere su unión → menos absorción (refs. 8,9).",
        },
      },
    },
    sideEffects: null,
  },

  glp1: {
    hasSideEffectsTab: true,
    hasGamificationTabs: true,
    requiresPhysiologyLock: true,
    pharmaData: {
      drug: {
        title: "Agonistas GLP-1",
        subtitle: "Incretinas · Obesidad y diabetes tipo 2",
      },
      diagram: {
        rows: [["farmaco"], ["receptor"], ["via"], ["terapeutico", "adverso"]],
        connections: [
          { from: "farmaco", to: "receptor", label: "activa" },
          { from: "receptor", to: "via", label: "señaliza" },
          { from: "via", to: "terapeutico", label: "beneficio" },
          { from: "via", to: "adverso", label: "riesgo" },
        ],
      },
      steps: [
        {
          id: "farmaco",
          label: "Fármaco",
          sublabel: "SC · Oral",
          shape: "pill",
          color: "sky",
          title: "Fármaco — ¿Qué son y cómo llegan al cuerpo?",
          abbrevKeys: ["GLP-1", "DPP-4", "SC"],
          bullets: [
            "Análogos sintéticos de GLP-1 (p. ej. semaglutide, liraglutide, exenatide).",
            "Vía SC (subcutánea, semanal o diaria) u oral (semaglutide con potenciador de absorción).",
            "Modificados para resistir DPP-4 → mayor duración que la incretina endógena (≠ iDPP-4).",
          ],
          clinicalTip:
            "En examen: GLP-1RA imita la hormona; los iDPP-4 elevan GLP-1 endógena (mecanismo distinto).",
        },
        {
          id: "receptor",
          label: "Diana",
          sublabel: "GLP-1R",
          shape: "rounded",
          color: "teal",
          title: "Diana — Receptor GLP-1 (GLP-1R)",
          abbrevKeys: ["GLP-1R", "GPCR", "Gs", "cAMP", "PKA"],
          bullets: [
            "GLP-1R es un GPCR en páncreas, cerebro, estómago e hígado.",
            "Acopla a Gs → ↑ cAMP → activa PKA (vía clásica de señalización).",
            "En células β del páncreas: efecto dependiente de glucosa (más insulina solo si hay hiperglucemia).",
          ],
          clinicalTip:
            "GLP-1R en hipotálamo (POMC/CART, MC4R) explica ↓ apetito; en β-célula explica control en DM2.",
        },
        {
          id: "via",
          label: "Efecto",
          sublabel: "Páncreas · Cerebro · GI",
          shape: "circle",
          color: "lavender",
          title: "Efecto — ¿Dónde actúa?",
          abbrevKeys: ["GLP-1R", "POMC", "CART", "MC4R", "NPY", "AgRP", "GI", "DM2"],
          bullets: [
            "Páncreas: GLP-1R en células β → ↑ insulina y ↓ glucagon (restaura efecto incretínico en DM2).",
            "Cerebro (hipotálamo): GLP-1R activa neuronas POMC/CART → α-MSH → MC4R → señal anorexígena (saciedad).",
            "Cerebro: GLP-1R inhibe neuronas orexígenas NPY/AgRP → ↓ impulso de comer.",
            "Cerebro (recompensa): GLP-1R en corteza orbitofrontal ↓ ingesta hedónica, no solo hambre metabólica.",
            "Reflejo vagal: GLP-1 intestinal activa vías autónomas hacia tronco encefálico → modula apetito y páncreas.",
            "GI: retrasa vaciado gástrico → plenitud precoz y menor pico postprandial de glucosa.",
          ],
          clinicalTip:
            "Pérdida de peso: combina control central del apetito (POMC/MC4R, NPY/AgRP) + efecto GI periférico.",
        },
        {
          id: "terapeutico",
          label: "Beneficio",
          sublabel: "Peso · Glucosa · Hígado",
          shape: "arc",
          color: "yellow",
          title: "Efecto terapéutico",
          abbrevKeys: ["HbA1c", "MASLD", "MASH", "DM2", "GLP-1RA"],
          bullets: [
            "Pérdida de peso placebo-ajustada ~5–18% con GLP-1RA (semaglutide, liraglutide, tirzepatide).",
            "Mejora HbA1c, presión arterial y perfil lipídico; beneficio cardiovascular en ensayos de desenlace en DM2.",
            "Reduce esteatosis hepática y puede mejorar MASLD/MASH en biopsia.",
          ],
          clinicalTip:
            "Semaglutide 2.4 mg y liraglutide 3 mg aprobados para obesidad; dosis menores para DM2.",
        },
        {
          id: "adverso",
          label: "Riesgo",
          sublabel: "GI · Nutrición",
          shape: "rounded",
          color: "coral",
          title: "Efectos adversos (visión general)",
          abbrevKeys: ["GI", "GLP-1RA", "DM2"],
          bullets: [
            "Frecuentes (GI): náuseas, vómito, diarrea, estreñimiento y dolor abdominal al iniciar o subir dosis.",
            "Metabólico-nutricional: menor ingesta → déficit proteico/micronutrientes; ~25% del peso perdido puede ser masa magra.",
            "Raros: pancreatitis, enfermedad biliar; hipoglucemia en DM2 si se combina con insulina o sulfonilureas.",
          ],
          clinicalTip:
            "Titular GLP-1RA lentamente + nutrición estructurada reduce abandono y desnutrición.",
        },
      ],
      abbreviations: {
        "GLP-1": {
          acronym: "GLP-1",
          fullName: "Péptido similar al glucagón 1",
          what: "Incretina secretada por células L del intestino tras la comida.",
          role: "Estimula insulina, inhibe glucagon y reduce apetito; los agonistas lo imitan.",
        },
        "GLP-1R": {
          acronym: "GLP-1R",
          fullName: "Receptor de GLP-1",
          what: "GPCR expresado en páncreas, cerebro, estómago, hígado y riñón.",
          role: "Diana principal de semaglutide, liraglutide y otros GLP-1RA.",
        },
        "GLP-1RA": {
          acronym: "GLP-1RA",
          fullName: "Agonistas del receptor de GLP-1",
          what: "Fármacos que activan GLP-1R (p. ej. semaglutide, liraglutide, exenatide).",
          role: "Imitan la incretina con mayor duración que el GLP-1 endógeno.",
        },
        "DPP-4": {
          acronym: "DPP-4",
          fullName: "Dipeptidil peptidasa-4",
          what: "Enzima que degrada GLP-1 endógeno en minutos.",
          role: "Los análogos resisten DPP-4; los iDPP-4 prolongan GLP-1 natural.",
        },
        "iDPP-4": {
          acronym: "iDPP-4",
          fullName: "Inhibidores de DPP-4",
          what: "Fármacos que elevan GLP-1 endógena al bloquear su degradación.",
          role: "Mecanismo distinto a GLP-1RA: no imitan la hormona, la prolongan.",
        },
        SC: {
          acronym: "SC",
          fullName: "Subcutánea",
          what: "Vía de administración bajo la piel.",
          role: "Forma habitual de semaglutide, liraglutide y exenatide inyectables.",
        },
        GPCR: {
          acronym: "GPCR",
          fullName: "Receptor acoplado a proteína G",
          what: "Familia de receptores de membrana que activan vías intracelulares vía Gs/Gi/Gq.",
          role: "GLP-1R es un GPCR; al ligarse activa principalmente Gs.",
        },
        Gs: {
          acronym: "Gs",
          fullName: "Proteína G estimuladora",
          what: "Subunidad G que activa adenilato ciclasa.",
          role: "GLP-1R → Gs → ↑ cAMP → PKA en páncreas y otros tejidos.",
        },
        cAMP: {
          acronym: "cAMP",
          fullName: "AMP cíclico",
          what: "Segundo mensajero intracelular tras activación de Gs.",
          role: "En β-célula activa vías que liberan insulina de forma dependiente de glucosa.",
        },
        PKA: {
          acronym: "PKA",
          fullName: "Quinasa activada por proteína A",
          what: "Enzima activada por cAMP.",
          role: "Mediador clave de la señal GLP-1R en páncreas y otros tejidos.",
        },
        POMC: {
          acronym: "POMC",
          fullName: "Proopiomelanocortina",
          what: "Precursor proteico en neuronas anorexígenas del hipotálamo.",
          role: "GLP-1RA activan POMC → α-MSH → MC4R → saciedad.",
        },
        CART: {
          acronym: "CART",
          fullName: "Cocaine- and amphetamine-regulated transcript",
          what: "Neuropéptido coexpresado con POMC en neuronas anorexígenas.",
          role: "Contribuye a la señal de saciedad central con GLP-1RA.",
        },
        "α-MSH": {
          acronym: "α-MSH",
          fullName: "α-melanocyte stimulating hormone",
          what: "Péptido derivado de POMC con efecto anorexígeno.",
          role: "Activa MC4R → reduce ingesta calórica.",
        },
        MC4R: {
          acronym: "MC4R",
          fullName: "Receptor de melanocortina 4",
          what: "Receptor de señal anorexígena en el hipotálamo.",
          role: "Vía central clave de la pérdida de peso con GLP-1RA.",
        },
        NPY: {
          acronym: "NPY",
          fullName: "Neuropeptide Y",
          what: "Neuropéptido orexígeno del hipotálamo (núcleo arcuato).",
          role: "GLP-1RA inhiben vías NPY/AgRP → ↓ apetito.",
        },
        AgRP: {
          acronym: "AgRP",
          fullName: "Agouti-related peptide",
          what: "Neuropéptido orexígeno que antagoniza MC4R.",
          role: "Su inhibición por GLP-1RA contribuye a ↓ hambre.",
        },
        DM2: {
          acronym: "DM2",
          fullName: "Diabetes mellitus tipo 2",
          what: "Diabetes por resistencia a insulina y déficit relativo de secreción.",
          role: "Indicación principal de GLP-1RA; efecto incretínico restaurado.",
        },
        HbA1c: {
          acronym: "HbA1c",
          fullName: "Hemoglobina glicosilada",
          what: "Marcador de control glucémico a 2–3 meses.",
          role: "Los GLP-1RA la reducen por mejor secreción de insulina y menor glucagon.",
        },
        MASLD: {
          acronym: "MASLD",
          fullName: "Enfermedad hepática esteatótica asociada a disfunción metabólica",
          what: "Hígado graso no alcohólico con componente metabólico (antes NAFLD).",
          role: "Los GLP-1RA reducen esteatosis hepática, en parte por pérdida de peso.",
        },
        MASH: {
          acronym: "MASH",
          fullName: "Esteatohepatitis asociada a disfunción metabólica",
          what: "Forma inflamatoria de MASLD con daño hepatocelular (antes NASH).",
          role: "GLP-1RA pueden mejorar MASH en ensayos con biopsia.",
        },
        GI: {
          acronym: "GI",
          fullName: "Gastrointestinal",
          what: "Relacionado con estómago e intestino.",
          role: "Principal vía de efectos adversos y retraso del vaciado gástrico.",
        },
      },
    },
    nutrition: {
      source: {
        full:
          "Mozaffarian D et al. (2025). Nutritional priorities to support GLP-1 therapy for obesity. Am J Clin Nutr 122:344–367; Mogna-Peláez P, Guasch-Ferré M (2026). Avoiding Malnutrition in the Era of GLP-1 Medications. J Nutr 156:101684.",
        doi: "10.1016/j.ajcnut.2025.04.023; 10.1016/j.tjnut.2026.101684",
      },
      categories: [
        {
          id: "peso",
          label: "Alteración de Peso",
          hint: "Balance energético",
          color: "yellow",
          title: "Sitio y Mecanismo ➔ Alteración de Peso",
          cascades: [
            {
              mechanism:
                "GLP-1RA ↓ apetito (cerebro) y retrasa vaciado gástrico → ingesta calórica ↓ 16–39%.",
              effect: "→ Pérdida de peso ~5–18% en ensayos; en vida real suele ser algo menor.",
              cite: "Mozaffarian et al., 2025; Mogna-Peláez & Guasch-Ferré, 2026.",
            },
            {
              mechanism:
                "Sin acompañamiento nutricional, parte del peso perdido es masa magra (~25% del total).",
              effect: "→ Riesgo de sarcopenia, sobre todo en adultos mayores.",
              cite: "Mogna-Peláez & Guasch-Ferré, 2026.",
            },
          ],
          clinicalTip:
            "Combinar agonista GLP-1 con entrenamiento de fuerza y proteína adecuada protege masa muscular.",
        },
        {
          id: "nutrientes",
          label: "Alteración de Nutrientes",
          hint: "Proteína · Micronutrientes",
          color: "teal",
          title: "Sitio y Mecanismo ➔ Alteración de Nutrientes",
          cascades: [
            {
              mechanism:
                "Menor ingesta (<1200–1800 kcal/d) + náuseas → déficit de hierro, calcio, magnesio, zinc y vitaminas.",
              effect: "→ Deficiencias en 12.7% a 6 meses y 22.4% a 12 meses de uso.",
              cite: "Mozaffarian et al., 2025; Mogna-Peláez et al., 2026.",
            },
            {
              mechanism:
                "Solo 43% alcanzan ≥1.2 g/kg/d de proteína; muchos fallan vitamina D, potasio, magnesio e hierro.",
              effect: "→ Fatiga, caída del cabello, piel seca y debilidad muscular.",
              cite: "Mogna-Peláez & Guasch-Ferré, 2026.",
            },
          ],
          clinicalTip:
            "Priorizar comidas densas en nutrientes y proteína; vigilar B12 si también toman metformina.",
        },
        {
          id: "apetito",
          label: "Alteración de Apetito",
          hint: "Saciedad · Náusea",
          color: "coral",
          title: "Sitio y Mecanismo ➔ Alteración de Apetito",
          cascades: [
            {
              mechanism:
                "Activación central de GLP-1R en hipotálamo → saciedad precoz y aversión a ciertos alimentos.",
              effect: "→ Hiporexia marcada; difícil completar comidas habituales.",
              cite: "Giannakogeorgou & Roden, 2024; Mozaffarian et al., 2025.",
            },
            {
              mechanism:
                "Náusea y plenitud gástrica en titulación → abandono en 50–85% a 1–2 años.",
              effect: "→ Recuperación ponderal si se suspende sin plan nutricional.",
              cite: "Mozaffarian et al., 2025.",
            },
          ],
          clinicalTip:
            "Comidas pequeñas, frecuentes y ricas en proteína al inicio mejoran tolerancia.",
        },
        {
          id: "gusto",
          label: "Alteración de Alimentación",
          hint: "Preferencias · Fibra",
          color: "lavender",
          title: "Sitio y Mecanismo ➔ Alteración de Alimentación y Gusto",
          cascades: [
            {
              mechanism: "Síntomas GI y baja ingesta → menos fibra y líquidos.",
              effect: "→ Estreñimiento, distensión y ciclo de menor ingesta.",
              cite: "Mogna-Peláez & Guasch-Ferré, 2026.",
            },
            {
              mechanism:
                "Comidas «compatibles con GLP-1» suelen ser porciones pequeñas pero pobres en nutrientes.",
              effect: "→ Falsa sensación de dieta adecuada con riesgo de malnutrición.",
              cite: "Mogna-Peláez & Guasch-Ferré, 2026.",
            },
          ],
          clinicalTip:
            "Lo clave es densidad nutricional en porciones pequeñas, no solo comer menos.",
        },
      ],
      abbreviations: {
        B12: {
          acronym: "B12",
          fullName: "Vitamina B12 (cobalamina)",
          what: "Vitamina esencial para sangre y nervios.",
          role: "Vigilar con GLP-1RA por baja ingesta; mayor riesgo si también hay metformina.",
        },
        "GLP-1R": {
          acronym: "GLP-1R",
          fullName: "Receptor de GLP-1",
          what: "Receptor en hipotálamo, páncreas y tracto GI.",
          role: "Mediador central de saciedad con GLP-1RA.",
        },
        "GLP-1RA": {
          acronym: "GLP-1RA",
          fullName: "Agonistas del receptor de GLP-1",
          what: "Fármacos activadores de GLP-1R.",
          role: "↓ apetito central y retraso del vaciado gástrico GI.",
        },
        GI: {
          acronym: "GI",
          fullName: "Gastrointestinal",
          what: "Estómago e intestino.",
          role: "Náuseas y estreñimiento por menor ingesta y vaciado lento.",
        },
      },
    },
    sideEffects: {
      source: {
        full:
          "Mozaffarian D et al. (2025). Am J Clin Nutr 122:344–367; Mogna-Peláez P, Guasch-Ferré M (2026). J Nutr 156:101684.",
        doi: "10.1016/j.ajcnut.2025.04.023; 10.1016/j.tjnut.2026.101684",
      },
      categories: [
        {
          id: "gi",
          label: "Efectos Gastrointestinales",
          hint: "Náusea · Vómito · Motilidad",
          color: "coral",
          title: "Efectos adversos ➔ Gastrointestinales",
          cascades: [
            {
              mechanism:
                "GLP-1RA retrasa vaciado gástrico y modulan centros cerebrales de náusea.",
              effect: "→ Náuseas (25–44%), diarrea (19–30%), vómito (8–24%), estreñimiento (17–24%).",
              cite: "Mozaffarian et al., 2025, Tabla 2.",
            },
            {
              mechanism: "Síntomas más frecuentes al iniciar y escalar dosis.",
              effect: "→ Suelen mejorar con dosis estable; adherencia es reto en práctica clínica.",
              cite: "Mozaffarian et al., 2025.",
            },
          ],
          clinicalTip:
            "Titulación lenta y comidas fraccionadas reducen náuseas al inicio.",
        },
        {
          id: "metabolicos",
          label: "Efectos Metabólicos",
          hint: "Hipoglucemia · Páncreas",
          color: "yellow",
          title: "Efectos adversos ➔ Metabólicos",
          cascades: [
            {
              mechanism: "↑ insulina + uso con insulina o sulfonilureas.",
              effect: "→ Hipoglucemia posible en DM2.",
              cite: "Mozaffarian et al., 2025.",
            },
            {
              mechanism: "Pérdida ponderal rápida → cambios biliares.",
              effect: "→ Riesgo de litiasis/colecistitis; pancreatitis aguda (rara).",
              cite: "Mozaffarian et al., 2025.",
            },
          ],
          clinicalTip:
            "En DM2: reducir insulina o sulfonilurea al iniciar GLP-1RA.",
        },
        {
          id: "nutricionales",
          label: "Efectos sobre Nutrición",
          hint: "Masa magra · Malnutrición",
          color: "teal",
          title: "Efectos adversos ➔ Nutrición y Alimentación",
          cascades: [
            {
              mechanism: "Ingesta muy baja sin guía dietética.",
              effect: "→ Malnutrición: debilidad, caída del cabello, anemia y fatiga.",
              cite: "Mogna-Peláez & Guasch-Ferré, 2026.",
            },
            {
              mechanism: "Masa magra ~25% del peso perdido.",
              effect: "→ Sarcopenia funcional, especialmente en ≥65 años.",
              cite: "Mogna-Peláez & Guasch-Ferré, 2026.",
            },
          ],
          clinicalTip:
            "Objetivo proteico 1.2–1.5 g/kg/d + entrenamiento de fuerza.",
        },
        {
          id: "otros",
          label: "Otros Relacionados",
          hint: "Cabello · Fatiga",
          color: "lavender",
          title: "Efectos adversos ➔ Otros síntomas",
          cascades: [
            {
              mechanism: "Déficit nutricional subclínico.",
              effect: "→ Alopecia, fatiga, cefalea y mareo.",
              cite: "Mozaffarian et al., 2025, Tabla 2.",
            },
          ],
          clinicalTip:
            "Fatiga o caída del cabello: descartar déficit proteico/hierro/B12.",
        },
      ],
      abbreviations: {
        GI: {
          acronym: "GI",
          fullName: "Gastrointestinal",
          what: "Efectos sobre estómago e intestino.",
          role: "Principal limitante de tolerancia con GLP-1RA.",
        },
        "GLP-1R": {
          acronym: "GLP-1R",
          fullName: "Receptor de GLP-1",
          what: "Receptor en tracto GI y área postrema.",
          role: "Retardo del vaciado gástrico y vías de náusea central.",
        },
        "GLP-1RA": {
          acronym: "GLP-1RA",
          fullName: "Agonistas del receptor de GLP-1",
          what: "Fármacos activadores de GLP-1R.",
          role: "Causa principal de efectos GI y metabólicos discutidos aquí.",
        },
        DM2: {
          acronym: "DM2",
          fullName: "Diabetes mellitus tipo 2",
          what: "Diabetes por resistencia a insulina.",
          role: "Riesgo de hipoglucemia si GLP-1RA se combina con insulina o sulfonilureas.",
        },
        HbA1c: {
          acronym: "HbA1c",
          fullName: "Hemoglobina glicosilada",
          what: "Marcador de control glucémico.",
          role: "Contexto metabólico: hipoglucemia más probable con insulinoterapia.",
        },
        B12: {
          acronym: "B12",
          fullName: "Vitamina B12 (cobalamina)",
          what: "Vitamina esencial para sangre y nervios.",
          role: "Descartar déficit si hay fatiga o caída del cabello con GLP-1RA.",
        },
      },
    },
    physiologyLock: {
      title: "Candado fisiológico — GLP-1 basal",
      intro:
        "Antes de estudiar el fármaco, empareja cada concepto con su función en la fisiología normal del GLP-1 (Nadkarni et al., 2014).",
      failMessage: "Debes leer más",
      pairs: [
        {
          id: "celulas-l",
          term: "Células L",
          definition: "Secretan GLP-1 tras detectar azúcares, aminoácidos y grasas en el intestino",
        },
        {
          id: "dpp4",
          term: "DPP-4",
          definition: "Enzima que degrada GLP-1; su acción limita la vida media de la hormona a minutos",
        },
        {
          id: "beta",
          term: "GLP-1 en células β",
          definition: "Estimula insulina de forma dependiente de glucosa (solo si hay hiperglucemia)",
        },
        {
          id: "alfa",
          term: "GLP-1 en células α",
          definition: "Suprime la secreción de glucagon en el páncreas endocrino",
        },
        {
          id: "gi",
          term: "Efecto GI local",
          definition: "Retrasa el vaciado gástrico y activa reflejos entéricos tras la comida",
        },
        {
          id: "vago",
          term: "Reflejo vagal",
          definition: "Conecta el intestino con el tronco encefálico y el páncreas vía nervio vago",
        },
      ],
      abbreviations: {
        "GLP-1": {
          acronym: "GLP-1",
          fullName: "Péptido similar al glucagón 1",
          what: "Incretina intestinal secretada tras la ingesta.",
          role: "Regula glucosa, apetito y motilidad GI en fisiología normal.",
        },
        "DPP-4": {
          acronym: "DPP-4",
          fullName: "Dipeptidil peptidasa-4",
          what: "Enzima que inactiva GLP-1 en circulación.",
          role: "Explica la corta duración del GLP-1 endógeno.",
        },
        GI: {
          acronym: "GI",
          fullName: "Gastrointestinal",
          what: "Estómago e intestino.",
          role: "Sitio de secreción (células L) y de retraso del vaciado gástrico.",
        },
      },
    },
    architect: {
      title: "Modo Arquitecto",
      intro: "Ordena las piezas del mecanismo de acción de arriba (lienzo) a abajo (toolbox).",
      pieces: [
        { id: "farmaco", label: "Fármaco", hint: "Agonista GLP-1RA", color: "sky" },
        { id: "receptor", label: "Receptor", hint: "GLP-1R (GPCR)", color: "teal" },
        { id: "organo", label: "Órgano", hint: "Páncreas · Cerebro · GI", color: "lavender" },
        { id: "efecto", label: "Efecto", hint: "↓ Glucosa · ↓ Peso", color: "yellow" },
      ],
      correctOrder: ["farmaco", "receptor", "organo", "efecto"],
      successMessage: "¡Secuencia correcta! Fármaco → Receptor → Órgano → Efecto.",
      abbreviations: {
        "GLP-1RA": {
          acronym: "GLP-1RA",
          fullName: "Agonistas del receptor de GLP-1",
          what: "Fármacos que imitan la incretina.",
          role: "Primera pieza: entra al cuerpo y busca su diana.",
        },
        "GLP-1R": {
          acronym: "GLP-1R",
          fullName: "Receptor de GLP-1",
          what: "GPCR en páncreas, cerebro y GI.",
          role: "Segunda pieza: traduce la señal del fármaco.",
        },
        GPCR: {
          acronym: "GPCR",
          fullName: "Receptor acoplado a proteína G",
          what: "Familia de receptores de membrana.",
          role: "Tipo de receptor al que pertenece GLP-1R.",
        },
        GI: {
          acronym: "GI",
          fullName: "Gastrointestinal",
          what: "Estómago e intestino.",
          role: "Uno de los órganos diana del mecanismo.",
        },
      },
    },
    credibility: {
      title: "Casos de Credibilidad",
      intro:
        "Resuelve situaciones clínicas usando solo la teoría de las pestañas Mecanismo, Alteraciones nutricionales y Efectos secundarios. Tu credibilidad inicia al 100%.",
      abbreviations: {
        "GLP-1RA": {
          acronym: "GLP-1RA",
          fullName: "Agonistas del receptor de GLP-1",
          what: "Fármacos activadores de GLP-1R.",
          role: "Contexto de todos los casos clínicos.",
        },
        DM2: {
          acronym: "DM2",
          fullName: "Diabetes mellitus tipo 2",
          what: "Diabetes por resistencia a insulina.",
          role: "Indicación frecuente de GLP-1RA.",
        },
        GI: {
          acronym: "GI",
          fullName: "Gastrointestinal",
          what: "Estómago e intestino.",
          role: "Vía principal de efectos adversos al titular.",
        },
      },
    },
  },
};
