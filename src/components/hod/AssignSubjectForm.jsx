// import { useState } from "react";

// import { useTeachers } from "../../context/TeacherContext";
// import { useSubjects } from "../../context/SubjectContext";

// const AssignSubjectForm = () => {
//   const { teachers, assignSubject } = useTeachers();

//   const { subjects } = useSubjects();

//   const [teacherId, setTeacherId] = useState("");

//   const [subjectCode, setSubjectCode] = useState("");

//   const submit = (e) => {
//     e.preventDefault();

//     const subject = subjects.find(
//       (s) => s.subjectCode === subjectCode
//     );

//     if (!teacherId || !subject) return;

//     assignSubject(teacherId, subject);

//     setTeacherId("");
//     setSubjectCode("");
//   };

//   return (
//     <form
//       onSubmit={submit}
//       className="space-y-4 border p-5 rounded"
//     >
//       <h2 className="text-xl font-bold">
//         Assign Subject
//       </h2>

//       <select
//         className="border p-2 w-full"
//         value={teacherId}
//         onChange={(e) =>
//           setTeacherId(e.target.value)
//         }
//       >
//         <option value="">
//           Select Teacher
//         </option>

//         {teachers.map((teacher) => (
//           <option
//             key={teacher.id}
//             value={teacher.id}
//           >
//             {teacher.name}
//           </option>
//         ))}
//       </select>

//       <select
//         className="border p-2 w-full"
//         value={subjectCode}
//         onChange={(e) =>
//           setSubjectCode(e.target.value)
//         }
//       >
//         <option value="">
//           Select Subject
//         </option>

//         {subjects.map((subject) => (
//           <option
//             key={subject.id}
//             value={subject.subjectCode}
//           >
//             {subject.subjectName}
//           </option>
//         ))}
//       </select>

//       <button
//         className="border px-4 py-2"
//         type="submit"
//       >
//         Assign
//       </button>
//     </form>
//   );
// };

// export default AssignSubjectForm;