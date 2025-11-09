import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function CheckoutPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:8080/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const mapped = res.data.map((item) => ({
            cartItemId: item.id,
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity ?? 1,
            price: Number(item.product.totalPrice ?? item.product.discountPrice ?? item.product.price),
          }));
          setCart(mapped);
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      } else {
        const saved = localStorage.getItem("cart");
        setCart(saved ? JSON.parse(saved) : []);
      }
    };
    fetchCart();
  }, [token]);

  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0), 0);

  const handlePayment = async () => {
    if (!token) {
      alert("Please login to complete checkout.");
      navigate("/customer-login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // 1️⃣ Create the Order
      const orderPayload = {
        subtotal: total,
        tax: 0,
        shippingFee: 0,
        discount: 0,
        totalAmount: total,
        paymentMethod: "COD",
        shippingAddress: "Customer Address Here",
        billingAddress: "Customer Address Here",
        notes: "N/A",
        items: cart.map((item) => ({
          product: { id: item.id },
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const orderRes = await axios.post("http://localhost:8080/api/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const order = orderRes.data;
      console.log("✅ Order created:", order);

      // 2️⃣ Create a Payment entry (send auth header)
      const paymentPayload = {
        orderId: order.id,
        paymentMethod: order.paymentMethod ?? "COD",
        amount: Number(order.totalAmount ?? total),
        remarks: "Auto payment at checkout",
      };

      await axios.post("http://localhost:8080/api/payments", paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3️⃣ Clear cart in backend (optional)
      await axios.delete("http://localhost:8080/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});

      // 4️⃣ Reset local state
      setMessage("✅ Payment successful! Thank you for your purchase.");
      setCart([]);
      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/homepage");
      }, 1500);
    } catch (err) {
      console.error("Payment failed:", err);
      setMessage("❌ Payment failed. Please try again.");
      if (err.response?.status === 403) {
        alert("Session expired. Please log in again.");
        navigate("/customer-login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Checkout 🧾</h2>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      {cart.length ? (
        <>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.cartItemId ?? item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>₱{Number(item.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>₱{((Number(item.price) || 0) * (item.quantity || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-end me-3">Total: ₱{total.toFixed(2)}</h4>

          <div className="text-end mt-3">
            <button
              className="btn btn-success"
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Payment"}
            </button>
            <button className="btn btn-outline-dark ms-3" onClick={() => navigate("/cart")} disabled={isLoading}>
              Back to Cart
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty. 🛍</p>
      )}
    </div>
  );
}

export default CheckoutPage;