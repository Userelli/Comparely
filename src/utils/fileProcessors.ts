export interface CompareResult {
  original: string;
  modified: string;
  diff: Array<{index:number;added:boolean;removed:boolean;value:string;}>;
}

export async function processDocuments(file1:File,file2:File):Promise<CompareResult>{
  console.log('processDocuments called with:', file1?.name, file2?.name);
  
  if (!file1 || !file2) {
    throw new Error('Both files are required');
  }
  
  const fd = new FormData();
  fd.append('file1',file1);
  fd.append('file2',file2);
  
  console.log('Sending request to /api/compare');
  
  try {
    const r = await fetch('/api/compare',{
      method:'POST',
      body:fd
    });
    
    console.log('Response status:', r.status, r.statusText);
    
    if(!r.ok){
      const errorText = await r.text();
      console.error('API error response:', errorText);
      throw new Error(`API error ${r.status}: ${errorText}`);
    }
    
    const result = await r.json() as CompareResult;
    console.log('API response received:', {
      originalLength: result.original?.length || 0,
      modifiedLength: result.modified?.length || 0,
      diffLength: result.diff?.length || 0
    });
    
    return result;
  } catch (error) {
    console.error('processDocuments error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the server is running on port 3000.');
    }
    throw error;
  }
}

export const processDocumentsWithSupabase = processDocuments;

export function isFileTypeSupported(name?:string):boolean{
  if(!name)return false;
  const ext=name.toLowerCase().split('.').pop();
  return ['txt','pdf','doc','docx','jpg','jpeg','png'].includes(ext!);
}

export function countTokens(text:string):number{
  if(!text)return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
