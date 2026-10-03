const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';            // 13.33 x 7.5
pres.author = 'Carlos Contreras';
pres.title  = 'Organismos de Socorro y la Biblia — versión de 45 minutos';
pres.subject= 'Conferencia sobre preparacion ante emergencias desde la Biblia';

const W = 13.33, H = 7.5;
const M = 0.9, CW = W - 2 * M;          // content box

/* ---------- paleta ---------- */
const INK    = '0E121A';   // fondo mas profundo (portada, separadores, cierre)
const BASE   = '161D29';   // fondo de contenido
const PANEL  = '232D3F';   // tarjetas
const PANEL2 = '1C2534';   // tarjetas sutiles
const AMBER  = 'F2A93B';   // acento principal: la lampara del atalaya
const CREAM  = 'F6F2E9';
const MUTED  = '99A3B6';
const DIM    = '6E7889';

const QUAKE   = 'E87722';
const CYCLONE = '5AA0D0';
const TSUNAMI = '3FB08E';
const FIRE    = 'E05555';
const HELP    = 'AEB6C4';

const SERIF = 'Cambria';
const SANS  = 'Calibri';

const S = pres.ShapeType;

/* ---------- helpers ---------- */
function slideOn(color) {
  const s = pres.addSlide();
  s.background = { color };
  return s;
}

// anillos concentricos: motivo de onda sismica / radar, repetido en todo el deck
function rings(s, cx, cy, radii, bgColor, lineColor, width) {
  [...radii].sort((a, b) => b - a).forEach(r => {
    s.addShape(S.ellipse, {
      x: cx - r, y: cy - r, w: 2 * r, h: 2 * r,
      fill: { color: bgColor }, line: { color: lineColor, width: width || 1 }
    });
  });
}

function eyebrow(s, text, color, y) {
  s.addText(String(text).toUpperCase(), {
    x: M, y: y === undefined ? 0.5 : y, w: CW, h: 0.3,
    fontFace: SANS, fontSize: 12, bold: true, color: color || AMBER,
    charSpacing: 2.6, isTextBox: true, margin: 0, valign: 'middle'
  });
}

function title(s, text, opts) {
  const o = opts || {};
  s.addText(text, {
    x: M, y: o.y === undefined ? 0.92 : o.y, w: o.w || CW, h: o.h || 1.15,
    fontFace: SERIF, fontSize: o.size || 38, bold: true,
    color: o.color || CREAM, isTextBox: true, margin: 0, valign: 'top',
    lineSpacingMultiple: 1.0
  });
}

// circulo con numero o texto corto
function badge(s, x, y, d, fillColor, label, textColor, size) {
  s.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: fillColor }, line: { color: fillColor, width: 1 } });
  s.addText(String(label), {
    x, y, w: d, h: d, align: 'center', valign: 'middle',
    fontFace: SANS, fontSize: size || 16, bold: true,
    color: textColor || INK, isTextBox: true, margin: 0
  });
}

// filas: badge + titular en negrita + descripcion opcional
function rows(s, items, opts) {
  const o = opts || {};
  const x = o.x === undefined ? M : o.x;
  const w = o.w === undefined ? CW : o.w;
  let y = o.y === undefined ? 2.2 : o.y;
  const gap = o.gap === undefined ? 0.92 : o.gap;
  const d = o.d === undefined ? 0.46 : o.d;
  const accent = o.accent || AMBER;
  items.forEach((it, i) => {
    badge(s, x, y, d, accent, it.mark !== undefined ? it.mark : (i + 1), o.badgeText || INK, o.badgeSize || 15);
    const tx = x + d + 0.32;
    s.addText(it.head, {
      x: tx, y: y - 0.05, w: w - d - 0.32, h: 0.4,
      fontFace: SANS, fontSize: o.headSize || 19, bold: true, color: o.headColor || CREAM,
      isTextBox: true, margin: 0, valign: 'middle'
    });
    if (it.sub) {
      s.addText(it.sub, {
        x: tx, y: y + 0.34, w: w - d - 0.32, h: o.subH || 0.42,
        fontFace: SANS, fontSize: o.subSize || 14, color: MUTED,
        isTextBox: true, margin: 0, valign: 'top'
      });
    }
    y += gap;
  });
}

// tarjeta con fondo tenue
function card(s, x, y, w, h, fillColor) {
  s.addShape(S.roundRect, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: fillColor || PANEL }, line: { color: fillColor || PANEL, width: 1 }
  });
}

// enunciado enorme centrado
function bigStatement(s, lines, opts) {
  const o = opts || {};
  s.addText(lines, {
    x: 1.0, y: o.y === undefined ? 2.45 : o.y, w: W - 2.0, h: o.h || 2.6,
    fontFace: SERIF, fontSize: o.size || 46, bold: true,
    color: o.color || CREAM, align: 'center', valign: 'middle',
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.12
  });
}

// diapositiva de versiculo: comilla grande + texto + cita
function verseSlide(runs, cita, opts) {
  const o = opts || {};
  const s = slideOn(o.bg || BASE);
  rings(s, 12.5, 1.0, [1.5, 1.05, 0.62], o.bg || BASE, o.ringColor || '2A3446', 1);
  if (o.eyebrow) eyebrow(s, o.eyebrow, o.accent || AMBER);
  s.addText('“', {
    x: M - 0.12, y: o.qy === undefined ? 1.0 : o.qy, w: 1.6, h: 1.4,
    fontFace: SERIF, fontSize: 130, bold: true, color: o.accent || AMBER,
    isTextBox: true, margin: 0, valign: 'top'
  });
  s.addText(runs, {
    x: M, y: o.ty === undefined ? 2.15 : o.ty, w: o.tw || (CW - 1.1), h: o.th || 2.8,
    fontFace: SERIF, fontSize: o.size || 29, color: CREAM,
    isTextBox: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.2
  });
  s.addText(cita, {
    x: M, y: o.cy === undefined ? 5.3 : o.cy, w: CW, h: 0.4,
    fontFace: SANS, fontSize: 16, bold: true, color: o.accent || AMBER,
    charSpacing: 1.6, isTextBox: true, margin: 0
  });
  return s;
}

// pie de diapositiva destacado
function kicker(s, text, color, y, size) {
  s.addText(text, {
    x: M, y: y === undefined ? 6.0 : y, w: CW, h: 0.85,
    fontFace: SERIF, fontSize: size || 24, bold: true, color: color || AMBER,
    isTextBox: true, margin: 0, valign: 'middle'
  });
}

function sectionSlide(num, text, accent, sub) {
  const s = slideOn(INK);
  rings(s, 11.7, 5.9, [2.6, 1.95, 1.35, 0.8], INK, accent, 1.25);
  s.addText(String(num), {
    x: M, y: 1.5, w: 2.2, h: 1.5,
    fontFace: SERIF, fontSize: 96, bold: true, color: accent,
    isTextBox: true, margin: 0, valign: 'middle'
  });
  s.addText(text, {
    x: M, y: 3.05, w: 9.3, h: 2.2,
    fontFace: SERIF, fontSize: 40, bold: true, color: CREAM,
    isTextBox: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.05
  });
  if (sub) {
    s.addText(sub, {
      x: M, y: 5.45, w: 9.3, h: 0.5,
      fontFace: SANS, fontSize: 16, color: MUTED, isTextBox: true, margin: 0
    });
  }
  return s;
}

function notes(s, t) { s.addNotes(t); }

/* =========================================================
   APERTURA
   ========================================================= */

/* 1 — Portada */
{
  const s = slideOn(INK);
  rings(s, 11.35, 2.1, [3.4, 2.55, 1.8, 1.1, 0.55], INK, '2E3A4E', 1.25);
  s.addShape(S.ellipse, { x: 11.05, y: 1.8, w: 0.6, h: 0.6, fill: { color: AMBER }, line: { color: AMBER, width: 1 } });
  eyebrow(s, 'Conferencia', AMBER, 1.5);
  s.addText('ORGANISMOS\nDE SOCORRO\nY LA BIBLIA', {
    x: M, y: 2.0, w: 8.6, h: 3.0,
    fontFace: SERIF, fontSize: 54, bold: true, color: CREAM,
    isTextBox: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.02
  });
  s.addText('Lo que Dios dice antes de que suene la alarma', {
    x: M, y: 5.15, w: 8.6, h: 0.5,
    fontFace: SERIF, fontSize: 21, italic: true, color: AMBER, isTextBox: true, margin: 0
  });
  s.addText('Carlos Contreras', {
    x: M, y: 6.25, w: 8.6, h: 0.4,
    fontFace: SANS, fontSize: 16, bold: true, color: MUTED, charSpacing: 1.4, isTextBox: true, margin: 0
  });
  notes(s, 'VERSIÓN DE 45 MINUTOS\n\nApertura 5 · Medidas de seguridad 12 · Qué habla Dios 10 · Cómo se prepara un cristiano 8 · Ejemplos bíblicos 7 · Cierre 4.\n\nAquí no sobra un minuto: cada bloque que se estira se lo quita al siguiente. Tenga el reloj a la vista.\n\nANTES DE EMPEZAR\n\nNo salude. No agradezca. No presente el tema todavía. Entre en frío con la pregunta de la diapositiva siguiente: la atención se gana en los primeros diez segundos, y un saludo largo la gasta.\n\nSi tiene que presentarse, hágalo después de la dinámica de la salida, en una sola frase: «Mi nombre es Carlos Contreras, y vengo a hablarles de dos mundos que casi nunca se juntan: los organismos de socorro y la Biblia.»');
}

