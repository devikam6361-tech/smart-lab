import { createContext, useContext, useEffect, useState } from "react";

const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "assignments",
      JSON.stringify(assignments)
    );
  }, [assignments]);

  const addAssignment = (assignment) => {
    setAssignments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),

        ...assignment,

        assignedStudents: [],

        createdAt: new Date().toISOString(),

        status: "ACTIVE",
      },
    ]);
  };

  const updateAssignment = (id, updates) => {

  setAssignments((prev) =>
    prev.map((assignment) =>
      assignment.id === id
        ? {
            ...assignment,
            ...updates,
          }
        : assignment
    )
  );

};

  const deleteAssignment = (id) => {
    setAssignments((prev) =>
      prev.filter((assignment) => assignment.id !== id)
    );
  };

  const assignStudents = (
    assignmentId,
    studentIds
  ) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              assignedStudents: studentIds.map((studentId) => ({
  studentId,
  status: "PENDING",
  teacherRemarks: "",
  marks: "",
  submittedAt: null,
})),
            }
          : assignment
      )
    );
  };

  const getAssignmentById = (id) =>
    assignments.find(
      (assignment) => assignment.id === id
    );

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        assignStudents,
        getAssignmentById,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignments = () =>
  useContext(AssignmentContext);