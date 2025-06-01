import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import UserAvatar from '@/components/UserAvatar';

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage = 'home' }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'ZH', name: '中文' },
    { code: 'IT', name: 'Italiano' },
    { code: 'FR', name: 'Français' }
  ];

  const navItems = [
    { label: t('nav.home'), path: '/', key: 'home' },
    { label: t('nav.howItWorks'), path: '/how-it-works', key: 'how-it-works' },
    { label: t('nav.pricing'), path: '/pricing', key: 'pricing' },
    { label: t('nav.about'), path: '/about', key: 'about' }
  ];

  const handleStartComparing = () => {
    navigate('/upload');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={handleLogoClick}
        >
          <div className="w-8 h-8 bg-[#0056b3] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">COMPARELY</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.key}
              to={item.path} 
              className={`transition-colors ${
                currentPage === item.key 
                  ? 'text-[#0056b3] font-medium' 
                  : 'text-gray-700 hover:text-[#0056b3]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAuthenticated ? (
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700">
                {t('nav.login')}
              </Button>
            </Link>
          ) : (
            <UserAvatar />
          )}
          <select 
            className="bg-transparent border-none text-gray-700 text-sm cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.code}
              </option>
            ))}
          </select>
          {currentPage === 'home' && (
            <Button 
              className="bg-[#0056b3] hover:bg-[#004494]"
              onClick={handleStartComparing}
            >
              {t('nav.startComparing')}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.key}
                    to={item.path} 
                    className={`text-lg transition-colors ${
                      currentPage === item.key 
                        ? 'text-[#0056b3] font-medium' 
                        : 'text-gray-700 hover:text-[#0056b3]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 space-y-4">
                  {!isAuthenticated ? (
                    <Link to="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        {t('nav.login')}
                      </Button>
                    </Link>
                  ) : (
                    <UserAvatar />
                  )}
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  {currentPage === 'home' && (
                    <Button 
                      className="w-full bg-[#0056b3] hover:bg-[#004494]"
                      onClick={handleStartComparing}
                    >
                      {t('nav.startComparing')}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
