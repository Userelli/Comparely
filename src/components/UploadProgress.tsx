import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { FileText, Image, FileIcon, CheckCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  progress: number;
  isComplete: boolean;
  source?: 'local' | 'google-drive';
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName = '',
  fileSize = 0,
  fileType = '',
  progress = 0,
  isComplete = false,
  source = 'local'
}) => {
  const getFileIcon = (type: string) => {
    if (!type) return <FileText className="w-5 h-5 text-gray-600" />;
    const lowerType = type.toLowerCase();
    if (lowerType.includes('image') || lowerType.includes('jpg') || lowerType.includes('png') || lowerType.includes('jpeg')) {
      return <Image className="w-5 h-5 text-green-600" />;
    }
    if (lowerType.includes('pdf')) {
      return <FileIcon className="w-5 h-5 text-red-600" />;
    }
    if (lowerType.includes('docx') || lowerType.includes('doc') || lowerType.includes('word')) {
      return <FileIcon className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExtension = (filename: string): string => {
    if (!filename || typeof filename !== 'string') return 'FILE';
    const ext = filename.split('.').pop()?.toUpperCase();
    if (!ext) return 'FILE';
    
    const mimeMap: { [key: string]: string } = {
      'PDF': 'PDF',
      'DOCX': 'DOCX',
      'DOC': 'DOC',
      'TXT': 'TXT',
      'MD': 'MARKDOWN',
      'JPG': 'JPEG',
      'JPEG': 'JPEG',
      'PNG': 'PNG'
    };
    
    return mimeMap[ext] || ext;
  };

  const getProgressText = () => {
    if (isComplete) return 'Complete';
    if (source === 'google-drive') {
      if (progress < 30) return 'Connecting to Google Drive...';
      if (progress < 60) return 'Downloading from Drive...';
      if (progress < 90) return 'Processing file...';
      return 'Finalizing...';
    }
    return 'Uploading...';
  };

  const safeFileName = fileName || 'Unknown file';
  const safeProgress = Math.max(0, Math.min(100, progress || 0));

  return (
    <Card className="p-4 bg-white border shadow-sm">
      <div className="flex items-center space-x-3 mb-3">
        {getFileIcon(fileType)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{safeFileName}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{formatFileSize(fileSize)}</span>
            <span>•</span>
            <span>{getFileExtension(safeFileName)}</span>
            {source === 'google-drive' && (
              <>
                <span>•</span>
                <span>Google Drive</span>
              </>
            )}
          </div>
        </div>
        {isComplete ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{getProgressText()}</span>
          <span>{safeProgress}%</span>
        </div>
        <Progress 
          value={safeProgress} 
          className="h-2" 
        />
      </div>
    </Card>
  );
};

export default UploadProgress;
