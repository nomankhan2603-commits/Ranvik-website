import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, FilterState, Order, Address, UserProfile, Coupon, Review, BootType } from '../types';
import { productsService, ProductWithDetails } from '../services/products';
import { couponsService } from '../services/coupons';
import { ordersService } from '../services/orders';
import { dbStore } from '../services/dbStore';
import { PRODUCTS, AVAILABLE_COUPONS } from '../data/products';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'alert';
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  appliedCoupon: Coupon | null;
  orders: Order[];
  user: UserProfile | null;
  isLoggedIn: boolean;

  // UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;

  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  trackingOrder: Order | null;
  setTrackingOrder: (order: Order | null) => void;

  activeNavSection: 'home' | 'shop' | 'military' | 'story';
  setActiveNavSection: (sec: 'home' | 'shop' | 'military' | 'story') => void;

  // Cart actions
  addToCart: (product: Product, size: number, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Totals
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  cartCount: number;
  freeShippingThreshold: number;

  // Filter & Search
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Orders & Auth
  createOrder: (orderData: {
    address: Address;
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  }) => Promise<Order>;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  saveAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'alert') => void;
}

const DEFAULT_FILTERS: FilterState = {
  bootTypes: [],
  sizes: [],
  colors: [],
  priceRange: [2000, 4000],
  inStockOnly: false,
  minRating: 0,
  sortBy: 'featured',
};

const INITIAL_USER: UserProfile = {
  id: 'usr_ranvik_01',
  name: 'Major Karan Sharma',
  email: 'karan.sharma@tactical.in',
  phone: '+91 98765 43210',
  addresses: [
    {
      id: 'addr_1',
      fullName: 'Major Karan Sharma',
      street: '402, Officers Complex, Sector 43',
      landmark: 'Near Golf Course Road',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122002',
      phone: '+91 98765 43210',
      isDefault: true,
    },
  ],
};

