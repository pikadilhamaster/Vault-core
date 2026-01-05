
import React, { useState } from 'react';
import { X, Copy, Check, Share2, Youtube, ExternalLink, Zap, AlertCircle, Globe } from 'lucide-react';

interface ShareModalProps {
  fileName: string;
  fileId: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ fileName, fileId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedYoutube, setCopiedYoutube] = useState(false);
  
  // Usamos o objeto location para construir a URL base de forma dinâmica e segura.
  // O uso do # (hash) é essencial para evitar Erro 404 em hospedagens estáticas.
  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}#fileId=${fileId}`;
  const youtubeSnippet = `🚀 Link Seguro para Download - ${fileName}: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyYoutube = () => {
    navigator.clipboard.writeText(youtubeSnippet);
    setCopiedYoutube(true);
    setTimeout(() => setCopiedYoutube(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[48px] p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-500 border border-white/20">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-[30px] flex items-center justify-center text-white mb-6 shadow-2xl shadow-blue-500/40">
            <Share2 size={36} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter">Link de Divulgação</h2>
          <p className="text-slate-500 text-sm mt-3 font-medium px-6">
            Compartilhe a página de instalação de <span className="text-blue-600 font-bold">{fileName}</span> com segurança total.
          </p>
        </div>

        <div className="space-y-8">
          <div className="relative group">
            <div className="flex items-center justify-between mb-3 px-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL da Página de Produto</label>
               <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Link Ativo
               </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-[28px] group-hover:border-blue-300 transition-all shadow-inner">
              <input 
                readOnly 
                value={shareUrl} 
                className="flex-grow bg-transparent border-none focus:ring-0 px-5 text-xs font-mono text-slate-500 overflow-hidden text-ellipsis outline-none"
              />
              <button 
                onClick={handleCopy}
                className={`px-6 py-4 rounded-[22px] transition-all flex items-center gap-2 font-black text-[11px] uppercase tracking-widest shadow-lg ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden group/yt shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/yt:opacity-10 transition-opacity">
               <Youtube size={80} />
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <Youtube size={24} className="text-red-500 fill-red-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Para YouTube / Redes</span>
              </div>
            </div>
            
            <div className="bg-white/5 p-5 rounded-3xl text-[12px] font-medium text-slate-400 mb-8 border border-white/5 italic relative z-10">
              "{youtubeSnippet}"
            </div>

            <button 
              onClick={handleCopyYoutube}
              className={`w-full py-5 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative z-10 ${copiedYoutube ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-900 hover:bg-blue-50 shadow-white/10'}`}
            >
              {copiedYoutube ? <Check size={18} /> : <Zap size={18} />}
              {copiedYoutube ? 'Pronto para Colar' : 'Copiar Snippet'}
            </button>
          </div>
          
          <div className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
             <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
             <p className="text-[11px] text-blue-900 font-bold leading-relaxed uppercase tracking-tight">
                Nota Técnica: O link utiliza roteamento via âncora (#) para garantir 100% de compatibilidade e evitar o Erro 404 em qualquer servidor.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
