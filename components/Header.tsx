
import React from 'react';
import { MusicNoteIcon } from './icons/MusicNoteIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 rounded-lg bg-white/60 shadow-md backdrop-blur-sm">
      <div className="flex items-center justify-center gap-4">
        <div className="text-amber-400">
            <MusicNoteIcon />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-700 tracking-tight">
          VEO Video Generator
        </h1>
      </div>
      <p className="mt-2 text-lg text-slate-600">Barbara Edition ✨</p>
    </header>
  );
};

export default Header;