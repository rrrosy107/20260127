'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'

interface RegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegisterSuccess?: () => void
}

export function RegisterDialog({ open, onOpenChange, onRegisterSuccess }: RegisterDialogProps) {
  const { register, isLoading } = useAuth()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password || !email) {
      setError('请填写所有字段')
      return
    }

    if (username.length < 3) {
      setError('用户名至少需要3个字符')
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    if (!email.includes('@')) {
      setError('请输入有效的邮箱地址')
      return
    }

    const success = await register(username, password, email)
    if (success) {
      onOpenChange(false)
      setUsername('')
      setPassword('')
      setEmail('')
      if (onRegisterSuccess) {
        onRegisterSuccess()
      }
    } else {
      setError('用户名或邮箱已存在')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>注册</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '注册中...' : '注册'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
