
import React from 'react';
import GlassCard from './GlassCard';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <GlassCard className="text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-700 font-medium text-lg">{message}</p>
        <p className="text-slate-500 text-sm">Please keep this window open.</p>
      </div>
    </GlassCard>
  );
};

export default Loader;
