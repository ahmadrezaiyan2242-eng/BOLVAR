import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserPlus, Mail, Lock, Phone, User, AlertTriangle, CheckCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const { register, isRateLimited } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength assessment
  const [passRequirements, setPassRequirements] = useState({
    length: false,
    number: false,
    special: false,
  });

  const checkPasswordStrength = (pass: string) => {
    setPassRequirements({
      length: pass.length >= 8,
      number: /\d/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Rate Limit Check
    if (isRateLimited('register_action')) {
      setError('شما بیش از حد مجاز درخواست ارسال کرده‌اید. لطفا ۱ دقیقه دیگر مجددا تلاش کنید.');
      setIsSubmitting(false);
      return;
    }

    // Basic fields validation
    if (!formData.name || !formData.mobile || !formData.email || !formData.password) {
      setError('تکمیل تمامی فیلدهای ستاره‌دار الزامی است.');
      setIsSubmitting(false);
      return;
    }

    // Strong password policy validation
    if (!passRequirements.length || !passRequirements.number || !passRequirements.special) {
      setError('رمز عبور الزامات امنیتی را برآورده نمی‌کند.');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData.name, formData.mobile, formData.email, formData.password);
      setSuccess('حساب کاربری شما با موفقیت ایجاد گردید. در حال انتقال به پیشخوان...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (e: any) {
      setError(e.message || 'خطا در فرآیند ثبت‌نام. لطفا مجددا تلاش کنید.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-[#faf6f0] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-[#fdfbf7] border border-amber-500/10 rounded-2xl p-8 shadow-md text-right">
        
        {/* Header Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 rounded-full text-amber-600">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl text-slate-900 tracking-wide">عضویت در سامانه</h1>
          <p className="text-slate-500 text-xs font-light">به کانون طعم‌های مجلل و اصیل بلوار بپیوندید</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 pl-4 pr-11 text-slate-800 text-sm focus:outline-none transition-all text-right"
                placeholder="مثال: علیرضا رضایی"
              />
              <User className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">شماره همراه <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 pl-4 pr-11 text-slate-800 text-sm focus:outline-none transition-all text-left"
                placeholder="09123456789"
                dir="ltr"
              />
              <Phone className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

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

          {/* Password with strong requirements visualization */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">رمز عبور امن <span className="text-red-500">*</span></label>
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

            {/* Password Validation Requirements */}
            <div className="bg-slate-100 p-3 rounded-lg text-[10px] space-y-1.5 text-slate-500 font-medium">
              <p className="font-bold text-slate-700">الزامات رمز عبور ایمن:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <span className={passRequirements.length ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  {passRequirements.length ? '✓' : '✗'} حداقل ۸ کاراکتر
                </span>
                <span className={passRequirements.number ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  {passRequirements.number ? '✓' : '✗'} حداقل یک عدد
                </span>
                <span className={passRequirements.special ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  {passRequirements.special ? '✓' : '✗'} کاراکتر خاص (*،@)
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'در حال ایجاد حساب...' : 'ایجاد حساب کاربری'}
            </button>
          </div>

        </form>

        {/* Login Hint */}
        <div className="text-center mt-6 text-xs text-slate-500">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link to="/login" className="text-amber-600 hover:underline font-bold">
            ورود به حساب کاربری
          </Link>
        </div>

      </div>
    </div>
  );
};
