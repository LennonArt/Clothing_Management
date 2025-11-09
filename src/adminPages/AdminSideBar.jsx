import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
      <h4>Admin Panel</h4>
      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <Link to="/admin-dashboard/products" className="nav-link text-white">
            Products
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-dashboard/categories" className="nav-link text-white">
            Categories
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-dashboard/orders" className="nav-link text-white">
            Orders
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;