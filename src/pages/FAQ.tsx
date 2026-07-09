import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: 'ساعت کاری رستوران سنتی و مدرن بلوار چگونه است؟',
      a: 'رستوران بلوار همه‌روزه از ساعت ۱۲:۰۰ ظهر الی ۲۳:۳۰ شب به صورت یکسره جهت پذیرایی حضوری و ثبت سفارش‌های بیرون‌بر فعال می‌باشد.',
    },
    {
      q: 'آیا برای برگزاری مجالس و میهمانی‌ها نیاز به رزرو قبلی هست؟',
      a: 'بله، استاد گرامی. برای برگزاری هرگونه همایش، مجلس خانوادگی، سورپرایز تولد یا قرارهای کاری رسمی در تالارهای شاهانه بلوار، توصیه می‌گردد حداقل ۴۸ ساعت قبل از طریق شماره تماس رسمی با پذیرش ما هماهنگی بفرمایید.',
    },
    {
      q: 'کیفیت برنج و مواد گوشتی استفاده شده در پخت غذاها چگونه تضمین می‌شود؟',
      a: 'ما در بلوار خود را متعهد به حفظ بالاترین استانداردهای کیفی می‌دانیم. تمامی کباب‌ها از راسته و فیله گوسفندی نر کشتار روز تهیه شده و برنج مصرفی رستوران نیز منحصراً برنج دمسیاه عطری شالیزارهای آستانه اشرفیه گیلان است.',
    },
    {
      q: 'محدوده ارسال سفارش‌های تلفنی و آنلاین تا کجاست؟',
      a: 'ارسال غذاها از طریق پیک مجهز به جعبه گرمایشی (جهت حفظ دمای مطلوب غذا) در محدوده ونک، ولیعصر، گاندی، توانیر و جردن به صورت رایگان انجام می‌گردد. برای سایر مناطق تهران ارسال از طریق اسنپ‌باکس با هزینه مشتری گرامی مقدور است.',
    },
    {
      q: 'چرا گزینه پرداخت آنلاین در بخش خرید غیرفعال است؟',
      a: 'به منظور ارتقای امنیت درگاه‌ها و اتمام تست‌های امنیتی بانک مرکزی، پرداخت آنلاین به زودی فعال خواهد شد. در حال حاضر سفارش‌های شما به صورت پرداخت در محل (کارتخوان سیار یا نقدی) یا سفارش تلفنی نهایی می‌گردند.',
    }
  ];

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="py-16 bg-[#faf6f0] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-amber-600 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            پاسخگویی شایسته به ابهامات اساتید گرامی
          </div>
          <h1 className="font-display text-4xl text-slate-900 tracking-wide">پرسش‌های متداول</h1>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
        </div>

        {/* Collapsible FAQ List */}
        <div className="space-y-4 text-right">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-[#fdfbf7] border border-amber-500/10 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
              >
                {/* Header */}
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-right font-sans font-bold text-slate-900 hover:bg-slate-50 focus:outline-none"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <span className="p-1.5 bg-amber-500/10 rounded-full text-amber-600 shrink-0 mr-4">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {/* Body Content */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
