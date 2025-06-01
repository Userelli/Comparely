import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Settings, Download, HelpCircle, History, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import ExportDialog from './ExportDialog';
import HistoryPanel from './HistoryPanel';
import SimpleDialog from './SimpleDialog';
import ChangeNavigation from './ChangeNavigation';

interface DiffToolbarProps {
  onShare?: () => void;
  onConfigure?: () => void;
  changes?: any[];
  currentChangeIndex?: number;
  onNavigateChange?: (direction: 'prev' | 'next') => void;
}

const DiffToolbar: React.FC<DiffToolbarProps> = ({ 
  onShare, 
  onConfigure,
  changes = [],
  currentChangeIndex = 0,
  onNavigateChange
}) => {
  const [showExport, setShowExport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [current, setCurrent] = useState(0);

  const handleExport = () => {
    setShowExport(true);
  };

  const handleHistory = () => {
    setShowHistory(true);
  };

  const handleHelp = () => {
    setShowHelp(true);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Document Comparison',
        text: 'Check out this document comparison',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrevChange = () => {
    if (current > 0) {
      const newIndex = current - 1;
      setCurrent(newIndex);
      if (onNavigateChange) {
        onNavigateChange('prev');
      } else {
        // Trigger click on change element
        const changeElements = document.querySelectorAll('.chgblk');
        if (changeElements[newIndex]) {
          (changeElements[newIndex] as HTMLElement).click();
        }
      }
    }
  };

  const handleNextChange = () => {
    if (current < changes.length - 1) {
      const newIndex = current + 1;
      setCurrent(newIndex);
      if (onNavigateChange) {
        onNavigateChange('next');
      } else {
        // Trigger click on change element
        const changeElements = document.querySelectorAll('.chgblk');
        if (changeElements[newIndex]) {
          (changeElements[newIndex] as HTMLElement).click();
        }
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevChange();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextChange();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, changes.length]);

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={onConfigure}>
              <Settings className="w-4 h-4 mr-1" />
              Options
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            {changes.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevChange}
                  disabled={current === 0}
                  id="prevChange"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                <span className="text-sm text-gray-600">
                  {current + 1} of {changes.length}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextChange}
                  disabled={current === changes.length - 1}
                  id="nextChange"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleHistory}>
                <History className="w-4 h-4 mr-1" />
                History
              </Button>
              <Button variant="outline" size="sm" onClick={handleHelp}>
                <HelpCircle className="w-4 h-4 mr-1" />
                Help
              </Button>
              <Button variant="outline" size="sm" onClick={handleFullscreen}>
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ExportDialog 
        isOpen={showExport} 
        onClose={() => setShowExport(false)} 
      />
      
      <HistoryPanel 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
      />
      
      <SimpleDialog 
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Help"
        content="Use the toolbar to export, share, or configure your comparison. Navigate through changes using the Prev/Next buttons or arrow keys."
      />
    </>
  );
};

export default DiffToolbar;
