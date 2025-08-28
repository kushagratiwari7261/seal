// src/App.jsx
// src/App.jsx
import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatCard from './components/StatCard'
import ActiveJob from './components/ActiveJob'
import ActivityTable from './components/ActivityTable'
import CustomerPage from './components/CustomerPage'
import './App.css'
// In your App.jsx
import NewShipments from './components/NewShipments';



function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate() // Add this hook

  const statsData = [
    { label: 'Total Shipments', value: '1,250', icon: 'blue', id: 'total-shipments', path: '/new-shipment' },
    { label: 'Jobs', value: '320', icon: 'teal', id: 'Jobs', path: '/job-orders' },
    { label: 'Invoices', value: '15', icon: 'yellow', id: 'Invoices', path: '/invoices' },
    { label: 'Messages', value: '5', icon: 'red', id: 'Messages', path: '/messages' }
  ]
  const activitiesData = [
    { date: '2024-07-26', activity: 'Shipment Created', details: 'Shipment #12345 for Acme Corp.', status: 'Completed' },
    { date: '2024-07-25', activity: 'Shipment Updated', details: '#67890 delivery date changed.', status: 'In Progress' },
    { date: '2024-07-24', activity: 'Customer Added', details: 'New customer: Global Imports.', status: 'Completed' },
    { date: '2024-07-23', activity: 'Report Generated', details: 'Monthly shipment report.', status: 'Generated' },
    { date: '2024-07-22', activity: 'Task Completed', details: 'Customs documentation finalized.', status: 'Completed' }
  ]
  const ActiveJobs = [
    { date: '2024-07-26', activity: 'Shipment Created', details: 'Shipment #12345 for Acme Corp.', status: 'Completed' },
    { date: '2024-07-25', activity: 'Shipment Updated', details: '#67890 delivery date changed.', status: 'In Progress' },
    { date: '2024-07-24', activity: 'Customer Added', details: 'New customer: Global Imports.', status: 'Completed' },
    { date: '2024-07-23', activity: 'Report Generated', details: 'Monthly shipment report.', status: 'Generated' },
    { date: '2024-07-22', activity: 'Task Completed', details: 'Customs documentation finalized.', status: 'Completed' }
  ]


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const createNewShipment = () => {
    navigate('/new-shipment');
  }
    const creatActiveJob = () => {
    navigate('/job-orders');
  }

  // Dashboard component
  const Dashboard = () => (
    <>
      <Header 
        toggleMobileMenu={toggleMobileMenu} 
        createNewShipment={createNewShipment}
        creatActiveJob ={creatActiveJob } 
      />
      
      <div className="stats-grid">
        {statsData.map(stat => (
          <StatCard 
            key={stat.id}
            label={stat.label}
            value={stat.value}
            iconType={stat.icon}
            id={stat.id}
            onClick={() => navigate(stat.path)} // Add this onClick handler
          />
        ))}
      </div>

     
      <div className="card">
        
        <ActiveJob activities={ActiveJobs} />
      </div>

      <div className="card">
        
        <ActivityTable activities={activitiesData} />
      </div>
    </>
  )

  // Placeholder components for other routes
  const ShipmentsPage = () => (
    <div className="page-container">
      <h1>Shipments Management</h1>
      <p>Track and manage all your shipments here.</p>
    </div>
  )

  const ReportsPage = () => (
    <div className="page-container">
      <h1>Reports & Analytics</h1>
      <p>View detailed reports and analytics about your freight operations.</p>
    </div>
  )

  const SettingsPage = () => (
    <div className="page-container">
      <h1>Settings</h1>
      <p>Configure your application settings and preferences.</p>
    </div>
  )

  const WarehousePage = () => (
    <div className="page-container">
      <h1>Warehouse Management</h1>
      <p>Manage your warehouse operations and inventory.</p>
    </div>
  )

  const JobOrdersPage = () => (
    <div className="page-container">
      <h1>Job Orders</h1>
      <p>Create and manage job orders for freight operations.</p>
    </div>
  )
  // Add these component definitions before the return statement
const InvoicesPage = () => (
  <div className="page-container">
    <h1>Invoices</h1>
    <p>View and manage all your invoices here.</p>
  </div>
)

const MessagesPage = () => (
  <div className="page-container">
    <h1>Messages</h1>
    <p>View and manage all your messages here.</p>
  </div>
)
return (
    <div className="dashboard-container">
      <Sidebar mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerPage />} />
            <Route path="/new-shipment" element={<NewShipments />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/warehouse" element={<WarehousePage />} />
          <Route path="/job-orders" element={<ActiveJob/>} />
          {/* Add these new routes for the other stats */}
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </main>
    </div>
  )
}


export default App
