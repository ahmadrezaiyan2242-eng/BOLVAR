import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, User, LogOut, Shield, Menu, X, Coffee, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, cart, logout, settings } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Total quantity of items in cart
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] text-slate-100 shadow-xl border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Right Side: Logo & Main Navigation (Persian RTL) */}
          <div className="flex items-center space-x-reverse space-x-4 sm:space-x-8">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-3 group">
              {/* Premium Arabesque Graphic Asset */}
              <div className="relative w-8 h-8 sm:w-11 sm:h-11 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-300/30 transform group-hover:rotate-12 transition-transform duration-300 shrink-0">
                <span className="font-display text-base sm:text-2xl text-slate-950 font-bold">ب</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm sm:text-2xl tracking-wide text-amber-400 font-bold transition-colors group-hover:text-amber-300 leading-tight">
                  {settings.site_title || 'بلوار'}
                </span>
                <span className="text-[9px] text-amber-500/70 font-medium tracking-widest -mt-1 font-sans hidden sm:block">B O L O A R</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-x-6 text-sm font-medium">
              <Link 
                to="/" 
                className={`transition-colors py-2 relative group ${isActive('/') ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
              >
                خانه
                <span className={`absolute bottom-0 right-0 h-0.5 bg-amber-500 transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link 
                to="/menu" 
                className={`transition-colors py-2 relative group ${isActive('/menu') ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
              >
                منو رستوران
                <span className={`absolute bottom-0 right-0 h-0.5 bg-amber-500 transition-all duration-300 ${isActive('/menu') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link 
                to="/about" 
                className={`transition-colors py-2 relative group ${isActive('/about') ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
              >
                درباره ما
                <span className={`absolute bottom-0 right-0 h-0.5 bg-amber-500 transition-all duration-300 ${isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link 
                to="/contact" 
                className={`transition-colors py-2 relative group ${isActive('/contact') ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
              >
                تماس با ما
                <span className={`absolute bottom-0 right-0 h-0.5 bg-amber-500 transition-all duration-300 ${isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link 
                to="/faq" 
                className={`transition-colors py-2 relative group ${isActive('/faq') ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
              >
                پرسش‌های متداول
                <span className={`absolute bottom-0 right-0 h-0.5 bg-amber-500 transition-all duration-300 ${isActive('/faq') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            </nav>
          </div>

          {/* Left Side: Cart & User Account Options */}
          <div className="flex items-center space-x-reverse space-x-2 sm:space-x-4">
            
            {/* Cart Button */}
            <Link 
              to="/checkout" 
              className="relative p-2 sm:p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-full transition-all duration-200 border border-slate-700 flex items-center justify-center group shrink-0"
              id="cart-header-btn"
            >
              <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-amber-500 text-slate-950 font-bold text-[10px] sm:text-xs w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Profile / Admin / Login dropdown */}
            {user ? (
              <div className="flex items-center space-x-reverse space-x-1.5 sm:space-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:px-3 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 text-xs sm:text-sm text-slate-200 hover:text-amber-400 transition-colors shrink-0"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  <span className="hidden xl:inline font-medium">{user.full_name}</span>
                  <span className="xl:hidden font-medium">حساب من</span>
                </Link>

                {/* Quick Link to Admin Panel if authorized */}
                {(user.role === 'SuperAdmin' || user.role === 'Admin' || user.role === 'Staff') && (
                  <Link
                    to={`/${settings.admin_route || 'admin'}`}
                    className="p-1.5 sm:p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full transition-colors flex items-center justify-center shrink-0"
                    title="پنل مدیریت"
                  >
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-1.5 sm:p-2.5 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded-full border border-slate-700 transition-colors flex items-center justify-center shrink-0"
                  title="خروج"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/10 transition-all duration-200 shrink-0"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">ورود / عضویت</span>
                <span className="sm:hidden">ورود</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#0c1220] border-t border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            خانه
          </Link>
          <Link
            to="/menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/menu') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            منو رستوران
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/about') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            درباره ما
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/contact') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            تماس با ما
          </Link>
          <Link
            to="/faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/faq') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            پرسش‌های متداول
          </Link>
        </div>
      )}
    </header>
  );
};
