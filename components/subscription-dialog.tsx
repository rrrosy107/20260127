'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Check, X } from 'lucide-react'

interface SubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Plan {
  id: string
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: '基础版',
    price: '¥9.9',
    period: '/月',
    features: [
      '每月100次对话',
      '基础AI模型',
      '文件分析（10MB）',
      '7天历史记录',
      '标准客服支持'
    ]
  },
  {
    id: 'pro',
    name: '专业版',
    price: '¥29.9',
    period: '/月',
    features: [
      '无限对话',
      '高级AI模型',
      '文件分析（100MB）',
      '30天历史记录',
      '优先客服支持',
      'API访问权限',
      '自定义训练'
    ]
  },
  {
    id: 'enterprise',
    popular: true,

    name: '企业版',
    price: '¥98',
    period: '/月',
    features: [
      '无限对话',
      '顶级AI模型',
      '文件分析（1GB）',
      '永久历史记录',
      '24/7专属客服',
      '完整API访问',
      '团队协作功能',
      '定制化解决方案'
    ]
  }
]

export function SubscriptionDialog({ open, onOpenChange }: SubscriptionDialogProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null)
  const [showPayment, setShowPayment] = React.useState(false)

  const handleSubscribe = (planId: string) => {
    // 在当前标签页跳转到支付网站，用户可以使用返回按钮返回
    window.location.href = 'https://www.creem.io/test/checkout/prod_iFAFbMbukp4AvJI81uIII/ch_7D8CX4rQ0bH1iQJlKTaX08'
  }

  const handleCancelPayment = () => {
    setShowPayment(false)
    setSelectedPlan(null)
  }

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">关闭</span>
        </DialogClose>

        {!showPayment ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">选择您的订阅计划</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border-2 p-6 transition-all ${
                    plan.popular
                      ? 'border-primary bg-primary/5 scale-105 shadow-lg'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        最受欢迎
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    选择此计划
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">确认订阅</DialogTitle>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedPlanData?.name}</h3>
                    <p className="text-muted-foreground">您选择的订阅计划</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{selectedPlanData?.price}</div>
                    <div className="text-muted-foreground">{selectedPlanData?.period}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>订阅费用</span>
                    <span>{selectedPlanData?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>总计</span>
                    <span className="font-bold text-foreground">{selectedPlanData?.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelPayment}
                >
                  取消支付
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    alert('支付功能暂未实现')
                    handleCancelPayment()
                  }}
                >
                  立即支付
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
