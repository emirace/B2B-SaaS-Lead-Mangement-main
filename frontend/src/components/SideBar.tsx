import { NavLink } from "react-router-dom";
import { useAuth } from "../context/Auth";
import {
  FaSignOutAlt,
  FaChartBar,
  FaTasks,
  FaUsers,
  FaUserPlus,
  FaUpload,
} from "react-icons/fa";

interface Props {
  isMenuVisible: boolean;
  onMenuToggle: () => void;
}

const sidebars = [
  {
    name: "OverView",
    icon: <FaChartBar />,
    path: "/",
  },
  {
    name: "Leads",
    icon: <FaTasks />,
    path: "/leads",
  },
  {
    name: "Users",
    icon: <FaUsers />,
    path: "/users",
  },
  {
    name: "Upload",
    icon: <FaUpload />,
    path: "/upload",
  },
  {
    name: "Add User",
    icon: <FaUserPlus />,
    path: "/add-user",
  },
];

const SideBar: React.FC<Props> = ({ isMenuVisible, onMenuToggle }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout;
  };

  return (
    <>
      <div
        className={`fixed md:relative z-20  w-auto border-r border-gray-300  transition-transform transform ${
          isMenuVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ height: "calc(100vh - 70px)", backgroundColor: "#f9fafc" }}
      >
        <div className="pt-5 px-4 relative h-full">
          {sidebars.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onMenuToggle}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "text-white bg-primary rounded-md font-bold"
                    : "text-primary font-medium"
                } flex items-center hover:font-bold  gap-5 text-md rounded  my-1 p-3 py-3`
              }
            >
              {item.icon}
              <span className="text-xs uppercase tracking-wider md:pr-5">
                {item.name}
              </span>
            </NavLink>
          ))}
          <div className="rounded  my-1 p-3 py-3 ">
            <button
              className="flex items-center gap-5 text-red-500 font-medium"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span className=" text-xs uppercase tracking-wider">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
