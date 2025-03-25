import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import InventoryPage from "./inventory/InventoryPage";
import SalesPage from "./SalesPage";
import SupplierPage from "./SupplierPage";
import DashboardPage from "./DashboardPage";
import Login from "./Login";
import Signup from "./Signup";
import InvoiceManagement from "./invoice/InvoiceManagement";

const PrivateRoute = ({ element }) => {
  return localStorage.getItem("isAuthenticated") ? (
    element
  ) : (
    <Navigate to="/" replace />
  );
};

function App() {
  return (
    <Router>
          <Routes>
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<DashboardPage />} />}
            />
            <Route
              path="/inventory"
              element={<PrivateRoute element={<InventoryPage />} />}
            />
            <Route
              path="/sales"
              element={<PrivateRoute element={<SalesPage />} />}
            />
            <Route
              path="/suppliers"
              element={<PrivateRoute element={<SupplierPage />} />}
            />
            <Route
              path="/invoices"
              element={<PrivateRoute element={<InvoiceManagement />} />}
            />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
    </Router>
  );
}

export default App;
