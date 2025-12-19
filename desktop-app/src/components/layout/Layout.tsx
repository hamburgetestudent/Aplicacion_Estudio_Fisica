import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useDevMode } from '../../context/DevModeContext';
import { DebugDashboard } from '../debug/DebugDashboard';
import { BackgroundMusic } from './BackgroundMusic';
import { Settings } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente de diseño principal de la aplicación.
 * Define la estructura general con una barra lateral (Sidebar), una barra superior (TopBar)
 * y un área principal de contenido donde se renderizan las rutas anidadas (Outlet).
 *
 * @returns {JSX.Element} La estructura de la interfaz de usuario de la aplicación.
 */
export function Layout() {
  const { isDevMode } = useDevMode();
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500/30">
      <BackgroundMusic />
      <Sidebar />
      <div className="md:ml-64 h-screen flex flex-col relative overflow-hidden">
        <TopBar />
        <main className="flex-1 p-6 flex justify-center overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>

        {/* Debug Dashboard Integration */}
        {isDevMode && (
          <>
            <button
              onClick={() => setShowDebug(true)}
              className="fixed bottom-4 right-4 z-50 p-3 bg-purple-600 rounded-full shadow-lg hover:bg-purple-500 transition-all hover:scale-110"
              title="Open Debug Dashboard"
            >
              <Settings size={24} className="animate-spin-slow" />
            </button>
            {showDebug && <DebugDashboard onClose={() => setShowDebug(false)} />}
          </>
        )}
      </div>
    </div>
  );
}
