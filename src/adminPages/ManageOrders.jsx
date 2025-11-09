import { useEffect, useState } from "react";

function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then((res) => res.json())
            .then(setCategories);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId
            ? `http://localhost:8080/api/categories/${editingId}`
            : "http://localhost:8080/api/categories";
        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        })
            .then(() => {
                setName("");
                setEditingId(null);
                return fetch("http://localhost:8080/api/categories").then((res) => res.json()).then(setCategories);
            });
    };

    const handleEdit = (category) => {
        setName(category.name);
        setEditingId(category.id);
    };
    const handleDelete = (id) => {
        fetch(`http://localhost:8080/api/categories/${id}`, { method: "DELETE" })
            .then(() => fetch("http://localhost:8080/api/categories"))
            .then((res) => res.json())
            .then(setCategories);
    };

    return (
        <div>
            <h2 className="mb-4">Manage Categories</h2>
            <form onSubmit={handleSubmit} className="mb-4 d-flex gap-2">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category Name"
                    className="form-control"
                    required
                />
                <button type="submit" className="btn btn-primary">
                    {editingId ? "Update" : "Add"}
                </button>
            </form>
            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {category.name}
                        <div>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(category)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default ManageCategories;