/* 2 — Pregunta de entrada */
{
  const s = slideOn(INK);
  rings(s, -0.4, 7.9, [2.6, 1.9, 1.2], INK, '2A3446', 1);
  bigStatement(s, '¿Sabe usted qué haría\nen los próximos 10 segundos?', { size: 44, y: 2.3, h: 2.9 });
  s.addText('No lo que siente. Lo que haría.', {
    x: 1.0, y: 5.25, w: W - 2.0, h: 0.5,
    fontFace: SERIF, fontSize: 20, italic: true, color: AMBER, align: 'center', isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«Voy a empezar con una pregunta incómoda, y quiero que la contesten en silencio, para ustedes mismos.\n\nSi en este momento, ahora mismo, esta sala se comenzara a mover… ¿usted sabe qué haría en los próximos diez segundos?\n\nNo lo que siente. Lo que haría.»\n\nUSTED HACE\n\nDeje el silencio. No lo llene. La incomodidad es el punto de esta diapositiva: casi nadie tiene respuesta, y esa es la conferencia entera.');
}

/* 3 — Dinamica: senale la salida */
{
  const s = slideOn(QUAKE);
  rings(s, 12.3, 6.7, [2.2, 1.6, 1.0], QUAKE, 'FFFFFF', 1);
  bigStatement(s, 'SEÑALE LA SALIDA\nMÁS CERCANA', { size: 52, color: INK, y: 2.6, h: 2.4 });
  s.addText('Ahora. Sin levantarse.', {
    x: 1.0, y: 5.1, w: W - 2.0, h: 0.5,
    fontFace: SANS, fontSize: 19, bold: true, color: INK, align: 'center', isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«Vamos a ver. Sin moverse de su asiento: señale con la mano la salida más cercana a usted.»\n\nUSTED HACE\n\nHágalo de verdad y espere. Va a haber manos apuntando a lugares distintos, y manos que no se levantan. No corrija a nadie: deje que lo vean.\n\nUSTED DICE\n\n«Miren a su alrededor. No todos apuntamos al mismo lugar. Y algunos no apuntaron. Eso no es un problema de fe. Es un problema de preparación. Y la Biblia tiene mucho, muchísimo que decir sobre eso.»');
}

/* 4 — Ezequiel 33:6 */
{
  const s = verseSlide([
    { text: 'Pero si el atalaya viere venir la espada ', options: { color: CREAM } },
    { text: 'y no tocare la trompeta', options: { color: AMBER, bold: true } },
    { text: ', y el pueblo no se apercibiere, y viniendo la espada, hiriere de él a alguno… demandaré su sangre de mano del atalaya.', options: { color: CREAM } }
  ], 'Ezequiel 33:6', { eyebrow: 'Texto ancla de la conferencia', size: 28, th: 3.0 });
  kicker(s, 'El atalaya no detiene la espada. Ve a tiempo y avisa a tiempo.', AMBER, 5.95, 22);
  notes(s, 'USTED DICE\n\n«El tema de hoy es Organismos de Socorro y la Biblia. Y quiero desarmar, desde el primer minuto, la idea de que estos son dos mundos separados: que la Defensa Civil, la Cruz Roja y los bomberos van por un lado, y la Biblia va por otro. No es así.»\n\nLea el versículo completo, despacio. Luego:\n\n«El atalaya no detiene la espada. No controla al enemigo. El atalaya tiene una sola responsabilidad: ver a tiempo y avisar a tiempo.\n\nEso es exactamente lo que hace un sistema de alerta temprana. Eso es lo que hace un boletín de meteorología. Eso es lo que hace un detector de humo a las tres de la mañana.\n\nDios inventó el sistema de alerta temprana. Y lo puso en manos de su pueblo.»');
}

/* 5 — Tesis */
{
  const s = slideOn(BASE);
  rings(s, 0.2, 0.4, [2.3, 1.7, 1.05], BASE, '2A3446', 1);
  eyebrow(s, 'La tesis', AMBER);
  s.addText([
    { text: 'PREPARARSE NO ES\nDESCONFIAR DE DIOS.\n', options: { color: MUTED } },
    { text: 'PREPARARSE ES\nOBEDECER A DIOS.', options: { color: AMBER } }
  ], {
    x: M, y: 2.0, w: CW, h: 3.6,
    fontFace: SERIF, fontSize: 42, bold: true,
    isTextBox: true, margin: 0, valign: 'middle', lineSpacingMultiple: 1.1
  });
  notes(s, 'USTED DICE\n\n«Escuchen bien esta frase, porque de aquí no me voy a mover en noventa minutos:\n\nPrepararse no es desconfiar de Dios. Prepararse es obedecer a Dios.»\n\nUSTED HACE\n\nDígala dos veces. La segunda, más lento. Es la tesis de toda la conferencia y todo lo demás cuelga de ella. No la explique todavía: la próxima diapositiva la sustenta.');
}

/* 6 — Nehemias 4:9, la conjuncion */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Nehemías 4:9', AMBER);
  s.addText('Oramos a nuestro Dios,', {
    x: M, y: 2.0, w: 5.4, h: 1.2,
    fontFace: SERIF, fontSize: 30, color: CREAM, isTextBox: true, margin: 0, valign: 'middle', align: 'right'
  });
  s.addText('Y', {
    x: 6.5, y: 1.55, w: 1.1, h: 2.1,
    fontFace: SERIF, fontSize: 110, bold: true, color: AMBER,
    align: 'center', valign: 'middle', isTextBox: true, margin: 0
  });
  s.addText('pusimos guarda contra ellos\nde día y de noche.', {
    x: 7.8, y: 2.0, w: 4.63, h: 1.2,
    fontFace: SERIF, fontSize: 30, color: CREAM, isTextBox: true, margin: 0, valign: 'middle', lineSpacingMultiple: 1.05
  });
  card(s, M, 4.85, CW, 1.6, PANEL2);
  s.addText('La conjunción es «Y», no «o». Nehemías no escogió entre orar y montar guardia: hizo las dos cosas la misma noche.', {
    x: M + 0.5, y: 4.85, w: CW - 1.0, h: 1.6,
    fontFace: SANS, fontSize: 19, color: CREAM, isTextBox: true, margin: 0, valign: 'middle', lineSpacingMultiple: 1.25
  });
  notes(s, 'USTED DICE\n\n«Nehemías lo dijo en seis palabras: “Oramos a nuestro Dios, y… pusimos guarda”.\n\nLa conjunción es Y. No es O. Nehemías no escogió entre orar y montar guardia: hizo las dos cosas la misma noche.»\n\nUSTED HACE\n\nSeñale la Y grande de la pantalla. Este versículo resuelve el falso dilema que trae en la cabeza la mitad del auditorio, y al que van a volver cuando usted hable de mochilas y extintores. Déjelo bien clavado aquí.');
}

/* NUEVA — Bloque 4 comprimido en una diapositiva */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Un minuto · la Biblia y los fenómenos de la naturaleza', AMBER);
  title(s, 'Seis verdades, y una que pesa más');
  const v = [
    ['Dios le puso límites al mar', 'Job 38:11'],
    ['La creación gime con dolores de parto', 'Romanos 8:22'],
    ['Hay un orden natural que Dios sostiene', 'Génesis 8:22'],
    ['La Biblia prohíbe culpar a la víctima', 'Lucas 13:1-5'],
    ['Dios habla, pero no se reduce al fenómeno', '1 Reyes 19:11-12'],
    ['La historia no termina en catástrofe', 'Apocalipsis 21:4']
  ];
  const cw2 = 5.74, ch = 1.22;
  v.forEach((it, i) => {
    const x = M + (i % 2) * (cw2 + 0.35);
    const y = 2.3 + Math.floor(i / 2) * (ch + 0.16);
    card(s, x, y, cw2, ch, i === 3 ? AMBER : PANEL);
    badge(s, x + 0.28, y + 0.36, 0.45, i === 3 ? INK : AMBER, i + 1, i === 3 ? AMBER : INK, 14);
    s.addText(it[0], {
      x: x + 0.9, y: y + 0.14, w: cw2 - 1.2, h: 0.54,
      fontFace: SANS, fontSize: 16, bold: true, color: i === 3 ? INK : CREAM,
      isTextBox: true, margin: 0, valign: 'top'
    });
    s.addText(it[1], {
      x: x + 0.9, y: y + 0.72, w: cw2 - 1.2, h: 0.3,
      fontFace: SANS, fontSize: 12, bold: true, color: i === 3 ? '4A3410' : AMBER,
      charSpacing: 1, isTextBox: true, margin: 0
    });
  });
  kicker(s, 'No explique por qué Dios lo mandó.\nSalga con agua, con comida y con brazos.', AMBER, 6.42, 21);
  notes(s, 'EL BLOQUE 4, EN UN MINUTO\n\nEn la versión de 45 minutos este bloque no se desarrolla: se resume aquí y se sigue. No intente las seis. Nombre las seis de corrido y gaste el minuto en la cuarta.\n\nUSTED DICE\n\n«Antes de entrar en lo práctico, una sola cosa sobre el porqué, porque es la pregunta que la gente hace de verdad cuando el techo se cae.\n\nLa Biblia dice seis cosas sobre los fenómenos de la naturaleza. Léanlas con calma en la hoja. Pero hay una que quiero dejarles hoy, la cuarta:\n\nA Jesús le cuentan una tragedia, y Él mismo trae otra: la torre de Siloé, que cayó y mató a dieciocho personas. Y pregunta: ¿pensáis que eran más culpables que todos los hombres que habitan en Jerusalén? Y contesta Él mismo: Os digo: No.\n\nJesús rechaza expresamente la ecuación les pasó porque eran peores. La rechaza.\n\nAsí que cuando pase un desastre, no salga a explicar por qué Dios lo mandó. Salga con agua, con comida y con brazos. La teología del que sufre se hace cargando colchones, no dando explicaciones.»\n\nADVERTENCIA PASTORAL\n\nSi sabe que hay personas de duelo en la sala, dígalo antes: «sé que aquí hay quien enterró a alguien después de una tormenta; lo que voy a decir lo digo con respeto, no desde la teoría».');
}

/* =========================================================
   BLOQUE 1 — MEDIDAS DE SEGURIDAD
   ========================================================= */

notes(sectionSlide('01', 'Medidas de seguridad', AMBER,
  'Terremotos · Ciclones · Incendios'),
'BLOQUE 1 · 12 minutos — cuatro por amenaza\n\nEN ESTA VERSIÓN SOLO VAN TRES AMENAZAS: terremoto, ciclón e incendio. Maremotos y primeros auxilios quedan fuera del deck, pero están completos en la hoja del participante. Dígalo, para que nadie crea que se olvidaron:\n\n«Maremotos y primeros auxilios no los vamos a ver hoy por tiempo, pero están en la hoja que les entregamos, con el mismo detalle.»\n\nUSTED DICE\n\n«Empecemos por lo más urgente, y después vamos a la Biblia. Porque si la tierra tiembla mientras estamos hablando de teología, la teología no le va a servir de nada si usted no sabe qué hacer con su cuerpo en los próximos diez segundos.»\n\nREGLA DEL BLOQUE\n\nCuatro minutos por amenaza. Enseñe pocas acciones, bien memorizadas. Una acción que la gente recuerda vale más que veinte que olvida. Este es el bloque que más tienta a extenderse: controle el reloj o se come el Bloque 2.');

/* 9 — Terremoto: las tres palabras */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Terremoto · durante', QUAKE);
  title(s, 'Las tres palabras que salvan vida', { color: CREAM });
  const words = [
    { w: 'AGÁCHESE', d: 'Al piso, antes de que el sismo lo tumbe.' },
    { w: 'CÚBRASE', d: 'Cabeza y cuello. Bajo una mesa firme.' },
    { w: 'AGÁRRESE', d: 'De la mesa, y muévase con ella.' }
  ];
  const cw = 3.68, gap = 0.35;
  words.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.45, cw, 3.15, PANEL);
    badge(s, x + cw / 2 - 0.33, 2.85, 0.66, QUAKE, i + 1, INK, 22);
    s.addText(it.w, {
      x: x + 0.15, y: 3.75, w: cw - 0.3, h: 0.6,
      fontFace: SERIF, fontSize: 25, bold: true, color: QUAKE,
      align: 'center', isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it.d, {
      x: x + 0.35, y: 4.4, w: cw - 0.7, h: 1.0,
      fontFace: SANS, fontSize: 15, color: MUTED,
      align: 'center', isTextBox: true, margin: 0, valign: 'top'
    });
  });
  kicker(s, 'Practique los 10 segundos ahora mismo.', QUAKE, 5.9, 21);
  notes(s, 'USTED DICE\n\n«El salmista nombra el terremoto. No lo niega, no pretende que no existe. Dice: aunque la tierra sea removida, no temeremos. La fe bíblica no cierra los ojos ante el peligro: los abre y no se paraliza.\n\nY en una emergencia usted no se va a elevar a la altura de sus intenciones. Usted va a caer a la altura de su entrenamiento. Por eso vamos a practicar, no solo a escuchar.»\n\nDINÁMICA (60 segundos — hágala)\n\n«De pie. Todos. A la cuenta de tres: agáchese, cúbrase la cabeza con los brazos, y agárrese de la silla. Uno… dos… tres.»\n\nCuente diez segundos en voz alta. Que sientan lo largos que son.\n\n«Eso fue lo que duró el terremoto que destruyó buena parte de Puerto Príncipe. Diez segundos. Siéntense.»');
}

