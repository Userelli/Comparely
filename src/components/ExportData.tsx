import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Settings, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDataProps {
  children: React.ReactNode;
}

const ExportData: React.FC<ExportDataProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({
    comparisons: true,
    settings: false,
    history: true
  });
  const { toast } = useToast();

  const handleExport = () => {
    const selectedItems = Object.entries(selectedData)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key);
    
    if (selectedItems.length === 0) {
      toast({
        title: "No data selected",
        description: "Please select at least one data type to export.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Export started",
      description: `Exporting ${selectedItems.join(', ')}. Download will start shortly.",
    });
    
    // Simulate download
    setTimeout(() => {
      const blob = new Blob([JSON.stringify({
        exportDate: new Date().toISOString(),
        data: selectedItems
      }, null, 2)], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comparely-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Your Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Select the data you want to export. Your data will be downloaded as a JSON file.
          </p>
          
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="comparisons"
                    checked={selectedData.comparisons}
                    onCheckedChange={(checked) => 
                      setSelectedData({...selectedData, comparisons: !!checked})
                    }
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <label htmlFor="comparisons" className="text-sm font-medium cursor-pointer">
                      Document Comparisons
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-7 mt-1">
                  All your comparison results and metadata
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="settings"
                    checked={selectedData.settings}
                    onCheckedChange={(checked) => 
                      setSelectedData({...selectedData, settings: !!checked})
                    }
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <label htmlFor="settings" className="text-sm font-medium cursor-pointer">
                      Account Settings
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-7 mt-1">
                  Profile information and preferences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="history"
                    checked={selectedData.history}
                    onCheckedChange={(checked) => 
                      setSelectedData({...selectedData, history: !!checked})
                    }
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <History className="w-4 h-4 text-gray-500" />
                    <label htmlFor="history" className="text-sm font-medium cursor-pointer">
                      Activity History
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-7 mt-1">
                  Login history and usage logs
                </p>
              </CardContent>
            </Card>
          </div>

          <Button onClick={handleExport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Selected Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportData;
