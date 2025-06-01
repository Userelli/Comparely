import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoStepsProps {
  currentStep: number;
}

const DemoSteps: React.FC<DemoStepsProps> = ({ currentStep }) => {
  const steps = [
    {
      title: "View Detailed Comparison",
      description: "See highlighted differences and detailed analysis",
      icon: FileText,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Document 1</h4>
            <div className="text-sm space-y-1">
              <p>The quick brown fox</p>
              <p className="bg-red-100 px-1">jumps over the lazy dog</p>
              <p>in the forest.</p>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Document 2</h4>
            <div className="text-sm space-y-1">
              <p>The quick brown fox</p>
              <p className="bg-green-100 px-1">runs through the busy street</p>
              <p>in the forest.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Export Your Results",
      description: "Download comparison reports in multiple formats",
      icon: Download,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-xs">PDF Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-xs">Word Doc</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-xs">Excel Sheet</span>
            </Button>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-800">✓ Comparison complete! Ready to download.</p>
          </div>
        </div>
      )
    }
  ];

  if (currentStep < 2) return null;
  
  const stepIndex = currentStep - 2;
  const step = steps[stepIndex];
  
  if (!step) return null;

  return (
    <div>
      <div className="flex items-center mb-4">
        <step.icon className="h-6 w-6 mr-3 text-blue-600" />
        <div>
          <h3 className="font-semibold">{step.title}</h3>
          <p className="text-sm text-gray-600">{step.description}</p>
        </div>
      </div>
      {step.content}
    </div>
  );
};

export default DemoSteps;
