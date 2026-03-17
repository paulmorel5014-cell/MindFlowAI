// ─── MindFlow — Auth Store ────────────────────────────────────────────────────
// Dual mode: Supabase Auth when configured, localStorage fallback otherwise.

import { supabase, SUPABASE_ENABLED } from './supabase'

export type UserRole = 'artisan' | 'client' | 'agent_immobilier'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash?: string  // Legacy — only present in localStorage mode
  createdAt: string
}

export interface AuthSession {
  userId: string
  token: string
  expiresAt: string
}

export interface AuthResult {
  ok: boolean
  user?: AuthUser
  error?: string
}

// ─── localStorage helpers (fallback mode) ────────────────────────────────────

const USERS_KEY   = 'mf_users'
const SESSION_KEY = 'mf_session'
const SESSION_DAYS = 7
const SALT = 'mf_2024_cristalline'

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + SALT)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function getUsers(): AuthUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as AuthUser[]) : []
  } catch { return [] }
}

function persistUsers(users: AuthUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch { return null }
}

export function getUserById(id: string): AuthUser | null {
  return getUsers().find((u) => u.id === id) ?? null
}

function createSessionLocal(userId: string): AuthSession {
  const session: AuthSession = {
    userId,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

// ─── Initialization ───────────────────────────────────────────────────────────

export async function initializeAuth(): Promise<void> {
  if (SUPABASE_ENABLED) return  // Supabase manages its own state
  if (typeof window === 'undefined') return
  // No demo seeding — users must register a real account
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  if (SUPABASE_ENABLED) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      const msg = error.message.includes('Invalid login')
        ? 'Email ou mot de passe incorrect.'
        : error.message
      return { ok: false, error: msg }
    }
    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', data.user.id).single()
    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name ?? email.split('@')[0],
      role: (profile?.role as UserRole) ?? 'artisan',
      createdAt: data.user.created_at,
    }
    return { ok: true, user }
  }

  // localStorage fallback
  const users = getUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!user) return { ok: false, error: 'Aucun compte trouvé avec cet email.' }
  const hash = await hashPassword(password)
  if (hash !== user.passwordHash) return { ok: false, error: 'Mot de passe incorrect.' }
  createSessionLocal(user.id)
  return { ok: true, user }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
): Promise<AuthResult> {
  if (password.length < 6) return { ok: false, error: 'Le mot de passe doit faire au moins 6 caractères.' }

  if (SUPABASE_ENABLED) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    })
    if (error) {
      const msg = error.message.includes('already registered')
        ? 'Un compte avec cet email existe déjà.'
        : error.message
      return { ok: false, error: msg }
    }
    const user: AuthUser = {
      id: data.user!.id,
      email: data.user!.email!,
      name,
      role,
      createdAt: data.user!.created_at,
    }
    return { ok: true, user }
  }

  // localStorage fallback
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return { ok: false, error: 'Un compte avec cet email existe déjà.' }
  }
  const passwordHash = await hashPassword(password)
  const user: AuthUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role,
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  persistUsers([...users, user])
  createSessionLocal(user.id)
  return { ok: true, user }
}

export function logoutUser(): void {
  if (SUPABASE_ENABLED) {
    supabase.auth.signOut() // fire and forget
    return
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}
