import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { hodMenu, clerkMenu, teacherMenu } from "../../data/menu";

const DashboardLayout = ({ title, children }) => {
  // const { logout } = useAuth();
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  let menu = [];

switch (currentUser?.role) {
  case "hod":
    menu = hodMenu;
    break;

  case "teacher":
    menu = teacherMenu;
    break;

  case "clerk":
    menu = clerkMenu;
    break;

  default:
    menu = [];
}

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar menu={menu} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title={title} />

        <main className="flex-1 p-6">
          {children}
        </main>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="border px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;