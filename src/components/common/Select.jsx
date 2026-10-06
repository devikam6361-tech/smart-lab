const Select = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="flex flex-col gap-1">

      {label && (
        <label>{label}</label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 rounded"
      >
        <option value="">
          Select
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
};

export default Select;