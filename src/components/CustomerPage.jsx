import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabaseClient';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    vendorName: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    contactPerson: "",
    telephone: "",
    mobile: "",
    email: "",
    bankAccountNumber: "",
    beneficiaryAccountName: "",
    bankName: "",
    bankAddress: "",
    bankBranchState: "",
    bankBranchName: "",
    bankMicrCode: "",
    bankRtgsIfscCode: "",
    accountType: "",
    currency: "",
    panNumber: "",
    tanNumber: "",
    gstNumber: "",
    gstinDivision: "",
    hsnCode: "",
    vendorType: "",
    gstNotApplicableReason: "",
    msmeVendor: "",
    msmeCertificationDate: "",
    msmeRegNo: "",
    declaration: false
  });

  // Fetch customers from Supabase
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('vendorName', { ascending: true });

      if (error) throw error;
      
      setCustomers(data || []);
      setFilteredCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries on component mount
  useEffect(() => {
    fetchCustomers();
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.country) {
      fetchStates(formData.country);
    }
  }, [formData.country]);

  // Handle search functionality
  useEffect(() => {
    const filtered = customers.filter(customer => 
      customer.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const sortedCountries = data
        .map(country => country.name.common)
        .sort();
      setCountries(sortedCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (country) => {
    // This is a simplified example - in a real app, you'd need a proper API for states
    try {
      // This would be replaced with an actual API call
      const sampleStates = [
        "State 1", "State 2", "State 3", "State 4", "State 5"
      ];
      setStates(sampleStates);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddNew = () => {
    setFormData({
      vendorName: "",
      country: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      contactPerson: "",
      telephone: "",
      mobile: "",
      email: "",
      bankAccountNumber: "",
      beneficiaryAccountName: "",
      bankName: "",
      bankAddress: "",
      bankBranchState: "",
      bankBranchName: "",
      bankMicrCode: "",
      bankRtgsIfscCode: "",
      accountType: "",
      currency: "",
      panNumber: "",
      tanNumber: "",
      gstNumber: "",
      gstinDivision: "",
      hsnCode: "",
      vendorType: "",
      gstNotApplicableReason: "",
      msmeVendor: "",
      msmeCertificationDate: "",
      msmeRegNo: "",
      declaration: false
    });
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        const { error } = await supabase
          .from('vendors')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Refresh the customer list
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting vendor:", error);
        setError(error.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        // Update existing vendor
        const { data, error } = await supabase
          .from('vendors')
          .update(formData)
          .eq('id', editingCustomer.id)
          .select();

        if (error) throw error;
      } else {
        // Insert new vendor
        const { data, error } = await supabase
          .from('vendors')
          .insert([formData])
          .select();

        if (error) throw error;
      }
      
      // Reset form and close modal
      setFormData({
        vendorName: "",
        country: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        contactPerson: "",
        telephone: "",
        mobile: "",
        email: "",
        bankAccountNumber: "",
        beneficiaryAccountName: "",
        bankName: "",
        bankAddress: "",
        bankBranchState: "",
        bankBranchName: "",
        bankMicrCode: "",
        bankRtgsIfscCode: "",
        accountType: "",
        currency: "",
        panNumber: "",
        tanNumber: "",
        gstNumber: "",
        gstinDivision: "",
        hsnCode: "",
        vendorType: "",
        gstNotApplicableReason: "",
        msmeVendor: "",
        msmeCertificationDate: "",
        msmeRegNo: "",
        declaration: false
      });
      
      setShowModal(false);
      setEditingCustomer(null);
      
      // Refresh the customer list
      fetchCustomers();
    } catch (error) {
      console.error("Error saving vendor:", error);
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading vendors...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="customer-management">
      <div className="page-header">
        <h1>Vendor Management</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>
          Add New Vendor
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search vendors by name, email, or contact person..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.vendorName}</td>
                  <td>{customer.contactPerson}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.city}</td>
                  <td>{customer.country}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No vendors found. {searchTerm ? "Try a different search." : "Add a new vendor to get started."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <h2>{editingCustomer ? "Edit Vendor" : "Add New Vendor"}</h2>
            <form onSubmit={handleSave} className="vendor-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vendor Name *</label>
                    <input 
                      name="vendorName" 
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      placeholder="Vendor Name" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <select 
                      name="country" 
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Address Line 1 *</label>
                  <input 
                    name="address1" 
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="Address Line 1" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Address Line 2</label>
                  <input 
                    name="address2" 
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Address Line 2" 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <select 
                      name="state" 
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Postal Code *</label>
                    <input 
                      name="postalCode" 
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code" 
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Person *</label>
                    <input 
                      name="contactPerson" 
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Contact Person" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Telephone (with STD Code)</label>
                    <input 
                      name="telephone" 
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="Telephone" 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input 
                      name="mobile" 
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Mobile Number" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      name="email" 
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address" 
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Bank Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Account Number *</label>
                    <input 
                      name="bankAccountNumber" 
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      placeholder="Bank Account Number" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Beneficiary Account Name *</label>
                    <input 
                      name="beneficiaryAccountName" 
                      value={formData.beneficiaryAccountName}
                      onChange={handleInputChange}
                      placeholder="Beneficiary Account Name" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Name *</label>
                    <input 
                      name="bankName" 
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Bank Name" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Bank Branch Name *</label>
                    <input 
                      name="bankBranchName" 
                      value={formData.bankBranchName}
                      onChange={handleInputChange}
                      placeholder="Bank Branch Name" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Bank Address *</label>
                  <input 
                    name="bankAddress" 
                    value={formData.bankAddress}
                    onChange={handleInputChange}
                    placeholder="Bank Address" 
                    required 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Branch State *</label>
                    <input 
                      name="bankBranchState" 
                      value={formData.bankBranchState}
                      onChange={handleInputChange}
                      placeholder="Bank Branch State" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Bank MICR Code</label>
                    <input 
                      name="bankMicrCode" 
                      value={formData.bankMicrCode}
                      onChange={handleInputChange}
                      placeholder="Bank MICR Code" 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank RTGS/IFSC Code *</label>
                    <input 
                      name="bankRtgsIfscCode" 
                      value={formData.bankRtgsIfscCode}
                      onChange={handleInputChange}
                      placeholder="Bank RTGS/IFSC Code" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Type *</label>
                    <select 
                      name="accountType" 
                      value={formData.accountType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Account Type</option>
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Currency *</label>
                    <select 
                      name="currency" 
                      value={formData.currency}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Currency</option>
                      <option value="INR">Indian Rupee (INR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Tax Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>PAN Number *</label>
                    <input 
                      name="panNumber" 
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="PAN Number" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>TAN Number</label>
                    <input 
                      name="tanNumber" 
                      value={formData.tanNumber}
                      onChange={handleInputChange}
                      placeholder="TAN Number" 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>GST Number</label>
                    <input 
                      name="gstNumber" 
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      placeholder="GST Number" 
                    />
                  </div>
                  <div className="form-group">
                    <label>GSTIN Division/Ward/Circle/Sector Number</label>
                    <input 
                      name="gstinDivision" 
                      value={formData.gstinDivision}
                      onChange={handleInputChange}
                      placeholder="GSTIN Division/Ward/Circle/Sector Number" 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>HSN Code *</label>
                  <input 
                    name="hsnCode" 
                    value={formData.hsnCode}
                    onChange={handleInputChange}
                    placeholder="HSN Code" 
                    required 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Vendor Type *</label>
                    <select 
                      name="vendorType" 
                      value={formData.vendorType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Vendor Type</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="trader">Trader</option>
                      <option value="consultant">Consultant</option>
                      <option value="serviceProvider">Service Provider</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>If GSTIN not applicable, reason for the same</label>
                    <input 
                      name="gstNotApplicableReason" 
                      value={formData.gstNotApplicableReason}
                      onChange={handleInputChange}
                      placeholder="Reason for GSTIN not applicable" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>MSME Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>MSME Vendor (small/micro, excluding trader)</label>
                    <select 
                      name="msmeVendor" 
                      value={formData.msmeVendor}
                      onChange={handleInputChange}
                    >
                      <option value="">Select MSME Status</option>
                      <option value="small">Small</option>
                      <option value="micro">Micro</option>
                      <option value="notApplicable">Not Applicable</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>MSME Certification Date</label>
                    <input 
                      name="msmeCertificationDate" 
                      type="date"
                      value={formData.msmeCertificationDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>MSME Registration Number</label>
                  <input 
                    name="msmeRegNo" 
                    value={formData.msmeRegNo}
                    onChange={handleInputChange}
                    placeholder="MSME Registration Number" 
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h3>Declaration</h3>
                <div className="form-group declaration-checkbox">
                  <label>
                    <input 
                      name="declaration" 
                      type="checkbox"
                      checked={formData.declaration}
                      onChange={handleInputChange}
                      required
                    />
                    We hereby certify that above mentioned details are correct. We further confirm that the said details can be used by Seal Freight Forwarders Pvt. Ltd. for online remittance of funds. The responsibility of any delay in payment and additional processing charges due to incorrect details vest with us.
                  </label>
                </div>
                
                <div className="notes">
                  <p><strong>Note:</strong></p>
                  <ol>
                    <li>Please provide Soft Copy (Excel & PDF (With Sign and seal) Both format).</li>
                    <li>Please provide PAN Scan PDF Copy.</li>
                    <li>Cancelled Cheque PDF Copy.</li>
                    <li>GST Registration PDF Copy.</li>
                    <li>SSI/ MSMED Certificate PDF Copy if applicable.</li>
                  </ol>
                </div>
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
                  {editingCustomer ? "Update Vendor" : "Save Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .customer-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  color: #2c3e50; /* Dark blue-gray for good contrast */
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.customers-table-container {
  overflow-x: auto;
}

.customers-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.customers-table th,
.customers-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.customers-table th {
  background-color: #f8f9fa;
  color: #2c3e50; /* Dark text for contrast */
  font-weight: 600;
}

.customers-table tr:hover {
  background-color: #f5f5f5;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0069d9;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #007bff;
  color: #007bff;
}

.btn-outline:hover {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.large-modal {
  max-width: 800px;
}

.modal h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
}

.vendor-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f9fa;
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #007bff;
  font-size: 18px;
  font-weight: 600;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.25);
}

.declaration-checkbox label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-weight: normal;
  color: #495057;
}

.declaration-checkbox input[type="checkbox"] {
  width: auto;
  margin-top: 4px;
}

.notes {
  background-color: #e8f4ff;
  border-left: 4px solid #007bff;
  padding: 12px 16px;
  margin-top: 16px;
  border-radius: 4px;
}

.notes p {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-weight: 500;
}

.notes ol {
  margin: 0;
  padding-left: 20px;
  color: #495057;
}

.notes li {
  margin-bottom: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.loading {
  color: #6c757d;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .large-modal {
    max-width: 95%;
  }
  
  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .modal {
    padding: 16px;
  }
}
      `}</style>
    </div>
  );
};

export default CustomerPage;