// api/room.js — Vercel serverless function
// Creates Daily.co rooms and issues meeting tokens
// Set DAILY_API_KEY in your Vercel environment variables

const DAILY_API = 'https://api.daily.co/v1';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'DAILY_API_KEY not set' });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  // POST /api/room — create or get a room, then issue a token
  if (req.method === 'POST') {
    const { roomName, userName, isModerator } = req.body || {};
    if (!roomName || !userName) {
      return res.status(400).json({ error: 'roomName and userName required' });
    }

    // 1. Create room if it doesn't exist
    let room;
    try {
      const existing = await fetch(`${DAILY_API}/rooms/${roomName}`, { headers });
      if (existing.ok) {
        room = await existing.json();
      } else {
        const created = await fetch(`${DAILY_API}/rooms`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: roomName,
            privacy: 'private',
            properties: {
              enable_chat: false,
              enable_knocking: true,
              enable_screenshare: false,
              start_audio_off: true, // audience starts muted
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 hour expiry
            },
          }),
        });
        room = await created.json();
      }
    } catch (e) {
      return res.status(500).json({ error: 'Failed to create/get room', detail: e.message });
    }

    // 2. Issue a meeting token
    try {
      const tokenRes = await fetch(`${DAILY_API}/meeting-tokens`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            user_name: userName,
            is_owner: !!isModerator,
            start_audio_off: !isModerator, // moderators can start with mic
            enable_recording: isModerator ? 'local' : undefined,
          },
        }),
      });
      const { token } = await tokenRes.json();
      return res.status(200).json({ url: room.url, token, roomName });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to create token', detail: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
