import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScholarshipCard from "@/components/scholarship-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, DollarSign } from "lucide-react";
import type { Scholarship, ScholarshipFilters } from "@/types";

export default function Scholarships() {
  const [filters, setFilters] = useState<ScholarshipFilters>({
    search: "",
    type: "",
    level: "",
    countries: "",
    page: 1,
    limit: 12
  });

  const buildQueryString = (currentFilters: ScholarshipFilters) => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value.toString());
      }
    });
    return params.toString();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/scholarships?${buildQueryString(filters)}`],
  });

  const scholarships = data?.scholarships || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / (filters.limit || 12));

  const handleFilterChange = (key: keyof ScholarshipFilters, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Query will automatically refetch due to dependency on filters
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl mb-6">
            Exclusive Scholarships
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Access thousands of scholarship opportunities with our intelligent matching system
          </p>
        </div>
      </section>

      <div className="bg-neutral-bg">
        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Bar */}
          <Card className="mb-8 -mt-8 relative z-10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2 relative">
                  <Input
                    placeholder="Search scholarships..."
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                
                <Select
                  value={filters.type || ""}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full">Full Funding</SelectItem>
                    <SelectItem value="partial">Partial Funding</SelectItem>
                    <SelectItem value="need-based">Need-Based</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filters.level || ""}
                  onValueChange={(value) => handleFilterChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="masters">Masters</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filters.countries || ""}
                  onValueChange={(value) => handleFilterChange("countries", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Multiple">Multiple Countries</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleSearch}
                  className="bg-secondary text-white hover:bg-secondary/90"
                >
                  <Filter className="mr-2" size={16} />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {isLoading ? "Loading..." : `Showing ${scholarships.length} of ${total} scholarships`}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select defaultValue="amount">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scholarship Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading scholarships</h3>
              <p className="text-gray-500">Please try again later or contact support.</p>
            </div>
          ) : scholarships.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No scholarships found</h3>
              <p className="text-gray-500">Try adjusting your search criteria to see more opportunities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scholarships.map((scholarship: Scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <Button
                variant="outline"
                disabled={filters.page === 1}
                onClick={() => handlePageChange((filters.page || 1) - 1)}
              >
                Previous
              </Button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, (filters.page || 1) - 2)) + i;
                return (
                  <Button
                    key={page}
                    variant={page === filters.page ? "default" : "outline"}
                    className={page === filters.page ? "bg-primary text-white" : ""}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                disabled={filters.page === totalPages}
                onClick={() => handlePageChange((filters.page || 1) + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
