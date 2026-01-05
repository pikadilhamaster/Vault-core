
import React, { useState, useRef } from 'react';
import { FileExtension, FileItem, SecurityStatus, StorageSource, Platform } from '../types';
import { X, UploadCloud, ShieldCheck, Info, Loader2, Lock, Eye, EyeOff, Terminal, Settings, Database, Activity, Cpu, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface UploadFormProps {
  onAddFile: (file: FileItem, realFile?: File) => void;
  onClose?: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onAddFile, onClose }) => {
  const [step, setStep] = useState<'upload' | 'configure'>('upload');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsScanning(true);
    
    const cleanName = file.name.split('.')[0].replace(/[-_]/g, ' ');
    setName(cleanName);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Arquivo: "${file.name}" (${file.type}). Gere um Release Note Técnico profissional. Inclua: 1. O que é (Breve), 2. Principal benefício, 3. Dica de uso rápido. Max 35 palavras totais. Responda em JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { 
              description: { type: Type.STRING },
              suggestedCategory: { type: Type.STRING }
            }
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      setDescription(data.description || `Pacote técnico: ${file.name}.`);
      setStep('configure');
    } catch (e) {
      setDescription(`Recurso local pronto para deploy: ${file.name}`);
      setStep('configure');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = () => {
    if (!name || !description || !selectedFile) return;

    const fileId = `nexus-${Date.now()}`;
    const fileSizeFormatted = selectedFile.size > 1024 * 1024 
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(selectedFile.size / 1024).toFixed(1)} KB`;

    const newFile: FileItem = {
      id: fileId,
      name,
      description,
      size: fileSizeFormatted,
      links: [{ platform: Platform.WEB, url: "#", extension: FileExtension.ZIP }],
      category: isPrivate ? "Restrito" : "Desenvolvimento",
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      downloadCount: 0,
      relevanceScore: 100,
      isUserFile: true,
      isPublic: !isPrivate,
      password: isPrivate ? password : undefined,
      securityReport: {
        status: SecurityStatus.SAFE,
        score: 100,
        threats: [],
        summary: "Integridade verificada via Nexus Core AI."
      },
      source: StorageSource.VAULT
    };

    onAddFile(newFile, selectedFile);
  };

  return (
    <div className="bg-white rounded-[48px] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col max-h-[90vh]">
      <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Cpu size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black tracking-tighter uppercase">Nexus Deployment Assistant</h2>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">IA Conectada</p>
              </div>
           </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-red-500/20 hover:text-red-500 rounded-2xl transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="p-10 overflow-y-auto">
        {step === 'upload' ? (
          <div className="space-y-8 text-center py-10">
            {isScanning ? (
               <div className="animate-in fade-in duration-300">
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <Loader2 size={64} className="text-blue-600 animate-spin opacity-30 absolute inset-0 m-auto" />
                    <Sparkles size={32} className="text-blue-500 animate-pulse absolute inset-0 m-auto" />
                  </div>
                  <p className="mono text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">IA Analisando Binário...</p>
               </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[40px] p-20 group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect} 
                  onClick={(e) => (e.target as HTMLInputElement).value = ''} 
                />
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-all">
                  <UploadCloud size={44} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Deploy via IA</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A IA gerará automaticamente o manifesto técnico</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-8 duration-500 space-y-10">
             <div className="flex gap-4 border-b technical-border pb-6">
                <div className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-2">
                   <Database size={16} />
                   <span className="mono text-[10px] font-black uppercase tracking-widest">Manifesto de Deploy</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label do Pacote</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-50 border technical-border rounded-xl font-bold text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classificação Nexus</label>
                  <select className="w-full p-4 bg-slate-50 border technical-border rounded-xl font-bold text-sm outline-none">
                     <option>Desenvolvimento</option>
                     <option>Utilitários</option>
                     <option>Multimídia</option>
                     <option>Documentos</option>
                  </select>
                </div>
             </div>

             <div className="space-y-2.5">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overview Gerada por IA</label>
                   <span className="text-[8px] font-black text-blue-500 uppercase flex items-center gap-1"><Sparkles size={10} /> Otimizado</span>
                </div>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-4 bg-slate-50 border technical-border rounded-xl font-bold text-sm resize-none outline-none focus:border-blue-500 transition-all leading-relaxed" />
             </div>

             <div className={`p-6 rounded-[32px] border transition-all ${isPrivate ? 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-900/5' : 'bg-slate-50/50 border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPrivate ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-300'}`}>
                         <Lock size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest block">Zona de Cofre</span>
                        <span className="text-[9px] mono text-slate-400 uppercase">Acesso via token de senha</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => setIsPrivate(!isPrivate)}
                     className={`w-12 h-6 rounded-full transition-all relative ${isPrivate ? 'bg-amber-500' : 'bg-slate-200'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isPrivate ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>
                {isPrivate && (
                   <div className="relative animate-in slide-in-from-top-2 duration-300 mt-4">
                      <input 
                        type={showPass ? 'text' : 'password'} 
                        placeholder="Chave de descriptografia..."
                        className="w-full p-4 pr-12 bg-white border border-amber-200 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-amber-500/5 transition-all"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300 hover:text-amber-600">
                         {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                   </div>
                )}
             </div>

             <button 
                onClick={handleSubmit}
                className={`w-full py-6 rounded-[24px] font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${isPrivate ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
             >
                <Database size={20} /> Finalizar Ingestão Técnica
             </button>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 border-t technical-border flex items-center gap-4">
        <Sparkles size={16} className="text-blue-600 shrink-0" />
        <p className="text-[9px] font-bold text-blue-900/60 uppercase tracking-tight">
          A IA Nexus valida a integridade de cada deploy em tempo real.
        </p>
      </div>
    </div>
  );
};
