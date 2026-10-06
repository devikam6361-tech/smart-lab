import { createContext, useContext, useEffect, useState } from "react";
import storageService from "../services/storageService";
import apiService from "../services/apiService";

const LabContext = createContext();

const KEY = "labs";

export const LabProvider = ({ children }) => {
  const [labs, setLabs] = useState(() => {
    return storageService.get(KEY) || [];
  });

  useEffect(() => {
    storageService.save(KEY, labs);
  }, [labs]);

  useEffect(() => {
    apiService.labs.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setLabs((prev) => {
            const map = new Map();
            prev.forEach((l) => map.set(l.id, l));
            data.forEach((l) => map.set(l.id, l));
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

  const addLab = (lab) => {
    setLabs((prev) => [
      ...prev,

      {
        id: crypto.randomUUID(),
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        ...lab,
      },
    ]);
  };

  const updateLab = (id, updates) => {
    setLabs((prev) =>
      prev.map((lab) =>
        lab.id === id
          ? {
              ...lab,
              ...updates,
            }
          : lab,
      ),
    );
  };

  const deleteLab = (id) => {
    setLabs((prev) => prev.filter((lab) => lab.id !== id));
  };

  const assignLabDetails = (labId, data) => {
    setLabs((prev) =>
      prev.map((lab) =>
        lab.id === labId
          ? {
              ...lab,

              assignedTeacherId: data.teacherId,
              assignedSemester: data.semester || lab.semester,
              assignedSection: data.section || lab.section,
            }
          : lab,
      ),
    );
  };

  return (
    <LabContext.Provider
      value={{
        labs,

        addLab,

        updateLab,

        deleteLab,

        assignLabDetails,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

export const useLabs = () => useContext(LabContext);
