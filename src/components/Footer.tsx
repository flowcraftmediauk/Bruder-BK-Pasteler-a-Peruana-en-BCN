import { BakeryProfile, WHATSAPP_DIRECT_URL } from '../types/bakery';

interface FooterProps {
  profile: BakeryProfile;
}

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="bg-[#462823] text-[#F8F0E5] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#EBC8C5]/15">
          <div className="md:col-span-5 space-y-2">
            <p className="font-display text-2xl font-semibold text-[#FFF7ED]">
              {profile.businessName}
            </p>
            <p className="text-sm text-[#F8F0E5]/75">
              {profile.category} · {profile.location}
            </p>
          </div>

          <nav
            aria-label="Navegación en pie de página"
            className="md:col-span-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#F8F0E5]/85 items-start"
          >
            <a href="#inicio" className="hover:text-[#EBC8C5] transition-colors">
              Inicio
            </a>
            <a
              href="#sobre-nosotros"
              className="hover:text-[#EBC8C5] transition-colors"
            >
              Sobre nosotros
            </a>
            <a href="#productos" className="hover:text-[#EBC8C5] transition-colors">
              Productos
            </a>
            <a href="#galeria" className="hover:text-[#EBC8C5] transition-colors">
              Galería
            </a>
            <a href="#contacto" className="hover:text-[#EBC8C5] transition-colors">
              Contacto
            </a>
          </nav>

          <div className="md:col-span-3 flex flex-col space-y-2 text-sm text-[#F8F0E5]/85">
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EBC8C5] transition-colors"
            >
              Instagram (@bruder.bk)
            </a>
            <a
              href={profile.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EBC8C5] transition-colors"
            >
              TikTok (@bruderbk.pasteleria)
            </a>
            <a
              href={WHATSAPP_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EBC8C5] transition-colors tabular-nums"
            >
              WhatsApp ({profile.whatsapp})
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-[#EBC8C5] transition-colors break-all"
            >
              {profile.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#F8F0E5]/65">
          <p>© {new Date().getFullYear()} {profile.businessName}</p>
          <p>Vista previa web · {profile.location}</p>
        </div>
      </div>
    </footer>
  );
}
