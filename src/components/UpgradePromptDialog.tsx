import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface UpgradePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usedCount: number;
  limit: number;
  onUpgrade: () => void;
}

const UpgradePromptDialog: React.FC<UpgradePromptDialogProps> = ({
  open,
  onOpenChange,
  usedCount,
  limit,
  onUpgrade
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>You've reached your limit</DialogTitle>
        <DialogHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            You've reached your limit
          </h2>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            You've used all {limit} comparisons in your Free plan. Upgrade to Pro for unlimited access.
          </p>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={onUpgrade}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Upgrade Now
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePromptDialog;
