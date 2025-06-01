import React, { useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ComparisonOptions from './ComparisonOptions';
import TextComparison from './TextComparison';
import FileUpload from './FileUpload';
import DiffViewer from './DiffViewer';

type ViewState = 'home' | 'text-input' | 'file-upload' | 'diff-view';

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [comparisonData, setComparisonData] = useState<{
    text1: string;
    text2: string;
  } | null>(null);

  const handleOptionSelect = (option: 'upload' | 'text') => {
    if (option === 'text') {
      setCurrentView('text-input');
    } else if (option === 'upload') {
      setCurrentView('file-upload');
    }
  };

  const handleTextCompare = (text1: string, text2: string) => {
    setComparisonData({ text1, text2 });
    setCurrentView('diff-view');
  };

  const handleBack = () => {
    if (currentView === 'diff-view') {
      // Go back to previous input method
      setCurrentView('text-input');
    } else {
      setCurrentView('home');
    }
  };

  if (currentView === 'diff-view' && comparisonData) {
    return (
      <DiffViewer
        text1={comparisonData.text1}
        text2={comparisonData.text2}
        onBack={handleBack}
      />
    );
  }

  if (currentView === 'text-input') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <TextComparison
          onBack={handleBack}
          onCompare={handleTextCompare}
        />
      </div>
    );
  }

  if (currentView === 'file-upload') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <FileUpload
          onBack={handleBack}
          onCompare={handleTextCompare}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <ComparisonOptions onOptionSelect={handleOptionSelect} />
    </div>
  );
};

export default AppLayout;
