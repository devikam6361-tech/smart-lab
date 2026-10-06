import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useProjects } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import { useTeachers } from "../../context/TeacherContext";
import { useLabs } from "../../context/LabContext";
import AssignProjectStudents from "../../components/teacher/AssignProjectStudents";

const initialForm = {
  title: "",
  description: "",
  technology: "",
  startDate: "",
  dueDate: "",
  labId: "",
};

const Projects = () => {
  const { projects, addProject, deleteProject } = useProjects();

  const { currentUser } = useAuth();

  const { getTeacherByUserId } = useTeachers();

  const { labs } = useLabs();

  const teacher = getTeacherByUserId(currentUser?.id);

  const teacherLabs = labs.filter(
    (lab) => lab.assignedTeacherId === teacher?.id,
  );

  const [form, setForm] = useState(initialForm);

  const [selectedProject, setSelectedProject] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    const selectedLab = teacherLabs.find((lab) => lab.id === form.labId);

    addProject({
      ...form,

      teacherId: teacher.id,

      teacherName: teacher.name,

      department: selectedLab.department,

      semester: selectedLab.assignedSemester,

      section: selectedLab.assignedSection,
    });

    setForm(initialForm);
  };

  return (
    <DashboardLayout title="Projects">
      <form onSubmit={submit} className="border rounded p-5 mb-8 space-y-4">
        <h2 className="text-2xl font-bold">Create Project</h2>

        <input
          className="border w-full p-2"
          placeholder="Project Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          className="border w-full p-2"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          className="border w-full p-2"
          placeholder="Technology"
          name="technology"
          value={form.technology}
          onChange={handleChange}
        />

        <input
          type="date"
          className="border w-full p-2"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />

        <input
          type="date"
          className="border w-full p-2"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <select
          className="border w-full p-2"
          name="labId"
          value={form.labId}
          onChange={handleChange}
        >
          <option value="">Select Lab</option>

          {teacherLabs.map((lab) => (
            <option key={lab.id} value={lab.id}>
              {lab.labName}
            </option>
          ))}
        </select>

        <button className="border px-5 py-2">Create Project</button>
      </form>

      <h2 className="text-2xl font-bold mb-5">My Projects</h2>

      <div className="space-y-4">
        {projects
          .filter((project) => project.teacherId === teacher.id)
          .map((project) => (
            <div
              key={project.id}
              className="border rounded p-5 flex justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">{project.title}</h3>

                <p>{project.description}</p>

                <p>Technology : {project.technology}</p>

                <p>Due : {project.dueDate}</p>

                <p>Assigned Students : {project.assignedStudents.length}</p>
              </div>

              <div className="space-y-2">
                <button
                  className="border px-4 py-2 w-full"
                  onClick={() => setSelectedProject(project)}
                >
                  Assign Students
                </button>

                <button
                  className="border px-4 py-2 w-full"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {selectedProject && (
        <AssignProjectStudents
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default Projects;
