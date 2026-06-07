# Reconstruyendo el Matrimonio que Dios Diseñó

Conferencia cristiana para matrimonios, estructurada para **2 horas**.

## Archivos

| Archivo | Qué es |
|---|---|
| `conferencia.md` | Guion completo: agenda con bloques de tiempo, guía para el conferencista, textos bíblicos, dinámicas de pareja y transiciones. |
| `hoja-de-pareja.md` | Hoja imprimible para entregar a cada pareja; recoge las respuestas de las dinámicas y el compromiso final. |
| `generate-pdf.py` | Genera un PDF con diseño de marca (navy + dorado) a partir del contenido. |

## Generar el PDF

```bash
pip install reportlab          # una sola vez
python3 generate-pdf.py        # crea Reconstruyendo-el-Matrimonio.pdf
```

El PDF queda fuera de control de versiones (`.gitignore`); se regenera cuando se necesite.

## Estructura de la conferencia

1. **Bienvenida y apertura** (10 min)
2. **Introducción** (10 min)
3. **Parte I** — Lo que está dañando los matrimonios hoy (25 min)
4. **Parte II** — Los cuatro pilares de un matrimonio saludable (25 min)
5. **Receso** (10 min)
6. **Parte III** — Herramientas para restaurar la relación (20 min)
7. **Parte IV** — Renovando el pacto matrimonial (15 min)
8. **Conclusión y ministración final** (15 min)
