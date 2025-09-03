// src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatCard from './components/StatCard'
import ActiveJob from './components/ActiveJob'
import ActivityTable from './components/ActivityTable'
import CustomerPage from './components/CustomerPage'
import Login from './components/Login'
import './App.css'
import NewShipments from './components/NewShipments'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    // More robust token validation
    if (token && isValidToken(token)) {
      setIsAuthenticated(true)
      // Redirect to dashboard if authenticated and on login page
      if (window.location.pathname === '/login') {
        navigate('/dashboard', { replace: true })
      }
    } else {
      localStorage.removeItem('authToken')
      setIsAuthenticated(false)
      // Redirect to login if not authenticated and trying to access protected routes
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true })
      }
    }
    setIsLoading(false)
  }, [navigate])

  // Helper function to validate token
  const isValidToken = (token) => {
    return token !== "undefined" && 
           token !== "null" && 
           token.trim() !== "" &&
           token.length > 10 // Basic validation
  }

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
    navigate('/new-shipment')
  }

  const creatActiveJob = () => {
    navigate('/job-orders')
  }

  const handleLogin = () => {
    // Generate a more realistic fake token
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    
    // Save token to localStorage
    localStorage.setItem("authToken", fakeToken)
    
    // Update state
    setIsAuthenticated(true)
    
    // Redirect to dashboard
    navigate("/dashboard", { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setIsAuthenticated(false)
    navigate('/login', { replace: true })
  }

  // Dashboard component
  const Dashboard = () => (
    <>
      <Header 
        toggleMobileMenu={toggleMobileMenu} 
        createNewShipment={createNewShipment}
        creatActiveJob={creatActiveJob}
        onLogout={handleLogout}
      />
      
      <div className="stats-grid">
        {statsData.map(stat => (
          <StatCard 
            key={stat.id}
            label={stat.label}
            value={stat.value}
            iconType={stat.icon}
            id={stat.id}
            onClick={() => navigate(stat.path)}
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
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {isAuthenticated && <Sidebar mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />}
      <main className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />

          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />

        
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/customers" 
    element={
      <ProtectedRoute>
        <CustomerPage />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/new-shipment" 
    element={
      <ProtectedRoute>
        <NewShipments />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/reports" 
    element={
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/settings" 
    element={
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/warehouse" 
    element={
      <ProtectedRoute>
        <WarehousePage />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/job-orders" 
    element={
      <ProtectedRoute>
        <ActiveJob activities={ActiveJobs} />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/invoices" 
    element={
      <ProtectedRoute>
        <InvoicesPage />
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/messages" 
    element={
      <ProtectedRoute>
        <MessagesPage />
      </ProtectedRoute>
    } 
  />
</Routes>

      </main>
    </div>
  )
}

export default App