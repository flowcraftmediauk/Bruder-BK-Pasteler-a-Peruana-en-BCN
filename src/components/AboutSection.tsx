import { Camera } from 'lucide-react';
import { BakeryProfile, WHATSAPP_DIRECT_URL } from '../types/bakery';
import { WhatsAppIcon } from './WhatsAppIcon';

interface AboutSectionProps {
  profile: BakeryProfile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="sobre-nosotros" className="bg-[#FFF7ED] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left visual slot */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] w-full rounded-[2rem] bg-[#F8F0E5] border border-[#E5D2CE] shadow-sm overflow-hidden flex items-center justify-center">
              {profile.aboutImageUrl ? (
                <img
                  src={profile.aboutImageUrl}
                  alt={`Sobre ${profile.businessName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center space-y-3 max-w-xs">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EBC8C5]/50 flex items-center justify-center text-[#59352F]">
                    <Camera className="w-5 h-5" />
                  </div>
                  <p className="font-display text-xl font-medium text-[#59352F]">
                    Imagen de marca pendiente
                  </p>
                  <p className="text-xs text-[#80605A] leading-relaxed">
                    Espacio preparado para la fotografía real del obrador o retrato de la persona fundadora.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right editorial copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-medium text-[#B98582]">
                Sobre nosotros · {profile.location}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#59352F] leading-tight">
                {profile.businessName}
              </h2>
            </div>

            <div className="space-y-4 text-base text-[#59352F]/85 leading-relaxed">
              <p>
                Bruder BK es una pastelería peruana ubicada en Barcelona, España (BCN), con presencia activa en Instagram (<span className="font-medium text-[#59352F]">@bruder.bk</span>) y TikTok (<span className="font-medium text-[#59352F]">@bruderbk.pasteleria</span>), centrada en tortas temáticas, bocaditos, tartas y temáticas infantiles.
              </p>

              {profile.ownerBio ? (
                <p>{profile.ownerBio}</p>
              ) : (
                <p className="text-sm text-[#80605A] italic">
                  La historia del proyecto, la biografía de la persona propietaria y los detalles adicionales del obrador permanecerán vacíos hasta recibir confirmación oficial del cliente.
                </p>
              )}
            </div>

            {(profile.flavoursAndSizes ||
              profile.deliveryOptions ||
              profile.paymentMethods ||
              profile.openingHours) && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5D2CE]">
                {profile.flavoursAndSizes && (
                  <div>
                    <dt className="text-xs font-medium text-[#80605A]">
                      Sabores y tamaños
                    </dt>
                    <dd className="text-sm text-[#3D231E] mt-1">
                      {profile.flavoursAndSizes}
                    </dd>
                  </div>
                )}
                {profile.deliveryOptions && (
                  <div>
                    <dt className="text-xs font-medium text-[#80605A]">
                      Entrega y recogida
                    </dt>
                    <dd className="text-sm text-[#3D231E] mt-1">
                      {profile.deliveryOptions}
                    </dd>
                  </div>
                )}
                {profile.paymentMethods && (
                  <div>
                    <dt className="text-xs font-medium text-[#80605A]">
                      Métodos de pago
                    </dt>
                    <dd className="text-sm text-[#3D231E] mt-1">
                      {profile.paymentMethods}
                    </dd>
                  </div>
                )}
                {profile.openingHours && (
                  <div>
                    <dt className="text-xs font-medium text-[#80605A]">
                      Horario confirmado
                    </dt>
                    <dd className="text-sm text-[#3D231E] mt-1">
                      {profile.openingHours}
                    </dd>
                  </div>
                )}
              </dl>
            )}

            <div className="pt-2">
              <a
                href={WHATSAPP_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#EBC8C5] text-[#3D231E] text-sm font-medium hover:bg-[#DFB2AE] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59352F]"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#167943]" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
