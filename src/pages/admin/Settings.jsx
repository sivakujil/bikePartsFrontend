import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Edit,
  Loader2,
  Calendar,
  Key
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminSettings = () => {
  const { user, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/auth/profile', formData);
      if (response.data) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Update local storage and context
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload(); // Simple way to refresh context
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-xl font-bold mb-2 text-gray-900">{user.name}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>

            {/* Admin Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <Shield className="w-4 h-4 mr-1" />
                Administrator
              </span>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{user.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Read-only fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-purple-700 font-medium">Administrator</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Login
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Key className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Admin Permissions Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Administrative Permissions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Products Management',
            'Orders Management',
            'Customer Support',
            'Rider Management',
            'Reports & Analytics',
            'System Settings'
          ].map((permission, index) => (
            <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800 font-medium">{permission}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> As an administrator, you have full access to all system features and can manage users, products, orders, and system settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;