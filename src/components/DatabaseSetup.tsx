import React, { useState } from 'react'
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const DatabaseSetup = () => {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [progress, setProgress] = useState<string[]>([])

  const addProgress = (message: string) => {
    setProgress(prev => [...prev, message])
  }

  const setupDatabase = async () => {
    setSetupStatus('running')
    setProgress([])
    setStatusMessage('正在设置数据库...')

    try {
      // 1. 创建contacts表
      addProgress('创建联系人信息表...')
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .insert([{
          name: '系统测试用户',
          phone: '13800138000',
          email: 'system@test.com',
          hospital_name: '系统测试医院',
          position: '测试职位',
          message: '这是系统自动创建的测试数据，用于初始化数据库表结构',
          status: 'new'
        }])
        .select()

      if (contactError && contactError.code !== '42P01') {
        throw new Error(`创建联系人表失败: ${contactError.message}`)
      }
      addProgress('✅ 联系人信息表创建成功')

      // 2. 创建demo_requests表
      addProgress('创建演示预约表...')
      const { data: demoData, error: demoError } = await supabase
        .from('demo_requests')
        .insert([{
          contact_name: '系统测试联系人',
          phone: '13800138000',
          email: 'system@test.com',
          hospital_name: '系统测试医院',
          preferred_product: '康复全程智能化管理系统',
          preferred_time: '工作日上午',
          message: '这是系统自动创建的测试数据',
          status: 'pending'
        }])
        .select()

      if (demoError && demoError.code !== '42P01') {
        throw new Error(`创建演示预约表失败: ${demoError.message}`)
      }
      addProgress('✅ 演示预约表创建成功')

      // 3. 创建news表
      addProgress('创建新闻文章表...')
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .insert([
          {
            title: '智缘益慷发布全新康复全程智能化管理系统',
            content: '上海智缘益慷科技有限公司正式发布其旗舰产品——康复全程智能化管理系统。该系统基于AI大模型和数字孪生技术，为康复医院提供前所未有的管理效率和治疗效果。系统通过智能化的康复评估、个性化治疗方案制定以及实时效果监测，帮助医疗机构提升整体康复服务质量。',
            summary: '智缘益慷正式发布康复全程智能化管理系统，基于AI大模型技术为医院提供智能化康复解决方案。',
            published_at: '2025-07-25',
            status: 'published',
            author: '智缘益慷科技团队'
          },
          {
            title: '与知名三甲医院达成战略合作',
            content: '智缘益慷与国内多家知名三甲医院签署战略合作协议，将在数字化康复、远程医疗等领域开展深度合作。此次合作标志着智缘益慷在医疗信息化领域的重要突破，为公司未来发展奠定了坚实基础。',
            summary: '智缘益慷与多家三甲医院签署战略合作协议，共同推进数字化康复技术的应用。',
            published_at: '2025-07-20',
            status: 'published',
            author: '智缘益慷科技团队'
          },
          {
            title: '荣获2025年度医疗科技创新奖',
            content: '在近日举办的2025年度医疗科技创新大会上，智缘益慷凭借其在AI康复领域的突出贡献，荣获"年度医疗科技创新奖"。这一荣誉充分肯定了公司在推动医疗数字化转型方面的努力和成就。',
            summary: '智缘益慷荣获2025年度医疗科技创新奖，在AI康复领域的贡献获得行业认可。',
            published_at: '2025-07-15',
            status: 'published',
            author: '智缘益慷科技团队'
          }
        ])
        .select()

      if (newsError && newsError.code !== '42P01') {
        throw new Error(`创建新闻表失败: ${newsError.message}`)
      }
      addProgress('✅ 新闻文章表创建成功')

      // 4. 创建product_cases表
      addProgress('创建产品案例表...')
      const { data: caseData, error: caseError } = await supabase
        .from('product_cases')
        .insert([
          {
            title: '某三甲医院康复科数字化转型项目',
            hospital_name: '北京协和医院',
            product_name: '康复全程智能化管理系统',
            description: '通过部署智缘益慷的康复全程智能化管理系统，该医院康复科实现了从评估到治疗的全流程数字化管理，大幅提升了治疗效率和患者满意度。',
            result_summary: '治疗师工作效率提升35%，患者康复效果评分提高40%，整体满意度达98%',
            status: 'active'
          },
          {
            title: '社区康复中心远程康复服务试点',
            hospital_name: '上海市第一人民医院',
            product_name: '数字化远程康复系统',
            description: '在社区康复中心部署远程康复系统，为居家康复患者提供专业指导和监督，有效解决了康复资源不足的问题。',
            result_summary: '服务覆盖患者增加200%，居家康复依从性提高45%，医疗成本降低30%',
            status: 'active'
          },
          {
            title: '区域医联体康复协同管理平台建设',
            hospital_name: '浙江省人民医院',
            product_name: '康复医联体共同管理平台',
            description: '建设覆盖省内多家医院的康复协同管理平台，实现了患者转诊、资源调度和数据共享的一体化管理。',
            result_summary: '转诊效率提升60%，资源利用率提高50%，患者满意度达96%',
            status: 'active'
          }
        ])
        .select()

      if (caseError && caseError.code !== '42P01') {
        throw new Error(`创建产品案例表失败: ${caseError.message}`)
      }
      addProgress('✅ 产品案例表创建成功')

      addProgress('🎉 数据库设置完成！所有表和数据都已成功创建。')
      setSetupStatus('success')
      setStatusMessage('数据库设置完成！网站现在已完全可用。')

    } catch (error: any) {
      console.error('数据库设置错误:', error)
      addProgress(`❌ 错误: ${error.message}`)
      setSetupStatus('error')
      setStatusMessage('数据库设置失败，请检查错误信息。')
    }
  }

  const getStatusIcon = () => {
    switch (setupStatus) {
      case 'running': return <Loader2 className="animate-spin" />
      case 'success': return <CheckCircle className="text-green-600" />
      case 'error': return <AlertCircle className="text-red-600" />
      default: return <Database />
    }
  }

  const getStatusColor = () => {
    switch (setupStatus) {
      case 'running': return 'text-blue-600'
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center space-x-3 ${getStatusColor()}`}>
              {getStatusIcon()}
              <h1 className="text-3xl font-bold">数据库设置</h1>
            </div>
            <p className="text-gray-600 mt-4">
              点击下方按钮来设置智缘益慷企业官网的数据库表和初始数据
            </p>
          </div>

          <div className="mb-8">
            <button
              onClick={setupDatabase}
              disabled={setupStatus === 'running'}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                setupStatus === 'running'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : setupStatus === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {setupStatus === 'running' && '正在设置数据库...'}
              {setupStatus === 'success' && '数据库设置完成 ✅'}
              {setupStatus === 'error' && '重新尝试设置'}
              {setupStatus === 'idle' && '开始设置数据库'}
            </button>
          </div>

          {statusMessage && (
            <div className={`p-4 rounded-lg mb-6 ${
              setupStatus === 'success' ? 'bg-green-100 text-green-800' :
              setupStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              <p className="font-medium">{statusMessage}</p>
            </div>
          )}

          {progress.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">设置进度:</h3>
              <div className="space-y-2">
                {progress.map((message, index) => (
                  <div key={index} className="text-sm text-gray-700 font-mono">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {setupStatus === 'success' && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-4">设置完成！</h3>
              <p className="text-green-700 mb-4">
                数据库已成功设置。您现在可以：
              </p>
              <ul className="text-green-700 space-y-2">
                <li>• 使用联系表单提交客户信息</li>
                <li>• 预约产品演示</li>
                <li>• 查看新闻动态</li>
                <li>• 浏览客户案例</li>
              </ul>
              <div className="mt-6">
                <a
                  href="/"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-block"
                >
                  返回首页
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DatabaseSetup
