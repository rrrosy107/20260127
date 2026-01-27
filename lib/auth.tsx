'use client'

import * as React from 'react'

interface User {
  id: string
  username: string
  password: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, email: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Load user from localStorage on mount
  React.useEffect(() => {
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const userObj = JSON.parse(userStr)
          setUser(userObj)
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Get all users from localStorage
  const getUsers = (): User[] => {
    try {
      const usersStr = localStorage.getItem('users')
      return usersStr ? JSON.parse(usersStr) : []
    } catch (error) {
      console.error('Failed to get users:', error)
      return []
    }
  }

  // Save users to localStorage
  const saveUsers = (users: User[]): void => {
    try {
      localStorage.setItem('users', JSON.stringify(users))
    } catch (error) {
      console.error('Failed to save users:', error)
    }
  }

  // Register function
  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const users = getUsers()

      // Check if username already exists
      if (users.some(user => user.username === username)) {
        return false
      }

      // Check if email already exists
      if (users.some(user => user.email === email)) {
        return false
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        password, // In a real app, you would hash the password
        email
      }

      // Save new user
      users.push(newUser)
      saveUsers(users)

      // Don't auto login, just return success
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const users = getUsers()

      // Find user by username
      const user = users.find(user => user.username === username)

      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return false
      }

      // Set current user
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
