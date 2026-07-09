import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../supabase';
import { Phone, MapPin, Mail, Send, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

export const Contact: React.FC = () => {
  const { settings, isRateLimited } = useApp();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    _username_honey: '', // HONEYPOT FIELD (must remain empty!)
  });

  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    // 1. HONEYPOT ACTION
    if (formData._username_honey !== '') {
      // Robot detected! Play dumb, pretend it worked, but do nothing.
      setTimeout(() => {
        setStatus({
          type: 'success',
          message: 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم.',
        });
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    // 2. RATE LIMIT CHECK (Action key: contact_form_submit)
    if (isRateLimited('contact_form_submit')) {
      setStatus({
        type: 'error',
        message: 'شما بیش از حد مجاز تلاش کرده‌اید. لطفا ۱ دقیقه دیگر مجددا تلاش کنید.',
      });
      setIsSubmitting(false);
      return;
    }

    // 3. VALIDATION
    if (!formData.name || !formData.phone || !formData.message) {
      setStatus({
        type: 'error',
        message: 'تکمیل تمامی فیلدهای ستاره‌دار الزامی است.',
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate sending message (since Cloudflare pages is static)
    setTimeout(() => {
      // Save Audit Log
      dbService.addAuditLog(
        formData.email || 'ناشناس',
        'ارسال فرم تماس با ما',
        `ارسال پیام توسط ${formData.name} به شماره ${formData.phone}`
      );

      setStatus({
        type: 'success',
        message: 'پیام شما با موفقیت به پیشخوان مدیریت بلوار ارسال شد. سپاسگزار همراهی شما هستیم.',
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        _username_honey: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="py-16 bg-[#faf6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-amber-600 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            منتظر حضور پرمهر و شنیدن نظرات ارزشمند شما هستیم
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-slate-900 tracking-wide">ارتباط با رستوران بلوار</h1>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Area (Lg: col-span-7) */}
          <div className="lg:col-span-7 bg-[#fdfbf7] border border-amber-500/10 rounded-2xl p-8 shadow-sm text-right">
            <h2 className="text-xl font-bold text-slate-900 mb-6 font-sans">پیام خود را برای مدیریت ارسال فرمایید</h2>
            
            {status.type === 'success' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm font-medium">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            {status.type === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* HONEYPOT - HIDDEN FROM NORMAL USER */}
              <div className="hidden">
                <input 
                  type="text" 
                  name="_username_honey" 
                  value={formData._username_honey} 
                  onChange={handleChange} 
                  autoComplete="off" 
                  placeholder="Do not fill this" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 text-slate-800 text-sm focus:outline-none transition-all text-right"
                    placeholder="مثال: علیرضا رضایی"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">شماره همراه <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 text-slate-800 text-sm focus:outline-none transition-all text-left"
                    dir="ltr"
                    placeholder="09123456789"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">پست الکترونیکی (اختیاری)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 text-slate-800 text-sm focus:outline-none transition-all text-left"
                  dir="ltr"
                  placeholder="name@domain.com"
                />
              </div>

              {/* Message text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">متن پیام یا درخواست <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 text-slate-800 text-sm focus:outline-none transition-all text-right resize-none"
                  placeholder="پیام خود را وارد نمایید..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'در حال ارسال پیام...' : 'ارسال فرم تماس'}
                </button>
              </div>

            </form>
          </div>

          {/* Contact Information Cards (Lg: col-span-5) */}
          <div className="lg:col-span-5 space-y-6 text-right">
            
            {/* Info Card */}
            <div className="bg-[#fdfbf7] border border-amber-500/10 rounded-2xl p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-sans border-r-2 border-amber-500 pr-3">اطلاعات رسمی بلوار</h2>
              
              <ul className="space-y-6 text-sm">
                
                {/* Phone */}
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">تلفن‌های تماس مستقیم و رزرو</h4>
                    <p dir="ltr" className="text-base font-bold text-amber-600 mt-1 text-right">
                      {settings.contact_phone || '+98 123357397'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">پذیرش سفارشات تلفنی و رزرو ناهار و شام</p>
                  </div>
                </li>

                {/* Address */}
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">نشانی فیزیکی رستوران</h4>
                    <p className="text-slate-600 mt-1 leading-relaxed text-xs">
                      {settings.contact_address || 'تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲'}
                    </p>
                  </div>
                </li>

                {/* Email */}
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">مکاتبات الکترونیکی</h4>
                    <p className="text-slate-600 mt-1 font-mono text-xs">{settings.contact_email || 'info@boloar.ir'}</p>
                  </div>
                </li>

              </ul>
            </div>

            {/* Simulated Map Container with gorgeous Persian background matching screenshots */}
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-1 overflow-hidden relative group">
              <div className="h-60 bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <MapPin className="w-10 h-10 text-amber-500 animate-bounce" />
                <h4 className="text-slate-100 font-bold text-sm">لوکیشن دقیق روی نقشه</h4>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  تهران، خیابان ولیعصر، نرسیده به میدان ونک، کوچه یاس
                </p>
                <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-color-dodge pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600')` }}></div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
