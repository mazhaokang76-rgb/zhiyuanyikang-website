import React, { useState, useEffect } from 'react'
import { MapPin, TrendingUp, Users, Clock } from 'lucide-react'
import { getProductCases, type ProductCase } from '../lib/supabase'

const Cases = () => {
  const [cases, setCases] = useState<ProductCase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getProductCases(3)
        setCases(data || [])
      } catch (error) {
        console.error('Error fetching cases:', error)
        setCases([])
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  if (loading) {
    return (
      <section id="cases" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="cases" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            成功案例分享
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            看看我们的合作伙伴是如何通过我们的智能化解决方案，实现康复治疗的数字化转型
          </p>
        </div>

        {/* Cases grid or empty state */}
        {cases.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={caseItem.image_url || '/images/rehabilitation-tech.jpg'}
                    alt={caseItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 text-white">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{caseItem.hospital_name}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium mb-2">
                      {caseItem.product_name}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {caseItem.description}
                    </p>
                  </div>

                  {/* Results */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">成果亮点</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {caseItem.result_summary}
                    </p>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(caseItem.created_at).getFullYear()}年</span>
                    </div>
                    <a
                      href="#contact"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      了解详情 →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                客户案例正在更新中
              </h3>
              <p className="text-gray-600 mb-8">
                我们正在整理最新的客户成功案例。如果您想了解更多关于我们产品在医疗机构的应用效果，请直接联系我们的专家团队。
              </p>
              <a
                href="#contact"
                className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
              >
                联系专家了解案例
              </a>
            </div>
          </div>
        )}

        {/* 已移除：您的医院也想实现这样的成果模块 */}
      </div>
    </section>
  )
}

export default Cases