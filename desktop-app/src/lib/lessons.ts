/**
 * Tipo de lección disponible en la aplicación.
 * - 'simulation': Simulación interactiva.
 * - 'quiz': Cuestionario simple.
 * - 'theory': Contenido teórico rico.
 * - 'drag_drop': Ejercicio de ordenar arrastrando y soltando.
 */
export type LessonType = 'simulation' | 'quiz' | 'theory' | 'drag_drop';

/**
 * Interfaz principal que define el contenido de una lección.
 */
export interface LessonContent {
  /** Identificador único de la lección. */
  id: string;
  /** Título de la lección. */
  title: string;
  /** Tipo de lección. */
  type: LessonType;
  /** Instrucciones para el usuario. */
  instructions: string;

  // Configuración para el tipo 'simulation'
  /** Configuración específica para simulaciones. */
  simulationConfig?: {
    type: 'rocket_launch' | 'projectile_motion' | 'free_fall' | 'message_send' | 'boolean_playground';
    initialCode: string;
    verifyFunction: (userValue: any) => boolean;
    successMessage: string;
    errorMessage: string;
    options: { label: string; value: any; code: string }[];
  };

  // Configuración para el tipo 'quiz'
  /** Configuración específica para cuestionarios simples. */
  quizConfig?: {
    question: string;
    options: { id: string; text: string; correct: boolean }[];
    successMessage: string;
    errorMessage: string;
  };

  // Configuración para el tipo 'drag_drop' (Sequence Builder)
  /** Configuración específica para ejercicios de arrastrar y soltar. */
  dragDropConfig?: {
    items: { id: string; text: string }[]; // Pool of items
    correctSequence: string[]; // IDs in correct order
    trapId?: string; // ID of the trap card
    trapMessage?: string; // Message if trap is used/placed first
    successMessage: string;
    errorMessage: string;
  };

  // Configuración para el tipo 'theory'
  /** Bloques de contenido para lecciones teóricas. */
  theoryBlocks?: {
    type: 'text' | 'list' | 'alert' | 'header' | 'checklist' | 'true_false';
    content: string | string[]; // For true_false, content is the statement
    style?: 'warning' | 'info';
    answer?: boolean; // For true_false
  }[];
  /** @deprecated Contenido de teoría legado (cadena simple). */
  theoryContent?: string; // Legacy
  /** ID de la siguiente lección en la secuencia. */
  nextLessonId?: string;
}

/**
 * Base de datos de lecciones disponibles en la aplicación.
 * Mapea IDs de lección a objetos LessonContent.
 */
