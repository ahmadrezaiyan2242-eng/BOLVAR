import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Flame, Soup, UtensilsCrossed, Salad, CakeSlice, CupSoda, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';

export const Menu: React.FC = () => {
  const { foods, categories, cart, addToCart, updateCartQuantity, settings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find quantity of food in cart
  const getCartQty = (foodId: string) => {
    const item = cart.find(c => c.food.id === foodId);
    return item ? item.quantity : 0;
  };

  // Filter foods by category and search query
  const filteredFoods = foods.filter(food => {
    const matchesCategory = selectedCategory === 'all' || food.category_id === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          food.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && food.is_available;
  });

  // Custom icon renderer helper
  const renderCatIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Soup': return <Soup className="w-4 h-4" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4" />;
      case 'Salad': return <Salad className="w-4 h-4" />;
      case 'CakeSlice': return <CakeSlice className="w-4 h-4" />;
      case 'CupSoda': return <CupSoda className="w-4 h-4" />;
      default: return <UtensilsCrossed className="w-4 h-4" />;
    }
  };

  return (
    <div className="py-12 bg-[#faf6f0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {settings.is_kitchen_open === false && (
          <div className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-200/60 max-w-2xl mx-auto flex gap-3 items-start text-right">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 mt-1.5 animate-pulse"></span>
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-800">پذیرش سفارش موقتاً غیرفعال است</p>
              <p className="text-xs text-red-600/95 leading-relaxed font-light">
                مشتریان گرامی، به علت تعطیلی موقت آشپزخانه یا تغییر ساعات کاری، امکان ثبت سفارش آنلاین جدید وجود ندارد. شما می‌توانید منو را بررسی نمایید اما سبد خرید موقتاً غیرفعال می‌باشد.
              </p>
            </div>
          </div>
        )}
        
        {/* Banner Title */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-amber-600 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            سفره‌ای به رنگ اصالت و طعم‌های خاطره‌ساز
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-slate-900 tracking-wide">منوی اصیل رستوران بلوار</h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            تمامی غذاها توسط سرآشپزان زبده با استفاده از مرغوب‌ترین مواد اولیه ایرانی روزانه طبخ و با احترام تقدیم اساتید گرامی می‌گردد.
          </p>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
        </div>

        {/* Search Bar matching screenshot 4 */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو در غذاها، خورش‌ها، کباب‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 placeholder-slate-400 pl-4 pr-12 py-4 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none shadow-sm focus:ring-1 focus:ring-amber-500 text-right text-sm font-medium transition-all"
            />
            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            همه موارد
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {renderCatIcon(cat.icon)}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Food Items Grid with Quantifiers matching screenshots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map(food => {
            const qty = getCartQty(food.id);
            return (
              <div 
                key={food.id}
                className="bg-[#fdfbf7] rounded-xl overflow-hidden border border-amber-500/10 hover:border-amber-500/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Food Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                  <img 
                    src={food.image_url} 
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
                    {food.price.toLocaleString('fa-IR')} تومان
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 flex flex-col flex-grow text-right justify-between">
                  <div>
                    <h3 className="font-sans text-base font-bold text-slate-900 mb-1.5">{food.name}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4 font-light">
                      {food.description}
                    </p>
                  </div>

                  {/* Quantifier/Cart Actions Area matching screenshots exactly */}
                  <div className="pt-2">
                    {settings.is_kitchen_open === false ? (
                      <div className="w-full text-center py-2.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold font-sans">
                        آشپزخانه موقتاً تعطیل است
                      </div>
                    ) : qty > 0 ? (
                      <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg py-1.5 px-3">
                        <button
                          onClick={() => updateCartQuantity(food.id, qty + 1)}
                          className="text-amber-700 hover:bg-amber-100 p-1.5 rounded transition-all focus:outline-none"
                          title="افزودن"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-slate-800 text-sm font-sans">{qty.toLocaleString('fa-IR')}</span>
                        <button
                          onClick={() => updateCartQuantity(food.id, qty - 1)}
                          className="text-amber-700 hover:bg-amber-100 p-1.5 rounded transition-all focus:outline-none"
                          title="کاهش"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(food, 1)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 py-2.5 rounded-lg text-xs font-bold transition-all hover:shadow-md cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        افزودن به سبد خرید
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredFoods.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 mt-6">
            <p className="text-slate-500 text-base">غذایی متناسب با فیلتر یا جستجوی شما یافت نشد.</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 text-sm text-amber-600 font-bold hover:underline"
            >
              پاک کردن همه فیلترها
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
