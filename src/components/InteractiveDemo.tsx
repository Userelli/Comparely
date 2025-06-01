import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Zap, Download, ChevronRight, Play, Pause } from 'lucide-react';
import DemoSteps from './DemoSteps';

interface InteractiveDemoProps {
  onClose: () => void;
}

const InteractiveDemo: React.FC<InteractiveDemoProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const totalSteps = 4;

  const stepData = [
    {
      title: "Upload Your Documents",
      description: "Start by uploading two documents you want to compare",
      icon: Upload,
      content: (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-sm text-gray-600">Drag & drop your first document here</p>
            <div className="mt-2 text-xs text-blue-600">Supports PDF, DOCX, TXT files</div>
          </div>
          <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-sm text-gray-600">Drag & drop your second document here</p>
            <div className="mt-2 text-xs text-green-600">Or click to browse files</div>
          </div>
        </div>
      )
    },
    {
      title: "AI Analysis in Progress",
      description: "Our AI analyzes your documents and identifies differences",
      icon: Zap,
      content: (
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600">Analyzing documents...</p>
          <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
            <p className="text-xs text-blue-800 mb-1">✓ Text extraction complete</p>
            <p className="text-xs text-blue-800 mb-1">✓ Identifying differences</p>
            <p className="text-xs text-blue-800">✓ Generating comparison report</p>
          </div>
          <div className="text-xs text-gray-500">Processing time: ~30 seconds</div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    setCurrentStep(prev => (prev + 1) % totalSteps);
  };

  const prevStep = () => {
    setCurrentStep(prev => (prev - 1 + totalSteps) % totalSteps);
  };

  const startAutoPlay = () => {
    setIsPlaying(true);
    const id = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % totalSteps);
    }, 3000);
    setIntervalId(id);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const getCurrentContent = () => {
    if (currentStep < 2) {
      return stepData[currentStep];
    }
    return null;
  };

  const currentContent = getCurrentContent();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">How Comparely Works</h2>
        <p className="text-gray-600 mb-6">See how easy it is to compare documents with AI</p>
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={isPlaying ? stopAutoPlay : startAutoPlay} variant="outline">
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? 'Pause Demo' : 'Auto Play Demo'}
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => setCurrentStep(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  index === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
              {index < totalSteps - 1 && (
                <div className={`w-16 h-1 mx-2 transition-colors ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="mb-6 min-h-[400px]">
        {currentContent ? (
          <>
            <CardHeader>
              <CardTitle className="flex items-center">
                <currentContent.icon className="h-6 w-6 mr-3 text-blue-600" />
                {currentContent.title}
              </CardTitle>
              <p className="text-gray-600">{currentContent.description}</p>
            </CardHeader>
            <CardContent>
              {currentContent.content}
            </CardContent>
          </>
        ) : (
          <CardContent className="p-6">
            <DemoSteps currentStep={currentStep} />
          </CardContent>
        )}
      </Card>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close Demo
          </Button>
        </div>
        <Button onClick={nextStep}>
          {currentStep === totalSteps - 1 ? 'Restart Demo' : 'Next Step'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default InteractiveDemo;
