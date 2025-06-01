import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      // Call logout function to clear server session
      try {
        await fetch('https://dyxoboyylifsmlaireuw.supabase.co/functions/v1/c911d9f9-7b52-4c76-8303-f9dea6593e7b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
      } catch (err) {
        console.warn('Server logout failed:', err);
      }
      
      // Sign out from Supabase
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out completely, but you've been signed out locally.",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="outline" 
      className="w-full justify-start text-red-600 hover:text-red-700"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Log Out
    </Button>
  );
};

export default LogoutButton;
