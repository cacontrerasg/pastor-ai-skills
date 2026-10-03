const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';            // 13.33 x 7.5
pres.author = 'Carlos Contreras';
pres.title  = 'Organismos de Socorro y la Biblia';
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
  notes(s, 'ANTES DE EMPEZAR\n\nNo salude. No agradezca. No presente el tema todavía. Entre en frío con la pregunta de la diapositiva siguiente: la atención se gana en los primeros diez segundos, y un saludo largo la gasta.\n\nSi tiene que presentarse, hágalo después de la dinámica de la salida, en una sola frase: «Mi nombre es Carlos Contreras, y vengo a hablarles de dos mundos que casi nunca se juntan: los organismos de socorro y la Biblia.»');
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

/* 7 — Agenda */
{
  const s = slideOn(BASE);
  rings(s, 12.9, 0.5, [2.0, 1.45, 0.9], BASE, '2A3446', 1);
  eyebrow(s, 'Recorrido', AMBER);
  title(s, 'Lo que vamos a hacer');
  rows(s, [
    { head: 'Medidas de seguridad', sub: 'Terremoto, ciclón, maremoto, incendio y accidentes' },
    { head: '¿Qué habla Dios ante las emergencias?', sub: 'Antes, durante y después del desastre' },
    { head: 'Cómo se prepara un cristiano', sub: 'Siete niveles, del espíritu al vecino' },
    { head: 'La Biblia y los fenómenos naturales', sub: 'Seis verdades que dan suelo firme' },
    { head: 'Ejemplos bíblicos', sub: 'Noé, José, Nehemías, Pablo y Antioquía' }
  ], { y: 2.35, gap: 0.92, headSize: 20 });
  notes(s, 'USTED DICE\n\n«Vamos a hacer cuatro cosas. Primero, lo práctico: qué hacer ante un terremoto, un ciclón, un maremoto, un incendio y un accidente. Segundo, qué habla Dios ante las emergencias. Tercero, cómo se prepara un cristiano en un mundo lleno de amenazas. Y cuarto, qué nos enseña la Escritura sobre los fenómenos de la naturaleza, con ejemplos bíblicos que van a cambiar la forma en que usted lee esas historias.\n\nY les hago una promesa: nadie sale de aquí igual que como entró. Van a salir con un plan escrito. Uno de verdad.»\n\nTRANSICIÓN\n\n«Empecemos por lo más urgente. Porque si la tierra tiembla mientras hablamos de teología, la teología no le va a servir de nada si no sabe qué hacer con su cuerpo en los próximos diez segundos.»');
}

/* =========================================================
   BLOQUE 1 — MEDIDAS DE SEGURIDAD
   ========================================================= */

notes(sectionSlide('01', 'Medidas de seguridad', AMBER,
  'Terremotos · Ciclones · Maremotos · Incendios · Accidentes'),
'BLOQUE 1 · 25 minutos\n\nUSTED DICE\n\n«Empecemos por lo más urgente, y después vamos a la Biblia. Porque si la tierra tiembla mientras estamos hablando de teología, la teología no le va a servir de nada si usted no sabe qué hacer con su cuerpo en los próximos diez segundos.»\n\nREGLA DEL BLOQUE\n\nNo intente cubrirlo todo. Enseñe pocas acciones, bien memorizadas. Una acción que la gente recuerda vale más que veinte que olvida.\n\nCONTROLE EL RELOJ\n\nEste es el bloque más fácil de dictar y el que más tienta a extenderse. Si se pasa, le va a quitar minutos al Bloque 2 — que es el corazón de la conferencia.');

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

/* 11 — Terremoto: despues */
{
  const s = slideOn(BASE);
  rings(s, 12.8, 6.9, [1.9, 1.35, 0.8], BASE, '2A3446', 1);
  eyebrow(s, 'Terremoto · después', QUAKE);
  title(s, 'Los minutos que siguen');
  rows(s, [
    { head: 'Espere réplicas', sub: 'Van a venir. Aléjese de paredes agrietadas y techos dañados.' },
    { head: 'Gas antes que fuego', sub: 'No encienda fósforos, velas ni interruptores hasta descartar fuga.' },
    { head: 'Calzado cerrado', sub: 'El piso queda lleno de vidrio. Por eso los zapatos van bajo la cama.' },
    { head: 'Mensajes, no llamadas', sub: 'La red se satura. El texto pasa cuando la llamada no.' }
  ], { y: 2.4, gap: 1.0, accent: QUAKE });
  notes(s, 'USTED DICE\n\n«Paró el temblor. Los minutos que siguen deciden mucho.\n\nEspere réplicas: van a venir, y son las que tumban lo que quedó debilitado.\n\nNo encienda fósforos, velas ni el interruptor de la luz hasta descartar fuga de gas. Si huele a gas: cierre la válvula, ventile y salga.\n\nRevise heridos a su alrededor antes de salir corriendo.\n\nSalga con calzado cerrado: el piso queda lleno de vidrio. Por eso los zapatos van debajo de la cama.\n\nY use el celular para mensajes de texto, no para llamadas: la red se satura, y el texto pasa cuando la llamada no.»\n\nSI SE LO PREGUNTAN\n\nSi queda atrapado: no grite sin necesidad, porque agota y hace tragar polvo. Golpee una tubería o una pared a intervalos regulares, y cúbrase la boca.');
}

