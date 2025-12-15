import { Terminal, Flame, Zap } from 'lucide-react';
import { useState } from 'react';

/**
 * Barra superior de la aplicación.
 * Muestra el estado del usuario, como la racha actual y las gemas acumuladas.
 * También incluye un icono de menú para dispositivos móviles.
 *
 * @returns {JSX.Element} La barra superior de la interfaz.
 */
export function TopBar() {
    // Estado local simulado para demostración. Debería venir de un contexto global o store.
    const [streak] = useState(12);
    const [gems] = useState(1240);

    return (
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur z-20 border-b border-gray-800 p-4 flex justify-between md:justify-end gap-6 items-center w-full h-16">
            {/* Logo visible solo en móvil */}
            <div className="md:hidden flex items-center gap-2">
                <Terminal size={24} className="text-purple-500" />
            </div>

            <div className="flex gap-6">
                {/* Indicador de Racha */}
                <div className="flex items-center gap-2 text-orange-400 font-bold">
                    <Flame size={20} fill="currentColor" />
                    <span>{streak}</span>
                </div>
                {/* Indicador de Gemas */}
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Zap size={20} fill="currentColor" />
                    <span>{gems}</span>
                </div>
            </div>
        </div>
    );
}
