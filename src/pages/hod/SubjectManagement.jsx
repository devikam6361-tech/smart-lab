// import { useState } from "react";

// import DashboardLayout from "../../components/layout/DashboardLayout";

// import SubjectForm from "../../components/subject/SubjectForm";
// import SubjectTable from "../../components/subject/SubjectTable";

// const menu = [
//   {
//     label: "Dashboard",
//     path: "/hod",
//   },
//   {
//     label: "Teachers",
//     path: "/hod/teachers",
//   },
//   {
//     label: "Subjects",
//     path: "/hod/subjects",
//   },
// ];

// const SubjectManagement = () => {
//   const [editingSubject, setEditingSubject] =
//     useState(null);

//   return (
//     <DashboardLayout
//       title="Subject Management"
//       menu={menu}
//     >
//       <div className="grid grid-cols-12 gap-6">

//         <div className="col-span-4">
//           <SubjectForm
//             editingSubject={editingSubject}
//             onFinishEdit={() =>
//               setEditingSubject(null)
//             }
//           />
//         </div>

//         <div className="col-span-8">
//           <SubjectTable
//             onEdit={setEditingSubject}
//           />
//         </div>

//       </div>
//     </DashboardLayout>
//   );
// };

// export default SubjectManagement;