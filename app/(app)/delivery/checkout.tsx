import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../src/constants/colors'
import { Button } from '../../../src/components/ui/Button'
import { Input } from '../../../src/components/ui/Input'
import {
  DeliveryService,
  COSTO_ENVIO,
  MAX_CANTIDAD,
} from '../../../src/services/delivery.service'
import { useDeliveryStore } from '../../../src/store/delivery.store'
import { useAuthStore } from '../../../src/store/auth.store'
import type { BalonGlp, MetodoPago } from '../../../src/types'

const METODOS: { value: MetodoPago; emoji: string; name: string; hint: string }[] = [
  { value: 'yape', emoji: '💜', name: 'Yape', hint: 'Recibirás la solicitud de pago en tu app Yape.' },
  { value: 'plin', emoji: '💙', name: 'Plin', hint: 'Recibirás la solicitud de pago en tu app Plin.' },
  { value: 'tarjeta', emoji: '💳', name: 'Tarjeta', hint: 'Pago con tarjeta de crédito o débito (simulado).' },
]

export default function CheckoutScreen() {
  const router = useRouter()
  const { balonId, cantidad: cantidadParam } = useLocalSearchParams<{
    balonId: string
    cantidad: string
  }>()
  const user = useAuthStore(state => state.user)
  const crearPedido = useDeliveryStore(state => state.crearPedido)
  const isLoading = useDeliveryStore(state => state.isLoading)

  const cantidad = Math.min(Math.max(parseInt(cantidadParam ?? '1', 10) || 1, 1), MAX_CANTIDAD)

  const [balon, setBalon] = useState<BalonGlp | null>(null)
  const [loadingBalon, setLoadingBalon] = useState(true)
  const [direccion, setDireccion] = useState('')
  const [referencia, setReferencia] = useState('')
  const [metodo, setMetodo] = useState<MetodoPago>('yape')
  const [errors, setErrors] = useState<{ direccion?: string }>({})

  useEffect(() => {
    if (!balonId) {
      setLoadingBalon(false)
      return
    }
    DeliveryService.getBalon(balonId)
      .then(b => setBalon(b ?? null))
      .finally(() => setLoadingBalon(false))
  }, [balonId])

  const subtotal = balon ? balon.precio * cantidad : 0
  const total = subtotal + COSTO_ENVIO
  const metodoActual = METODOS.find(m => m.value === metodo)

  function validate() {
    const errs: { direccion?: string } = {}
    if (!direccion.trim()) errs.direccion = 'Ingresa la dirección de entrega'
    else if (direccion.trim().length < 8) errs.direccion = 'Escribe una dirección más completa'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleConfirm() {
    if (!balon || !user) return
    if (!validate()) return
    try {
      const pedido = await crearPedido({
        clienteId: user.id,
        balonId: balon.id,
        cantidad,
        direccion: direccion.trim(),
        referencia: referencia.trim() || undefined,
        metodoPago: metodo,
      })
      router.replace({ pathname: '/(app)/delivery/[id]', params: { id: pedido.id } })
    } catch (e) {
      Alert.alert('No se pudo crear el pedido', e instanceof Error ? e.message : 'Intenta de nuevo.')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Confirmar pedido</Text>
        <View style={styles.navSpacer} />
      </View>

      {loadingBalon ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.orange} />
        </View>
      ) : !balon ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>No encontramos el balón seleccionado</Text>
          <Button label="Volver al catálogo" onPress={() => router.back()} style={styles.errorBtn} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Dirección de entrega</Text>
            <Input
              label="Dirección"
              value={direccion}
              onChangeText={text => {
                setDireccion(text)
                setErrors({})
              }}
              placeholder="Av. / Calle, número, distrito"
              autoCapitalize="words"
              error={errors.direccion}
            />
            <Input
              label="Referencia (opcional)"
              value={referencia}
              onChangeText={setReferencia}
              placeholder="Ej. Casa verde, 2do piso"
            />

            <Text style={styles.sectionTitle}>Método de pago</Text>
            <View style={styles.metodoRow}>
              {METODOS.map(m => {
                const active = metodo === m.value
                return (
                  <TouchableOpacity
                    key={m.value}
                    style={[styles.metodoCard, active && styles.metodoCardActive]}
                    onPress={() => setMetodo(m.value)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.metodoEmoji}>{m.emoji}</Text>
                    <Text style={[styles.metodoName, active && styles.metodoNameActive]}>
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            <Text style={styles.metodoHint}>{metodoActual?.hint}</Text>

            <Text style={styles.sectionTitle}>Resumen</Text>
            <View style={styles.resumenCard}>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>
                  {cantidad} × {balon.nombre}
                </Text>
                <Text style={styles.resumenValue}>S/{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>Envío</Text>
                <Text style={styles.resumenValue}>S/{COSTO_ENVIO.toFixed(2)}</Text>
              </View>
              <View style={styles.resumenDivider} />
              <View style={styles.resumenRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>S/{total.toFixed(2)}</Text>
              </View>
            </View>

            <Button
              label={`Pagar S/${total.toFixed(2)}`}
              onPress={handleConfirm}
              loading={isLoading}
              fullWidth
              style={styles.payBtn}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 4,
  },
  metodoRow: { flexDirection: 'row', gap: 10 },
  metodoCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.white,
  },
  metodoCardActive: { borderColor: Colors.orange, backgroundColor: '#FFF3E0' },
  metodoEmoji: { fontSize: 26, marginBottom: 6 },
  metodoName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  metodoNameActive: { color: Colors.orange },
  metodoHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 16,
  },
  resumenCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 24,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resumenLabel: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  resumenValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  resumenDivider: { height: 1, backgroundColor: Colors.border, marginBottom: 10 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 20, fontWeight: '800', color: Colors.orange },
  payBtn: { marginTop: 4 },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorBtn: { minWidth: 180 },
})