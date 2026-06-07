#!/usr/bin/env python3
"""
Generador de PDF — Conferencia "Reconstruyendo el Matrimonio que Dios Diseñó".

Usa la biblioteca compartida shared/pdf_utils.py (paleta navy + dorado).
Requiere: pip install reportlab

Uso:
    python3 generate-pdf.py [salida.pdf]
"""

import os
import sys

_here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(_here, "..", "..", "shared"))

from pdf_utils import (  # noqa: E402
    NAVY, GOLD, SLATE, BODY_COLOR,
    build_styles, create_doc, make_page_footer,
    add_title_banner, section_header, add_bullet_list,
    add_shaded_box, add_table,
)
from reportlab.platypus import Paragraph, Spacer, HRFlowable  # noqa: E402
from reportlab.lib.styles import ParagraphStyle  # noqa: E402
from reportlab.lib.enums import TA_CENTER  # noqa: E402


def conf_styles():
    s = build_styles()
    s["scripture"] = ParagraphStyle(
        "Scripture", fontName="Times-Italic", fontSize=11, leading=16,
        textColor=BODY_COLOR, spaceAfter=3,
    )
    s["reference"] = ParagraphStyle(
        "Reference", fontName="Helvetica-Bold", fontSize=9, leading=13,
        textColor=NAVY, spaceAfter=0,
    )
    s["context"] = ParagraphStyle(
        "Context", fontName="Times-Italic", fontSize=9.5, leading=13,
        textColor=SLATE, spaceBefore=4, spaceAfter=0,
    )
    s["sub"] = ParagraphStyle(
        "Sub", fontName="Helvetica-Bold", fontSize=12, leading=16,
        textColor=NAVY, spaceBefore=14, spaceAfter=6,
    )
    s["time"] = ParagraphStyle(
        "Time", fontName="Helvetica-Oblique", fontSize=9.5, leading=13,
        textColor=GOLD, spaceAfter=8,
    )
    s["dyn_title"] = ParagraphStyle(
        "DynTitle", fontName="Helvetica-Bold", fontSize=10.5, leading=14,
        textColor=NAVY, spaceAfter=4,
    )
    s["dyn_body"] = ParagraphStyle(
        "DynBody", fontName="Times-Roman", fontSize=10.5, leading=15,
        textColor=SLATE, spaceAfter=4,
    )
    s["center"] = ParagraphStyle(
        "Center", fontName="Helvetica-Bold", fontSize=12, leading=17,
        textColor=NAVY, spaceAfter=10, alignment=TA_CENTER,
    )
    return s


def scripture_box(story, verses, styles):
    """verses: list of (text, reference) or (text, reference, context)."""
    elements = []
    for i, verse in enumerate(verses):
        text, ref = verse[0], verse[1]
        context = verse[2] if len(verse) > 2 else None
        elements.append(Paragraph(f"“{text}”", styles["scripture"]))
        elements.append(Paragraph(ref, styles["reference"]))
        if context:
            elements.append(Paragraph(
                f"<b>Contexto:</b> {context}", styles["context"]))
        if i < len(verses) - 1:
            elements.append(Spacer(1, 10))
    add_shaded_box(story, elements, styles)
    story.append(Spacer(1, 12))


def dynamic_box(story, title, body, styles):
    elements = [Paragraph(f"\U0001F527 {title}", styles["dyn_title"])]
    for p in body:
        elements.append(Paragraph(p, styles["dyn_body"]))
    add_shaded_box(story, elements, styles)
    story.append(Spacer(1, 12))


def para(story, text, styles, style="body"):
    story.append(Paragraph(text, styles[style]))


