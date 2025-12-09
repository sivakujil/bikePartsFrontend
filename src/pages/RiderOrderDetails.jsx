import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import {
  ArrowLeft, MapPin, Phone, Package, Clock, CheckCircle,
  Camera, Upload, DollarSign, User, Navigation,
  ChevronRight, AlertTriangle, ShieldCheck, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';

const RiderOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrders, pickupOrder, deliverOrder, uploadProof } = useRiderAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [otp, setOtp] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'items'

  // Load Data
  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      // Ideally, your API should support getOrderById(id)
      // Here we simulate finding it from the list as per your context
      const result = await getOrders();
      if (result.success) {
        const allOrders = [...result.data.new, ...result.data.pending, ...result.data.completed];
        const foundOrder = allOrders.find(o => o._id === id);
        setOrder(foundOrder);
      }
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied');
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleNavigate = (address) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
  };

  const handleMainAction = async () => {
    if (order.status === 'assigned') {
      // PICKUP LOGIC
      try {
        setActionLoading(true);
        await pickupOrder(id);
        setOrder({ ...order, status: 'picked_up', pickupTime: new Date() });
        toast.success('Pickup Confirmed!');
      } catch (err) { console.error(err); } 
      finally { setActionLoading(false); }
    } 
    else if (['picked_up', 'out_for_delivery'].includes(order.status)) {
      // DELIVERY LOGIC
      if (order.codAmount > 0 && !window.confirm(`Have you collected Rs ${order.codAmount} Cash?`)) {
        return;
      }
      if (order.otpRequired && otp.length !== 4) {
        toast.error('Please enter valid 4-digit OTP');
        return;
      }
      
      try {
        setActionLoading(true);
        await deliverOrder(id, { otp });
        setOrder({ ...order, status: 'delivered', deliveredAt: new Date() });
        toast.success('Order Completed!');
        navigate('/rider/dashboard');
      } catch (err) { console.error(err); }
      finally { setActionLoading(false); }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      // Auto upload or wait for button? Let's auto upload for speed
      uploadProofImage(file);
    }
  };

  const uploadProofImage = async (file) => {
    try {
      toast.loading('Uploading proof...');
      const result = await uploadProof(id, file);
      if (result.success) {
        toast.dismiss();
        toast.success('Proof uploaded');
        setOrder(prev => ({ ...prev, photos: [...(prev.photos || []), result.data.proofUrl] }));
        setProofFile(null);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed');
    }
  };

  // --- UI Helpers ---

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return <div className="text-white text-center pt-20">Order not found</div>;

  const isPickupPhase = order.status === 'assigned';
  const isDeliveryPhase = ['picked_up', 'out_for_delivery'].includes(order.status);
  const isCompleted = order.status === 'delivered';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 relative">
      
      {/* 1. Header & Status Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
        <div className="flex items-center p-4 gap-4">
          <button onClick={() => navigate('/rider/dashboard')} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">#{order.orderId}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
               <Clock className="w-3 h-3" /> 
               {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
            isCompleted ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 
            isPickupPhase ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
            'bg-orange-500/20 text-orange-400 border-orange-500/50'
          }`}>
            {order.status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Progress Stepper */}
        {!isCompleted && (
          <div className="flex px-4 pb-4">
            <div className={`flex-1 h-1 rounded-full mr-1 ${isPickupPhase || isDeliveryPhase ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
            <div className={`flex-1 h-1 rounded-full ml-1 ${isDeliveryPhase ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        
        {/* 2. MAIN TASK CARD (Dynamic) */}
        {!isCompleted && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${isPickupPhase ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
            
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isPickupPhase ? 'Pickup Location' : 'Dropoff Location'}
            </h2>
            
            <div className="flex items-start gap-3 mb-4">
              <MapPin className={`w-6 h-6 mt-1 ${isPickupPhase ? 'text-blue-400' : 'text-orange-400'}`} />
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isPickupPhase ? order.restaurant?.name : order.delivery?.name}
                </h3>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  {isPickupPhase ? order.restaurant?.address : order.delivery?.address}
                </p>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => handleCall(isPickupPhase ? order.restaurant?.phone : order.delivery?.phone)}
                className="flex flex-col items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 rounded-lg transition"
              >
                <Phone className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-xs font-medium">Call</span>
              </button>
              <button 
                onClick={() => handleNavigate(isPickupPhase ? order.restaurant?.address : order.delivery?.address)}
                className="flex flex-col items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 rounded-lg transition"
              >
                <Navigation className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-xs font-medium">Map</span>
              </button>
              <button 
                onClick={() => handleCopy(isPickupPhase ? order.restaurant?.address : order.delivery?.address)}
                className="flex flex-col items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 rounded-lg transition"
              >
                <Copy className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-medium">Copy</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. TABS: Details vs Items */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === 'details' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
          >
            Details & Proof
          </button>
          <button 
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === 'items' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
          >
            Order Items ({order.items?.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'items' ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-800 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 px-2 py-1 rounded text-sm font-bold text-slate-300">
                    {item.quantity}x
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-slate-400">Rs {item.price}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 text-lg font-bold border-t border-slate-800">
              <span>Total Value</span>
              <span>Rs {order.totalAmount}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Cash on Delivery Alert */}
            {order.codAmount > 0 && isDeliveryPhase && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-4 animate-pulse">
                <div className="bg-red-500 text-white p-2 rounded-full">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-red-400">COLLECT CASH</h4>
                  <p className="text-white font-bold text-xl">Rs {order.codAmount.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* OTP Input */}
            {isDeliveryPhase && order.otpRequired && (
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                 <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Customer OTP</label>
                 <div className="flex gap-2">
                   <ShieldCheck className="w-10 h-10 text-slate-600" />
                   <input 
                      type="number" 
                      placeholder="Ask customer for 4-digit code"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white text-lg tracking-widest focus:border-emerald-500 outline-none"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.slice(0,4))}
                   />
                 </div>
               </div>
            )}

            {/* Proof of Delivery */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="font-bold text-slate-300 mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Proof of Delivery
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                {/* Existing Photos */}
                {order.photos?.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                    <img src={url} alt="proof" className="w-full h-full object-cover" />
                  </div>
                ))}
                
                {/* Upload Button */}
                {!isCompleted && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-slate-600 hover:border-emerald-500 hover:bg-emerald-500/10 flex flex-col items-center justify-center cursor-pointer transition">
                    <Camera className="w-6 h-6 text-slate-400" />
                    <span className="text-[10px] text-slate-500 mt-1">Add Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. FIXED BOTTOM ACTION BAR */}
      {!isCompleted && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 pb-6 z-30">
          <button
            onClick={handleMainAction}
            disabled={actionLoading || (isDeliveryPhase && order.otpRequired && otp.length < 4)}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
              actionLoading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' :
              isPickupPhase ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' :
              'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
            }`}
          >
            {actionLoading ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</span>
            ) : isPickupPhase ? (
              <><Package className="w-5 h-5" /> CONFIRM PICKUP</>
            ) : (
              <><CheckCircle className="w-5 h-5" /> COMPLETE DELIVERY</>
            )}
            {!actionLoading && <ChevronRight className="w-5 h-5 opacity-60" />}
          </button>
        </div>
      )}

    </div>
  );
};

export default RiderOrderDetails;