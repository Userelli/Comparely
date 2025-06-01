import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage="home" />
      <HeroSection />
    </div>
  );
};

export default Index;
