import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Papa from "papaparse";
import Modal from "react-modal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface GridTableProps {
  tableName: string;
}

interface ColumnDef {
  field: string;
  filter: boolean;
  cellStyle?: (params: any) => { backgroundColor: string; color: string }; // Made optional
  headerName?: string;
  cellRenderer?: (params: any) => JSX.Element;
  width?: number;
}

const GridTable: React.FC<GridTableProps> = ({ tableName }) => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColumnDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [pendingChanges, setPendingChanges] = useState<any>({});

  useEffect(() => {
    const csvFile = `/assets/csv/${tableName.toLowerCase().replace(/ /g, "_")}.csv`;
    Papa.parse(csvFile, {
      download: true,
      header: true,
      complete: (result: Papa.ParseResult<any>) => {
        const data = result.data;
        if (data.length > 0) {
          const columns: ColumnDef[] = Object.keys(data[0]).map((key) => ({
            field: key,
            filter: true,
            cellStyle: (params: any) => {
              const rowId = params.node.id;
              const field = params.colDef.field;
              const isPending = pendingChanges[rowId]?.includes(field);
              return isPending
                ? { backgroundColor: "#ffefc3", color: "#6c4e03" }
                : { backgroundColor: "white", color: "black" };
            },
          }));

          columns.push({
            headerName: "Actions",
            field: "actions",
            cellRenderer: (params: any) => (
              <button
                onClick={() => handleEditButtonClick(params.data)}
                className="text-blue-500 underline"
              >
                Edit
              </button>
            ),
            width: 100,
            filter: false,
          });

          setColDefs(columns);
          setRowData(data);
        }
      },
      error: (err: Error) => console.error("Error parsing CSV file: ", err),
    });
  }, [tableName, pendingChanges]);

  const handleEditButtonClick = (data: any) => {
    setSelectedRowData(data);
    setEditedData({ ...data });
    setIsModalOpen(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "numericField" && isNaN(Number(value))) {
      toast.error("Please enter a valid number");
      return;
    }

    setEditedData({ ...editedData, [name]: value });

    const rowId = rowData.indexOf(selectedRowData);
    setPendingChanges((prevChanges: any) => ({
      ...prevChanges,
      [rowId]: [...(prevChanges[rowId] || []), name],
    }));
  };

  const handleSave = () => {
    const updatedRowData = rowData.map((row) =>
      row === selectedRowData ? editedData : row
    );
    setRowData(updatedRowData);
    setIsModalOpen(false);
    toast.success("Your edited data will reflect here once admin approves it.");
  };

  return (
    <div className="ag-theme-quartz font-poppins font-light text-sm h-full w-full rounded-xl shadow-[1px_5px_35px_10px_#0000004d]">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        suppressMenuHide={true}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Row"
        className="fixed inset-0 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg w-[500px] max-h-[70vh] font-poppins flex flex-col ">
          <h2 className="text-lg font-medium mb-4 font-poppins ">Edit Row</h2>
          <div className="flex-grow overflow-y-auto">
            {selectedRowData && (
              <form>
                {colDefs.map((col: ColumnDef, index: number) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {col.field}
                    </label>
                    {index === 1 || index === 2 ? (
                      <input
                        type="text"
                        name={col.field}
                        value={editedData[col.field] || ""}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                    ) : (
                      <p className="mt-1 p-2 border rounded-md w-full bg-gray-100">
                        {editedData[col.field] || ""}
                      </p>
                    )}
                  </div>
                ))}
              </form>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="mr-4 py-2 px-4 bg-[#00529B] text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-4 bg-[#00529B] text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default GridTable;