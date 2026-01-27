'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageSquare, Brain, RefreshCw, Check, Clock, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoleSwapGameProps {
  className?: string
}

// AI问题库
const aiQuestions: string[] = [
  '什么是人工智能？',
  '如何学习编程？',
  '介绍一下机器学习的基本原理',
  '如何保持健康的生活方式？',
  '推荐一本好书',
  '解释一下区块链技术',
  '如何提高英语口语？',
  '介绍一下量子计算',
  '如何应对工作压力？',
  '推荐一个旅游目的地',
  '解释一下云计算',
  '如何学习一门新语言？',
  '介绍一下虚拟现实技术',
  '如何理财？',
  '推荐一部好电影',
  '解释一下大数据',
  '如何提高记忆力？',
  '介绍一下自动驾驶技术',
  '如何建立良好的人际关系？',
  '推荐一种放松的方法',
  '解释一下物联网',
  '如何提高工作效率？',
  '介绍一下5G技术',
  '如何减肥？',
  '推荐一首好歌',
  '解释一下元宇宙',
  '如何克服拖延症？',
  '介绍一下太空探索',
  '如何提高自信？',
  '推荐一个美食菜谱'
]

export function RoleSwapGame({ className }: RoleSwapGameProps) {
  const [gameState, setGameState] = React.useState<{
    currentQuestion: string
    userAnswer: string
    score: number
    time: number
    isPlaying: boolean
    message: string
    messageType: 'info' | 'success' | 'error'
    round: number
    maxRounds: number
  }>({
    currentQuestion: '',
    userAnswer: '',
    score: 0,
    time: 30,
    isPlaying: false,
    message: '点击开始按钮开始游戏',
    messageType: 'info',
    round: 0,
    maxRounds: 5
  })

  // 定时器
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState.isPlaying && gameState.time > 0) {
      timer = setInterval(() => {
        setGameState(prev => {
          if (prev.time <= 1) {
            if (timer) clearInterval(timer)
            return {
              ...prev,
              time: 0,
              message: '时间到！请回答问题',
              messageType: 'error'
            }
          }
          return {
            ...prev,
            time: prev.time - 1
          }
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameState.isPlaying, gameState.time])

  // 开始游戏
  const startGame = () => {
    const randomQuestion = aiQuestions[Math.floor(Math.random() * aiQuestions.length)]
    setGameState({
      currentQuestion: randomQuestion,
      userAnswer: '',
      score: 0,
      time: 30,
      isPlaying: true,
      message: '游戏开始！你现在是AI，需要回答用户的问题',
      messageType: 'info',
      round: 1,
      maxRounds: 5
    })
  }

  // 提交答案
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!gameState.isPlaying) {
      return
    }

    const answer = gameState.userAnswer.trim()

    if (!answer) {
      setGameState(prev => ({
        ...prev,
        message: '请输入回答',
        messageType: 'error'
      }))
      return
    }

    // 计算得分（简单的长度和内容评分）
    const score = calculateScore(answer, gameState.currentQuestion)

    if (gameState.round < gameState.maxRounds) {
      // 下一轮
      const nextQuestion = aiQuestions[Math.floor(Math.random() * aiQuestions.length)]
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextQuestion,
        userAnswer: '',
        score: prev.score + score,
        time: 30,
        round: prev.round + 1,
        message: `回答得不错！得分：${score}，进入下一题`,
        messageType: 'success'
      }))
    } else {
      // 游戏结束
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        score: prev.score + score,
        message: `游戏结束！你的总得分是：${prev.score + score}`,
        messageType: 'info'
      }))
    }
  }

  // 计算得分
  const calculateScore = (answer: string, question: string): number => {
    let score = 0
    
    // 基础分：回答长度
    if (answer.length > 50) score += 30
    else if (answer.length > 30) score += 20
    else if (answer.length > 10) score += 10
    
    // 内容分：包含相关关键词
    const keywords = getKeywordsForQuestion(question)
    keywords.forEach(keyword => {
      if (answer.includes(keyword)) {
        score += 10
      }
    })
    
    // 奖励分：结构清晰
    if (answer.includes('。') || answer.includes('\n')) {
      score += 10
    }
    
    return Math.min(score, 100)
  }

  // 获取问题相关的关键词
  const getKeywordsForQuestion = (question: string): string[] => {
    const keywordMap: Record<string, string[]> = {
      '什么是人工智能？': ['人工智能', 'AI', '智能', '机器'],
      '如何学习编程？': ['编程', '学习', '代码', '语言'],
      '介绍一下机器学习的基本原理': ['机器学习', '算法', '数据', '模型'],
      '如何保持健康的生活方式？': ['健康', '生活', '锻炼', '饮食'],
      '推荐一本好书': ['书', '推荐', '阅读', '文学'],
      '解释一下区块链技术': ['区块链', '加密', '去中心化', '比特币'],
      '如何提高英语口语？': ['英语', '口语', '练习', '交流'],
      '介绍一下量子计算': ['量子计算', '量子', '计算机', ' qubits'],
      '如何应对工作压力？': ['压力', '工作', '应对', '放松'],
      '推荐一个旅游目的地': ['旅游', '目的地', '推荐', '旅行'],
      '解释一下云计算': ['云计算', '云', '服务', '存储'],
      '如何学习一门新语言？': ['语言', '学习', '新语言', '练习'],
      '介绍一下虚拟现实技术': ['虚拟现实', 'VR', '虚拟', '技术'],
      '如何理财？': ['理财', '投资', '储蓄', '财务'],
      '推荐一部好电影': ['电影', '推荐', '影视', '观看'],
      '解释一下大数据': ['大数据', '数据', '分析', '处理'],
      '如何提高记忆力？': ['记忆力', '记忆', '提高', '方法'],
      '介绍一下自动驾驶技术': ['自动驾驶', '汽车', '技术', 'AI'],
      '如何建立良好的人际关系？': ['人际关系', '沟通', '关系', '朋友'],
      '推荐一种放松的方法': ['放松', '方法', '休息', '减压'],
      '解释一下物联网': ['物联网', 'IoT', '设备', '连接'],
      '如何提高工作效率？': ['效率', '工作', '提高', '时间'],
      '介绍一下5G技术': ['5G', '技术', '网络', '通信'],
      '如何减肥？': ['减肥', '体重', '饮食', '锻炼'],
      '推荐一首好歌': ['歌曲', '音乐', '推荐', '听歌'],
      '解释一下元宇宙': ['元宇宙', '虚拟', '数字', '世界'],
      '如何克服拖延症？': ['拖延症', '拖延', '克服', '效率'],
      '介绍一下太空探索': ['太空', '探索', '宇宙', '航天'],
      '如何提高自信？': ['自信', '提高', '自我', '心理'],
      '推荐一个美食菜谱': ['美食', '菜谱', '推荐', '烹饪']
    }
    
    return keywordMap[question] || []
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          角色互换游戏
        </CardTitle>
        <CardDescription>
          你当AI，回答用户的问题，看看能得多少分！
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 游戏状态 */}
        <div className="space-y-4">
          {/* 分数、时间和回合 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">分数: {gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className={`font-semibold ${gameState.time < 10 ? 'text-red-500' : ''}`}>
                时间: {gameState.time}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <span className="font-semibold">回合: {gameState.round}/{gameState.maxRounds}</span>
            </div>
          </div>

          {/* 用户问题（AI作为用户） */}
          {gameState.currentQuestion && (
            <div className="p-4 rounded-lg bg-accent">
              <p className="font-medium mb-2">用户的问题：</p>
              <p className="font-bold text-lg text-primary">{gameState.currentQuestion}</p>
            </div>
          )}

          {/* 消息 */}
          <Alert variant={gameState.messageType === 'error' ? 'destructive' : gameState.messageType === 'success' ? 'default' : 'info'}>
            <AlertDescription>{gameState.message}</AlertDescription>
          </Alert>

          {/* 游戏区域 */}
          {gameState.isPlaying ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="answer-input">你的回答（作为AI）</Label>
                <Input
                  id="answer-input"
                  type="text"
                  value={gameState.userAnswer}
                  onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                  placeholder="请输入你的回答..."
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                <Check className="h-4 w-4 mr-2" />
                提交回答
              </Button>
            </form>
          ) : (
            <Button onClick={startGame} className="w-full" size="lg">
              <RefreshCw className="h-5 w-5 mr-2" />
              开始游戏
            </Button>
          )}

          {/* 游戏规则 */}
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">游戏规则：</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>你将扮演AI，回答用户提出的问题</li>
              <li>每轮有30秒时间思考和回答</li>
              <li>回答越长、越相关，得分越高</li>
              <li>共5轮，结束后计算总得分</li>
              <li>挑战自己，看看能得多少分！</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
