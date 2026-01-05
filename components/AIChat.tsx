
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, X, Bot, ShieldCheck, Sparkles, AlertTriangle, Shield, Terminal, Fingerprint, Activity, Zap, Search, ShieldX, Cpu, Settings, BookOpen } from 'lucide-react';

type AIProtocol = 'DEFENSE' | 'OPERATION' | 'OPTIMIZATION';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [protocol, setProtocol] = useState<AIProtocol>('OPERATION');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, protocol?: AIProtocol}[]>([
    { 
      role: 'bot', 
      text: 'Sistemas Nexus Core inicializados. Sou sua interface de inteligência central. Selecione um protocolo acima para começarmos a auditoria ou suporte técnico.',
      protocol: 'OPERATION'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (forcedText?: string) => {
    const messageToSend = forcedText || input;
    if (!messageToSend.trim() || isLoading) return;

    if (!forcedText) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const instructions = {
        DEFENSE: "Você é o Protocolo de Defesa. Foco total em segurança cibernética, análise de malware, assinaturas digitais e proteção de dados. Use tom autoritário e técnico.",
        OPERATION: "Você é o Protocolo de Operação. Foco em suporte ao usuário, guias de instalação passo a passo, resolução de erros de software e compatibilidade de hardware.",
        OPTIMIZATION: "Você é o Protocolo de Otimização. Foco em performance, limpeza de sistema, overclocking seguro e melhoria de latência. Dê dicas práticas de tuning."
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messageToSend,
        config: {
          systemInstruction: `Você é o NEXUS CORE, uma inteligência central de um cofre técnico de arquivos. 
          ${instructions[protocol]}
          
          Sua resposta deve ser estruturada e visualmente organizada. Use emojis técnicos. 
          Sempre termine com uma pequena sugestão de 'Próximo Passo Logístico'.`,
        },
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "Telemetria perdida.", protocol }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Conexão interrompida. Verifique sua rede neural." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[60]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 shadow-[0_20px_50px_rgba(37,99,235,0.3)] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-3xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center group border border-white/10"
        >
          <Cpu size={28} className="text-blue-400 group-hover:text-white transition-colors" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
        </button>
      ) : (
        <div className="bg-white w-[calc(100vw-32px)] sm:w-[520px] h-[min(800px,90vh)] rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                 <Bot size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight uppercase">Nexus Core Intelligence</h4>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Multi-Protocolo Ativo</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Protocol Selector */}
          <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100 border-b border-slate-200">
             <button 
               onClick={() => setProtocol('DEFENSE')}
               className={`py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${protocol === 'DEFENSE' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <Shield size={16} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Defesa</span>
             </button>
             <button 
               onClick={() => setProtocol('OPERATION')}
               className={`py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${protocol === 'OPERATION' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <BookOpen size={16} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Operação</span>
             </button>
             <button 
               onClick={() => setProtocol('OPTIMIZATION')}
               className={`py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${protocol === 'OPTIMIZATION' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <Zap size={16} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Tuning</span>
             </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-6 rounded-[28px] text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white font-bold' 
                    : 'bg-white text-slate-700 border border-slate-100'
                }`}>
                  {m.role === 'bot' && i !== 0 && (
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-50 opacity-60">
                      {m.protocol === 'DEFENSE' && <Shield size={12} className="text-red-500" />}
                      {m.protocol === 'OPERATION' && <BookOpen size={12} className="text-blue-500" />}
                      {m.protocol === 'OPTIMIZATION' && <Zap size={12} className="text-emerald-500" />}
                      <span className="text-[9px] font-black uppercase tracking-widest">Relatório {m.protocol}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Processando Protocolo...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="flex gap-3 p-2 bg-slate-50 border border-slate-100 rounded-[24px] focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  protocol === 'DEFENSE' ? "Analisar risco de..." : 
                  protocol === 'OPERATION' ? "Como instalar o arquivo..." : 
                  "Dicas para otimizar..."
                }
                className="flex-grow text-sm bg-transparent border-none focus:ring-0 px-4 font-semibold outline-none"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
