import type { LessonContent } from '../../../types';

export const PHYSICS_MECHANICS_DATA: Record<string, LessonContent> = {
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
};
