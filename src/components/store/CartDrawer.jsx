import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { STORE_RULES } from '../../services/storeStorage';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const items = cart.items || [];
  const subtotal = cart.subtotal || 0;
  const shippingCost = cart.shippingCost || 0;
  const total = cart.total || 0;
  const freeShippingApplied = cart.freeShippingApplied;
  const amountNeeded = cart.amountNeededForFreeShipping || 0;
  const shippingProgressPct = Math.min(100, Math.round((subtotal / STORE_RULES.FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#30231C]/80 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F3EDE4] border-l border-[#DED3C5] flex flex-col justify-between shadow-2xl text-[#30231C]">
          
          {/* Header in Chocolate #482B23 */}
          <div className="p-5 border-b border-[#382019] flex items-center justify-between bg-[#482B23] text-[#F3EDE4]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F5B700] text-[#30231C] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#F3EDE4] text-lg leading-tight">Tu Carrito de Compras</h3>
                <p className="text-xs text-[#DED3C5]">
                  {cart.itemsCount} {cart.itemsCount === 1 ? 'producto' : 'productos'} seleccionados
                </p>
              </div>
            </div>

            <button
              id="close-cart-drawer"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-[#DED3C5] hover:text-[#F3EDE4] hover:bg-[#382019] flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Policy Progress Bar in Forest Green #25432F */}
          <div className="p-4 bg-[#25432F] text-[#F3EDE4] border-b border-[#1c3324] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-[#F5B700]" />
                {freeShippingApplied ? (
                  <span className="text-[#F5B700] font-bold">¡Calificas para Envío Gratis! 🎉</span>
                ) : (
                  <span className="text-[#F3EDE4]">Agrega <strong className="text-[#F5B700] font-mono">${amountNeeded.toFixed(2)} USD</strong> más para Envío Gratis</span>
                )}
              </span>
              <span className="font-mono text-[11px] text-[#F5B700] font-bold">{shippingProgressPct}%</span>
            </div>

            {/* Progress bar line */}
            <div className="w-full h-2 bg-[#1c3324] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F5B700] transition-all duration-300"
                style={{ width: `${shippingProgressPct}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 divide-y divide-[#DED3C5]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5] flex items-center justify-center text-[#665348]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-[#30231C] text-base">Tu carrito está vacío</h4>
                <p className="text-xs text-[#665348] max-w-xs leading-relaxed">
                  Explora nuestro catálogo de café de especialidad y selecciona tu origen favorito.
                </p>
              </div>
            ) : (
              items.map((item, idx) => {
                const itemId = item.productId || item.id || `item-${idx}`;
                const itemPrice = Number(item.price || 0);
                const itemQty = Number(item.quantity || 1);
                const itemSubtotal = Number(item.subtotal ?? item.itemSubtotal ?? (itemPrice * itemQty) ?? 0);

                return (
                  <div key={itemId} className="pt-3 first:pt-0 flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-[#EBE4DA] border border-[#DED3C5] flex items-center justify-center shrink-0 p-1">
                      <img 
                        src={item.isSubscription ? "/images/roastify_pourover.jpg" : "/images/roastify_bag_mockup.jpg"} 
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-[#30231C] truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(itemId)}
                          className="text-[#665348] hover:text-red-600 transition p-0.5"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#665348]">
                        <span>${itemPrice.toFixed(2)} USD c/u</span>
                        {item.isSubscription && (
                          <span className="text-[10px] font-bold text-[#25432F] bg-[#25432F]/10 px-1.5 py-0.5 rounded">
                            Suscripción
                          </span>
                        )}
                      </div>

                      {/* Quantity controls & Subtotal */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center rounded-lg bg-[#EBE4DA] border border-[#DED3C5] px-1 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(itemId, itemQty - 1)}
                            className="w-6 h-6 rounded text-[#30231C] hover:bg-[#DED3C5] flex items-center justify-center transition"
                            title="Disminuir"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold font-mono text-[#30231C]">
                            {itemQty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(itemId, itemQty + 1)}
                            className="w-6 h-6 rounded text-[#30231C] hover:bg-[#DED3C5] flex items-center justify-center transition"
                            title="Aumentar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-sm text-[#30231C]">
                          ${itemSubtotal.toFixed(2)} USD
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#DED3C5] bg-[#EBE4DA] space-y-4">
              <div className="space-y-1.5 text-xs text-[#665348]">
                <div className="flex justify-between">
                  <span>Subtotal productos:</span>
                  <span className="font-mono font-bold text-[#30231C]">${Number(subtotal || 0).toFixed(2)} USD</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    Costo de envío logístico:
                    {freeShippingApplied && (
                      <span className="text-[10px] font-bold text-[#25432F] bg-[#25432F]/10 px-1 rounded">
                        GRATIS
                      </span>
                    )}
                  </span>
                  <span className={`font-mono font-bold ${freeShippingApplied ? 'text-[#25432F]' : 'text-[#30231C]'}`}>
                    {freeShippingApplied ? '$0.00 USD' : `$${Number(shippingCost || 0).toFixed(2)} USD`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-[#30231C] pt-2 border-t border-[#DED3C5]">
                  <span>Total a Pagar:</span>
                  <span className="font-mono text-xl text-[#482B23]">${Number(total || 0).toFixed(2)} USD</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  id="proceed-to-checkout-btn"
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F5B700]/20 hover:scale-[1.01]"
                >
                  <span>Continuar al Checkout Simulado</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>

                <div className="flex items-center justify-between text-[11px] pt-1 text-[#665348]">
                  <button
                    onClick={onClearCart}
                    className="hover:text-red-600 transition underline"
                  >
                    Vaciar carrito
                  </button>

                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#25432F]" />
                    <span>Sin cobros bancarios reales</span>
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
