import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";

/**
 * ProductList: grouped by categories into carousels.
 * - Uses product.totalPrice when available, otherwise product.discountPrice or product.price.
 * - calls onProductClick(product) and onAddToCart(product)
 */
function ProductList({ products, categories, onProductClick, onAddToCart }) {
  const groupProducts = (products, n = 3) => {
    const grouped = [];
    for (let i = 0; i < products.length; i += n) grouped.push(products.slice(i, i + n));
    return grouped;
  };

  return (
    <div className="container mt-4">
      {categories.map((category) => {
        const categoryProducts = products.filter((p) => p.category?.id === category.id);
        if (!categoryProducts.length) return null;

        return (
          <div key={category.id} className="mb-5">
            <h3 className="mb-3 text-center">{category.name}</h3>

            <div id={`carousel-${category.id}`} className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {groupProducts(categoryProducts, 3).map((group, idx) => (
                  <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                    <div className="row justify-content-center">
                      {group.map((product) => {
                        const totalPrice = product.totalPrice ?? product.discountPrice ?? product.price;
                        const hasDiscount = !!(product.onSale && (product.discountPrice || product.totalPrice));

                        return (
                          <div
                            key={product.id}
                            className="col-md-4 d-flex flex-column align-items-center mb-4"
                          >
                            <img
                              src={product.imageUrl || "https://via.placeholder.com/600x400"}
                              alt={product.name}
                              className="rounded shadow mb-3"
                              style={{ width: "100%", height: "300px", objectFit: "cover", cursor: "pointer" }}
                              onClick={() => onProductClick(product)}
                            />
                            <h5>{product.name}</h5>
                            <p className="text-muted text-center">{product.description}</p>

                            {hasDiscount ? (
                              <div>
                                <span className="text-muted text-decoration-line-through me-2">₱{product.price}</span>
                                <strong className="text-danger">₱{totalPrice}</strong>
                              </div>
                            ) : (
                              <strong>₱{totalPrice}</strong>
                            )}

                            <button
                              className="btn btn-success mt-3"
                              onClick={() => onAddToCart({ ...product, price: totalPrice })}
                            >
                              Add to Cart
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-${category.id}`}
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${category.id}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
