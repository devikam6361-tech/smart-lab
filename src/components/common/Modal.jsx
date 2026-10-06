const Modal = ({
  open,
  title,
  children,
  onClose,
}) => {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white w-[700px] p-5 rounded">

        <div className="flex justify-between mb-5">

          <h2 className="text-2xl font-bold">

            {title}

          </h2>

          <button
            onClick={onClose}
          >
            X
          </button>

        </div>

        {children}

      </div>

    </div>

  );

};

export default Modal;