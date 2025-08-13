import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import { DEMO_MODE, DEMO_USER } from './api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    if (DEMO_MODE) localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  return isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginForm />
}

export default App