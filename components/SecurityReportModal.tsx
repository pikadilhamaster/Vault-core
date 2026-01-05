
import React from 'react';
import { X, ShieldCheck, ShieldAlert, ShieldX, Info } from 'lucide-react';
import { SecurityReport, SecurityStatus } from '../types';

interface SecurityReportModalProps {
  fileName: string;
  report: SecurityReport;
  onClose: () => void;
  onConfirmDownload?: () => void;
}

export const SecurityReportModal: React.FC<SecurityReportModalProps> = ({ fileName, report, onClose, onConfirmDownload }) => {
  const isSafe = report.status === SecurityStatus.SAFE;
  
  const getIcon = () => {
    switch (report.status) {
      case SecurityStatus.SAFE: return <ShieldCheck className="text-green-500" size={48} />;
      case SecurityStatus.WARNING: return <ShieldAlert className="text-amber-500" size={48} />;
      case SecurityStatus.DANGER: return <ShieldX className="text-red-500" size={48} />;
      default: return <Info className="text-blue-500" size={48} />;
    }
  };

  const getStatusText = () => {
    switch (report.status) {
      case SecurityStatus.SAFE: return 'Arquivo Seguro';
      case SecurityStatus.WARNING: return 'Atenção Necessária';
      case SecurityStatus.DANGER: return 'Ameaça Detectada';
      default: return 'Análise Concluída';
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <div className={`h-2 w-full ${isSafe ? 'bg-green-500' : report.status === SecurityStatus.DANGER ? 'bg-red-500' : 'bg-amber-500'}`} />
        
        <div className="p-8">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 p-4 bg-gray-50 rounded-full">
              {getIcon()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{getStatusText()}</h2>
            <p className="text-gray-500 text-sm mt-1">{fileName}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Relatório CloudShield AI</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isSafe ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Score: {report.score}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
                "{report.summary}"
              </p>
              
              {report.threats.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase">Pontos Identificados:</p>
                  <ul className="text-sm space-y-1">
                    {report.threats.map((threat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
              {onConfirmDownload && (
                <button 
                  onClick={onConfirmDownload}
                  disabled={report.status === SecurityStatus.DANGER}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white transition-all ${
                    report.status === SecurityStatus.DANGER 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100'
                  }`}
                >
                  Continuar Download
                </button>
              )}
            </div>
            {report.status === SecurityStatus.DANGER && (
              <p className="text-[10px] text-center text-red-500 font-medium">
                Downloads bloqueados para arquivos identificados como maliciosos.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
