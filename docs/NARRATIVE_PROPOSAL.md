- Descubrimiento de pistas : Marlo necesita encontrar pistas cruciales en el cuerpo o en la escena del crimen para avanzar en la investigación.
- Enfoque del villano : El interés de Strappavolti en Marlo debería traducirse en una interacción o puesta a prueba más directa, aumentando la tensión narrativa. Strappavolti pone a prueba a Marlo para comprender los límites de su pureza/inocencia. Marlo se convierte en el objetivo del Villano porque Marlo se acerca.
- Conflicto entre el gobierno y la ciudadanía : La defensa por parte del gobierno de una "investigación sobre la confianza" y la exigencia de "verdad" por parte de la ciudadanía probablemente generen una fricción más significativa.
- Podrían surgir redes de apoyo emocional : algunos ciudadanos o compañeros podrían empezar a apoyar o seguir la investigación de Marlo de forma encubierta.
- El misterio de la relación se va revelando gradualmente: La conexión entre Marlo y Strappavolti requiere desvelar paso a paso un vínculo indefinido entre ellos que podría ser el de gemelos o algún otro tipo de relación.
- Equilibrio del enfoque narrativo: Para evitar perder el control, si bien es necesario profundizar en la historia personal de Marlo, también es preciso mantener la visibilidad de los principales acontecimientos a través del progreso de la investigación oficial y del Comité Ciudadano (filenccianos), evitando que la narrativa se fragmente por completo.
- Conclusión actual (modificable hasta conseguir ciclo narrativo de 8 etapas de Dan Harmon): La historia debería seguir un camino donde "una investigación personal desencadena repercusiones sociales, al tiempo que coloca al individuo en una situación más peligrosa ". La inocencia y la empatía de Marlo son a la vez una fuerza motriz y una debilidad, lo que lo lleva no solo a desafiar al asesino en su búsqueda de la verdad, sino también a descubrir estructuras de poder ocultas o secretos dentro de la ciudad, elevando así su aventura personal a un cuestionamiento de la "seguridad" y la "verdad" de Filance.

