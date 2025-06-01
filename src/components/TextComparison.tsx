import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowRight } from 'lucide-react';
import { generateDiff } from '@/utils/diffUtils';
import { useAppContext } from '@/contexts/AppContext';
import DiffViewer from './DiffViewer';
import ChangesPanel from './ChangesPanel';
import DiffToolbar from './DiffToolbar';
import UpgradePromptDialog from './UpgradePromptDialog';
import { useToast } from '@/hooks/use-toast';

const TextComparison: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<any>(null);
  const [showChanges, setShowChanges] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);
  
  const { usage, saveComparison, checkUsageLimit, incrementComparisons } = useAppContext();
  const { toast } = useToast();

  const handleCompare = async () => {
    if (!text1.trim() || !text2.trim()) {
      toast({
        title: "Error",
        description: "Please enter text in both fields to compare.",
        variant: "destructive"
      });
      return;
    }

    // Check usage limit before proceeding
    if (checkUsageLimit()) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsComparing(true);
    
    try {
      const result = generateDiff(text1, text2);
      setDiffResult(result);
      setShowChanges(true);
      
      // Save comparison to history
      await saveComparison({
        type: 'text',
        text1,
        text2,
        changes: result.changes,
        summary: result.summary
      });
      
      // Update usage count
      await incrementComparisons();
      
      toast({
        title: "Comparison Complete",
        description: `Found ${result.changes?.length || 0} changes between the texts.`,
      });
    } catch (error) {
      console.error('Comparison error:', error);
      toast({
        title: "Error",
        description: "Failed to compare texts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
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

  if (diffResult && showChanges) {
    return (
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
          <ChangesPanel 
            changes={diffResult.changes || []}
            onClose={() => setShowChanges(false)}
            onConfigure={() => {}}
            summary={diffResult.summary}
            onChangeClick={handleChangeClick}
          />
        </div>
        
        <UpgradePromptDialog 
          open={showUpgradePrompt}
          onOpenChange={setShowUpgradePrompt}
          usedCount={usage.used}
          limit={usage.limit}
          onUpgrade={handleUpgrade}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Text Comparison</h1>
          <p className="text-gray-600">Compare two text documents side by side and see the differences highlighted.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Original Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your original text here..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Modified Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your modified text here..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleCompare}
            disabled={isComparing || !text1.trim() || !text2.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
          >
            {isComparing ? (
              'Comparing...'
            ) : (
              <>
                Compare Texts
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          {usage.used}/{usage.limit} comparisons used this month
        </div>
      </div>
      
      <UpgradePromptDialog 
        open={showUpgradePrompt}
        onOpenChange={setShowUpgradePrompt}
        usedCount={usage.used}
        limit={usage.limit}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default TextComparison;
