import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenModal, onOpenDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'AI Curator', href: '#curator' },
    { name: 'Dashboard', href: '#dashboard', onClick: onOpenDashboard },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'AI Team', href: '#ai-team' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F6F4EF]/85 backdrop-blur-md border-b border-black/10 py-4 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-black text-[#F6F4EF] flex items-center justify-center font-editorial font-bold text-sm tracking-wider transition-transform duration-300 group-hover:scale-110">
            B
          </div>
          <span className="font-editorial text-xl font-bold tracking-tight text-[#111111]">
            Become <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-full bg-black/5 border border-black/10 uppercase tracking-widest text-[#6E6E6E] ml-1">AI</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                }
              }}
              className="text-sm font-medium text-[#6E6E6E] hover:text-[#111111] transition-colors duration-200 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={onOpenDashboard || onOpenModal}
            className="text-sm font-medium text-[#111111] hover:text-[#6E6E6E] transition-colors duration-200 px-3 py-1"
          >
            Login
          </button>
          <button
            onClick={onOpenDashboard || onOpenModal}
            className="btn-pill-primary px-6 py-2.5 text-sm font-medium flex items-center gap-2 group cursor-pointer"
          >
            <span>Start Growing</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#111111] hover:text-[#6E6E6E] focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F4EF] border-b border-black/10 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#111111] hover:text-[#6E6E6E] py-2"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-black/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal();
              }}
              className="w-full text-center py-2.5 text-sm font-medium text-[#111111] border border-black/20 rounded-full"
            >
              Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal();
              }}
              className="w-full btn-pill-primary py-3 text-sm font-medium flex items-center justify-center gap-2"
            >
              <span>Start Growing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
