import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { useEffect, useState } from "react";
import { DataProvider } from "../../context/DataContext";
import { useAuth } from "../../context/Auth";
import Loading from "../../components/Loading";

function Layout() {
  const { user, loading } = useAuth();
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loading size="lg" />
      </div>
    );
  } else if (!user) {
    return navigate("/signin");
  }

  const toggleMenuVisibility = () => {
    setMenuVisibility(!isMenuVisible);
  };
  return (
    <DataProvider navigate={navigate}>
      <div>
        <NavBar onMenuToggle={toggleMenuVisibility} />
        <div style={{ display: "flex" }}>
          <div style={{}}>
            <SideBar
              onMenuToggle={toggleMenuVisibility}
              isMenuVisible={isMenuVisible}
            />
          </div>
          <div style={{ flex: 8 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </DataProvider>
  );
}

export default Layout;
