import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

interface DiffControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  zoomLevel: string;
  onZoomChange: (zoom: string) => void;
  singleView: boolean;
  onSingleViewToggle: () => void;
  scrollLock: boolean;
  onScrollLockToggle: () => void;
}

const DiffControls: React.FC<DiffControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  zoomLevel,
  onZoomChange,
  singleView,
  onSingleViewToggle,
  scrollLock,
  onScrollLockToggle
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const zoomOptions = [
    '25%', '50%', '75%', '100%', '125%', '150%', '200%', 
    'Fit Width', 'Fit Page', 'Actual Size'
  ];

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Page Navigation */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              <input 
                type="number" 
                value={currentPage}
                onChange={handlePageInput}
                min={1}
                max={totalPages}
                className="w-12 px-2 py-1 text-sm border border-gray-300 rounded text-center"
              />
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <Button 
              variant={singleView ? "default" : "outline"} 
              size="sm" 
              onClick={onSingleViewToggle}
            >
              {singleView ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
              {singleView ? 'Dual View' : 'Single View'}
            </Button>
            
            <Button 
              variant={scrollLock ? "default" : "outline"} 
              size="sm" 
              onClick={onScrollLockToggle}
            >
              {scrollLock ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
              Scroll Lock
            </Button>
          </div>
        </div>

        {/* Zoom Control */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Zoom:</span>
          <Select value={zoomLevel} onValueChange={onZoomChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {zoomOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DiffControls;
