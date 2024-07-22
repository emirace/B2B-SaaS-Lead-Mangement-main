import { createBrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Layout from "./pages/Dashboard/Layout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Dashboard/Leads";
import Users from "./pages/Dashboard/Users";
import Upload from "./pages/Dashboard/Upload";
import AddUser from "./pages/Dashboard/AddUser";
import Summary from "./pages/Dashboard/Summary";
import Lead from "./pages/Dashboard/Lead";
import Company from "./pages/Dashboard/Company";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "leads", element: <Leads /> },
      { path: "users", element: <Users /> },
      { path: "upload", element: <Upload /> },
      { path: "add-user", element: <AddUser /> },
      { path: "summary", element: <Summary /> },
    ],
  },
  { path: "lead/:id", element: <Lead /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/company/:id", element: <Company /> },
]);

export default router;
