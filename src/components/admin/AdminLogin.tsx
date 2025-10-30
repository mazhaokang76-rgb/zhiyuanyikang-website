import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Loader2, Lock, Shield } from 'lucide-react'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  
  // 监听认证状态变化，登录成功后自动跳转
  useEffect(() => {
    if (user && isAdmin) {
      console.log('认证状态更新，跳转到Dashboard')
      navigate('/admin/dashboard', { replace: true })
    }
  }, [user, isAdmin, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('请输入邮箱和密码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await signIn(email, password)
      
      if (signInError) {
        console.error('登录错误:', signInError)
        setError('登录失败：' + signInError.message)
        setLoading(false)
      } else if (data?.user) {
        console.log('登录成功:', data.user.email)
        // 不手动导航，useEffect会处理跳转
        // setLoading 将在跳转后或组件卸载时自动处理
      } else {
        setError('登录失败：未知错误')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('登录异常:', err)
      setError('登录过程中发生错误: ' + (err.message || err))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            智缘益慷管理后台
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            请使用管理员账户登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@zhiyuan-yikang.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || (user && isAdmin)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  登录
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>忘记密码？请联系系统管理员</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminLogin
