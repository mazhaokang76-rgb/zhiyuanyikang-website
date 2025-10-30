import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import {
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  Clock,
  Eye,
  Edit3,
  PlayCircle
} from 'lucide-react'
import type { DemoRequest } from '../../lib/supabase'

const DemosManagement = () => {
  const [demosList, setDemosList] = useState<DemoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDemo, setSelectedDemo] = useState<DemoRequest | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadDemos()
  }, [])

  const loadDemos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDemosList(data || [])
    } catch (err: any) {
      console.error('加载演示预约失败:', err)
      setError('加载演示预约失败: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateDemoStatus = async (demoId: number, newStatus: string) => {
    try {
      setError('')
      setSuccess('')
      
      console.log('开始更新演示预约状态:', { demoId, newStatus })
      
      const { data, error } = await supabase
        .from('demo_requests')
        .update({ status: newStatus })
        .eq('id', demoId)
        .select()

      if (error) {
        console.error('Supabase更新错误:', error)
        throw error
      }
      
      console.log('更新结果:', data)
      
      // 重新加载演示预约列表
      await loadDemos()
      setSuccess(`状态已成功更新为: ${newStatus === 'pending' ? '待处理' : newStatus === 'scheduled' ? '已安排' : newStatus === 'completed' ? '已完成' : newStatus === 'cancelled' ? '已取消' : newStatus}`)
      
      // 更新当前选中的演示预约状态
      if (selectedDemo && selectedDemo.id === demoId) {
        setSelectedDemo({ ...selectedDemo, status: newStatus })
      }
      
      // 8秒后清除成功消息
      setTimeout(() => setSuccess(''), 8000)
      
    } catch (err: any) {
      console.error('更新状态失败详细信息:', err)
      const errorMessage = err.message || '未知错误'
      setError(`状态更新失败: ${errorMessage}`)
      // 8秒后清除错误消息
      setTimeout(() => setError(''), 8000)
    }
  }

  const openDetailDialog = (demo: DemoRequest) => {
    setSelectedDemo(demo)
    setShowDetailDialog(true)
  }

  const closeDetailDialog = () => {
    setSelectedDemo(null)
    setShowDetailDialog(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">待处理</Badge>
      case 'scheduled':
        return <Badge variant="success">已安排</Badge>
      case 'completed':
        return <Badge variant="secondary">已完成</Badge>
      case 'cancelled':
        return <Badge variant="destructive">已取消</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-l-orange-500'
      case 'scheduled': return 'border-l-green-500'
      case 'completed': return 'border-l-blue-500'
      case 'cancelled': return 'border-l-red-500'
      default: return 'border-l-gray-500'
    }
  }

  const filteredDemos = demosList.filter(demo => {
    const matchesSearch = 
      demo.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (demo.hospital_name && demo.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (demo.phone && demo.phone.includes(searchTerm)) ||
      (demo.email && demo.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (demo.preferred_product && demo.preferred_product.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || demo.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">演示预约管理</h1>
          <p className="text-gray-600 mt-1">管理客户演示预约申请</p>
        </div>
        <div className="text-sm text-gray-500">
          共 {demosList.length} 条预约记录
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索姓名、医院、手机、邮箱或产品..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="筛选状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="scheduled">已安排</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 预约列表 */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDemos.length > 0 ? (
        <div className="space-y-4">
          {filteredDemos.map((demo) => (
            <Card key={demo.id} className={`border-l-4 ${getStatusColor(demo.status)} hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => openDetailDialog(demo)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <PlayCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{demo.contact_name}</h3>
                        {getStatusBadge(demo.status)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {demo.hospital_name && (
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {demo.hospital_name}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {demo.phone}
                        </div>
                        {demo.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {demo.email}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                        {demo.preferred_product && (
                          <span className="text-blue-600">产品: {demo.preferred_product}</span>
                        )}
                        {demo.preferred_time && (
                          <div className="flex items-center text-green-600">
                            <Clock className="h-4 w-4 mr-1" />
                            期望时间: {demo.preferred_time}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-sm text-gray-500">
                      {new Date(demo.created_at).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        查看
                      </Button>
                    </div>
                  </div>
                </div>
                
                {demo.message && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-2">{demo.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无演示预约</h3>
            <p className="text-gray-600">还没有收到任何演示预约申请。</p>
          </CardContent>
        </Card>
      )}

      {/* 详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>演示预约详情</DialogTitle>
            <DialogDescription>
              查看演示预约的详细信息并更新处理状态
            </DialogDescription>
          </DialogHeader>
          
          {selectedDemo && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">联系人</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDemo.contact_name}</p>
                </div>
                
                {selectedDemo.hospital_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">医院名称</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDemo.hospital_name}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">手机号码</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDemo.phone}</p>
                </div>
                
                {selectedDemo.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">邮箱地址</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDemo.email}</p>
                  </div>
                )}
                
                {selectedDemo.preferred_product && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">感兴趣产品</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDemo.preferred_product}</p>
                  </div>
                )}
                
                {selectedDemo.preferred_time && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">期望演示时间</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDemo.preferred_time}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">申请时间</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedDemo.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              
              {/* 附加信息 */}
              {selectedDemo.message && (
                <div>
                  <label className="text-sm font-medium text-gray-700">附加信息</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedDemo.message}</p>
                  </div>
                </div>
              )}
              
              {/* 状态更新 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">处理状态</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">当前状态：</span>
                    {getStatusBadge(selectedDemo.status)}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">更改状态为：</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={selectedDemo.status === 'pending' ? 'default' : 'outline'}
                        onClick={() => updateDemoStatus(selectedDemo.id, 'pending')}
                        disabled={selectedDemo.status === 'pending'}
                      >
                        待处理
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedDemo.status === 'scheduled' ? 'default' : 'outline'}
                        onClick={() => updateDemoStatus(selectedDemo.id, 'scheduled')}
                        disabled={selectedDemo.status === 'scheduled'}
                      >
                        已安排
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedDemo.status === 'completed' ? 'default' : 'outline'}
                        onClick={() => updateDemoStatus(selectedDemo.id, 'completed')}
                        disabled={selectedDemo.status === 'completed'}
                      >
                        已完成
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedDemo.status === 'cancelled' ? 'default' : 'outline'}
                        onClick={() => updateDemoStatus(selectedDemo.id, 'cancelled')}
                        disabled={selectedDemo.status === 'cancelled'}
                      >
                        已取消
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* 内联状态消息 */}
                {(error || success) && (
                  <div className="mt-2">
                    {error && (
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="bg-green-50 border-green-200 py-2">
                        <AlertDescription className="text-green-800 text-sm">{success}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 成功/错误消息 */}
      {(error || success) && (
        <div className="fixed bottom-4 right-4 z-50">
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}

export default DemosManagement
