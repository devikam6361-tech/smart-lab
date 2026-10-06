import { useLabs } from "../../context/LabContext";

const LabTable = () => {
  const { labs, deleteLab } = useLabs();

  console.log(labs);

  return (
    <div className="border p-5">
      <h2 className="text-xl font-bold mb-4">Labs</h2>

      {labs.length === 0 ? (
        <p>No labs added</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Code</th>

              <th className="border p-2">Name</th>

              <th className="border p-2">Department</th>

              <th className="border p-2">Capacity</th>

              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {labs.map((lab) => (
              <tr key={lab.id}>
                <td className="border p-2">{lab.labCode}</td>

                <td className="border p-2">{lab.labName}</td>

                <td className="border p-2">{lab.department}</td>

                <td className="border p-2">{lab.capacity}</td>

                <td className="border p-2">
                  <button
                    onClick={() => deleteLab(lab.id)}
                    className="border px-3 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LabTable;
