import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function CartPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:8080/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Cart response:", res.data);

          // Handle both array and object response
          let itemsArray = [];
          if (Array.isArray(res.data)) {
            itemsArray = res.data;
          } else if (res.data?.cartItems) {
            itemsArray = res.data.cartItems;
          } else if (res.data) {
            itemsArray = [res.data];
          }

          const mapped = itemsArray.map((item) => ({
            cartItemId: item.id,
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity ?? 1,
            price: Number(item.product.totalPrice ?? item.product.discountPrice ?? item.product.price),
            discountedPrice: item.product.totalPrice ?? item.product.discountPrice ?? null,
            originalPrice: Number(item.product.price),
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

  // Sync cart for guest users
  useEffect(() => {
    if (!token) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, token]);

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  const handleCheckout = async () => {
    if (!token) {
      navigate("/customer-login");
      return;
    }

    if (!shippingAddress || !billingAddress) {
      alert("Please enter both shipping and billing addresses.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    try {
      const orderPayload = {
        subtotal,
        tax: 0,
        shippingFee: 0,
        discount: 0,
        totalAmount: subtotal,
        paymentMethod,
        shippingAddress,
        billingAddress,
        notes: "",
        items: cart.map((it) => ({
          product: { id: it.id },
          price: it.price,
          quantity: it.quantity,
        })),
      };

      const orderRes = await axios.post("http://localhost:8080/api/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const createdOrder = orderRes.data;

      // Create Payment
      const paymentPayload = {
        orderId: createdOrder.id,
        paymentMethod,
        amount: Number(createdOrder.totalAmount ?? subtotal),
        remarks: "Checkout payment",
      };
      await axios.post("http://localhost:8080/api/payments", paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear backend cart
      await axios.delete("http://localhost:8080/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear frontend cart
      setCart([]);
      localStorage.removeItem("cart");

      navigate("/order-confirmation", { state: { order: createdOrder } });
    } catch (err) {
      console.error("Checkout failed:", err);
      if (err.response?.status === 403) {
        alert("Session expired. Please log in again.");
        navigate("/customer-login");
      } else {
        alert("❌ Checkout failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Your Cart 🛒</h2>

      {cart.length ? (
        <>
          <table className="table table-striped mt-3">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.cartItemId ?? item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>
                    {item.price !== item.originalPrice ? (
                      <>
                        <span className="text-muted text-decoration-line-through me-2">
                          ₱{Number(item.originalPrice).toFixed(2)}
                        </span>
                        <span className="text-danger fw-bold">
                          ₱{Number(item.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>₱{Number(item.price).toFixed(2)}</>
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td>₱{((Number(item.price) || 0) * (item.quantity || 0)).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" disabled={isLoading}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="card p-4 shadow-sm mt-4">
            <h4 className="fw-bold mb-3">Checkout Details</h4>

            <div className="mb-3">
              <label className="form-label">Shipping Address</label>
              <input
                className="form-control"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your shipping address"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Billing Address</label>
              <input
                className="form-control"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter your billing address"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="GCash">GCash</option>
                <option value="Card">Credit/Debit Card</option>
              </select>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <h5 className="fw-bold">Total: ₱{subtotal.toFixed(2)}</h5>
              <button className="btn btn-success" onClick={handleCheckout} disabled={isLoading}>
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Your cart is empty. 🛍</p>
      )}
    </div>
  );
}

export default CartPage;