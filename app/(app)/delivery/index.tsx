import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../src/constants/colors'
import { Button } from '../../../src/components/ui/Button'
import { BalonCard } from '../../../src/components/delivery/BalonCard'
import { PedidoCard } from '../../../src/components/delivery/PedidoCard'
import {
  DeliveryService,
  COSTO_ENVIO,
  MAX_CANTIDAD,
} from '../../../src/services/delivery.service'
import { useDeliveryStore } from '../../../src/store/delivery.store'
import { useAuthStore } from '../../../src/store/auth.store'
import type { BalonGlp, Pedido } from '../../../src/types'

type Tab = 'pedir' | 'pedidos'

export default function DeliveryScreen() {
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const pedidos = useDeliveryStore(state => state.pedidos)
  const loadPedidos = useDeliveryStore(state => state.loadPedidos)

  const [tab, setTab] = useState<Tab>('pedir')
  const [catalogo, setCatalogo] = useState<BalonGlp[]>([])
  const [loadingCatalogo, setLoadingCatalogo] = useState(true)
  const [balonId, setBalonId] = useState<string | null>(null)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    DeliveryService.getCatalogo()
      .then(items => {
        setCatalogo(items)
        // El de 10 kg es el más pedido: viene preseleccionado.
        setBalonId(items.find(b => b.tamano === 10)?.id ?? items[0]?.id ?? null)
      })
      .finally(() => setLoadingCatalogo(false))
  }, [])

  useEffect(() => {
    if (user?.id) loadPedidos(user.id)
  }, [user?.id, loadPedidos])

  const balon = catalogo.find(b => b.id === balonId) ?? null
  const total = balon ? balon.precio * cantidad + COSTO_ENVIO : 0
  const activos = pedidos.filter(p => p.estado !== 'entregado').length

  function handleContinuar() {
    if (!balon) return
    router.push({
      pathname: '/(app)/delivery/checkout',
      params: { balonId: balon.id, cantidad: String(cantidad) },
    })
  }

  function handleOpenPedido(pedido: Pedido) {
    router.push({ pathname: '/(app)/delivery/[id]', params: { id: pedido.id } })
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Repsol GLP</Text>
        <Text style={styles.headerTitle}>Delivery de gas</Text>
        <Text style={styles.headerSub}>Te llevamos tu balón hasta la puerta de tu casa</Text>
      </View>

      <View style={styles.segment}>
        <TouchableOpacity
          style={[styles.segmentBtn, tab === 'pedir' && styles.segmentBtnActive]}
          onPress={() => setTab('pedir')}
          activeOpacity={0.85}
        >
          <Text style={[styles.segmentText, tab === 'pedir' && styles.segmentTextActive]}>
            Pedir gas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, tab === 'pedidos' && styles.segmentBtnActive]}
          onPress={() => setTab('pedidos')}
          activeOpacity={0.85}
        >
          <Text style={[styles.segmentText, tab === 'pedidos' && styles.segmentTextActive]}>
            Mis pedidos{activos > 0 ? ` (${activos})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'pedir' ? (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Elige el tamaño del balón</Text>
            {loadingCatalogo ? (
              <ActivityIndicator color={Colors.orange} style={styles.loader} />
            ) : (
              catalogo.map(b => (
                <BalonCard
                  key={b.id}
                  balon={b}
                  selected={b.id === balonId}
                  onPress={item => setBalonId(item.id)}
                />
              ))
            )}

            <Text style={styles.sectionTitle}>Cantidad</Text>
            <View style={styles.stepperCard}>
              <TouchableOpacity
                style={[styles.stepperBtn, cantidad <= 1 && styles.stepperBtnDisabled]}
                onPress={() => setCantidad(c => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
                activeOpacity={0.8}
              >
                <Text style={styles.stepperBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{cantidad}</Text>
              <TouchableOpacity
                style={[styles.stepperBtn, cantidad >= MAX_CANTIDAD && styles.stepperBtnDisabled]}
                onPress={() => setCantidad(c => Math.min(MAX_CANTIDAD, c + 1))}
                disabled={cantidad >= MAX_CANTIDAD}
                activeOpacity={0.8}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Máximo {MAX_CANTIDAD} balones por pedido.</Text>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerInfo}>
              <Text style={styles.footerLabel}>Total estimado</Text>
              <Text style={styles.footerTotal}>S/{total.toFixed(2)}</Text>
              <Text style={styles.footerNote}>Incluye envío S/{COSTO_ENVIO.toFixed(2)}</Text>
            </View>
            <Button
              label="Continuar"
              onPress={handleContinuar}
              disabled={!balon}
              style={styles.footerBtn}
            />
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {pedidos.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🛵</Text>
              <Text style={styles.emptyTitle}>Aún no tienes pedidos</Text>
              <Text style={styles.emptyText}>
                Cuando pidas un balón de gas, aquí podrás ver su estado.
              </Text>
              <Button
                label="Pedir gas"
                onPress={() => setTab('pedir')}
                style={styles.emptyBtn}
              />
            </View>
          ) : (
            pedidos.map(p => <PedidoCard key={p.id} pedido={p} onPress={handleOpenPedido} />)
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: -14,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: Colors.orange },
  segmentText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  segmentTextActive: { color: Colors.white },
  content: { padding: 16, paddingBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 4,
  },
  loader: { marginVertical: 24 },
  stepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 12,
    gap: 28,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: { opacity: 0.3 },
  stepperBtnText: { color: Colors.white, fontSize: 24, fontWeight: '600', lineHeight: 28 },
  stepperValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  hint: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginTop: 8 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  footerInfo: { flex: 1 },
  footerLabel: { fontSize: 12, color: Colors.textSecondary },
  footerTotal: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  footerNote: { fontSize: 11, color: Colors.textMuted },
  footerBtn: { minWidth: 150 },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyBtn: { minWidth: 160 },
})