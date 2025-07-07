import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Send, Globe, MessageCircle } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(contactForm);
  };

  const socialLinks = [
    { icon: "facebook", href: "#", color: "bg-blue-600 hover:bg-blue-700" },
    { icon: "twitter", href: "#", color: "bg-blue-400 hover:bg-blue-500" },
    { icon: "linkedin", href: "#", color: "bg-blue-800 hover:bg-blue-900" },
    { icon: "instagram", href: "#", color: "bg-pink-600 hover:bg-pink-700" },
    { icon: "youtube", href: "#", color: "bg-red-600 hover:bg-red-700" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl mb-6">
            Get In Touch
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Ready to start your education journey? Contact our expert consultants today
          </p>
        </div>
      </section>

      <div className="bg-neutral-bg">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="-mt-8 relative z-10">
              <CardContent className="p-8">
                <h3 className="font-semibold text-2xl text-primary mb-6 flex items-center">
                  <MessageCircle className="mr-3" size={24} />
                  Send us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input 
                        value={contactForm.firstName}
                        onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input 
                        value={contactForm.lastName}
                        onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input 
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <Input 
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Select 
                      value={contactForm.subject} 
                      onValueChange={(value) => setContactForm({...contactForm, subject: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="university-selection">University Selection</SelectItem>
                        <SelectItem value="scholarship-application">Scholarship Application</SelectItem>
                        <SelectItem value="visa-consultation">Visa Consultation</SelectItem>
                        <SelectItem value="application-support">Application Support</SelectItem>
                        <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea 
                      rows={5}
                      placeholder="Tell us about your education goals and how we can help you..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-secondary text-white hover:bg-secondary/90"
                    disabled={contactMutation.isPending}
                  >
                    <Send className="mr-2" size={16} />
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary text-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Phone className="text-2xl" size={24} />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Call Us</h4>
                    <p className="opacity-90">+234 (0) 708 123 4567</p>
                    <p className="opacity-90">+1 (555) 123-4567</p>
                    <p className="text-sm opacity-75 mt-2">Available 9 AM - 6 PM WAT</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-secondary text-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Mail className="text-2xl" size={24} />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Email Us</h4>
                    <p className="opacity-90">info@mtendereedu.com</p>
                    <p className="opacity-90">support@mtendereedu.com</p>
                    <p className="text-sm opacity-75 mt-2">Response within 24 hours</p>
                  </CardContent>
                </Card>
              </div>

              {/* Office Locations */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-xl text-primary mb-6 flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Our Offices
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="text-white" size={16} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-primary mb-1">Lagos Office (Headquarters)</h5>
                        <p className="text-gray-600 text-sm">Plot 15, Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
                        <p className="text-gray-500 text-xs mt-1">Mon - Fri: 9:00 AM - 6:00 PM WAT</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="text-white" size={16} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-primary mb-1">Abuja Office</h5>
                        <p className="text-gray-600 text-sm">Suite 302, Central Business District, Abuja, Nigeria</p>
                        <p className="text-gray-500 text-xs mt-1">Mon - Fri: 9:00 AM - 5:00 PM WAT</p>
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
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h4 className="font-semibold text-xl text-primary mb-6 flex items-center justify-center">
                    <Globe className="mr-2" size={20} />
                    Follow Us
                  </h4>
                  <div className="flex justify-center space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className={`w-12 h-12 ${social.color} text-white rounded-xl flex items-center justify-center transition-colors`}
                      >
                        <span className="sr-only">{social.icon}</span>
                        <i className={`fab fa-${social.icon}`}></i>
                      </a>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Stay updated with the latest education opportunities and news
                  </p>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="bg-accent text-primary">
                <CardContent className="p-6 text-center">
                  <h4 className="font-semibold text-lg mb-4">Need Immediate Help?</h4>
                  <p className="mb-4 text-sm">
                    Book a free consultation call with our education experts
                  </p>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Book Free Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