/* 12 — Terremoto: hoy en su casa */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Terremoto · prevención', QUAKE);
  title(s, 'Dos cosas que puede hacer hoy');
  const two = [
    ['Ancle los muebles altos', 'Estantes, armarios, televisor, calentador. Y nada pesado sobre las camas.'],
    ['Zapatos y linterna\nbajo la cama', 'La medida más barata y más subestimada que existe.']
  ];
  two.forEach((it, i) => {
    const x = M + i * (5.74 + 0.35);
    card(s, x, 2.5, 5.74, 3.1, PANEL);
    badge(s, x + 0.45, 2.9, 0.7, QUAKE, i + 1, INK, 24);
    s.addText(it[0], {
      x: x + 0.45, y: 3.8, w: 5.74 - 0.9, h: 0.9,
      fontFace: SERIF, fontSize: 24, bold: true, color: CREAM, isTextBox: true, margin: 0, valign: 'top'
    });
    s.addText(it[1], {
      x: x + 0.45, y: 4.72, w: 5.74 - 0.9, h: 0.75,
      fontFace: SANS, fontSize: 15, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
    });
  });
  kicker(s, 'El sismo no avisa: todo lo que hará en él lo decidió antes.', QUAKE, 5.95, 21);
  notes(s, 'USTED DICE\n\n«Dos cosas que puede hacer esta semana, sin gastar casi nada.\n\nPrimera: anclar a la pared lo que puede caerle encima. Estantes altos, armarios, el televisor, el calentador. Y no dormir debajo de repisas, cuadros pesados ni espejos.\n\nSegunda, y es la medida más barata y más subestimada que existe: un par de zapatos y una linterna debajo de la cama.\n\nPorque el sismo no avisa. No hay boletín, no hay temporada, no hay días de preparación. Todo lo que usted va a hacer en un terremoto lo decidió antes.»\n\nAGREGUE\n\nQue más de una persona de la casa sepa dónde está y cómo se cierra la llave del gas, y dónde está el interruptor principal de la electricidad.');
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

/* 17 — Maremoto: las tres senales */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Maremoto · alerta', TSUNAMI);
  title(s, 'Tres señales naturales. Cualquiera basta.');
  const sig = [
    ['Sismo fuerte', 'Tan fuerte que cuesta mantenerse de pie, o largo aunque sea suave, estando en la costa.'],
    ['El mar se comporta raro', 'Se retira y deja el fondo al descubierto, o sube de golpe fuera de la marea.'],
    ['Un rugido desde el mar', 'Un estruendo continuo, parecido a un tren o a un avión.']
  ];
  const cw = 3.68, gap = 0.35;
  sig.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.45, cw, 3.2, PANEL);
    badge(s, x + 0.35, 2.8, 0.6, TSUNAMI, i + 1, INK, 20);
    s.addText(it[0], {
      x: x + 0.35, y: 3.62, w: cw - 0.7, h: 0.75,
      fontFace: SERIF, fontSize: 22, bold: true, color: CREAM, isTextBox: true, margin: 0, valign: 'top'
    });
    s.addText(it[1], {
      x: x + 0.35, y: 4.4, w: cw - 0.7, h: 1.1,
      fontFace: SANS, fontSize: 14, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
    });
  });
  kicker(s, 'Un maremoto local llega en minutos. No hay tiempo para un boletín.', TSUNAMI, 5.95, 20);
  notes(s, 'USTED DICE\n\n«En un maremoto de origen cercano, entre el sismo y la ola pueden pasar pocos minutos. Ningún sistema oficial es más rápido que la señal natural. Por eso hay que conocerlas.\n\nPrimera: un sismo tan fuerte que le cuesta mantenerse de pie, o uno más débil pero que dura mucho, si usted está en la costa.\n\nSegunda: el mar se comporta raro. Se retira y deja el fondo al descubierto, o sube de golpe fuera de la marea.\n\nTercera: un rugido desde el mar, parecido a un tren o a un avión.\n\nCualquiera de las tres, sola, basta para evacuar.»\n\nCONTEXTO\n\n«Esto no es teórico para nosotros. El Caribe ha tenido maremotos destructivos, con pérdida de vidas en nuestras propias costas. La memoria corta es la aliada del desastre.»');
}

