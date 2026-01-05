
export enum FileExtension {
  ZIP = 'ZIP',
  APK = 'APK',
  PDF = 'PDF',
  EXE = 'EXE',
  IMG = 'IMG',
  TXT = 'TXT',
  DMG = 'DMG',
  FLATPAK = 'FLATPAK',
  DEB = 'DEB'
}

export enum Platform {
  WINDOWS = 'Windows',
  MACOS = 'macOS',
  ANDROID = 'Android',
  LINUX = 'Linux',
  IOS = 'iOS',
  WEB = 'Web'
}

export enum StorageSource {
  VAULT = 'INTERNO',
  REMOTE = 'OFICIAL',
  NEXUS = 'NEXUS-NETWORK'
}

export enum SecurityStatus {
  SCANNING = 'SCANNING',
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  DANGER = 'DANGER'
}

export interface SecurityReport {
  status: SecurityStatus;
  score: number;
  threats: string[];
  summary: string;
}

export interface PlatformLink {
  platform: Platform;
  url: string;
  extension: FileExtension;
}

export interface FileItem {
  id: string;
  name: string;
  description: string;
  size: string;
  links: PlatformLink[];
  category: string;
  topics?: string[];
  updatedAt: string;
  downloadCount: number;
  relevanceScore: number;
  isUserFile?: boolean;
  isPublic?: boolean;
  securityReport?: SecurityReport;
  source: StorageSource;
  providerName?: string;
  providerUrl?: string;
  password?: string; // Campo para proteção de acesso
}

export type TabType = 'public' | 'user' | 'nexus' | 'restricted';
export type SortOption = 'relevance' | 'downloads' | 'date';

export interface User {
  id: string;
  name: string;
  email: string;
}
