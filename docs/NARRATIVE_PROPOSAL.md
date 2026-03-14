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

 ┌─────────┬────────────┬─────────────────────────────────┬──────────────────────────┬─────────────────────┐
 │  Scene  │    Step    │              Beat               │           NPC            │      Key Item       │
 ├─────────┼────────────┼─────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ Bodega  │ 5 – Find   │ "El testigo asustado"           │ Giacomo (cellarer)       │ trozo de terciopelo │
 ├─────────┼────────────┼─────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ Sotano  │ 6 – Take   │ "El santuario oscuro"           │ Piccolo (street child)   │ botón de ópalo      │
 ├─────────┼────────────┼─────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ Armeria │ 7 – Return │ "La prueba silenciada"          │ Rafaello (guard captain) │ sello de lacre      │
 ├─────────┼────────────┼─────────────────────────────────┼──────────────────────────┼─────────────────────┤
 │ 1-4     │ 8 – Change │ Strappavolti silhouette appears │ —                        │ —                   │
 └─────────┴────────────┴─────────────────────────────────┴──────────────────────────┴─────────────────────┘

 Clue chain logic: todasPistasRecogidas = tercioPeloRecogido && botonRecogido && selloRecogido
 When all three are collected and Marlo returns to Scene_1-4, Strappavolti's silhouette appears briefly across the hall.

 NPC Sprites (placeholders): colored this.add.rectangle() — Giacomo=brown, Piccolo=small gray, Rafaello=blue.

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

 Rafaello (Armeria, 7 lines)

 [Marlo]    ¿Es usted el capitán?
 [Rafaello] Y tú no deberías estar aquí, niño.
 [Rafaello] Tengo órdenes. El asesinato fue un accidente. Eso es lo que debo decir.
 [Rafaello] ...Pero lo encontré en la escena. Este sello.
 [Rafaello] Un símbolo. Una cara geométrica. Me ordenaron destruirlo.
 [Rafaello] No pude. Hay cosas que un hombre de honor no puede destruir.
 [Rafaello] Tómalo. Haz algo con él. Yo ya no puedo hacer nada más.
 → Da: sello de lacre

 Bodega second note (near Sotano stairs, Strappavolti planted it):
 "Eres curioso, pequeño. Eso es bueno."

 Sotano wall symbols (interactive scratch marks):
 Marlo thought: "No es el primero... hay más marcas. Muchas más."

 Step 8 Marlo thought (after silhouette):
 "El asesino aún está aquí. Me ha estado observando todo el tiempo."
