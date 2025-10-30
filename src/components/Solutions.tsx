import React from 'react'
import { Brain, Smartphone, Network, Monitor, Heart } from 'lucide-react'

const Solutions = () => {
  const solutions = [
    {
      icon: <Brain className="w-12 h-12 text-blue-600" />,
      title: '院内康复管理系统',
      subtitle: 'Digital Rehab In-hospital',
      description: '基于AI大模型的康复评估、计划制定、执行跟踪一体化管理平台',
      features: ['AI康复评估', '智能运动处方', '实时效果监测', '多学科协同'],
      metrics: '治疗师效率提升 35%',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Smartphone className="w-12 h-12 text-green-600" />,
      title: '数字化远程康复管理系统',
      subtitle: 'Digital Rehab Remote',
      description: '支持居家康复的移动智能平台，实现医患远程连接',
      features: ['居家康复指导', '实时数据上传', '远程视频指导', '智能提醒系统'],
      metrics: '患者依从性提高 40%',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Network className="w-12 h-12 text-purple-600" />,
      title: '康复医联体共同管理平台',
      subtitle: 'Digital Rehab Copilot',
      description: '构建区域康复医疗联合体，实现资源统一调度和管理',
      features: ['医院协同管理', '患者转诊系统', '资源统一调度', '数据共享平台'],
      metrics: '转诊效率提升 60%',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section id="solutions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            三大核心产品
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            基于AI技术和数字孪生理念，为康复医疗机构提供全方位的智能化解决方案
          </p>
        </div>

        {/* Solutions grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${solution.gradient} p-6 text-white`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    {solution.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{solution.title}</h3>
                    <p className="text-sm text-white/80 mt-1">{solution.subtitle}</p>
                  </div>
                </div>
                <p className="text-white/90">{solution.description}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">核心特性</h4>
                  <ul className="space-y-2">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">效果提升</p>
                  <p className="text-lg font-bold text-blue-600">{solution.metrics}</p>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <a
                    href="#contact"
                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 text-center block"
                  >
                    了解更多
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 已移除：不知道哪个产品适合您的医院 模块 */}
      </div>
    </section>
  )
}

export default Solutions