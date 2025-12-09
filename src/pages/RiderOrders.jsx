import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import {
  ArrowLeft,
  Search,
  RefreshCw,
  MapPin,
  Clock,
  ChevronRight,
  Filter,
  Package,
  Calendar,
  DollarSign,
  Phone,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';

const RiderOrders = () => {
  const { getOrders } = useRiderAuth();
  const navigate = useNavigate();

  // State
  const [orders, setOrders] = useState({ new: [], pending: [], completed: [] });
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Initial Load
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const result = await getOrders();
      if (result.success) {
        setOrders(result.data);
        if (isRefresh) toast.success('Orders updated');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- Filtering Logic ---
  const getDisplayOrders = () => {
    let list = [];
    if (activeTab === 'active') {
      list = [...orders.new, ...orders.pending];
    } else {
      list = orders.completed;
    }

    if (!searchTerm) return list;

    return list.filter(o => 
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.delivery?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.delivery?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const displayOrders = getDisplayOrders();

  // --- Helpers ---
  const getStatusColor = (status) => {
    const colors = {
      assigned: 'border-blue-500 text-blue-400 bg-blue-500/10',
      picked_up: 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
      out_for_delivery: 'border-orange-500 text-orange-400 bg-orange-500/10',
      delivered: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
      cancelled: 'border-red-500 text-red-400 bg-red-500/10',
    };
    return colors[status] || 'border-slate-500 text-slate-400 bg-slate-500/10';
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // --- Render Components ---

  // 1. Loading Skeleton
  if (loading) return (
    <div className="min-h-screen bg-slate-950 p-4 space-y-4">
      <div className="h-14 bg-slate-800 rounded-xl animate-pulse"></div>
      <div className="h-10 bg-slate-800 rounded-lg animate-pulse w-2/3"></div>
      {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-800 rounded-xl animate-pulse"></div>)}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/rider/dashboard')}
              className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">My Missions</h1>
          </div>
          <button 
            onClick={() => loadOrders(true)}
            className={`p-2 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search ID, Name or Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </header>

      {/* 2. Tabs */}
      <div className="px-4 py-4">
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'active' 
                ? 'bg-slate-800 text-white shadow-md border border-slate-700' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Active ({orders.new.length + orders.pending.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'history' 
                ? 'bg-slate-800 text-white shadow-md border border-slate-700' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* 3. Orders List */}
      <div className="px-4 space-y-4">
        {displayOrders.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <Package className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">Try refreshing or changing filters</p>
          </div>
        ) : (
          displayOrders.map((order) => {
            // Group History by Date visually (simple implementation)
            const showDateHeader = activeTab === 'history'; // You can add logic to only show once per date
            
            return (
              <div 
                key={order._id}
                onClick={() => navigate(`/rider/order/${order._id}`)}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all active:scale-[0.98] cursor-pointer relative"
              >
                {/* Status Strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(order.status).split(' ')[0].replace('border-', 'bg-')}`}></div>

                <div className="p-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4 pl-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-300">#{order.orderId}</span>
                        {order.codAmount > 0 && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                            COD
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Route Visualization */}
                  <div className="pl-3 relative mb-4">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-slate-800 border-l border-dashed border-slate-700"></div>

                    {/* Pickup */}
                    <div className="flex items-start gap-3 mb-4 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 font-bold uppercase">Restaurant</p>
                        <p className="text-sm font-medium text-slate-200 truncate">{order.restaurant?.name || 'Restaurant Name'}</p>
                        <p className="text-xs text-slate-500 truncate">{order.restaurant?.address || 'Pickup Address'}</p>
                      </div>
                    </div>

                    {/* Dropoff */}
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 font-bold uppercase">Customer</p>
                        <p className="text-sm font-medium text-slate-200 truncate">{order.delivery?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{order.delivery?.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer / Earnings */}
                  <div className="bg-slate-950/50 -mx-4 -mb-4 px-4 py-3 flex items-center justify-between border-t border-slate-800 pl-7">
                    <div>
                      <p className="text-xs text-slate-500">Order Value</p>
                      <p className="text-lg font-bold text-white">Rs {order.codAmount || '0.00'}</p>
                    </div>

                    {activeTab === 'active' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); window.open(`tel:${order.delivery?.phone}`); }}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); window.open(`https://maps.google.com/?q=${order.delivery?.address}`); }}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-blue-400 hover:bg-slate-700 transition"
                        >
                          <Navigation className="w-4 h-4" />
                        </button>
                        <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-900/20">
                           <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default RiderOrders;