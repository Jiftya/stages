# Stage — Discord Stage Channels, but better

Live voice stage app with hand raise queue, speaker timers, polls & scheduled events. Built with Daily.co + Vercel.

## Deploy in 5 minutes

### 1. Get a Daily.co API key
- Sign up free at https://dashboard.daily.co
- Go to **Developers → API keys** → copy your key

### 2. Deploy to Vercel
```bash
npm i -g vercel
cd stage-app
vercel deploy
```
Or drag the folder into https://vercel.com/new

### 3. Set environment variable
In Vercel dashboard → your project → **Settings → Environment Variables**:
```
DAILY_API_KEY = your_key_here
```
Redeploy once after setting it.

### 4. Open your URL and join!
- Enter a username and room name
- Join as **Audience** or **Moderator**
- Share the URL — anyone who enters the same room name joins the same stage

## Features
| Feature | How it works |
|---|---|
| Live voice | Daily.co WebRTC — no plugins needed |
| Hand raise queue | Audience raises hand → moderators see ordered queue |
| Invite to speak | Mod clicks Invite → user's mic is unmuted automatically |
| Speaker timer | Countdown per speaker, configurable 1–10 min limit, warning at 30s |
| Live polls | Mod launches a poll, all users vote, results update live |
| Scheduled events | Add upcoming stages with RSVP |
| Multi-user sync | State synced via Daily app messages (no separate backend needed) |

## File structure
```
stage-app/
  public/
    index.html      ← entire frontend (HTML + CSS + JS)
  api/
    room.js         ← Vercel serverless: creates Daily rooms + tokens
  vercel.json       ← routing config
  README.md
```

## Free tier limits (Daily.co)
- 10,000 participant-minutes/month free
- Up to 1,000 participants per room
- Plenty for community stages
