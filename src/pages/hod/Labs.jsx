import DashboardLayout from "../../components/layout/DashboardLayout";

import LabForm from "../../components/hod/LabForm";
import LabTable from "../../components/hod/LabTable";
import AssignLabForm from "../../components/hod/AssignLabForm";

const Labs = () => {
  return (
    <DashboardLayout title="Lab Management">
      <div className="grid grid-cols-2 gap-6">
        <LabForm />

        <LabTable />

        <AssignLabForm />
        
      </div>
    </DashboardLayout>
  );
};

export default Labs;
