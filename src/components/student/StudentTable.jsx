import { Link } from "react-router-dom";

import DataTable from "../common/DataTable";
import Button from "../common/Button";

// import { Link } from "react-router-dom";

import { useStudents } from "../../context/StudentContext";

const StudentTable = ({ onEdit }) => {
  const { students, deleteStudent } = useStudents();

  const columns = [
    {
      title: "USN",
      key: "usn",
    },

    {
      title: "Name",
      key: "name",
    },

    {
      title: "Department",
      key: "department",
    },

    {
      title: "Semester",
      key: "semester",
    },

    {
      title: "Section",
      key: "section",
    },

    {
      title: "Actions",

      key: "actions",

      render: (student) => (
        <div className="flex gap-2">
          <Button onClick={() => onEdit(student)}>Edit</Button>

          <Button onClick={() => deleteStudent(student.id)}>Delete</Button>

          <Link
            to={`/clerk/student/${student.id}`}
            className="border px-3 py-1 rounded"
          >
            View Actions
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={students}
      emptyMessage="No Students Found"
    />
  );
};

export default StudentTable;
