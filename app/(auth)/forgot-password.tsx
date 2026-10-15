import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../src/constants/colors'
import { Button } from '../../src/components/ui/Button'
import { Input } from '../../src/components/ui/Input'
import { AuthService } from '../../src/services/auth.service'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    const clean = email.trim().toLowerCase()
    if (!clean) {
      setError('Ingresa tu email')
      return
    }
    if (!/\S+@\S+\.\S+/.test(clean)) {
      setError('Email inválido')
      return
    }
    setError('')
    setLoading(true)
    try {
      await AuthService.sendPasswordReset(clean)
      router.push({ pathname: '/(auth)/reset-password', params: { email: clean } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el código.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>🔑</Text>
          </View>

          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            Ingresa tu email y te enviaremos un código para restablecer tu contraseña.
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={text => {
              setEmail(text)
              setError('')
            }}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <Button
            label="Enviar código"
            onPress={handleSend}
            loading={loading}
            fullWidth
            style={styles.sendBtn}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿La recordaste? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Volver al login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  backArrow: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  sendBtn: {
    marginTop: 8,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.orange,
    fontWeight: '600',
  },
})