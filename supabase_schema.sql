-- ==========================================
-- SUPABASE SCHEMA FOR BOLOAR RESTAURANT
-- ==========================================

-- 1. PROFILES TABLE (Linked with Auth Users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SuperAdmin', 'Admin', 'Staff', 'Customer')) DEFAULT 'Customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. CATEGORIES TABLE
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL, -- Lucide icon name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. FOODS TABLE
CREATE TABLE public.foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL, -- in Tomans
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Foods
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- 4. ORDERS TABLE
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_mobile TEXT NOT NULL,
    customer_email TEXT,
    pickup_time TEXT NOT NULL, -- Store as formatted string
    total_amount NUMERIC NOT NULL,
    tax_amount NUMERIC NOT NULL,
    payable_amount NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'preparing', 'delivered', 'cancelled')) DEFAULT 'pending',
    payment_status TEXT NOT NULL CHECK (payment_status IN ('unpaid', 'paid')) DEFAULT 'unpaid',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('phone', 'online_gateway')) DEFAULT 'phone',
    items JSONB NOT NULL, -- List of items ordered
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. PAYMENT_SETTINGS TABLE
CREATE TABLE public.payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name TEXT UNIQUE NOT NULL CHECK (provider_name IN ('ZarinPal', 'IDPay', 'NextPay')),
    merchant_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Payment Settings
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- 6. SETTINGS TABLE (Single row configuration)
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_route TEXT NOT NULL DEFAULT 'admin',
    site_title TEXT NOT NULL DEFAULT 'رستوران بلوار',
    contact_phone TEXT NOT NULL DEFAULT '+98123357397',
    contact_address TEXT NOT NULL DEFAULT 'تهران، خیابان ولیعصر، نرسیده به میدان ونک',
    contact_email TEXT NOT NULL DEFAULT 'info@boloar.ir',
    hero_title TEXT NOT NULL DEFAULT 'تجربه طعم اصیل ایرانی در بلوار',
    hero_subtitle TEXT NOT NULL DEFAULT 'غذاهای لوکس و فضایی فاخر',
    hero_image TEXT NOT NULL,
    about_text TEXT NOT NULL,
    about_image TEXT NOT NULL,
    footer_text TEXT NOT NULL DEFAULT 'غذاهای لوکس و فضایی فاخر، در رستوران بلوار',
    is_setup_completed BOOLEAN DEFAULT FALSE NOT NULL
);

-- Enable RLS for Settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 7. AUDIT_LOGS TABLE
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Profiles policies
CREATE POLICY "Public profiles are readable by authenticated users" 
    ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage profiles" 
    ON public.profiles FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('SuperAdmin', 'Admin')
        )
    );

-- Categories policies
CREATE POLICY "Categories are readable by everyone" 
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" 
    ON public.categories FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('SuperAdmin', 'Admin')
        )
    );

-- Foods policies
CREATE POLICY "Foods are readable by everyone" 
    ON public.foods FOR SELECT USING (true);

CREATE POLICY "Admins can manage foods" 
    ON public.foods FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('SuperAdmin', 'Admin')
        )
    );

-- Orders policies
CREATE POLICY "Customers can read their own orders" 
    ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can create orders" 
    ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Staff and Admins can view and manage all orders" 
    ON public.orders FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('SuperAdmin', 'Admin', 'Staff')
        )
    );

-- Payment Settings policies
CREATE POLICY "Admins can view and manage payment settings" 
    ON public.payment_settings FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('SuperAdmin', 'Admin')
        )
    );

-- Settings policies
CREATE POLICY "Settings are readable by everyone" 
    ON public.settings FOR SELECT USING (true);

CREATE POLICY "SuperAdmins can manage settings" 
    ON public.settings FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'SuperAdmin'
        )
    );

-- Audit Logs policies
CREATE POLICY "Admins can read audit logs" 
    ON public.audit_logs FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('SuperAdmin', 'Admin')
        )
    );

CREATE POLICY "System can insert audit logs" 
    ON public.audit_logs FOR INSERT WITH CHECK (true);


-- ==========================================
-- INITIAL DATA SEEDING
-- ==========================================

-- Insert Default Categories
INSERT INTO public.categories (name, slug, icon) VALUES
('کباب‌ها', 'kebabs', 'Beef'),
('خورش‌ها', 'stews', 'Soup'),
('پلو و چلو', 'rice-dishes', 'UtensilsCrossed'),
('پیش غذا', 'appetizers', 'Salad'),
('دسر', 'desserts', 'CakeSlice'),
('نوشیدنی', 'drinks', 'CupSoda')
ON CONFLICT (slug) DO NOTHING;

-- Insert Initial CMS Settings
INSERT INTO public.settings (admin_route, site_title, contact_phone, contact_address, contact_email, hero_title, hero_subtitle, hero_image, about_text, about_image, footer_text, is_setup_completed)
VALUES (
    'admin',
    'رستوران بلوار',
    '+98123357397',
    'تهران، خیابان ولیعصر، نرسیده به میدان ونک، بن‌بست یاس، پلاک ۱۲',
    'info@boloar.ir',
    'تجربه طعم اصیل ایرانی در بلوار',
    'غذاهای لوکس و فضایی فاخر، خاطره‌ای ماندگار از سفره ایرانی',
    'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200',
    'رستوران بلوار از سال ۱۳۸۸ با تکیه بر اصالت ایرانی، لذیذترین غذاها را با استفاده از مرغوب‌ترین مواد اولیه و در فضایی شاهانه ارائه می‌دهد. هنر سرآشپزان ما، تلفیق سنت‌های پخت اصیل با دانش نوین پذیرایی است تا طعمی ناب را بر کام میهمانان عزیزمان بنشانیم.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
    'رستوران بلوار - طعم اصیل ایرانی در فضایی فاخر و چشم‌نواز',
    FALSE
) ON CONFLICT DO NOTHING;

-- Insert Payment Gateway Providers
INSERT INTO public.payment_settings (provider_name, merchant_id, is_active) VALUES
('ZarinPal', '00000000-0000-0000-0000-000000000000', TRUE),
('IDPay', '1234567890', FALSE),
('NextPay', 'nextpay_merchant_xyz', FALSE)
ON CONFLICT (provider_name) DO NOTHING;
