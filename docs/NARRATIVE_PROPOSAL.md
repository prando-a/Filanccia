# FILANCCIA — Narrativa: Principios, Diálogos y Diseño

> Documento de referencia para sesiones de escritura con DeepSeek.
> Estado: diálogos implementados extraídos del código. Diseños pendientes marcados con 📋.

---

## I. PRINCIPIOS NARRATIVOS (guía permanente)

1. **Descubrimiento de pistas:** Marlo necesita encontrar pistas cruciales en el cuerpo o en la escena del crimen para avanzar. Las pistas deben sentirse como revelaciones, no como checkboxes.

2. **Enfoque del villano:** El interés de Strappavolti en Marlo debe traducirse en puestas a prueba directas. Strappavolti pone a prueba los límites de la pureza/inocencia de Marlo. Marlo se convierte en objetivo porque se acerca demasiado.

3. **Conflicto gobierno-ciudadanía:** La "investigación sobre la confianza" del gobierno vs la exigencia de verdad ciudadana genera fricción creciente. No es solo un crimen — es político.

4. **Redes de apoyo emergentes:** Algunos ciudadanos o compañeros podrían empezar a apoyar la investigación de Marlo de forma encubierta.

5. **Vínculo Marlo–Strappavolti:** La conexión entre ambos se revela gradualmente. Puede ser gemelos, origen compartido u otro lazo. Desvelar paso a paso, nunca explicar del todo.

6. **Equilibrio narrativo:** Profundizar en la historia personal de Marlo sin perder visibilidad de los eventos principales (investigación oficial, Comité Ciudadano). Evitar que la narrativa se fragmente.

**Conclusión estructural:** Una investigación personal desencadena repercusiones sociales y coloca al individuo en situación más peligrosa. La inocencia y empatía de Marlo son fuerza motriz y debilidad simultáneamente — lo llevan a desafiar al asesino y a descubrir estructuras de poder ocultas, elevando su aventura personal a cuestionamiento de la "seguridad" y la "verdad" de Filanccia.

---

## II. ESTRUCTURA DAN HARMON

| Paso | Escena      | Beat                              | NPC principal        | Objeto clave         | Estado |
|------|-------------|-----------------------------------|----------------------|----------------------|--------|
| 1    | 1-0         | Zona de confort — baño de Marlo   | Madre (voz)          | —                    | ✅     |
| 2    | 1-1         | Deseo — salida al carnaval        | —                    | —                    | ✅     |
| 3    | 1-2 / 1-3   | Umbral — plaza + Ballo Mascherato | Alcalde, Hijo        | —                    | ✅     |
| 4    | 1-4         | Adaptarse — asesinato descubierto | Padres, multitud     | —                    | ✅     |
| 5    | Bodega      | Encontrar — testigo asustado      | Giacomo              | trozo de terciopelo  | ✅     |
| 6    | Sótano      | Tomar — santuario oscuro          | Piccolo              | botón de ópalo       | ✅     |
| 7    | Armería     | Regreso — prueba silenciada       | Rafaello + Guardia   | sello de lacre       | 🔧     |
| 8    | 1-4 return  | Consecuencias — ciudad que no escucha | Padres           | —                    | 📋     |
| Ep.  | Armería rev.| Rafaello da espada. Fin Cap. 1    | Rafaello             | espada pequeña       | 📋     |

**Cadena de pistas:** `todasPistasRecogidas = terciopeloRecogido && botonRecogido && selloRecogido`

---

## III. PERSONAJES

- **Marlo** (12): Empático, curioso, ingenuo. Su inocencia es fuerza y vulnerabilidad. No huye de la injusticia.
- **Strappavolti** ("Arranca-caras"): Sin emociones visibles. Asesina por razones filosóficas — pone a prueba la pureza. Fascinado por Marlo (no huye). Perturbado porque Marlo siente lo que él no puede.
- **Giacomo**: Bodeguero mayor. 20 años de cómplice silencioso del palacio. Habló esta noche, pero apenas.
- **Piccolo** (9-10): Niño de la calle. Vive en sótanos durante el carnaval. Habla de Strappavolti como fenómeno natural.
- **Rafaello**: Capitán de la guardia. 20 años al servicio. Honor vs lealtad institucional. Confiar en Marlo es su acto más ilógico.
- **Padres de Marlo**: Amor real que no puede ver la verdad. Representan el mundo que no quiere escuchar.
- **Hijo del Alcalde**: Asesinado. Sin rostro. El crimen que lo desencadena todo.

