import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // 加载用户信息
  useEffect(() => {
    let isMounted = true
    
    async function initializeAuth() {
      try {
        // 首先检查当前会话
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (isMounted) {
          if (sessionError) {
            // 只记录非正常的会话错误
            if (sessionError.message !== 'Auth session missing!' && 
                !sessionError.message?.includes('AuthSessionMissingError')) {
              console.error('Session error:', sessionError)
            }
            setUser(null)
            setIsAdmin(false)
          } else if (session?.user) {
            setUser(session.user)
            setIsAdmin(!!session.user.email)
          } else {
            setUser(null)
            setIsAdmin(false)
          }
        }
      } catch (error: any) {
        // 静默处理认证相关错误
        if (error?.message !== 'Auth session missing!' && 
            !error?.message?.includes('AuthSessionMissingError')) {
          console.error('Auth initialization error:', error)
        }
        if (isMounted) {
          setUser(null)
          setIsAdmin(false)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    initializeAuth()

    // 设置认证状态监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isMounted) {
          setUser(session?.user || null)
          setIsAdmin(!!session?.user?.email)
          // 只在需要时记录状态变化
          if (event === 'SIGNED_IN' && session?.user?.email) {
            console.log('用户登录成功:', session.user.email)
          }
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // 登录
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  // 登出
  const signOut = async () => {
    const result = await supabase.auth.signOut()
    setIsAdmin(false)
    return result
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
