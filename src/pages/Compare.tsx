import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { useAppContext } from '@/contexts/AppContext';
import DiffViewer from '@/components/DiffViewer';
import ChangesPanel from '@/components/ChangesPanel';
import DiffToolbar from '@/components/DiffToolbar';
import UpgradePromptDialog from '@/components/UpgradePromptDialog';
import DebugPanel from '@/components/DebugPanel';
import { CompareForm } from '@/components/CompareForm';
import { generateDiff } from '@/utils/diffUtils';
import { saveComparison } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DiffChunk {
  id: number;
  added: boolean;
  removed: boolean;
  value: string;
}

interface Change {
  id: number | string;
  type: string;
  text?: string;
  content?: string;
  position?: number;
}

interface DiffSummary {
  totalChanges: number;
  additions: number;
  deletions: number;
  modifications: number;
}

const Compare: React.FC = () => {
  const [files, setFiles] = useState<{leftFile?: {name: string, content: string}, rightFile?: {name: string, content: string}} | null>(null);
  const [texts, setTexts] = useState<{text1?: string, text2?: string} | null>(null);
  const [diffResult, setDiffResult] = useState<{changes: Change[], summary: DiffSummary, html?: any} | null>(null);
  const [showChanges, setShowChanges] = useState(true);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);
  const [apiDiff, setApiDiff] = useState<{original: string, modified: string, diff: DiffChunk[]} | null>(null);
  const { incrementComparisons, usage, checkUsageLimit } = useAppContext();
  const [hasIncremented, setHasIncremented] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const saveComparisonData = async (comparisonData: any) => {
    if (!user) return;
    
    try {
      await saveComparison({
        title: `Comparison ${new Date().toLocaleDateString()}`,
        document_type: comparisonData.type || 'text',
        file_names: comparisonData.fileNames || [],
        comparison_data: {
          text1: comparisonData.text1,
          text2: comparisonData.text2,
          changes: comparisonData.changes,
          summary: comparisonData.summary
        },
        user_id: user.id
      });
    } catch (error) {
      console.error('Error saving comparison:', error);
      toast({
        title: "Error",
        description: "Failed to save comparison",
        variant: "destructive"
      });
    }
  };

  const handleApiComparison = (result: {original: string, modified: string, diff: DiffChunk[]}) => {
    console.log('Received API comparison result:', result);
    setApiDiff(result);
    
    // Convert API diff to our internal format
    const changes: Change[] = result.diff.filter(chunk => chunk.added || chunk.removed).map((chunk, index) => ({
      id: chunk.id || index,
      type: chunk.added ? 'addition' : 'removal',
      text: chunk.value,
      content: chunk.value,
      position: chunk.id
    }));
    
    const summary: DiffSummary = {
      totalChanges: changes.length,
      additions: changes.filter(c => c.type === 'addition').length,
      deletions: changes.filter(c => c.type === 'removal').length,
      modifications: 0
    };
    
    const convertedResult = {
      changes,
      summary,
      html: result.diff.map(chunk => 
        chunk.added ? `<span class="bg-green-100 text-green-800">${chunk.value}</span>` :
        chunk.removed ? `<span class="bg-red-100 text-red-800 line-through">${chunk.value}</span>` :
        chunk.value
      ).join('')
    };
    
    setDiffResult(convertedResult);
    
    if (!hasIncremented) {
      const comparisonData = {
        type: 'file',
        fileNames: ['Document 1', 'Document 2'],
        text1: result.original,
        text2: result.modified,
        changes: convertedResult.changes,
        summary: convertedResult.summary
      };
      
      saveComparisonData(comparisonData);
      incrementComparisons();
      setHasIncremented(true);
    }
  };

  useEffect(() => {
    console.log('Compare page loaded, checking for content...');
    
    if (checkUsageLimit()) {
      setShowUpgradePrompt(true);
      return;
    }

    let text1 = '', text2 = '', fileNames: string[] = [];

    try {
      const storedTexts = sessionStorage.getItem('compareTexts');
      if (storedTexts) {
        const parsedTexts = JSON.parse(storedTexts);
        if (parsedTexts && typeof parsedTexts === 'object') {
          setTexts(parsedTexts);
          text1 = parsedTexts.text1 || '';
          text2 = parsedTexts.text2 || '';
          fileNames = ['Text comparison'];
        }
      }
    } catch (error) {
      console.error('Error parsing stored texts:', error);
      sessionStorage.removeItem('compareTexts');
    }

    if (!text1 && !text2) {
      try {
        const storedFiles = sessionStorage.getItem('compareFiles');
        if (storedFiles) {
          const parsedFiles = JSON.parse(storedFiles);
          if (parsedFiles && typeof parsedFiles === 'object') {
            setFiles(parsedFiles);
            text1 = parsedFiles.leftFile?.content || '';
            text2 = parsedFiles.rightFile?.content || '';
            fileNames = [parsedFiles.leftFile?.name, parsedFiles.rightFile?.name].filter(Boolean);
          }
        }
      } catch (error) {
        console.error('Error parsing stored files:', error);
        sessionStorage.removeItem('compareFiles');
      }
    }

    if (text1 && text2) {
      const result = generateDiff(text1, text2);
      setDiffResult(result);
      
      if (!hasIncremented) {
        const comparisonData = {
          type: fileNames.length > 1 ? 'file' : 'text',
          fileNames,
          text1,
          text2,
          changes: result.changes,
          summary: result.summary
        };
        
        saveComparisonData(comparisonData);
        incrementComparisons();
        setHasIncremented(true);
      }
    }
  }, [incrementComparisons, hasIncremented, checkUsageLimit, user]);

  const handleBack = () => {
    window.location.href = '/upload';
  };

  const handleChangeClick = (changeId: number | string) => {
    const target = document.getElementById(`chg-${changeId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('focused');
      setTimeout(() => target.classList.remove('focused'), 2000);
    }
  };

  const handleNavigateChange = (direction: 'prev' | 'next') => {
    const changes = diffResult?.changes || [];
    let newIndex = currentChangeIndex;
    
    if (direction === 'prev' && currentChangeIndex > 0) {
      newIndex = currentChangeIndex - 1;
    } else if (direction === 'next' && currentChangeIndex < changes.length - 1) {
      newIndex = currentChangeIndex + 1;
    }
    
    setCurrentChangeIndex(newIndex);
    
    if (changes[newIndex]) {
      handleChangeClick(changes[newIndex].id);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const text1 = apiDiff?.original || texts?.text1 || files?.leftFile?.content || '';
  const text2 = apiDiff?.modified || texts?.text2 || files?.rightFile?.content || '';

  if (showUpgradePrompt) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <UpgradePromptDialog 
          open={showUpgradePrompt}
          onOpenChange={setShowUpgradePrompt}
          usedCount={usage.used}
          limit={usage.limit}
          onUpgrade={handleUpgrade}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Limit Reached</h2>
            <p className="text-gray-600 mb-4">You've used all {usage.limit} comparisons in your Free plan.</p>
            <button 
              onClick={handleUpgrade}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
            >
              Upgrade Now
            </button>
            <button 
              onClick={handleBack}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showDebug && (
        <DebugPanel
          files={files}
          texts={texts}
          diffResult={diffResult}
          onClose={() => setShowDebug(false)}
        />
      )}
      
      {(text1 && text2 && diffResult) ? (
        <div className="h-screen flex flex-col">
          <DiffToolbar 
            changes={diffResult.changes}
            currentChangeIndex={currentChangeIndex}
            onNavigateChange={handleNavigateChange}
          />
          <div className="flex-1 flex">
            <div className="flex-1">
              <DiffViewer 
                originalText={text1}
                modifiedText={text2}
                diffHtml={diffResult.html}
                changes={diffResult.changes}
              />
            </div>
            {showChanges && (
              <ChangesPanel 
                changes={diffResult.changes || []}
                onClose={() => setShowChanges(false)}
                onConfigure={() => {}}
                summary={diffResult.summary}
                onChangeClick={handleChangeClick}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          <Navigation />
          <div className="container mx-auto py-8">
            <CompareForm onComparisonResult={handleApiComparison} />
            
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Or use existing content</h2>
              <p className="text-gray-600 mb-4">Upload files or enter text first to start comparing.</p>
              <div className="space-x-4">
                <button 
                  onClick={handleBack}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Go Back to Upload
                </button>
                <button 
                  onClick={() => setShowDebug(!showDebug)}
                  className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
                >
                  Debug Info
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Compare;