/* 10 — Terremoto: lo que NO se hace */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Terremoto · errores frecuentes', QUAKE);
  title(s, 'Lo que NO se hace');
  const items = [
    ['No corra mientras tiembla', 'Casi todas las lesiones vienen de caídas y objetos que caen.'],
    ['No use el marco de la puerta', 'En construcción moderna no es más fuerte que el resto.'],
    ['Nunca el ascensor', 'Ni durante, ni después.'],
    ['No al «triángulo de la vida»', 'Los organismos de socorro no lo recomiendan.']
  ];
  const cw2 = 5.74, ch = 1.55;
  items.forEach((it, i) => {
    const x = M + (i % 2) * (cw2 + 0.35);
    const y = 2.3 + Math.floor(i / 2) * (ch + 0.3);
    card(s, x, y, cw2, ch, PANEL);
    badge(s, x + 0.34, y + 0.48, 0.58, FIRE, '×', 'FFFFFF', 24);
    s.addText(it[0], {
      x: x + 1.1, y: y + 0.2, w: cw2 - 1.4, h: 0.55,
      fontFace: SANS, fontSize: 18, bold: true, color: CREAM, isTextBox: true, margin: 0, valign: 'top'
    });
    s.addText(it[1], {
      x: x + 1.1, y: y + 0.78, w: cw2 - 1.4, h: 0.62,
      fontFace: SANS, fontSize: 14, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
    });
  });
  kicker(s, 'En la emergencia usted cae a la altura de su entrenamiento.', QUAKE, 5.95, 20);
  notes(s, 'USTED DICE\n\n«Ahora lo que NO se hace, que es tan importante como lo anterior.\n\nNo corra mientras tiembla: la mayoría de las lesiones viene de caídas y de objetos que caen, no de derrumbes.\n\nNo se pare en el marco de la puerta: en construcción moderna no es más fuerte que el resto de la pared. Eso lo aprendimos de casas de adobe y se nos quedó pegado.\n\nNunca el ascensor. Ni durante, ni después.\n\nY el último me importa mucho: el llamado “triángulo de la vida”. Circula muchísimo por redes sociales, y los organismos de socorro internacionales NO lo recomiendan. Si usted lo ha compartido, deje de hacerlo.»\n\nUSTED HACE\n\nCierre con la frase de abajo: en la emergencia usted cae a la altura de su entrenamiento.');
}

