// src/components/NewShipments.jsx
import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './NewShipments.css';

const NewShipments = () => {
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [shipmentType, setShipmentType] = useState('');
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [amount, setAmount] = useState("27.22");
  const [validationErrors, setValidationErrors] = useState({});
  const tableContainerRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('auto');
  
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
    
    // Additional fields for summary
    HSCode: '',
    pol: 'CHENNAI (EX MADRAS), INDIA',
    pdf: 'DUBAI, UAE',
    carrier: 'SEAWAYS SHIPPING AND LOGISTICS LIMITED',
    vesselNameSummary: 'TIGER SEA / 774',
    noOfRes: '$000',
    volume: '$000',
    grossWeight: '$00000',
    description: 'A PACK OF FURNITURES',
    remarks: '',
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

  // Sample shipment data
  const sampleShipments = [
    {
      hblNo: "CMAASE190318",
      client: "FRESA DEMO DUBAI LLC",
      pol: "INMAA",
      pod: "AEDXB",
      etd: "2024-08-30",
      eta: "2024-09-05"
    },
    {
      hblNo: "CMAASE190157",
      client: "AMAZON PVT LMD",
      pol: "INMAA",
      pod: "AEDXB",
      etd: "2024-08-28",
      eta: "2024-09-02"
    }
  ];

  const steps = [
    'Create Shipment',
    'Port Details',
    'Summary'
  ];

  const shipmentTypes = [
    'AIR FREIGHT',
    'SEA FREIGHT',
    'OTHERS',
    'LAND',
    'TRANSPORT',
  ];

  const categories = [
    'AGENT', 'ARLINE', 'BANK', 'BIKE', 'BIOKER', 'BUYER', 
    'CAREER', 'CAREER AGENT'
  ];

  // Define required fields for each step
  const requiredFields = {
    1: ['shipmentType'],
    2: ['branch', 'department', 'shipmentDate', 'client', 'shipper', 'consignee', 
        'por', 'pol', 'pod', 'pof', 'hblNo', 'etd', 'eta', 'incoterms', 
        'serviceType', 'freight', 'payableAt', 'dispatchAt'],
    3: [] // No required fields for summary
  };

  // Adjust max height
  useEffect(() => {
    if (tableContainerRef.current) {
      const tableHeight = tableContainerRef.current.scrollHeight;
      const calculatedMaxHeight = Math.min(tableHeight, 400); // 400px max height
      setMaxHeight(`${calculatedMaxHeight}px`);
    }
  }, [sampleShipments]);

  // Validate current step before proceeding
  const validateStep = (step) => {
    const errors = {};
    const fieldsToValidate = requiredFields[step];
    
    if (step === 1) {
      if (!shipmentType) {
        errors.shipmentType = 'Shipment type is required';
      }
    } else {
      fieldsToValidate.forEach(field => {
        if (!formData[field] || formData[field].toString().trim() === '') {
          errors[field] = `${field} is required`;
        }
      });
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length) {
        setActiveStep(activeStep + 1);
      }
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
    setShowShipmentForm(false);
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
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
    // Clear shipment type validation error if any
    if (validationErrors.shipmentType) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.shipmentType;
        return newErrors;
      });
    }
  };

  const handleCreateOrganization = () => {
    // Here you would typically save the organization to your backend
    // For now, we'll just set the client field to the new organization name
    setFormData(prev => ({
      ...prev,
      client: orgFormData.name
    }));
    
    // Clear any client validation error
    if (validationErrors.client) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.client;
        return newErrors;
      });
    }
    
    // Close the modal
    setShowOrgModal(false);
  };

  const handleConfirmShipment = () => {
    // Final validation before creating shipment
    if (validateStep(activeStep)) {
      // Handle form submission and then generate PDF
      generatePDF();
      // Close the form
      setShowShipmentForm(false);
      // Reset the form
      setActiveStep(1);
      setShipmentType('');
    }
  };

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    
    // Set font styles
    pdf.setFont('helvetica');
    
    // Header - Company Details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SEAL FREIGHT FORWARDERS PVT. LTD.', 20, 20);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('T-2, IIIrd Floor, H Block Market, LSC Plot No. 7, Manish Complex', 20, 27);
    pdf.text('Sarita Vihar, New Delhi-110076 INDIA', 20, 34);
    pdf.text('Mob: +91 8468811866, Tel: +91 022 27566678, 79', 20, 41);
    pdf.text('Email: info@seal.co.in, Website: www.sealfreight.com', 20, 48);
    
    // MTD Registration Number
    pdf.text('MTD Registration No.: MTD/DOS/566/JAN/2028', 20, 58);
    pdf.text('CN: U630130L1990PTC042315', 20, 65);
    
    // Title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MULTIMODAL TRANSPORT DOCUMENT', pageWidth/2, 80, { align: 'center' });
    
    let yPosition = 90;
    
    // Shipper Section
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Shipper:', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.shipper || 'N/A', 20, yPosition + 7);
    pdf.text(formData.address || 'N/A', 20, yPosition + 14);
    
    // Consignee Section
    pdf.setFont('helvetica', 'bold');
    pdf.text('Consignee (of order):', 110, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.consignee || 'N/A', 110, yPosition + 7);
    
    // Notify Party
    pdf.setFont('helvetica', 'bold');
    pdf.text('Notify Party:', 20, yPosition + 28);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.consignee || 'N/A', 20, yPosition + 35);
    
    yPosition += 50;
    
    // Plan of Acceptance
    pdf.setFont('helvetica', 'bold');
    pdf.text('Plan of Acceptance', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.por || 'N/A', 20, yPosition + 7);
    
    yPosition += 20;
    
    // Transport Details Table
    const tableHeaders = ['Vessel', 'Port of Loading', 'Port of Discharge', 'Port of Delivery', 'Modes / Means of Transport'];
    const tableData = [
      formData.vesselNameSummary || 'N/A',
      formData.pol || 'N/A',
      formData.pod || 'N/A',
      formData.pof || 'N/A',
      'SEA FREIGHT'
    ];
    
    const cellWidth = 35;
    const cellHeight = 10;
    
    // Draw table headers
    pdf.setFont('helvetica', 'bold');
    tableHeaders.forEach((header, index) => {
      const x = 20 + (index * cellWidth);
      pdf.rect(x, yPosition, cellWidth, cellHeight);
      const textLines = pdf.splitTextToSize(header, cellWidth - 2);
      pdf.text(textLines, x + 1, yPosition + 5);
    });
    
    yPosition += cellHeight;
    
    // Draw table data
    pdf.setFont('helvetica', 'normal');
    tableData.forEach((data, index) => {
      const x = 20 + (index * cellWidth);
      pdf.rect(x, yPosition, cellWidth, cellHeight);
      const textLines = pdf.splitTextToSize(data, cellWidth - 2);
      pdf.text(textLines, x + 1, yPosition + 5);
    });
    
    yPosition += cellHeight + 10;
    
    // Container Marks & Number
    pdf.setFont('helvetica', 'bold');
    pdf.text('Container Marks & Number No(s)', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.hblNo || 'N/A', 20, yPosition + 7);
    
    // Number of packages, kind of packages, general description of goods
    pdf.setFont('helvetica', 'bold');
    pdf.text('Number of packages, kind of packages, general description of goods', 70, yPosition);
    pdf.setFont('helvetica', 'normal');
    
    const descriptionText = formData.description || 'N/A';
    const descriptionLines = pdf.splitTextToSize(descriptionText, 80);
    pdf.text(descriptionLines, 70, yPosition + 7);
    
    // HS Code and other details
    pdf.text(`HS CODE: ${formData.HSCode || 'N/A'}`, 70, yPosition + 7 + (descriptionLines.length * 5) + 5);
    
    yPosition += 30;
    
    // Weight Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('GROSS WEIGHT', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${formData.grossWeight || 'N/A'} KGS`, 20, yPosition + 7);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('NET WEIGHT', 70, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${formData.grossWeight || 'N/A'} KGS`, 70, yPosition + 7);
    
    yPosition += 20;
    
    // Container Numbers
    pdf.setFont('helvetica', 'bold');
    pdf.text('Container No/Seal No', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text('CONTAINER_NUMBER_HERE', 20, yPosition + 7);
    
    yPosition += 15;
    
    // Freight Terms
    pdf.setFont('helvetica', 'bold');
    pdf.text('Freight Amount', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(amount || 'N/A', 20, yPosition + 7);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Freight Payable at:', 70, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.payableAt || 'N/A', 70, yPosition + 7);
    
    yPosition += 15;
    
    // Footer - Jurisdiction
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.text('Subject to Delhi Jurisdiction', 20, yPosition);
    
    // Save the PDF
    pdf.save(`MTD_${formData.hblNo || 'Document'}.pdf`);
  };

  return (
    <div className="new-shipment-container">
      {/* Shipment List View */}
      <div className="card expandable-card">
        <div className="table-header">
          <h2>Current Shipments</h2>
          <button className="add-shipment-btn" onClick={() => setShowShipmentForm(true)}>
            <span className="plus-icon">+</span>
            Add Shipment
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
                <th>HBL No.</th>
                <th>Client</th>
                <th>POL</th>
                <th>POD</th>
                <th>ETD</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {sampleShipments.map((shipment, index) => (
                <tr key={index}>
                  <td>{shipment.hblNo}</td>
                  <td>{shipment.client}</td>
                  <td>{shipment.pol}</td>
                  <td>{shipment.pod}</td>
                  <td>{shipment.etd}</td>
                  <td>{shipment.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Creation Form Modal */}
      {showShipmentForm && (
        <div className="modal-overlay">
          <div className="modal-content job-modal">
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
                    {validationErrors.shipmentType && (
                      <div className="validation-error">{validationErrors.shipmentType}</div>
                    )}
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
                        <label>Branch <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          className={validationErrors.branch ? 'error' : ''}
                        />
                        {validationErrors.branch && <span className="field-error">{validationErrors.branch}</span>}
                      </div>
                      <div className="form-group">
                        <label>Department <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={validationErrors.department ? 'error' : ''}
                        />
                        {validationErrors.department && <span className="field-error">{validationErrors.department}</span>}
                      </div>
                      <div className="form-group">
                        <label>Shipment Date <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="shipmentDate"
                          value={formData.shipmentDate}
                          onChange={handleInputChange}
                          className={validationErrors.shipmentDate ? 'error' : ''}
                        />
                        {validationErrors.shipmentDate && <span className="field-error">{validationErrors.shipmentDate}</span>}
                      </div>
                      <div className="form-group with-button">
                        <label>Client <span className="required">*</span></label>
                        <div className="input-with-button">
                          <input 
                            type="text" 
                            name="client"
                            value={formData.client}
                            onChange={handleInputChange}
                            className={validationErrors.client ? 'error' : ''}
                          />
                          <button 
                            className="add-button"
                            onClick={() => setShowOrgModal(true)}
                          >
                            +
                          </button>
                        </div>
                        {validationErrors.client && <span className="field-error">{validationErrors.client}</span>}
                      </div>
                      <div className="form-group">
                        <label>Shipper <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="shipper"
                          value={formData.shipper}
                          onChange={handleInputChange}
                          className={validationErrors.shipper ? 'error' : ''}
                        />
                        {validationErrors.shipper && <span className="field-error">{validationErrors.shipper}</span>}
                      </div>
                      <div className="form-group">
                        <label>Consignee <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="consignee"
                          value={formData.consignee}
                          onChange={handleInputChange}
                          className={validationErrors.consignee ? 'error' : ''}
                        />
                        {validationErrors.consignee && <span className="field-error">{validationErrors.consignee}</span>}
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
                        <label>POR <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="por"
                          value={formData.por}
                          onChange={handleInputChange}
                          className={validationErrors.por ? 'error' : ''}
                        />
                        {validationErrors.por && <span className="field-error">{validationErrors.por}</span>}
                      </div>
                      <div className="form-group">
                        <label>POL <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="pol"
                          value={formData.pol}
                          onChange={handleInputChange}
                          className={validationErrors.pol ? 'error' : ''}
                        />
                        {validationErrors.pol && <span className="field-error">{validationErrors.pol}</span>}
                      </div>
                      <div className="form-group">
                        <label>POD <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="pod"
                          value={formData.pod}
                          onChange={handleInputChange}
                          className={validationErrors.pod ? 'error' : ''}
                        />
                        {validationErrors.pod && <span className="field-error">{validationErrors.pod}</span>}
                      </div>
                      <div className="form-group">
                        <label>POF <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="pof"
                          value={formData.pof}
                          onChange={handleInputChange}
                          className={validationErrors.pof ? 'error' : ''}
                        />
                        {validationErrors.pof && <span className="field-error">{validationErrors.pof}</span>}
                      </div>
                      <div className="form-group">
                        <label>HBL No. <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="hblNo"
                          value={formData.hblNo}
                          onChange={handleInputChange}
                          className={validationErrors.hblNo ? 'error' : ''}
                        />
                        {validationErrors.hblNo && <span className="field-error">{validationErrors.hblNo}</span>}
                      </div>
                      <div className="form-group">
                        <label>ETD <span className="required">*</span></label>
                        <input 
                          type="datetime-local" 
                          name="etd"
                          value={formData.etd}
                          onChange={handleInputChange}
                          className={validationErrors.etd ? 'error' : ''}
                        />
                        {validationErrors.etd && <span className="field-error">{validationErrors.etd}</span>}
                      </div>
                      <div className="form-group">
                        <label>ETA <span className="required">*</span></label>
                        <input 
                          type="datetime-local" 
                          name="eta"
                          value={formData.eta}
                          onChange={handleInputChange}
                          className={validationErrors.eta ? 'error' : ''}
                        />
                        {validationErrors.eta && <span className="field-error">{validationErrors.eta}</span>}
                      </div>
                      <div className="form-group">
                        <label>INCOTERMS <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="incoterms"
                          value={formData.incoterms}
                          onChange={handleInputChange}
                          className={validationErrors.incoterms ? 'error' : ''}
                        />
                        {validationErrors.incoterms && <span className="field-error">{validationErrors.incoterms}</span>}
                      </div>
                      <div className="form-group">
                        <label>Service Type <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleInputChange}
                          className={validationErrors.serviceType ? 'error' : ''}
                        />
                        {validationErrors.serviceType && <span className="field-error">{validationErrors.serviceType}</span>}
                      </div>
                      <div className="form-group">
                        <label>Freight <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="freight"
                          value={formData.freight}
                          onChange={handleInputChange}
                          className={validationErrors.freight ? 'error' : ''}
                        />
                        {validationErrors.freight && <span className="field-error">{validationErrors.freight}</span>}
                      </div>
                      <div className="form-group">
                        <label>Payable At <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="payableAt"
                          value={formData.payableAt}
                          onChange={handleInputChange}
                          className={validationErrors.payableAt ? 'error' : ''}
                        />
                        {validationErrors.payableAt && <span className="field-error">{validationErrors.payableAt}</span>}
                      </div>
                      <div className="form-group">
                        <label>Dispatch At <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="dispatchAt"
                          value={formData.dispatchAt}
                          onChange={handleInputChange}
                          className={validationErrors.dispatchAt ? 'error' : ''}
                        />
                        {validationErrors.dispatchAt && <span className="field-error">{validationErrors.dispatchAt}</span>}
                      </div>
                    </div>
                    
                    <div className="client-os-info">
                      Client O/S: Credit Term: CASH | Total O/S: 46000 | Over Due O/S: 46000
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
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

                    {/* Checkbox Section */}
                    <div className="confirmation-checkboxes">
                      <div className="checkbox-item">
                        <input type="checkbox" id="confirm1" required />
                        <label htmlFor="confirm1">I confirm the accuracy of all information</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="confirm2" required />
                        <label htmlFor="confirm2">I agree to the terms and conditions</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="confirm3" required />
                        <label htmlFor="confirm3">I authorize this shipment</label>
                      </div>
                    </div>

                    <div className="confirmation-prompt">
                      <p>Are you sure you want to create the shipment?</p>
                      <div className="confirmation-buttons">
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="confirm-btn" onClick={handleConfirmShipment}>OK</button>
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
                    <button className="confirm-button" onClick={handleConfirmShipment}>
                      Confirm & Create Shipment
                    </button>
                  )}
                </div>
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
      )}
    </div>
  );
};

export default NewShipments;