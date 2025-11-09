import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Bootstrap JS import for carousel buttons

function Home() {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSale, setOnSale] = useState([]);

  // ✅ Fetch new arrivals and sale items
  useEffect(() => {
    fetch("http://localhost:8080/api/products/new-arrivals")
      .then((res) => res.json())
      .then(setNewArrivals)
      .catch((err) => console.error("Error fetching new arrivals:", err));

    fetch("http://localhost:8080/api/products/sale")
      .then((res) => res.json())
      .then(setOnSale)
      .catch((err) => console.error("Error fetching sale items:", err));
  }, []);

  // ✅ Helper: group products per carousel slide (e.g., 3 items per slide)
  const groupProducts = (products, n) => {
    const grouped = [];
    for (let i = 0; i < products.length; i += n) {
      grouped.push(products.slice(i, i + n));
    }
    return grouped;
  };

  // ✅ Handle click on product
  const handleProductClick = (productId) => {
  const token = localStorage.getItem("token");
  if (token) {
    // ✅ User logged in → redirect to Add-to-Cart page
    navigate(`/add-to-cart/${productId}`);
  } else {
    // ❌ Not logged in → save the product id and redirect to login
    localStorage.setItem("redirectAfterLogin", productId);
    navigate("/customer-login");
  }
};



  return (
    <div>
      {/* 🧭 Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className="navbar-brand" href="/">
          Clothing Website
        </a>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className="btn btn-outline-light mx-2"
                onClick={() => navigate("/customer-login")}
              >
                Customer Login
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-warning mx-2"
                onClick={() => navigate("/admin")}
              >
                Admin Login
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 🎯 Ads Carousel */}
      <div id="adsCarousel" className="carousel slide mt-3" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[
            "https://media.istockphoto.com/id/1428047537/photo/handsome-man-in-gray-autumn-coat-outdoor-fashion-man-portrait.jpg?s=612x612&w=0&k=20&c=3KAAIFp4PfWzUB_wsDlfHDRNAfr2FITYDNsiuuEGWXM=",
            "https://t4.ftcdn.net/jpg/10/16/91/29/360_F_1016912914_eRY4pjTAGuQ1hRywVD2LUS7L6C4Jk0qV.jpg",
            "https://cdn.shopify.com/s/files/1/0665/5557/6618/files/33syn_480x480.jpg?v=1711309246",
          ].map((img, idx) => (
            <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
              <img
                src={img}
                className="d-block w-100 rounded"
                style={{ objectFit: "cover", height: "800px" }}
                alt={`Ad ${idx + 1}`}
              />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#adsCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#adsCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* 🆕 New Arrivals Carousel */}
      <div className="container my-5">
        <h2 className="text-center mb-4">🆕 New Arrivals</h2>
        {newArrivals.length > 0 ? (
          <div id="newArrivalsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {groupProducts(newArrivals, 3).map((group, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <div className="row justify-content-center">
                    {group.map((product) => (
                      <div
                        key={product.id}
                        className="col-md-4 d-flex flex-column align-items-center"
                        onClick={() => handleProductClick(product.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="rounded shadow mb-3"
                          style={{ width: "100%", height: "400px", objectFit: "cover" }}
                        />
                        <h5>{product.name}</h5>
                        <p className="text-muted">{product.description}</p>
                        {product.discountPrice ? (
                          <div>
                            <span className="text-muted text-decoration-line-through me-2">₱{product.price}</span>
                            <strong className="text-danger">₱{product.discountPrice}</strong>
                          </div>
                        ) : (
                          <strong>₱{product.price}</strong>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#newArrivalsCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#newArrivalsCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        ) : (
          <p className="text-center text-muted">No new arrivals yet.</p>
        )}
      </div>

      {/* 💸 On Sale Carousel */}
      <div className="container my-5">
        <h2 className="text-center mb-4">💸 On Sale</h2>
        {onSale.length > 0 ? (
          <div id="onSaleCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {groupProducts(onSale, 3).map((group, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <div className="row justify-content-center">
                    {group.map((product) => (
                      <div
                        key={product.id}
                        className="col-md-4 d-flex flex-column align-items-center"
                        onClick={() => handleProductClick(product.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="rounded shadow mb-3"
                          style={{ width: "100%", height: "400px", objectFit: "cover" }}
                        />
                        <h5>{product.name}</h5>
                        <p className="text-muted">{product.description}</p>
                        <div>
                          <span className="text-muted text-decoration-line-through me-2">₱{product.price}</span>
                          <strong className="text-danger">₱{product.discountPrice}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#onSaleCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#onSaleCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        ) : (
          <p className="text-center text-muted">No items on sale currently.</p>
        )}
      </div>
    </div>
  );
}

export default Home;