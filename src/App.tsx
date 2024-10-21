import React, { useState } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import GridTable from './components/GridTable';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Manage sidebar visibility

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-white gap-5">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 gap-5">
        {/* Sidebar */}
        <Sidebar isVisible={isSidebarVisible} onSelectTable={setSelectedTable} />

        {/* Main Content or Parent Table based on selection */}
        <div className="flex-1 overflow-y-auto">
          {selectedTable ? (
            <GridTable tableName={selectedTable} />
          ) : (
            <MainContent />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
