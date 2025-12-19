import { LESSONS_DATA as DATA } from '../data/lessons';

// Re-export types from types.ts to maintain backward compatibility
export type { LessonType, LessonContent } from '../types';

/**
 * Base de datos de lecciones disponibles en la aplicación.
 * Mapea IDs de lección a objetos LessonContent.
 */
export const LESSONS_DATA = DATA;
