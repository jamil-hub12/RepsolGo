import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

interface PuntosHeroCardProps {
  puntos: number
  nivel: string
  progresoNivel: number
  esteMes: number
  cargas: number
  retosCompletados: number
}

export function PuntosHeroCard({
  puntos,
  nivel,
  progresoNivel,
  esteMes,
  cargas,
  retosCompletados,
}: PuntosHeroCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.puntosLabel}>Tus puntos</Text>
            <Text style={styles.puntosValue}>{puntos.toLocaleString()}</Text>
          </View>
          <View style={styles.nivelBadge}>
            <Text style={styles.nivelText}>{nivel.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Progreso a Platino</Text>
            <Text style={styles.progressPct}>{Math.round(progresoNivel * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progresoNivel * 100}%` as `${number}%` }]} />
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>+{esteMes}</Text>
            <Text style={styles.statLabel}>Este mes</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{cargas}</Text>
            <Text style={styles.statLabel}>Cargas</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{retosCompletados}</Text>
            <Text style={styles.statLabel}>Retos</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.navy,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.navyMid,
    opacity: 0.5,
  },
  content: {
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  puntosLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  puntosValue: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
  },
  nivelBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  nivelText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  progressPct: {
    fontSize: 12,
    color: Colors.orange,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.orange,
    borderRadius: 3,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  separator: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
})
