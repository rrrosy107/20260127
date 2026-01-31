'use client'

import React from "react"

import { useState, useRef, useCallback } from 'react'
import { Send, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  onExportChat?: () => void
  onClearChat?: () => void
  hasMessages?: boolean
  isAuthenticated?: boolean
}



export function ChatInput({
  onSend,
  isLoading,
  onExportChat,
  onClearChat,
  hasMessages = false,
  isAuthenticated = false,
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!input.trim() || isLoading || !isAuthenticated) return
      onSend(input.trim())
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    },
    [input, isLoading, isAuthenticated, onSend]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )



  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="mx-auto max-w-3xl">
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
            {/* Text Input */}
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={isAuthenticated ? "输入消息..." : "请先登录以发送消息"}
              disabled={!isAuthenticated || isLoading}
              className={cn(
                "min-h-[40px] max-h-[200px] flex-1 resize-none border-0 bg-transparent p-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                !isAuthenticated && "opacity-50"
              )}
              rows={1}
            />

            {/* Send Button */}
            <Button
              type="submit"
              size="icon"
              className={cn(
                'h-9 w-9 shrink-0 rounded-xl',
                (!input.trim() || !isAuthenticated) && 'opacity-50'
              )}
              disabled={!input.trim() || isLoading || !isAuthenticated}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          {onExportChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportChat}
              disabled={!hasMessages || isLoading}
              className="gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="text-xs">导出聊天</span>
            </Button>
          )}
          {onClearChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearChat}
              disabled={!hasMessages || isLoading}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="text-xs">清空聊天</span>
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
