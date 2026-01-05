
import { FileItem } from './types';

export const CATEGORIES = [
  'Todos',
  'Multimídia',
  'Utilitários',
  'Desenvolvimento',
  'Documentos',
  'Nexus (Externo)'
];

/**
 * Banco de dados de arquivos inicial.
 * Removido mock data para permitir que o site exiba apenas arquivos liberados pelos usuários.
 */
export const FILES: FileItem[] = [];
