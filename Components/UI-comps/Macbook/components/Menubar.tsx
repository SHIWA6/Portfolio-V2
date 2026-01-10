import React from "react"
import {useState , useEffect} from "react"

const MenuBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-7 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center px-4 text-white text-xs">
      <div className="flex items-center gap-4">
        <span className="font-semibold"></span>
        <button className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors">File</button>
        <button className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors">Edit</button>
        <button className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors">View</button>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 border border-white/60 rounded-sm relative">
            <div className="absolute inset-0.5 bg-white/80 rounded-sm" />
          </div>
        </div>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>{time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
};

export default MenuBar;