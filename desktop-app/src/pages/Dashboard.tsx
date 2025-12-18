import { useMemo, useState, useEffect } from 'react';
import { BookOpen, Lock, CheckCircle, Star, Zap, Code } from 'lucide-react';
import { QUIZ_DATA } from '../lib/quiz-data';
import { useNavigate } from 'react-router-dom';

/**
 * Tipo que representa una lección visual en el mapa de progreso.
 */
type LessonType = {
  id: string;
  title: string;
  topic: string;
  locked: boolean;
  completed: boolean;
};

/**
 * Interfaz para una sección de unidad que agrupa lecciones.
 */
interface UnitSection {
  title: string;
  description: string;
  color: string;
  lessons: LessonType[];
}

/**
 * Componente principal de la pantalla de inicio (Inicio).
 * Muestra las materias disponibles y un mapa interactivo de lecciones estilo árbol de habilidades.
 * Permite navegar entre lecciones y visualizar el progreso.
 *
 * @returns {JSX.Element} El mapa interactivo de inicio.
 */
export default function Dashboard() {
  const navigate = useNavigate();

  // Obtener las materias disponibles de la base de datos de cuestionarios
  const subjects = useMemo(() => Object.keys(QUIZ_DATA), []);

  // Estado con persistencia en localStorage para recordar la materia seleccionada
  const [selectedSubject, setSelectedSubject] = useState<string>(() => {
    const saved = localStorage.getItem('selectedSubject');
    return saved && subjects.includes(saved) ? saved : subjects[0];
  });

  useEffect(() => {
    localStorage.setItem('selectedSubject', selectedSubject);
  }, [selectedSubject]);

  // Procesamiento de unidades y lecciones para la materia seleccionada
  const units = useMemo(() => {
    const processedUnits: UnitSection[] = [];
    const completedIDs = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    const subjectData = QUIZ_DATA[selectedSubject];

    // Helper para verificar completitud con soporte legado
    const isCompleted = (id: string, _prefixOverride?: string) => {
      if (completedIDs.includes(id)) return true;

      // Fallback: Verificar lógica antigua (stats_PREFIX)
      // La lógica antigua agrupaba por prefijo. Si hay stats, asumimos completado el grupo (o al menos las partes principales).
      // Para 'Algoritmos', el prefijo es 'Python-Fundamentos-Algoritmos'.
      // Intentamos derivar el prefijo:
      // ID: Python-Fundamentos-Algoritmos-study -> Prefix: Python-Fundamentos-Algoritmos
      const parts = id.split('-');
      if (parts.length > 3) {
        const prefix = parts.slice(0, -1).join('-');
        const legacyKey = `stats_${prefix}`;
        if (localStorage.getItem(legacyKey)) return true;
      }
      return false;
    };

    // 1. Aplanar todas las lecciones posibles para calcular el bloqueo secuencial
    const allLessonsSequence: string[] = [];
    if (subjectData) {
      Object.values(subjectData).forEach((topics) => {
        Object.keys(topics).forEach((topicName) => {
          // El orden aquí debe coincidir con el orden de generación de abajo
          const category = Object.keys(subjectData).find((key) => subjectData[key] === topics);
          if (category) {
            // Solo agregamos el nodo principal (study) a la secuencia visual
            allLessonsSequence.push(`${selectedSubject}-${category}-${topicName}-study`);
          }
        });
      });
    }

    // 2. Construir la estructura agrupada con el estado de bloqueo calculado
    if (subjectData) {
      Object.entries(subjectData).forEach(([categoryName, topics]) => {
        const lessons: LessonType[] = [];

        Object.keys(topics).forEach((topicName) => {
          const studyId = `${selectedSubject}-${categoryName}-${topicName}-study`;

          // Lógica de desbloqueo secuencial (simplificada para 1 nodo):
          // Buscamos el índice de este 'studyId' en la secuencia completa
          const studySeqIndex = allLessonsSequence.indexOf(studyId);

          // Está bloqueado si NO es el primero Y la lección *inmediatamente anterior* en la gran cadena no está completada.
          const isStudyLocked =
            studySeqIndex > 0 && !isCompleted(allLessonsSequence[studySeqIndex - 1]);

          lessons.push({
            id: studyId,
            title: topicName, // Título simplificado (solo nombre del tema)
            topic: topicName,
            locked: isStudyLocked,
            completed: isCompleted(studyId),
          });
        });

        processedUnits.push({
          title: categoryName,
          description: `Temas de ${selectedSubject}`,
          color:
            selectedSubject === 'Python'
              ? 'from-yellow-500 to-orange-500'
              : 'from-blue-600 to-cyan-500',
          lessons,
        });
      });
    }

    return processedUnits;
  }, [selectedSubject]);

  // Constantes para el trazado del camino de serpiente (Snake Path)
  const VERTICAL_SPACING = 120;
  const AMPLITUDE = 80; // Oscilación horizontal

  return (
    <div className="flex flex-col items-center pb-40 pt-2 w-full overflow-x-hidden">
      {/* Selector de Materias (Pestañas) */}
      <div className="flex gap-4 mb-8 bg-gray-900/50 p-2 rounded-full border border-white/5 backdrop-blur-sm sticky top-0 z-50 shadow-xl">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${selectedSubject === subject
                ? subject === 'Python'
                  ? 'bg-yellow-500 text-yellow-950 shadow-lg shadow-yellow-500/20'
                  : 'bg-cyan-500 text-cyan-950 shadow-lg shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {subject === 'Física' ? (
              <Zap size={16} />
            ) : subject === 'Python' ? (
              <Code size={16} />
            ) : (
              <BookOpen size={16} />
            )}
            {subject}
          </button>
        ))}
      </div>

      {/* Renderizado de unidades */}
      {units.map((unit, unitIdx) => {
        const totalHeight = unit.lessons.length * VERTICAL_SPACING + 100;

        // Ayudante para calcular la posición de un índice
        const getPos = (i: number) => {
          const y = i * VERTICAL_SPACING + 80; // Desplazamiento inicial
          // Patrón de onda sinusoidal: para lograr el zigzag estilo "Duolingo"
          const xOffset = Math.sin((i * Math.PI) / 2) * AMPLITUDE;
          return { x: xOffset, y };
        };

        // Generar el trazado SVG (Path)
        let pathD = '';
        for (let i = 0; i < unit.lessons.length; i++) {
          const curr = getPos(i);
          if (i === 0) {
            pathD += `M ${curr.x} ${curr.y}`;
          } else {
            const prev = getPos(i - 1);
            // Puntos de control para curvas Bezier cúbicas
            const cp1y = prev.y + VERTICAL_SPACING * 0.5;
            const cp2y = curr.y - VERTICAL_SPACING * 0.5;
            pathD += ` C ${prev.x} ${cp1y}, ${curr.x} ${cp2y}, ${curr.x} ${curr.y}`;
          }
        }

        // Extender el camino un poco al final
        if (unit.lessons.length > 0) {
          const last = getPos(unit.lessons.length - 1);
          pathD += ` L ${last.x} ${last.y + 60}`;
        }

        return (
          <div key={unitIdx} className="w-full max-w-md mb-24 relative">
            {/* Encabezado de la Unidad */}
            <div
              className={`bg-gradient-to-r ${unit.color} p-6 rounded-3xl mb-12 shadow-xl shadow-cyan-900/20 text-white flex justify-between items-center relative z-20 mx-4 border border-white/10`}
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{unit.title}</h2>
                <p className="text-white/80 text-sm font-medium">{unit.description}</p>
              </div>
              <BookOpen size={28} className="opacity-90 drop-shadow-md" />
            </div>

            {/* Contenedor de Lecciones */}
            <div className="relative flex justify-center" style={{ height: totalHeight }}>
              {/* Capa de Camino SVG (Snake Path) */}
              <svg
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-full pointer-events-none -z-10"
                overflow="visible"
              >
                {/* Sombra/Borde exterior */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="24"
                  strokeLinecap="round"
                  className="drop-shadow-sm opacity-50"
                />
                {/* Camino interior (Cuerpo de la serpiente) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#374151"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="20 10"
                  className="opacity-60"
                />
              </svg>

              {/* Botones de Lecciones */}
              {unit.lessons.map((lesson, idx) => {
                const pos = getPos(idx);
                const isActive = !lesson.locked && !lesson.completed;
                const isCompleted = lesson.completed; // Simulación visual de completado

                return (
                  <div
                    key={lesson.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-105"
                    style={{ left: `calc(50% + ${pos.x}px)`, top: pos.y }}
                  >
                    <div className="relative group">
                      {/* Tooltip para lección activa */}
                      {isActive && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-cyan-900 text-sm font-extrabold py-2 px-4 rounded-xl animate-bounce z-30 shadow-lg whitespace-nowrap">
                          EMPEZAR
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                        </div>
                      )}

                      <button
                        onClick={() => !lesson.locked && navigate(`/lessons/${lesson.id}`)}
                        disabled={lesson.locked}
                        className={`
                                                    relative w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl font-bold border-b-8 transition-all
                                                    active:border-b-0 active:translate-y-2
                                                    ${isCompleted
                            ? 'bg-yellow-400 border-yellow-600 text-yellow-900'
                            : isActive
                              ? selectedSubject === 'Python'
                                ? 'bg-yellow-400 border-yellow-600 text-yellow-950 shadow-[0_0_30px_rgba(250,204,21,0.5)]'
                                : 'bg-cyan-400 border-cyan-600 text-cyan-950 shadow-[0_0_30px_rgba(34,211,238,0.5)]'
                              : 'bg-gray-700 border-gray-600 text-gray-500'
                          }
                                                `}
                      >
                        {isCompleted ? (
                          <CheckCircle size={32} strokeWidth={3} />
                        ) : lesson.locked ? (
                          <Lock size={28} />
                        ) : (
                          <Star size={32} fill="currentColor" />
                        )}

                        {/* Brillos del botón */}
                        <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-white opacity-20"></div>
                      </button>

                      {/* Etiqueta debajo del botón */}
                      <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center w-32 pointer-events-none">
                        <span
                          className={`text-sm font-bold drop-shadow-md ${isActive ? 'text-white' : 'text-gray-500'}`}
                        >
                          {lesson.topic}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
