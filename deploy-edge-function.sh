#!/bin/bash

# Deploy Supabase Edge Function
echo "🚀 Deploying create-donation Edge Function..."

# Navigate to the supabase directory
cd supabase

# Deploy the function
supabase functions deploy create-donation --project-ref cpuuqugujovqgnnmdqqk

echo "✅ Edge Function deployed successfully!"
echo "📝 Function URL: https://cpuuqugujovqgnnmdqqk.supabase.co/functions/v1/create-donation"
echo ""
echo "🔧 Next Steps:"
echo "1. Set up environment variables in Supabase dashboard"
echo "2. Test the function with a sample donation"
echo "3. Implement email receipt functionality (Step 6)" 