/* 18 — Maremoto: la regla */
{
  const s = slideOn(TSUNAMI);
  rings(s, 0.2, 7.3, [2.6, 1.9, 1.2], TSUNAMI, '0C3A2E', 1.3);
  bigStatement(s, 'NO ESPERE EL AVISO OFICIAL.\nEL SISMO ES EL AVISO.', { size: 42, color: '0C3A2E', y: 2.1, h: 2.0 });
  const acts = ['SUBA', 'ALÉJESE', 'A PIE', 'NO REGRESE'];
  acts.forEach((t, i) => {
    const cw = 2.72, gap = 0.3;
    const x = 1.28 + i * (cw + gap);
    s.addShape(S.roundRect, { x, y: 4.55, w: cw, h: 0.95, rectRadius: 0.08, fill: { color: '0C3A2E' }, line: { color: '0C3A2E', width: 1 } });
    s.addText(t, {
      x, y: 4.55, w: cw, h: 0.95, align: 'center', valign: 'middle',
      fontFace: SANS, fontSize: 19, bold: true, color: 'FFFFFF', isTextBox: true, margin: 0
    });
  });
  s.addText('La primera ola no es la mayor. El peligro dura horas.', {
    x: 1.2, y: 5.85, w: W - 2.4, h: 0.5,
    fontFace: SANS, fontSize: 17, bold: true, color: '0C3A2E', align: 'center', isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«Y aquí está la regla — quiero que se la lleven grabada: no espere el aviso oficial. El sismo es el aviso.\n\nSuba. Lo más alto que pueda.\n\nAléjese. Lo más tierra adentro que alcance.\n\nA pie, no en vehículo: el tapón de vehículos ha matado a más gente que la ola.\n\nY no regrese. La primera ola no es la mayor, y el peligro dura horas. Se regresa cuando la autoridad lo autoriza, no antes.»\n\nSI SE LO PREGUNTAN\n\nSi no hay terreno alto y no se puede salir a tiempo, el último recurso es subir a los pisos superiores de una edificación alta y sólida de concreto. Y si está embarcado mar adentro: no entre a puerto, váyase a aguas profundas.');
}

/* 19 — Genesis 19:17 */
{
  const s = verseSlide([
    { text: 'Escapa por tu vida; ', options: { color: CREAM } },
    { text: 'no mires tras ti', options: { color: TSUNAMI, bold: true } },
    { text: ', ni pares en toda esta llanura; ', options: { color: CREAM } },
    { text: 'escapa al monte', options: { color: TSUNAMI, bold: true } },
    { text: ', no sea que perezcas.', options: { color: CREAM } }
  ], 'Génesis 19:17', { eyebrow: 'Maremoto · fundamento', accent: TSUNAMI, size: 30, th: 2.6 });
  kicker(s, 'Sube. No recojas. No mires atrás. Es el protocolo de evacuación, en Génesis 19.', TSUNAMI, 5.95, 21);
  notes(s, 'USTED DICE\n\n«Escuchen esa orden, palabra por palabra: “escapa por tu vida; no mires tras ti… escapa al monte”.\n\nSube. No recojas. No mires atrás.\n\nEse es, literalmente, el protocolo de evacuación ante un maremoto. Y está en Génesis 19.»\n\nAGREGUE\n\n«Y fíjense en lo que le pasó a la mujer de Lot. El que se detiene o vuelve atrás en una evacuación, perece. No es una leyenda para asustar niños: es lo que pasa en toda evacuación real, cuando alguien regresa por algo.»\n\nTambién vale mencionar que al yerno de Lot “le pareció como que se burlaba”. La incredulidad ante la alerta cuesta vidas.');
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
  notes(s, 'USTED DICE\n\n«Si no se puede apagar, hay que salir. Y salir bien.\n\nCon humo: agáchese y gatee. El aire respirable y frío está cerca del piso. Arriba está el humo caliente — y el humo es lo que mata, no la llama.\n\nAntes de abrir una puerta, tóquela con el DORSO de la mano. Con el dorso, porque si quema usted retira la mano por reflejo sin quemarse la palma. Si está caliente, no abra: busque otra ruta.\n\nNunca el ascensor.\n\nPunto de encuentro afuera y conteo de personas. Y nadie vuelve a entrar. Por nada: ni por documentos, ni por mascotas, ni por recuerdos.\n\nY si su ropa se enciende: deténgase, tírese al piso y ruede.»\n\nSI SE LO PREGUNTAN\n\nSi queda atrapado en una habitación: selle las rendijas con ropa o toallas, hágase visible desde la ventana y llame indicando su ubicación exacta.');
}

/* 24 — Accidentes: los tres pasos */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Accidentes · primeros auxilios', HELP);
  title(s, 'Lo primero, siempre');
  const three = [
    ['PROTEGER', 'Su seguridad primero. Un socorrista herido es un paciente más.'],
    ['AVISAR', 'Señale a una persona concreta para que llame. No pida al aire.'],
    ['SOCORRER', 'Atienda lo que mata más rápido: vía aérea y hemorragia.']
  ];
  const cw = 3.68, gap = 0.35;
  three.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.5, cw, 3.05, PANEL);
    badge(s, x + cw / 2 - 0.35, 2.85, 0.7, HELP, i + 1, INK, 24);
    s.addText(it[0], {
      x: x + 0.15, y: 3.75, w: cw - 0.3, h: 0.6,
      fontFace: SERIF, fontSize: 25, bold: true, color: CREAM,
      align: 'center', isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it[1], {
      x: x + 0.35, y: 4.38, w: cw - 0.7, h: 1.0,
      fontFace: SANS, fontSize: 14, color: MUTED,
      align: 'center', isTextBox: true, margin: 0, valign: 'top'
    });
  });
  kicker(s, 'No mueva al lesionado salvo peligro inminente de muerte.', HELP, 5.85, 21);
  notes(s, 'USTED DICE\n\n«Miren la secuencia del buen samaritano: se acerca, evalúa, trata la herida con lo que tiene, traslada al herido, lo entrega a un nivel de cuidado mayor y paga la atención continua.\n\nEso es, literalmente, la cadena de atención prehospitalaria. Está en Lucas 10. En el siglo primero.\n\nY lo primero, siempre, son tres pasos.\n\nProteger: su seguridad primero. Un socorrista herido es un paciente más, no una ayuda.\n\nAvisar: llame, o señale a una persona concreta con el dedo para que llame. Si usted grita “que alguien llame”, nadie llama.\n\nSocorrer: atienda primero lo que mata más rápido.»\n\nCÓMO SE LLAMA A EMERGENCIAS\n\nQué pasó, dónde exactamente con una referencia visible, cuántos lesionados, qué riesgos hay en el lugar, y quién es usted. No cuelgue hasta que el operador lo indique.');
}