---

## IV. DIÁLOGOS IMPLEMENTADOS

### 1-0 — Casa de Marlo (baño)

```
[Madre]  ¡Marlo! ¿Todavía estás ahí? ¡El carnaval del centenario no espera a nadie!
[Marlo]  Ya casi estoy, mamá. Solo me falta... la máscara.
[Madre]  Tu padre ya está en la puerta. El Alcalde dará su discurso en menos de una hora.
[Madre]  Dicen que anunciará algo importante esta noche. ¡No podemos perdérnoslo!
[Marlo]  ¡Ya voy! Solo necesito un momento más...
```

---

### 1-1 — Camino a la plaza

```
[AMBIENTE] "Las calles de Filanccia rebosan de gente..."
```

---

### 1-2 — Plaza central (discurso del Alcalde)

```
[Alcalde] ¡Bienvenidos, queridos filenccianos! ¡Bienvenidos a la celebración del centenario de nuestra amada ciudad!
[Alcalde] Hace cien años, nuestros ancestros fundaron Filanccia sobre los principios de la prosperidad y la tradición.
[Alcalde] Esta noche, bajo las máscaras del carnaval, todos somos iguales. Nobles y plebeyos, unidos en la celebración.
[Alcalde] Pero antes de que comience la fiesta, tengo un anuncio especial que hacer en el palacio...
[Alcalde] ¡Os espero a todos en el gran salón! ¡Y ahora... QUE COMIENCE EL CARNAVAL!
```

---

### 1-3 — Ballo Mascherato (palacio)

```
[Noble]   ¡Qué espléndido baile! El Alcalde se ha superado este año.
[Dama]    Las máscaras son preciosas. Dicen que las trajo de Venecia especialmente para esta noche.
[Noble]   ¿Habéis oído los rumores? Parece que el Alcalde tiene un anuncio importante.
[Dama]    Todos hablan de ello. Algunos dicen que nombrará a su sucesor esta noche.
[Noble]   Era de esperar. El Alcalde ya no es joven, y su hijo ha demostrado ser capaz.

[Alcalde] ¡Estimados invitados! Por favor, un momento de atención...
[Alcalde] Hace cien años, nuestros ancestros fundaron esta ciudad con un sueño.
[Alcalde] Un sueño de prosperidad, de cultura, de una vida mejor para todos.
[Alcalde] Esta noche celebramos no solo ese sueño, sino su realización.
[Alcalde] Filanccia ha florecido bajo el liderazgo de mi familia durante generaciones.
[Alcalde] Pero todo líder debe pensar en el futuro. En quién continuará su obra.
[Alcalde] He gobernado esta ciudad durante veinte años, y ha sido el mayor honor de mi vida.
[Alcalde] Pero ha llegado el momento de preparar la transición hacia una nueva era.
[Alcalde] Por ello, esta noche, ante todos vosotros, anuncio oficialmente...
[Alcalde] ¡Que mi hijo será mi sucesor como Alcalde de Filanccia!

[ El hijo del Alcalde es presentado ]

[Alcalde]  ¡Él llevará el legado de nuestra familia y guiará a Filanccia hacia su próximo siglo de gloria!
[Noble]    ¡Bravo! ¡Una elección excelente!
[Dama]     ¡El joven señor será un gran líder! ¡Lo lleva en la sangre!
[Ciudadano] ¡Viva el futuro Alcalde! ¡Viva Filanccia!
[Noble]    La dinastía continúa. Filanccia está en buenas manos.
[Voz]      ...aunque algunos dicen que es demasiado joven para el cargo...
[Otra voz] ¡Silencio! No es momento para dudas. Es una noche de celebración.

[Hijo]    Gracias, padre. Gracias a todos por vuestra confianza.
[Hijo]    Sé que tengo grandes zapatos que llenar. Mi padre ha sido un líder ejemplar.
[Hijo]    Pero os prometo que dedicaré cada día de mi vida al servicio de Filanccia.
[Hijo]    Continuaré las tradiciones que nos han hecho grandes...
[Hijo]    Y trabajaré para construir un futuro aún más brillante para todos nosotros.
[Hijo]    ¡Por Filanccia! ¡Por el centenario! ¡Y por los próximos cien años de prosperidad!

[Multitud] ¡¡¡VIVA!!! ¡¡¡VIVA EL FUTURO ALCALDE!!!
[Alcalde]  ¡Y ahora, que continúe la celebración! ¡Que la música no pare hasta el amanecer!
```

