import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../src/constants/colors'
import { useAuthStore } from '../../../src/store/auth.store'
import { BiometricService } from '../../../src/services/biometric.service'

interface MenuItemProps {
  label: string
  icon: string
  onPress?: () => void
  rightElement?: React.ReactNode
}

function MenuItem({ label, icon, onPress, rightElement }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress && !rightElement}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Text style={styles.menuIconText}>{icon}</Text>
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      {rightElement ?? (onPress ? <Text style={styles.menuChevron}>›</Text> : null)}
    </TouchableOpacity>
  )
}

const ROL_LABEL: Record<string, string> = {
  cliente: 'Cliente',
  repartidor: 'Repartidor',
  operador: 'Operador de grifo',
  supervisor: 'Supervisor',
}

export default function PerfilScreen() {
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const prefs = useAuthStore(state => state.prefs)
  const setPref = useAuthStore(state => state.setPref)
  const biometricEnabled = useAuthStore(state => state.biometricEnabled)
  const setBiometric = useAuthStore(state => state.setBiometric)

  const soon = () =>
    Alert.alert('Próximamente', 'Esta sección estará disponible en la siguiente versión.')

  async function handleBiometric(value: boolean) {
    if (value) {
      const available = await BiometricService.isAvailable()
      if (!available) {
        Alert.alert(
          'Biometría no disponible',
          'Configura una huella o rostro en los ajustes de tu dispositivo.'
        )
        return
      }
      const ok = await BiometricService.authenticate('Confirma tu identidad')
      if (!ok) return
    }
    await setBiometric(value)
  }

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await logout()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  const initials = user?.nombre?.split(' ').map(n => n[0]).slice(0, 2).join('') ?? 'U'

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi perfil</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
          <Text style={styles.userName}>{user?.nombre ?? 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          <View style={styles.badgesRow}>
            <View style={styles.nivelBadge}>
              <Text style={styles.nivelText}>{user?.nivel ?? 'Bronce'}</Text>
            </View>
            <View style={styles.rolBadge}>
              <Text style={styles.rolText}>{ROL_LABEL[user?.rol ?? 'cliente']}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user?.puntos?.toLocaleString() ?? '0'}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Cargas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Retos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi cuenta</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="✏️" label="Editar perfil" onPress={() => router.push('/(app)/perfil/editar')} />
            <MenuItem icon="⛽" label="Mis cargas" onPress={soon} />
            <MenuItem icon="⭐" label="Mis favoritos" onPress={soon} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="🔐"
              label="Cambiar contraseña"
              onPress={() => router.push('/(app)/perfil/cambiar-password')}
            />
            <MenuItem
              icon="👆"
              label="Desbloqueo con huella o rostro"
              rightElement={
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometric}
                  trackColor={{ false: Colors.border, true: Colors.orange }}
                  thumbColor={Colors.white}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="🔔"
              label="Notificaciones push"
              rightElement={
                <Switch
                  value={prefs.notifPush}
                  onValueChange={v => setPref('notifPush', v)}
                  trackColor={{ false: Colors.border, true: Colors.orange }}
                  thumbColor={Colors.white}
                />
              }
            />
            <MenuItem
              icon="📧"
              label="Notificaciones por email"
              rightElement={
                <Switch
                  value={prefs.notifEmail}
                  onValueChange={v => setPref('notifEmail', v)}
                  trackColor={{ false: Colors.border, true: Colors.orange }}
                  thumbColor={Colors.white}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="ℹ️" label="Versión 1.0.0" />
            <MenuItem icon="📋" label="Términos y condiciones" onPress={soon} />
            <MenuItem icon="🔒" label="Política de privacidad" onPress={soon} />
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 14 },
  avatarText: { color: Colors.white, fontSize: 28, fontWeight: '800' },
  userName: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  userEmail: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  badgesRow: { flexDirection: 'row', gap: 8 },
  nivelBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  nivelText: { color: Colors.white, fontWeight: '700', fontSize: 13, letterSpacing: 1 },
  rolBadge: {
    backgroundColor: '#E8EDF4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rolText: { color: Colors.navy, fontWeight: '600', fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconText: { fontSize: 18 },
  menuLabel: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500', flexShrink: 1 },
  menuChevron: { fontSize: 20, color: Colors.textMuted, lineHeight: 24 },
  logoutSection: { padding: 16, paddingTop: 24, paddingBottom: 40 },
  logoutBtn: {
    backgroundColor: Colors.red,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
})