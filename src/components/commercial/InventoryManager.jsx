import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Plus, 
  Minus, 
  RotateCcw,
  Search,
  Coffee,
  Sparkles
} from 'lucide-react';
import { 
  getProducts, 
  updateProductStock, 
  resetToDemoDefaults 
} from '../../services/storeStorage';

export default function InventoryManager() {
  const [products, setProducts] = useState([]);
  const [editingStock, setEditingStock] = useState({});
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = () => {
    setProducts(getProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockUpdate = (productId, newStock) => {
    const val = parseInt(newStock, 10);
    if (isNaN(val) || val < 0) {
      setFeedback({ message: 'El inventario debe ser un número entero mayor o igual a 0.', type: 'error' });
      setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
      return;
    }

    const res = updateProductStock(productId, val);
    if (res.success) {
      setFeedback({ message: `Inventario actualizado para "${res.product.name}": ${val} unidades.`, type: 'success' });
      loadProducts();
      setEditingStock(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    } else {
      setFeedback({ message: res.error || 'Error actualizando inventario.', type: 'error' });
    }
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const handleQuickAdjust = (productId, currentStock, delta) => {
    const target = Math.max(0, currentStock + delta);
    handleStockUpdate(productId, target);
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Restablecer el inventario de todos los productos a los valores iniciales del catálogo?')) {
      resetToDemoDefaults();
      loadProducts();
      setFeedback({ message: 'Inventario restablecido a valores semilla oficiales.', type: 'success' });
      setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
    }
  };

  // Filtrado
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStockUnits = products.reduce((acc, p) => acc + (p.isSubscription ? 0 : p.stock), 0);
  const lowStockCount = products.filter(p => !p.isSubscription && p.stock > 0 && p.stock <= 15).length;
  const outOfStockCount = products.filter(p => !p.isSubscription && p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Cabecera y Resumen de Inventario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-serif text-aura-cream flex items-center gap-2">
            <Package className="w-5 h-5 text-aura-gold" />
            <span>Inventario y Catálogo de Productos</span>
          </h2>
          <p className="text-xs text-aura-beige mt-0.5">
            Supervisión y ajuste del stock de demostración con precios oficiales protegidos.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-aura-surface border border-aura-border text-aura-cream">
            Unidades Totales: <strong className="text-aura-gold">{totalStockUnits}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
            Stock Bajo: <strong>{lowStockCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300">
            Agotados: <strong>{outOfStockCount}</strong>
          </span>
        </div>
      </div>

      {/* Banner de Protección de Precios Oficiales */}
      <div className="p-4 rounded-xl aura-card flex items-start gap-3 text-xs text-aura-beige shadow-sm">
        <ShieldCheck className="w-5 h-5 text-aura-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold font-serif text-aura-gold text-sm">
            Protección de Parámetros Económicos Oficiales del Caso
          </p>
          <p className="leading-relaxed text-aura-beige">
            Los precios comerciales de <strong className="text-aura-cream">$17.00 USD</strong> (bolsa 340g), <strong className="text-aura-cream">$48.00 USD</strong> (pack degustación x3) y <strong className="text-aura-cream">$30.60 USD</strong> (suscripción con 10% descuento) son invariables para garantizar la validez de los Unit Economics. Las cantidades de stock y lotes son 100% editables para simular rupturas de stock y reabastecimiento en la tienda pública.
          </p>
        </div>
      </div>

      {feedback.message && (
        <div className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between ${
          feedback.type === 'success' 
            ? 'bg-aura-surface text-emerald-400 border border-emerald-500/40' 
            : 'bg-red-950/40 text-red-300 border border-red-500/40'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ message: '', type: '' })}>✕</button>
        </div>
      )}

      {/* Barra de Búsqueda y Botón Restaurar */}
      <div className="p-4 rounded-xl aura-card flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-aura-beige absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por producto, SKU u origen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-aura-surface border border-aura-border text-xs text-aura-cream placeholder:text-aura-beige/60 focus:outline-none focus:border-aura-gold transition"
          />
        </div>
        <button
          onClick={handleResetDefaults}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-aura-surface hover:bg-aura-card text-aura-cream text-xs font-semibold border border-aura-border hover:border-aura-copper transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-aura-gold" />
          <span>Restablecer Stock Original</span>
        </button>
      </div>

      {/* Tabla de Productos y Modificación de Stock */}
      <div className="rounded-xl aura-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-aura-border bg-aura-surface text-aura-cream font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Presentación</th>
                <th className="py-3 px-4">Precio Oficial</th>
                <th className="py-3 px-4">Estado Stock</th>
                <th className="py-3 px-4">Stock Actual</th>
                <th className="py-3 px-4 text-center">Modificar Cantidad (Demo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aura-border/40">
              {filteredProducts.map((product) => {
                const isOutOfStock = !product.isSubscription && product.stock === 0;
                const isLowStock = !product.isSubscription && product.stock > 0 && product.stock <= 15;
                const isSub = product.isSubscription;

                return (
                  <tr key={product.id} className="hover:bg-[#2a1e17] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-aura-surface border border-aura-border flex items-center justify-center text-aura-gold shrink-0">
                          <Coffee className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-aura-cream">{product.name}</p>
                          <p className="text-[10px] text-aura-beige font-mono">
                            {product.sku} · {product.origin}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-aura-beige whitespace-nowrap">
                      {product.bagsCount} bolsa(s) ({product.weightGrams}g)
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-aura-gold whitespace-nowrap">
                      ${product.price.toFixed(2)} USD
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isSub ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Recurrente (Sin límite)
                        </span>
                      ) : isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                          <XCircle className="w-3 h-3" />
                          <span>AGOTADO</span>
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>STOCK BAJO (≤ 15)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>DISPONIBLE</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sm whitespace-nowrap">
                      {isSub ? (
                        <span className="text-aura-beige font-sans text-xs">Ilimitado</span>
                      ) : (
                        <span className={isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-aura-cream'}>
                          {product.stock} unid.
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      {isSub ? (
                        <span className="text-[11px] text-aura-beige/60 italic">Servicio continuo</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Botón rápido -5 */}
                          <button
                            onClick={() => handleQuickAdjust(product.id, product.stock, -5)}
                            className="px-2 py-1 rounded bg-aura-surface hover:bg-aura-card text-aura-cream text-[10px] font-bold border border-aura-border transition"
                            title="Restar 5 unidades"
                          >
                            -5
                          </button>
                          {/* Botón rápido -1 */}
                          <button
                            onClick={() => handleQuickAdjust(product.id, product.stock, -1)}
                            className="p-1 rounded bg-aura-surface hover:bg-aura-card text-aura-cream text-xs font-bold border border-aura-border transition"
                            title="Restar 1 unidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          {/* Input numérico directo */}
                          <input
                            type="number"
                            min="0"
                            className="w-14 text-center py-1 rounded bg-aura-surface border border-aura-border font-mono text-xs text-aura-gold focus:outline-none focus:border-aura-copper"
                            value={editingStock[product.id] !== undefined ? editingStock[product.id] : product.stock}
                            onChange={(e) => setEditingStock({ ...editingStock, [product.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleStockUpdate(product.id, editingStock[product.id]);
                              }
                            }}
                          />
                          {/* Botón rápido +1 */}
                          <button
                            onClick={() => handleQuickAdjust(product.id, product.stock, 1)}
                            className="p-1 rounded bg-aura-surface hover:bg-aura-card text-aura-cream text-xs font-bold border border-aura-border transition"
                            title="Sumar 1 unidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          {/* Botón rápido +5 */}
                          <button
                            onClick={() => handleQuickAdjust(product.id, product.stock, 5)}
                            className="px-2 py-1 rounded bg-aura-surface hover:bg-aura-card text-aura-cream text-[10px] font-bold border border-aura-border transition"
                            title="Sumar 5 unidades"
                          >
                            +5
                          </button>
                          {/* Guardar si se escribió en input */}
                          {editingStock[product.id] !== undefined && (
                            <button
                              onClick={() => handleStockUpdate(product.id, editingStock[product.id])}
                              className="px-2 py-1 rounded bg-aura-gold hover:bg-aura-goldLight text-aura-bg text-[10px] font-bold transition shadow"
                            >
                              Guardar
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
