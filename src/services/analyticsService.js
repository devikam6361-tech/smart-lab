const analyticsService = {
  getTotalStudents(students = []) {
    return students.length;
  },

  getPresentCount(session) {
    if (!session) return 0;

    return session.students.filter(
      (student) => student.attendance === "Present"
    ).length;
  },

  getAbsentCount(session) {
    if (!session) return 0;

    return session.students.filter(
      (student) => student.attendance === "Absent"
    ).length;
  },

  getLateCount(session) {
    if (!session) return 0;

    return session.students.filter(
      (student) => student.attendance === "Late"
    ).length;
  },

  getAttendancePercentage(session) {
    if (!session) return 0;

    const total = session.students.length;

    if (total === 0) return 0;

    const present = session.students.filter(
      (student) =>
        student.attendance === "Present" ||
        student.attendance === "Late"
    ).length;

    return ((present / total) * 100).toFixed(2);
  },

  getAverageEntryTime(session) {
    if (!session) return "--";

    const entries = session.students
      .filter((student) => student.entryTime)
      .map((student) => student.entryTime);

    if (!entries.length) return "--";

    return entries[0];
  },

  getCompletedSessions(sessions = []) {
    return sessions.filter(
      (session) => session.status === "COMPLETED"
    ).length;
  },

  getActiveSessions(sessions = []) {
    return sessions.filter(
      (session) => session.status === "ACTIVE"
    ).length;
  },
};

export default analyticsService;