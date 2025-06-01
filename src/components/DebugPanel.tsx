import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DebugPanelProps {
  files?: {
    leftFile?: { name: string; content: string };
    rightFile?: { name: string; content: string };
  };
  texts?: {
    text1?: string;
    text2?: string;
  };
  diffResult?: any;
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ files, texts, diffResult, onClose }) => {
  const sessionFiles = sessionStorage.getItem('compareFiles');
  const sessionTexts = sessionStorage.getItem('compareTexts');
  
  return (
    <Card className="fixed top-4 right-4 w-96 max-h-96 overflow-y-auto p-4 bg-yellow-50 border-yellow-200 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm">Debug Information</h3>
        <Button size="sm" variant="ghost" onClick={onClose}>×</Button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Session Storage Files:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {sessionFiles ? JSON.stringify(JSON.parse(sessionFiles), null, 2) : 'null'}
          </pre>
        </div>
        
        <div>
          <strong>Session Storage Texts:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {sessionTexts ? JSON.stringify(JSON.parse(sessionTexts), null, 2) : 'null'}
          </pre>
        </div>
        
        <div>
          <strong>Files State:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(files, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Texts State:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(texts, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Diff Result:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {diffResult ? JSON.stringify({
              changesCount: diffResult.changes?.length || 0,
              summary: diffResult.summary,
              hasHtml: !!diffResult.html
            }, null, 2) : 'null'}
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default DebugPanel;
