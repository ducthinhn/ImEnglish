---
name: webrtc-websocket
description: |
  WebRTC P2P voice call + WebSocket signaling skill for ImEnglish.
  Covers WebRTC peer connection setup, ICE candidate handling, Spring WebSocket
  signaling server, STUN/TURN configuration, and frontend WebRTC API usage.
tags: [webrtc, websocket, p2p, real-time, signaling]
---

# WebRTC + WebSocket Skill for ImEnglish

## How WebRTC P2P Works in ImEnglish
```
User A                 Spring Signaling Server         User B
  |                           |                           |
  |--- JOIN room ------------>|                           |
  |                           |<--- JOIN room ------------|
  |<-- user_joined ---------->|                           |
  |--- offer (SDP) ---------->|--- offer (SDP) ---------->|
  |                           |<-- answer (SDP) ----------|
  |<-- answer (SDP) ----------|                           |
  |--- ICE candidate -------->|--- ICE candidate -------->|
  |<-- ICE candidate ---------|<-- ICE candidate ----------|
  |=========== Direct P2P Voice Connection =============|
```

## Signaling Message Types
```json
{ "type": "offer",     "sdp": "...",          "roomId": "..." }
{ "type": "answer",    "sdp": "...",          "roomId": "..." }
{ "type": "ice",       "candidate": {...},    "roomId": "..." }
{ "type": "join",      "userId": "...",       "roomId": "..." }
{ "type": "leave",     "userId": "...",       "roomId": "..." }
```

## Spring WebSocket Signaling Controller
```java
@Controller
public class SignalingController {
    @MessageMapping("/signal/{roomId}")
    public void handleSignal(@DestinationVariable String roomId,
                              @Payload SignalMessage message,
                              SimpMessageHeaderAccessor accessor) {
        // Forward signal to other user in room
        simpMessagingTemplate.convertAndSend(
            "/topic/room/" + roomId, message);
    }
}
```

## Frontend WebRTC Setup
```typescript
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:your-turn-server.com', 
      username: 'user', credential: 'pass' }
  ]
};

const pc = new RTCPeerConnection(configuration);

// Add local stream
localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

// ICE candidates
pc.onicecandidate = (event) => {
  if (event.candidate) sendSignal({ type: 'ice', candidate: event.candidate });
};

// Remote stream
pc.ontrack = (event) => {
  remoteVideoRef.current.srcObject = event.streams[0];
};
```

## STUN/TURN Configuration (application.yml)
```yaml
webrtc:
  stun-servers:
    - "stun:stun.l.google.com:19302"
    - "stun:stun1.l.google.com:19302"
  turn-server:
    url: "turn:your-coturn-server.com:3478"
    username: "${TURN_USERNAME}"
    credential: "${TURN_PASSWORD}"
```

## Matching Algorithm (P2P Pairing)
```java
// Match users by: level (A1-C2), learning goal, time availability
public MatchResult matchUsers(MatchRequest request) {
    return waitingQueue.stream()
        .filter(u -> u.getLevel() == request.getLevel())
        .filter(u -> !u.getUserId().equals(request.getUserId()))
        .findFirst()
        .map(matched -> createRoom(request.getUserId(), matched.getUserId()))
        .orElse(MatchResult.waitlisted(request.getUserId()));
}
```

## Ice-breaker Card Sync
- When both users join a room, server pushes an ice-breaker card via WebSocket
- Cards are stored in MongoDB and selected based on user levels/interests
- Both clients receive `{ type: "icebreaker_card", card: { title, task, duration } }`
