import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Phone, MapPin, Mail, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useApp();

  return (
    <footer className="bg-[#0b1220] text-slate-400 border-t-2 border-amber-500/40 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Col 1: About Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg border border-amber-300/30">
                <span className="font-display text-xl text-slate-950 font-bold">ب</span>
              </div>
              <span className="font-display text-2xl text-amber-400 font-bold tracking-wide">
                {settings.site_title || 'رستوران بلوار'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {settings.footer_text || 'غذاهای لوکس و فضایی فاخر، تداعی‌گر میهمانی‌های اصیل شاهانه در رستوران بلوار با بهترین مواد اولیه.'}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="font-display text-lg text-amber-400 font-bold mb-5 border-r-2 border-amber-500 pr-3">
              دسترسی سریع
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors block">صفحه اصلی</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors block">منو غذاها</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors block">درباره ما</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors block">پرسش‌های متداول</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact details matching the mockup style */}
          <div>
            <h3 className="font-display text-lg text-amber-400 font-bold mb-5 border-r-2 border-amber-500 pr-3">
              آدرس و تماس
            </h3>
            <ul className="space-y-4 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.contact_address || 'تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span dir="ltr" className="hover:text-white transition-colors">
                  {settings.contact_phone || '+98 123357397'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="hover:text-white transition-colors">{settings.contact_email || 'info@boloar.ir'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-amber-500 shrink-0" />
                <span dir="ltr" className="hover:text-white transition-colors">www.boloar.ir</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-slate-800/80 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>
            حقوق مادی و معنوی این تارنما محفوظ و متعلق به رستوران سنتی و مدرن بلوار می‌باشد. © ۲۰۲۶
          </p>
          <p className="mt-2 sm:mt-0 font-mono text-amber-600/60">
            CRAFTED WITH SOUL BY ARSHAM
          </p>
        </div>

      </div>
    </footer>
  );
};
