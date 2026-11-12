import { Camera, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { BakeryProfile, WHATSAPP_DIRECT_URL } from '../types/bakery';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSectionProps {
  profile: BakeryProfile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative bg-[#59352F] text-[#FFF7ED] overflow-hidden">
      {/* Subtle warm editorial vignette inspired by the reference design */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(235,200,197,0.18),transparent_58%)]"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-20 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left editorial typography column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6"
          >
            <p className="text-xs sm:text-sm tracking-wide text-[#EBC8C5] font-medium">
              {profile.category} · {profile.location}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] tracking-tight text-[#FFF7ED] max-w-xl">
              {profile.businessName}
            </h1>

            <p className="text-base sm:text-lg text-[#F8F0E5]/90 leading-relaxed max-w-xl">
              {profile.officialDescription
                ? profile.officialDescription
                : 'Pastelería peruana en Barcelona dedicada a tortas temáticas, bocaditos, tartas y temáticas infantiles bajo consulta directa.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={WHATSAPP_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#167943] text-white text-sm font-medium hover:bg-[#126437] transition-colors whitespace-nowrap shrink-0 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>Consultar por WhatsApp</span>
              </a>

              <a
                href="#productos"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#EBC8C5] text-[#3D231E] text-sm font-medium hover:bg-[#E2B7B3] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBC8C5]"
              >
                Ver productos
              </a>
            </div>
          </motion.div>

          {/* Right visual showcase frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex"
          >
            <div className="w-full rounded-[2rem] bg-[#482924] border border-[#EBC8C5]/20 shadow-xl overflow-hidden flex items-center justify-center min-h-[290px] sm:min-h-[360px] lg:h-full">
              {profile.heroImageUrl ? (
                <img
                  src={profile.heroImageUrl}
                  alt={`${profile.businessName} — Fotografía principal`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 sm:p-10 text-center max-w-md space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#59352F] border border-[#EBC8C5]/25 flex items-center justify-center text-[#EBC8C5]">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-display text-2xl font-medium text-[#FFF7ED]">
                      Fotografía real pendiente
                    </p>
                    <p className="text-sm text-[#F8F0E5]/75 leading-relaxed">
                      Espacio reservado para la fotografía principal proporcionada por Bruder BK. No utilizamos imágenes ficticias para representar su trabajo artesanal.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Organic layered paper transition echoing the reference screenshot */}
      <div className="relative h-10 sm:h-14 w-full overflow-hidden bg-[#59352F]">
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-full fill-[#F8F0E5]"
        >
          <path d="M0,44 C180,12 360,64 560,34 C760,4 940,56 1140,28 C1280,10 1370,30 1440,20 L1440,72 L0,72 Z" />
        </svg>
      </div>

      {/* Verified 2-column identity strip mirroring the reference screenshot */}
      <div className="bg-[#F8F0E5] text-[#3D231E] pb-8 pt-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-b border-[#E5D2CE]">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#EBC8C5]/60 flex items-center justify-center text-[#59352F] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h2 className="font-display text-xl font-semibold text-[#59352F]">
                  {profile.location}
                </h2>
                <p className="text-sm text-[#80605A]">
                  {profile.fullAddress
                    ? profile.fullAddress
                    : 'Pastelería Peruana en BCN · Dirección exacta pendiente de confirmación'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#EBC8C5]/60 flex items-center justify-center text-[#59352F] shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h2 className="font-display text-xl font-semibold text-[#59352F]">
                  Atención directa por WhatsApp
                </h2>
                <p className="text-sm text-[#80605A] tabular-nums">
                  {profile.whatsapp} · Consultas sobre disponibilidad y categorías
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
