import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone,
  Eye,
  X,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { getCustomers, getOrders } from '../../services/storeStorage';

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    setCustomers(getCustomers());
    setOrders(getOrders());
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalSpentAll = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
  const avgOrdersPerCustomer = customers.length > 0 
    ? (customers.reduce((acc, c) => acc + (c.totalOrders || 0), 0) / customers.length).toFixed(1)
    : '0';

  // Obtener pedidos del cliente seleccionado
  const customerOrders = selectedCustomer 
    ? orders.filter(o => o.customer?.email?.toLowerCase() === selectedCustomer.email.toLowerCase())
    : [];

  return (
    <div className="space-y-6">
      {/* Cabecera y Métricas de Clientes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-serif text-aura-cream flex items-center gap-2">
            <Users className="w-5 h-5 text-aura-gold" />
            <span>Directorio de Clientes de Demostración</span>
          </h2>
          <p className="text-xs text-aura-beige mt-0.5">
            Registro automático de compradores ficticios a partir de los checkouts simulados.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-aura-surface border border-aura-border text-aura-cream">
            Clientes: <strong className="text-aura-gold">{customers.length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-aura-gold/20 border border-aura-gold/40 text-aura-gold">
            Gasto Total: <strong>${totalSpentAll.toFixed(2)} USD</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-aura-surface border border-aura-border text-aura-cream">
            Prom. Pedidos: <strong className="text-aura-gold">{avgOrdersPerCustomer}</strong>
          </span>
        </div>
      </div>

      {/* Aviso de Privacidad y Datos de Demostración */}
      <div className="p-3.5 rounded-xl bg-aura-surface border border-aura-border flex items-center gap-3 text-xs text-aura-beige">
        <ShieldCheck className="w-4 h-4 text-aura-gold shrink-0" />
        <span>
          Aviso de Privacidad: Todos los registros corresponden a nombres y correos ficticios generados en pruebas de laboratorio. No se utilizan datos personales reales ni se comparten con servicios externos.
        </span>
      </div>

      {/* Barra de Búsqueda */}
      <div className="p-4 rounded-xl aura-card flex items-center shadow-md">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-aura-beige absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-aura-surface border border-aura-border text-xs text-aura-cream placeholder:text-aura-beige/60 focus:outline-none focus:border-aura-gold transition"
          />
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="rounded-xl aura-card overflow-hidden shadow-md">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-aura-beige text-xs space-y-2">
            <Users className="w-8 h-8 text-aura-beige/50 mx-auto" />
            <p className="font-semibold text-aura-cream">No hay clientes registrados que coincidan con la búsqueda.</p>
            <p className="text-[11px]">Realiza un checkout con datos ficticios en la tienda para ver un nuevo registro aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-aura-border bg-aura-surface text-aura-cream font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Dirección</th>
                  <th className="py-3 px-4 text-center">Pedidos</th>
                  <th className="py-3 px-4">Gasto Confirmado</th>
                  <th className="py-3 px-4">Última Compra</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-border/40">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.email} className="hover:bg-[#2a1e17] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-aura-surface border border-aura-border flex items-center justify-center font-bold text-aura-gold text-xs shrink-0">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-aura-cream">{cust.name}</p>
                          <span className="text-[10px] font-mono text-aura-beige">{cust.id || 'CUST-DEMO'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-aura-cream">
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-aura-gold" />
                        <span>{cust.email}</span>
                      </p>
                      {cust.phone && (
                        <p className="flex items-center gap-1.5 text-aura-beige text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-aura-gold" />
                          <span>{cust.phone}</span>
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-aura-beige">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-aura-copper shrink-0" />
                        <span className="truncate max-w-[160px]">{cust.address}</span>
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-aura-surface border border-aura-border text-aura-gold font-mono font-bold text-xs">
                        {cust.totalOrders}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-aura-gold whitespace-nowrap">
                      ${cust.totalSpent?.toFixed(2) || '0.00'} USD
                    </td>
                    <td className="py-3 px-4 text-aura-beige text-[11px] whitespace-nowrap">
                      {cust.lastOrderAt ? new Date(cust.lastOrderAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-2.5 py-1 rounded-lg bg-aura-surface hover:bg-aura-card text-aura-gold border border-aura-border hover:border-aura-gold text-xs font-semibold flex items-center gap-1 mx-auto transition"
                        title="Ver historial de compras"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Historial</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Historial de Compras del Cliente */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-aura-card border border-aura-border rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-aura-border flex items-center justify-between bg-aura-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-aura-card border border-aura-border flex items-center justify-center font-bold text-aura-gold">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold font-serif text-aura-cream">{selectedCustomer.name}</h3>
                  <p className="text-xs text-aura-beige">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-aura-beige hover:text-aura-cream hover:bg-aura-card transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-aura-surface border border-aura-border">
                  <span className="text-aura-beige">Total de compras:</span>
                  <p className="text-base font-bold text-aura-cream font-mono mt-0.5">{selectedCustomer.totalOrders} pedidos</p>
                </div>
                <div className="p-3 rounded-lg bg-aura-surface border border-aura-border">
                  <span className="text-aura-beige">Gasto simulado confirmado:</span>
                  <p className="text-base font-bold text-aura-gold font-mono mt-0.5">${selectedCustomer.totalSpent?.toFixed(2)} USD</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold font-serif text-aura-cream uppercase tracking-wider">Historial de Pedidos</h4>
                {customerOrders.length === 0 ? (
                  <p className="text-xs text-aura-beige py-3 text-center">No se encontraron pedidos asociados a esta dirección de correo.</p>
                ) : (
                  <div className="divide-y divide-aura-border border border-aura-border rounded-xl overflow-hidden bg-aura-surface">
                    {customerOrders.map(order => (
                      <div key={order.orderId} className="p-3 flex items-center justify-between text-xs hover:bg-[#2a1e17] transition">
                        <div>
                          <p className="font-mono font-bold text-aura-cream">{order.orderId}</p>
                          <p className="text-[11px] text-aura-beige">
                            {new Date(order.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {' · '}{order.items?.length || 0} producto(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-aura-cream">${order.totals?.total?.toFixed(2)} USD</p>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {order.status === 'CONFIRMED' ? 'CONFIRMADO' : 'RECHAZADO'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-aura-border bg-aura-surface flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-lg bg-aura-gold hover:bg-aura-goldLight text-aura-bg text-xs font-bold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
