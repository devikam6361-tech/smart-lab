import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";

import { useStudents } from "../../context/StudentContext";
import { useTeachers } from "../../context/TeacherContext";
import { useLabSession } from "../../context/LabSessionContext";

import analyticsService from "../../services/analyticsService";
import apiService from "../../services/apiService";

const Dashboard = () => {
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { sessions, activeSession } = useLabSession();

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const records = await apiService.attendance.get();

      setAttendanceRecords(records || []);
    } catch (error) {
      console.error("Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const presentCount = attendanceRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendanceRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  return (
    <DashboardLayout title="Reports Dashboard">

      {/* Main Statistics */}

      <div className="grid grid-cols-4 gap-5">

        <StatCard
          title="Students"
          value={analyticsService.getTotalStudents(students)}
        />

        <StatCard
          title="Teachers"
          value={teachers.length}
        />

        <StatCard
          title="Completed Sessions"
          value={analyticsService.getCompletedSessions(sessions)}
        />

        <StatCard
          title="Active Sessions"
          value={analyticsService.getActiveSessions(sessions)}
        />

      </div>


      {/* Backend Attendance Statistics */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Attendance Summary
        </h2>

        <div className="grid grid-cols-3 gap-5">

          <StatCard
            title="Total Records"
            value={attendanceRecords.length}
          />

          <StatCard
            title="Present"
            value={presentCount}
          />

          <StatCard
            title="Absent"
            value={absentCount}
          />

        </div>

      </div>


      {/* Attendance History */}

      <div className="mt-10">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">
            Attendance History
          </h2>

          <button
            onClick={loadAttendance}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>

        </div>


        {loading ? (

          <div className="border rounded p-6 text-center">
            Loading attendance records...
          </div>

        ) : attendanceRecords.length === 0 ? (

          <div className="border rounded p-6 text-center">
            No attendance records found.
          </div>

        ) : (

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
                    Lab
                  </th>

                  <th className="border p-3 text-left">
                    Date
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
                    Status
                  </th>

                  <th className="border p-3 text-left">
                    Verification
                  </th>

                </tr>

              </thead>

              <tbody>

                {attendanceRecords.map((record) => (

                  <tr key={record.id}>

                    <td className="border p-3">
                      {record.usn}
                    </td>

                    <td className="border p-3">
                      {record.name}
                    </td>

                    <td className="border p-3">
                      {record.department}
                    </td>

                    <td className="border p-3">
                      {record.lab}
                    </td>

                    <td className="border p-3">
                      {record.date}
                    </td>

                    <td className="border p-3">
                      {record.entryTime || "-"}
                    </td>

                    <td className="border p-3">
                      {record.exitTime || "-"}
                    </td>

                    <td className="border p-3">
                      {record.duration || "-"}
                    </td>

                    <td className="border p-3">

                      <span
                        className={`px-3 py-1 rounded ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status}
                      </span>

                    </td>

                    <td className="border p-3">
                      {record.verificationMode || "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* Live Session */}

      {activeSession && (

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Live Session
          </h2>

          <div className="grid grid-cols-4 gap-5">

            <StatCard
              title="Present"
              value={analyticsService.getPresentCount(activeSession)}
            />

            <StatCard
              title="Absent"
              value={analyticsService.getAbsentCount(activeSession)}
            />

            <StatCard
              title="Late"
              value={analyticsService.getLateCount(activeSession)}
            />

            <StatCard
              title="Attendance %"
              value={`${analyticsService.getAttendancePercentage(activeSession)}%`}
            />

          </div>

        </div>

      )}

    </DashboardLayout>
  );
};

export default Dashboard;