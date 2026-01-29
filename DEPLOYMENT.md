# Deployment Guide for Render

Follow these steps to deploy your Smart Fraud Detection app to Render as a **Static Site**.

## 1. Create a New Static Site on Render
1.  Log in to [Render](https://dashboard.render.com/).
2.  Click the **New** button and select **Static Site**.
3.  Connect your GitHub account and select the repository: `smart_fraud_detection`.

## 2. Configure Build Settings
Fill in the following details in the Render dashboard:

| Field | Value |
| :--- | :--- |
| **Name** | `smart-fraud-detection` (or your choice) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

## 3. Add Environment Variables
This is critical for the AI analysis to work:
1.  Go to the **Environment** tab in your Render service settings.
2.  Click **Add Environment Variable**.
3.  Key: `VITE_GEMINI_API_KEY`
4.  Value: `AIzaSyDf-luzttRaeBf-z9DV2zgamKm7CbkwxD8`

## 4. Deploy
1.  Click **Create Static Site**.
2.  Render will start building your project. Once finished, you'll get a URL like `https://smart-fraud-detection.onrender.com`.

---
> [!TIP]
> Since this is a Vite app, adding the `VITE_` prefix to your environment variables ensures they are baked into the build for use in the browser.
