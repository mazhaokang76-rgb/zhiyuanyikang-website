import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
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
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Award,
  Building,
  Package
} from 'lucide-react'
import type { ProductCase } from '../../lib/supabase'

interface CaseFormData {
  title: string
  hospital_name: string
  product_name: string
  description: string
  result_summary: string
  image_url: string
  status: 'draft' | 'active' | 'archived'
}

const CasesManagement = () => {
  const [casesList, setCasesList] = useState<ProductCase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDialog, setShowDialog] = useState(false)
  const [editingCase, setEditingCase] = useState<ProductCase | null>(null)
  const [formData, setFormData] = useState<CaseFormData>({
    title: '',
    hospital_name: '',
    product_name: '',
    description: '',
    result_summary: '',
    image_url: '',
    status: 'draft'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('product_cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCasesList(data || [])
    } catch (err: any) {
      console.error('加载成功案例失败:', err)
      setError('加载成功案例失败: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const openDialog = (productCase?: ProductCase) => {
    if (productCase) {
      setEditingCase(productCase)
      setFormData({
        title: productCase.title,
        hospital_name: productCase.hospital_name || '',
        product_name: productCase.product_name || '',
        description: productCase.description || '',
        result_summary: productCase.result_summary || '',
        image_url: productCase.image_url || '',
        status: productCase.status as 'draft' | 'active' | 'archived'
      })
    } else {
      setEditingCase(null)
      setFormData({
        title: '',
        hospital_name: '',
        product_name: '',
        description: '',
        result_summary: '',
        image_url: '',
        status: 'draft'
      })
    }
    setError('')
    setSuccess('')
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
    setEditingCase(null)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('请输入案例标题')
      return
    }
    
    if (!formData.hospital_name.trim()) {
      setError('请输入医院名称')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const caseData = {
        ...formData,
        updated_at: new Date().toISOString()
      }

      if (editingCase) {
        // 更新
        const { error } = await supabase
          .from('product_cases')
          .update(caseData)
          .eq('id', editingCase.id)

        if (error) throw error
        setSuccess('成功案例更新成功！')
      } else {
        // 新增
        const { error } = await supabase
          .from('product_cases')
          .insert([{
            ...caseData,
            created_at: new Date().toISOString()
          }])

        if (error) throw error
        setSuccess('成功案例创建成功！')
      }

      await loadCases()
      
      setTimeout(() => {
        closeDialog()
      }, 1500)

    } catch (err: any) {
      console.error('保存成功案例失败:', err)
      setError('保存失败: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个成功案例吗？')) return

    try {
      const { error } = await supabase
        .from('product_cases')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadCases()
      setSuccess('成功案例删除成功！')
    } catch (err: any) {
      console.error('删除成功案例失败:', err)
      setError('删除失败: ' + err.message)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">激活</Badge>
      case 'draft':
        return <Badge variant="warning">草稿</Badge>
      case 'archived':
        return <Badge variant="secondary">已归档</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredCases = casesList.filter(productCase => {
    const matchesSearch = productCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (productCase.hospital_name && productCase.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (productCase.product_name && productCase.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || productCase.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">成功案例管理</h1>
          <p className="text-gray-600 mt-1">管理客户成功案例和项目介绍</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              新增案例
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCase ? '编辑成功案例' : '新增成功案例'}
              </DialogTitle>
              <DialogDescription>
                填写下方信息来{editingCase ? '更新' : '创建'}成功案例
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
                    <Label htmlFor="title">案例标题 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="请输入案例标题"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hospital_name">医院名称 *</Label>
                    <Input
                      id="hospital_name"
                      value={formData.hospital_name}
                      onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                      placeholder="请输入医院名称"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="product_name">产品名称</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      placeholder="请输入产品名称"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">状态</Label>
                    <Select value={formData.status} onValueChange={(value: 'draft' | 'active' | 'archived') => 
                      setFormData({ ...formData, status: value })
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">草稿</SelectItem>
                        <SelectItem value="active">激活</SelectItem>
                        <SelectItem value="archived">已归档</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>案例图片</Label>
                  <ImageUpload
                    currentImage={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    folder="cases"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">案例描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入案例的详细描述..."
                  rows={4}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="result_summary">成果亮点</Label>
                <Textarea
                  id="result_summary"
                  value={formData.result_summary}
                  onChange={(e) => setFormData({ ...formData, result_summary: e.target.value })}
                  placeholder="请输入案例的成果亮点和成就..."
                  rows={3}
                  className="mt-2"
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  取消
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? '保存中...' : (
                    editingCase ? '更新案例' : '创建案例'
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
                  placeholder="搜索案例标题、医院名称或产品..."
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
                  <SelectItem value="active">激活</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 案例列表 */}
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
      ) : filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((productCase) => (
            <Card key={productCase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {productCase.image_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={productCase.image_url}
                    alt={productCase.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg line-clamp-2 flex-1">{productCase.title}</h3>
                    {getStatusBadge(productCase.status)}
                  </div>
                  
                  <div className="space-y-2">
                    {productCase.hospital_name && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        {productCase.hospital_name}
                      </div>
                    )}
                    {productCase.product_name && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2" />
                        {productCase.product_name}
                      </div>
                    )}
                  </div>
                  
                  {productCase.result_summary && (
                    <p className="text-gray-600 text-sm line-clamp-2">{productCase.result_summary}</p>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(productCase.created_at).toLocaleDateString('zh-CN')}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(productCase)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        编辑
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(productCase.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无成功案例</h3>
            <p className="text-gray-600 mb-6">还没有创建任何成功案例，点击上方按钮开始创建。</p>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              创建首个案例
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

export default CasesManagement
