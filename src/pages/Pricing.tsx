import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleStartTrial = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="pricing" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('pricing.free')}</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mt-4">
                $0<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.freeFeature1')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.freeFeature2')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.freeFeature3')}</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline" onClick={handleGetStarted}>
                {t('pricing.getStarted')}
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-[#0056b3] border-2">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#0056b3] text-white px-4 py-1 rounded-full text-sm">
                {t('pricing.mostPopular')}
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('pricing.pro')}</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mt-4">
                $29<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.proFeature1')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.proFeature2')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.proFeature3')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.proFeature4')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.proFeature5')}</span>
                </li>
              </ul>
              <Button className="w-full mt-6 bg-[#0056b3] hover:bg-[#004494]" onClick={handleStartTrial}>
                {t('pricing.startTrial')}
              </Button>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('pricing.enterprise')}</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mt-4">
                {t('pricing.custom')}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.enterpriseFeature1')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.enterpriseFeature2')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.enterpriseFeature3')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.enterpriseFeature4')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{t('pricing.enterpriseFeature5')}</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline">
                {t('pricing.contactSales')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
