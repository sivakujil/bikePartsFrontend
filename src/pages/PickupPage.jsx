import React, { useState, useEffect } from 'react';
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
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

const PickupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrders, pickupOrder, uploadProof } = useRiderAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [pickupNotes, setPickupNotes] = useState('');

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

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
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async () => {
    try {
      setActionLoading(true);
      const result = await pickupOrder(id);
      if (result.success) {
        setOrder({ ...order, status: 'picked_up', pickupTime: new Date() });
        toast.success('Order picked up successfully!');
        // Redirect to delivery page after a short delay
        setTimeout(() => {
          navigate(`/rider/delivery/${id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error picking up order:', error);
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
        toast.success('Pickup proof uploaded successfully');
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

  const isPickedUp = order.status !== 'assigned';

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <button
            onClick={() => navigate('/rider/order/' + id)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Pickup Order #{order.orderId}</h1>
            <p className="text-slate-400 text-sm">Pickup location details and actions</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pickup Information */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Pickup Status</h2>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  isPickedUp ? 'bg-green-500' : 'bg-yellow-500'
                } text-white`}>
                  {isPickedUp ? 'Picked Up' : 'Ready for Pickup'}
                </span>
              </div>

              {isPickedUp && order.pickupTime && (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">
                    Picked up at {new Date(order.pickupTime).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Pickup Location */}
            {order.pickup && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Pickup Location
                </h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Business Name</p>
                    <p className="font-medium text-lg">{order.pickup.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Address</p>
                    <p className="font-medium">{order.pickup.address}</p>
                  </div>

                  {order.pickup.phone && (
                    <div>
                      <p className="text-sm text-slate-400">Contact</p>
                      <p className="font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.pickup.phone}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${order.pickup.lat},${order.pickup.lng}`)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center mt-4"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Get Directions
                  </button>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </h2>

              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">Rs {item.price}</p>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                  <p className="font-semibold">Total Value</p>
                  <p className="font-semibold text-primary-400">Rs {order.codAmount || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            {/* Pickup Action */}
            {!isPickedUp && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-lg font-semibold mb-4">Pickup Action</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Pickup Notes (Optional)
                    </label>
                    <textarea
                      value={pickupNotes}
                      onChange={(e) => setPickupNotes(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
                      placeholder="Add any notes about the pickup..."
                    />
                  </div>

                  <button
                    onClick={handlePickup}
                    disabled={actionLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirm Pickup
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Pickup Proof */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Pickup Proof
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
                  Upload a photo of the picked up items for verification
                </p>
              </div>
            </div>

            {/* Next Steps */}
            {isPickedUp && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                  <h2 className="text-lg font-semibold text-green-400">Pickup Complete!</h2>
                </div>

                <p className="text-slate-300 mb-4">
                  The order has been successfully picked up. You can now proceed to deliver it to the customer.
                </p>

                <button
                  onClick={() => navigate(`/rider/delivery/${id}`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Start Delivery
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupPage;