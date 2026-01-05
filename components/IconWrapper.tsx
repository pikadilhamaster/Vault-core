
import React from 'react';
import { 
  FileArchive, 
  FileText, 
  Smartphone, 
  AppWindow, 
  Image as ImageIcon, 
  FileCode,
  Download,
  Plus,
  X,
  UploadCloud,
  Trash2,
  Loader2,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { FileExtension } from '../types';

interface IconWrapperProps {
  extension: FileExtension;
  className?: string;
}

export const FileTypeIcon: React.FC<IconWrapperProps> = ({ extension, className = "w-6 h-6" }) => {
  switch (extension) {
    case FileExtension.ZIP:
      return <FileArchive className={`${className} text-amber-500`} />;
    case FileExtension.PDF:
      return <FileText className={`${className} text-red-500`} />;
    case FileExtension.APK:
      return <Smartphone className={`${className} text-green-500`} />;
    case FileExtension.EXE:
      return <AppWindow className={`${className} text-blue-500`} />;
    case FileExtension.IMG:
      return <ImageIcon className={`${className} text-purple-500`} />;
    default:
      return <FileCode className={`${className} text-gray-400`} />;
  }
};

export { Download, Plus, X, UploadCloud, Trash2, Loader2, ShieldCheck, ShieldAlert };
