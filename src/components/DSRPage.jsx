import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';

const DSRHondaReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState([
    'SNO', 'Job', 'INVNO', 'INVDT', 'CONSIGNEE', 'DESTINATION', 
    'GOODS', 'GrossWeightKGS', 'NETWEIGHT', 'TERM', 'SBILLNO', 
    'SBILLDT', 'STUFFINGDT', 'HANDOVERDT', 'SLINE', 'BKGNO', 
    'CONTAINERNO', 'CONTYPE', 'RAILOUTDT', 'ARRIVAL', 'VESSEL', 
    'VOY', 'ETD', 'SOB', 'ETA', 'MBHBLNO', 'DT', 'REMARK'
  ]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // All available columns with their display names
  const allColumns = [
    { key: 'SNO', name: 'S/NO' },
    { key: 'Job', name: 'Job No' },
    { key: 'INVNO', name: 'INV NO.' },
    { key: 'INVDT', name: 'INV DT' },
    { key: 'CONSIGNEE', name: 'CONSIGNEE' },
    { key: 'DESTINATION', name: 'DESTINATION' },
    { key: 'GOODS', name: 'GOODS' },
    { key: 'GrossWeightKGS', name: 'Gross Weight KGS' },
    { key: 'NETWEIGHT', name: 'NET WEIGHT (KGS)' },
    { key: 'TERM', name: 'TERM' },
    { key: 'SBILLNO', name: 'SBILL NO.' },
    { key: 'SBILLDT', name: 'SBILL DT' },
    { key: 'STUFFINGDT', name: 'STUFFING DT.' },
    { key: 'HANDOVERDT', name: 'HANDOVER DT.' },
    { key: 'SLINE', name: 'S/LINE' },
    { key: 'BKGNO', name: 'BKG NO' },
    { key: 'CONTAINERNO', name: 'CONTAINER NO.' },
    { key: 'CONTYPE', name: 'CON TYPE' },
    { key: 'RAILOUTDT', name: 'RAIL OUT DT.' },
    { key: 'ARRIVAL', name: 'ARRIVAL @ MUNDRA/PIPAVAV' },
    { key: 'VESSEL', name: 'VESSEL' },
    { key: 'VOY', name: 'VOY' },
    { key: 'ETD', name: 'E.T.D' },
    { key: 'SOB', name: 'S.O.B' },
    { key: 'ETA', name: 'E.T.A' },
    { key: 'MBHBLNO', name: 'MB/HBL NO' },
    { key: 'DT', name: 'DT.' },
    { key: 'REMARK', name: 'REMARK' }
  ];

  // Function to format dates consistently
  const formatDate = useCallback((dateValue) => {
    if (!dateValue) return null;
    
    try {
      // Handle both Date objects and string representations
      const date = new Date(dateValue);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateValue; // Return original value if it's not a valid date
      }
      
      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch {
      return dateValue; // Return original value if parsing fails
    }
  }, []);

  // Function to extract just the date part from a timestamp
  const extractDateFromTimestamp = useCallback((timestamp) => {
    if (!timestamp) return null;
    
    // If it's already a date string in YYYY-MM-DD format
    if (typeof timestamp === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(timestamp)) {
      return timestamp;
    }
    
    // If it's a timestamp with time component
    if (typeof timestamp === 'string' && timestamp.includes('T')) {
      return timestamp.split('T')[0];
    }
    
    // If it's a full timestamp string
    if (typeof timestamp === 'string') {
      const datePart = timestamp.split(' ')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return datePart;
      }
    }
    
    // For all other cases, try to format it
    return formatDate(timestamp);
  }, [formatDate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data from Supabase...');

      // Query the shipments table directly since it contains all the needed data
      const { data: shipmentsData, error: shipmentsError } = await supabase
        .from('shipments')
        .select('*')
        .order('job_no', { ascending: true });

      if (shipmentsError) throw shipmentsError;

      console.log('Shipments data:', shipmentsData);
      
      // Transform the data for display
      transformData(shipmentsData);

    } catch (err) {
      console.error('Error in fetchData:', err);
      setError(err.message);
      setLoading(false);
      
      // Use sample data only as last resort
      if (retryCount >= 2) {
        const sampleData = [
          {
            SNO: 1,
            INVNO: "10H-3130-01",
            INVDT: "2021-09-07",
            CONSIGNEE: "AMERICAN HONDA",
            DESTINATION: "HOUSTON",
            GOODS: "IC ENGINES PETROL",
            GrossWeightKGS: 13760,
            NETWEIGHT: 13200,
            TERM: "CIF",
            SBILLNO: 4438452,
            SBILLDT: "2021-09-08",
            STUFFINGDT: "2021-09-08",
            HANDOVERDT: "2021-09-09",
            SLINE: "CMA",
            BKGNO: "CAD0558889",
            CONTAINERNO: "TCNU5219260",
            CONTYPE: "40'",
            RAILOUTDT: "2021-09-11",
            ARRIVAL: "2021-09-13",
            VESSEL: "CMA CGM OTELLO",
            VOY: "0MXA3W1MA",
            ETD: "2021-09-18",
            SOB: "2021-09-18",
            ETA: "2021-12-05",
            MBHBLNO: "CAD0558889",
            DT: "2021-09-18",
            REMARK: "SHIPMENT DELIVER TO CONSIGNEE ON 08TH DEC",
            Job: 1001
          },
        ];
        setData(sampleData);
        setFilteredData(sampleData);
        setError("Using sample data. Could not connect to database: " + err.message);
      }
    }
  }, [retryCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData, retryCount]);

  const transformData = useCallback((rawData) => {
    // Transform the shipment data
    const transformedData = rawData.map((item, index) => {
      // Extract values from shipment data
      return {
        SNO: index + 1,
        INVNO: item.shipment_no || null,
        INVDT: extractDateFromTimestamp(item.shipment_date),
        CONSIGNEE: item.consignee || null,
        DESTINATION: item.pod || item.pof || null,
        GOODS: item.description || null,
        GrossWeightKGS: item.gross_weight || null,
        NETWEIGHT: item.gross_weight || null, // Using gross weight as fallback
        TERM: item.incoterms || null,
        SBILLNO: item.hbl_no || null,
        SBILLDT: extractDateFromTimestamp(item.shipment_date),
        STUFFINGDT: extractDateFromTimestamp(item.shipment_date), // Using shipment date as fallback
        HANDOVERDT: extractDateFromTimestamp(item.shipment_date), // Using shipment date as fallback
        SLINE: item.carrier || null,
        BKGNO: item.job_no || null,
        CONTAINERNO: "N/A", // Not in the schema
        CONTYPE: "N/A", // Not in the schema
        RAILOUTDT: extractDateFromTimestamp(item.shipment_date), // Using shipment date as fallback
        ARRIVAL: extractDateFromTimestamp(item.eta), // Using ETA as arrival
        VESSEL: item.vessel_name_summary || null,
        VOY: "N/A", // Not in the schema
        ETD: extractDateFromTimestamp(item.etd),
        SOB: extractDateFromTimestamp(item.etd), // Using ETD as sail on board
        ETA: extractDateFromTimestamp(item.eta),
        MBHBLNO: item.hbl_no || null,
        DT: extractDateFromTimestamp(item.shipment_date),
        REMARK: item.remarks || null,
        Job: item.job_no || null,
      };
    });

    console.log('Final transformed data:', transformedData);
    setData(transformedData);
    setFilteredData(transformedData);
    setLoading(false);
  }, [extractDateFromTimestamp]);

  useEffect(() => {
    let result = data;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(val =>
          val && val.toString().toLowerCase().includes(term)
        )
      );
    }
    setFilteredData(result);
  }, [searchTerm, data]);


  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      // Handle null/undefined values
      if (a[key] === null || a[key] === undefined) return direction === 'ascending' ? -1 : 1;
      if (b[key] === null || b[key] === undefined) return direction === 'ascending' ? 1 : -1;
      
      // Handle numeric values
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
      }
      
      // Handle date values (strings in YYYY-MM-DD format)
      if (typeof a[key] === 'string' && typeof b[key] === 'string' && 
          /^\d{4}-\d{2}-\d{2}$/.test(a[key]) && /^\d{4}-\d{2}-\d{2}$/.test(b[key])) {
        return direction === 'ascending' ? 
          new Date(a[key]) - new Date(b[key]) : 
          new Date(b[key]) - new Date(a[key]);
      }
      
      // Handle string values
      const aValue = a[key].toString().toLowerCase();
      const bValue = b[key].toString().toLowerCase();
      
      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Create a copy of data with more readable headers
    const excelData = filteredData.map(item => {
      const row = {};
      selectedColumns.forEach(col => {
        const columnInfo = allColumns.find(c => c.key === col);
        row[columnInfo.name] = item[col] || 'N/A';
      });
      return row;
    });
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "DSR ");
    XLSX.writeFile(wb, "DSR.xlsx");
  };

  const retryFetch = () => {
    setRetryCount(prev => prev + 1);
  };

  const toggleColumn = (columnKey) => {
    if (selectedColumns.includes(columnKey)) {
      setSelectedColumns(selectedColumns.filter(col => col !== columnKey));
    } else {
      setSelectedColumns([...selectedColumns, columnKey]);
    }
  };

  const selectAllColumns = () => {
    setSelectedColumns(allColumns.map(col => col.key));
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  if (loading) return <div style={styles.loading}>Loading data...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>DSR Honda Report</h1>
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search across all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button 
            style={styles.columnButton} 
            onClick={() => setShowColumnSelector(!showColumnSelector)}
          >
            Select Columns
          </button>
          <button style={styles.exportButton} onClick={exportToExcel}>
            Export to Excel
          </button>
          {error && (
            <button style={styles.retryButton} onClick={retryFetch}>
              Retry
            </button>
          )}
        </div>
      </div>
      
      {showColumnSelector && (
        <div style={styles.columnSelector}>
          <h3>Select Columns to Display</h3>
          <div style={styles.columnSelectorButtons}>
            <button style={styles.smallButton} onClick={selectAllColumns}>
              Select All
            </button>
            <button style={styles.smallButton} onClick={deselectAllColumns}>
              Deselect All
            </button>
          </div>
          <div style={styles.columnList}>
            {allColumns.map(column => (
              <label key={column.key} style={styles.columnCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column.key)}
                  onChange={() => toggleColumn(column.key)}
                />
                {column.name}
              </label>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <div style={styles.error}>
          {error}
          <button 
            onClick={() => setError(null)} 
            style={styles.dismissButton}
          >
            Dismiss
          </button>
        </div>
      )}

      <div style={styles.tableContainer}>
        {filteredData.length === 0 && !loading ? (
          <div style={styles.noData}>
            No data found {searchTerm ? 'matching your search' : ''}
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={styles.clearSearchButton}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={styles.resultsInfo}>
              Showing {filteredData.length} of {data.length} records
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  {allColumns
                    .filter(column => selectedColumns.includes(column.key))
                    .map(column => (
                      <th 
                        key={column.key} 
                        style={styles.cell} 
                        onClick={() => handleSort(column.key)}
                        title={`Sort by ${column.name}`}
                      >
                        {column.name}
                        {sortConfig.key === column.key && (
                          <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                        )}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    {allColumns
                      .filter(column => selectedColumns.includes(column.key))
                      .map(column => (
                        <td key={column.key} style={styles.cell}>
                          {row[column.key] || 'N/A'}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#fff',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#e6f2ff',
    borderRadius: '5px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  title: {
    color: '#1e3a8a',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  searchInput: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '200px',
  },
  columnButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  exportButton: {
    padding: '8px 16px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  retryButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  columnSelector: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '5px',
  },
  columnSelectorButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  smallButton: {
    padding: '5px 10px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  columnList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
  },
  columnCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '14px',
  },
  tableContainer: {
    overflowX: 'auto',
    border: '1px solid #d9d9d9',
    borderRadius: '5px',
    marginTop: '20px',
    position: 'relative',
  },
  resultsInfo: {
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #d9d9d9',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  headerRow: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  cell: {
    padding: '8px',
    border: '1px solid #d9d9d9',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  evenRow: {
    backgroundColor: '#f2f2f2',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
    color: 'red',
    backgroundColor: '#ffeeee',
    border: '1px solid #ffcccc',
    borderRadius: '5px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dismissButton: {
    padding: '5px 10px',
    backgroundColor: '#ffcccc',
    border: '1px solid #ff9999',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  clearSearchButton: {
    padding: '5px 10px',
    backgroundColor: '#e6f2ff',
    border: '1px solid #1e3a8a',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default DSRHondaReport;