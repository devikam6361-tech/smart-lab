import DataTable from "../common/DataTable";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";


import { useTeachers } from "../../context/TeacherContext";

const TeacherTable = ({ onEdit }) => {
  const { teachers, deleteTeacher } = useTeachers();
  const { deleteUser } = useAuth();

  const columns = [
    {
      title: "Employee ID",
      key: "employeeId",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Department",
      key: "department",
    },
    {
      title: "Assigned Subjects",
      key: "assignedSubjects",
      render: (teacher) => (
        <span>
          {teacher.assignedSubjects?.length || 0}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (teacher) => (
        <div className="flex gap-2">
          <Button onClick={() => onEdit(teacher)}>
            Edit
          </Button>

          <Button
  onClick={() => {

    deleteTeacher(teacher.id);

    deleteUser(teacher.userId);

  }}
>
  Delete
</Button>
            
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={teachers}
      emptyMessage="No Teachers Found"
    />
  );
};

export default TeacherTable;