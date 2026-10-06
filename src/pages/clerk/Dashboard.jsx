import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";

import StudentForm from "../../components/student/StudentForm";
import StudentTable from "../../components/student/StudentTable";

const ClerkDashboard = () => {
  const { students } = useStudents();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    semester: "",
    section: "",
    department: "",
  });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        student.usn
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSemester =
        filters.semester === "" ||
        String(student.semester) === String(filters.semester);

      const matchesSection =
        filters.section === "" ||
        student.section === filters.section;

      const matchesDepartment =
        filters.department === "" ||
        student.department === filters.department;

      return (
        matchesSearch &&
        matchesSemester &&
        matchesSection &&
        matchesDepartment
      );
    });
  }, [students, search, filters]);

  return (
  <DashboardLayout title="Clerk Dashboard">

    {/* Header */}

    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow">

      <h1 className="text-4xl font-bold">
        Student Management
      </h1>

      <p className="mt-3 text-cyan-100 text-lg">
        Register, search and manage all students from one place.
      </p>

    </div>

    {/* Statistics */}

    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <p className="text-gray-500">
          Total Students
        </p>

        <h2 className="text-4xl font-bold text-blue-600 mt-2">
          {students.length}
        </h2>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <p className="text-gray-500">
          Departments
        </p>

        <h2 className="text-4xl font-bold text-green-600 mt-2">
          {
            [...new Set(students.map((s) => s.department))]
              .length
          }
        </h2>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <p className="text-gray-500">
          Semesters
        </p>

        <h2 className="text-4xl font-bold text-purple-600 mt-2">
          {
            [...new Set(students.map((s) => s.semester))]
              .length
          }
        </h2>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <p className="text-gray-500">
          Sections
        </p>

        <h2 className="text-4xl font-bold text-orange-500 mt-2">
          {
            [...new Set(students.map((s) => s.section))]
              .length
          }
        </h2>
      </div>

    </div>

    {/* Search & Filters */}

    <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">

      <h2 className="text-2xl font-bold mb-5">
        Search Students
      </h2>

      <div className="grid md:grid-cols-4 gap-4">

        <input
          type="text"
          placeholder="Search by Name or USN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-3"
        />

        <select
          className="border rounded-lg p-3"
          value={filters.department}
          onChange={(e) =>
            setFilters({
              ...filters,
              department: e.target.value,
            })
          }
        >
          <option value="">All Departments</option>

          {[...new Set(students.map((s) => s.department))].map(
            (department) => (
              <option
                key={department}
                value={department}
              >
                {department}
              </option>
            ),
          )}
        </select>

        <select
          className="border rounded-lg p-3"
          value={filters.semester}
          onChange={(e) =>
            setFilters({
              ...filters,
              semester: e.target.value,
            })
          }
        >
          <option value="">
            All Semesters
          </option>

          {[...new Set(students.map((s) => s.semester))]
            .sort()
            .map((semester) => (
              <option
                key={semester}
                value={semester}
              >
                Semester {semester}
              </option>
            ))}
        </select>

        <select
          className="border rounded-lg p-3"
          value={filters.section}
          onChange={(e) =>
            setFilters({
              ...filters,
              section: e.target.value,
            })
          }
        >
          <option value="">
            All Sections
          </option>

          {[...new Set(students.map((s) => s.section))].map(
            (section) => (
              <option
                key={section}
                value={section}
              >
                Section {section}
              </option>
            ),
          )}
        </select>

      </div>

    </div>

    {/* Student Registration */}

    <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">

      <h2 className="text-2xl font-bold mb-5">
        Register New Student
      </h2>

      <StudentForm />

    </div>

    {/* Student Table */}

    <div className="bg-white border rounded-xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold">
          Student Records
        </h2>

        <span className="text-gray-500">
          {filteredStudents.length} Students Found
        </span>

      </div>

      <StudentTable
        students={filteredStudents}
      />

    </div>

  </DashboardLayout>
);
};

export default ClerkDashboard;