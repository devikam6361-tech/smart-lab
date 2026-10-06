import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login, currentUser } = useAuth();

  const [role, setRole] = useState("teacher");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === "hod") navigate("/hod");

    if (currentUser.role === "teacher") navigate("/teacher");

    if (currentUser.role === "clerk") navigate("/clerk");
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setError("");

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(form.email.trim(), form.password.trim(), role);

    if (!result.success) {
      setError(result.message);
      return;
    }
  };

  const fillDemo = () => {
    if (role === "hod") {
      setForm({
        email: "hod@gmail.com",
        password: "123456",
      });
    }

    if (role === "teacher") {
      setForm({
        email: "teacher@gmail.com",
        password: "123456",
      });
    }

    if (role === "clerk") {
      setForm({
        email: "clerk@gmail.com",
        password: "123456",
      });
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Smart Lab Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-md">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2"
        >
          <option value="hod">Head Of Department</option>

          <option value="teacher">Teacher</option>

          <option value="clerk">Clerk</option>
        </select>

        <input
          className="border p-2"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          className="border p-2"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="border p-2" type="submit">
          Login
        </button>

        <button type="button" className="border p-2" onClick={fillDemo}>
          Fill Demo Credentials
        </button>
      </form>

      <div className="mt-10">
        <h2 className="font-bold">Demo Accounts</h2>

        <p>HOD → hod@gmail.com / 123456</p>

        <p>Teacher → teacher@gmail.com / 123456</p>

        <p>Clerk → clerk@gmail.com / 123456</p>
      </div>
    </div>
  );
};

export default Login;
