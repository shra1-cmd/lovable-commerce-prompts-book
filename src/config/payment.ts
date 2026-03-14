// Payment Configuration
export const PAYMENT_CONFIG = {
  // Razorpay Keys
  RAZORPAY_TEST_KEY: import.meta.env.VITE_RAZORPAY_TEST_KEY || "rzp_test_SQCrzn9z0ZlvCa",
  RAZORPAY_LIVE_KEY: import.meta.env.VITE_RAZORPAY_LIVE_KEY || "rzp_test_SQCrzn9z0ZlvCa",
  
  // Edge Function URLs
  CREATE_ORDER_URL: `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'cpuuqugujovqgnnmdqqk'}.supabase.co/functions/v1/create-order`,
  VERIFY_PAYMENT_URL: `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'cpuuqugujovqgnnmdqqk'}.supabase.co/functions/v1/verify-payment`,
  
  // NGO Details
  NGO_NAME: "Garuda Dhhruvam Foundation",
  NGO_DESCRIPTION: "Donation for Rural Development and Cultural Preservation",
  
  // Theme
  THEME_COLOR: "#FBC02D", // Turmeric color
  
  // Currency
  CURRENCY: "INR",
  
  // Environment
  ENVIRONMENT: import.meta.env.MODE === 'production' ? 'live' : 'test',
  
  // Get the appropriate key based on environment
  getKeyId: () => {
    return import.meta.env.MODE === 'production' 
      ? PAYMENT_CONFIG.RAZORPAY_LIVE_KEY 
      : PAYMENT_CONFIG.RAZORPAY_TEST_KEY;
  }
};

// Types for Payment
export interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  notes: {
    purpose?: string;
    anonymous?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: PaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface DonationData {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  purpose?: string;
  isAnonymous: boolean;
}

export interface CreateOrderRequest {
  amount: string;
  name: string;
  email: string;
  phone?: string;
  purpose?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
  key_id?: string;
  error?: string;
}

export interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: string;
  purpose?: string;
  is_anonymous: boolean;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  payment_id?: string;
  amount?: string;
  error?: string;
} 