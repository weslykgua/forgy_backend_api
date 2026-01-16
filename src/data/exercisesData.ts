import { Exercise } from "../interfaces/Exercise";

export const exercisesDB: Exercise[] = [
    // PECHO
    {
        id: '1',
        name: 'Press Banca',
        muscle: 'Pecho',
        video: 'https://www.youtube.com/watch?v=example1',
        description: 'Ejercicio fundamental para desarrollar el pecho',
        difficulty: 'Intermedio',
        equipment: 'Barra y banco',
        instructions: ['Acuéstate en el banco', 'Agarra la barra con las manos separadas', 'Baja la barra al pecho', 'Empuja hacia arriba'],
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Press Inclinado',
        muscle: 'Pecho',
        video: '',
        description: 'Enfocado en la parte superior del pecho',
        difficulty: 'Intermedio',
        equipment: 'Mancuernas y banco inclinado',
        instructions: ['Ajusta el banco a 30-45 grados', 'Toma las mancuernas', 'Baja controladamente', 'Empuja hacia arriba'],
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Aperturas con Mancuernas',
        muscle: 'Pecho',
        video: '',
        description: 'Estiramiento y contracción máxima del pecho',
        difficulty: 'Principiante',
        equipment: 'Mancuernas y banco',
        instructions: ['Acuéstate en el banco', 'Brazos extendidos con mancuernas', 'Abre los brazos en arco', 'Junta las mancuernas arriba'],
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        name: 'Fondos en Paralelas',
        muscle: 'Pecho',
        video: '',
        description: 'Ejercicio de peso corporal para pecho inferior',
        difficulty: 'Intermedio',
        equipment: 'Barras paralelas',
        instructions: ['Agarra las barras', 'Inclínate hacia adelante', 'Baja flexionando codos', 'Sube hasta extender brazos'],
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Flexiones',
        muscle: 'Pecho',
        video: '',
        description: 'Clásico ejercicio de peso corporal',
        difficulty: 'Principiante',
        equipment: 'Ninguno',
        instructions: ['Posición de plancha', 'Manos al ancho de hombros', 'Baja el pecho al suelo', 'Empuja hacia arriba'],
        createdAt: new Date().toISOString()
    },
    // ESPALDA
    {
        id: '6',
        name: 'Peso Muerto',
        muscle: 'Espalda',
        video: '',
        description: 'Ejercicio compuesto para espalda baja y piernas',
        difficulty: 'Avanzado',
        equipment: 'Barra',
        instructions: ['Párate frente a la barra', 'Agarra con agarre mixto', 'Levanta manteniendo espalda recta', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '7',
        name: 'Dominadas',
        muscle: 'Espalda',
        video: '',
        description: 'El mejor ejercicio para espalda ancha',
        difficulty: 'Intermedio',
        equipment: 'Barra de dominadas',
        instructions: ['Agarra la barra', 'Cuelga con brazos extendidos', 'Sube hasta que la barbilla pase la barra', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '8',
        name: 'Remo con Barra',
        muscle: 'Espalda',
        video: '',
        description: 'Desarrollo de grosor en la espalda',
        difficulty: 'Intermedio',
        equipment: 'Barra',
        instructions: ['Inclínate 45 grados', 'Agarra la barra', 'Tira hacia el abdomen', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '9',
        name: 'Jalón al Pecho',
        muscle: 'Espalda',
        video: '',
        description: 'Alternativa a dominadas en polea',
        difficulty: 'Principiante',
        equipment: 'Máquina de polea alta',
        instructions: ['Siéntate en la máquina', 'Agarra la barra ancha', 'Tira hacia el pecho', 'Regresa controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '10',
        name: 'Remo con Mancuerna',
        muscle: 'Espalda',
        video: '',
        description: 'Trabajo unilateral de espalda',
        difficulty: 'Principiante',
        equipment: 'Mancuerna y banco',
        instructions: ['Apoya rodilla y mano en banco', 'Toma mancuerna con otra mano', 'Tira hacia la cadera', 'Baja estirando'],
        createdAt: new Date().toISOString()
    },
    // PIERNAS
    {
        id: '11',
        name: 'Sentadilla',
        muscle: 'Piernas',
        video: '',
        description: 'El rey de los ejercicios para piernas',
        difficulty: 'Intermedio',
        equipment: 'Barra y rack',
        instructions: ['Coloca la barra sobre los hombros', 'Separa los pies al ancho de hombros', 'Baja flexionando rodillas', 'Sube empujando con los talones'],
        createdAt: new Date().toISOString()
    },
    {
        id: '12',
        name: 'Prensa de Piernas',
        muscle: 'Piernas',
        video: '',
        description: 'Desarrollo de cuádriceps con soporte',
        difficulty: 'Principiante',
        equipment: 'Máquina de prensa',
        instructions: ['Siéntate en la máquina', 'Coloca pies en la plataforma', 'Baja flexionando rodillas', 'Empuja sin bloquear'],
        createdAt: new Date().toISOString()
    },
    {
        id: '13',
        name: 'Zancadas',
        muscle: 'Piernas',
        video: '',
        description: 'Trabajo unilateral de piernas y glúteos',
        difficulty: 'Principiante',
        equipment: 'Mancuernas (opcional)',
        instructions: ['De pie, da un paso adelante', 'Baja hasta que ambas rodillas formen 90°', 'Empuja para volver', 'Alterna piernas'],
        createdAt: new Date().toISOString()
    },
    {
        id: '14',
        name: 'Extensión de Cuádriceps',
        muscle: 'Piernas',
        video: '',
        description: 'Aislamiento de cuádriceps',
        difficulty: 'Principiante',
        equipment: 'Máquina de extensión',
        instructions: ['Siéntate en la máquina', 'Ajusta el rodillo en tobillos', 'Extiende las piernas', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '15',
        name: 'Curl de Isquiotibiales',
        muscle: 'Piernas',
        video: '',
        description: 'Aislamiento de isquiotibiales',
        difficulty: 'Principiante',
        equipment: 'Máquina de curl',
        instructions: ['Acuéstate boca abajo', 'Coloca tobillos bajo el rodillo', 'Flexiona las piernas', 'Baja lentamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '16',
        name: 'Elevación de Talones',
        muscle: 'Piernas',
        video: '',
        description: 'Desarrollo de pantorrillas',
        difficulty: 'Principiante',
        equipment: 'Máquina o escalón',
        instructions: ['Párate en el borde', 'Baja los talones', 'Sube en puntas', 'Mantén arriba 1 segundo'],
        createdAt: new Date().toISOString()
    },
    // HOMBROS
    {
        id: '17',
        name: 'Press Militar',
        muscle: 'Hombros',
        video: '',
        description: 'Desarrollo de hombros con barra',
        difficulty: 'Intermedio',
        equipment: 'Barra',
        instructions: ['Barra a la altura del pecho', 'Empuja hacia arriba', 'Extiende completamente', 'Baja a la posición inicial'],
        createdAt: new Date().toISOString()
    },
    {
        id: '18',
        name: 'Elevaciones Laterales',
        muscle: 'Hombros',
        video: '',
        description: 'Aislamiento del deltoides lateral',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['De pie con mancuernas', 'Eleva los brazos a los lados', 'Sube hasta altura de hombros', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '19',
        name: 'Elevaciones Frontales',
        muscle: 'Hombros',
        video: '',
        description: 'Trabajo del deltoides frontal',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['De pie con mancuernas', 'Eleva un brazo al frente', 'Sube hasta altura de ojos', 'Baja y alterna'],
        createdAt: new Date().toISOString()
    },
    {
        id: '20',
        name: 'Pájaros',
        muscle: 'Hombros',
        video: '',
        description: 'Trabajo del deltoides posterior',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['Inclínate hacia adelante', 'Brazos colgando', 'Eleva hacia los lados', 'Aprieta escápulas arriba'],
        createdAt: new Date().toISOString()
    },
    // BÍCEPS
    {
        id: '21',
        name: 'Curl de Bíceps',
        muscle: 'Bíceps',
        video: '',
        description: 'Ejercicio clásico para bíceps',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['Párate con mancuernas a los lados', 'Flexiona los codos subiendo el peso', 'Aprieta en la parte superior', 'Baja lentamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '22',
        name: 'Curl con Barra',
        muscle: 'Bíceps',
        video: '',
        description: 'Desarrollo de masa en bíceps',
        difficulty: 'Principiante',
        equipment: 'Barra recta o Z',
        instructions: ['Agarra la barra', 'Codos pegados al cuerpo', 'Flexiona hasta arriba', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '23',
        name: 'Curl Martillo',
        muscle: 'Bíceps',
        video: '',
        description: 'Trabajo de braquial y bíceps',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['Mancuernas con agarre neutro', 'Sube manteniendo el agarre', 'Contrae arriba', 'Baja lentamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '24',
        name: 'Curl Concentrado',
        muscle: 'Bíceps',
        video: '',
        description: 'Máxima contracción del bíceps',
        difficulty: 'Principiante',
        equipment: 'Mancuerna',
        instructions: ['Sentado, codo en muslo', 'Toma la mancuerna', 'Flexiona completamente', 'Baja estirando'],
        createdAt: new Date().toISOString()
    },
    // TRÍCEPS
    {
        id: '25',
        name: 'Extensión de Tríceps',
        muscle: 'Tríceps',
        video: '',
        description: 'Extensión en polea para tríceps',
        difficulty: 'Principiante',
        equipment: 'Polea',
        instructions: ['Agarra la cuerda', 'Codos pegados al cuerpo', 'Extiende hacia abajo', 'Regresa controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '26',
        name: 'Press Francés',
        muscle: 'Tríceps',
        video: '',
        description: 'Excelente para la cabeza larga del tríceps',
        difficulty: 'Intermedio',
        equipment: 'Barra Z o mancuernas',
        instructions: ['Acostado en banco', 'Barra sobre el pecho', 'Baja hacia la frente', 'Extiende los brazos'],
        createdAt: new Date().toISOString()
    },
    {
        id: '27',
        name: 'Fondos en Banco',
        muscle: 'Tríceps',
        video: '',
        description: 'Ejercicio de peso corporal para tríceps',
        difficulty: 'Principiante',
        equipment: 'Banco',
        instructions: ['Manos en el banco atrás', 'Piernas extendidas', 'Baja flexionando codos', 'Sube hasta extender'],
        createdAt: new Date().toISOString()
    },
    {
        id: '28',
        name: 'Patada de Tríceps',
        muscle: 'Tríceps',
        video: '',
        description: 'Aislamiento del tríceps',
        difficulty: 'Principiante',
        equipment: 'Mancuerna',
        instructions: ['Inclínate apoyado', 'Codo a 90 grados', 'Extiende el brazo atrás', 'Regresa controladamente'],
        createdAt: new Date().toISOString()
    },
    // ABDOMINALES
    {
        id: '29',
        name: 'Crunch Abdominal',
        muscle: 'Abdomen',
        video: '',
        description: 'Ejercicio básico de abdominales',
        difficulty: 'Principiante',
        equipment: 'Ninguno',
        instructions: ['Acostado boca arriba', 'Rodillas flexionadas', 'Sube el torso', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '30',
        name: 'Plancha',
        muscle: 'Abdomen',
        video: '',
        description: 'Fortalecimiento del core completo',
        difficulty: 'Principiante',
        equipment: 'Ninguno',
        instructions: ['Apóyate en antebrazos', 'Cuerpo en línea recta', 'Contrae el abdomen', 'Mantén la posición'],
        createdAt: new Date().toISOString()
    },
    {
        id: '31',
        name: 'Elevación de Piernas',
        muscle: 'Abdomen',
        video: '',
        description: 'Trabajo del abdomen inferior',
        difficulty: 'Intermedio',
        equipment: 'Ninguno o barra',
        instructions: ['Colgado o acostado', 'Piernas juntas', 'Eleva las piernas', 'Baja sin tocar suelo'],
        createdAt: new Date().toISOString()
    },
    {
        id: '32',
        name: 'Russian Twist',
        muscle: 'Abdomen',
        video: '',
        description: 'Trabajo de oblicuos',
        difficulty: 'Principiante',
        equipment: 'Peso opcional',
        instructions: ['Sentado, espalda a 45°', 'Pies elevados', 'Gira el torso lado a lado', 'Toca el suelo cada lado'],
        createdAt: new Date().toISOString()
    }
];
