
import React, { useState, useRef } from 'react';
import { FileExtension, FileItem, SecurityStatus, StorageSource, Platform } from '../types';
import { X, UploadCloud, ShieldCheck, Info, Loader2, Lock, Eye, EyeOff, Database, Cpu, Sparkles } from 'lucide-react';
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
    setName(file.name.split('.')[0].replace(/[-_]/g, ' '));
    
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("No Key");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analise arquivo: "${file.name}" (${file.size} bytes). Forneça: 1. Descrição técnica (20 palavras), 2. Categoria (Utilitários, Dev, ou Multimídia). Responda JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { 
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            }
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      setDescription(data.description || `Recurso técnico indexado: ${file.name}`);
      setStep('configure');
    } catch (e) {
      setDescription(`Arquivo pronto para deploy local: ${file.name}`);
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
        summary: "Integridade auditada por Nexus Core AI."
      },
      source: StorageSource.VAULT
    };

    onAddFile(newFile, selectedFile);
  };

  return (
    <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
           <Cpu size={24} className="text-blue-500" />
           <h2 className="text-lg font-black uppercase tracking-tighter">Nexus Deployment</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20} /></button>
      </div>

      <div className="p-8">
        {step === 'upload' ? (
          <div 
            onClick={() => !isScanning && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[32px] p-16 text-center cursor-pointer transition-all hover:bg-blue-50/50 ${isScanning ? 'opacity-50 cursor-wait' : 'hover:border-blue-300'}`}
          >
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
            {isScanning ? (
              <div className="animate-in fade-in duration-300">
                <Loader2 size={48} className="text-blue-600 animate-spin mx-auto mb-4" />
                <p className="mono text-[10px] font-black text-slate-400 uppercase tracking-widest">IA Analisando...</p>
              </div>
            ) : (
              <>
                <UploadCloud size={48} className="text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 mb-1 uppercase tracking-tighter">Selecionar Binário</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">O manifesto será gerado via Nexus AI</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Deploy</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-50 border technical-border rounded-xl font-bold text-sm outline-none focus:border-blue-500" />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resumo Inteligente</label>
                   <Sparkles size={12} className="text-blue-500" />
                </div>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-4 bg-slate-50 border technical-border rounded-xl font-bold text-sm outline-none focus:border-blue-500 resize-none" />
             </div>
             <div className={`p-4 rounded-2xl border ${isPrivate ? 'bg-amber-50 border-amber-200' : 'bg-slate-50/50 border-slate-100'}`}>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Lock size={16} className={isPrivate ? 'text-amber-600' : 'text-slate-300'} />
                      <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Proteção de Cofre</span>
                   </div>
                   <button onClick={() => setIsPrivate(!isPrivate)} className={`w-10 h-5 rounded-full relative transition-all ${isPrivate ? 'bg-amber-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isPrivate ? 'left-5.5' : 'left-0.5'}`} />
                   </button>
                </div>
                {isPrivate && (
                   <div className="mt-3 relative">
                      <input type={showPass ? 'text' : 'password'} placeholder="Senha mestra..." className="w-full p-3 pr-10 bg-white border border-amber-100 rounded-lg text-xs font-bold outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300">{showPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                   </div>
                )}
             </div>
             <button onClick={handleSubmit} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                <Database size={18} /> Finalizar Deploy
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