---

### 1-4 — El asesinato (descubrimiento)

```
[Ciudadano]  ¡Ha muerto! ¡El hijo del Alcalde ha muerto!
[Ciudadana]  ¡No puede ser! ¡Estaba con nosotros hace apenas unos minutos!
[Ciudadano]  ¡Dios mío! ¡Es horrible! ¡Mirad la sangre!
[Ciudadana]  ¡Su rostro! ¡Le han arrancado el rostro!
[Ciudadano]  ¡Un demonio! ¡Ha sido obra de un demonio!
[Ciudadana]  ¡Los guardias! ¡Que alguien llame a los guardias!

[ Los guardias intervienen ]

[Madre]  Marlo, tenemos que salir de aquí inmediatamente. Esto no es seguro.
[Padre]  Tu madre tiene razón. Vámonos de aquí, hijo.
[Marlo]  Esperad... necesito un momento.
[Madre]  ¡Marlo! No es momento para curiosear. Un hombre ha muerto.
[Marlo]  Lo sé, mamá. Es solo que... algo no está bien aquí.
[Padre]  Claro que no está bien. Han asesinado al heredero del Alcalde en pleno carnaval.
[Marlo]  No, me refiero a... el rostro. ¿Por qué llevarse su rostro?
[Madre]  No lo sé y no quiero saberlo. Nos vamos ahora mismo.
[Marlo]  Dadme un segundo. Olvidé algo en el salón... enseguida os alcanzo.
[Padre]  No tardes, Marlo. Te esperamos en la entrada.

[Marlo 💭] No puedo irme así. Necesito ver esto de cerca.
[Marlo 💭] El hijo del Alcalde... sin vida, sin rostro. Esto es una pesadilla.
[Marlo 💭] Hace apenas unos minutos estaba en el escenario, recibiendo aplausos...
[Marlo 💭] ¿Quién podría hacer algo tan horrible? ¿Y por qué arrancarle el rostro?
[Marlo 💭] En el carnaval todos llevamos máscaras para ocultar quiénes somos...
[Marlo 💭] Pero él... ya no tiene nada que ocultar. Le han quitado todo.
[Marlo 💭] Esto no es un crimen común. Hay algo ritual, algo simbólico en todo esto.
[Marlo 💭] Los guardias no van a descubrir nada. Nunca lo hacen.
[Marlo 💭] Tengo que investigar por mi cuenta. Quizás en la bodega encuentre alguna pista...
```

---

### Bodega — Giacomo

```
[OBJETO — Nota misteriosa, plantada por Strappavolti]
[Marlo 💭] Una nota... "Eres curioso, pequeño. Eso es bueno."

[PRIMER CONTACTO]
[Marlo]   ¿Hay alguien ahí escondido?
[Giacomo] ¡Chist! Baja la voz, niño. Hay oídos en todas partes.
[Giacomo] Estaba aquí cuando ocurrió. Vi a un hombre sin rostro bajar horas antes.

[RAMA A — "¿Llevaba algo consigo?"]
[Giacomo] No vi su rostro, pero... llevaba algo envuelto en terciopelo. Pesado. No sé qué era.

[RAMA B — "¿Qué hacía un hombre aquí abajo?"]
[Giacomo] Este lugar es un nido de secretos. Apenas lo vi pasar...

[CONTINÚA — tras rama]
[Giacomo] Si te vio hablar conmigo, estamos perdidos. Toma esto. Lo dejó caer.
[Giacomo] Y aléjate de las sombras. No todas las máscaras se llevan en el rostro.
→ Da: trozo de terciopelo

[SUBSIGUIENTE — si Marlo vuelve a hablar]
[Giacomo] Ya te dije todo lo que sé, déjame en paz.

[OBJETO recogido]
[Marlo 💭] He conseguido un... ¿Trozo de terciopelo?
```

