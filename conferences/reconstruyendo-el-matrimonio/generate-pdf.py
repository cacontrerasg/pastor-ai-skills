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
        "que Dios Diseñó · Dios reconstruye el hogar reconstruyendo el corazón",
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
        ("Por la dureza de vuestro corazón Moisés os permitió repudiar a "
         "vuestras mujeres; mas al principio no fue así.", "Mateo 19:8 (RV1960)",
         "El eje de esta conferencia. Jesús señala la RAÍZ: el divorcio no fue "
         "el plan de Dios, fue una concesión 'por la dureza de vuestro corazón'. "
         "El enemigo del matrimonio no son las circunstancias, sino el corazón "
         "que se endurece. Reconstruir el matrimonio es dejar que Dios "
         "reconstruya el corazón."),
    ], s)

    # --- Idea central ---
    section_header(story, "Idea Central", s)
    para(story, "El matrimonio no está roto sin remedio: está esperando ser "
                "reconstruido sobre el diseño original de Dios. Pero el diseño "
                "solo se restaura donde el corazón se ablanda. Toda la conferencia "
                "sigue un solo hilo: el corazón —el del esposo y el de la "
                "esposa—, porque Dios trabaja a su Iglesia, y a cada hogar, a "
                "través del corazón.", s)
    hilo = [
        Paragraph("El hilo de la conferencia — el corazón", s["dyn_title"]),
        Paragraph("Parte I: lo que <b>endurece</b> el corazón (incluida la "
                  "advertencia de Salomón).", s["dyn_body"]),
        Paragraph("Parte II: los pilares que solo se sostienen sobre un "
                  "<b>corazón blando</b>.", s["dyn_body"]),
        Paragraph("Parte III: las herramientas con que Dios <b>ablanda y "
                  "sana</b> el corazón.", s["dyn_body"]),
        Paragraph("Parte IV: el pacto que <b>guarda</b> el corazón para toda "
                  "la vida.", s["dyn_body"]),
    ]
    add_shaded_box(story, hilo, s)
    story.append(Spacer(1, 12))

    # --- Agenda ---
    section_header(story, "Agenda y Bloques de Tiempo (120 min)", s)
    add_table(
        story,
        ["Tiempo", "Bloque", "Min"],
        [
            ["0:00 – 0:10", "Bienvenida y apertura", "10"],
            ["0:10 – 0:18", "Introducción", "8"],
            ["0:18 – 0:46", "Parte I — Lo que endurece el corazón", "28"],
            ["0:46 – 1:08", "Parte II — Los cuatro pilares", "22"],
            ["1:08 – 1:18", "Receso", "10"],
            ["1:18 – 1:38", "Parte III — Herramientas para restaurar", "20"],
            ["1:38 – 1:50", "Parte IV — Renovando el pacto", "12"],
            ["1:50 – 2:00", "Conclusión y ministración final", "10"],
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
        "Oración de apertura entregando el tiempo a Dios y pidiéndole que "
        "ablande cada corazón.",
    ], s)

    # --- Introducción ---
    section_header(story, "Introducción", s)
    para(story, "(8 min)", s, "time")
    para(story, "Vivimos tiempos donde el matrimonio enfrenta ataques constantes: la "
                "cultura, las presiones económicas, el individualismo y la "
                "pérdida de valores bíblicos. Sin embargo, Dios sigue "
                "teniendo un diseño perfecto para el hogar.", s)
    para(story, "Pero fíjate dónde puso Jesús el dedo cuando le hablaron de "
                "matrimonios rotos: no en las circunstancias, sino en la dureza del "
                "corazón (Mateo 19:8). El matrimonio es una gran bendición; aun así, "
                "muchas veces no se ve así. Hay incluso quienes se aman y, "
                "amándose, viven el matrimonio como si fuera una esclavitud. ¿Por "
                "qué? Porque un corazón que se endurece deja de ver la bendición "
                "que tiene en frente.", s)
    para(story, "La pregunta no es si el matrimonio está en crisis. La pregunta es:", s)
    para(story, "¿Estamos dispuestos a dejar que Dios ablande nuestro corazón y "
                "reconstruya el matrimonio según su diseño original?", s, "center")

    # --- PARTE I ---
    section_header(story, "PARTE I — Lo que endurece el corazón", s)
    para(story, "(28 min)", s, "time")
    para(story, "Marco: los daños que veremos no son cuatro problemas sueltos, sino "
                "síntomas de un mismo mal de fondo —un corazón que se endurece. "
                "Cerraremos con la advertencia más seria de la Biblia sobre un "
                "corazón que se desvía: la de Salomón.", s)

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

    para(story, "4. La pérdida del amor — “¿Dónde se fue ese amor?”", s, "sub")
    scripture_box(story, [
        ("Has dejado tu primer amor… Recuerda de dónde has caído, y "
         "arrepiéntete, y haz las primeras obras.", "Apocalipsis 2:4-5",
         "Carta del Cristo resucitado a la iglesia de Éfeso: trabajadora y "
         "firme en doctrina, pero había perdido el amor de los primeros "
         "tiempos. Su remedio es triple: recuerda, arrepiéntete y vuelve a hacer "
         "las primeras obras."),
    ], s)
    para(story, "No se pierde el amor de un día para otro. Se pierde cuando el "
                "corazón se endurece y dejamos de hacer las cosas que lo "
                "alimentaban. Es la pregunta dolorosa de tantos: ¿dónde se fue ese "
                "amor? La buena noticia: el camino de regreso existe —recordar, "
                "arrepentirse y volver a las primeras obras.", s)

    para(story, "5. La advertencia de Salomón: el corazón desviado", s, "sub")
    scripture_box(story, [
        ("Y sus mujeres inclinaron su corazón… y su corazón no era perfecto con "
         "Jehová su Dios.", "1 Reyes 11:1-4",
         "El hombre más sabio que existió, el que construyó el templo y escribió "
         "el Cantar de los Cantares, terminó con el corazón dividido y desviado "
         "de Dios. No cayó por falta de sabiduría, sino por un corazón que dejó "
         "de guardar. Si a Salomón le pasó, nadie está exento."),
        ("Sobre toda cosa guardada, guarda tu corazón; porque de él mana la "
         "vida.", "Proverbios 4:23",
         "El consejo es del propio Salomón a su hijo —precisamente lo que él "
         "mismo dejó de hacer. El corazón es el manantial de donde brota todo lo "
         "demás; por eso debe guardarse por encima de cualquier otra cosa."),
    ], s)
    para(story, "El que escribió el poema de amor más hermoso terminó "
                "preguntándose, como tantos hoy, ¿dónde se fue ese amor? La "
                "respuesta de su vida es seria: el amor se va cuando el corazón se "
                "desvía. Salomón es a la vez espejo (a cualquiera le puede pasar) y "
                "advertencia (guarda tu corazón antes de que sea tarde).", s)

    dynamic_box(story, "Dinámica de Parte I — “El espejo del corazón” (5 min)", [
        "Cada cónyuge responde en un papel: (1) ¿cuál de estos daños revela "
        "que mi corazón se está endureciendo? (2) ¿en qué cosa pequeña siento que "
        "se fue parte de aquel primer amor?",
        "Lo comparten sin defenderse ni acusar: solo escuchar. La regla: hoy no "
        "venimos a ganar, venimos a sanar.",
    ], s)

    # --- PARTE II ---
    section_header(story, "PARTE II — Los cuatro pilares de un matrimonio saludable", s)
    para(story, "(22 min)", s, "time")
    para(story, "Conexión con el hilo: estos cuatro pilares no se pueden levantar "
                "sobre un corazón de piedra. Cada uno requiere un corazón "
                "ablandado por Dios.", s)

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
    para(story, "Aplicación: el amor bíblico es una decisión antes que una "
                "emoción. Por eso resiste cuando el sentimiento se enfría.", s)

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
         "casa. Un líder que fija la dirección espiritual de su hogar —justo lo "
         "contrario de Salomón, que dejó que otros corazones desviaran el suyo."),
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
    para(story, "Conexión con el hilo: estas no son técnicas; son los medios por "
                "los que Dios ablanda y sana el corazón.", s)

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
    para(story, "Perdonar no es justificar. Perdonar es ablandar el corazón y "
                "liberarlo del peso de la ofensa.", s)

    para(story, "2. La restauración: de corazón de piedra a corazón de carne", s, "sub")
    scripture_box(story, [
        ("Os daré corazón nuevo… y quitaré de vuestra carne el corazón de "
         "piedra, y os daré un corazón de carne.", "Ezequiel 36:26",
         "Dios le promete a un pueblo en el exilio que la restauración no vendrá "
         "de su propio esfuerzo, sino de un corazón nuevo que Él mismo dará. Es "
         "la respuesta directa a la dureza de corazón de Mateo 19:8: lo que "
         "nosotros no podemos ablandar, Dios lo reemplaza."),
        ("Y os restituiré los años que comió la oruga.", "Joel 2:25",
         "Joel habla a un pueblo devastado por una plaga de langostas, imagen "
         "del juicio. Tras el llamado al arrepentimiento, Dios promete no solo "
         "perdonar, sino restituir los años perdidos."),
    ], s)
    para(story, "Dios puede restaurar la confianza, la comunicación, el amor y los "
                "sueños. Y empieza por lo más profundo: cambiar el corazón de "
                "piedra por uno de carne.", s)

    para(story, "3. La humildad", s, "sub")
    scripture_box(story, [
        ("Revestíos de humildad.", "1 Pedro 5:5",
         "Pedro escribe a creyentes que sufren y cierra citando Proverbios: "
         "'Dios resiste a los soberbios, y da gracia a los humildes'. La "
         "humildad atrae la gracia de Dios; el orgullo, su resistencia."),
    ], s)
    para(story, "Los matrimonios fuertes no son los que nunca fallan, sino los que "
                "saben arrepentirse. El arrepentimiento es un corazón que vuelve a "
                "ablandarse.", s)

    para(story, "4. El servicio mutuo", s, "sub")
    scripture_box(story, [
        ("…servíos por amor los unos a los otros.", "Gálatas 5:13",
         "Pablo defiende la libertad en Cristo, pero aclara que no es licencia "
         "para el egoísmo. La verdadera libertad se demuestra sirviendo por "
         "amor. En el matrimonio: ser libres se traduce en servir, no exigir."),
    ], s)
    para(story, "Aquí se responde la mentira de la “esclavitud”: el matrimonio no "
                "es cadena, es libertad para servir por amor. Florece cuando ambos "
                "dejan de preguntar “¿qué puedo recibir?” y comienzan a preguntar "
                "“¿cómo puedo servir?”.", s)

    dynamic_box(story, "Dinámica de Parte III — “Las dos frases que sanan” (4 min)", [
        "Cada cónyuge dice al otro, mirándolo a los ojos: “Te pido perdón por...”.",
        "Y si hay algo que soltar: “Te perdono por...”. No se exige; se ofrece. Es "
        "voluntario y privado. Es el momento en que un corazón endurecido vuelve "
        "a ablandarse.",
    ], s)

    # --- PARTE IV ---
    section_header(story, "PARTE IV — Renovando el pacto matrimonial", s)
    para(story, "(12 min)", s, "time")

    para(story, "El matrimonio es un pacto", s, "sub")
    scripture_box(story, [
        ("…ella es tu compañera y la mujer de tu pacto.", "Malaquías 2:14",
         "El último profeta del AT reprende a los hombres de Judá que eran "
         "infieles y se divorciaban de la esposa de su juventud. Dios es "
         "testigo del voto: el matrimonio es un pacto solemne, no descartable."),
    ], s)
    para(story, "Un contrato dura mientras beneficia. Un pacto permanece aun en las dificultades.", s)

    para(story, "Guardar el corazón para guardar el pacto", s, "sub")
    scripture_box(story, [
        ("Sobre toda cosa guardada, guarda tu corazón; porque de él mana la "
         "vida.", "Proverbios 4:23",
         "El consejo del propio Salomón, que él no cumplió. Guardar el pacto "
         "empieza por guardar el corazón día a día: lo que dejamos entrar, lo que "
         "alimentamos, dónde ponemos la mirada."),
        ("Mejor es que no prometas, y no que prometas y no cumplas.",
         "Eclesiastés 5:4-5",
         "Salomón habla de la seriedad de los votos hechos a Dios: cumplirlos "
         "sin demora. El voto matrimonial, hecho ante Él, entra en esta "
         "advertencia."),
    ], s)
    para(story, "El matrimonio es una promesa hecha delante de Dios; se honra "
                "guardando el corazón cada día.", s)

    para(story, "El amor que permanece", s, "sub")
    scripture_box(story, [
        ("Fuerte es como la muerte el amor… Las muchas aguas no podrán apagar "
         "el amor.", "Cantares 8:6-7",
         "Clímax del poema de amor conyugal de Salomón —el mismo que después "
         "dejó desviar su corazón. Retrata el amor como un sello sobre el "
         "corazón, fuerte como la muerte, una llama que ni las aguas apagan. Es "
         "el amor que Dios quiere reavivar: el 'primer amor' recuperado."),
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
         "al ataque. La pareja unida a Dios —con el corazón blando y guardado— "
         "es la que no se rompe."),
    ], s)
    para(story, "El matrimonio no fue diseñado para sobrevivir; fue diseñado para "
                "prosperar. No fue diseñado para soportarse —ni para sentirse una "
                "esclavitud—; fue diseñado para reflejar la gloria de Dios. Y eso "
                "solo ocurre donde Dios reconstruye el corazón.", s, "center")

    # --- Ministración ---
    section_header(story, "Ministración Final", s)
    para(story, "Invita a las parejas a tomarse de las manos en un ambiente de "
                "adoración. El centro de la ministración es el corazón: pídele a "
                "Dios el milagro de un corazón nuevo. Guía la declaración frase por "
                "frase para que la repitan juntos:", s)
    decl = []
    decl.append(Paragraph(
        "“Señor, hoy renovamos nuestro pacto delante de Ti. "
        "Crea en nosotros un corazón limpio (Salmo 51:10). "
        "Quita todo corazón de piedra y danos un corazón de carne. "
        "Perdónanos donde hemos fallado. Restaura lo que se ha debilitado. "
        "Sana lo que ha sido herido. Aviva nuevamente el primer amor, la unidad "
        "y la pasión por Tu presencia. Ayúdanos a guardar nuestro corazón todos "
        "los días. Que nuestro hogar sea un reflejo de Cristo y Su Iglesia. "
        "En el nombre de Jesús. Amén.”",
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
            ["3", "Mateo 19:8", "La raíz del problema: la dureza del corazón."],
            ["4", "1 Reyes 11:1-4", "El corazón desviado de Salomón: a nadie le está garantizado."],
            ["5", "Proverbios 4:23", "Guarda tu corazón, porque de él mana la vida."],
            ["6", "Apocalipsis 2:4-5", "El primer amor perdido y el camino de regreso."],
            ["7", "Efesios 5:25", "El esposo ama con el amor sacrificial de Cristo."],
            ["8", "Efesios 5:33", "El equilibrio: amor del esposo, respeto de la esposa."],
            ["9", "Ezequiel 36:26", "Dios cambia el corazón de piedra por uno de carne."],
            ["10", "Colosenses 3:13", "Perdonar con la medida en que Cristo nos perdonó."],
            ["11", "Cantares 8:6-7", "El amor conyugal: fuerte, exclusivo, inextinguible."],
            ["12", "Efesios 5:31-32", "El matrimonio como figura de Cristo y la Iglesia."],
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
