
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  text?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ children, text, ...props }) => {
  return (
    <button
      {...props}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white/50 text-slate-700 font-semibold rounded-lg border border-white/30 shadow-md hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
      {text && <span>{text}</span>}
    </button>
  );
};

export default IconButton;
