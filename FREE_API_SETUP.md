# Free API Setup Guide (No Payment Required)

## Option 1: Google Gemini (Recommended - Truly Free)

### Steps to Get Free API Key:

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account (any Gmail account works)

2. **Create API Key:**
   - Click "Create API Key"
   - Select "Create API key in new project" (or use existing project)
   - Copy the API key (starts with `AIza...`)

3. **Important Notes:**
   - Google Gemini offers **FREE tier** with generous limits
   - No credit card required
   - Free tier includes: 15 requests per minute, 1,500 requests per day
   - If you see payment prompts, you might be on the wrong page - make sure you're at `aistudio.google.com/app/apikey` (not the paid Google Cloud Console)

### In the App:
- Go to Settings → Select "Google Gemini"
- Paste your API key
- Click "Save API Key"
- Start using!

---

## Option 2: Perplexity Free Tier

### Steps to Get Free API Key:

1. **Go to Perplexity Settings:**
   - Visit: https://www.perplexity.ai/settings/api
   - Sign up/Login (free account)

2. **Get API Key:**
   - Scroll to "API Keys" section
   - Click "Create API Key"
   - Copy the key

3. **Important:**
   - Make sure you're using the **free "sonar" model** (not sonar-pro)
   - The app automatically uses the free tier
   - If you see payment prompts, you might be trying to access paid features - stick to the free API key

### In the App:
- Go to Settings → Select "Perplexity"
- Paste your API key
- Click "Save API Key"
- The app will automatically use the free "sonar" model

---

## Option 3: Wait for OpenAI Quota Reset

If you're using OpenAI and hit quota limits:

1. **Check your quota reset date:**
   - Go to https://platform.openai.com/usage
   - See when your quota resets (usually monthly)

2. **Use free credits:**
   - OpenAI sometimes gives free credits to new accounts
   - Check if you have any remaining credits

---

## Troubleshooting

### "Gemini not showing in app"
- Make sure you're using the latest version of the app
- Try restarting the app
- Check if you see all 4 vendors: OpenAI, Google Gemini, Claude, Perplexity

### "Still asking for payment"
- **For Gemini:** Make sure you're at `aistudio.google.com/app/apikey` (NOT cloud.google.com)
- **For Perplexity:** Make sure you're getting the API key from settings, not trying to upgrade to Pro
- Try using a different browser or incognito mode

### "API key not working"
- Make sure you copied the entire key (no spaces)
- Check if the key is valid by testing it
- Try regenerating the key

---

## Quick Comparison

| Provider | Free Tier | Payment Required | Best For |
|----------|-----------|------------------|----------|
| Google Gemini | ✅ Yes (15 req/min) | ❌ No | General queries, images |
| Perplexity | ✅ Yes (sonar model) | ❌ No* | Web search, research |
| OpenAI | ⚠️ Limited free credits | ✅ Yes (after free tier) | Best quality, but needs billing |
| Claude | ❌ No | ✅ Yes | High quality, needs billing |

*Perplexity free tier available, but website may show payment options - ignore those and just get the API key

---

## Need Help?

If you're still having issues:
1. Check the browser console for errors (F12 → Console tab)
2. Make sure you're using the correct API key format
3. Verify the vendor is selected correctly in Settings
4. Try restarting the app after saving the API key
