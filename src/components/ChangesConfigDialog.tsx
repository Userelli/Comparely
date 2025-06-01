import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChangesConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConfigSettings {
  showInserted: boolean;
  showRemoved: boolean;
  showMoved: boolean;
  showFormatting: boolean;
  showComments: boolean;
  filterType: 'all' | 'text' | 'style';
  ignoreWhitespace: boolean;
  groupMoves: boolean;
  authorColors: { [key: string]: string };
}

const ChangesConfigDialog: React.FC<ChangesConfigDialogProps> = ({ open, onOpenChange }) => {
  const [settings, setSettings] = useState<ConfigSettings>({
    showInserted: true,
    showRemoved: true,
    showMoved: true,
    showFormatting: false,
    showComments: true,
    filterType: 'all',
    ignoreWhitespace: false,
    groupMoves: true,
    authorColors: {
      'Author 1': '#3b82f6',
      'Author 2': '#ef4444'
    }
  });

  const handleSave = () => {
    localStorage.setItem('changesConfig', JSON.stringify(settings));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <VisuallyHidden>
          <DialogTitle>Configure Changes</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <h2 className="text-lg font-semibold">Configure Changes</h2>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium">Show/Hide Changes</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="inserted">Inserted</Label>
              <Switch
                id="inserted"
                checked={settings.showInserted}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, showInserted: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="removed">Removed</Label>
              <Switch
                id="removed"
                checked={settings.showRemoved}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, showRemoved: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="moved">Moved</Label>
              <Switch
                id="moved"
                checked={settings.showMoved}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, showMoved: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="formatting">Formatting changes</Label>
              <Switch
                id="formatting"
                checked={settings.showFormatting}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, showFormatting: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="comments">Comments</Label>
              <Switch
                id="comments"
                checked={settings.showComments}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, showComments: checked }))
                }
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangesConfigDialog;
