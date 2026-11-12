import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import {
  BakeryProfile,
  VERIFIED_INSTAGRAM_HIGHLIGHTS,
  WHATSAPP_DIRECT_URL,
} from '../types/bakery';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ContactSectionProps {
  profile: BakeryProfile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <section id="contacto" className="bg-[#FFF7ED] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs sm:text-sm font-medium text-[#80605A]">
            Canales oficiales verificados · {profile.location}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#59352F] leading-tight">
            Contacto Directo
          </h2>
          <p className="text-base text-[#80605A] leading-relaxed">
            Comunícate directamente con {profile.businessName} a través de nuestros canales verificados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-[#F8F0E5] rounded-[1.75rem] p-6 border border-[#E5D2CE] flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-[#167943]/10 text-[#167943] flex items-center justify-center">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#59352F] pt-2">
                WhatsApp
              </h3>
              <p className="text-base font-medium text-[#3D231E] tabular-nums">
                {profile.whatsapp}
              </p>
              <p className="text-sm text-[#80605A]">
                Canal directo para consultas de productos y disponibilidad.
              </p>
            </div>
            <a
              href={WHATSAPP_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#167943] text-white text-sm font-medium hover:bg-[#126437] transition-colors whitespace-nowrap"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>

          {/* Phone & Email Card */}
          <div className="bg-[#F8F0E5] rounded-[1.75rem] p-6 border border-[#E5D2CE] flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#EBC8C5]/60 text-[#59352F] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-2xl font-semibold text-[#59352F]">
                  Teléfono y Correo
                </h3>
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                  className="block text-base font-medium text-[#3D231E] hover:text-[#B98582] transition-colors tabular-nums"
                >
                  {profile.phone}
                </a>
              </div>
              <div className="pt-2 border-t border-[#E5D2CE] space-y-1">
                <p className="text-xs font-medium text-[#80605A]">
                  Correo electrónico
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 text-sm text-[#3D231E] hover:text-[#B98582] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 shrink-0 text-[#80605A]" />
                  <span>{profile.email}</span>
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-[#80605A]">
              <MapPin className="w-4 h-4 shrink-0 text-[#B98582] mt-0.5" />
              <span>
                {profile.fullAddress
                  ? profile.fullAddress
                  : `${profile.location} (dirección exacta pendiente de confirmar)`}
              </span>
            </div>
          </div>

          {/* Social Networks Card */}
          <div className="bg-[#F8F0E5] rounded-[1.75rem] p-6 border border-[#E5D2CE] flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EBC8C5]/60 text-[#59352F] flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#59352F] pt-1">
                Redes Sociales
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-[#80605A]">Instagram</p>
                  <a
                    href={profile.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#59352F] underline decoration-[#B98582] underline-offset-4 hover:text-[#B98582] transition-colors"
                  >
                    @bruder.bk
                  </a>
                </div>
                <div>
                  <p className="text-xs text-[#80605A]">TikTok</p>
                  <a
                    href={profile.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#59352F] underline decoration-[#B98582] underline-offset-4 hover:text-[#B98582] transition-colors"
                  >
                    @bruderbk.pasteleria
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5D2CE]">
              <p className="text-xs text-[#80605A] mb-1">
                Destacados visibles en Instagram
              </p>
              <p className="text-xs font-medium text-[#59352F]">
                {VERIFIED_INSTAGRAM_HIGHLIGHTS.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