/* NUEVA — Terremoto: después y prevención (fusión) */
{
  const s = slideOn(BASE);
  rings(s, 12.8, 6.9, [1.9, 1.35, 0.8], BASE, '2A3446', 1);
  eyebrow(s, 'Terremoto · después y prevención', QUAKE);
  title(s, 'Los minutos que siguen');
  rows(s, [
    { head: 'Espere réplicas', sub: 'Van a venir. Aléjese de paredes agrietadas y techos dañados.' },
    { head: 'Gas antes que fuego', sub: 'No encienda fósforos, velas ni interruptores hasta descartar fuga.' },
    { head: 'Calzado cerrado', sub: 'El piso queda lleno de vidrio.' },
    { head: 'Mensajes, no llamadas', sub: 'La red se satura. El texto pasa cuando la llamada no.' }
  ], { y: 2.25, gap: 0.88, accent: QUAKE });
  card(s, M, 5.9, CW, 1.05, QUAKE);
  s.addText('Y HOY EN SU CASA:   ancle los muebles altos   ·   zapatos y linterna bajo la cama', {
    x: M, y: 5.9, w: CW, h: 1.05, align: 'center', valign: 'middle',
    fontFace: SANS, fontSize: 17, bold: true, color: INK, isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«Paró el temblor. Los minutos que siguen deciden mucho.\n\nEspere réplicas: van a venir, y son las que tumban lo que quedó debilitado.\n\nNo encienda fósforos, velas ni el interruptor de la luz hasta descartar fuga de gas. Si huele a gas: cierre la válvula, ventile y salga.\n\nSalga con calzado cerrado: el piso queda lleno de vidrio.\n\nY use el celular para mensajes de texto, no para llamadas: la red se satura, y el texto pasa cuando la llamada no.»\n\nY CIERRE CON LA BANDA DE ABAJO\n\n«Dos cosas que puede hacer esta semana, sin gastar casi nada. Anclar a la pared lo que puede caerle encima: estantes, armarios, el televisor, el calentador. Y un par de zapatos y una linterna debajo de la cama — la medida más barata y más subestimada que existe.\n\nPorque el sismo no avisa. Todo lo que usted va a hacer en un terremoto lo decidió antes.»\n\nSI SE LO PREGUNTAN\n\nSi queda atrapado: no grite sin necesidad, porque agota y hace tragar polvo. Golpee una tubería a intervalos regulares y cúbrase la boca.');
}

/* 13 — Ciclon: Proverbios 22:3 */
{
  const s = verseSlide([
    { text: 'El avisado ve el mal ', options: { color: CREAM } },
    { text: 'y se esconde', options: { color: CYCLONE, bold: true } },
    { text: '; mas los simples pasan y reciben el daño.', options: { color: CREAM } }
  ], 'Proverbios 22:3', { eyebrow: 'Ciclón · fundamento', accent: CYCLONE, size: 31, th: 2.4 });
  kicker(s, 'El huracán avisa con días. Ver no basta: hay que esconderse.', CYCLONE, 5.95, 22);
  notes(s, 'USTED DICE\n\n«El huracán es el único desastre que le avisa con días de anticipación. Días. El terremoto no avisa. El huracán sí. Y aun así seguimos perdiendo gente.\n\n¿Por qué? Porque ver el mal no basta. El versículo dice que el avisado ve Y SE ESCONDE. Hay que hacer las dos.»\n\nUSTED HACE\n\nSubraye con la voz las tres palabras resaltadas: “y se esconde”. La mortalidad por ciclón es, en su mayoría, mortalidad evitable — y eso es exactamente lo que está diciendo Proverbios.');
}

/* 14 — Ciclon: antes */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Ciclón · antes', CYCLONE);
  title(s, 'La pregunta que se contesta en la calma');
  card(s, M, 2.3, CW, 1.05, PANEL);
  s.addText('¿Mi casa es de PERMANENCIA o de EVACUACIÓN?', {
    x: M + 0.45, y: 2.3, w: CW - 0.9, h: 1.05,
    fontFace: SERIF, fontSize: 25, bold: true, color: CYCLONE, isTextBox: true, margin: 0, valign: 'middle'
  });
  const prep = [
    'Agua almacenada y envases llenos',
    'Medicamentos crónicos para dos semanas',
    'Documentos en bolsa plástica sellada',
    'Efectivo en billetes pequeños',
    'Radio de baterías y banco de energía',
    'Techo, zinc y árboles revisados'
  ];
  prep.forEach((t, i) => {
    const x = M + (i % 2) * (5.74 + 0.35);
    const y = 3.72 + Math.floor(i / 2) * 0.72;
    s.addShape(S.ellipse, { x, y: y + 0.09, w: 0.22, h: 0.22, fill: { color: CYCLONE }, line: { color: CYCLONE, width: 1 } });
    s.addText(t, {
      x: x + 0.42, y, w: 5.32, h: 0.42,
      fontFace: SANS, fontSize: 17, color: CREAM, isTextBox: true, margin: 0, valign: 'middle'
    });
  });
  kicker(s, 'Si le toca evacuar, evacúese temprano. Evacuar tarde es la decisión que mata.', CYCLONE, 6.05, 20);
  notes(s, 'USTED DICE\n\n«Hay una pregunta que se contesta en la calma, no con el viento encima: ¿mi casa es de permanencia o de evacuación?\n\nSi usted vive en zona baja, cerca de una cañada, de un río o del mar, usted evacúa. Decídalo hoy. Averigüe hoy cuál es su refugio y cómo se llega caminando.»\n\nRepase la lista de la derecha sin detenerse en cada punto; lo importante es el mensaje de abajo:\n\n«Si le toca evacuar, evacúese temprano. Evacuar tarde es la decisión que mata: se hace de noche, con viento, con las vías ya inundadas. Y lleve la mascota, porque mucha gente se niega a salir por no dejarla.»');
}

/* 15 — Ciclon: el ojo engaña */
{
  const s = slideOn(CYCLONE);
  rings(s, 6.66, 3.75, [3.2, 2.4, 1.65, 0.95], CYCLONE, '0E3A57', 1.5);
  s.addShape(S.ellipse, { x: 6.16, y: 3.25, w: 1.0, h: 1.0, fill: { color: '0E3A57' }, line: { color: '0E3A57', width: 1 } });
  bigStatement(s, 'LA CALMA NO ES EL FINAL.\nNO SALGA.', { size: 46, color: 'FFFFFF', y: 2.75, h: 2.0 });
  s.addText('El ojo del huracán dura minutos. Después el viento vuelve del lado contrario.', {
    x: 1.2, y: 5.0, w: W - 2.4, h: 0.6,
    fontFace: SANS, fontSize: 17, bold: true, color: '0E3A57', align: 'center', isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«Esta es la trampa que más gente ha matado en un ciclón.\n\nDe pronto todo se calma. El viento para, sale un pedazo de cielo, se oyen los pájaros. La gente sale a ver los daños, a buscar a un familiar, a mover el carro.\n\nEse es el ojo del huracán. Dura de minutos a una hora. Y después el viento vuelve, del lado contrario, con la misma fuerza o más.\n\nNo salga. No salga hasta que la autoridad lo diga.»\n\nUSTED HACE\n\nDígalo despacio y deje un silencio. Es la diapositiva más importante del bloque de ciclones.');
}

/* 16 — Ciclon: despues */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Ciclón · después', CYCLONE);
  title(s, 'La fase que más muertes causa');
  card(s, M, 2.35, CW, 1.25, FIRE);
  s.addText('NO CRUCE AGUA CORRIENDO — NI A PIE NI EN VEHÍCULO', {
    x: M + 0.45, y: 2.35, w: CW - 0.9, h: 1.25,
    fontFace: SERIF, fontSize: 26, bold: true, color: 'FFFFFF', isTextBox: true, margin: 0, valign: 'middle'
  });
  rows(s, [
    { head: 'Cables caídos: siempre energizados', sub: 'Y cuidado con los charcos donde haya cables.' },
    { head: 'Agua hervida o tratada', sub: 'La segunda ola del desastre es sanitaria.' },
    { head: 'Planta eléctrica siempre afuera', sub: 'El monóxido de carbono no huele y mata familias dormidas.' }
  ], { y: 4.05, gap: 0.95, accent: CYCLONE });
  notes(s, 'USTED DICE\n\n«Y ahora la fase que más muertes causa, que no es el huracán: es el día después.\n\nNo cruce agua corriendo, ni a pie ni en vehículo. Treinta centímetros de agua en movimiento derriban a un adulto. Sesenta arrastran un vehículo. Si la vía está inundada, dé la vuelta. Es la muerte más evitable de todas, y la que más repetimos cada año.\n\nCables caídos: siempre energizados. Y cuidado con los charcos donde haya cables.\n\nHierva o trate el agua: la segunda ola del desastre es sanitaria — diarrea, leptospirosis.\n\nY la planta eléctrica: jamás dentro de la casa, del garaje, ni cerca de una ventana. El monóxido de carbono no huele, no se ve, y mata familias enteras dormidas.»');
}

/* 20 — Incendio: Deuteronomio 22:8 */
{
  const s = verseSlide([
    { text: 'Cuando edifiques casa nueva, harás pretil a tu azotea, ', options: { color: CREAM } },
    { text: 'para que no eches culpa de sangre sobre tu casa', options: { color: FIRE, bold: true } },
    { text: ', si de ella cayere alguno.', options: { color: CREAM } }
  ], 'Deuteronomio 22:8', { eyebrow: 'Seguridad · fundamento', accent: FIRE, size: 29, th: 2.7 });
  kicker(s, 'La negligencia en seguridad, en la Biblia, tiene categoría moral.', FIRE, 5.95, 23);
  notes(s, 'USTED DICE\n\n«Deténganse en este versículo, porque es de los más sorprendentes de la Biblia.\n\nDios le está dando a Israel un código de construcción. Baranda obligatoria en la azotea. ¿Por qué? Escuchen la razón: “para que no eches culpa de sangre sobre tu casa”.\n\nEs decir: si alguien se cae porque tú no pusiste la baranda, eso es culpa tuya delante de Dios.\n\nLéanlo otra vez. La negligencia en seguridad, en la Biblia, tiene categoría moral. No es un descuido administrativo. Es sangre.\n\nEso es lo que Dios piensa de la prevención.»\n\nUSTED HACE\n\nEsta diapositiva sostiene todo el bloque técnico. No la pase rápido.');
}

/* 21 — Incendio: prevencion */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Incendio · prevención', FIRE);
  title(s, 'Donde de verdad empieza el fuego');
  rows(s, [
    { head: 'Electricidad', sub: 'Tomacorrientes sobrecargados, extensiones encadenadas, cables bajo alfombras.' },
    { head: 'Aceite: nunca agua', sub: 'Apague la hornilla y tape el sartén. El agua sobre aceite ardiendo explota.' },
    { head: 'Gas', sub: 'Si huele a gas: no encienda luz, no use el celular. Cierre, ventile y salga.' },
    { head: 'Velas', sub: 'Nunca sin vigilancia, nunca al dormirse. En apágon, prefiera linterna.' },
    { head: 'Detector de humo', sub: 'Pruébelo cada mes, cambie la batería cada año. Nunca lo desactive: reubíquelo.' }
  ], { y: 2.3, gap: 0.86, accent: FIRE, headSize: 19 });
  notes(s, 'USTED DICE\n\n«El incendio casi nunca empieza donde uno cree. Empieza aquí:\n\nElectricidad: tomacorrientes sobrecargados, extensiones encadenadas, cables debajo de alfombras. Un tomacorriente tibio o un olor a quemado es una advertencia, no un detalle.\n\nLa cocina: nunca deje aceite al fuego sin vigilancia. Y si el aceite se enciende, jamás le eche agua: apague la hornilla y tape el sartén.\n\nEl gas: si huele a gas, no encienda la luz, no use el celular, no genere chispa. Cierre la válvula, ventile y salga. Llame desde afuera.\n\nVelas: nunca sin vigilancia, nunca al dormirse. En apagón prefiera linterna.\n\nY el detector de humo: pruébelo cada mes, cambie la batería cada año. Es el aparato con mejor relación costo-vida que existe en una casa. Si suena cuando usted cocina, reubíquelo — no le quite la batería. Un detector sin batería es un detector que no existe.»');
}

/* 22 — Incendio: el extintor */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Incendio · extintor', FIRE);
  title(s, 'Cuatro acciones, un solo intento');
  const steps = [
    ['HALE', 'el pasador\nde seguridad'],
    ['APUNTE', 'a la BASE\nde la llama'],
    ['APRIETE', 'la palanca\nde descarga'],
    ['BARRA', 'de lado a lado,\navanzando']
  ];
  const cw = 2.72, gap = 0.32;
  steps.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.45, cw, 2.75, PANEL);
    badge(s, x + cw / 2 - 0.3, 2.78, 0.6, FIRE, i + 1, 'FFFFFF', 20);
    s.addText(it[0], {
      x: x + 0.1, y: 3.52, w: cw - 0.2, h: 0.55,
      fontFace: SERIF, fontSize: 24, bold: true, color: FIRE,
      align: 'center', isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it[1], {
      x: x + 0.15, y: 4.12, w: cw - 0.3, h: 0.9,
      fontFace: SANS, fontSize: 14, color: MUTED,
      align: 'center', isTextBox: true, margin: 0, valign: 'top'
    });
  });
  card(s, M, 5.48, CW, 1.1, PANEL2);
  s.addText('Solo para fuego pequeño y contenido, con la salida a su espalda. Si hay humo denso o duda: salga y llame.', {
    x: M + 0.45, y: 5.48, w: CW - 0.9, h: 1.1,
    fontFace: SANS, fontSize: 17, color: CREAM, isTextBox: true, margin: 0, valign: 'middle'
  });
  notes(s, 'USTED DICE\n\n«Cuatro acciones, y se aprenden en treinta segundos.\n\nHale el pasador de seguridad. Apunte a la BASE de la llama, no a las llamas. Apriete la palanca. Y barra de lado a lado.\n\nApuntar a la base es donde falla todo el mundo: la gente le tira al fuego que ve, y el fuego que ve no es el que lo alimenta.»\n\nLA REGLA DE DECISIÓN — es lo más importante de la diapositiva:\n\n«Un extintor sirve para un fuego pequeño y contenido, en su inicio, con la salida a su espalda y con alguien que ya llamó a los bomberos.\n\nSi el fuego está por encima de su cintura, si hay humo denso, si el fuego está entre usted y la salida, o si tiene dudas: no lo pelee. Salga y llame.\n\nUn extintor común dura entre diez y veinte segundos. Usted tiene un solo intento.»');
}

