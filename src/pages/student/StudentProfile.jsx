import { useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";
// import { useAttendance } from "../../context/AttendanceContext";

import ActivityForm from "../../components/student/ActivityForm";
import { useActivities } from "../../context/ActivityContext";

const StudentProfile = () => {
  const { id } = useParams();

  const { students } = useStudents();

  const { attendance } = useAttendance();

  const { getStudentActivities } = useActivities();

  const activities = getStudentActivities(student.id);

  const student = students.find((item) => item.id === id);

  if (!student) {
    return (
      <DashboardLayout title="Student Profile">
        <h2>Student not found</h2>
      </DashboardLayout>
    );
  }

  const studentAttendance = attendance.filter(
    (session) => session.students?.[student.id],
  );

  const totalClasses = studentAttendance.length;

  const presentCount = studentAttendance.filter(
    (session) => session.students[student.id].status === "PRESENT",
  ).length;

  const percentage =
    totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 100);

  return (
    <DashboardLayout title="Student Profile">
      <div className="space-y-6">
        {/* Basic Details */}

        <div className="border p-5">
          <h2 className="text-2xl font-bold">{student.name}</h2>

          <p>
            Roll Number:
            {student.rollNumber}
          </p>

          <p>
            Department:
            {student.department}
          </p>

          <p>
            Semester:
            {student.semester}
          </p>

          <p>
            Section:
            {student.section}
          </p>
        </div>

        {/* Attendance Summary */}

        <div className="grid grid-cols-3 gap-5">
          <div className="border p-5">
            <h3>Total Labs</h3>

            <p className="text-3xl">{totalClasses}</p>
          </div>

          <div className="border p-5">
            <h3>Present</h3>

            <p className="text-3xl">{presentCount}</p>
          </div>

          <div className="border p-5">
            <h3>Attendance %</h3>

            <p className="text-3xl">{percentage}%</p>
          </div>
        </div>

        {/* Future Activities */}

        <div className="grid grid-cols-2 gap-6">
          <ActivityForm studentId={student.id} />

          <div className="border p-5">
            <h2 className="text-xl font-bold mb-4">Activities History</h2>

            {activities.length === 0 ? (
              <p>No activities added.</p>
            ) : (
              activities.map((item) => (
                <div key={item.id} className="border p-3 mb-3">
                  <h3 className="font-bold">{item.title}</h3>

                  <p>Type: {item.type}</p>

                  <p>{item.description}</p>

                  {item.marks && <p>Marks: {item.marks}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