/* 25 — Accidentes: cuatro cosas */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Accidentes · lo esencial', HELP);
  title(s, 'Cuatro cosas que todo cristiano debería saber hacer');
  const four = [
    ['Hemorragia', 'Presión directa, firme y sostenida. No suelte para revisar.'],
    ['Atragantamiento', 'Si tose con fuerza, no interfiera. Si no puede, compresiones abdominales.'],
    ['Paro cardíaco', 'Compresiones fuertes y rápidas en el centro del pecho, sin parar.'],
    ['Quemaduras', 'Agua a temperatura ambiente, 20 minutos. Ni hielo, ni pasta, ni aceite.']
  ];
  const cw2 = 5.74, ch = 1.38;
  four.forEach((it, i) => {
    const x = M + (i % 2) * (cw2 + 0.35);
    const y = 2.4 + Math.floor(i / 2) * (ch + 0.32);
    card(s, x, y, cw2, ch, PANEL);
    badge(s, x + 0.34, y + 0.4, 0.58, HELP, i + 1, INK, 19);
    s.addText(it[0], {
      x: x + 1.1, y: y + 0.2, w: cw2 - 1.4, h: 0.42,
      fontFace: SANS, fontSize: 18, bold: true, color: CREAM, isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it[1], {
      x: x + 1.1, y: y + 0.64, w: cw2 - 1.4, h: 0.6,
      fontFace: SANS, fontSize: 14, color: MUTED, isTextBox: true, margin: 0, valign: 'top'
    });
  });
  card(s, M, 5.85, CW, 1.0, FIRE);
  s.addText('Esta charla NO certifica a nadie. Capacítese con la Cruz Roja, los Bomberos o Defensa Civil.', {
    x: M, y: 5.85, w: CW, h: 1.0, align: 'center', valign: 'middle',
    fontFace: SANS, fontSize: 18, bold: true, color: 'FFFFFF', isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\n«Cuatro cosas que todo cristiano debería saber hacer.\n\nHemorragia: presión directa, firme y sostenida, con lo más limpio que tenga. No suelte para ver cómo va.\n\nAtragantamiento: si la persona tose con fuerza, no interfiera — la tos es más eficaz que usted. Si no puede toser, hablar ni respirar, compresiones abdominales.\n\nParo cardíaco: si no responde y no respira normal, compresiones fuertes y rápidas en el centro del pecho, sin parar.\n\nQuemaduras: agua a temperatura ambiente unos veinte minutos. Ni hielo, ni pasta de dientes, ni aceite, ni café, ni sábila. Agua.»\n\nY AHORA LO MÁS IMPORTANTE — dígalo mirando a la gente:\n\n«Esto que acabo de decir no lo certifica esta conferencia. Yo se lo presento; la Cruz Roja, los bomberos y Defensa Civil se lo enseñan y se lo certifican.\n\nYo no quiero que usted salga de aquí sintiéndose entrenado. Quiero que salga de aquí inscribiéndose en un entrenamiento.»\n\nTRANSICIÓN\n\n«Ya sabemos qué hacer con las manos. Ahora la pregunta grande: ¿y qué dice Dios de todo esto? Porque alguien está pensando: ¿y esto no es falta de fe?»');
}

/* =========================================================
   BLOQUE 2 — QUE HABLA DIOS ANTE LAS EMERGENCIAS
   ========================================================= */

notes(sectionSlide('02', '¿Qué habla Dios\nante las emergencias?', AMBER,
  'Antes · por medio de · en medio de · después'),
'BLOQUE 2 · 13 minutos\n\nEste es el corazón teológico de la conferencia. Si le falta tiempo, recórtele minutos al Bloque 1, nunca a este.\n\nUSTED DICE\n\n«Ya sabemos qué hacer con las manos. Ahora la pregunta grande, la que nos trajo aquí: ¿y qué dice Dios de todo esto?\n\nPorque yo sé que alguien está pensando: pastor, ¿y todo esto no es falta de fe?»\n\nEL RECORRIDO\n\nDios habla antes del desastre. Dios habla por medio de gente que avisa. Dios habla en medio de la emergencia. Y Dios habla después, mandando a socorrer.');

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
  notes(s, 'USTED DICE\n\n«Y después del desastre, Dios manda a socorrer.\n\nMiren la palabra que usa Hechos 11: los discípulos, cada uno conforme a lo que tenía, determinaron enviar SOCORRO. Ahí está la palabra.\n\nY miren el método: aporte según capacidad, recolección organizada, envío por manos responsables. Es una operación de ayuda humanitaria con rendición de cuentas. En el siglo primero.»\n\nAHORA DÍGALO CON TODAS SUS LETRAS\n\n«La iglesia es un organismo de socorro. No metafóricamente.\n\nDespués del desastre, ¿qué queda en pie en el barrio? El templo. ¿Quién tiene la lista de los ancianos que viven solos? Nosotros. ¿Quién puede convocar a cien voluntarios en una hora, sin presupuesto y sin contrato? Nosotros.\n\nSomos, en muchas comunidades, el primer respondiente después del vecino. La pregunta no es si vamos a responder. La pregunta es si vamos a responder preparados o improvisando.»\n\nTRANSICIÓN\n\n«Entonces, si Dios avisa, si Dios manda a avisar y si Dios manda a socorrer, la pregunta se cae de madura: ¿cómo se prepara un cristiano?»');
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
  notes(s, 'USTED DICE\n\n«Hay dos errores, y los dos son peligrosos.\n\nEl primero: el fatalismo espiritual. “Si Dios me va a guardar, ¿para qué me preparo?”. Suena espiritual. No lo es. Es la misma lógica que usó Satanás en la tentación: tírate del pináculo, que los ángeles te sostendrán. ¿Y qué contestó Jesús? “No tentarás al Señor tu Dios”.\n\nExponerse voluntariamente al peligro y llamarlo fe, Jesús lo llamó tentar a Dios.\n\nEl segundo: el pánico acumulador. El que ve noticias todo el día, llena la casa de provisiones y vive con el estómago apretado. Eso tampoco es fe. Eso es miedo con logística.\n\nEntre esos dos extremos está el camino bíblico: prudencia serena.\n\nProverbios 21:31 lo dice perfecto: “el caballo se alista para el día de la batalla; mas Jehová es el que da la victoria”.\n\nAlista el caballo. Confía en Jehová. Las dos cosas, en la misma frase.»');
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
  notes(s, 'USTED DICE\n\nNo desarrolle los siete. Nómbrelos y deténgase en dos o tres.\n\n«Espiritual: ninguna mochila le sirve si su casa no está sobre la roca. Y fíjense que en esa parábola las dos casas reciben la misma tormenta. La diferencia no estuvo en el clima: estuvo en el cimiento.\n\nMental: infórmese de fuentes oficiales, no de cadenas de WhatsApp. Compartir un rumor en una emergencia es dar falso testimonio con consecuencias físicas. Y racione la noticia: Dios no nos dio espíritu de cobardía, sino de dominio propio.\n\nCuerpo y casa: mochila de setenta y dos horas, botiquín con los medicamentos crónicos de la familia — que es lo que más se olvida y lo que más falta hace.\n\nEconómica: José guardó la quinta parte en los años buenos. Un porcentaje, con disciplina, durante siete años.»\n\nUSTED HACE\n\nAquí abra la mochila de emergencia que trajo y saque las cosas una por una. Una mochila real vale más que tres diapositivas.\n\nEL NIVEL 7 ES EL LLAMADO\n\n«No basta con estar a salvo: Dios nos llamó a socorrer. Quiero que en cada célula, en cada ministerio, haya por lo menos una persona certificada en primeros auxilios. Porque el día del desastre, el que llega primero no es el experto que viene de lejos. El que llega primero es el que ya estaba ahí. Y ese, muchas veces, somos nosotros.»');
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
   BLOQUE 4 — LA BIBLIA Y LOS FENOMENOS NATURALES
   ========================================================= */

notes(sectionSlide('03', '¿Qué enseña la Biblia\nsobre los fenómenos\nde la naturaleza?', AMBER,
  'Seis verdades para no quedarse sin suelo'),
'BLOQUE 4 · 13 minutos\n\nADVERTENCIA PASTORAL\n\nAquí hay dolor real en el auditorio. Habrá quien perdió casa, o perdió gente. Hable despacio y no use este bloque para especular sobre profecía. Úselo para dar suelo firme.\n\nUSTED DICE\n\n«Hay una pregunta que no podemos esquivar, porque es la que la gente hace de verdad cuando el techo se cae: ¿por qué?\n\n¿Es Dios el que manda el huracán? ¿Es castigo? ¿Qué enseña la Biblia sobre los fenómenos de la naturaleza?»\n\nSi sabe que hay personas de duelo en la sala, reconózcalo aquí: «sé que aquí hay quien enterró a alguien después de una tormenta; lo que voy a decir lo digo con respeto, no desde la teoría».');

/* 35 — Seis verdades */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Fundamento', AMBER);
  title(s, 'Seis verdades');
  const v = [
    ['Dios le puso límites al mar', 'Job 38:11'],
    ['La creación gime con dolores de parto', 'Romanos 8:22'],
    ['Hay un orden natural que Dios sostiene', 'Génesis 8:22'],
    ['La Biblia prohíbe culpar a la víctima', 'Lucas 13:1-5'],
    ['Dios habla, pero no se reduce al fenómeno', '1 Reyes 19:11-12'],
    ['La historia no termina en catástrofe', 'Apocalipsis 21:4']
  ];
  const cw2 = 5.74, ch = 1.25;
  v.forEach((it, i) => {
    const x = M + (i % 2) * (cw2 + 0.35);
    const y = 2.25 + Math.floor(i / 2) * (ch + 0.22);
    card(s, x, y, cw2, ch, i === 3 ? AMBER : PANEL);
    const tc = i === 3 ? INK : CREAM;
    const sc = i === 3 ? '4A3410' : AMBER;
    badge(s, x + 0.3, y + 0.38, 0.5, i === 3 ? INK : AMBER, i + 1, i === 3 ? AMBER : INK, 16);
    s.addText(it[0], {
      x: x + 0.96, y: y + 0.16, w: cw2 - 1.25, h: 0.56,
      fontFace: SANS, fontSize: 16, bold: true, color: tc, isTextBox: true, margin: 0, valign: 'top'
    });
    s.addText(it[1], {
      x: x + 0.96, y: y + 0.76, w: cw2 - 1.25, h: 0.32,
      fontFace: SANS, fontSize: 13, bold: true, color: sc, charSpacing: 1, isTextBox: true, margin: 0
    });
  });
  kicker(s, 'La cuarta es la más importante de todas.', AMBER, 6.55, 19);
  notes(s, 'ADVERTENCIA PASTORAL\n\nAquí hay dolor real en el auditorio. Habrá quien perdió casa, o perdió gente. Hable despacio. Si lo sabe, dígalo al entrar: «sé que aquí hay quien enterró a alguien después de una tormenta; lo que voy a decir lo digo con respeto, no desde la teoría». No use este bloque para especular sobre profecía.\n\nUSTED DICE — verdad por verdad\n\n«Uno: la creación es de Dios, y Él le puso límites. Dios le dice al mar: “hasta aquí llegarás”. El mar tiene un límite, y el límite no se lo puso el mar.\n\nDos: la creación está herida y gime. Y fíjense en la imagen que escoge Pablo: dolores de parto. No es la agonía de algo que se muere: es el dolor de algo que está por nacer.\n\nTres: hay un orden natural que Dios sostiene. Las placas se mueven porque la tierra es un planeta vivo. Los ciclones se forman porque el mar se calienta. Eso no es magia negra ni es demonio: es física — y la física la escribió Dios.\n\nCuatro, y es la más importante: la Biblia prohíbe culpar a la víctima. La vemos en la próxima diapositiva.\n\nCinco: Dios habla, pero no se reduce al fenómeno. Elías lo esperaba en el viento, en el terremoto y en el fuego, y Dios llegó en un silbo apacible.\n\nSeis: la historia no termina en catástrofe. Termina con Dios secando lágrimas, una por una, con sus manos.»');
}

/* 36 — Lucas 13 */
{
  const s = verseSlide([
    { text: 'Aquellos dieciocho sobre los cuales cayó la torre en Siloé, y los mató, ¿pensáis que eran más culpables que todos los hombres que habitan en Jerusalén?  ', options: { color: CREAM } },
    { text: 'Os digo: No.', options: { color: AMBER, bold: true } }
  ], 'Lucas 13:4-5', { eyebrow: 'Jesús, con una tragedia sobre la mesa', size: 26, th: 3.1 });
  kicker(s, 'La tragedia ajena no es material de diagnóstico. Es llamado propio.', AMBER, 5.95, 22);
  notes(s, 'USTED DICE\n\n«Le cuentan a Jesús de una tragedia, y Él mismo trae otra: la torre de Siloé, que cayó y mató a dieciocho personas.\n\nY pregunta: “¿pensáis que eran más culpables que todos los hombres que habitan en Jerusalén?”.\n\nY contesta Él mismo: “Os digo: No”.\n\nJesús, con una tragedia sobre la mesa, rechaza expresamente la ecuación “les pasó porque eran peores”. La rechaza. Y en vez de darles un culpable les da un espejo: “si no os arrepentís, todos pereceréis igualmente”.\n\nLa tragedia ajena no es material de diagnóstico. Es llamado propio.»\n\nSI QUIERE REFORZAR\n\nLos amigos de Job hicieron exactamente lo que Jesús prohíbe, y al final Dios les dijo que no habían hablado de Él lo recto (Job 42:7). Y en Juan 9, ante la pregunta “¿quién pecó, éste o sus padres?”, Jesús responde que ni uno ni otro: la pregunta estaba mal formulada.');
}

/* 37 — La respuesta correcta */
{
  const s = slideOn(INK);
  rings(s, 0.4, 0.5, [2.4, 1.75, 1.1], INK, '2A3446', 1);
  rings(s, 12.9, 7.0, [2.4, 1.75, 1.1], INK, '2A3446', 1);
  s.addText('No salga a explicar\npor qué Dios lo mandó.', {
    x: 1.3, y: 1.85, w: W - 2.6, h: 1.8,
    fontFace: SERIF, fontSize: 36, color: DIM, align: 'center', valign: 'middle',
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.1
  });
  s.addText('Salga con agua,\ncon comida y con brazos.', {
    x: 1.3, y: 3.9, w: W - 2.6, h: 1.9,
    fontFace: SERIF, fontSize: 42, bold: true, color: AMBER, align: 'center', valign: 'middle',
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.1
  });
  s.addText('La teología del que sufre se hace cargando colchones, no dando explicaciones.', {
    x: 1.3, y: 6.1, w: W - 2.6, h: 0.5,
    fontFace: SANS, fontSize: 16, color: MUTED, align: 'center', isTextBox: true, margin: 0
  });
  notes(s, 'USTED DICE\n\nEste es el punto pastoral del bloque. Dígalo despacio, sin levantar la voz.\n\n«Entonces, cuando pase un desastre, no salga a decir por qué Dios lo mandó.\n\nSalga con agua, con comida y con brazos.\n\nLa teología del que sufre se hace cargando colchones, no dando explicaciones.»\n\nUSTED HACE\n\nDeje un silencio después de la última frase. Luego pase a los ejemplos bíblicos con la transición:\n\n«Déjenme cerrar mostrándoles gente. Porque la Biblia no nos dio una teoría del desastre: nos dio rostros.»');
}

/* =========================================================
   BLOQUE 5 — EJEMPLOS BIBLICOS
   ========================================================= */

notes(sectionSlide('04', 'Ejemplos bíblicos', AMBER,
  'La Biblia no nos dio una teoría del desastre: nos dio rostros'),
'BLOQUE 5 · 10 minutos\n\nUSTED DICE\n\n«Déjenme cerrar mostrándoles gente. Porque la Biblia no nos dio una teoría del desastre: nos dio rostros.»\n\nRITMO\n\nSon cinco ejemplos en diez minutos. Minuto y medio cada uno. No los desarrolle todos ni se enamore de uno: el peso acumulado es el argumento.\n\nSI LE FALTA TIEMPO\n\nQuédese con tres: Noé (prevención), José (planificación) y Hechos 27 (la promesa no sustituye a la tripulación).');

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

/* 41 — Nehemias */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Nehemías 4', AMBER);
  title(s, 'Nehemías');
  s.addText('Orar y poner guarda — un protocolo de emergencia completo', {
    x: M, y: 1.95, w: CW, h: 0.5,
    fontFace: SERIF, fontSize: 21, italic: true, color: AMBER, isTextBox: true, margin: 0
  });
  const sys = [
    ['Vigilancia', 'Turnos de día y de noche, con relevo'],
    ['Alerta', 'Un trompetista al lado del líder'],
    ['Concentración', 'Punto de reunión acordado de antemano'],
    ['Respuesta', 'Una mano en la obra, la otra en el arma']
  ];
  const cw = 2.72, gap = 0.32;
  sys.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.85, cw, 2.3, PANEL);
    badge(s, x + cw / 2 - 0.28, 3.1, 0.56, AMBER, i + 1, INK, 18);
    s.addText(it[0], {
      x: x + 0.12, y: 3.82, w: cw - 0.24, h: 0.45,
      fontFace: SANS, fontSize: 17, bold: true, color: CREAM,
      align: 'center', isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it[1], {
      x: x + 0.2, y: 4.3, w: cw - 0.4, h: 0.75,
      fontFace: SANS, fontSize: 13, color: MUTED,
      align: 'center', isTextBox: true, margin: 0, valign: 'top'
    });
  });
  kicker(s, 'Siglo quinto antes de Cristo. Ya tenían punto de encuentro.', AMBER, 5.5, 22);
  notes(s, 'USTED DICE\n\n«Amenaza real, enemigos reales. ¿Qué hizo Nehemías? “Oramos a nuestro Dios, y por causa de ellos pusimos guarda contra ellos de día y de noche”.\n\nY montó un sistema completo. Miren:\n\nVigilancia: turnos de día y de noche, con relevo.\n\nAlerta: un trompetista al lado del líder, para que la señal saliera de un solo punto.\n\nConcentración: un punto de reunión acordado de antemano — “en el lugar donde oyereis el sonido de la trompeta, reuníos allí con nosotros”.\n\nRespuesta: una mano en la obra, la otra en el arma.\n\nAlerta, evacuación, concentración, respuesta. Nehemías tenía un protocolo de emergencia. En el siglo quinto antes de Cristo.\n\nY no dejó de construir el muro por eso.»');
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

