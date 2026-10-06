import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import StudentForm from "../../components/student/StudentForm";
import StudentTable from "../../components/student/StudentTable";

const menu = [
  {
    label: "Dashboard",
    path: "/clerk",
  },
  {
    label: "Students",
    path: "/clerk/students",
  },
];

const StudentManagement = () => {
  const [editingStudent, setEditingStudent] =
    useState(null);

  return (
    <DashboardLayout
      title="Student Management"
      menu={menu}
    >
      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-4">

          <StudentForm
            editingStudent={editingStudent}
            onFinishEdit={() =>
              setEditingStudent(null)
            }
          />

        </div>

        <div className="col-span-8">

          <StudentTable
            onEdit={setEditingStudent}
          />

        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentManagement;