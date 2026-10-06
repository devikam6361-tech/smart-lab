import DataTable from "../common/DataTable";
import Button from "../common/Button";

import { useClerks } from "../../context/ClerkContext";
import { useAuth } from "../../context/AuthContext";

const ClerkTable = ({ onEdit }) => {

  const { clerks, deleteClerk } = useClerks();

  const { deleteUser } = useAuth();

  const columns = [
    {
      title: "Employee ID",
      key: "employeeId",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Department",
      key: "department",
    },
    {
      title: "Actions",
      key: "actions",

      render: (clerk) => (
        <div className="flex gap-2">

          <Button onClick={() => onEdit(clerk)}>
            Edit
          </Button>

          <Button
            onClick={() => {

              deleteClerk(clerk.id);

              deleteUser(clerk.userId);

            }}
          >
            Delete
          </Button>

        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={clerks}
      emptyMessage="No Clerks Found"
    />
  );
};

export default ClerkTable;