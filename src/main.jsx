import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { TeacherProvider } from "./context/TeacherContext";
import { StudentProvider } from "./context/StudentContext";
// import { SubjectProvider } from "./context/SubjectContext";
import { LabSessionProvider } from "./context/LabSessionContext";
import { ActivityProvider } from "./context/ActivityContext";
import { LabProvider } from "./context/LabContext";
import { ClerkProvider } from "./context/ClerkContext";
import { ProjectProvider } from "./context/ProjectContext";
import { AssignmentProvider } from "./context/AssignmentContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TeacherProvider>
          <ClerkProvider>
            <StudentProvider>
              <LabProvider>
                <LabSessionProvider>
                  <ActivityProvider>
                    <ProjectProvider>
                      <AssignmentProvider>
                        <App />
                      </AssignmentProvider>
                    </ProjectProvider>
                  </ActivityProvider>
                </LabSessionProvider>
              </LabProvider>
            </StudentProvider>
          </ClerkProvider>
        </TeacherProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
