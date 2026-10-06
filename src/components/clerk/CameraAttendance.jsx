import React, { useEffect, useRef, useState } from "react";
import apiService from "../../services/apiService";

const CameraAttendance = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [cameraStarted, setCameraStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState(null);

const [lab, setLab] = useState("DBMS Lab");
    const [mode, setMode] = useState("entry");

    const date = new Date().toISOString().split("T")[0];

    // Start camera
    const startCamera = async () => {
        try {
            setMessage("");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setCameraStarted(true);
            setMessage("Camera started. Place the student's face in front of the camera.");
        } catch (error) {
            console.error("CAMERA ERROR:", error);
            setMessage(
                "Unable to access camera. Please allow camera permission."
            );
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraStarted(false);
    };

    // Capture image and send to backend
    const recognizeFace = async () => {
        if (!videoRef.current || !canvasRef.current) {
            setMessage("Camera is not ready.");
            return;
        }

        if (!cameraStarted) {
            setMessage("Please start the camera first.");
            return;
        }

        try {
            setLoading(true);
            setMessage("Capturing image and recognizing face...");
            setResult(null);

            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");

            context.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);

            console.log("Sending image to AI camera recognition...");

            const response = await apiService.attendance.cameraRecognize(
                imageBase64,
                date,
                lab,
                null,
                mode
            );

            console.log("CAMERA RECOGNITION RESPONSE:", response);

            setResult(response);

window.dispatchEvent(new Event("attendance-updated"));

if (response?.success === false) {
    setMessage(
        response.message ||
        response.detail ||
        "Face was not recognized."
    );
} else {
    setMessage(
        response?.message ||
        "Face recognized and attendance processed successfully."
    );
}
        } catch (error) {
            console.error("FACE RECOGNITION ERROR:", error);

            setMessage(
                error.message ||
                "Face recognition failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Stop camera when component is removed
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">
                    AI Camera Attendance
                </h2>

                <p className="text-gray-500 mt-1">
                    Use the camera to recognize a student's face and
                    automatically record attendance.
                </p>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Lab
                    </label>

                    <select
                        value={lab}
                        onChange={(e) => setLab(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="DBMS Lab">DBMS Lab</option>
                        <option value="Java Lab">Java Lab</option>
                        <option value="Web Lab">Web Lab</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Attendance Mode
                    </label>

                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="entry">Entry</option>
                        <option value="exit">Exit</option>
                    </select>
                </div>
            </div>

            {/* Camera */}
            <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-center">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full max-w-2xl rounded-lg bg-black"
                    />
                </div>

                <canvas
                    ref={canvasRef}
                    className="hidden"
                />

                <div className="flex gap-3 justify-center mt-5 flex-wrap">
                    {!cameraStarted ? (
                        <button
                            onClick={startCamera}
                            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Start Camera
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={recognizeFace}
                                disabled={loading}
                                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Recognizing..."
                                    : "Recognize Face"}
                            </button>

                            <button
                                onClick={stopCamera}
                                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Stop Camera
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="mt-5 p-4 border rounded bg-gray-50">
                    <p className="font-medium">{message}</p>
                </div>
            )}

            {/* Recognition Result */}
            {result && (
                <div className="mt-5 p-5 border rounded-lg">
                    <h3 className="text-lg font-bold mb-3">
                        Recognition Result
                    </h3>

                    <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default CameraAttendance;