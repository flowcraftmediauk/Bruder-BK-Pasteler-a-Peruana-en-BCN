import { AuthProvider, useAuth } from './context/AuthContext';
import { useBakeryData } from './hooks/useBakeryData';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductsSection } from './components/ProductsSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { InquirySection } from './components/InquirySection';
import { ContactSection } from './components/ContactSection';
import { PendingClientInfoSection } from './components/PendingClientInfoSection';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';

function BakeryHomepage() {
  const { isAdmin } = useAuth();
  const {
    profile,
    products,
    galleryItems,
    inquiries,
    loadingInquiries,
    submitInquiry,
    updateInquiryStatus,
    deleteInquiry,
    saveBakeryProfile,
    saveProductCategory,
    addGalleryItem,
    deleteGalleryItem,
  } = useBakeryData();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7ED] text-[#3D231E]">
      <Header />

      <main className="flex-1">
        <HeroSection profile={profile} />
        <ProductsSection products={products} />
        <AboutSection profile={profile} />
        <GallerySection
          galleryItems={galleryItems}
          products={products}
          isAdmin={isAdmin}
          onDeleteGalleryItem={deleteGalleryItem}
        />
        <InquirySection
          profile={profile}
          products={products}
          inquiries={inquiries}
          loadingInquiries={loadingInquiries}
          onSubmitInquiry={submitInquiry}
          onUpdateStatus={updateInquiryStatus}
          onDeleteInquiry={deleteInquiry}
        />
        <ContactSection profile={profile} />
        <PendingClientInfoSection
          profile={profile}
          products={products}
          galleryCount={galleryItems.length}
          onSaveProfile={saveBakeryProfile}
          onSaveProduct={saveProductCategory}
          onAddGalleryItem={addGalleryItem}
        />
      </main>

      <Footer profile={profile} />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BakeryHomepage />
      </AuthProvider>
    </ErrorBoundary>
  );
}
