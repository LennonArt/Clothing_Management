import { useEffect, useState } from "react";
import axios from "axios";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // optional loading state
  const [error, setError] = useState(null);     // optional error state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("JWT Token:", token); // make sure this prints a valid JWT

        const res = await axios.get("http://localhost:8080/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p><strong>Order Number:</strong> {order.orderNumber}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          <p><strong>Total:</strong> ₱{order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}

export default MyOrdersPage;