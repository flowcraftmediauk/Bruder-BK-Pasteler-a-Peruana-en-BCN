import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  BakeryProfile,
  CustomerInquiry,
  GalleryItem,
  InquiryStatus,
  PreferredContact,
  ProductCategory,
  VERIFIED_CATEGORIES,
  VERIFIED_PROFILE,
} from '../types/bakery';

const PROFILE_DOC_ID = 'bruder_bk';

function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

function sanitizeId(value: string): string {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9_\-]/g, '-');
  return (cleaned || 'item').slice(0, 128);
}

export function useBakeryData() {
  const { user, authReady, isAdmin } = useAuth();
  const [profile, setProfile] = useState<BakeryProfile>(VERIFIED_PROFILE);
  const [products, setProducts] = useState<ProductCategory[]>(VERIFIED_CATEGORIES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Public listeners: bakery_profile, products, gallery_items
  useEffect(() => {
    const profileRef = doc(db, 'bakery_profile', PROFILE_DOC_ID);
    const unsubProfile = onSnapshot(
      profileRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<BakeryProfile>;
          setProfile({
            ...VERIFIED_PROFILE,
            ...data,
          });
        } else {
          setProfile(VERIFIED_PROFILE);
        }
        setLoadingPublic(false);
      },
      (error) => {
        setLoadingPublic(false);
        handleFirestoreError(
          error,
          OperationType.GET,
          `bakery_profile/${PROFILE_DOC_ID}`
        );
      }
    );

    const productsQuery = query(
      collection(db, 'products'),
      orderBy('sortOrder', 'asc')
    );
    const unsubProducts = onSnapshot(
      productsQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setProducts(VERIFIED_CATEGORIES);
        } else {
          const items = snapshot.docs.map((d) => ({
            ...(d.data() as Omit<ProductCategory, 'id'>),
            id: d.id,
          }));
          setProducts(items.filter((p) => p.isPublished !== false));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    const galleryQuery = query(
      collection(db, 'gallery_items'),
      orderBy('sortOrder', 'asc')
    );
    const unsubGallery = onSnapshot(
      galleryQuery,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as Omit<GalleryItem, 'id'>),
          id: d.id,
        }));
        setGalleryItems(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'gallery_items');
      }
    );

    return () => {
      unsubProfile();
      unsubProducts();
      unsubGallery();
    };
  }, []);

  // Private authenticated listener: inquiries
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setInquiries([]);
      setLoadingInquiries(false);
      return;
    }

    setLoadingInquiries(true);
    const inquiriesRef = collection(db, 'inquiries');
    const inquiriesQuery = isAdmin
      ? query(inquiriesRef, orderBy('createdAt', 'desc'))
      : query(
          inquiriesRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

    const unsubInquiries = onSnapshot(
      inquiriesQuery,
      (snapshot) => {
        const rows = snapshot.docs.map((d) => ({
          ...(d.data() as Omit<CustomerInquiry, 'id'>),
          id: d.id,
        }));
        setInquiries(rows);
        setLoadingInquiries(false);
      },
      (error) => {
        setLoadingInquiries(false);
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      }
    );

    return () => unsubInquiries();
  }, [authReady, user, isAdmin]);

  // Customer Inquiry CRUD
  const submitInquiry = async (input: {
    categoryInterest: string;
    message: string;
    preferredContact: PreferredContact;
    customerName?: string;
  }) => {
    if (!user || !user.emailVerified) {
      throw new Error('Debes iniciar sesión con Google para guardar tu consulta.');
    }
    const cleanMessage = sanitizeString(input.message, 2000);
    if (!cleanMessage) {
      throw new Error('Por favor, escribe los detalles de tu consulta.');
    }

    const payload = {
      userId: user.uid,
      customerName:
        sanitizeString(
          input.customerName || user.displayName || 'Cliente',
          120
        ) || 'Cliente',
      customerEmail: sanitizeString(user.email || '', 160),
      categoryInterest:
        sanitizeString(input.categoryInterest, 120) || 'Consulta general',
      message: cleanMessage,
      preferredContact: input.preferredContact,
      status: 'pendiente' as InquiryStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'inquiries'), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    }
  };

  const updateInquiryStatus = async (
    inquiryId: string,
    status: InquiryStatus
  ) => {
    if (!isAdmin) {
      throw new Error('Solo el administrador puede actualizar el estado.');
    }
    const path = `inquiries/${inquiryId}`;
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteInquiry = async (inquiryId: string) => {
    const path = `inquiries/${inquiryId}`;
    try {
      await deleteDoc(doc(db, 'inquiries', inquiryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // Admin Profile & Catalog Updates
  const saveBakeryProfile = async (nextProfile: BakeryProfile) => {
    if (!user || !isAdmin) {
      throw new Error('Acceso restringido al administrador.');
    }
    const path = `bakery_profile/${PROFILE_DOC_ID}`;
    const payload = {
      businessName: sanitizeString(nextProfile.businessName, 120) || VERIFIED_PROFILE.businessName,
      category: sanitizeString(nextProfile.category, 120) || VERIFIED_PROFILE.category,
      location: sanitizeString(nextProfile.location, 120) || VERIFIED_PROFILE.location,
      phone: sanitizeString(nextProfile.phone, 30) || VERIFIED_PROFILE.phone,
      whatsapp: sanitizeString(nextProfile.whatsapp, 30) || VERIFIED_PROFILE.whatsapp,
      email: sanitizeString(nextProfile.email, 150) || VERIFIED_PROFILE.email,
      instagramUrl: sanitizeString(nextProfile.instagramUrl, 300),
      tiktokUrl: sanitizeString(nextProfile.tiktokUrl, 300),
      heroImageUrl: nextProfile.heroImageUrl.trim().slice(0, 500000),
      aboutImageUrl: nextProfile.aboutImageUrl.trim().slice(0, 500000),
      officialDescription: sanitizeString(nextProfile.officialDescription, 2000),
      ownerBio: sanitizeString(nextProfile.ownerBio, 2000),
      fullAddress: sanitizeString(nextProfile.fullAddress, 300),
      openingHours: sanitizeString(nextProfile.openingHours, 300),
      flavoursAndSizes: sanitizeString(nextProfile.flavoursAndSizes, 1000),
      priceNotes: sanitizeString(nextProfile.priceNotes, 1000),
      orderingProcess: sanitizeString(nextProfile.orderingProcess, 1000),
      minimumOrder: sanitizeString(nextProfile.minimumOrder, 500),
      deliveryOptions: sanitizeString(nextProfile.deliveryOptions, 1000),
      paymentMethods: sanitizeString(nextProfile.paymentMethods, 500),
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    };

    try {
      await setDoc(doc(db, 'bakery_profile', PROFILE_DOC_ID), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveProductCategory = async (category: ProductCategory) => {
    if (!user || !isAdmin) {
      throw new Error('Acceso restringido al administrador.');
    }
    const safeId = sanitizeId(category.id || category.slug);
    const safeSlug =
      category.slug
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, '-')
        .slice(0, 80) || 'categoria';
    const path = `products/${safeId}`;

    const payload = {
      title: sanitizeString(category.title, 120) || 'Categoría',
      slug: safeSlug,
      sortOrder: Math.max(0, Math.min(1000, Math.round(category.sortOrder))),
      verifiedSummary: sanitizeString(category.verifiedSummary, 500),
      imageUrl: category.imageUrl.trim().slice(0, 500000),
      cardTone: category.cardTone,
      isPublished: Boolean(category.isPublished),
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    };

    try {
      await setDoc(doc(db, 'products', safeId), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const addGalleryItem = async (item: {
    title: string;
    category: string;
    imageUrl: string;
    sortOrder?: number;
  }) => {
    if (!user || !isAdmin) {
      throw new Error('Acceso restringido al administrador.');
    }
    const cleanImage = item.imageUrl.trim().slice(0, 500000);
    if (!cleanImage) {
      throw new Error('Debes proporcionar una fotografía válida.');
    }

    const payload = {
      title: sanitizeString(item.title, 120) || 'Fotografía de Bruder BK',
      category: sanitizeString(item.category, 120) || 'Tortas temáticas',
      imageUrl: cleanImage,
      sortOrder: Math.max(
        0,
        Math.min(1000, Math.round(item.sortOrder ?? galleryItems.length + 1))
      ),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user.uid,
    };

    try {
      await addDoc(collection(db, 'gallery_items'), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'gallery_items');
    }
  };

  const deleteGalleryItem = async (itemId: string) => {
    if (!isAdmin) {
      throw new Error('Acceso restringido al administrador.');
    }
    const path = `gallery_items/${itemId}`;
    try {
      await deleteDoc(doc(db, 'gallery_items', itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return {
    profile,
    products,
    galleryItems,
    inquiries,
    loadingPublic,
    loadingInquiries,
    submitInquiry,
    updateInquiryStatus,
    deleteInquiry,
    saveBakeryProfile,
    saveProductCategory,
    addGalleryItem,
    deleteGalleryItem,
  };
}
