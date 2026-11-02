import React from 'react';
import { Coffee, ShoppingBag, LayoutDashboard, Truck, Search, ShieldCheck } from 'lucide-react';

export default function StoreNavbar({ 
  cartCount = 0, 
  onOpenCart, 
  onGoToAdmin, 
  activeSection = 'home',
  onSelectSection 
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#482B23] text-[#F3EDE4] border-b border-[#382019] shadow-md">
      {/* Top micro-banner */}
      <div className="bg-[#25432F] text-[#F3EDE4] px-4 py-1.5 text-center text-[11px] flex items-center justify-center gap-2 font-medium tracking-wide">
        <Truck className="w-3.5 h-3.5 text-[#F5B700]" />
        <span>Política Oficial: <strong className="text-[#F5B700]">Envío Gratis</strong> en compras desde $45.00 USD (o $4.50 estándar)</span>
        <span className="hidden md:inline text-[#DED3C5]/40">|</span>
        <span className="hidden md:inline text-[#DED3C5]">Entorno Académico con Pagos 100% Simulados</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onSelectSection('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F5B700] text-[#30231C] flex items-center justify-center shadow-md shadow-[#F5B700]/20 group-hover:scale-105 transition-transform">
            <Coffee className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-2xl tracking-tight text-[#F3EDE4]">Tueste<span className="text-[#F5B700]">®</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#25432F] text-[#F5B700] border border-[#F5B700]/30">
                Especialidad
              </span>
            </div>
            <p className="text-[11px] text-[#DED3C5]/80 font-sans tracking-wide">Café Artesanal & Micro-Lotes</p>
          </div>
        </div>

        {/* Navigation links inspired by ROASTIFY (Shop, Subscription, About Us) */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
          <button
            onClick={() => onSelectSection('home')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeSection === 'home' 
                ? 'text-[#F5B700] bg-[#382019]' 
                : 'text-[#DED3C5] hover:text-[#F3EDE4] hover:bg-[#382019]/60'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => onSelectSection('catalog')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeSection === 'catalog' 
                ? 'text-[#F5B700] bg-[#382019]' 
                : 'text-[#DED3C5] hover:text-[#F3EDE4] hover:bg-[#382019]/60'
            }`}
          >
            Catálogo de Cafés
          </button>
          <button
            onClick={() => onSelectSection('subscription')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeSection === 'subscription' 
                ? 'text-[#F5B700] bg-[#382019]' 
                : 'text-[#DED3C5] hover:text-[#F3EDE4] hover:bg-[#382019]/60'
            }`}
          >
            Suscripción Club ($30.60)
          </button>
          <button
            onClick={() => onSelectSection('about')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeSection === 'about' 
                ? 'text-[#F5B700] bg-[#382019]' 
                : 'text-[#DED3C5] hover:text-[#F3EDE4] hover:bg-[#382019]/60'
            }`}
          >
            Nuestro Compromiso
          </button>
        </nav>

        {/* Right actions: Cart & Switch to Financial Dashboard */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button
            id="cart-drawer-toggle"
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#382019] hover:bg-[#2e1913] border border-[#74513D]/40 text-[#F3EDE4] transition-all shadow-sm group"
            title="Ver carrito de compras"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#F5B700] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span id="cart-badge-count" className="absolute -top-2 -right-2.5 bg-[#F5B700] text-[#30231C] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#F3EDE4]">Carrito</span>
          </button>

          {/* Differentiated Access to Admin / Financial Dashboard */}
          <button
            id="admin-dashboard-toggle"
            onClick={onGoToAdmin}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25432F] hover:bg-[#1c3324] border border-[#F5B700]/40 text-[#F5B700] text-xs font-bold transition-all shadow-md hover:border-[#F5B700]"
            title="Ir al Tablero Financiero y Unit Economics (AURA ROAST)"
          >
            <LayoutDashboard className="w-4 h-4 text-[#F5B700]" />
            <span className="hidden sm:inline">Panel Financiero (Diego)</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
