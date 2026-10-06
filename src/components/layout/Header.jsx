import { useAuth } from "../../context/AuthContext";

const Header = ({ title }) => {
  const { currentUser } = useAuth();

  return (
    <header className="border-b p-5 flex justify-between">

      <div>

        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p>{currentUser?.role}</p>

      </div>

      <div className="text-right">

        <h2 className="font-bold">
          {currentUser?.name}
        </h2>

        <p>{currentUser?.email}</p>

      </div>

    </header>
  );
};

export default Header;