import React, { useState, useEffect } from 'react'
import { Calendar, ArrowRight, Download, Eye, X } from 'lucide-react'
import { getNews, type News } from '../lib/supabase'

const Resources = () => {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<News | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAllNews, setShowAllNews] = useState(false)

  const whitepapers = [
    {
      title: '阿尔茨海默病多元康复干预中国专家共识（2025）',
      description: '中国康复医学会认知康复专业委员会，针对阿尔茨海默病多元康复干预的权威指南',
      pages: 'PDF格式',
      downloadUrl: '/documents/阿尔茨海默病多元康复干预中国专家共识（2025）.pdf'
    },
    {
      title: '认知功能障碍疾病非药物干预中国专家共识（2025版）',
      description: '中国康复医学会认知康复专业委员会，认知功能障碍疾病非药物干预权威指导',
      pages: 'PDF格式',
      downloadUrl: '/documents/认知功能障碍疾病非药物干预中国专家共识（2025版）.pdf'
    },
    {
      title: '脑卒中智能康复技术应用专家共识',
      description: '中国康复医学会，脑卒中智能康复技术应用的专业共识与实践指导',
      pages: 'PDF格式',
      downloadUrl: '/documents/脑卒中智能康复技术应用专家共识.pdf'
    }
  ]

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // 如果显示所有新闻，不限制数量；否则只显示3条
        const limit = showAllNews ? undefined : 3
        const data = await getNews(limit)
        setNews(data || [])
      } catch (error) {
        console.error('Error fetching news:', error)
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [showAllNews])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const openArticleModal = (article: News) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const closeArticleModal = () => {
    setSelectedArticle(null)
    setIsModalOpen(false)
  }

  const renderContent = (content: string) => {
    // 清理内容，移除多余的HTML标签
    const cleanContent = content
      .replace(/<p><\/p>/g, '') // 移除空的p标签
      .replace(/^<p>/, '') // 移除开头的p标签
      .replace(/<\/p>$/, '') // 移除结尾的p标签
      .replace(/<p>/g, '<p class="mb-4">') // 为p标签添加样式
    
    return { __html: cleanContent }
  }

  return (
    <section id="resources" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            资源中心
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            获取最新的行业见解、产品动态和专业资料，了解数字化康复的前沿发展
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* News Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-1 h-6 bg-blue-600 rounded mr-3"></div>
              公司动态
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">加载中...</p>
              </div>
            ) : news.length > 0 ? (
              <div className="space-y-6">
                {news.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    <div className="flex">
                      {article.image_url && (
                        <div className="flex-shrink-0 w-32 h-24">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(article.published_at || article.created_at)}</span>
                          <span className="mx-2">•</span>
                          <span>{article.author}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {article.summary || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : '')}
                        </p>
                        <button
                          onClick={() => openArticleModal(article)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                        >
                          阅读全文
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
                
                {!showAllNews && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllNews(true)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      查看更多动态
                    </button>
                  </div>
                )}
                
                {showAllNews && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllNews(false)}
                      className="inline-flex items-center text-gray-600 hover:text-gray-700 font-medium transition-colors"
                    >
                      收起动态
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  最新动态即将发布
                </h4>
                <p className="text-gray-600 mb-4">
                  我们正在准备最新的公司动态和行业资讯，敬请期待。
                </p>
                <a
                  href="#contact"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  订阅动态通知 →
                </a>
              </div>
            )}
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-1 h-6 bg-green-600 rounded mr-3"></div>
              行业白皮书
            </h3>
            
            <div className="space-y-6">
              {whitepapers.map((paper, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {paper.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {paper.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{paper.pages}</span>
                        <span className="mx-2">•</span>
                        <span>PDF格式</span>
                      </div>
                    </div>
                    <a
                      href={paper.downloadUrl}
                      className="bg-green-100 hover:bg-green-200 text-green-600 p-3 rounded-lg transition-colors duration-200 ml-4"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
              
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
                <h4 className="text-lg font-bold mb-2">
                  定制化研究报告
                </h4>
                <p className="text-white/90 mb-4">
                  需要针对您医院具体情况的专业分析报告？我们的专家团队可以为您提供定制化的研究服务。
                </p>
                <a
                  href="#contact"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
                >
                  联系咨询
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 已移除：订阅我们的行业通讯模块 */}
      </div>

      {/* Article Modal */}
      {isModalOpen && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedArticle.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(selectedArticle.published_at || selectedArticle.created_at)}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedArticle.author}</span>
                </div>
              </div>
              <button
                onClick={closeArticleModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedArticle.image_url && (
                <img
                  src={selectedArticle.image_url}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderContent(selectedArticle.content || '')}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Resources