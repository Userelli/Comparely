import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Download, FileText, Image, Mail } from 'lucide-react';
import { generatePDF, generateDOCX } from '@/utils/exportUtils';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonData?: {
    text1: string;
    text2: string;
    changes: any[];
    summary?: string;
  };
}

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, comparisonData }) => {
  const [format, setFormat] = useState('pdf');
  const [includeChanges, setIncludeChanges] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let blob: Blob;
      let filename: string;
      
      if (format === 'pdf') {
        blob = await generatePDF(comparisonData, { includeChanges, includeComments });
        filename = 'comparison-report.pdf';
      } else if (format === 'docx') {
        blob = await generateDOCX(comparisonData, { includeChanges, includeComments });
        filename = 'comparison-report.docx';
      } else {
        // Fallback for other formats
        const content = `Document Comparison Report\n\nGenerated: ${new Date().toLocaleString()}\n\nChanges included: ${includeChanges ? 'Yes' : 'No'}\nComments included: ${includeComments ? 'Yes' : 'No'}`;
        blob = new Blob([content], { type: 'text/plain' });
        filename = `comparison-report.${format}`;
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailExport = async () => {
    if (!emailAddress) {
      setShowEmailInput(true);
      return;
    }
    
    setIsExporting(true);
    try {
      // Fallback to mailto (no backend email service)
      const subject = 'Document Comparison Report';
      const body = `Please find the document comparison report.\n\nGenerated: ${new Date().toLocaleString()}\n\nNote: Due to email limitations, the full report file cannot be attached via this method. Please use the Export button to download the file and attach it manually.`;
      
      window.open(`mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      
      alert('Email client opened. Note: File attachment requires manual download and attachment.');
      onClose();
    } catch (error) {
      console.error('Email export failed:', error);
      alert('Failed to open email client. Please try downloading the file instead.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Export Comparison</DialogTitle>
        <DialogHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Comparison
          </h2>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Export Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF Document
                  </div>
                </SelectItem>
                <SelectItem value="docx">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    DOCX Document
                  </div>
                </SelectItem>
                <SelectItem value="html">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    HTML Report
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Include Options</label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="changes" 
                checked={includeChanges}
                onCheckedChange={setIncludeChanges}
              />
              <label htmlFor="changes" className="text-sm">Include tracked changes</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="comments" 
                checked={includeComments}
                onCheckedChange={setIncludeComments}
              />
              <label htmlFor="comments" className="text-sm">Include comments</label>
            </div>
          </div>

          {showEmailInput && (
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address</label>
              <Input
                type="email"
                placeholder="Enter recipient email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleEmailExport}
              disabled={isExporting}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
