import React, { useState, useRef } from 'react';
import { Copy, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import QRCode from 'qrcode';

interface UpiPaymentProps {
  totalAmount: number;
  cartItems: any[];
  onPaymentSubmitted: () => void;
}

const UpiPayment = ({ totalAmount, cartItems, onPaymentSubmitted }: UpiPaymentProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const upiId = "sunny6060@axl";
  const merchantName = "My Store";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${totalAmount}&cu=INR`;

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const qrUrl = await QRCode.toDataURL(upiUrl, {
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
      }
    };
    
    generateQR();
  }, [upiUrl]);

  const copyUpiLink = async () => {
    try {
      await navigator.clipboard.writeText(upiUrl);
      toast({
        title: "Link copied to clipboard ✅",
        description: "UPI link has been copied successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, JPEG)",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
  };

  const uploadScreenshot = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload screenshot",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to confirm payment",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: "Screenshot required",
        description: "Please upload a payment screenshot",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Upload screenshot
      const fileUrl = await uploadScreenshot(uploadedFile);
      if (!fileUrl) return;

      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          amount: totalAmount,
          status: 'pending',
          quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          items: cartItems.map(item => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.image_url
          }))
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Deduct stock for each product after order is created
      for (const item of cartItems) {
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', item.product_id)
          .single();

        if (fetchError) {
          console.error('Error fetching product stock:', fetchError);
          continue;
        }

        const newStock = Math.max(0, (product.quantity || 0) - item.quantity);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ quantity: newStock })
          .eq('id', item.product_id);

        if (updateError) {
          console.error('Error updating product stock:', updateError);
        } else {
          console.log(`Stock updated for product ${item.product_id}: ${product.quantity} -> ${newStock}`);
        }
      }

      // Insert payment proof
      const { error: proofError } = await supabase
        .from('payment_proofs')
        .insert({
          user_id: user.id,
          order_id: order.id,
          payment_amount: totalAmount,
          uploaded_file: fileUrl,
          status: 'pending'
        });

      if (proofError) throw proofError;

      // Clear cart
      const { error: cartError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      toast({
        title: "✅ Payment submitted for review",
        description: "Your payment will be verified by the admin shortly. Stock has been updated.",
      });

      onPaymentSubmitted();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to submit payment confirmation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-4">Please log in to continue to payment</h3>
        <Button onClick={() => window.location.href = '/auth'}>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Payment Amount */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
        <div className="text-3xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</div>
      </div>

      {/* QR Code */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 text-center">
        {qrCodeUrl && (
          <img 
            src={qrCodeUrl} 
            alt="UPI QR Code" 
            className="mx-auto mb-4 border border-gray-300 rounded-lg"
          />
        )}
        <h3 className="font-semibold mb-2">Scan QR Code to Pay</h3>
      </div>

      {/* UPI Link */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">UPI Link:</label>
        <div className="flex gap-2">
          <Input 
            value={upiUrl} 
            readOnly 
            className="text-xs bg-white"
          />
          <Button onClick={copyUpiLink} variant="outline" size="sm">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Instructions:</strong>
        </p>
        <p className="text-sm text-blue-700 mb-2">
          Scan the QR code above or click the link to pay via any UPI app like GPay, PhonePe, or Paytm.
        </p>
        <p className="text-sm text-blue-700">
          Once payment is done, upload a screenshot of your transaction below.
        </p>
      </div>

      {/* File Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Upload Payment Screenshot:</label>
        <div className="flex items-center gap-3">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Choose File
          </Button>
          {uploadedFile && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {uploadedFile.name}
            </span>
          )}
        </div>
      </div>

      {/* Confirm Payment Button */}
      <Button
        onClick={handleConfirmPayment}
        disabled={!uploadedFile || uploading || submitting}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500"
        size="lg"
      >
        {submitting ? 'Submitting...' : 'Confirm Payment'}
      </Button>

      {/* Admin Note */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your payment will be verified by the admin. You will receive confirmation shortly.
        </p>
      </div>
    </div>
  );
};

export default UpiPayment;
