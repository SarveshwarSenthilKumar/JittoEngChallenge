# Deployment Guide - Jitto Full Stack Engineering Challenge

This guide will walk you through deploying both the backend (AWS Lambda) and frontend (React) components of the "Are Streaks Real?" application.

## 🚀 Backend Deployment (AWS Lambda)

### Prerequisites
- AWS Account
- AWS CLI installed and configured
- Python 3.12 installed locally

### Step 1: Prepare the Lambda Function

1. **Create a deployment package:**
   ```bash
   # Create a deployment directory
   mkdir lambda-deployment
   cd lambda-deployment
   
   # Copy the backend code
   cp ../backend.py .
   
   # Create the deployment ZIP (no external dependencies needed)
   zip function.zip backend.py
   ```

2. **Test locally first:**
   ```bash
   python backend.py
   ```
   This should run the test function and show sample output.

### Step 2: Deploy to AWS Lambda

#### Option A: AWS Console (Recommended for beginners)

1. **Create Lambda Function:**
   - Go to AWS Lambda Console
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: `streak-analyzer`
   - Runtime: Python 3.12
   - Architecture: x86_64
   - Click "Create function"

2. **Upload Code:**
   - In the "Code" tab, click "Upload from" → ".zip file"
   - Upload your `function.zip`
   - Click "Save"

3. **Configure Handler:**
   - In "Runtime settings", set Handler to: `backend.lambda_handler`
   - Click "Save"

4. **Set Memory and Timeout:**
   - In "Configuration" → "General configuration"
   - Memory: 512 MB (or higher for large sequences)
   - Timeout: 30 seconds
   - Click "Save"

#### Option B: AWS CLI

```bash
# Create the function
aws lambda create-function \
  --function-name streak-analyzer \
  --runtime python3.12 \
  --role arn:aws:iam::YOUR-ACCOUNT-ID:role/lambda-execution-role \
  --handler backend.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512

# Update function code
aws lambda update-function-code \
  --function-name streak-analyzer \
  --zip-file fileb://function.zip
```

### Step 3: Create API Gateway

1. **Create REST API:**
   - Go to API Gateway Console
   - Click "Create API"
   - Choose "REST API" → "Build"
   - API name: `streak-analyzer-api`
   - Click "Create API"

2. **Create Resource and Method:**
   - Click "Actions" → "Create Resource"
   - Resource Name: `analyze`
   - Click "Create Resource"
   - Click "Actions" → "Create Method"
   - Method: `POST`
   - Integration type: Lambda Function
   - Lambda Function: `streak-analyzer`
   - Click "Save"

3. **Enable CORS:**
   - Select the `/analyze` resource
   - Click "Actions" → "Enable CORS"
   - Access-Control-Allow-Origin: `*`
   - Access-Control-Allow-Headers: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
   - Access-Control-Allow-Methods: `GET,POST,OPTIONS`
   - Click "Enable CORS and replace existing CORS headers"

4. **Deploy API:**
   - Click "Actions" → "Deploy API"
   - Stage name: `prod`
   - Click "Deploy"

5. **Get the API URL:**
   - Note the "Invoke URL" (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

### Step 4: Export CloudFormation Template

1. **From API Gateway Console:**
   - Select your API
   - Click "Actions" → "Export API"
   - Format: YAML
   - Click "Export"

2. **From Lambda Console:**
   - Select your function
   - Click "Actions" → "Export function"
   - Format: YAML
   - Click "Export"

3. **Combine templates** into a single `cloudformation.yaml` file for your repository.

## 🎨 Frontend Deployment

### Step 1: Configure Environment Variables

1. **Create `.env` file:**
   ```bash
   # In your project root
   echo "VITE_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/analyze" > .env
   ```

2. **Replace the URL** with your actual API Gateway URL from Step 3.

### Step 2: Build and Deploy

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Add `VITE_API_URL` with your API Gateway URL

#### Option B: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag the `dist` folder to Netlify
   - Or use Netlify CLI

3. **Set environment variables** in Netlify dashboard.

#### Option C: GitHub Pages

1. **Add to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/jitto-eng-challenge",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

## 🔧 Testing the Complete Setup

### 1. Test Backend Locally
```bash
python backend.py
```

### 2. Test Backend via API Gateway
```bash
curl -X POST https://your-api-url.execute-api.region.amazonaws.com/prod/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "success_rate": 0.5,
    "num_sequences": 1000,
    "seed": 42
  }'
```

### 3. Test Frontend
1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Run an experiment and verify results appear

## 📊 Cost Estimation

### AWS Lambda Costs (us-east-1)
- **Free tier:** 1M requests/month, 400,000 GB-seconds/month
- **Beyond free tier:** $0.20 per 1M requests + $0.0000166667 per GB-second

### Example Calculation
- 10,000 sequences per request
- 512 MB memory allocation
- 30-second timeout
- 100 requests/month

**Cost:** ~$0.01/month (well within free tier)

### API Gateway Costs
- **Free tier:** 1M requests/month
- **Beyond free tier:** $3.50 per million requests

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure CORS is properly configured in API Gateway
   - Check that your frontend URL is allowed

2. **Lambda Timeout:**
   - Increase timeout for large sequence counts
   - Consider using async processing for very large datasets

3. **Memory Issues:**
   - Increase Lambda memory allocation
   - Optimize the algorithm for memory usage

4. **API Gateway 403:**
   - Check Lambda permissions
   - Verify API Gateway integration

### Debugging

1. **Check Lambda Logs:**
   - Go to CloudWatch → Log groups
   - Find your function's logs

2. **Test API Gateway:**
   - Use the "Test" feature in API Gateway console
   - Check request/response mapping

3. **Frontend Debugging:**
   - Open browser developer tools
   - Check Network tab for API calls
   - Look for console errors

## 📝 Final Checklist

- [ ] Backend deployed to AWS Lambda
- [ ] API Gateway configured with CORS
- [ ] CloudFormation template exported
- [ ] Frontend environment variables set
- [ ] Frontend deployed and accessible
- [ ] End-to-end testing completed
- [ ] Cost analysis documented
- [ ] README updated with deployment instructions

## 🔗 Useful Links

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/) 