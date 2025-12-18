import { Terminal, Flame, Zap, Bug } from 'lucide-react';
import { useDevMode } from '../../context/DevModeContext';
import { useUserProfile } from '../../hooks/useUserProfile';

/**
 * Barra superior de la aplicación.
 * Muestra el estado del usuario, como la racha actual y las gemas acumuladas.
 * También incluye un icono de menú para dispositivos móviles.
 *
 * @returns {JSX.Element} La barra superior de la interfaz.
 */
export function TopBar() {
  const profile = useUserProfile();
  const { isDevMode, toggleDevMode } = useDevMode();

  return (
    <div className="sticky top-0 bg-gray-900/95 backdrop-blur z-20 border-b border-gray-800 p-4 flex justify-between md:justify-end gap-6 items-center w-full h-16">
      <div className="flex items-center gap-2">
        {/* Dev Mode Toggle */}
        <button
          onClick={toggleDevMode}
          className={`p-2 rounded-lg transition-colors ${isDevMode ? 'bg-purple-500/20 text-purple-400' : 'text-gray-600 hover:text-gray-400'}`}
          title="Toggle Developer Mode"
        >
          <Bug size={20} />
        </button>
      </div>

      {/* Logo visible solo en móvil */}
      <div className="md:hidden flex items-center gap-2">
        <Terminal size={24} className="text-purple-500" />
      </div>

      <div className="flex gap-6">
        {/* Indicador de Racha */}
        <div className="flex items-center gap-2 text-orange-400 font-bold" title="Racha actual">
          <Flame size={20} fill="currentColor" />
          <span>{profile.stats.current_streak}</span>
        </div>
        {/* Indicador de Gemas */}
        <div className="flex items-center gap-2 text-cyan-400 font-bold" title="Gemas acumuladas">
          <Zap size={20} fill="currentColor" />
          <span>{profile.gems}</span>
        </div>
        {/* Indicador de Nivel (Nuevo) */}
        <div className="hidden md:flex items-center gap-2 text-purple-400 font-bold" title="Nivel Actual">
          <div className="px-2 py-0.5 bg-purple-900/50 rounded text-sm border border-purple-500/30">
            Lvl {profile.level}
          </div>
        </div>
      </div>
    </div>
  );
}
