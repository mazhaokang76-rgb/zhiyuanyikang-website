import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import {
  Upload,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Rocket,
  Globe,
  Activity
} from 'lucide-react'

interface DeployLog {
  id: number
  triggered_by: string
  triggered_by_email: string
  status: 'triggered' | 'in_progress' | 'completed' | 'failed'
  triggered_at: string
  completed_at?: string
  notes?: string
}

const DeployManagement = () => {
  const { user } = useAuth()
  const [deployLogs, setDeployLogs] = useState<DeployLog[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stats, setStats] = useState({
    totalDeploys: 0,
    successfulDeploys: 0,
    failedDeploys: 0,
    lastDeployTime: null as string | null
  })

  useEffect(() => {
    loadDeployLogs()
  }, [])

  const loadDeployLogs = async () => {
    try {
      setLoading(true)
      
      // 调用Edge Function获取发布日志
      const { data, error } = await supabase.functions.invoke('get-deploy-logs', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error
      
      const logs = data?.data || []
      const statsData = data?.stats || {
        totalDeploys: 0,
        successfulDeploys: 0,
        failedDeploys: 0,
        lastDeployTime: null
      }
      
      setDeployLogs(logs)
      setStats(statsData)
      
    } catch (err: any) {
      console.error('加载发布日志失败:', err)
      setError('加载发布日志失败: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const triggerDeploy = async () => {
    if (!user) {
      setError('需要登录才能执行发布操作')
      return
    }

    setDeploying(true)
    setError('')
    setSuccess('')

    try {
      // 调用Edge Function触发发布
      const { data, error } = await supabase.functions.invoke('admin-deploy-trigger', {
        body: {}
      })

      if (error) throw error

      setSuccess('网站发布成功！内容已更新。')
      
      // 重新加载发布日志
      await loadDeployLogs()
      
    } catch (err: any) {
      console.error('发布失败:', err)
      setError('发布失败: ' + err.message)
    } finally {
      setDeploying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'triggered':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">成功</Badge>
      case 'failed':
        return <Badge variant="destructive">失败</Badge>
      case 'in_progress':
        return <Badge>进行中</Badge>
      case 'triggered':
        return <Badge variant="warning">已触发</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return '-'
    
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const duration = Math.round((end - start) / 1000)
    
    if (duration < 60) return `${duration}秒`
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}分${seconds}秒`
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">发布管理</h1>
          <p className="text-gray-600 mt-1">一键发布网站内容更新</p>
        </div>
      </div>

      {/* 发布统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Rocket className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总发布次数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeploys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">成功发布</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successfulDeploys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">失败发布</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failedDeploys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">上次发布</p>
                <p className="text-sm text-gray-900">
                  {stats.lastDeployTime 
                    ? new Date(stats.lastDeployTime).toLocaleDateString('zh-CN')
                    : '无'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 发布操作 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            一键发布
          </CardTitle>
          <CardDescription>
            将最新的内容更新发布到网站，包括公司动态、成功案例等。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">发布到生产环境</h3>
                  <p className="text-sm text-gray-600">更新所有用户可见的网站内容</p>
                </div>
              </div>
              <Button 
                onClick={triggerDeploy}
                disabled={deploying}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {deploying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    发布中...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    一键发布
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <p><strong>注意:</strong> 发布操作将会:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>更新网站上的所有公司动态内容</li>
                <li>更新成功案例展示</li>
                <li>刷新网站缓存，确保用户看到最新内容</li>
                <li>发布过程大约需要 1-2 分钟</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 发布历史 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            发布历史
          </CardTitle>
          <CardDescription>
            最近的发布记录和状态
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : deployLogs.length > 0 ? (
            <div className="space-y-3">
              {deployLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">发布 #{log.id}</span>
                        {getStatusBadge(log.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {log.triggered_by_email}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(log.triggered_at).toLocaleString('zh-CN')}
                        </div>
                        {log.completed_at && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            耗时: {formatDuration(log.triggered_at, log.completed_at)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {log.notes && (
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {log.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无发布记录</h3>
              <p className="text-gray-600">还没有进行过任何发布操作</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DeployManagement
