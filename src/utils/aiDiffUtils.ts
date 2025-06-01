// AI-enhanced diff detection utilities

export interface AIDetectedChange {
  id: number;
  type: 'SEMANTIC' | 'STRUCTURAL' | 'CONTEXTUAL' | 'SUBTLE';
  text: string;
  confidence: number;
  description: string;
  position: { start: number; end: number };
}

// Semantic similarity detection
function calculateSemanticSimilarity(word1: string, word2: string): number {
  const synonyms: Record<string, string[]> = {
    'good': ['great', 'excellent', 'fine', 'nice'],
    'bad': ['poor', 'terrible', 'awful', 'horrible'],
    'big': ['large', 'huge', 'massive', 'enormous'],
    'small': ['tiny', 'little', 'mini', 'compact']
  };
  
  for (const [key, values] of Object.entries(synonyms)) {
    if ((key === word1 && values.includes(word2)) || 
        (key === word2 && values.includes(word1)) ||
        (values.includes(word1) && values.includes(word2))) {
      return 0.8;
    }
  }
  return word1 === word2 ? 1.0 : 0.0;
}

// Detect subtle word replacements
function detectWordReplacements(text1: string, text2: string): AIDetectedChange[] {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const changes: AIDetectedChange[] = [];
  let changeId = 1000;
  
  for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
    const similarity = calculateSemanticSimilarity(words1[i], words2[i]);
    
    if (similarity > 0 && similarity < 1) {
      changes.push({
        id: changeId++,
        type: 'SEMANTIC',
        text: `"${words1[i]}" → "${words2[i]}"`,,
        confidence: similarity,
        description: `Semantic change detected: similar meaning words`,
        position: { start: i, end: i + 1 }
      });
    }
  }
  
  return changes;
}

// Enhanced AI diff detection
export function detectAIChanges(text1: string, text2: string): AIDetectedChange[] {
  const changes: AIDetectedChange[] = [];
  
  // Detect word replacements
  changes.push(...detectWordReplacements(text1, text2));
  
  return changes;
}
