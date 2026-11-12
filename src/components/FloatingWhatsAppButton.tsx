import { WHATSAPP_DIRECT_URL } from '../types/bakery';
import { WhatsAppIcon } from './WhatsAppIcon';

export function FloatingWhatsAppButton() {
  return (
    <a
      href={WHATSAPP_DIRECT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp con Bruder BK"
      title="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1EBE5D] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167943]"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}
