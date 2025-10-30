import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { supabase } from '../../lib/supabase'
import {
  Users,
  FileText,
  MessageSquare,
  Award,
  TrendingUp,
  Calendar,
  Eye,
  Clock
} from 'lucide-react'

interface Stats {
  totalContacts: number
  totalDemoRequests: number
  totalNews: number
  totalCases: number
  newContactsThisMonth: number
  pendingDemos: number
  draftNews: number
}

interface RecentActivity {
  id: number
  type: 'contact' | 'demo' | 'news' | 'case'
  title: string
  time: string
  status: string
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    totalDemoRequests: 0,
    totalNews: 0,
    totalCases: 0,
    newContactsThisMonth: 0,
    pendingDemos: 0,
    draftNews: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // 加载统计数据
      const [contactsRes, demosRes, newsRes, casesRes] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact' }),
        supabase.from('demo_requests').select('*', { count: 'exact' }),
        supabase.from('news').select('*', { count: 'exact' }),
        supabase.from('product_cases').select('*', { count: 'exact' })
      ])

      // 计算本月新增咨询
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: monthlyContacts } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .gte('created_at', `${currentMonth}-01`)

      // 待处理的演示预约
      const { data: pendingDemos } = await supabase
        .from('demo_requests')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')

      // 草稿状态的新闻
      const { data: draftNews } = await supabase
        .from('news')
        .select('*', { count: 'exact' })
        .eq('status', 'draft')

      setStats({
        totalContacts: contactsRes.count || 0,
        totalDemoRequests: demosRes.count || 0,
        totalNews: newsRes.count || 0,
        totalCases: casesRes.count || 0,
        newContactsThisMonth: monthlyContacts?.length || 0,
        pendingDemos: pendingDemos?.length || 0,
        draftNews: draftNews?.length || 0
      })

      // 加载最近活动
      const activities: RecentActivity[] = []
      
      // 最近的咨询
      const { data: recentContacts } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      
      recentContacts?.forEach(contact => {
        activities.push({
          id: contact.id,
          type: 'contact',
          title: `新用户咨询: ${contact.name}`,
          time: new Date(contact.created_at).toLocaleString('zh-CN'),
          status: contact.status
        })
      })

      // 最近的演示预约
      const { data: recentDemos } = await supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2)
      
      recentDemos?.forEach(demo => {
        activities.push({
          id: demo.id,
          type: 'demo',
          title: `演示预约: ${demo.contact_name}`,
          time: new Date(demo.created_at).toLocaleString('zh-CN'),
          status: demo.status
        })
      })

      // 按时间排序
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setRecentActivities(activities.slice(0, 8))

    } catch (error) {
      console.error('加载仪表盘数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (type: string, status: string) => {
    if (type === 'contact') {
      switch (status) {
        case 'new': return <Badge variant="warning">新咨询</Badge>
        case 'contacted': return <Badge variant="success">已联系</Badge>
        case 'closed': return <Badge variant="secondary">已关闭</Badge>
        default: return <Badge>{status}</Badge>
      }
    }
    if (type === 'demo') {
      switch (status) {
        case 'pending': return <Badge variant="warning">待处理</Badge>
        case 'scheduled': return <Badge variant="success">已安排</Badge>
        case 'completed': return <Badge variant="secondary">已完成</Badge>
        default: return <Badge>{status}</Badge>
      }
    }
    return <Badge>{status}</Badge>
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact': return <Users className="h-4 w-4" />
      case 'demo': return <MessageSquare className="h-4 w-4" />
      case 'news': return <FileText className="h-4 w-4" />
      case 'case': return <Award className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-600 mt-1">欢迎回到智缘益慷管理后台</p>
        </div>
        <div className="text-sm text-gray-500">
          最后更新: {new Date().toLocaleString('zh-CN')}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总咨询数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                <p className="text-xs text-green-600">本月新增 {stats.newContactsThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">演示预约</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDemoRequests}</p>
                <p className="text-xs text-orange-600">待处理 {stats.pendingDemos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">公司动态</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNews}</p>
                <p className="text-xs text-gray-600">草稿 {stats.draftNews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">成功案例</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCases}</p>
                <p className="text-xs text-blue-600">已发布</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              最近活动
            </CardTitle>
            <CardDescription>最近的系统活动和更新</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(activity.type, activity.status)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">暂无最近活动</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              快速操作
            </CardTitle>
            <CardDescription>常用的管理功能快捷入口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.href = '/admin/news'}
                className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">新增动态</p>
                <p className="text-sm text-gray-600">发布公司新闻</p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin/cases'}
                className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Award className="h-8 w-8 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">添加案例</p>
                <p className="text-sm text-gray-600">管理成功案例</p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin/contacts'}
                className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">查看咨询</p>
                <p className="text-sm text-gray-600">处理客户咨询</p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin/deploy'}
                className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                <p className="font-medium text-gray-900">一键发布</p>
                <p className="text-sm text-gray-600">更新网站内容</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
