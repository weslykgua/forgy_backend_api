import { Exercise } from '../interfaces/Exercise'

export const exercisesDB: Exercise[] = [
  // PECHO
  {
    id: '1',
    name: 'Press de Banca',
    muscle: 'Pecho',
    video: 'https://www.youtube.com/watch?v=example1',
    description: 'Ejercicio fundamental para desarrollar el pectoral mayor y el tríceps.',
    difficulty: 'Intermedio',
    equipment: 'Barra y banco plano',
    instructions: [
      'Acuéstate sobre un banco plano, con los pies firmes en el suelo.',
      'Agarra la barra con las manos ligeramente más abiertas que el ancho de hombros.',
      'Baja la barra de forma controlada hasta la mitad del pecho.',
      'Empuja la barra hacia arriba extendiendo los brazos por completo sin bloquear codos.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Press de Banca Inclinado',
    muscle: 'Pecho',
    video: '',
    description: 'Enfocado en la porción clavicular (superior) del pecho.',
    difficulty: 'Intermedio',
    equipment: 'Mancuernas y banco inclinado',
    instructions: [
      'Ajusta el banco a una inclinación de 30 a 45 grados.',
      'Toma las mancuernas al nivel de los hombros con las palmas hacia el frente.',
      'Baja las mancuernas de forma controlada ensanchando el pecho.',
      'Empuja el peso hacia arriba verticalmente hasta juntarlas arriba sin chocarlas.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Aperturas con Mancuernas',
    muscle: 'Pecho',
    video: '',
    description: 'Aislamiento para máxima contracción y estiramiento del pectoral.',
    difficulty: 'Principiante',
    equipment: 'Mancuernas y banco plano',
    instructions: [
      'Acuéstate sobre el banco plano sosteniendo las mancuernas sobre tu pecho.',
      'Baja los brazos en un arco amplio hacia los lados, manteniendo codos semiflexionados.',
      'Siente el estiramiento en el pectoral en la parte inferior del arco.',
      'Junta las mancuernas arriba recreando el mismo arco amplio.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Fondos en Paralelas',
    muscle: 'Pecho',
    video: '',
    description: 'Ejercicio de peso corporal excelente para el pecho inferior y tríceps.',
    difficulty: 'Intermedio',
    equipment: 'Barras paralelas',
    instructions: [
      'Sujétate en las barras paralelas con brazos extendidos.',
      'Inclina tu torso ligeramente hacia adelante para enfocar el esfuerzo en el pectoral.',
      'Baja el cuerpo flexionando los codos hasta que los hombros pasen la línea del codo.',
      'Empuja con fuerza hacia arriba para volver a la posición inicial.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Flexiones de Pecho',
    muscle: 'Pecho',
    video: '',
    description: 'Ejercicio básico y efectivo para fuerza general de empuje.',
    difficulty: 'Principiante',
    equipment: 'Ninguno (peso corporal)',
    instructions: [
      'Colócate en posición de plancha alta con las manos bajo los hombros.',
      'Mantén el abdomen y glúteos contraídos para alinear la columna.',
      'Baja doblando los codos hacia atrás en ángulo de 45° hasta rozar el suelo con el pecho.',
      'Empuja con fuerza el suelo para volver arriba manteniendo el cuerpo rígido.'
    ],
    createdAt: new Date().toISOString(),
  },

  // ESPALDA
  {
    id: '6',
    name: 'Dominadas',
    muscle: 'Espalda',
    video: '',
    description: 'El mejor ejercicio de peso corporal para desarrollar amplitud de espalda.',
    difficulty: 'Intermedio',
    equipment: 'Barra de dominadas',
    instructions: [
      'Cuelga de la barra con agarre prono (palmas al frente) más ancho que tus hombros.',
      'Inicia el movimiento retrayendo las escápulas (juntando los omóplatos).',
      'Tira de tu cuerpo hacia arriba intentando llevar la barra al pecho superior.',
      'Baja de forma controlada hasta que tus brazos queden completamente estirados.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Remo con Barra',
    muscle: 'Espalda',
    video: '',
    description: 'Ejercicio multiarticular clave para la densidad de la espalda.',
    difficulty: 'Intermedio',
    equipment: 'Barra',
    instructions: [
      'Flexiona ligeramente las rodillas e inclina el torso adelante manteniendo la espalda recta.',
      'Sujeta la barra con agarre prono y déjala colgar frente a tus espinillas.',
      'Tira de la barra hacia tu ombligo manteniendo los codos cerca del cuerpo.',
      'Baja la barra lentamente estirando por completo la espalda.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Jalón al Pecho',
    muscle: 'Espalda',
    video: '',
    description: 'Excelente constructor de dorsales usando polea.',
    difficulty: 'Principiante',
    equipment: 'Máquina de polea alta',
    instructions: [
      'Siéntate y asegura tus muslos bajo los rodillos de la máquina.',
      'Sujeta la barra con un agarre amplio y prono.',
      'Tira de la barra hacia abajo hasta la altura de tu clavícula inclinándote sutilmente.',
      'Permite que la barra suba de manera controlada estirando los dorsales.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Remo con Mancuerna',
    muscle: 'Espalda',
    video: '',
    description: 'Trabajo de tracción unilateral para corregir asimetrías.',
    difficulty: 'Principiante',
    equipment: 'Mancuerna y banco plano',
    instructions: [
      'Apoya una mano y la rodilla del mismo lado sobre el banco plano.',
      'Mantén la espalda paralela al suelo y toma la mancuerna con la mano libre.',
      'Tira de la mancuerna hacia tu cadera, elevando el codo hacia el techo.',
      'Baja la mancuerna controladamente estirando el dorsal por completo.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Peso Muerto',
    muscle: 'Espalda',
    video: '',
    description: 'Ejercicio compuesto de fuerza absoluta para toda la cadena posterior.',
    difficulty: 'Avanzado',
    equipment: 'Barra con discos',
    instructions: [
      'Párate con los pies al ancho de cadera, con la barra sobre la mitad de tu pie.',
      'Flexiona la cadera para bajar a tomar la barra manteniendo la espalda totalmente neutra.',
      'Empuja con las piernas y extiende la cadera para levantarte con la barra pegada al cuerpo.',
      'Baja controlando la barra empujando tu cadera hacia atrás hasta que toque el suelo.'
    ],
    createdAt: new Date().toISOString(),
  },

  // CUÁDRICEPS
  {
    id: '11',
    name: 'Sentadilla Trasera con Barra',
    muscle: 'Cuádriceps',
    video: '',
    description: 'El constructor de piernas definitivo, enfocado en el desarrollo de los cuádriceps.',
    difficulty: 'Intermedio',
    equipment: 'Barra y rack',
    instructions: [
      'Coloca la barra sobre la parte alta de la espalda (trapecio) y desengánchala.',
      'Separa tus pies al ancho de hombros con puntas sutilmente hacia afuera.',
      'Baja empujando las caderas atrás y doblando rodillas como si te sentaras.',
      'Desciende hasta que tus muslos estén paralelos al suelo y vuelve arriba empujando con talones.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Prensa de Piernas',
    muscle: 'Cuádriceps',
    video: '',
    description: 'Desarrollo de piernas con mínimo estrés en la zona lumbar.',
    difficulty: 'Principiante',
    equipment: 'Máquina de prensa inclinada',
    instructions: [
      'Siéntate apoyando firmemente la espalda en el respaldo.',
      'Coloca los pies en la plataforma al ancho de tus caderas.',
      'Quita los seguros y baja la plataforma doblando las rodillas a 90 grados.',
      'Empuja con fuerza la plataforma sin llegar a bloquear tus rodillas por completo.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '13',
    name: 'Extensión de Cuádriceps',
    muscle: 'Cuádriceps',
    video: '',
    description: 'Ejercicio de aislamiento puro para definir y fortalecer los cuádriceps.',
    difficulty: 'Principiante',
    equipment: 'Máquina de extensión sentado',
    instructions: [
      'Ajusta la máquina para que el rodillo descanse sobre la parte baja de tus espinillas.',
      'Apoya la espalda y sujétate de las manijas laterales.',
      'Extiende las rodillas por completo levantando el peso y contrae arriba 1 segundo.',
      'Baja el peso de regreso de manera lenta y controlada.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '14',
    name: 'Zancadas con Mancuernas',
    muscle: 'Cuádriceps',
    video: '',
    description: 'Trabajo dinámico unilateral para cuádriceps, glúteos y estabilidad.',
    difficulty: 'Principiante',
    equipment: 'Mancuernas',
    instructions: [
      'Sostén una mancuerna en cada mano con los brazos a los costados del cuerpo.',
      'Da un paso amplio al frente con una pierna.',
      'Desciende verticalmente doblando ambas rodillas hasta que la rodilla trasera casi toque el suelo.',
      'Empuja con la pierna delantera para regresar a la posición de inicio.'
    ],
    createdAt: new Date().toISOString(),
  },

  // ISQUIOS
  {
    id: '15',
    name: 'Curl de Isquios Acostado',
    muscle: 'Isquios',
    video: '',
    description: 'Aislamiento de la flexión de rodilla para desarrollar la parte trasera del muslo.',
    difficulty: 'Principiante',
    equipment: 'Máquina de curl acostado',
    instructions: [
      'Acuéstate boca abajo sobre el banco de la máquina.',
      'Coloca el rodillo acolchado justo por debajo de tus pantorrillas.',
      'Flexiona las rodillas tirando del rodillo hacia tus glúteos.',
      'Regresa las piernas a la posición estirada controlando la carga.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '16',
    name: 'Peso Muerto Rumano',
    muscle: 'Isquios',
    video: '',
    description: 'Movimiento de bisagra de cadera óptimo para estirar y fortalecer isquios e inferior de glúteos.',
    difficulty: 'Intermedio',
    equipment: 'Barra o mancuernas',
    instructions: [
      'De pie, sujeta la barra al frente de tus muslos.',
      'Manteniendo las rodillas semiflexionadas, empuja tus caderas hacia atrás.',
      'Desliza la barra por tus piernas doblando solo la cadera hasta sentir el estiramiento.',
      'Contrae los glúteos e isquiotibiales para regresar arriba extendiendo la cadera.'
    ],
    createdAt: new Date().toISOString(),
  },

  // GLÚTEOS
  {
    id: '17',
    name: 'Hip Thrust (Empuje de Cadera)',
    muscle: 'Glúteos',
    video: '',
    description: 'El mejor ejercicio de activación y desarrollo del glúteo mayor.',
    difficulty: 'Intermedio',
    equipment: 'Barra, almohadilla y banco plano',
    instructions: [
      'Apoya la parte media/alta de tu espalda sobre el borde de un banco estable.',
      'Coloca la barra acolchada sobre tu pelvis y flexiona tus rodillas apoyando talones.',
      'Empuja la cadera hacia el techo apretando los glúteos con fuerza en la parte superior.',
      'Desciende la cadera controladamente doblando la cintura sin despegar la espalda.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '18',
    name: 'Patada de Glúteo en Polea',
    muscle: 'Glúteos',
    video: '',
    description: 'Aislamiento de extensión de cadera para modelar los glúteos.',
    difficulty: 'Principiante',
    equipment: 'Polea baja y tobillera',
    instructions: [
      'Colócate la tobillera y engánchala en el mosquetón de la polea baja.',
      'Párate frente a la polea inclinando tu torso adelante y sujetándote del soporte.',
      'Patea la pierna hacia atrás de forma controlada extendiendo la cadera.',
      'Regresa la pierna al frente resistiendo el jalón de la polea.'
    ],
    createdAt: new Date().toISOString(),
  },

  // PANTORRILLAS
  {
    id: '19',
    name: 'Elevación de Talones de Pie',
    muscle: 'Pantorrillas',
    video: '',
    description: 'Desarrollo de la pantorrilla, específicamente del músculo gastrocnemio.',
    difficulty: 'Principiante',
    equipment: 'Máquina de gemelos o escalón',
    instructions: [
      'Párate con el metatarso de los pies al borde de la plataforma, talones libres.',
      'Baja los talones lentamente por debajo del nivel de la plataforma.',
      'Empuja con los dedos de los pies elevando los talones lo más alto posible.',
      'Sostén la contracción arriba 1 segundo y vuelve a bajar despacio.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '20',
    name: 'Elevación de Talones Sentado',
    muscle: 'Pantorrillas',
    video: '',
    description: 'Enfocado en el desarrollo del sóleo (músculo profundo de la pantorrilla).',
    difficulty: 'Principiante',
    equipment: 'Máquina de gemelos sentado',
    instructions: [
      'Siéntate en la máquina apoyando la almohadilla sobre tus muslos.',
      'Coloca las puntas de los pies en el soporte con los talones suspendidos.',
      'Quita el seguro elevando tus talones.',
      'Baja los talones para estirar el sóleo y sube presionando fuertemente arriba.'
    ],
    createdAt: new Date().toISOString(),
  },

  // HOMBROS
  {
    id: '21',
    name: 'Press Militar con Barra',
    muscle: 'Hombros',
    video: '',
    description: 'Ejercicio compuesto fundamental para deltoides anteriores y core.',
    difficulty: 'Intermedio',
    equipment: 'Barra y rack',
    instructions: [
      'Sujeta la barra a nivel de tus clavículas con las manos al ancho de hombros.',
      'Empuja la barra verticalmente por encima de tu cabeza esquivando tu rostro.',
      'Bloquea los brazos arriba alineando la barra con tu nuca.',
      'Baja la barra de forma controlada hasta apoyar nuevamente en tu pecho superior.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '22',
    name: 'Elevaciones Laterales',
    muscle: 'Hombros',
    video: '',
    description: 'Desarrollo lateral del deltoides para hombros anchos tridimensionales.',
    difficulty: 'Principiante',
    equipment: 'Mancuernas',
    instructions: [
      'De pie con una mancuerna en cada mano, codos sutilmente doblados.',
      'Eleva los brazos hacia los costados dibujando un arco amplio.',
      'Sube hasta que las manos queden al nivel de tus hombros (no más arriba).',
      'Desciende las mancuernas controlando la gravedad.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '23',
    name: 'Elevaciones Frontales',
    muscle: 'Hombros',
    video: '',
    description: 'Aislamiento de la cabeza anterior del hombro.',
    difficulty: 'Principiante',
    equipment: 'Mancuernas',
    instructions: [
      'De pie con las mancuernas apoyadas al frente de tus muslos.',
      'Eleva una mancuerna al frente con el brazo casi estirado.',
      'Sube hasta que quede paralelo al piso y desciende lentamente.',
      'Alterna el movimiento con el brazo contrario.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '24',
    name: 'Pájaros (Elevaciones Posteriores)',
    muscle: 'Hombros',
    video: '',
    description: 'Trabajo de deltoides posterior para equilibrio muscular y postura.',
    difficulty: 'Principiante',
    equipment: 'Mancuernas',
    instructions: [
      'Inclínate hacia adelante manteniendo el torso casi paralelo al piso y rodillas dobladas.',
      'Deja colgar las mancuernas al frente tuyo con codos semiflexionados.',
      'Eleva los brazos hacia los lados apretando la parte trasera de los hombros.',
      'Baja controladamente los brazos al centro.'
    ],
    createdAt: new Date().toISOString(),
  },

  // BÍCEPS
  {
    id: '25',
    name: 'Curl de Bíceps con Mancuernas',
    muscle: 'Bíceps',
    video: '',
    description: 'Ejercicio clásico de flexión de codo para potenciar el bíceps braquial.',
    difficulty: 'Principiante',
    equipment: 'Mancuernas',
    instructions: [
      'De pie con mancuernas a los lados y agarre neutro (palmas hacia adentro).',
      'Flexiona los codos girando la muñeca en el trayecto (supinación) para que las palmas miren arriba.',
      'Contrae el bíceps en la parte superior apretando 1 segundo.',
      'Baja controladamente girando de vuelta al agarre neutro.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '26',
    name: 'Curl de Bíceps con Barra Z',
    muscle: 'Bíceps',
    video: '',
    description: 'Desarrollo de volumen de bíceps reduciendo estrés en muñecas.',
    difficulty: 'Principiante',
    equipment: 'Barra Z y discos',
    instructions: [
      'Sujeta la barra Z en las zonas anguladas con agarre supino.',
      'Mantén los codos fijos a los costados de tu torso.',
      'Flexiona los codos llevando la barra hacia el pecho sin adelantar codos.',
      'Estira por completo los brazos controlando el descenso.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '27',
    name: 'Curl de Bíceps Martillo',
    muscle: 'Bíceps',
    video: '',
    description: 'Enfocado en braquiorradial y braquial para dar volumen lateral al brazo.',
    difficulty: 'Principiante',
    equipment: 'Mancuernas',
    instructions: [
      'Sostén las mancuernas con agarre neutro constante (como un martillo).',
      'Flexiona los codos subiendo la mancuerna sin rotar las muñecas.',
      'Llega a la contracción arriba y baja controladamente.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '28',
    name: 'Curl Concentrado',
    muscle: 'Bíceps',
    video: '',
    description: 'Aislamiento máximo que ayuda a ganar pico en el bíceps.',
    difficulty: 'Principiante',
    equipment: 'Mancuerna y banco plano',
    instructions: [
      'Siéntate al borde del banco e inclina ligeramente tu torso.',
      'Apoya el codo de la mano que tiene el peso en la cara interna del muslo.',
      'Flexiona el codo subiendo la mancuerna hacia tu rostro.',
      'Estira el codo controladamente resistiendo el peso.'
    ],
    createdAt: new Date().toISOString(),
  },

  // TRÍCEPS
  {
    id: '29',
    name: 'Extensión de Tríceps en Polea',
    muscle: 'Tríceps',
    video: '',
    description: 'Excelente para bombear y aislar las cabezas laterales y mediales del tríceps.',
    difficulty: 'Principiante',
    equipment: 'Polea alta con cuerda',
    instructions: [
      'Sujeta la cuerda y da un paso atrás, flexionando levemente el torso.',
      'Mantén los codos pegados a las costillas fijamente.',
      'Extiende los brazos empujando la cuerda hacia el suelo y separando los extremos abajo.',
      'Regresa lentamente subiendo las manos a la altura del pecho.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '30',
    name: 'Press Francés',
    muscle: 'Tríceps',
    video: '',
    description: 'Ejercicio de potencia para el tríceps, enfocado en la cabeza larga.',
    difficulty: 'Intermedio',
    equipment: 'Barra Z y banco plano',
    instructions: [
      'Acuéstate en el banco plano sosteniendo la barra con brazos estirados sobre tus hombros.',
      'Dobla los codos llevando la barra controladamente hacia tu frente o detrás de tu cabeza.',
      'Mantén los codos apuntando siempre al techo durante el recorrido.',
      'Empuja la barra extendiendo los codos por completo.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '31',
    name: 'Fondos en Banco',
    muscle: 'Tríceps',
    video: '',
    description: 'Ejercicio básico casero o de gimnasio para tríceps.',
    difficulty: 'Principiante',
    equipment: 'Banco plano',
    instructions: [
      'Apoya tus manos sobre el borde del banco a tu espalda, dedos mirando adelante.',
      'Estira las piernas frente a ti apoyándote en tus talones.',
      'Baja el cuerpo doblando los codos hacia atrás a 90 grados.',
      'Empuja con las palmas extendiendo los codos para subir.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '32',
    name: 'Patada de Tríceps',
    muscle: 'Tríceps',
    video: '',
    description: 'Aislamiento terminal para sentir la contracción máxima del tríceps.',
    difficulty: 'Principiante',
    equipment: 'Mancuerna',
    instructions: [
      'Apóyate en el banco con rodilla y mano contraria a la mancuerna.',
      'Eleva el codo del brazo libre pegándolo a tu costillar en 90 grados.',
      'Extiende el codo pateando la mancuerna hacia atrás paralelamente al suelo.',
      'Vuelve doblando el codo sin balancear el hombro.'
    ],
    createdAt: new Date().toISOString(),
  },

  // ABDOMEN
  {
    id: '33',
    name: 'Crunch Abdominal',
    muscle: 'Abdomen',
    video: '',
    description: 'Ejercicio básico de aislamiento para la sección superior de abdominales.',
    difficulty: 'Principiante',
    equipment: 'Ninguno (colchoneta)',
    instructions: [
      'Acuéstate boca arriba con rodillas dobladas y pies planos en el piso.',
      'Coloca las manos detrás de las orejas sin tirar del cuello.',
      'Contrae el abdomen elevando solo tus hombros y escápulas del suelo.',
      'Desciende de vuelta lentamente estirando la zona.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '34',
    name: 'Plancha Abdominal',
    muscle: 'Abdomen',
    video: '',
    description: 'Isométrico excelente para tonificación y resistencia del core.',
    difficulty: 'Principiante',
    equipment: 'Ninguno',
    instructions: [
      'Colócate boca abajo apoyado solo en tus antebrazos y puntas de pie.',
      'Alinea los codos verticalmente bajo tus hombros.',
      'Mantén el cuerpo recto en tabla rígida, contrayendo abdomen y glúteos.',
      'Sostén la postura estática respirando con normalidad.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '35',
    name: 'Elevación de Piernas Suspendido',
    muscle: 'Abdomen',
    video: '',
    description: 'Excelente para la fuerza del core inferior colgando de barra.',
    difficulty: 'Intermedio',
    equipment: 'Barra de tracción',
    instructions: [
      'Cuélgate de la barra de dominadas con brazos estirados.',
      'Manteniendo las piernas juntas, elévalas al frente controlando la inercia.',
      'Sube hasta formar ángulo de 90° con tu torso o más arriba.',
      'Baja las piernas lentamente evitando balancear el cuerpo.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '36',
    name: 'Giro Ruso (Russian Twist)',
    muscle: 'Abdomen',
    video: '',
    description: 'Rotación de core excelente para oblicuos.',
    difficulty: 'Principiante',
    equipment: 'Ninguno o disco/mancuerna',
    instructions: [
      'Siéntate inclinando tu torso a 45 grados y despega los pies sutilmente.',
      'Une tus manos al frente con o sin peso adicional.',
      'Gira tu torso lentamente de lado a lado llevando tus manos al piso lateral.',
      'Mantén la estabilidad y el abdomen contraído.'
    ],
    createdAt: new Date().toISOString(),
  },

  // ANTEBRAZOS
  {
    id: '37',
    name: 'Curl de Antebrazos con Barra',
    muscle: 'Antebrazos',
    video: '',
    description: 'Enfocado en fortalecer los flexores de la muñeca y el agarre.',
    difficulty: 'Principiante',
    equipment: 'Barra plana y banco',
    instructions: [
      'Siéntate y apoya los antebrazos sobre tus muslos con las muñecas sobresaliendo.',
      'Toma la barra con agarre supino (palmas hacia arriba).',
      'Dobla las muñecas hacia arriba levantando la barra de manera aislada.',
      'Baja la barra extendiendo la muñeca por completo y abriendo ligeramente dedos.'
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '38',
    name: 'Curl Inverso con Barra',
    muscle: 'Antebrazos',
    video: '',
    description: 'Enfocado en el braquiorradial y los extensores de muñeca.',
    difficulty: 'Principiante',
    equipment: 'Barra plana o barra Z',
    instructions: [
      'De pie, toma la barra con agarre prono (palmas hacia el piso).',
      'Mantén los codos pegados a los costados del cuerpo.',
      'Flexiona los codos levantando la barra por el frente.',
      'Desciende la barra lentamente resistiendo el peso.'
    ],
    createdAt: new Date().toISOString(),
  },

  // ADUCTORES
  {
    id: '39',
    name: 'Aductores en Máquina',
    muscle: 'Aductores',
    video: '',
    description: 'Ejercicio de aislamiento para fortalecer la cara interna del muslo.',
    difficulty: 'Principiante',
    equipment: 'Máquina de aductores',
    instructions: [
      'Siéntate con las piernas abiertas apoyadas en las almohadillas.',
      'Contrae la cara interna de los muslos para cerrar las piernas juntándolas al centro.',
      'Sostén la contracción 1 segundo en el centro.',
      'Abre las piernas lentamente resistiendo la carga de la máquina.'
    ],
    createdAt: new Date().toISOString(),
  },

  // TRAPECIO
  {
    id: '40',
    name: 'Encogimientos de Hombros con Mancuernas',
    muscle: 'Trapecio',
    video: '',
    description: 'Aislamiento clásico para desarrollar la porción superior del trapecio.',
    difficulty: 'Principiante',
    equipment: 'Mancuernas',
    instructions: [
      'De pie con una mancuerna en cada mano colgando a los costados.',
      'Eleva los hombros verticalmente hacia las orejas lo más alto posible sin doblar codos.',
      'Aprieta los trapecios arriba durante 1 segundo.',
      'Desciende los hombros lentamente a la posición inicial.'
    ],
    createdAt: new Date().toISOString(),
  }
]
