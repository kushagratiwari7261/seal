// src/components/NewShipments.jsx
import { useState } from 'react';
import './NewShipments.css';

const NewShipments = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [shipmentType, setShipmentType] = useState('FCL EXPORT');
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [amount, setAmount] = useState("27.22");
  
  const [formData, setFormData] = useState({
    branch: 'CHENNAI (MAA)',
    department: 'FCL EXPORT',
    shipmentDate: '2019-06-11',
    client: 'AMAZON PVT LMD',
    shipper: 'AMAZON PVT LMD',
    consignee: 'FRESA TECHNOLOGIES FZE',
    address: 'PRIMARY, OFFICE, SHIPPING/',
    por: 'INMAA-CHENNAI (EX',
    poi: 'INMAA-CHENNAI (EX',
    pod: 'AEDXB-DUBAI/UNITED ARAB',
    pof: 'AEDXB-DUBAI/UNITED ARAB',
    hblNo: '43544489644',
    etd: '2019-06-11T08:13',
    eta: '2019-06-30T08:13',
    incoterms: 'Cost and Freight-(CFR)',
    serviceType: 'FCL',
    freight: 'Prepaid',
    payableAt: 'CHENNAI (EX MADRAS)',
    dispatchAt: 'CHENNAI (EX MADRAS)',
    
    // Step 3 fields
    salesperson: '',
    vesselName: '',
    packType: '',
    unit1: '',
    unit2: '',
    unit3: '',
    commodityDescription: '',
    customsService: '',
    voyageNo: '',
    originAgent: '',
    deliveryAgent: '',
    chargeableUnit: '',
    remarks: '',
    
    // Additional fields for summary
    HSCode: '',
    pol: 'CHENNAI (EX MADRAS), INDIA',
    pdf: 'DUBAI, UAE',
    carrier: 'SEAWAYS SHIPPING AND LOGISTICS LIMITED',
    vesselNameSummary: 'TIGER SEA / 774',
    noOfRes: '$000',
    volume: '$000',
    grossWeight: '$00000',
    description: 'A PACK OF FURNITURES'
  });

  const [orgFormData, setOrgFormData] = useState({
    name: 'KRYTON LOGISTICS',
    recordStatus: 'Active',
    salesPerson: '',
    category: 'AGENT',
    branch: 'CHENNAI',
    contactPerson: 'ARUNA',
    doorNo: '',
    buildingName: '',
    street: '',
    area: '',
    city: '',
    state: ''
  });

  const steps = [
    'Create Shipment',
    'Port Details',
    'Planned / Consignment',
    'Charge Details',
    'Summary'
  ];

  const shipmentTypes = [
    'AIR FREIGHT EXPORT',
    'AIR FREIGHT IMPORT',
    'FCL EXPORT',
    'FCL IMPORT',
    'LCL EXPORT',
    'LCL IMPORT',
    'PROJECT LOGISTICS',
    'SERVICE JOB / M-JOB',
    'WAREHOUSE',
    'WMS GDN',
    'WMS GRN'
  ];

  const categories = [
    'AGENT', 'ARLINE', 'BANK', 'BIKE', 'BIOKER', 'BUYER', 
    'CAREER', 'CAREER AGENT'
  ];

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCancel = () => {
    setActiveStep(1);
    setShipmentType('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrgInputChange = (e) => {
    const { name, value } = e.target;
    setOrgFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShipmentTypeSelect = (type) => {
    setShipmentType(type);
    // Auto-proceed to next step after selection
    setTimeout(() => handleNext(), 300);
  };

  const handleCreateOrganization = () => {
    // Here you would typically save the organization to your backend
    // For now, we'll just set the client field to the new organization name
    setFormData(prev => ({
      ...prev,
      client: orgFormData.name
    }));
    
    // Close the modal
    setShowOrgModal(false);
  };

  return (
    <div className="new-shipment-container">
      <div className="new-shipment-card">
        <div className="new-shipment-header">
          <h1>Create Shipment</h1>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`step ${index + 1 === activeStep ? 'active' : ''} ${index + 1 < activeStep ? 'completed' : ''}`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          ))}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {activeStep === 1 && (
            <div className="shipment-type-selection">
              <h2>What type of Shipment would you like to create?</h2>
              <div className="shipment-type-grid">
                {shipmentTypes.map((type, index) => (
                  <div 
                    key={index} 
                    className={`shipment-type-card ${shipmentType === type ? 'selected' : ''}`}
                    onClick={() => handleShipmentTypeSelect(type)}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="port-details-form">
              <h2>Port Details</h2>
              <div className="form-grid-two-column">
                <div className="form-group">
                  <label>Branch</label>
                  <input 
                    type="text" 
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input 
                    type="text" 
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Shipment Date</label>
                  <input 
                    type="date" 
                    name="shipmentDate"
                    value={formData.shipmentDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group with-button">
                  <label>Client</label>
                  <div className="input-with-button">
                    <input 
                      type="text" 
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                    />
                    <button 
                      className="add-button"
                      onClick={() => setShowOrgModal(true)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Shipper</label>
                  <input 
                    type="text" 
                    name="shipper"
                    value={formData.shipper}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Consignee</label>
                  <input 
                    type="text" 
                    name="consignee"
                    value={formData.consignee}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>POR</label>
                  <input 
                    type="text" 
                    name="por"
                    value={formData.por}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>POL</label>
                  <input 
                    type="text" 
                    name="pol"
                    value={formData.pol}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>POD</label>
                  <input 
                    type="text" 
                    name="pod"
                    value={formData.pod}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>POF</label>
                  <input 
                    type="text" 
                    name="pof"
                    value={formData.pof}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>HBL No.</label>
                  <input 
                    type="text" 
                    name="hblNo"
                    value={formData.hblNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>ETD</label>
                  <input 
                    type="datetime-local" 
                    name="etd"
                    value={formData.etd}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>ETA</label>
                  <input 
                    type="datetime-local" 
                    name="eta"
                    value={formData.eta}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>INCOTERMS</label>
                  <input 
                    type="text" 
                    name="incoterms"
                    value={formData.incoterms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Service Type</label>
                  <input 
                    type="text" 
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Freight</label>
                  <input 
                    type="text" 
                    name="freight"
                    value={formData.freight}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Payable At</label>
                  <input 
                    type="text" 
                    name="payableAt"
                    value={formData.payableAt}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Dispatch At</label>
                  <input 
                    type="text" 
                    name="dispatchAt"
                    value={formData.dispatchAt}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="client-os-info">
                Client O/S: Credit Term: CASH | Total O/S: 46000 | Over Due O/S: 46000
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="planned-consignment">
              <h2>Planned / Consignment</h2>
              <div className="form-grid-two-column">
                <div className="form-group">
                  <label>Department</label>
                  <input 
                    type="text" 
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Salesperson</label>
                  <input 
                    type="text" 
                    name="salesperson"
                    value={formData.salesperson || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>HS Code</label>
                  <input 
                    type="text" 
                    name="HSCode"
                    value={formData.HSCode || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Vessel Name</label>
                  <input 
                    type="text" 
                    name="vesselName"
                    value={formData.vesselName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Pack Type</label>
                  <input 
                    type="text" 
                    name="packType"
                    value={formData.packType || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Unit</label>
                  <input 
                    type="text" 
                    name="unit1"
                    value={formData.unit1 || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Unit</label>
                  <input 
                    type="text" 
                    name="unit2"
                    value={formData.unit2 || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Unit</label>
                  <input 
                    type="text" 
                    name="unit3"
                    value={formData.unit3 || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Commodity Description</label>
                  <input 
                    type="text" 
                    name="commodityDescription"
                    value={formData.commodityDescription || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Customs Service</label>
                  <select 
                    name="customsService"
                    value={formData.customsService || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select-</option>
                    {/* Add your customs service options here */}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Voyage No</label>
                  <input 
                    type="text" 
                    name="voyageNo"
                    value={formData.voyageNo || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Origin Agent</label>
                  <select 
                    name="originAgent"
                    value={formData.originAgent || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select-</option>
                    {/* Add your origin agent options here */}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Delivery Agent</label>
                  <select 
                    name="deliveryAgent"
                    value={formData.deliveryAgent || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select-</option>
                    {/* Add your delivery agent options here */}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Chargeable Unit</label>
                  <input 
                    type="text" 
                    name="chargeableUnit"
                    value={formData.chargeableUnit || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Remarks</label>
                  <textarea 
                    name="remarks"
                    value={formData.remarks || ''}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeStep === 4 && (
            <div className="summary-step">
              <h2>Summary</h2>
              
              <div className="client-amount-summary">
                <div className="summary-row">
                  <span className="summary-label">Client</span>
                  <span className="summary-value">{formData.client}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Amount</span>
                  <input
                    type="number"
                    className="editable-amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="charges-table-container">
                <h3>Standard Charges</h3>
                <table className="charges-table">
                  <thead>
                    <tr>
                      <th>Charge Description</th>
                      <th>OFD Type</th>
                      <th>Unit</th>
                      <th>Qty</th>
                      <th>Freight</th>
                      <th>Currency</th>
                      <th>Sale</th>
                      <th>Tax Group</th>
                      <th>Tax Amount</th>
                      <th>Amount (USD)</th>
                      <th>Sale Remarks</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>DOCUMENTATION CHARGES</td>
                      <td>N/A</td>
                      <td>PER DOCUMENT</td>
                      <td>1</td>
                      <td>{formData.freight}</td>
                      <td>AED</td>
                      <td>1 x 100 x .272236</td>
                      <td></td>
                      <td>0.00</td>
                      <td>{amount}</td>
                      <td></td>
                      <td>{formData.remarks}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="sale-note">
                  Sale - (Qty x Amount Per Unit x Ex.Rate)
                </div>
              </div>

              {/* Checkbox Section */}
              <div className="confirmation-checkboxes">
                <div className="checkbox-item">
                  <input type="checkbox" id="confirm1" />
                  <label htmlFor="confirm1">I confirm the accuracy of all information</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="confirm2" />
                  <label htmlFor="confirm2">I agree to the terms and conditions</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="confirm3" />
                  <label htmlFor="confirm3">I authorize this shipment</label>
                </div>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="summary-step">
              <h2>Summary</h2>
              
              <div className="client-branch-section">
                <div className="client-info">
                  <span className="label">Client</span>
                  <span className="value">{formData.client}</span>
                </div>
                <div className="branch-info">
                  <span className="label">Branch</span>
                  <span className="value">{formData.branch}</span>
                </div>
                <div className="department-info">
                  <span className="label">Department</span>
                  <span className="value">{formData.department}</span>
                </div>
              </div>

              <div className="shipper-section">
                <span className="label">Shipper</span>
                <span className="value">{formData.shipper}</span>
              </div>

              <div className="divider"></div>

              <div className="booking-info-section">
                <h3>Booking Info</h3>
                <div className="booking-info-grid">
                  <div className="booking-info-row">
                    <span className="label">POR:</span>
                    <span className="value">{formData.por}</span>
                    <span className="label">POL:</span>
                    <span className="value">{formData.pol}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">POD:</span>
                    <span className="value">{formData.pod}</span>
                    <span className="label">PDF:</span>
                    <span className="value">{formData.pof}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">Carrier:</span>
                    <span className="value">{formData.carrier}</span>
                    <span className="label">Vessel Name:</span>
                    <span className="value">{formData.vesselNameSummary}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">No of Res.:</span>
                    <span className="value">{formData.noOfRes}</span>
                    <span className="label">Volume:</span>
                    <span className="value">{formData.volume}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">Shipment Date:</span>
                    <span className="value">{formData.shipmentDate}</span>
                    <span className="label">INCO Terms:</span>
                    <span className="value">{formData.incoterms}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">ETD:</span>
                    <span className="value">{formData.etd}</span>
                    <span className="label">ETA:</span>
                    <span className="value">{formData.eta}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">Freight:</span>
                    <span className="value">{formData.freight}</span>
                    <span className="label">Gross Weight:</span>
                    <span className="value">{formData.grossWeight}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">Description:</span>
                    <span className="value full-width">{formData.description}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">Remarks:</span>
                    <span className="value full-width">{formData.remarks}</span>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="charges-section">
                <h3>Charge</h3>
                <table className="charges-table">
                  <thead>
                    <tr>
                      <th>Charge Description</th>
                      <th>OFD Type</th>
                      <th>Unit</th>
                      <th>Freight</th>
                      <th>Dr/Cr</th>
                      <th>Currency</th>
                      <th>Sale</th>
                      <th>Tax Group</th>
                      <th>Tax Amount</th>
                      <th>Amount (USD)</th>
                      <th>Sale Remarks</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>DOCUMENTATION CHARGES</td>
                      <td>N/A</td>
                      <td>PER DOCUMENT</td>
                      <td>{formData.freight}</td>
                      <td>Cr</td>
                      <td>AED</td>
                      <td>1 x 100 x 272236</td>
                      <td></td>
                      <td>0.00</td>
                      <td>{amount}</td>
                      <td></td>
                      <td>{formData.remarks}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="sale-note">
                  Sale - (Qty x Amount Per Unit x Ex.Rate)
                </div>
              </div>

              <div className="confirmation-prompt">
                <p>Are you sure you want to create the shipment?</p>
                <div className="confirmation-buttons">
                  <button className="cancel-btn">Cancel</button>
                  <button className="confirm-btn">OK</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button className="cancel-button" onClick={handleCancel}>
            X Cancel
          </button>
          <div className="step-buttons">
            {activeStep > 1 && (
              <button className="back-button" onClick={handleBack}>
                Previous
              </button>
            )}
            {activeStep < steps.length && (
              <button className="next-button" onClick={handleNext}>
                Next
              </button>
            )}
            {activeStep === steps.length && (
              <button className="confirm-button">
                Confirm & Create Shipment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Organization Creation Modal */}
      {showOrgModal && (
        <div className="modal-overlay">
          <div className="modal-content org-modal">
            <div className="modal-header">
              <h2>Create Organization</h2>
              <button 
                className="close-button"
                onClick={() => setShowOrgModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body org-modal-body">
              <div className="org-form-container">
                <div className="org-form-grid">
                  <div className="org-form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={orgFormData.name}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>Record Status</label>
                    <select 
                      name="recordStatus"
                      value={orgFormData.recordStatus}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="org-form-group">
                    <label>Sales person</label>
                    <input 
                      type="text" 
                      name="salesPerson"
                      value={orgFormData.salesPerson}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>Category List</label>
                    <select 
                      name="category"
                      value={orgFormData.category}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    >
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="org-form-group">
                    <label>Branch</label>
                    <input 
                      type="text" 
                      name="branch"
                      value={orgFormData.branch}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>Contact Person</label>
                    <input 
                      type="text" 
                      name="contactPerson"
                      value={orgFormData.contactPerson}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>Door No</label>
                    <input 
                      type="text" 
                      name="doorNo"
                      value={orgFormData.doorNo}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>Building Name</label>
                    <input 
                      type="text" 
                      name="buildingName"
                      value={orgFormData.buildingName}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>Street</label>
                    <input 
                      type="text" 
                      name="street"
                      value={orgFormData.street}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>Area</label>
                    <input 
                      type="text" 
                      name="area"
                      value={orgFormData.area}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={orgFormData.city}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                  
                  <div className="org-form-group">
                    <label>State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={orgFormData.state}
                      onChange={handleOrgInputChange}
                      className="transparent-input"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer org-modal-footer">
              <button 
                className="org-cancel-button"
                onClick={() => setShowOrgModal(false)}
              >
                Cancel
              </button>
              <button 
                className="org-confirm-button"
                onClick={handleCreateOrganization}
              >
                Create Organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewShipments;