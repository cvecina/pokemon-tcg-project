// Test de la API de Pokémon TCG
import PokemonTCG from 'pokemon-tcg-sdk-typescript'

console.log('🔍 Probando conexión con la API de Pokémon TCG...')

// Función de prueba
async function testPokemonAPI() {
  try {
    console.log('Buscando cartas de Pikachu...')
    
    const response = await PokemonTCG.Card.where({
      q: 'name:Pikachu',
      pageSize: 5
    })
    
    console.log(`✅ ¡Éxito! Encontradas ${response.totalCount} cartas de Pikachu`)
    console.log('Primeras 5 cartas:')
    
    response.data.forEach((card, index) => {
      console.log(`${index + 1}. ${card.name} - Set: ${card.set.name}`)
      console.log(`   ID: ${card.id}`)
      console.log(`   Imagen: ${card.images.small}`)
      console.log('---')
    })
    
  } catch (error) {
    console.error('❌ Error conectando con la API:', error)
  }
}

testPokemonAPI()

export { testPokemonAPI }
