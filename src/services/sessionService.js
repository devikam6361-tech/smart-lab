const sessionService = {
  isActive(session) {
    return session.status === "ACTIVE";
  },

  isCompleted(session) {
    return session.status === "COMPLETED";
  },

  duration(session) {
    if (
      !session.startTime ||
      !session.endTime
    )
      return "--";

    return `${session.startTime} - ${session.endTime}`;
  },
};

export default sessionService;