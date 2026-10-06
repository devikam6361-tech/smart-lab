import React from "react";
import { useStudents } from "../../context/StudentContext";

const StudentLabAssignment = () => {
  const { students } = useStudents();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">
        Student Lab Assignment
      </h2>

      {students.length === 0 ? (
        <p className="text-gray-500">
          No students found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">USN</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">
                  Department
                </th>
                <th className="border p-3 text-left">
                  Semester
                </th>
                <th className="border p-3 text-left">
                  Assigned Labs
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border p-3">
                    {student.usn}
                  </td>

                  <td className="border p-3">
                    {student.name}
                  </td>

                  <td className="border p-3">
                    {student.department}
                  </td>

                  <td className="border p-3">
                    {student.semester}
                  </td>

                  <td className="border p-3">
                    {student.assignedLabs &&
                    student.assignedLabs.length > 0
                      ? student.assignedLabs.join(", ")
                      : "Not Assigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentLabAssignment;