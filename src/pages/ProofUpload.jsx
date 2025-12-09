import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import {
  ArrowLeft,
  Camera,
  Upload,
  X,
  CheckCircle,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProofUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { uploadProof, getOrders } = useRiderAuth();
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [order, setOrder] = useState(null);

  React.useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      const result = await getOrders();
      if (result.success) {
        const allOrders = [
          ...result.data.new,
          ...result.data.pending,
          ...result.data.completed
        ];
        const foundOrder = allOrders.find(o => o._id === id);
        setOrder(foundOrder);
        if (foundOrder?.photos) {
          setUploadedUrls(foundOrder.photos);
        }
      }
    } catch (_error) {
      console.error('Error loading order:', _error);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, {
          file,
          preview: e.target.result,
          id: Date.now() + Math.random()
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const file of selectedFiles) {
        try {
          const result = await uploadProof(id, file);
          if (result.success) {
            setUploadedUrls(prev => [...prev, result.data.proofUrl]);
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error('Upload error:', error);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}`);
        setSelectedFiles([]);
        setPreviews([]);
        loadOrderDetails(); // Refresh order data
      }

      if (failCount > 0) {
        toast.error(`Failed to upload ${failCount} image${failCount > 1 ? 's' : ''}`);
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
            <h1 className="text-xl font-bold">Upload Delivery Proof</h1>
            <p className="text-slate-400 text-sm">Order #{order?.orderId}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Upload Area */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <div className="text-center mb-6">
            <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Upload Proof Images</h2>
            <p className="text-slate-400">
              Add photos to verify your delivery completion
            </p>
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={triggerFileInput}
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
          >
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">Click to select images</p>
            <p className="text-sm text-slate-500">
              PNG, JPG, JPEG up to 5MB each
            </p>
          </div>

          {/* Selected Files Preview */}
          {previews.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Selected Images ({previews.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={preview.id} className="relative group">
                    <img
                      src={preview.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {(preview.file.size / 1024 / 1024).toFixed(1)}MB
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload {previews.length} Image{previews.length > 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Previously Uploaded Images */}
        {uploadedUrls.length > 0 && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Previously Uploaded ({uploadedUrls.length})
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Uploaded proof ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium mb-3 text-blue-400">Upload Guidelines</h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• Take clear photos of the delivered items</li>
            <li>• Include the delivery location in some photos</li>
            <li>• Capture the customer's signature if possible</li>
            <li>• Ensure good lighting for clear images</li>
            <li>• Maximum 5MB per image</li>
            <li>• Supported formats: PNG, JPG, JPEG</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => navigate('/rider/order/' + id)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Back to Order
          </button>

          <button
            onClick={() => navigate('/rider/dashboard')}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProofUpload;