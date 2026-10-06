import { createContext, useContext, useEffect, useState } from "react";
import storageService from "../services/storageService";

const ActivityContext = createContext();

const KEY = "activities";

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState(() => {
    return storageService.get(KEY) || [];
  });

  useEffect(() => {
    storageService.save(KEY, activities);
  }, [activities]);

  const addActivity = (activity) => {
    setActivities((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...activity,
      },
    ]);
  };

  const updateActivity = (id, updates) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id
          ? { ...activity, ...updates }
          : activity
      )
    );
  };

  const deleteActivity = (id) => {
    setActivities((prev) =>
      prev.filter((activity) => activity.id !== id)
    );
  };

  const getStudentActivities = (studentId) => {
    return activities.filter(
      (activity) => activity.studentId === studentId
    );
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        getStudentActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivities = () => useContext(ActivityContext);