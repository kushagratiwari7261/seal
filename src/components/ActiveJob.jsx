// src/components/ActiveJob.jsx
import './ActivityTable.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const ActiveJob = ({ activities }) => {
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('auto');
  const [showJobForm, setShowJobForm] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [jobType, setJobType] = useState('');
  const [tradeDirection, setTradeDirection] = useState(''); // 'export' or 'import'
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [amount, setAmount] = useState("27.22");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    branch: 'CHENNAI (MAA)',
    department: 'FCL EXPORT',
    jobDate: '2019-06-11',
    client: 'AMAZON PVT LMD',
    shipper: 'AMAZON PVT LMD',
    consignee: 'FRESA TECHNOLOGIES FZE',
    address: 'PRIMARY, OFFICE, SHIPPING/',
    por: 'INMAA-CHENNAI (EX',
    poi: 'INMAA-CHENNAI (EX',
    pod: 'AEDXB-DUBAI/UNITED ARAB',
    pof: 'AEDXB-DUBAI/UNITED ARAB',
    jobNo: '43544489644',
    etd: '2019-06-11T08:13',
    eta: '2019-06-30T08:13',
    incoterms: 'Cost and Freight-(CFR)',
    serviceType: 'FCL',
    freight: 'Prepaid',
    payableAt: 'CHENNAI (EX MADRAS)',
    dispatchAt: 'CHENNAI (EX MADRAS)',
    
    // Additional fields for summary
    
    pol: 'CHENNAI (EX MADRAS), INDIA',
    pdf: 'DUBAI, UAE',
    carrier: 'SEAWAYS SHIPPING AND LOGISTICS LIMITED',
    vesselNameSummary: 'TIGER SEA / 774',
    noOfRes: '$000',
    volume: '$000',
    grossWeight: '$00000',
    description: 'A PACK OF FURNITURES',
    remarks: '',
    
    // New fields for step 2
    exporter: '',
    importer: '',
    invoiceNo: '',
    invoiceDate: '',
    stuffingDate: '',
    hoDate: '',
    terms: '',
    noOfCartoons: '',
    sbNo: '',
    sbDate: '',
    destination: '',
    commodity: '',
    fob: '',
    grWeight: '',
    netWeight: '',
    railOutDate: '',
    containerNo: '',
    noOfCntr: '',
    sLine: '',
    mblNo: '',
    mblDate: '',
    hblNo: '',
    hblDt: '',
    vessel: '',
    voy: '',
    sob: '',
    ac: '',
    billNo: '',
    billDate: '',
    ccPort: ''
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
    'Create Job',
    'Trade Direction',
    'Port Details',
    'Summary'
  ];

  const jobTypes = [
    'AIR FREIGHT',
    'SEA FREIGHT',
    'LAND',
    'TRANSPORT',
    'OTHERS',
  ];

  const tradeDirections = [
    'EXPORT',
    'IMPORT'
  ];

  const categories = [
    'AGENT', 'ARLINE', 'BANK', 'BIKE', 'BIOKER', 'BUYER', 
    'CAREER', 'CAREER AGENT'
  ];

  // Define required fields for each step
  const requiredFields = {
    1: ['jobType'],
    2: ['tradeDirection'],
    3: ['jobNo', 'exporter', 'importer', 'invoiceNo', 'invoiceDate', 'stuffingDate', 
        'hoDate', 'terms', 'consignee', 'noOfCartoons', 'sbNo', 'sbDate',
        'pol', 'pod', 'destination', 'commodity', 'fob', 'grWeight', 
        'netWeight', 'railOutDate', 'containerNo', 'noOfCntr', 'volume',
        'sLine', 'mblNo', 'mblDate', 'hblNo', 'hblDt', 'vessel', 'voy',
        'etd', 'sob', 'eta', 'ac', 'billNo', 'billDate', 'ccPort'],
    4: [] // No required fields for summary
  };

  // Fetch jobs from Supabase
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        
      
      if (error) throw error;
      
      // Store the fetched jobs in state
      setJobs(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Call this in useEffect to load jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Adjust max height
  useEffect(() => {
    if (tableContainerRef.current) {
      const tableHeight = tableContainerRef.current.scrollHeight;
      const calculatedMaxHeight = Math.min(tableHeight, 400); // 400px max height
      setMaxHeight(`${calculatedMaxHeight}px`);
    }
  }, [jobs, activities]);

  const handleAddJob = () => {
    setShowJobForm(true);
  };

  // Validate current step before proceeding
  const validateStep = (step) => {
    const errors = {};
    const fieldsToValidate = requiredFields[step];
    
    if (step === 1) {
      if (!jobType) {
        errors.jobType = 'Job type is required';
      }
    } else if (step === 2) {
      if (!tradeDirection) {
        errors.tradeDirection = 'Trade direction is required';
      }
    } else {
      fieldsToValidate.forEach(field => {
        // Only validate exporter/importer based on trade direction
        if (field === 'exporter' && tradeDirection === 'EXPORT' && 
            (!formData[field] || formData[field].toString().trim() === '')) {
          errors[field] = `${field} is required`;
        } else if (field === 'importer' && tradeDirection === 'IMPORT' && 
            (!formData[field] || formData[field].toString().trim() === '')) {
          errors[field] = `${field} is required`;
        } else if (field !== 'exporter' && field !== 'importer' && 
            (!formData[field] || formData[field].toString().trim() === '')) {
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
    setJobType('');
    setTradeDirection('');
    setShowJobForm(false);
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

  const handleJobTypeSelect = (type) => {
    setJobType(type);
    // Clear job type validation error if any
    if (validationErrors.jobType) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.jobType;
        return newErrors;
      });
    }
  };

  const handleTradeDirectionSelect = (direction) => {
    setTradeDirection(direction);
    // Clear trade direction validation error if any
    if (validationErrors.tradeDirection) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.tradeDirection;
        return newErrors;
      });
    }
  };

  const handleCreateOrganization = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .insert([orgFormData])
        .select();
      
      if (error) throw error;
      
      // Update the client field with the new organization
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
      
      setShowOrgModal(false);
      setSuccess('Organization created successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      setLoading(true);
      
      // Prepare job data for insertion
      const jobData = {
        ...formData,
        job_type: jobType,
        trade_direction: tradeDirection,
        // Convert date strings to proper format if needed
        job_date: new Date(formData.jobDate).toISOString(),
        etd: new Date(formData.etd).toISOString(),
        eta: new Date(formData.eta).toISOString(),
        // Add other date conversions as needed
      };
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select();
      
      if (error) throw error;
      
      // Reset form and show success
      setActiveStep(1);
      setJobType('');
      setTradeDirection('');
      setShowJobForm(false);
      setValidationErrors({});
      setSuccess('Job created successfully!');
      
      // Refresh the jobs list
      fetchJobs();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Helper function to conditionally render fields based on trade direction
const renderConditionalField = (fieldName, condition) => {
  return condition ? (
    <div className="form-group">
      <label>{fieldName} <span className="required">*</span></label>
      <input 
        type="text" 
        name={fieldName.toLowerCase().replace(' ', '')}
        value={formData[fieldName.toLowerCase().replace(' ', '')]}
        onChange={handleInputChange}
        className={validationErrors[fieldName.toLowerCase().replace(' ', '')] ? 'error' : ''}
      />
      {validationErrors[fieldName.toLowerCase().replace(' ', '')] && 
        <span className="field-error">{validationErrors[fieldName.toLowerCase().replace(' ', '')]}</span>
      }
    </div>
  ) : null;
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
  const displayJobs = [...jobs, ...(activities || [])];

  return (
    <>
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

      {/* Job Creation Form Modal */}
      {showJobForm && (
        <div className="modal-overlay">
          <div className="modal-content job-modal">
            <div className="new-shipment-card">
              <div className="new-shipment-header">
                <h1>Create Job</h1>
              </div>

              {/* Progress Steps */}
              <div className="progress-steps">
                {steps.map((step, index) => (
                  <div 
                    key={`step-${index}`} 
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
                    <h2>What type of Job would you like to create?</h2>
                    {validationErrors.jobType && (
                      <div className="validation-error">{validationErrors.jobType}</div>
                    )}
                    <div className="shipment-type-grid">
                      {jobTypes.map((type, index) => (
                        <div 
                          key={`type-${index}`} 
                          className={`shipment-type-card ${jobType === type ? 'selected' : ''}`}
                          onClick={() => handleJobTypeSelect(type)}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="trade-direction-selection">
                    <h2>Is this an Export or Import job?</h2>
                    {validationErrors.tradeDirection && (
                      <div className="validation-error">{validationErrors.tradeDirection}</div>
                    )}
                    <div className="trade-direction-grid">
                      {tradeDirections.map((direction, index) => (
                        <div 
                          key={`direction-${index}`} 
                          className={`trade-direction-card ${tradeDirection === direction ? 'selected' : ''}`}
                          onClick={() => handleTradeDirectionSelect(direction)}
                        >
                          {direction}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="port-details-form">
                    <h2>Port Details - {tradeDirection}</h2>
                    <div className="form-grid-two-column">
                      {/* Job No */}
                      <div className="form-group">
                        <label>Job No. <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="jobNo"
                          value={formData.jobNo}
                          onChange={handleInputChange}
                          className={validationErrors.jobNo ? 'error' : ''}
                        />
                        {validationErrors.jobNo && <span className="field-error">{validationErrors.jobNo}</span>}
                      </div>
                      
                      {/* Exporter (only for export jobs) */}
                      {tradeDirection === 'EXPORT' && (
                        <div className="form-group">
                          <label>Exporter <span className="required">*</span></label>
                          <input 
                            type="text" 
                            name="exporter"
                            value={formData.exporter}
                            onChange={handleInputChange}
                            className={validationErrors.exporter ? 'error' : ''}
                          />
                          {validationErrors.exporter && <span className="field-error">{validationErrors.exporter}</span>}
                        </div>
                      )}
                      
                      {/* Importer (only for import jobs) */}
                      {tradeDirection === 'IMPORT' && (
                        <div className="form-group">
                          <label>Importer <span className="required">*</span></label>
                          <input 
                            type="text" 
                            name="importer"
                            value={formData.importer}
                            onChange={handleInputChange}
                            className={validationErrors.importer ? 'error' : ''}
                          />
                          {validationErrors.importer && <span className="field-error">{validationErrors.importer}</span>}
                        </div>
                      )}
                      
                      {/* Invoice No */}
                      <div className="form-group">
                        <label>Invoice No <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="invoiceNo"
                          value={formData.invoiceNo}
                          onChange={handleInputChange}
                          className={validationErrors.invoiceNo ? 'error' : ''}
                        />
                        {validationErrors.invoiceNo && <span className="field-error">{validationErrors.invoiceNo}</span>}
                      </div>
                      
                      {/* Invoice Date */}
                      <div className="form-group">
                        <label>Invoice Date <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="invoiceDate"
                          value={formData.invoiceDate}
                          onChange={handleInputChange}
                          className={validationErrors.invoiceDate ? 'error' : ''}
                        />
                        {validationErrors.invoiceDate && <span className="field-error">{validationErrors.invoiceDate}</span>}
                      </div>
                      
                      {/* Stuffing Date */}
                      <div className="form-group">
                        <label>Stuffing Date <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="stuffingDate"
                          value={formData.stuffingDate}
                          onChange={handleInputChange}
                          className={validationErrors.stuffingDate ? 'error' : ''}
                        />
                        {validationErrors.stuffingDate && <span className="field-error">{validationErrors.stuffingDate}</span>}
                      </div>
                      
                      {/* H/O Date */}
                      <div className="form-group">
                        <label>H/O Date <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="hoDate"
                          value={formData.hoDate}
                          onChange={handleInputChange}
                          className={validationErrors.hoDate ? 'error' : ''}
                        />
                        {validationErrors.hoDate && <span className="field-error">{validationErrors.hoDate}</span>}
                      </div>
                      
                      {/* Terms */}
                      <div className="form-group">
                        <label>Terms <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="terms"
                          value={formData.terms}
                          onChange={handleInputChange}
                          className={validationErrors.terms ? 'error' : ''}
                        />
                        {validationErrors.terms && <span className="field-error">{validationErrors.terms}</span>}
                      </div>
                      
                      {/* Consignee */}
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
                      
                      {/* No of Cartoons */}
                      <div className="form-group">
                        <label>No of Cartoons <span className="required">*</span></label>
                        <input 
                          type="number" 
                          name="noOfCartoons"
                          value={formData.noOfCartoons}
                          onChange={handleInputChange}
                          className={validationErrors.noOfCartoons ? 'error' : ''}
                        />
                        {validationErrors.noOfCartoons && <span className="field-error">{validationErrors.noOfCartoons}</span>}
                      </div>
                      
                      {/* S/B No */}
                      <div className="form-group">
                        <label>S/B No <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="sbNo"
                          value={formData.sbNo}
                          onChange={handleInputChange}
                          className={validationErrors.sbNo ? 'error' : ''}
                        />
                        {validationErrors.sbNo && <span className="field-error">{validationErrors.sbNo}</span>}
                      </div>
                      
                      {/* S/B Date */}
                      <div className="form-group">
                        <label>S/B Date <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="sbDate"
                          value={formData.sbDate}
                          onChange={handleInputChange}
                          className={validationErrors.sbDate ? 'error' : ''}
                        />
                        {validationErrors.sbDate && <span className="field-error">{validationErrors.sbDate}</span>}
                      </div>
                      
                      {/* POL */}
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
                      
                      {/* POD */}
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
                      
                      {/* Destination */}
                      <div className="form-group">
                        <label>Destination <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          className={validationErrors.destination ? 'error' : ''}
                        />
                        {validationErrors.destination && <span className="field-error">{validationErrors.destination}</span>}
                      </div>
                      
                      {/* Commodity */}
                      <div className="form-group">
                        <label>Commodity <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="commodity"
                          value={formData.commodity}
                          onChange={handleInputChange}
                          className={validationErrors.commodity ? 'error' : ''}
                        />
                        {validationErrors.commodity && <span className="field-error">{validationErrors.commodity}</span>}
                      </div>
                      
                      {/* FOB */}
                      <div className="form-group">
                        <label>FOB <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="fob"
                          value={formData.fob}
                          onChange={handleInputChange}
                          className={validationErrors.fob ? 'error' : ''}
                        />
                        {validationErrors.fob && <span className="field-error">{validationErrors.fob}</span>}
                      </div>
                      
                      {/* GR Weight */}
                      <div className="form-group">
                        <label>GR Weight <span className="required">*</span></label>
                        <input 
                          type="number" 
                          name="grWeight"
                          value={formData.grWeight}
                          onChange={handleInputChange}
                          className={validationErrors.grWeight ? 'error' : ''}
                        />
                        {validationErrors.grWeight && <span className="field-error">{validationErrors.grWeight}</span>}
                      </div>
                      
                      {/* Net Weight */}
                      <div className="form-group">
                        <label>Net Weight <span className="required">*</span></label>
                        <input 
                          type="number" 
                          name="netWeight"
                          value={formData.netWeight}
                          onChange={handleInputChange}
                          className={validationErrors.netWeight ? 'error' : ''}
                        />
                        {validationErrors.netWeight && <span className="field-error">{validationErrors.netWeight}</span>}
                      </div>
                      
                      {/* RAIL Out Date */}
                      <div className="form-group">
                        <label>RAIL Out Date <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="railOutDate"
                          value={formData.railOutDate}
                          onChange={handleInputChange}
                          className={validationErrors.railOutDate ? 'error' : ''}
                        />
                        {validationErrors.railOutDate && <span className="field-error">{validationErrors.railOutDate}</span>}
                      </div>
                      
                      {/* Container No */}
                      <div className="form-group">
                        <label>Container No <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="containerNo"
                          value={formData.containerNo}
                          onChange={handleInputChange}
                          className={validationErrors.containerNo ? 'error' : ''}
                        />
                        {validationErrors.containerNo && <span className="field-error">{validationErrors.containerNo}</span>}
                      </div>
                      
                      {/* No of CNTR */}
                      <div className="form-group">
                        <label>No of CNTR <span className="required">*</span></label>
                        <input 
                          type="number" 
                          name="noOfCntr"
                          value={formData.noOfCntr}
                          onChange={handleInputChange}
                          className={validationErrors.noOfCntr ? 'error' : ''}
                        />
                        {validationErrors.noOfCntr && <span className="field-error">{validationErrors.noOfCntr}</span>}
                      </div>
                      
                      {/* Volume(CBM) */}
                      <div className="form-group">
                        <label>Volume(CBM) <span className="required">*</span></label>
                        <input 
                          type="number" 
                          name="volume"
                          value={formData.volume}
                          onChange={handleInputChange}
                          className={validationErrors.volume ? 'error' : ''}
                        />
                        {validationErrors.volume && <span className="field-error">{validationErrors.volume}</span>}
                      </div>
                      
                      {/* S/Line */}
                      <div className="form-group">
                        <label>S/Line <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="sLine"
                          value={formData.sLine}
                          onChange={handleInputChange}
                          className={validationErrors.sLine ? 'error' : ''}
                        />
                        {validationErrors.sLine && <span className="field-error">{validationErrors.sLine}</span>}
                      </div>
                      
                      {/* MBL No */}
                      <div className="form-group">
                        <label>MBL No <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="mblNo"
                          value={formData.mblNo}
                          onChange={handleInputChange}
                          className={validationErrors.mblNo ? 'error' : ''}
                        />
                        {validationErrors.mblNo && <span className="field-error">{validationErrors.mblNo}</span>}
                      </div>
                      
                      {/* MBL Date */}
                      <div className="form-group">
                        <label>MBL Date <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="mblDate"
                          value={formData.mblDate}
                          onChange={handleInputChange}
                          className={validationErrors.mblDate ? 'error' : ''}
                        />
                        {validationErrors.mblDate && <span className="field-error">{validationErrors.mblDate}</span>}
                      </div>
                      
                      {/* HBL No */}
                      <div className="form-group">
                        <label>HBL No <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="hblNo"
                          value={formData.hblNo}
                          onChange={handleInputChange}
                          className={validationErrors.hblNo ? 'error' : ''}
                        />
                        {validationErrors.hblNo && <span className="field-error">{validationErrors.hblNo}</span>}
                      </div>
                      
                      {/* HBL DT */}
                      <div className="form-group">
                        <label>HBL DT <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="hblDt"
                          value={formData.hblDt}
                          onChange={handleInputChange}
                          className={validationErrors.hblDt ? 'error' : ''}
                        />
                        {validationErrors.hblDt && <span className="field-error">{validationErrors.hblDt}</span>}
                      </div>
                      
                      {/* VESSEL */}
                      <div className="form-group">
                        <label>VESSEL <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="vessel"
                          value={formData.vessel}
                          onChange={handleInputChange}
                          className={validationErrors.vessel ? 'error' : ''}
                        />
                        {validationErrors.vessel && <span className="field-error">{validationErrors.vessel}</span>}
                      </div>
                      
                      {/* VOY */}
                      <div className="form-group">
                        <label>VOY <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="voy"
                          value={formData.voy}
                          onChange={handleInputChange}
                          className={validationErrors.voy ? 'error' : ''}
                        />
                        {validationErrors.voy && <span className="field-error">{validationErrors.voy}</span>}
                      </div>
                      
                      {/* ETD */}
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
                      
                      {/* SOB */}
                      <div className="form-group">
                        <label>SOB <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="sob"
                          value={formData.sob}
                          onChange={handleInputChange}
                          className={validationErrors.sob ? 'error' : ''}
                        />
                        {validationErrors.sob && <span className="field-error">{validationErrors.sob}</span>}
                      </div>
                      
                      {/* ETA */}
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
                      
                      {/* A/C */}
                      <div className="form-group">
                        <label>A/C <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="ac"
                          value={formData.ac}
                          onChange={handleInputChange}
                          className={validationErrors.ac ? 'error' : ''}
                        />
                        {validationErrors.ac && <span className="field-error">{validationErrors.ac}</span>}
                      </div>
                      
                      {/* Bill No */}
                      <div className="form-group">
                        <label>Bill No <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="billNo"
                          value={formData.billNo}
                          onChange={handleInputChange}
                          className={validationErrors.billNo ? 'error' : ''}
                        />
                        {validationErrors.billNo && <span className="field-error">{validationErrors.billNo}</span>}
                      </div>
                      
                      {/* Bill Date */}
                      <div className="form-group">
                        <label>Bill Date <span className="required">*</span></label>
                        <input 
                          type="date" 
                          name="billDate"
                          value={formData.billDate}
                          onChange={handleInputChange}
                          className={validationErrors.billDate ? 'error' : ''}
                        />
                        {validationErrors.billDate && <span className="field-error">{validationErrors.billDate}</span>}
                      </div>
                      
                      {/* C/C Port */}
                      <div className="form-group">
                        <label>C/C Port <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="ccPort"
                          value={formData.ccPort}
                          onChange={handleInputChange}
                          className={validationErrors.ccPort ? 'error' : ''}
                        />
                        {validationErrors.ccPort && <span className="field-error">{validationErrors.ccPort}</span>}
                      </div>
                    </div>
                    
                    <div className="client-os-info">
                      Client O/S: Credit Term: CASH | Total O/S: 46000 | Over Due O/S: 46000
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="summary-step">
                    <h2>Summary - {tradeDirection}</h2>
                    
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
                          <span className="label">Job No:</span>
                          <span className="value">{formData.jobNo}</span>
                          {tradeDirection === 'EXPORT' && (
                            <>
                              <span className="label">Exporter:</span>
                              <span className="value">{formData.exporter}</span>
                            </>
                          )}
                          {tradeDirection === 'IMPORT' && (
                            <>
                              <span className="label">Importer:</span>
                              <span className="value">{formData.importer}</span>
                            </>
                          )}
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Invoice No:</span>
                          <span className="value">{formData.invoiceNo}</span>
                          <span className="label">Invoice Date:</span>
                          <span className="value">{formData.invoiceDate}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Stuffing Date:</span>
                          <span className="value">{formData.stuffingDate}</span>
                          <span className="label">H/O Date:</span>
                          <span className="value">{formData.hoDate}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Terms:</span>
                          <span className="value">{formData.terms}</span>
                          <span className="label">Consignee:</span>
                          <span className="value">{formData.consignee}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">No of Cartoons:</span>
                          <span className="value">{formData.noOfCartoons}</span>
                          <span className="label">S/B No:</span>
                          <span className="value">{formData.sbNo}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">S/B Date:</span>
                          <span className="value">{formData.sbDate}</span>
                          <span className="label">POL:</span>
                          <span className="value">{formData.pol}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">POD:</span>
                          <span className="value">{formData.pod}</span>
                          <span className="label">Destination:</span>
                          <span className="value">{formData.destination}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Commodity:</span>
                          <span className="value">{formData.commodity}</span>
                          <span className="label">FOB:</span>
                          <span className="value">{formData.fob}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">GR Weight:</span>
                          <span className="value">{formData.grWeight}</span>
                          <span className="label">Net Weight:</span>
                          <span className="value">{formData.netWeight}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">RAIL Out Date:</span>
                          <span className="value">{formData.railOutDate}</span>
                          <span className="label">Container No:</span>
                          <span className="value">{formData.containerNo}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">No of CNTR:</span>
                          <span className="value">{formData.noOfCntr}</span>
                          <span className="label">Volume:</span>
                          <span className="value">{formData.volume}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">S/Line:</span>
                          <span className="value">{formData.sLine}</span>
                          <span className="label">MBL No:</span>
                          <span className="value">{formData.mblNo}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">MBL Date:</span>
                          <span className="value">{formData.mblDate}</span>
                          <span className="label">HBL No:</span>
                          <span className="value">{formData.hblNo}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">HBL DT:</span>
                          <span className="value">{formData.hblDt}</span>
                          <span className="label">VESSEL:</span>
                          <span className="value">{formData.vessel}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">VOY:</span>
                          <span className="value">{formData.voy}</span>
                          <span className="label">ETD:</span>
                          <span className="value">{formData.etd}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">SOB:</span>
                          <span className="value">{formData.sob}</span>
                          <span className="label">ETA:</span>
                          <span className="value">{formData.eta}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">A/C:</span>
                          <span className="value">{formData.ac}</span>
                          <span className="label">Bill No:</span>
                          <span className="value">{formData.billNo}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Bill Date:</span>
                          <span className="value">{formData.billDate}</span>
                          <span className="label">C/C Port:</span>
                          <span className="value">{formData.ccPort}</span>
                        </div>
                      </div>
                    </div>

                    <div className="divider"></div>

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
                        <label htmlFor="confirm3">I authorize this job</label>
                      </div>
                    </div>

                    <div className="confirmation-prompt">
                      <p>Are you sure you want to create the job?</p>
                      <div className="confirmation-buttons">
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="confirm-btn" onClick={handleCreateJob}>OK</button>
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
                    <button className="confirm-button" onClick={handleCreateJob}>
                      Confirm & Create Job
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
                            <option key={`category-${index}`} value={category}>{category}</option>
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
    </>
  );
};

export default ActiveJob;