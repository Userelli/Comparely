import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Settings, Search } from 'lucide-react';
import { Input } from './ui/input';
import ChangesConfigDialog from './ChangesConfigDialog';

interface Change {
  id: number | string;
  type: string;
  content?: string;
  text?: string;
  wordCount?: number;
  tokens?: number;
  location?: string;
  color?: string;
  impact?: number;
  confidence?: number;
  description?: string;
}

interface DiffSummary {
  totalChanges: number;
  additions: number;
  deletions: number;
  modifications: number;
}

interface ChangesPanelProps {
  changes: Change[];
  onClose: () => void;
  onConfigure: () => void;
  summary?: DiffSummary | string;
  onChangeClick?: (changeId: number | string) => void;
}

const ChangesPanel: React.FC<ChangesPanelProps> = ({ 
  changes, 
  onClose, 
  onConfigure, 
  summary,
  onChangeClick 
}) => {
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getChangeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'insertion':
      case 'addition':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'removal':
      case 'deletion':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'semantic':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'subtle':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const safeChanges = (changes || []).map(change => ({
    ...change,
    tokens: change.tokens || change.wordCount || 1,
    impact: change.impact || change.confidence || 0,
    content: change.content || change.text || 'No content'
  }));

  const filteredChanges = safeChanges.filter(change => {
    const content = change.content || '';
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChangeClick = (changeId: number | string) => {
    if (onChangeClick) {
      onChangeClick(changeId);
    } else {
      const target = document.getElementById(`chg-${changeId}`) || document.getElementById(`change-${changeId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('highlight');
        setTimeout(() => target.classList.remove('highlight'), 800);
      }
    }
  };

  const renderSummary = () => {
    if (typeof summary === 'string') {
      return <div className="text-xs text-gray-600 mb-2">{summary}</div>;
    }
    
    if (summary && typeof summary === 'object') {
      return (
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="text-green-700">+{summary.additions} added</div>
          <div className="text-red-700">-{summary.deletions} removed</div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-600">Changes</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfigDialog(true)}
                className="h-8 w-8 p-0"
                title="Options"
              >
                <Settings className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative mb-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search changes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          
          {renderSummary()}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredChanges.map((change, index) => (
            <div
              key={change.id}
              className="chgblk p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleChangeClick(change.id)}
              data-id={change.id}
              data-snippet-id={`change-${change.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{change.id}.</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getChangeColor(change.type)}`}
                  >
                    {change.type}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">+{change.tokens}</span>
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                {change.content}
              </p>
              
              {change.description && (
                <p className="text-xs text-gray-500 mb-1">
                  {change.description}
                </p>
              )}
              
              <div className="flex justify-between text-xs text-gray-500">
                {change.location && (
                  <span>Location: {change.location}</span>
                )}
                {change.impact !== undefined && (
                  <span>Impact: {Math.round(change.impact * 100)}%</span>
                )}
              </div>
            </div>
          ))}
          
          {filteredChanges.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No changes match your search' : 'No changes found'}
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            {filteredChanges.length} of {safeChanges.length} changes
          </div>
        </div>
      </div>
      
      <ChangesConfigDialog 
        open={showConfigDialog} 
        onOpenChange={setShowConfigDialog} 
      />
    </>
  );
};

export default ChangesPanel;
