"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, ArrowRight, Globe, Clock, User, MessageSquare, Building, Sparkles, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { TransitionLink, Footer } from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import { initialContent } from '@/lib/initialData';

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [contact, setContact] = useState(initialContent.contact);

  const heroRef = useRef(null);
  const quoteRef = useRef(null);
  const formRef = useRef(null);
  const locationsRef = useRef(null);
  const locationCardsRef = useRef([]);

  useEffect(() => {
    const fetchLiveContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.contact) {
            setContact(data.contact);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live contact content. Using static fallback.');
      }
    };
    fetchLiveContent();
  }, []);

  const locations = [
    {
      city: "Kochi",
      country: "Kerala, India",
      address: contact.address,
      email: contact.email,
      phone: contact.phone,
      timezone: "IST (UTC+5:30)",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
  ];

  const services = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Digital Strategy",
    "Cloud Solutions",
    "Consulting Services",
    "Other"
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

      // Quote Animation
      if (quoteRef.current) {
        gsap.fromTo(quoteRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: quoteRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Form Animation
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
        });

        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          service: '',
          message: ''
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
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
            <span className="text-white/80 text-xs sm:text-sm font-light tracking-wider">LET'S CONNECT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wide text-white mb-6 sm:mb-8 px-2">
            Get In Touch
          </h1>

          <div className="w-16 sm:w-20 md:w-24 h-px bg-white/30 mx-auto mb-6 sm:mb-8"></div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto px-4">
            Ready to transform your digital presence? We're here to bring your vision to life with innovative solutions and expert guidance.
          </p>

          <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-4">
            <a href="#contact-form" className="w-full sm:w-auto bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:bg-white/90 hover:scale-105 transition-all inline-flex items-center justify-center space-x-2 text-sm sm:text-base">
              <span>Start a Project</span>
              <ArrowRight size={16} className="sm:w-4 sm:h-4" />
            </a>
            <a href="#locations" className="w-full sm:w-auto border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:border-white/40 hover:scale-105 transition-all text-sm sm:text-base text-center">
              View Locations
            </a>
          </div>

          {/* Quick Contact Info */}
          <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <span className="text-white/50 text-xs sm:text-sm">Email Us</span>
              <a href={`mailto:${contact.email || ''}`} className="text-white font-light hover:text-white/80 transition-colors text-sm sm:text-base text-center break-all">
                {contact.email || ''}
              </a>
            </div>
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <span className="text-white/50 text-xs sm:text-sm">Call Us</span>
              <a href={`tel:${(contact.phone || '').replace(/\s+/g, '')}`} className="text-white font-light hover:text-white/80 transition-colors text-sm sm:text-base">
                {contact.phone || ''}
              </a>
            </div>
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all col-span-1 sm:col-span-2 lg:col-span-1">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <span className="text-white/50 text-xs sm:text-sm">Working Hours</span>
              <span className="text-white font-light text-sm sm:text-base text-center">Mon - Fri, 9.30AM - 5.30PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Inspirational Quote Section */}
      <section ref={quoteRef} className="relative w-full py-20 sm:py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Quote className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-black/10 mx-auto mb-6 sm:mb-8" />
          <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-black leading-relaxed mb-6 sm:mb-8 px-2">
            "Innovation distinguishes between a leader and a follower. Let's build something extraordinary together."
          </blockquote>
          <div className="w-16 sm:w-20 md:w-24 h-px bg-black/20 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-black/60 text-sm sm:text-base md:text-lg font-light">
            Steve Jobs
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section id="contact-form" className="relative w-full py-20 sm:py-24 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Contact Form */}
            <div ref={formRef}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 sm:mb-6">
                Start Your Project
              </h2>
              <div className="w-16 sm:w-20 md:w-24 h-px bg-white/30 mb-6 sm:mb-8"></div>
              <p className="text-white/70 text-sm sm:text-base md:text-lg font-light mb-8 sm:mb-10 md:mb-12 leading-relaxed">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <Building className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Company Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Globe className="absolute left-3 sm:left-4 top-3 sm:top-4 md:top-6 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer text-sm sm:text-base"
                  >
                    <option value="" className="bg-black">Select a Service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service} className="bg-black">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <MessageSquare className="absolute left-3 sm:left-4 top-3 sm:top-4 md:top-6 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project..."
                    required
                    rows="5"
                    className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all resize-none text-sm sm:text-base"
                  ></textarea>
                </div>

                {submitStatus && (
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 ${submitStatus.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    <p className="text-center font-medium text-sm sm:text-base">{submitStatus.message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-all inline-flex items-center justify-center space-x-2 sm:space-x-3 group text-sm sm:text-base ${isSubmitting
                    ? 'bg-white/50 text-black/50 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-white/90 hover:scale-105'
                    }`}
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && (
                    <Send size={16} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-4 sm:mb-6">
                  Why Choose Us?
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { title: "Expert Team", desc: "Industry-leading professionals with years of experience" },
                    { title: "Proven Track Record", desc: "50+ successful projects delivered worldwide" },
                    { title: "Cutting-Edge Tech", desc: "Latest technologies and best practices" },
                    { title: "24/7 Support", desc: "Round-the-clock assistance whenever you need it" }
                  ].map((item, index) => (
                    <div key={index} className="flex space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">{item.title}</h4>
                        <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
                <h4 className="text-lg sm:text-xl md:text-2xl font-light text-white mb-3 sm:mb-4">
                  Need Immediate Assistance?
                </h4>
                <p className="text-white/70 font-light mb-4 sm:mb-6 text-sm sm:text-base">
                  Our team is available for urgent inquiries and consultations.
                </p>
                <a
                  href={`tel:${(contact.phone || '').replace(/\s+/g, '')}`}
                  className="inline-flex items-center space-x-2 sm:space-x-3 text-white font-medium hover:text-white/80 transition-colors text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{contact.phone || ''}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" ref={locationsRef} className="relative w-full py-20 sm:py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-black mb-4 sm:mb-6">
              Find Us Here
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-px bg-black/20 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-black/60 max-w-3xl mx-auto font-light px-4">
              Come visit us at our location. We'd love to meet you in person
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {locations.map((location, index) => (
              <div
                key={index}
                ref={el => locationCardsRef.current[index] = el}
                onMouseEnter={() => setHoveredLocation(index)}
                onMouseLeave={() => setHoveredLocation(null)}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-black/10 hover:border-black/30 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-1 sm:mb-2 group-hover:text-black/80 transition-colors truncate">
                      {location.city}
                    </h3>
                    <p className="text-black/60 font-light text-sm sm:text-base">{location.country}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-black flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ml-4 flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-black/40 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <div className="min-w-0">
                      <p className="text-black/70 font-light text-sm sm:text-base break-words">{location.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-black/40 flex-shrink-0" />
                    <a href={`mailto:${location.email}`} className="text-black/70 font-light hover:text-black transition-colors text-sm sm:text-base break-all">
                      {location.email}
                    </a>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-black/40 flex-shrink-0" />
                    <a href={`tel:${location.phone}`} className="text-black/70 font-light hover:text-black transition-colors text-sm sm:text-base">
                      {location.phone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-black/40 flex-shrink-0" />
                    <span className="text-black/70 font-light text-sm sm:text-base">{location.timezone}</span>
                  </div>
                </div>

                <button className="mt-4 sm:mt-6 text-black font-medium flex items-center space-x-1 sm:space-x-2 group-hover:space-x-2 sm:group-hover:space-x-3 transition-all text-sm sm:text-base">
                  <span>Get Directions</span>
                  <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}