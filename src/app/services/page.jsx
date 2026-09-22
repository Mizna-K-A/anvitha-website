"use client";
import { useState, useRef, useEffect } from 'react';
import { Code, Palette, Globe, Users, Zap, Target, ArrowRight, Check, Sparkles, TrendingUp, Award, Clock, DollarSign, Menu, X, ChevronRight, Layers, Smartphone, Database, Shield, Cloud, BarChart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TransitionLink, Footer } from '@/components/PageTransition';
import Navbar from '@/components/Navbar';

import * as Icons from 'lucide-react';
import { initialContent } from '@/lib/initialData';

gsap.registerPlugin(ScrollTrigger);

function getIconComponent(iconName) {
  const IconComp = Icons[iconName] || Icons.Code;
  return <IconComp className="w-12 h-12" />;
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mainServices, setMainServices] = useState([]);

  const heroRef = useRef(null);
  const servicesGridRef = useRef([]);
  const processRef = useRef(null);
  const processStepsRef = useRef([]);
  const techStackRef = useRef(null);
  const pricingRef = useRef(null);
  const pricingCardsRef = useRef([]);
  const ctaRef = useRef(null);

  useEffect(() => {
    const mapIcons = (servicesList) => {
      return servicesList.map(s => ({
        ...s,
        icon: getIconComponent(s.iconName)
      }));
    };

    setMainServices(mapIcons(initialContent.services));

    const fetchLiveContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.services && data.services.length > 0) {
            setMainServices(mapIcons(data.services));
          }
        }
      } catch (err) {
        console.warn('Could not fetch live services content. Using static fallback.');
      }
    };
    fetchLiveContent();
  }, []);

  const processSteps = [
    {
      number: "01",
      title: "Discovery",
      description: "We dive deep into your business goals, challenges, and vision to understand exactly what you need.",
      icon: <Target className="w-8 h-8" />
    },
    {
      number: "02",
      title: "Strategy",
      description: "Our team crafts a comprehensive roadmap tailored to your objectives and market dynamics.",
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Design",
      description: "We create intuitive, visually stunning designs that resonate with your target audience.",
      icon: <Palette className="w-8 h-8" />
    },
    {
      number: "04",
      title: "Development",
      description: "Our engineers build robust, scalable solutions using cutting-edge technologies and best practices.",
      icon: <Code className="w-8 h-8" />
    },
    {
      number: "05",
      title: "Testing",
      description: "Rigorous quality assurance ensures flawless performance across all devices and scenarios.",
      icon: <Shield className="w-8 h-8" />
    },
    {
      number: "06",
      title: "Launch",
      description: "We deploy your solution seamlessly and provide ongoing support to ensure continued success.",
      icon: <Zap className="w-8 h-8" />
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$2,500",
      period: "per project",
      description: "Perfect for small businesses and startups looking to establish their digital presence.",
      features: [
        "Single Service Focus",
        "Up to 3 Revisions",
        "2 Week Delivery",
        "Basic Support",
        "Source Files Included",
        "30 Days Post-Launch Support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$7,500",
      period: "per project",
      description: "Ideal for growing businesses requiring comprehensive digital solutions.",
      features: [
        "Multiple Services",
        "Unlimited Revisions",
        "4 Week Delivery",
        "Priority Support",
        "Source Files & Documentation",
        "90 Days Post-Launch Support",
        "Performance Optimization",
        "SEO Implementation"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored solution",
      description: "For large organizations needing fully customized, enterprise-grade solutions.",
      features: [
        "Full Service Suite",
        "Dedicated Team",
        "Custom Timeline",
        "24/7 Support",
        "Complete Documentation",
        "1 Year Support & Maintenance",
        "Advanced Analytics",
        "Training & Onboarding",
        "SLA Guarantees"
      ],
      popular: false
    }
  ];

  const technologies = [
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "Node.js", category: "Backend" },
    { name: "Python", category: "Backend" },
    { name: "MongoDB", category: "Database" },
    { name: "PostgreSQL", category: "Database" },
    { name: "AWS", category: "Cloud" },
    { name: "Docker", category: "DevOps" },
    { name: "Kubernetes", category: "DevOps" },
    { name: "Figma", category: "Design" },
    { name: "TailwindCSS", category: "Frontend" }
  ];



  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.children,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out"
          }
        );
      }

      // Services Grid Animation
      servicesGridRef.current.forEach((card, index) => {
        if (card) {
          const isLeft = index % 2 === 0;
          gsap.fromTo(card,
            {
              opacity: 0,
              x: isLeft ? -80 : 80,
              y: 40
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1,
              delay: index * 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Process Steps Animation
      processStepsRef.current.forEach((step, index) => {
        if (step) {
          gsap.fromTo(step,
            {
              opacity: 0,
              y: 60,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Tech Stack Animation
      if (techStackRef.current) {
        const techs = techStackRef.current.querySelectorAll('.tech-badge');
        gsap.fromTo(techs,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: techStackRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Pricing Cards Animation
      pricingCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              opacity: 0,
              y: 80,
              rotationY: index === 1 ? 0 : (index === 0 ? -20 : 20),
              transformPerspective: 1000
            },
            {
              opacity: 1,
              y: 0,
              rotationY: 0,
              duration: 1.2,
              delay: index * 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // CTA Animation
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const filteredServices = selectedCategory === 'all'
    ? mainServices
    : mainServices.filter(service => service.category === selectedCategory);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div ref={heroRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white mr-2" />
            <span className="text-white/80 text-sm font-light tracking-wider">COMPREHENSIVE SOLUTIONS</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-wide text-white mb-8">
            Our Services
          </h1>

          <div className="w-24 h-px bg-white/30 mx-auto mb-8"></div>

          <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            From concept to launch, we provide end-to-end digital solutions that transform businesses and drive measurable results.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === 'all'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
            >
              All Services
            </button>
            <button
              onClick={() => setSelectedCategory('development')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === 'development'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
            >
              Development
            </button>
            <button
              onClick={() => setSelectedCategory('design')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === 'design'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
            >
              Design
            </button>
            <button
              onClick={() => setSelectedCategory('strategy')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === 'strategy'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
            >
              Strategy
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white/50 text-xs tracking-wider">EXPLORE</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="relative w-full py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredServices.map((service, index) => (
              <div
                key={index}
                ref={el => servicesGridRef.current[index] = el}
                className="group relative bg-white rounded-3xl p-10 border border-black/10 hover:border-black/30 hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {service.icon}
                  </div>
                  <span className="text-black/40 text-sm font-medium px-4 py-2 rounded-full bg-black/5">
                    {service.startingPrice}+
                  </span>
                </div>

                <h3 className="text-3xl font-semibold text-black mb-2 group-hover:text-black/80 transition-colors">
                  {service.title}
                </h3>

                <p className="text-black/40 text-sm font-medium mb-4 tracking-wide">
                  {service.tagline}
                </p>

                <p className="text-black/60 font-light leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-black/70">
                      <Check className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-black/10">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs px-3 py-1 rounded-full bg-black/5 text-black/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button className="text-black font-medium flex items-center space-x-2 group-hover:space-x-3 transition-all">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="relative w-full py-32 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Our Process
            </h2>
            <div className="w-24 h-px bg-white/30 mx-auto mb-6"></div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              A proven methodology that ensures exceptional results every time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                ref={el => processStepsRef.current[index] = el}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-6xl font-light text-white/20 group-hover:text-white/30 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4">
                  {step.title}
                </h3>

                <p className="text-white/60 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section ref={techStackRef} className="relative w-full py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6">
              Technologies We Use
            </h2>
            <div className="w-24 h-px bg-black/20 mx-auto mb-6"></div>
            <p className="text-xl text-black/60 max-w-3xl mx-auto font-light">
              Cutting-edge tools and frameworks to build powerful solutions
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="tech-badge group px-6 py-3 rounded-full bg-black text-white hover:bg-black/90 transition-all cursor-pointer hover:scale-105"
              >
                <span className="font-medium">{tech.name}</span>
                <span className="text-white/60 text-sm ml-2">• {tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="relative w-full py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Transparent Pricing
            </h2>
            <div className="w-24 h-px bg-white/30 mx-auto mb-6"></div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              Flexible packages designed to fit your budget and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                ref={el => pricingCardsRef.current[index] = el}
                className={`relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-500 cursor-pointer hover:scale-105 ${plan.popular
                  ? 'border-white bg-white/10 shadow-2xl shadow-white/20'
                  : 'border-white/10 hover:border-white/20'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-white text-black text-sm font-medium">
                      <Award className="w-4 h-4 mr-2" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-light text-white">{plan.price}</span>
                  </div>
                  <span className="text-white/50 text-sm">{plan.period}</span>
                </div>

                <p className="text-white/70 font-light text-center mb-8 leading-relaxed">
                  {plan.description}
                </p>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start text-white/80">
                      <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-light">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-full font-medium transition-all hover:scale-105 ${plan.popular
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-white/50 text-sm mt-12">
            All prices are starting estimates. Final pricing depends on project scope and requirements.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative w-full py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-8">
            Ready to Start Your Project?
          </h2>
          <div className="w-24 h-px bg-black/20 mx-auto mb-8"></div>
          <p className="text-xl text-black/60 font-light leading-relaxed mb-12">
            Let's discuss how we can help transform your business with our comprehensive digital solutions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/contact"
              className="bg-black text-white px-10 py-5 rounded-full font-medium hover:bg-black/90 hover:scale-105 transition-all text-lg inline-flex items-center justify-center space-x-3 group"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </a>
            <TransitionLink
              href="/portfolio"
              className="border-2 border-black text-black px-10 py-5 rounded-full font-medium hover:bg-black hover:text-white hover:scale-105 transition-all text-lg inline-flex items-center justify-center text-center"
            >
              View Portfolio
            </TransitionLink>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-3 p-6">
              <Clock className="w-10 h-10 text-black" />
              <span className="text-black/40 text-sm font-medium tracking-wider">FAST DELIVERY</span>
              <p className="text-black/70 text-sm font-light text-center">
                Average 2-6 week turnaround
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6">
              <Award className="w-10 h-10 text-black" />
              <span className="text-black/40 text-sm font-medium tracking-wider">QUALITY ASSURED</span>
              <p className="text-black/70 text-sm font-light text-center">
                100% satisfaction guarantee
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6">
              <Users className="w-10 h-10 text-black" />
              <span className="text-black/40 text-sm font-medium tracking-wider">EXPERT TEAM</span>
              <p className="text-black/70 text-sm font-light text-center">
                50+ skilled professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}