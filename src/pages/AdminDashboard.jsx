import { Routes, Route, useNavigate } from "react-router-dom";
import AdminNavbar from "../adminPages/AdminNavBar";
import AdminSidebar from "../adminPages/AdminSideBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import ManageProducts from "../adminPages/ManageProducts";
import ManageCategories from "../adminPages/ManageOrders";


function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        navigate("/");
    };
    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="flex-grow-1">
                <AdminNavbar onLogout={handleLogout} />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<div>Select an option from the sidebar.</div>} />
                        <Route path="products" element={<ManageProducts />} />
                        <Route path="categories" element={<ManageCategories />} />
                    </Routes>
                </div>
            </div>
        </div>
    );

}
export default AdminDashboard;