# Organismos de Socorro y la Biblia

**Conferencia · Carlos Contreras**
*Preparación, prevención y fe ante la emergencia*

Paquete completo para dictar la conferencia: guion cronometrado, anexos técnicos,
material para el participante y esquema de diapositivas.

---

## Contenido del paquete

| Archivo | Qué es | Para quién |
|---|---|---|
| `01-guion-conferencia.md` | Guion completo, bloque por bloque, con tiempos, textos ancla, ilustraciones y transiciones | Conferencista |
| `02-anexo-medidas-de-seguridad.md` | Fichas técnicas: terremoto, ciclón, maremoto, incendio, accidentes | Conferencista / brigada |
| `03-anexo-ejemplos-biblicos.md` | Catálogo de pasajes con la lectura de gestión de riesgo de cada uno | Conferencista |
| `04-hoja-del-participante.md` | Material imprimible de una hoja (frente y vuelta) | Asistentes |
| `05-esquema-diapositivas.md` | Guion de 47 diapositivas (reducibles a 34), listo para montar | Quien monte el deck |
| `06-plan-de-emergencia-de-la-iglesia.md` | Plantilla de plan y brigada para el local de reunión | Liderazgo / comité |
| `Guion - Organismos de Socorro y la Biblia.docx` | El guion en Word, listo para imprimir (20 páginas) | Conferencista |
| `Organismos de Socorro y la Biblia - 45 min.pptx` | **El deck de 45 minutos** (35 diapositivas) | Conferencista |
| `Organismos de Socorro y la Biblia - 90 min.pptx` | El deck de la versión completa (47 diapositivas) | Conferencista |
| `generar-deck-45.js` · `generar-deck-90.js` | Scripts que generan cada .pptx | Quien ajuste el deck |
| `generar-guion-docx.js` | Script que convierte el guion .md en el .docx | Quien ajuste el documento |

---

## Ficha de la conferencia

- **Título:** Organismos de Socorro y la Biblia
- **Subtítulo:** Lo que Dios dice antes de que suene la alarma
- **Duración:** 90 minutos (versión completa) · 45 minutos (versión comprimida, ver guion)
- **Formato:** Charla con apoyo visual, dos dinámicas cortas y compromiso final
- **Audiencia:** Congregación general, líderes, brigadas de socorro, jóvenes, familias
- **Versión bíblica citada:** Reina-Valera 1960 (RVR1960)

### Idea central

> Dios no le pide a su pueblo que escoja entre confiar y prepararse.
> La fe bíblica **ora y pone guarda** (Nehemías 4:9). El que se prepara no
> desconfía de Dios: obedece a Dios.

### Objetivos

Al terminar, cada asistente debe poder:

1. Ejecutar correctamente las tres o cuatro acciones que salvan vida en un
   terremoto, un ciclón, un maremoto y un incendio.
2. Explicar, con texto bíblico en la mano, por qué prevenir es un acto de fe y
   no una falta de fe.
3. Distinguir entre el temor que paraliza y la prudencia que protege.
4. Salir con un plan familiar escrito: punto de encuentro, contactos, mochila.
5. Identificar a la iglesia como un organismo de socorro para su comunidad.

---

## Orden de los bloques

El guion sigue el orden temático que definió el conferencista:

1. Medidas de seguridad ante terremotos, ciclones, maremotos, incendios y accidentes
2. ¿Qué habla Dios ante las emergencias?
3. Cómo se debe preparar un cristiano frente a tantas amenazas mundiales
4. Qué nos enseña la Biblia sobre las amenazas de los fenómenos de la naturaleza
5. Ejemplos bíblicos

**Flujo alterno (opcional):** si el auditorio es principalmente de iglesia y se
quiere entrar por lo bíblico, intercambie los bloques 1 y 4. La conferencia
abriría con la teología de la creación y cerraría con las medidas prácticas como
aplicación. El guion está escrito para que ambos órdenes funcionen.

---

## El guion en Word

`Guion - Organismos de Socorro y la Biblia.docx` es el mismo contenido de
`01-guion-conferencia.md`, maquetado para imprimir y anillar: 20 páginas tamaño
carta, con portada, encabezado y numeración.

Lo que hace útil al documento en tarima es que **el texto hablado se distingue
de un vistazo**: va con una barra ámbar al margen izquierdo y en tipografía
serif, mientras las indicaciones y el material de apoyo van en sans. No hay que
leer para saber qué toca decir.

Cada bloque empieza en página nueva. El `Mapa de tiempos` de la página 2 hace de
índice: lista los siete bloques con sus minutos y el acumulado.

**Para regenerarlo** después de editar el `.md`:

```bash
npm install docx
node generar-guion-docx.js 01-guion-conferencia.md "Guion - Organismos de Socorro y la Biblia.docx"
```

El script convierte el Markdown directamente, así que el `.md` sigue siendo la
fuente: se edita ahí y se regenera. Si prefiere trabajar en Word, también puede
editar el `.docx` a mano — solo tenga presente que entonces los dos archivos se
separan.

---

## Los dos decks

