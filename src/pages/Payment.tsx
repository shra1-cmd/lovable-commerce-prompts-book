
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy, Upload, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode';

const Payment = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upiLink, setUpiLink] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/products');
      return;
    }

    generateUpiPayment();
  }, [user, cartItems, navigate]);

  const generateUpiPayment = async () => {
    const amount = cartTotal.toFixed(2);
    const upiPaymentLink = `upi://pay?pa=sunny6060@axl&pn=ShopHub&am=${amount}&cu=INR`;
    setUpiLink(upiPaymentLink);

    try {
      const qrUrl = await QRCode.toDataURL(upiPaymentLink, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const copyPaymentLink = async () => {
    try {
      await navigator.clipboard.writeText(upiLink);
      toast.success('Payment link copied to clipboard ✅');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setPaymentFile(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const uploadPaymentProof = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `payment-screenshots/${fileName}`;

    try {
      const { error } = await supabase.storage
        .from('payment-screenshots')
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentFile) {
      toast.error('Please upload payment screenshot');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload screenshot
      const uploadedFileUrl = await uploadPaymentProof(paymentFile);
      if (!uploadedFileUrl) {
        toast.error('Failed to upload screenshot');
        return;
      }

      // Create order first
      const orderData = {
        user_id: user?.id,
        total: cartTotal,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.image_url
        })),
        status: 'processing'
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert payment proof
      const paymentProofData = {
        user_id: user?.id,
        order_id: order.id,
        payment_amount: cartTotal,
        uploaded_file: uploadedFileUrl,
        txn_id: transactionId || null,
        status: 'pending'
      };

      const { error: proofError } = await supabase
        .from('payment_proofs')
        .insert(paymentProofData);

      if (proofError) throw proofError;

      // Clear cart
      await clearCart();

      toast.success('✅ Payment request submitted. You will be notified after confirmation.');
      navigate('/orders');

    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Complete Payment</h1>
          <p className="text-xl text-gray-300">Secure UPI Payment</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Amount: ₹{cartTotal.toFixed(2)}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Scan this QR code with any UPI app (GPay, PhonePe, Paytm)
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI Payment QR Code" 
                    className="w-64 h-64"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Generating QR...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Copy Payment Link */}
            <div className="text-center">
              <Button
                onClick={copyPaymentLink}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <Copy className="h-4 w-4" />
                Copy Payment Link
              </Button>
            </div>

            {/* Payment Proof Upload */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-proof" className="text-sm font-medium text-gray-700">
                  Upload UPI Payment Proof *
                </Label>
                <Input
                  id="payment-proof"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                {paymentFile && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{paymentFile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="txn-id" className="text-sm font-medium text-gray-700">
                  Enter UPI Transaction ID (Ref No) - Optional
                </Label>
                <Input
                  id="txn-id"
                  type="text"
                  placeholder="e.g., 123456789012"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Confirm Payment Button */}
            <Button
              onClick={handleConfirmPayment}
              disabled={!paymentFile || isSubmitting}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Confirm Payment
                </div>
              )}
            </Button>

            {/* Support Info */}
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                If you face issues, contact{' '}
                <a href="mailto:support@shophub.in" className="font-semibold underline">
                  support@shophub.in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
