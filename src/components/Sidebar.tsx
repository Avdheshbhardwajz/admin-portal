import React from "react";

interface SidebarProps {
  isVisible: boolean;
  onSelectTable: (tableName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onSelectTable }) => {
  const tableData = [
    { name: "Organization" },
    { name: "Product" },
    { name: "Employee" },
    { name: "Broker" },
    { name: "Transaction" },
  ];

  return (
    <div
      className={`${
        isVisible ? "block" : "hidden"
      } w-[15%] rounded-xl transition-all duration-300 bg-white border-2 shadow-[1px_5px_35px_10px_#0000004d] p-2 flex flex-col justify-center  font-poppins overflow-y-auto`}
    >
      {/* Display the list of tables */}
      <div className="flex flex-col items-center justify-between  space-y-5">
        {tableData.map((table, index) => (
          <button
            key={index}
            onClick={() => onSelectTable(table.name)}
            className="p-4 rounded-xl bg-[#00529B] text-white font-bold hover:bg-[#003F6B] transition duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 text-center w-[80%] text-sm sm:text-base shadow-md hover:shadow-lg"
          >
            <span className="truncate font-light">{table.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
