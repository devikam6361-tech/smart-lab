import { useStudents } from "../../contexts/StudentContext";

const StudentStats = () => {
  const { students } = useStudents();

  const total = students.length;

  const departments = [
    ...new Set(
      students.map(
        (student) => student.department
      )
    ),
  ];

  return (
    <div className="grid grid-cols-2 gap-4">

      <div className="border p-4 rounded">

        <h3>Total Students</h3>

        <h1 className="text-3xl">
          {total}
        </h1>

      </div>

      <div className="border p-4 rounded">

        <h3>Departments</h3>

        <h1 className="text-3xl">
          {departments.length}
        </h1>

      </div>

    </div>
  );
};

export default StudentStats;