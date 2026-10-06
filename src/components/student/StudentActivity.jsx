import { useActivities } from "../../contexts/ActivityContext";

const StudentActivity = ({ studentId }) => {
  const { getStudentActivities } = useActivities();

  const activities = getStudentActivities(studentId);

  return (
    <div className="space-y-3">

      <h2 className="text-xl font-bold">
        Student Timeline
      </h2>

      {activities.length === 0 && (
        <p>No Activities Found</p>
      )}

      {activities.map((activity) => (
        <div
          key={activity.id}
          className="border p-3 rounded"
        >
          <h3 className="font-semibold">
            {activity.type}
          </h3>

          <p>{activity.title}</p>

          <small>
            {new Date(
              activity.createdAt
            ).toLocaleString()}
          </small>
        </div>
      ))}

    </div>
  );
};

export default StudentActivity;