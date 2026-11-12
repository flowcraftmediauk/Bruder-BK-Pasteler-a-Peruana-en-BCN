import { useMemo, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { GalleryItem, ProductCategory, WHATSAPP_DIRECT_URL } from '../types/bakery';
import { WhatsAppIcon } from './WhatsAppIcon';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  products: ProductCategory[];
  isAdmin: boolean;
  onDeleteGalleryItem: (id: string) => Promise<void>;
}

export function GallerySection({
  galleryItems,
  products,
  isAdmin,
  onDeleteGalleryItem,
}: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filterOptions = useMemo(
    () => ['Todas', ...products.map((p) => p.title)],
    [products]
  );

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Todas') return galleryItems;
    return galleryItems.filter((item) => item.category === selectedCategory);
  }, [galleryItems, selectedCategory]);

  const emptySlots = useMemo(() => {
    if (selectedCategory !== 'Todas') {
      return filteredItems.length === 0 ? [selectedCategory] : [];
    }
    if (galleryItems.length >= 4) return [];
    return products
      .slice(galleryItems.length)
      .map((p) => p.title);
  }, [selectedCategory, filteredItems.length, galleryItems.length, products]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteGalleryItem(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="galeria" className="bg-[#F8F0E5] py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs sm:text-sm font-medium text-[#80605A]">
              Fotografías reales del cliente
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#59352F] leading-tight">
              Galería de Productos
            </h2>
            <p className="text-base text-[#80605A] leading-relaxed">
              Espacio dedicado exclusivamente a las fotografías reales de Bruder BK. Las casillas sin imagen están listas para incorporar material oficial del cliente.
            </p>
          </div>

          <a
            href={WHATSAPP_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#59352F] text-[#FFF7ED] text-sm font-medium hover:bg-[#462823] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

        {/* Interactive Category Filter Buttons */}
        <div
          role="tablist"
          aria-label="Filtrar galería por categoría"
          className="flex flex-wrap items-center gap-2 p-1.5 bg-[#EFE3D5] rounded-2xl w-fit"
        >
          {filterOptions.map((option) => {
            const active = selectedCategory === option;
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(option)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#59352F] shadow-xs'
                    : 'text-[#80605A] hover:text-[#59352F]'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <figure
              key={item.id}
              className="group relative bg-white rounded-[1.5rem] p-3 shadow-xs border border-[#E5D2CE]/70 space-y-3"
            >
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F8F0E5]">
                <img
                  src={item.imageUrl}
                  alt={`${item.title} — ${item.category}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <figcaption className="px-1 pb-1 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#59352F] truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#80605A] truncate">{item.category}</p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Eliminar ${item.title}`}
                    className="p-2 rounded-lg text-[#80605A] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </figcaption>
            </figure>
          ))}

          {emptySlots.map((slotCategory, index) => (
            <div
              key={`slot-${slotCategory}-${index}`}
              className="bg-[#FFF7ED] rounded-[1.5rem] p-4 border border-dashed border-[#B98582]/60 flex flex-col justify-between gap-3"
            >
              <div className="aspect-[4/3] w-full rounded-xl bg-[#F8F0E5] flex flex-col items-center justify-center p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#EBC8C5]/50 flex items-center justify-center text-[#59352F]">
                  <Camera className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-[#59352F]">
                  Espacio reservado para fotografía real
                </p>
              </div>
              <div className="px-1 flex items-center justify-between text-xs text-[#80605A]">
                <span className="font-medium text-[#59352F]">{slotCategory}</span>
                <span className="tabular-nums">0{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
