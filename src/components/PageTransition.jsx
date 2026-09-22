'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, createContext, useContext } from 'react';

// Context to control transitions
const TransitionContext = createContext({});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export default function DoorTransitionLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextPath, setNextPath] = useState(null);

  // Function to trigger transition
  const transitionTo = (path) => {
    if (path === pathname || isAnimating) return; // Prevent double clicks

    setNextPath(path);
    setIsAnimating(true);

    // Wait for doors to fully close before navigating
    const navigateTimeout = setTimeout(() => {
      router.push(path);
    }, 550); // Slightly after doors close

    // Wait for new page to render, then open doors
    const openTimeout = setTimeout(() => {
      setIsAnimating(false);
      setNextPath(null);
    }, 1100); // Give time for page to load

    return () => {
      clearTimeout(navigateTimeout);
      clearTimeout(openTimeout);
    };
  };

  // Update displayed children when pathname changes
  useEffect(() => {
    if (pathname === nextPath || !nextPath) {
      setDisplayChildren(children);
    }
  }, [pathname, children, nextPath]);

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      <div className="relative">
        {/* Page Content */}
        <div className="relative z-10" style={{ minHeight: '100vh' }}>
          {displayChildren}
        </div>

        {/* Sliding Door Panels */}
        <AnimatePresence>
          {isAnimating && (
            <>
              {/* Left Panel */}
              <motion.div
                key="left-panel"
                className="fixed top-0 left-0 w-1/2 h-screen bg-black z-50"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
              />

              {/* Right Panel */}
              <motion.div
                key="right-panel"
                className="fixed top-0 right-0 w-1/2 h-screen bg-black z-50"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </TransitionContext.Provider>
  );
}

// Custom Link component to use with transitions
export function TransitionLink({ href, children, className, onClick, ...props }) {
  const { transitionTo } = usePageTransition();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (!e.defaultPrevented) {
      e.preventDefault();
      transitionTo(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

import { initialContent } from '@/lib/initialData';

export function Footer() {
  const pathname = usePathname();
  const showAddress = pathname === '/' || pathname === '/home' || pathname === '/about' || pathname === '/contact';
  const [contact, setContact] = useState(initialContent.contact);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (data.contact) {
            setContact(data.contact);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    fetchContact();
  }, []);

  return (
    <footer className="bg-black text-white py-12 sm:py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">ANVITHA</div>
            <p className="text-white/60 text-sm font-light max-w-xs leading-relaxed">
              Transforming businesses through innovative digital solutions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 text-white/60 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Digital Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Consulting</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 text-white/60 text-xs sm:text-sm">
              <li><TransitionLink href="/about" className="hover:text-white transition-colors">About Us</TransitionLink></li>
              <li><TransitionLink href="/portfolio" className="hover:text-white transition-colors">Portfolio</TransitionLink></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><TransitionLink href="/contact" className="hover:text-white transition-colors">Contact</TransitionLink></li>
            </ul>
          </div>
          <div>
            {showAddress ? (
              <>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Address</h4>
                <address className="text-white/60 text-xs sm:text-sm not-italic leading-relaxed whitespace-pre-line">
                  <strong>{contact.companyName}</strong><br />
                  {contact.address}
                </address>
              </>
            ) : (
              <>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-white/40 text-xs sm:text-sm">
          <p>&copy; 2025 ANVITHA. All rights reserved.</p>
          <div className="flex space-x-4 sm:space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}