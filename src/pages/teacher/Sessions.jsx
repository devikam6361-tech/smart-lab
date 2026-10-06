import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLabSession } from "../../context/LabSessionContext";

const Sessions = () => {

    const navigate = useNavigate();
    
  const { sessions } = useLabSession();

  return (
    <DashboardLayout title="Session History">
      <h2 className="text-2xl font-bold mb-6">
        Previous Lab Sessions
      </h2>

      {sessions.length === 0 ? (
        <div className="border rounded p-6">
          No Sessions Found
        </div>
      ) : (
        <div className="space-y-5">
          {sessions
            .slice()
            .reverse()
            .map((session) => {
              const present = session.students.filter(
                (s) => s.attendance === "PRESENT"
              ).length;

              const absent = session.students.filter(
                (s) => s.attendance === "ABSENT"
              ).length;

              const late = session.students.filter(
                (s) => s.attendance === "LATE"
              ).length;

              return (
                <div
                  key={session.id}
                  className="border rounded p-5"
                >
                  <h3 className="text-xl font-bold">
                    {session.lab.labName}
                  </h3>

                  <p>
                    {new Date(session.date).toLocaleDateString()}
                  </p>

                  <p>
                    {session.startTime} - {session.endTime || "--"}
                  </p>

                  <p>
                    Semester : {session.semester}
                  </p>

                  <p>
                    Section : {session.section}
                  </p>

                  <div className="flex gap-6 mt-3">
                    <span>Present : {present}</span>

                    <span>Absent : {absent}</span>

                    <span>Late : {late}</span>
                  </div>

                  <button
                      className="mt-4 border px-4 py-2 rounded"
                      onClick={() => navigate(`/teacher/session/${session.id}`)}
                    >
                      View Details
                    </button>
                </div>

                
              );
            })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Sessions;