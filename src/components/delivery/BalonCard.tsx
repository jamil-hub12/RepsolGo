import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors } from '../../constants/colors'
import type { BalonGlp } from '../../types'

interface BalonCardProps {
  balon: BalonGlp
  selected: boolean
  onPress: (balon: BalonGlp) => void
}

export function BalonCard({ balon, selected, onPress }: BalonCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={() => onPress(balon)}
      activeOpacity={0.85}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{balon.icono}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nombre}>{balon.nombre}</Text>
        <Text style={styles.descripcion}>{balon.descripcion}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.precio}>S/{balon.precio.toFixed(2)}</Text>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected ? <View style={styles.radioDot} /> : null}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
  },
  selected: {
    borderColor: Colors.orange,
    backgroundColor: '#FFF8EE',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 24 },
  info: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  descripcion: { fontSize: 12, color: Colors.textSecondary, lineHeight: 16 },
  right: { alignItems: 'flex-end', marginLeft: 8 },
  precio: { fontSize: 15, fontWeight: '800', color: Colors.orange, marginBottom: 8 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: Colors.orange },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.orange },
})