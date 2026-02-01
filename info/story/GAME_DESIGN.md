# Filanccia - Documento de Diseño

> **Nota:** Este documento organiza la información de GAME_STORY.md. El archivo original se conserva como referencia del brainstorming.

---

## 1. Personajes

### Protagonista

| Campo | Detalle |
|-------|---------|
| **Nombre** | Marlo |
| **Edad** | 12 años |
| **Apariencia** | Presencia suave, inocente, mirada serena |
| **Rol** | Único personaje jugable |
| **Representa** | La inocencia pura, la empatía |
| **Motivación** | Siente la necesidad de investigar el asesinato, no puede quedarse quieto |

### Antagonista

| Campo | Detalle |
|-------|---------|
| **Nombre** | Strappavolti ("Arranca-caras") |
| **Característica** | No siente emociones, quiere sentir |
| **Interés en Marlo** | Le atrae su empatía; mientras todos huyen, Marlo se acerca |
| **Método** | Pone a prueba a Marlo matando más personas |
| **Conexión con Marlo** | Por definir (¿gemelos? ¿otra relación?) |

### NPCs

| Personaje | Descripción | Función |
|-----------|-------------|---------|
| **Alcalde** | Líder de Filanccia, padre de la víctima | Da discursos, anuncia heredero, sufre la pérdida |
| **Hijo del Alcalde** | 12 años (misma edad que Marlo) | **LA VÍCTIMA** - Muere sin rostro tras ser anunciado como heredero |
| **Padres de Marlo** | Asisten al festival | Quieren irse tras el asesinato |
| **Carabinieri** | Policía italiana | Dispersan multitud, investigan |

---

## 2. Ambientación

### La Ciudad

- **Nombre:** Filanccia
- **Inspiración:** Venecia barroca
- **Evento:** Centenario de la fundación + Carnaval de máscaras

### Localizaciones

| Lugar | Descripción | Escenas |
|-------|-------------|---------|
| Casa de Marlo | Incluye baño con espejo | Escena inicial |
| Plaza Central | Donde el Alcalde da el discurso inaugural | Inicio del festival |
| Palacio de la Alcaldía | Hall para el Ballo Mascherato | Baile, brindis, asesinato |

### Atmósfera

- Todos llevan máscaras y vestimenta festiva
- Ambiente de celebración que se torna en horror
- Contraste entre la festividad y la tragedia

---

## 3. Estructura Narrativa

> Basada en el Círculo de Dan Harmon (8 pasos)

| # | Paso | Estado | Contenido |
|---|------|--------|-----------|
| 1 | Zona de confort | ✅ | Marlo en casa, preparándose |
| 2 | Deseo/Necesidad | ✅ | Asiste al festival con sus padres |
| 3 | Situación desconocida | ✅ | El hijo del Alcalde es asesinado |
| 4 | Adaptación | ✅ | Marlo decide investigar solo |
| 5 | Obtiene lo que quería | ❓ | Encuentra pistas / confronta al villano |
| 6 | Paga un precio | ❓ | Consecuencias de investigar |
| 7 | Regresa cambiado | ❓ | ¿Pierde inocencia? ¿Redime al villano? |
| 8 | Nueva normalidad | ❓ | Desenlace |

---

## 4. Secuencia de Escenas

### Parte 1

#### Escena 1-0: Casa de Marlo - Baño
```
[UBICACIÓN]: Casa de Marlo - cuarto de baño (Mapa Tiled ya está cargado)

</Fade in>
(Marlo frente al espejo, mirando adelante)
</Pausa 2 seg>

(Madre de Marlo aparece en la entrada)

{Madre}: ¡Marlo! ¡Llegamos tarde, date prisa!

(Marlo se da la vuelta)

(La madre sale del lugar)

{Marlo}: ¡Ya voy! ¡Ya estoy listo!

(Marlo vuelve a mirar al espejo)

<Subescena: Cinemática - Zoom-in temporal hacia Marlo mirando al espejo
![como en este ejemplo](./info/story/media-ref/000.webp) >


(Marlo se coloca su máscara para el carnaval)

</Subescena>

=== GAMEPLAY ===
(El jugador puede mover a Marlo por el mapa)
(Objetivo. Salir del lugar para pasar a la siguiente escena)

</Fade out>
```

#### Escena 1-1: Camino a la Plaza
```
[UBICACIÓN]: Calles de Filanccia

</Fade in>

(Marlo camina con sus padres, detrás de ellos, hacia la plaza)
<Parallax vertical hacia arriba>

[Por definir: diálogos opcionales, ambientación]
[NOTA: Los NPCs del fondo NO deben cruzarse con la familia de Marlo]

</Fade out>
```

