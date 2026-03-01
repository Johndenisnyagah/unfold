# 🚀 Fixing AI on Vercel

To get the ✨ Magic Timeline feature working on your Vercel deployment, you need to add your Gemini API key to Vercel's environment variables.

### Step-by-Step Setup

1.  **Get your API Key**:
    *   Go to [Google AI Studio](https://aistudio.google.com/apikey).
    *   Copy your existing key or create a new one.

2.  **Add to Vercel**:
    *   Open your project dashboard on [vercel.com](https://vercel.com).
    *   Go to **Settings** > **Environment Variables**.
    *   Add a new entry:
        *   **Key**: `VITE_GEMINI_API_KEY`
        *   **Value**: `AIzaSy...` (Paste your key here)
    *   Ensure **Production**, **Preview**, and **Development** are checked.
    *   Click **Save**.

3.  **Redeploy**:
    *   Go to the **Deployments** tab.
    *   Click the three dots `...` on your latest deployment and select **Redeploy**.
    *   Alternatively, push a small change to your GitHub repo to trigger a fresh build.

### Why is this needed?
Vite requires environment variables to be prefixed with `VITE_` for them to be exposed to your client-side code. When you deploy to Vercel, the `.env` file is NOT uploaded (for security), so you must manually define these variables in the Vercel dashboard.
