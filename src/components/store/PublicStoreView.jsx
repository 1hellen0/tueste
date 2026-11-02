import React, { useState, useEffect } from 'react';
import StoreNavbar from './StoreNavbar';
import StoreHero from './StoreHero';
import StoreCatalog from './StoreCatalog';
import StoreSubscription from './StoreSubscription';
import StoreEditorial from './StoreEditorial';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import OrderReceiptModal from './OrderReceiptModal';

import {
  getProducts,
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getOrders
} from '../../services/storeStorage';

import { Coffee, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export default function PublicStoreView({ onGoToAdmin }) {
  const [products, setProducts] = useState(() => {
    try {
      return getProducts();
    } catch (e) {
      return [];
    }
  });
  const [cart, setCart] = useState(() => {
    try {
      return getCart();
    } catch (e) {
      return { items: [], itemsCount: 0, total: 0, subtotal: 0, shippingCost: 0, freeShippingApplied: false, amountNeededForFreeShipping: 45 };
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('cart') === 'open';
    }
    return false;
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('checkout') === 'open';
    }
    return false;
  });
  const [completedOrder, setCompletedOrder] = useState(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('receipt') === 'open') {
      const orders = getOrders();
      return orders.length > 0 ? orders[0] : null;
    }
    return null;
  });
  const [isReceiptOpen, setIsReceiptOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('receipt') === 'open';
    }
    return false;
  });
  const [activeSection, setActiveSection] = useState('home');

  // Cargar catálogo y carrito persistente
  const refreshStoreState = () => {
    setProducts(getProducts());
    setCart(getCart());
  };

  useEffect(() => {
    refreshStoreState();
  }, []);

  const handleAddToCart = (productId, quantity) => {
    const res = addToCart(productId, quantity);
    if (res.success) {
      setCart(res.cart);
    }
    return res;
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const res = updateCartQuantity(productId, newQuantity);
    if (res.success) {
      setCart(res.cart);
    }
  };

  const handleRemoveItem = (productId) => {
    const res = removeFromCart(productId);
    if (res.success) {
      setCart(res.cart);
    }
  };

  const handleClearCart = () => {
    const res = clearCart();
    if (res.success) {
      setCart(res.cart);
    }
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order) => {
    setIsCheckoutOpen(false);
    setCompletedOrder(order);
    setIsReceiptOpen(true);
    refreshStoreState(); // Actualiza el catálogo para reflejar el stock descontado
  };

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'catalog') {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'subscription' || sectionId === 'plans') {
      const el = document.getElementById('suscripcion');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'about') {
      const el = document.getElementById('nosotros');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EDE4] text-[#30231C] flex flex-col font-sans selection:bg-[#F5B700] selection:text-[#30231C]">
      {/* Navigation Bar in Chocolate #482B23 with Forest Green Micro-banner */}
      <StoreNavbar
        cartCount={cart.itemsCount || 0}
        onOpenCart={() => setIsCartOpen(true)}
        onGoToAdmin={onGoToAdmin}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Main Editorial Store Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-16">
        
        {/* 1. Hero Master Section inspired by ROASTIFY */}
        <StoreHero
          onExploreCatalog={() => handleSelectSection('catalog')}
          onSelectPack3={() => {
            handleAddToCart('PROD-05', 1);
            setIsCartOpen(true);
          }}
          onSelectSubscription={() => {
            handleAddToCart('PROD-06', 1);
            setIsCartOpen(true);
          }}
        />

        {/* 2. Products Catalog ("Our Signature Coffee Collection") */}
        <StoreCatalog
          products={products}
          onAddToCart={handleAddToCart}
        />

        {/* 3. Subscription Club Section in Deep Forest Green #25432F */}
        <StoreSubscription
          onSelectSubscription={() => {
            handleAddToCart('PROD-06', 1);
            setIsCartOpen(true);
          }}
        />

        {/* 4. Brand Commitment & Customer Experience */}
        <StoreEditorial
          onExploreCatalog={() => handleSelectSection('catalog')}
        />

      </main>

      {/* Store Footer in Chocolate #482B23 */}
      <footer className="border-t border-[#382019] bg-[#482B23] text-[#F3EDE4] py-12 px-4 sm:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F5B700] text-[#30231C] flex items-center justify-center font-bold">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif font-black text-xl text-[#F3EDE4]">Tueste<span className="text-[#F5B700]">®</span></span>
            </div>
            <p className="text-[#DED3C5] leading-relaxed">
              Café de especialidad de origen transparente, tostado artesanalmente en pequeños lotes semanales para una taza memorable.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-sm text-[#F5B700] uppercase tracking-wider">Navegación</h5>
            <ul className="space-y-1.5 text-[#DED3C5]">
              <li>
                <button onClick={() => handleSelectSection('home')} className="hover:text-[#F3EDE4] transition">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectSection('catalog')} className="hover:text-[#F3EDE4] transition">
                  Catálogo de Cafés
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectSection('subscription')} className="hover:text-[#F3EDE4] transition">
                  Suscripción Club ($30.60/mes)
                </button>
              </li>
              <li>
                <button onClick={() => handleSelectSection('about')} className="hover:text-[#F3EDE4] transition">
                  Nuestro Compromiso
                </button>
              </li>
            </ul>
          </div>

          {/* Official Pricing Policy */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-sm text-[#F5B700] uppercase tracking-wider">Precios Oficiales (Caso A)</h5>
            <ul className="space-y-1.5 text-[#DED3C5]">
              <li>Bolsa Individual (340g): <strong>$17.00 USD</strong></li>
              <li>Pedido Habitual (2 bolsas): <strong>$34.00 USD</strong></li>
              <li>Pack Degustación (3 bolsas): <strong>$48.00 USD</strong></li>
              <li>Club Suscripción Mensual: <strong>$30.60 USD</strong></li>
              <li>Envío Logístico: <strong>$4.50 USD</strong> (&ge; $45 Gratis)</li>
            </ul>
          </div>

          {/* Administrative Switch */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-[#F5B700] uppercase tracking-wider">Administración</h5>
            <p className="text-[#DED3C5] leading-relaxed">
              Acceso protegido para los fundadores y analistas financieros del proyecto.
            </p>
            <button
              onClick={onGoToAdmin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25432F] hover:bg-[#1c3324] border border-[#F5B700]/40 text-[#F5B700] font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>Panel Financiero (Diego)</span>
            </button>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-[#382019] text-center text-[11px] text-[#DED3C5]/70 space-y-2">
          <p>
            © 2026 Tueste Café de Especialidad. Prototipo académico de Unit Economics y E-Commerce con pagos simulados.
          </p>
          <p className="max-w-xl mx-auto text-[#DED3C5]/50">
            Todos los cobros, compras e inventarios son demostraciones emuladas en el navegador del usuario (`localStorage`).
          </p>
        </div>
      </footer>

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleOpenCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Order Receipt Modal */}
      <OrderReceiptModal
        order={completedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onGoToAdmin={onGoToAdmin}
      />
    </div>
  );
}