/* 23 — Incendio: evacuacion */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Incendio · evacuación', FIRE);
  title(s, 'Salir vivo');
  rows(s, [
    { head: 'Con humo: agáchese y gatee', sub: 'El aire respirable y frío está cerca del piso.' },
    { head: 'Toque las puertas con el dorso', sub: 'Si queman, no las abra: busque otra ruta. Cierre al salir.' },
    { head: 'Nunca el ascensor', sub: 'Punto de encuentro afuera, conteo de personas.' },
    { head: 'Nadie vuelve a entrar', sub: 'Por nada. Ni por documentos, ni por mascotas, ni por recuerdos.' }
  ], { y: 2.3, gap: 0.95, accent: FIRE });
  card(s, M, 6.05, CW, 0.95, FIRE);
  s.addText('SI SU ROPA SE ENCIENDE:  DETÉNGASE · TÍRESE · RUEDE', {
    x: M, y: 6.05, w: CW, h: 0.95, align: 'center', valign: 'middle',
    fontFace: SANS, fontSize: 20, bold: true, color: 'FFFFFF', isTextBox: true, margin: 0, charSpacing: 1
  });
  notes(s, 'USTED DICE\n\n«Si no se puede apagar, hay que salir. Y salir bien.\n\nCon humo: agáchese y gatee. El aire respirable y frío está cerca del piso. Arriba está el humo caliente — y el humo es lo que mata, no la llama.\n\nAntes de abrir una puerta, tóquela con el DORSO de la mano. Con el dorso, porque si quema usted retira la mano por reflejo sin quemarse la palma. Si está caliente, no abra: busque otra ruta.\n\nNunca el ascensor.\n\nPunto de encuentro afuera y conteo de personas. Y nadie vuelve a entrar. Por nada: ni por documentos, ni por mascotas, ni por recuerdos.\n\nY si su ropa se enciende: deténgase, tírese al piso y ruede.»\n\nSI SE LO PREGUNTAN\n\nSi queda atrapado en una habitación: selle las rendijas con ropa o toallas, hágase visible desde la ventana y llame indicando su ubicación exacta.\n\nCIERRE DEL BLOQUE TÉCNICO — no se lo salte\n\nEsta es la última diapositiva práctica del día, así que aquí va el aviso que en la versión larga va con los primeros auxilios:\n\n«Y una cosa antes de pasar a la Biblia: nada de esto lo certifica esta conferencia. Yo se lo presento; la Cruz Roja, los bomberos y Defensa Civil se lo enseñan y se lo certifican. No quiero que usted salga sintiéndose entrenado: quiero que salga inscribiéndose en un entrenamiento.»\n\nTRANSICIÓN\n\n«Ya sabemos qué hacer con las manos. Ahora la pregunta grande: ¿y qué dice Dios de todo esto?»');
}

/* =========================================================
   BLOQUE 2 — QUE HABLA DIOS ANTE LAS EMERGENCIAS
   ========================================================= */

notes(sectionSlide('02', '¿Qué habla Dios\nante las emergencias?', AMBER,
  'Antes · por medio de · en medio de · después'),
'BLOQUE 2 · 10 minutos\n\nEste es el corazón teológico de la conferencia. Va completo, sin recortes: si le falta tiempo, quíteselo al Bloque 1, nunca a este.\n\nUSTED DICE\n\n«Ya sabemos qué hacer con las manos. Ahora la pregunta grande, la que nos trajo aquí: ¿y qué dice Dios de todo esto?\n\nPorque yo sé que alguien está pensando: pastor, ¿y todo esto no es falta de fe?»\n\nEL RECORRIDO\n\nDios habla antes del desastre. Dios habla por medio de gente que avisa. Dios habla en medio de la emergencia. Y Dios habla después, mandando a socorrer.');

/* 27 — Dios habla ANTES */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Patrón bíblico', AMBER);
  title(s, 'Antes del desastre, Dios habla');
  const names = [
    ['Noé', 'El diluvio, generaciones antes'],
    ['Egipto', 'El granizo, con hora anunciada'],
    ['Lot', 'Sodoma, con plazo para salir'],
    ['José', 'El hambre, con siete años de margen'],
    ['Agabo', 'La hambruna sobre el mundo'],
    ['Pablo', 'El naufragio, antes de zarpar']
  ];
  const cw = 3.68, gap = 0.35, ch = 1.15;
  names.forEach((it, i) => {
    const x = M + (i % 3) * (cw + gap);
    const y = 2.3 + Math.floor(i / 3) * (ch + 0.3);
    card(s, x, y, cw, ch, PANEL);
    s.addText(it[0], {
      x: x + 0.35, y: y + 0.16, w: cw - 0.7, h: 0.45,
      fontFace: SERIF, fontSize: 22, bold: true, color: AMBER, isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it[1], {
      x: x + 0.35, y: y + 0.62, w: cw - 0.7, h: 0.4,
      fontFace: SANS, fontSize: 14, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
    });
  });
  bigStatement(s, 'DIOS AVISA.', { size: 40, color: AMBER, y: 5.4, h: 0.9 });
  s.addText('El problema nunca fue el silencio de Dios: fue la sordera del hombre.', {
    x: 1.0, y: 6.3, w: W - 2.0, h: 0.5,
    fontFace: SANS, fontSize: 17, color: MUTED, align: 'center', isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«Repase la Escritura y verá un patrón que se repite: antes del desastre, Dios habla.\n\nA Noé le avisó del diluvio con generaciones de anticipación.\n\nA Egipto le avisó del granizo, con hora anunciada.\n\nA Lot le avisó de Sodoma y lo sacó de la mano.\n\nA José le avisó del hambre con siete años de anticipación.\n\nPor medio de Agabo avisó de una hambruna que venía sobre el mundo.\n\nY a Pablo le mostró el naufragio antes de que zarparan.\n\nDios no es un Dios de sorpresas crueles. Dios avisa. El problema nunca ha sido el silencio de Dios: ha sido la sordera del hombre.»\n\nUSTED HACE\n\nVaya nombrando y señalando cada tarjeta. El efecto acumulativo es el argumento.');
}

/* 28 — Exodo 9:20-21 */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Éxodo 9:20-21', AMBER);
  title(s, 'Misma alerta. Dos respuestas.');
  const cw = 5.74;
  card(s, M, 2.35, cw, 2.85, PANEL);
  s.addText('EL QUE TEMIÓ LA PALABRA', {
    x: M + 0.45, y: 2.6, w: cw - 0.9, h: 0.45,
    fontFace: SANS, fontSize: 15, bold: true, color: TSUNAMI, charSpacing: 1.5, isTextBox: true, margin: 0
  });
  s.addText('«hizo huir sus criados y su ganado a casa»', {
    x: M + 0.45, y: 3.15, w: cw - 0.9, h: 1.3,
    fontFace: SERIF, fontSize: 23, color: CREAM, isTextBox: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.15
  });
  s.addText('Se salvó.', {
    x: M + 0.45, y: 4.5, w: cw - 0.9, h: 0.45,
    fontFace: SANS, fontSize: 18, bold: true, color: TSUNAMI, isTextBox: true, margin: 0
  });

  const x2 = M + cw + 0.35;
  card(s, x2, 2.35, cw, 2.85, PANEL);
  s.addText('EL QUE NO LA PUSO EN SU CORAZÓN', {
    x: x2 + 0.45, y: 2.6, w: cw - 0.9, h: 0.45,
    fontFace: SANS, fontSize: 15, bold: true, color: FIRE, charSpacing: 1.5, isTextBox: true, margin: 0
  });
  s.addText('«dejó sus criados y sus ganados en el campo»', {
    x: x2 + 0.45, y: 3.15, w: cw - 0.9, h: 1.3,
    fontFace: SERIF, fontSize: 23, color: CREAM, isTextBox: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.15
  });
  s.addText('Lo perdió todo.', {
    x: x2 + 0.45, y: 4.5, w: cw - 0.9, h: 0.45,
    fontFace: SANS, fontSize: 18, bold: true, color: FIRE, isTextBox: true, margin: 0
  });

  kicker(s, 'Toda la gestión de riesgo, en dos versículos. El problema no es la alerta: es la respuesta.', AMBER, 5.6, 21);
  notes(s, 'USTED DICE\n\n«Quiero detenerme en Egipto, porque el texto dice algo notable.\n\nDios anuncia el granizo con hora. Y el relato dice: “el que tuvo temor de la palabra de Jehová hizo huir sus criados y su ganado a casa; mas el que no puso en su corazón la palabra de Jehová, dejó sus criados y sus ganados en el campo”.\n\nMisma alerta. Dos respuestas. Dos resultados.\n\nAhí está toda la gestión de riesgo en dos versículos. Y ahí está la respuesta a por qué, con boletines, con radio, con celulares y con alerta roja declarada, seguimos contando muertos.\n\nEl problema no es la alerta. Es la respuesta.»\n\nUSTED HACE\n\nSeñale las dos columnas. Que la gente vea el contraste antes de que usted lo explique.');
}

/* 29 — Dios habla por medio de gente que avisa */
{
  const s = slideOn(BASE);
  rings(s, 12.9, 6.9, [1.9, 1.35, 0.8], BASE, '2A3446', 1);
  eyebrow(s, 'El oficio de avisar', AMBER);
  title(s, 'Dios habla por medio de gente que avisa');
  rows(s, [
    { head: 'El atalaya — Ezequiel 33', sub: 'Puesto en la muralla para ver antes que nadie.' },
    { head: 'Las trompetas de plata — Números 10', sub: 'Un sistema de señales acordado: un toque convoca, otro da alarma.' },
    { head: 'El punto de encuentro — Nehemías 4:20', sub: '«Donde oyereis el sonido de la trompeta, reuníos allí con nosotros».' },
    { head: 'La reacción esperada — Amós 3:6', sub: '¿Se tocará la trompeta en la ciudad, y no se alborotará el pueblo?' }
  ], { y: 2.35, gap: 0.98 });
  kicker(s, 'El atalaya no siempre lleva púlpito. A veces lleva casco.', AMBER, 6.25, 22);
  notes(s, 'USTED DICE\n\n«Dios no solo avisa: Dios levanta gente que avisa, y le da a ese oficio una dignidad enorme.\n\nEl atalaya de Ezequiel 33, puesto en la muralla para ver antes que nadie.\n\nLas trompetas de plata de Números 10: un sistema de señales acordado, con un toque para convocar y otro para dar alarma.\n\nNehemías 4:20: “donde oyereis el sonido de la trompeta, reuníos allí con nosotros”. Eso es un punto de encuentro. Nehemías tenía punto de encuentro.\n\nY Amós 3:6: “¿se tocará la trompeta en la ciudad, y no se alborotará el pueblo?”. Amós da por sentado que la reacción normal ante una alarma es moverse, no quedarse discutiendo si es real.»\n\nCIERRE DE LA DIAPOSITIVA\n\n«Cuando la oficina de meteorología emite un boletín, cuando Defensa Civil declara alerta, cuando el bombero toca la sirena: están cumpliendo una función que la Biblia considera sagrada.\n\nEl atalaya no siempre lleva púlpito. A veces lleva casco.»');
}

/* 30 — Dios habla DESPUES: socorro */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Hechos 11:29', AMBER);
  s.addText([
    { text: 'Cada uno conforme a lo que tenía, determinaron enviar ', options: { color: CREAM } },
    { text: 'socorro', options: { color: AMBER, bold: true } },
    { text: ' a los hermanos.', options: { color: CREAM } }
  ], {
    x: M, y: 1.15, w: CW, h: 1.6,
    fontFace: SERIF, fontSize: 32, isTextBox: true, margin: 0, valign: 'middle', lineSpacingMultiple: 1.15
  });
  const flow = ['Aviso', 'Decisión', 'Aporte según\ncapacidad', 'Recolección', 'Envío por manos\nresponsables'];
  const cw = 2.25, gap = 0.28;
  flow.forEach((t, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 3.05, cw, 1.35, PANEL);
    s.addText(t, {
      x: x + 0.12, y: 3.05, w: cw - 0.24, h: 1.35, align: 'center', valign: 'middle',
      fontFace: SANS, fontSize: 15, bold: true, color: CREAM, isTextBox: true, margin: 0
    });
    if (i < flow.length - 1) {
      s.addText('›', {
        x: x + cw, y: 3.05, w: gap, h: 1.35, align: 'center', valign: 'middle',
        fontFace: SANS, fontSize: 22, bold: true, color: AMBER, isTextBox: true, margin: 0
      });
    }
  });
  card(s, M, 4.95, CW, 1.75, AMBER);
  s.addText('LA IGLESIA ES UN\nORGANISMO DE SOCORRO.', {
    x: M, y: 4.95, w: CW, h: 1.75, align: 'center', valign: 'middle',
    fontFace: SERIF, fontSize: 34, bold: true, color: INK, isTextBox: true, margin: 0, lineSpacingMultiple: 1.05
  });
  notes(s, 'USTED DICE\n\n«Y después del desastre, Dios manda a socorrer.\n\nMiren la palabra que usa Hechos 11: los discípulos, cada uno conforme a lo que tenía, determinaron enviar SOCORRO. Ahí está la palabra.\n\nY miren el método: aporte según capacidad, recolección organizada, envío por manos responsables. Es una operación de ayuda humanitaria con rendición de cuentas. En el siglo primero.»\n\nAHORA DÍGALO CON TODAS SUS LETRAS\n\n«La iglesia es un organismo de socorro. No metafóricamente.\n\nDespués del desastre, ¿qué queda en pie en el barrio? El templo. ¿Quién tiene la lista de los ancianos que viven solos? Nosotros. ¿Quién puede convocar a cien voluntarios en una hora, sin presupuesto y sin contrato? Nosotros.\n\nSomos, en muchas comunidades, el primer respondiente después del vecino. La pregunta no es si vamos a responder. La pregunta es si vamos a responder preparados o improvisando.»\n\nAGREGUE AQUÍ (en esta versión Antioquía no tiene diapositiva propia)\n\n«Y fíjense de dónde sale esto: de una iglesia local. Llega Agabo a Antioquía, anuncia una gran hambre, y la iglesia decide, recoge y envía por manos responsables — Bernabé y Saulo. Con destino verificado y con cuentas claras.\n\nCuando esta iglesia organiza un centro de acopio, no está copiando a las ONG. Está copiando a Antioquía.»\n\nTRANSICIÓN\n\n«Entonces, si Dios avisa, si Dios manda a avisar y si Dios manda a socorrer, la pregunta se cae de madura: ¿cómo se prepara un cristiano?»');
}

