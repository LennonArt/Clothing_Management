import { useEffect, useState } from "react";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    quantity: "",
    onSale: false,
    discountPrice: "",
    newArrival: false,
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch products and categories
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then(setProducts);

    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/api/products/${editingId}`
      : "http://localhost:8080/api/products";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: { id: parseInt(form.categoryId) },
        imageUrl: form.imageUrl,
        quantity: parseInt(form.quantity),
        onSale: form.onSale,
        discountPrice: form.discountPrice
          ? parseFloat(form.discountPrice)
          : null,
        newArrival: form.newArrival,
      }),
    })
      .then(() => {
        setForm({
          name: "",
          description: "",
          price: "",
          categoryId: "",
          imageUrl: "",
          quantity: "",
          onSale: false,
          discountPrice: "",
          newArrival: false,
        });
        setEditingId(null);
        return fetch("http://localhost:8080/api/products")
          .then((res) => res.json())
          .then(setProducts);
      });
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.category?.id || "",
      imageUrl: product.imageUrl,
      quantity: product.quantity,
      onSale: product.onSale || false,
      discountPrice: product.discountPrice || "",
      newArrival: product.newArrival || false,
    });
    setEditingId(product.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" })
      .then(() => fetch("http://localhost:8080/api/products"))
      .then((res) => res.json())
      .then(setProducts);
  };

  return (
    <div className="container mt-4">
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              name="name"
              className="form-control"
              placeholder="Name"
              value={form.name}
              required
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              name="description"
              className="form-control"
              placeholder="Description"
              value={form.description}
              required
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              name="price"
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Price"
              value={form.price}
              required
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <select
              name="categoryId"
              className="form-control"
              value={form.categoryId}
              required
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              name="quantity"
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={form.quantity}
              required
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mt-2">
            <input
              name="imageUrl"
              className="form-control"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          {/* ✅ On Sale Checkbox */}
          <div className="col-md-2 mt-2">
            <div className="form-check">
              <input
                type="checkbox"
                name="onSale"
                checked={form.onSale}
                onChange={(e) =>
                  setForm({ ...form, onSale: e.target.checked })
                }
                className="form-check-input"
                id="onSale"
              />
              <label className="form-check-label" htmlFor="onSale">
                On Sale
              </label>
            </div>
          </div>

          {/* ✅ Discount Price Input */}
          {form.onSale && (
            <div className="col-md-2 mt-2">
              <input
                name="discountPrice"
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Discount Price"
                value={form.discountPrice}
                onChange={handleChange}
              />
            </div>
          )}

          {/* ✅ New Arrival Checkbox */}
          <div className="col-md-2 mt-2">
            <div className="form-check">
              <input
                type="checkbox"
                name="newArrival"
                checked={form.newArrival}
                onChange={(e) =>
                  setForm({ ...form, newArrival: e.target.checked })
                }
                className="form-check-input"
                id="newArrival"
              />
              <label className="form-check-label" htmlFor="newArrival">
                New Arrival
              </label>
            </div>
          </div>

          <div className="col-md-2 mt-2">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      </form>

      {/* ✅ Product Table */}
      <h2>Product List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Discount Price</th>
            <th>On Sale</th>
            <th>New Arrival</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>₱{product.price}</td>
              <td>
                {product.discountPrice ? `₱${product.discountPrice}` : "-"}
              </td>
              <td>{product.onSale ? "✅ Yes" : "❌ No"}</td>
              <td>{product.newArrival ? "🆕" : ""}</td>
              <td>{product.category?.name || "Uncategorized"}</td>
              <td>{product.quantity}</td>
              <td>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: "50px" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProducts;