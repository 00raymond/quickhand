import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const HandShapeDetector = ({ onGestureChange, highlight }) => {
    const videoRef = useRef(null);
    const onGestureChangeRef = useRef(onGestureChange);
    const [gesture, setGesture] = useState('No gesture detected');

    useEffect(() => {
        onGestureChangeRef.current = onGestureChange;
    }, [onGestureChange]);

    // Gesture detection function.
    const detectGesture = (landmarks) => {
        if (!landmarks || landmarks.length < 21) return 'Unknown';
        const isFingerExtended = (mcp, pip, tip) => (pip.y - tip.y) > 0.1;
        const indexExtended = isFingerExtended(landmarks[5], landmarks[6], landmarks[8]);
        const middleExtended = isFingerExtended(landmarks[9], landmarks[10], landmarks[12]);
        const ringExtended = isFingerExtended(landmarks[13], landmarks[14], landmarks[16]);
        const pinkyExtended = isFingerExtended(landmarks[17], landmarks[18], landmarks[20]);
        const thumbExtended = isFingerExtended(landmarks[1], landmarks[2], landmarks[4]);

        console.log('indexExtended', indexExtended);
        console.log('middleExtended', middleExtended);
        console.log('ringExtended', ringExtended);
        console.log('pinkyExtended', pinkyExtended);
        console.log('thumbExtended', thumbExtended);

        if (pinkyExtended && thumbExtended && !indexExtended && !middleExtended && !ringExtended) {
            return 'Phone call';
        } else if (middleExtended && ringExtended && pinkyExtended && !indexExtended && !thumbExtended) {
            return 'OK';
        } else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
            return 'Peace sign';
        } else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'Thumbs up';
        } else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'Pointing';
        } else if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'Fist';
        } else if (indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
            return 'Spiderman';
        }
        return 'Unknown gesture';
    };

    useEffect(() => {
        if (!videoRef.current) return;
        if (!window.Hands || !window.Camera) {
            console.error('MediaPipe libraries not loaded');
            return;
        }

        const hands = new window.Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5,
        });
        hands.onResults((results) => {
            let detected = 'No hand detected';
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                detected = detectGesture(results.multiHandLandmarks[0]);
            }
            setGesture(detected);
            if (onGestureChangeRef.current) {
                onGestureChangeRef.current(detected);
            }
        });

        const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
                await hands.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
        });
        camera.start();

    }, []);

    return (
        <div className="text-center">
            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
                strategy="beforeInteractive"
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
                strategy="beforeInteractive"
            />
            <h1 className="text-3xl font-bold mb-4">Quickhand</h1>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-[640px] h-[480px] bg-black rounded-lg border-4 transition-all duration-200 ${
                    highlight ? "border-green-500 shadow-xl" : "border-transparent"
                }`}
            />
            <h2 className="mt-4 text-xl">{gesture}</h2>
        </div>
    );
};

export default HandShapeDetector;
