import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';

interface ComparisonOptionsProps {
  onOptionSelect: (option: 'upload' | 'text') => void;
}

const ComparisonOptions: React.FC<ComparisonOptionsProps> = ({ onOptionSelect }) => {
  const [selectedOption, setSelectedOption] = useState<'upload' | 'text' | null>(null);

  const handleOptionClick = (option: 'upload' | 'text') => {
    setSelectedOption(option);
    onOptionSelect(option);
  };

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Ready to Compare? Choose Your Option
        </h2>
        
        <div className="flex justify-center space-x-4 mb-8">
          <Button 
            onClick={() => handleOptionClick('upload')}
            className={`px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              selectedOption === 'upload' 
                ? 'bg-[#0056b3] hover:bg-[#004494] text-white' 
                : 'bg-gray-400 hover:bg-gray-500 text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
          </Button>
          
          <Button 
            onClick={() => handleOptionClick('text')}
            className={`px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              selectedOption === 'text' 
                ? 'bg-[#0056b3] hover:bg-[#004494] text-white' 
                : 'bg-gray-400 hover:bg-gray-500 text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Compare Text</span>
          </Button>
        </div>

        {selectedOption && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {selectedOption === 'upload' 
                ? 'Upload your documents to compare them side by side'
                : 'Enter or paste text directly to compare'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComparisonOptions;
