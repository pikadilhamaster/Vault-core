
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, X, Bot, Shield, Zap, Cpu, BookOpen, Sparkles, Loader2, RefreshCcw } from 'lucide-react';

type AIProtocol = 'DEFENSE' | 'OPERATION' | 'OPTIMIZATION';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [protocol, setProtocol] = useState<AIProtocol>('OPERATION');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, protocol?: AIProtocol}[]>([
    { 
      role: 'bot', 
      text: 'Sistemas Nexus Core Intelligence v3 inicializados. Estou pronto para gerenciar sua segurança ou otimizar seus deploys. Qual protocolo deseja ativar?',
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
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToUse = customPrompt || input;
    if (!textToUse.trim() || isLoading) return;

    if (!customPrompt) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToUse }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const protocolSystemInstructions = {
        DEFENSE: "Você é o PROTOCOLO DE DEFESA. Foco em segurança máxima, criptografia, SHA-256 e análise de riscos. Seja formal e técnico.",
        OPERATION: "Você é o PROTOCOLO DE OPERAÇÃO. Foco em guias passo a passo, instalação e compatibilidade de software. Seja útil e didático.",
        OPTIMIZATION: "Você é o PROTOCOLO DE OTIMIZAÇÃO. Foco em velocidade, performance de hardware e economia de recursos. Seja direto e eficiente."
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: textToUse,
        config: {
          systemInstruction: `${protocolSystemInstructions[protocol]} 
          Responda sempre em Português-BR. Utilize formatação Markdown. 
          Finalize com um código de status [OK-NEXUS-7].`,
        },
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "Sem resposta do núcleo.", protocol }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Erro na ponte neural. Verifique sua chave de acesso ou conexão." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 shadow-2xl text-white w-16 h-16 rounded-[24px] transition-all hover:scale-110 active:scale-95 flex items-center justify-center group border border-white/10"
        >
          <Cpu size={28} className="text-blue-400 group-hover:text-white transition-colors" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
        </button>
      ) : (
        <div className="bg-white w-[90vw] sm:w-[420px] h-[650px] rounded-[40px] shadow-2xl border technical-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                 <Bot size={22} />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-tight">Nexus Core Intelligence</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Protocolo Ativo: {protocol}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="flex p-1.5 bg-slate-100 border-b technical-border gap-1">
             {(['DEFENSE', 'OPERATION', 'OPTIMIZATION'] as AIProtocol[]).map(p => (
               <button 
                key={p}
                onClick={() => setProtocol(p)}
                className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${protocol === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {p === 'DEFENSE' && <Shield size={14} />}
                 {p === 'OPERATION' && <BookOpen size={14} />}
                 {p === 'OPTIMIZATION' && <Zap size={14} />}
                 <span className="text-[7px] font-black uppercase tracking-tighter">{p.slice(0, 3)}</span>
               </button>
             ))}
          </div>

          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[24px] text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white font-semibold' 
                    : 'bg-white text-slate-700 border border-slate-100 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border technical-border flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Processando...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t technical-border">
            <div className="flex gap-2 p-1.5 bg-slate-50 border technical-border rounded-[20px] focus-within:border-blue-500 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Comando de ${protocol.toLowerCase()}...`}
                className="flex-grow text-xs bg-transparent border-none focus:ring-0 px-3 font-semibold outline-none"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-20"
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
