import React, { useState } from 'react'
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react'
import { submitContact, submitDemoRequest } from '../lib/supabase'

const Contact = () => {
  const [activeTab, setActiveTab] = useState('contact')
  const [contactForm, setContactForm] = useState({
    name: '',
    hospital_name: '',
    position: '',
    phone: '',
    email: '',
    message: '',
    interest_products: [] as string[]
  })
  const [demoForm, setDemoForm] = useState({
    contact_name: '',
    hospital_name: '',
    phone: '',
    email: '',
    preferred_product: '',
    preferred_time: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const products = [
    '康复全程智能化管理系统',
    '数字化远程康复系统',
    '康复医联体共同管理平台',
    '智能化病人随访系统',
    '智能化慢病管理系统'
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await submitContact(contactForm)
      setSuccess(result.data.message)
      setContactForm({
        name: '',
        hospital_name: '',
        position: '',
        phone: '',
        email: '',
        message: '',
        interest_products: []
      })
      // 5秒后清除成功消息
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setError(err.message || '提交失败，请稍后重试')
      // 5秒后清除错误消息
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await submitDemoRequest(demoForm)
      setSuccess(result.data.message)
      setDemoForm({
        contact_name: '',
        hospital_name: '',
        phone: '',
        email: '',
        preferred_product: '',
        preferred_time: '',
        message: ''
      })
      // 5秒后清除成功消息
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: any) {
      console.error('Demo submission error:', err)
      setError(err.message || '提交失败，请稍后重试')
      // 5秒后清除错误消息
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleProductToggle = (product: string) => {
    setContactForm(prev => ({
      ...prev,
      interest_products: prev.interest_products.includes(product)
        ? prev.interest_products.filter(p => p !== product)
        : [...prev.interest_products, product]
    }))
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setError('')
    setSuccess('')
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            联系我们
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            准备好开启您医院的数字化康复之旅了吗？我们的专家团队随时为您提供支持
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                联系方式
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">电话咨询</h4>
                    <p className="text-gray-600">13910180455</p>
                    <p className="text-sm text-gray-500">工作日 9:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">邮箱咨询</h4>
                    <p className="text-gray-600">info@zyykhc.com</p>
                    <p className="text-sm text-gray-500">专业团队24小时内回复</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">公司地址</h4>
                    <p className="text-gray-600">上海市浦东新区历城路70号甲二楼</p>
                    <p className="text-sm text-gray-500">欢迎预约实地参观</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4" id="contact-info" style={{scrollMarginTop: '120px'}}>
                  <div className="bg-green-100 rounded-lg p-3">
                    <img src="/images/wechat-qr.jpg" alt="微信公众号" className="w-6 h-6 rounded" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">官方微信公众号</h4>
                    <img 
                      src="/images/wechat-qr.jpg" 
                      alt="智缘益慷官方微信公众号" 
                      className="w-32 h-32 rounded-lg mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">扫码关注获取最新产品资讯</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">
                为什么选择智缘益慷？
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>5年+康复信息化行业经验</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>500+合作医疗机构信赖</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>7*24小时技术支持服务</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>自主研发核心技术，持续创新</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Forms */}
          <div className="bg-gray-50 rounded-2xl p-8">
            {/* Tab navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => handleTabChange('contact')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'contact'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                联系咨询
              </button>
              <button
                onClick={() => handleTabChange('demo')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'demo'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                预约演示
              </button>
            </div>



            {/* Contact Form */}
            {activeTab === 'contact' && (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({...prev, name: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      医院名称
                    </label>
                    <input
                      type="text"
                      value={contactForm.hospital_name}
                      onChange={(e) => setContactForm(prev => ({...prev, hospital_name: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入医院名称"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      职位
                    </label>
                    <input
                      type="text"
                      value={contactForm.position}
                      onChange={(e) => setContactForm(prev => ({...prev, position: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="如：康复科主任"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      电话 *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({...prev, phone: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的电话"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入您的邮箱"
                  />
                </div>
                <div id="demo-form" style={{scrollMarginTop: '120px'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    感兴趣的产品（可多选）
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {products.map((product) => (
                      <label key={product} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contactForm.interest_products.includes(product)}
                          onChange={() => handleProductToggle(product)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{product}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    留言
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请描述您的具体需求..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>提交咨询</span>
                    </>
                  )}
                </button>
                
                {/* Contact Form Messages */}
                {activeTab === 'contact' && success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {success}
                    </div>
                  </div>
                )}
                {activeTab === 'contact' && error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    {error}
                  </div>
                )}
              </form>
            )}

            {/* Demo Request Form */}
            {activeTab === 'demo' && (
              <form onSubmit={handleDemoSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系人 *
                    </label>
                    <input
                      type="text"
                      required
                      value={demoForm.contact_name}
                      onChange={(e) => setDemoForm(prev => ({...prev, contact_name: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      医院名称
                    </label>
                    <input
                      type="text"
                      value={demoForm.hospital_name}
                      onChange={(e) => setDemoForm(prev => ({...prev, hospital_name: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入医院名称"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      电话 *
                    </label>
                    <input
                      type="tel"
                      required
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm(prev => ({...prev, phone: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的电话"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm(prev => ({...prev, email: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的邮箱"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    希望演示的产品
                  </label>
                  <select
                    value={demoForm.preferred_product}
                    onChange={(e) => setDemoForm(prev => ({...prev, preferred_product: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择产品</option>
                    {products.map((product) => (
                      <option key={product} value={product}>{product}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    希望演示时间
                  </label>
                  <input
                    type="datetime-local"
                    value={demoForm.preferred_time}
                    onChange={(e) => setDemoForm(prev => ({...prev, preferred_time: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    特殊需求
                  </label>
                  <textarea
                    value={demoForm.message}
                    onChange={(e) => setDemoForm(prev => ({...prev, message: e.target.value}))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请描述您的具体需求或希望了解的内容..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>预约演示</span>
                    </>
                  )}
                </button>
                
                {/* Demo Form Messages */}
                {activeTab === 'demo' && success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {success}
                    </div>
                  </div>
                )}
                {activeTab === 'demo' && error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    {error}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact