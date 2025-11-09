function AdminNavbar({ onLogout }) {
  return (
    <nav className="navbar navbar-light bg-light px-4">
      <span className="navbar-brand mb-0 h1">Clothing Website Admin</span>
      <button className="btn btn-outline-danger" onClick={onLogout}>
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;