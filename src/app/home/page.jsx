"use client";
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap, Target, Users, Globe, Code, Palette } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { TransitionLink, Footer } from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import { initialContent } from '@/lib/initialData';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function RefinedLandingPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const videoRef = useRef(null);
  const scrollSectionRef = useRef(null);
  const contentRefs = useRef([]);
  const isScrolling = useRef(false);

  // GSAP refs
  const productsTitleRef = useRef(null);
  const featuredProductRef = useRef(null);
  const productGridRef = useRef(null);
  const discoverTitleRef = useRef(null);
  const discoverCardsRef = useRef([]);
  const discoverButtonRef = useRef(null);
  const servicesTitleRef = useRef(null);
  const servicesGridRef = useRef([]);
  const servicesCTARef = useRef(null);
  const portfolioTitleRef = useRef(null);
  const portfolioGridRef = useRef(null);

  const [products, setProducts] = useState(initialContent.products);
  const [clientProjects, setClientProjects] = useState(initialContent.clientProjects);

  useEffect(() => {
    const fetchLiveContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
          if (data.clientProjects && data.clientProjects.length > 0) {
            setClientProjects(data.clientProjects);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live content from database. Using fallbacks.');
      }
    };
    fetchLiveContent();
  }, []);

  const slides = [
    { title: 'Design', subtitle: 'The Grand Reveal' },
    { title: 'Innovation', subtitle: 'Future Forward' },
    { title: 'Experience', subtitle: 'Beyond Boundaries' }
  ];

  const contentSections = [
    {
      title: "Digital Innovation",
      description: "Transforming ideas into cutting-edge digital solutions that push the boundaries of what's possible."
    },
    {
      title: "Strategic Design",
      description: "Crafting intuitive user experiences with purpose-driven design that connects brands meaningfully."
    },
    {
      title: "Future Technology",
      description: "Leveraging emerging technologies to build scalable platforms that grow with your needs."
    },
    {
      title: "Creative Excellence",
      description: "Delivering exceptional creative work that stands out and drives real business results."
    }
  ];

  // Products are loaded dynamically in state above

  const discoverCards = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Innovation Labs",
      description: "Explore our R&D initiatives pushing technological boundaries",
      stats: "50+ Projects"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Community",
      description: "Join our network of innovators and thought leaders",
      stats: "10K+ Members"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Success Stories",
      description: "Discover how we've transformed businesses worldwide",
      stats: "200+ Cases"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Future Vision",
      description: "See what's next in digital transformation and innovation",
      stats: "2025 Roadmap"
    }
  ];

  const services = [
    {
      icon: <Code className="w-12 h-12" />,
      title: "Web Development",
      description: "Custom web applications built with modern technologies and best practices",
      features: ["React/Next.js", "Node.js", "TypeScript", "Cloud Deployment"]
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "UI/UX Design",
      description: "User-centered design solutions that drive engagement and conversion",
      features: ["User Research", "Prototyping", "Design Systems", "UX Testing"]
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Digital Strategy",
      description: "Comprehensive digital transformation strategies for business growth",
      features: ["Market Analysis", "Digital Roadmaps", "KPI Tracking", "Growth Hacking"]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Project Innovation Center",
      description:
        "A dedicated platform that helps students design, develop, and showcase innovative academic and technical projects with expert guidance.",
      features: [
        "Project Idea Consultation",
        "Team Collaboration Support",
        "Prototype Development Assistance",
        "Workshops on Emerging Technologies"
      ]
    }

  ];

  // Initialize GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Products Section Animations
      if (productsTitleRef.current) {
        gsap.fromTo(productsTitleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: productsTitleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (featuredProductRef.current) {
        gsap.fromTo(featuredProductRef.current,
          { opacity: 0, scale: 0.95, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredProductRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (productGridRef.current) {
        const cards = productGridRef.current.children;
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: productGridRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Discover Section Animations
      if (discoverTitleRef.current) {
        gsap.fromTo(discoverTitleRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: discoverTitleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Discover cards staggered animation
      discoverCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              opacity: 0,
              y: 60,
              rotationY: -30,
              transformPerspective: 1000
            },
            {
              opacity: 1,
              y: 0,
              rotationY: 0,
              duration: 1,
              delay: index * 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // Add floating animation on hover
          gsap.to(card, {
            y: -5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: index * 0.2,
            paused: false
          });
        }
      });

      if (discoverButtonRef.current) {
        gsap.fromTo(discoverButtonRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: discoverButtonRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Portfolio Section Animations
      if (portfolioTitleRef.current) {
        gsap.fromTo(portfolioTitleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: portfolioTitleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (portfolioGridRef.current) {
        const cards = portfolioGridRef.current.children;
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: portfolioGridRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Services Section Animations
      if (servicesTitleRef.current) {
        gsap.fromTo(servicesTitleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: servicesTitleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (servicesCTARef.current) {
        gsap.fromTo(servicesCTARef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: servicesCTARef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Parallax effect for background patterns
      gsap.to(".pattern-bg", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".discover-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollSectionRef.current && !isScrolling.current) {
        const section = scrollSectionRef.current;
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const scrollProgress = -rect.top / (sectionHeight - window.innerHeight);

        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
          const newIndex = Math.min(
            Math.floor(scrollProgress * contentSections.length),
            contentSections.length - 1
          );
          if (newIndex !== currentContentIndex && newIndex >= 0) {
            setCurrentContentIndex(newIndex);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentContentIndex, contentSections.length]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => { });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const nextProduct = () => setCurrentProduct((prev) => (prev + 1) % products.length);
  const prevProduct = () => setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);

  return (
    <div className="bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* Video Background */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loop
          muted={isMuted}
          playsInline
          autoPlay
        >
          <source src="/output_light1.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black"></div> */}

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-widest text-white mb-6 animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-light tracking-wide animate-fade-in-delay">
            {slides[currentSlide].subtitle}
          </p>

          {/* Slide Indicators */}
          <div className="absolute bottom-32 flex space-x-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-12' : 'bg-white/30 w-8'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all p-3 rounded-full text-white border border-white/20"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all p-3 rounded-full text-white border border-white/20"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white/50 text-xs tracking-wider">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Scroll-Triggered Content Section */}
      <section
        ref={scrollSectionRef}
        className="relative w-full bg-black"
        style={{ height: `${contentSections.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {contentSections.map((section, index) => (
            <div
              key={index}
              ref={el => contentRefs.current[index] = el}
              className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out"
              style={{
                opacity: currentContentIndex === index ? 1 : 0,
                transform: `translateY(${currentContentIndex === index
                  ? '0'
                  : currentContentIndex > index
                    ? '-100px'
                    : '100px'
                  })`,
                pointerEvents: currentContentIndex === index ? 'auto' : 'none'
              }}
            >
              <div className="max-w-4xl mx-auto text-center px-6">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-8 tracking-tight">
                  {section.title}
                </h2>
                <div className="w-24 h-px bg-white/30 mx-auto mb-8"></div>
                <p className="text-lg md:text-xl lg:text-2xl text-white/70 font-light leading-relaxed">
                  {section.description}
                </p>

                {/* Progress Indicators */}
                <div className="mt-12 flex justify-center items-center space-x-2">
                  {contentSections.map((_, dotIndex) => (
                    <div
                      key={dotIndex}
                      className={`h-1 rounded-full transition-all duration-300 ${dotIndex === currentContentIndex ? 'bg-white w-12' : 'bg-white/30 w-8'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 text-sm">
            Scroll to explore • {currentContentIndex + 1} / {contentSections.length}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative w-full min-h-screen bg-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={productsTitleRef} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6">
              Our Products
            </h2>
            <div className="w-24 h-px bg-black/20 mx-auto mb-6"></div>
            <p className="text-xl text-black/60 max-w-3xl mx-auto font-light">
              Discover our suite of powerful tools designed to transform your business
            </p>
          </div>

          {/* Featured Product */}
          <div ref={featuredProductRef} className="mb-20 bg-black rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <div className="flex flex-col justify-center space-y-6 text-white">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium w-fit border border-white/20">
                  Featured Product
                </span>
                <h3 className="text-4xl font-light">
                  {products[currentProduct].title}
                </h3>
                <p className="text-lg text-white/70 font-light leading-relaxed">
                  {products[currentProduct].description}
                </p>
                <ul className="space-y-3">
                  {products[currentProduct].features.map((feature, index) => (
                    <li key={index} className="flex items-center text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-white mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-4 pt-4">
                  <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-white/90 transition-colors flex items-center space-x-2">
                    <span>Learn More</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="border border-white/20 text-white px-8 py-3 rounded-full font-medium hover:border-white/40 transition-colors">
                    View Demo
                  </button>
                </div>
              </div>
              <div className="relative bg-white/5 rounded-2xl p-12 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="text-8xl font-light text-white/20 mb-4">
                    {currentProduct + 1}
                  </div>
                  <div className="text-white/40 text-sm">Product Showcase</div>
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={prevProduct}
                    className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    onClick={nextProduct}
                    className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div ref={productGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-black/10 hover:border-black/30 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-black mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 bg-white/20 rounded"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-black mb-3 group-hover:text-black/70 transition-colors">
                    {product.title}
                  </h4>
                  <p className="text-black/60 text-sm font-light leading-relaxed mb-4">
                    {product.description}
                  </p>
                  <button className="text-black font-medium text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                    <span>Explore</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Client Work Section */}
      <section id="portfolio" className="relative w-full min-h-screen bg-black py-16 sm:py-24 md:py-32 overflow-hidden text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div ref={portfolioTitleRef} className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium w-fit border border-white/20 mb-4">
              Featured Work
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Client Websites
            </h2>
            <div className="w-24 h-px bg-white/30 mx-auto mb-6"></div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              A showcase of bespoke, high-performance websites and digital solutions built for our clients.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div ref={portfolioGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientProjects.map((project, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 hover:shadow-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[16/10] bg-white/5 border-b border-white/10 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback image */}
                  <div className="hidden absolute inset-0 items-center justify-center bg-white/5">
                    <div className="text-center">
                      <div className="text-4xl font-light text-white/20 mb-2">
                        {index + 1}
                      </div>
                      <div className="text-white/40 text-xs sm:text-sm uppercase tracking-widest">{project.title}</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10 font-medium">
                    {project.category}
                  </span>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-white/80 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-white/60 text-sm font-light leading-relaxed mb-4 min-h-[40px]">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-white/60 font-medium border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <TransitionLink href="/portfolio" className="text-white font-medium text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                    <span>View Case Study</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </TransitionLink>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <TransitionLink 
              href="/portfolio" 
              className="border border-white/20 text-white hover:border-white/50 px-8 py-4 rounded-full font-medium hover:scale-105 transition-all text-lg inline-flex items-center space-x-3 animate-[pulse_3s_infinite]"
            >
              <span>Explore All Client Work</span>
              <ArrowRight size={20} />
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="discover-section relative w-full min-h-screen bg-black py-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="pattern-bg absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div ref={discoverTitleRef} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Discover More With Us
            </h2>
            <div className="w-24 h-px bg-white/30 mx-auto mb-6"></div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              Join our journey of innovation and explore the future of digital transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discoverCards.map((card, index) => (
              <div
                key={index}
                ref={el => discoverCardsRef.current[index] = el}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 cursor-pointer hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 mb-6 text-white group-hover:bg-white/20 transition-colors group-hover:scale-110 duration-300">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {card.title}
                </h3>
                <p className="text-white/60 font-light leading-relaxed mb-6">
                  {card.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-sm font-medium">
                    {card.stats}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ArrowRight size={16} className="text-white transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <button ref={discoverButtonRef} className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-white/90 hover:scale-105 transition-all text-lg inline-flex items-center space-x-3 group">
              <span>Join Our Community</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative w-full min-h-screen bg-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={servicesTitleRef} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6">
              Our Services
            </h2>
            <div className="w-24 h-px bg-black/20 mx-auto mb-6"></div>
            <p className="text-xl text-black/60 max-w-3xl mx-auto font-light">
              Comprehensive digital solutions tailored to drive your business forward
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                ref={el => servicesGridRef.current[index] = el}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                className="group relative bg-white rounded-3xl p-8 border border-black/10 hover:border-black/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black mb-6 text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {service.icon}
                </div>

                <h3 className="text-3xl font-semibold text-black mb-4 group-hover:text-black/80 transition-colors">
                  {service.title}
                </h3>

                <p className="text-black/60 font-light leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center text-black/70"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-black mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="text-black font-medium flex items-center space-x-2 group-hover:space-x-3 transition-all">
                  <span>Explore Service</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-20 pt-16 border-t border-black/10">
            <h3 className="text-2xl md:text-3xl font-light text-black mb-6">
              Ready to start your project?
            </h3>
            <TransitionLink
              href="/contact" // 👈 change to your route
              className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-black/90 hover:scale-105 transition-all text-lg inline-flex items-center space-x-3 group"
            >
              <span>Get Started Today</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-2 transition-transform"
              />
            </TransitionLink>
            <p className="text-black/50 text-sm mt-4">
              Free consultation • No commitment required
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}