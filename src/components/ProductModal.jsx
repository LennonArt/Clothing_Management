import React from "react";

/**
 * ProductModal: shows price using totalPrice if provided.
 * onAddToCart receives the full product object (we attach price in Home page)
 */
function ProductModal({ product, onClose, onAddToCart }) {
  const totalPrice = product.totalPrice ?? product.discountPrice ?? product.price;
  const hasDiscount = !!(product.onSale && (product.discountPrice || product.totalPrice));

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product.name}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            <img
              src={product.imageUrl || "https://via.placeholder.com/600x400"}
              alt={product.name}
              className="img-fluid mb-3"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
            <p>{product.description}</p>

            {hasDiscount ? (
              <div>
                <span className="text-muted text-decoration-line-through me-2">₱{product.price}</span>
                <span className="text-danger fw-bold">₱{totalPrice}</span>
              </div>
            ) : (
              <h5>₱{totalPrice}</h5>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              className="btn btn-success"
              onClick={() => onAddToCart({ ...product, price: totalPrice })}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;