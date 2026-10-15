import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors } from '../../constants/colors'
import { Badge } from '../ui/Badge'
import { ESTADO_LABEL, METODO_LABEL } from '../../services/delivery.service'
import type { EstadoPedido, Pedido } from '../../types'

const ESTADO_VARIANT: Record<EstadoPedido, 'indigo' | 'orange' | 'green'> = {
  aceptado: 'indigo',
  en_camino: 'orange',
  entregado: 'green',
}

interface PedidoCardProps {
  pedido: Pedido
  onPress: (pedido: Pedido) => void
}

export function PedidoCard({ pedido, onPress }: PedidoCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(pedido)} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.id}>{pedido.id}</Text>
        <Badge label={ESTADO_LABEL[pedido.estado]} variant={ESTADO_VARIANT[pedido.estado]} />
      </View>
      <Text style={styles.items}>
        {pedido.cantidad} × {pedido.balon.nombre}
      </Text>
      <Text style={styles.direccion} numberOfLines={1}>
        {pedido.direccion}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.fecha}>
          {pedido.fecha} · {METODO_LABEL[pedido.metodoPago]}
        </Text>
        <Text style={styles.total}>S/{pedido.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  id: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.5 },
  items: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  direccion: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fecha: { fontSize: 12, color: Colors.textMuted },
  total: { fontSize: 16, fontWeight: '800', color: Colors.orange },
})