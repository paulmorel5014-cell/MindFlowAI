'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  AuthUser, UserRole,
  initializeAuth, loginUser, registerUser, logoutUser,
  getSession, getUserById, AuthResult,
} from '@/lib/auth-store'
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase'

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

  useEffect(() => {
    if (SUPABASE_ENABLED) {
      // Restore session from Supabase
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles').select('*').eq('id', session.user.id).single()
          setState({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name ?? session.user.email!.split('@')[0],
              role: (profile?.role as UserRole) ?? 'artisan',
              createdAt: session.user.created_at,
            },
            isLoading: false,
            error: null,
          })
        } else {
          setState({ user: null, isLoading: false, error: null })
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles').select('*').eq('id', session.user.id).single()
          setState({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name ?? session.user.email!.split('@')[0],
              role: (profile?.role as UserRole) ?? 'artisan',
              createdAt: session.user.created_at,
            },
            isLoading: false,
            error: null,
          })
        } else {
          setState({ user: null, isLoading: false, error: null })
        }
      })

      return () => subscription.unsubscribe()
    } else {
      // localStorage fallback
      let cancelled = false
      const init = async () => {
        await initializeAuth()
        if (cancelled) return
        const session = getSession()
        const user = session ? getUserById(session.userId) : null
        setState({ user, isLoading: false, error: null })
      }
      init()
      return () => { cancelled = true }
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    const result = await loginUser(email, password)
    if (!SUPABASE_ENABLED) {
      setState({ user: result.user ?? null, isLoading: false, error: result.error ?? null })
    } else {
      // onAuthStateChange will update the state for Supabase
      if (!result.ok) setState((prev) => ({ ...prev, isLoading: false, error: result.error ?? null }))
      else setState((prev) => ({ ...prev, isLoading: false }))
    }
    return result
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string, role: UserRole): Promise<AuthResult> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      const result = await registerUser(email, password, name, role)
      if (!SUPABASE_ENABLED) {
        setState({ user: result.user ?? null, isLoading: false, error: result.error ?? null })
      } else {
        if (!result.ok) setState((prev) => ({ ...prev, isLoading: false, error: result.error ?? null }))
        else setState((prev) => ({ ...prev, isLoading: false }))
      }
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
