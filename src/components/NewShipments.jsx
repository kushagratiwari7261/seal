// src/components/NewShipments.jsx
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer'; // Add this import
import PDFGenerator from './PDFGenerator.jsx'; // Add this import

import { supabase } from '../lib/supabaseClient';
import './NewShipments.css';


// Constants for better maintainability
const SHIPMENT_TYPES = ['AIR FREIGHT', 'SEA FREIGHT', 'LAND', 'TRANSPORT', 'OTHERS'];
const STEPS = ['Create Shipment', 'Port Details', 'Summary'];
const CATEGORIES = [
  'AGENT', 'ARLINE', 'BANK', 'BIKE', 'BIOKER', 'BUYER', 
  'CAREER', 'CAREER AGENT'
];

// Initial form data

const INITIAL_FORM_DATA = {
  branch: 'CHENNAI (MAA)',
  department: 'FCL EXPORT',
  shipmentDate: new Date().toISOString().split('T')[0],
  client: 'AMAZON PVT LMD',
  shipper: 'AMAZON PVT LMD',
  consignee: 'FRESA TECHNOLOGIES FZE',
  address: 'PRIMARY, OFFICE, SHIPPING/',
  por: 'INMAA-CHENNAI (EX',
  poi: 'INMAA-CHENNAI (EX',
  pod: 'AEDXB-DUBAI/UNITED ARAB',
  pof: 'AEDXB-DUBAI/UNITED ARAB',
  hblNo: '',
  jobNo: '', // Will be populated from dropdown
  etd: '',
  eta: '',
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
};

const INITIAL_ORG_FORM_DATA = {
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
};

