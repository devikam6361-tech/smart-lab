import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useTeachers } from "../../context/TeacherContext";
import { useStudents } from "../../context/StudentContext";
import { useLabs } from "../../context/LabContext";
import { useProjects } from "../../context/ProjectContext";
import { useAssignments } from "../../context/AssignmentContext";
import { useLabSession } from "../../context/LabSessionContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { teachers } = useTeachers();
  const { students } = useStudents();
  const { labs } = useLabs();
  const { projects } = useProjects();
  const { assignments } = useAssignments();
  const { sessions } = useLabSession();

  const activeLabs = labs.filter(
    (lab) => lab.status === "ACTIVE"
  ).length;

  const activeSessions = sessions.filter(
    (session) => session.status === "ACTIVE"
  ).length;

  const completedSessions = sessions.filter(
    (session) => session.status === "COMPLETED"
  ).length;

  return (
    <DashboardLayout title="HOD Dashboard">

      {/* Welcome */}

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl text-white p-8 mb-8 shadow">

        <h1 className="text-4xl font-bold">
          Welcome HOD 👋
        </h1>

        <p className="mt-3 text-indigo-100 text-lg">
          Manage your department, teachers, students and laboratories from one place.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500">
            Teachers
          </p>

          <h2 className="text-4xl font-bold mt-3 text-blue-600">
            {teachers.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500">
            Students
          </p>

          <h2 className="text-4xl font-bold mt-3 text-green-600">
            {students.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500">
            Laboratories
          </p>

          <h2 className="text-4xl font-bold mt-3 text-purple-600">
            {labs.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500">
            Active Labs
          </p>

          <h2 className="text-4xl font-bold mt-3 text-red-500">
            {activeLabs}
          </h2>
        </div>

      </div>

      {/* Second Row */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500">
            Projects
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {projects.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500">
            Assignments
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {assignments.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500">
            Active Sessions
          </p>

          <h2 className="text-4xl font-bold mt-3 text-orange-500">
            {activeSessions}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500">
            Completed Sessions
          </p>

          <h2 className="text-4xl font-bold mt-3 text-green-600">
            {completedSessions}
          </h2>
        </div>

      </div>

      {/* Quick Actions */}

      <div className="bg-white rounded-xl border shadow p-6 mb-10">

        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">

          <button
            onClick={() => navigate("/hod/teachers")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold"
          >
            Teachers
          </button>

          <button
            onClick={() => navigate("/hod/clerks")}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 font-semibold"
          >
            Clerks
          </button>

          <button
            onClick={() => navigate("/hod/labs")}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4 font-semibold"
          >
            Labs
          </button>

          <button
            onClick={() => navigate("/hod/reports")}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-4 font-semibold"
          >
            Reports
          </button>


        </div>

      </div>

      {/* Department Status */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-2xl font-bold mb-5">
          Department Overview
        </h2>

        <div className="space-y-4 text-lg">

          <p>
            👨‍🏫 Teachers Available :
            <strong> {teachers.length}</strong>
          </p>

          <p>
            👨‍🎓 Students Registered :
            <strong> {students.length}</strong>
          </p>

          <p>
            🧪 Laboratories :
            <strong> {labs.length}</strong>
          </p>

          <p>
            📚 Projects :
            <strong> {projects.length}</strong>
          </p>

          <p>
            📝 Assignments :
            <strong> {assignments.length}</strong>
          </p>

          <p>
            🟢 Active Sessions :
            <strong> {activeSessions}</strong>
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;