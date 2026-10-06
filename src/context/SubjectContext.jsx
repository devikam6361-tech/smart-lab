// import { createContext, useContext, useEffect, useState } from "react";

// const SubjectContext = createContext();

// const defaultSubjects = [
//   {
//     id: 1,
//     subjectCode: "CSL51",
//     subjectName: "Python Lab",
//     semester: 5,
//     department: "Computer Science",
//   },
//   {
//     id: 2,
//     subjectCode: "CSL52",
//     subjectName: "Java Lab",
//     semester: 5,
//     department: "Computer Science",
//   },
//   {
//     id: 3,
//     subjectCode: "CSL53",
//     subjectName: "DBMS Lab",
//     semester: 5,
//     department: "Computer Science",
//   },
//   {
//     id: 4,
//     subjectCode: "CSL61",
//     subjectName: "AI Lab",
//     semester: 6,
//     department: "Computer Science",
//   },
//   {
//     id: 5,
//     subjectCode: "CSL62",
//     subjectName: "Machine Learning Lab",
//     semester: 6,
//     department: "Computer Science",
//   },
// ];

// export const SubjectProvider = ({ children }) => {
//   const [subjects, setSubjects] = useState(() => {
//     const saved = localStorage.getItem("subjects");
//     return saved ? JSON.parse(saved) : defaultSubjects;
//   });

//   useEffect(() => {
//     localStorage.setItem("subjects", JSON.stringify(subjects));
//   }, [subjects]);

//   const addSubject = (subject) => {
//     setSubjects((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         ...subject,
//       },
//     ]);
//   };

//   const updateSubject = (id, updatedData) => {
//     setSubjects((prev) =>
//       prev.map((subject) =>
//         subject.id === id
//           ? { ...subject, ...updatedData }
//           : subject
//       )
//     );
//   };

//   const deleteSubject = (id) => {
//     setSubjects((prev) =>
//       prev.filter((subject) => subject.id !== id)
//     );
//   };

//   const getSubjectByCode = (code) => {
//     return subjects.find(
//       (subject) => subject.subjectCode === code
//     );
//   };

//   return (
//     <SubjectContext.Provider
//       value={{
//         subjects,
//         addSubject,
//         updateSubject,
//         deleteSubject,
//         getSubjectByCode,
//       }}
//     >
//       {children}
//     </SubjectContext.Provider>
//   );
// };

// export const useSubjects = () => useContext(SubjectContext);