Proposed plan for now:
Plan: Narrative Content for Bodega, Sotano, Armeria (Dan Harmon Steps 5-8)

 Context

 Scenes 1-0 through 1-4 cover Dan Harmon steps 1-4. The three post-murder exploration scenes (Bodega, Sotano, Armeria) are structurally complete but narratively  
 empty — no NPCs, no clues, no tension. This plan adds the content that drives steps 5-8: a witness, a hidden child, a conflicted guard, and Strappavolti's first
  direct acknowledgment of Marlo.

 ---
 Narrative Design

 ┌──────────────────┬────────────┬──────────────────────────────────────┬──────────────────────────┬─────────────────────┐
 │      Scene       │    Step    │               Beat                   │           NPC            │      Key Item       │
 ├──────────────────┼────────────┼──────────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ Bodega           │ 5 – Find   │ "El testigo asustado"                │ Giacomo (cellarer)       │ trozo de terciopelo │
 ├──────────────────┼────────────┼──────────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ Sotano           │ 6 – Take   │ "El santuario oscuro"                │ Piccolo (street child)   │ botón de ópalo      │
 ├──────────────────┼────────────┼──────────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ Armeria          │ 7 – Return │ "La prueba silenciada" (stealth+test)│ Rafaello + Guardia corr. │ sello de lacre      │
 ├──────────────────┼────────────┼──────────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ 1-4 (return)     │ 8 – Change │ Padres no creen a Marlo, expulsión   │ Madre, Padre             │ —                   │
 ├──────────────────┼────────────┼──────────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ Armeria (return) │ Epílogo    │ Rafaello da espada. Fin Capítulo 1.  │ Rafaello                 │ espada pequeña      │
 └──────────────────┴────────────┴──────────────────────────────────────┴──────────────────────────┴─────────────────────┘

 Clue chain logic: todasPistasRecogidas = terciopeloRecogido && botonRecogido && selloRecogido
 When all three are collected and Marlo returns to Scene_1-4, parents dialogue triggers → guards expel everyone.

 NPC Sprites (placeholders): colored this.add.rectangle() — Giacomo=brown, Piccolo=small gray, Rafaello=blue, Guardia corrupto=dark red.

 ---
 Dialogue Content

 Giacomo (Bodega, 6 lines)

 [Marlo]    ¿Hay alguien ahí escondido?
 [Giacomo]  ¡Chist! Baja la voz, niño. Hay oídos en todas partes.
 [Giacomo]  Estaba aquí cuando ocurrió. Vi a un hombre sin rostro bajar horas antes.
 [Giacomo]  Llevaba algo envuelto en terciopelo. Pesado. No sé qué era.
 [Giacomo]  Si te vio hablar conmigo, estamos perdidos. Toma esto.
 [Giacomo]  Y aléjate de las sombras. No todas las máscaras se llevan en el rostro.
 → Da: trozo de terciopelo

 Piccolo (Sotano, 6 lines + atmospheric flicker)

 [Marlo]    ¿Eres tú quien vive aquí abajo?
 [Piccolo]  A veces. Es más seguro que arriba durante el carnaval.
 [Piccolo]  Conozco cada pasillo de este palacio. Lo he visto muchas veces.
 [Piccolo]  Al hombre sin rostro. Baja aquí. No busca dinero.
 [Piccolo]  Busca algo de dentro de las personas. Algo que no se puede ver.
 [Piccolo]  Toma. Encontré esto cuando él pasó. Es de su abrigo.
 → Da: botón de ópalo → luces parpadean → "Él sabe que estás aquí."

 Rafaello (Armeria) — DISEÑO ACTUALIZADO (reemplaza el script original de 7 líneas)

 --- MECÁNICA PREVIA AL DIÁLOGO ---
 Marlo thought on entry: "¿Qué está pasando? ¿Por qué el capitán de la guardia está vigilado como un rehén?"

 Guardia corrupto patrulla la sala. Si ve a Marlo → atrapado (fade + mensaje, primera vez: tutorial "No dejes que te vean los enemigos" + respawn en último guardado).

 Diálogo escuchado desde las sombras (Marlo oye sin ser visto):

 [Guardia]  El Comité quiere silencio, capitán. Esta noche no existió nada.
 [Rafaello] Encontré el sello. Eso no puede no existir.
 [Guardia]  Entregue el sello o esto se complica para usted, ¿entiende?
 [Rafaello] Llevo veinte años sirviendo a este palacio.
 [Guardia]  Y querrá veinte más. Piénselo.
 [Rafaello] ...
 [Guardia]  Bien. Haré otra ronda. Cuando vuelva, más le vale tener una respuesta.

 El guardia pasa por una puerta secreta en la estantería. La puerta puede abrirse con uno de los objetos recogidos (botón de ópalo — el símbolo coincide con la cerradura). Marlo libera a Rafaello del alcoba sellada.

 --- DIÁLOGO CON RAFAELLO (árbol de decisiones, similar profundidad a Piccolo) ---

 [Rafaello] Tú no eres de los guardias.
 [Marlo]    No. Soy Marlo. Vi lo que pasó arriba.
 [Rafaello] Un niño. Por supuesto. (pausa) ¿Qué sabes exactamente?

 → Opciones:
   A) "Vi al hombre sin rostro. Giacomo y Piccolo me hablaron de él."
   B) "Sé que el Comité quiere silenciar el asesinato."

 [Rafaello responde A] Esos dos... siguen vivos. Bien. Entonces sabes más de lo que aparentas.
 [Rafaello responde B] El Comité tiene miedo. El miedo hace cosas feas a las instituciones.

 [Rafaello] Bien. Necesito saber una cosa antes de confiar en ti.
             Esta noche encontré tres cosas en la escena del crimen.
             Solo una pertenece a él. ¿Cuál?
             A) Una moneda de oro   B) Un guante de terciopelo oscuro   C) Una pluma de carnaval

 → Si falla: "No estás listo. Vuelve cuando lo sepas." Rafaello cierra la conversación.
 → Si acierta (B — conecta con pista de Giacomo):

 [Rafaello] Lo sabías. Alguien te enseñó bien.
 [Rafaello] No sé por qué confío en un niño. Pero hay algo en ti que él teme.
             Y al mismo tiempo... admira. Tómalo.
 → Da: sello de lacre
 [Rafaello] Haz algo con él. Yo ya no puedo hacer nada más esta noche.

 --- MECÁNICA EXTRA (exploración previa al diálogo) ---
 En las armas de la armería hay símbolos geométricos (la cara de Strappavolti) grabados y tachados.
 Hay uno sin tachar — coincide exactamente con el sello. (Detalle atmosférico, no bloqueante.)

 ---

 Bodega second note (near Sotano stairs, Strappavolti planted it):
 "Eres curioso, pequeño. Eso es bueno."

 Sotano wall symbols (interactive scratch marks):
 Marlo thought: "No es el primero... hay más marcas. Muchas más."

 ---

 Escena 1-4 return (Step 8 — La ciudad que no escucha)

 Marlo thought on entry: "Mamá. Papá. Tengo que contarles lo que he visto."

 [Marlo]   Mamá, papá. Hay algo que no cuadra. El capitán de la guardia estaba retenido.
            Encontré esto. Es una señal. El asesino aún está aquí.
 [Madre]   Marlo, ya basta. Estás asustado, es normal. Fue un accidente.
 [Padre]   El palacio está bajo control. Los guardias sabrán qué hacer.
 [Marlo]   ¡Pero lo vi! ¡Hay un guardia corrupto, y el capitán—!
 [Madre]   Marlo. Para. Ya nos vamos a casa.
 [Marlo]   No me voy.
 [Padre]   (pausa) ¿Qué has dicho?
 [Marlo]   He dicho que no me voy. No hasta que alguien escuche.

 → Los guardias irrumpen y expulsan a todos los civiles del palacio.
 → Imagen pixel art: padres siendo escoltados, Marlo empujado al final, puertas cerrándose.
 → Marlo thought al cerrar las puertas: "No terminará aquí."

 ---

 Armeria (revisita — epílogo Capítulo 1)

 Rafaello espera junto al armero, libre, tranquilo.

 [Rafaello] Sabía que volverías.
 [Marlo]    ¿Qué hago ahora?
 [Rafaello] (toma una espada pequeña, la pone en las manos de Marlo)
             ¿Alguna vez has usado una?
 [Marlo]    No.
 [Rafaello] La necesitarás.

 → Fade a negro. Título. Fin Capítulo 1. Prompt de guardado.
