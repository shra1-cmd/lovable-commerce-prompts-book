import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, name, email, phone, purpose } = await req.json();

    if (!amount || !name || !email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const amountInPaise = parseInt(amount) * 100;
    if (amountInPaise < 10000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Minimum donation is ₹100' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_test_SQCrzn9z0ZlvCa';
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') || 'OVT6c1Q2wYjA2D7HDTwkXYOL';

    // Create Razorpay order
    const receipt = `donation_${Date.now()}`;
    const orderPayload = {
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        donor_name: name,
        donor_email: email,
        donor_phone: phone || '',
        purpose: purpose || 'General Donation',
      },
    };

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
      },
      body: JSON.stringify(orderPayload),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay order creation failed:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: `Razorpay error: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = await razorpayResponse.json();

    return new Response(
      JSON.stringify({ success: true, order }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
