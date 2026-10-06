import { useState } from "react";

const ProjectCard = ({ project, updateProject }) => {
  const [remarks, setRemarks] = useState(project.teacherRemarks || "");

  const updateStatus = (status) => {
    updateProject(project.id, {
      status,
    });
  };

  const saveRemarks = () => {
    updateProject(project.id, {
      teacherRemarks: remarks,
    });

    alert("Saved");
  };

  return (
    <div className="border rounded p-5">
      <h3 className="text-xl font-bold">{project.title}</h3>

      <p className="mt-2">{project.description}</p>

      <p className="mt-2">Due : {project.deadline}</p>

      <div className="mt-5">
        <label className="font-semibold">Project Status</label>

        <select
          className="border p-2 w-full mt-2"
          value={project.status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option value="PENDING">Pending</option>

          <option value="IN_PROGRESS">In Progress</option>

          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="mt-5">
        <label>Teacher Remarks</label>

        <textarea
          className="border p-2 w-full mt-2"
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <button className="border px-5 py-2 mt-4" onClick={saveRemarks}>
        Save Remarks
      </button>
    </div>
  );
};

export default ProjectCard;
