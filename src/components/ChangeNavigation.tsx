import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChangeNavigationProps {
  currentIndex: number;
  totalChanges: number;
  onPrevious: () => void;
  onNext: () => void;
}

const ChangeNavigation: React.FC<ChangeNavigationProps> = ({
  currentIndex,
  totalChanges,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentIndex <= 0}
        className="h-8 px-2"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Prev
      </Button>
      <span className="text-sm text-gray-600">
        {totalChanges > 0 ? `${currentIndex + 1} of ${totalChanges}` : '0 of 0'}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentIndex >= totalChanges - 1}
        className="h-8 px-2"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default ChangeNavigation;
