'use client'

import * as React from 'react'
import { Menu, Trash2, Download, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth'
import { LoginDialog } from '@/components/auth/login-dialog'
import { RegisterDialog } from '@/components/auth/register-dialog'

interface ChatHeaderProps {
  title: string
  onToggleSidebar: () => void
  onClearChat: () => void
  onExportChat: () => void
  hasMessages: boolean
}

export function ChatHeader({
  title,
  onToggleSidebar,
  onClearChat,
  onExportChat,
  hasMessages,
}: ChatHeaderProps) {
  const { user, logout } = useAuth()
  const [loginOpen, setLoginOpen] = React.useState(false)
  const [registerOpen, setRegisterOpen] = React.useState(false)

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span>{user.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={onExportChat}
                disabled={!hasMessages}
                className="cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                导出对话
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onClearChat}
                disabled={!hasMessages}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                清空对话
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)} className="hidden">
              登录
            </Button>
            <Button size="sm" onClick={() => setRegisterOpen(true)} className="hidden">
              注册
            </Button>
          </>
        )}
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog 
        open={registerOpen} 
        onOpenChange={setRegisterOpen}
        onRegisterSuccess={() => {
          setRegisterOpen(false)
          setLoginOpen(true)
        }}
      />
    </header>
  )
}
