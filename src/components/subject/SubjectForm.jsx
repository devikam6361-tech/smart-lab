// import { useEffect, useState } from "react";
// import { useSubjects } from "../../context/SubjectContext";

// const initialState = {
//   subjectCode: "",
//   subjectName: "",
//   department: "",
//   semester: "",
//   section: "",
//   credits: "",
//   labName: "",
// };

// const SubjectForm = ({
//   editingSubject,
//   onFinishEdit,
// }) => {
//   const {
//     addSubject,
//     updateSubject,
//   } = useSubjects();

//   const [form, setForm] =
//     useState(initialState);

//   useEffect(() => {
//     if (editingSubject) {
//       setForm(editingSubject);
//     }
//   }, [editingSubject]);

//   const handleChange = (e) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const submit = (e) => {
//     e.preventDefault();

//     if (editingSubject) {
//       updateSubject(
//         editingSubject.id,
//         form
//       );

//       onFinishEdit();

//       setForm(initialState);

//       return;
//     }

//     addSubject(form);

//     setForm(initialState);
//   };

//   return (
//     <form
//       onSubmit={submit}
//       className="border rounded p-5 space-y-3"
//     >
//       <h2 className="text-xl font-bold">
//         {editingSubject
//           ? "Edit Subject"
//           : "Add Subject"}
//       </h2>

//       <input
//         className="border p-2 w-full"
//         placeholder="Subject Code"
//         name="subjectCode"
//         value={form.subjectCode}
//         onChange={handleChange}
//       />

//       <input
//         className="border p-2 w-full"
//         placeholder="Subject Name"
//         name="subjectName"
//         value={form.subjectName}
//         onChange={handleChange}
//       />

//       <input
//         className="border p-2 w-full"
//         placeholder="Department"
//         name="department"
//         value={form.department}
//         onChange={handleChange}
//       />

//       <input
//         className="border p-2 w-full"
//         placeholder="Semester"
//         name="semester"
//         value={form.semester}
//         onChange={handleChange}
//       />

//       <input
//         className="border p-2 w-full"
//         placeholder="Section"
//         name="section"
//         value={form.section}
//         onChange={handleChange}
//       />

//       <input
//         className="border p-2 w-full"
//         placeholder="Credits"
//         name="credits"
//         value={form.credits}
//         onChange={handleChange}
//       />

//       <input
//         className="border p-2 w-full"
//         placeholder="Lab Name"
//         name="labName"
//         value={form.labName}
//         onChange={handleChange}
//       />

//       <button
//         className="border px-4 py-2"
//         type="submit"
//       >
//         Save Subject
//       </button>
//     </form>
//   );
// };

// export default SubjectForm;