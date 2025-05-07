"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import ImageCard from "@/components/ui/image-card";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Progress } from "@/components/ui/progress"

export default function Home() {
  const [activeTab, setActiveTab] = useState("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollDirection] = useState<"up" | "down" | null>(null);
  const sectionRefs = {
    about: useRef<HTMLDivElement>(null),
    why: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null)
  };
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabSections = ["about", "why", "testimonials", "contact"];

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle tab click
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setScrollProgress(tabSections.indexOf(value) / (tabSections.length - 1) * 100);
  };

  // Mock testimonial data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      comment: "This platform has completely transformed our workflow. The interface is intuitive and the features are exactly what we needed.",
      avatar: "/images/users/default_profile.jpg"
    },
    {
      name: "Michael Chen",
      role: "Senior Developer",
      comment: "The technical implementation is flawless. API integration was seamless and the documentation is comprehensive.",
      avatar: "/images/users/default_profile.jpg"
    },
    {
      name: "Elena Rodriguez",
      role: "UX Designer",
      comment: "As a designer, I appreciate the attention to detail. The UI components are well-structured and the customization options are excellent.",
      avatar: "/images/users/default_profile.jpg"
    }
  ];

  return (
    <div className="flex flex-col w-full justify-center items-center min-h-screen overflow-x-hidden">
      {/* Navigation Tabs with scroll direction indicator */}
      <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-center items-center py-4">
          <Tabs className="w-[120wv]">
          
            <TabsList className="grid grid-cols-4 w-full">
              {tabSections.map((section, index) => (
                <TabsTrigger 
                  key={section}
                  value={section} 
                  onClick={() => handleTabChange(section)}
                  data-state={activeTab === section ? "active" : "inactive"}
                  className="relative"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                  
                  {/* Show down arrow when this is active and scrolling down */}
                  {scrollDirection === "down" && activeTab === section && index < tabSections.length - 1 && (
                    <span className="absolute -bottom-1 right-1/2 transform translate-x-1/2 text-xs text-blue-500 animate-bounce">↓</span>
                  )}
                  
                  {/* Show up arrow when next section is active and scrolling up */}
                  {scrollDirection === "up" && activeTab === tabSections[index + 1] && (
                    <span className="absolute -bottom-1 right-1/2 transform translate-x-1/2 text-xs text-blue-500 animate-bounce">↑</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Progress 
              value={scrollProgress} 
              className="mx-auto h-2 transition-all duration-300 ease-out w-[60%]"
            />
      </div>

      {/* Main content with scroll area */}
      <ScrollArea 
        className="flex-1 overflow-auto"
        ref={scrollRef}
      >
        <Tabs 
          value={activeTab} 
          className="w-full" 
          onValueChange={handleTabChange}
        >
          {/* About Section */}
          <TabsContent value="about" className="m-0 focus:outline-none">
            <div ref={sectionRefs.about} className="min-h-screen py-16 px-4 container flex justify-center">
              <div className="max-w-4xl w-full mx-auto space-y-8">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Our Platform</h1>
                  <p className="text-xl text-muted-foreground">Discover what makes us different</p>
                </div>

                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-64 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-48" />
                      <Skeleton className="h-48" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative h-80 overflow-hidden rounded-lg">
                      <Image 
                        src="/images/pets/dog_1.jpg" 
                        alt="Featured Image" 
                        fill 
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <h2 className="text-2xl font-bold">Building the Future Together</h2>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <Card>
                        <CardHeader>
                          <CardTitle>Our Mission</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>We strive to create innovative solutions that make a difference in people's lives. Our platform is designed with you in mind, focusing on usability, accessibility, and performance.</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Our Vision</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>We envision a world where technology empowers everyone to achieve their goals. Through continuous improvement and user feedback, we're building the tools of tomorrow.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Why Choose Us Section */}
          <TabsContent value="why" className="m-0 focus:outline-none">
            <div ref={sectionRefs.why} className="min-h-screen py-16 px-4 container flex justify-center">
              <div className="w-full max-w-4xl mx-auto">
                <ResizablePanelGroup
                  direction="vertical"
                  className="border rounded-lg"
                >
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className="p-6">
                      <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Us</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {isLoading ? (
                          Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                          ))
                        ) : (
                          <>
                            <Card className="bg-primary text-primary-foreground">
                              <CardHeader>
                                <CardTitle>Innovative</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p>We're constantly pushing boundaries and exploring new technologies.</p>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-secondary text-secondary-foreground">
                              <CardHeader>
                                <CardTitle>Reliable</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p>Our platform is built on robust infrastructure with 99.9% uptime.</p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader>
                                <CardTitle>User-Focused</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p>Every feature we build starts with your needs in mind.</p>
                              </CardContent>
                            </Card>
                          </>
                        )}
                      </div>
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle />
                  
                  <ResizablePanel defaultSize={50}>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-4 text-center">Our Technology Stack</h3>
                      {isLoading ? (
                        <Skeleton className="h-64 w-full" />
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <TooltipProvider>
                            {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Go', 'Docker', 'PostgreSQL', 'Redis'].map((tech) => (
                              <Tooltip key={tech}>
                                <TooltipTrigger asChild>
                                  <Card className="h-30 flex items-center justify-center cursor-help">
                                    <CardContent className="p-2 text-center">
                                      <p className="font-medium">{tech}</p>
                                    </CardContent>
                                  </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>We use {tech} for building reliable and scalable applications</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </div>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials" className="m-0 focus:outline-none">
            <div ref={sectionRefs.testimonials} className="min-h-screen py-16 px-4 container flex justify-center">
              <div className="w-full max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
                
                {isLoading ? (
                  <div className="space-y-8">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-24 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-8">
                    {testimonials.map((testimonial, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary">
                              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                              <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold">{testimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                              <p className="mt-2">{testimonial.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Featured client logos (marquee effect) */}
                <div className="mt-16">
                  <h3 className="text-xl font-medium text-center mb-6">Trusted by leading companies</h3>
                  <div className="relative overflow-hidden">
                    <div className="flex animate-marquee space-x-8 py-4">
                      {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="shrink-0 bg-muted w-32 h-16 rounded flex items-center justify-center">
                          <span className="text-muted-foreground font-medium">Company {i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact" className="m-0 focus:outline-none">
            <div ref={sectionRefs.contact} className="min-h-screen py-16 px-4 container flex justify-center">
              <div className="w-full max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold">Get in Touch</h2>
                  <p className="text-muted-foreground mt-2">We'd love to hear from you</p>
                </div>
                
                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-1/3 mx-auto" />
                  </div>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Us</CardTitle>
                        <CardDescription>
                          Fill out the form below and we'll get back to you as soon as possible.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="name" className="text-sm font-medium">Name</label>
                              <input
                                id="name"
                                className="w-full p-2 border rounded-md"
                                placeholder="Your name"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium">Email</label>
                              <input
                                id="email"
                                type="email"
                                className="w-full p-2 border rounded-md"
                                placeholder="Your email"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <textarea
                              id="message"
                              rows={4}
                              className="w-full p-2 border rounded-md"
                              placeholder="Your message"
                            />
                          </div>
                          <button 
                            type="submit" 
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                          >
                            Send Message
                          </button>
                        </form>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Visit Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>123 Innovation Street</p>
                          <p>Tech District, San Francisco</p>
                          <p>CA 94103</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Call Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>+1 (555) 123-4567</p>
                          <p>Monday - Friday: 9am - 5pm</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Email Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>info@example.com</p>
                          <p>support@example.com</p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