/* =========================================================
   BLOQUE 3 — COMO SE PREPARA UN CRISTIANO
   ========================================================= */

/* 31 — Los dos errores */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Cómo se prepara un cristiano', AMBER);
  title(s, 'Dos errores y un camino');
  const cw = 3.9;
  card(s, M, 2.4, cw, 2.5, PANEL2);
  s.addText('Fatalismo espiritual', {
    x: M + 0.35, y: 2.65, w: cw - 0.7, h: 0.5,
    fontFace: SERIF, fontSize: 19, bold: true, color: FIRE, isTextBox: true, margin: 0, valign: 'middle'
  });
  s.addText('«Si Dios me guarda,\n¿para qué me preparo?»\n\nJesús lo llamó tentar a Dios.\nMateo 4:7', {
    x: M + 0.35, y: 3.2, w: cw - 0.7, h: 1.5,
    fontFace: SANS, fontSize: 14, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
  });

  const x3 = M + CW - cw;
  card(s, x3, 2.4, cw, 2.5, PANEL2);
  s.addText('Pánico acumulador', {
    x: x3 + 0.35, y: 2.65, w: cw - 0.7, h: 0.5,
    fontFace: SERIF, fontSize: 19, bold: true, color: FIRE, isTextBox: true, margin: 0, valign: 'middle'
  });
  s.addText('Noticias todo el día,\nla casa llena de provisiones,\nel estómago apretado.\n\nEso es miedo con logística.', {
    x: x3 + 0.35, y: 3.2, w: cw - 0.7, h: 1.5,
    fontFace: SANS, fontSize: 14, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
  });

  card(s, M, 5.15, CW, 1.75, AMBER);
  s.addText([
    { text: 'PRUDENCIA SERENA\n', options: { fontSize: 30, color: INK, bold: true, fontFace: SERIF } },
    { text: '«El caballo se alista para el día de la batalla; mas Jehová es el que da la victoria»  ·  Proverbios 21:31', options: { fontSize: 15, color: '4A3410', bold: true, fontFace: SANS } }
  ], {
    x: M, y: 5.15, w: CW, h: 1.75, align: 'center', valign: 'middle',
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.3
  });
  notes(s, 'USTED DICE\n\nBLOQUE 3 · 8 minutos — tres diapositivas\n\nUSTED DICE\n\n«Hay dos errores, y los dos son peligrosos.\n\nEl primero: el fatalismo espiritual. “Si Dios me va a guardar, ¿para qué me preparo?”. Suena espiritual. No lo es. Es la misma lógica que usó Satanás en la tentación: tírate del pináculo, que los ángeles te sostendrán. ¿Y qué contestó Jesús? “No tentarás al Señor tu Dios”.\n\nExponerse voluntariamente al peligro y llamarlo fe, Jesús lo llamó tentar a Dios.\n\nEl segundo: el pánico acumulador. El que ve noticias todo el día, llena la casa de provisiones y vive con el estómago apretado. Eso tampoco es fe. Eso es miedo con logística.\n\nEntre esos dos extremos está el camino bíblico: prudencia serena.\n\nProverbios 21:31 lo dice perfecto: “el caballo se alista para el día de la batalla; mas Jehová es el que da la victoria”.\n\nAlista el caballo. Confía en Jehová. Las dos cosas, en la misma frase.»');
}

/* 32 — Los siete niveles */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Preparación', AMBER);
  title(s, 'Siete niveles');
  const lv = [
    ['Espiritual', 'La casa sobre la roca'],
    ['Mental', 'Información sin intoxicación'],
    ['Cuerpo y casa', 'Mochila, botiquín, anclajes'],
    ['Familia', 'El plan escrito'],
    ['Económica', 'La quinta parte de José'],
    ['Comunitaria', 'La iglesia y el vecino'],
    ['De servicio', 'Capacitarse para socorrer']
  ];
  const cw = 2.65, ch = 1.5, gap = 0.31;
  lv.forEach((it, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = M + col * (cw + gap);
    const y = 2.35 + row * (ch + 0.32);
    card(s, x, y, cw, ch, PANEL);
    badge(s, x + 0.25, y + 0.22, 0.46, AMBER, i + 1, INK, 15);
    s.addText(it[0], {
      x: x + 0.25, y: y + 0.76, w: cw - 0.5, h: 0.34,
      fontFace: SANS, fontSize: 16, bold: true, color: CREAM, isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it[1], {
      x: x + 0.25, y: y + 1.08, w: cw - 0.5, h: 0.36,
      fontFace: SANS, fontSize: 12, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
    });
  });
  kicker(s, 'El día del desastre, el que llega primero es el que ya estaba ahí.', AMBER, 5.95, 22);
  notes(s, 'EN 45 MINUTOS: nombre los siete de corrido y desarrolle SOLO los tres primeros. El cuarto —el plan de la familia— tiene diapositiva propia a continuación. Los niveles 5, 6 y 7 se nombran y se dejan en la hoja del participante.\n\nUSTED DICE\n\n«Espiritual: ninguna mochila le sirve si su casa no está sobre la roca. Y fíjense que en esa parábola las dos casas reciben la misma tormenta. La diferencia no estuvo en el clima: estuvo en el cimiento.\n\nMental: infórmese de fuentes oficiales, no de cadenas de WhatsApp. Compartir un rumor en una emergencia es dar falso testimonio con consecuencias físicas. Y racione la noticia: Dios no nos dio espíritu de cobardía, sino de dominio propio.\n\nCuerpo y casa: mochila de setenta y dos horas, botiquín con los medicamentos crónicos de la familia — que es lo que más se olvida y lo que más falta hace.\n\nEconómica: José guardó la quinta parte en los años buenos. Un porcentaje, con disciplina, durante siete años.»\n\nUSTED HACE\n\nSi trajo la mochila de emergencia, ábrala aquí y saque dos o tres cosas. Con el reloj apretado, dos objetos bastan: los medicamentos crónicos y la linterna.\n\nY NO SE SALTE EL NIVEL 7, QUE ES EL LLAMADO\n\n«No basta con estar a salvo: Dios nos llamó a socorrer. Quiero que en cada célula, en cada ministerio, haya por lo menos una persona certificada en primeros auxilios. Porque el día del desastre, el que llega primero no es el experto que viene de lejos. El que llega primero es el que ya estaba ahí. Y ese, muchas veces, somos nosotros.»');
}

