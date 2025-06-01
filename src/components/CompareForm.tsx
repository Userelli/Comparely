import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { processDocumentsWithSupabase, isFileTypeSupported } from '@/utils/fileProcessors';

interface DiffChunk {
  id: number;
  added: boolean;
  removed: boolean;
  value: string;
}

interface CompareFormProps {
  onComparisonResult?: (result: {original: string, modified: string, diff: DiffChunk[]}) => void;
}

export function CompareForm({ onComparisonResult }: CompareFormProps) {
  const [orig, setOrig] = useState('');
  const [mod, setMod] = useState('');
  const [diff, setDiff] = useState<DiffChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);

  const handleFileSelect = (fileNumber: 1 | 2, file: File | null) => {
    if (file && !isFileTypeSupported(file.name)) {
      setError(`Unsupported file type: ${file.name}. Please use PDF, DOCX, TXT, or image files.`);
      return;
    }
    
    setError('');
    setSuccess('');
    
    if (fileNumber === 1) {
      setFile1(file);
    } else {
      setFile2(file);
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (!file1 || !file2) {
      setError('Please select two files to compare');
      setLoading(false);
      return;
    }

    try {
      console.log('Processing files with real document parsing:', file1.name, file2.name);
      
      const result = await processDocumentsWithSupabase(file1, file2);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process documents');
      }
      
      // Validate that we got actual content
      if (!result.original || !result.modified) {
        throw new Error('No text content extracted from documents');
      }
      
      console.log('Successfully extracted text:', { 
        original: result.original.length + ' chars', 
        modified: result.modified.length + ' chars', 
        diff: result.diff?.length + ' chunks'
      });
      
      setOrig(result.original);
      setMod(result.modified);
      setDiff(result.diff || []);
      setSuccess(`Successfully processed ${file1.name} and ${file2.name}`);
      
      if (onComparisonResult) {
        onComparisonResult({ 
          original: result.original, 
          modified: result.modified, 
          diff: result.diff || []
        });
      }
    } catch (e) {
      console.error('Document processing error:', e);
      setError(e instanceof Error ? e.message : 'Failed to process documents');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Comparison with Real Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Document</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp"
                  onChange={(e) => handleFileSelect(1, e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {file1 && (
                  <p className="text-sm text-green-600 mt-1">✓ {file1.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Second Document</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp"
                  onChange={(e) => handleFileSelect(2, e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {file2 && (
                  <p className="text-sm text-green-600 mt-1">✓ {file2.name}</p>
                )}
              </div>
            </div>
            
            <Button type="submit" disabled={loading || !file1 || !file2} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {loading ? 'Processing with Real Libraries...' : 'Compare Documents'}
            </Button>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {orig && !onComparisonResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Original Document ({orig.length} characters)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
                {orig}
              </pre>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Modified Document ({mod.length} characters)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
                {mod}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      {diff.length > 0 && !onComparisonResult && (
        <Card>
          <CardHeader>
            <CardTitle>Document Differences ({diff.length} changes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {diff.map((chunk) => (
                <span
                  key={chunk.id}
                  className={`inline ${
                    chunk.added
                      ? 'bg-green-100 text-green-800 px-1'
                      : chunk.removed
                      ? 'bg-red-100 text-red-800 px-1 line-through'
                      : ''
                  }`}
                >
                  {chunk.value}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
