import { createClient } from '@supabase/supabase-js';
import { Food, Category, Order, Profile, Setting, AuditLog, PaymentSetting } from './types';

// Read from import.meta.env safely
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

// Detect if we have real credentials
export const isRealSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// If real credentials exist, initialize. Else fallback to safe mock object.
export const supabase = isRealSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ==========================================
// MOCK STATE FOR CLIENT-ONLY OFFLINE MODE
// ==========================================
// Using localStorage to preserve mock database state so that edits from Admin persist perfectly!
const STORAGE_KEYS = {
  CATEGORIES: 'boloar_mock_categories',
  FOODS: 'boloar_mock_foods',
  ORDERS: 'boloar_mock_orders',
  PROFILES: 'boloar_mock_profiles',
  SETTINGS: 'boloar_mock_settings',
  PAYMENT_SETTINGS: 'boloar_mock_payment_settings',
  AUDIT_LOGS: 'boloar_mock_audit_logs',
  CURRENT_USER: 'boloar_mock_current_user',
};

// Initial Categories matching the requested pills
const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'کباب‌ها', slug: 'kebabs', icon: 'Flame' },
  { id: 'cat-2', name: 'خورش‌ها', slug: 'stews', icon: 'Soup' },
  { id: 'cat-3', name: 'پلو و چلو', slug: 'rice-dishes', icon: 'UtensilsCrossed' },
  { id: 'cat-4', name: 'پیش غذا', slug: 'appetizers', icon: 'Salad' },
  { id: 'cat-5', name: 'دسر', slug: 'desserts', icon: 'CakeSlice' },
  { id: 'cat-6', name: 'نوشیدنی', slug: 'drinks', icon: 'CupSoda' },
];

// Initial Foods matching the visual screenshots exactly
const defaultFoods: Food[] = [
  {
    id: 'food-1',
    name: 'کباب برگ ممتاز',
    description: 'کباب برگ ممتاز تهیه شده از راسته گوسفندی ممتاز در مایه پیاز و زعفران ناب ایرانی همراه با گوجه کبابی و پلو زعفرانی.',
    price: 450000,
    category_id: 'cat-1',
    image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=600',
    is_featured: true,
    is_available: true,
  },
  {
    id: 'food-2',
    name: 'زرشک پلو با مرغ',
    description: 'ران یا سینه مرغ سرخ شده سس‌پز معطر با سس مخصوص زعفرانی، زرشک پلوی زعفرانی اصیل مزین به خلال بادام و پسته.',
    price: 380000,
    category_id: 'cat-3',
    image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600',
    is_featured: true,
    is_available: true,
  },
  {
    id: 'food-3',
    name: 'قرمه سبزی اعلاء',
    description: 'خورشت قرمه سبزی اعلاء با گوشت تازه بره، سبزیجات محلی کوهی، لیمو عمانی درجه یک و لوبیای مرغوب همراه با پلو دمسیاه زعفرانی.',
    price: 380000,
    category_id: 'cat-2',
    image_url: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=600',
    is_featured: true,
    is_available: true,
  },
  {
    id: 'food-4',
    name: 'چلو کباب کوبیده مخصوص بلوار',
    description: 'دو سیخ کباب کوبیده سنتی ممتاز (مخلوط گوشت قلوه‌گاه گوسفندی و راسته گوساله) همراه پلو کره زعفرانی دمسیاه و سماق تبریز.',
    price: 450000,
    category_id: 'cat-1',
    image_url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600',
    is_featured: true,
    is_available: true,
  },
  {
    id: 'food-5',
    name: 'کشک بادمجان',
    description: 'بادمجان سرخ شده کبابی، کشک غلیظ محلی، نعناع داغ اعلاء، سیر داغ کاراملی، پیاز داغ طلایی و مغز گردوی خرد شده.',
    price: 250000,
    category_id: 'cat-4',
    image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=600',
    is_featured: true,
    is_available: true,
  },
  {
    id: 'food-6',
    name: 'خورشت قیمه سیب‌زمینی',
    description: 'خورشت قیمه جاافتاده با مغز ران گوساله، لپه آذری تبریز، سیب‌زمینی سرخ‌شده ترد و لیمو عمانی معطر همراه با پلو زعفرانی.',
    price: 350000,
    category_id: 'cat-2',
    image_url: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=600',
    is_featured: false,
    is_available: true,
  },
  {
    id: 'food-7',
    name: 'شربت زعفران و بیدمشک',
    description: 'شربت خنک تابستانی معطر با گلاب دوآتیشه کاشان، زعفران سابیده شده قائنات، عرق بیدمشک ناب و تخم شربتی.',
    price: 75000,
    category_id: 'cat-6',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    is_featured: false,
    is_available: true,
  },
  {
    id: 'food-8',
    name: 'ماست و خیار مجلسی',
    description: 'ماست چکیده پر چرب همراه خیار نگینی، کشمش پلوئی، مغز گردو، گل سرخ پرپر شده و نعناع سابیده شده.',
    price: 85000,
    category_id: 'cat-4',
    image_url: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=600',
    is_featured: false,
    is_available: true,
  }
];

