"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Target, Heart, Zap, Users, TrendingUp, Globe, Award, Lightbulb, Rocket, Shield, Quote } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TransitionLink, Footer } from '@/components/PageTransition';
import Navbar from '@/components/Navbar';

import * as Icons from 'lucide-react';
import { initialContent } from '@/lib/initialData';

gsap.registerPlugin(ScrollTrigger);

function getIconComponent(iconName) {
  const IconComp = Icons[iconName] || Icons.HelpCircle;
  return <IconComp className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />;
}

function getStatIconComponent(iconName) {
  const IconComp = Icons[iconName] || Icons.Award;
  return <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />;
}

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0);
  const [aboutData, setAboutData] = useState(initialContent.about);

  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const quoteRef = useRef(null);
  const valuesRef = useRef(null);
  const valueCardsRef = useRef([]);
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  const missionRef = useRef(null);
  const quote2Ref = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const fetchLiveContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.about && data.about.storyText && data.about.storyText.length > 0) {
            setAboutData(data.about);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live about content. Using static fallback.');
      }
    };
    fetchLiveContent();
  }, []);

  const values = (aboutData.values || []).map(v => ({
    ...v,
    icon: getIconComponent(v.iconName)
  }));

  const stats = (aboutData.stats || []).map(s => ({
    ...s,
    icon: getStatIconComponent(s.iconName)
  }));

  const team = aboutData.team || [];

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

      // Story Animation
      if (storyRef.current) {
        gsap.fromTo(storyRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Quote Animations
      [quoteRef, quote2Ref].forEach(ref => {
        if (ref.current) {
          gsap.fromTo(ref.current,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Stats Animation
      if (statsRef.current) {
        const statElements = statsRef.current.children;
        gsap.fromTo(statElements,
          { opacity: 0, scale: 0.8, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Mission Animation
      if (missionRef.current) {
        gsap.fromTo(missionRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: missionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // CTA Animation
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % values.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16 sm:pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div ref={heroRef} className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/5 border border-white/10 mb-6 sm:mb-8 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white mr-2" />
            <span className="text-white/80 text-xs sm:text-sm font-light tracking-wider">OUR STORY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wide text-white mb-6 sm:mb-8 px-2">
            About Anvitha
          </h1>

          <div className="w-16 sm:w-20 md:w-24 h-px bg-white/30 mx-auto mb-6 sm:mb-8"></div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto px-4">
            We're a passionate team of innovators, designers, and developers on a mission to transform businesses through exceptional digital experiences.
          </p>

          <div className="mt-8 sm:mt-10 md:mt-12 animate-bounce">
            <div className="w-px h-8 sm:h-10 md:h-12 bg-gradient-to-b from-white/50 to-transparent mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Quote Section 1 */}
      <section ref={quoteRef} className="relative w-full py-20 sm:py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Quote className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-black/10 mx-auto mb-6 sm:mb-8" />
          <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-black leading-relaxed mb-6 sm:mb-8 px-2">
            "The best way to predict the future is to create it."
          </blockquote>
          <div className="w-16 sm:w-20 md:w-24 h-px bg-black/20 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-black/60 text-sm sm:text-base md:text-lg font-light">
            Peter Drucker
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section ref={storyRef} className="relative w-full py-20 sm:py-24 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-6 sm:mb-8">
                Our Journey
              </h2>
              <div className="w-16 sm:w-20 md:w-24 h-px bg-white/30 mb-6 sm:mb-8"></div>
              <div className="space-y-4 sm:space-y-6 text-white/70 font-light text-sm sm:text-base md:text-lg leading-relaxed">
                {(aboutData.storyText || []).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
                <img
                  src="/about.png"
                  alt="Anvitha team workspace"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"></div>
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative w-full py-20 sm:py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4 sm:mb-6">
              Our Impact
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-px bg-black/20 mx-auto"></div>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white border border-black/10 hover:border-black/30 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-black mb-4 sm:mb-6 text-white">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black mb-2 sm:mb-3">{stat.number}</div>
                <div className="text-black/60 font-light text-xs sm:text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="relative w-full py-20 sm:py-24 md:py-32 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 sm:mb-6">
              Our Values
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-px bg-white/30 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-light px-4">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                ref={el => valueCardsRef.current[index] = el}
                className="group relative bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 cursor-pointer hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br ${value.color} mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">
                  {value.title}
                </h3>
                <p className="text-white/60 font-light leading-relaxed text-xs sm:text-sm md:text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section 2 */}
      <section ref={quote2Ref} className="relative w-full py-20 sm:py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Quote className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-black/10 mx-auto mb-6 sm:mb-8" />
          <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-black leading-relaxed mb-6 sm:mb-8 px-2">
            "Quality is not an act, it is a habit."
          </blockquote>
          <div className="w-16 sm:w-20 md:w-24 h-px bg-black/20 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-black/60 text-sm sm:text-base md:text-lg font-light">
            Aristotle
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section ref={missionRef} className="relative w-full py-20 sm:py-24 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Target className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-4 sm:mb-6">Our Mission</h3>
              <p className="text-white/70 font-light leading-relaxed text-sm sm:text-base md:text-lg">
                {aboutData.mission}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Globe className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-4 sm:mb-6">Our Vision</h3>
              <p className="text-white/70 font-light leading-relaxed text-sm sm:text-base md:text-lg">
                {aboutData.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative w-full py-20 sm:py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-black mb-6 sm:mb-8">
            Ready to Build Something Amazing?
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-px bg-black/20 mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg md:text-xl text-black/60 font-light mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4">
            Let's turn your vision into reality. Join the growing list of businesses we've helped transform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <TransitionLink
              href="/contact"
              className="w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:bg-black/90 hover:scale-105 transition-all inline-flex items-center justify-center space-x-2 sm:space-x-3 group text-sm sm:text-base"
            >
              <span>Start Your Project</span>
              <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
            </TransitionLink>
            <TransitionLink
              href="/portfolio"
              className="w-full sm:w-auto border border-black/20 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:border-black/40 hover:scale-105 transition-all text-sm sm:text-base text-center"
            >
              View Our Work
            </TransitionLink>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}