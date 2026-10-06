const Card = ({ children }) => {
  return (
    <div className="border rounded p-5">
      {children}
    </div>
  );
};

export default Card;