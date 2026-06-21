import prisma from '../config/database'

function translateName(name: string): string {
  let translated = name.toLowerCase().trim();
  
  const exactReplacements: Record<string, string> = {
    '3/4 sit-up': 'Abdominales de 3/4',
    '90/90 stretch': 'Estiramiento 90/90',
    'abdominal stretch': 'Estiramiento Abdominal',
    'ankle circles': 'Giros de Tobillo',
    'arm circles': 'Giros de Brazo',
    'back lever': 'Back Lever',
    'front lever': 'Front Lever',
    'plank': 'Plancha Abdominal',
    'side plank': 'Plancha Lateral',
    'push-up': 'Flexiones de Pecho',
    'pull-up': 'Dominadas',
    'chin-up': 'Dominadas Supinas',
    'bench press': 'Press de Banca',
    'squat': 'Sentadilla',
    'deadlift': 'Peso Muerto',
    'burpee': 'Burpees',
    'jumping jack': 'Jumping Jacks',
    'mountain climber': 'Escaladores'
  };

  if (exactReplacements[translated]) {
    return exactReplacements[translated];
  }

  const replacements: [RegExp, string][] = [
    // Más específicas
    [/barbell bench press/g, 'Press de Banca con Barra'],
    [/dumbbell bench press/g, 'Press de Banca con Mancuernas'],
    [/cable bench press/g, 'Press de Banca en Polea'],
    [/incline barbell bench press/g, 'Press de Banca Inclinado con Barra'],
    [/incline dumbbell bench press/g, 'Press de Banca Inclinado con Mancuernas'],
    [/decline barbell bench press/g, 'Press de Banca Declinado con Barra'],
    [/decline dumbbell bench press/g, 'Press de Banca Declinado con Mancuernas'],
    [/barbell overhead press/g, 'Press Militar con Barra'],
    [/dumbbell overhead press/g, 'Press de Hombros con Mancuernas'],
    [/barbell squat/g, 'Sentadilla con Barra'],
    [/dumbbell squat/g, 'Sentadilla con Mancuernas'],
    [/barbell deadlift/g, 'Peso Muerto con Barra'],
    [/dumbbell deadlift/g, 'Peso Muerto con Mancuernas'],
    [/barbell romanian deadlift/g, 'Peso Muerto Rumano con Barra'],
    [/dumbbell romanian deadlift/g, 'Peso Muerto Rumano con Mancuernas'],
    [/barbell curl/g, 'Curl de Bíceps con Barra'],
    [/dumbbell curl/g, 'Curl de Bíceps con Mancuernas'],
    [/ez-bar curl/g, 'Curl de Bíceps con Barra EZ'],
    [/cable curl/g, 'Curl de Bíceps en Polea'],
    [/cable triceps extension/g, 'Extensión de Tríceps en Polea'],
    [/dumbbell triceps extension/g, 'Extensión de Tríceps con Mancuerna'],
    [/barbell shrug/g, 'Encogimiento de Hombros con Barra'],
    [/dumbbell shrug/g, 'Encogimiento de Hombros con Mancuernas'],
    [/dumbbell lateral raise/g, 'Elevaciones Laterales con Mancuernas'],
    [/dumbbell front raise/g, 'Elevaciones Frontales con Mancuernas'],
    [/cable lateral raise/g, 'Elevaciones Laterales en Polea'],
    [/cable front raise/g, 'Elevaciones Frontales en Polea'],
    [/bent over barbell row/g, 'Remo Inclinado con Barra'],
    [/bent over dumbbell row/g, 'Remo Inclinado con Mancuernas'],
    [/one arm dumbbell row/g, 'Remo a una Mano con Mancuerna'],
    [/cable row/g, 'Remo en Polea'],
    [/lat pulldown/g, 'Jalón al Pecho en Polea'],
    [/dumbbell fly/g, 'Aperturas con Mancuernas'],
    [/incline dumbbell fly/g, 'Aperturas Inclinadas con Mancuernas'],
    [/cable fly/g, 'Cruces de Poleas'],
    [/dumbbell lunge/g, 'Zancadas con Mancuernas'],
    [/barbell lunge/g, 'Zancadas con Barra'],
    [/cable kickback/g, 'Patada de Glúteo en Polea'],
    [/leg extension/g, 'Extensión de Piernas en Máquina'],
    [/seated leg curl/g, 'Curl de Piernas Sentado en Máquina'],
    [/lying leg curl/g, 'Curl de Piernas Acostado en Máquina'],
    [/standing calf raise/g, 'Elevación de Talones de Pie'],
    [/seated calf raise/g, 'Elevación de Talones Sentado'],
    [/wrist curl/g, 'Curl de Muñeca'],
    [/wrist roller/g, 'Rodillo de Muñeca'],
    [/hip thrust/g, 'Hip Thrust (Empuje de Cadera)'],
    
    // Genéricas
    [/barbell/g, 'con Barra'],
    [/dumbbell/g, 'con Mancuerna'],
    [/cable/g, 'en Polea'],
    [/lever/g, 'en Máquina'],
    [/smith/g, 'en Multipower'],
    [/band/g, 'con Banda'],
    [/kettlebell/g, 'con Pesa Rusa'],
    [/press/g, 'Press'],
    [/squat/g, 'Sentadilla'],
    [/deadlift/g, 'Peso Muerto'],
    [/curl/g, 'Curl'],
    [/extension/g, 'Extensión'],
    [/raise/g, 'Elevación'],
    [/row/g, 'Remo'],
    [/fly/g, 'Apertura'],
    [/lunge/g, 'Zancada'],
    [/crunch/g, 'Crunch'],
    [/stretch/g, 'Estiramiento'],
    [/seated/g, 'Sentado'],
    [/standing/g, 'De pie'],
    [/lying/g, 'Acostado'],
    [/incline/g, 'Inclinado'],
    [/decline/g, 'Declinado'],
    [/single arm/g, 'a un Brazo'],
    [/one arm/g, 'a un Brazo'],
    [/pulldown/g, 'Jalón'],
    [/shrug/g, 'Encogimiento'],
    [/kickback/g, 'Patada'],
    [/pushdown/g, 'Extensión en Polea'],
    [/pullover/g, 'Pullover'],
    [/adductor/g, 'Aductores'],
    [/abductor/g, 'Abductores']
  ];

  for (const [regex, replacement] of replacements) {
    translated = translated.replace(regex, replacement);
  }

  return translated.replace(/\b\w/g, c => c.toUpperCase());
}

