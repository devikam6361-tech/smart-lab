import DashboardLayout from "../../components/layout/DashboardLayout";
import StudentLabAssignment from "../../components/clerk/StudentLabAssignment";

const StudentLabAssignmentPage = () => {
  return (
    <DashboardLayout title="Student Lab Assignment">
      <StudentLabAssignment />
    </DashboardLayout>
  );
};

export default StudentLabAssignmentPage;