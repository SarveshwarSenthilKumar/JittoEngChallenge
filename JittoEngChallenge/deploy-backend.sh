#!/bin/bash

# Backend Deployment Script for Jitto Full Stack Engineering Challenge
# This script helps deploy the backend.py to AWS Lambda

set -e  # Exit on any error

echo "🚀 Starting backend deployment..."

# Check if backend.py exists
if [ ! -f "backend.py" ]; then
    echo "❌ Error: backend.py not found in current directory"
    exit 1
fi

# Create deployment directory
echo "📁 Creating deployment directory..."
rm -rf lambda-deployment
mkdir lambda-deployment
cd lambda-deployment

# Copy backend code
echo "📋 Copying backend code..."
cp ../backend.py .

# Test the function locally
echo "🧪 Testing function locally..."
python backend.py

# Create deployment package
echo "📦 Creating deployment package..."
zip -r function.zip backend.py

echo "✅ Deployment package created: lambda-deployment/function.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to AWS Lambda Console"
echo "2. Create a new function with Python 3.12 runtime"
echo "3. Upload the function.zip file"
echo "4. Set handler to: backend.lambda_handler"
echo "5. Configure memory (512 MB) and timeout (30 seconds)"
echo "6. Create API Gateway integration"
echo ""
echo "🔗 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "📊 Package size: $(du -h function.zip | cut -f1)" 