import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";
import { useTeachers } from "../../context/TeacherContext";
import { useLabs } from "../../context/LabContext";
import { useAuth } from "../../context/AuthContext";

const Students = () => {
  const { students } = useStudents();

  const { labs } = useLabs();

  const { currentUser } = useAuth();

  const { getTeacherByUserId } = useTeachers();

  const teacher = getTeacherByUserId(currentUser?.id);

  const teacherLabs = labs.filter(
    (lab) => lab.assignedTeacherId === teacher?.id
  );

  const teacherLabIds = teacherLabs.map((lab) => lab.id);

  const myStudents = students.filter((student) =>
    student.assignedLabs?.some((labId) =>
      teacherLabIds.includes(labId)
    )
  );

  return (
    <DashboardLayout title="My Students">

      <h1 className="text-3xl font-bold mb-6">
        My Students
      </h1>

      {myStudents.length === 0 ? (
        <div className="border rounded p-5">
          No students assigned.
        </div>
      ) : (
        <div className="space-y-4">

          {myStudents.map((student) => (

            <div
              key={student.id}
              className="border rounded p-5 flex justify-between items-center"
            >

              <div>

                <h2 className="text-xl font-bold">
                  {student.name}
                </h2>

                <p>USN : {student.usn}</p>

                <p>
                  {student.department}
                </p>

                <p>
                  Semester {student.semester} | Section {student.section}
                </p>

              </div>

              <Link
                to={`/teacher/student/${student.id}`}
                className="border px-5 py-2 rounded"
              >
                View Details
              </Link>

            </div>

          ))}

        </div>
      )}

    </DashboardLayout>
  );
};

export default Students;