// Composable para configurar la API de Pokemon TCG
import PokemonTCG from 'pokemon-tcg-sdk-typescript'

export const usePokemonTCG = () => {
  const config = useRuntimeConfig()
  
  // Configurar headers para las peticiones si tenemos API key
  const getRequestConfig = () => {
    const baseConfig = {}
    
    if (config.public.pokemonTcgApiKey) {
      // Para esta versión del SDK, necesitamos configurar manualmente los headers
      console.log('🔑 Configurando API key para peticiones')
      return {
        headers: {
          'X-Api-Key': config.public.pokemonTcgApiKey
        }
      }
    }
    
    console.log('⚠️ Sin API key - usando límites públicos')
    return baseConfig
  }
  
  // Función wrapper para Card.where con API key
  const searchCards = async (options) => {
    try {
      if (config.public.pokemonTcgApiKey) {
        // Si tenemos API key, establecerla globalmente
        process.env.POKEMON_API_KEY = config.public.pokemonTcgApiKey
      }
      
      return await PokemonTCG.Card.where(options)
    } catch (error) {
      console.error('Error en searchCards:', error)
      throw error
    }
  }
  
  // Función wrapper para Set.all con API key
  const getAllSets = async () => {
    try {
      if (config.public.pokemonTcgApiKey) {
        process.env.POKEMON_API_KEY = config.public.pokemonTcgApiKey
      }
      
      return await PokemonTCG.Set.all()
    } catch (error) {
      console.error('Error en getAllSets:', error)
      throw error
    }
  }
  
  // Función wrapper para Type.all con API key
  const getAllTypes = async () => {
    try {
      if (config.public.pokemonTcgApiKey) {
        process.env.POKEMON_API_KEY = config.public.pokemonTcgApiKey
      }
      
      return await PokemonTCG.Type.all()
    } catch (error) {
      console.error('Error en getAllTypes:', error)
      throw error
    }
  }
  
  // Función wrapper para Rarity.all con API key
  const getAllRarities = async () => {
    try {
      if (config.public.pokemonTcgApiKey) {
        process.env.POKEMON_API_KEY = config.public.pokemonTcgApiKey
      }
      
      return await PokemonTCG.Rarity.all()
    } catch (error) {
      console.error('Error en getAllRarities:', error)
      throw error
    }
  }
  
  return {
    searchCards,
    getAllSets,
    getAllTypes,
    getAllRarities,
    getRequestConfig,
    hasApiKey: !!config.public.pokemonTcgApiKey
  }
}
