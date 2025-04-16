
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LoginForm from '@/components/LoginForm';
import { api } from '@/services/api';
import { Target } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (api.isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Target className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mt-4 text-3xl font-bold">Target Match Nexus</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Identify and target your best-fit accounts
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Index;
