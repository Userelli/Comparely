import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, Trash2, Image, FileIcon, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isFileTypeSupported, processDocuments } from '@/utils/fileProcessors';
import GoogleDriveButton from './GoogleDriveButton';
import UploadProgress from './UploadProgress';

interface UploadedFile {
  file: File;
  name: string;
  type: 'text' | 'image' | 'pdf' | 'docx';
}

interface FileProgress {
  fileName: string;
  progress: number;
  isComplete: boolean;
}

interface FileUploadProps {
  onFilesUploaded?: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
  const [leftFile, setLeftFile] = useState<UploadedFile | null>(null);
  const [rightFile, setRightFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [leftProgress, setLeftProgress] = useState<FileProgress | null>(null);
  const [rightProgress, setRightProgress] = useState<FileProgress | null>(null);
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileType = (file: File): 'text' | 'image' | 'pdf' | 'docx' => {
    const name = file?.name?.toLowerCase() || '';
    if (name.endsWith('.pdf')) return 'pdf';
    if (name.endsWith('.docx') || name.endsWith('.doc')) return 'docx';
    if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')) return 'image';
    return 'text';
  };

  const simulateProgress = async (fileName: string, side: 'left' | 'right'): Promise<void> => {
    const setProgress = side === 'left' ? setLeftProgress : setRightProgress;
    
    for (let i = 0; i <= 100; i += 25) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress({ fileName, progress: i, isComplete: i === 100 });
    }
  };

  const handleFileSelect = async (file: File, side: 'left' | 'right') => {
    if (!file || !file.name) {
      toast({
        title: 'Invalid file',
        description: 'Please select a valid file.',
        variant: 'destructive'
      });
      return;
    }

    if (!isFileTypeSupported(file.name)) {
      toast({
        title: 'Unsupported file type',
        description: 'Please upload TXT, PDF, DOCX, or image files.',
        variant: 'destructive'
      });
      return;
    }

    console.log(`Processing ${side} file:`, file.name, file.size);
    await simulateProgress(file.name, side);
    
    const fileType = getFileType(file);
    const uploadedFile = { 
      file, 
      name: file.name, 
      type: fileType
    };
    
    if (side === 'left') {
      setLeftFile(uploadedFile);
      setLeftProgress(null);
    } else {
      setRightFile(uploadedFile);
      setRightProgress(null);
    }
    
    toast({
      title: 'File uploaded',
      description: `${file.name} ready for processing.`
    });
  };

  const handleCompare = async () => {
    if (!leftFile?.file || !rightFile?.file) {
      toast({
        title: 'Missing files',
        description: 'Please upload both files before comparing.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting comparison with files:', leftFile.name, rightFile.name);
    
    try {
      const result = await processDocuments(leftFile.file, rightFile.file);
      console.log('Comparison result received:', {
        originalLength: result.original?.length || 0,
        modifiedLength: result.modified?.length || 0,
        diffCount: result.diff?.length || 0
      });
      
      const compareData = {
        leftFile: { name: leftFile.name, content: result.original },
        rightFile: { name: rightFile.name, content: result.modified },
        diff: result.diff
      };
      
      sessionStorage.setItem('compareFiles', JSON.stringify(compareData));
      window.location.href = '/compare';
      
      if (onFilesUploaded) {
        onFilesUploaded([leftFile.file, rightFile.file]);
      }
    } catch (error) {
      console.error('Upload/comparison error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload and process files.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-green-600" />;
      case 'pdf': return <FileIcon className="w-5 h-5 text-red-600" />;
      case 'docx': return <FileIcon className="w-5 h-5 text-blue-600" />;
      default: return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Previous Version</h3>
          
          {leftProgress && (
            <div className="mb-4">
              <UploadProgress
                fileName={leftProgress.fileName || ''}
                fileSize={0}
                fileType=""
                progress={leftProgress.progress || 0}
                isComplete={leftProgress.isComplete || false}
              />
            </div>
          )}
          
          {!leftFile && !leftProgress ? (
            <div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => leftInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload your file</p>
                <Button variant="outline">Browse Files</Button>
              </div>
              <div className="flex justify-end mt-4">
                <GoogleDriveButton onFileSelect={(file) => handleFileSelect(file, 'left')} side="left" />
              </div>
            </div>
          ) : leftFile ? (
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getFileIcon(leftFile.type)}
                  <span className="font-medium">{leftFile.name}</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <Button size="sm" variant="ghost" onClick={() => setLeftFile(null)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : null}
          
          <input
            ref={leftInputRef}
            type="file"
            accept=".txt,.md,.pdf,.docx,.doc,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target?.files?.[0];
              if (file) {
                console.log('Left file selected:', file);
                handleFileSelect(file, 'left');
              }
              e.target.value = '';
            }}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Latest Version</h3>
          
          {rightProgress && (
            <div className="mb-4">
              <UploadProgress
                fileName={rightProgress.fileName || ''}
                fileSize={0}
                fileType=""
                progress={rightProgress.progress || 0}
                isComplete={rightProgress.isComplete || false}
              />
            </div>
          )}
          
          {!rightFile && !rightProgress ? (
            <div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => rightInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload your file</p>
                <Button variant="outline">Browse Files</Button>
              </div>
              <div className="flex justify-end mt-4">
                <GoogleDriveButton onFileSelect={(file) => handleFileSelect(file, 'right')} side="right" />
              </div>
            </div>
          ) : rightFile ? (
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getFileIcon(rightFile.type)}
                  <span className="font-medium">{rightFile.name}</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <Button size="sm" variant="ghost" onClick={() => setRightFile(null)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : null}
          
          <input
            ref={rightInputRef}
            type="file"
            accept=".txt,.md,.pdf,.docx,.doc,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target?.files?.[0];
              if (file) {
                console.log('Right file selected:', file);
                handleFileSelect(file, 'right');
              }
              e.target.value = '';
            }}
          />
        </Card>
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={handleCompare}
          disabled={!leftFile || !rightFile || isLoading}
          className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3"
        >
          {isLoading ? 'Processing...' : 'Compare Documents'}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
