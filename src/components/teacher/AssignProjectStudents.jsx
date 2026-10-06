import { useState } from "react";

import { useStudents } from "../../context/StudentContext";
import { useProjects } from "../../context/ProjectContext";
import { useLabs } from "../../context/LabContext";

const AssignProjectStudents = ({ project, onClose }) => {
  const { students } = useStudents();

  const { assignStudents } = useProjects();

  const { labs } = useLabs();

  const [selectedStudents, setSelectedStudents] = useState(
  project.assignedStudents?.map((student) => student.studentId) || []
);

  const lab = labs.find((l) => l.id === project.labId);

  console.log("Project :", project);
console.log("Labs :", labs);
console.log("Students :", students);

  const eligibleStudents = students.filter((student) =>
  student.assignedLabs?.includes(project.labId)
);

  console.log("Eligible :", eligibleStudents);

 const toggleStudent = (studentId) => {
  if (selectedStudents.includes(studentId)) {
    setSelectedStudents((prev) =>
      prev.filter((id) => id !== studentId)
    );
  } else {
    setSelectedStudents((prev) => [
      ...prev,
      studentId,
    ]);
  }
};

  const save = () => {
    assignStudents(project.id, selectedStudents);

    alert("Students Assigned Successfully");

    onClose();
  };

  return (
    <div className="border rounded p-5 mt-5">

      <h2 className="text-xl font-bold mb-4">
        Assign Students
      </h2>

      {eligibleStudents.length === 0 ? (
        <p>No Eligible Students Found.</p>
      ) : (
        <>
          <div className="space-y-3">

            {eligibleStudents.map((student) => (
              <label
                key={student.id}
                className="flex gap-3 items-center"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                />

                <span>
                  {student.usn} - {student.name}
                </span>

              </label>
            ))}

          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={save}
              className="border px-5 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={onClose}
              className="border px-5 py-2 rounded"
            >
              Cancel
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default AssignProjectStudents;