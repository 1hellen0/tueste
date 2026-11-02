import React, { useState, useMemo } from 'react';
import { 
  Coffee, 
  Package, 
  Sparkles, 
  Search, 
  Plus, 
  Minus, 
  Check, 
  AlertTriangle,
  Tag,
  ShieldCheck,
  Star,
  CheckCircle2
} from 'lucide-react';

export default function StoreCatalog({ products = [], onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState({});
  const [addedFeedback, setAddedFeedback] = useState({});

  // Filtrado reactivo de productos
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleQtyChange = (productId, delta, maxStock) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(maxStock, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleAdd = (product) => {
    const qty = quantities[product.id] || 1;
    const res = onAddToCart(product.id, qty);
    if (res.success) {
      setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedFeedback((prev) => ({ ...prev, [product.id]: false }));
      }, 1600);
    }
  };

  // Calificaciones ficticias de referencia editorial tipo ROASTIFY
  const ratings = {
    'PROD-01': '4.9',
    'PROD-02': '4.8',
    'PROD-03': '4.9',
    'PROD-04': '5.0',
    'PROD-05': '4.9',
    'PROD-06': '4.9'
  };

  return (
    <div className="space-y-8" id="catalogo">
      {/* Editorial Header Section */}
      <div className="text-center space-y-2 max-w-2xl mx-auto pt-6">
        <span className="text-[11px] font-bold tracking-widest text-[#25432F] uppercase bg-[#DED3C5]/60 px-3 py-1 rounded-full border border-[#DED3C5]">
          Colección Exclusiva
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#30231C] tracking-tight">
          Nuestra Colección de Cafés de Especialidad
        </h2>
        <p className="text-xs sm:text-sm text-[#665348] leading-relaxed">
          Explora nuestros orígenes únicos y packs de ahorro. Precios oficiales del Caso A: <strong>$17.00 USD</strong> bolsa individual, <strong>$48.00 USD</strong> pack x3 con Envío Gratis y <strong>$30.60 USD</strong> suscripción con 10% de ahorro.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 rounded-2xl bg-[#EBE4DA] border border-[#DED3C5]">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Todos los Cafés' },
            { id: 'origen_unico', label: 'Origen Único ($17)' },
            { id: 'packs', label: 'Packs Ahorro ($48)' },
            { id: 'suscripciones', label: 'Suscripción Club ($30.60)' },
            { id: 'microlote', label: 'Microlotes Selectos' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === tab.id
                  ? 'bg-[#F5B700] text-[#30231C] shadow-md shadow-[#F5B700]/25'
                  : 'bg-[#F3EDE4] text-[#482B23] hover:bg-[#DED3C5] border border-[#DED3C5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#665348]" />
          <input
            type="text"
            placeholder="Buscar por origen o nota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F3EDE4] border border-[#DED3C5] rounded-xl text-xs text-[#30231C] placeholder-[#665348]/70 focus:outline-none focus:border-[#482B23] transition"
          />
        </div>
      </div>

      {/* Products Grid - ROASTIFY 3 Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const qty = quantities[product.id] || 1;
          const isAdded = addedFeedback[product.id];
          const isOutOfStock = product.stock <= 0;
          const isSub = product.isSubscription;
          const isPack = product.id === 'PROD-05';

          return (
            <div 
              key={product.id}
              className="flex flex-col justify-between rounded-3xl bg-[#EBE4DA] border border-[#DED3C5] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#482B23]/40 transition-all duration-300 group"
            >
              {/* Product Top Header with Badges */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    {isPack ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#25432F] text-[#F5B700]">
                        Envío Gratis Incluido
                      </span>
                    ) : isSub ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#482B23] text-[#F5B700]">
                        10% Ahorro Recurrente
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DED3C5] text-[#482B23]">
                        {product.origin || 'Origen Selecto'}
                      </span>
                    )}
                  </div>

                  {/* Rating / Demo Tag */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#30231C] bg-[#F3EDE4] px-2 py-0.5 rounded-full border border-[#DED3C5]">
                    <Star className="w-3.5 h-3.5 fill-[#F5B700] text-[#F5B700]" />
                    <span>{ratings[product.id] || '4.9'}</span>
                  </div>
                </div>

                {/* Centered Product Image Mockup inspired by ROASTIFY */}
                <div className="relative w-full h-52 bg-[#F3EDE4] rounded-2xl overflow-hidden border border-[#DED3C5]/80 flex items-center justify-center p-4 group-hover:scale-[1.01] transition-transform">
                  <img 
                    src={isSub ? "/images/roastify_pourover.jpg" : isPack ? "/images/roastify_hero_bag.jpg" : "/images/roastify_bag_mockup.jpg"} 
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                  {isSub && (
                    <div className="absolute inset-0 bg-[#25432F]/20 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-[#25432F] text-[#F5B700] text-xs font-black shadow-md">
                        2 Bolsas / Mes
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Content Details */}
              <div className="px-5 py-2 space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#30231C] leading-snug group-hover:text-[#482B23] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#665348] line-clamp-2 mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Flavor Notes / Specs Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold text-[#482B23] px-2 py-0.5 rounded-md bg-[#DED3C5]/70">
                    {product.roast || 'Tueste Medio'}
                  </span>
                  <span className="text-[10px] font-semibold text-[#482B23] px-2 py-0.5 rounded-md bg-[#DED3C5]/70">
                    {product.process || 'Lavado'}
                  </span>
                  <span className="text-[10px] font-semibold text-[#482B23] px-2 py-0.5 rounded-md bg-[#DED3C5]/70">
                    {product.weight}
                  </span>
                </div>

                {/* Stock info */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#DED3C5]/60 text-[#665348]">
                  <span className="font-medium">
                    {isOutOfStock ? (
                      <span className="text-red-600 font-bold">Agotado</span>
                    ) : (
                      <span>Stock: <strong>{product.stock} unid.</strong></span>
                    )}
                  </span>
                  {product.isDemoData && (
                    <span className="text-[9px] uppercase font-bold text-[#665348] px-1.5 py-0.5 rounded bg-[#DED3C5]">
                      Demo
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Buy Action Card Footer */}
              <div className="p-5 pt-3 border-t border-[#DED3C5] mt-2 flex flex-col gap-3 bg-[#F3EDE4]/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#665348] block">Precio Oficial</span>
                    <span className="text-2xl font-serif font-black text-[#30231C]">
                      ${product.price.toFixed(2)}
                      <span className="text-xs font-sans font-normal text-[#665348] ml-1">USD</span>
                    </span>
                  </div>

                  {/* Quantity selector */}
                  {!isOutOfStock && !isSub && (
                    <div className="flex items-center rounded-xl bg-[#EBE4DA] border border-[#DED3C5] px-1 py-1">
                      <button
                        onClick={() => handleQtyChange(product.id, -1, product.stock)}
                        className="w-7 h-7 rounded-lg text-[#30231C] hover:bg-[#DED3C5] flex items-center justify-center transition"
                        title="Disminuir"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-[#30231C]">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(product.id, 1, product.stock)}
                        className="w-7 h-7 rounded-lg text-[#30231C] hover:bg-[#DED3C5] flex items-center justify-center transition"
                        title="Aumentar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Add to Cart CTA Button in Golden Yellow #F5B700 */}
                <button
                  id={`add-to-cart-${product.id}`}
                  onClick={() => handleAdd(product)}
                  disabled={isOutOfStock}
                  className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                    isAdded
                      ? 'bg-[#25432F] text-[#F3EDE4]'
                      : isOutOfStock
                      ? 'bg-[#DED3C5] text-[#665348]/50 cursor-not-allowed'
                      : 'bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] shadow-[#F5B700]/20 hover:scale-[1.01]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>¡Agregado al Carrito!</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sin Existencias</span>
                  ) : isSub ? (
                    <>
                      <Package className="w-4 h-4" />
                      <span>Suscribirme ($30.60/mes)</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-4 h-4" />
                      <span>Agregar al Carrito ({qty})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Wide Bottom Promotional Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#482B23] text-[#F3EDE4] flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#382019] shadow-lg">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-[#F5B700] text-[#30231C] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#F3EDE4]">¿Deseas ahorrar en cada pedido?</h4>
            <p className="text-xs text-[#DED3C5]">Elige el Pack de 3 Bolsas ($48 USD) para obtener <strong>Envío Gratis Inmediato</strong>.</p>
          </div>
        </div>

        <button
          onClick={() => setSelectedCategory('packs')}
          className="px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] font-black text-xs transition-all shrink-0"
        >
          Ver Pack 3 Bolsas
        </button>
      </div>
    </div>
  );
}
