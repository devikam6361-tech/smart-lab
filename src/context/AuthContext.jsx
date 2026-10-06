import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import apiService from "../services/apiService";

const AuthContext = createContext();

const STORAGE_KEY = "users";

const defaultUsers = [
  {
    id: crypto.randomUUID(),
    name: "Head Of Department",
    email: "hod@gmail.com",
    password: "123456",
    role: "hod",
    department: "Computer Science",
  },
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) return JSON.parse(saved);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultUsers)
    );

    return defaultUsers;
  });

  const [currentUser, setCurrentUser] =
    useState(() => {
      const saved =
        localStorage.getItem("currentUser");

      return saved ? JSON.parse(saved) : null;
    });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(users)
    );
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const login = async (
    email,
    password,
    role
  ) => {
    try {
      const res = await apiService.auth.login(email, password, role);
      if (res && res.success && res.user) {
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn("Backend auth unavailable, using local fallback:", err.message);
    }

    const user = users.find(
      (u) =>
        u.email.toLowerCase() ===
          email.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid Credentials",
      };
    }

    setCurrentUser(user);

    return {
      success: true,
      user,
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (user) => {
    const exists = users.some(
      (u) =>
        u.email.toLowerCase() ===
        user.email.toLowerCase()
    );

    if (exists) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    const newUser = {
      id: crypto.randomUUID(),
      ...user,
    };

    setUsers((prev) => [...prev, newUser]);

    return {
      success: true,
      user: newUser,
    };
  };

  const updateUser = (
    id,
    updates
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updates,
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) =>
      prev.filter(
        (user) => user.id !== id
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        isAuthenticated:
          !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);