import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import InteractiveDemo from './InteractiveDemo';

interface DemoVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoVideoDialog: React.FC<DemoVideoDialogProps> = ({ open, onOpenChange }) => {
  const [showDemo, setShowDemo] = useState(false);

  const handleClose = () => {
    setShowDemo(false);
    onOpenChange(false);
  };

  const startDemo = () => {
    setShowDemo(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <DialogTitle>How Comparely Works - Interactive Demo</DialogTitle>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">How Comparely Works - Interactive Demo</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {!showDemo ? (
          <div className="text-center py-12">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Welcome to Comparely Demo</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Experience how Comparely makes document comparison effortless with AI-powered analysis. 
                This interactive demo will walk you through the entire process step by step.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h4 className="font-semibold mb-2">Upload Documents</h4>
                <p className="text-sm text-gray-600">Drag and drop your files</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm text-gray-600">Smart comparison engine</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">Get Results</h4>
                <p className="text-sm text-gray-600">Download detailed reports</p>
              </div>
            </div>
            
            <Button onClick={startDemo} size="lg" className="px-8">
              Start Interactive Demo
            </Button>
          </div>
        ) : (
          <InteractiveDemo onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DemoVideoDialog;
