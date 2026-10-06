// import { useTeachers } from "../../context/TeacherContext";

// const TeacherSubjects = () => {
//   const { teachers } = useTeachers();

//   return (
//     <div className="space-y-5">

//       {teachers.map((teacher) => (
//         <div
//           key={teacher.id}
//           className="border p-5 rounded"
//         >
//           <h2 className="font-bold">
//             {teacher.name}
//           </h2>

//           <div className="mt-3">

//             {teacher.assignedSubjects.length ===
//             0 ? (
//               <p>No Subjects Assigned</p>
//             ) : (
//               teacher.assignedSubjects.map(
//                 (subject) => (
//                   <div
//                     key={subject.subjectCode}
//                   >
//                     • {subject.subjectName}
//                   </div>
//                 )
//               )
//             )}

//           </div>

//         </div>
//       ))}

//     </div>
//   );
// };

// export default TeacherSubjects;