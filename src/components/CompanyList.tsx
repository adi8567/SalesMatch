
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Company, handleApiError } from '@/services/api';
import CompanyCard from './CompanyCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('matchScore');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!api.isLoggedIn()) {
        navigate('/');
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await api.getAccounts();
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (error) {
        handleApiError(error);
        if (error instanceof Error && error.message === 'Unauthorized') {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, [navigate]);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...companies];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        company => 
          company.name.toLowerCase().includes(term) || 
          company.industry.toLowerCase().includes(term) ||
          company.location.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(company => company.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'matchScore':
          return b.matchScore - a.matchScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'industry':
          return a.industry.localeCompare(b.industry);
        default:
          return 0;
      }
    });
    
    setFilteredCompanies(result);
  }, [companies, searchTerm, statusFilter, sortBy]);

  // Update company in the state when status changes
  const handleStatusChange = (updatedCompany: Company) => {
    const updatedCompanies = companies.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    );
    setCompanies(updatedCompanies);
  };

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <Skeleton className="h-10 w-full md:w-1/4" />
          <Skeleton className="h-10 w-full md:w-1/4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col md:flex-row gap-4 sticky top-0 bg-background pt-4 pb-4 z-10">
        {/* Search input */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Status filter */}
        <div className="w-full md:w-1/4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Target">Target</SelectItem>
              <SelectItem value="Blacklist">Blacklist</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort by */}
        <div className="w-full md:w-1/4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matchScore">Match Score</SelectItem>
              <SelectItem value="name">Company Name</SelectItem>
              <SelectItem value="industry">Industry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No companies found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <CompanyCard
              key={company.id}
              company={company}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyList;
