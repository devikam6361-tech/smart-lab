// import { createContext, useContext, useEffect, useState } from "react";

// const AttendanceContext = createContext();

// export const AttendanceProvider = ({ children }) => {
//   const [attendance, setAttendance] = useState(() => {
//     const saved = localStorage.getItem("attendance");
//     return saved ? JSON.parse(saved) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("attendance", JSON.stringify(attendance));
//   }, [attendance]);

//   // ===============================
//   // Create Attendance
//   // ===============================

//   const markAttendance = (record) => {
//     setAttendance((prev) => {
//       const exists = prev.find(
//         (item) =>
//           item.studentId === record.studentId &&
//           item.subjectCode === record.subjectCode &&
//           item.date === record.date
//       );

//       if (exists) {
//         return prev.map((item) =>
//           item.id === exists.id
//             ? {
//                 ...item,
//                 ...record,
//                 duration: calculateDuration(
//                   record.entryTime,
//                   record.exitTime
//                 ),
//               }
//             : item
//         );
//       }

//       return [
//         ...prev,
//         {
//           id: Date.now(),

//           ...record,

//           duration: calculateDuration(
//             record.entryTime,
//             record.exitTime
//           ),
//         },
//       ];
//     });
//   };

//   // ===============================
//   // Delete Attendance
//   // ===============================

//   const deleteAttendance = (id) => {
//     setAttendance((prev) =>
//       prev.filter((item) => item.id !== id)
//     );
//   };

//   // ===============================
//   // Helpers
//   // ===============================

//   const calculateDuration = (entry, exit) => {
//     if (!entry || !exit) return 0;

//     const start = new Date(`2000-01-01 ${entry}`);
//     const end = new Date(`2000-01-01 ${exit}`);

//     return (end - start) / (1000 * 60);
//   };

//   // ===============================
//   // Queries
//   // ===============================

//   const getStudentAttendance = (studentId) =>
//     attendance.filter(
//       (item) => item.studentId === studentId
//     );

//   const getTeacherAttendance = (teacherId) =>
//     attendance.filter(
//       (item) => item.teacherId === teacherId
//     );

//   const getSubjectAttendance = (subjectCode) =>
//     attendance.filter(
//       (item) => item.subjectCode === subjectCode
//     );

//   const getAttendanceByDate = (date) =>
//     attendance.filter(
//       (item) => item.date === date
//     );

//   const getAttendanceBySemester = (semester) =>
//     attendance.filter(
//       (item) => item.semester === semester
//     );

//   const getAttendanceBySection = (section) =>
//     attendance.filter(
//       (item) => item.section === section
//     );

//   // ===============================
//   // Dashboard Statistics
//   // ===============================

//   const getAttendancePercentage = (studentId) => {
//     const records = attendance.filter(
//       (item) => item.studentId === studentId
//     );

//     if (!records.length) return 0;

//     const present = records.filter(
//       (item) => item.status === "Present"
//     ).length;

//     return Number(
//       ((present / records.length) * 100).toFixed(2)
//     );
//   };

//   const getAverageLabDuration = (studentId) => {
//     const records = attendance.filter(
//       (item) => item.studentId === studentId
//     );

//     if (!records.length) return 0;

//     const total = records.reduce(
//       (sum, item) => sum + item.duration,
//       0
//     );

//     return Math.round(total / records.length);
//   };

//   return (
//     <AttendanceContext.Provider
//       value={{
//         attendance,

//         markAttendance,

//         deleteAttendance,

//         getStudentAttendance,

//         getTeacherAttendance,

//         getSubjectAttendance,

//         getAttendanceByDate,

//         getAttendanceBySemester,

//         getAttendanceBySection,

//         getAttendancePercentage,

//         getAverageLabDuration,
//       }}
//     >
//       {children}
//     </AttendanceContext.Provider>
//   );
// };

// export const useAttendance = () =>
//   useContext(AttendanceContext);