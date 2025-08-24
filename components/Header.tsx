
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 pb-2">
        VEO-3 Video Generator
      </h1>
      <p className="text-slate-600 text-lg">
        Bring your ideas to life with AI-powered video creation.
      </p>
    </header>
  );
};

export default Header;
