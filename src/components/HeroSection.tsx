import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import DemoVideoDialog from './DemoVideoDialog';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showDemo, setShowDemo] = useState(false);

  const handleStartComparing = () => {
    navigate('/pricing');
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {t('hero.title').split(' ').slice(0, 3).join(' ')}
          <span className="text-[#0056b3]"> {t('hero.title').split(' ').slice(3).join(' ')}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-[#0056b3] hover:bg-[#004494] text-lg px-8 py-3"
            onClick={handleStartComparing}
          >
            {t('nav.startComparing')}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-3"
            onClick={handleWatchDemo}
          >
            {t('hero.watchDemo')}
          </Button>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Trusted by professionals worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Microsoft</div>
            <div className="text-2xl font-bold text-gray-400">Google</div>
            <div className="text-2xl font-bold text-gray-400">Adobe</div>
          </div>
        </div>
      </div>
      <DemoVideoDialog open={showDemo} onOpenChange={setShowDemo} />
    </div>
  );
};

export default HeroSection;
