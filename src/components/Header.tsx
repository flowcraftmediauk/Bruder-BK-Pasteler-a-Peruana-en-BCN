import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { WHATSAPP_DIRECT_URL } from '../types/bakery';
import { WhatsAppIcon } from './WhatsAppIcon';

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre nosotros', href: '#sobre-nosotros' },
  { label: 'Productos', href: '#productos' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFF7ED]/95 backdrop-blur-sm border-b border-[#E5D2CE]/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#inicio"
          className="font-display text-2xl sm:text-[1.7rem] font-semibold tracking-tight text-[#59352F] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#59352F] rounded-sm"
        >
          Bruder BK
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#59352F]/85"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#B98582] hover:text-[#59352F] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#59352F]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary WhatsApp Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={WHATSAPP_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#167943] text-white text-xs sm:text-sm font-medium hover:bg-[#126437] transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167943]"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            <span>Pedir por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#59352F] hover:bg-[#F8F0E5] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#59352F]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FFF7ED] border-t border-[#E5D2CE] px-4 py-4 space-y-2">
          <nav className="flex flex-col space-y-1" aria-label="Menú móvil">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#59352F] hover:bg-[#F8F0E5] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <a
              href={WHATSAPP_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#167943] text-white text-sm font-medium hover:bg-[#126437] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Pedir por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
