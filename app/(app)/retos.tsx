import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../src/constants/colors'
import { RetoCard } from '../../src/components/gamificacion/RetoCard'
import { BadgeGrid } from '../../src/components/gamificacion/BadgeGrid'
import type { Reto, Badge } from '../../src/types'

const RETOS_ACTIVOS: Reto[] = [
  {
    id: '1',
    titulo: 'Cargador Constante',
    descripcion: 'Realiza 5 cargas este mes en cualquier grifo Repsol',
    progreso: 3,
    meta: 5,
    puntos: 300,
    xp: 100,
    fechaVencimiento: '31 oct',
    completado: false,
    icono: '⚡',
    color: Colors.orange,
  },
  {
    id: '2',
    titulo: 'Madrugador',
    descripcion: 'Carga entre 6 AM y 9 AM durante 3 días',
    progreso: 1,
    meta: 3,
    puntos: 200,
    xp: 75,
    fechaVencimiento: '20 oct',
    completado: false,
    icono: '🌅',
    color: '#F59E0B',
  },
  {
    id: '3',
    titulo: 'Explorador',
    descripcion: 'Visita 5 grifos Repsol distintos',
    progreso: 4,
    meta: 5,
    puntos: 250,
    xp: 80,
    fechaVencimiento: '31 oct',
    completado: false,
    icono: '🗺️',
    color: '#3B82F6',
  },
]

const BADGES: Badge[] = [
  { id: '1', nombre: 'Pionero', descripcion: 'Primera carga', icono: '🚀', ganado: true, color: '#F59E0B' },
  { id: '2', nombre: 'Fiel', descripcion: '10 cargas', icono: '❤️', ganado: true, color: Colors.red },
  { id: '3', nombre: 'Explorador', descripcion: '5 grifos', icono: '🗺️', ganado: true, color: '#3B82F6' },
  { id: '4', nombre: 'Madrugador', descripcion: 'Carga temprana', icono: '🌅', ganado: false, color: '#F59E0B' },
  { id: '5', nombre: 'Platinum', descripcion: 'Nivel Platino', icono: '💎', ganado: false },
  { id: '6', nombre: 'Reto Rey', descripcion: '10 retos', icono: '👑', ganado: false },
  { id: '7', nombre: 'Ahorrón', descripcion: '5 canjes', icono: '💰', ganado: false },
  { id: '8', nombre: 'Estrella', descripcion: 'Un año activo', icono: '⭐', ganado: false },
]

export default function RetosScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerLabel}>Tus desafíos</Text>
              <Text style={styles.headerTitle}>Retos & Logros</Text>
            </View>
            <View style={styles.rachaContainer}>
              <View style={styles.rachaBadge}>
                <Text style={styles.rachaEmoji}>🔥</Text>
                <Text style={styles.rachaText}>7 días</Text>
              </View>
              <Text style={styles.rachaLabel}>Racha</Text>
            </View>
          </View>

          <View style={styles.xpSection}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpNivel}>Nivel 12 — Explorador</Text>
              <Text style={styles.xpPct}>62%</Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: '62%' }]} />
            </View>
            <Text style={styles.xpHint}>1,860 / 3,000 XP para Nivel 13</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Retos activos</Text>
          {RETOS_ACTIVOS.map(reto => (
            <RetoCard key={reto.id} reto={reto} />
          ))}

          <Text style={styles.sectionTitle}>Badges coleccionables</Text>
          <View style={styles.badgesContainer}>
            <BadgeGrid badges={BADGES} />
          </View>

          <View style={styles.carbonCard}>
            <View style={styles.carbonHeader}>
              <View style={styles.carbonIcon}>
                <Text style={styles.carbonEmoji}>🌱</Text>
              </View>
              <View style={styles.carbonInfo}>
                <Text style={styles.carbonTitle}>Huella de carbono</Text>
                <Text style={styles.carbonSubtitle}>Compensación acumulada</Text>
              </View>
              <Text style={styles.carbonValue}>12.4 kg</Text>
            </View>
            <Text style={styles.carbonLabel}>CO₂ compensados este año</Text>
            <View style={styles.carbonTrack}>
              <View style={[styles.carbonFill, { width: '52%' }]} />
            </View>
            <View style={styles.carbonFooter}>
              <Text style={styles.carbonFooterText}>52% de tu meta anual</Text>
              <Text style={styles.carbonFooterMeta}>Meta: 24 kg</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  rachaContainer: {
    alignItems: 'center',
  },
  rachaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(228,0,43,0.3)',
    borderWidth: 1,
    borderColor: Colors.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  rachaEmoji: {
    fontSize: 16,
  },
  rachaText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  rachaLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  xpSection: {},
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpNivel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  xpPct: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.orange,
  },
  xpTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 6,
  },
  xpFill: {
    height: 8,
    backgroundColor: Colors.orange,
    borderRadius: 4,
  },
  xpHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  content: {
    padding: 16,
    marginTop: -8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
    marginTop: 8,
  },
  badgesContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  carbonCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
    marginBottom: 20,
  },
  carbonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  carbonIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  carbonEmoji: {
    fontSize: 22,
  },
  carbonInfo: {
    flex: 1,
  },
  carbonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803D',
  },
  carbonSubtitle: {
    fontSize: 12,
    color: '#166534',
  },
  carbonValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#15803D',
  },
  carbonLabel: {
    fontSize: 12,
    color: '#166534',
    marginBottom: 10,
  },
  carbonTrack: {
    height: 8,
    backgroundColor: '#BBF7D0',
    borderRadius: 4,
    marginBottom: 8,
  },
  carbonFill: {
    height: 8,
    backgroundColor: Colors.green,
    borderRadius: 4,
  },
  carbonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carbonFooterText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
  },
  carbonFooterMeta: {
    fontSize: 12,
    color: '#166534',
  },
})
