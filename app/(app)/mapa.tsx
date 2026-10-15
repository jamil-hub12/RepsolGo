import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import MapView, { Region } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../src/constants/colors'
import { GrifoMarker } from '../../src/components/mapa/GrifoMarker'
import { GrifoBottomSheet } from '../../src/components/mapa/GrifoBottomSheet'
import { GrifosService } from '../../src/services/grifos.service'
import { Config } from '../../src/constants/config'
import type { Grifo } from '../../src/types'

const INITIAL_GRIFOS: Grifo[] = [
  {
    id: '1',
    nombre: 'Repsol Javier Prado Este',
    direccion: 'Av. Javier Prado Este 4200, La Molina',
    latitude: -12.0839,
    longitude: -76.9786,
    precios: [
      { tipo: '90 oct', precio: 16.49 },
      { tipo: '95 oct', precio: 18.29 },
      { tipo: 'Diesel B5', precio: 15.89 },
    ],
    tiempoEspera: '~5 min',
    abierto24h: true,
    distancia: '2.3 km',
    esFavorito: true,
  },
  {
    id: '2',
    nombre: 'Repsol Benavides',
    direccion: 'Av. Benavides 1244, Miraflores',
    latitude: -12.1116,
    longitude: -77.0086,
    precios: [
      { tipo: '90 oct', precio: 16.59 },
      { tipo: '95 oct', precio: 18.39 },
      { tipo: 'Diesel B5', precio: 15.99 },
    ],
    tiempoEspera: '~8 min',
    abierto24h: true,
    distancia: '3.7 km',
    esFavorito: false,
  },
  {
    id: '3',
    nombre: 'Repsol Angamos',
    direccion: 'Av. Angamos Oeste 890, Surquillo',
    latitude: -12.1073,
    longitude: -77.0256,
    precios: [
      { tipo: '90 oct', precio: 16.45 },
      { tipo: '95 oct', precio: 18.25 },
      { tipo: 'Diesel B5', precio: 15.79 },
    ],
    tiempoEspera: '~3 min',
    abierto24h: false,
    distancia: '4.1 km',
    esFavorito: false,
  },
  {
    id: '4',
    nombre: 'Repsol La Marina',
    direccion: 'Av. La Marina 2355, San Miguel',
    latitude: -12.0850,
    longitude: -77.0856,
    precios: [
      { tipo: '90 oct', precio: 16.42 },
      { tipo: '95 oct', precio: 18.22 },
      { tipo: 'Diesel B5', precio: 15.75 },
    ],
    tiempoEspera: '~12 min',
    abierto24h: true,
    distancia: '5.8 km',
    esFavorito: false,
  },
  {
    id: '5',
    nombre: 'Repsol Panamericana Norte',
    direccion: 'Panamericana Norte Km 12, Independencia',
    latitude: -11.9847,
    longitude: -77.0614,
    precios: [
      { tipo: '90 oct', precio: 16.39 },
      { tipo: '95 oct', precio: 18.19 },
      { tipo: 'Diesel B5', precio: 15.72 },
    ],
    tiempoEspera: '~6 min',
    abierto24h: true,
    distancia: '8.2 km',
    esFavorito: false,
  },
]

export default function MapaScreen() {
  const mapRef = useRef<MapView>(null)
  const [grifos, setGrifos] = useState<Grifo[]>(INITIAL_GRIFOS)
  const [selectedGrifo, setSelectedGrifo] = useState<Grifo | null>(null)
  const [searchText, setSearchText] = useState('')

  function handleMarkerPress(grifo: Grifo) {
    setSelectedGrifo(grifo)
  }

  function handleCloseSheet() {
    setSelectedGrifo(null)
  }

  function handleToggleFavorito(id: string) {
    setGrifos(prev =>
      prev.map(g => (g.id === id ? { ...g, esFavorito: !g.esFavorito } : g))
    )
    if (selectedGrifo?.id === id) {
      setSelectedGrifo(prev => prev ? { ...prev, esFavorito: !prev.esFavorito } : null)
    }
  }

  function handleRecenter() {
    mapRef.current?.animateToRegion(Config.LIMA_CENTER as Region, 800)
  }

  const filteredGrifos = searchText
    ? grifos.filter(
        g =>
          g.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
          g.direccion.toLowerCase().includes(searchText.toLowerCase())
      )
    : grifos

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={Config.LIMA_CENTER as Region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredGrifos.map(grifo => (
          <GrifoMarker
            key={grifo.id}
            grifo={grifo}
            onPress={handleMarkerPress}
            selected={selectedGrifo?.id === grifo.id}
          />
        ))}
      </MapView>

      <SafeAreaView style={styles.searchOverlay} edges={['top']}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar grifo Repsol..."
            placeholderTextColor={Colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>

      <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter} activeOpacity={0.85}>
        <Text style={styles.recenterIcon}>⊕</Text>
      </TouchableOpacity>

      <View style={styles.countBadge}>
        <Text style={styles.countText}>{filteredGrifos.length} grifos</Text>
      </View>

      <GrifoBottomSheet
        grifo={selectedGrifo}
        onClose={handleCloseSheet}
        onToggleFavorito={handleToggleFavorito}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  clearBtn: {
    fontSize: 14,
    color: Colors.textMuted,
    padding: 4,
  },
  recenterBtn: {
    position: 'absolute',
    bottom: 200,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recenterIcon: {
    fontSize: 24,
    color: Colors.navy,
  },
  countBadge: {
    position: 'absolute',
    bottom: 200,
    left: 16,
    backgroundColor: Colors.navy,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  countText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
})
