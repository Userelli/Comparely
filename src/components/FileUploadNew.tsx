import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface UploadedFile {
  file: File;
  content: string;
  name: string;
}

interface FileUploadNewProps {
  onFilesUploaded?: (files: File[]) => void;
}

const FileUploadNew: React.FC<FileUploadNewProps> = ({ onFilesUploaded }) => {
  const [leftFile, setLeftFile] = useState<UploadedFile | null>(null);
  const [rightFile, setRightFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadToSupabase = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);
    
    const response = await fetch(
      'https://dyxoboyylifsmlaireuw.supabase.co/functions/v1/f0f268f3-a1a9-4884-8fed-99af56884384',
      {
        method: 'POST',
        body: formData
      }
    );
    
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.extractedText;
  };

  const handleFileSelect = async (file: File, side: 'left' | 'right') => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      const content = await uploadToSupabase(file);
      const uploadedFile = { file, content, name: file.name };
      
      if (side === 'left') {
        setLeftFile(uploadedFile);
      } else {
        setRightFile(uploadedFile);
      }
      
      toast({
        title: 'File uploaded successfully',
        description: `${file.name} processed and ready for comparison.`
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload and process file.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = () => {
    if (leftFile && rightFile && leftFile.content && rightFile.content) {
      const compareData = {
        leftFile: { name: leftFile.name, content: leftFile.content },
        rightFile: { name: rightFile.name, content: rightFile.content }
      };
      
      sessionStorage.setItem('compareFiles', JSON.stringify(compareData));
      window.location.href = '/compare';
      
      if (onFilesUploaded) {
        onFilesUploaded([leftFile.file, rightFile.file]);
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Previous Version</h3>
          {!leftFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => leftInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload your file</p>
              <Button variant="outline">Browse Files</Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{leftFile.name}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setLeftFile(null)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">Content: {leftFile.content.length} characters</p>
            </div>
          )}
          <input
            ref={leftInputRef}
            type="file"
            accept=".txt,.md,.pdf,.docx,.doc"
            className="hidden"
            onChange={(e) => {
              const file = e.target?.files?.[0];
              if (file) handleFileSelect(file, 'left');
            }}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Latest Version</h3>
          {!rightFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => rightInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload your file</p>
              <Button variant="outline">Browse Files</Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{rightFile.name}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setRightFile(null)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">Content: {rightFile.content.length} characters</p>
            </div>
          )}
          <input
            ref={rightInputRef}
            type="file"
            accept=".txt,.md,.pdf,.docx,.doc"
            className="hidden"
            onChange={(e) => {
              const file = e.target?.files?.[0];
              if (file) handleFileSelect(file, 'right');
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

export default FileUploadNew;
