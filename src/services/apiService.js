const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[apiService] Backend request failed (${endpoint}), falling back gracefully:`, error.message);
    throw error;
  }
}

export const apiService = {
  // Authentication
  auth: {
    async login(email, password, role) {
      return await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
    },
    async getUsers(role) {
      const q = role ? `?role=${role}` : "";
      return await request(`/auth/users${q}`);
    },
    async register(userData) {
      return await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
  },

  // Students
  students: {
    async getAll(params = {}) {
      const searchParams = new URLSearchParams();
      if (params.department && params.department !== "All") searchParams.append("department", params.department);
      if (params.semester && params.semester !== "All") searchParams.append("semester", params.semester);
      if (params.section && params.section !== "All") searchParams.append("section", params.section);
      if (params.search) searchParams.append("search", params.search);

      const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
      return await request(`/students${qs}`);
    },
    async getById(id) {
      return await request(`/students/${id}`);
    },
    async create(studentData) {
      return await request("/students", {
        method: "POST",
        body: JSON.stringify(studentData),
      });
    },
    async update(id, updates) {
      return await request(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    },
    async delete(id) {
      return await request(`/students/${id}`, {
        method: "DELETE",
      });
    },
    async assignLabs(studentId, assignedLabs) {
      return await request(`/students/${studentId}/assign-labs`, {
        method: "POST",
        body: JSON.stringify({ assigned_labs: assignedLabs }),
      });
    },
  },

  // Labs
  labs: {
    async getAll(params = {}) {
      const searchParams = new URLSearchParams();
      if (params.department && params.department !== "All") searchParams.append("department", params.department);
      if (params.semester && params.semester !== "All") searchParams.append("semester", params.semester);

      const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
      return await request(`/labs${qs}`);
    },
    async create(labData) {
      return await request("/labs", {
        method: "POST",
        body: JSON.stringify(labData),
      });
    },
    async update(id, updates) {
      return await request(`/labs/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    },
    async delete(id) {
      return await request(`/labs/${id}`, {
        method: "DELETE",
      });
    },
    async assign(id, data) {
      return await request(`/labs/${id}/assign`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // Attendance & AI Camera
  attendance: {
    async get(params = {}) {
      const searchParams = new URLSearchParams();
      if (params.date) searchParams.append("date", params.date);
      if (params.lab && params.lab !== "All") searchParams.append("lab", params.lab);
      if (params.department && params.department !== "All") searchParams.append("department", params.department);
      if (params.semester && params.semester !== "All") searchParams.append("semester", params.semester);
      if (params.section && params.section !== "All") searchParams.append("section", params.section);
      if (params.usn) searchParams.append("usn", params.usn);

      const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
      return await request(`/attendance${qs}`);
    },
    async mark(usn, date, lab_name, status) {
      return await request("/attendance/mark", {
        method: "POST",
        body: JSON.stringify({ usn, date, lab_name, status }),
      });
    },
    async recordEntry(usn, date, lab_name, time = null) {
      return await request("/attendance/entry", {
        method: "POST",
        body: JSON.stringify({ usn, date, lab_name, time }),
      });
    },
    async recordExit(usn, date, lab_name, time = null) {
      return await request("/attendance/exit", {
        method: "POST",
        body: JSON.stringify({ usn, date, lab_name, time }),
      });
    },
    async cameraRecognize(imageBase64, date, labName, targetUsn = null, mode = "entry") {
      return await request("/attendance/camera-recognize", {
        method: "POST",
        body: JSON.stringify({
          image: imageBase64,
          date,
          lab_name: labName,
          target_usn: targetUsn,
          mode,
        }),
      });
    },
    async batch(date, lab_name, status, usns = null) {
      return await request("/attendance/batch", {
        method: "POST",
        body: JSON.stringify({ date, lab_name, status, usns }),
      });
    },
    async reset(date, lab_name, usns = null) {
      return await request("/attendance/reset", {
        method: "POST",
        body: JSON.stringify({ date, lab_name, status: "Absent", usns }),
      });
    },
  },

  // Analytics
  analytics: {
    async getOverview(date = null) {
      const q = date ? `?date=${date}` : "";
      return await request(`/analytics/overview${q}`);
    },
    async getDurationStats() {
      return await request("/analytics/duration");
    },
    async getStudentStats(usn) {
      return await request(`/analytics/student/${usn}`);
    },
  },

  // Reports
  reports: {
    async getAttendance(params = {}) {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.append("startDate", params.startDate);
      if (params.endDate) searchParams.append("endDate", params.endDate);
      if (params.lab && params.lab !== "All") searchParams.append("lab", params.lab);
      if (params.department && params.department !== "All") searchParams.append("department", params.department);

      const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
      return await request(`/reports/attendance${qs}`);
    },
    getExportCsvUrl(date, lab) {
      return `${API_BASE_URL}/reports/export-csv?date=${date || ""}&lab=${lab || ""}`;
    },
  },
};

export default apiService;

