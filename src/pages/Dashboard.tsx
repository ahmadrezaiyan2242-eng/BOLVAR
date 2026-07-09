import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { dbService } from '../supabase';
import { Order } from '../types';
import { User, Clock, Package, CheckCircle2, AlertCircle, RefreshCw, Eye } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const allOrders = await dbService.getOrders();
        // Filter orders belonging to the logged-in customer (matching email or mock customer id)
        const userOrders = allOrders.filter(
          o => o.customer_email?.toLowerCase() === user.email.toLowerCase() || o.user_id === user.id
        );
        setOrders(userOrders);
      } catch (e) {
        console.error('Error fetching orders:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  // Render Order status badges helper
  const renderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">در انتظار تایید</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">تایید شده</span>;
      case 'preparing':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">در حال پخت</span>;
      case 'ready_for_pickup':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">آماده تحویل</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">تحویل داده شد</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">لغو شده</span>;
      default:
        return null;
    }
  };

  const renderPaymentStatus = (payment_status: Order['payment_status']) => {
    return payment_status === 'paid' 
      ? <span className="text-emerald-600 font-bold">پرداخت شده</span>
      : <span className="text-amber-600 font-bold">پرداخت در محل</span>;
  };

  return (
    <div className="py-12 bg-[#faf6f0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top welcome profile bar */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 shadow-lg text-right">
          <div className="flex items-center gap-4 space-x-reverse">
            <div className="w-14 h-14 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg border border-amber-300/30">
              {user.full_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-sans">خوش آمدید، استاد {user.full_name}</h1>
              <p className="text-slate-400 text-xs mt-1">عضو خانواده اصیل بلوار با شماره همراه {user.mobile}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              خروج از حساب کاربری
            </button>
          </div>
        </div>

        {/* Main grid contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Order List (Lg: col-span-8) */}
          <div className="lg:col-span-8 space-y-6 text-right">
            <div className="bg-[#fdfbf7] border border-amber-500/10 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-sans border-r-2 border-amber-500 pr-3">تاریخچه سفارشات شما</h2>
              
              {isLoading ? (
                <div className="text-center py-12 text-slate-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                  در حال دریافت لیست سفارش‌ها...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
                  <button 
                    onClick={() => navigate('/menu')}
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition-all cursor-pointer"
                  >
                    همین حالا اولین سفارش را ثبت کنید
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-bold">
                        <th className="pb-4">شماره سفارش</th>
                        <th className="pb-4">تاریخ ثبت</th>
                        <th className="pb-4">زمان تحویل</th>
                        <th className="pb-4">مبلغ پرداختی</th>
                        <th className="pb-4 text-center">وضعیت</th>
                        <th className="pb-4 text-left">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-sans text-xs font-bold text-slate-800">#{order.id}</td>
                          <td className="py-4 text-xs text-slate-500">
                            {new Date(order.created_at).toLocaleDateString('fa-IR')}
                          </td>
                          <td className="py-4 text-xs text-slate-600">{order.pickup_time}</td>
                          <td className="py-4 font-sans text-xs font-bold text-amber-700">
                            {order.payable_amount.toLocaleString('fa-IR')} تومان
                          </td>
                          <td className="py-4 text-center">
                            {renderStatusBadge(order.status)}
                          </td>
                          <td className="py-4 text-left">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 hover:bg-amber-500/10 text-amber-600 rounded-lg transition-all"
                              title="مشاهده فاکتور"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Active Selected Order Modal/Detail card (Lg: col-span-4) */}
          <div className="lg:col-span-4 text-right">
            {selectedOrder ? (
              <div className="bg-[#fdfbf7] border-2 border-amber-500/20 rounded-2xl p-6 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    بستن جزئیات ×
                  </button>
                  <h3 className="font-bold text-slate-900 font-sans">فاکتور سفارش #{selectedOrder.id}</h3>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 space-x-reverse">
                        <span className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center font-bold font-sans text-slate-600">
                          {item.quantity}
                        </span>
                        <span className="font-bold text-slate-800">{item.name}</span>
                      </div>
                      <span className="font-sans font-semibold text-slate-500">
                        {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="border-t border-dashed border-slate-200 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">جمع اقلام:</span>
                    <span className="font-sans font-bold text-slate-700">{selectedOrder.total_amount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">مالیات و عوارض (۹٪):</span>
                    <span className="font-sans font-bold text-slate-700">{selectedOrder.tax_amount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-100 pt-2 font-bold">
                    <span className="text-slate-900">مبلغ قابل پرداخت:</span>
                    <span className="font-sans text-amber-700">{selectedOrder.payable_amount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>

                {/* Logistics */}
                <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 border border-slate-100 text-slate-600 leading-relaxed font-light">
                  <p>
                    <strong className="font-bold text-slate-800">تحویل‌گیرنده:</strong> {selectedOrder.customer_name} ({selectedOrder.customer_mobile})
                  </p>
                  <p>
                    <strong className="font-bold text-slate-800">زمان تحویل:</strong> {selectedOrder.pickup_time}
                  </p>
                  <p>
                    <strong className="font-bold text-slate-800">وضعیت پرداخت:</strong> {renderPaymentStatus(selectedOrder.payment_status)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-500/10 rounded-2xl p-6 text-center space-y-4">
                <Clock className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-bold text-slate-900 text-sm">پیگیری لحظه‌ای وضعیت</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  بر روی آیکون فاکتور در جدول روبرو کلیک کنید تا جزئیات کامل سفارش، اقلام سبد خرید، مالیات و نحوه تسویه فاکتور برای شما نمایش داده شود.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
