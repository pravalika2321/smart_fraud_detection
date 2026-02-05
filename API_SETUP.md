# Gemini API Setup & Real-Time Configuration Guide

## ✅ Status: API Key Configured

Your Gemini API key has been configured in environment files.
- **API Key**: `YOUR_GEMINI_API_KEY` (replace with your actual key from Google AI Studio)
- **Environment Files Updated**: `.env` and `.env.local`

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will start at `http://localhost:3000` with real-time Gemini API integration.

---

## ⚙️ Configuration Details

### Environment Variables
The following variables are configured in `.env.local`:
```
VITE_GEMINI_API_KEY=AIzaSyDcxnhsOf6q5e0c2ixyDjZW7JNfkPgH504
```

### Features Enabled
✅ **Job Offer Analysis** - Real-time fraud detection using Gemini API
✅ **AI Chatbot** - Live conversation with FraudGuard Assistant
✅ **Error Handling** - Comprehensive timeout and error management
✅ **Request Timeout** - 30-second timeout for all API calls

---

## 🔧 Real-Time Enhancements Made

### 1. **Timeout Management**
- Added 30-second timeout for all API requests
- Prevents hanging requests and improves UX
- Location: `geminiService.ts` - `withTimeout()` helper function

### 2. **Better Error Handling**
- Specific error messages for different failure scenarios
- API key validation on initialization
- Response validation for job analysis
- Empty response handling for chat

### 3. **Improved Chat History**
- Validates message history before sending
- Removes empty messages
- Ensures proper user/model alternation
- Filters invalid entries

### 4. **Response Validation**
- Checks for required fields in job analysis response
- Validates JSON parsing
- Ensures confidence scores and risk rates are present
- Provides fallback to mock data if needed

---

## 🔍 File Structure & Integration Points

### Main Service File
**[geminiService.ts](geminiService.ts)**
- `analyzeJobOffer()` - Analyzes job offers for fraud detection
- `chatWithAI()` - Handles real-time chat conversations
- `getAI()` - Initializes Gemini API client
- `withTimeout()` - Adds timeout to promises

### Components Using API
- **[components/InputModule.tsx](components/InputModule.tsx)** - Job input form (calls `analyzeJobOffer`)
- **[components/Chatbot.tsx](components/Chatbot.tsx)** - Chat interface (calls `chatWithAI`)
- **[components/ResultsView.tsx](components/ResultsView.tsx)** - Displays analysis results

### Main App File
**[App.tsx](App.tsx)** - Coordinates all views and handles analysis flow

---

## 📋 API Response Format (Expected)

### Job Analysis Response
```json
{
  "result": "Genuine Job",
  "confidence_score": 95,
  "risk_rate": 5,
  "risk_level": "Low",
  "explanations": ["Standard salary range", "Verified company"],
  "safety_tips": ["Always verify sources", "Check company website"]
}
```

### Chat Response
Plain text string from the Gemini model

---

## 🛠️ Troubleshooting

### Issue: API Key Error
**Solution**: Ensure `.env.local` has the correct API key:
```
VITE_GEMINI_API_KEY=AIzaSyDcxnhsOf6q5e0c2ixyDjZW7JNfkPgH504
```

### Issue: "Request Timeout" Error
**Solution**: The API took longer than 30 seconds. This is normal for high-traffic periods. Retry the request.

### Issue: 404 Error on Chat/Analysis
**Solution**: The API key may not have access to `gemini-1.5-flash`. 
1. Visit https://aistudio.google.com/app/apikeys
2. Verify the API key is active
3. Enable the Generative AI API

### Issue: Authentication Failed (401/PERMISSION_DENIED)
**Solution**: Check that your API key is valid and has the required permissions.

---

## 🔐 Security Notes

⚠️ **Important**: The API key is currently in `.env.local` for development.
For production:
1. Use environment variables from your hosting provider
2. Never commit `.env.local` to version control (already in `.gitignore`)
3. Use backend proxy for API calls instead of frontend
4. Implement rate limiting

---

## 📊 API Limits

- **Rate Limit**: Google Generative AI Free tier: 60 requests/minute
- **Request Timeout**: 30 seconds
- **Model**: `gemini-1.5-flash` (optimized for speed)

---

## ✨ Real-Time Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Job Analysis | ✅ Active | Real-time fraud detection with 30s timeout |
| Chat Bot | ✅ Active | Live conversation with chat history |
| Error Handling | ✅ Active | User-friendly error messages |
| Timeout Protection | ✅ Active | Prevents hanging requests |
| Response Validation | ✅ Active | Ensures data integrity |
| History Management | ✅ Active | Proper message formatting |

---

## 🚀 Production Deployment

Before deploying to production, update your build configuration:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📞 Support

If you encounter issues:
1. Check the console for detailed error messages
2. Verify API key in `.env.local`
3. Test API key at https://aistudio.google.com
4. Check Google Cloud Console for quota limits

---

**Last Updated**: February 3, 2026
**API Status**: ✅ Configured and Ready
