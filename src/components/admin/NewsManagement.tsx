import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import ImageUpload from './ImageUpload'
import RichTextEditor from './RichTextEditor'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  FileText
} from 'lucide-react'
import type { News } from '../../lib/supabase'

interface NewsFormData {
  title: string
  content: string
  summary: string
  image_url: string
  status: 'draft' | 'published' | 'archived'
  author: string
}

const NewsManagement = () => {
  const { user } = useAuth()
  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDialog, setShowDialog] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    summary: '',
    image_url: '',
    status: 'draft',
    author: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNewsList(data || [])
    } catch (err: any) {
      console.error('加载公司动态失败:', err)
      setError('加载公司动态失败: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const openDialog = (news?: News) => {
    if (news) {
      setEditingNews(news)
      setFormData({
        title: news.title,
        content: news.content || '',
        summary: news.summary || '',
        image_url: news.image_url || '',
        status: news.status as 'draft' | 'published' | 'archived',
        author: news.author || user?.email || ''
      })
    } else {
      setEditingNews(null)
      setFormData({
        title: '',
        content: '',
        summary: '',
        image_url: '',
        status: 'draft',
        author: user?.email || ''
      })
    }
    setError('')
    setSuccess('')
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
    setEditingNews(null)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('请输入文章标题')
      return
    }
    
    if (!formData.content.trim()) {
      setError('请输入文章内容')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const newsData = {
        ...formData,
        published_at: formData.status === 'published' 
          ? (editingNews?.status !== 'published' ? new Date().toISOString() : editingNews.published_at)
          : null,
        updated_at: new Date().toISOString()
      }

      if (editingNews) {
        // 更新
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', editingNews.id)

        if (error) throw error
        setSuccess('公司动态更新成功！')
      } else {
        // 新增
        const { error } = await supabase
          .from('news')
          .insert([{
            ...newsData,
            created_at: new Date().toISOString()
          }])

        if (error) throw error
        setSuccess('公司动态创建成功！')
      }

      await loadNews()
      
      setTimeout(() => {
        closeDialog()
      }, 1500)

    } catch (err: any) {
      console.error('保存公司动态失败:', err)
      setError('保存失败: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇动态吗？')) return

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadNews()
      setSuccess('公司动态删除成功！')
    } catch (err: any) {
      console.error('删除公司动态失败:', err)
      setError('删除失败: ' + err.message)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">已发布</Badge>
      case 'draft':
        return <Badge variant="warning">草稿</Badge>
      case 'archived':
        return <Badge variant="secondary">已归档</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredNews = newsList.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (news.summary && news.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || news.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">公司动态管理</h1>
          <p className="text-gray-600 mt-1">管理公司新闻和动态内容</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              新增动态
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? '编辑公司动态' : '新增公司动态'}
              </DialogTitle>
              <DialogDescription>
                填写下方信息来{editingNews ? '更新' : '创建'}公司动态
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <AlertDescription className="text-green-600">{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">标题 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="请输入文章标题"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="summary">摘要</Label>
                    <Input
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="请输入文章摘要"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="author">作者</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="请输入作者名称"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">状态</Label>
                    <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => 
                      setFormData({ ...formData, status: value })
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">草稿</SelectItem>
                        <SelectItem value="published">已发布</SelectItem>
                        <SelectItem value="archived">已归档</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>封面图片</Label>
                  <ImageUpload
                    currentImage={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    folder="news"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">正文内容 *</Label>
                <div className="mt-2">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    placeholder="请输入文章正文内容..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  取消
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? '保存中...' : (
                    editingNews ? '更新动态' : '创建动态'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索标题或摘要..."
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
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 动态列表 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {news.image_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg line-clamp-2 flex-1">{news.title}</h3>
                    {getStatusBadge(news.status)}
                  </div>
                  
                  {news.summary && (
                    <p className="text-gray-600 text-sm line-clamp-2">{news.summary}</p>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {news.author || '未知'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(news.created_at).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(news)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        编辑
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(news.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除
                      </Button>
                    </div>
                    
                    {news.published_at && (
                      <div className="text-xs text-gray-500">
                        发布: {new Date(news.published_at).toLocaleDateString('zh-CN')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无公司动态</h3>
            <p className="text-gray-600 mb-6">还没有创建任何公司动态，点击上方按钮开始创建。</p>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              创建首个动态
            </Button>
          </CardContent>
        </Card>
      )}

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

export default NewsManagement
