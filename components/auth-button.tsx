'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export function AuthButton() {
  const { user, signInWithGoogle, signOut } = useAuth()

  if (user) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={signOut}
        className="ml-auto"
      >
        登出
      </Button>
    )
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={signInWithGoogle}
      className="ml-auto"
    >
      Google登录
    </Button>
  )
}