const CategoryFilter = ({ categories, onSelect }) => {
  return (
    <select
      className="form-control"
      onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;