const NewShipments = () => {
  
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [shipmentType, setShipmentType] = useState('');
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [amount, setAmount] = useState("27.22");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState(null);
  const [jobs, setJobs] = useState([]); // State to store jobs for dropdown
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
   const [generatePDF, setGeneratePDF] = useState(false);
  const [pdfShipmentData, setPdfShipmentData] = useState(null); // Add this state to store data for PDF
  
  const tableContainerRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('auto');
  const handlePDFReady = useCallback((blob) => {
    console.log('PDF is ready for download', blob);
    // You can add additional handling here if needed
  }, []);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [orgFormData, setOrgFormData] = useState(INITIAL_ORG_FORM_DATA);

  // Define required fields for each step
  const requiredFields = useMemo(() => ({
    1: ['shipmentType'],
    2: ['branch', 'department', 'shipmentDate', 'client', 'shipper', 'consignee', 
        'por', 'pol', 'pod', 'pof', 'hblNo', 'jobNo', 'etd', 'eta', 'incoterms', 
        'serviceType', 'freight', 'payableAt', 'dispatchAt'],
    3: [] // No required fields for summary
  }), []);

  // Fetch jobs from Supabase for dropdown
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoadingJobs(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);
  

  // Fetch shipments from Supabase
  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to display fields with the structure you specified
      const mappedShipments = (data || []).map(shipment => ({
        id: shipment.id,
        shipmentNo: shipment.shipment_no || `${shipment.id.toString().padStart(6, '0')}`,
        client: shipment.client,
        jobNo: shipment.job_no || `${shipment.id.toString().padStart(6, '0')}`,
        por: shipment.por,
        pof: shipment.pof,
        createdAt: shipment.created_at ? new Date(shipment.created_at).toLocaleDateString() : '',
        updatedAt: shipment.updated_at ? new Date(shipment.updated_at).toLocaleDateString() : '',
        etd: shipment.etd ? new Date(shipment.etd).toLocaleDateString() : '',
        eta: shipment.eta ? new Date(shipment.eta).toLocaleDateString() : '',
        // Add all other fields for editing
        ...shipment
      }));
      
      setShipments(mappedShipments);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load jobs and shipments on component mount
  useEffect(() => {
    fetchJobs();
    fetchShipments();
  }, [fetchJobs, fetchShipments]);

  // Adjust max height when shipments change
  useEffect(() => {
    if (tableContainerRef.current) {
      const tableHeight = tableContainerRef.current.scrollHeight;
      const calculatedMaxHeight = Math.min(tableHeight, 400);
      setMaxHeight(`${calculatedMaxHeight}px`);
    }
  }, [shipments]);

  // Handle job selection from dropdown
  const handleJobSelect = useCallback((jobNo) => {
    if (!jobNo) return;
    
    const selectedJob = jobs.find(job => job.job_no === jobNo);
    if (selectedJob) {
      // Auto-fill form fields with job data
      setFormData(prev => ({
        ...prev,
        jobNo: selectedJob.job_no,
        client: selectedJob.client || prev.client,
        shipper: selectedJob.shipper || prev.shipper,
        consignee: selectedJob.consignee || prev.consignee,
        por: selectedJob.por || prev.por,
        poi: selectedJob.poi || prev.poi,
        pod: selectedJob.pod || prev.pod,
        pof: selectedJob.pof || prev.pof,
        etd: selectedJob.etd || prev.etd,
        eta: selectedJob.eta || prev.eta,
        incoterms: selectedJob.incoterms || prev.incoterms,
        serviceType: selectedJob.service_type || prev.serviceType,
        freight: selectedJob.freight || prev.freight,
        payableAt: selectedJob.payable_at || prev.payableAt,
        dispatchAt: selectedJob.dispatch_at || prev.dispatchAt,
        pol: selectedJob.pol || prev.pol,
        pdf: selectedJob.pdf || prev.pdf,
        carrier: selectedJob.carrier || prev.carrier,
        vesselNameSummary: selectedJob.vessel_name_summary || prev.vesselNameSummary,
        noOfRes: selectedJob.no_of_res || prev.noOfRes,
        volume: selectedJob.volume || prev.volume,
        grossWeight: selectedJob.gross_weight || prev.grossWeight,
        description: selectedJob.description || prev.description,
        remarks: selectedJob.remarks || prev.remarks,
      }));
    }
  }, [jobs]);

  // Validate current step before proceeding
  const validateStep = useCallback((step) => {
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
  }, [shipmentType, formData, requiredFields]);

  const handleNext = useCallback(() => {
    if (validateStep(activeStep)) {
      if (activeStep < STEPS.length) {
        setActiveStep(activeStep + 1);
      }
    }
  }, [activeStep, validateStep]);

  const handleBack = useCallback(() => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  const handleCancel = useCallback(() => {
    setActiveStep(1);
    setShipmentType('');
    setShowShipmentForm(false);
    setEditingShipment(null);
    setValidationErrors({});
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const handleInputChange = useCallback((e) => {
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
  }, [validationErrors]);

  const handleOrgInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setOrgFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleShipmentTypeSelect = useCallback((type) => {
    setShipmentType(type);
    // Clear shipment type validation error if any
    if (validationErrors.shipmentType) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.shipmentType;
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleCreateOrganization = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .insert([orgFormData])
        .select();
      
      if (error) throw error;
      
      // Update the client field with the new organization name
      setFormData(prev => ({
        ...prev,
        client: data[0].name
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
      setSuccess('Organization created successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [orgFormData, validationErrors]);

  const handleConfirmShipment = useCallback(async () => {
    // Final validation before creating shipment
    if (validateStep(activeStep)) {
      try {
        setLoading(true);
        
        // Prepare shipment data for insertion
        const shipmentData = {
          branch: formData.branch,
          department: formData.department,
          shipment_date: formData.shipmentDate,
          client: formData.client,
          shipper: formData.shipper,
          consignee: formData.consignee,
          address: formData.address,
          por: formData.por,
          poi: formData.poi,
          pod: formData.pod,
          pof: formData.pof,
          hbl_no: formData.hblNo,
          job_no: formData.jobNo, // Added job_no field
          etd: formData.etd,
          eta: formData.eta,
          incoterms: formData.incoterms,
          service_type: formData.serviceType,
          freight: formData.freight,
          payable_at: formData.payableAt,
          dispatch_at: formData.dispatchAt,
          hs_code: formData.HSCode,
          pol: formData.pol,
          pdf: formData.pdf,
          carrier: formData.carrier,
          vessel_name_summary: formData.vesselNameSummary,
          no_of_res: formData.noOfRes,
          volume: formData.volume,
          gross_weight: formData.grossWeight,
          description: formData.description,
          remarks: formData.remarks,
          shipment_type: shipmentType,
          updated_at: new Date().toISOString()
        };
        
        let result;
        if (editingShipment) {
          // Update existing shipment
          const { data: updatedShipment, error } = await supabase
            .from('shipments')
            .update(shipmentData)
            .eq('id', editingShipment.id)
            .select();
          
          if (error) throw error;
          result = updatedShipment;
        } else {
          // Create new shipment
          const { data: newShipment, error } = await supabase
            .from('shipments')
            .insert([shipmentData])
            .select();
          
          if (error) throw error;
          result = newShipment;
        }
        
        // Generate PDF
        setPdfShipmentData({
          ...shipmentData,
          shipmentNo: editingShipment ? editingShipment.shipmentNo : `MTD-${result?.[0]?.id?.toString().padStart(6, '0') || 'DOCUMENT'}`,
          // Add any other fields needed for the PDF
        });
        
        // Show PDF generation
        setGeneratePDF(true);
        
        // Close the form and reset
        handleCancel();
        setSuccess(editingShipment ? 'Shipment updated successfully!' : 'Shipment created successfully!');
        
        // Refresh the shipments list
        fetchShipments();
      } catch (error) {
        console.error('Error saving shipment:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [formData, shipmentType, editingShipment, activeStep, validateStep, handleCancel, fetchShipments]);
  // Handle edit shipment
  const handleEditShipment = useCallback((shipment) => {
    setEditingShipment(shipment);
    setShipmentType(shipment.shipment_type);
    
    // Map database fields to form fields
    const formDataFromShipment = {
      branch: shipment.branch,
      department: shipment.department,
      shipmentDate: shipment.shipment_date,
      client: shipment.client,
      shipper: shipment.shipper,
      consignee: shipment.consignee,
      address: shipment.address,
      por: shipment.por,
      poi: shipment.poi,
      pod: shipment.pod,
      pof: shipment.pof,
      hblNo: shipment.hbl_no,
      jobNo: shipment.job_no, // Added jobNo field
      etd: shipment.etd,
      eta: shipment.eta,
      incoterms: shipment.incoterms,
      serviceType: shipment.service_type,
      freight: shipment.freight,
      payableAt: shipment.payable_at,
      dispatchAt: shipment.dispatch_at,
      HSCode: shipment.hs_code,
      pol: shipment.pol,
      pdf: shipment.pdf,
      carrier: shipment.carrier,
      vesselNameSummary: shipment.vessel_name_summary,
      noOfRes: shipment.no_of_res,
      volume: shipment.volume,
      grossWeight: shipment.gross_weight,
      description: shipment.description,
      remarks: shipment.remarks,
    };
    
    setFormData(formDataFromShipment);
    setShowShipmentForm(true);
    setActiveStep(2); // Start at port details step for editing
  }, []);

  // Handle delete shipment
  const handleDeleteShipment = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentToDelete.id);
      
      if (error) throw error;
      
      setShowDeleteModal(false);
      setShipmentToDelete(null);
      setSuccess('Shipment deleted successfully!');
      
      // Refresh the shipments list
      fetchShipments();
    } catch (error) {
      console.error('Error deleting shipment:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [shipmentToDelete, fetchShipments]);

  // Confirm delete
  const confirmDelete = useCallback((shipment) => {
    setShipmentToDelete(shipment);
    setShowDeleteModal(true);
  }, []);



  return (

    <div className="new-shipment-container">
      {generatePDF && pdfShipmentData && (
        <div style={{ textAlign: 'center', margin: '20px 0', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <PDFDownloadLink 
            document={<PDFGenerator shipmentData={pdfShipmentData} />} 
            fileName={`${pdfShipmentData.shipmentNo}.pdf`}
          >
            {({ blob, url, loading, error }) => {
              if (blob && !loading && handlePDFReady) {
                handlePDFReady(blob);
              }
              return loading ? 'Generating PDF...' : 'Download PDF Document';
            }}
          </PDFDownloadLink>
          <button 
            onClick={() => setGeneratePDF(false)} 
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Close
          </button>
        </div>
        
      )}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}

      {error && (
        <div className="error-message">
          Error: {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
          <button onClick={() => setSuccess(false)}>Dismiss</button>
        </div>
      )}
      
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
                <th>Shipment No.</th>
                <th>Client</th>
                <th>Job No.</th>
                <th>POR</th>
                <th>POF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length > 0 ? (
                shipments.map((shipment, index) => (
                  <tr key={index}>
                    <td>{shipment.shipmentNo}</td>
                    <td>{shipment.client}</td>
                    <td>{shipment.jobNo}</td>
                    <td>{shipment.por}</td>
                    <td>{shipment.pof}</td>
                    <td className="actions-cell">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditShipment(shipment)}
                        title="Edit Shipment"
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => confirmDelete(shipment)}
                        title="Delete Shipment"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                    No shipments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Creation/Edit Form Modal */}
      {showShipmentForm && (
        <div className="modal-overlay">
          <div className="modal-content job-modal">
            <div className="new-shipment-card">
              <div className="new-shipment-header">
                <h1>{editingShipment ? 'Edit Shipment' : 'Create Shipment'}</h1>
              </div>

              {/* Progress Steps */}
              <div className="progress-steps">
                {STEPS.map((step, index) => (
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
                    style={{ width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step Content */}
              <div className="step-content">
                {activeStep === 1 && (
                  <div className="shipment-type-selection">
                    <h2>What type of Shipment would you like to {editingShipment ? 'edit' : 'create'}?</h2>
                    {validationErrors.shipmentType && (
                      <div className="validation-error">{validationErrors.shipmentType}</div>
                    )}
                    <div className="shipment-type-grid">
                      {SHIPMENT_TYPES.map((type, index) => (
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
                        <label>Job No. <span className="required">*</span></label>
                        <select 
                          name="jobNo"
                          value={formData.jobNo}
                          onChange={(e) => {
                            handleInputChange(e);
                            handleJobSelect(e.target.value);
                          }}
                          className={validationErrors.jobNo ? 'error' : ''}
                        >
                          <option value="">Select a Job</option>
                          {isLoadingJobs ? (
                            <option value="" disabled>Loading jobs...</option>
                          ) : (
                            jobs.map((job) => (
                              <option key={job.id} value={job.job_no}>
                                {job.job_no} - {job.client}
                              </option>
                            ))
                          )}
                        </select>
                        {validationErrors.jobNo && <span className="field-error">{validationErrors.jobNo}</span>}
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
                          <span className="label">Job No:</span>
                          <span className="value">{formData.jobNo}</span>
                          <span className="label">HBL No:</span>
                          <span className="value">{formData.hblNo}</span>
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
                      <p>Are you sure you want to {editingShipment ? 'update' : 'create'} the shipment?</p>
                      <div className="confirmation-buttons">
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="confirm-btn" onClick={handleConfirmShipment}>
                          {editingShipment ? 'Update' : 'Create'}
                        </button>
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
                  {activeStep < STEPS.length && (
                    <button className="next-button" onClick={handleNext}>
                      Next
                    </button>
                  )}
                  {activeStep === STEPS.length && (
                    <button className="confirm-button" onClick={handleConfirmShipment}>
                      {editingShipment ? 'Update Shipment' : 'Confirm & Create Shipment'}
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
                          {CATEGORIES.map((category, index) => (
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete shipment #{shipmentToDelete?.shipmentNo}?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-button"
                onClick={handleDeleteShipment}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewShipments;