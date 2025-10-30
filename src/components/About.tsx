import React from 'react'
import { Target, Users, Lightbulb, Globe, Award, Handshake } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: '使命',
      description: 'Bring Digital Rehab Solutions to Chinese patients!'
    },
    {
      icon: <Globe className="w-8 h-8 text-green-600" />,
      title: '愿景目标',
      description: '成为先进的数字化康复方案提供商，赋能康复机构，造福康复患者'
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-purple-600" />,
      title: '核心价值',
      description: 'AI驱动，数字创新，关爱病人'
    }
  ]

  const milestones = [
    {
      year: '2018',
      title: '公司成立',
      description: '上海智缘益慷科技成立，专注康复信息化领域'
    },
    {
      year: '2020',
      title: '产品初期',
      description: '推出第一代康复管理系统，服务华东区域50+医院'
    },
    {
      year: '2022',
      title: '技术突破',
      description: '发布AI康复大模型，实现智能化评估和治疗方案生成'
    },
    {
      year: '2024',
      title: '全国布局',
      description: '服务网络覆盖全国，合作医院突破500家，患者受益50万+'
    },
    {
      year: '2025',
      title: '国际认可',
      description: '荣获国际数字化康复创新奖，正式开始国际化布局'
    }
  ]

  const team = [
    {
      name: '张博士',
      title: '创始人 & CEO',
      description: '康复医学博士，10年临床经验，专注数字化康复研究',
      image: '/images/medical-team.png'
    },
    {
      name: '李博士',
      title: 'CTO & 技术总监',
      description: '计算机科学博士，前BAT技术专家，人工智能领域专家',
      image: '/images/medical-team.png'
    },
    {
      name: '王主任',
      title: '医学顾问',
      description: '康复医学主任医师，30年临床经验，国内康复医学权威',
      image: '/images/medical-team.png'
    }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            关于智缘益慷
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们致力于通过先进的AI技术和数字化解决方案，为康复医疗行业带来革命性变化，
            服务健康中国2030，应对老龄化挑战
          </p>
        </div>

        {/* Company Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* 已移除：发展历程模块 */}

        {/* 已移除：核心团队模块 */}


      </div>
    </section>
  )
}

export default About