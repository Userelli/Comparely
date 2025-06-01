import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DocumentViewerProps {
  content: string;
  title: string;
  className?: string;
  zoomLevel?: string;
  scrollLock?: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  content, 
  title, 
  className,
  zoomLevel = '100%',
  scrollLock = false
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewerRef.current) {
      let scale = 1;
      if (zoomLevel.includes('%')) {
        scale = parseInt(zoomLevel) / 100;
      } else if (zoomLevel === 'Fit Width') {
        scale = 0.8;
      } else if (zoomLevel === 'Fit Page') {
        scale = 0.6;
      }
      
      viewerRef.current.style.transform = `scale(${scale})`;
      viewerRef.current.style.transformOrigin = 'top left';
    }
  }, [zoomLevel]);

  const processContent = (text: string) => {
    if (!text) return '';
    
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const lineNumber = index + 1;
      return (
        <div key={lineNumber} className="flex border-b border-gray-100">
          <div className="w-12 bg-gray-50 text-gray-500 text-xs p-2 border-r border-gray-200 flex-shrink-0">
            {lineNumber}
          </div>
          <div className="flex-1 p-2 text-sm leading-relaxed">
            {line || '\u00A0'}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg overflow-hidden document-viewer', className)}>
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
      </div>
      
      <div className={`h-full ${scrollLock ? 'overflow-hidden' : 'overflow-auto'}`}>
        <div ref={viewerRef} className="min-h-full">
          {content ? (
            <div className="divide-y divide-gray-100">
              {processContent(content)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No content to display</p>
                <p className="text-sm">Upload a file or enter text to see content here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
