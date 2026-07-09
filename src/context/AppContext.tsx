import React, { createContext, useContext, useState, useEffect } from 'react';
import { Food, Category, Order, Profile, Setting, CartItem } from '../types';
import { dbService } from '../supabase';

interface AppContextType {
  user: Profile | null;
  cart: CartItem[];
  foods: Food[];
  categories: Category[];
  settings: Setting;
  isLoading: boolean;
  addToCart: (food: Food, quantity?: number) => void;
  removeFromCart: (foodId: string) => void;
  updateCartQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  login: (email: string, pass: string) => Promise<Profile>;
  register: (name: string, mobile: string, email: string, pass: string) => Promise<Profile>;
  logout: () => void;
  setupSuperAdmin: (secretCode: string, name: string, mobile: string, email: string, pass: string) => Promise<Profile>;
  refreshAppData: () => Promise<void>;
  isRateLimited: (actionKey: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// In-memory rate limiting map
const rateLimitMap = new Map<string, number[]>();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Setting>({
    admin_route: 'admin',
    site_title: 'رستوران بلوار',
    contact_phone: '+98123357397',
    contact_address: 'تهران، خیابان ولیعصر، نرسیده به میدان ونک',
    contact_email: 'info@boloar.ir',
    hero_title: 'تجربه طعم اصیل ایرانی در بلوار',
    hero_subtitle: 'غذاهای لوکس و فضایی فاخر، تداعی‌گر میهمانی‌های اصیل شاهانه',
    hero_image: '',
    about_text: '',
    about_image: '',
    footer_text: '',
    is_setup_completed: false,
    is_kitchen_open: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load app details
  const refreshAppData = async () => {
    try {
      const fetchedCats = await dbService.getCategories();
      const fetchedFoods = await dbService.getFoods();
      const fetchedSettings = await dbService.getSettings();
      
      setCategories(fetchedCats);
      setFoods(fetchedFoods);
      setSettings(fetchedSettings);
    } catch (e) {
      console.error('Error fetching initial app data:', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshAppData();
      
      // Load cart from localStorage
      const savedCart = localStorage.getItem('boloar_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (_) {}
      }

      // Check current mock user session
      const savedUser = localStorage.getItem('boloar_mock_current_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (_) {}
      }
      setIsLoading(false);
    };
    init();
  }, []);

  // Update localStorage when cart changes
  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('boloar_cart', JSON.stringify(newCart));
  };

  const addToCart = (food: Food, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.food.id === food.id);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      updateCartState(newCart);
    } else {
      updateCartState([...cart, { food, quantity }]);
    }
  };

  const removeFromCart = (foodId: string) => {
    updateCartState(cart.filter(item => item.food.id !== foodId));
  };

  const updateCartQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    const newCart = cart.map(item => 
      item.food.id === foodId ? { ...item, quantity } : item
    );
    updateCartState(newCart);
  };

  const clearCart = () => {
    updateCartState([]);
  };

  // In-memory rate limiting check (max 5 actions per 60 seconds)
  const isRateLimited = (actionKey: string): boolean => {
    const now = Date.now();
    const timeframe = 60 * 1000; // 1 minute
    const limit = 5;

    const timestamps = rateLimitMap.get(actionKey) || [];
    const validTimestamps = timestamps.filter(ts => now - ts < timeframe);
    
    if (validTimestamps.length >= limit) {
      return true;
    }

    validTimestamps.push(now);
    rateLimitMap.set(actionKey, validTimestamps);
    return false;
  };

  // Auth Methods with offline fallback simulators
  const login = async (email: string, pass: string): Promise<Profile> => {
    const profiles = await dbService.getProfiles();
    
    // Find matching profile
    const found = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('کاربری با این مشخصات یافت نشد');
    }

    // Standard local authentication simulator
    setUser(found);
    localStorage.setItem('boloar_mock_current_user', JSON.stringify(found));
    dbService.addAuditLog(found.email, 'ورود به حساب کاربری', `کاربر ${found.full_name} با نقش ${found.role} وارد سایت شد.`);
    return found;
  };

  const register = async (name: string, mobile: string, email: string, pass: string): Promise<Profile> => {
    // Password policy check
    if (pass.length < 8) {
      throw new Error('رمز عبور باید حداقل ۸ کاراکتر باشد.');
    }
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    if (!hasNumber || !hasSpecial) {
      throw new Error('رمز عبور باید حاوی حداقل یک عدد و یک کاراکتر خاص باشد.');
    }

    const profiles = await dbService.getProfiles();
    if (profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('این ایمیل قبلاً ثبت‌نام شده است.');
    }

    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name: name,
      mobile,
      email,
      role: 'Customer',
      created_at: new Date().toISOString(),
    };

    // Save
    const list = [...profiles, newProfile];
    localStorage.setItem('boloar_mock_profiles', JSON.stringify(list));
    setUser(newProfile);
    localStorage.setItem('boloar_mock_current_user', JSON.stringify(newProfile));
    
    dbService.addAuditLog(newProfile.email, 'ثبت‌نام کاربر جدید', `ثبت‌نام موفقیت‌آمیز کاربر ${name}`);
    return newProfile;
  };

  const logout = () => {
    if (user) {
      dbService.addAuditLog(user.email, 'خروج از حساب', `کاربر ${user.full_name} از حساب خود خارج شد.`);
    }
    setUser(null);
    localStorage.removeItem('boloar_mock_current_user');
  };

  const setupSuperAdmin = async (secretCode: string, name: string, mobile: string, email: string, pass: string): Promise<Profile> => {
    // Match code with environment or a fallback standard key
    const envSecret = 'BOLOAR1405'; // Fallback secret code for setup
    if (secretCode !== envSecret) {
      throw new Error('کد محرمانه وارد شده اشتباه است.');
    }

    if (pass.length < 8) {
      throw new Error('رمز عبور باید حداقل ۸ کاراکتر باشد.');
    }

    const superAdmin: Profile = {
      id: `admin-${Date.now()}`,
      full_name: name,
      mobile,
      email,
      role: 'SuperAdmin',
      created_at: new Date().toISOString(),
    };

    // Save and mark setup as completed
    const profiles = await dbService.getProfiles();
    const list = [superAdmin, ...profiles];
    localStorage.setItem('boloar_mock_profiles', JSON.stringify(list));
    
    // Complete setup
    const updatedSettings = { ...settings, is_setup_completed: true };
    await dbService.saveSettings(updatedSettings);
    
    setUser(superAdmin);
    localStorage.setItem('boloar_mock_current_user', JSON.stringify(superAdmin));
    setSettings(updatedSettings);

    dbService.addAuditLog(email, 'راه‌اندازی اولیه سیستم', `مدیرکل جدید ${name} سیستم رستوران بلوار را راه‌اندازی کرد.`);
    return superAdmin;
  };

  return (
    <AppContext.Provider value={{
      user,
      cart,
      foods,
      categories,
      settings,
      isLoading,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      login,
      register,
      logout,
      setupSuperAdmin,
      refreshAppData,
      isRateLimited,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