Hay dos presentaciones, según el tiempo que le den:

| | Diapositivas | Para |
|---|---|---|
| **45 min** | 35 | El slot habitual de una conferencia o una noche de iglesia |
| **90 min** | 47 | La versión completa, con todo el temario |

Ambas comparten diseño: 16:9, fondo oscuro (pensado para templos con luz
ambiental), tipografías Cambria y Calibri —ambas estándar de Office, así que no
hay que instalar nada— y notas del orador en cada diapositiva.

### Qué cambia en la versión de 45 minutos

Sigue el recorte que el propio guion define:

| Bloque | Min | Ajuste |
|---|---|---|
| Apertura | 5 | Sin diapositiva de agenda |
| Medidas de seguridad | 12 | Solo terremoto, ciclón e incendio |
| ¿Qué habla Dios ante las emergencias? | 10 | Completo, sin recortes |
| Cómo se prepara un cristiano | 8 | Se desarrollan los tres primeros niveles |
| Ejemplos bíblicos | 7 | Noé, José y Pablo en el naufragio |
| Cierre | 4 | Completo |

**Lo que sale del deck no se pierde:** maremotos y primeros auxilios están
completos en la hoja del participante, y el Bloque 4 —la enseñanza bíblica sobre
los fenómenos naturales— se condensa en una sola diapositiva dentro de la
apertura, centrada en Lucas 13. Las notas le indican al conferencista que
anuncie esto en voz alta, para que nadie crea que se olvidó.

El código de color sigue el del esquema: ámbar para el hilo bíblico, y un color
por amenaza en el Bloque 1 (naranja terremoto, azul ciclón, verde maremoto, rojo
incendio, gris accidentes).

### Las notas del orador

**Cada diapositiva lleva en las notas lo que hay que decir ahí**,
redactado en primera persona y listo para leerse. Están organizadas con
etiquetas:

- **USTED DICE** — el texto hablado, entre comillas angulares.
- **USTED HACE** — la indicación escénica: cuándo callar, cuándo señalar la
  pantalla, cuándo hacer la dinámica.
- **SI SE LO PREGUNTAN** — la respuesta a la pregunta que suele salir.
- **TRANSICIÓN** — el puente hacia el bloque siguiente.

En PowerPoint se ven en la Vista del moderador, o en `Vista → Notas` para
imprimirlas. Unas 6.100 palabras en la versión de 90 minutos y 5.000 en la de
45, alrededor de 140 por diapositiva en ambas. Las notas de la versión corta
están reescritas para ese ritmo: dicen cuántos minutos tiene cada bloque, qué
desarrollar y qué solo nombrar.
El guion completo sigue estando en `01-guion-conferencia.md`, que es el
documento para estudiar; las notas son para tenerlas delante mientras dicta.

**Para reeditarlos:** cada deck se genera desde su script. Con Node instalado:

```bash
npm install pptxgenjs
node generar-deck-45.js "Organismos de Socorro y la Biblia - 45 min.pptx"
node generar-deck-90.js "Organismos de Socorro y la Biblia - 90 min.pptx"
```

Son dos scripts independientes: un cambio en uno no toca al otro, así que si
edita contenido que aparece en ambos, hágalo en los dos.

Editar el script y regenerar es más confiable que mover cajas a mano en
PowerPoint, sobre todo si se cambia el texto de varias diapositivas. Aun así, el
.pptx es un archivo normal: se puede abrir y ajustar directamente sin problema.

---

## Antes de dictarla — lista de verificación

- [ ] Confirmar con el organismo competente los números, protocolos y niveles de
      alerta vigentes en la localidad (ver nota de validación más abajo).
- [ ] Reconocer el local: salidas, extintores, botiquín, punto de encuentro.
- [ ] Imprimir la hoja del participante (una por familia, no una por persona).
- [ ] Preparar los objetos de apoyo: un extintor, un botiquín, una mochila de
      emergencia armada, un detector de humo, una linterna, un radio de baterías.
- [ ] Invitar a un miembro de Defensa Civil, Cruz Roja o Bomberos a los últimos
      15 minutos para la sesión de preguntas.
- [ ] Verificar que haya agua y sillas suficientes si se hará la dinámica de
      evacuación.

---

## Nota de validación importante

El contenido técnico de este paquete es material **de orientación y
concientización**, preparado a partir de las recomendaciones estándar de los
organismos de socorro. No sustituye la capacitación formal.

- Los procedimientos de primeros auxilios, RCP y uso de extintores deben
  **enseñarse y certificarse** a través de la Cruz Roja, el Cuerpo de Bomberos,
  Defensa Civil o la entidad autorizada en su país.
- Los números de emergencia, los niveles de alerta y las rutas de evacuación
  **deben verificarse con la autoridad local** antes de imprimirse o proyectarse,
  porque cambian entre países y con el tiempo.
- Antes de anunciar cualquier plan de evacuación del templo, sométalo a la
  revisión del Cuerpo de Bomberos y del liderazgo de la congregación.

Este material es un apoyo a la preparación del conferencista; el juicio
pastoral, la validación técnica y la decisión final son suyos.
