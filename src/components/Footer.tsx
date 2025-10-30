import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Bottom bar - 只保留版权信息 */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} 上海智缘益慷科技有限公司. 保留所有权利.
          </p>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-colors duration-200 z-40"
        style={{ willChange: 'auto' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}

export default Footer