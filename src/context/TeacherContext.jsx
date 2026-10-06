import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const TeacherContext = createContext();

const STORAGE_KEY = "teachers";

const initialTeachers = [];

export const TeacherProvider = ({
  children,
}) => {
  const [teachers, setTeachers] =
    useState(() => {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      return saved
        ? JSON.parse(saved)
        : initialTeachers;
    });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(teachers)
    );
  }, [teachers]);

  const addTeacher = (teacher) => {
    setTeachers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),

        ...teacher,

        assignedLabs: [],

        assignedSubjects: [],
      },
    ]);
  };

  const updateTeacher = (
    id,
    updates
  ) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === id
          ? {
              ...teacher,
              ...updates,
            }
          : teacher
      )
    );
  };

  const deleteTeacher = (id) => {
    setTeachers((prev) =>
      prev.filter(
        (teacher) =>
          teacher.id !== id
      )
    );
  };

  const getTeacherById = (id) => {
    return teachers.find(
      (teacher) =>
        teacher.id === id
    );
  };

  const getTeacherByUserId = (
    userId
  ) => {
    return teachers.find(
      (teacher) =>
        teacher.userId === userId
    );
  };

  return (
    <TeacherContext.Provider
      value={{
        teachers,

        addTeacher,

        updateTeacher,

        deleteTeacher,

        getTeacherById,

        getTeacherByUserId,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeachers = () =>
  useContext(TeacherContext);