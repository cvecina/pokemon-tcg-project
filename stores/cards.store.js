import { defineStore } from 'pinia'
import PokemonTCG from 'pokemon-tcg-sdk-typescript'

export const useCardsStore = defineStore('cards', {
  state: () => ({
    searchResults: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
    lastQuery: '',
    sets: [],
    types: [],
    rarities: [],
    filters: {
      name: '',
      set: '',
      type: '',
      rarity: '',
      supertype: ''
    }
  }),
  
  getters: {
    hasResults: (state) => state.searchResults.length > 0,
    totalPages: (state) => Math.ceil(state.totalCount / state.pageSize),
    isFirstPage: (state) => state.currentPage === 1,
    isLastPage: (state) => state.currentPage >= Math.ceil(state.totalCount / state.pageSize)
  },
  
  actions: {
    // Cargar sets disponibles
    async loadSets() {
      try {
        this.loading = true
        const response = await PokemonTCG.Set.all()
        this.sets = response.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      } catch (error) {
        console.error('Error loading sets:', error)
        this.error = 'Error al cargar los sets'
      } finally {
        this.loading = false
      }
    },
    
    // Cargar tipos disponibles
    async loadTypes() {
      try {
        const response = await PokemonTCG.Type.all()
        this.types = response
      } catch (error) {
        console.error('Error loading types:', error)
      }
    },
    
    // Cargar rarezas disponibles
    async loadRarities() {
      try {
        const response = await PokemonTCG.Rarity.all()
        this.rarities = response
      } catch (error) {
        console.error('Error loading rarities:', error)
      }
    },
    
    // Buscar cartas con filtros
    async searchCards(filters = {}, page = 1) {
      try {
        this.loading = true
        this.error = null
        this.currentPage = page
        
        // Construir la query
        const queryParts = []
        
        if (filters.name) {
          queryParts.push(`name:*${filters.name}*`)
        }
        
        if (filters.set) {
          queryParts.push(`set.id:${filters.set}`)
        }
        
        if (filters.type) {
          queryParts.push(`types:${filters.type}`)
        }
        
        if (filters.rarity) {
          queryParts.push(`rarity:"${filters.rarity}"`)
        }
        
        if (filters.supertype) {
          queryParts.push(`supertype:${filters.supertype}`)
        }
        
        const query = queryParts.join(' ')
        this.lastQuery = query
        
        const response = await PokemonTCG.Card.where({
          q: query,
          page: page,
          pageSize: this.pageSize
        })
        
        this.searchResults = response.data
        this.totalCount = response.totalCount
        this.filters = { ...filters }
        
      } catch (error) {
        console.error('Error searching cards:', error)
        this.error = 'Error al buscar cartas'
        this.searchResults = []
      } finally {
        this.loading = false
      }
    },
    
    // Obtener cartas aleatorias
    async getRandomCards(count = 12) {
      try {
        this.loading = true
        this.error = null
        
        const response = await PokemonTCG.Card.where({
          pageSize: count,
          page: Math.floor(Math.random() * 100) + 1
        })
        
        this.searchResults = response.data
        this.totalCount = response.totalCount
        this.currentPage = 1
        this.lastQuery = 'random'
        
      } catch (error) {
        console.error('Error getting random cards:', error)
        this.error = 'Error al obtener cartas aleatorias'
        this.searchResults = []
      } finally {
        this.loading = false
      }
    },
    
    // Obtener carta por ID
    async getCardById(id) {
      try {
        const response = await PokemonTCG.Card.find(id)
        return response
      } catch (error) {
        console.error('Error getting card by ID:', error)
        throw error
      }
    },
    
    // Navegar a página siguiente
    async nextPage() {
      if (!this.isLastPage) {
        await this.searchCards(this.filters, this.currentPage + 1)
      }
    },
    
    // Navegar a página anterior
    async prevPage() {
      if (!this.isFirstPage) {
        await this.searchCards(this.filters, this.currentPage - 1)
      }
    },
    
    // Ir a página específica
    async goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        await this.searchCards(this.filters, page)
      }
    },
    
    // Limpiar resultados
    clearResults() {
      this.searchResults = []
      this.totalCount = 0
      this.currentPage = 1
      this.lastQuery = ''
      this.error = null
      this.filters = {
        name: '',
        set: '',
        type: '',
        rarity: '',
        supertype: ''
      }
    },
    
    // Actualizar filtros
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    }
  }
})
