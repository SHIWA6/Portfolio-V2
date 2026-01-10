import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { Terminal, Folder, Code, Mail, User, Github, Linkedin, FileText, X, Minus, Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import images from 'next/image';
import Dock from "./components/Dock"
import Window from "./components/Window"
import MenuBar from "./components/Menubar"
import ContactApp from "./Apps/ContactApp"
import MacBookFrame from "./components/MacbookFrame"

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isFocused: boolean;
}

interface AppConfig {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  component: React.ComponentType<unknown>;
}


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


const useAudioPlayer = (playlist: Track[]) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && playlist[currentTrackIndex]) {
      audioRef.current.src = playlist[currentTrackIndex].src;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex, playlist]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const next = useCallback(() => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, playlist.length]);

  const previous = useCallback(() => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  return {
    currentTrack: playlist[currentTrackIndex],
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    pause,
  };
};
// ============================================================================
// COMPONENTS
// ============================================================================
interface MusicAppProps {
  playlist: Track[];
}

const MusicApp: React.FC<MusicAppProps> = ({ playlist }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
  } = useAudioPlayer(playlist);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No tracks in playlist
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 p-8 flex flex-col items-center justify-center">
      <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl shadow-2xl mb-6 flex items-center justify-center overflow-hidden">
        {currentTrack.cover ? (
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full" />
        ) : (
          <Music className="w-24 h-24 text-white opacity-50" />
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentTrack.title}</h2>
      <p className="text-gray-600 mb-6">{currentTrack.artist}</p>

      <div className="w-full max-w-md mb-6">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-500"
          aria-label="Seek track position"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={previous}
          className="p-3 rounded-full hover:bg-white/50 transition-colors disabled:opacity-50"
          aria-label="Previous track"
        >
          <SkipBack className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>
        <button
          onClick={next}
          className="p-3 rounded-full hover:bg-white/50 transition-colors disabled:opacity-50"
          aria-label="Next track"
        >
          <SkipForward className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full max-w-xs">
        <Volume2 className="w-5 h-5 text-gray-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-500"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
};

const AboutApp: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
    <p className="text-gray-600 leading-relaxed">
      TypeScript developer specializing in modern web applications with React, Node.js, and cloud-native architectures.
    </p>
    <div className="flex gap-4 mt-6">
      <div className="flex items-center gap-2 text-gray-700">
        <Github className="w-5 h-5" />
        <span>github.com/yourname</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <Linkedin className="w-5 h-5" />
        <span>linkedin.com/in/yourname</span>
      </div>
    </div>
  </div>
);

const ProjectsApp: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-2xl font-bold text-gray-800">Featured Projects</h2>
    {[
      { name: 'E-Commerce Platform', tech: 'React, TypeScript, Node.js', desc: 'Full-stack marketplace' },
      { name: 'Analytics Dashboard', tech: 'React, D3.js, WebSocket', desc: 'Real-time visualization' },
      { name: 'DevOps Pipeline', tech: 'Docker, K8s, GitHub Actions', desc: 'Automated CI/CD' },
    ].map((project, i) => (
      <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800">{project.name}</h3>
        <p className="text-sm text-blue-600 mt-1">{project.tech}</p>
        <p className="text-sm text-gray-600 mt-2">{project.desc}</p>
      </div>
    ))}
  </div>
);

const SkillsApp: React.FC = () => (
  <div className="p-8 space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Technical Skills</h2>
    {[
      { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Go'] },
      { category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Redux'] },
      { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'] },
      { category: 'DevOps', items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'] },
    ].map((skill, i) => (
      <div key={i}>
        <h3 className="font-semibold text-gray-700 mb-2">{skill.category}</h3>
        <div className="flex flex-wrap gap-2">
          {skill.items.map((item, j) => (
            <span key={j} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const TerminalApp: React.FC = () => (
  <div className="bg-gray-900 text-green-400 p-4 font-mono text-sm h-full">
    <div>$ whoami</div>
    <div className="text-gray-400">typescript-developer</div>
    <div className="mt-4">$ ls skills/</div>
    <div className="text-gray-400">react.ts  node.ts  typescript.ts  aws.conf</div>
    <div className="mt-4">$ cat mission.txt</div>
    <div className="text-gray-400">Building exceptional web experiences with clean, type-safe code.</div>
    <div className="mt-4">$ █</div>
  </div>
);

const ResumeApp: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-2xl font-bold text-gray-800">Resume</h2>
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg text-gray-800">Senior TypeScript Developer</h3>
        <p className="text-gray-600">Tech Corp • 2022 - Present</p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>Led development of microservices architecture</li>
          <li>Mentored junior developers in TypeScript best practices</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-800">Full Stack Developer</h3>
        <p className="text-gray-600">Startup Inc • 2020 - 2022</p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>Built responsive web applications with React</li>
          <li>Implemented RESTful APIs with Node.js</li>
        </ul>
      </div>
    </div>
  </div>
);



const Desktop: React.FC = () => {
  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    updateWindowPosition,
  } = useWindowManager();

  const samplePlaylist: Track[] = [
    {
      id: '1',
      cover: '/images/stronger-cover.jpg',
      title: 'Stronger',
      artist: 'Kanye West',
      src: "/music/kanye-stronger.mp3",
    },
    {
      id: '2',
      title: 'Sample Track 2',
      artist: 'Artist Name',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
  ];

  const apps: AppConfig[] = [
    { id: 'about', name: 'About Me', icon: User, color: 'bg-blue-500', component: AboutApp },
    { id: 'projects', name: 'Projects', icon: Folder, color: 'bg-yellow-500', component: ProjectsApp },
    { id: 'skills', name: 'Skills', icon: Code, color: 'bg-green-500', component: SkillsApp },
    { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-gray-800', component: TerminalApp },
    { id: 'resume', name: 'Resume', icon: FileText, color: 'bg-red-500', component: ResumeApp },
    { id: 'contact', name: 'Contact', icon: Mail, color: 'bg-purple-500', component: ContactApp },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-pink-500', component: () => <MusicApp playlist={samplePlaylist} /> },
  ];

  const handleAppClick = (appId: string) => {
  const existingWindow = windows.find(w => w.appId === appId);
  
  if (existingWindow) {
    if (existingWindow.isMinimized) {
      // If minimized, bring it back
      focusWindow(existingWindow.id);
      setWindows(prev => prev.map(w => 
        w.id === existingWindow.id ? { ...w, isMinimized: false } : w
      ));
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
  className="
    h-full w-full
    bg-[url('/images/peakpxx.jpg')]
    bg-cover bg-center bg-no-repeat
    relative
  "
>

      <div className="absolute inset-0 bg-black/20" />
      
      <MenuBar />

      <div className="absolute inset-0 pt-7">
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