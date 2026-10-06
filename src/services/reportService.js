const reportService = {
  studentAttendance(studentId, sessions) {
    return sessions.map((session) => ({
      date: session.date,
      subject: session.subject.subjectName,
      attendance:
        session.students.find(
          (student) => student.studentId === studentId
        )?.attendance || "Absent",
    }));
  },

  teacherSessions(teacherId, sessions) {
    return sessions.filter(
      (session) =>
        session.teacher.id === teacherId
    );
  },
};

export default reportService;