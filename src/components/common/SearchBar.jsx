const SearchBar = ({
  value,
  onChange,
}) => {
  return (
    <input
      className="border p-2 rounded w-full"
      placeholder="Search..."
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchBar;