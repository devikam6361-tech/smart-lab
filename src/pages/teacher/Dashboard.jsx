import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useLabs } from "../../context/LabContext";
import { useTeachers } from "../../context/TeacherContext";
import { useStudents } from "../../context/StudentContext";
import { useLabSession } from "../../context/LabSessionContext";
import { useAuth } from "../../context/AuthContext";
import { useAssignments } from "../../context/AssignmentContext";
import { useProjects } from "../../context/ProjectContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const { labs } = useLabs();

  const { students } = useStudents();

  // const { startSession } = useLabSession();
  const { startSession, sessions } = useLabSession();

  const { getTeacherByUserId } = useTeachers();

  const { assignments } = useAssignments();
  const { projects } = useProjects();

  const teacher = getTeacherByUserId(currentUser?.id);

  const assignedLabs = labs.filter(
    (lab) => lab.assignedTeacherId === teacher?.id,
  );

  const totalStudents = students.filter((student) =>
    student.assignedLabs?.some((labId) =>
      assignedLabs.some((lab) => lab.id === labId),
    ),
  ).length;

  const completedSessions = sessions.filter(
    (session) =>
      session.teacher.id === teacher.id && session.status === "COMPLETED",
  ).length;

  const pendingAssignments = assignments.reduce(
    (count, assignment) =>
      count +
      assignment.assignedStudents.filter(
        (student) => student.status !== "COMPLETED",
      ).length,
    0,
  );

  const myProjects = projects.filter(
    (project) => project.teacherId === teacher.id,
  );

  const pendingProjects = myProjects.reduce(
    (count, project) =>
      count +
      project.assignedStudents.filter(
        (student) => student.status !== "COMPLETED",
      ).length,
    0,
  );

  const handleStartSession = (lab) => {
    const sessionStudents = students.filter((student) =>
      student.assignedLabs?.includes(lab.id),
    );

    if (sessionStudents.length === 0) {
      alert("No students are assigned to this lab.");
      return;
    }

    startSession({
      teacher,
      lab,
      department: lab.department,
      semester: lab.assignedSemester,
      section: lab.assignedSection,
      students: sessionStudents,
    });

    navigate("/teacher/attendance");
  };

  return (
    <DashboardLayout title="Teacher Dashboard">
      {/* Header */}

      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <h1 className="text-3xl font-bold">Welcome, {teacher?.name} 👋</h1>

        <p className="text-gray-500 mt-2">
          Manage your labs, attendance, projects and assignments.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-blue-600 font-semibold">Students</p>

          <h2 className="text-4xl font-bold mt-3">{totalStudents}</h2>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-green-600 font-semibold">My Labs</p>

          <h2 className="text-4xl font-bold mt-3">{assignedLabs.length}</h2>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <p className="text-purple-600 font-semibold">Sessions</p>

          <h2 className="text-4xl font-bold mt-3">{completedSessions}</h2>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <p className="text-yellow-600 font-semibold">Pending Assignments</p>

          <h2 className="text-4xl font-bold mt-3">{pendingAssignments}</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-red-600 font-semibold">Pending Projects</p>

          <h2 className="text-4xl font-bold mt-3">{pendingProjects}</h2>
        </div>
      </div>

      {/* Quick Actions */}

      <div className="bg-white border rounded-xl p-6 shadow-sm mb-10">
        <h2 className="text-2xl font-bold mb-5">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/teacher/projects")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Projects
          </button>

          <button
            onClick={() => navigate("/teacher/assignments")}
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Assignments
          </button>

          <button
            onClick={() => navigate("/teacher/sessions")}
            className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Session History
          </button>
        </div>
      </div>

      {/* My Labs */}

      <h2 className="text-2xl font-bold mb-6">My Assigned Labs</h2>

      {assignedLabs.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No Lab Assigned
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignedLabs.map((lab) => (
            <div
              key={lab.id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition p-6"
            >
              <h3 className="text-xl font-bold mb-3">{lab.labName}</h3>

              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Department :</strong> {lab.department}
                </p>

                <p>
                  <strong>Semester :</strong> {lab.assignedSemester}
                </p>

                <p>
                  <strong>Section :</strong> {lab.assignedSection}
                </p>
              </div>

              <button
                onClick={() => handleStartSession(lab)}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3"
              >
                Start Today's Session
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
