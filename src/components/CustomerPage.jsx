import React, { useState } from "react";

const CustomerPage = () => {
  const initialCustomers = [
    {
      id: 1,
      companyName: "Acme Corp",
      contactPerson: "Sarah Johnson",
      email: "sarah.johnson@acmecorp.com",
      phone: "555-123-4567",
      status: "active",
      lastInteraction: "2023-11-15",
      image: "https://placehold.co/40x40/3B82F6/FFFFFF?text=A",
    },
    {
      id: 2,
      companyName: "Global Imports",
      contactPerson: "David Lee",
      email: "david.lee@globalimports.com",
      phone: "555-987-6543",
      status: "inactive",
      lastInteraction: "2023-11-10",
      image: "https://placehold.co/40x40/3B82F6/FFFFFF?text=G",
    },
    {
      id: 3,
      companyName: "Tech Solutions Inc",
      contactPerson: "Michael Chen",
      email: "michael@techsolutions.com",
      phone: "555-456-7890",
      status: "active",
      lastInteraction: "2023-11-18",
      image: "https://placehold.co/40x40/3B82F6/FFFFFF?text=T",
    },
    {
      id: 4,
      companyName: "North Industries",
      contactPerson: "Jennifer Wilson",
      email: "jennifer@northind.com",
      phone: "555-234-5678",
      status: "active",
      lastInteraction: "2023-11-12",
      image: "https://placehold.co/40x40/3B82F6/FFFFFF?text=N",
    },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCustomer = {
      id: editingCustomer ? editingCustomer.id : Date.now(),
      companyName: formData.get("companyName"),
      contactPerson: formData.get("contactPerson"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
      lastInteraction: new Date().toISOString().split("T")[0],
      image: editingCustomer?.image || `https://placehold.co/40x40/3B82F6/FFFFFF?text=${formData.get("companyName").charAt(0)}`,
    };

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? newCustomer : c))
      );
    } else {
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleDelete = () => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
    setShowDeleteModal(false);
  };

  return (
    <div className="customer-management">
      {/* Header */}
      <header className="customer-header">
        <h1>Customer Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          + Add Customer
        </button>
      </header>

      {/* Search */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs">
        {["all", "active", "inactive"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`tab ${filter === f ? 'active' : ''}`}
          >
            {f === "all" ? "All Customers" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="customer-table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th>Last Interaction</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="customer-info">
                      <img src={c.image} alt={c.companyName} />
                      <div>
                        <div className="company-name">{c.companyName}</div>
                        <div className="contact-person">{c.contactPerson}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{c.email}</div>
                    <div className="phone">{c.phone}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${c.status}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{c.lastInteraction}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingCustomer(c);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          setCustomerToDelete(c);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <input 
                  name="companyName" 
                  defaultValue={editingCustomer?.companyName} 
                  placeholder="Company Name" 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  name="contactPerson" 
                  defaultValue={editingCustomer?.contactPerson} 
                  placeholder="Contact Person" 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  name="email" 
                  type="email" 
                  defaultValue={editingCustomer?.email} 
                  placeholder="Email" 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  name="phone" 
                  defaultValue={editingCustomer?.phone} 
                  placeholder="Phone" 
                  required 
                />
              </div>
              <div className="form-group">
                <select name="status" defaultValue={editingCustomer?.status || "active"}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => { setShowModal(false); setEditingCustomer(null); }} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete {customerToDelete?.companyName}?</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* CSS Variables */
        :root {
          --primary-color: #3b82f6;
          --primary-hover: #2563eb;
          --secondary-color: #f3f4f6;
          --secondary-hover: #e5e7eb;
          --background-color: #f9fafb;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --danger-color: #ef4444;
          --danger-hover: #dc2626;
          --success-color: #10b981;
          --border-color: #e5e7eb;
          --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* Base Styles */
        .customer-management {
          padding: 24px;
          background-color: var(--background-color);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: var(--text-primary);
        }

        /* Header */
        .customer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .customer-header h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary);
        }

        /* Buttons */
        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-hover);
        }

        .btn-secondary {
          background-color: var(--secondary-color);
          color: var(--text-primary);
        }

        .btn-secondary:hover {
          background-color: var(--secondary-hover);
        }

        .btn-danger {
          background-color: var(--danger-color);
          color: white;
        }

        .btn-danger:hover {
          background-color: var(--danger-hover);
        }

        /* Search */
        .search-container {
          margin-bottom: 24px;
        }

        .search-input-wrapper {
          position: relative;
          max-width: 400px;
        }

        .search-input-wrapper input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 14px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        /* Tabs */
        .filter-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
        }

        .tab {
          padding: 12px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: var(--primary-color);
        }

        .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }

        /* Table */
        .customer-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .customer-table {
          width: 100%;
          border-collapse: collapse;
        }

        .customer-table th {
          background-color: #f9fafb;
          padding: 12px 16px;
          text-align: left;
          font-weight: 500;
          font-size: 14px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .customer-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .customer-table tr:last-child td {
          border-bottom: none;
        }

        .customer-table tr:hover {
          background-color: #f9fafb;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .customer-info img {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          object-fit: cover;
        }

        .company-name {
          font-weight: 500;
        }

        .contact-person, .phone {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.active {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-badge.inactive {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .btn-edit, .btn-delete {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .btn-edit {
          color: var(--primary-color);
        }

        .btn-delete {
          color: var(--danger-color);
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 8px;
          padding: 24px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .modal h2 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group input, .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .customer-management {
            padding: 16px;
          }
          
          .customer-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 8px;
          }
          
          .customer-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .customer-info img {
            display: none;
          }
          
          .customer-table th:nth-child(3),
          .customer-table td:nth-child(3) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerPage;