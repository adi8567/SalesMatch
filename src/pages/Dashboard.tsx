
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CompanyList from '@/components/CompanyList';
import { api } from '@/services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!api.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Matching Dashboard</h1>
          <p className="text-muted-foreground">
            View and manage your target account matches. Update status to track your sales pipeline.
          </p>
        </div>
        <CompanyList />
      </main>
    </div>
  );
};

export default Dashboard;
