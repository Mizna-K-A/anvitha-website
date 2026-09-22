"use client";
import { useState, useRef, useEffect } from 'react';
import { 
  Code, 
  Palette, 
  Globe, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ExternalLink,
  Laptop,
  ShoppingBag,
  Briefcase
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TransitionLink, Footer } from '@/components/PageTransition';
import Navbar from '@/components/Navbar';

import { initialContent } from '@/lib/initialData';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [clientProjects, setClientProjects] = useState(initialContent.clientProjects);

  const heroRef = useRef(null);
  const projectsGridRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Fetch dynamic content from MongoDB
    const fetchLiveContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.clientProjects && data.clientProjects.length > 0) {
            setClientProjects(data.clientProjects);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live portfolio database content. Using static fallback.');
      }
    };
    fetchLiveContent();
  }, []);

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

      // Projects Animation
      if (projectsGridRef.current) {
        const projectCards = projectsGridRef.current.querySelectorAll('.project-card');
        gsap.fromTo(projectCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: projectsGridRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

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

  const filteredProjects = selectedCategory === 'all'
    ? clientProjects
    : clientProjects.filter(project => project.category === selectedCategory);

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

        <div ref={heroRef} className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/5 border border-white/10 mb-6 sm:mb-8 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white mr-2" />
            <span className="text-white/80 text-xs sm:text-sm font-light tracking-wider">OUR PORTFOLIO</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wide text-white mb-6 sm:mb-8 px-2">
            Client Websites
          </h1>

          <div className="w-16 sm:w-20 md:w-24 h-px bg-white/30 mx-auto mb-6 sm:mb-8"></div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto px-4 mb-12">
            Explore the bespoke web experiences and applications we have designed, developed, and launched for our clients globally.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setSelectedCategory('web-apps')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'web-apps'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
            >
              Web Apps
            </button>
            <button
              onClick={() => setSelectedCategory('ecommerce')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'ecommerce'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
            >
              E-Commerce
            </button>
            <button
              onClick={() => setSelectedCategory('corporate')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'corporate'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
            >
              Corporate
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white/50 text-xs tracking-wider">EXPLORE</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section className="relative w-full py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={projectsGridRef} className="space-y-24 sm:space-y-32">
            {filteredProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={project.title}
                  className="project-card grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                >
                  {/* Text Details Container */}
                  <div className={`lg:col-span-5 space-y-6 ${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center space-x-2 text-black/50 text-xs sm:text-sm font-medium tracking-wider uppercase">
                      {project.category === 'web-apps' && <Laptop size={16} />}
                      {project.category === 'ecommerce' && <ShoppingBag size={16} />}
                      {project.category === 'corporate' && <Briefcase size={16} />}
                      <span>{project.categoryLabel}</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-black">
                      {project.title}
                    </h2>

                    <p className="text-black/50 text-base sm:text-lg italic font-light">
                      &ldquo;{project.tagline}&rdquo;
                    </p>

                    <p className="text-black/70 font-light leading-relaxed text-sm sm:text-base">
                      {project.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      {project.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start text-black/80">
                          <Check className="w-5 h-5 text-black mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base font-light">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-black/10 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 rounded-full bg-black/5 text-black/60 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4">
                      <a
                        href={project.liveLink}
                        className="inline-flex items-center space-x-2 text-black border-b-2 border-black hover:border-black/50 pb-1 font-semibold group transition-all text-sm sm:text-base"
                      >
                        <span>Visit Website</span>
                        <ExternalLink size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className={`lg:col-span-7 ${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl border border-black/10 transition-all duration-500 bg-black/5 aspect-[16/10]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback image wrapper */}
                      <div className="hidden absolute inset-0 items-center justify-center bg-black/5">
                        <div className="text-center">
                          <div className="text-6xl sm:text-8xl font-light text-black/10 mb-2">
                            {index + 1}
                          </div>
                          <div className="text-black/40 text-xs sm:text-sm uppercase tracking-widest">{project.title}</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative w-full py-24 sm:py-32 bg-black text-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Have a Project in Mind?
          </h2>
          <div className="w-16 sm:w-24 h-px bg-white/30 mx-auto mb-8"></div>
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-light leading-relaxed mb-12">
            Let&apos;s build your custom website or web application with high performance, elegant UX design, and search engine optimization.
          </p>

          <TransitionLink
            href="/contact"
            className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-white/90 hover:scale-105 transition-all text-base sm:text-lg inline-flex items-center space-x-2 sm:space-x-3 group"
          >
            <span>Let&apos;s Get Started</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </TransitionLink>
        </div>
      </section>

      <Footer />
    </div>
  );
}
