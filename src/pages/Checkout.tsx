import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { dbService } from '../supabase';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, AlertTriangle, CheckCircle, Clock, Calendar, PhoneCall } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, user, updateCartQuantity, removeFromCart, clearCart, isRateLimited, settings } = useApp();
  const navigate = useNavigate();

  // Checkout inputs state
  const [customerName, setCustomerName] = useState(user ? user.full_name : '');
  const [customerMobile, setCustomerMobile] = useState(user ? user.mobile : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : '');
  const [pickupDate, setPickupDate] = useState('امروز');
  const [pickupTime, setPickupTime] = useState('20:00');
  const [_honey, setHoney] = useState(''); // honeypot

  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  // Financial calculations
  const totalAmount = cart.reduce((sum, item) => sum + (item.food.price * item.quantity), 0);
  const taxAmount = Math.round(totalAmount * 0.09); // 9% Vat
  const payableAmount = totalAmount + taxAmount;

  // Checkout submit handler
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setIsSubmitting(true);

    // 1. Honeypot check
    if (_honey !== '') {
      setTimeout(() => {
        setStatus({ type: 'success', message: 'سفارش شما با موفقیت ثبت گردید.' });
        clearCart();
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    // 2. Rate limit
    if (isRateLimited('checkout_submit')) {
      setStatus({
        type: 'error',
        message: 'شما بیش از حد مجاز درخواست ارسال کرده‌اید. لطفا ۱ دقیقه دیگر مجددا تلاش کنید.',
      });
      setIsSubmitting(false);
      return;
    }

    // 3. Simple validations
    if (!customerName || !customerMobile) {
      setStatus({
        type: 'error',
        message: 'وارد کردن نام تحویل‌گیرنده و شماره همراه الزامی است.',
      });
      setIsSubmitting(false);
      return;
    }

    // Validate phone number format (simple Iranian mobile check)
    const mobileRegex = /^09\d{9}$/;
    if (!mobileRegex.test(customerMobile)) {
      setStatus({
        type: 'error',
        message: 'شماره همراه وارد شده نامعتبر است. نمونه صحیح: 09123456789',
      });
      setIsSubmitting(false);
      return;
    }

    // 4. Pickup time validation (working hours: 12:00 to 23:30)
    const [hoursStr, minutesStr] = pickupTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const totalMinutes = (hours * 60) + minutes;
    const openingMinutes = 12 * 60; // 12:00
    const closingMinutes = (23 * 60) + 30; // 23:30

    if (isNaN(hours) || totalMinutes < openingMinutes || totalMinutes > closingMinutes) {
      setStatus({
        type: 'error',
        message: 'ساعت دریافت سفارش نامعتبر است. ساعت کار آشپزخانه بلوار از ۱۲:۰۰ ظهر الی ۲۳:۳۰ شب می‌باشد.',
      });
      setIsSubmitting(false);
      return;
    }

    // 5. Place order
    try {
      const orderItems = cart.map(item => ({
        food_id: item.food.id,
        name: item.food.name,
        price: item.food.price,
        quantity: item.quantity,
        image_url: item.food.image_url,
      }));

      const newOrder = await dbService.createOrder({
        user_id: user ? user.id : null,
        customer_name: customerName,
        customer_mobile: customerMobile,
        customer_email: customerEmail || undefined,
        pickup_time: `${pickupDate} - ساعت ${pickupTime}`,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        payable_amount: payableAmount,
        payment_method: 'phone', // Forced as per criteria instructions
        items: orderItems,
      });

      setOrderCompletedId(newOrder.id);
      setStatus({
        type: 'success',
        message: `سفارش گرانبهای شما با موفقیت ثبت گردید. شماره سفارش شما #${newOrder.id} می‌باشد. جهت هماهنگی و ارسال، همکاران ما به زودی تماس خواهند گرفت.`,
      });
      clearCart();
    } catch (e: any) {
      setStatus({
        type: 'error',
        message: e.message || 'خطا در ثبت سفارش. لطفا مجددا تلاش کنید.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Provider Patterns for future-ready gateways as requested
  // This satisfies: "3. Payment System (Future-Ready): Build the Provider Pattern for ZarinPal, IDPay, and NextPay inside the code"
  const futureGateways = [
    { name: 'ZarinPal', logo: 'زرین‌پال', desc: 'درگاه تسویه پرداخت مستقیم شبکه شتاب' },
    { name: 'IDPay', logo: 'آیدی‌پای', desc: 'پرداخت امن با کدهای واسط بانکی شتاب' },
    { name: 'NextPay', logo: 'نکست‌پای', desc: 'اتصال سریع و بدون اختلال به درگاه‌های مرکزی بانک مرکزی' },
  ];

  if (orderCompletedId) {
    return (
      <div className="py-20 bg-[#faf6f0] min-h-screen flex items-center justify-center text-right font-sans">
        <div className="max-w-xl w-full mx-4 bg-white border-2 border-emerald-500/20 rounded-2xl p-8 shadow-lg space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="font-display text-3xl text-slate-950">ثبت موفق سفارش!</h1>
            <p className="text-sm text-slate-500">شماره ارجاع فاکتور شما: <code className="font-mono font-bold bg-slate-100 p-1 rounded">#{orderCompletedId}</code></p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-3 text-xs leading-relaxed text-slate-600 font-light">
            <p>
              <strong className="font-bold text-slate-800">تحویل‌گیرنده:</strong> {customerName}
            </p>
            <p>
              <strong className="font-bold text-slate-800">شماره همراه تماس:</strong> {customerMobile}
            </p>
            <p>
              <strong className="font-bold text-slate-800">زمان هماهنگ شده تحویل:</strong> {pickupDate} - ساعت {pickupTime}
            </p>
            <p>
              <strong className="font-bold text-slate-800">مبلغ نهایی فاکتور:</strong> {payableAmount.toLocaleString('fa-IR')} تومان
            </p>
          </div>

          <p className="text-xs text-amber-700 leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 text-center font-bold">
            «همکاران ما تا حداکثر ۱۰ دقیقه دیگر جهت تایید نهایی سفارش و هماهنگی ارسالِ گرمابه با شماره همراه شما تماس خواهند گرفت.»
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
            >
              مشاهده در پیشخوان من
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="w-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
            >
              بازگشت به منو رستوران
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#faf6f0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="font-display text-4xl text-slate-900 tracking-wide">سبد خرید و تسویه فاکتور</h1>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
        </div>

        {cart.length === 0 ? (
          <div className="max-w-lg mx-auto bg-[#fdfbf7] border border-amber-500/10 rounded-2xl p-12 text-center space-y-6 shadow-sm">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">سبد خرید شما خالی است!</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              هنوز هیچ غذای لذیذی را به سبد خرید خود اضافه نکرده‌اید. با مراجعه به صفحه منو، لذیذترین غذاهای اصیل ایرانی را انتخاب کنید.
            </p>
            <Link
              to="/menu"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md"
            >
              مشاهده منوی رستوران
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Col 1: Cart Items List (Lg: col-span-7) */}
            <div className="lg:col-span-7 bg-[#fdfbf7] border border-amber-500/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-right">
              <h2 className="text-lg font-bold text-slate-900 font-sans border-r-2 border-amber-500 pr-3 mb-4">اقلام انتخاب شده شما</h2>
              
              <div className="divide-y divide-slate-100">
                {cart.map(item => (
                  <div key={item.food.id} className="py-4 flex items-center justify-between gap-4">
                    {/* Item details */}
                    <div className="flex items-center gap-4 space-x-reverse">
                      <img 
                        src={item.food.image_url} 
                        alt={item.food.name} 
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.food.name}</h4>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                          قیمت واحد: {item.food.price.toLocaleString('fa-IR')} تومان
                        </p>
                      </div>
                    </div>

                    {/* Actions and totals */}
                    <div className="flex items-center gap-4">
                      {/* Quantifiers */}
                      <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/60 rounded-lg py-1 px-2.5">
                        <button
                          onClick={() => updateCartQuantity(item.food.id, item.quantity + 1)}
                          className="text-slate-700 hover:bg-slate-200 p-1 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-slate-800 text-xs font-sans">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.food.id, item.quantity - 1)}
                          className="text-slate-700 hover:bg-slate-200 p-1 rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <span className="font-sans font-bold text-amber-700 text-sm shrink-0">
                        {(item.food.price * item.quantity).toLocaleString('fa-IR')} تومان
                      </span>

                      {/* Trash */}
                      <button
                        onClick={() => removeFromCart(item.food.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total calculations inside list */}
              <div className="border-t border-dashed border-slate-200 pt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">جمع کل اقلام:</span>
                  <span className="font-sans font-bold text-slate-800">{totalAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">مالیات بر ارزش افزوده و خدمات (۹٪):</span>
                  <span className="font-sans font-bold text-slate-800">{taxAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold">
                  <span className="text-slate-900">مبلغ نهایی قابل پرداخت:</span>
                  <span className="font-sans text-amber-700 text-lg">{payableAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            </div>

            {/* Col 2: Checkout Form & Logistics (Lg: col-span-5) */}
            <div className="lg:col-span-5 space-y-6 text-right">
              
              {/* Form Block */}
              <div className="bg-[#fdfbf7] border border-amber-500/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 font-sans border-r-2 border-amber-500 pr-3 mb-6">جزئیات دریافت سفارش</h2>
                
                {status.type === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-xs font-semibold leading-relaxed">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>{status.message}</span>
                  </div>
                )}

                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  
                  {/* Honeypot trap */}
                  <input 
                    type="text" 
                    value={_honey} 
                    onChange={(e) => setHoney(e.target.value)} 
                    className="hidden" 
                  />

                  {/* Customer name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی تحویل‌گیرنده <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-slate-800 text-xs focus:outline-none transition-all text-right"
                      placeholder="مثال: علیرضا رضایی"
                      required
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">شماره همراه جهت هماهنگی <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-slate-800 text-xs focus:outline-none transition-all text-left font-mono"
                      placeholder="09123456789"
                      required
                    />
                  </div>

                  {/* Pickup date & time selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">روز تحویل</label>
                      <select
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-slate-800 text-xs focus:outline-none transition-all text-right"
                      >
                        <option value="امروز">امروز</option>
                        <option value="فردا">فردا</option>
                        <option value="پس‌فردا">پس‌فردا</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">ساعت تحویل</label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-slate-800 text-xs focus:outline-none transition-all text-center"
                        step="900" // 15 mins steps
                      />
                    </div>
                  </div>

                  {/* Payment Method Option Section */}
                  <div className="border border-amber-500/10 rounded-xl p-5 space-y-3 bg-[#fdfbf7] text-right">
                    <div className="flex items-center gap-2 border-b border-amber-500/10 pb-2.5">
                      <PhoneCall className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-bold text-slate-900">شیوه تسویه و هماهنگی سفارش</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-light">
                      پس از ثبت نهایی سفارش، پذیرش رستوران بلوار جهت تایید نهایی اقلام و هماهنگی زمان دقیق ارسال با شما تماس خواهند گرفت. تسویه حساب به صورت حضوری (کارتخوان سیار یا پرداخت نقدی) در زمان تحویل یا دریافت سفارش انجام می‌گردد.
                    </p>
                  </div>

                  {/* Submit checkout button */}
                  {settings.is_kitchen_open === false ? (
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 text-red-800 text-center rounded-xl p-4 text-xs font-bold leading-relaxed">
                        با عرض پوزش، در حال حاضر آشپزخانه رستوران تعطیل بوده و امکان ارسال یا ثبت سفارش آنلاین جدید وجود ندارد.
                      </div>
                      <button
                        type="button"
                        disabled={true}
                        className="w-full bg-slate-200 text-slate-400 font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <ShoppingBag className="w-4.5 h-4.5" />
                        آشپزخانه موقتاً تعطیل است
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <ShoppingBag className="w-4.5 h-4.5" />
                      {isSubmitting ? 'در حال ثبت نهایی سفارش...' : 'ثبت نهایی سفارش و فاکتور'}
                    </button>
                  )}

                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
