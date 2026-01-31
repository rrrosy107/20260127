'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 监听身份验证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // 当用户登录成功时显示欢迎提示
      if (event === 'SIGNED_IN' && session?.user) {
        const username = session.user.user_metadata?.name || session.user.email?.split('@')[0] || '用户'
        alert(`${username}，欢迎登录！`)
      }
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    })

    // 初始化时获取当前会话
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    }

    getInitialSession()

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/?redirected=true`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // 登出后刷新页面
    window.location.reload()
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}