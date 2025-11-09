import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddToCartPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const hasAdded = useRef(false); // ✅ Prevent double execution in React 18 StrictMode

  useEffect(() => {
    if (!token) {
      navigate("/customer-login");
      return;
    }

    // ✅ Prevent duplicate addToCart calls (React StrictMode fix)
    if (hasAdded.current) return;
    hasAdded.current = true;

    const addToCart = async () => {
      try {
        await axios.post(
          "http://localhost:8080/api/cart/add",
          { productId, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("✅ Product added to cart!");
        navigate("/cart"); // ✅ Redirect to CartPage after adding
      } catch (err) {
        console.error("Error adding to cart:", err);
        alert("❌ Failed to add to cart.");
      }
    };

    addToCart();
  }, [productId, token, navigate]);

  return <p className="text-center mt-5">Adding to cart...</p>;
}

export default AddToCartPage;