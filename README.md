# Quickhand

Quickhand is a real-time gesture recognition game that uses Mediapipe to detect your hand gestures. The app leverages Mediapipe Hands to extract 21 landmarks from your webcam feed and then runs an algorithm to determine which gesture you’re making. In the game, a random target gesture is displayed and when you match it, you score points.

## How It Works

1. **Hand Detection:**  
   MediaPipe Hands detects 21 landmarks on your hand in real time from your webcam feed.

2. **Gesture Calculation:**  
   A function calculates whether each finger is extended based on the relative vertical positions of the finger joints (MCP, PIP, and tip). Depending on which fingers are extended, the app determines gestures such as:
   - **Phone call:** Only the thumb and pinky are extended.
   - **OK:** Middle, ring, and pinky extended.
   - **Peace sign:** Index and middle extended.
   - **Thumbs up:** Only the thumb extended.
   - **Pointing:** Only the index extended.
   - **Fist:** No fingers extended.
   - **Spiderman:** Index extended and pinky extended.

## Gesture Calculation Code Snippet

Below is the core snippet that processes the hand landmarks to calculate which gesture is being made:

```javascript
const detectGesture = (landmarks) => {
  if (!landmarks || landmarks.length < 21) return 'Unknown';
  // Helper: determines if a finger is extended based on the vertical difference
  const isFingerExtended = (mcp, pip, tip) => (pip.y - tip.y) > 0.1;

  const indexExtended = isFingerExtended(landmarks[5], landmarks[6], landmarks[8]);
  const middleExtended = isFingerExtended(landmarks[9], landmarks[10], landmarks[12]);
  const ringExtended = isFingerExtended(landmarks[13], landmarks[14], landmarks[16]);
  const pinkyExtended = isFingerExtended(landmarks[17], landmarks[18], landmarks[20]);
  const thumbExtended = isFingerExtended(landmarks[1], landmarks[2], landmarks[4]);
