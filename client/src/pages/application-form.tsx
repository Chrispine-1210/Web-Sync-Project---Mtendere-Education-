import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { FileText, User, GraduationCap, Upload, CheckCircle } from "lucide-react";

interface ApplicationFormData {
  type: "university" | "scholarship";
  universityId?: number;
  scholarshipId?: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    address: string;
    city: string;
    country: string;
  };
  academicInfo: {
    currentEducationLevel: string;
    institution: string;
    gpa: string;
    graduationYear: string;
    fieldOfStudy: string;
    testScores: {
      toefl?: string;
      ielts?: string;
      sat?: string;
      gre?: string;
      gmat?: string;
    };
  };
  documentsInfo: {
    transcripts: boolean;
    diploma: boolean;
    passport: boolean;
    financialProof: boolean;
    essay: boolean;
    recommendations: boolean;
  };
  essayAnswers: {
    personalStatement: string;
    motivationLetter: string;
    careerGoals: string;
  };
}

export default function ApplicationForm() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState<ApplicationFormData>({
    type: "university",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
      address: "",
      city: "",
      country: "",
    },
    academicInfo: {
      currentEducationLevel: "",
      institution: "",
      gpa: "",
      graduationYear: "",
      fieldOfStudy: "",
      testScores: {},
    },
    documentsInfo: {
      transcripts: false,
      diploma: false,
      passport: false,
      financialProof: false,
      essay: false,
      recommendations: false,
    },
    essayAnswers: {
      personalStatement: "",
      motivationLetter: "",
      careerGoals: "",
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the application form.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 2000);
    }
  }, [isAuthenticated, isLoading, toast]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        }
      }));
    }
  }, [user]);

  const { data: universitiesData } = useQuery({
    queryKey: ["/api/universities?limit=50"],
    enabled: isAuthenticated,
  });

  const { data: scholarshipsData } = useQuery({
    queryKey: ["/api/scholarships?limit=50"],
    enabled: isAuthenticated,
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      const payload = {
        type: data.type,
        universityId: data.universityId,
        scholarshipId: data.scholarshipId,
        personalInfo: data.personalInfo,
        academicInfo: data.academicInfo,
        documentsInfo: data.documentsInfo,
        essayAnswers: data.essayAnswers,
        status: "draft",
      };
      
      await apiRequest("POST", "/api/applications", payload);
    },
    onSuccess: () => {
      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and get back to you soon.",
      });
      // Reset form or redirect
      window.location.href = "/";
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error submitting application",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    // Validate required fields
    const { personalInfo, academicInfo, essayAnswers } = formData;
    
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
      toast({
        title: "Please complete your personal information",
        variant: "destructive",
      });
      setActiveTab("personal");
      return;
    }

    if (!academicInfo.currentEducationLevel || !academicInfo.gpa) {
      toast({
        title: "Please complete your academic information",
        variant: "destructive",
      });
      setActiveTab("academic");
      return;
    }

    if (!essayAnswers.personalStatement) {
      toast({
        title: "Please complete your personal statement",
        variant: "destructive",
      });
      setActiveTab("essays");
      return;
    }

    if (formData.type === "university" && !formData.universityId) {
      toast({
        title: "Please select a university",
        variant: "destructive",
      });
      return;
    }

    if (formData.type === "scholarship" && !formData.scholarshipId) {
      toast({
        title: "Please select a scholarship",
        variant: "destructive",
      });
      return;
    }

    applicationMutation.mutate(formData);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateAcademicInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      academicInfo: { ...prev.academicInfo, [field]: value }
    }));
  };

  const updateTestScore = (test: string, score: string) => {
    setFormData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        testScores: { ...prev.academicInfo.testScores, [test]: score }
      }
    }));
  };

  const updateEssayAnswer = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      essayAnswers: { ...prev.essayAnswers, [field]: value }
    }));
  };

  const toggleDocument = (doc: string) => {
    setFormData(prev => ({
      ...prev,
      documentsInfo: {
        ...prev.documentsInfo,
        [doc]: !prev.documentsInfo[doc as keyof typeof prev.documentsInfo]
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-bg">
        <Header />
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-bg">
        <Header />
        <div className="pt-20 flex items-center justify-center h-96">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <User className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-4">Please log in to access the application form.</p>
              <Button onClick={() => window.location.href = "/api/login"}>
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Application Form</h1>
            <p className="text-gray-600">Complete your application to start your education journey</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Application Type Selection */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Application Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={formData.type === "university" ? "default" : "outline"}
                    className={`h-auto py-4 ${formData.type === "university" ? "bg-primary text-white" : ""}`}
                    onClick={() => setFormData(prev => ({ ...prev, type: "university" }))}
                  >
                    <GraduationCap className="mr-2" size={20} />
                    University Application
                  </Button>
                  <Button
                    variant={formData.type === "scholarship" ? "default" : "outline"}
                    className={`h-auto py-4 ${formData.type === "scholarship" ? "bg-primary text-white" : ""}`}
                    onClick={() => setFormData(prev => ({ ...prev, type: "scholarship" }))}
                  >
                    <FileText className="mr-2" size={20} />
                    Scholarship Application
                  </Button>
                </div>

                {formData.type === "university" && (
                  <div className="mt-4">
                    <Label>Select University</Label>
                    <Select
                      value={formData.universityId?.toString() || ""}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, universityId: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a university" />
                      </SelectTrigger>
                      <SelectContent>
                        {universitiesData?.universities?.map((uni: any) => (
                          <SelectItem key={uni.id} value={uni.id.toString()}>
                            {uni.name} - {uni.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.type === "scholarship" && (
                  <div className="mt-4">
                    <Label>Select Scholarship</Label>
                    <Select
                      value={formData.scholarshipId?.toString() || ""}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, scholarshipId: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a scholarship" />
                      </SelectTrigger>
                      <SelectContent>
                        {scholarshipsData?.scholarships?.map((scholarship: any) => (
                          <SelectItem key={scholarship.id} value={scholarship.id.toString()}>
                            {scholarship.name} - {scholarship.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="academic">Academic Info</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="essays">Essays</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2" size={20} />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.personalInfo.firstName}
                          onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.personalInfo.lastName}
                          onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.personalInfo.dateOfBirth}
                          onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={formData.personalInfo.nationality}
                          onChange={(e) => updatePersonalInfo("nationality", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passportNumber">Passport Number</Label>
                        <Input
                          id="passportNumber"
                          value={formData.personalInfo.passportNumber}
                          onChange={(e) => updatePersonalInfo("passportNumber", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.personalInfo.address}
                        onChange={(e) => updatePersonalInfo("address", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.personalInfo.city}
                          onChange={(e) => updatePersonalInfo("city", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.personalInfo.country}
                          onChange={(e) => updatePersonalInfo("country", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Academic Information */}
              <TabsContent value="academic">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="mr-2" size={20} />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentEducationLevel">Current Education Level *</Label>
                        <Select
                          value={formData.academicInfo.currentEducationLevel}
                          onValueChange={(value) => updateAcademicInfo("currentEducationLevel", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high-school">High School</SelectItem>
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="masters">Masters</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                        <Input
                          id="fieldOfStudy"
                          value={formData.academicInfo.fieldOfStudy}
                          onChange={(e) => updateAcademicInfo("fieldOfStudy", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="institution">Current/Last Institution</Label>
                        <Input
                          id="institution"
                          value={formData.academicInfo.institution}
                          onChange={(e) => updateAcademicInfo("institution", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          type="number"
                          value={formData.academicInfo.graduationYear}
                          onChange={(e) => updateAcademicInfo("graduationYear", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gpa">GPA/Grade *</Label>
                      <Input
                        id="gpa"
                        value={formData.academicInfo.gpa}
                        onChange={(e) => updateAcademicInfo("gpa", e.target.value)}
                        placeholder="e.g., 3.8/4.0 or 85%"
                        required
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Test Scores (if applicable)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="toefl">TOEFL</Label>
                          <Input
                            id="toefl"
                            value={formData.academicInfo.testScores.toefl || ""}
                            onChange={(e) => updateTestScore("toefl", e.target.value)}
                            placeholder="Score"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ielts">IELTS</Label>
                          <Input
                            id="ielts"
                            value={formData.academicInfo.testScores.ielts || ""}
                            onChange={(e) => updateTestScore("ielts", e.target.value)}
                            placeholder="Score"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sat">SAT</Label>
                          <Input
                            id="sat"
                            value={formData.academicInfo.testScores.sat || ""}
                            onChange={(e) => updateTestScore("sat", e.target.value)}
                            placeholder="Score"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gre">GRE</Label>
                          <Input
                            id="gre"
                            value={formData.academicInfo.testScores.gre || ""}
                            onChange={(e) => updateTestScore("gre", e.target.value)}
                            placeholder="Score"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gmat">GMAT</Label>
                          <Input
                            id="gmat"
                            value={formData.academicInfo.testScores.gmat || ""}
                            onChange={(e) => updateTestScore("gmat", e.target.value)}
                            placeholder="Score"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="mr-2" size={20} />
                      Required Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      Please check the documents you have ready. You can upload them after submitting this application.
                    </p>
                    <div className="space-y-4">
                      {Object.entries(formData.documentsInfo).map(([doc, checked]) => (
                        <div key={doc} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={doc}
                            checked={checked}
                            onChange={() => toggleDocument(doc)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={doc} className="flex items-center cursor-pointer">
                            {checked && <CheckCircle className="mr-2 text-green-500" size={16} />}
                            {doc.charAt(0).toUpperCase() + doc.slice(1).replace(/([A-Z])/g, ' $1')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Essays */}
              <TabsContent value="essays">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2" size={20} />
                      Essay Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="personalStatement">Personal Statement *</Label>
                      <Textarea
                        id="personalStatement"
                        rows={6}
                        value={formData.essayAnswers.personalStatement}
                        onChange={(e) => updateEssayAnswer("personalStatement", e.target.value)}
                        placeholder="Tell us about yourself, your background, and what makes you unique..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivationLetter">Motivation Letter</Label>
                      <Textarea
                        id="motivationLetter"
                        rows={6}
                        value={formData.essayAnswers.motivationLetter}
                        onChange={(e) => updateEssayAnswer("motivationLetter", e.target.value)}
                        placeholder="Why do you want to study at this institution/apply for this scholarship?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="careerGoals">Career Goals</Label>
                      <Textarea
                        id="careerGoals"
                        rows={6}
                        value={formData.essayAnswers.careerGoals}
                        onChange={(e) => updateEssayAnswer("careerGoals", e.target.value)}
                        placeholder="What are your short-term and long-term career goals?"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation and Submit */}
            <div className="flex justify-between items-center mt-8">
              <div className="flex space-x-2">
                {activeTab !== "personal" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const tabs = ["personal", "academic", "documents", "essays"];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex space-x-2">
                {activeTab !== "essays" ? (
                  <Button
                    onClick={() => {
                      const tabs = ["personal", "academic", "documents", "essays"];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={applicationMutation.isPending}
                    className="bg-secondary text-white hover:bg-secondary/90"
                  >
                    {applicationMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
