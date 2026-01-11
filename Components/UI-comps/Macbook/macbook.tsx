import React, { useState, useCallback } from 'react';
import { Terminal, Folder, Code, Mail, User, FileText, Music, Gamepad2 } from 'lucide-react';
import Dock from "./components/Dock"
import Window from "./components/Window"
import MenuBar from "./components/Menubar"
import ContactApp from "./Apps/ContactApp"
import MacBookFrame from "./components/MacbookFrame"
import ResumeApp from "./Apps/ResumeApp"
import AboutApp from "./Apps/AboutApp"
import MusicApp from "./Apps/Music/MusicApp"
import GamesApp from "./Apps/Games/GamesApp"
import TerminalApp from "./Apps/TerminalApp"
import SkillsApp from "./Apps/SkillsApp"
import ProjectsApp from "./Apps/ProjectApp"
import { AppConfig, WindowState } from "./types";


const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(100);

  const openWindow = useCallback((appId: string, title: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        return prev.map(w => 
          w.appId === appId 
            ? { ...w, isMinimized: false, isFocused: true, zIndex: maxZIndex + 1 }
            : { ...w, isFocused: false }
        );
      }

      const newWindow: WindowState = {
        id: `${appId}-${Date.now()}`,
        appId,
        title,
        x: 100 + prev.length * 30,
        y: 100 + prev.length * 30,
        width: 700,
        height: 500,
        zIndex: maxZIndex + 1,
        isMinimized: false,
        isFocused: true,
      };

      setMaxZIndex(maxZIndex + 1);
      return [...prev.map(w => ({ ...w, isFocused: false })), newWindow];
    });
  }, [maxZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, isFocused: true, zIndex: maxZIndex + 1 }
        : { ...w, isFocused: false }
    ));
    setMaxZIndex(maxZIndex + 1);
  }, [maxZIndex]);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    updateWindowPosition,
  };
};
// ============================================================================
// COMPONENTS
// ============================================================================



const Desktop: React.FC = () => {
  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    updateWindowPosition,
  } = useWindowManager();

  const apps: AppConfig[] = [
    { id: 'about', name: 'About Me', icon: User, color: 'bg-blue-500', component: AboutApp },
    { id: 'projects', name: 'Projects', icon: Folder, color: 'bg-yellow-500', component: ProjectsApp },
    { id: 'skills', name: 'Skills', icon: Code, color: 'bg-green-500', component: SkillsApp },
    { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-gray-800', component: TerminalApp },
    { id: 'resume', name: 'Resume', icon: FileText, color: 'bg-red-500', component: ResumeApp },
    { id: 'contact', name: 'Contact', icon: Mail, color: 'bg-purple-500', component: ContactApp },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-pink-500', component: MusicApp },
    { id: 'games', name: 'Games', icon: Gamepad2, color: 'bg-indigo-500', component: GamesApp },
  ];

  const handleAppClick = (appId: string) => {
    const existingWindow = windows.find(w => w.appId === appId);
  
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        // If minimized, bring it back and unminimize via openWindow which handles this
        openWindow(appId, existingWindow.title);
      } else {
        // If already open, just focus it
        focusWindow(existingWindow.id);
      }
    } else {
      // If it doesn't exist (was closed with X), open it fresh
      const app = apps.find(a => a.id === appId);
      if (app) {
        openWindow(appId, app.name);
      }
    }
  };

  return (
    <div
      className="h-full w-full relative flex flex-col"
      style={{
        backgroundImage: "url('/images/peakpxx.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      
      {/* Menu Bar - fixed height */}
      <MenuBar />

      {/* Windows area - fills remaining space, accounts for menu bar height */}
      <div className="flex-1 relative min-h-0">
        {windows.map(window => {
          const app = apps.find(a => a.id === window.appId);
          if (!app) return null;

          const Component = app.component;

          return (
            <Window
              key={window.id}
              window={window}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onDrag={(x, y) => updateWindowPosition(window.id, x, y)}
            >
              <Component />
            </Window>
          );
        })}
      </div>

      {/* Dock - positioned at bottom, doesn't affect layout */}
      <Dock apps={apps} windows={windows} onAppClick={handleAppClick} />
    </div>
  );
};

const Macbook: React.FC = () => {
  return (
    <MacBookFrame>
      <Desktop />
    </MacBookFrame>
  );
};

export default Macbook;