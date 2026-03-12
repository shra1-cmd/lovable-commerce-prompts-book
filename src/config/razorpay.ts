// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  // Test Keys - Replace with your actual Razorpay keys
  TEST_KEY_ID: import.meta.env.VITE_RAZORPAY_TEST_KEY || "rzp_test_3qZvN5LXUPhYQK",
  LIVE_KEY_ID: import.meta.env.VITE_RAZORPAY_LIVE_KEY || "rzp_test_3qZvN5LXUPhYQK", // TODO: Replace with your actual live key
  
  // Supabase Edge Function URL - NEW CLOUD PROJECT
  EDGE_FUNCTION_URL: `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'cpuuqugujovqgnnmdqqk'}.supabase.co/functions/v1/create-donation`,
  
  // NGO Details
  NGO_NAME: "Garuda Dhhruvam NGO",
  NGO_DESCRIPTION: "Donation for Rural Development",
  
  // Theme
  THEME_COLOR: "#FBC02D", // Turmeric color
  
  // Currency
  CURRENCY: "INR",
  
  // Environment
  ENVIRONMENT: process.env.NODE_ENV === 'production' ? 'live' : 'test',
  
  // Get the appropriate key based on environment
  getKeyId: () => {
    return process.env.NODE_ENV === 'production' 
      ? RAZORPAY_CONFIG.LIVE_KEY_ID 
      : RAZORPAY_CONFIG.TEST_KEY_ID;
  }
};

// Types for Razorpay
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
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
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface DonationPayload {
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