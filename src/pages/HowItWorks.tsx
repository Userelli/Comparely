import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleStartComparing = () => {
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="how-it-works" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('howItWorks.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Upload className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
              <CardTitle className="text-xl">{t('howItWorks.step1')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('howItWorks.step1Description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
              <CardTitle className="text-xl">{t('howItWorks.step2')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('howItWorks.step2Description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Eye className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
              <CardTitle className="text-xl">{t('howItWorks.step3')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('howItWorks.step3Description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Download className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
              <CardTitle className="text-xl">{t('howItWorks.step4')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('howItWorks.step4Description')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-[#0056b3] hover:bg-[#004494]"
            onClick={handleStartComparing}
          >
            {t('nav.startComparing')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
