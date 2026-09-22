'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { TransitionLink } from '@/components/PageTransition';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine navbar links based on current page pathname
  const getNavLinks = (path) => {
    const isHome = path === '/' || path === '/home';
    if (isHome) {
      return [
        { label: 'Services', href: '#services' },
        { label: 'Products', href: '#products' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ];
    } else {
      // For other pages, provide direct links
      return [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Products', href: '/#products' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ];
    }
  };

  const navLinks = getNavLinks(pathname);

  // Helper to check if a link is active
  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/home';
    }
    if (href.includes('#')) {
      return false; // Hash links are not active pages
    }
    return pathname === href;
  };

  const handleLinkClick = (e, href) => {
    const isHome = pathname === '/' || pathname === '/home';
    
    // Check if it's a hash link
    if (href.includes('#')) {
      const hash = href.split('#')[1];
      if (isHome) {
        e.preventDefault();
        setMobileMenuOpen(false);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Let transition handler take over for other pages
        setMobileMenuOpen(false);
      }
    } else if (href === '/' && isHome) {
      e.preventDefault();
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-4' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Branding */}
          <TransitionLink 
            href="/" 
            className="flex items-center gap-3 group"
            onClick={(e) => handleLinkClick(e, '/')}
          >
            <Image 
              src="/anvitha.png" 
              alt="Anvitha Infotech Logo" 
              width={40} 
              height={40}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-2xl font-bold tracking-wider text-white">ANVITHA</span>
          </TransitionLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-light">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <TransitionLink
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`transition-colors duration-300 ${
                    active 
                      ? 'text-white font-medium border-b border-white pb-1' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </TransitionLink>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none transition-transform duration-200 active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 animate-[fadeIn_0.2s_ease-out]">
          <div className="px-4 sm:px-6 py-4 space-y-4">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <TransitionLink
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`block py-2 text-sm sm:text-base transition-colors ${
                    active 
                      ? 'text-white font-semibold' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </TransitionLink>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
