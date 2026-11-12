export type CardTone = 'blush' | 'ivory' | 'dusty' | 'cocoa';
export type InquiryStatus = 'pendiente' | 'revisada' | 'respondida';
export type PreferredContact = 'whatsapp' | 'email';

export interface BakeryProfile {
  businessName: string;
  category: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  officialDescription: string;
  ownerBio: string;
  fullAddress: string;
  openingHours: string;
  flavoursAndSizes: string;
  priceNotes: string;
  orderingProcess: string;
  minimumOrder: string;
  deliveryOptions: string;
  paymentMethods: string;
}

export interface ProductCategory {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  verifiedSummary: string;
  imageUrl: string;
  cardTone: CardTone;
  isPublished: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  sortOrder: number;
}

export interface CustomerInquiry {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  categoryInterest: string;
  message: string;
  preferredContact: PreferredContact;
  status: InquiryStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export const WHATSAPP_PREFILLED_MESSAGE =
  '¡Hola! Me gustaría recibir información sobre sus productos de Bruder BK.';

export const WHATSAPP_DIRECT_URL = `https://wa.me/34603335705?text=${encodeURIComponent(
  WHATSAPP_PREFILLED_MESSAGE
)}`;

export const VERIFIED_PROFILE: BakeryProfile = {
  businessName: 'Bruder BK Pastelería Peruana en BCN',
  category: 'Pastelería Peruana en BCN',
  location: 'Barcelona, España',
  phone: '+34 603 33 57 05',
  whatsapp: '+34 603 33 57 05',
  email: 'pasteleriafina.detallesbruderbk@gmail.com',
  instagramUrl: 'https://www.instagram.com/bruder.bk?rpxt=M3pvdGMybDh4OHFk',
  tiktokUrl: 'https://www.tiktok.com/@bruderbk.pasteleria?_r=1&_t=ZN-9BLkww9QEr8',
  heroImageUrl: '',
  aboutImageUrl: '',
  officialDescription: '',
  ownerBio: '',
  fullAddress: '',
  openingHours: '',
  flavoursAndSizes: '',
  priceNotes: '',
  orderingProcess: '',
  minimumOrder: '',
  deliveryOptions: '',
  paymentMethods: '',
};

export const VERIFIED_CATEGORIES: ProductCategory[] = [
  {
    id: 'tortas-tematicas',
    title: 'Tortas temáticas',
    slug: 'tortas-tematicas',
    sortOrder: 1,
    verifiedSummary: '',
    imageUrl: '',
    cardTone: 'blush',
    isPublished: true,
  },
  {
    id: 'bocaditos',
    title: 'Bocaditos',
    slug: 'bocaditos',
    sortOrder: 2,
    verifiedSummary: '',
    imageUrl: '',
    cardTone: 'ivory',
    isPublished: true,
  },
  {
    id: 'tartas',
    title: 'Tartas',
    slug: 'tartas',
    sortOrder: 3,
    verifiedSummary: '',
    imageUrl: '',
    cardTone: 'dusty',
    isPublished: true,
  },
  {
    id: 'tematicas-infantiles',
    title: 'Temáticas infantiles',
    slug: 'tematicas-infantiles',
    sortOrder: 4,
    verifiedSummary: '',
    imageUrl: '',
    cardTone: 'cocoa',
    isPublished: true,
  },
];

export const VERIFIED_INSTAGRAM_HIGHLIGHTS = [
  'Bocaditos',
  'Temáticas infantiles',
  'Tartas',
  'Métodos de pago',
];

export interface PendingFieldSpec {
  key: keyof BakeryProfile;
  label: string;
  helper: string;
  multiline?: boolean;
}

export const PENDING_CLIENT_FIELDS: PendingFieldSpec[] = [
  {
    key: 'officialDescription',
    label: 'Descripción oficial del negocio',
    helper: 'Texto oficial que presenta a Bruder BK Pastelería Peruana en BCN.',
    multiline: true,
  },
  {
    key: 'fullAddress',
    label: 'Dirección completa en Barcelona',
    helper: 'Calle, número, código postal o zona de recogida (si aplica).',
  },
  {
    key: 'flavoursAndSizes',
    label: 'Sabores y tamaños disponibles',
    helper: 'Sabores de bizcochos, rellenos y tamaños confirmados.',
    multiline: true,
  },
  {
    key: 'priceNotes',
    label: 'Precios de productos',
    helper: 'Tarifas confirmadas para tortas, tartas y bocaditos.',
    multiline: true,
  },
  {
    key: 'orderingProcess',
    label: 'Proceso para pedidos personalizados',
    helper: 'Pasos confirmados y antelación recomendada para encargar.',
    multiline: true,
  },
  {
    key: 'minimumOrder',
    label: 'Requisitos de pedido mínimo',
    helper: 'Cantidades mínimas confirmadas (por ejemplo en bocaditos).',
  },
  {
    key: 'deliveryOptions',
    label: 'Opciones y zonas de entrega o recogida',
    helper: 'Zonas de Barcelona cubiertas, recogida o costes confirmados.',
    multiline: true,
  },
  {
    key: 'paymentMethods',
    label: 'Métodos de pago aceptados',
    helper: 'Detalle confirmado del destacado «Métodos de pago» de Instagram.',
  },
  {
    key: 'openingHours',
    label: 'Horario de atención',
    helper: 'Días y horas confirmadas de atención o recogida.',
  },
  {
    key: 'ownerBio',
    label: 'Presentación e historia de la persona propietaria',
    helper: 'Historia real del proyecto y su vínculo con la pastelería peruana.',
    multiline: true,
  },
];
