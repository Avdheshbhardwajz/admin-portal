import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Papa from "papaparse";
import Modal from "react-modal"; // Importing react-modal
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

interface GridTableProps {
  tableName: string; // Pass the table name from App
}

// Define a specific type for column definitions
interface ColumnDef {
  field: string;
  filter: boolean;
  cellStyle: (params: any) => { backgroundColor: string; color: string; };
  headerName?: string; // optional property for header name
  cellRenderer?: (params: any) => JSX.Element;
  width?: number;
}

const GridTable: React.FC<GridTableProps> = ({ tableName }) => {
  const [rowData, setRowData] = useState<any[]>([]); // Store table data
  const [colDefs, setColDefs] = useState<ColumnDef[]>([]); // Store column definitions
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedRowData, setSelectedRowData] = useState<any>(null); // Store selected row data
  const [editedData, setEditedData] = useState<any>({}); // Store edited data
  const [pendingChanges, setPendingChanges] = useState<any>({}); // Store pending cell changes

  // Load CSV file and parse it using Papa Parse
  useEffect(() => {
    const csvFile = `/assets/csv/${tableName.toLowerCase().replace(/ /g, "_")}.csv`; // Construct the file path
    Papa.parse(csvFile, {
      download: true,
      header: true, // Treat the first row as headers
      complete: (result: Papa.ParseResult<any>) => {
        const data = result.data;
        if (data.length > 0) {
          // Dynamically create column definitions from CSV header
          const columns: ColumnDef[] = Object.keys(data[0]).map((key) => ({
            field: key,
            filter: true, // Enable filtering on all columns
            cellStyle: (params: any) => {
              const rowId = params.node.id;
              const field = params.colDef.field;

              // Check if this cell has pending changes
              const isPending = pendingChanges[rowId]?.includes(field);
              return isPending
                ? { backgroundColor: "#ffefc3", color: "#6c4e03" } // Highlight pending changes with yellow
                : { backgroundColor: "white", color: "black" };
            },
          }));

          // Add Edit button column
          columns.push({
            headerName: "Actions",
            cellRenderer: (params: any) => (
              <button
                onClick={() => handleEditButtonClick(params.data)}
                className="text-blue-500 underline"
              >
                Edit
              </button>
            ),
            width: 100,
          });

          setColDefs(columns); // Set columns for Ag-Grid
          setRowData(data); // Set row data for Ag-Grid
        }
      },
      error: (err: Error) => console.error("Error parsing CSV file: ", err),
    });
  }, [tableName, pendingChanges]); // Re-run if pending changes are updated

  // Function to handle Edit button click
  const handleEditButtonClick = (data: any) => {
    setSelectedRowData(data); // Store the row data to be edited
    setEditedData({ ...data }); // Prefill the modal form with row data
    setIsModalOpen(true); // Open the modal
  };

  // Handle form input changes in the modal
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Optional validation logic (e.g., numeric validation)
    if (name === "numericField" && isNaN(Number(value))) {
      toast.error("Please enter a valid number"); // Show error if it's not a number
      return;
    }

    setEditedData({ ...editedData, [name]: value }); // Update the editable fields

    // Add this change to the pendingChanges state
    const rowId = rowData.indexOf(selectedRowData);
    setPendingChanges((prevChanges: any) => ({
      ...prevChanges,
      [rowId]: [...(prevChanges[rowId] || []), name],
    }));
  };

  // Handle save in the modal
  const handleSave = () => {
    const updatedRowData = rowData.map((row) =>
      row === selectedRowData ? editedData : row
    );
    setRowData(updatedRowData); // Update the AG Grid row data
    setIsModalOpen(false); // Close the modal

    // Show a confirmation popup after save
    toast.success("Your edited data will reflect here once admin approves it.");
  };

  return (
    <div className="ag-theme-quartz font-poppins font-light text-sm h-full w-full rounded-xl shadow-[1px_5px_35px_10px_#0000004d]">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination={true} // Enable pagination
        paginationPageSize={10} // Set page size
        paginationPageSizeSelector={[10, 20, 50, 100]} // Include 10 in the page size selector
        suppressMenuHide={true} // Keep the filter and menu button always visible
      />

      {/* Modal for Editing */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Row"
        className="fixed inset-0 flex justify-center items-center" // Center the modal
        overlayClassName="fixed inset-0 bg-black bg-opacity-50" // Darken background
      >
        <div className="bg-white p-8 rounded-lg w-[500px] max-h-[70vh] font-poppins flex flex-col ">
          <h2 className="text-lg font-medium mb-4 font-poppins ">Edit Row</h2>
          <div className="flex-grow overflow-y-auto"> {/* Scrollable area */}
            {selectedRowData && (
              <form>
                {colDefs.map((col: any, index: number) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {col.field}
                    </label>
                    {/* Display input for 2nd and 3rd columns only */}
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

      {/* Toast notification container */}
      <ToastContainer />
    </div>
  );
};

export default GridTable;
