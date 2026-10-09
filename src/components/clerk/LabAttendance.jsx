import React, { useEffect, useState } from "react";
import { useStudents } from "../../context/StudentContext";
import { useLabs } from "../../context/LabContext";

const LabAttendance = () => {
    const { students = [] } = useStudents();
    const { labs = [] } = useLabs();

    const [attendance, setAttendance] = useState([]);

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [lab, setLab] = useState("DBMS Lab");
    const [loading, setLoading] = useState(false);

    // =====================================================
    // SET FIRST AVAILABLE LAB
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
    // DIRECT BACKEND CALL
    // =====================================================

    const loadAttendance = async () => {
        if (!lab) {
            return;
        }

        try {
            setLoading(true);

            const url =
                `http://127.0.0.1:8000/api/v1/attendance` +
                `?date=${encodeURIComponent(date)}` +
                `&lab=${encodeURIComponent(lab)}`;

            console.log("FETCHING:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Backend returned ${response.status}`
                );
            }

            const data = await response.json();

            console.log(
                "DIRECT BACKEND ATTENDANCE:",
                data
            );

            setAttendance(
                Array.isArray(data) ? data : []
            );

        } catch (error) {
            console.error(
                "ATTENDANCE ERROR:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD ON PAGE OPEN / DATE / LAB CHANGE
    // =====================================================

    useEffect(() => {
        loadAttendance();
    }, [date, lab]);

    // =====================================================
    // AUTO REFRESH EVERY 2 SECONDS
    // =====================================================

    useEffect(() => {
        const timer = setInterval(() => {
            loadAttendance();
        }, 2000);

        return () => clearInterval(timer);
    }, [date, lab]);

    // =====================================================
    // FIND ATTENDANCE USING USN
    // =====================================================

    const getRecord = (student) => {
        if (!student) {
            return null;
        }

        const studentUSN = String(
            student.usn || ""
        )
            .trim()
            .toUpperCase();

        return attendance.find((record) => {
            const recordUSN = String(
                record.usn || ""
            )
                .trim()
                .toUpperCase();

            return recordUSN === studentUSN;
        });
    };

    // =====================================================
    // COUNTS
    // =====================================================

    const presentCount = students.filter(
        (student) => {
            const record = getRecord(student);

            return (
                record &&
                String(record.status)
                    .trim()
                    .toLowerCase() === "present"
            );
        }
    ).length;

    const absentCount =
        students.length - presentCount;

    // =====================================================
    // MANUAL PRESENT
    // =====================================================

    const markPresent = async (student) => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/v1/attendance/mark",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        usn: student.usn,
                        date: date,
                        lab_name: lab,
                        status: "Present",
                    }),
                }
            );

            if (!response.ok) {
                const error =
                    await response.text();

                throw new Error(error);
            }

            await loadAttendance();

        } catch (error) {
            console.error(error);

            alert(
                `Failed to mark Present: ${error.message}`
            );
        }
    };

    // =====================================================
    // MANUAL ABSENT
    // =====================================================

    const markAbsent = async (student) => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/v1/attendance/mark",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        usn: student.usn,
                        date: date,
                        lab_name: lab,
                        status: "Absent",
                    }),
                }
            );

            if (!response.ok) {
                const error =
                    await response.text();

                throw new Error(error);
            }

            await loadAttendance();

        } catch (error) {
            console.error(error);

            alert(
                `Failed to mark Absent: ${error.message}`
            );
        }
    };

    // =====================================================
    // ENTRY
    // =====================================================

    const recordEntry = async (student) => {
        try {
            const time =
                new Date().toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }
                );

            const response = await fetch(
                "http://127.0.0.1:8000/api/v1/attendance/entry",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        usn: student.usn,
                        date: date,
                        lab_name: lab,
                        time: time,
                    }),
                }
            );

            if (!response.ok) {
                const error =
                    await response.text();

                throw new Error(error);
            }

            await loadAttendance();

        } catch (error) {
            console.error(error);

            alert(
                `Entry failed: ${error.message}`
            );
        }
    };

    // =====================================================
    // EXIT
    // =====================================================

    const recordExit = async (student) => {
        try {
            const time =
                new Date().toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }
                );

            const response = await fetch(
                "http://127.0.0.1:8000/api/v1/attendance/exit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        usn: student.usn,
                        date: date,
                        lab_name: lab,
                        time: time,
                    }),
                }
            );

            if (!response.ok) {
                const error =
                    await response.text();

                throw new Error(error);
            }

            await loadAttendance();

        } catch (error) {
            console.error(error);

            alert(
                `Exit failed: ${error.message}`
            );
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-2xl font-bold text-gray-800">
                Lab Attendance
            </h2>

            <p className="text-gray-500 mb-6">
                Manage student attendance and lab usage
            </p>

            {/* FILTERS */}

            <div className="flex gap-6 mb-6">

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Lab
                    </label>

                    <select
                        value={lab}
                        onChange={(e) =>
                            setLab(e.target.value)
                        }
                        className="border rounded px-3 py-2"
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

            </div>

            {loading && (
                <p className="text-blue-600 mb-4">
                    Loading attendance...
                </p>
            )}

            {/* SUMMARY */}

            <div className="grid grid-cols-3 gap-4 mb-6">

                <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-600">
                        Total Students
                    </p>

                    <p className="text-3xl font-bold">
                        {students.length}
                    </p>
                </div>

                <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-green-700">
                        Present
                    </p>

                    <p className="text-3xl font-bold text-green-700">
                        {presentCount}
                    </p>
                </div>

                <div className="bg-red-100 rounded-lg p-4">
                    <p className="text-red-700">
                        Absent
                    </p>

                    <p className="text-3xl font-bold text-red-700">
                        {absentCount}
                    </p>
                </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="bg-gray-100">

                            <th className="border p-3 text-left">
                                USN
                            </th>

                            <th className="border p-3 text-left">
                                Student
                            </th>

                            <th className="border p-3 text-left">
                                Department
                            </th>

                            <th className="border p-3 text-left">
                                Status
                            </th>

                            <th className="border p-3 text-left">
                                Entry
                            </th>

                            <th className="border p-3 text-left">
                                Exit
                            </th>

                            <th className="border p-3 text-left">
                                Duration
                            </th>

                            <th className="border p-3 text-left">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {students.map((student) => {

                            const record =
                                getRecord(student);

                            const status =
                                record?.status ||
                                "Absent";

                            return (

                                <tr
                                    key={student.usn}
                                    className="hover:bg-gray-50"
                                >

                                    <td className="border p-3">
                                        {student.usn}
                                    </td>

                                    <td className="border p-3 font-semibold">
                                        {student.name}
                                    </td>

                                    <td className="border p-3">
                                        {student.department}
                                    </td>

                                    <td className="border p-3">

                                        <span
                                            className={
                                                status ===
                                                "Present"
                                                    ? "px-3 py-1 rounded bg-green-100 text-green-700 font-semibold"
                                                    : "px-3 py-1 rounded bg-red-100 text-red-700 font-semibold"
                                            }
                                        >
                                            {status}
                                        </span>

                                    </td>

                                    <td className="border p-3">
                                        {record?.entryTime ||
                                            record?.entry_time ||
                                            "-"}
                                    </td>

                                    <td className="border p-3">
                                        {record?.exitTime ||
                                            record?.exit_time ||
                                            "-"}
                                    </td>

                                    <td className="border p-3">
                                        {record?.duration ||
                                            "-"}
                                    </td>

                                    <td className="border p-3">

                                        <div className="flex gap-2 flex-wrap">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    markPresent(
                                                        student
                                                    )
                                                }
                                                className="px-3 py-1 bg-green-600 text-white rounded"
                                            >
                                                Present
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    markAbsent(
                                                        student
                                                    )
                                                }
                                                className="px-3 py-1 bg-red-600 text-white rounded"
                                            >
                                                Absent
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    recordEntry(
                                                        student
                                                    )
                                                }
                                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                            >
                                                Entry
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    recordExit(
                                                        student
                                                    )
                                                }
                                                className="px-3 py-1 bg-gray-700 text-white rounded"
                                            >
                                                Exit
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default LabAttendance;