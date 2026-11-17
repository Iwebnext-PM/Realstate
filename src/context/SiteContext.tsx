import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {
  DEFAULT_CONTENT_CONFIG,
  DEFAULT_GENERAL_CONFIG,
  DEFAULT_NAVIGATION_CONFIG,
  DEFAULT_SEO_CONFIG,
  SCHEMA_LIMITS,
  STARTER_PROPERTIES,
  STARTER_TESTIMONIALS,
} from '../data/defaultData';
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAILS,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  storage,
} from '../lib/firebase';
import {
  clampNumber,
  clampString,
  clampStringArray,
  generateSafeId,
  slugify,
} from '../lib/formatters';
import type {
  AdminUserRecord,
  Inquiry,
  InquiryStatus,
  InquiryType,
  MediaAsset,
  Property,
  SiteContentConfig,
  SiteGeneralConfig,
  SiteNavigationConfig,
  SiteSeoConfig,
  Testimonial,
} from '../types/realEstate';

interface SiteContextValue {
  properties: Property[];
  allProperties: Property[];
  testimonials: Testimonial[];
  allTestimonials: Testimonial[];
  inquiries: Inquiry[];
  mediaAssets: MediaAsset[];
  adminUsers: AdminUserRecord[];
  generalConfig: SiteGeneralConfig;
  contentConfig: SiteContentConfig;
  seoConfig: SiteSeoConfig;
  navigationConfig: SiteNavigationConfig;
  loadingProperties: boolean;
  loadingSite: boolean;
  usingShowcaseFallback: boolean;
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  adminCheckLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  submitInquiry: (input: {
    name: string;
    email: string;
    phone: string;
    propertyId?: string;
    propertyTitle?: string;
    propertyAddress?: string;
    propertyType?: string;
    inquiryType: InquiryType;
    subject?: string;
    message: string;
  }) => Promise<string>;
  saveProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<string>;
  deleteProperty: (id: string) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  saveTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<string>;
  deleteTestimonial: (id: string) => Promise<void>;
  saveSiteConfig: (
    type: 'general' | 'content' | 'seo' | 'navigation',
    payload: SiteGeneralConfig | SiteContentConfig | SiteSeoConfig | SiteNavigationConfig,
  ) => Promise<void>;
  uploadMediaFile: (file: File, category: MediaAsset['category'], altText?: string) => Promise<MediaAsset>;
  registerMediaUrl: (input: { name: string; url: string; alt?: string; category: MediaAsset['category'] }) => Promise<MediaAsset>;
  updateMediaAsset: (id: string, updates: { name: string; alt: string; category: MediaAsset['category']; url: string }) => Promise<void>;
  deleteMediaAsset: (asset: MediaAsset) => Promise<void>;
  addAdminUser: (uid: string, email: string) => Promise<void>;
  removeAdminUser: (uid: string) => Promise<void>;
  seedStarterPortfolio: () => Promise<void>;
}

