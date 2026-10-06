import { useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";
import { useLabSession } from "../../context/LabSessionContext";
import { useProjects } from "../../context/ProjectContext";
import ProjectCard from "../../components/teacher/ProjectCard";

import { useAssignments } from "../../context/AssignmentContext";
import AssignmentCard from "../../components/teacher/AssignmentCard";
import { useState } from "react";

const StudentDetails = () => {
  const { id } = useParams();

  const { getStudentById } = useStudents();

  const { sessions } = useLabSession();

  const { projects, updateProject } = useProjects();
  const { assignments, updateAssignment } = useAssignments();

  const student = getStudentById(id);

  const [performance, setPerformance] = useState(
    student.activities.labPerformance || {
      rating: "GOOD",

      teacherRemarks: "",
    },
  );

  if (!student) {
    return (
      <DashboardLayout title="Student Details">
        Student not found.
      </DashboardLayout>
    );
  }

  const attendance = [];

  sessions.forEach((session) => {
    session.students.forEach((s) => {
      if (String(s.studentId) === String(student.id)) {
        attendance.push(s);
      }
    });
  });

  const present = attendance.filter((a) => a.attendance === "PRESENT").length;

  const absent = attendance.filter((a) => a.attendance === "ABSENT").length;

  const late = attendance.filter((a) => a.attendance === "LATE").length;

  const percentage =
    attendance.length === 0
      ? 0
      : Math.round(((present + late) / attendance.length) * 100);

  const studentProjects = projects.filter((project) =>
    project.assignedStudents?.some(
      (assignedStudent) =>
        String(assignedStudent.studentId) === String(student.id),
    ),
  );

const studentAssignments = assignments.filter((assignment) =>
  assignment.assignedStudents?.some(
    (assignedStudent) =>
      String(assignedStudent.studentId) === String(student.id)
  )
);

  return (
    <DashboardLayout title="Student Details">
      {/* Profile */}

      <div className="border rounded p-6 mb-6">
        <h1 className="text-3xl font-bold mb-5">{student.name}</h1>

        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>USN</strong>
            <br />
            {student.usn}
          </p>

          <p>
            <strong>Department</strong>
            <br />
            {student.department}
          </p>

          <p>
            <strong>Semester</strong>
            <br />
            {student.semester}
          </p>

          <p>
            <strong>Section</strong>
            <br />
            {student.section}
          </p>
        </div>
      </div>

      {/* Attendance */}

      <div className="border rounded p-6">
        <h2 className="text-2xl font-bold mb-5">Attendance Summary</h2>

        <div className="grid grid-cols-4 gap-5">
          <div className="border rounded p-4 text-center">
            <h3 className="text-lg font-semibold">Present</h3>

            <p className="text-3xl mt-3">{present}</p>
          </div>

          <div className="border rounded p-4 text-center">
            <h3 className="text-lg font-semibold">Late</h3>

            <p className="text-3xl mt-3">{late}</p>
          </div>

          <div className="border rounded p-4 text-center">
            <h3 className="text-lg font-semibold">Absent</h3>

            <p className="text-3xl mt-3">{absent}</p>
          </div>

          <div className="border rounded p-4 text-center">
            <h3 className="text-lg font-semibold">Attendance %</h3>

            <p className="text-3xl mt-3">{percentage}%</p>
          </div>
        </div>
      </div>

      {/* ================= Projects ================= */}

<div className="border rounded p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    Assigned Projects
  </h2>

  {studentProjects.length === 0 ? (
    <p>No Projects Assigned.</p>
  ) : (
    <div className="space-y-5">
      {studentProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          student={student}
          updateProject={updateProject}
        />
      ))}
    </div>
  )}
</div>

      {/* ================= Assignments ================= */}

<div className="border rounded p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    Assignments
  </h2>

  {studentAssignments.length === 0 ? (
    <p>No Assignments Assigned.</p>
  ) : (
    <div className="space-y-5">
      {studentAssignments.map((assignment) => (
  <AssignmentCard
    key={assignment.id}
    assignment={assignment}
    student={student}
    updateAssignment={updateAssignment}
  />
))}
    </div>
  )}
</div>

      <div className="border rounded p-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">Overall Lab Performance</h2>

        <label>Performance Level</label>

        <select
          className="border w-full p-2 mt-2"
          value={performance.rating}
          onChange={(e) =>
            setPerformance({
              ...performance,

              rating: e.target.value,
            })
          }
        >
          <option value="POOR">Poor</option>

          <option value="AVERAGE">Average</option>

          <option value="GOOD">Good</option>

          <option value="VERY_GOOD">Very Good</option>

          <option value="EXCELLENT">Excellent</option>
        </select>

        <label className="block mt-6">Teacher Remarks</label>

        <textarea
          rows={5}
          className="border w-full p-3 mt-2"
          value={performance.teacherRemarks}
          onChange={(e) =>
            setPerformance({
              ...performance,

              teacherRemarks: e.target.value,
            })
          }
        />

        <button
          className="border px-5 py-2 mt-5"
          onClick={() => {
            updateLabPerformance(
              student.id,

              performance,
            );

            alert("Performance Saved");
          }}
        >
          Save Evaluation
        </button>
      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;
