
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulando autenticação real
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Usuário Cloud',
      email: email
    };
    onSuccess(mockUser);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          {isLogin ? 'Acesse seus arquivos privados de qualquer lugar.' : 'Junte-se a nós para gerenciar seus downloads.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input 
                required
                type="text" 
                placeholder="Nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              required
              type="email" 
              placeholder="Seu e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              required
              type="password" 
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all mt-4"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">{isLogin ? 'Não tem uma conta?' : 'Já possui conta?'}</span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-600 font-bold hover:underline"
          >
            {isLogin ? 'Crie uma agora' : 'Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};
