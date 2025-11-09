import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductList from "../components/ProductList";
import CategoryFilter from "../components/CategoryFilter";
import ProductModal from "../components/ProductModal";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get("http://localhost:8080/api/categories"),
          axios.get("http://localhost:8080/api/products"),
        ]);
        setCategories(categoryRes.data);
        setProducts(productRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter((p) => (!selectedCategory || p.category?.id === selectedCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "asc"
        ? (a.totalPrice ?? a.discountPrice ?? a.price) - (b.totalPrice ?? b.discountPrice ?? b.price)
        : (b.totalPrice ?? b.discountPrice ?? b.price) - (a.totalPrice ?? a.discountPrice ?? a.price)
    );

  // Add to cart: if logged in -> call backend, else update localStorage guest cart
  const handleAddToCart = async (product) => {
    // product should already include price field set by ProductList/ProductModal as product.price
    const price = product.price ?? (product.totalPrice ?? product.discountPrice ?? product.price);

    if (!token) {
      // Guest local cart
      const saved = localStorage.getItem("cart");
      let cart = saved ? JSON.parse(saved) : [];
      const exists = cart.find((it) => it.id === product.id);
      if (exists) {
        cart = cart.map((it) => (it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it));
      } else {
        cart.push({
          cartItemId: product.id, // use product.id for guest
          id: product.id,
          name: product.name,
          price,
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setMessage(`${product.name} added to cart (guest).`);
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    // Logged-in user: call backend
    try {
      const res = await axios.post(
        "http://localhost:8080/api/cart/add",
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Product added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error adding to backend cart:", err);
      setMessage("Failed to add to cart.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              {/* 🧢 Left Side - Shop Info */}
              <div>
                <h1 className="fw-bold mb-0">Clothing E-Shop</h1>
                <p className="text-muted mb-0">
                  Discover the latest trends for every occasion.
                </p>
              </div>

              {/* 🛒 Right Side - Buttons Group */}
              <div className="d-flex gap-2 mt-3 mt-md-0">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/useraccount")}
                >
                  Manage Account
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/cart")}
                >
                  Go to Cart
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => navigate("/orders")}
                >
                  My Orders
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/customer-login")}
                >
                  {token ? "Logout" : "Login"}
                </button>
              </div>
            </div>


      {message && <div className="alert alert-info text-center mb-4">{message}</div>}

      <div className="row mb-4">
        <div className="col-md-3">
          <CategoryFilter categories={categories} onSelect={setSelectedCategory} />
        </div>
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-control" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Sort by Price: Low to High</option>
            <option value="desc">Sort by Price: High to Low</option>
          </select>
        </div>
      </div>

      {filteredProducts.length ? (
        <ProductList products={filteredProducts} categories={categories} onProductClick={setSelectedProduct} onAddToCart={handleAddToCart} />
      ) : (
        <p>No products found...</p>
      )}

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />}
    </div>
  );
}

export default HomePage;
