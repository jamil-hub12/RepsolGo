import * as LocalAuthentication from 'expo-local-authentication'

export const BiometricService = {
  async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    if (!hasHardware) return false
    return LocalAuthentication.isEnrolledAsync()
  },

  async authenticate(promptMessage: string): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancelar',
    })
    return result.success
  },
}