def main(output_path=None):
    if not output_path:
        output_path = os.path.join(_here, "Reconstruyendo-el-Matrimonio.pdf")

    doc = create_doc(
        output_path,
        title="Reconstruyendo el Matrimonio que Dios Diseno",
        author="Conferencia Cristiana para Matrimonios",
    )
    s = conf_styles()
    story = []

    # --- Banner ---
    add_title_banner(
        story,
        "RECONSTRUYENDO EL MATRIMONIO",
        "que Dios Diseñó",
        ["Conferencia para Matrimonios", "Duración: 2 horas"],
        s,
    )

    para(story, "Conferencista: ____________________   "
                "Fecha: ____________________   "
                "Iglesia: ____________________", s, "meta")
    story.append(Spacer(1, 14))

    # --- Texto base ---
    section_header(story, "Texto Base", s)
    scripture_box(story, [
        ("Por tanto, dejará el hombre a su padre y a su madre, y se unirá "
         "a su mujer, y serán una sola carne.", "Génesis 2:24 (RV1960)",
         "Cierra el relato de la creación, justo tras formar Dios a la mujer "
         "y presentarla a Adán. Es la declaración fundacional del matrimonio, "
         "dada antes de la caída: el diseño original y perfecto de Dios."),
        ("Así que no son ya más dos, sino una sola carne; por tanto, lo "
         "que Dios juntó, no lo separe el hombre.", "Mateo 19:6 (RV1960)",
         "Los fariseos prueban a Jesús sobre el divorcio 'por cualquier causa'. "
         "En vez de buscar excusas para separarse, Él vuelve a Génesis y afirma "
         "el matrimonio como obra permanente de Dios, no contrato humano."),
    ], s)

    # --- Idea central ---
    section_header(story, "Idea Central", s)
    para(story, "El matrimonio no está roto sin remedio: está esperando "
                "ser reconstruido sobre el diseño original de Dios. Esta "
                "conferencia lleva a las parejas a diagnosticar lo que daña, "
                "edificar sobre cuatro pilares firmes, tomar herramientas concretas "
                "de restauración y renovar su pacto delante de Dios.", s)

    # --- Agenda ---
    section_header(story, "Agenda y Bloques de Tiempo (120 min)", s)
    add_table(
        story,
        ["Tiempo", "Bloque", "Min"],
        [
            ["0:00 – 0:10", "Bienvenida y apertura", "10"],
            ["0:10 – 0:20", "Introducción", "10"],
            ["0:20 – 0:45", "Parte I — Lo que daña los matrimonios hoy", "25"],
            ["0:45 – 1:10", "Parte II — Los cuatro pilares", "25"],
            ["1:10 – 1:20", "Receso", "10"],
            ["1:20 – 1:40", "Parte III — Herramientas para restaurar", "20"],
            ["1:40 – 1:55", "Parte IV — Renovando el pacto", "15"],
            ["1:55 – 2:00", "Conclusión y ministración final", "15"],
        ],
        [1.3, 4.0, 0.7],
        s,
    )

    # --- Bienvenida ---
    section_header(story, "Bienvenida y Apertura", s)
    para(story, "(10 min)", s, "time")
    add_bullet_list(story, [
        "Da la bienvenida y agradece la asistencia. Asistir juntos ya es un acto de amor.",
        "Rompehielos: cada pareja se mira a los ojos y dice “una cosa que admiro de "
        "ti es...”. Sin ironía ni quejas.",
        "Oración de apertura entregando el tiempo a Dios.",
    ], s)

    # --- Introducción ---
    section_header(story, "Introducción", s)
    para(story, "(10 min)", s, "time")
    para(story, "Vivimos tiempos donde el matrimonio enfrenta ataques constantes: la "
                "cultura, las presiones económicas, el individualismo y la "
                "pérdida de valores bíblicos. Sin embargo, Dios sigue "
                "teniendo un diseño perfecto para el hogar.", s)
    para(story, "La pregunta no es si el matrimonio está en crisis. La pregunta es:", s)
    para(story, "¿Estamos dispuestos a reconstruir el matrimonio según el "
                "diseño original de Dios?", s, "center")

    # --- PARTE I ---
    section_header(story, "PARTE I — Lo que está dañando los matrimonios hoy", s)
    para(story, "(25 min)", s, "time")

    para(story, "1. La falta de comunicación", s, "sub")
    scripture_box(story, [
        ("Todo hombre sea pronto para oír, tardo para hablar, tardo para airarse.",
         "Santiago 1:19",
         "Carta muy práctica de Santiago, hermano de Jesús, a creyentes "
         "dispersos. El orden que da —oír primero, hablar después, airarse de "
         "último— es el opuesto al que seguimos al discutir en pareja."),
        ("La muerte y la vida están en poder de la lengua.", "Proverbios 18:21",
         "Sabiduría práctica de Salomón. Este capítulo insiste en el poder de "
         "las palabras: la lengua no es neutral, construye o destruye, y "
         "cosechamos lo que decimos."),
    ], s)
    add_bullet_list(story, [
        "Muchos matrimonios hablan diariamente, pero no se comunican.",
        "Escuchamos para responder, no para comprender.",
        "Una palabra puede sanar o destruir.",
    ], s)
    para(story, "Pregunta: ¿Qué palabras predominan actualmente en nuestro hogar?", s, "body_bold")

    para(story, "2. El orgullo", s, "sub")
    scripture_box(story, [
        ("Ciertamente la soberbia concebirá contienda.", "Proverbios 13:10",
         "La frase completa contrasta la soberbia, que siempre produce pleitos, "
         "con los que reciben consejo, que tienen sabiduría. El orgullo es la "
         "raíz, no el síntoma, del conflicto."),
        ("Nada hagáis por contienda o por vanagloria…", "Filipenses 2:3-4",
         "Pablo escribe desde la cárcel a una iglesia que ama, llamándola a la "
         "humildad; acto seguido (2:5-11) pone como modelo a Cristo, que se "
         "humilló hasta la cruz. La humildad es seguir el ejemplo de Jesús."),
    ], s)
    para(story, "El orgullo convierte conversaciones en batallas. No siempre gana quien "
                "tiene la razón; gana quien preserva la relación.", s)

    para(story, "3. El distanciamiento espiritual", s, "sub")
    scripture_box(story, [
        ("Cordón de tres dobleces no se rompe pronto.", "Eclesiastés 4:12",
         "Salomón reflexiona sobre la ventaja de la compañía frente a la "
         "soledad (4:9-12). El tercer cordón se ha entendido como Dios "
         "entretejido en la relación: la pareja se fortalece cuando Él es el "
         "tercer hilo."),
    ], s)
    para(story, "Cuando Cristo deja de ser el centro, el matrimonio comienza a depender "
                "únicamente de las fuerzas humanas.", s)

    para(story, "4. La pérdida del amor práctico", s, "sub")
    scripture_box(story, [
        ("Has dejado tu primer amor.", "Apocalipsis 2:4-5",
         "Carta del Cristo resucitado a la iglesia de Éfeso: trabajadora y "
         "firme en doctrina, pero había perdido el amor de los primeros "
         "tiempos. Su remedio (v. 5): recuerda, arrepiéntete y vuelve a hacer "
         "las primeras obras."),
    ], s)
    para(story, "No se pierde el amor de un día para otro. Se pierde cuando dejamos "
                "de hacer las cosas que alimentaban la relación.", s)

    dynamic_box(story, "Dinámica de Parte I — “El espejo honesto” (5 min)", [
        "Cada cónyuge escribe cuál de los cuatro daños más afecta su "
        "matrimonio y un ejemplo concreto.",
        "Lo comparten sin defenderse ni acusar: solo escuchar. La regla: hoy no venimos "
        "a ganar, venimos a sanar.",
    ], s)

    # --- PARTE II ---
    section_header(story, "PARTE II — Los cuatro pilares de un matrimonio saludable", s)
    para(story, "(25 min)", s, "time")

    para(story, "Pilar 1: Amor", s, "sub")
    scripture_box(story, [
        ("Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia.",
         "Efesios 5:25",
         "Pablo enseña sobre el hogar cristiano. Al esposo no le manda dominar, "
         "sino amar con el amor más alto: el de Cristo, que 'se entregó a sí "
         "mismo'. Un amor sacrificial que da y sirve, no que exige."),
    ], s)
    scripture_box(story, [
        ("El amor es sufrido, es benigno… no busca lo suyo… todo lo soporta… "
         "nunca deja de ser.", "1 Corintios 13:4-8",
         "El 'himno al amor' no se escribió para una boda, sino corrigiendo a "
         "una iglesia dividida que presumía de sus dones. Pablo describe el "
         "amor con verbos —conducta diaria—, no como un sentimiento."),
    ], s)
    para(story, "Características del amor bíblico:", s, "body_bold")
    add_bullet_list(story, [
        "Paciente", "Bondadoso", "No egoísta", "No orgulloso", "Perseverante",
    ], s)
    para(story, "Aplicación: el amor bíblico es una decisión antes que una emoción.", s)

    para(story, "Pilar 2: Respeto", s, "sub")
    scripture_box(story, [
        ("…y la mujer respete a su marido.", "Efesios 5:33",
         "Resumen con que Pablo cierra su enseñanza matrimonial: el esposo ama "
         "como a sí mismo, la esposa respeta. Une las dos necesidades "
         "complementarias del hogar —ser amada y ser respetado— en una frase."),
    ], s)
    para(story, "El amor inspira respeto; el respeto fortalece el amor.", s)

    para(story, "Pilar 3: Confianza", s, "sub")
    scripture_box(story, [
        ("El corazón de su marido está en ella confiado.", "Proverbios 31:11",
         "Del poema de la mujer virtuosa (Pr 31:10-31), enseñanza que el rey "
         "Lemuel aprendió de su madre. La confianza descrita no se exige: es "
         "fruto de una vida íntegra y digna de fiar."),
    ], s)
    para(story, "La confianza se construye con:", s, "body_bold")
    add_bullet_list(story, ["Transparencia", "Integridad", "Coherencia"], s)

    para(story, "Pilar 4: Unidad Espiritual", s, "sub")
    scripture_box(story, [
        ("¿Andarán dos juntos, si no estuvieren de acuerdo?", "Amós 3:3",
         "El profeta usa preguntas retóricas para mostrar que todo efecto tiene "
         "una causa: dos no caminan juntos por casualidad, sino porque acordaron "
         "el mismo destino. La unidad nace de un acuerdo y una dirección común."),
        ("Yo y mi casa serviremos a Jehová.", "Josué 24:15",
         "Al final de su vida, Josué confronta a Israel en Siquem a elegir a "
         "quién servir, y antes declara públicamente la decisión de su propia "
         "casa. Un líder que fija la dirección espiritual de su hogar."),
    ], s)
    para(story, "La verdadera unidad matrimonial comienza en la presencia de Dios.", s)

    dynamic_box(story, "Dinámica de Parte II — “¿Qué pilar necesita refuerzo?” (5 min)", [
        "La pareja conversa: de los cuatro pilares, ¿cuál está más fuerte "
        "hoy y cuál necesita reparación?",
        "Acuerdan una acción pequeña esta semana para el pilar más débil.",
    ], s)

    # --- Receso ---
    section_header(story, "Receso (10 min)", s)
    para(story, "Invita a las parejas a tomar un café juntos, no en grupos separados "
                "de hombres y mujeres. Música suave de adoración de fondo.", s)

    # --- PARTE III ---
    section_header(story, "PARTE III — Herramientas para restaurar la relación", s)
    para(story, "(20 min)", s, "time")

    para(story, "1. El perdón", s, "sub")
    scripture_box(story, [
        ("Perdonándoos unos a otros… de la manera que Cristo os perdonó.",
         "Colosenses 3:13",
         "Pablo describe la 'nueva ropa' del creyente —compasión, bondad, "
         "humildad— y le pone medida al perdón: como Cristo nos perdonó. El "
         "estándar no es lo que el otro merece, sino lo que ya recibimos."),
        ("¿Hasta siete veces? … hasta setenta veces siete.", "Mateo 18:21-22",
         "Pedro cree ser generoso con siete veces; Jesús responde 'setenta "
         "veces siete': sin llevar la cuenta. Luego la parábola del siervo "
         "perdonado que no perdona: el perdonado está obligado a perdonar."),
    ], s)
    para(story, "Perdonar no es justificar. Perdonar es liberar el corazón del peso "
                "de la ofensa.", s)

    para(story, "2. La restauración", s, "sub")
    scripture_box(story, [
        ("Y os restituiré los años que comió la oruga.", "Joel 2:25",
         "Joel habla a un pueblo devastado por una plaga de langostas, imagen "
         "del juicio. Tras el llamado al arrepentimiento, Dios promete no solo "
         "perdonar, sino restituir los años perdidos."),
    ], s)
    para(story, "Dios puede restaurar: la confianza, la comunicación, el amor y los sueños.", s)

    para(story, "3. La humildad", s, "sub")
    scripture_box(story, [
        ("Revestíos de humildad.", "1 Pedro 5:5",
         "Pedro escribe a creyentes que sufren y cierra citando Proverbios: "
         "'Dios resiste a los soberbios, y da gracia a los humildes'. La "
         "humildad atrae la gracia de Dios; el orgullo, su resistencia."),
    ], s)
    para(story, "Los matrimonios fuertes no son los que nunca fallan, sino los que saben "
                "arrepentirse.", s)

    para(story, "4. El servicio mutuo", s, "sub")
    scripture_box(story, [
        ("…servíos por amor los unos a los otros.", "Gálatas 5:13",
         "Pablo defiende la libertad en Cristo, pero aclara que no es licencia "
         "para el egoísmo. La verdadera libertad se demuestra sirviendo por "
         "amor. En el matrimonio: ser libres se traduce en servir, no exigir."),
    ], s)
    para(story, "El matrimonio florece cuando ambos dejan de preguntar “¿qué "
                "puedo recibir?” y comienzan a preguntar “¿cómo puedo servir?”.", s)

    dynamic_box(story, "Dinámica de Parte III — “Las dos frases que sanan” (4 min)", [
        "Cada cónyuge dice al otro, mirándolo a los ojos: “Te pido perdón por...”.",
        "Y si hay algo que soltar: “Te perdono por...”. No se exige; se ofrece. Es "
        "voluntario y privado.",
    ], s)

    # --- PARTE IV ---
    section_header(story, "PARTE IV — Renovando el pacto matrimonial", s)
    para(story, "(15 min)", s, "time")

    para(story, "El matrimonio es un pacto", s, "sub")
    scripture_box(story, [
        ("…ella es tu compañera y la mujer de tu pacto.", "Malaquías 2:14",
         "El último profeta del AT reprende a los hombres de Judá que eran "
         "infieles y se divorciaban de la esposa de su juventud. Dios es "
         "testigo del voto: el matrimonio es un pacto solemne, no descartable."),
    ], s)
    para(story, "Un contrato dura mientras beneficia. Un pacto permanece aun en las dificultades.", s)

    para(story, "Fidelidad al compromiso", s, "sub")
    scripture_box(story, [
        ("Mejor es que no prometas, y no que prometas y no cumplas.",
         "Eclesiastés 5:4-5",
         "Salomón habla de la seriedad de los votos hechos a Dios: cumplirlos "
         "sin demora. Dios toma en serio nuestras promesas, y el voto "
         "matrimonial, hecho ante Él, entra en esta advertencia."),
    ], s)
    para(story, "El matrimonio es una promesa hecha delante de Dios.", s)

    para(story, "El amor que permanece", s, "sub")
    scripture_box(story, [
        ("Fuerte es como la muerte el amor… Las muchas aguas no podrán apagar "
         "el amor.", "Cantares 8:6-7",
         "Clímax del poema de amor conyugal de Salomón: el amor como un sello "
         "sobre el corazón, fuerte como la muerte, una llama que ni las aguas "
         "apagan y que no se puede comprar. Amor firme, exclusivo y permanente."),
    ], s)
    para(story, "El amor verdadero no se sostiene por circunstancias favorables, sino por "
                "compromiso y gracia.", s)

    para(story, "Cristo en el centro", s, "sub")
    scripture_box(story, [
        ("Serán los dos una sola carne. Grande es este misterio… respecto de "
         "Cristo y de la iglesia.", "Efesios 5:31-32",
         "Pablo cita Génesis 2:24 y revela su sentido profundo: el matrimonio "
         "es un 'misterio' que apunta a algo mayor. Cada unión es figura visible "
         "de Cristo y su Iglesia; predica el Evangelio sin palabras."),
    ], s)
    para(story, "Cada hogar cristiano está llamado a mostrar el Evangelio a través "
                "de su relación matrimonial.", s)

    # --- Conclusión ---
    section_header(story, "Conclusión", s)
    scripture_box(story, [
        ("Mejores son dos que uno… y cordón de tres dobleces no se rompe pronto.",
         "Eclesiastés 4:9-12",
         "Cerramos donde la Parte I señaló el problema. Salomón celebra la "
         "fuerza de la unión: dos se levantan si caen, se dan calor y resisten "
         "al ataque. La pareja unida a Dios es la que no se rompe."),
    ], s)
    para(story, "El matrimonio no fue diseñado para sobrevivir; fue diseñado para "
                "prosperar. No fue diseñado para soportarse; fue diseñado para "
                "reflejar la gloria de Dios.", s, "center")

    # --- Ministración ---
    section_header(story, "Ministración Final", s)
    para(story, "Invita a las parejas a tomarse de las manos en un ambiente de "
                "adoración. Guía la declaración frase por frase para que la "
                "repitan juntos:", s)
    decl = []
    decl.append(Paragraph(
        "“Señor, hoy renovamos nuestro pacto delante de Ti. "
        "Perdónanos donde hemos fallado. Restaura lo que se ha debilitado. "
        "Sana lo que ha sido herido. Aviva nuevamente el amor, la unidad y la "
        "pasión por Tu presencia. Que nuestro hogar sea un reflejo de Cristo "
        "y Su Iglesia. En el nombre de Jesús. Amén.”",
        s["prompt"]))
    add_shaded_box(story, decl, s)
    story.append(Spacer(1, 12))
    para(story, "Cierra con oración de bendición sobre cada matrimonio. Si el "
                "contexto lo permite, invita a las parejas a abrazarse y orar el uno por "
                "el otro antes de salir.", s)

    # --- Versículos clave ---
    section_header(story, "Versículos Clave de la Conferencia", s)
    add_table(
        story,
        ["#", "Cita", "Contexto en una frase"],
        [
            ["1", "Génesis 2:24", "El diseño original del matrimonio, dado antes de la caída."],
            ["2", "Mateo 19:6", "Jesús defiende la permanencia frente al divorcio fácil."],
            ["3", "Efesios 5:25", "El esposo ama con el amor sacrificial de Cristo."],
            ["4", "Efesios 5:33", "El equilibrio: amor del esposo, respeto de la esposa."],
            ["5", "Malaquías 2:14", "Dios es testigo del pacto; reprende la infidelidad."],
            ["6", "Eclesiastés 4:12", "La fuerza de la unión con Dios como tercer cordón."],
            ["7", "Colosenses 3:13", "Perdonar con la medida en que Cristo nos perdonó."],
            ["8", "Joel 2:25", "Dios restituye los años que el daño se llevó."],
            ["9", "Cantares 8:6-7", "El amor conyugal: fuerte, exclusivo, inextinguible."],
            ["10", "Efesios 5:31-32", "El matrimonio como figura de Cristo y la Iglesia."],
        ],
        [0.4, 1.4, 4.2],
        s,
    )

    page_footer = make_page_footer("church")
    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    return os.path.abspath(output_path)


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else None
    path = main(out)
    print(f"PDF generado: {path}")
