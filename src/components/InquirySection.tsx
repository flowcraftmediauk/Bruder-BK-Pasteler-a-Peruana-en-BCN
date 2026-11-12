import React, { useState } from 'react';
import { CheckCircle2, LogOut, Mail, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  BakeryProfile,
  CustomerInquiry,
  InquiryStatus,
  PreferredContact,
  ProductCategory,
  WHATSAPP_DIRECT_URL,
} from '../types/bakery';
import { WhatsAppIcon } from './WhatsAppIcon';

interface InquirySectionProps {
  profile: BakeryProfile;
  products: ProductCategory[];
  inquiries: CustomerInquiry[];
  loadingInquiries: boolean;
  onSubmitInquiry: (input: {
    categoryInterest: string;
    message: string;
    preferredContact: PreferredContact;
    customerName?: string;
  }) => Promise<void>;
  onUpdateStatus: (id: string, status: InquiryStatus) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
}

const STATUS_LABELS: Record<InquiryStatus, string> = {
  pendiente: 'Pendiente',
  revisada: 'Revisada',
  respondida: 'Respondida',
};

export function InquirySection({
  profile,
  products,
  inquiries,
  loadingInquiries,
  onSubmitInquiry,
  onUpdateStatus,
  onDeleteInquiry,
}: InquirySectionProps) {
  const { user, isAdmin, signingIn, authError, signInWithGoogle, signOutUser } =
    useAuth();

  const [categoryInterest, setCategoryInterest] = useState(
    products[0]?.title || 'Tortas temáticas'
  );
  const [preferredContact, setPreferredContact] =
    useState<PreferredContact>('whatsapp');
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!message.trim()) {
      setSubmitError('Escribe los detalles de tu consulta antes de enviarla.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitInquiry({
        categoryInterest,
        message,
        preferredContact,
        customerName: customerName.trim() || user?.displayName || undefined,
      });
      setMessage('');
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la consulta.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="consultas" className="bg-[#59352F] text-[#FFF7ED] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left direct inquiry column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-medium text-[#EBC8C5]">
                Atención personalizada · {profile.location}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#FFF7ED] leading-tight">
                Solicita información sobre nuestros productos
              </h2>
            </div>

            <p className="text-base text-[#F8F0E5]/85 leading-relaxed">
              Escríbenos directamente para consultar por tortas temáticas, bocaditos, tartas o temáticas infantiles. Te atenderemos personalmente por WhatsApp o correo electrónico.
            </p>

            {profile.orderingProcess ? (
              <div className="rounded-2xl bg-[#482924] border border-[#EBC8C5]/20 p-5 space-y-1.5">
                <p className="text-xs font-medium text-[#EBC8C5]">
                  Proceso confirmado
                </p>
                <p className="text-sm text-[#FFF7ED]/90 leading-relaxed">
                  {profile.orderingProcess}
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={WHATSAPP_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#167943] text-white text-sm font-medium hover:bg-[#126437] transition-colors whitespace-nowrap shadow-md"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>Solicitar información</span>
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#482924] border border-[#EBC8C5]/30 text-[#FFF7ED] text-sm font-medium hover:bg-[#3F231E] transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>Enviar correo</span>
              </a>
            </div>
          </div>

          {/* Right authenticated Firestore inquiry & tracker card */}
          <div className="lg:col-span-7 bg-[#FFF7ED] text-[#3D231E] rounded-[2rem] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5D2CE] pb-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#59352F]">
                  Portal de consultas guardadas
                </h3>
                <p className="text-xs sm:text-sm text-[#80605A]">
                  Guarda tu consulta con tu cuenta de Google y revisa su estado en línea.
                </p>
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#59352F] max-w-[160px] truncate">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-[11px] text-[#80605A]">
                      {isAdmin ? 'Administrador' : 'Cuenta verificada'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={signOutUser}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5D2CE] text-xs font-medium text-[#59352F] hover:bg-[#F8F0E5] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Salir</span>
                  </button>
                </div>
              ) : null}
            </div>

            {!user ? (
              <div className="py-6 text-center space-y-4">
                <p className="text-sm text-[#59352F]/85 max-w-md mx-auto leading-relaxed">
                  Inicia sesión con Google para registrar una consulta en nuestro sistema y hacer seguimiento, o utiliza el botón directo de WhatsApp.
                </p>
                {authError ? (
                  <p className="text-xs text-red-700 font-medium">{authError}</p>
                ) : null}
                <button
                  type="button"
                  disabled={signingIn}
                  onClick={signInWithGoogle}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#59352F] text-[#FFF7ED] text-sm font-medium hover:bg-[#462823] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <span>
                    {signingIn
                      ? 'Conectando con Google...'
                      : 'Iniciar sesión con Google'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="block text-xs font-medium text-[#59352F] mb-1.5"
                      >
                        Tu nombre
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        maxLength={120}
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={user.displayName || 'Nombre y apellido'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5D2CE] text-sm text-[#3D231E] focus:outline-2 focus:outline-[#B98582]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-category"
                        className="block text-xs font-medium text-[#59352F] mb-1.5"
                      >
                        Categoría de interés
                      </label>
                      <select
                        id="inquiry-category"
                        value={categoryInterest}
                        onChange={(e) => setCategoryInterest(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5D2CE] text-sm text-[#3D231E] focus:outline-2 focus:outline-[#B98582]"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                        <option value="Consulta general">Consulta general</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-[#59352F] mb-1.5">
                      Canal de respuesta preferido
                    </span>
                    <div className="flex gap-2">
                      {(['whatsapp', 'email'] as PreferredContact[]).map(
                        (channel) => (
                          <button
                            key={channel}
                            type="button"
                            onClick={() => setPreferredContact(channel)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                              preferredContact === channel
                                ? 'bg-[#59352F] text-[#FFF7ED] border-[#59352F]'
                                : 'bg-white text-[#59352F] border-[#E5D2CE] hover:bg-[#F8F0E5]'
                            }`}
                          >
                            {channel === 'whatsapp'
                              ? 'WhatsApp'
                              : 'Correo electrónico'}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-message"
                      className="block text-xs font-medium text-[#59352F] mb-1.5"
                    >
                      Mensaje o detalles de tu consulta
                    </label>
                    <textarea
                      id="inquiry-message"
                      rows={3}
                      maxLength={2000}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Indícanos en qué categoría estás interesado o qué información te gustaría consultar."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5D2CE] text-sm text-[#3D231E] focus:outline-2 focus:outline-[#B98582]"
                    />
                  </div>

                  {submitError ? (
                    <p className="text-xs font-medium text-red-700">
                      {submitError}
                    </p>
                  ) : null}

                  {submitSuccess ? (
                    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#167943]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Consulta guardada correctamente.</span>
                    </p>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#59352F] text-[#FFF7ED] text-sm font-medium hover:bg-[#462823] disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {submitting ? 'Guardando...' : 'Enviar consulta'}
                      </span>
                    </button>
                  </div>
                </form>

                {/* User / Admin Saved Inquiries List */}
                <div className="border-t border-[#E5D2CE] pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#59352F]">
                      {isAdmin ? 'Todas las consultas recibidas' : 'Tus consultas guardadas'}
                    </h4>
                    <span className="text-xs text-[#80605A] tabular-nums">
                      {inquiries.length} registros
                    </span>
                  </div>

                  {loadingInquiries ? (
                    <p className="text-xs text-[#80605A]">Cargando consultas...</p>
                  ) : inquiries.length === 0 ? (
                    <p className="text-xs text-[#80605A]">
                      Aún no hay consultas registradas en esta cuenta.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="rounded-2xl bg-white border border-[#E5D2CE] p-4 space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#80605A]">
                            <span className="font-semibold text-[#59352F]">
                              {inq.categoryInterest} · {inq.customerName}
                            </span>
                            <span>
                              Estado: <strong className="text-[#59352F]">{STATUS_LABELS[inq.status]}</strong>
                            </span>
                          </div>
                          <p className="text-sm text-[#3D231E] leading-relaxed">
                            {inq.message}
                          </p>
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                            <span className="text-[#80605A]">
                              Canal: {inq.preferredContact === 'whatsapp' ? 'WhatsApp' : 'Email'}
                              {isAdmin ? ` · ${inq.customerEmail}` : ''}
                            </span>
                            <div className="flex items-center gap-2">
                              {isAdmin && (
                                <select
                                  aria-label={`Cambiar estado de ${inq.customerName}`}
                                  value={inq.status}
                                  onChange={(e) =>
                                    onUpdateStatus(
                                      inq.id,
                                      e.target.value as InquiryStatus
                                    )
                                  }
                                  className="px-2.5 py-1 rounded-lg border border-[#E5D2CE] bg-[#FFF7ED] text-xs text-[#59352F]"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="revisada">Revisada</option>
                                  <option value="respondida">Respondida</option>
                                </select>
                              )}
                              {(isAdmin || inq.status === 'pendiente') && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteInquiry(inq.id)}
                                  aria-label="Eliminar consulta"
                                  className="p-1.5 rounded-lg text-[#80605A] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
