import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/api/orderService';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Delivery Information
    deliveryType: 'pickup',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Order Details
    scheduledDate: '',
    scheduledTime: '',
    specialInstructions: '',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const deliveryFee = formData.deliveryType === 'delivery' ? 5 : 0;
  const total = subtotal + tax + deliveryFee;
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }
    
    if (stepNumber === 2) {
      if (formData.deliveryType === 'delivery') {
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
      }
      if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
      if (!formData.scheduledTime) newErrors.scheduledTime = 'Scheduled time is required';
    }
    
    if (stepNumber === 3) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    try {
      setLoading(true);
      
      const orderData = {
        items: cart,
        deliveryType: formData.deliveryType,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.deliveryType === 'delivery' ? {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          } : null
        },
        specialInstructions: formData.specialInstructions,
        total: total,
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee
      };
      
      const order = await orderService.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.Id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const deliveryOptions = [
    { value: 'pickup', label: 'Store Pickup (Free)' },
    { value: 'delivery', label: 'Delivery (+$5.00)' }
  ];
  
  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' }
  ];
  
  const stateOptions = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' }
  ];
  
  return (
    <div className="min-h-screen bg-vanilla py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-6 flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          Back to Cart
        </Button>
        
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step ? 'bg-caramel text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                <span className={`ml-2 text-sm ${
                  stepNumber <= step ? 'text-caramel font-medium' : 'text-gray-500'
                }`}>
                  {stepNumber === 1 ? 'Contact' : stepNumber === 2 ? 'Delivery' : 'Payment'}
                </span>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    stepNumber < step ? 'bg-caramel' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-display text-chocolate mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange('firstName', value)}
                  error={errors.firstName}
                  required
                />
                <FormField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange('lastName', value)}
                  error={errors.lastName}
                  required
                />
                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  error={errors.email}
                  required
                />
                <FormField
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  error={errors.phone}
                  required
                />
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-display text-chocolate mb-6">Delivery Information</h2>
              
              <FormField
                label="Delivery Method"
                type="select"
                value={formData.deliveryType}
                onChange={(value) => handleInputChange('deliveryType', value)}
                options={deliveryOptions}
                required
              />
              
              {formData.deliveryType === 'delivery' && (
                <div className="space-y-4">
                  <FormField
                    label="Address"
                    value={formData.address}
                    onChange={(value) => handleInputChange('address', value)}
                    error={errors.address}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      label="City"
                      value={formData.city}
                      onChange={(value) => handleInputChange('city', value)}
                      error={errors.city}
                      required
                    />
                    <FormField
                      label="State"
                      type="select"
                      value={formData.state}
                      onChange={(value) => handleInputChange('state', value)}
                      options={stateOptions}
                      error={errors.state}
                      required
                    />
                    <FormField
                      label="Zip Code"
                      value={formData.zipCode}
                      onChange={(value) => handleInputChange('zipCode', value)}
                      error={errors.zipCode}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Scheduled Date"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(value) => handleInputChange('scheduledDate', value)}
                  error={errors.scheduledDate}
                  required
                />
                <FormField
                  label="Scheduled Time"
                  type="select"
                  value={formData.scheduledTime}
                  onChange={(value) => handleInputChange('scheduledTime', value)}
                  options={timeSlots}
                  error={errors.scheduledTime}
                  required
                />
              </div>
              
              <FormField
                label="Special Instructions (Optional)"
                value={formData.specialInstructions}
                onChange={(value) => handleInputChange('specialInstructions', value)}
                placeholder="Any special requirements or notes..."
              />
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-display text-chocolate mb-6">Payment Information</h2>
              
              <div className="bg-cream rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-chocolate mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <PriceDisplay price={subtotal} className="text-sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <PriceDisplay price={tax} className="text-sm" />
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <PriceDisplay price={deliveryFee} className="text-sm" />
                    </div>
                  )}
                  <div className="border-t pt-1 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <PriceDisplay price={total} className="text-sm" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <FormField
                  label="Card Number"
                  value={formData.cardNumber}
                  onChange={(value) => handleInputChange('cardNumber', value)}
                  placeholder="1234 5678 9012 3456"
                  error={errors.cardNumber}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={(value) => handleInputChange('expiryDate', value)}
                    placeholder="MM/YY"
                    error={errors.expiryDate}
                    required
                  />
                  <FormField
                    label="CVV"
                    value={formData.cvv}
                    onChange={(value) => handleInputChange('cvv', value)}
                    placeholder="123"
                    error={errors.cvv}
                    required
                  />
                </div>
                <FormField
                  label="Cardholder Name"
                  value={formData.cardholderName}
                  onChange={(value) => handleInputChange('cardholderName', value)}
                  error={errors.cardholderName}
                  required
                />
              </div>
            </motion.div>
          )}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 3 ? (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;