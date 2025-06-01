import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="about" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Target className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
              <CardTitle className="text-xl">{t('about.missionTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('about.missionDescription')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
              <CardTitle className="text-xl">{t('about.teamTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('about.teamDescription')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
              <CardTitle className="text-xl">{t('about.valuesTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('about.valuesDescription')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {t('about.storyTitle')}
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                {t('about.storyParagraph1')}
              </p>
              <p className="mb-6">
                {t('about.storyParagraph2')}
              </p>
              <p>
                {t('about.storyParagraph3')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
