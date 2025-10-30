import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import DatabaseSetup from './components/DatabaseSetup'

// Main website components
import Header from './components/Header'
import Hero from './components/Hero'
import Solutions from './components/Solutions'
import Technology from './components/Technology'
import Cases from './components/Cases'
import Resources from './components/Resources'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Admin components
import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/Dashboard'
import NewsManagement from './components/admin/NewsManagement'
import CasesManagement from './components/admin/CasesManagement'
import ContactsManagement from './components/admin/ContactsManagement'
import DemosManagement from './components/admin/DemosManagement'
import DeployManagement from './components/admin/DeployManagement'
import { useAuth } from './contexts/AuthContext'

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Main website component
const MainWebsite = () => {
  useEffect(() => {
    // 处理 URL hash 滚动
    const scrollToHash = () => {
      const hash = window.location.hash.substring(1)
      if (hash) {
        // 延迟执行以确保页面已完全加载
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            // 获取元素位置并减去头部高度
            const headerHeight = 80 // Header高度大约为80px
            const elementPosition = element.offsetTop - headerHeight
            
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth'
            })
          }
        }, 100)
      }
    }

    // 页面加载时滚动
    scrollToHash()

    // 监听 hash 变化
    window.addEventListener('hashchange', scrollToHash)
    
    // 监听导航点击事件，确保添加到所有链接
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        const hash = target.getAttribute('href')?.substring(1)
        if (hash) {
          setTimeout(() => {
            const element = document.getElementById(hash)
            if (element) {
              const headerHeight = 80
              const elementPosition = element.offsetTop - headerHeight
              
              window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
              })
            }
          }, 50)
        }
      }
    }

    document.addEventListener('click', handleClick)
    
    return () => {
      window.removeEventListener('hashchange', scrollToHash)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Solutions />
        <Technology />
        <Cases />
        <Resources />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

// Protected admin routes
const AdminRoutes = () => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <AdminLogin />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="news" element={<NewsManagement />} />
        <Route path="cases" element={<CasesManagement />} />
        <Route path="contacts" element={<ContactsManagement />} />
        <Route path="demos" element={<DemosManagement />} />
        <Route path="deploy" element={<DeployManagement />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

function App() {
  // 检查是否是数据库设置页面
  const isSetupPage = window.location.pathname === '/setup' || window.location.hash === '#setup'
  
  if (isSetupPage) {
    return (
      <ErrorBoundary>
        <DatabaseSetup />
      </ErrorBoundary>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Admin routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
              
              {/* Main website */}
              <Route path="/" element={<MainWebsite />} />
              <Route path="/*" element={<MainWebsite />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

export default App