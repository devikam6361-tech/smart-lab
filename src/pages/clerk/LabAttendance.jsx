import DashboardLayout from "../../components/layout/DashboardLayout";
import LabAttendance from "../../components/clerk/LabAttendance";
import CameraAttendance from "../../components/clerk/CameraAttendance";

const LabAttendancePage = () => {
  return (
    <DashboardLayout title="Lab Attendance">
      <CameraAttendance />

      <div className="mt-6">
        <LabAttendance />
      </div>
    </DashboardLayout>
  );
};

export default LabAttendancePage;