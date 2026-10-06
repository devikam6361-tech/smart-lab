import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLabSession } from "../../context/LabSessionContext";

const Attendance = () => {
  const navigate = useNavigate();

  const {
  activeSession,
  markAttendance,
  endSession,
} = useLabSession();

  if (!activeSession) {
    return (
      <DashboardLayout title="Attendance">

        <div className="border rounded p-6 text-center">
          

          <h2 className="text-2xl font-bold">No Active Lab Session</h2>

          <p className="mt-3 text-gray-600">
            Please start a lab session from the Teacher Dashboard.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const finishSession = () => {
  console.log("Ending Session:", activeSession.id);

  endSession(activeSession.id);

  alert("Lab Session Completed");

  navigate("/teacher");
};

  return (
    <DashboardLayout title="Attendance">
      {/* Session Details */}

      <div className="border rounded p-5 mb-6">
        <h2 className="text-2xl font-bold">{activeSession.lab.labName}</h2>

        <p className="mt-2">
          <strong>Department:</strong> {activeSession.department}
        </p>

        <p>
          <strong>Semester:</strong> {activeSession.semester}
        </p>

        <p>
          <strong>Section:</strong> {activeSession.section}
        </p>

        <p>
          <strong>Teacher:</strong> {activeSession.teacher.name}
        </p>

        <p>
          <strong>Started:</strong> {activeSession.startTime}
        </p>
      </div>

      {/* Students */}

      <h2 className="text-2xl font-bold mb-5">
        Students ({activeSession.students.length})
      </h2>

      <div className="space-y-4">
        {activeSession.students.map((student) => (
          <div
            key={student.studentId}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{student.name}</h3>

              <p className="text-gray-500">{student.rollNumber}</p>

              <p className="mt-2">
                Status :
                <span className="font-semibold ml-2">{student.attendance}</span>
              </p>

              <p>
                Entry Time : {student.entryTime || "--"}
              </p>

              <p>
                Exit Time : {student.exitTime || "--"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-3 py-2 rounded"
                onClick={() =>
                  markAttendance(activeSession.id, student.studentId, "PRESENT")
                }
              >
                Present
              </button>

              <button
                className="bg-red-600 text-white px-3 py-2 rounded"
                onClick={() =>
                  markAttendance(activeSession.id, student.studentId, "ABSENT")
                }
              >
                Absent
              </button>

              <button
                className="bg-yellow-500 text-white px-3 py-2 rounded"
                onClick={() =>
                  markAttendance(activeSession.id, student.studentId, "LATE")
                }
              >
                Late
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Finish Session */}

      <div className="mt-8">
        <button onClick={finishSession} className="border px-6 py-3 rounded">
          End Lab Session
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;