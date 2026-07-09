import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';

// Floating Customer Cart Drawer / Sticky Anchor
import { ShoppingCart } from 'lucide-react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart } = useApp();
  const location = useLocation();

  // Hide header and footer if we are inside the admin console
  const isAdminPage = location.pathname.includes('/admin') || 
                      location.pathname.startsWith('/adm-') ||
                      location.pathname.includes('/setup');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#faf6f0]">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* Persistent floating checkout anchor if items present */}
      {cartCount > 0 && location.pathname !== '/checkout' && (
        <div className="fixed bottom-6 left-6 z-50 animate-bounce">
          <Link 
            to="/checkout" 
            className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-4 rounded-full shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all border border-amber-300/30"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs font-sans">مشاهده سبد خرید ({cartCount.toLocaleString('fa-IR')})</span>
          </Link>
        </div>
      )}
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { settings } = useApp();

  // Load route configs dynamically from database settings
  const customAdminRoute = settings.admin_route || 'admin';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* Admin Panel (Standard Route fallback & Custom Route) */}
      <Route path="/admin" element={<Admin />} />
      {customAdminRoute !== 'admin' && (
        <Route path={`/${customAdminRoute}`} element={<Admin />} />
      )}

      {/* Catch All Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
