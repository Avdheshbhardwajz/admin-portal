import React from "react";

interface TableButtonProps {
  tableName: string;
  onClick: () => void;
}

const TableButton: React.FC<TableButtonProps> = ({ tableName, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-3 bg-[#2D2D6D] text-white rounded-lg hover:bg-[#3A3A9D] transition duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 text-center w-full text-sm sm:text-base shadow-md hover:shadow-lg"
    >
      <span className="truncate font-medium">{tableName}</span>
    </button>
  );
};

export default TableButton;
