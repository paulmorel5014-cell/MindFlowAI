// ─── MindFlow — Auth Store ────────────────────────────────────────────────────
// Client-side auth using localStorage + Web Crypto (SHA-256).
// Consistent with the rdv-store pattern; no external dependencies required.

export type UserRole = 'artisan' | 'client'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash: string
  createdAt: string
}

export interface AuthSession {
  userId: string
  token: string
  expiresAt: string // ISO
}

const USERS_KEY   = 'mf_users'
const SESSION_KEY = 'mf_session'
const SESSION_DAYS = 7
// Salt makes rainbow-table attacks impractical for this demo context
const SALT = 'mf_2024_cristalline'

// ─── Crypto ───────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + SALT)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function getUsers(): AuthUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as AuthUser[]) : []
  } catch {
    return []
  }
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
  } catch {
    return null
  }
}

export function getUserById(id: string): AuthUser | null {
  return getUsers().find((u) => u.id === id) ?? null
}

function createSession(userId: string): AuthSession {
  const session: AuthSession = {
    userId,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

// ─── Initialization (seeds demo account on first load) ───────────────────────

export async function initializeAuth(): Promise<void> {
  if (typeof window === 'undefined') return
  const users = getUsers()
  if (users.some((u) => u.email === 'demo@mindflow.fr')) return

  const passwordHash = await hashPassword('demo1234')
  const demo: AuthUser = {
    id: 'demo-artisan',
    email: 'demo@mindflow.fr',
    name: 'Artisan Demo',
    role: 'artisan',
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  persistUsers([demo, ...users])
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export interface AuthResult {
  ok: boolean
  user?: AuthUser
  error?: string
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const users = getUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!user) return { ok: false, error: 'Aucun compte trouvé avec cet email.' }

  const hash = await hashPassword(password)
  if (hash !== user.passwordHash) return { ok: false, error: 'Mot de passe incorrect.' }

  createSession(user.id)
  return { ok: true, user }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
): Promise<AuthResult> {
  if (password.length < 6) return { ok: false, error: 'Le mot de passe doit faire au moins 6 caractères.' }

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
  createSession(user.id)
  return { ok: true, user }
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}
