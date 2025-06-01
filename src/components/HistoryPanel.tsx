import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { History, FileText, Clock } from 'lucide-react';
import { loadComparisons } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface HistoryItem {
  id: string;
  created_at: string;
  document_type: string;
  file_names?: string[];
  comparison_data?: any;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadComparison?: (data: any) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onLoadComparison }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
    }
  }, [isOpen, user]);

  const loadHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await loadComparisons(user.id);
      setHistory(data);
    } catch (error: any) {
      console.error('Error loading history:', error);
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadComparison = (item: HistoryItem) => {
    if (onLoadComparison && item.comparison_data) {
      onLoadComparison(item.comparison_data);
    }
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDocumentTypeDisplay = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF vs PDF';
      case 'text':
        return 'Text';
      case 'docx':
        return 'DOCX vs DOCX';
      default:
        return type;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Comparison History
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading history...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">{error}</div>
              <Button onClick={loadHistory} variant="outline">
                Retry
              </Button>
            </div>
          ) : history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">Version {item.id.slice(-8)}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.created_at)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
                      <FileText className="w-3 h-3" />
                      {getDocumentTypeDisplay(item.document_type)}
                    </div>
                    {item.file_names && item.file_names.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.file_names.join(' vs ')}
                      </div>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleLoadComparison(item)}
                  >
                    Load
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No comparison history yet</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryPanel;
