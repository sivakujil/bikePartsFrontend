import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Package,
  CheckCircle,
  Clock,
  Navigation,
  Camera,
  Upload,
  DollarSign,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const DeliveryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrders, deliverOrder, uploadProof, updateOrderStatus } = useRiderAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [otp, setOtp] = useState('');
  const [cashCollected, setCashCollected] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  useEffect(() => {
    // Initialize map when order data is loaded
    if (order && order.delivery && window.google) {
      initializeMap();
    }
  }, [order]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const result = await getOrders();

      if (result.success) {
        const allOrders = [
          ...result.data.new,
          ...result.data.pending,
          ...result.data.completed
        ];
        const foundOrder = allOrders.find(o => o._id === id);
        setOrder(foundOrder);
        if (foundOrder && foundOrder.codAmount) {
          setCashCollected(foundOrder.codAmount.toString());
        }
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!window.google || !order.delivery) return;

    const deliveryLocation = {
      lat: order.delivery.lat,
      lng: order.delivery.lng
    };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: deliveryLocation,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#1e293b' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#1e293b' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#94a3b8' }]
        }
      ]
    });

    // Add marker for delivery location
    new window.google.maps.Marker({
      position: deliveryLocation,
      map: mapInstanceRef.current,
      title: 'Delivery Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
            <path d="M20 10l6 6-6 10-6-10z" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      const result = await updateOrderStatus(id, newStatus);
      if (result.success) {
        setOrder({ ...order, status: newStatus });
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliver = async () => {
    if (order.codAmount > 0 && !cashCollected) {
      toast.error('Please enter cash collected amount');
      return;
    }

    if (order.otpDelivery && !otp) {
      toast.error('Please enter delivery OTP');
      return;
    }

    try {
      setActionLoading(true);
      const result = await deliverOrder(id, {
        otp: otp || undefined,
        cashCollected: cashCollected ? parseFloat(cashCollected) : undefined
      });

      if (result.success) {
        setOrder({ ...order, status: 'delivered', deliveredAt: new Date() });
        toast.success('Order delivered successfully!');
        // Redirect to dashboard after success
        setTimeout(() => {
          navigate('/rider/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error delivering order:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProofUpload = async () => {
    if (!proofFile) {
      toast.error('Please select a proof image');
      return;
    }

    try {
      setActionLoading(true);
      const result = await uploadProof(id, proofFile);
      if (result.success) {
        setOrder({ ...order, photos: [...(order.photos || []), result.data.proofUrl] });
        setProofFile(null);
        toast.success('Delivery proof uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Order Not Found</h2>
          <p className="text-slate-400 mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isDelivered = order.status === 'delivered';
  const canDeliver = ['picked_up', 'out_for_delivery'].includes(order.status);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <button
            onClick={() => navigate('/rider/order/' + id)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Deliver Order #{order.orderId}</h1>
            <p className="text-slate-400 text-sm">Delivery location and final steps</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map and Location */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Navigation className="w-5 h-5 mr-2" />
                Delivery Location
              </h2>

              <div
                ref={mapRef}
                className="w-full h-64 bg-slate-700 rounded-lg"
                style={{ minHeight: '256px' }}
              />

              {!window.google && (
                <div className="w-full h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">Map loading...</p>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 mt-0.5 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{order.delivery?.address}</p>
                    <p className="text-sm text-slate-400">
                      Customer: {order.delivery?.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${order.delivery?.lat},${order.delivery?.lng}`)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Details
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="font-medium text-lg">{order.delivery?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {order.delivery?.phone}
                  </p>
                </div>

                {order.codAmount > 0 && (
                  <div>
                    <p className="text-sm text-slate-400">Amount to Collect</p>
                    <p className="font-medium text-green-400 text-lg">Rs {order.codAmount}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions and Status */}
          <div className="space-y-6">
            {/* Status Updates */}
            {!isDelivered && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-lg font-semibold mb-4">Update Status</h2>

                <div className="space-y-3">
                  {order.status === 'picked_up' && (
                    <button
                      onClick={() => handleStatusUpdate('out_for_delivery')}
                      disabled={actionLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {actionLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Navigation className="w-5 h-5 mr-2" />
                          Start Delivery
                        </>
                      )}
                    </button>
                  )}

                  <div className="text-sm text-slate-400">
                    Current status: <span className="text-white font-medium">
                      {order.status === 'picked_up' ? 'Picked Up' :
                       order.status === 'out_for_delivery' ? 'Out for Delivery' : order.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Action */}
            {canDeliver && !isDelivered && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-lg font-semibold mb-4">Complete Delivery</h2>

                <div className="space-y-4">
                  {/* OTP Input */}
                  {order.otpDelivery && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Delivery OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter OTP from customer"
                      />
                    </div>
                  )}

                  {/* Cash Collection */}
                  {order.codAmount > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Cash Collected (Rs {order.codAmount})
                      </label>
                      <input
                        type="number"
                        value={cashCollected}
                        onChange={(e) => setCashCollected(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter amount collected"
                      />
                    </div>
                  )}

                  {/* Delivery Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none"
                      placeholder="Add any notes about the delivery..."
                    />
                  </div>

                  <button
                    onClick={handleDeliver}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Complete Delivery
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Proof */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Delivery Proof
              </h2>

              <div className="space-y-4">
                {order.photos && order.photos.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Uploaded Proofs:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {order.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files[0])}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                  />

                  {proofFile && (
                    <button
                      onClick={handleProofUpload}
                      disabled={actionLoading}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {actionLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Proof
                        </>
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  Upload photos of successful delivery for verification
                </p>
              </div>
            </div>

            {/* Delivery Complete */}
            {isDelivered && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                  <h2 className="text-lg font-semibold text-green-400">Delivery Complete!</h2>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">
                    Order #{order.orderId} has been successfully delivered.
                  </p>
                  {order.deliveredAt && (
                    <p className="text-slate-400">
                      Delivered at: {new Date(order.deliveredAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate('/rider/dashboard')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center mt-4"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;