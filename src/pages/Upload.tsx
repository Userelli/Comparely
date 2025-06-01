import React from 'react';
import Navigation from '@/components/Navigation';
import FileUploadNew from '@/components/FileUploadNew';
import { Card } from '@/components/ui/card';

const Upload: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Documents</h1>
          <p className="text-gray-600">Upload two documents to see the differences between them</p>
        </div>
        
        <Card className="max-w-6xl mx-auto p-8">
          <FileUploadNew />
        </Card>
      </div>
    </div>
  );
};

export default Upload;
