import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Upload,
  LogOut,
  Menu,
  X,
  Home,
  Award
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: '仪表盘',
      path: '/admin/dashboard'
    },
    {
      icon: FileText,
      label: '公司动态',
      path: '/admin/news'
    },
    {
      icon: Award,
      label: '成功案例',
      path: '/admin/cases'
    },
    {
      icon: Users,
      label: '客户咨询',
      path: '/admin/contacts'
    },
    {
      icon: MessageSquare,
      label: '预约演示',
      path: '/admin/demos'
    },
    {
      icon: Upload,
      label: '发布管理',
      path: '/admin/deploy'
    }
  ]

  const MenuLink = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location.pathname === item.path
    const Icon = item.icon
    
    return (
      <button
        onClick={() => {
          navigate(item.path)
          setSidebarOpen(false)
        }}
        className={cn(
          'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
          isActive
            ? 'bg-blue-100 text-blue-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-3">
              <img 
                src="/images/zhiyuan-logo.png" 
                alt="智缘益慷" 
                className="h-8 w-8"
              />
              <h1 className="text-xl font-bold text-gray-900">
                智缘益慷管理后台
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/', '_blank')}
              className="hidden md:flex"
            >
              <Home className="h-4 w-4 mr-2" />
              访问网站
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">管理员</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {menuItems.map((item, index) => (
                  <MenuLink key={index} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* 遮罩层 */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 主要内容区域 */}
        <main className="flex-1 relative overflow-hidden">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
