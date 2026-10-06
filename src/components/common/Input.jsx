const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="flex flex-col gap-1">

      {label && (
        <label className="font-medium">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 rounded"
      />

    </div>
  );
};

export default Input;
