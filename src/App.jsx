import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import CustomerLogin from "./pages/CustomerLogin";
import Home from './pages/Home';
import AdminLogin from "./pages/AdminLogin";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddToCartPage from "./pages/AddToCartPage";
import CheckoutPage from "./pages/CheckOutPage";
import CartPage from "./pages/CartPage";
import UserAccountPage from "./pages/UserAccountPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrdersPage from "./pages/MyOrdersPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} /> {/* ✅ this allows nested routes */}
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/useraccount" element={<UserAccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/add-to-cart/:productId" element={<AddToCartPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
