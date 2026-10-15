import { create } from 'zustand'
import { DeliveryService, type NuevoPedido } from '../services/delivery.service'
import type { Pedido } from '../types'

interface DeliveryState {
  pedidos: Pedido[]
  isLoading: boolean
  loadPedidos: (clienteId: string) => Promise<void>
  crearPedido: (data: NuevoPedido) => Promise<Pedido>
  avanzarEstado: (id: string) => Promise<void>
}

export const useDeliveryStore = create<DeliveryState>(set => ({
  pedidos: [],
  isLoading: false,

  loadPedidos: async clienteId => {
    const pedidos = await DeliveryService.getPedidos(clienteId)
    set({ pedidos })
  },

  crearPedido: async data => {
    set({ isLoading: true })
    try {
      const pedido = await DeliveryService.crearPedido(data)
      set(state => ({ pedidos: [pedido, ...state.pedidos] }))
      return pedido
    } finally {
      set({ isLoading: false })
    }
  },

  avanzarEstado: async id => {
    const actualizado = await DeliveryService.avanzarEstado(id)
    set(state => ({
      pedidos: state.pedidos.map(p => (p.id === id ? actualizado : p)),
    }))
  },
}))