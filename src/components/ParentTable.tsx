import React from "react";
import EditableTable from "./EditableTable";

interface ParentTableProps {
  tableName: string;
}

const ParentTable: React.FC<ParentTableProps> = ({ tableName }) => {
  // Sample data for the editable table
  const data = [
    { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
    { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
    { id: 3, name: "Charlie", age: 35, email: "charlie@example.com" },
    { id: 4, name: "David", age: 40, email: "david@example.com" },
    { id: 5, name: "Eva", age: 28, email: "eva@example.com" },
    { id: 6, name: "Frank", age: 32, email: "frank@example.com" },
    { id: 7, name: "Grace", age: 27, email: "grace@example.com" },
    { id: 8, name: "Hannah", age: 31, email: "hannah@example.com" },
    { id: 9, name: "Ivy", age: 29, email: "ivy@example.com" },
    { id: 10, name: "Jack", age: 26, email: "jack@example.com" },
    { id: 11, name: "Kathy", age: 24, email: "kathy@example.com" },
    { id: 12, name: "Liam", age: 33, email: "liam@example.com" },
  ];

  // Define columns with the editable property
  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name", editable: true },
    { Header: "Age", accessor: "age", editable: true },
    { Header: "Email", accessor: "email" },
  ];

  return (
    <div className="p-4 font-poppins">
      <h1 className="text-2xl mb-4 text-gray-800 font-bold font-poppins">
        Editable Data Table for {tableName}
      </h1>
      <EditableTable data={data} columns={columns} />
    </div>
  );
};

export default ParentTable;
