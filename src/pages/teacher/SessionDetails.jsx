import { useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLabSession } from "../../context/LabSessionContext";
import { useState } from "react";

const SessionDetails = () => {
  const { id } = useParams();

  const [editingStudent, setEditingStudent] = useState(null);

  const {
    getSession,
    updateStudentDetails,
} = useLabSession();

  const session = getSession(id);

  if (!session) {
    return (
      <DashboardLayout title="Session">
        Session Not Found
      </DashboardLayout>
    );
  }

  return (
  <DashboardLayout title="Session Details">
    {/* Session Information */}

    <h1 className="text-3xl font-bold mb-6">
      {session.lab.labName}
    </h1>

    <div className="border rounded p-5 mb-8">
      <p>
        <strong>Date :</strong>{" "}
        {new Date(session.date).toLocaleDateString()}
      </p>

      <p>
        <strong>Teacher :</strong> {session.teacher.name}
      </p>

      <p>
        <strong>Department :</strong> {session.department}
      </p>

      <p>
        <strong>Semester :</strong> {session.semester}
      </p>

      <p>
        <strong>Section :</strong> {session.section}
      </p>

      <p>
        <strong>Started :</strong> {session.startTime}
      </p>

      <p>
        <strong>Ended :</strong> {session.endTime}
      </p>
    </div>

    {/* Students */}

    <h2 className="text-2xl font-bold mb-5">
      Students
    </h2>

    <div className="space-y-5">
      {session.students.map((student) => (
        <div
  key={student.studentId}
  className="border rounded p-5"
>
  <h3 className="text-lg font-bold">
    {student.name}
  </h3>

  <p>{student.usn}</p>

  <div className="grid md:grid-cols-2 gap-4 mt-5">

    <div>
      <p className="font-semibold">Attendance</p>

      <p className="mt-1">
        {student.attendance}
      </p>
    </div>

    <div>
      <p className="font-semibold">Entry Time</p>

      <p className="mt-1">
        {student.entryTime || "--"}
      </p>
    </div>

    <div>
      <p className="font-semibold">Exit Time</p>

      {editingStudent === student.studentId ? (
        <div className="flex gap-2 mt-2">

          <input
            type="time"
            min={student.entryTime}
            max={session.endTime}
            value={student.exitTime || session.endTime}
            className="border p-2 rounded flex-1"
            onChange={(e) =>
              updateStudentDetails(
                session.id,
                student.studentId,
                {
                  exitTime: e.target.value,
                }
              )
            }
          />

          <button
            className="border px-4 rounded"
            onClick={() =>
              setEditingStudent(null)
            }
          >
            Save
          </button>

        </div>
      ) : (
        <div className="flex items-center gap-3 mt-2">

          <span>
            {student.exitTime || "--"}
          </span>

          <button
            className="border px-3 py-1 rounded"
            onClick={() =>
              setEditingStudent(student.studentId)
            }
          >
            Edit
          </button>

        </div>
      )}
    </div>

    <div>
      <p className="font-semibold">Remarks</p>

      {editingStudent === student.studentId ? (

        <input
          className="border p-2 rounded w-full mt-2"
          value={student.remarks || ""}
          placeholder="Enter remarks..."
          onChange={(e) =>
            updateStudentDetails(
              session.id,
              student.studentId,
              {
                remarks: e.target.value,
              }
            )
          }
        />

      ) : (

        <p className="mt-2">
          {student.remarks || "--"}
        </p>

      )}
    </div>

  </div>
</div>
      ))}
    </div>
  </DashboardLayout>
);
};

export default SessionDetails;