import { NavLink } from "react-router-dom";

const Sidebar = ({ menu }) => {
  return (
    <aside className="w-64 border-r min-h-screen p-5">

      <h2 className="text-2xl font-bold mb-8">
        Smart Lab AI
      </h2>

      <div className="flex flex-col gap-2">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-3 border rounded ${
                isActive ? "bg-gray-200" : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

      </div>

    </aside>
  );
};

export default Sidebar;