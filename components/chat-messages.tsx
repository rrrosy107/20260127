'use client'

import { UIMessage } from 'ai'
import { User, Bot, FileText, Copy, Check, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import tts from '@/lib/tts'

interface ChatMessagesProps {
  messages: UIMessage[]
  isLoading: boolean
  onIdiomGameClick?: () => void
  onRoleSwapGameClick?: () => void
}

export function ChatMessages({ messages, isLoading, onIdiomGameClick, onRoleSwapGameClick }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleCopyMessage = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedMessageId(messageId)
        setTimeout(() => {
          setCopiedMessageId(null)
        }, 2000)
      })
      .catch(err => {
        console.error('复制失败:', err)
        alert('复制失败，请手动复制')
      })
  }

  const handlePlayMessage = async (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      // If currently playing, stop it
      tts.cancel()
      setPlayingMessageId(null)
    } else {
      // If another message is playing, stop it first
      if (playingMessageId) {
        tts.cancel()
      }

      // Start playing this message
      setPlayingMessageId(messageId)
      const success = await tts.speak(text, 'zh-CN', () => {
        setPlayingMessageId(null)
      })

      if (!success) {
        setPlayingMessageId(null)
        alert('语音播放失败，请检查浏览器是否支持语音合成')
      }
    }
  }

  const getMessageText = (message: UIMessage): string => {
    if (!message.parts || !Array.isArray(message.parts)) return ''
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <span className="text-4xl font-bold text-primary-foreground">A</span>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">欢迎使用 AskIt</h1>
        <p className="mb-10 max-w-md text-center text-muted-foreground">
          我是您的AI智能助手，可以帮您解答问题、分析复杂问题等。
        </p>
        <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {
            [
              { icon: '💡', title: '智能问答', desc: '回答各种问题' },
              { icon: '🔍', title: '深度思考', desc: '复杂问题分析' },
              { icon: '🎮', title: '成语接龙', desc: '与AI进行成语接龙比赛' },
              { icon: '🤖', title: '角色互换', desc: '你当AI，回答用户的问题' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md cursor-pointer"
                onClick={() => {
                  if (item.title === '成语接龙' && onIdiomGameClick) {
                    // 打开成语接龙游戏
                    onIdiomGameClick()
                  } else if (item.title === '角色互换' && onRoleSwapGameClick) {
                    // 打开角色互换游戏
                    onRoleSwapGameClick()
                  }
                }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-card-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="mx-auto max-w-3xl px-4 py-8">

        <div className="space-y-8">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            const text = getMessageText(message)

            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-4',
                  isUser ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    isUser ? 'bg-primary' : 'bg-accent'
                  )}
                >
                  {isUser ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-accent-foreground" />
                  )}
                </div>
                <div className="flex items-start gap-3 group">
                  <div
                    className={cn(
                      'rounded-2xl px-5 py-4 shadow-sm transition-all duration-200',
                      isUser
                        ? 'max-w-full bg-primary text-primary-foreground hover:shadow-md'
                        : 'max-w-[85%] bg-card text-card-foreground border border-border hover:shadow-md hover:bg-card/95'
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {text}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                    <button
                      onClick={() => handlePlayMessage(message.id, text)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200',
                        isUser
                          ? 'border-primary-foreground/20 bg-primary/10 hover:bg-accent hover:border-accent'
                          : 'border-border bg-card/80 hover:bg-accent hover:border-accent'
                      )}
                      aria-label={playingMessageId === message.id ? "停止播放" : "播放消息"}
                    >
                      {playingMessageId === message.id ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyMessage(message.id, text)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200',
                        isUser
                          ? 'border-primary-foreground/20 bg-primary/10 hover:bg-accent hover:border-accent'
                          : 'border-border bg-card/80 hover:bg-accent hover:border-accent'
                      )}
                      aria-label="复制消息"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
                <Bot className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
