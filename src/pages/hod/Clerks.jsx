import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import ClerkForm from "../../components/hod/ClerkForm";
import ClerkTable from "../../components/hod/ClerkTable";

import { hodMenu } from "../../data/menu";

const Clerks = () => {

  const [editingClerk, setEditingClerk] =
    useState(null);

  return (
    <DashboardLayout
      title="Clerk Management"
      menu={hodMenu}
    >

      <div className="grid grid-cols-2 gap-6">

        <ClerkForm
          editingClerk={editingClerk}
          onFinishEdit={() =>
            setEditingClerk(null)
          }
        />

        <ClerkTable
          onEdit={setEditingClerk}
        />

      </div>

    </DashboardLayout>
  );
};

export default Clerks;