
import React, { useState, useMemo, useEffect } from 'react';
import { Footer } from './components/Footer';
import { FileCard } from './components/FileCard';
import { UploadForm } from './components/UploadForm';
import { AIChat } from './components/AIChat';
import { FILES, CATEGORIES } from './constants';
import { Search, Plus, ChevronLeft, Shield, Lock, Unlock, Key, Settings, Database, Activity, CheckCircle2, Box, Calendar, ArrowLeft, Cpu, Sparkles, Download, EyeOff, Eye } from 'lucide-react';
import { FileItem, TabType } from './types';

const SESSION_FILES = new Map<string, File>();

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<TabType>('public');
  const [sharedFileId, setSharedFileId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'config'>('overview');
  const [userFiles, setUserFiles] = useState<FileItem[]>([]);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [showPassInput, setShowPassInput] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/fileId=([^&]+)/);
      const newId = match ? match[1] : null;
      
      setSharedFileId(newId);
      setIsUnlocked(false);
      setUnlockPassword('');
      setAuthError(false);
      setDownloadComplete(false);
      setDownloadProgress(0);
      setIsDownloading(false);
      setActiveDetailTab('overview');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    const saved = localStorage.getItem('cloudvault_user_files');
    if (saved) {
      try { setUserFiles(JSON.parse(saved)); } catch (e) { console.error(e); }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const allAvailableFiles = useMemo(() => [...FILES, ...userFiles], [userFiles]);

  const filteredFiles = useMemo(() => {
    let base = allAvailableFiles;
    if (activeTab === 'restricted') {
      base = allAvailableFiles.filter(f => f.password);
    } else if (activeTab === 'public') {
      base = allAvailableFiles.filter(f => !f.password);
    }

    return base.filter(file => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = file.name.toLowerCase().includes(term) || file.description.toLowerCase().includes(term);
      const matchesCategory = activeCategory === 'Todos' || file.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, allAvailableFiles, activeTab]);

  const sharedFile = useMemo(() => {
    if (!sharedFileId) return null;
    return allAvailableFiles.find(f => f.id === sharedFileId);
  }, [sharedFileId, allAvailableFiles]);

  const handleStartDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadComplete(true);
          triggerRealDownload();
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);
  };

  const triggerRealDownload = () => {
    if (!sharedFile) return;
    const realFile = SESSION_FILES.get(sharedFile.id);
    const blob = realFile ? realFile : new Blob([`Nexus Data: ${sharedFile.name}`], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = realFile ? realFile.name : `${sharedFile.name}.zip`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 100);
  };

  const handleUnlock = () => {
    if (sharedFile?.password === unlockPassword) {
      setIsUnlocked(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const handleAddFile = (newFile: FileItem, realFile?: File) => {
    if (realFile) SESSION_FILES.set(newFile.id, realFile);
    const updated = [newFile, ...userFiles];
    setUserFiles(updated);
    localStorage.setItem('cloudvault_user_files', JSON.stringify(updated));
    setShowUploadModal(false);
    setActiveTab(newFile.password ? 'restricted' : 'public');
  };

  const resetToHome = () => {
    window.location.hash = '';
    setActiveTab('public');
    setSearchTerm('');
    setActiveCategory('Todos');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b technical-border">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={resetToHome} className="flex items-center gap-2 group">
              <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Shield className="text-white w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm tracking-tighter uppercase text-slate-900">Vault.core</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowUploadModal(true)} className="mono text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2 px-3 py-1.5 rounded-md">
              <Plus size={14} /> NOVO DEPLOY
            </button>
            <div className="w-px h-4 bg-slate-200"></div>
            <button onClick={() => { window.location.hash = ''; setActiveTab('restricted'); }} className={`mono text-[10px] font-bold px-3 py-1.5 rounded-md transition-all uppercase flex items-center gap-2 border ${activeTab === 'restricted' ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' : 'text-slate-600 border-transparent hover:bg-slate-50'}`}>
              <Lock size={12} /> Cofre
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-6 py-10">
        {sharedFile ? (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <button onClick={() => window.location.hash = ''} className="mono text-[10px] text-slate-400 hover:text-blue-600 mb-8 flex items-center gap-2 uppercase font-bold tracking-widest group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Diretório
            </button>

            {sharedFile.password && !isUnlocked ? (
              <div className="bg-white border technical-border rounded-[40px] p-12 text-center shadow-2xl shadow-slate-200/50 max-w-2xl mx-auto">
                 <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center mx-auto mb-8 text-white shadow-xl ring-8 ring-slate-50">
                    <Key size={32} />
                 </div>
                 <h2 className="text-3xl font-black mb-3 tracking-tighter text-slate-900 uppercase">Objeto Restrito</h2>
                 <p className="text-slate-400 text-[11px] mono uppercase font-bold mb-10 px-10">Recurso sob proteção Nexus. Insira a chave.</p>
                 <div className="max-w-xs mx-auto space-y-4">
                    <div className={`relative flex items-center gap-3 bg-slate-50 border technical-border p-1.5 rounded-2xl ${authError ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}>
                       <Unlock size={18} className={`ml-4 ${authError ? 'text-red-500' : 'text-slate-400'}`} />
                       <input type={showPassInput ? "text" : "password"} placeholder="Insira a senha..." className="bg-transparent border-none outline-none px-2 py-3 w-full text-sm font-bold" value={unlockPassword} onChange={(e) => setUnlockPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} />
                       <button onClick={() => setShowPassInput(!showPassInput)} className="mr-4 text-slate-300">{showPassInput ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                    {authError && <p className="text-[9px] font-black text-red-500 uppercase animate-pulse">Falha na Autenticação</p>}
                    <button onClick={handleUnlock} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all">Liberar Acesso</button>
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
                <div className="lg:col-span-8 space-y-8">
                  <div className="bg-white technical-border rounded-[40px] overflow-hidden shadow-sm">
                    <div className="flex border-b technical-border">
                       <button onClick={() => setActiveDetailTab('overview')} className={`flex-1 py-5 mono text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeDetailTab === 'overview' ? 'bg-white text-blue-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}><Database size={14} /> Visão Geral</button>
                       <button onClick={() => setActiveDetailTab('config')} className={`flex-1 py-5 mono text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeDetailTab === 'config' ? 'bg-white text-blue-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}><Settings size={14} /> Suporte IA</button>
                    </div>
                    <div className="p-10">
                      {activeDetailTab === 'overview' ? (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                           <div className="flex items-center gap-3 mb-6">
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg mono text-[10px] font-black uppercase">{sharedFile.category}</span>
                              <span className="mono text-[10px] text-slate-300 font-bold uppercase tracking-widest">Build: {sharedFile.id}</span>
                           </div>
                           <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-6">{sharedFile.name}</h1>
                           <p className="text-slate-500 text-xl font-medium leading-relaxed mb-10">{sharedFile.description}</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border technical-border">
                              <div className="space-y-4">
                                 <h4 className="mono text-[10px] font-black text-slate-400 uppercase">Status Auditoria</h4>
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><Shield size={20} /></div>
                                    <div><p className="text-[11px] font-black text-slate-900 uppercase">Binário Seguro</p><p className="text-[9px] mono text-emerald-600 font-bold">SHA-256 Validado</p></div>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h4 className="mono text-[10px] font-black text-slate-400 uppercase">Estatísticas</h4>
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Activity size={20} /></div>
                                    <div><p className="text-[11px] font-black text-slate-900 uppercase">{sharedFile.size}</p><p className="text-[9px] mono text-blue-600 font-bold">100% Integridade</p></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                           <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                              <Sparkles size={20} className="text-blue-600 shrink-0 mt-0.5" />
                              <p className="text-[11px] font-bold text-blue-900 uppercase">A IA Nexus Core v3 pode analisar este binário em tempo real para fornecer instruções de uso e segurança.</p>
                           </div>
                           <button onClick={() => { const btn = document.querySelector('button .lucide-cpu'); if (btn) (btn.parentElement as HTMLButtonElement).click(); }} className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl"><Cpu size={20} /> Consultar Nexus sobre este Arquivo</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white technical-border rounded-[40px] p-8 shadow-xl sticky top-24">
                     <h3 className="mono text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Transferência Core</h3>
                     {isDownloading ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                           <div className="flex justify-between items-end mb-2">
                              <span className="mono text-[10px] font-black text-blue-600 uppercase animate-pulse">Puxando Dados...</span>
                              <span className="mono text-xs font-bold text-slate-900">{Math.round(downloadProgress)}%</span>
                           </div>
                           <div className="h-4 bg-slate-100 rounded-full overflow-hidden border p-1"><div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${downloadProgress}%` }} /></div>
                        </div>
                     ) : downloadComplete ? (
                        <div className="text-center py-6 animate-in zoom-in duration-500">
                           <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={32} /></div>
                           <h4 className="text-lg font-black text-slate-900 uppercase mb-8">Deploy Concluído</h4>
                           <button onClick={() => setDownloadComplete(false)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200">Baixar Novamente</button>
                        </div>
                     ) : (
                        <button onClick={handleStartDownload} className="w-full py-6 bg-blue-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95"><Download size={20} className="group-hover:animate-bounce" /> Liberar Download</button>
                     )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'restricted' && (
              <button onClick={resetToHome} className="mb-8 flex items-center gap-2 group text-slate-400 hover:text-slate-900 transition-colors">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200"><ArrowLeft size={16} /></div>
                <span className="mono text-[10px] font-black uppercase tracking-widest">Início</span>
              </button>
            )}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-16">
               <div className="flex items-center gap-2 bg-white border technical-border p-2 rounded-2xl w-full md:w-96 shadow-sm focus-within:ring-4 focus-within:ring-blue-600/5 transition-all">
                  <Search size={18} className="ml-3 text-slate-300" />
                  <input type="text" placeholder="Pesquisar no diretório..." className="bg-transparent border-none outline-none px-2 py-2 w-full text-sm font-semibold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
               </div>
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-4 md:pb-0">
                 {CATEGORIES.map(cat => (
                   <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-xl mono text-[10px] font-bold uppercase tracking-widest transition-all border shrink-0 ${activeCategory === cat ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white technical-border text-slate-400 hover:border-slate-300'}`}>{cat}</button>
                 ))}
               </div>
            </div>
            {filteredFiles.length > 0 ? (
              <div className="bento-grid">
                {filteredFiles.map(file => <FileCard key={file.id} file={file} />)}
              </div>
            ) : (
              <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed technical-border rounded-[60px] bg-slate-50/50">
                 <div className="w-24 h-24 bg-white rounded-[40px] border technical-border flex items-center justify-center mb-8 text-slate-200"><Box size={40} /></div>
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10">Diretório Sem Deploys</h2>
                 <button onClick={() => setShowUploadModal(true)} className="px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl flex items-center gap-3"><Plus size={20} /> Novo Deploy</button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      <AIChat />
      {showUploadModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <UploadForm onAddFile={handleAddFile} onClose={() => setShowUploadModal(false)} />
        </div>
      )}
    </div>
  );
};

export default App;