function translateInstructions(instructions: string[] | string): string[] {
  const instrArray = Array.isArray(instructions) ? instructions : [instructions];
  const translatedSteps: string[] = [];

  const replacements: [RegExp, string][] = [
    [/lie flat on your back/gi, 'Acuéstate boca arriba'],
    [/lie on your back/gi, 'Acuéstate boca arriba'],
    [/lie on a/gi, 'Acuéstate sobre un'],
    [/lie face down/gi, 'Acuéstate boca abajo'],
    [/stand with your feet/gi, 'Párate con los pies'],
    [/stand tall with/gi, 'Párate erguido con'],
    [/hold a dumbbell/gi, 'Sostén una mancuerna'],
    [/hold the dumbbells/gi, 'Sostén las mancuernas'],
    [/hold the barbell/gi, 'Sostén la barra'],
    [/keep your back straight/gi, 'mantén la espalda recta'],
    [/keep your elbows/gi, 'mantén los codos'],
    [/slowly lower/gi, 'baja lentamente'],
    [/lower the weight/gi, 'baja el peso'],
    [/push the weight/gi, 'empuja el peso'],
    [/extend your arms/gi, 'extiende los brazos'],
    [/bend your knees/gi, 'dobla las rodillas'],
    [/contract your abs/gi, 'contrae el abdomen'],
    [/squeeze your glutes/gi, 'aprieta los glúteos'],
    [/inhale as you/gi, 'inhala mientras'],
    [/exhale as you/gi, 'exhala mientras'],
    [/repeat for the desired/gi, 'repite por el número deseado'],
    [/number of repetitions/gi, 'de repeticiones'],
    [/starting position/gi, 'posición inicial'],
    [/shoulder width/gi, 'ancho de hombros'],
    [/shoulder-width/gi, 'ancho de hombros'],
    [/hip width/gi, 'ancho de cadera'],
    [/flat on the ground/gi, 'planos en el suelo'],
    [/flat on the floor/gi, 'planos en el suelo'],
    [/under control/gi, 'bajo control'],
    [/controlled manner/gi, 'de manera controlada'],
    [/slowly return/gi, 'regresa lentamente'],
    [/return to the/gi, 'regresa a la'],
    [/slowly rise/gi, 'sube lentamente'],
    [/lift your/gi, 'levanta tu'],
    [/raise your/gi, 'eleva tus']
  ];

  for (const step of instrArray) {
    let transStep = step;
    for (const [regex, replacement] of replacements) {
      transStep = transStep.replace(regex, replacement);
    }
    transStep = transStep.replace(/\s+/g, ' ').trim();
    translatedSteps.push(transStep);
  }

  return translatedSteps;
}

