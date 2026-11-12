import React, { useEffect, useState } from 'react';
import { Check, Edit3, Plus, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  BakeryProfile,
  PENDING_CLIENT_FIELDS,
  ProductCategory,
} from '../types/bakery';
import { compressImageToDataUrl } from '../utils/imageHelper';

interface PendingClientInfoSectionProps {
  profile: BakeryProfile;
  products: ProductCategory[];
  galleryCount: number;
  onSaveProfile: (next: BakeryProfile) => Promise<void>;
  onSaveProduct: (next: ProductCategory) => Promise<void>;
  onAddGalleryItem: (item: {
    title: string;
    category: string;
    imageUrl: string;
  }) => Promise<void>;
}

export function PendingClientInfoSection({
  profile,
  products,
  galleryCount,
  onSaveProfile,
  onSaveProduct,
  onAddGalleryItem,
}: PendingClientInfoSectionProps) {
  const { user, isAdmin, signInWithGoogle, signingIn } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [draftProfile, setDraftProfile] = useState<BakeryProfile>(profile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Gallery upload form state (admin only)
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState(
    products[0]?.title || 'Tortas temáticas'
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [addingGallery, setAddingGallery] = useState(false);

  useEffect(() => {
    setDraftProfile(profile);
  }, [profile]);

  const handleImageFile = async (
    file: File,
    onLoaded: (dataUrl: string) => void
  ) => {
    setSaveError(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      onLoaded(dataUrl);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'No se pudo procesar la fotografía.'
      );
    }
  };

  const handleSaveProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveNotice(null);
    setSaveError(null);
    try {
      await onSaveProfile(draftProfile);
      setSaveNotice('Información confirmada guardada en Firestore.');
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Error al guardar los datos.'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProductImageUpload = async (
    product: ProductCategory,
    file: File
  ) => {
    setSaveError(null);
    setSaveNotice(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      await onSaveProduct({ ...product, imageUrl: dataUrl });
      setSaveNotice(`Fotografía actualizada para ${product.title}.`);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'No se pudo actualizar la categoría.'
      );
    }
  };

  const handleProductSummaryUpdate = async (
    product: ProductCategory,
    summary: string
  ) => {
    setSaveError(null);
    setSaveNotice(null);
    try {
      await onSaveProduct({ ...product, verifiedSummary: summary });
      setSaveNotice(`Descripción de ${product.title} guardada.`);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'No se pudo guardar la categoría.'
      );
    }
  };

  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) {
      setSaveError('Añade una fotografía real o enlace URL para la galería.');
      return;
    }
    setAddingGallery(true);
    setSaveError(null);
    setSaveNotice(null);
    try {
      await onAddGalleryItem({
        title: newPhotoTitle.trim() || newPhotoCategory,
        category: newPhotoCategory,
        imageUrl: newPhotoUrl.trim(),
      });
      setNewPhotoTitle('');
      setNewPhotoUrl('');
      setSaveNotice('Fotografía añadida a la galería pública.');
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'No se pudo añadir la foto.'
      );
    } finally {
      setAddingGallery(false);
    }
  };

  const completedCount = PENDING_CLIENT_FIELDS.filter(
    (f) => Boolean(profile[f.key] && String(profile[f.key]).trim().length > 0)
  ).length;

  return (
    <section
      id="informacion-pendiente"
      className="bg-[#F8F0E5] border-t border-[#E5D2CE] py-14 sm:py-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-[#80605A] tabular-nums">
              Control de verificación · {completedCount} de{' '}
              {PENDING_CLIENT_FIELDS.length} campos confirmados
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#59352F]">
              INFORMACIÓN PENDIENTE DEL CLIENTE
            </h2>
            <p className="text-sm text-[#80605A] leading-relaxed">
              Esta vista previa mantiene sin inventar ningún precio, ingrediente, dirección u horario. A medida que el cliente confirme cada punto, se actualizará directamente en la web.
            </p>
          </div>

          {isAdmin ? (
            <button
              type="button"
              onClick={() => setEditorOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#59352F] text-[#FFF7ED] text-sm font-medium hover:bg-[#462823] transition-colors cursor-pointer self-start md:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>
                {editorOpen
                  ? 'Cerrar panel de edición'
                  : 'Editar datos confirmados y fotos'}
              </span>
            </button>
          ) : !user ? (
            <button
              type="button"
              disabled={signingIn}
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#59352F]/30 text-[#59352F] text-xs sm:text-sm font-medium hover:bg-white transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>Acceso propietario / editor (Google)</span>
            </button>
          ) : null}
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PENDING_CLIENT_FIELDS.map((field) => {
            const val = String(profile[field.key] || '').trim();
            const isConfirmed = val.length > 0;
            return (
              <div
                key={field.key}
                className="bg-white rounded-2xl p-4 border border-[#E5D2CE] flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#59352F]">
                    {field.label}
                  </p>
                  <p className="text-xs text-[#80605A]">
                    {isConfirmed ? val : field.helper}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap shrink-0 ${
                    isConfirmed ? 'text-[#167943]' : 'text-[#B98582]'
                  }`}
                >
                  {isConfirmed ? 'Confirmado' : 'Pendiente'}
                </span>
              </div>
            );
          })}

          <div className="bg-white rounded-2xl p-4 border border-[#E5D2CE] flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#59352F]">
                Fotografías reales adicionales de productos
              </p>
              <p className="text-xs text-[#80605A] tabular-nums">
                {galleryCount > 0
                  ? `${galleryCount} fotografías reales publicadas en galería.`
                  : 'Sin fotografías de catálogo subidas todavía.'}
              </p>
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap shrink-0 ${
                galleryCount > 0 ? 'text-[#167943]' : 'text-[#B98582]'
              }`}
            >
              {galleryCount > 0 ? 'Confirmado' : 'Pendiente'}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5D2CE] flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#59352F]">
                Categorías exactas y detalles adicionales
              </p>
              <p className="text-xs text-[#80605A]">
                Confirmadas desde Instagram: Tortas temáticas, Bocaditos, Tartas, Temáticas infantiles. Pendiente confirmar si hay más líneas.
              </p>
            </div>
            <span className="text-xs font-medium text-[#B98582] whitespace-nowrap shrink-0">
              Parcial
            </span>
          </div>
        </div>

        {/* Admin Live Content Editor (Firestore) */}
        {isAdmin && editorOpen && (
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E5D2CE] shadow-sm space-y-8">
            <div className="border-b border-[#E5D2CE] pb-4">
              <h3 className="font-display text-2xl font-semibold text-[#59352F]">
                Editor en vivo de Bruder BK (Firestore)
              </h3>
              <p className="text-xs sm:text-sm text-[#80605A]">
                Introduce únicamente datos y fotografías reales confirmados por el cliente.
              </p>
            </div>

            {saveNotice ? (
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#167943]">
                <Check className="w-4 h-4" />
                <span>{saveNotice}</span>
              </p>
            ) : null}

            {saveError ? (
              <p className="text-xs sm:text-sm font-medium text-red-700">
                {saveError}
              </p>
            ) : null}

            {/* 1. Confirmed Profile Fields & Hero/About Photos */}
            <form onSubmit={handleSaveProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#59352F]">
                    Fotografía principal (Hero) — URL o subir archivo real
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draftProfile.heroImageUrl}
                      onChange={(e) =>
                        setDraftProfile({
                          ...draftProfile,
                          heroImageUrl: e.target.value,
                        })
                      }
                      placeholder="https://... o sube una imagen"
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E5D2CE] text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8F0E5] text-xs font-medium text-[#59352F] cursor-pointer hover:bg-[#EFE3D5]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageFile(file, (url) =>
                              setDraftProfile((prev) => ({
                                ...prev,
                                heroImageUrl: url,
                              }))
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#59352F]">
                    Fotografía Sobre Nosotros — URL o subir archivo real
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draftProfile.aboutImageUrl}
                      onChange={(e) =>
                        setDraftProfile({
                          ...draftProfile,
                          aboutImageUrl: e.target.value,
                        })
                      }
                      placeholder="https://... o sube una imagen"
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E5D2CE] text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8F0E5] text-xs font-medium text-[#59352F] cursor-pointer hover:bg-[#EFE3D5]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageFile(file, (url) =>
                              setDraftProfile((prev) => ({
                                ...prev,
                                aboutImageUrl: url,
                              }))
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {PENDING_CLIENT_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className={field.multiline ? 'sm:col-span-2' : ''}
                  >
                    <label className="block text-xs font-medium text-[#59352F] mb-1">
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        rows={2}
                        value={String(draftProfile[field.key] || '')}
                        onChange={(e) =>
                          setDraftProfile({
                            ...draftProfile,
                            [field.key]: e.target.value,
                          })
                        }
                        placeholder={field.helper}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5D2CE] text-sm"
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(draftProfile[field.key] || '')}
                        onChange={(e) =>
                          setDraftProfile({
                            ...draftProfile,
                            [field.key]: e.target.value,
                          })
                        }
                        placeholder={field.helper}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5D2CE] text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-full bg-[#59352F] text-[#FFF7ED] text-sm font-medium hover:bg-[#462823] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {savingProfile
                  ? 'Guardando cambios...'
                  : 'Guardar información confirmada'}
              </button>
            </form>

            {/* 2. Editable Product Category Photos */}
            <div className="border-t border-[#E5D2CE] pt-6 space-y-4">
              <h4 className="text-sm font-semibold text-[#59352F]">
                Fotografías y textos por categoría
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-[#FFF7ED] border border-[#E5D2CE] p-4 space-y-3"
                  >
                    <p className="text-sm font-semibold text-[#59352F]">
                      {product.title}
                    </p>
                    <label className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-white border border-[#E5D2CE] text-xs font-medium text-[#59352F] cursor-pointer hover:bg-[#F8F0E5]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {product.imageUrl ? 'Cambiar foto' : 'Subir foto real'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProductImageUpload(product, file);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      defaultValue={product.verifiedSummary}
                      placeholder="Resumen confirmado (opcional)"
                      onBlur={(e) => {
                        if (e.target.value !== product.verifiedSummary) {
                          handleProductSummaryUpdate(product, e.target.value);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E5D2CE] text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Add Real Gallery Item */}
            <form
              onSubmit={handleAddGallerySubmit}
              className="border-t border-[#E5D2CE] pt-6 space-y-4"
            >
              <h4 className="text-sm font-semibold text-[#59352F]">
                Añadir fotografía real a la galería
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  maxLength={120}
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="Título confirmado (ej. Torta temática)"
                  className="px-3 py-2 rounded-xl border border-[#E5D2CE] text-sm"
                />
                <select
                  value={newPhotoCategory}
                  onChange={(e) => setNewPhotoCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#E5D2CE] text-sm"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="URL o subir foto"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E5D2CE] text-xs"
                  />
                  <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F8F0E5] text-xs font-medium text-[#59352F] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageFile(file, (url) => setNewPhotoUrl(url));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={addingGallery}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B98582] text-white text-xs sm:text-sm font-medium hover:bg-[#A6706D] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {addingGallery ? 'Añadiendo...' : 'Añadir a galería'}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
