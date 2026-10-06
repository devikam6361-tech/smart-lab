import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import TeacherForm from "../../components/teacher/TeacherForm";
import TeacherTable from "../../components/teacher/TeacherTable";

const menu = [
  {
    label: "Dashboard",
    path: "/hod",
  },
  {
    label: "Teachers",
    path: "/hod/teachers",
  },
];

const TeacherManagement = () => {
  const [editingTeacher, setEditingTeacher] =
    useState(null);

  return (
    <DashboardLayout
      title="Teacher Management"
      menu={menu}
    >
      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-4">

          <TeacherForm
            editingTeacher={editingTeacher}
            onFinishEdit={() =>
              setEditingTeacher(null)
            }
          />

        </div>

        <div className="col-span-8">

          <TeacherTable
            onEdit={setEditingTeacher}
          />

        </div>

      </div>
    </DashboardLayout>
  );
};

export default TeacherManagement;