// Setup default settings
const defaultSettings: Setting = {
  admin_route: 'admin',
  site_title: 'رستوران بلوار',
  contact_phone: '+98123357397',
  contact_address: 'تهران، خیابان ولیعصر، نرسیده به میدان ونک، بن‌بست یاس، پلاک ۱۲',
  contact_email: 'info@boloar.ir',
  hero_title: 'تجربه طعم اصیل ایرانی در بلوار',
  hero_subtitle: 'غذاهای لوکس و فضایی فاخر، تداعی‌گر میهمانی‌های اصیل شاهانه با لذیذترین مواد اولیه',
  hero_image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200',
  about_text: 'رستوران بلوار در سال ۱۳۸۸ با هدف زنده نگه‌داشتن آیین سفره‌آرایی و پخت اصیل ایرانی آغاز به کار کرد. ما در بلوار باور داریم که پخت غذا یک هنر مقدس است؛ از همین رو، بهترین برنج دمسیاه شمال، باکیفیت‌ترین گوشت گوسفندی و اصیل‌ترین زعفران خراسان را به کار می‌بندیم تا غذایی شایسته نام ایران و ایرانی بر سر سفره‌های شما بیاوریم.',
  about_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
  footer_text: 'غذاهای لوکس و فضایی فاخر، تداعی‌گر میهمانی‌های اصیل شاهانه در رستوران بلوار',
  is_setup_completed: false,
  is_kitchen_open: true,
};

const defaultPaymentSettings: PaymentSetting[] = [
  { id: 'pay-1', provider_name: 'ZarinPal', merchant_id: '00000000-0000-0000-0000-000000000000', is_active: true, is_sandbox: true, updated_at: new Date().toISOString() },
  { id: 'pay-2', provider_name: 'IDPay', merchant_id: '1234567890', is_active: false, is_sandbox: true, updated_at: new Date().toISOString() },
  { id: 'pay-3', provider_name: 'NextPay', merchant_id: 'nextpay_merchant_xyz', is_active: false, is_sandbox: true, updated_at: new Date().toISOString() },
];

// Helper functions for initializing storage
const getSaved = <T>(key: string, def: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : def;
};

const setSaved = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// ==========================================
// DB SERVICE METHODS (Transparent Fallback)
// ==========================================
export const dbService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!.from('categories').select('*');
      if (error) throw error;
      return data;
    }
    return getSaved<Category[]>(STORAGE_KEYS.CATEGORIES, defaultCategories);
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!
        .from('categories')
        .upsert(category)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const categories = getSaved<Category[]>(STORAGE_KEYS.CATEGORIES, defaultCategories);
    const newCat = {
      id: category.id || `cat-${Date.now()}`,
      name: category.name || '',
      slug: category.slug || '',
      icon: category.icon || 'Flame',
    };
    const index = categories.findIndex(c => c.id === newCat.id);
    if (index >= 0) categories[index] = newCat;
    else categories.push(newCat);
    setSaved(STORAGE_KEYS.CATEGORIES, categories);
    this.addAuditLog('سیستم', 'مدیریت دسته‌بندی', `ذخیره دسته‌بندی با عنوان ${newCat.name}`);
    return newCat;
  },

  async deleteCategory(id: string): Promise<void> {
    if (isRealSupabaseConfigured) {
      const { error } = await supabase!.from('categories').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    const categories = getSaved<Category[]>(STORAGE_KEYS.CATEGORIES, defaultCategories);
    const updated = categories.filter(c => c.id !== id);
    setSaved(STORAGE_KEYS.CATEGORIES, updated);
    this.addAuditLog('سیستم', 'حذف دسته‌بندی', `حذف دسته‌بندی با شناسه ${id}`);
  },

  // Foods
  async getFoods(): Promise<Food[]> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!.from('foods').select('*');
      if (error) throw error;
      return data;
    }
    return getSaved<Food[]>(STORAGE_KEYS.FOODS, defaultFoods);
  },

  async saveFood(food: Partial<Food>): Promise<Food> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!
        .from('foods')
        .upsert(food)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const foods = getSaved<Food[]>(STORAGE_KEYS.FOODS, defaultFoods);
    const newFood = {
      id: food.id || `food-${Date.now()}`,
      name: food.name || '',
      description: food.description || '',
      price: food.price || 0,
      category_id: food.category_id || '',
      image_url: food.image_url || '',
      is_featured: food.is_featured ?? false,
      is_available: food.is_available ?? true,
    };
    const index = foods.findIndex(f => f.id === newFood.id);
    if (index >= 0) foods[index] = newFood;
    else foods.push(newFood);
    setSaved(STORAGE_KEYS.FOODS, foods);
    this.addAuditLog('سیستم', 'مدیریت غذاها', `ذخیره غذای ${newFood.name}`);
    return newFood;
  },

  async deleteFood(id: string): Promise<void> {
    if (isRealSupabaseConfigured) {
      const { error } = await supabase!.from('foods').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    const foods = getSaved<Food[]>(STORAGE_KEYS.FOODS, defaultFoods);
    const updated = foods.filter(f => f.id !== id);
    setSaved(STORAGE_KEYS.FOODS, updated);
    this.addAuditLog('سیستم', 'حذف غذا', `حذف غذای با شناسه ${id}`);
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return getSaved<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async createOrder(order: Partial<Order>): Promise<Order> {
    const newOrder: Order = {
      id: order.id || `order-${Math.floor(100000 + Math.random() * 900000)}`,
      user_id: order.user_id || null,
      customer_name: order.customer_name || '',
      customer_mobile: order.customer_mobile || '',
      customer_email: order.customer_email || '',
      pickup_time: order.pickup_time || '',
      total_amount: order.total_amount || 0,
      tax_amount: order.tax_amount || 0,
      payable_amount: order.payable_amount || 0,
      status: 'pending',
      payment_status: 'unpaid',
      payment_method: order.payment_method || 'phone',
      items: order.items || [],
      created_at: new Date().toISOString(),
    };

    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!
        .from('orders')
        .insert(newOrder)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const orders = getSaved<Order[]>(STORAGE_KEYS.ORDERS, []);
    orders.unshift(newOrder);
    setSaved(STORAGE_KEYS.ORDERS, orders);
    this.addAuditLog(newOrder.customer_email || 'مشتری تلفنی', 'ثبت سفارش جدید', `ثبت سفارش به شماره ${newOrder.id} به مبلغ ${newOrder.payable_amount} تومان`);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status'], payment_status?: Order['payment_status']): Promise<Order> {
    if (isRealSupabaseConfigured) {
      const updates: Partial<Order> = { status };
      if (payment_status) updates.payment_status = payment_status;
      const { data, error } = await supabase!
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const orders = getSaved<Order[]>(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex(o => o.id === id);
    if (index >= 0) {
      orders[index].status = status;
      if (payment_status) orders[index].payment_status = payment_status;
      setSaved(STORAGE_KEYS.ORDERS, orders);
      this.addAuditLog('مدیر سیستم', 'بروزرسانی سفارش', `تغییر وضعیت سفارش ${id} به ${status}`);
      return orders[index];
    }
    throw new Error('سفارش یافت نشد');
  },

  // Settings
  async getSettings(): Promise<Setting> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!.from('settings').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data;
    }
    return getSaved<Setting>(STORAGE_KEYS.SETTINGS, defaultSettings);
  },

  async saveSettings(settings: Partial<Setting>): Promise<Setting> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!
        .from('settings')
        .upsert(settings)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const current = getSaved<Setting>(STORAGE_KEYS.SETTINGS, defaultSettings);
    const updated = { ...current, ...settings };
    setSaved(STORAGE_KEYS.SETTINGS, updated);
    this.addAuditLog('مدیر سیستم', 'بروزرسانی تنظیمات CMS', 'تغییر تنظیمات عمومی سایت و محتوای صبحه اصلی');
    return updated;
  },

  // Payment Settings
  async getPaymentSettings(): Promise<PaymentSetting[]> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!.from('payment_settings').select('*');
      if (error) throw error;
      return data;
    }
    return getSaved<PaymentSetting[]>(STORAGE_KEYS.PAYMENT_SETTINGS, defaultPaymentSettings);
  },

  async savePaymentSettings(provider: PaymentSetting): Promise<PaymentSetting> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!
        .from('payment_settings')
        .upsert(provider)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const list = getSaved<PaymentSetting[]>(STORAGE_KEYS.PAYMENT_SETTINGS, defaultPaymentSettings);
    const idx = list.findIndex(p => p.provider_name === provider.provider_name);
    if (idx >= 0) {
      list[idx] = provider;
    } else {
      list.push(provider);
    }
    setSaved(STORAGE_KEYS.PAYMENT_SETTINGS, list);
    this.addAuditLog('مدیر سیستم', 'تنظیمات درگاه پرداخت', `ویرایش درگاه ${provider.provider_name}`);
    return provider;
  },

  // Profiles (Users)
  async getProfiles(): Promise<Profile[]> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!.from('profiles').select('*');
      if (error) throw error;
      return data;
    }
    const defaultProfiles: Profile[] = [
      { id: 'usr-1', full_name: 'علیرضا رضایی', mobile: '09123456789', email: 'ahmadrezaiyan2242@gmail.com', role: 'SuperAdmin', created_at: new Date().toISOString() },
      { id: 'usr-2', full_name: 'بهمن سلیمانی', mobile: '09129876543', email: 'staff@boloar.ir', role: 'Staff', created_at: new Date().toISOString() },
      { id: 'usr-3', full_name: 'مریم حسینی', mobile: '09121112233', email: 'customer@boloar.ir', role: 'Customer', created_at: new Date().toISOString() },
    ];
    return getSaved<Profile[]>(STORAGE_KEYS.PROFILES, defaultProfiles);
  },

  async saveProfileRole(id: string, role: Profile['role']): Promise<void> {
    if (isRealSupabaseConfigured) {
      const { error } = await supabase!
        .from('profiles')
        .update({ role })
        .eq('id', id);
      if (error) throw error;
      return;
    }
    const profiles = await this.getProfiles();
    const idx = profiles.findIndex(p => p.id === id);
    if (idx >= 0) {
      profiles[idx].role = role;
      setSaved(STORAGE_KEYS.PROFILES, profiles);
      this.addAuditLog('مدیر سیستم', 'تغییر نقش کاربر', `تغییر نقش کاربر با شناسه ${id} به ${role}`);
    }
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase!
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return getSaved<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  },

  addAuditLog(user_email: string, action: string, details: string): void {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user_email,
      action,
      details,
      created_at: new Date().toISOString(),
    };
    if (isRealSupabaseConfigured) {
      supabase!.from('audit_logs').insert(newLog).then();
      return;
    }
    const logs = getSaved<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    logs.unshift(newLog);
    setSaved(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500)); // Keep last 500
  },

  // Backup System: Export Entire Database
  async exportData(): Promise<string> {
    const backup = {
      categories: await this.getCategories(),
      foods: await this.getFoods(),
      orders: await this.getOrders(),
      profiles: await this.getProfiles(),
      settings: await this.getSettings(),
      payment_settings: await this.getPaymentSettings(),
      audit_logs: await this.getAuditLogs(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Backup System: Restore Entire Database
  async restoreData(jsonString: string): Promise<void> {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.categories) setSaved(STORAGE_KEYS.CATEGORIES, parsed.categories);
      if (parsed.foods) setSaved(STORAGE_KEYS.FOODS, parsed.foods);
      if (parsed.orders) setSaved(STORAGE_KEYS.ORDERS, parsed.orders);
      if (parsed.profiles) setSaved(STORAGE_KEYS.PROFILES, parsed.profiles);
      if (parsed.settings) setSaved(STORAGE_KEYS.SETTINGS, parsed.settings);
      if (parsed.payment_settings) setSaved(STORAGE_KEYS.PAYMENT_SETTINGS, parsed.payment_settings);
      if (parsed.audit_logs) setSaved(STORAGE_KEYS.AUDIT_LOGS, parsed.audit_logs);
      
      this.addAuditLog('مدیر سیستم', 'بازیابی داده‌ها', 'بازیابی موفق پایگاه داده از روی فایل پشتیبان JSON');
    } catch (e: any) {
      throw new Error(`خطا در پردازش پشتیبان: ${e.message}`);
    }
  }
};
