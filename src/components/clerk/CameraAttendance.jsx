import React, { useEffect, useRef, useState } from "react";
import apiService from "../../services/apiService";
import { useLabs } from "../../context/LabContext";

const CameraAttendance = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const { labs = [] } = useLabs();

    const [cameraStarted, setCameraStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState(null);

    const [lab, setLab] = useState("");
    const [mode, setMode] = useState("entry");

    const date = new Date().toISOString().split("T")[0];

    // =====================================================
    // SELECT FIRST AVAILABLE HOD LAB
    // =====================================================

    useEffect(() => {
        if (!labs || labs.length === 0) {
            return;
        }

        const currentLabExists = labs.some(
            (item) => item.name === lab
        );

        if (!currentLabExists) {
            setLab(labs[0].name);
        }
    }, [labs, lab]);

    // =====================================================
    // START CAMERA
    // =====================================================

    const startCamera = async () => {
        try {
            setMessage("Starting camera...");
            setResult(null);

            const stream =
                await navigator.mediaDevices.getUserMedia({
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

            setMessage(
                "Camera started. Place the student's face clearly in front of the camera."
            );
        } catch (error) {
            console.error("CAMERA ERROR:", error);

            setMessage(
                "Unable to access camera. Please allow camera permission."
            );
        }
    };

    // =====================================================
    // STOP CAMERA
    // =====================================================

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraStarted(false);
        setLoading(false);
        setMessage("Camera stopped.");
    };

    // =====================================================
    // RECOGNIZE FACE
    // =====================================================

    const recognizeFace = async () => {
        if (!cameraStarted) {
            setMessage("Please start the camera first.");
            return;
        }

        if (!lab) {
            setMessage("Please select a lab first.");
            return;
        }

        if (!videoRef.current) {
            setMessage("Camera video is not available.");
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            setMessage(
                "Capturing face... Please keep the student's face still."
            );

            const video = videoRef.current;

            if (video.readyState < 2) {
                setMessage(
                    "Camera is still loading. Please wait."
                );
                return;
            }

            const canvas = canvasRef.current;

            if (!canvas) {
                setMessage(
                    "Image canvas is not available."
                );
                return;
            }

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

            const imageBase64 =
                canvas.toDataURL(
                    "image/jpeg",
                    0.8
                );

            console.log("================================");
            console.log("SMART LAB AI ATTENDANCE");
            console.log("Date:", date);
            console.log("Lab:", lab);
            console.log("Mode:", mode);
            console.log("Sending image to backend...");
            console.log("================================");

            const response =
                await apiService.attendance.cameraRecognize(
                    imageBase64,
                    date,
                    lab,
                    null,
                    mode
                );

            console.log(
                "CAMERA RECOGNITION RESPONSE:",
                response
            );

            setResult(response);

            // =================================================
            // ATTENDANCE SUCCESS
            // =================================================

            if (
                response?.success === true &&
                response?.matched === true &&
                response?.attendance_updated === true
            ) {
                setMessage(
                    `Attendance recorded successfully for ${
                        response.name || "student"
                    }.`
                );

                window.dispatchEvent(
                    new CustomEvent(
                        "attendance-updated",
                        {
                            detail: response,
                        }
                    )
                );

            } else if (
                response?.success === true &&
                response?.matched === true
            ) {
                setMessage(
                    `Face recognized: ${
                        response.name || "Student"
                    }, but attendance confirmation was not received.`
                );

                window.dispatchEvent(
                    new CustomEvent(
                        "attendance-updated",
                        {
                            detail: response,
                        }
                    )
                );

            } else {
                setMessage(
                    response?.message ||
                    response?.detail ||
                    "Face was not recognized."
                );
            }

        } catch (error) {
            console.error(
                "FACE RECOGNITION ERROR:",
                error
            );

            setMessage(
                error?.message ||
                "Face recognition failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // STOP CAMERA WHEN LEAVING PAGE
    // =====================================================

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
            }
        };
    }, []);

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="bg-white rounded-lg shadow p-6">

            <div className="mb-6">

                <h2 className="text-2xl font-bold">
                    AI Camera Attendance
                </h2>

                <p className="text-gray-500 mt-1">
                    Face recognition automatically records
                    student attendance.
                </p>

            </div>

            {/* SETTINGS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                {/* LAB */}

                <div>

                    <label className="block text-sm font-medium mb-1">
                        Lab
                    </label>

                    <select
                        value={lab}
                        onChange={(e) =>
                            setLab(e.target.value)
                        }
                        className="border rounded px-3 py-2 w-full"
                    >

                        {labs.length > 0 ? (

                            labs.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.name}
                                >
                                    {item.name}
                                </option>
                            ))

                        ) : (

                            <option value="">
                                No labs available
                            </option>

                        )}

                    </select>

                </div>

                {/* ATTENDANCE MODE */}

                <div>

                    <label className="block text-sm font-medium mb-1">
                        Attendance Mode
                    </label>

                    <select
                        value={mode}
                        onChange={(e) =>
                            setMode(e.target.value)
                        }
                        className="border rounded px-3 py-2 w-full"
                    >

                        <option value="entry">
                            Entry
                        </option>

                        <option value="exit">
                            Exit
                        </option>

                    </select>

                </div>

            </div>

            {/* CAMERA */}

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
                            type="button"
                            onClick={startCamera}
                            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Start Camera
                        </button>

                    ) : (

                        <>

                            <button
                                type="button"
                                onClick={recognizeFace}
                                disabled={loading}
                                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Recognizing..."
                                    : "Recognize Face"}
                            </button>

                            <button
                                type="button"
                                onClick={stopCamera}
                                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Stop Camera
                            </button>

                        </>

                    )}

                </div>

            </div>

            {/* MESSAGE */}

            {message && (

                <div className="mt-5 p-4 border rounded bg-gray-50">

                    <p className="font-medium">
                        {message}
                    </p>

                </div>

            )}

            {/* SUCCESSFUL ATTENDANCE */}

            {result?.attendance_updated === true && (

                <div className="mt-5 p-5 border rounded-lg bg-green-50">

                    <h3 className="text-lg font-bold text-green-700 mb-3">
                        ✓ Attendance Recorded
                    </h3>

                    <div className="space-y-1">

                        <p>
                            <strong>Student:</strong>{" "}
                            {result.name}
                        </p>

                        <p>
                            <strong>USN:</strong>{" "}
                            {result.usn}
                        </p>

                        <p>
                            <strong>Lab:</strong>{" "}
                            {result.lab || lab}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {result.status || "Present"}
                        </p>

                        <p>
                            <strong>Confidence:</strong>{" "}
                            {result.confidence
                                ? `${(
                                      result.confidence *
                                      100
                                  ).toFixed(1)}%`
                                : "-"}
                        </p>

                        <p>
                            <strong>Entry Time:</strong>{" "}
                            {result.entry_time || "-"}
                        </p>

                        <p>
                            <strong>Exit Time:</strong>{" "}
                            {result.exit_time || "-"}
                        </p>

                        <p>
                            <strong>Duration:</strong>{" "}
                            {result.duration || "-"}
                        </p>

                    </div>

                </div>

            )}

            {/* DEBUG / RESULT */}

            {result && (

                <details className="mt-5">

                    <summary className="cursor-pointer font-semibold">
                        Recognition Response
                    </summary>

                    <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm mt-2">
                        {JSON.stringify(
                            result,
                            null,
                            2
                        )}
                    </pre>

                </details>

            )}

        </div>
    );
};

export default CameraAttendance;