function mapDBProductToStorefront(dbProd: ProductWithDetails): Product {
  const defaultStaticProd = PRODUCTS.find((p) => p.slug === dbProd.slug || p.id === dbProd.id);
  const rawImages = dbProd.images.length > 0 ? dbProd.images.map((img) => img.publicUrl) : [];
  
  // Resolve valid images or fallback to high-res catalog assets
  const images = rawImages.length > 0 && !rawImages[0].includes('boot1.png')
    ? rawImages
    : (defaultStaticProd?.images && defaultStaticProd.images.length > 0)
    ? defaultStaticProd.images
    : ['/assets/products/ranger-x1.jpg'];

  const inStockVariants = dbProd.variants.filter(
    (v) => v.stockQuantity - v.reservedQuantity > 0
  );
  const availableSizes =
    inStockVariants.length > 0
      ? inStockVariants.map((v) => v.size).sort((a, b) => a - b)
      : dbProd.variants.map((v) => v.size).sort((a, b) => a - b);

  const discountPercent =
    dbProd.mrp > 0 ? Math.round(((dbProd.mrp - dbProd.sellingPrice) / dbProd.mrp) * 100) : 0;

  const bootType: BootType = dbProd.categoryName?.includes('Combat')
    ? 'Combat'
    : dbProd.categoryName?.includes('Officer')
    ? 'Officer'
    : dbProd.categoryName?.includes('Field')
    ? 'Field'
    : 'Tactical';

  return {
    id: dbProd.id,
    slug: dbProd.slug,
    name: dbProd.name,
    modelCode: dbProd.sku,
    shortDescription: dbProd.shortDescription || 'Rugged leather tactical boots crafted in Agra.',
    fullDescription:
      dbProd.description ||
      'Engineered for tactical endurance and rigorous all-terrain movement. Built with 1.8mm hand-selected full-grain bovine leather and aggressive lugged outsoles.',
    price: dbProd.sellingPrice,
    originalPrice: dbProd.mrp,
    discountPercent,
    rating: 4.8,
    reviewsCount: 42,
    images,
    availableSizes: availableSizes.length > 0 ? availableSizes : [6, 7, 8, 9, 10, 11],
    colors: [
      { name: 'Matte Black', hex: '#161719' },
      { name: 'Desert Sand', hex: '#C2A379' },
    ],
    bootType,
    inStock: inStockVariants.length > 0,
    specs: {
      material: '1.8mm Hand-selected Full Grain Bovine Leather',
      sole: 'Multi-Directional High Traction Combat Rubber Lug Outsole',
      shaftHeight: '8.0 inches with Ankle Stabilization Shank',
      closure: 'Heavy-Duty Brass Speed Lace Hooks & Eyelets',
      waterResistance: 'Silicone Tanned Water Repellent Barrier',
      origin: 'Agra Leather Foundry, India',
    },
    materialsDescription: 'Full-grain leather upper treated with military-grade silicone oils.',
    soleDescription: '6mm lug depth with oil-and-slip resistant compound.',
    fitAdvice: 'True to Indian/UK military standard foot sizing.',
    reviews: [],
  };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ranvik_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ranvik_wishlist');
      return saved ? JSON.parse(saved) : ['prod-rx1', 'prod-tac-core'];
    } catch {
      return ['prod-rx1'];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    return AVAILABLE_COUPONS[0] || null;
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ranvik_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Modals / Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [activeNavSection, setActiveNavSection] = useState<'home' | 'shop' | 'military' | 'story'>('home');

  // Filters & Search
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'alert' = 'success') => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Sync with DBStore and Supabase
  const syncWithDatabase = async () => {
    try {
      const dbProducts = await productsService.getAll(false);
      if (dbProducts.length > 0) {
        const mapped = dbProducts.map(mapDBProductToStorefront);
        setProducts(mapped);
      }

      const dbOrders = await ordersService.getAll();
      if (dbOrders.length > 0) {
        const mappedOrders: Order[] = dbOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          date: new Date(o.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          items: o.items.map((it) => {
            const matchedProd = products.find((p) => p.id === it.productId) || {
              id: it.productId,
              name: it.productName,
              modelCode: it.sku,
              price: it.unitPrice,
              originalPrice: it.unitPrice,
              discountPercent: 0,
              rating: 5,
              reviewsCount: 1,
              images: [it.productImageUrl],
              availableSizes: [it.size],
              colors: [{ name: 'Black', hex: '#000' }],
              bootType: 'Combat' as BootType,
              inStock: true,
              shortDescription: '',
              fullDescription: '',
              specs: {
                material: '',
                sole: '',
                shaftHeight: '',
                closure: '',
                waterResistance: '',
                origin: '',
              },
              materialsDescription: '',
              soleDescription: '',
              fitAdvice: '',
              reviews: [],
            };
            return {
              id: it.id,
              product: matchedProd,
              size: it.size,
              quantity: it.quantity,
            };
          }),
          subtotal: o.subtotal,
          discount: o.discount,
          shipping: o.shippingAmount,
          total: o.totalAmount,
          shippingAddress: o.shippingAddressSnapshot,
          paymentMethod: (o.paymentMethod as any) || 'upi',
          status:
            o.status === 'delivered'
              ? 'Delivered'
              : o.status === 'shipped'
              ? 'Shipped'
              : o.status === 'packed'
              ? 'Packed'
              : o.status === 'confirmed'
              ? 'Confirmed'
              : 'Order Placed',
          trackingNumber: o.trackingNumber || `DEL-${Math.floor(10000000 + Math.random() * 90000000)}-IN`,
          estimatedDelivery: o.estimatedDelivery || '3–5 business days',
          timeline: (o.statusHistory || []).map((h) => ({
            status: (h.status.replace(/_/g, ' ') as any) || 'Order Placed',
            timestamp: new Date(h.createdAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            }),
            description: h.note || 'Status updated in logistics ledger.',
            completed: true,
          })),
        }));

        setOrders(mappedOrders);
        if (!trackingOrder && mappedOrders.length > 0) {
          setTrackingOrder(mappedOrders[0]);
        }
      }
    } catch (e) {
      console.warn('ShopContext initial sync error:', e);
    }
  };

  useEffect(() => {
    syncWithDatabase();
    // Subscribe to DBStore updates from Admin actions
    const unsubscribe = dbStore.subscribe(() => {
      syncWithDatabase();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ranvik_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ranvik_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Cart operations
  const addToCart = (product: Product, size: number, quantity: number = 1) => {
    const itemId = `${product.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, size, quantity }];
    });
    showToast(`Added ${product.name} (UK ${size}) to Bag`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Removed item from Bag', 'info');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = async (code: string) => {
    const res = await couponsService.validate(code, cartSubtotal);
    if (!res.valid || !res.coupon) {
      return { success: false, message: res.message };
    }
    setAppliedCoupon(res.coupon);
    showToast(`Applied promo code ${res.coupon.code}`, 'success');
    return { success: true, message: res.message };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const product = products.find((p) => p.id === productId);
      if (exists) {
        showToast(`Removed ${product?.name || 'boot'} from Wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved ${product?.name || 'boot'} to Wishlist`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Financial calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 2499;

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.maximumDiscount && cartDiscount > appliedCoupon.maximumDiscount) {
        cartDiscount = appliedCoupon.maximumDiscount;
      }
    } else if (appliedCoupon.fixedDiscount) {
      cartDiscount = appliedCoupon.fixedDiscount;
    }
  }

  const cartShipping = cart.length === 0 ? 0 : cartSubtotal - cartDiscount >= freeShippingThreshold ? 0 : 150;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const resetFilters = () => {
    setFilterState(DEFAULT_FILTERS);
    setSearchQuery('');
  };

  // Orders creation connected to DB
  const createOrder = async ({
    address,
    paymentMethod,
  }: {
    address: Address;
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  }): Promise<Order> => {
    const dbOrder = await ordersService.create({
      userId: user?.id,
      shippingAddress: address,
      paymentMethod,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingAmount: cartShipping,
      totalAmount: cartTotal,
      items: cart.map((it) => ({
        productId: it.product.id,
        variantId: `var-${it.product.id}-${it.size}`,
        productName: it.product.name,
        sku: `${it.product.modelCode}-${it.size}`,
        size: it.size,
        quantity: it.quantity,
        unitPrice: it.product.price,
        productImageUrl: it.product.images[0] || '/assets/boot1.png',
      })),
    });

    const newStoreOrder: Order = {
      id: dbOrder.id,
      orderNumber: dbOrder.orderNumber,
      date: new Date(dbOrder.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      items: [...cart],
      subtotal: dbOrder.subtotal,
      discount: dbOrder.discount,
      couponCode: appliedCoupon?.code,
      shipping: dbOrder.shippingAmount,
      total: dbOrder.totalAmount,
      shippingAddress: address,
      paymentMethod,
      status: 'Order Placed',
      trackingNumber: dbOrder.trackingNumber || `DEL-${Math.floor(10000000 + Math.random() * 90000000)}-IN`,
      estimatedDelivery: '3–5 business days',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: `${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}, Just now`,
          description: `Order placed via ${paymentMethod.toUpperCase()}. Committed to inventory ledger.`,
          completed: true,
        },
        {
          status: 'Confirmed',
          timestamp: 'Pending',
          description: 'Agra foundry inspection and QA checks',
          completed: false,
        },
        {
          status: 'Packed',
          timestamp: 'Pending',
          description: 'Sealed inside reinforced vault package',
          completed: false,
        },
        {
          status: 'Shipped',
          timestamp: 'Pending',
          description: 'Dispatched with priority express air courier',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          timestamp: 'Pending',
          description: 'Local courier hub transit',
          completed: false,
        },
        {
          status: 'Delivered',
          timestamp: 'Pending',
          description: 'Signature delivery confirmed',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newStoreOrder, ...prev]);
    setTrackingOrder(newStoreOrder);
    clearCart();
    return newStoreOrder;
  };

  const loginUser = (email: string, name?: string) => {
    setIsLoggedIn(true);
    setUser({
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      phone: '+91 98765 00000',
      addresses: user?.addresses || [
        {
          id: 'addr_default',
          fullName: name || 'RANVIK Member',
          street: 'Main Road, Defence Colony',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110024',
          phone: '+91 98765 00000',
          isDefault: true,
        },
      ],
    });
    showToast('Signed in successfully', 'success');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    showToast('Signed out of RANVIK account', 'info');
  };

  const saveAddress = (addr: Address) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      const exists = prev.addresses.some((a) => a.id === addr.id);
      let updatedList = exists
        ? prev.addresses.map((a) => (a.id === addr.id ? addr : a))
        : [...prev.addresses, addr];

      if (addr.isDefault) {
        updatedList = updatedList.map((a) => ({
          ...a,
          isDefault: a.id === addr.id,
        }));
      }
      return { ...prev, addresses: updatedList };
    });
    showToast('Address saved', 'success');
  };

  const deleteAddress = (addressId: string) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== addressId),
      };
    });
    showToast('Address deleted', 'info');
  };

  const setDefaultAddress = (addressId: string) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        })),
      };
    });
    showToast('Default delivery address updated', 'success');
  };

  const addReview = (productId: string, newReview: Omit<Review, 'id' | 'date'>) => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const reviewObj: Review = {
      ...newReview,
      id: `rev_${Date.now()}`,
      date: today,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [reviewObj, ...p.reviews];
          const newAvg =
            Math.round(
              (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length) * 10
            ) / 10;
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvg,
          };
        }
        return p;
      })
    );

    if (selectedProductForDetail?.id === productId) {
      setSelectedProductForDetail((prev) => {
        if (!prev) return null;
        const updatedReviews = [reviewObj, ...prev.reviews];
        const newAvg =
          Math.round(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length) * 10
          ) / 10;
        return {
          ...prev,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newAvg,
        };
      });
    }

    showToast('Thank you! Your verified review has been published.', 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        appliedCoupon,
        orders,
        user,
        isLoggedIn,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAccountOpen,
        setIsAccountOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        isContactOpen,
        setIsContactOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        trackingOrder,
        setTrackingOrder,
        activeNavSection,
        setActiveNavSection,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        cartCount,
        freeShippingThreshold,
        filterState,
        setFilterState,
        resetFilters,
        searchQuery,
        setSearchQuery,
        createOrder,
        loginUser,
        logoutUser,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        addReview,
        toasts,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
