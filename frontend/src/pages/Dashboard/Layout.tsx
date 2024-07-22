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

  useEffect(() => {
    if (!user && !loading) {
      // navigate("/signin");
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen  flex justify-center items-center">
        <Loading size="lg" />
      </div>
    );
  }

  const toggleMenuVisibility = () => {
    setMenuVisibility(!isMenuVisible);
  };
  return (
    <div>
      <DataProvider navigate={navigate}>
        <NavBar onMenuToggle={toggleMenuVisibility} />
        <div style={{ display: "flex" }}>
          <div style={{}}>
            <SideBar
              onMenuToggle={toggleMenuVisibility}
              isMenuVisible={isMenuVisible}
            />
          </div>
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </DataProvider>
    </div>
  );
}

export default Layout;
