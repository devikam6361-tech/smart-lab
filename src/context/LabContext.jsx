import { createContext, useContext, useEffect, useState } from "react";
import storageService from "../services/storageService";
import apiService from "../services/apiService";

const LabContext = createContext();

const KEY = "labs";

// =====================================================
// NORMALIZE LAB DATA
// HOD FORM USES "labName"
// OTHER PARTS OF APP USE "name"
// =====================================================

const normalizeLab = (lab) => {
  if (!lab) {
    return lab;
  }

  return {
    ...lab,

    name: lab.name || lab.labName || "",
    labName: lab.labName || lab.name || "",
  };
};

// =====================================================
// LAB PROVIDER
// =====================================================

export const LabProvider = ({ children }) => {
  const [labs, setLabs] = useState(() => {
    const savedLabs = storageService.get(KEY) || [];

    return savedLabs.map(normalizeLab);
  });

  // ===================================================
  // SAVE LABS
  // ===================================================

  useEffect(() => {
    storageService.save(KEY, labs);
  }, [labs]);

  // ===================================================
  // LOAD LABS FROM BACKEND
  // ===================================================

  useEffect(() => {
    apiService.labs.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setLabs((prev) => {
            const map = new Map();

            prev.forEach((lab) => {
              const normalized = normalizeLab(lab);

              map.set(
                normalized.id,
                normalized
              );
            });

            data.forEach((lab) => {
              const normalized = normalizeLab(lab);

              map.set(
                normalized.id,
                normalized
              );
            });

            return Array.from(map.values());
          });
        }
      })
      .catch((error) => {
        console.error(
          "Failed to load labs:",
          error
        );
      });
  }, []);

  // ===================================================
  // ADD LAB
  // ===================================================

  const addLab = (lab) => {
    const newLab = normalizeLab({
      id: crypto.randomUUID(),
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      ...lab,
    });

    setLabs((prev) => [
      ...prev,
      newLab,
    ]);
  };

  // ===================================================
  // UPDATE LAB
  // ===================================================

  const updateLab = (id, updates) => {
    setLabs((prev) =>
      prev.map((lab) =>
        lab.id === id
          ? normalizeLab({
              ...lab,
              ...updates,
            })
          : lab
      )
    );
  };

  // ===================================================
  // DELETE LAB
  // ===================================================

  const deleteLab = (id) => {
    setLabs((prev) =>
      prev.filter(
        (lab) => lab.id !== id
      )
    );
  };

  // ===================================================
  // ASSIGN LAB DETAILS
  // ===================================================

  const assignLabDetails = (
    labId,
    data
  ) => {
    setLabs((prev) =>
      prev.map((lab) =>
        lab.id === labId
          ? normalizeLab({
              ...lab,

              assignedTeacherId:
                data.teacherId,

              assignedSemester:
                data.semester ||
                lab.semester,

              assignedSection:
                data.section ||
                lab.section,
            })
          : lab
      )
    );
  };

  // ===================================================
  // PROVIDER
  // ===================================================

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

// =====================================================
// USE LABS
// =====================================================

export const useLabs = () =>
  useContext(LabContext);