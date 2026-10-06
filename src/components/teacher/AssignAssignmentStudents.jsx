import { useState } from "react";

import { useStudents } from "../../context/StudentContext";
import { useAssignments } from "../../context/AssignmentContext";

const AssignAssignmentStudents = ({
  assignment,
  onClose,
}) => {
  const { students } = useStudents();

  const { assignStudents } =
    useAssignments();

  const [selectedStudents, setSelectedStudents] = useState(
  assignment.assignedStudents?.map(
    (student) => student.studentId
  ) || []
);

  const eligibleStudents =
    students.filter((student) =>
      student.assignedLabs?.includes(
        assignment.labId
      )
    );

  const toggleStudent = (studentId) => {
    if (
      selectedStudents.includes(studentId)
    ) {
      setSelectedStudents((prev) =>
        prev.filter(
          (id) => id !== studentId
        )
      );
    } else {
      setSelectedStudents((prev) => [
        ...prev,
        studentId,
      ]);
    }
  };

  const save = () => {
    assignStudents(
      assignment.id,
      selectedStudents
    );

    alert("Assignment Assigned");

    onClose();
  };

  return (
    <div className="border rounded p-5 mt-6">

      <h2 className="text-2xl font-bold mb-5">
        Assign Students
      </h2>

      {eligibleStudents.map((student) => (
        <label
          key={student.id}
          className="flex gap-3 mb-3"
        >
          <input
            type="checkbox"
            checked={selectedStudents.includes(
              student.id
            )}
            onChange={() =>
              toggleStudent(student.id)
            }
          />

          {student.usn} - {student.name}

        </label>
      ))}

      <div className="flex gap-3 mt-5">

        <button
          className="border px-5 py-2"
          onClick={save}
        >
          Save
        </button>

        <button
          className="border px-5 py-2"
          onClick={onClose}
        >
          Cancel
        </button>

      </div>

    </div>
  );
};
export default AssignAssignmentStudents;