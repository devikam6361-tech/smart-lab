import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../services/apiService";

const StudentContext = createContext();

const initialStudents = [
  {
    id: "std-01",
    usn: "1BM25MCA001",
    name: "Devika",
    department: "MCA",
    semester: 2,
    section: "A",
    rollNumber: "MCA-01",
    assignedLabs: ["lab-01", "lab-02"],
    faceEnrolled: true,
    subjects: [
      {
        subjectCode: "MCA201",
        subjectName: "DBMS Lab",
      },
    ],
    activities: {
      projects: [{ title: "AI Attendance System", status: "In Progress" }],
      internals: [{ test: "Internal 1", marks: 28, outOf: 30 }],
      assignments: [{ title: "Lab Sheet 1", status: "Completed" }],
      certificates: [],
      remarks: "Excellent lab attendance",
      labPerformance: "Excellent",
    },
  },
  {
    id: "std-02",
    usn: "1BM25MCA002",
    name: "Yashodha",
    department: "MCA",
    semester: 2,
    section: "A",
    rollNumber: "MCA-02",
    assignedLabs: ["lab-01"],
    faceEnrolled: true,
    subjects: [
      {
        subjectCode: "MCA201",
        subjectName: "DBMS Lab",
      },
    ],
    activities: {
      projects: [{ title: "Database Normalizer", status: "Completed" }],
      internals: [{ test: "Internal 1", marks: 26, outOf: 30 }],
      assignments: [{ title: "Lab Sheet 1", status: "Completed" }],
      certificates: [],
      remarks: "Consistent performance",
      labPerformance: "Very Good",
    },
  },
  {
    id: "std-03",
    usn: "1BM25MCA003",
    name: "Student 3",
    department: "MCA",
    semester: 2,
    section: "A",
    rollNumber: "MCA-03",
    assignedLabs: ["lab-01"],
    faceEnrolled: false,
    subjects: [],
    activities: {
      projects: [],
      internals: [],
      assignments: [],
      certificates: [],
      remarks: "",
      labPerformance: "Average",
    },
  },
  {
    id: 1,
    usn: "1RV23CS001",
    name: "Rahul",
    department: "Computer Science",
    semester: 5,
    section: "A",
    rollNumber: "CS-01",
    assignedLabs: ["lab-04"],
    faceEnrolled: true,
    subjects: [
      {
        subjectCode: "CSL51",
        subjectName: "Python Lab",
      },
    ],
    activities: {
      projects: [
        {
          title: "Library Management",
          status: "Completed",
        },
      ],
      internals: [
        {
          test: "Internal 1",
          marks: 24,
          outOf: 30,
        },
      ],
      assignments: [
        {
          title: "Assignment 1",
          status: "Completed",
        },
      ],
      certificates: [],
      remarks: "",
      labPerformance: "Good",
    },
  },
];

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : initialStudents;
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // Sync with FastAPI backend on mount
  useEffect(() => {
    apiService.students.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setStudents((prev) => {
            const map = new Map();
            prev.forEach((s) => map.set(s.usn || String(s.id), s));
            data.forEach((s) => {
              const existing = map.get(s.usn);
              map.set(s.usn, {
                ...(existing || {}),
                id: s.id,
                usn: s.usn,
                name: s.name,
                department: s.department,
                semester: s.semester,
                section: s.section,
                rollNumber: s.rollNumber,
                assignedLabs: s.assignedLabs || [],
                faceEnrolled: s.faceEnrolled,
                activities: existing?.activities || {
                  projects: [],
                  internals: [],
                  assignments: [],
                  certificates: [],
                  remarks: "",
                  labPerformance: "Good",
                },
              });
            });
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

  // ========================
  // Student CRUD
  // ========================

  const addStudent = (student) => {
    setStudents((prev) => [
      ...prev,
      {
        id: Date.now(),

        ...student,

        assignedLabs: student.assignedLabs || [],

        activities: {
          projects: [],
          internals: [],
          assignments: [],
          certificates: [],

          remarks: "",

          labPerformance: {
            rating: "GOOD",

            teacherRemarks: "",
          },
        },
      },
    ]);
  };

  const updateStudent = (id, updatedData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              ...updatedData,
            }
          : student,
      ),
    );
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  // ========================
  // Subject Management
  // ========================

  const assignSubject = (studentId, subject) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        const exists = student.subjects.some(
          (s) => s.subjectCode === subject.subjectCode,
        );

        if (exists) return student;

        return {
          ...student,
          subjects: [...student.subjects, subject],
        };
      }),
    );
  };

  // ========================
  // Projects
  // ========================

  const addProject = (studentId, project) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              activities: {
                ...student.activities,
                projects: [...student.activities.projects, project],
              },
            }
          : student,
      ),
    );
  };

  // ========================
  // Internals
  // ========================

  const addInternalMark = (studentId, internal) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              activities: {
                ...student.activities,
                internals: [...student.activities.internals, internal],
              },
            }
          : student,
      ),
    );
  };

  // ========================
  // Assignments
  // ========================

  const addAssignment = (studentId, assignment) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              activities: {
                ...student.activities,
                assignments: [...student.activities.assignments, assignment],
              },
            }
          : student,
      ),
    );
  };

  // ========================
  // Certificates
  // ========================

  const addCertificate = (studentId, certificate) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              activities: {
                ...student.activities,
                certificates: [...student.activities.certificates, certificate],
              },
            }
          : student,
      ),
    );
  };

  // ========================
  // Remarks
  // ========================

  const updateRemarks = (studentId, remarks) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              activities: {
                ...student.activities,
                remarks,
              },
            }
          : student,
      ),
    );
  };

  // ========================
  // Lab Performance
  // ========================

  const updateLabPerformance = (studentId, performance) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,

              activities: {
                ...student.activities,

                labPerformance: performance,
              },
            }
          : student,
      ),
    );
  };

  const getStudentById = (id) =>
    students.find((student) => String(student.id) === String(id));

  return (
    <StudentContext.Provider
      value={{
        students,

        addStudent,

        updateStudent,

        deleteStudent,

        assignSubject,

        addProject,

        addInternalMark,

        addAssignment,

        addCertificate,

        updateRemarks,

        updateLabPerformance,

        getStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => useContext(StudentContext);
