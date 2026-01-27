'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ChatSidebar, Conversation } from './chat-sidebar'

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversations: Conversation[]
  currentId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export function MobileSidebar({
  open,
  onOpenChange,
  conversations,
  currentId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <ChatSidebar
          conversations={conversations}
          currentId={currentId}
          onNewChat={() => {
            onNewChat()
            onOpenChange(false)
          }}
          onSelectChat={(id) => {
            onSelectChat(id)
            onOpenChange(false)
          }}
          onDeleteChat={onDeleteChat}
        />
      </SheetContent>
    </Sheet>
  )
}
