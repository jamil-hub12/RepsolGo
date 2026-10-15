import React from 'react'
import { Redirect } from 'expo-router'
import { useAuthStore } from '../../store/auth.store'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isHydrated = useAuthStore(state => state.isHydrated)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLocked = useAuthStore(state => state.isLocked)

  if (!isHydrated) return null
  if (!isAuthenticated || isLocked) {
    return <Redirect href="/(auth)/login" />
  }
  return <>{children}</>
}