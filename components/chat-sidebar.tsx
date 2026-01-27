'use client'

import { MessageSquarePlus, MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { Message } from '@ai-sdk/react'

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  preview: string
  messages: Message[]
}

interface ChatSidebarProps {
  conversations: Conversation[]
  currentId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export function ChatSidebar({
  conversations,
  currentId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <aside className="flex h-full w-[22.5rem] flex-col border-r border-border bg-sidebar">
      {/* Logo Header */}
      <div className="flex items-center gap-3 border-b border-sidebar-border p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">A</span>
        </div>
        <span className="text-xl font-semibold text-sidebar-foreground">AskIt</span>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-transparent"
          variant="outline"
        >
          <MessageSquarePlus className="h-4 w-4" />
          新建对话
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {conversations.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              暂无对话记录
            </p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  'group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-sidebar-accent',
                  currentId === conv.id && 'bg-sidebar-accent'
                )}
                onClick={() => onSelectChat(conv.id)}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">
                      {conv.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatDate(conv.createdAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(conv.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <p className="text-center text-xs text-muted-foreground">
          Powered by AI
        </p>
      </div>
    </aside>
  )
}
