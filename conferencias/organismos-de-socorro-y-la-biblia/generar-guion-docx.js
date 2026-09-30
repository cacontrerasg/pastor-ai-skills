/* Convierte 01-guion-conferencia.md en un documento Word listo para imprimir.
   Uso:  node generar-guion-docx.js [entrada.md] [salida.docx]                */

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, ShadingType: ST,
  PageBreak, Header, Footer, PageNumber, LevelFormat,
  convertInchesToTwip
} = require('docx');

const SRC = process.argv[2] || '01-guion-conferencia.md';
const OUT = process.argv[3] || 'Guion - Organismos de Socorro y la Biblia.docx';

/* ---------- paleta e identidad tipografica ---------- */
const SERIF = 'Cambria';
const SANS  = 'Calibri';
const INK   = '1A2030';   // titulos
const BODY  = '24292F';   // cuerpo
const AMBER = 'B5791C';   // acento (version impresa del ambar del deck)
const GRAY  = '5C6672';   // acotaciones escenicas
const RULE  = 'D8DCE1';

const CONTENT_DXA = 9360; // Carta con margenes de 1 pulgada

/* =========================================================
   1. LECTURA Y TROCEADO DEL MARKDOWN
   ========================================================= */
const raw = fs.readFileSync(SRC, 'utf8').split('\n');

/* Formato en linea: **negrita**, *cursiva*, `codigo` */
function runs(text, base) {
  base = base || {};
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0, m;
  const push = (t, extra) => {
    if (!t) return;
    out.push(new TextRun(Object.assign({ text: t }, base, extra || {})));
  };
  while ((m = re.exec(text)) !== null) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**'))      push(tok.slice(2, -2), { bold: true });
    else if (tok.startsWith('`'))  push(tok.slice(1, -1), { font: 'Consolas', size: (base.size || 22) - 2 });
    else                           push(tok.slice(1, -1), { italics: true });
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return out.length ? out : [new TextRun(Object.assign({ text: '' }, base))];
}

/* Agrupa lineas en bloques logicos. Se aplica tanto al documento
   como al interior de cada cita, por eso es recursivo.              */
function parseBlocks(lines) {
  const blocks = [];
  let i = 0;
  const isBullet = l => /^-\s+/.test(l);
  const isNumber = l => /^\d+\.\s+/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim())            { i++; continue; }
    if (/^---+$/.test(line))     { blocks.push({ t: 'hr' }); i++; continue; }

    // titulos
    let m = /^(#{1,4})\s+(.*)$/.exec(line);
    if (m) { blocks.push({ t: 'h', level: m[1].length, text: m[2].trim() }); i++; continue; }

    // tabla
    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        const cells = lines[i].split('|').slice(1, -1).map(c => c.trim());
        if (!cells.every(c => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      blocks.push({ t: 'table', rows });
      continue;
    }

    // cita: texto hablado
    if (/^>/.test(line)) {
      const inner = [];
      while (i < lines.length && /^>/.test(lines[i])) {
        inner.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ t: 'quote', blocks: parseBlocks(inner) });
      continue;
    }

    // listas (con lineas de continuacion sangradas)
    if (isBullet(line) || isNumber(line)) {
      const ordered = isNumber(line);
      const items = [];
      while (i < lines.length && (isBullet(lines[i]) || isNumber(lines[i]))) {
        let txt = lines[i].replace(/^(-|\d+\.)\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])) {
          txt += ' ' + lines[i].trim();
          i++;
        }
        items.push(txt);
      }
      blocks.push({ t: 'list', ordered, items });
      continue;
    }

    // parrafo: une las lineas hasta el proximo corte
    const buf = [];
    while (i < lines.length && lines[i].trim() &&
           !/^[>#|]/.test(lines[i]) && !/^---+$/.test(lines[i]) &&
           !isBullet(lines[i]) && !isNumber(lines[i])) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push({ t: 'p', text: buf.join(' ') });
  }
  return blocks;
}

