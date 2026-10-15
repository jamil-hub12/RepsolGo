import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../src/constants/colors'
import { Button } from '../../src/components/ui/Button'
import { Input } from '../../src/components/ui/Input'
import { useAuthStore } from '../../src/store/auth.store'
import { BiometricService } from '../../src/services/biometric.service'

function EmailIcon() {
  return (
    <View style={iconStyles.container}>
      <View style={iconStyles.envelope}>
        <View style={iconStyles.envelopeLine} />
      </View>
    </View>
  )
}

function LockIcon() {
  return (
    <View style={lockStyles.container}>
      <View style={lockStyles.shackle} />
      <View style={lockStyles.body} />
    </View>
  )
}

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <View style={eyeStyles.container}>
      <View style={eyeStyles.eye} />
      {!visible && <View style={eyeStyles.slash} />}
    </View>
  )
}

export default function LoginScreen() {
  const router = useRouter()
  const login = useAuthStore(state => state.login)
  const logout = useAuthStore(state => state.logout)
  const unlock = useAuthStore(state => state.unlock)
  const isLoading = useAuthStore(state => state.isLoading)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLocked = useAuthStore(state => state.isLocked)
  const user = useAuthStore(state => state.user)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  // Sesión guardada + biometría activada: la app está bloqueada hasta validar la huella.
  const locked = isAuthenticated && isLocked

  async function handleUnlock() {
    const ok = await BiometricService.authenticate('Desbloquea RepsolGo')
    if (ok) {
      unlock()
      router.replace('/(app)/mapa')
    }
  }

  useEffect(() => {
    if (locked) handleUnlock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked])

  function validate() {
    const errs: { email?: string; password?: string } = {}
    if (!email) errs.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email inválido'
    if (!password) errs.password = 'La contraseña es requerida'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleLogin() {
    if (!validate()) return
    try {
      await login(email, password)
      router.replace('/(app)/mapa')
    } catch (e) {
      Alert.alert('No pudimos iniciar sesión', e instanceof Error ? e.message : 'Intenta de nuevo.')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <View style={styles.logoInner}>
                <View style={styles.logoPinBody} />
                <View style={styles.logoPinTail} />
              </View>
            </View>
            <Text style={styles.appName}>RepsolGo</Text>
            <Text style={styles.tagline}>Tu compañero de ruta con Repsol</Text>
          </View>

          {locked ? (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Hola, {user?.nombre?.split(' ')[0]}</Text>
              <Text style={styles.formSubtitle}>Valida tu huella o rostro para continuar</Text>
              <Button label="Desbloquear con huella" onPress={handleUnlock} fullWidth style={styles.loginBtn} />
              <TouchableOpacity onPress={logout} style={styles.otherAccount}>
                <Text style={styles.registerLink}>Usar otra cuenta</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Bienvenido de vuelta</Text>
              <Text style={styles.formSubtitle}>Inicia sesión en tu cuenta</Text>

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                leftIcon={<EmailIcon />}
              />
              <Input
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Tu contraseña"
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon={<LockIcon />}
                rightIcon={<EyeIcon visible={showPassword} />}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <Button
                label="Iniciar sesión"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                style={styles.loginBtn}
              />

              <View style={styles.registerRow}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text style={styles.registerLink}>Regístrate gratis</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  hero: {
    backgroundColor: Colors.navy,
    paddingTop: 40,
    paddingBottom: 48,
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoInner: { alignItems: 'center' },
  logoPinBody: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.white },
  logoPinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.white,
    marginTop: -2,
  },
  appName: { fontSize: 32, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  form: { padding: 24, flex: 1 },
  formTitle: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  formSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 28 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 20 },
  forgotText: { fontSize: 13, color: Colors.orange, fontWeight: '500' },
  loginBtn: { marginBottom: 20 },
  otherAccount: { alignItems: 'center', paddingVertical: 8 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 14, color: Colors.textSecondary },
  registerLink: { fontSize: 14, color: Colors.orange, fontWeight: '600' },
})

const iconStyles = StyleSheet.create({
  container: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  envelope: {
    width: 16,
    height: 12,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  envelopeLine: { width: 10, height: 1.5, backgroundColor: Colors.textMuted },
})

const lockStyles = StyleSheet.create({
  container: { width: 18, height: 18, alignItems: 'center' },
  shackle: {
    width: 10,
    height: 6,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    borderBottomWidth: 0,
    borderRadius: 5,
  },
  body: { width: 14, height: 10, backgroundColor: Colors.textMuted, borderRadius: 2 },
})

const eyeStyles = StyleSheet.create({
  container: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  eye: {
    width: 16,
    height: 10,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    borderRadius: 8,
  },
  slash: {
    position: 'absolute',
    width: 18,
    height: 1.5,
    backgroundColor: Colors.textMuted,
    transform: [{ rotate: '-35deg' }],
  },
})