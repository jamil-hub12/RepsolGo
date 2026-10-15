import React from 'react'
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet, ColorValue } from 'react-native'
import { Colors } from '../../src/constants/colors'
import { AuthGuard } from '../../src/components/auth/AuthGuard'

function MapIcon({ color }: { color: ColorValue }) {
  return (
    <View style={tabIconStyles.container}>
      <View style={[tabIconStyles.mapBody, { borderColor: color }]}>
        <View style={[tabIconStyles.mapPin, { backgroundColor: color }]} />
      </View>
    </View>
  )
}

function StarIcon({ color }: { color: ColorValue }) {
  return (
    <View style={tabIconStyles.container}>
      <Text style={[tabIconStyles.emoji, { color }]}>⭐</Text>
    </View>
  )
}

function CameraIcon({ color }: { color: ColorValue }) {
  return (
    <View style={[tabIconStyles.scanCircle, { backgroundColor: color === Colors.orange ? Colors.orange : '#374151' }]}>
      <Text style={tabIconStyles.scanText}>⊙</Text>
    </View>
  )
}

function TrophyIcon({ color }: { color: ColorValue }) {
  return (
    <View style={tabIconStyles.container}>
      <Text style={[tabIconStyles.emoji, { color }]}>🏆</Text>
    </View>
  )
}

function UserIcon({ color }: { color: ColorValue }) {
  return (
    <View style={tabIconStyles.container}>
      <View style={[tabIconStyles.userHead, { backgroundColor: color }]} />
      <View style={[tabIconStyles.userBody, { backgroundColor: color }]} />
    </View>
  )
}

export default function AppLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.orange,
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            backgroundColor: Colors.white,
            height: 64,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="mapa"
          options={{
            title: 'Mapa',
            tabBarIcon: ({ color }) => <MapIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="puntos"
          options={{
            title: 'Puntos',
            tabBarIcon: ({ color }) => <StarIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="escanear"
          options={{
            title: 'Escanear',
            tabBarIcon: () => (
              <View style={tabIconStyles.scanWrapper}>
                <View style={tabIconStyles.scanButton}>
                  <Text style={tabIconStyles.scanButtonText}>⊙</Text>
                </View>
              </View>
            ),
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              color: Colors.orange,
            },
          }}
        />
        <Tabs.Screen
          name="retos"
          options={{
            title: 'Retos',
            tabBarIcon: ({ color }) => <TrophyIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <UserIcon color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  )
}

const tabIconStyles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  mapBody: {
    width: 18,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  userHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 1,
  },
  userBody: {
    width: 16,
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  scanCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    fontSize: 16,
    color: Colors.white,
  },
  scanWrapper: {
    marginTop: -16,
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  scanButtonText: {
    fontSize: 24,
    color: Colors.white,
  },
})