/* =========================================================
   2. RENDERIZADO A WORD
   ========================================================= */
let orderedSeq = 0;                 // una referencia de numeracion por lista
const numberingConfigs = [];

function orderedRef() {
  const ref = 'ol' + (++orderedSeq);
  numberingConfigs.push({
    reference: ref,
    levels: [{
      level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.START,
      style: { paragraph: { indent: { left: convertInchesToTwip(0.42), hanging: convertInchesToTwip(0.24) } } }
    }]
  });
  return ref;
}

const quoteBorder = {
  left: { style: BorderStyle.SINGLE, size: 18, color: AMBER, space: 12 }
};

function render(blocks, inQuote) {
  const out = [];

  blocks.forEach(b => {
    switch (b.t) {

      case 'hr':
        break;   // los titulos y los saltos de pagina ya separan lo suficiente

      case 'h': {
        // Un h1 dentro del cuerpo es un bloque destacado, no un titulo
        if (b.level === 1) {
          out.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 280, after: 280 },
            border: {
              top:    { style: BorderStyle.SINGLE, size: 12, color: AMBER, space: 10 },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: AMBER, space: 10 }
            },
            children: [new TextRun({ text: b.text, font: SERIF, size: 36, bold: true, color: AMBER })]
          }));
          break;
        }
        const map = { 2: HeadingLevel.HEADING_1, 3: HeadingLevel.HEADING_2, 4: HeadingLevel.HEADING_3 };
        const isBloque = /^BLOQUE\s/i.test(b.text);
        out.push(new Paragraph({
          heading: map[b.level],
          pageBreakBefore: isBloque,
          spacing: { before: isBloque ? 0 : (b.level === 3 ? 320 : 240), after: b.level === 2 ? 200 : 140 },
          children: runs(b.text, {
            font: SERIF, color: b.level === 2 ? AMBER : INK, bold: true,
            size: b.level === 2 ? 32 : b.level === 3 ? 26 : 23
          })
        }));
        break;
      }

      case 'p': {
        // una linea completamente en cursiva es una acotacion escenica
        const stage = /^\*[^*].*\*$/.test(b.text);
        if (stage) {
          out.push(new Paragraph({
            spacing: { before: 200, after: 100 },
            indent: inQuote ? { left: convertInchesToTwip(0.3) } : undefined,
            children: [new TextRun({ text: b.text.replace(/^\*|\*$/g, ''), font: SANS, size: 21, italics: true, color: GRAY })]
          }));
          break;
        }
        out.push(new Paragraph({
          spacing: { before: 60, after: 120, line: inQuote ? 280 : 260 },
          indent: inQuote ? { left: convertInchesToTwip(0.3) } : undefined,
          border: inQuote ? quoteBorder : undefined,
          children: runs(b.text, inQuote
            ? { font: SERIF, size: 23, color: BODY }
            : { font: SANS,  size: 22, color: BODY })
        }));
        break;
      }

      case 'list': {
        const ref = b.ordered ? orderedRef() : null;
        b.items.forEach(it => {
          out.push(new Paragraph({
            spacing: { before: 40, after: 60, line: inQuote ? 280 : 250 },
            indent: inQuote ? { left: convertInchesToTwip(0.62), hanging: convertInchesToTwip(0.2) } : undefined,
            border: inQuote ? quoteBorder : undefined,
            bullet: b.ordered ? undefined : { level: 0 },
            numbering: b.ordered ? { reference: ref, level: 0 } : undefined,
            children: runs(it, inQuote
              ? { font: SERIF, size: 23, color: BODY }
              : { font: SANS,  size: 22, color: BODY })
          }));
        });
        break;
      }

      case 'quote':
        out.push(...render(b.blocks, true));
        break;

      case 'table': {
        const head = b.rows[0];
        const n = head.length;
        // anchos a medida para la tabla de tiempos (#, Bloque, Min, Acumulado)
        const widths = n === 4 ? [620, 5520, 1320, 1900] : Array(n).fill(Math.floor(CONTENT_DXA / n));
        const mk = (cells, isHead) => new TableRow({
          tableHeader: isHead,
          children: cells.map((c, k) => new TableCell({
            width: { size: widths[k], type: WidthType.DXA },
            shading: isHead ? { type: ST.CLEAR, fill: 'F3EDE0' } : undefined,
            margins: { top: 90, bottom: 90, left: 130, right: 130 },
            children: [new Paragraph({
              alignment: k === 0 || k >= 2 ? AlignmentType.CENTER : AlignmentType.LEFT,
              children: runs(c, { font: SANS, size: 20, bold: !!isHead, color: isHead ? INK : BODY })
            })]
          }))
        });
        out.push(new Table({
          columnWidths: widths,
          width: { size: widths.reduce((a, x) => a + x, 0), type: WidthType.DXA },
          rows: [mk(head, true), ...b.rows.slice(1).map(r => mk(r, false))]
        }));
        out.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: '' })] }));
        break;
      }
    }
  });

  return out;
}

