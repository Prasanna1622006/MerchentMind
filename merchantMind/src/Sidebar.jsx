import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Box, ShoppingCart, Users, BarChart2, LogOut, FileText } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  return (
    <div className="sidebar">
      <h1>General</h1>
      <nav>
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
          <Home /> Dashboard
        </Link>
        <Link to="/inventory" className={location.pathname === "/inventory" ? "active" : ""}>
          <Box /> Inventory
        </Link>
        <Link to="/sales" className={location.pathname === "/sales" ? "active" : ""}>
          <ShoppingCart /> Sales
        </Link>
        <Link to="/suppliers" className={location.pathname === "/suppliers" ? "active" : ""}>
          <Users /> Suppliers
        </Link>
        <Link to="/invoices" className={location.pathname === "/invoices" ? "active" : ""}>
          <FileText /> Invoices
        </Link>
        <button onClick={handleLogout} className="logout-button">
          <LogOut /> Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
