import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="container mt-5 text-center">
        <h3>No order found.</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/homepage")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="fw-bold text-center text-success">✅ Order Confirmed!</h2>
        <p className="text-center text-muted">
          Thank you for shopping with us. Your order ID is <strong>{order.id}</strong>.
        </p>

        <div className="mt-4">
          <h4>Order Summary</h4>
          <ul className="list-group">
            {order.items.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>{item.product.name} (x{item.quantity})</span>
                <span>₱{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="text-end mt-3 fw-bold">
            Total: ₱{order.totalAmount}
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-outline-primary me-3" onClick={() => navigate("/homepage")}>
            Continue Shopping
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/orders")}>
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;