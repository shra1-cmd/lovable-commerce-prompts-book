import React, { useState } from 'react';
import { Heart, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PAYMENT_CONFIG, PaymentOptions, PaymentResponse, DonationData, CreateOrderRequest, VerifyPaymentRequest } from '@/config/payment';

// Add Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DonationFormProps {
  onDonate: (donationData: DonationData) => void;
  isLoading?: boolean;
}

const DonationFormNew: React.FC<DonationFormProps> = ({ onDonate, isLoading = false }) => {
  const [form, setForm] = useState({
    amount: '',
    customAmount: '',
    name: '',
    email: '',
    phone: '',
    purpose: '',
    is_anonymous: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [500, 2000, 5000];

  const handleAmountSelect = (amt: number) => {
    setForm((prev) => ({ ...prev, amount: amt.toString(), customAmount: '' }));
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, customAmount: value, amount: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = form.amount || form.customAmount;
    
    if (!form.name || !form.email || !finalAmount) {
      alert('Please fill all required fields');
      return;
    }

    if (parseInt(finalAmount) < 100) {
      alert('Minimum donation amount is ₹100');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create Razorpay order securely via Edge Function
      const normalizedPhone = form.phone.replace(/\D/g, '').slice(-10);

      const orderRequest: CreateOrderRequest = {
        amount: finalAmount,
        name: form.name,
        email: form.email,
        phone: normalizedPhone || undefined,
        purpose: form.purpose || "General Donation",
      };

      const orderResponse = await fetch(PAYMENT_CONFIG.CREATE_ORDER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(orderRequest),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Edge function error:', errorText);
        alert(`❌ Failed to create order: HTTP ${orderResponse.status} - ${errorText}`);
        return;
      }

      const orderData = await orderResponse.json();

      if (!orderData.success || !orderData.order?.id || !orderData.order?.amount) {
        alert(`❌ Failed to create order: ${orderData.error || 'Invalid order response'}`);
        return;
      }

      if (!window.Razorpay) {
        alert('❌ Payment SDK failed to load. Please refresh and try again.');
        return;
      }

      const checkoutKey = orderData.key_id || PAYMENT_CONFIG.getKeyId();

      // Step 2: Configure Razorpay with the created order
      const options: PaymentOptions = {
        key: checkoutKey,
        amount: orderData.order.amount,
        currency: PAYMENT_CONFIG.CURRENCY,
        name: PAYMENT_CONFIG.NGO_NAME,
        description: PAYMENT_CONFIG.NGO_DESCRIPTION,
        order_id: orderData.order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: normalizedPhone || undefined,
        },
        notes: {
          purpose: form.purpose || "General Donation",
          anonymous: form.is_anonymous ? "Yes" : "No",
        },
        theme: {
          color: PAYMENT_CONFIG.THEME_COLOR,
        },
        handler: async function (response: PaymentResponse) {
          try {
            const payload: VerifyPaymentRequest = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              donor_name: form.name,
              donor_email: form.email,
              donor_phone: normalizedPhone || undefined,
              amount: finalAmount,
              purpose: form.purpose || "General Donation",
              is_anonymous: form.is_anonymous,
            };

            const res = await fetch(PAYMENT_CONFIG.VERIFY_PAYMENT_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
              alert("✅ Thank you! Your donation was successful.");
              const donationData: DonationData = {
                amount: parseInt(finalAmount),
                donorName: form.name.trim(),
                donorEmail: form.email.trim(),
                donorPhone: normalizedPhone || undefined,
                purpose: form.purpose.trim() || undefined,
                isAnonymous: form.is_anonymous
              };
              onDonate(donationData);
            } else {
              const errorMessage = data.error || data.message || 'Unknown error occurred';
              alert(`❌ Payment failed: ${errorMessage}`);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`❌ Payment verification failed: ${errorMessage}`);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      // Step 3: Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        const reason = response?.error?.description || response?.error?.reason || 'Payment failed at gateway';
        alert(`❌ ${reason}`);
        setIsProcessing(false);
      });
      rzp.open();
      
    } catch (error) {
      console.error('Failed to create order:', error);
      alert("❌ Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getImpactMessage = (amount: string) => {
    const amt = parseInt(amount);
    if (amt >= 5000) return "Can support child home for a week";
    if (amt >= 2000) return "Can restore temple artwork";
    if (amt >= 500) return "Can skill one woman for a month";
    return "Will make a significant difference";
  };

  const finalAmount = form.amount || form.customAmount;

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-turmeric/10 p-3 rounded-full">
              <Heart className="w-8 h-8 text-turmeric" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Make a Donation
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your contribution helps us revive India's spiritual heritage
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Select Amount</Label>
              
              {/* Preset Amounts */}
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={form.amount === amount.toString() ? "default" : "outline"}
                    className="h-12"
                    onClick={() => handleAmountSelect(amount)}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label htmlFor="customAmount" className="text-sm">Custom Amount</Label>
                <Input
                  type="number"
                  id="customAmount"
                  name="customAmount"
                  placeholder="Enter amount (min ₹100)"
                  value={form.customAmount}
                  onChange={handleCustomAmount}
                  min="100"
                  className="w-full"
                />
              </div>

              {/* Impact Message */}
              {finalAmount && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      {getImpactMessage(finalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Donor Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm">Full Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">Email Address *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">Phone Number (Optional)</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="purpose" className="text-sm">Purpose (Optional)</Label>
                <Input
                  type="text"
                  id="purpose"
                  name="purpose"
                  placeholder="Purpose (optional)"
                  value={form.purpose}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Anonymous Donation */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_anonymous"
                name="is_anonymous"
                checked={form.is_anonymous}
                onCheckedChange={(checked) => 
                  setForm(prev => ({ ...prev, is_anonymous: checked as boolean }))
                }
              />
              <Label htmlFor="is_anonymous" className="text-sm">
                Make this an anonymous donation
              </Label>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Secure Payment</p>
                  <p>Your payment is processed securely by Razorpay</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={isProcessing || isLoading}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Donate ₹{finalAmount || '0'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationFormNew; 