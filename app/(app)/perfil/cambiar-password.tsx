import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../src/constants/colors'
import { Button } from '../../../src/components/ui/Button'
import { Input } from '../../../src/components/ui/Input'
import { useAuthStore } from '../../../src/store/auth.store'

export default function CambiarPasswordScreen() {
  const router = useRouter()
  const changePassword = useAuthStore(state => state.changePassword)

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!current) errs.current = 'Ingresa tu contraseña actual'
    if (!next) errs.next = 'Ingresa la nueva contraseña'
    else if (next.length < 6) errs.next = 'Mínimo 6 caracteres'
    else if (next === current) errs.next = 'Debe ser distinta a la actual'
    if (next !== confirm) errs.confirm = 'Las contraseñas no coinciden'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setLoading(true)
    try {
      await changePassword(current, next)
      Alert.alert('Contraseña actualizada', 'Usa tu nueva contraseña la próxima vez que inicies sesión.', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (e) {
      setErrors({ current: e instanceof Error ? e.message : 'No se pudo actualizar la contraseña.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Cambiar contraseña</Text>
        <View style={styles.navSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.intro}>
            Por seguridad, confirma tu contraseña actual antes de elegir una nueva.
          </Text>
          <Input
            label="Contraseña actual"
            value={current}
            onChangeText={setCurrent}
            placeholder="Tu contraseña actual"
            secureTextEntry
            error={errors.current}
          />
          <Input
            label="Nueva contraseña"
            value={next}
            onChangeText={setNext}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            error={errors.next}
          />
          <Input
            label="Confirmar nueva contraseña"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repite la nueva contraseña"
            secureTextEntry
            error={errors.confirm}
          />
          <Button label="Guardar contraseña" onPress={handleSave} loading={loading} fullWidth />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4, minWidth: 70 },
  backText: { fontSize: 15, color: Colors.navy, fontWeight: '500' },
  navTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  navSpacer: { minWidth: 70 },
  scroll: { padding: 24, paddingBottom: 40 },
  intro: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 24 },
})