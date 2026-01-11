# AI YouTube Agency - Copilot Instructions

## Project Overview
Next.js 15 + TypeScript SaaS platform for AI-powered YouTube content automation. Features real video generation, YouTube OAuth upload, text-to-speech, multi-platform distribution, and Stripe payments. Deploys on Vercel.

## Architecture

### Key Directories
- **`/pages`**: Next.js pages (dashboard, autopilot, video-creator, my-videos, connect, etc.)
- **`/pages/api`**: API routes (youtube/upload.ts, auth/youtube/, create-checkout.ts)
- **`/lib`**: Core business logic (~85 modules) - video generation, TTS, automation, payments
- **`/components`**: React components (~45 files) - dashboards, AI interfaces, generators
- **`/supabase`**: Database schema with RLS policies

### Core Data Flow
1. **Channels** → OAuth connection at `/connect` → stored in localStorage with tokens
2. **Videos** → Canvas rendering via `/lib/realVideoGenerator.ts` → WebM output
3. **Uploads** → OAuth tokens from channel → `/api/youtube/upload.ts` → YouTube Data API v3
4. **Persistence** → Triple backup: localStorage + sessionStorage + IndexedDB (`/lib/dataProtection.ts`)

## Video Generation Pipeline
```
Script → parseScriptToScenes() → Canvas rendering → MediaRecorder → WebM Blob → Base64
→ uploadVideoToYouTube() → YouTube Data API v3 → Video URL
```

Key files:
- [lib/realVideoGenerator.ts](lib/realVideoGenerator.ts) - Canvas-based video creation
- [lib/textToSpeech.ts](lib/textToSpeech.ts) - Web Speech API voiceovers
- [lib/youtube-uploader.ts](lib/youtube-uploader.ts) - OAuth upload wrapper
- [pages/api/youtube/upload.ts](pages/api/youtube/upload.ts) - Google APIs integration

## Critical Patterns

### YouTube OAuth Flow
```typescript
// 1. User clicks "Connect with YouTube" → /api/auth/youtube/authorize
// 2. Google OAuth consent → callback with tokens
// 3. Tokens stored in channel object in localStorage
// 4. Upload uses channel.accessToken + channel.refreshToken
```

### Data Protection System
Always call `backupAllData()` after modifying critical localStorage keys:
```typescript
// Critical keys (from lib/dataProtection.ts):
'youtube_channels', 'owner_bank_account', 'earnings_data', 'autopilot_enabled', 
'generated_videos', 'scheduler_enabled'
```

### API Route Structure
```typescript
// pages/api/*.ts pattern
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try { /* logic */ } catch (error) { res.status(500).json({ error: 'message' }); }
}
```

### Component Pattern
Components use Tailwind with custom theme colors from `tailwind.config.js`:
- `primary-*` (Imperial Green), `azure-*` (Blue), `luxury-*` (Gold), `lavender-*`
- Dark mode: `dark-bg`, `dark-card`, `dark-border`

## Development Commands
```bash
npm run dev           # Start dev server (uses increased memory: --max-old-space-size=4096)
npm run build         # Production build
npm run test-build    # Build + verification before deploy
npm run deploy-safe   # Build then Vercel production deploy
npm run save-only     # Git commit/push without deploying (saves Vercel quota)
```

## External Integrations
- **YouTube API**: OAuth2 for uploads (see YOUTUBE_OAUTH_SETUP.md)
- **Stripe**: Payments (keys in env, price IDs in dashboard)
- **Supabase**: PostgreSQL + Auth + Realtime (RLS enabled)
- **Web Speech API**: Browser-based TTS (free, no API key needed)
- **Pexels/Unsplash**: Free stock media

## Key Files to Reference
- Video Gen: [lib/realVideoGenerator.ts](lib/realVideoGenerator.ts) - creates actual WebM videos
- TTS: [lib/textToSpeech.ts](lib/textToSpeech.ts) - voice synthesis
- Upload: [lib/youtube-uploader.ts](lib/youtube-uploader.ts) - YouTube integration
- OAuth: [pages/api/auth/youtube/](pages/api/auth/youtube/) - authorize.ts + callback.ts
- Connect: [pages/connect.tsx](pages/connect.tsx) - channel connection UI

## Conventions
- Use emoji prefixes in console logs (🛡️ security, 🎬 video, ✅ success, ❌ error, 🤖 automation)
- Wrap pages in `<ErrorBoundary>` and include `<AppNavigation>`
- Store sensitive data only in environment variables, never in code
- Memory optimization: Next.js runs with 4GB heap limit
