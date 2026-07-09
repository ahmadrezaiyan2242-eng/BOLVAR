import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart, HelpCircle, Phone, MapPin, Mail, ChevronDown, ChevronUp, Award, ShieldCheck, Clock } from 'lucide-react';

export const Home: React.FC = () => {
  const { settings } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="font-sans">
      
      {/* 1. HERO SLIDER SECTION MATCHING SCREENSHOT 1 */}
      <section className="relative h-[580px] overflow-hidden bg-slate-950 border-b border-amber-500/20">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.hero_image || 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200'} 
            alt="Boloar Restaurant Food" 
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/80"></div>
          {/* Authentic Persian Arabesque Background Pattern overlay */}
          <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-slate-900 to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-right space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-400 text-xs font-semibold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              افتخار ما، اصالت طعم ایرانیست
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-slate-100 leading-tight drop-shadow-md">
              {settings.hero_title || 'تجربه طعم اصیل ایرانی در بلوار'}
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-light">
              {settings.hero_subtitle || 'غذاهای لوکس و فضایی فاخر، تداعی‌گر میهمانی‌های اصیل شاهانه با لذیذترین مواد اولیه'}
            </p>

            {settings.is_kitchen_open === false && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex gap-3 items-start text-right max-w-xl">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5 animate-pulse"></span>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-red-400">آشپزخانه رستوران موقتاً تعطیل است</p>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-light">
                    پذیرش سفارش آنلاین جدید موقتاً متوقف شده است. شما می‌توانید جهت برنامه‌ریزی سفارش‌های آینده منو را بررسی نمایید.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                to="/menu" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-8 py-3.5 rounded-lg text-base font-bold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all"
              >
                مشاهده منو
              </Link>
              <Link 
                to="/about" 
                className="bg-slate-900/80 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/20 px-8 py-3.5 rounded-lg text-base font-bold transition-all"
              >
                داستان ما
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel indicators dots matching screenshot 1 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2.5 z-20" dir="ltr">
          <button className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400"></button>
          <button className="w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-amber-500/60 transition-colors"></button>
          <button className="w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-amber-500/60 transition-colors"></button>
          <button className="w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-amber-500/60 transition-colors"></button>
        </div>
      </section>

      {/* 4. KEY FEATURES (پیشاهنگ) MATCHING SCREENSHOT 1 */}
      <section className="py-20 bg-slate-950 text-slate-100 border-t border-b border-amber-500/20 relative overflow-hidden">
        {/* Absolute vector decorative bg */}
        <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl"></div>
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-16">
            <h2 className="font-display text-4xl text-amber-400 tracking-wide">پیشاهنگِ بلوار</h2>
            <p className="text-slate-400 text-sm">چرا میهمانان ما بلوار را انتخاب می‌کنند؟</p>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            {/* Feature 1 */}
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10 border border-amber-300/20 transform group-hover:rotate-6 transition-transform">
                <Heart className="w-8 h-8 text-slate-950" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">طعم اصیل</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                طبخ و آماده‌سازی غذاها بر اساس دستورالعمل‌های اصیل و تاریخی دربار قاجار و سفره‌های کهن ایرانی.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10 border border-amber-300/20 transform group-hover:-rotate-6 transition-transform">
                <Sparkles className="w-8 h-8 text-slate-950" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">فضای لوکس</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                میزبانی شایسته در تالارهای مجلل طلاکوب، مزین به گچ‌بری اسلیمی و آیینه‌کاری‌های چشم‌نواز شیراز.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10 border border-amber-300/20 transform group-hover:rotate-6 transition-transform">
                <Award className="w-8 h-8 text-slate-950" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">مواد اولیه مرغوب</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                استفاده انحصاری از برنج دمسیاه گیلان، زعفران قائنات خراسان و گوشت تازه بره دشت مغان.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10 border border-amber-300/20 transform group-hover:-rotate-6 transition-transform">
                <ShieldCheck className="w-8 h-8 text-slate-950" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">فرهنگ غنی</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                تکریم عالی و احترام عمیق به آیین کهن میهمان‌نوازی و سفره‌داری اصیل شرقی در شأن اساتید گرامی.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. DYNAMIC HOME FAQ SECTION */}
      <section className="py-20 bg-[#faf6f0] border-b border-amber-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
          
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">پاسخ به سوالات شما</span>
            <h2 className="font-display text-4xl text-slate-900 tracking-wide mt-2">پرسش‌های متداول میهمانان</h2>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'ساعت کاری رستوران سنتی و مدرن بلوار چگونه است؟',
                a: 'رستوران بلوار همه‌روزه از ساعت ۱۲:۰۰ ظهر الی ۲۳:۳۰ شب به صورت یکسره جهت پذیرایی حضوری و ثبت سفارش‌های بیرون‌بر فعال می‌باشد.'
              },
              {
                q: 'آیا برای برگزاری مجالس و میهمانی‌ها نیاز به رزرو قبلی هست؟',
                a: 'بله، استاد گرامی. برای برگزاری هرگونه همایش، مجلس خانوادگی، سورپرایز تولد یا قرارهای کاری رسمی در تالارهای شاهانه بلوار، توصیه می‌گردد حداقل ۴۸ ساعت قبل از طریق شماره تماس رسمی با پذیرش ما هماهنگی بفرمایید.'
              },
              {
                q: 'کیفیت برنج و مواد گوشتی استفاده شده در پخت غذاها چگونه تضمین می‌شود؟',
                a: 'ما در بلوار خود را متعهد به حفظ بالاترین استانداردهای کیفی می‌دانیم. تمامی کباب‌ها از راسته و فیله گوسفندی نر کشتار روز تهیه شده و برنج مصرفی رستوران نیز منحصراً برنج دمسیاه عطری شالیزارهای آستانه اشرفیه گیلان است.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-[#fdfbf7] border border-amber-500/10 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-right font-sans font-bold text-slate-900 hover:bg-amber-500/5 focus:outline-none"
                  >
                    <span className="text-sm sm:text-base flex items-center gap-2.5">
                      <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      {faq.q}
                    </span>
                    <span className="p-1.5 bg-amber-500/10 rounded-full text-amber-600 shrink-0 mr-4">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-light animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. DYNAMIC HOME CONTACT SECTION */}
      <section className="py-20 bg-slate-950 text-slate-100 relative overflow-hidden">
        <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-16">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">ارتباط مستقیم با مدیریت</span>
            <h2 className="font-display text-4xl text-amber-400 tracking-wide mt-2">تماس با ما</h2>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Quick Contact Info */}
            <div className="space-y-8 text-right order-last lg:order-first">
              <div className="space-y-4">
                <h3 className="font-sans text-2xl font-bold text-slate-100">رستوران لوکس بلوار</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  آماده شنیدن انتقادات، پیشنهادها و پاسخگویی به رزروهای خاص شما سروران گرامی هستیم. ما تلاش می‌کنیم تا بهترین تجربه غذا و پذیرایی را برای شما فراهم سازیم.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0 border border-amber-500/20">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">شماره‌های تماس و رزرو تلفنی</h4>
                    <p dir="ltr" className="text-lg font-bold text-amber-400 mt-1 text-right font-sans">
                      {settings.contact_phone || '۰۲۱-۱۲۳۴۵۶۷۸'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0 border border-amber-500/20">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">نشانی رستوران</h4>
                    <p className="text-slate-300 mt-1 text-xs sm:text-sm leading-relaxed">
                      {settings.contact_address || 'تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0 border border-amber-500/20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">ساعات پذیرایی</h4>
                    <p className="text-slate-300 mt-1 text-xs sm:text-sm">
                      همه‌روزه از ساعت ۱۲:۰۰ ظهر الی ۲۳:۳۰ شب
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated map & visuals */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 p-1 bg-slate-900 group">
              <div className="h-[300px] bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <MapPin className="w-12 h-12 text-amber-500 animate-bounce" />
                <h4 className="text-slate-100 font-bold text-base">موقعیت دقیق ما بر روی نقشه پایتخت</h4>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed font-light">
                  {settings.contact_address || 'تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲'}
                </p>
                <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-color-dodge pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600')` }}></div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
