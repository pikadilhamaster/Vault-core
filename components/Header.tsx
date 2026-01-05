
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">DL</span>
          </div>
          <span className="font-bold text-gray-800 text-lg tracking-tight">CloudFiles</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Início</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Categorias</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Ajuda</a>
          <a href="#" className="bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors">Acessar</a>
        </nav>
      </div>
    </header>
  );
};
