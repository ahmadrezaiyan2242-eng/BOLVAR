export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number; // in Tomans
  category_id: string;
  image_url: string;
  is_featured: boolean;
  is_available: boolean;
}

export interface OrderItem {
  food_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_mobile: string;
  customer_email?: string;
  pickup_time: string;
  total_amount: number;
  tax_amount: number;
  payable_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid';
  payment_method: 'phone' | 'online_gateway';
  items: OrderItem[];
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  mobile: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'Staff' | 'Customer';
  created_at: string;
}

export interface PaymentSetting {
  id: string;
  provider_name: 'ZarinPal' | 'IDPay' | 'NextPay';
  merchant_id: string;
  is_active: boolean;
  is_sandbox?: boolean;
  updated_at: string;
}

export interface Setting {
  admin_route: string;
  site_title: string;
  contact_phone: string;
  contact_address: string;
  contact_email: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  about_text: string;
  about_image: string;
  footer_text: string;
  is_setup_completed: boolean;
  is_kitchen_open?: boolean;
}

export interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  details: string;
  created_at: string;
}

export interface CartItem {
  food: Food;
  quantity: number;
}