/* 33 — Las cinco preguntas */
{
  const s = slideOn(BASE);
  eyebrow(s, 'El plan de la familia', AMBER);
  title(s, 'Cinco preguntas que hay que poder\nresponder sin pensar', { size: 34, h: 1.4 });
  const q = [
    '¿Cuál es nuestro punto de encuentro?',
    '¿Y el segundo, fuera del barrio?',
    '¿Quién es el contacto fuera de la ciudad?',
    '¿Quién recoge a los niños? ¿La escuela lo sabe?',
    '¿Quién responde por el familiar vulnerable?'
  ];
  let y = 2.75;
  q.forEach((t, i) => {
    card(s, M, y, CW, 0.72, i % 2 === 0 ? PANEL : PANEL2);
    badge(s, M + 0.22, y + 0.14, 0.44, AMBER, i + 1, INK, 15);
    s.addText(t, {
      x: M + 0.9, y, w: CW - 1.3, h: 0.72,
      fontFace: SANS, fontSize: 19, color: CREAM, isTextBox: true, margin: 0, valign: 'middle'
    });
    y += 0.8;
  });
  kicker(s, 'Un plan que solo existe en su cabeza no es un plan: es una intención.', AMBER, 6.55, 20);
  notes(s, 'USTED DICE\n\n«Cinco preguntas que toda familia debe poder responder sin pensar.\n\n¿Cuál es nuestro punto de encuentro si no podemos volver a la casa?\n\n¿Cuál es el segundo punto, fuera del barrio, si no se puede entrar a la zona?\n\n¿Quién es nuestro contacto fuera de la ciudad, al que todos llamamos si no logramos comunicarnos entre nosotros?\n\n¿Quién recoge a los niños, y la escuela sabe que esa persona está autorizada?\n\nY ¿quién responde por el familiar vulnerable: el anciano, el enfermo, la persona con discapacidad, la embarazada?»\n\nEL REMATE\n\n«Ese plan hay que escribirlo y practicarlo. Un plan que solo existe en su cabeza no es un plan: es una intención.\n\nHáganlo esta semana, en la mesa, con los muchachos. Que sea corto. Que sea claro. Que todos lo sepan. Está en la hoja que les entregamos, en el reverso.»\n\nTRANSICIÓN\n\n«Ahora bien, hay una pregunta que no podemos esquivar, porque es la que la gente hace de verdad cuando el techo se cae: ¿por qué? ¿Es Dios el que manda el huracán?»');
}

/* =========================================================
   BLOQUE 5 — EJEMPLOS BIBLICOS
   ========================================================= */

notes(sectionSlide('04', 'Ejemplos bíblicos', AMBER,
  'La Biblia no nos dio una teoría del desastre: nos dio rostros'),
'BLOQUE 5 · 7 minutos\n\nUSTED DICE\n\n«Déjenme cerrar mostrándoles gente. Porque la Biblia no nos dio una teoría del desastre: nos dio rostros.»\n\nRITMO\n\nSon tres ejemplos en siete minutos: Noé (prevención), José (planificación) y Pablo en el naufragio, que cierra con Hechos 27:31. Poco más de dos minutos cada uno. No se enamore de uno: el peso acumulado es el argumento.\n\nNehemías y Antioquía quedan fuera del deck en esta versión, pero Nehemías 4:9 ya salió en la apertura y la iglesia de Antioquía está en la diapositiva del socorro.');

/* 39 — Noe */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Génesis 6-9 · Hebreos 11:7', AMBER);
  title(s, 'Noé');
  s.addText('El que se preparó cuando no había una nube en el cielo', {
    x: M, y: 1.95, w: CW, h: 0.5,
    fontFace: SERIF, fontSize: 21, italic: true, color: AMBER, isTextBox: true, margin: 0
  });
  rows(s, [
    { head: 'Fue advertido', sub: 'El aviso llegó antes de que hubiera cualquier evidencia visible.' },
    { head: 'Las cosas aún no se veían', sub: 'Martilló durante años bajo cielo despejado, mientras se reían.' },
    { head: 'Preparó el arca', sub: 'Con medidas exactas, material especificado y provisiones. La fe se midió en codos.' }
  ], { y: 2.9, gap: 1.05 });
  kicker(s, 'Prevención es trabajar hoy por un riesgo que hoy no se ve.', AMBER, 6.15, 22);
  notes(s, 'USTED DICE\n\n«“Por la fe Noé, cuando fue advertido por Dios acerca de cosas que aún no se veían, con temor preparó el arca en que su casa se salvase”.\n\nSubrayen tres cosas de ese versículo: fue ADVERTIDO; las cosas AÚN NO SE VEÍAN; y él PREPARÓ.\n\nLa construcción del arca fue un acto de fe con planos, con medidas y con materiales. Dios le dio dimensiones exactas y un tipo de madera. La fe de Noé se midió en codos.\n\nY aquí está lo que más me impresiona: Noé se preparó años antes, mientras el cielo seguía azul y los vecinos se reían.\n\nEso es prevención: trabajar hoy por un riesgo que hoy no se ve.»\n\nAGREGUE\n\nEl arca fue “en que su casa se salvase”: la preparación del creyente cubre a los suyos, no solo a él.');
}

