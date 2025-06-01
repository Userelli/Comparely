export interface DiffChange {
  id: number;
  type: 'addition' | 'removal' | 'unchanged';
  text: string;
  position?: number;
}

function diffWords(text1: string, text2: string) {
  const words1 = (text1 || '').split(/\s+/).filter(w => w);
  const words2 = (text2 || '').split(/\s+/).filter(w => w);
  const parts = [];
  
  let i = 0, j = 0;
  while (i < words1.length && j < words2.length) {
    if (words1[i] === words2[j]) {
      parts.push({ value: words1[i] + ' ' });
      i++; j++;
    } else {
      let found = false;
      for (let k = j + 1; k < Math.min(j + 5, words2.length); k++) {
        if (words1[i] === words2[k]) {
          for (let l = j; l < k; l++) {
            parts.push({ value: words2[l] + ' ', added: true });
          }
          parts.push({ value: words1[i] + ' ' });
          i++; j = k + 1;
          found = true;
          break;
        }
      }
      if (!found) {
        parts.push({ value: words1[i] + ' ', removed: true });
        i++;
      }
    }
  }
  
  while (i < words1.length) {
    parts.push({ value: words1[i] + ' ', removed: true });
    i++;
  }
  while (j < words2.length) {
    parts.push({ value: words2[j] + ' ', added: true });
    j++;
  }
  
  return parts;
}

export function generateDiff(text1: string, text2: string) {
  const parts = diffWords(text1 || '', text2 || '');
  const changes: DiffChange[] = [];
  let changeId = 0;
  let additions = 0, deletions = 0;
  
  parts.forEach(part => {
    if (part.added) {
      changeId++;
      additions++;
      changes.push({
        id: changeId,
        type: 'addition',
        text: part.value.trim()
      });
    } else if (part.removed) {
      changeId++;
      deletions++;
      changes.push({
        id: changeId,
        type: 'removal',
        text: part.value.trim()
      });
    }
  });
  
  let html = '';
  changeId = 0;
  
  parts.forEach(part => {
    const escaped = part.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    if (part.added) {
      changeId++;
      html += `<span id="chg-${changeId}" class="bg-green-200 text-green-900 px-1 rounded">${escaped}</span>`;
    } else if (part.removed) {
      changeId++;
      html += `<span id="chg-${changeId}" class="bg-red-200 text-red-900 px-1 rounded line-through">${escaped}</span>`;
    } else {
      html += `<span>${escaped}</span>`;
    }
  });
  
  return {
    changes,
    summary: {
      totalChanges: changes.length,
      additions,
      deletions,
      modifications: 0
    },
    html
  };
}
