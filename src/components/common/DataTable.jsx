const DataTable = ({
  columns = [],
  data = [],
  emptyMessage = "No Data Found",
}) => {
  return (
    <div className="overflow-x-auto border rounded">

      <table className="min-w-full">

        <thead>

          <tr>

            {columns.map((column) => (

              <th
                key={column.key}
                className="border p-2 text-left"
              >
                {column.title}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {data.length === 0 && (

            <tr>

              <td
                colSpan={columns.length}
                className="text-center p-4"
              >
                {emptyMessage}
              </td>

            </tr>

          )}

          {data.map((row, index) => (

            <tr key={row.id || index}>

              {columns.map((column) => (

                <td
                  key={column.key}
                  className="border p-2"
                >
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default DataTable;