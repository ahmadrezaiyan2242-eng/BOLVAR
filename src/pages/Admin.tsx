import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { dbService } from '../supabase';
import { Food, Category, Order, Profile, Setting, PaymentSetting, AuditLog } from '../types';
import { 
  ShieldAlert, Settings, LayoutGrid, Pizza, ShoppingCart, Users, Database, 
  TrendingUp, Activity, UserCheck, Star, Plus, Edit, Trash2, Download, 
  Upload, Check, X, Shield, Lock, Eye, CheckCircle2, RotateCw, Menu, CreditCard
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { user, settings, foods, categories, setupSuperAdmin, refreshAppData, isRateLimited } = useApp();
  const navigate = useNavigate();

  // Selected Section inside Admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'foods' | 'categories' | 'orders' | 'users' | 'cms' | 'backup'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Setup Form State (if first setup)
  const [setupCode, setSetupCode] = useState('');
  const [setupName, setSetupName] = useState('');
  const [setupMobile, setSetupMobile] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupError, setSetupError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Database lists (Admin exclusive)
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>([]);
  const [adminRouteInput, setAdminRouteInput] = useState(settings.admin_route || 'admin');

  // CRUD temporary States
  const [isLoading, setIsLoading] = useState(false);
  const [foodEdit, setFoodEdit] = useState<Partial<Food> | null>(null);
  const [catEdit, setCatEdit] = useState<Partial<Category> | null>(null);

  // Order status updates states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch exclusive admin logs and users
  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const ords = await dbService.getOrders();
      const profs = await dbService.getProfiles();
      const logs = await dbService.getAuditLogs();
      const pays = await dbService.getPaymentSettings();
      
      setOrders(ords);
      setProfiles(profs);
      setAuditLogs(logs);
      setPaymentSettings(pays);
    } catch (e) {
      console.error('Error fetching admin details:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user is authorized and setup is completed
    if (user && (user.role === 'SuperAdmin' || user.role === 'Admin' || user.role === 'Staff')) {
      fetchAdminData();
    }
  }, [user, activeTab]);

  // Handle first SuperAdmin setup submission
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');
    setSetupSuccess('');
    setIsSettingUp(true);

    if (isRateLimited('superadmin_setup')) {
      setSetupError('تعداد تلاش‌های شما بیش از حد مجاز است. لطفا بعدا اقدام کنید.');
      setIsSettingUp(false);
      return;
    }

    try {
      await setupSuperAdmin(setupCode, setupName, setupMobile, setupEmail, setupPassword);
      setSetupSuccess('کابینه مدیریت کل با موفقیت راه‌اندازی گردید! در حال بارگذاری پنل...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setSetupError(err.message || 'خطایی در راه‌اندازی رخ داد. لطفا کدهای وارد شده را بازنگری کنید.');
      setIsSettingUp(false);
    }
  };

  // Safe Guard: Check if setup is completed. If not, render setup form.
  if (!settings.is_setup_completed) {
    return (
      <div className="py-16 bg-[#faf6f0] min-h-screen flex items-center justify-center text-right font-sans">
        <div className="max-w-md w-full mx-4 bg-white border-2 border-amber-500/40 rounded-2xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500/10 text-amber-600 rounded-full">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl text-slate-900">راه‌اندازی اولیه بلوار</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              هیچ مدیریتی در سیستم تعریف نشده است. جهت حفظ امنیت، لطفا مشخصات مدیرکل (SuperAdmin) را تکمیل فرمایید.
            </p>
          </div>

          {setupError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>{setupError}</span>
            </div>
          )}

          {setupSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{setupSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSetupSubmit} className="space-y-4">
            
            {/* Secret Setup Code */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700">کد محرمانه راه‌اندازی (مستقر در Env) <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-slate-800 text-xs font-mono text-center focus:outline-none"
                placeholder="BOLOAR1405"
                required
              />
            </div>

            {/* Admin name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700">نام و نام خانوادگی مدیرکل <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-slate-800 text-xs focus:outline-none"
                placeholder="علیرضا رضایی"
                required
              />
            </div>

            {/* Mobile */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700">شماره همراه تماس <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={setupMobile}
                onChange={(e) => setSetupMobile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-slate-800 text-xs focus:outline-none text-left"
                placeholder="09123456789"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700">پست الکترونیکی <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={setupEmail}
                onChange={(e) => setSetupEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-slate-800 text-xs focus:outline-none text-left"
                placeholder="admin@domain.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700">رمز عبور قوی <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl p-3 text-slate-800 text-xs focus:outline-none text-left"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSettingUp}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-3.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSettingUp ? 'در حال ایجاد کابینه...' : 'تاسیس کانون مدیریت بلوار'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Safe Guard 2: If user is not logged in or doesn't have privileges, show permission denied.
  if (!user || (user.role !== 'SuperAdmin' && user.role !== 'Admin' && user.role !== 'Staff')) {
    return (
      <div className="py-20 bg-[#faf6f0] min-h-screen flex items-center justify-center text-right font-sans">
        <div className="max-w-md w-full mx-4 bg-[#fdfbf7] border border-red-500/10 rounded-2xl p-8 text-center space-y-6 shadow-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="font-display text-3xl text-slate-900">دسترسی غیرمجاز</h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            متاسفانه شما مجوز دسترسی به این تارنما را ندارید. ورود انحصاری به عهده پرسنل رسمی و مدیرکل می‌باشد.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
          >
            ورود به سیستم
          </button>
        </div>
      </div>
    );
  }

  // CRUD - SAVE FOOD
  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodEdit) return;
    setIsLoading(true);
    try {
      await dbService.saveFood(foodEdit);
      setFoodEdit(null);
      await refreshAppData();
    } catch (err: any) {
      alert(`خطا در ذخیره غذا: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD - DELETE FOOD
  const handleDeleteFood = async (id: string) => {
    if (!window.confirm('آیا از حذف این غذای لذیذ اطمینان کامل دارید؟')) return;
    setIsLoading(true);
    try {
      await dbService.deleteFood(id);
      await refreshAppData();
    } catch (err: any) {
      alert(`خطا در حذف غذا: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD - SAVE CATEGORY
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catEdit) return;
    setIsLoading(true);
    try {
      await dbService.saveCategory(catEdit);
      setCatEdit(null);
      await refreshAppData();
    } catch (err: any) {
      alert(`خطا در ذخیره دسته‌بندی: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD - DELETE CATEGORY
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('آیا از حذف دسته‌بندی اطمینان دارید؟ غذاهای این دسته‌بندی فاقد سرگروه خواهند شد.')) return;
    setIsLoading(true);
    try {
      await dbService.deleteCategory(id);
      await refreshAppData();
    } catch (err: any) {
      alert(`خطا در حذف: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ORDER - UPDATE STATUS
  const handleUpdateOrderStatus = async (id: string, status: Order['status'], payment_status?: Order['payment_status']) => {
    setIsLoading(true);
    try {
      const updated = await dbService.updateOrderStatus(id, status, payment_status);
      setSelectedOrder(updated);
      await fetchAdminData();
    } catch (err: any) {
      console.error('Error changing order status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ROLE - UPDATE USER ROLE
  const handleUpdateUserRole = async (userId: string, role: Profile['role']) => {
    if (user.role !== 'SuperAdmin' && role === 'SuperAdmin') {
      alert('تنها مدیرکل اصلی می‌تواند نقش مدیرکل تخصیص دهد.');
      return;
    }
    setIsLoading(true);
    try {
      await dbService.saveProfileRole(userId, role);
      await fetchAdminData();
    } catch (err: any) {
      alert(`خطا در تغییر نقش: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // CMS - SAVE GENERAL SETTINGS
  const handleSaveCMS = async (updates: Partial<Setting>) => {
    setIsLoading(true);
    try {
      await dbService.saveSettings(updates);
      await refreshAppData();
      alert('محتوای پورتال با موفقیت بروزرسانی شد.');
    } catch (err: any) {
      alert(`خطا در بروزرسانی محتوا: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // PAYMENT SETTINGS - UPDATE PROVIDER
  const handleUpdatePaymentSetting = async (provider: PaymentSetting) => {
    setIsLoading(true);
    try {
      await dbService.savePaymentSettings(provider);
      const pays = await dbService.getPaymentSettings();
      setPaymentSettings(pays);
      alert(`تنظیمات درگاه ${provider.provider_name} با موفقیت ذخیره شد.`);
    } catch (err: any) {
      alert(`خطا در ذخیره درگاه: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // BACKUP - EXPORT JSON
  const handleExportBackup = async () => {
    try {
      const dataStr = await dbService.exportData();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `boloar_database_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      dbService.addAuditLog(user.email, 'پشتیبان‌گیری داده‌ها', 'خروجی کامل داده‌های دیتابیس به صورت موفقیت‌آمیز دریافت شد.');
    } catch (err: any) {
      alert(`خطا در خروجی گرفتن: ${err.message}`);
    }
  };

  // BACKUP - RESTORE JSON
  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('هشدار جدی: بازیابی نسخه پشتیبان باعث جایگزینی کامل اطلاعات جاری شامل غذاها، کاربران و سفارش‌ها می‌گردد. آیا مایل به جایگزینی هستید؟')) {
      return;
    }

    fileReader.onload = async (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        try {
          await dbService.restoreData(result);
          alert('پایگاه داده بلوار با موفقیت بازیابی شد.');
          window.location.reload();
        } catch (err: any) {
          alert(`خطا در ساختار فایل پشتیبان: ${err.message}`);
        }
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row text-right relative">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 w-full shrink-0">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-xl focus:outline-none bg-slate-800 border border-slate-700 flex items-center justify-center animate-fade-in"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-200">
            {activeTab === 'dashboard' && 'داشبورد کلی'}
            {activeTab === 'foods' && 'مدیریت غذاها'}
            {activeTab === 'categories' && 'دسته‌بندی منو'}
            {activeTab === 'orders' && 'سفارشات دریافتی'}
            {activeTab === 'users' && 'کنترل نقش‌ها'}
            {activeTab === 'cms' && 'مدیریت محتوا (CMS)'}
            {activeTab === 'backup' && 'پشتیبان‌گیری و لاگ'}
          </span>
          <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            پیشخوان
          </span>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}
      
      {/* 1. LEFT SIDEBAR: Admin Navigation Layout */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-slate-900 border-l border-slate-800 p-6 space-y-8 shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex md:flex-col md:justify-between h-full md:h-screen sticky top-0
        ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'}
      `}>
        
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-bold text-xl">
              ب
            </div>
            <div>
              <h2 className="font-display text-xl text-amber-400">پیشخوان مدیریت</h2>
              <p className="text-[9px] text-slate-400 font-bold">رستوران لوکس بلوار</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-1 flex flex-col">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right focus:outline-none ${
                activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              داشبورد کلی
            </button>

            <button
              onClick={() => { setActiveTab('foods'); setIsMobileSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right focus:outline-none ${
                activeTab === 'foods' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Pizza className="w-4 h-4 shrink-0" />
              مدیریت غذاها
            </button>

            <button
              onClick={() => { setActiveTab('categories'); setIsMobileSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right focus:outline-none ${
                activeTab === 'categories' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              دسته‌بندی منو
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right focus:outline-none relative ${
                activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              سفارشات دریافتی
              {orders.filter(o => o.status === 'pending').length > 0 && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-500 text-[9px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
              )}
            </button>

            {/* SuperAdmin exclusive roles management */}
            {user.role === 'SuperAdmin' && (
              <button
                onClick={() => { setActiveTab('users'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right focus:outline-none ${
                  activeTab === 'users' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                کنترل نقش‌ها و کاربران
              </button>
            )}

            <button
              onClick={() => { setActiveTab('cms'); setIsMobileSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right focus:outline-none ${
                activeTab === 'cms' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Edit className="w-4 h-4 shrink-0" />
              مدیریت محتوا (CMS)
            </button>

            <button
              onClick={() => { setActiveTab('backup'); setIsMobileSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right focus:outline-none ${
                activeTab === 'backup' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              نسخه پشتیبان و لاگ
            </button>
          </nav>
        </div>

        {/* User Details */}
        <div className="pt-8 border-t border-slate-800 space-y-2 mt-auto">
          <p className="text-[10px] text-slate-500">کاربر فعلی:</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 text-amber-500 border border-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
              {user.full_name.charAt(0)}
            </div>
            <div className="text-right">
              <h4 className="text-xs font-bold text-slate-200">{user.full_name}</h4>
              <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold font-sans">
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsMobileSidebarOpen(false);
              navigate('/');
            }}
            className="w-full text-center bg-slate-800 hover:bg-slate-700 text-xs py-2 rounded-xl text-slate-300 transition-colors mt-4 block"
          >
            بازگشت به سایت اصلی
          </button>
        </div>

      </aside>

      {/* 2. RIGHT SIDE CONTENTS PANELS */}
      <main className="flex-1 p-6 md:p-10 space-y-8 bg-slate-950 overflow-y-auto">
        
        {/* ==================================== */}
        {/* TAB 1: DASHBOARD STATS PANEL */}
        {/* ==================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Header row */}
            <div>
              <h1 className="font-display text-3xl text-slate-100">وضعیت عمومی رستوران</h1>
              <p className="text-xs text-slate-400 mt-1">آمار لحظه‌ای فروش، سفارش‌ها و تعامل کاربران بلوار</p>
            </div>

            {/* Stats Grid matching screenshot 3 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-900 border border-amber-500/10 rounded-2xl p-6 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px] text-slate-400 font-bold">فروش امروز</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-amber-400">۱۲,۵۰۰,۰۰۰ تومان</h3>
                <p className="text-[9px] text-emerald-500">+۱۵٪ نسبت به دیروز</p>
              </div>

              <div className="bg-slate-900 border border-amber-500/10 rounded-2xl p-6 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px] text-slate-400 font-bold">سفارشات جدید</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-blue-400">۴۵ عدد</h3>
                <p className="text-[9px] text-slate-400">۱۲ سفارش در حال پخت</p>
              </div>

              <div className="bg-slate-900 border border-amber-500/10 rounded-2xl p-6 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] text-slate-400 font-bold">کاربران فعال</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-emerald-400">۲۸۰ نفر</h3>
                <p className="text-[9px] text-slate-400">ثبت نام ۵ مشتری جدید</p>
              </div>

              <div className="bg-slate-900 border border-amber-500/10 rounded-2xl p-6 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-[10px] text-slate-400 font-bold">میانگین امتیاز</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-purple-400">۴.۸ / ۵</h3>
                <p className="text-[9px] text-purple-400">رضایت فوق‌العاده مشتریان</p>
              </div>

            </div>

            {/* Quick overview block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Orders table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-right">
                <h3 className="font-bold text-slate-200 text-sm mb-4">سفارش‌های در انتظار تایید</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">کد</th>
                        <th className="pb-3">مشتری</th>
                        <th className="pb-3">مبلغ قابل پرداخت</th>
                        <th className="pb-3 text-left">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.filter(o => o.status === 'pending').slice(0, 5).map(order => (
                        <tr key={order.id} className="text-slate-300">
                          <td className="py-3 font-sans font-bold">#{order.id}</td>
                          <td className="py-3">{order.customer_name}</td>
                          <td className="py-3 text-amber-400 font-sans">{order.payable_amount.toLocaleString('fa-IR')} تومان</td>
                          <td className="py-3 text-left">
                            <button
                              onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }}
                              className="bg-amber-500 text-slate-950 px-3 py-1 rounded text-[10px] font-bold"
                            >
                              بررسی
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.filter(o => o.status === 'pending').length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-500">
                            هیچ سفارشی در انتظار تایید وجود ندارد.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active Audit activity logs summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-right">
                <h3 className="font-bold text-slate-200 text-sm mb-4">فعالیت‌های امنیتی اخیر (سایه‌نگار سیستم)</h3>
                <div className="space-y-4 font-sans text-xs">
                  {auditLogs.slice(0, 4).map(log => (
                    <div key={log.id} className="border-b border-slate-800/50 pb-3 flex items-start gap-3 justify-between">
                      <div>
                        <p className="font-bold text-slate-200">{log.action}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{log.details}</p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {new Date(log.created_at).toLocaleTimeString('fa-IR')}
                      </span>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-center py-8 text-slate-500">هیچ لاگی در سیستم ثبت نشده است.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 2: FOODS CRUD PANEL */}
        {/* ==================================== */}
        {activeTab === 'foods' && (
          <div className="space-y-8 text-right">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl text-slate-100">مدیریت غذاهای رستوران</h1>
                <p className="text-xs text-slate-400 mt-1">افزودن، ویرایش، حذف و تنظیم وضعیت موجودی منوی بلوار</p>
              </div>
              <button
                onClick={() => setFoodEdit({})}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                افزودن غذای جدید
              </button>
            </div>

            {/* Save/Edit dialog card overlay */}
            {foodEdit && (
              <div className="bg-slate-900 border-2 border-amber-500/20 rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-amber-400 text-sm pb-3 border-b border-slate-800">
                  {foodEdit.id ? 'ویرایش اطلاعات غذای انتخاب شده' : 'افزودن غذای لذیذ جدید به آشپزخانه'}
                </h3>
                
                <form onSubmit={handleSaveFood} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">عنوان غذا</label>
                    <input
                      type="text"
                      value={foodEdit.name || ''}
                      onChange={(e) => setFoodEdit({ ...foodEdit, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">قیمت (تومان)</label>
                    <input
                      type="number"
                      value={foodEdit.price || 0}
                      onChange={(e) => setFoodEdit({ ...foodEdit, price: parseInt(e.target.value, 10) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs text-left"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">دسته‌بندی سرگروه</label>
                    <select
                      value={foodEdit.category_id || ''}
                      onChange={(e) => setFoodEdit({ ...foodEdit, category_id: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 text-xs focus:outline-none"
                      required
                    >
                      <option value="">انتخاب دسته‌بندی...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Drag-and-drop upload for local Base64 storage */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-slate-300 font-bold">تصویر غذا (بارگذاری مستقیم یا نشانی اینترنتی)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={foodEdit.image_url || ''}
                          onChange={(e) => setFoodEdit({ ...foodEdit, image_url: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs text-left focus:outline-none"
                          placeholder="https://... یا پسوند Base64"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setFoodEdit({ ...foodEdit, image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=600' })}
                          className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          کباب برگ
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFoodEdit({ ...foodEdit, image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600' })}
                          className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          خورشت قیمه
                        </button>
                      </div>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-amber-500/50', 'bg-amber-500/5');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-amber-500/50', 'bg-amber-500/5');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-amber-500/50', 'bg-amber-500/5');
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setFoodEdit({ ...foodEdit, image_url: event.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.onchange = (event) => {
                          const file = (event.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setFoodEdit({ ...foodEdit, image_url: ev.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        fileInput.click();
                      }}
                      className="cursor-pointer border border-dashed border-slate-800 hover:border-amber-500/35 rounded-xl p-4 text-center transition-all bg-slate-950/40 hover:bg-slate-950/80 group flex flex-col items-center justify-center gap-1.5"
                    >
                      {foodEdit.image_url && foodEdit.image_url.startsWith('data:image/') ? (
                        <div className="flex items-center gap-3">
                          <img src={foodEdit.image_url} alt="پیش‌نمایش" className="w-12 h-12 object-cover rounded-lg border border-slate-700" />
                          <div className="text-right">
                            <p className="text-xs font-bold text-emerald-400">تصویر با موفقیت بارگذاری و رمزگذاری شد</p>
                            <p className="text-[10px] text-slate-500">ذخیره محلی به صورت فشرده فعال است</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-amber-400 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </div>
                          <p className="text-xs text-slate-400 font-bold group-hover:text-slate-200 transition-colors">برای انتخاب تصویر کلیک کنید یا فایل را به اینجا بکشید</p>
                          <p className="text-[9px] text-slate-500">فشرده‌سازی محلی و ذخیره امن در بستر آفلاین بدون نیاز به سرور خارجی</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300">توضیحات و ترکیبات پخت</label>
                    <textarea
                      rows={3}
                      value={foodEdit.description || ''}
                      onChange={(e) => setFoodEdit({ ...foodEdit, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none resize-none"
                      required
                    ></textarea>
                  </div>

                  {/* Flags */}
                  <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={foodEdit.is_featured || false}
                        onChange={(e) => setFoodEdit({ ...foodEdit, is_featured: e.target.checked })}
                        className="accent-amber-500"
                      />
                      پیشنهاد ویژه صفحه اصلی
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={foodEdit.is_available ?? true}
                        onChange={(e) => setFoodEdit({ ...foodEdit, is_available: e.target.checked })}
                        className="accent-amber-500"
                      />
                      موجود در آشپزخانه جهت سفارش
                    </label>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setFoodEdit(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-xs"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs"
                    >
                      ذخیره اطلاعات غذا
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* Food items table list */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">تصویر</th>
                      <th className="pb-3">نام غذا</th>
                      <th className="pb-3">دسته‌بندی</th>
                      <th className="pb-3">مبلغ (تومان)</th>
                      <th className="pb-3 text-center">ویژه</th>
                      <th className="pb-3 text-center">موجودی</th>
                      <th className="pb-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {foods.map(food => {
                      const cat = categories.find(c => c.id === food.category_id);
                      return (
                        <tr key={food.id} className="text-slate-300 hover:bg-slate-800/25">
                          <td className="py-3">
                            <img src={food.image_url} alt={food.name} className="w-10 h-10 rounded-lg object-cover" />
                          </td>
                          <td className="py-3 font-bold text-slate-200">{food.name}</td>
                          <td className="py-3">{cat ? cat.name : 'فاقد دسته'}</td>
                          <td className="py-3 font-sans font-bold">{food.price.toLocaleString('fa-IR')}</td>
                          <td className="py-3 text-center">
                            {food.is_featured ? <span className="text-amber-500 font-bold">✓</span> : <span className="text-slate-600">✗</span>}
                          </td>
                          <td className="py-3 text-center">
                            {food.is_available ? <span className="text-emerald-500 font-bold">موجود</span> : <span className="text-red-500">ناموجود</span>}
                          </td>
                          <td className="py-3 text-left">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setFoodEdit(food)}
                                className="p-1 text-blue-400 hover:bg-blue-500/10 rounded"
                                title="ویرایش"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFood(food.id)}
                                className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 3: CATEGORIES CRUD PANEL */}
        {/* ==================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-8 text-right">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl text-slate-100">مدیریت دسته‌بندی‌های منو</h1>
                <p className="text-xs text-slate-400 mt-1">افزودن، ویرایش و حذف طبقه‌بندی غذاهای رستوران</p>
              </div>
              <button
                onClick={() => setCatEdit({})}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                افزودن گروه جدید
              </button>
            </div>

            {/* Category Edit block */}
            {catEdit && (
              <form onSubmit={handleSaveCategory} className="bg-slate-900 border-2 border-amber-500/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-amber-400 text-xs pb-2 border-b border-slate-800">
                  {catEdit.id ? 'ویرایش عنوان دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">نام دسته‌بندی</label>
                    <input
                      type="text"
                      value={catEdit.name || ''}
                      onChange={(e) => setCatEdit({ ...catEdit, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">نام مستعار انگلیسی (slug)</label>
                    <input
                      type="text"
                      value={catEdit.slug || ''}
                      onChange={(e) => setCatEdit({ ...catEdit, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs text-left"
                      required
                    />
                  </div>

                  {/* Icon chooser */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">نام آیکون (Flame, Soup, Salad etc.)</label>
                    <input
                      type="text"
                      value={catEdit.icon || ''}
                      onChange={(e) => setCatEdit({ ...catEdit, icon: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs text-left focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCatEdit(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs"
                  >
                    ذخیره گروه
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">شناسه انگلیسی</th>
                      <th className="pb-3">نام گروه</th>
                      <th className="pb-3">سمبل آیکون</th>
                      <th className="pb-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {categories.map(cat => (
                      <tr key={cat.id}>
                        <td className="py-3 font-mono">{cat.slug}</td>
                        <td className="py-3 font-bold">{cat.name}</td>
                        <td className="py-3 font-mono text-slate-400">{cat.icon}</td>
                        <td className="py-3 text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setCatEdit(cat)}
                              className="p-1 text-blue-400 hover:bg-blue-500/10 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 4: ORDERS INCOMING PANEL */}
        {/* ==================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-8 text-right">
            <div>
              <h1 className="font-display text-3xl text-slate-100">سفارشات دریافتی آشپزخانه</h1>
              <p className="text-xs text-slate-400 mt-1">تایید سفارش‌ها، بروزرسانی فاکتور و پیگیری نحوه طبخ و ارسال گرمابه</p>
            </div>

            {selectedOrder && (
              <div className="bg-slate-900 border-2 border-amber-500/20 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <button onClick={() => setSelectedOrder(null)} className="text-xs text-slate-400">بستن فاکتور ×</button>
                  <h3 className="font-bold text-amber-400">بررسی کامل فاکتور سفارش #{selectedOrder.id}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed font-light">
                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl">
                    <p><strong>نام مشتری:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>تلفن همراه:</strong> {selectedOrder.customer_mobile}</p>
                    <p><strong>پست الکترونیک:</strong> {selectedOrder.customer_email || 'ثبت نشده'}</p>
                    <p><strong>زمان درخواستی تحویل:</strong> {selectedOrder.pickup_time}</p>
                  </div>
                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl">
                    <p><strong>مبلغ خام فاکتور:</strong> {selectedOrder.total_amount.toLocaleString('fa-IR')} تومان</p>
                    <p><strong>مالیات و ارزش افزوده:</strong> {selectedOrder.tax_amount.toLocaleString('fa-IR')} تومان</p>
                    <p className="text-sm font-bold text-amber-400"><strong>مبلغ نهایی قابل تسویه:</strong> {selectedOrder.payable_amount.toLocaleString('fa-IR')} تومان</p>
                    <p><strong>وضعیت تسویه فاکتور:</strong> {selectedOrder.payment_status === 'paid' ? 'پرداخت شده آنلاین' : 'پرداخت در محل (کارتخوان سیار)'}</p>
                  </div>
                </div>

                {/* Items detail list */}
                <div className="bg-slate-950 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-200 text-xs pb-2 border-b border-slate-800">اقلام سفارش داده شده:</h4>
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-300">
                      <span>{it.name} <strong className="text-amber-500 font-sans">({it.quantity} عدد)</strong></span>
                      <span className="font-sans text-slate-400">{(it.price * it.quantity).toLocaleString('fa-IR')} تومان</span>
                    </div>
                  ))}
                </div>

                {/* Operations Actions Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                  <div className="w-full text-xs text-slate-400 mb-1">تغییر وضعیت گام‌به‌گام طبخ (Kitchen Pipeline):</div>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'confirmed')}
                    className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-colors ${
                      selectedOrder.status === 'confirmed'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-purple-400 hover:bg-slate-700'
                    }`}
                  >
                    تایید سفارش (Confirmed)
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'preparing')}
                    className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-colors ${
                      selectedOrder.status === 'preparing'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-blue-400 hover:bg-slate-700'
                    }`}
                  >
                    شروع طبخ (Preparing)
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'ready_for_pickup')}
                    className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-colors ${
                      selectedOrder.status === 'ready_for_pickup'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-indigo-400 hover:bg-slate-700'
                    }`}
                  >
                    آماده تحویل (Ready for Pickup)
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered', 'paid')}
                    className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-colors ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                    }`}
                  >
                    تحویل و تسویه (Completed)
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                    className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-colors ${
                      selectedOrder.status === 'cancelled'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-red-400 hover:bg-slate-700'
                    }`}
                  >
                    لغو سفارش (Cancelled)
                  </button>

                  {/* Manual Financial Override Ledger */}
                  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t border-slate-800/60">
                    <span className="text-[10px] sm:text-xs text-slate-300 font-bold">وضعیت تسویه فاکتور (Ledger Override):</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status, 'paid')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          selectedOrder.payment_status === 'paid' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/5' 
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        ✓ تسویه کامل (پرداخت شد)
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status, 'unpaid')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          selectedOrder.payment_status === 'unpaid' 
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/5' 
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        ✗ بدهکار (پرداخت نشده)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Incoming Orders list */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">کد سفارش</th>
                      <th className="pb-3">نام مشتری</th>
                      <th className="pb-3">شماره تماس همراه</th>
                      <th className="pb-3">زمان تحویل</th>
                      <th className="pb-3">جمع فاکتور</th>
                      <th className="pb-3 text-center">وضعیت طبخ</th>
                      <th className="pb-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {orders.map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-800/25">
                        <td className="py-4 font-sans font-bold">#{ord.id}</td>
                        <td className="py-4 font-bold">{ord.customer_name}</td>
                        <td className="py-4 font-sans">{ord.customer_mobile}</td>
                        <td className="py-4 font-medium text-slate-400">{ord.pickup_time}</td>
                        <td className="py-4 font-sans text-amber-400 font-bold">{ord.payable_amount.toLocaleString('fa-IR')} تومان</td>
                        <td className="py-4 text-center">
                          {ord.status === 'pending' && <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20 font-bold">در انتظار</span>}
                          {ord.status === 'confirmed' && <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 font-bold">تایید شده</span>}
                          {ord.status === 'preparing' && <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 font-bold">در حال پخت</span>}
                          {ord.status === 'ready_for_pickup' && <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 font-bold">آماده تحویل</span>}
                          {ord.status === 'delivered' && <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-bold">تحویل شد</span>}
                          {ord.status === 'cancelled' && <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 font-bold">لغو گردید</span>}
                        </td>
                        <td className="py-4 text-left">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="bg-slate-800 hover:bg-slate-700 text-amber-500 px-3 py-1.5 rounded-lg font-bold"
                          >
                            بررسی فاکتور
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 5: USERS ROLES PANEL (SuperAdmin only) */}
        {/* ==================================== */}
        {activeTab === 'users' && user.role === 'SuperAdmin' && (
          <div className="space-y-8 text-right">
            <div>
              <h1 className="font-display text-3xl text-slate-100">کنترل نقش‌ها و پرسنل رسمی</h1>
              <p className="text-xs text-slate-400 mt-1">مدیریت کاربران، تخصیص نقش به پرسنل رسمی (مدیران، پرسنل آشپزخانه و مشتریان)</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">نام کاربر</th>
                      <th className="pb-3">شماره همراه تماس</th>
                      <th className="pb-3">پست الکترونیکی</th>
                      <th className="pb-3">نقش فعلی کاربر</th>
                      <th className="pb-3 text-left">تغییر نقش</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {profiles.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/25">
                        <td className="py-4 font-bold text-slate-200">{p.full_name}</td>
                        <td className="py-4 font-sans">{p.mobile}</td>
                        <td className="py-4 font-sans text-slate-400">{p.email}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            p.role === 'SuperAdmin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            p.role === 'Admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            p.role === 'Staff' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {p.role}
                          </span>
                        </td>
                        <td className="py-4 text-left">
                          {p.id !== user.id ? (
                            <select
                              value={p.role}
                              onChange={(e) => handleUpdateUserRole(p.id, e.target.value as Profile['role'])}
                              className="bg-slate-950 border border-slate-800 text-slate-300 rounded p-1.5 focus:outline-none"
                            >
                              <option value="Customer">Customer (مشتری)</option>
                              <option value="Staff">Staff (پرسنل)</option>
                              <option value="Admin">Admin (مدیر)</option>
                              <option value="SuperAdmin">SuperAdmin (مدیرکل)</option>
                            </select>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">مدیرکل جاری (غیرقابل ویرایش)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 6: CMS PORTAL MANAGER PANEL */}
        {/* ==================================== */}
        {activeTab === 'cms' && (
          <div className="space-y-8 text-right">
            <div>
              <h1 className="font-display text-3xl text-slate-100">مدیریت محتوای پورتال (CMS)</h1>
              <p className="text-xs text-slate-400 mt-1">تغییر عنوان‌ها، لوگو، تلفن تماس، نشانی فیزیکی و مسیر ورود اختصاصی به پیشخوان</p>
            </div>

            {/* Global Kitchen Status Banner */}
            <div className={`p-6 rounded-2xl border transition-all ${
              settings.is_kitchen_open !== false
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${settings.is_kitchen_open !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <h3 className="text-sm font-bold text-slate-100">
                      {settings.is_kitchen_open !== false ? 'وضعیت کاری آشپزخانه: فعال و آماده پذیرش سفارش' : 'وضعیت کاری آشپزخانه: غیرفعال و تعطیل موقت'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    با غیرفعال کردن وضعیت آشپزخانه، بنر تعاملی تعطیلی در سرتاسر وبسایت نمایش داده شده و سبد خرید موقتا غیرفعال می‌گردد.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveCMS({ is_kitchen_open: settings.is_kitchen_open === false ? true : false })}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    settings.is_kitchen_open !== false
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {settings.is_kitchen_open !== false ? 'تعطیل کردن موقت آشپزخانه' : 'بازگشایی و شروع کار آشپزخانه'}
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Site title */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">عنوان اصلی وبسایت</label>
                  <input
                    type="text"
                    defaultValue={settings.site_title}
                    onBlur={(e) => handleSaveCMS({ site_title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none"
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">تلفن تماس پذیرش و رزرو</label>
                  <input
                    type="text"
                    defaultValue={settings.contact_phone}
                    onBlur={(e) => handleSaveCMS({ contact_phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs text-left focus:outline-none"
                  />
                </div>

                {/* Hero Title */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">عنوان بزرگ بنر اصلی (Hero Title)</label>
                  <input
                    type="text"
                    defaultValue={settings.hero_title}
                    onBlur={(e) => handleSaveCMS({ hero_title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none"
                  />
                </div>

                {/* Hero Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">متن توضیحات زیر بنر اصلی (Hero Subtitle)</label>
                  <input
                    type="text"
                    defaultValue={settings.hero_subtitle}
                    onBlur={(e) => handleSaveCMS({ hero_subtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none"
                  />
                </div>

                {/* Hero Image link */}
                <div className="space-y-1.5 flex flex-col justify-between">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">تصویر بنر اصلی (Hero Image)</label>
                    <input
                      key={settings.hero_image}
                      type="text"
                      defaultValue={settings.hero_image}
                      onBlur={(e) => handleSaveCMS({ hero_image: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs text-left focus:outline-none mb-2"
                      placeholder="https://... یا فرمت Base64"
                    />
                  </div>
                  <div
                    onClick={() => {
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = 'image/*';
                      fileInput.onchange = (event) => {
                        const file = (event.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              handleSaveCMS({ hero_image: ev.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      fileInput.click();
                    }}
                    className="cursor-pointer border border-dashed border-slate-800 hover:border-amber-500/35 rounded-xl p-2.5 text-center transition-all bg-slate-950/40 hover:bg-slate-950/80 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] text-slate-400 font-bold">آپلود مستقیم عکس بنر</span>
                  </div>
                </div>

                {/* About image link */}
                <div className="space-y-1.5 flex flex-col justify-between">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">تصویر درباره ما (About Image)</label>
                    <input
                      key={settings.about_image}
                      type="text"
                      defaultValue={settings.about_image}
                      onBlur={(e) => handleSaveCMS({ about_image: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs text-left focus:outline-none mb-2"
                      placeholder="https://... یا فرمت Base64"
                    />
                  </div>
                  <div
                    onClick={() => {
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = 'image/*';
                      fileInput.onchange = (event) => {
                        const file = (event.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              handleSaveCMS({ about_image: ev.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      fileInput.click();
                    }}
                    className="cursor-pointer border border-dashed border-slate-800 hover:border-amber-500/35 rounded-xl p-2.5 text-center transition-all bg-slate-950/40 hover:bg-slate-950/80 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] text-slate-400 font-bold">آپلود مستقیم عکس درباره‌ما</span>
                  </div>
                </div>

                {/* Footer text */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs text-slate-300">جمله حق کپی‌رایت انتهای سایت (Footer Copytext)</label>
                  <input
                    type="text"
                    defaultValue={settings.footer_text}
                    onBlur={(e) => handleSaveCMS({ footer_text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs text-slate-300">نشانی فیزیکی جهت درج در فوتر</label>
                  <input
                    type="text"
                    defaultValue={settings.contact_address}
                    onBlur={(e) => handleSaveCMS({ contact_address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none"
                  />
                </div>

                {/* About Text area */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs text-slate-300">متن بخش تاریخچه و درباره ما</label>
                  <textarea
                    rows={4}
                    defaultValue={settings.about_text}
                    onBlur={(e) => handleSaveCMS({ about_text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none resize-none"
                  ></textarea>
                </div>

              </div>

              {/* Dynamic Route config card */}
              <div className="border border-amber-500/20 bg-amber-500/5 p-5 rounded-2xl space-y-4">
                <h4 className="font-bold text-amber-400 text-sm">تغییر آدرس ورود پنل مدیریت (Dynamic Route)</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                  بر اساس الزامات امنیتی، شما می‌توانید مسیر ورود به پنل مدیریت را از `/admin` به عنوان دلخواه تغییر دهید. این فیلد انحصارا توسط SuperAdmin قابل ویرایش است.
                </p>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={adminRouteInput}
                    onChange={(e) => setAdminRouteInput(e.target.value)}
                    disabled={user.role !== 'SuperAdmin'}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-xs font-mono text-left focus:outline-none"
                  />
                  <button
                    onClick={() => handleSaveCMS({ admin_route: adminRouteInput })}
                    disabled={user.role !== 'SuperAdmin'}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    ذخیره مسیر اختصاصی
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 7: BACKUP AND RESTORE LOG PANEL */}
        {/* ==================================== */}
        {activeTab === 'backup' && (
          <div className="space-y-8 text-right">
            <div>
              <h1 className="font-display text-3xl text-slate-100">پشتیبان‌گیری پایگاه داده</h1>
              <p className="text-xs text-slate-400 mt-1">تهیه فایل پشتیبان جامع دیتابیس به همراه بازیابی کامل فاکتورها، غذاها و لاگ‌های امنیتی</p>
            </div>

            {/* Backup operations row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Export block */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  دریافت نسخه پشتیبان JSON (Export)
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                  با کلیک بر روی دکمه زیر، فایل کاملی از کل دیتابیس شبیه‌ساز شامل تمامی غذاهای افزوده شده، مشتریان، خورش‌ها، سفارش‌های دریافتی، فاکتورها و لاگ‌ها را برای آرشیو دانلود نمایید.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  دانلود نسخه پشتیبان (.json)
                </button>
              </div>

              {/* Restore block */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-blue-400 text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  بازیابی نسخه پشتیبان JSON (Restore)
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                  برای بازیابی، کافی است فایل پشتیبان دانلودی قبلی را انتخاب نمایید. این عمل کل داده‌های پایگاه داده فعلی را بازنشانی و جایگزین خواهد کرد.
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreBackup}
                    className="w-full bg-slate-950 border border-dashed border-slate-800 rounded-xl p-4 text-xs focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* Detailed Audit logs timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-slate-200 text-sm mb-4">آرشیو سایه‌نگار امنیتی سیستم (Audit Logs Timeline)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">کاربر</th>
                      <th className="pb-3">دسته‌بندی عملیات</th>
                      <th className="pb-3">متن شرح جزئیات</th>
                      <th className="pb-3 text-left">زمان ثبت لاگ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="py-3 font-bold">{log.user_email}</td>
                        <td className="py-3 text-amber-500 font-bold">{log.action}</td>
                        <td className="py-3 font-light text-slate-400">{log.details}</td>
                        <td className="py-3 text-left font-mono text-slate-500">
                          {new Date(log.created_at).toLocaleString('fa-IR')}
                        </td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          هیچ رویدادی تا کنون ثبت نگردیده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