#### Escena 1-2: Plaza Central
```
</Fade in>

[UBICACIÓN]: Plaza Central de Filanccia

(Multitud rodea el centro de la plaza)
(El Alcalde está en el centro dando el discurso)

{Alcalde}: ¡Bienvenidos, queridos filenccianos! Hoy celebramos
el centenario de nuestra ciudad...

{Alcalde}: ¡QUE COMIENCE EL CARNAVAL!

</Fade out>
```

#### Escena 1-3: Palacio de la Alcaldía - Hall
```
[UBICACIÓN]: Hall del Palacio de la Alcaldía

</Fade in>

(Ballo Mascherato - todos los enmascarados bailan)
(Los músicos tocan la orquesta [POR DEFINIR POSICIÓN])
[Por definir: detalles del baile, interacciones]

(La orquesta finaliza y el baile se detiene lentamente)

{Alcalde}: (Brindis) Queridos ciudadanos, hoy no solo celebramos
el centenario de Filanccia... También anuncio que mi hijo
[NOMBRE POR DEFINIR] me sucederá en el cargo.

(El hijo del Alcalde es presentado ante la multitud)

</Fade out>
```

#### Escena 1-4: El Asesinato
```
[UBICACIÓN]: Palacio de la Alcaldía - Hall

(Multitud horrorizada forma círculo alrededor del cuerpo)

{Ciudadano 1}: ¡Ha muerto!
{Ciudadano 2}: ¡No es posible!
{Ciudadano 3}: ¡Por Dios!
{Ciudadano 4}: ¡No tiene rostro!

[NOTA: La víctima es el hijo del Alcalde, recién anunciado como heredero]

(Los carabinieri intervienen, dispersan a la población)
(Se acercan al cadáver sin rostro)

{Padre/Madre de Marlo}: Tenemos que movernos, Marlo. Vamos a irnos.

{Marlo}: Vale, pero dame un segundo, tengo que coger una cosa.

[Pensamiento de Marlo]: "No... necesito ver eso."

=== GAMEPLAY ===
(El jugador puede mover a Marlo por el mapa entero del Palacio de la Alcaldía)
(Objetivo: acercarse al cadáver, encontrar pistas)
```

---

## 5. Temas y Conceptos

### Tema Central
**Inocencia vs. Vacío emocional**

| Marlo | Strappavolti |
|-------|--------------|
| Siente empatía | No siente nada |
| Inocente | Busca sentir |
| Se acerca al horror | Causa el horror |
| Quiere entender | Quiere ser entendido (?) |

### La Víctima: Simbolismo

El hijo del Alcalde representa la **inocencia destruida**:
- Tiene 12 años, igual que Marlo (son espejos)
- Iba a cargar con responsabilidad de adulto (heredar el cargo)
- Es la primera víctima de Strappavolti
- Su muerte ocurre en el momento de mayor celebración

### Subtemas

- **La empatía como diferenciador:** Marlo es único porque sufre por otros
- **Dos destinos de la inocencia:** El hijo del Alcalde (destruida) vs. Marlo (¿preservada?)
- **Curiosidad vs. Miedo:** Mientras todos huyen, Marlo investiga

### La Atracción del Villano

Strappavolti nota algo especial en Marlo:
- Todos los demás están aterrados y quieren huir
- Marlo se acerca, sufre, quiere entender
- Esto lo convierte en objetivo del villano
- El villano no va directo a por él: lo "prueba" con más asesinatos

---

## 6. Mecánicas de Juego

### Confirmadas
- **Exploración:** Marlo puede moverse por mapas (top-down)
- **Diálogos:** Sistema de conversaciones con NPCs
- **Cinemáticas:** Escenas con transiciones y animaciones

### Por Desarrollar
- **Sistema de pistas (breadcrumbs):** El jugador encuentra pistas para deducir
- **Reacciones emocionales:** Sprites de Marlo reaccionando (sufriendo, pensando)
- **Investigación:** Mecánica para examinar escenas/objetos

---

## 7. Preguntas Pendientes

### Sobre la Historia
- [ ] ¿Cuál es la conexión entre Marlo y Strappavolti?
- [ ] ¿Por qué Strappavolti mata al hijo del Alcalde primero?
- [ ] ¿El villano mata más personas? ¿Cuántas? ¿A quiénes?
- [ ] ¿Cómo termina la historia?
- [ ] ¿Nombre del hijo del Alcalde?

### Sobre el Gameplay
- [ ] ¿Qué pistas encuentra Marlo y dónde?
- [ ] ¿Hay consecuencias por las decisiones del jugador?
- [ ] ¿Existen múltiples finales?
- [ ] ¿Hay enfrentamiento directo con el villano?

---

## 8. Guía de Formato del Guión

```
[] = Contexto / Ubicación / Instrucciones
</> = Efectos o transiciones
{} = Quién habla en un diálogo
() = Acciones / Descripciones
=== === = Inicio de gameplay
[Pensamiento] = Voz interna del personaje
```

---

*Última actualización: Enero 2026*
