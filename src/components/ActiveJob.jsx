// src/components/ActiveJob.jsx
import './ActivityTable.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const ActiveJob = ({ activities }) => {
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('auto');

  const handleAddJob = () => {
    navigate('/job-orders'); // ✅ redirect to job creation page
  };

  // Sample job data
  const sampleJobs = [
    {
      jobNo: "CMAASE190318",
      client: "FRESA DEMO DUBAI LLC",
      pol: "INMAA",
      pod: "AEDXB",
      edt: "2024-08-30",
      eta: "2024-09-05"
    },
    {
      jobNo: "CMAASE190157",
      client: "AMAZON PVT LMD",
      pol: "INMAA",
      pod: "AEDXB",
      edt: "2024-08-28",
      eta: "2024-09-02"
    }
  ];

  // Merge real jobs with sample ones
  const displayJobs = [...sampleJobs, ...(activities || [])];

  // Adjust max height
  useEffect(() => {
    if (tableContainerRef.current) {
      const tableHeight = tableContainerRef.current.scrollHeight;
      const calculatedMaxHeight = Math.min(tableHeight, 400); // 400px max height
      setMaxHeight(`${calculatedMaxHeight}px`);
    }
  }, [displayJobs]);

  return (
    <div className="card expandable-card">
      <div className="table-header">
        <h2>Current Active Jobs</h2>
        <button className="add-shipment-btn" onClick={handleAddJob}>
          <span className="plus-icon">+</span>
          Add Job
        </button>
      </div>
      <div
        className="table-container"
        ref={tableContainerRef}
        style={{ maxHeight: maxHeight, overflowY: 'auto' }}
      >
        <table className="activity-table">
          <thead>
            <tr>
              <th>Job No.</th>
              <th>Client</th>
              <th>POL</th>
              <th>POD</th>
              <th>EDT</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {displayJobs.map((job, index) => (
              <tr key={index}>
                <td>{job.jobNo}</td>
                <td>{job.client}</td>
                <td>{job.pol}</td>
                <td>{job.pod}</td>
                <td>{job.edt}</td>
                <td>{job.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveJob;
