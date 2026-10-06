import { useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";
import { useLabs } from "../../context/LabContext";
import { useLabSession } from "../../context/LabSessionContext";

const StudentDetails = () => {
  const { id } = useParams();

  const { getStudentById } = useStudents();

  const { labs } = useLabs();

  const { sessions } = useLabSession();

  const student = getStudentById(Number(id));

  if (!student) {
    return (
      <DashboardLayout title="Student Details">
        Student Not Found
      </DashboardLayout>
    );
  }

  const assignedLabs = labs.filter((lab) =>
    student.assignedLabs?.includes(lab.id)
  );

  const studentSessions = sessions.filter((session) =>
    session.students.some(
      (item) => item.studentId === student.id
    )
  );

  let present = 0;
  let absent = 0;
  let late = 0;

  studentSessions.forEach((session) => {
    const record = session.students.find(
      (item) => item.studentId === student.id
    );

    if (!record) return;

    if (record.attendance === "PRESENT") present++;

    if (record.attendance === "ABSENT") absent++;

    if (record.attendance === "LATE") late++;
  });

  const percentage =
    studentSessions.length === 0
      ? 0
      : (
          ((present + late) / studentSessions.length) *
          100
        ).toFixed(1);

  return (
    <DashboardLayout title="Student Details">
      <h1 className="text-3xl font-bold mb-6">
        Student Profile
      </h1>

      {/* Student */}

      <div className="border rounded p-5 mb-6">

        <p><strong>USN :</strong> {student.usn}</p>

        <p><strong>Name :</strong> {student.name}</p>

        <p><strong>Department :</strong> {student.department}</p>

        <p><strong>Semester :</strong> {student.semester}</p>

        <p><strong>Section :</strong> {student.section}</p>

      </div>

      {/* Assigned Labs */}

      <div className="border rounded p-5 mb-6">

        <h2 className="text-xl font-bold mb-3">
          Assigned Labs
        </h2>

        {assignedLabs.length === 0 ? (
          <p>No Labs Assigned</p>
        ) : (
          assignedLabs.map((lab) => (
            <p key={lab.id}>
              • {lab.labName}
            </p>
          ))
        )}

      </div>

      {/* Attendance */}

      <div className="border rounded p-5 mb-6">

        <h2 className="text-xl font-bold mb-3">
          Attendance Summary
        </h2>

        <p>Present : {present}</p>

        <p>Late : {late}</p>

        <p>Absent : {absent}</p>

        <p>Total Sessions : {studentSessions.length}</p>

        <p>
          Attendance :
          {" "}
          {percentage}%
        </p>

      </div>

      {/* Session History */}

      <div className="border rounded p-5">

        <h2 className="text-xl font-bold mb-4">
          Session History
        </h2>

        {studentSessions.length === 0 ? (
          <p>No Sessions</p>
        ) : (
          studentSessions
            .slice()
            .reverse()
            .map((session) => {
              const record = session.students.find(
                (item) =>
                  item.studentId === student.id
              );

              return (
                <div
                  key={session.id}
                  className="border rounded p-4 mb-4"
                >
                  <h3 className="font-bold">
                    {session.lab.labName}
                  </h3>

                  <p>
                    {new Date(
                      session.date
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Status :
                    {" "}
                    {record.attendance}
                  </p>

                  <p>
                    Entry :
                    {" "}
                    {record.entryTime || "--"}
                  </p>

                  <p>
                    Exit :
                    {" "}
                    {record.exitTime || "--"}
                  </p>

                  <p>
                    Remarks :
                    {" "}
                    {record.remarks || "--"}
                  </p>
                </div>
              );
            })
        )}

      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;