/* 44 — Antioquia */
{
  const s = slideOn(BASE);
  eyebrow(s, 'Hechos 11:27-30', AMBER);
  title(s, 'La iglesia de Antioquía');
  s.addText('El primer operativo de socorro cristiano', {
    x: M, y: 1.95, w: CW, h: 0.5,
    fontFace: SERIF, fontSize: 21, italic: true, color: AMBER, isTextBox: true, margin: 0
  });
  const flow = [
    ['Alerta', 'Agabo anuncia\nuna gran hambre'],
    ['Decisión', 'Determinaron\nenviar socorro'],
    ['Aporte', 'Cada uno conforme\na lo que tenía'],
    ['Envío', 'Por manos responsables:\nBernabé y Saulo']
  ];
  const cw = 2.72, gap = 0.32;
  flow.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.85, cw, 2.2, PANEL);
    s.addText(it[0], {
      x: x + 0.15, y: 3.05, w: cw - 0.3, h: 0.5,
      fontFace: SERIF, fontSize: 22, bold: true, color: AMBER,
      align: 'center', isTextBox: true, margin: 0, valign: 'middle'
    });
    s.addText(it[1], {
      x: x + 0.2, y: 3.62, w: cw - 0.4, h: 1.2,
      fontFace: SANS, fontSize: 14, color: MUTED,
      align: 'center', isTextBox: true, margin: 0, valign: 'top'
    });
    if (i < flow.length - 1) {
      s.addText('›', {
        x: x + cw, y: 2.85, w: gap, h: 2.2, align: 'center', valign: 'middle',
        fontFace: SANS, fontSize: 24, bold: true, color: AMBER, isTextBox: true, margin: 0
      });
    }
  });
  kicker(s, 'Cuando esta iglesia organiza un centro de acopio, no está copiando a las ONG:\nestá copiando a Antioquía.', AMBER, 5.45, 22);
  notes(s, 'USTED DICE\n\n«Llega Agabo a Antioquía y anuncia una gran hambre. ¿Qué hace la iglesia?\n\n“Entonces los discípulos, cada uno conforme a lo que tenía, determinaron enviar socorro a los hermanos”.\n\nMiren la cadena: aviso, decisión, aporte según capacidad, recolección, y envío por manos responsables — Bernabé y Saulo.\n\nEso, hermanos, es un operativo de ayuda humanitaria, con transparencia y con destino verificado. Y nació de una iglesia local.\n\nCuando esta iglesia organiza un centro de acopio, no está copiando a las ONG. Está copiando a Antioquía.»\n\nSI QUIERE AGREGAR\n\nPablo organiza otra colecta en 2 Corintios 8 y 9, y ahí dice algo que toda iglesia debería tener enmarcado: “evitando que nadie nos censure en cuanto a esta ofrenda abundante”. Transparencia total en el manejo de la ayuda.\n\nMENCIÓN RÁPIDA (30 segundos, si hay tiempo)\n\nLas ciudades de refugio de Números 35 y Josué 20: refugios designados de antemano, distribuidos geográficamente, con los caminos arreglados para que el que huye llegue a tiempo. Y Rahab en Josué 2: la señal en la ventana, la familia reunida adentro, y la instrucción de no salir de la casa.');
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
  notes(s, 'USTED DICE\n\n«No quiero aplausos. Quiero decisiones. Tres, y son de esta semana.\n\nPrimero, el plan de mi casa. Esta semana, en la mesa, con la familia: punto de encuentro, contacto, mochila. Está en la hoja que les entregamos, en el reverso. Escríbanlo. No lo piensen: escríbanlo.\n\nSegundo, capacitarme. Quiero que salgan de aquí nombres anotados para el curso de primeros auxilios y para la brigada de esta iglesia.»\n\nUSTED HACE\n\nPida que levanten la mano ahora mismo. Tenga a alguien anotando nombres de verdad, con papel, en la puerta. Si no sale una lista esta noche, no sale nunca.\n\nUSTED DICE\n\n«Y tercero, mi vecino. Piense en una persona de su cuadra que no podría salir sola: el anciano, el enfermo, la señora con el niño pequeño, la persona con discapacidad.\n\nPóngale nombre. Ahora mismo, en su mente, póngale nombre.\n\nY comprométase delante de Dios a que, si pasa algo, usted toca esa puerta antes de irse.\n\nEso es amar al prójimo con un plan.»');
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
