
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, X, Bot, Shield, Zap, Cpu, BookOpen, Sparkles, Loader2 } from 'lucide-react';

type AIProtocol = 'DEFENSE' | 'OPERATION' | 'OPTIMIZATION';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [protocol, setProtocol] = useState<AIProtocol>('OPERATION');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, protocol?: AIProtocol}[]>([
    { 
      role: 'bot', 
      text: 'Sistemas Nexus Core Intelligence 7.0 inicializados. Protocolo de Operação ativo por padrão. Como posso auxiliar seu deploy hoje?',
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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    const currentProtocol = protocol;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("Nexus Key não encontrada. Configure o ambiente.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const instructions = {
        DEFENSE: "Você é o Protocolo de Defesa Nexus. Seu foco é segurança cibernética extrema, análise de vulnerabilidades, SHA-256 e forense digital. Use terminologia técnica pesada e tom de vigilância.",
        OPERATION: "Você é o Protocolo de Operação Nexus. Seu foco é guiar o usuário em instalações, explicar compatibilidade de arquivos e facilitar o acesso aos binários do cofre.",
        OPTIMIZATION: "Você é o Protocolo de Otimização Nexus. Seu foco é performance, tuning de sistema, redução de latência e eficiência de recursos. Dê dicas de 'power user'."
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `Você é o NEXUS CORE, a inteligência central deste site de downloads técnicos.
          Protocolo Ativo: ${instructions[currentProtocol]}
          
          Regras:
          1. Responda em Português-BR.
          2. Use Markdown para listas e negrito.
          3. Seja conciso mas extremamente técnico.
          4. Adicione um 'Log de Status' ao final de cada resposta.`,
        },
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "Sem telemetria.", protocol: currentProtocol }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "ERRO DE CONEXÃO: Não foi possível acessar o Nexus Central. Verifique se a API Key está configurada corretamente no ambiente de deploy." 
      }]);
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
        <div className="bg-white w-[90vw] sm:w-[450px] h-[600px] rounded-[32px] shadow-2xl border technical-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                 <Bot size={22} />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-tighter">Nexus Core Intelligence</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Sincronizado</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-0.5 p-1 bg-slate-100 border-b technical-border">
             {(['DEFENSE', 'OPERATION', 'OPTIMIZATION'] as AIProtocol[]).map((p) => (
               <button 
                 key={p}
                 onClick={() => setProtocol(p)}
                 className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${protocol === p ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {p === 'DEFENSE' && <Shield size={12} />}
                  {p === 'OPERATION' && <BookOpen size={12} />}
                  {p === 'OPTIMIZATION' && <Zap size={12} />}
                  <span className="text-[8px] font-black uppercase tracking-tighter">{p.slice(0, 3)}</span>
               </button>
             ))}
          </div>

          <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-4 bg-slate-50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white font-semibold' 
                    : 'bg-white text-slate-700 shadow-sm border technical-border'
                }`}>
                  {m.role === 'bot' && m.protocol && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50 opacity-50">
                       <span className="text-[8px] font-black uppercase tracking-widest">{m.protocol} REPORT</span>
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border technical-border flex items-center gap-3">
                  <Loader2 size={14} className="animate-spin text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processando...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t technical-border">
            <div className="flex gap-2 p-1.5 bg-slate-50 border technical-border rounded-xl">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Comando Nexus..."
                className="flex-grow text-xs bg-transparent border-none focus:ring-0 px-3 font-semibold"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-20"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
