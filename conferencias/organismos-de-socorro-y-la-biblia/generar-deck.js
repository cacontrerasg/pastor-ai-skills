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
  notes(s, 'No salude todavia. Entre en frio con la pregunta de la diapositiva 2.');
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
  notes(s, 'Deje el silencio. No lo llene. La incomodidad es el punto.');
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
  notes(s, 'Hagalo de verdad. Espere. Habra manos apuntando a lugares distintos y manos que no se levantan.');
}

/* 4 — Ezequiel 33:6 */
{
  const s = verseSlide([
    { text: 'Pero si el atalaya viere venir la espada ', options: { color: CREAM } },
    { text: 'y no tocare la trompeta', options: { color: AMBER, bold: true } },
    { text: ', y el pueblo no se apercibiere, y viniendo la espada, hiriere de él a alguno… demandaré su sangre de mano del atalaya.', options: { color: CREAM } }
  ], 'Ezequiel 33:6', { eyebrow: 'Texto ancla de la conferencia', size: 28, th: 3.0 });
  kicker(s, 'El atalaya no detiene la espada. Ve a tiempo y avisa a tiempo.', AMBER, 5.95, 22);
  notes(s, 'Dios invento el sistema de alerta temprana y lo puso en manos de su pueblo.');
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
  notes(s, 'De esta frase no se mueva en 90 minutos.');
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
  notes(s, 'Este versiculo resuelve el falso dilema entre orar y prepararse.');
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
  notes(s, 'Prometa que nadie sale igual: todos salen con un plan escrito.');
}

/* =========================================================
   BLOQUE 1 — MEDIDAS DE SEGURIDAD
   ========================================================= */

sectionSlide('01', 'Medidas de seguridad', AMBER,
  'Terremotos · Ciclones · Maremotos · Incendios · Accidentes');

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
  notes(s, 'Dinamica de 60 segundos: todos de pie, a la cuenta de tres. Cuente diez segundos en voz alta.');
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
  notes(s, 'Corregir el mito del triangulo de la vida es importante: circula mucho en redes.');
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
  notes(s, 'Si quedo atrapado: no gritar sin necesidad, golpear una tuberia a intervalos y cubrirse la boca.');
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
  notes(s, 'Que mas de una persona de la casa sepa donde se cierran el gas y la electricidad.');
}

/* 13 — Ciclon: Proverbios 22:3 */
{
  const s = verseSlide([
    { text: 'El avisado ve el mal ', options: { color: CREAM } },
    { text: 'y se esconde', options: { color: CYCLONE, bold: true } },
    { text: '; mas los simples pasan y reciben el daño.', options: { color: CREAM } }
  ], 'Proverbios 22:3', { eyebrow: 'Ciclón · fundamento', accent: CYCLONE, size: 31, th: 2.4 });
  kicker(s, 'El huracán avisa con días. Ver no basta: hay que esconderse.', CYCLONE, 5.95, 22);
  notes(s, 'Es el unico desastre mayor que da dias de aviso. Su mortalidad es, en su mayoria, evitable.');
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
  notes(s, 'Decidalo hoy, no con el viento encima. Evacuar tarde es la decision que mata.');
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
  notes(s, 'Mucha gente muere por salir cuando todo se calmo. No salga hasta que la autoridad lo diga.');
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
  notes(s, 'Treinta centimetros de agua en movimiento derriban a un adulto; sesenta arrastran un vehiculo.');
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
  notes(s, 'El Caribe ha tenido maremotos destructivos con perdida de vidas en nuestras propias costas.');
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
  notes(s, 'A pie, no en vehiculo: el tapon de vehiculos ha matado a mas gente que la ola.');
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
  notes(s, 'La mujer de Lot: el que se detiene o vuelve atras en una evacuacion, perece.');
}

/* 20 — Incendio: Deuteronomio 22:8 */
{
  const s = verseSlide([
    { text: 'Cuando edifiques casa nueva, harás pretil a tu azotea, ', options: { color: CREAM } },
    { text: 'para que no eches culpa de sangre sobre tu casa', options: { color: FIRE, bold: true } },
    { text: ', si de ella cayere alguno.', options: { color: CREAM } }
  ], 'Deuteronomio 22:8', { eyebrow: 'Seguridad · fundamento', accent: FIRE, size: 29, th: 2.7 });
  kicker(s, 'La negligencia en seguridad, en la Biblia, tiene categoría moral.', FIRE, 5.95, 23);
  notes(s, 'Dios le esta dando a Israel un codigo de construccion: baranda obligatoria en la azotea.');
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
  notes(s, 'El detector de humo es el aparato con mejor relacion costo-vida que existe en una casa.');
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
  notes(s, 'Un extintor comun dura entre 10 y 20 segundos. Usted tiene un solo intento.');
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
  notes(s, 'Si queda atrapado: selle rendijas, hagase visible desde la ventana, llame indicando ubicacion exacta.');
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
  notes(s, 'Al llamar: que paso, donde exactamente, cuantos lesionados, que riesgos hay, quien es usted.');
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
  notes(s, 'No quiero que salga sintiendose entrenado. Quiero que salga inscribiendose en un entrenamiento.');
}

