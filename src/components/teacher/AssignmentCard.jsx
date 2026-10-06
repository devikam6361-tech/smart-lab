import { useState } from "react";

const AssignmentCard = ({ assignment, student, updateAssignment }) => {
  const studentAssignment = assignment.assignedStudents.find(
    (s) => String(s.studentId) === String(student.id),
  );

  const [remarks, setRemarks] = useState(
    studentAssignment?.teacherRemarks || "",
  );

  const [marks, setMarks] = useState(studentAssignment?.marks || "");

  const updateStudent = (updates) => {
    const updatedStudents = assignment.assignedStudents.map((s) =>
      String(s.studentId) === String(student.id) ? { ...s, ...updates } : s,
    );

    updateAssignment(assignment.id, {
      assignedStudents: updatedStudents,
    });
  };

  const save = () => {
    updateStudent({
      teacherRemarks: remarks,
      marks,
    });

    alert("Assignment Updated");
  };

  return (
    <div className="border rounded p-5">
      <h3 className="text-xl font-bold">{assignment.title}</h3>

      <p className="mt-2">{assignment.description}</p>

      <p className="mt-2">Due : {assignment.deadline}</p>

      <div className="mt-5">
        <label>Status</label>

        <select
          className="border p-2 w-full mt-2"
          value={studentAssignment?.status || "PENDING"}
          onChange={(e) =>
            updateStudent({
              status: e.target.value,
            })
          }
        >
          <option value="PENDING">Pending</option>

          <option value="SUBMITTED">Submitted</option>

          <option value="EVALUATED">Evaluated</option>
        </select>
      </div>

      <div className="mt-5">
        <label>Marks</label>

        <input
          type="number"
          className="border w-full p-2 mt-2"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <label>Teacher Remarks</label>

        <textarea
          rows={3}
          className="border w-full p-2 mt-2"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <button className="border px-5 py-2 mt-5" onClick={save}>
        Save
      </button>
    </div>
  );
};

export default AssignmentCard;
