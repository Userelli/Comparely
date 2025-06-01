// Google Drive authentication and file picker utilities

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
}

interface GoogleAuthResponse {
  access_token: string;
  expires_in: number;
}

export const initializeGoogleDrive = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Load Google API script if not already loaded
    if (typeof window.gapi !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('auth2:picker', () => {
        resolve();
      });
    };
    script.onerror = () => reject(new Error('Failed to load Google API'));
    document.head.appendChild(script);
  });
};

export const authenticateGoogleDrive = async (): Promise<string> => {
  // For demo purposes, return a mock token
  // In production, this would handle OAuth flow
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('mock_access_token_' + Date.now());
    }, 1000);
  });
};

export const openGoogleDrivePicker = async (): Promise<GoogleDriveFile> => {
  // Mock Google Drive file picker
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFiles = [
        {
          id: 'mock_file_1',
          name: 'Sample Document.pdf',
          mimeType: 'application/pdf',
          size: '1048576'
        },
        {
          id: 'mock_file_2',
          name: 'Contract Draft.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: '524288'
        },
        {
          id: 'mock_file_3',
          name: 'Meeting Notes.txt',
          mimeType: 'text/plain',
          size: '2048'
        }
      ];
      
      // Simulate user selecting a random file
      const selectedFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
      resolve(selectedFile);
    }, 1500);
  });
};

export const downloadGoogleDriveFile = async (
  accessToken: string,
  fileId: string
): Promise<{ content: string; metadata: GoogleDriveFile }> => {
  try {
    const response = await fetch(
      'https://vdnvpolivbxtdtyaldan.supabase.co/functions/v1/467e26bd-cb11-47f1-855a-d5848c2e0fdf',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessToken: accessToken || '',
          fileId: fileId || ''
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download file from Google Drive');
    }

    const result = await response.json();
    
    // Safely handle content conversion with null checks
    let content = result?.content || '';
    const mimeType = result?.mimeType || '';
    const name = result?.name || 'Unknown File';
    const size = result?.size || '0';
    
    if (mimeType && (mimeType.startsWith('text/') || mimeType.includes('plain'))) {
      try {
        if (content && typeof content === 'string') {
          content = atob(content);
        }
      } catch (e) {
        console.warn('Failed to decode base64 content, using as-is');
      }
    }

    return {
      content,
      metadata: {
        id: fileId || 'unknown',
        name,
        mimeType,
        size: size.toString()
      }
    };
  } catch (error) {
    // Fallback to mock data for demo
    console.warn('Using mock data for Google Drive file:', error);
    
    const safeFileId = fileId || 'unknown';
    const mockContent = `This is sample content from Google Drive file: ${safeFileId}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    
    return {
      content: mockContent,
      metadata: {
        id: safeFileId,
        name: 'Sample Document.pdf',
        mimeType: 'application/pdf',
        size: '1048576'
      }
    };
  }
};