/* =========================================================
   3. PORTADA + INDICE + CUERPO
   ========================================================= */
const blocks = parseBlocks(raw);

// El encabezado del markdown (titulo, subtitulo, ficha) se sustituye por una portada
let start = 0;
for (let k = 0; k < blocks.length; k++) {
  if (blocks[k].t === 'h' && blocks[k].level === 2) { start = k; break; }
}
const body = render(blocks.slice(start), false);

const sp = (h) => new Paragraph({ spacing: { after: h }, children: [new TextRun({ text: '' })] });

const portada = [
  sp(1700),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'C O N F E R E N C I A', font: SANS, size: 19, bold: true, color: AMBER })]
  }),
  sp(280),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 420 },
    children: [new TextRun({ text: 'ORGANISMOS DE SOCORRO', font: SERIF, size: 52, bold: true, color: INK })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 420, after: 240 },
    children: [new TextRun({ text: 'Y LA BIBLIA', font: SERIF, size: 52, bold: true, color: INK })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 700 },
    children: [new TextRun({ text: 'Lo que Dios dice antes de que suene la alarma', font: SERIF, size: 26, italics: true, color: AMBER })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 120 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 14 } },
    children: [new TextRun({ text: 'Carlos Contreras', font: SANS, size: 24, bold: true, color: BODY })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Guion del conferencista  ·  90 minutos  ·  Versión bíblica: RVR1960', font: SANS, size: 20, color: GRAY })]
  }),
  sp(2600),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 300 },
    children: [
      new TextRun({ text: '«Oramos a nuestro Dios, y… pusimos guarda', font: SERIF, size: 23, italics: true, color: BODY }),
      new TextRun({ text: ' contra ellos de día y de noche.»', font: SERIF, size: 23, italics: true, color: BODY })
    ]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 90 },
    children: [new TextRun({ text: 'NEHEMÍAS 4:9', font: SANS, size: 18, bold: true, color: AMBER })]
  }),
  new Paragraph({ children: [new PageBreak()] })
];

const doc = new Document({
  creator: 'Carlos Contreras',
  title: 'Organismos de Socorro y la Biblia — Guion de la conferencia',
  description: 'Guion completo de la conferencia, con tiempos, textos ancla, ilustraciones y transiciones.',
  numbering: { config: numberingConfigs },
  styles: {
    default: {
      document: { run: { font: SANS, size: 22, color: BODY } }
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: SERIF, size: 32, bold: true, color: AMBER } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: SERIF, size: 26, bold: true, color: INK } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: SERIF, size: 23, bold: true, color: INK } }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },            // Carta
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 720, footer: 560 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 100 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 6 } },
          children: [new TextRun({ text: 'Organismos de Socorro y la Biblia  ·  Carlos Contreras', font: SANS, size: 17, color: GRAY })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: SANS, size: 18, color: GRAY })]
        })]
      })
    },
    children: [...portada, ...body]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log('Escrito: ' + OUT + '  (' + (buf.length / 1024).toFixed(0) + ' KB)');
});
