import { useState, useEffect } from "react";
import HandShapeDetector from "../components/HandShapeDetector";

export default function Home() {
    const [gameState, setGameState] = useState("init"); // "init" or "play"
    const [timer, setTimer] = useState(30);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [targetGesture, setTargetGesture] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [highlight, setHighlight] = useState(false);

    const possibleGestures = [
        "Phone call",
        "OK",
        "Peace sign",
        "Thumbs up",
        "Pointing",
        "Fist",
        "Spiderman",
    ];

    const getRandomGesture = () => {
        return possibleGestures[Math.floor(Math.random() * possibleGestures.length)];
    };

    const startGame = () => {
        setGameState("play");
        setTimer(30);
        setScore(0);
        setTargetGesture(getRandomGesture());
    };

    // When HandShapeDetector reports a gesture, check it against the target
    const handleGestureChange = (detectedGesture) => {
        if (gameState !== "play") return;
        if (detectedGesture === targetGesture) {
            setScore((prev) => prev + 100);
            // Trigger the highlight
            setHighlight(true);
            setTimeout(() => setHighlight(false), 500);
            setTargetGesture(getRandomGesture());
        }
    };

    // Timer countdown
    useEffect(() => {
        let interval;
        if (gameState === "play") {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setGameState("init");
                        if (score > highScore) setHighScore(score);
                        setShowPopup(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, score, highScore]);

    // Popup for game over scren
    const Popup = () => (
        <div className="w-72 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-6 z-50 rounded-lg shadow-2xl">
            <button onClick={() => setShowPopup(false)} className="float-right text-lg font-bold text-red-500">
                X
            </button>
            <h2 className="text-4xl font-bold mb-2">Game Over</h2>
            <p className="text-2xl">Your score: {score}</p>
            {score >= highScore && <p className="text-lg text-green-600 font-semibold">New High Score!</p>}
        </div>
    );

    return (
        <div className="flex flex-row items-center justify-center h-screen space-y-6 bg-black p-4">
            <div className="flex flex-col items-center space-y-3 w-[400px]">
                {gameState === "init" && (
                    <button
                        onClick={startGame}
                        className="text-2xl font-bold px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                    >
                        Start Game
                    </button>
                )}
                <p className="text-xl">High Score: {highScore}</p>
                {gameState === "play" && (
                    <div className="flex flex-col items-center space-y-1">
                        <p className="text-2xl font-semibold">Time: {timer}</p>
                        <p className="text-2xl font-semibold">Score: {score}</p>
                        <p className="text-2xl p-2 bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl">
                            Make this gesture:{" "}<br/>
                            <span className="text-4xl text-yellow-400 font-bold transition-all duration-300 ease-in-out">
                {targetGesture}
              </span>
                        </p>
                    </div>
                )}
            </div>
            <HandShapeDetector onGestureChange={handleGestureChange} highlight={highlight} />
            {showPopup && <Popup />}
        </div>
    );
}
