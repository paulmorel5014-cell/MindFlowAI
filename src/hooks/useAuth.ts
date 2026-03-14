'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  AuthUser,
  UserRole,
  initializeAuth,
  loginUser,
  registerUser,
  logoutUser,
  getSession,
  getUserById,
  AuthResult,
} from '@/lib/auth-store'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
}

export interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<AuthResult>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<AuthResult>
  logout: () => void
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  // Initialize store + restore session on mount
  useEffect(() => {
    let cancelled = false
    async function init() {
      await initializeAuth()
      if (cancelled) return
      const session = getSession()
      const user = session ? getUserById(session.userId) : null
      setState({ user, isLoading: false, error: null })
    }
    init()
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    const result = await loginUser(email, password)
    setState({
      user: result.user ?? null,
      isLoading: false,
      error: result.error ?? null,
    })
    return result
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string, role: UserRole): Promise<AuthResult> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      const result = await registerUser(email, password, name, role)
      setState({
        user: result.user ?? null,
        isLoading: false,
        error: result.error ?? null,
      })
      return result
    },
    [],
  )

  const logout = useCallback(() => {
    logoutUser()
    setState({ user: null, isLoading: false, error: null })
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return { ...state, login, register, logout, clearError }
}
