
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t technical-border py-12 mt-12">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <span className="font-black text-xs text-slate-900 tracking-tighter uppercase">Vault.core</span>
          <span className="mono text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Hash-Verification-Active</span>
        </div>
        
        <div className="flex gap-10 mono text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
           <a href="#" className="hover:text-blue-600 transition-colors">Infrastructure</a>
           <a href="#" className="hover:text-blue-600 transition-colors">Forensics</a>
           <a href="#" className="hover:text-blue-600 transition-colors">Uptime</a>
        </div>

        <p className="mono text-[9px] text-slate-400 font-bold uppercase tracking-widest">© 2024 Nexus Operations</p>
      </div>
    </footer>
  );
};
