export const COLOR_FACTS = [
  "Los seres humanos pueden distinguir unos 10 millones de colores.",
  "El color amarillo es el primero que procesa el ojo humano.",
  "Las mujeres suelen ser más hábiles para distinguir diferentes tonos de rojo.",
  "El daltonismo es mucho más común en hombres que en mujeres.",
  "El azul es el color favorito de la mayoría de la población mundial.",
  "Los toros no odian el rojo; son daltónicos y reaccionan al movimiento de la capa.",
  "El color rosa tiene un efecto calmante y reduce la agresividad.",
  "Originalmente, el color naranja se llamaba simplemente 'rojo-amarillo' en Europa.",
  "Las abejas pueden ver colores ultravioletas que son invisibles para nosotros.",
  "El color más raro de ojos en el mundo es el verde."
];

export const FEEDBACK_MESSAGES = {
  PERFECT: [
    "¿Eres un camarón mantis?",
    "Visión biónica detectada. ¿Eres de este planeta?",
    "¿Tu padre es una guía Pantone? Porque esto es perfecto.",
    "Precisión quirúrgica. Ni un píxel fuera de lugar.",
    "Nivel: Maestro del Color. Ya puedes retirarte.",
    "Huele a trampas... o a un genio de la óptica.",
    "Tu cerebro procesa los colores mejor que un monitor de 2000$.",
    "Básicamente eres Superman con un pincel.",
    "¿Ves todos los colores o solo los que quieres?",
    "Directo al museo de la perfección."
  ],
  GREAT: [
    "Impresionante puntería. Me tienes celoso.",
    "Tienes buen ojo, literalmente. Casi me ganas.",
    "Casi perfecto. Te faltó medio segundo de meditación.",
    "Tu cerebro procesa bien los fotones, sigue así.",
    "Excelente dominio. Si fueras un color, serías RGB(255, 255, 255).",
    "Estás a un paso de la divinidad cromática.",
    "Sutil, preciso, elegante. Casi digno de mí.",
    "Muy cerca. ¿Escuchaste el color antes de verlo?",
    "Tu retina es un sensor de alta precisión.",
    "No está mal para ser un humano."
  ],
  GOOD: [
    "Nada mal, nada mal. Superaste el promedio.",
    "Estás en el promedio premium. Felicidades.",
    "Un poco más de brillo y lo tenías. Casi, casi.",
    "Buen intento, vas por buen camino (si no te pierdes).",
    "Sólido, pero mi abuela daltónica lo hace mejor.",
    "Hay talento, solo falta... bueno, todo lo demás.",
    "Aceptable. No me das ganas de llorar (todavía).",
    "Lo captaste... pero de perfil.",
    "No está mal, pero a un artista le daría un infarto.",
    "Resultado decente. No te emociones mucho."
  ],
  MEH: [
    "Podría ser peor, supongo. Podrías no tener ojos.",
    "Casi... pero no tanto. Un 'casi' muy generoso.",
    "Necesitas calibrar esos ojos, están en modo 480p.",
    "Aceptable, pero aburrido. Dame algo con pasión.",
    "Ni fu ni fa. Eres el arroz blanco de los colores.",
    "Mi monitor CRT de 1995 tiene mejor contraste que tú.",
    "Bueno, al menos lo intentaste (creo).",
    "¿Estás adivinando o solo haciendo clic por deporte?",
    "Mediocre con ganas. Pero hey, la vida sigue.",
    "Un error de redondeo visual."
  ],
  POOR: [
    "¿Tenías los ojos abiertos? Pregunto en serio.",
    "Tal vez el modo blanco y negro sea lo tuyo. O el braille.",
    "Eso no estuvo ni cerca. Estás a kilómetros de la realidad.",
    "El daltonismo es una opción válida aquí. Te la concedo.",
    "Vuelve a intentarlo, por favor. Por el bien de la humanidad.",
    "¿Estabas mirando el teléfono mientras jugabas?",
    "Me duelen los ojos solo de ver tu selección.",
    "Espectáculo lamentable. Ni un ciego fallaría por tanto.",
    "¿Confundes el rojo con el universo? Revísate.",
    "Error 404: Visión no encontrada."
  ]
};

export const getFeedbackForScore = (score) => {
  let category;
  if (score >= 9.5) category = 'PERFECT';
  else if (score >= 8.5) category = 'GREAT';
  else if (score >= 7.0) category = 'GOOD';
  else if (score >= 4.0) category = 'MEH';
  else category = 'POOR';
  
  const messages = FEEDBACK_MESSAGES[category];
  return messages[Math.floor(Math.random() * messages.length)];
};
