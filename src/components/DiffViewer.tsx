import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DiffViewerProps {
  html?: string;
  originalText: string;
  modifiedText: string;
  diffHtml?: {
    leftCol: string;
    rightCol: string;
  };
  changes?: any[];
}

const DiffViewer: React.FC<DiffViewerProps> = ({ 
  html,
  originalText, 
  modifiedText, 
  diffHtml, 
  changes 
}) => {
  console.log('DiffViewer props:', {
    originalTextLength: originalText?.length || 0,
    modifiedTextLength: modifiedText?.length || 0,
    hasHtml: !!html,
    hasDiffHtml: !!diffHtml,
    changesCount: changes?.length || 0
  });

  // Use diffHtml if available, otherwise fallback to side-by-side
  if (diffHtml && (diffHtml.leftCol || diffHtml.rightCol)) {
    return (
      <div className="diff-container flex gap-4 h-full">
        <div className="flex-1 border rounded-lg">
          <h4 className="font-medium text-gray-700 p-3 bg-gray-50 border-b">Original</h4>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div 
              className="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: diffHtml.leftCol }}
            />
          </ScrollArea>
        </div>
        <div className="flex-1 border rounded-lg">
          <h4 className="font-medium text-gray-700 p-3 bg-gray-50 border-b">Modified</h4>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div 
              className="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: diffHtml.rightCol }}
            />
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Fallback to plain text side-by-side
  return (
    <div className="diff-container flex gap-4 h-full">
      <div className="flex-1 border rounded-lg">
        <h4 className="font-medium text-gray-700 p-3 bg-gray-50 border-b">Original</h4>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {originalText || 'No content available'}
            </pre>
          </div>
        </ScrollArea>
      </div>
      <div className="flex-1 border rounded-lg">
        <h4 className="font-medium text-gray-700 p-3 bg-gray-50 border-b">Modified</h4>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {modifiedText || 'No content available'}
            </pre>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DiffViewer;
