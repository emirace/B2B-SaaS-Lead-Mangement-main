import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { useState } from "react";
import { DataProvider } from "../../context/DataContext";

function Layout() {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const navigate = useNavigate();

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
