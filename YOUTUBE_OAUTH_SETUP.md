# 🔐 YouTube OAuth Setup Guide

This guide walks you through setting up YouTube OAuth credentials so your SixFold app can upload videos directly to your YouTube channels.

## 📋 Prerequisites

- A Google Account
- A YouTube channel (create one at youtube.com if you don't have one)
- Access to Google Cloud Console

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `SixFold YouTube App`
4. Click **Create**
5. Wait for the project to be created, then select it

---

## Step 2: Enable YouTube Data API v3

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"YouTube Data API v3"**
3. Click on it, then click **Enable**
4. Wait for it to enable (takes a few seconds)

---

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: `SixFold Studios`
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **Save and Continue**
6. On **Scopes** page, click **Add or Remove Scopes**
7. Search and add these scopes:
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube`
   - `https://www.googleapis.com/auth/youtube.readonly`
8. Click **Update** → **Save and Continue**
9. On **Test users** page, click **Add Users**
10. Add your Gmail address (the one with your YouTube channel)
11. Click **Save and Continue** → **Back to Dashboard**

---

## Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: `SixFold Web Client`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for development)
     - `https://your-vercel-domain.vercel.app` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/youtube/callback`
     - `https://your-vercel-domain.vercel.app/api/auth/youtube/callback`
5. Click **Create**
6. **COPY AND SAVE** the **Client ID** and **Client Secret** shown in the popup

---

## Step 5: Add Credentials to Your App

### For Local Development

1. Open your project folder
2. Find or create `.env.local` file
3. Add these lines:

```env
# YouTube OAuth Credentials
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/auth/youtube/callback

# App URL (for OAuth redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### For Vercel Production

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - `YOUTUBE_CLIENT_ID` → your client ID
   - `YOUTUBE_CLIENT_SECRET` → your client secret
   - `YOUTUBE_REDIRECT_URI` → `https://your-domain.vercel.app/api/auth/youtube/callback`
   - `NEXT_PUBLIC_BASE_URL` → `https://your-domain.vercel.app`
5. Click **Save**
6. **Redeploy** your app for changes to take effect

---

## Step 6: Test the Connection

1. Start your app: `npm run dev`
2. Go to `http://localhost:3000/connect`
3. Click **"Connect with YouTube"** button
4. Sign in with your Google account
5. Grant permissions when prompted
6. You should be redirected back with your channel connected!

---

## 🔧 Troubleshooting

### "Access Denied" Error
- Make sure your email is added as a **Test User** in OAuth consent screen
- The app is in "Testing" mode until you publish it

### "Redirect URI Mismatch"
- Double-check the redirect URI matches EXACTLY in both:
  - Google Cloud Console credentials
  - Your `.env.local` file

### "Invalid Client" Error
- Verify Client ID and Secret are copied correctly (no extra spaces)
- Make sure you're using the right credentials for your environment

### "Quota Exceeded"
- YouTube API has a daily quota of 10,000 units
- Video uploads cost 1600 units each
- You can request a quota increase in Google Cloud Console

---

## 📊 API Quota Information

| Action | Cost |
|--------|------|
| Video upload | 1600 units |
| List videos | 1 unit |
| Get video details | 1 unit |
| Update video | 50 units |

**Daily limit**: 10,000 units (≈ 6 video uploads per day)

To increase quota:
1. Go to **APIs & Services** → **YouTube Data API v3**
2. Click **Quotas** tab
3. Click **Edit Quotas** → Request increase

---

## 🔒 Security Notes

- **NEVER** share your Client Secret publicly
- Add `.env.local` to your `.gitignore` file
- Use environment variables for all secrets
- Rotate credentials if they're ever exposed

---

## ✅ Checklist

- [ ] Created Google Cloud project
- [ ] Enabled YouTube Data API v3
- [ ] Configured OAuth consent screen
- [ ] Added test users
- [ ] Created OAuth credentials
- [ ] Added credentials to `.env.local`
- [ ] Added credentials to Vercel (for production)
- [ ] Tested connection successfully

---

## Need Help?

- 📖 [YouTube API Documentation](https://developers.google.com/youtube/v3)
- 🎓 [OAuth 2.0 Overview](https://developers.google.com/identity/protocols/oauth2)
- 💬 Open an issue on GitHub

---

*Created for SixFold Studios - AI YouTube Automation System*
