import React, { useState } from 'react'
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
import type { UserRole } from '../../src/types'

const ROLES: { value: UserRole; emoji: string; name: string; desc: string }[] = [
  { value: 'cliente', emoji: '🚗', name: 'Cliente', desc: 'Gana puntos en cada carga' },
  { value: 'repartidor', emoji: '🛵', name: 'Repartidor', desc: 'Entrega balones de GLP' },
  { value: 'operador', emoji: '⛽', name: 'Operador', desc: 'Gestiona tu grifo Repsol' },
  { value: 'supervisor', emoji: '📊', name: 'Supervisor', desc: 'Controla grifos y reparto' },
]

export default function RegisterScreen() {
  const router = useRouter()
  const register = useAuthStore(state => state.register)
  const isLoading = useAuthStore(state => state.isLoading)

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rol, setRol] = useState<UserRole>('cliente')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido'
    if (!email) errs.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email inválido'
    if (!telefono.trim()) errs.telefono = 'El teléfono es requerido'
    else if (!/^[+\d][\d\s]{7,14}$/.test(telefono.trim())) errs.telefono = 'Teléfono inválido'
    if (!password) errs.password = 'La contraseña es requerida'
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
    if (password !== confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleRegister() {
    if (!validate()) return
    try {
      await register({ nombre, email, telefono, password, rol })
      router.replace('/(app)/mapa')
    } catch (e) {
      Alert.alert('No se pudo crear la cuenta', e instanceof Error ? e.message : 'Intenta de nuevo.')
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Únete a RepsolGo y empieza a ganar puntos</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nombre completo"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              autoCapitalize="words"
              error={errors.nombre}
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+51 999 999 999"
              keyboardType="phone-pad"
              error={errors.telefono}
            />
            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              error={errors.password}
            />
            <Input
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repite tu contraseña"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Text style={styles.rolLabel}>¿Cuál es tu perfil?</Text>
            <View style={styles.rolGrid}>
              {ROLES.map(r => {
                const active = rol === r.value
                return (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.rolCard, active && styles.rolCardActive]}
                    onPress={() => setRol(r.value)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.rolEmoji}>{r.emoji}</Text>
                    <Text style={[styles.rolName, active && styles.rolNameActive]}>{r.name}</Text>
                    <Text style={styles.rolDesc}>{r.desc}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            <Button
              label="Crear cuenta"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={styles.registerBtn}
            />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  header: { backgroundColor: Colors.navy, padding: 24, paddingTop: 20, paddingBottom: 32 },
  backBtn: {
    marginBottom: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: Colors.white, fontSize: 18, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.white, marginBottom: 6 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  form: { padding: 24 },
  rolLabel: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 12 },
  rolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  rolCard: {
    width: '48%',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  rolCardActive: { borderColor: Colors.orange, backgroundColor: '#FFF3E0' },
  rolEmoji: { fontSize: 28, marginBottom: 8 },
  rolName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  rolNameActive: { color: Colors.orange },
  rolDesc: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', lineHeight: 15 },
  registerBtn: { marginBottom: 20 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, color: Colors.orange, fontWeight: '600' },
})