/* 40 — Jose */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Génesis 41', AMBER);
  title(s, 'José');
  s.addText('El que convirtió un aviso en política pública', {
    x: M, y: 1.95, w: CW, h: 0.5,
    fontFace: SERIF, fontSize: 21, italic: true, color: AMBER, isTextBox: true, margin: 0
  });
  const steps = [
    ['7 + 7', 'años previstos'],
    ['20%', 'de reserva'],
    ['1', 'responsable\nnombrado'],
    ['0', 'muertos\nde hambre']
  ];
  const cw = 2.72, gap = 0.32;
  steps.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.85, cw, 2.05, i === 3 ? AMBER : PANEL);
    s.addText(it[0], {
      x: x + 0.1, y: 3.05, w: cw - 0.2, h: 0.85,
      fontFace: SERIF, fontSize: 40, bold: true, color: i === 3 ? INK : AMBER,
      align: 'center', valign: 'middle', isTextBox: true, margin: 0
    });
    s.addText(it[1], {
      x: x + 0.1, y: 3.92, w: cw - 0.2, h: 0.8,
      fontFace: SANS, fontSize: 14, color: i === 3 ? '4A3410' : MUTED,
      align: 'center', valign: 'top', isTextBox: true, margin: 0
    });
  });
  kicker(s, 'La previsión de un hombre justo alimentó a un continente.', AMBER, 5.25, 23);
  s.addText('Aviso › plan de 20 años › responsable › reserva › almacenes › distribución ordenada', {
    x: M, y: 6.25, w: CW, h: 0.5,
    fontFace: SANS, fontSize: 15, color: MUTED, isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«José recibe el aviso de siete años de hambre, y no monta una campaña de oración solamente: diseña un plan de veinte años.\n\nNombra un responsable. Establece una reserva del veinte por ciento. Construye almacenes. Administra el inventario. Y en la crisis distribuye ordenadamente.\n\nEl texto dice que guardaron “como la arena del mar, mucho en extremo, hasta no poderse contar”.\n\nResultado: Egipto no pereció de hambre, y las naciones de alrededor tampoco, porque venían a comprar.\n\nLa previsión de un hombre justo alimentó a un continente.»\n\nEL PUENTE A HOY\n\n«Eso es lo que hace hoy un plan nacional de gestión de riesgo, una reserva estratégica, un fondo de contingencia. Y su modelo es José.\n\nY fíjense que José no lo guardó todo ni lo consumió todo: guardó un porcentaje, con disciplina, durante siete años seguidos. Eso es lo que hace falta en una casa y en una iglesia.»');
}

/* 42 — Pablo, Hechos 27 */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Hechos 27', AMBER);
  title(s, 'Pablo en el naufragio');
  s.addText('El mejor manual de manejo de crisis de la Biblia', {
    x: M, y: 1.95, w: CW, h: 0.5,
    fontFace: SERIF, fontSize: 21, italic: true, color: AMBER, isTextBox: true, margin: 0
  });
  const acts = [
    ['Advirtió antes de zarpar', 'v. 10'],
    ['No dijo «se lo dije»: animó', 'v. 22'],
    ['Retuvo a la tripulación', 'v. 31'],
    ['Los hizo comer', 'v. 34'],
    ['Dio gracias delante de todos', 'v. 35']
  ];
  let y = 2.75;
  acts.forEach((it, i) => {
    card(s, M, y, 7.4, 0.62, i % 2 === 0 ? PANEL : PANEL2);
    badge(s, M + 0.18, y + 0.1, 0.42, AMBER, i + 1, INK, 14);
    s.addText(it[0], {
      x: M + 0.78, y, w: 5.3, h: 0.62,
      fontFace: SANS, fontSize: 17, color: CREAM, isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it[1], {
      x: M + 6.2, y, w: 1.0, h: 0.62,
      fontFace: SANS, fontSize: 13, bold: true, color: AMBER, align: 'right', isTextBox: true, margin: 0, valign: 'middle'
    });
    y += 0.7;
  });
  card(s, M + 7.85, 2.75, 3.68, 3.02, AMBER);
  s.addText('276', {
    x: M + 7.85, y: 3.05, w: 3.68, h: 1.2,
    fontFace: SERIF, fontSize: 68, bold: true, color: INK, align: 'center', valign: 'middle', isTextBox: true, margin: 0
  });
  s.addText('personas a bordo\n\nNi una perdida.', {
    x: M + 8.0, y: 4.3, w: 3.38, h: 1.3,
    fontFace: SANS, fontSize: 17, bold: true, color: '4A3410', align: 'center', valign: 'top', isTextBox: true, margin: 0, lineSpacingMultiple: 1.1
  });
  kicker(s, 'Un preso a bordo terminó dirigiendo el rescate.', AMBER, 6.2, 21);
  notes(s, 'USTED DICE\n\nCuente la historia, no la lea. Vaya señalando cada línea.\n\n«Uno: Pablo advierte el riesgo antes de zarpar. Y le ignoran. Al experto lo ignoran, porque el piloto y el dueño del barco tenían prisa. Eso pasa todos los días.\n\nDos: cuando revienta la tormenta, Pablo no dice “se lo dije”. Se pone de pie y dice: “tened buen ánimo”.\n\nTres: y da la razón de su calma. “Creo a Dios que será así como se me ha dicho”. Su serenidad tenía fundamento: no era negación.\n\nCuatro: detecta a los marineros que intentaban escapar en la lancha y avisa: “si éstos no permanecen en la nave, vosotros no podéis salvaros”.\n\nCinco: los hace comer para que tengan fuerzas. Cuida lo físico, no solo lo espiritual.\n\nSeis: da gracias a Dios delante de todos, en medio del temporal.\n\nY el versículo 44: “y así aconteció que todos se salvaron saliendo a tierra”. Doscientas setenta y seis personas. Ni una perdida.\n\nUn preso a bordo terminó dirigiendo el rescate, porque era el único que tenía a la vez palabra de Dios y cabeza fría.»');
}

/* 43 — Hechos 27:31 */
{
  const s = verseSlide([
    { text: 'Si éstos ', options: { color: CREAM } },
    { text: 'no permanecen en la nave', options: { color: AMBER, bold: true } },
    { text: ', vosotros no podéis salvaros.', options: { color: CREAM } }
  ], 'Hechos 27:31', { eyebrow: 'La joya del capítulo', size: 33, th: 2.2 });
  kicker(s, 'La promesa de Dios no sustituye a la tripulación.', AMBER, 5.95, 26);
  notes(s, 'USTED DICE\n\n«Quiero que se lleven este versículo por encima de todos los demás de la noche.\n\nDios ya había prometido, por boca de un ángel, que no se perdería ni una sola vida. Ya estaba prometido.\n\nY aun así, cuando los marineros intentan huir en la lancha, Pablo dice: “si éstos no permanecen en la nave, vosotros no podéis salvaros”.\n\nEscuchen bien: la promesa de Dios no anulaba la necesidad de la tripulación. Hacía falta que los hombres capacitados se quedaran en su puesto.\n\nLa promesa de Dios no sustituye a la tripulación.\n\nEscriban eso. Porque cada vez que alguien diga que prepararse es falta de fe, la respuesta está en Hechos 27:31.»\n\nUSTED HACE\n\nDeje silencio después de la frase final. Es el cierre argumental de toda la conferencia.');
}

/* =========================================================
   CIERRE
   ========================================================= */

/* 45 — Cuatro cosas para llevarse */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Cierre', AMBER);
  title(s, 'Cuatro cosas para llevarse');
  const take = [
    ['Dios avisa', 'Antes de Noé, antes de José, antes del naufragio. El sistema de alerta temprana es idea suya.'],
    ['Prepararse es obediencia', 'Oramos Y ponemos guarda. Nunca fue una disyuntiva.'],
    ['La tragedia no es sentencia', 'Jesús prohibió esa lectura en Lucas 13. Frente al que sufre vamos con las manos.'],
    ['La iglesia socorre', 'Y el que llega primero es el que ya estaba ahí.']
  ];
  const cw2 = 5.74, ch = 1.75;
  take.forEach((it, i) => {
    const x = M + (i % 2) * (cw2 + 0.35);
    const y = 2.3 + Math.floor(i / 2) * (ch + 0.32);
    card(s, x, y, cw2, ch, PANEL);
    badge(s, x + 0.34, y + 0.32, 0.6, AMBER, i + 1, INK, 20);
    s.addText(it[0], {
      x: x + 1.12, y: y + 0.2, w: cw2 - 1.45, h: 0.62,
      fontFace: SERIF, fontSize: 21, bold: true, color: AMBER, isTextBox: true, margin: 0, valign: 'top'
    });
    s.addText(it[1], {
      x: x + 1.12, y: y + 0.86, w: cw2 - 1.45, h: 0.76,
      fontFace: SANS, fontSize: 14, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
    });
  });
  notes(s, 'USTED DICE\n\nCuatro frases, no más. No las desarrolle: ya las desarrolló toda la noche. Después pase directo al llamado.\n\n«Cuatro cosas para llevarse:\n\nUno: Dios avisa. Siempre avisó. Antes de Noé, antes de José, antes del naufragio. El sistema de alerta temprana es idea suya.\n\nDos: prepararse es obediencia, no incredulidad. Oramos Y ponemos guarda.\n\nTres: la tragedia no es sentencia. Jesús mismo prohibió esa lectura en Lucas 13. Frente al que sufre no vamos con explicaciones: vamos con las manos.\n\nCuatro: la iglesia es un organismo de socorro. Y el que llega primero es el que ya estaba ahí.»');
}

/* 46 — Tres compromisos */
{
  const s = slideOn(BASE);
  eyebrow(s, 'El llamado', AMBER);
  title(s, 'No quiero aplausos. Quiero decisiones.');
  const c = [
    ['El plan de mi casa', 'Esta semana, en la mesa, con la familia. Escríbalo: no lo piense.'],
    ['Capacitarme', 'Anoto mi nombre para el curso de primeros auxilios y para la brigada.'],
    ['Mi vecino', 'La persona de mi cuadra que no podría salir sola. Póngale nombre.']
  ];
  const cw = 3.68, gap = 0.35;
  c.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.5, cw, 3.3, i === 2 ? AMBER : PANEL);
    badge(s, x + 0.35, 2.82, 0.7, i === 2 ? INK : AMBER, i + 1, i === 2 ? AMBER : INK, 24);
    s.addText(it[0], {
      x: x + 0.35, y: 3.7, w: cw - 0.7, h: 0.78,
      fontFace: SERIF, fontSize: 23, bold: true, color: i === 2 ? INK : CREAM,
      isTextBox: true, margin: 0, valign: 'top'
    });
    s.addText(it[1], {
      x: x + 0.35, y: 4.54, w: cw - 0.7, h: 1.05,
      fontFace: SANS, fontSize: 14, color: i === 2 ? '4A3410' : MUTED,
      isTextBox: true, margin: 0, valign: 'top'
    });
  });
  kicker(s, 'Eso es amar al prójimo con un plan.', AMBER, 6.1, 23);
  notes(s, 'USTED DICE\n\n«No quiero aplausos. Quiero decisiones. Tres, y son de esta semana.\n\nPrimero, el plan de mi casa. Esta semana, en la mesa, con la familia: punto de encuentro, contacto, mochila. Está en la hoja que les entregamos, en el reverso. Escríbanlo. No lo piensen: escríbanlo.\n\nSegundo, capacitarme. Quiero que salgan de aquí nombres anotados para el curso de primeros auxilios y para la brigada de esta iglesia.»\n\nUSTED HACE\n\nPida que levanten la mano ahora mismo. Tenga a alguien anotando nombres de verdad, con papel, en la puerta. Si no sale una lista esta noche, no sale nunca.\n\nUSTED DICE\n\n«Y tercero, mi vecino. Piense en una persona de su cuadra que no podría salir sola: el anciano, el enfermo, la señora con el niño pequeño, la persona con discapacidad.\n\nPóngale nombre. Ahora mismo, en su mente, póngale nombre.\n\nY comprométase delante de Dios a que, si pasa algo, usted toca esa puerta antes de irse.\n\nEso es amar al prójimo con un plan.»\n\nY RECUERDE LA HOJA\n\n«Todo lo que no nos dio tiempo de ver hoy — maremotos, primeros auxilios, los siete niveles completos — está en la hoja que les entregamos. No la pierdan.»');
}

/* 47 — Final */
{
  const s = slideOn(INK);
  rings(s, 6.66, 3.6, [4.2, 3.2, 2.3, 1.45, 0.7], INK, '2A3446', 1.25);
  s.addShape(S.ellipse, { x: 6.26, y: 3.2, w: 0.8, h: 0.8, fill: { color: AMBER }, line: { color: AMBER, width: 1 } });
  s.addText('Hoy usted vio.', {
    x: 1.3, y: 1.6, w: W - 2.6, h: 0.9,
    fontFace: SERIF, fontSize: 34, color: MUTED, align: 'center', valign: 'middle', isTextBox: true, margin: 0
  });
  s.addText('Ahora toque la trompeta\nen su casa.', {
    x: 1.3, y: 4.35, w: W - 2.6, h: 1.8,
    fontFace: SERIF, fontSize: 44, bold: true, color: AMBER, align: 'center', valign: 'middle',
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.1
  });
  s.addText('EZEQUIEL 33:6', {
    x: 1.3, y: 6.35, w: W - 2.6, h: 0.4,
    fontFace: SANS, fontSize: 14, bold: true, color: DIM, charSpacing: 3, align: 'center', isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«Termino donde empecé, con el atalaya de Ezequiel.\n\nEl atalaya no podía detener la espada. Usted no puede detener el huracán, ni el temblor, ni el fuego. Nadie se lo está pidiendo.\n\nPero el atalaya sí podía ver a tiempo y avisar a tiempo. Y de eso, dice Dios, sí somos responsables.\n\nHoy usted vio. Ya no puede decir que no sabía.\n\nAhora toque la trompeta en su casa.»\n\nORACIÓN DE CIERRE\n\n«Señor, tú eres nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones. Gracias porque nunca nos has dejado sin aviso. Perdónanos por las veces que llamamos fe a lo que era descuido, y por las veces que llamamos prudencia a lo que era miedo. Danos manos preparadas y corazón sereno. Que cuando la tierra se mueva, tu pueblo no corra: sirva. Y haznos, en el barrio donde nos pusiste, la casa a la que la gente sabe que puede tocar. En el nombre de Jesús, amén.»\n\nDESPUÉS\n\nQuédese disponible. Alguien va a querer hablar.');
}

const out = process.argv[2] || 'deck.pptx';
pres.writeFile({ fileName: out }).then(() => console.log('Escrito: ' + out));