---

### Sótano — Piccolo

```
[PRIMER CONTACTO]
[Marlo]   ¿Eres tú quien vive aquí abajo?
[Piccolo] A veces. Las sombras son mejores compañía que la gente de arriba.

[RAMA A — "¿No tienes miedo de estar solo aquí?"]
[Piccolo] ¿Miedo? El miedo vive arriba, disfrazado de máscaras y aplausos. Aquí al menos las sombras son honestas.

[RAMA B — "¿Has visto algo extraño esta noche?"]
[Piccolo] Todo el carnaval es extraño. Pero sí... esta noche más que otras. Esta noche huele diferente.

[CONTINÚA]
[Piccolo] Conozco cada pasillo de este palacio. Lo he visto muchas veces. Al hombre sin rostro. Esta noche bajó aquí.

[RAMA C — "¿Cómo es? ¿Lo reconocerías?"]
[Piccolo] No tiene rostro que puedas recordar. Es como intentar recordar el vacío. Cada vez que lo ves... ya no estás seguro de lo que viste.

[RAMA D — "¿Suele bajar aquí a menudo?"]
[Piccolo] Siempre en noches especiales. Bodas. Funerales. Carnavales. Como si se alimentara de lo que los demás sienten.

[CONTINÚA]
[Piccolo] No busca dinero. No busca poder. Busca algo de dentro de las personas. Algo que no se puede ver. Que no se puede tocar. Solo... sentir.

[RAMA E — "¿Qué clase de cosa puede ser esa?"]
[Piccolo] No lo sé con palabras. Pero cuando él pasa cerca... algo en ti se siente más pequeño. Como si te mirara desde dentro.

[RAMA F — "¿Y tú? ¿Te ha mirado a ti alguna vez?"]
[Piccolo] ...
          Una vez. Me miró a mí. Pero se fue.
          Supongo que no encontró lo que buscaba en mí.

[CONTINÚA]
[Piccolo] Toma. Encontré esto cuando él pasó. Es de su abrigo.

[RAMA G — "¿Por qué me lo das a mí?"]
[Piccolo] Porque tú haces preguntas. Los otros que estuvieron aquí huyeron cuando mencioné su nombre. Tú... buscas entender. Eso te hace diferente. O más peligroso.

[RAMA H — "¿Qué significa ese símbolo grabado?"]
[Piccolo] No lo sé. Pero el hombre sin rostro también hace preguntas. Solo que las suyas... las hace con sangre.

[CIERRE]
[Piccolo] Aléjate de las partes oscuras del palacio esta noche. Hay cosas que incluso yo evito.
→ Da: botón de ópalo

[OBJETO recogido + efecto ambiental]
[Marlo 💭] He conseguido un... ¿Botón de ópalo?
[Marlo 💭] Él sabe que estás aquí.

[MARCAS EN LA PARED — examinar]
[Marlo 💭] No es el primero... hay más marcas. Muchas más.

[SUBSIGUIENTE]
[Piccolo] Ya te dije todo lo que sé. Aléjate de las sombras.
```

---

### Armería — Guardia + Rafaello (implementado hasta ahora)

```
[ENTRADA — pensamiento de Marlo]
[Marlo 💭] ¿Qué está pasando? ¿Por qué el capitán de la guardia está vigilado como un rehén?

[DIÁLOGO ESCUCHADO DESDE LAS SOMBRAS]
[Guardia]  El Comité quiere silencio, capitán. Esta noche no existió nada.
[Rafaello] Encontré el sello. Eso no puede no existir.
[Guardia]  Entregue el sello o esto se complica para usted, ¿entiende?
[Rafaello] Llevo veinte años sirviendo a este palacio.
[Guardia]  Y querrá veinte más. Piénselo.
[Rafaello] ...
[Guardia]  Bien. Haré otra ronda. Cuando vuelva, más le vale tener una respuesta.

[GUARDIA TE VE — primera vez]
[TUTORIAL] "No dejes que te vean los enemigos."

[ESTANTERÍA — examinar]
[Marlo 💭] Hay un mecanismo extraño en la madera... necesito algo que encaje.

[ESTANTERÍA — usar botón de ópalo]
[Marlo 💭] El botón de ópalo encaja perfectamente. La estantería se mueve...

[RAFAELLO LIBERADO — placeholder actual]
[Rafaello] ¿Quién eres tú? No importa... gracias.
[Rafaello] Gracias, niño. Aún no estoy listo. Vuelve pronto.
```

