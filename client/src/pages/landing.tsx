import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, FileText, DollarSign, Tickets, Video, Award, Phone, Mail, MapPin, Star, Users, Globe, TrendingUp } from "lucide-react";
import UniversityCard from "@/components/university-card";
import ScholarshipCard from "@/components/scholarship-card";
import type { University, Scholarship, BlogPost } from "@/types";

export default function Landing() {
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  // Fetch featured data
  const { data: universitiesData } = useQuery({
    queryKey: ["/api/universities?limit=3"],
  });

  const { data: scholarshipsData } = useQuery({
    queryKey: ["/api/scholarships?limit=3"],
  });

  const { data: blogData } = useQuery({
    queryKey: ["/api/blog?limit=3"],
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      
      if (response.ok) {
        setContactForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        // Show success message
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  const services = [
    {
      icon: GraduationCap,
      title: "University Selection",
      description: "AI-powered matching system to find the perfect university based on your profile, preferences, and career goals.",
      color: "from-secondary to-primary"
    },
    {
      icon: FileText,
      title: "Application Support",
      description: "Complete application assistance including document preparation, essay writing, and submission management.",
      color: "from-accent to-yellow-500"
    },
    {
      icon: DollarSign,
      title: "Scholarship Matching",
      description: "Access to exclusive scholarships and funding opportunities with intelligent matching algorithms.",
      color: "from-primary to-secondary"
    },
    {
      icon: Tickets,
      title: "Visa Processing",
      description: "Expert visa consultation and processing support with high success rates across all major destinations.",
      color: "from-green-500 to-secondary"
    },
    {
      icon: Video,
      title: "Virtual Consultations",
      description: "One-on-one consultations with education experts via secure video conferencing platform.",
      color: "from-purple-500 to-primary"
    },
    {
      icon: Award,
      title: "Career Guidance",
      description: "Post-graduation career support including job placement assistance and professional network building.",
      color: "from-red-500 to-accent"
    }
  ];

  const testimonials = [
    {
      name: "Samuel Okonkwo",
      program: "MSc Computer Science, MIT",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      location: "Lagos, Nigeria → Boston, USA",
      quote: "Mtendere Education made my dream of studying at MIT a reality. Their scholarship matching system found me a full funding opportunity I never knew existed. The support throughout the application process was exceptional."
    },
    {
      name: "Amina Hassan",
      program: "MBA, Oxford University",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      location: "Cairo, Egypt → Oxford, UK",
      quote: "The virtual consultation sessions were incredibly helpful. My counselor guided me through every step, from university selection to visa processing. I'm now pursuing my MBA at Oxford thanks to their expertise."
    },
    {
      name: "David Mensah",
      program: "PhD Engineering, University of Toronto",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      location: "Accra, Ghana → Toronto, Canada",
      quote: "The AI-powered university matching was spot-on. They found the perfect PhD program that aligned with my research interests and secured funding. The application support was comprehensive and professional."
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Study Strategies for International Students",
      excerpt: "Discover proven techniques to excel in your studies abroad and make the most of your international education experience.",
      category: "Study Tips",
      date: "Dec 15, 2024",
      readTime: 5,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=200&fit=crop",
      author: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      title: "Hidden Scholarship Opportunities for African Students",
      excerpt: "Uncover lesser-known scholarship programs that could fund your entire education journey abroad.",
      category: "Scholarships",
      date: "Dec 12, 2024",
      readTime: 7,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
      author: "Prof. Amina Abbas"
    },
    {
      id: 3,
      title: "Complete Guide to Student Visa Applications in 2025",
      excerpt: "Navigate the complex visa application process with our comprehensive guide covering all major destinations.",
      category: "Visa Guide",
      date: "Dec 10, 2024",
      readTime: 6,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=200&fit=crop",
      author: "Michael Chen"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-neutral-bg" id="services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-primary mb-6">
              Comprehensive Education Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From university selection to visa processing, we provide end-to-end support for your international education journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="feature-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6`}>
                  <service.icon className="text-white text-2xl" size={24} />
                </div>
                <h3 className="font-semibold text-xl mb-4 text-primary">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <button className="text-secondary font-semibold hover:text-primary transition-colors">
                  Learn More <span className="ml-2">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Showcase */}
      <section className="py-20 bg-white" id="universities">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-primary mb-6">
              Partner Universities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our extensive network of top-ranked universities across the globe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {universitiesData?.universities?.slice(0, 3).map((university: University) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              <GraduationCap className="mr-2" size={20} />
              View All Universities
            </Button>
          </div>
        </div>
      </section>

      {/* Scholarship Section */}
      <section className="py-20 hero-gradient" id="scholarships">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-white mb-6">
              Exclusive Scholarships
            </h2>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
              Access thousands of scholarship opportunities with our intelligent matching system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {scholarshipsData?.scholarships?.slice(0, 3).map((scholarship: Scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="secondary" className="bg-accent text-primary hover:bg-accent/90">
              <DollarSign className="mr-2" size={20} />
              Explore All Scholarships
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-primary mb-6">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from students who achieved their dreams through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-lg text-primary">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.program}</p>
                    <div className="flex text-accent text-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-sm text-gray-500">
                  <MapPin className="inline mr-1" size={12} />
                  {testimonial.location}
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2 stats-counter">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2 stats-counter">5,000+</div>
              <div className="text-gray-600">Students Placed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2 stats-counter">$50M+</div>
              <div className="text-gray-600">Scholarships Won</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2 stats-counter">54</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-primary mb-6">
              Smart Education Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Intelligent tools to help you plan your education journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Eligibility Checker */}
            <div className="bg-gradient-to-br from-secondary to-primary rounded-2xl p-8 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                  <Users className="text-2xl" size={24} />
                </div>
                <h3 className="font-semibold text-2xl">Eligibility Checker</h3>
              </div>
              
              <p className="mb-8 text-lg opacity-90">
                Get instant feedback on your eligibility for universities and programs worldwide
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="Your GPA" 
                    className="bg-white bg-opacity-20 placeholder:text-white placeholder:opacity-70 text-white border-white border-opacity-20"
                  />
                  <Select>
                    <SelectTrigger className="bg-white bg-opacity-20 text-white border-white border-opacity-20">
                      <SelectValue placeholder="Program Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="masters">Masters</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-accent text-primary font-semibold hover:bg-accent/90">
                  <TrendingUp className="mr-2" size={16} />
                  Check My Eligibility
                </Button>
              </div>
            </div>

            {/* Cost Calculator */}
            <div className="bg-gradient-to-br from-accent to-yellow-500 rounded-2xl p-8 text-primary">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center mr-4">
                  <DollarSign className="text-2xl" size={24} />
                </div>
                <h3 className="font-semibold text-2xl">Cost Calculator</h3>
              </div>
              
              <p className="mb-8 text-lg opacity-90">
                Estimate your total education costs including tuition, living expenses, and more
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger className="bg-white bg-opacity-50 text-primary">
                      <SelectValue placeholder="Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="bg-white bg-opacity-50 text-primary">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="4">4 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-primary text-white font-semibold hover:bg-primary/90">
                  <TrendingUp className="mr-2" size={16} />
                  Calculate Costs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-neutral-bg" id="blog">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-primary mb-6">
              Education Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest trends, tips, and opportunities in international education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Globe className="mr-2" size={14} />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="font-semibold text-xl text-primary mb-3 hover:text-secondary transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{post.author}</span>
                    <button className="text-secondary font-semibold hover:text-primary transition-colors">
                      Read More <span className="ml-1">→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              <Globe className="mr-2" size={20} />
              View All Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white" id="contact">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-primary mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your education journey? Contact our expert consultants today
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-neutral-bg rounded-2xl p-8">
              <h3 className="font-semibold text-2xl text-primary mb-6">Send us a Message</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <Input 
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <Input 
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input 
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input 
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Select value={contactForm.subject} onValueChange={(value) => setContactForm({...contactForm, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university-selection">University Selection</SelectItem>
                      <SelectItem value="scholarship-application">Scholarship Application</SelectItem>
                      <SelectItem value="visa-consultation">Visa Consultation</SelectItem>
                      <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea 
                    rows={5}
                    placeholder="Tell us about your education goals..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full bg-secondary text-white hover:bg-secondary/90">
                  <Mail className="mr-2" size={16} />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary text-white rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="text-2xl" size={24} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Call Us</h4>
                  <p className="opacity-90">+234 (0) 708 123 4567</p>
                  <p className="opacity-90">+1 (555) 123-4567</p>
                </div>
                
                <div className="bg-secondary text-white rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-2xl" size={24} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Email Us</h4>
                  <p className="opacity-90">info@mtendereedu.com</p>
                  <p className="opacity-90">support@mtendereedu.com</p>
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-neutral-bg rounded-2xl p-6">
                <h4 className="font-semibold text-xl text-primary mb-6">Our Offices</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="text-white" size={16} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-primary mb-1">Lagos Office (Headquarters)</h5>
                      <p className="text-gray-600 text-sm">Plot 15, Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
                      <p className="text-gray-500 text-xs mt-1">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="text-white" size={16} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-primary mb-1">Abuja Office</h5>
                      <p className="text-gray-600 text-sm">Suite 302, Central Business District, Abuja, Nigeria</p>
                      <p className="text-gray-500 text-xs mt-1">Mon - Fri: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="text-primary" size={16} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-primary mb-1">London Office</h5>
                      <p className="text-gray-600 text-sm">25 Bedford Square, London WC1B 3HW, United Kingdom</p>
                      <p className="text-gray-500 text-xs mt-1">Mon - Fri: 9:00 AM - 5:00 PM GMT</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
