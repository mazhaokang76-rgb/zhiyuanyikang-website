import React, { useState } from 'react'
import { ArrowRight, Play, Users, TrendingUp, Award, X, ExternalLink } from 'lucide-react'

const Hero = () => {
  const [showContact, setShowContact] = useState(false)

  const openContact = () => {
    setShowContact(true)
  }

  const closeContact = () => {
    setShowContact(false)
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-green-50 pt-28 md:pt-24">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full opacity-10 animate-float"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-20 left-1/4 w-8 h-8 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-green-300 rounded-full opacity-30 animate-bounce delay-75"></div>
        <div className="absolute top-1/2 left-20 w-4 h-4 bg-purple-300 rounded-full opacity-25 animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">


            {/* Main headline */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                数据智能，
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                  重塑康复全程管理
                </span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                为康复医院和综合性医院提供AI驱动的智能化康复解决方案，
                助力医疗机构提升康复治疗效率，改善患者康复体验。
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">800+</div>
                <div className="text-sm text-gray-600">标准化康复视频</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">5+</div>
                <div className="text-sm text-gray-600">院内康复系统合作医疗机构</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10+</div>
                <div className="text-sm text-gray-600">远程康复系统合作医疗机构</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={openContact}
                className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-3 rounded-full font-medium text-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-1 group whitespace-nowrap"
              >
                <Play className="w-4 h-4" />
                <span>康复视频示例</span>
              </button>
              <button
                onClick={openContact}
                className="border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-full font-medium text-sm hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-1 group whitespace-nowrap"
              >
                <Play className="w-4 h-4" />
                <span>院内康复管理系统</span>
              </button>
              <button
                onClick={openContact}
                className="border-2 border-green-500 text-green-500 px-4 py-3 rounded-full font-medium text-sm hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center justify-center space-x-1 group whitespace-nowrap"
              >
                <Play className="w-4 h-4" />
                <span>远程康复管理系统</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>服务健康中国2030</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>应对老龄化挑战</span>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative lg:scale-110 transform">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-green-100/30 rounded-3xl"></div>
            
            {/* Main image container */}
            <div className="relative z-10 p-4">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                <img
                  src="/images/zhiyuan-main.jpg"
                  alt="智能康复管理系统"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Floating badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">AI智能康复</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-40 animate-ping"></div>
            
            {/* Floating particles */}
            <div className="absolute top-1/4 left-4 w-3 h-3 bg-blue-400 rounded-full opacity-70 animate-bounce delay-75"></div>
            <div className="absolute bottom-1/4 right-8 w-2 h-2 bg-green-400 rounded-full opacity-70 animate-bounce delay-150"></div>
            <div className="absolute top-3/4 left-1/3 w-4 h-4 bg-purple-400 rounded-full opacity-50 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeContact}
              className="absolute top-4 right-4 z-10 bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">咨询演示预约</h2>
              <p className="text-gray-600 mb-6">
                感谢您对智缘益慷AI康复解决方案的关注！请留下您的联系方式，我们将尽快为您安排产品演示和详细咨询。
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入您的姓名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">医院名称</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入医院名称" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入联系电话" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入邮箱地址" />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeContact}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <span>提交预约</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Hero