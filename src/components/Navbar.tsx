
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Target, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    api.logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">SalesMatch</span>
        </div>
        
        {api.isLoggedIn() && (
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