function translateEquipment(eq: string): string {
  const val = (eq || '').toLowerCase().trim();
  const mapping: Record<string, string> = {
    'body weight': 'Peso corporal',
    'dumbbell': 'Mancuernas',
    'cable': 'Polea',
    'barbell': 'Barra',
    'leverage machine': 'Máquina',
    'band': 'Banda elástica',
    'smith machine': 'Multipower',
    'kettlebell': 'Pesa rusa',
    'weighted': 'Con lastre',
    'stability ball': 'Fitball',
    'ez barbell': 'Barra EZ',
    'medicine ball': 'Balón medicinal',
    'exercise ball': 'Balón de ejercicio',
    'bosu ball': 'Bosu',
    'roller': 'Rodillo',
    'rope': 'Cuerda',
    'wheel roller': 'Rueda abdominal',
    'bar': 'Barra'
  };
  return mapping[val] || val.charAt(0).toUpperCase() + val.slice(1);
}

function mapMuscleGroup(bodyPart: string, target: string): string {
  const bp = (bodyPart || '').toLowerCase().trim();
  switch (bp) {
    case 'upper arms':
      return 'Brazos Superiores';
    case 'upper legs':
      return 'Piernas Superiores';
    case 'back':
      return 'Espalda';
    case 'waist':
      return 'Cintura';
    case 'chest':
      return 'Pecho';
    case 'shoulders':
      return 'Hombros';
    case 'lower legs':
      return 'Piernas Inferiores';
    case 'lower arms':
      return 'Antebrazos';
    case 'cardio':
      return 'Cardio';
    case 'neck':
      return 'Cuello';
    default:
      if (bp.includes('arm')) {
        return bp.includes('upper') ? 'Brazos Superiores' : 'Antebrazos';
      }
      if (bp.includes('leg')) {
        return bp.includes('upper') ? 'Piernas Superiores' : 'Piernas Inferiores';
      }
      if (bp.includes('back')) return 'Espalda';
      if (bp.includes('waist') || bp.includes('abs') || bp.includes('core')) return 'Cintura';
      if (bp.includes('chest')) return 'Pecho';
      if (bp.includes('shoulder')) return 'Hombros';
      if (bp.includes('neck')) return 'Cuello';
      if (bp.includes('cardio')) return 'Cardio';
      return 'Cintura';
  }
}

export async function seedExercisesIfNeeded(force = false) {
  try {
    const count = await prisma.exercise.count()
    if (count > 0 && !force) {
      console.log(`ℹ️ Base de datos ya contiene ${count} ejercicios. Omitiendo seeder.`)
      return
    }

    console.log('🌱 Iniciando seeding de ejercicios (hasaneyldrm/exercises-dataset)...')
    
    if (force) {
      console.log('🧹 Borrando ejercicios existentes...')
      await prisma.workoutLog.deleteMany({})
      await prisma.routineExercise.deleteMany({})
      await prisma.personalRecord.deleteMany({})
      await prisma.exercise.deleteMany({})
    }

    const allExercisesToInsert: any[] = []

    // Fetch hasaneyldrm/exercises-dataset (1,324 exercises)
    console.log('Fetching hasaneyldrm/exercises-dataset (1,324 exercises)...')
    const res = await fetch('https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json')
    if (res.ok) {
      const hasanExercises = await res.json() as any[]
      console.log(`Fetched ${hasanExercises.length} exercises from hasaneyldrm/exercises-dataset`)
      for (const ex of hasanExercises) {
        let steps: string[] = []
        if (ex.instruction_steps && Array.isArray(ex.instruction_steps.en)) {
          steps = ex.instruction_steps.en
        } else if (ex.instructions) {
          if (typeof ex.instructions.en === 'string') {
            steps = ex.instructions.en.split('. ')
          } else if (typeof ex.instructions === 'string') {
            steps = ex.instructions.split('. ')
          }
        }

        allExercisesToInsert.push({
          id: ex.id,
          name: translateName(ex.name),
          muscle: mapMuscleGroup(ex.body_part || ex.category || '', ex.target || ''),
          video: null,
          description: null,
          difficulty: 'Principiante',
          equipment: translateEquipment(ex.equipment || 'body weight'),
          instructions: translateInstructions(steps),
          category: 'strength',
          gifUrl: ex.gif_url ? `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/${ex.gif_url}` : null
        })
      }
    } else {
      throw new Error(`Failed to fetch dataset: ${res.statusText}`);
    }

    console.log(`Inserting ${allExercisesToInsert.length} exercises in database...`)
    
    const chunkSize = 100
    let inserted = 0
    for (let i = 0; i < allExercisesToInsert.length; i += chunkSize) {
      const chunk = allExercisesToInsert.slice(i, i + chunkSize)
      const res = await prisma.exercise.createMany({
        data: chunk,
        skipDuplicates: true
      })
      inserted += res.count
    }

    console.log(`✅ Seeding de ejercicios completado. ${inserted} ejercicios insertados en total.`)
  } catch (error: any) {
    console.error('❌ Error during exercise seeding:', error)
  }
}
