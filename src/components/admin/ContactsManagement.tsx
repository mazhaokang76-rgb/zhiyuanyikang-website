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
  DialogTrigger,
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
  MessageSquare,
  Eye,
  Edit3
} from 'lucide-react'
import type { Contact } from '../../lib/supabase'

const ContactsManagement = () => {
  const [contactsList, setContactsList] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setContactsList(data || [])
    } catch (err: any) {
      console.error('加载客户咨询失败:', err)
      setError('加载客户咨询失败: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (contactId: number, newStatus: string) => {
    try {
      setError('')
      setSuccess('')
      
      console.log('开始更新联系人状态:', { contactId, newStatus })
      
      const { data, error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', contactId)
        .select()

      if (error) {
        console.error('Supabase更新错误:', error)
        throw error
      }
      
      console.log('更新结果:', data)
      
      // 重新加载联系人列表
      await loadContacts()
      setSuccess(`状态已成功更新为: ${newStatus === 'new' ? '新咨询' : newStatus === 'contacted' ? '已联系' : '已关闭'}`)
      
      // 更新当前选中的联系人状态
      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus })
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

  const openDetailDialog = (contact: Contact) => {
    setSelectedContact(contact)
    setShowDetailDialog(true)
  }

  const closeDetailDialog = () => {
    setSelectedContact(null)
    setShowDetailDialog(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="warning">新咨询</Badge>
      case 'contacted':
        return <Badge variant="success">已联系</Badge>
      case 'closed':
        return <Badge variant="secondary">已关闭</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'border-l-orange-500'
      case 'contacted': return 'border-l-green-500'
      case 'closed': return 'border-l-gray-500'
      default: return 'border-l-blue-500'
    }
  }

  const filteredContacts = contactsList.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.hospital_name && contact.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchTerm)) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">客户咨询管理</h1>
          <p className="text-gray-600 mt-1">查看和管理客户咨询信息</p>
        </div>
        <div className="text-sm text-gray-500">
          共 {contactsList.length} 条咨询记录
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
                  placeholder="搜索姓名、医院、手机或邮箱..."
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
                  <SelectItem value="new">新咨询</SelectItem>
                  <SelectItem value="contacted">已联系</SelectItem>
                  <SelectItem value="closed">已关闭</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 咨询列表 */}
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
      ) : filteredContacts.length > 0 ? (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className={`border-l-4 ${getStatusColor(contact.status)} hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => openDetailDialog(contact)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{contact.name}</h3>
                        {getStatusBadge(contact.status)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {contact.hospital_name && (
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {contact.hospital_name}
                          </div>
                        )}
                        {contact.position && (
                          <span>职位: {contact.position}</span>
                        )}
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {contact.phone}
                        </div>
                        {contact.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {contact.email}
                          </div>
                        )}
                      </div>
                      
                      {contact.interest_products && contact.interest_products.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">感兴趣产品: </span>
                          <span className="text-sm text-blue-600">{contact.interest_products.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-sm text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        查看
                      </Button>
                    </div>
                  </div>
                </div>
                
                {contact.message && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无客户咨询</h3>
            <p className="text-gray-600">还没有收到任何客户咨询信息。</p>
          </CardContent>
        </Card>
      )}

      {/* 详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>咨询详情</DialogTitle>
            <DialogDescription>
              查看客户咨询的详细信息并更新处理状态
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">姓名</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedContact.name}</p>
                </div>
                
                {selectedContact.hospital_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">医院名称</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.hospital_name}</p>
                  </div>
                )}
                
                {selectedContact.position && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">职位</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.position}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">手机号码</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedContact.phone}</p>
                </div>
                
                {selectedContact.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">邮箱地址</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.email}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">咨询时间</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedContact.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              
              {/* 感兴趣产品 */}
              {selectedContact.interest_products && selectedContact.interest_products.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">感兴趣产品</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedContact.interest_products.map((product, index) => (
                      <Badge key={index} variant="outline">{product}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 咨询内容 */}
              {selectedContact.message && (
                <div>
                  <label className="text-sm font-medium text-gray-700">咨询内容</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              )}
              
              {/* 状态更新 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">处理状态</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">当前状态：</span>
                    {getStatusBadge(selectedContact.status)}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">更改状态为：</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={selectedContact.status === 'new' ? 'default' : 'outline'}
                        onClick={() => updateContactStatus(selectedContact.id, 'new')}
                        disabled={selectedContact.status === 'new'}
                      >
                        新咨询
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedContact.status === 'contacted' ? 'default' : 'outline'}
                        onClick={() => updateContactStatus(selectedContact.id, 'contacted')}
                        disabled={selectedContact.status === 'contacted'}
                      >
                        已联系
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedContact.status === 'closed' ? 'default' : 'outline'}
                        onClick={() => updateContactStatus(selectedContact.id, 'closed')}
                        disabled={selectedContact.status === 'closed'}
                      >
                        已关闭
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

export default ContactsManagement
