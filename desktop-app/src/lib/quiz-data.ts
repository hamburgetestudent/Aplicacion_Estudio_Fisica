export interface Question {
    id: string;
    text: string;
    options: string[];
    correct: number; // index
    explanation?: string;
}

export interface LessonContent {
    formulas: { latex: string; description: string }[];
    questions: Question[];
}

export interface QuizData {
    [subject: string]: {
        [unit: string]: {
            [topic: string]: LessonContent
        }
    }
}

export const QUIZ_DATA: QuizData = {
    "Física": {
        "Mecánica": {
            "Cinemática": {
                formulas: [
                    { latex: "v = \\frac{d}{t}", description: "Velocidad constante" },
                    { latex: "x = x_0 + v_0 t + \\frac{1}{2} a t^2", description: "Posición en MRUA" }
                ],
                questions: [
                    {
                        id: "cin_1",
                        text: "¿Qué representa la pendiente en una gráfica posición vs tiempo?",
                        options: ["Aceleración", "Velocidad", "Desplazamiento", "Fuerza"],
                        correct: 1,
                        explanation: "La pendiente de la gráfica x-t es la velocidad."
                    }
                ]
            },
            "Dinámica": {
                formulas: [
                    { latex: "F = ma", description: "Segunda Ley de Newton" }
                ],
                questions: [
                    {
                        id: "din_1",
                        text: "¿Cuál es la unidad de fuerza en el SI?",
                        options: ["Joule", "Watt", "Newton", "Pascal"],
                        correct: 2
                    }
                ]
            }
        },
        "Electromagnetismo": {
            "Electrostática": {
                formulas: [
                    { latex: "F = k \\frac{q_1 q_2}{r^2}", description: "Ley de Coulomb" }
                ],
                questions: []
            }
        }
    }
};
