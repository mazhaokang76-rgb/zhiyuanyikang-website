import React from 'react'
import { Cpu, Database, Shield, Zap, BarChart3, Users2 } from 'lucide-react'

const Technology = () => {
  const technologies = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-600" />,
      title: 'AI康复大模型服务',
      description: '基于深度学习的康复评估、诊断和治疗方案智能生成引擎'
    },
    {
      icon: <Users2 className="w-8 h-8 text-green-600" />,
      title: '数字孪生治疗师',
      description: '虚拟化的数字治疗师，24/7全天候为患者提供专业康复指导'
    },
    {
      icon: <Database className="w-8 h-8 text-purple-600" />,
      title: '800+标准化康复指导视频',
      description: '覆盖各种康复场景的标准化、个性化康复指导视频库'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: '多端联动技术流程闭环',
      description: '打通医院、家庭、移动端的全流程数据闭环管理'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      title: '海量真实世界数据支撑',
      description: '基于数十万患者的真实康复数据训练的AI算法模型'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: '医疗级数据安全保障',
      description: '符合医疗行业数据安全标准，保障患者隐私和数据安全'
    }
  ]

  const stats = [
    { number: '500+', label: '合作医疗机构', color: 'text-blue-600' },
    { number: '1000+', label: '注册医生用户', color: 'text-green-600' },
    { number: '50万+', label: '患者受益', color: 'text-purple-600' },
    { number: '99.9%', label: '系统稳定性', color: 'text-indigo-600' }
  ]

  return (
    <section id="technology" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            技本优势与创新能力
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们握有行业领先的核心技术，为康复医疗行业数字化转型提供强有力的技术支撑
          </p>
        </div>



        {/* Technology grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-lg p-3 shadow-md group-hover:shadow-lg transition-shadow">
                  {tech.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {tech.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}

export default Technology