import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext'; // Assuming this exists based on your code
import {
  Bike,
  Package,
  MapPin,
  Phone,
  DollarSign,
  Navigation,
  Clock,
  CheckCircle,
  XCircle,
  Menu,
  Bell,
  Power,
  ChevronRight,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const RiderDashboard = () => {
  const { rider, logout, getOrders, getStats, isAuthenticated, updateOrderStatus } = useRiderAuth();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState('active'); // 'requests', 'active', 'history'
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState({ new: [], pending: [], completed: [] });
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalDeliveries: 0,
    onlineHours: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/rider/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([getOrders(), getStats()]);
      
      if(ordersData.success) setOrders(ordersData.data);
      if(statsData.success) setStats(statsData.data);
      
      // Auto-switch tabs if there are urgent items
      if (ordersData.data?.new?.length > 0) setActiveTab('requests');
      else if (ordersData.data?.pending?.length > 0) setActiveTab('active');
      
    } catch (error) {
      console.error(error);
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const toggleOnline = () => {
    const newState = !isOnline;
    setIsOnline(newState);
    toast(newState ? 'You are now ONLINE' : 'You are now OFFLINE', {
      icon: newState ? '🟢' : '🔴',
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Assuming updateOrderStatus exists in your context
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order updated to: ${newStatus.replace('_', ' ')}`);
      loadDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleNavigate = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  // --- Render Helpers ---

  // 1. Status Badge
  const StatusBadge = ({ status }) => {
    const styles = {
      assigned: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      picked_up: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50',
      out_for_delivery: 'bg-yellow-600/20 text-yellow-500 border-yellow-600/50',
      delivered: 'bg-yellow-300/20 text-yellow-200 border-yellow-300/50',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[status] || 'bg-gray-700 text-gray-400'}`}>
        {status.replace(/_/g, ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="animate-pulse">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 md:pb-0">
      
      {/* --- Top Navigation Bar --- */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <Bike className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">FastDelivery</h1>
              <p className="text-xs text-slate-400">{rider?.name || 'Rider'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-slate-800 transition">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div
              onClick={toggleOnline}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 border ${
                isOnline ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-gray-800 border-gray-700'
              }`}
            >
              <Power className={`w-4 h-4 ${isOnline ? 'text-yellow-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${isOnline ? 'text-yellow-400' : 'text-gray-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 space-y-6">

        {/* --- Quick Stats Row --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={DollarSign}
            label="Today's Earnings"
            value={`Rs ${stats?.todayEarnings || '0.00'}`}
            color="text-yellow-400"
            bgColor="bg-yellow-500/10"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={stats?.totalDeliveries || 0}
            color="text-yellow-300"
            bgColor="bg-yellow-400/10"
          />
          <StatCard
            icon={Clock}
            label="Hours Online"
            value={`${stats?.onlineHours || 0}h`}
            color="text-yellow-500"
            bgColor="bg-yellow-600/10"
          />
           <StatCard
            icon={Star}
            label="Rating"
            value={stats?.rating || '5.0'}
            color="text-yellow-200"
            bgColor="bg-yellow-300/10"
          />
        </div>

        {/* --- Main Tab Navigation --- */}
        <div className="flex bg-black p-1 rounded-xl border border-yellow-500/20">
          <TabButton 
            active={activeTab === 'requests'} 
            onClick={() => setActiveTab('requests')} 
            label="Requests" 
            count={orders.new.length} 
            alert={orders.new.length > 0}
          />
          <TabButton 
            active={activeTab === 'active'} 
            onClick={() => setActiveTab('active')} 
            label="Active Orders" 
            count={orders.pending.length}
          />
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            label="History" 
          />
        </div>

        {/* --- Tab Content Areas --- */}
        
        {/* 1. NEW REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {orders.new.length === 0 ? (
              <EmptyState title="No new requests" subtitle="Wait for orders to appear here." />
            ) : (
              orders.new.map((order) => (
                <div key={order._id} className="bg-black border border-yellow-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">New Order #{order.orderId}</h3>
                      <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> Est. Earnings: <span className="text-yellow-400 font-bold">Rs 12.50</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">2.4 km</span>
                      <p className="text-xs text-gray-500">Total Distance</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <LocationRow type="pickup" address={order.restaurant?.address || "Restaurant Location"} />
                    <div className="pl-2 ml-1.5 border-l border-dashed border-gray-700 h-4"></div>
                    <LocationRow type="dropoff" address={order.delivery?.address || "Customer Address"} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'rejected')}
                      className="py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'assigned')}
                      className="py-3 rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 font-bold shadow-lg shadow-yellow-900/20 transition"
                    >
                      Accept Order
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. ACTIVE ORDERS (Detailed View) */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {orders.pending.length === 0 ? (
              <EmptyState title="No active delivery" subtitle="Accept a request to get started." />
            ) : (
              orders.pending.map((order) => (
                <div key={order._id} className="bg-black border border-yellow-500/20 rounded-xl overflow-hidden shadow-xl">
                  {/* Map Placeholder */}
                  <div className="h-32 bg-black relative flex items-center justify-center border-b border-yellow-500/20">
                     <MapPin className="w-8 h-8 text-slate-600 absolute" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                     <span className="absolute bottom-2 right-4 text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">Map View</span>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-center mb-6">
                       <StatusBadge status={order.status} />
                       <span className="text-gray-400 text-sm">#{order.orderId}</span>
                    </div>

                    {/* Timeline/Stepper Actions */}
                    <div className="mb-8">
                       <TimelineStepper currentStatus={order.status} />
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h4 className="text-gray-400 text-xs uppercase font-bold mb-3 tracking-wider">Delivery Details</h4>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                           <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.delivery?.name}</p>
                          <p className="text-gray-400 text-sm">{order.delivery?.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCall(order.delivery?.phone)}
                          className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg text-sm text-black transition"
                        >
                          <Phone className="w-4 h-4" /> Call
                        </button>
                        <button
                          onClick={() => handleNavigate(order.delivery?.address)}
                          className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg text-sm text-black transition"
                        >
                          <Navigation className="w-4 h-4" /> Navigate
                        </button>
                      </div>
                    </div>

                    {/* Main Action Button */}
                    <OrderActionButton 
                      status={order.status} 
                      onUpdate={(nextStatus) => handleStatusUpdate(order._id, nextStatus)} 
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
             {orders.completed.length === 0 ? (
                <EmptyState title="No history yet" subtitle="Completed orders show up here." />
              ) : (
                orders.completed.slice(0, 10).map((order) => (
                  <div key={order._id} className="bg-black border border-yellow-500/20 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-200">#{order.orderId}</span>
                        <span className="text-xs text-gray-500">• {new Date(order.deliveredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate w-48">{order.delivery?.address}</p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-yellow-400">Rs 8.50</span>
                      <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded uppercase">Completed</span>
                    </div>
                  </div>
                ))
             )}
          </div>
        )}

      </div>
    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="bg-black border border-yellow-500/20 p-3 rounded-xl flex flex-col justify-between h-24">
    <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center mb-2`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wide">{label}</p>
      <p className="text-white font-bold text-lg">{value}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, count, alert }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all relative ${
      active
        ? 'bg-yellow-500 text-black shadow-md'
        : 'text-gray-400 hover:text-yellow-200 hover:bg-gray-800'
    }`}
  >
    <div className="flex items-center justify-center gap-2">
      {label}
      {count > 0 && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-black text-yellow-400' : 'bg-yellow-500 text-black'}`}>
          {count}
        </span>
      )}
    </div>
    {alert && <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>}
  </button>
);

const LocationRow = ({ type, address }) => (
  <div className="flex items-start gap-3">
    <div className={`mt-1 w-3 h-3 rounded-full border-2 ${type === 'pickup' ? 'border-yellow-400 bg-transparent' : 'border-yellow-500 bg-yellow-500'}`}></div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 uppercase font-bold">{type === 'pickup' ? 'Pick up' : 'Drop off'}</p>
      <p className="text-sm text-gray-200">{address}</p>
    </div>
  </div>
);

const EmptyState = ({ title, subtitle }) => (
  <div className="text-center py-12 bg-black/50 rounded-xl border border-dashed border-yellow-500/20">
    <Package className="w-12 h-12 text-yellow-500/50 mx-auto mb-3" />
    <h3 className="text-gray-300 font-medium">{title}</h3>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

const TimelineStepper = ({ currentStatus }) => {
  const steps = [
    { id: 'assigned', label: 'Accepted' },
    { id: 'picked_up', label: 'Picked Up' },
    { id: 'delivered', label: 'Delivered' }
  ];
  
  // Helper to determine step status
  const getStepState = (stepId) => {
    const statusOrder = ['assigned', 'picked_up', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus === 'out_for_delivery' ? 'picked_up' : currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);
    
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="flex justify-between items-center relative">
       {/* Connecting Line */}
       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10"></div>
       
       {steps.map((step) => {
         const state = getStepState(step.id);
         return (
           <div key={step.id} className="flex flex-col items-center bg-slate-900 px-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
               state === 'completed' ? 'bg-yellow-500 border-yellow-500 text-black' :
               state === 'current' ? 'bg-black border-yellow-400 text-yellow-400' :
               'bg-black border-gray-700 text-gray-700'
             }`}>
               {state === 'completed' ? <CheckCircle className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-current"></div>}
             </div>
             <span className={`text-[10px] mt-2 font-medium ${
               state === 'current' ? 'text-yellow-400' :
               state === 'completed' ? 'text-yellow-500' : 'text-gray-600'
             }`}>{step.label}</span>
           </div>
         )
       })}
    </div>
  );
};

const OrderActionButton = ({ status, onUpdate }) => {
  if (status === 'assigned') {
    return (
      <button
        onClick={() => onUpdate('picked_up')}
        className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-bold text-lg shadow-lg shadow-yellow-900/20 transition flex items-center justify-center gap-2"
      >
        <Package className="w-5 h-5" /> Confirm Pickup
      </button>
    );
  }
  if (status === 'picked_up') {
    return (
      <button
        onClick={() => onUpdate('out_for_delivery')}
        className="w-full py-4 bg-yellow-600 hover:bg-yellow-700 text-black rounded-xl font-bold text-lg shadow-lg shadow-yellow-900/20 transition flex items-center justify-center gap-2"
      >
        <Bike className="w-5 h-5" /> Start Delivery
      </button>
    );
  }
  if (status === 'out_for_delivery') {
    return (
      <button
        onClick={() => onUpdate('delivered')}
        className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-bold text-lg shadow-lg shadow-yellow-900/20 transition flex items-center justify-center gap-2 animate-pulse"
      >
        <CheckCircle className="w-5 h-5" /> Complete Delivery
      </button>
    );
  }
  return null;
};

export default RiderDashboard;