---
name: react-frontend
description: |
  React + TypeScript frontend skill for ImEnglish.
  Covers component patterns, WebRTC audio integration, Web Speech API usage,
  state management with Zustand, API calls with TanStack Query, and UI patterns.
tags: [react, typescript, frontend, webrtc, speech-api]
---

# React Frontend Skill for ImEnglish

## Tech Stack
- **React 18** + TypeScript (strict)
- **Vite** for build tooling
- **Zustand** for global state
- **TanStack Query v5** for server state / API calls
- **React Router v6** for navigation
- **Axios** for HTTP
- **STOMP.js** for WebSocket
- **simple-peer** or native WebRTC for P2P calls
- **Web Speech API** for STT/TTS (browser-native)

## Project Structure
```
src/
├── api/               # Axios instances + API functions
├── assets/            # Static assets
├── components/
│   ├── ui/            # Base components (Button, Card, Modal...)
│   ├── layout/        # Layout components
│   ├── ai/            # AI Companion components
│   └── p2p/           # P2P call components
├── hooks/             # Custom React hooks
│   ├── useWebRTC.ts
│   ├── useSpeechRecognition.ts
│   ├── useWebSocket.ts
│   └── useAiSession.ts
├── pages/             # Route-level page components
│   ├── auth/
│   ├── dashboard/
│   ├── ai-companion/
│   ├── p2p/
│   └── profile/
├── stores/            # Zustand stores
│   ├── authStore.ts
│   ├── callStore.ts
│   └── sessionStore.ts
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## Web Speech API Hook
```typescript
export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (e) => {
        const text = Array.from(e.results)
          .map(r => r[0].transcript).join('');
        setTranscript(text);
      };
    }
  }, []);

  const startListening = () => { recognitionRef.current?.start(); setIsListening(true); };
  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  return { transcript, isListening, startListening, stopListening };
}
```

## Zustand Auth Store
```typescript
interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    login: async (credentials) => { /* API call */ },
    logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  }), { name: 'auth-storage' })
);
```

## Real-time Assist UI Pattern
```typescript
// When user pauses for > 3 seconds, show suggestion panel
const useAssistTrigger = (transcript: string, sessionId: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAssist, setShowAssist] = useState(false);
  
  useEffect(() => {
    if (!transcript) return;
    const timer = setTimeout(async () => {
      const result = await fetchSuggestions({ sessionId, partialInput: transcript });
      setSuggestions(result);
      setShowAssist(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [transcript]);
  
  return { suggestions, showAssist, setShowAssist };
};
```
