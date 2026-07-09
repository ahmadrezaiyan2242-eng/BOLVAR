import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Clock, Heart, Sparkles, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="py-16 bg-[#faf6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-amber-600 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            روایتی شنیدنی از تالار طعم‌های ماندگار
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-slate-900 tracking-wide">داستان رستوران بلوار</h1>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text block */}
          <div className="space-y-6 text-right">
            <h2 className="text-2xl font-bold text-slate-950 font-sans">تعهد ما به اصالت و آیین مهمان‌نوازی</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              {settings.about_text || 'رستوران بلوار از سال ۱۳۸۸ با تکیه بر اصالت گران‌بهای ایرانی، لذیذترین غذاهای سنتی را با استفاده از مرغوب‌ترین مواد اولیه و در فضایی مجلل و شاهانه ارائه می‌دهد. هنر سرآشپزان ما، تلفیق روش‌های پخت کهن با دانش نوین پذیرایی است تا خاطره‌ای ناب و لذت‌بخش را بر دل و جان میهمانان عزیزمان بنشانیم.'}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              در طبخ کباب‌ها، تنها از راسته گوسفندی اعلاء و زعفران خالص قائنات استفاده می‌گردد. برنج ما دمسیاه معطر شالیزارهای آستانه اشرفیه است که به شیوه سنتی کته و با کره خالص محلی پخت می‌شود. هر قاشق از غذاهای بلوار، گویی سفری است به اعماق تاریخ و فرهنگ پر تبار آشپزی ایرانی.
            </p>

            {/* Values badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-amber-500/10">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-sm">مرغوب‌ترین مواد</h4>
                  <p className="text-xs text-slate-500 mt-1">تهیه مواد اولیه مرغوب از مزارع و کشتارگاه‌های معتمد کشور.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-amber-500/10">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-sm">طبخ با عشق و هنر</h4>
                  <p className="text-xs text-slate-500 mt-1">آمیختن عشق و تعهد با دستان سرآشپزان زبده کشور.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Block */}
          <div className="relative">
            <div className="aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src={settings.about_image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'} 
                alt="داخل رستوران بلوار" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Embedded details */}
            <div className="absolute -bottom-6 -right-6 bg-slate-950 text-white p-6 rounded-xl border border-amber-500/30 hidden sm:block max-w-xs shadow-xl">
              <p className="font-display text-lg text-amber-400 mb-1">تلفن رزرو و تماس</p>
              <p className="text-slate-400 text-xs mb-3">برای پذیرایی از میهمانی‌ها و مجالس رسمی شما در فضایی فاخر</p>
              <p className="text-xl font-bold font-mono text-amber-500 text-left" dir="ltr">
                {settings.contact_phone || '+98 123357397'}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline/History Details */}
        <div className="bg-slate-950 text-slate-100 rounded-2xl p-8 sm:p-12 border border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
            <h3 className="font-display text-2xl text-amber-400">آیین سفره‌داری سنتی در دوران مدرن</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              افتخار ما این است که محیطی آرام و اصیل را برای خانواده‌های ایرانی و دوستداران فرهنگ این سرزمین فراهم ساخته‌ایم. همواره کوشیده‌ایم تا میزبانیِ گرم، احترام عمیق و طعم‌های ناب ایرانی را بدون کوچک‌ترین سازش حفظ نماییم.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 pt-4">
              <div className="text-center">
                <span className="block text-3xl font-display text-amber-400">۱۵+</span>
                <span className="text-xs text-slate-400 mt-1 block">سال سابقه درخشان</span>
              </div>
              <div className="w-px h-10 bg-slate-800 hidden sm:block"></div>
              <div className="text-center">
                <span className="block text-3xl font-display text-amber-400">۱۰۰٪</span>
                <span className="text-xs text-slate-400 mt-1 block">برنج دمسیاه ایرانی</span>
              </div>
              <div className="w-px h-10 bg-slate-800 hidden sm:block"></div>
              <div className="text-center">
                <span className="block text-3xl font-display text-amber-400">۴۵+</span>
                <span className="text-xs text-slate-400 mt-1 block">پرسنل مجرب و آموزش‌دیده</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
