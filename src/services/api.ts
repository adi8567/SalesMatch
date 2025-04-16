
// Mock API service for demonstration
import { toast } from "sonner";

// Mock token storage
let authToken: string | null = null;

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  revenue: string;
  employees: number;
  location: string;
  matchScore: number;
  status: 'None' | 'Target' | 'Blacklist';
}

// Mock company data
const MOCK_COMPANIES: Company[] = [
  {
    id: 1,
    name: "Acme Corporation",
    industry: "Technology",
    revenue: "$125M",
    employees: 750,
    location: "San Francisco, CA",
    matchScore: 92,
    status: 'None'
  },
  {
    id: 2,
    name: "TechGrowth Inc",
    industry: "Technology",
    revenue: "$50M",
    employees: 300,
    location: "Austin, TX",
    matchScore: 87,
    status: 'None'
  },
  {
    id: 3,
    name: "Global Solutions",
    industry: "Consulting",
    revenue: "$200M",
    employees: 1200,
    location: "New York, NY",
    matchScore: 78,
    status: 'None'
  },
  {
    id: 4,
    name: "Innovative Retail",
    industry: "Retail",
    revenue: "$320M",
    employees: 2500,
    location: "Chicago, IL",
    matchScore: 65,
    status: 'None'
  },
  {
    id: 5,
    name: "Financial Partners",
    industry: "Finance",
    revenue: "$420M", 
    employees: 1800,
    location: "Boston, MA",
    matchScore: 71,
    status: 'None'
  },
  {
    id: 6,
    name: "Healthcare Systems",
    industry: "Healthcare",
    revenue: "$150M",
    employees: 900,
    location: "Denver, CO",
    matchScore: 88,
    status: 'None'
  },
  {
    id: 7,
    name: "Manufacturing Pro",
    industry: "Manufacturing",
    revenue: "$210M",
    employees: 1500,
    location: "Detroit, MI",
    matchScore: 63,
    status: 'None'
  },
  {
    id: 8,
    name: "AgriTech Solutions",
    industry: "Agriculture",
    revenue: "$85M",
    employees: 450,
    location: "Des Moines, IA",
    matchScore: 56,
    status: 'None'
  }
];

// In-memory storage for our mock data
let companies = [...MOCK_COMPANIES];

// Mock API methods
export const api = {
  // Login endpoint
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation - in a real app, this would check against a database
        if (data.username && data.password) {
          const token = `mock-jwt-token-${Math.random().toString(36).substring(2, 10)}`;
          authToken = token;
          resolve({
            message: "Login successful",
            token
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800); // Simulate network delay
    });
  },
  
  // Get accounts/companies endpoint
  getAccounts: async (): Promise<Company[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (authToken) {
          resolve(companies);
        } else {
          reject(new Error("Unauthorized"));
        }
      }, 800);
    });
  },
  
  // Update account status endpoint
  updateAccountStatus: async (id: number, status: 'None' | 'Target' | 'Blacklist'): Promise<Company> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!authToken) {
          reject(new Error("Unauthorized"));
          return;
        }
        
        const companyIndex = companies.findIndex(c => c.id === id);
        if (companyIndex === -1) {
          reject(new Error("Company not found"));
          return;
        }
        
        // Update the company status
        companies[companyIndex] = {
          ...companies[companyIndex],
          status
        };
        
        resolve(companies[companyIndex]);
      }, 600);
    });
  },
  
  // Logout method
  logout: () => {
    authToken = null;
    // Reset companies to original state
    companies = [...MOCK_COMPANIES];
  },
  
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return authToken !== null;
  }
};

// Helper to handle API errors
export const handleApiError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "An unknown error occurred";
  toast.error(message);
  console.error("API Error:", error);
  return message;
};
