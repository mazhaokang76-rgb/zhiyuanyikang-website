import React, { useState } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: '首页', href: '#home' },
    { name: '解决方案', href: '#solutions' },
    { name: '核心技术', href: '#technology' },
    { name: '客户案例', href: '#cases' },
    { name: '关于我们', href: '#about' },
    { name: '资源中心', href: '#resources' },
    { name: '联系我们', href: '#contact' }
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">


        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/images/company-logo-new.png" 
              alt="智缘益慷科技" 
              className="h-16 md:h-20 w-auto hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="#demo-form"
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              预约产品演示
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#demo-form"
                className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-full font-medium text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                预约产品演示
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header