import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { Colors } from '../../../src/constants/colors'
import { Input } from '../../../src/components/ui/Input'
import { useAuthStore } from '../../../src/store/auth.store'

export default function EditarPerfilScreen() {
  const router = useRouter()
  const { user, updateUser } = useAuthStore()

  const [nombre, setNombre] = useState(user?.nombre ?? '')
  const [telefono, setTelefono] = useState(user?.telefono ?? '')
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null)
  const [saving, setSaving] = useState(false)

  const initials = nombre.split(' ').map(n => n[0]).slice(0, 2).join('')

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería de fotos.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri)
    }
  }

  async function handleSave() {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.')
      return
    }
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    updateUser({ nombre: nombre.trim(), telefono, avatar: avatar ?? undefined })
    setSaving(false)
    Alert.alert('¡Guardado!', 'Tu perfil fue actualizado correctamente.', [
      { text: 'OK', onPress: () => router.back() },
    ])
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Editar perfil</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
          <Text style={[styles.saveText, saving && styles.savingText]}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer} activeOpacity={0.8}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials || 'U'}</Text>
              </View>
            )}
            <View style={styles.editOverlay}>
              <Text style={styles.editOverlayText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Toca para cambiar tu foto</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre"
            autoCapitalize="words"
          />
          <Input
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+51 999 999 999"
            keyboardType="phone-pad"
          />
          <Input
            label="Email"
            value={user?.email ?? ''}
            editable={false}
            placeholder="tu@email.com"
            style={styles.disabledInput}
          />
          <Text style={styles.emailNote}>
            El email no puede ser modificado por seguridad.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
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
  backBtn: {
    padding: 4,
  },
  backText: {
    fontSize: 15,
    color: Colors.navy,
    fontWeight: '500',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  saveBtn: {
    padding: 4,
  },
  saveText: {
    fontSize: 15,
    color: Colors.orange,
    fontWeight: '700',
  },
  savingText: {
    opacity: 0.5,
  },
  scroll: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  editOverlayText: {
    fontSize: 14,
  },
  avatarHint: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  form: {
    padding: 24,
  },
  disabledInput: {
    backgroundColor: Colors.surface,
    color: Colors.textMuted,
  },
  emailNote: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: -8,
  },
})
