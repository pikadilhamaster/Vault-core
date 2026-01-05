
import React, { memo } from 'react';
import { FileItem } from '../types';
import { ChevronRight, Cpu, ShieldCheck, Globe, Lock, Calendar } from 'lucide-react';

interface FileCardProps {
  file: FileItem;
}

export const FileCard: React.FC<FileCardProps> = memo(({ file }) => {
  const isLocked = !!file.password;

  const navigateToDetails = () => {
    window.location.hash = `fileId=${file.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      onClick={navigateToDetails}
      className={`group bg-white technical-border rounded-[32px] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer flex flex-col h-full active:scale-[0.98] border border-transparent ${isLocked ? 'hover:border-amber-400/30' : 'hover:border-blue-400/30'}`}
    >
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
           <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm ring-4 ring-slate-50 ${isLocked ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}>
              {isLocked ? <Lock size={20} /> : <Cpu size={22} />}
           </div>
           <div className="flex flex-col">
              <span className={`mono text-[9px] font-black uppercase tracking-widest ${isLocked ? 'text-amber-600' : 'text-slate-400'}`}>
                {isLocked ? 'Vault::Protected' : 'Global::Public'}
              </span>
              <span className="mono text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                 <ShieldCheck size={10} /> Integridade OK
              </span>
           </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="mono text-[10px] font-bold text-slate-400 uppercase bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">{file.size}</span>
          <div className="flex items-center gap-1 text-[8px] mono font-black text-slate-300 uppercase">
            <Calendar size={10} /> {file.updatedAt}
          </div>
        </div>
      </div>

      <h3 className="font-extrabold text-slate-900 text-lg mb-3 tracking-tighter group-hover:text-blue-600 transition-colors">
        {file.name}
      </h3>
      
      <p className="text-[12px] text-slate-500 mb-8 line-clamp-2 leading-relaxed font-medium flex-grow opacity-80">
        {file.description}
      </p>

      <div className="mt-auto pt-6 border-t technical-border flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase mono">
              <Globe size={11} className="opacity-40" /> {file.links.length} Mirrors
           </div>
           {isLocked && (
             <div className="text-[9px] font-black text-amber-600 uppercase mono flex items-center gap-1">
               <Lock size={10} /> Encrypted
             </div>
           )}
        </div>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isLocked ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-300 group-hover:bg-slate-900 group-hover:text-white'}`}>
           <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
});