/* =========================================================
   BLOQUE 2 — QUE HABLA DIOS ANTE LAS EMERGENCIAS
   ========================================================= */

sectionSlide('02', '¿Qué habla Dios\nante las emergencias?', AMBER,
  'Antes · por medio de · en medio de · después');

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
  notes(s, 'Dios no es un Dios de sorpresas crueles.');
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
  notes(s, 'El texto perfecto para explicar por que una alerta bien emitida sigue costando vidas.');
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
  notes(s, 'El boletin de meteorologia, la alerta de Defensa Civil y la sirena del bombero cumplen una funcion que la Biblia considera sagrada.');
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
  notes(s, 'Despues del desastre, que queda en pie en el barrio? El templo. Quien tiene la lista de los ancianos solos? Nosotros.');
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
  notes(s, 'Alista el caballo. Confia en Jehova. Las dos cosas, en la misma frase.');
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
  notes(s, 'El nivel 7 es el llamado mas concreto: que en cada celula haya al menos una persona certificada.');
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
  notes(s, 'Hagalo esta semana, en la mesa, con los muchachos. Corto, claro, y que todos lo sepan.');
}

/* =========================================================
   BLOQUE 4 — LA BIBLIA Y LOS FENOMENOS NATURALES
   ========================================================= */

sectionSlide('03', '¿Qué enseña la Biblia\nsobre los fenómenos\nde la naturaleza?', AMBER,
  'Seis verdades para no quedarse sin suelo');

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
  notes(s, 'Aqui hay dolor real en el auditorio. Hable despacio. No especule sobre profecia.');
}

/* 36 — Lucas 13 */
{
  const s = verseSlide([
    { text: 'Aquellos dieciocho sobre los cuales cayó la torre en Siloé, y los mató, ¿pensáis que eran más culpables que todos los hombres que habitan en Jerusalén?  ', options: { color: CREAM } },
    { text: 'Os digo: No.', options: { color: AMBER, bold: true } }
  ], 'Lucas 13:4-5', { eyebrow: 'Jesús, con una tragedia sobre la mesa', size: 26, th: 3.1 });
  kicker(s, 'La tragedia ajena no es material de diagnóstico. Es llamado propio.', AMBER, 5.95, 22);
  notes(s, 'Jesus rechaza expresamente la ecuacion "les paso porque eran peores". Job 42:7 dice lo mismo de los amigos de Job.');
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
  notes(s, 'Este es el punto pastoral del bloque. Digalo despacio.');
}

/* =========================================================
   BLOQUE 5 — EJEMPLOS BIBLICOS
   ========================================================= */

sectionSlide('04', 'Ejemplos bíblicos', AMBER,
  'La Biblia no nos dio una teoría del desastre: nos dio rostros');

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
  notes(s, 'El arca fue "en que su casa se salvase": la preparacion del creyente cubre a los suyos.');
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
  notes(s, 'Es el modelo biblico del plan nacional de gestion de riesgo y del fondo de contingencia.');
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
  notes(s, 'Nehemias 4:20 es el punto de encuentro: "donde oyereis el sonido de la trompeta, reunios alli".');
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
  notes(s, 'Tenia a la vez palabra de Dios y cabeza fria. Esa combinacion es la que hace falta en la cubierta.');
}

/* 43 — Hechos 27:31 */
{
  const s = verseSlide([
    { text: 'Si éstos ', options: { color: CREAM } },
    { text: 'no permanecen en la nave', options: { color: AMBER, bold: true } },
    { text: ', vosotros no podéis salvaros.', options: { color: CREAM } }
  ], 'Hechos 27:31', { eyebrow: 'La joya del capítulo', size: 33, th: 2.2 });
  kicker(s, 'La promesa de Dios no sustituye a la tripulación.', AMBER, 5.95, 26);
  notes(s, 'Dios habia prometido que todos se salvarian, y aun asi hacia falta que los hombres capacitados se quedaran en su puesto.');
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
  notes(s, 'Es una operacion de ayuda humanitaria con destino verificado y rendicion de cuentas. 2 Corintios 8:20-21.');
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
  notes(s, 'Cuatro frases, no mas. Despues pase directo al llamado.');
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
  notes(s, 'Pida que levanten la mano para la lista de la brigada. Que salgan nombres anotados de verdad.');
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
  notes(s, 'Cierre con la oracion sugerida en el guion.');
}

const out = process.argv[2] || 'deck.pptx';
pres.writeFile({ fileName: out }).then(() => console.log('Escrito: ' + out));
