'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ChatSidebar, Conversation } from '@/components/chat-sidebar'
import { ChatHeader } from '@/components/chat-header'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { MobileSidebar } from '@/components/mobile-sidebar'
import { IdiomGame } from '@/components/idiom-game'
import { RoleSwapGame } from '@/components/role-swap-game'
import { AuthButton } from '@/components/auth-button'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Generate unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 15)
}



function HomeContent() {
  const { user, signInWithGoogle } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [input, setInput] = useState('')
  const [idiomGameOpen, setIdiomGameOpen] = useState(false)
  const [roleSwapGameOpen, setRoleSwapGameOpen] = useState(false)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          messages,
          id,
        },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Update conversation when messages change
  useEffect(() => {
    if (currentConversationId) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                title: getConversationTitle(messages),
                preview: getLastMessage(messages),
                messages: [...messages],
              }
            : conv
        )
      )
    }
  }, [messages, currentConversationId])

  const getConversationTitle = (msgs: typeof messages) => {
    if (msgs.length === 0) return '新对话'
    const firstUserMessage = msgs.find((m) => m.role === 'user')
    if (firstUserMessage && firstUserMessage.parts) {
      const textPart = firstUserMessage.parts.find((p) => p.type === 'text')
      if (textPart && 'text' in textPart) {
        return textPart.text.substring(0, 30) + (textPart.text.length > 30 ? '...' : '')
      }
    }
    return '新对话'
  }

  const getLastMessage = (msgs: typeof messages) => {
    if (msgs.length === 0) return ''
    const lastMsg = msgs[msgs.length - 1]
    if (lastMsg.parts) {
      const textPart = lastMsg.parts.find((p) => p.type === 'text')
      if (textPart && 'text' in textPart) {
        return textPart.text.substring(0, 50)
      }
    }
    return ''
  }

  const handleNewChat = useCallback(() => {
    const newId = generateId()
    const newConversation: Conversation = {
      id: newId,
      title: '新对话',
      createdAt: new Date(),
      preview: '',
      messages: [],
    }
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newId)
    setMessages([])
  }, [setMessages])

  const handleSelectChat = useCallback(
    (id: string) => {
      setCurrentConversationId(id)
      // Load conversation messages
      const conversation = conversations.find((c) => c.id === id)
      if (conversation) {
        setMessages([...conversation.messages])
      } else {
        setMessages([])
      }
    },
    [conversations, setMessages]
  )

  const handleDeleteChat = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (currentConversationId === id) {
        setCurrentConversationId(null)
        setMessages([])
      }
    },
    [currentConversationId, setMessages]
  )

  const handleSendMessage = useCallback(
    async (text: string) => {
      // Check if user is logged in
      if (!user) {
        alert('请先登录 Google 账号后再发送消息')
        signInWithGoogle()
        return
      }

      if (!currentConversationId) {
        // Create a new conversation if none exists
        const newId = generateId()
        const newConversation: Conversation = {
          id: newId,
          title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
          createdAt: new Date(),
          preview: text,
          messages: [],
        }
        setConversations((prev) => [newConversation, ...prev])
        setCurrentConversationId(newId)
      }

      sendMessage({ text })
    },
    [currentConversationId, sendMessage, user, signInWithGoogle]
  )



  const handleClearChat = useCallback(() => {
    setMessages([])
  }, [setMessages])

  const handleExportChat = useCallback(() => {
    if (messages.length === 0) return

    const exportContent = messages
      .map((msg) => {
        const role = msg.role === 'user' ? '用户' : 'AskIt'
        const text = msg.parts
          ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map((p) => p.text)
          .join('')
        return `${role}：\n${text}\n`
      })
      .join('\n---\n\n')

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AskIt对话_${new Date().toLocaleDateString('zh-CN')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [messages])

  const currentTitle = currentConversationId
    ? conversations.find((c) => c.id === currentConversationId)?.title || 'AskIt'
    : 'AskIt'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      {sidebarOpen && (
        <div className="hidden lg:block">
          <ChatSidebar
            conversations={conversations}
            currentId={currentConversationId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        conversations={conversations}
        currentId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <ChatHeader
            title={currentTitle}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onClearChat={handleClearChat}
            onExportChat={handleExportChat}
            hasMessages={messages.length > 0}
          />
          <AuthButton />
        </div>

        <main className="flex-1 overflow-hidden">
          <ChatMessages
            messages={messages}
            isLoading={isLoading && messages.length > 0}
            onIdiomGameClick={() => setIdiomGameOpen(true)}
            onRoleSwapGameClick={() => setRoleSwapGameOpen(true)}
          />
        </main>

        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* 成语接龙游戏对话框 */}
      <Dialog open={idiomGameOpen} onOpenChange={setIdiomGameOpen} id="idiom-game-modal">
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>成语接龙游戏</DialogTitle>
          </DialogHeader>
          <IdiomGame />
        </DialogContent>
      </Dialog>

      {/* 角色互换游戏对话框 */}
      <Dialog open={roleSwapGameOpen} onOpenChange={setRoleSwapGameOpen} id="role-swap-game-modal">
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>角色互换游戏</DialogTitle>
          </DialogHeader>
          <RoleSwapGame />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}
