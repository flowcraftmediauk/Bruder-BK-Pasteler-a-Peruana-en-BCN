import { Camera } from 'lucide-react';
import { CardTone, ProductCategory, WHATSAPP_DIRECT_URL } from '../types/bakery';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductsSectionProps {
  products: ProductCategory[];
}

const CARD_TONE_STYLES: Record<CardTone, string> = {
  blush: 'bg-[#F3D7D4]',
  ivory: 'bg-[#EFE3D5]',
  dusty: 'bg-[#E5D0D2]',
  cocoa: 'bg-[#EBDAD3]',
};

export function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section id="productos" className="bg-[#F8F0E5] py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs sm:text-sm font-medium text-[#80605A]">
            Categorías verificadas en Instagram · @bruder.bk
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#59352F] leading-tight">
            Nuestras Especialidades
          </h2>
          <p className="text-base text-[#80605A] leading-relaxed">
            Líneas de pastelería visibles en Bruder BK Pastelería Peruana en BCN. Para consultar sabores, tamaños y disponibilidad, escríbenos directamente por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const surfaceClass =
              CARD_TONE_STYLES[product.cardTone] || CARD_TONE_STYLES.ivory;

            return (
              <article
                key={product.id}
                className={`${surfaceClass} rounded-[1.75rem] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-5`}
              >
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-semibold text-[#59352F] text-center pt-1">
                    {product.title}
                  </h3>

                  <div className="aspect-[4/3] w-full rounded-2xl bg-[#FFF7ED]/80 overflow-hidden flex items-center justify-center border border-[#59352F]/10">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={`${product.title} — Bruder BK`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="px-4 py-6 text-center space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-[#F8F0E5] flex items-center justify-center text-[#80605A]">
                          <Camera className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-medium text-[#80605A]">
                          Fotografía real pendiente
                        </p>
                      </div>
                    )}
                  </div>

                  {product.verifiedSummary ? (
                    <p className="text-sm text-[#59352F]/85 text-center leading-relaxed">
                      {product.verifiedSummary}
                    </p>
                  ) : null}
                </div>

                <a
                  href={WHATSAPP_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#167943] text-white text-xs sm:text-sm font-medium hover:bg-[#126437] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167943]"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