> ⚠️ **El árbol de diálogo completo de Rafaello está DISEÑADO pero NO implementado.** Ver sección VI.

---

## V. DETALLES ATMOSFÉRICOS IMPLEMENTADOS

- **Nota de Strappavolti** (Bodega, cuaderno): *"Eres curioso, pequeño. Eso es bueno."*
- **Marcas en pared** (Sótano, rasguños): *"No es el primero... hay más marcas. Muchas más."*
- **Armas con símbolo** (Armería): Símbolo geométrico de Strappavolti grabado y tachado en distintas armas. Uno sin tachar — coincide exactamente con el sello de lacre. (Detalle atmosférico, no bloqueante.)

---

## VI. DISEÑOS PENDIENTES DE IMPLEMENTAR 📋

### Armería — Árbol de diálogo completo con Rafaello (Paso 7)

```
[Rafaello] Tú no eres de los guardias.
[Marlo]    No. Soy Marlo. Vi lo que pasó arriba.
[Rafaello] Un niño. Por supuesto. (pausa) ¿Qué sabes exactamente?

→ A) "Vi al hombre sin rostro. Giacomo y Piccolo me hablaron de él."
→ B) "Sé que el Comité quiere silenciar el asesinato."

[Rafaello — si A] Esos dos... siguen vivos. Bien. Entonces sabes más de lo que aparentas.
[Rafaello — si B] El Comité tiene miedo. El miedo hace cosas feas a las instituciones.

[Rafaello] Esta noche encontré tres cosas en la escena del crimen.
           Solo una pertenece a él. ¿Cuál?
           A) Una moneda de oro   B) Un guante de terciopelo oscuro   C) Una pluma de carnaval

→ Falla: "No estás listo. Vuelve cuando lo sepas."
→ Acierta (B — conecta con pista de Giacomo):
[Rafaello] Lo sabías. Alguien te enseñó bien.
[Rafaello] No sé por qué confío en un niño. Pero hay algo en ti que él teme.
           Y al mismo tiempo... admira. Tómalo.
→ Da: sello de lacre
[Rafaello] Haz algo con él. Yo ya no puedo hacer nada más esta noche.
```

---

### 1-4 (return) — Escena de los padres (Paso 8)

```
[Marlo 💭] Mamá. Papá. Tengo que contarles lo que he visto.

[Marlo]  Mamá, papá. Hay algo que no cuadra. El capitán de la guardia estaba retenido.
          Encontré esto. Es una señal. El asesino aún está aquí.
[Madre]  Marlo, ya basta. Estás asustado, es normal. Fue un accidente.
[Padre]  El palacio está bajo control. Los guardias sabrán qué hacer.
[Marlo]  ¡Pero lo vi! ¡Hay un guardia corrupto, y el capitán—!
[Madre]  Marlo. Para. Ya nos vamos a casa.
[Marlo]  No me voy.
[Padre]  (pausa) ¿Qué has dicho?
[Marlo]  He dicho que no me voy. No hasta que alguien escuche.

→ Los guardias irrumpen y expulsan a todos los civiles.
→ [CUTSCENE] padres escoltados, Marlo empujado al final, puertas cerrándose.
[Marlo 💭] No terminará aquí.
```

---

### Armería (revisita) — Epílogo Capítulo 1

```
[Rafaello] Sabía que volverías.
[Marlo]    ¿Qué hago ahora?
[Rafaello] (toma una espada pequeña, la pone en las manos de Marlo)
            ¿Alguna vez has usado una?
[Marlo]    No.
[Rafaello] La necesitarás.

→ Fade a negro. Título. Fin Capítulo 1. Prompt de guardado.
```
