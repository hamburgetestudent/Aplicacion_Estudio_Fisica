
import { Divide, Zap, Brain, Code, Rocket, BookOpen } from 'lucide-react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: any; // Lucide icon
    color: string; // Tailwind class
    xpReward?: number;
}

export const ACHIEVEMENTS_DATA: Achievement[] = [
    {
        id: 'algo_1',
        title: 'Pensamiento Algorítmico I',
        description: 'Completaste tu primera lección de algoritmos.',
        icon: Brain,
        color: 'text-purple-400',
        xpReward: 50
    },
    {
        id: 'first_steps',
        title: 'Primeros Pasos',
        description: 'Completaste cualquier lección.',
        icon: BookOpen,
        color: 'text-blue-400',
        xpReward: 20
    },
    {
        id: 'rocket_science',
        title: 'Ciencia de Cohetes',
        description: 'Lanzaste el cohete en la simulación.',
        icon: Rocket,
        color: 'text-orange-400',
        xpReward: 100
    },
    {
        id: 'clean_code',
        title: 'Código Limpio',
        description: 'Resolviste un ejercicio sin errores.',
        icon: Code,
        color: 'text-green-400',
        xpReward: 80
    },
    {
        id: 'fast_learner',
        title: 'Aprendiz Veloz',
        description: 'Completaste una lección en menos de 1 minuto.',
        icon: Zap,
        color: 'text-yellow-400',
        xpReward: 50
    }
];
