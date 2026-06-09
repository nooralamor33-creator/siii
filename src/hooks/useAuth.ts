import { useState, useCallback, useEffect } from 'react'
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/auth'
import { authService } from '../services/authService'
import { supabase } from '../lib/supabase'
import { mapUser } from '../lib/mapUser'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setAuthState({ user: mapUser(data.session.user), isAuthenticated: true })
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthState({ user: mapUser(session.user), isAuthenticated: true })
      } else {
        setAuthState({ user: null, isAuthenticated: false })
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    return authService.login(credentials)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    return authService.register(data)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
  }, [])

  const updateUser = useCallback((user: User) => {
    setAuthState((prev) => ({ ...prev, user }))
  }, [])

  return { authState, loading, login, register, logout, updateUser }
}
