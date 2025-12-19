import { PHYSICS_MECHANICS_DATA } from './physics/mechanics';
import { PYTHON_FUNDAMENTALS_DATA } from './python/fundamentals';
import type { LessonContent } from '../../types';

export const LESSONS_DATA: Record<string, LessonContent> = {
    ...PHYSICS_MECHANICS_DATA,
    ...PYTHON_FUNDAMENTALS_DATA,
};
