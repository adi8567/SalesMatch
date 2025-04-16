
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Building2, Users, DollarSign, MapPin } from "lucide-react";
import { api, Company, handleApiError } from '@/services/api';
import { toast } from 'sonner';

interface CompanyCardProps {
  company: Company;
  onStatusChange: (company: Company) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to get match score color based on the score
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-match-high';
    if (score >= 60) return 'bg-match-medium';
    return 'bg-match-low';
  };

  // Function to get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Target':
        return <Badge className="bg-green-500 hover:bg-green-600">Target</Badge>;
      case 'Blacklist':
        return <Badge variant="destructive">Blacklist</Badge>;
      default:
        return <Badge variant="outline">None</Badge>;
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: 'None' | 'Target' | 'Blacklist') => {
    setIsUpdating(true);
    try {
      const updatedCompany = await api.updateAccountStatus(company.id, newStatus);
      toast.success(`Company status updated to ${newStatus}`);
      onStatusChange(updatedCompany);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{company.name}</CardTitle>
          <div 
            className={`${getMatchScoreColor(company.matchScore)} text-white font-medium text-sm px-2 py-1 rounded-full flex items-center justify-center`}
          >
            {company.matchScore}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-muted-foreground" />
            <span>{company.industry}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-muted-foreground" />
            <span>{company.revenue} Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-muted-foreground" />
            <span>{company.employees.toLocaleString()} Employees</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <span>{company.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div>
          {getStatusBadge(company.status)}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isUpdating}>
            <Button variant="outline" size="sm" className="ml-auto">
              {isUpdating ? 'Updating...' : 'Update Status'}
              <ChevronDown size={16} className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange('None')}>
              None
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Target')}>
              Target
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Blacklist')}>
              Blacklist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