const SiteContext = createContext<SiteContextValue | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publishedProperties, setPublishedProperties] = useState<Property[]>([]);
  const [adminProperties, setAdminProperties] = useState<Property[]>([]);
  const [publishedTestimonials, setPublishedTestimonials] = useState<Testimonial[]>([]);
  const [adminTestimonials, setAdminTestimonials] = useState<Testimonial[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);

  const [generalConfig, setGeneralConfig] = useState<SiteGeneralConfig>(DEFAULT_GENERAL_CONFIG);
  const [contentConfig, setContentConfig] = useState<SiteContentConfig>(DEFAULT_CONTENT_CONFIG);
  const [seoConfig, setSeoConfig] = useState<SiteSeoConfig>(DEFAULT_SEO_CONFIG);
  const [navigationConfig, setNavigationConfig] = useState<SiteNavigationConfig>(DEFAULT_NAVIGATION_CONFIG);

  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingSite, setLoadingSite] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);

  // Sync dynamic brand CSS variables whenever generalConfig changes
  useEffect(() => {
    const root = document.documentElement;
    if (generalConfig.primaryColor) {
      root.style.setProperty('--brand-primary', generalConfig.primaryColor);
    }
    if (generalConfig.accentColor) {
      root.style.setProperty('--brand-accent', generalConfig.accentColor);
    }
  }, [generalConfig.primaryColor, generalConfig.accentColor]);

  // Auth listener & admin privilege verification
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser || !nextUser.emailVerified) {
        setIsAdmin(false);
        setAdminCheckLoading(false);
        return;
      }

      if (nextUser.email && BOOTSTRAPPED_ADMIN_EMAILS.includes(nextUser.email.toLowerCase())) {
        setIsAdmin(true);
        setAdminCheckLoading(false);
        return;
      }

      setAdminCheckLoading(true);
      try {
        const snap = await getDoc(doc(db, 'admins', nextUser.uid));
        setIsAdmin(snap.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setAdminCheckLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Public siteConfig subscription
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'siteConfig'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (docSnap.id === 'general' && data?.payload) {
            setGeneralConfig({
              ...DEFAULT_GENERAL_CONFIG,
              ...data.payload,
              socialLinks: {
                ...DEFAULT_GENERAL_CONFIG.socialLinks,
                ...(data.payload.socialLinks || {}),
              },
            });
          } else if (docSnap.id === 'content' && data?.payload) {
            setContentConfig({ ...DEFAULT_CONTENT_CONFIG, ...data.payload });
          } else if (docSnap.id === 'seo' && data?.payload) {
            setSeoConfig({
              ...DEFAULT_SEO_CONFIG,
              ...data.payload,
              pages: {
                ...DEFAULT_SEO_CONFIG.pages,
                ...(data.payload.pages || {}),
              },
            });
          } else if (docSnap.id === 'navigation' && data?.payload) {
            setNavigationConfig({ ...DEFAULT_NAVIGATION_CONFIG, ...data.payload });
          }
        });
        setLoadingSite(false);
      },
      (error) => {
        console.warn('Site config read notice:', error.message);
        setLoadingSite(false);
      },
    );
    return () => unsub();
  }, []);

  // Public published properties subscription
  useEffect(() => {
    const q = query(collection(db, 'properties'), where('published', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: Property[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Property, 'id'>),
        }));
        setPublishedProperties(items);
        setLoadingProperties(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'properties');
      },
    );
    return () => unsub();
  }, []);

  // Public published testimonials subscription
  useEffect(() => {
    const q = query(collection(db, 'testimonials'), where('published', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: Testimonial[] = snapshot.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) }))
          .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
        setPublishedTestimonials(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'testimonials');
      },
    );
    return () => unsub();
  }, []);

  // Admin-only subscriptions (all properties, inquiries, all testimonials, media, admins)
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setAdminProperties([]);
      setAdminTestimonials([]);
      setInquiries([]);
      setMediaAssets([]);
      setAdminUsers([]);
      return;
    }

    const unsubProps = onSnapshot(
      collection(db, 'properties'),
      (snap) => {
        setAdminProperties(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Property, 'id'>) })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'properties'),
    );

    const unsubTest = onSnapshot(
      collection(db, 'testimonials'),
      (snap) => {
        setAdminTestimonials(
          snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) }))
            .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)),
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'testimonials'),
    );

    const unsubInq = onSnapshot(
      collection(db, 'inquiries'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Inquiry, 'id'>) }));
        list.sort((a, b) => {
          const tA = (a.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
          const tB = (b.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
          return tB - tA;
        });
        setInquiries(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'inquiries'),
    );

    const unsubMedia = onSnapshot(
      collection(db, 'media'),
      (snap) => {
        setMediaAssets(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MediaAsset, 'id'>) })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'media'),
    );

    const unsubAdmins = onSnapshot(
      collection(db, 'admins'),
      (snap) => {
        setAdminUsers(
          snap.docs.map((d) => ({
            uid: d.id,
            email: String(d.data().email || ''),
            addedAt: d.data().addedAt,
          })),
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'admins'),
    );

    return () => {
      unsubProps();
      unsubTest();
      unsubInq();
      unsubMedia();
      unsubAdmins();
    };
  }, [authReady, isAdmin]);

  const seedStarterPortfolio = useCallback(async () => {
    try {
      for (const prop of STARTER_PROPERTIES) {
        const { id, ...rest } = prop;
        await setDoc(doc(db, 'properties', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const t of STARTER_TESTIMONIALS) {
        const { id, ...rest } = t;
        await setDoc(doc(db, 'testimonials', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await setDoc(doc(db, 'siteConfig', 'general'), {
        configType: 'general',
        payload: DEFAULT_GENERAL_CONFIG,
        updatedAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'siteConfig', 'content'), {
        configType: 'content',
        payload: { ...DEFAULT_CONTENT_CONFIG, hasSeededStarter: true },
        updatedAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'siteConfig', 'seo'), {
        configType: 'seo',
        payload: DEFAULT_SEO_CONFIG,
        updatedAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'siteConfig', 'navigation'), {
        configType: 'navigation',
        payload: DEFAULT_NAVIGATION_CONFIG,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seedStarterPortfolio');
    }
  }, []);

  // Auto-seed starter portfolio into Firestore once upon first admin login if unseeded
  useEffect(() => {
    if (!authReady || !isAdmin || loadingSite) return;
    const checkAndSeed = async () => {
      try {
        const contentSnap = await getDoc(doc(db, 'siteConfig', 'content'));
        if (!contentSnap.exists() && publishedProperties.length === 0 && adminProperties.length === 0) {
          await seedStarterPortfolio();
        }
      } catch {
        // Ignore silent check errors; admin can also trigger seed manually
      }
    };
    void checkAndSeed();
  }, [authReady, isAdmin, loadingSite, publishedProperties.length, adminProperties.length, seedStarterPortfolio]);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const submitInquiry = useCallback(
    async (input: {
      name: string;
      email: string;
      phone: string;
      propertyId?: string;
      propertyTitle?: string;
      propertyAddress?: string;
      propertyType?: string;
      inquiryType: InquiryType;
      subject?: string;
      message: string;
    }) => {
      const id = generateSafeId('inq');
      const payload = {
        name: clampString(input.name, SCHEMA_LIMITS.NAME_MAX),
        email: clampString(input.email, SCHEMA_LIMITS.EMAIL_MAX),
        phone: clampString(input.phone, SCHEMA_LIMITS.PHONE_MAX),
        propertyId: clampString(input.propertyId || '', 128),
        propertyTitle: clampString(input.propertyTitle || '', 180),
        propertyAddress: clampString(input.propertyAddress || '', SCHEMA_LIMITS.ADDRESS_MAX),
        propertyType: clampString(input.propertyType || '', 60),
        inquiryType: input.inquiryType,
        subject: clampString(input.subject || '', 180),
        message: clampString(input.message, SCHEMA_LIMITS.MESSAGE_MAX),
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      try {
        await setDoc(doc(db, 'inquiries', id), payload);
        return id;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
      }
    },
    [],
  );

  const saveProperty = useCallback(
    async (input: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      const id = input.id && SCHEMA_LIMITS.ID_PATTERN.test(input.id) ? input.id : generateSafeId('prop');
      const isEdit = Boolean(input.id);

      const safeUrls = clampStringArray(input.imageUrls, SCHEMA_LIMITS.IMAGES_MAX, 1000);
      const safeAlts = clampStringArray(input.imageAlts || [], SCHEMA_LIMITS.IMAGES_MAX, 240);
      const safeFeatures = clampStringArray(input.features || [], SCHEMA_LIMITS.FEATURES_MAX, 140);

      const baseDoc: Record<string, unknown> = {
        slug: slugify(input.slug || input.title),
        title: clampString(input.title, SCHEMA_LIMITS.TITLE_MAX),
        description: clampString(input.description, SCHEMA_LIMITS.DESCRIPTION_MAX) || 'Property details provided upon inquiry.',
        price: clampNumber(input.price, 0, 1000000000, 0),
        listingType: input.listingType === 'Rent' ? 'Rent' : 'Sale',
        propertyType: input.propertyType,
        status: input.status,
        featured: Boolean(input.featured),
        published: Boolean(input.published),
        address: clampString(input.address, SCHEMA_LIMITS.ADDRESS_MAX),
        city: clampString(input.city, SCHEMA_LIMITS.CITY_MAX),
        neighborhood: clampString(input.neighborhood || '', 100),
        bedrooms: clampNumber(input.bedrooms, 0, 50, 0),
        bathrooms: clampNumber(input.bathrooms, 0, 50, 0),
        sqft: clampNumber(input.sqft, 0, 1000000, 0),
        yearBuilt: clampNumber(input.yearBuilt ?? 0, 0, 2100, 0),
        parking: clampString(input.parking || '', 120),
        features: safeFeatures,
        imageUrls: safeUrls,
        imageAlts: safeAlts,
        seoTitle: clampString(input.seoTitle || '', 140),
        seoDescription: clampString(input.seoDescription || '', 300),
        updatedAt: serverTimestamp(),
      };

      if (typeof input.lat === 'number' && Number.isFinite(input.lat)) {
        baseDoc.lat = clampNumber(input.lat, -90, 90, 0);
      }
      if (typeof input.lng === 'number' && Number.isFinite(input.lng)) {
        baseDoc.lng = clampNumber(input.lng, -180, 180, 0);
      }

      try {
        if (isEdit) {
          const existingSnap = await getDoc(doc(db, 'properties', id));
          const createdAt = existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp();
          await setDoc(doc(db, 'properties', id), {
            ...baseDoc,
            createdAt,
          });
        } else {
          await setDoc(doc(db, 'properties', id), {
            ...baseDoc,
            createdAt: serverTimestamp(),
          });
        }
        return id;
      } catch (error) {
        handleFirestoreError(error, isEdit ? OperationType.UPDATE : OperationType.CREATE, `properties/${id}`);
      }
    },
    [],
  );

  const deleteProperty = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
    }
  }, []);

  const updateInquiryStatus = useCallback(async (id: string, status: InquiryStatus) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
    }
  }, []);

  const deleteInquiry = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
    }
  }, []);

  const saveTestimonial = useCallback(
    async (input: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      const id = input.id && SCHEMA_LIMITS.ID_PATTERN.test(input.id) ? input.id : generateSafeId('test');
      const isEdit = Boolean(input.id);
      const baseDoc = {
        clientName: clampString(input.clientName, 100),
        clientRole: clampString(input.clientRole, 120),
        rating: clampNumber(input.rating, 1, 5, 5),
        quote: clampString(input.quote, 1000),
        isPlaceholder: Boolean(input.isPlaceholder),
        published: Boolean(input.published),
        sortOrder: clampNumber(input.sortOrder ?? 10, 0, 10000, 10),
        updatedAt: serverTimestamp(),
      };
      try {
        if (isEdit) {
          const existingSnap = await getDoc(doc(db, 'testimonials', id));
          const createdAt = existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp();
          await setDoc(doc(db, 'testimonials', id), {
            ...baseDoc,
            createdAt,
          });
        } else {
          await setDoc(doc(db, 'testimonials', id), {
            ...baseDoc,
            createdAt: serverTimestamp(),
          });
        }
        return id;
      } catch (error) {
        handleFirestoreError(error, isEdit ? OperationType.UPDATE : OperationType.CREATE, `testimonials/${id}`);
      }
    },
    [],
  );

  const deleteTestimonial = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
    }
  }, []);

  const saveSiteConfig = useCallback(
    async (
      type: 'general' | 'content' | 'seo' | 'navigation',
      payload: SiteGeneralConfig | SiteContentConfig | SiteSeoConfig | SiteNavigationConfig,
    ) => {
      try {
        await setDoc(doc(db, 'siteConfig', type), {
          configType: type,
          payload,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `siteConfig/${type}`);
      }
    },
    [],
  );

  const registerMediaUrl = useCallback(
    async (input: { name: string; url: string; alt?: string; category: MediaAsset['category']; storagePath?: string }) => {
      const id = generateSafeId('media');
      const docPayload = {
        name: clampString(input.name, 160) || 'Uploaded Image',
        url: clampString(input.url, 1000),
        storagePath: clampString(input.storagePath || '', 400),
        alt: clampString(input.alt || input.name, 240),
        category: input.category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      try {
        await setDoc(doc(db, 'media', id), docPayload);
        return {
          id,
          ...docPayload,
        } as MediaAsset;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `media/${id}`);
      }
    },
    [],
  );

  const uploadMediaFile = useCallback(
    async (file: File, category: MediaAsset['category'], altText?: string) => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${category}/${Date.now()}-${safeName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return await registerMediaUrl({
        name: file.name,
        url,
        alt: altText || file.name.replace(/\.[^.]+$/, ''),
        category,
        storagePath,
      });
    },
    [registerMediaUrl],
  );

  const updateMediaAsset = useCallback(
    async (id: string, updates: { name: string; alt: string; category: MediaAsset['category']; url: string }) => {
      try {
        await updateDoc(doc(db, 'media', id), {
          name: clampString(updates.name, 160),
          alt: clampString(updates.alt, 240),
          category: updates.category,
          url: clampString(updates.url, 1000),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `media/${id}`);
      }
    },
    [],
  );

  const deleteMediaAsset = useCallback(async (asset: MediaAsset) => {
    try {
      if (asset.storagePath) {
        try {
          await deleteObject(ref(storage, asset.storagePath));
        } catch {
          // Storage object might already be removed
        }
      }
      await deleteDoc(doc(db, 'media', asset.id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `media/${asset.id}`);
    }
  }, []);

  const addAdminUser = useCallback(async (uid: string, email: string) => {
    const cleanUid = clampString(uid, 128);
    if (!SCHEMA_LIMITS.ID_PATTERN.test(cleanUid)) {
      throw new Error('Admin UID must contain only letters, numbers, underscores, or hyphens.');
    }
    try {
      await setDoc(doc(db, 'admins', cleanUid), {
        email: clampString(email, 160),
        addedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `admins/${cleanUid}`);
    }
  }, []);

  const removeAdminUser = useCallback(async (uid: string) => {
    try {
      await deleteDoc(doc(db, 'admins', uid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `admins/${uid}`);
    }
  }, []);

  // Use Firestore properties if present or seeded; otherwise provide showcase listings before initial admin seed
  const usingShowcaseFallback =
    !loadingProperties &&
    !loadingSite &&
    publishedProperties.length === 0 &&
    !contentConfig.hasSeededStarter;

  const effectivePublicProperties = useMemo(() => {
    const list = usingShowcaseFallback ? STARTER_PROPERTIES : publishedProperties;
    return [...list].sort((a, b) => {
      const tA = (a.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
      const tB = (b.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
      return tB - tA;
    });
  }, [usingShowcaseFallback, publishedProperties]);

  const effectivePublicTestimonials = useMemo(() => {
    if (!loadingProperties && publishedTestimonials.length === 0 && !contentConfig.hasSeededStarter) {
      return STARTER_TESTIMONIALS;
    }
    return publishedTestimonials;
  }, [loadingProperties, publishedTestimonials, contentConfig.hasSeededStarter]);

  const value: SiteContextValue = {
    properties: effectivePublicProperties,
    allProperties: adminProperties,
    testimonials: effectivePublicTestimonials,
    allTestimonials: adminTestimonials,
    inquiries,
    mediaAssets,
    adminUsers,
    generalConfig,
    contentConfig,
    seoConfig,
    navigationConfig,
    loadingProperties,
    loadingSite,
    usingShowcaseFallback,
    user,
    authReady,
    isAdmin,
    adminCheckLoading,
    signInWithGoogle,
    logout,
    submitInquiry,
    saveProperty,
    deleteProperty,
    updateInquiryStatus,
    deleteInquiry,
    saveTestimonial,
    deleteTestimonial,
    saveSiteConfig,
    uploadMediaFile,
    registerMediaUrl,
    updateMediaAsset,
    deleteMediaAsset,
    addAdminUser,
    removeAdminUser,
    seedStarterPortfolio,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used inside SiteProvider');
  }
  return ctx;
}
