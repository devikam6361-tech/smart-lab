// import DataTable from "../common/DataTable";
// import Button from "../common/Button";

// import { useSubjects } from "../../context/SubjectContext";

// const SubjectTable = ({ onEdit }) => {
//   const {
//     subjects,
//     deleteSubject,
//   } = useSubjects();

//   const columns = [
//     {
//       title: "Code",
//       key: "subjectCode",
//     },
//     {
//       title: "Subject",
//       key: "subjectName",
//     },
//     {
//       title: "Department",
//       key: "department",
//     },
//     {
//       title: "Semester",
//       key: "semester",
//     },
//     {
//       title: "Section",
//       key: "section",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (subject) => (
//         <div className="flex gap-2">
//           <Button
//             onClick={() => onEdit(subject)}
//           >
//             Edit
//           </Button>

//           <Button
//             onClick={() =>
//               deleteSubject(subject.id)
//             }
//           >
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <DataTable
//       columns={columns}
//       data={subjects}
//       emptyMessage="No Subjects Found"
//     />
//   );
// };

// export default SubjectTable;