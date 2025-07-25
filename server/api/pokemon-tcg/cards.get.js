// Datos de respaldo para cuando el API falla
const fallbackCards = {
  data: [
    {
      id: 'sv8-1',
      name: 'Charizard ex',
      supertype: 'Pokémon',
      subtypes: ['Stage 2', 'ex'],
      hp: '330',
      types: ['Fire'],
      rarity: 'Ultra Rare',
      artist: 'aky CG Works',
      set: {
        id: 'sv8',
        name: 'Surging Sparks',
        releaseDate: '2024/11/08'
      },
      number: '1',
      images: {
        small: 'https://images.pokemontcg.io/sv8/1.png',
        large: 'https://images.pokemontcg.io/sv8/1_hires.png'
      },
      attacks: [
        {
          name: 'Burning Dark',
          cost: ['Fire', 'Fire', 'Colorless'],
          damage: '180',
          text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon.'
        }
      ],
      weaknesses: [{ type: 'Water', value: '×2' }]
    },
    {
      id: 'sv7-25',
      name: 'Pikachu',
      supertype: 'Pokémon',
      subtypes: ['Basic'],
      hp: '70',
      types: ['Lightning'],
      rarity: 'Common',
      artist: 'Mitsuhiro Arita',
      set: {
        id: 'sv7',
        name: 'Stellar Crown',
        releaseDate: '2024/09/13'
      },
      number: '25',
      images: {
        small: 'https://images.pokemontcg.io/sv7/25.png',
        large: 'https://images.pokemontcg.io/sv7/25_hires.png'
      },
      attacks: [
        {
          name: 'Thunder Shock',
          cost: ['Lightning', 'Colorless'],
          damage: '30',
          text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
        }
      ],
      weaknesses: [{ type: 'Fighting', value: '×2' }]
    },
    {
      id: 'sv6-15',
      name: 'Alakazam ex',
      supertype: 'Pokémon',
      subtypes: ['Stage 2', 'ex'],
      hp: '270',
      types: ['Psychic'],
      rarity: 'Ultra Rare',
      artist: 'PLANETA Mochizuki',
      set: {
        id: 'sv6',
        name: 'Twilight Masquerade',
        releaseDate: '2024/05/24'
      },
      number: '15',
      images: {
        small: 'https://images.pokemontcg.io/sv6/15.png',
        large: 'https://images.pokemontcg.io/sv6/15_hires.png'
      },
      attacks: [
        {
          name: 'Mind Ruler',
          cost: ['Psychic', 'Colorless'],
          damage: '60+',
          text: 'This attack does 30 more damage for each card in your opponent\'s hand.'
        }
      ],
      weaknesses: [{ type: 'Darkness', value: '×2' }]
    }
  ],
  totalCount: 3
};

async function fetchWithRetry(url, options, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        timeout: 10000 // 10 segundos timeout
      });
      return response;
    } catch (error) {
      console.log(`🔄 Intento ${i + 1} falló:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

export default defineEventHandler(async (event) => {
  try {
    console.log('🔥 Intentando llamar al API de Pokémon TCG para cartas...');
    
    const query = getQuery(event);
    
    // Construir parámetros de búsqueda
    const params = new URLSearchParams({
      pageSize: query.pageSize || '24',
      page: query.page || '1',
      orderBy: query.orderBy || '-set.releaseDate'
    });

    // Agregar filtros si están presentes
    if (query.q) {
      params.append('q', query.q);
    }

    const response = await fetchWithRetry(`https://api.pokemontcg.io/v2/cards?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key': 'c70e2c81-93d5-4564-b48f-2603ff100d91'
      }
    });

    if (!response.ok) {
      console.error('⚠️ API no disponible:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Cartas obtenidas exitosamente desde API:', data.data?.length || 0);
    
    return data;
  } catch (error) {
    console.error('❌ Error con API, usando datos de respaldo:', error.message);
    console.log('🔧 Retornando cartas de respaldo para que la app funcione');
    
    // Retornar datos de respaldo en lugar de error
    return fallbackCards;
  }
});