export const LESSONS_DATA: Record<string, LessonContent> = {
  // Coincide con el ID generado en el Dashboard: Category-Topic-study
  'Mecánica-Cinemática-study': {
    id: 'Mecánica-Cinemática-study',
    title: 'Intro a la Cinemática',
    type: 'simulation',
    instructions:
      'Configura la velocidad inicial del cohete. Recuerda que la velocidad es un vector o un escalar numérico, no texto.',
    simulationConfig: {
      type: 'rocket_launch',
      initialCode: `// Archivo: physics_engine.js
const rocket = new Rocket();
// La velocidad debe ser un número
let velocityY = ???;
rocket.launch(velocityY);`,
      verifyFunction: (val) => val === 50,
      successMessage: '¡Correcto! La velocidad es una magnitud física numérica.',
      errorMessage: '¡Error! Una cadena de texto no puede definir una velocidad física.',
      options: [
        { code: '"rápido"', value: 'rápido', label: 'String (Texto)' },
        { code: '50', value: 50, label: 'Number (Entero)' },
        { code: 'null', value: null, label: 'Null (Vacío)' },
      ],
    },
    nextLessonId: 'Mecánica-Cinemática-quiz',
  },
  'Mecánica-Cinemática-quiz': {
    id: 'Mecánica-Cinemática-quiz',
    title: 'Quiz de Cinemática',
    type: 'theory',
    instructions: 'Conceptos básicos.',
    theoryContent:
      'La cinemática estudia el movimiento sin atender a las causas que lo producen...',
    nextLessonId: 'Mecánica-Dinámica-study',
  },
  'Mecánica-Dinámica-study': {
    id: 'Mecánica-Dinámica-study',
    title: 'Intro a Dinámica',
    type: 'theory',
    instructions: 'Las causas del movimiento.',
    theoryBlocks: [
      { type: 'header', content: 'Leyes de Newton' },
      { type: 'text', content: 'Aquí aprenderemos por qué se mueven las cosas.' },
    ],
    // Fin de la cadena por ahora
  },

  // PYTHON
  'Python-Fundamentos-Algoritmos-study': {
    id: 'Python-Fundamentos-Algoritmos-study',
    title: '¿Qué es un algoritmo?',
    type: 'theory',
    instructions: 'Entendiendo la base de la programación.',
    theoryBlocks: [
      {
        type: 'text',
        content:
          'Un algoritmo es una serie de pasos ordenados y claros que sirven para resolver un problema o realizar una tarea.',
      },
      {
        type: 'header',
        content: 'Ejemplo: Lavarse los dientes',
      },
      {
        type: 'list',
        content: ['Tomar el cepillo', 'Poner pasta', 'Cepillar', 'Enjuagar'],
      },
      {
        type: 'alert',
        style: 'warning',
        content:
          'Un algoritmo NO es código. El código es solo una forma de escribir un algoritmo para la computadora.',
      },
    ],
    nextLessonId: 'Python-Fundamentos-Algoritmos-quiz',
  },
  'Python-Fundamentos-Algoritmos-quiz': {
    id: 'Python-Fundamentos-Algoritmos-quiz',
    title: 'Mini-check',
    type: 'quiz',
    instructions: 'Demuestra que has entendido el concepto.',
    quizConfig: {
      question: '¿Cuál de estos es un algoritmo?',
      options: [
        { id: 'A', text: '“Cepillarse bien y rápido”', correct: false },
        { id: 'B', text: '1. Tomar cepillo\n2. Poner pasta\n3. Cepillar', correct: true },
        { id: 'C', text: '“Algo para limpiar dientes”', correct: false },
      ],
      successMessage: '¡Exacto! Un algoritmo es una serie de pasos precisos.',
      errorMessage:
        'No exactamente. Un algoritmo debe ser una serie de pasos ordenados, no una descripción vaga.',
    },
    nextLessonId: 'Python-Fundamentos-Algoritmos-tea',
  },
  'Python-Fundamentos-Algoritmos-tea': {
    id: 'Python-Fundamentos-Algoritmos-tea',
    title: 'El Robot del Té',
    type: 'drag_drop',
    instructions: 'Ayuda al robot a preparar té. Ordena los pasos lógicamente.',
    dragDropConfig: {
      items: [
        { id: '1', text: 'Hervir agua' },
        { id: '2', text: 'Poner bolsita de té en taza' },
        { id: '3', text: 'Servir agua en la taza' },
        { id: '4', text: 'Esperar 3 min y servir té' },
        { id: 'trap', text: 'Beber el té (sin té)' },
      ],
      correctSequence: ['1', '2', '3', '4'],
      trapId: 'trap',
      trapMessage:
        '¡Te has bebido el agua antes de hacer el té! Un algoritmo debe tener ORDEN lógico.',
      successMessage:
        '¡Perfecto! El algoritmo tiene una secuencia lógica: Calentar -> Preparar -> Servir -> Esperar.',
      errorMessage: 'El orden no es correcto. Piensa: ¿Qué necesitas antes de servir el agua?',
    },
    nextLessonId: 'Python-Fundamentos-Algoritmos-concepts',
  },
  'Python-Fundamentos-Algoritmos-concepts': {
    id: 'Python-Fundamentos-Algoritmos-concepts',
    title: 'Conceptos Clave',
    type: 'theory',
    instructions: 'Asegura tu conocimiento con estos conceptos fundamentales.',
    theoryBlocks: [
      {
        type: 'header',
        content: 'Propiedades de un Algoritmo',
      },
      {
        type: 'checklist', // Nuevo tipo para propiedades verificadas
        content: [
          'Finito (termina)',
          'Claro (sin ambigüedad)',
          'Ordenado',
          'Repetible (si lo repites, obtienes el mismo resultado)',
        ],
      },
      {
        type: 'header',
        content: 'Micro-Quiz',
      },
      {
        type: 'true_false',
        content: 'Un algoritmo puede ser una receta.',
        answer: true,
      },
      {
        type: 'true_false',
        content: 'Un algoritmo es siempre código.',
        answer: false,
      },
    ],
    nextLessonId: 'Python-Fundamentos-Algoritmos-home',
  },
  'Python-Fundamentos-Algoritmos-home': {
    id: 'Python-Fundamentos-Algoritmos-home',
    title: 'Algoritmo: Salir de casa',
    type: 'drag_drop',
    instructions:
      'Ordena los pasos para salir de casa correctamente. Reglas: No puedes salir sin abrir, ni cerrar antes de salir.',
    dragDropConfig: {
      items: [
        { id: '1', text: 'Ponerse zapatos' },
        { id: '2', text: 'Tomar llaves' },
        { id: '3', text: 'Abrir la puerta' },
        { id: '4', text: 'Salir de la casa' },
        { id: '5', text: 'Cerrar la puerta' },
        { id: '6', text: 'Guardar llaves' },
        { id: 'trap', text: 'Dormirse en el sillón' },
      ],
      correctSequence: ['1', '2', '3', '4', '5', '6'],
      trapId: 'trap',
      trapMessage: '¡Te quedaste dormido! El objetivo era salir, no descansar.',
      successMessage: '¡Excelente! "Cada acción correcta empieza con un buen algoritmo."',
      errorMessage:
        'El orden no es correcto. Recuerda: Zapatos -> Llaves -> Abrir -> Salir -> Cerrar.',
    },
    nextLessonId: 'Python-Fundamentos-PensarEnPasos-study',
  },

  // LECCIÓN 2: PENSAR EN PASOS
  'Python-Fundamentos-PensarEnPasos-study': {
    id: 'Python-Fundamentos-PensarEnPasos-study',
    title: 'Materia (OBLIGATORIO)',
    type: 'theory',
    instructions: 'Pantalla tranquila, sin animaciones todavía.',
    theoryBlocks: [
      {
        type: 'header',
        content: 'Pensar en pasos',
      },
      {
        type: 'text',
        content:
          'Pensar como programador significa dividir una acción grande en pasos pequeños, claros y ejecutables.\n\nUna computadora no entiende "acciones completas". Solo entiende pasos simples, uno por uno.',
      },
      {
        type: 'header',
        content: 'Ejemplo comparativo',
      },
      {
        type: 'alert',
        style: 'warning',
        content: '❌ Acción grande: "Preparar desayuno"',
      },
      {
        type: 'checklist',
        content: ['Tomar un plato', 'Poner comida en el plato', 'Sentarse', 'Comer'],
      },
      {
        type: 'alert',
        style: 'info',
        content: 'Programar es desarmar la realidad en pasos simples.',
      },
    ],
    nextLessonId: 'Python-Fundamentos-PensarEnPasos-check',
  },
  'Python-Fundamentos-PensarEnPasos-check': {
    id: 'Python-Fundamentos-PensarEnPasos-check',
    title: 'Micro-chequeo',
    type: 'quiz',
    instructions: 'Micro-chequeo de comprensión',
    quizConfig: {
      question: '¿Cuál opción está mejor pensada en pasos?',
      options: [
        { id: 'A', text: 'Ordenar la pieza', correct: false },
        {
          id: 'B',
          text: '1. Juntar ropa\n2. Guardar ropa\n3. Barrer el piso\n4. Hacer la cama',
          correct: true,
        },
      ],
      successMessage: 'Correcto. Los pasos pequeños se pueden ejecutar.',
      errorMessage: 'La opción A es una "acción grande", no pasos ejecutables.',
    },
    nextLessonId: 'Python-Fundamentos-PensarEnPasos-guided',
  },
  'Python-Fundamentos-PensarEnPasos-guided': {
    id: 'Python-Fundamentos-PensarEnPasos-guided',
    title: 'Ejercicio guiado',
    type: 'drag_drop',
    instructions: 'Convierte esta acción en pasos: "Enviar un mensaje"',
    dragDropConfig: {
      items: [
        { id: '1', text: 'Abrir el celular' },
        { id: '2', text: 'Abrir la app de mensajes' },
        { id: '3', text: 'Elegir contacto' },
        { id: '4', text: 'Escribir el mensaje' },
        { id: '5', text: 'Enviar' },
      ],
      correctSequence: ['1', '2', '3', '4', '5'],
      successMessage: '¡Bien! Has desglosado la acción correctamente.',
      errorMessage: 'Revisa el orden lógico. No puedes escribir antes de abrir la app.',
    },
    nextLessonId: 'Python-Fundamentos-PensarEnPasos-diff',
  },

  'Python-Fundamentos-PensarEnPasos-diff': {
    id: 'Python-Fundamentos-PensarEnPasos-diff',
    title: 'Dificultad real',
    type: 'quiz',
    instructions: 'Dificultad real (pensamiento)',
    quizConfig: {
      question: '¿Cuál paso es demasiado grande?',
      options: [
        { id: 'A', text: 'Abrir el celular', correct: false },
        { id: 'B', text: 'Comunicarse', correct: true },
      ],
      successMessage:
        '¡Exacto! "Comunicarse" es muy abstracto. "Abrir el celular" es una acción concreta.',
      errorMessage: 'Piensa: ¿cuál de los dos requiere más subdivisiones?',
    },
    nextLessonId: 'Python-Fundamentos-PensarEnPasos-bridge',
  },
  'Python-Fundamentos-PensarEnPasos-bridge': {
    id: 'Python-Fundamentos-PensarEnPasos-bridge',
    title: 'Puente sutil hacia código',
    type: 'theory',
    instructions: 'Sin enseñar Python todavía',
    theoryBlocks: [
      {
        type: 'text',
        content: 'En programación, cada paso termina siendo una Instrucción.',
      },
      {
        type: 'header',
        content: 'Ejemplo visual',
      },
      {
        type: 'list',
        content: ['Pasos: "Mostrar un mensaje"', '🔒 (Icono de código bloqueado)'],
      },
      {
        type: 'text',
        content: 'Pronto aprenderás a escribir estos pasos en Python.',
      },
    ],
    nextLessonId: 'Python-Fundamentos-PensarEnPasos-quiz',
  },
  'Python-Fundamentos-PensarEnPasos-quiz': {
    id: 'Python-Fundamentos-PensarEnPasos-quiz',
    title: 'Mini-Boss: Preparar la mochila',
    type: 'drag_drop',
    instructions:
      'Arma pasos correctos. Regla: No puedes guardar sin abrir. El algoritmo debe terminar.',
    dragDropConfig: {
      items: [
        { id: '1', text: 'Abrir la mochila' },
        { id: '2', text: 'Buscar cuadernos' },
        { id: '3', text: 'Guardar cuadernos' },
        { id: '4', text: 'Guardar lápiz' },
        { id: '5', text: 'Cerrar la mochila' },
        { id: 'trap', text: 'Ir al colegio (sin mochila)' },
      ],
      correctSequence: ['1', '2', '3', '4', '5'],
      trapId: 'trap',
      trapMessage: '¡Te fuiste sin la mochila! 🚫',
      successMessage: '¡Excelente! Has dominado el Pensamiento Algorítmico II. 🏆',
      errorMessage: 'Recuerda: Abrir -> Buscar/Guardar -> Cerrar.',
    },
    // Fin del módulo
  },

  // LECCIÓN 3: DECISIONES
  'Python-Fundamentos-Decisiones en la vida real-study': {
    id: 'Python-Fundamentos-Decisiones en la vida real-study',
    title: "La Lección Previa: 'La Pregunta de Sí o No'",
    type: 'simulation',
    instructions: 'Las computadoras no dudan. Descubre cómo toman decisiones.',
    simulationConfig: {
      type: 'boolean_playground',
      initialCode: '',
      verifyFunction: () => true, // La validación es interna en el componente
      successMessage: '¡Nivel Completado! Has dominado los Booleanos.',
      errorMessage: '',
      options: [],
    },
    // nextLessonId: 'Python-Fundamentos-Decisiones-quiz', // Future
  },
};
