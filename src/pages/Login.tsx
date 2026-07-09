import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, Mail, Lock, AlertTriangle, Sparkles, CheckCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isRateLimited } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Rate limiting check
    if (isRateLimited(`login_attempt_${formData.email}`)) {
      setError('شما بیش از حد مجاز تلاش کرده‌اید. لطفا ۱ دقیقه دیگر مجددا تلاش کنید.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email || !formData.password) {
      setError('لطفا ایمیل و رمز عبور خود را وارد نمایید.');
      setIsSubmitting(false);
      return;
    }

    try {
      const profile = await login(formData.email, formData.password);
      setSuccess(`خوش آمدید استاد گرامی ${profile.full_name}. ورود موفقیت‌آمیز بود.`);
      setTimeout(() => {
        if (profile.role === 'SuperAdmin' || profile.role === 'Admin' || profile.role === 'Staff') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (e: any) {
      setError(e.message || 'خطا در ورود به حساب کاربری. لطفا مجددا تلاش کنید.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-[#faf6f0] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-[#fdfbf7] border border-amber-500/10 rounded-2xl p-8 shadow-md text-right">
        
        {/* Header Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 rounded-full text-amber-600">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl text-slate-900 tracking-wide">ورود به حساب کاربری</h1>
          <p className="text-slate-500 text-xs font-light">به کانون طعم‌های مجلل و اصیل بلوار خوش آمدید</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-xs font-semibold leading-relaxed">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-xs font-semibold leading-relaxed">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">پست الکترونیکی <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 pl-4 pr-11 text-slate-800 text-sm focus:outline-none transition-all text-left"
                placeholder="email@example.com"
                dir="ltr"
              />
              <Mail className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">رمز عبور <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 pl-4 pr-11 text-slate-800 text-sm focus:outline-none transition-all text-left"
                placeholder="••••••••"
                dir="ltr"
              />
              <Lock className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? 'در حال تایید هویت...' : 'ورود به حساب کاربری'}
            </button>
          </div>

        </form>

        {/* Register Hint */}
        <div className="text-center mt-6 text-xs text-slate-500 space-y-2">
          <p>
            کاربر جدید هستید؟{' '}
            <Link to="/register" className="text-amber-600 hover:underline font-bold">
              عضویت و ایجاد حساب کاربری
            </Link>
          </p>
          <p className="text-[10px] text-slate-400">
            رمز پیش‌فرض مدیرکل: <code className="bg-slate-100 p-0.5 rounded font-mono">ahmadrezaiyan2242@gmail.com</code> رمز <code className="bg-slate-100 p-0.5 rounded font-mono">Boloar@1405</code>
          </p>
        </div>

      </div>
    </div>
  );
};
