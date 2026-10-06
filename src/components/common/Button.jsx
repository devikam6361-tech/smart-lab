const Button = ({
  children,
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="border px-4 py-2 rounded"
    >
      {children}
    </button>
  );
};

export default Button;