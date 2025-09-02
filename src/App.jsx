import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatCard from './components/StatCard'
import ActiveJob from './components/ActiveJob'
import ActivityTable from './components/ActivityTable'
import CustomerPage from './components/CustomerPage'
import Login from './components/Login'
import NewShipments from './components/NewShipments'
import './App.css'

// 👇 create this new component in src/components/Landing.jsx
const Landing = () => (
  <div className="page-container">
    <h1>Welcome to Seal Logistics</h1>
    <p>Please <a href="/login">log in</a> to access your dashboard.</p>
  </div>
)

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const createNewShipment = () => navigate('/new-shipment')
  const creatActiveJob = () => navigate('/job-orders')

  const handleLogin = () => {
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const Dashboard = () => (
    <>
      <Header 
        toggleMobileMenu={toggleMobileMenu} 
        createNewShipment={createNewShipment}
        creatActiveJob={creatActiveJob}
        onLogout={handleLogout}
      />
      {/* your dashboard UI */}
    </>
  )

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="dashboard-container">
      {isAuthenticated && <Sidebar mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />}
      <main className="main-content">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Landing />} />

          {/* Login page */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} 
          />

          {/* Protected routes */}
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