import { createContext, useContext, useEffect, useState } from "react";
import labSessionService from "../services/labSessionService";

const LabSessionContext = createContext();

export const LabSessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    return labSessionService.getAll();
  });

  useEffect(() => {
    labSessionService.saveAll(sessions);
  }, [sessions]);

  const getCurrentTime = () => {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const startSession = ({
    teacher,
    lab,
    department,
    semester,
    section,
    students,
  }) => {

    const alreadyRunning = sessions.find(
  (session) => session.status === "ACTIVE"
);

if (alreadyRunning) {
  alert("A lab session is already running.");
  return alreadyRunning.id;
}

    const session = {
      id: crypto.randomUUID(),

      date: new Date().toISOString(),

      status: "ACTIVE",

      teacher,

      lab,

      department,

      semester,

      section,

      startTime: getCurrentTime(),

      endTime: null,

      students: students.map((student) => ({
        studentId: student.id,

        usn: student.usn,

        rollNumber: student.rollNumber,

        name: student.name,

        attendance: "ABSENT",

        entryTime: null,

        exitTime: null,

        faceDetected: false,

        qrVerified: false,

        manualVerified: false,

        remarks: "",

        activities: [],
      })),
    };

    setSessions((prev) => [...prev, session]);

    return session.id;
  };

  const endSession = (sessionId) => {
  const endTime = getCurrentTime();

  setSessions((prev) =>
    prev.map((session) => {
      if (session.id !== sessionId) return session;

      return {
        ...session,

        status: "COMPLETED",

        endTime,

        students: session.students.map((student) => ({
          ...student,

          exitTime:
            student.attendance === "ABSENT"
              ? null
              : student.exitTime || endTime,
        })),
      };
    }),
  );
};

  const markAttendance = (sessionId, studentId, status) => {
    updateStudentAttendance(sessionId, studentId, {
      attendance: status,
      entryTime: status === "ABSENT" ? null : getCurrentTime(),
    });
  };

  const updateStudentAttendance = (sessionId, studentId, updates) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        return {
          ...session,

          students: session.students.map((student) =>
            student.studentId === studentId
              ? {
                  ...student,
                  ...updates,
                }
              : student,
          ),
        };
      }),
    );
  };

  const updateStudentDetails = (
  sessionId,
  studentId,
  data
) => {
  setSessions((prev) =>
    prev.map((session) => {
      if (session.id !== sessionId) return session;

      return {
        ...session,

        students: session.students.map((student) =>
          student.studentId === studentId
            ? {
                ...student,
                ...data,
              }
            : student
        ),
      };
    })
  );
};

  const addStudentActivity = (sessionId, studentId, activity) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        return {
          ...session,

          students: session.students.map((student) => {
            if (student.studentId !== studentId) return student;

            return {
              ...student,

              activities: [
                ...student.activities,

                {
                  id: crypto.randomUUID(),

                  time: getCurrentTime(),

                  ...activity,
                },
              ],
            };
          }),
        };
      }),
    );
  };

  const getSession = (id) => sessions.find((session) => session.id === id);

  const activeSession = sessions.find((session) => session.status === "ACTIVE");

  return (
    <LabSessionContext.Provider
      value={{
        sessions,
        activeSession,
        startSession,
        endSession,
        updateStudentAttendance,
        markAttendance,
        updateStudentDetails,
        addStudentActivity,
        getSession,
      }}
    >
      {children}
    </LabSessionContext.Provider>
  );
};

export const useLabSession = () => useContext(LabSessionContext);
