# RepsolGo

App móvil de fidelización para clientes Repsol Perú. Desarrollada con React Native + Expo Router.

## Módulos

- **Autenticación**: Login, registro, recuperar/cambiar contraseña
- **Mapa de grifos**: 5 grifos Repsol en Lima centro con precios y tiempo de espera
- **Puntos**: Balance, historial de cargas, canje de puntos
- **Escanear**: OCR de boletas para acreditar puntos (simulado)
- **Retos**: Gamificación con retos, XP, badges y racha diaria
- **Perfil**: Ver/editar datos, foto de perfil, preferencias, logout

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npx expo start
# Presiona 'a' para Android
# Presiona 'i' para iOS
```

## En tu teléfono (Expo Go)

1. Instala **Expo Go** desde Play Store o App Store
2. Ejecuta `npx expo start`
3. Escanea el QR que aparece en la terminal
4. La app se carga directamente en tu dispositivo

## APK para instalar directamente

```bash
# Opción 1: Build local (requiere Android Studio)
npx expo run:android

# Opción 2: EAS Build (requiere cuenta Expo/EAS)
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

## Estructura de la app

```
app/
  _layout.tsx          # Root layout + QueryClient + auth check
  index.tsx            # Redirect a login
  (auth)/              # Pantallas sin autenticar
    login.tsx
    register.tsx
    forgot-password.tsx
    reset-password.tsx
  (app)/               # Pantallas autenticadas (tab navigator)
    mapa.tsx
    puntos.tsx
    escanear.tsx
    retos.tsx
    perfil/
      index.tsx
      editar.tsx
src/
  components/          # Componentes reutilizables
  constants/           # Colors, config
  hooks/               # useAuth, useLocation
  services/            # Mock services (auth, grifos, puntos)
  store/               # Zustand store (auth)
  types/               # TypeScript types
```

## Stack tecnológico

- **Expo SDK 57** + Expo Router 57
- **React Native 0.86** + React 19 + TypeScript
- **Zustand** — estado global de auth
- **expo-secure-store** — persistencia del token
- **react-native-maps** — mapa de grifos
- **react-native-svg** — íconos del marcador del mapa
- **expo-camera** — escáner de boletas
- **expo-image-picker** — foto de perfil
- **@tanstack/react-query** — gestión de datos async

## Colores de marca

| Token | Hex |
|-------|-----|
| Navy | `#041E42` |
| NavyMid | `#1A3A5C` |
| Orange | `#FF8200` |
| Red | `#E4002B` |
| Green | `#22C55E` |
