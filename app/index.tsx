import { Redirect } from 'expo-router'
import { useAuthStore } from '../src/store/auth.store'

export default function Index() {
  const isHydrated = useAuthStore(state => state.isHydrated)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLocked = useAuthStore(state => state.isLocked)

  if (!isHydrated) return null
  if (isAuthenticated && !isLocked) return <Redirect href="/(app)/mapa" />
  return <Redirect href="/(auth)/login" />
}