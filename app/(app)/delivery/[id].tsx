import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../src/constants/colors'
import { Button } from '../../../src/components/ui/Button'
import {
  ESTADOS,
  ESTADO_LABEL,
  METODO_LABEL,
} from '../../../src/services/delivery.service'
import { useDeliveryStore } from '../../../src/store/delivery.store'

const ESTADO_DESC: Record<string, string> = {
  aceptado: 'Tu pedido fue confirmado y el repartidor ya fue asignado.',
  en_camino: 'El repartidor va en camino a tu dirección.',
  entregado: 'Tu balón fue entregado. ¡Gracias por tu compra!',
}

export default function PedidoDetalleScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const pedido = useDeliveryStore(state => state.pedidos.find(p => p.id === id))
  const avanzarEstado = useDeliveryStore(state => state.avanzarEstado)
  const [advancing, setAdvancing] = useState(false)

  async function handleAvanzar() {
    if (!pedido) return
    setAdvancing(true)
    try {
      await avanzarEstado(pedido.id)
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo actualizar el estado.')
    } finally {
      setAdvancing(false)
    }
  }

  const navBar = (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.navTitle}>Detalle del pedido</Text>
      <View style={styles.navSpacer} />
    </View>
  )

  if (!pedido) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {navBar}
        <View style={styles.center}>
          <Text style={styles.notFound}>No encontramos este pedido.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const idx = ESTADOS.indexOf(pedido.estado)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {navBar}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <Text style={styles.pedidoId}>{pedido.id}</Text>
          <Text style={styles.statusTitle}>{ESTADO_LABEL[pedido.estado]}</Text>
          <Text style={styles.statusDesc}>{ESTADO_DESC[pedido.estado]}</Text>

          <View style={styles.timeline}>
            {ESTADOS.map((estado, i) => {
              const done = i <= idx
              return (
                <View key={estado} style={styles.timelineStep}>
                  <View style={styles.timelineTop}>
                    <View style={[styles.line, i === 0 && styles.lineHidden, i <= idx && styles.lineDone]} />
                    <View style={[styles.dot, done && styles.dotDone]}>
                      {done ? <Text style={styles.dotCheck}>✓</Text> : null}
                    </View>
                    <View
                      style={[
                        styles.line,
                        i === ESTADOS.length - 1 && styles.lineHidden,
                        i < idx && styles.lineDone,
                      ]}
                    />
                  </View>
                  <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>
                    {ESTADO_LABEL[estado]}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pedido</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Producto</Text>
            <Text style={styles.value}>
              {pedido.cantidad} × {pedido.balon.nombre}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.value}>{pedido.fecha}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Repartidor</Text>
            <Text style={styles.value}>{pedido.repartidor}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrega</Text>
          <Text style={styles.direccion}>{pedido.direccion}</Text>
          {pedido.referencia ? (
            <Text style={styles.referencia}>Ref.: {pedido.referencia}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pago</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Método</Text>
            <Text style={styles.value}>{METODO_LABEL[pedido.metodoPago]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>S/{pedido.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Envío</Text>
            <Text style={styles.value}>S/{pedido.envio.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total pagado</Text>
            <Text style={styles.totalValue}>S/{pedido.total.toFixed(2)}</Text>
          </View>
        </View>

        {pedido.estado !== 'entregado' ? (
          <View style={styles.demoBox}>
            <Text style={styles.demoText}>
              Demo: el repartidor actualiza el estado desde su módulo (RF35). Mientras tanto,
              puedes simularlo aquí.
            </Text>
            <Button
              label={pedido.estado === 'aceptado' ? 'Simular: repartidor en camino' : 'Simular: marcar como entregado'}
              onPress={handleAvanzar}
              loading={advancing}
              variant="secondary"
              fullWidth
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: 15, color: Colors.textSecondary },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: { padding: 4, minWidth: 70 },
  backText: { fontSize: 15, color: Colors.navy, fontWeight: '500' },
  navTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  navSpacer: { minWidth: 70 },
  scroll: { padding: 16, paddingBottom: 40 },
  statusCard: {
    backgroundColor: Colors.navy,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  pedidoId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginBottom: 6 },
  statusDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 18, marginBottom: 20 },
  timeline: { flexDirection: 'row' },
  timelineStep: { flex: 1, alignItems: 'center' },
  timelineTop: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  line: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  lineHidden: { backgroundColor: 'transparent' },
  lineDone: { backgroundColor: Colors.orange },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: Colors.orange },
  dotCheck: { color: Colors.white, fontSize: 13, fontWeight: '800' },
  stepLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 },
  stepLabelDone: { color: Colors.white, fontWeight: '600' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 14, color: Colors.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, flexShrink: 1, textAlign: 'right' },
  direccion: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20 },
  referencia: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 10 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.orange },
  demoBox: {
    backgroundColor: '#FFF8EE',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFE0B2',
    padding: 16,
    marginTop: 4,
  },
  demoText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginBottom: 12 },
})