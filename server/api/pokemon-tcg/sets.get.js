// Datos de respaldo para cuando el API falla
const fallbackSets = {
  data: [
    {
      id: 'sv8',
      name: 'Surging Sparks',
      releaseDate: '2024/11/08',
      images: { logo: 'https://images.pokemontcg.io/sv8/logo.png' },
      total: 252
    },
    {
      id: 'sv7',
      name: 'Stellar Crown',
      releaseDate: '2024/09/13',
      images: { logo: 'https://images.pokemontcg.io/sv7/logo.png' },
      total: 175
    },
    {
      id: 'sv6',
      name: 'Twilight Masquerade',
      releaseDate: '2024/05/24',
      images: { logo: 'https://images.pokemontcg.io/sv6/logo.png' },
      total: 226
    },
    {
      id: 'sv5',
      name: 'Temporal Forces',
      releaseDate: '2024/03/22',
      images: { logo: 'https://images.pokemontcg.io/sv5/logo.png' },
      total: 218
    },
    {
      id: 'sv4',
      name: 'Paradox Rift',
      releaseDate: '2023/11/03',
      images: { logo: 'https://images.pokemontcg.io/sv4/logo.png' },
      total: 266
    },
    {
      id: 'sv3',
      name: 'Obsidian Flames',
      releaseDate: '2023/08/11',
      images: { logo: 'https://images.pokemontcg.io/sv3/logo.png' },
      total: 230
    },
    {
      id: 'sv2',
      name: 'Paldea Evolved',
      releaseDate: '2023/06/09',
      images: { logo: 'https://images.pokemontcg.io/sv2/logo.png' },
      total: 279
    },
    {
      id: 'sv1',
      name: 'Scarlet & Violet',
      releaseDate: '2023/03/31',
      images: { logo: 'https://images.pokemontcg.io/sv1/logo.png' },
      total: 258
    },
    {
      id: 'swsh12',
      name: 'Silver Tempest',
      releaseDate: '2022/11/11',
      images: { logo: 'https://images.pokemontcg.io/swsh12/logo.png' },
      total: 245
    },
    {
      id: 'swsh11',
      name: 'Lost Origin',
      releaseDate: '2022/09/09',
      images: { logo: 'https://images.pokemontcg.io/swsh11/logo.png' },
      total: 247
    }
  ],
  totalCount: 10
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
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Esperar 1s, 2s, etc.
    }
  }
}

export default defineEventHandler(async (event) => {
  try {
    console.log('🔥 Intentando llamar al API de Pokémon TCG para sets...');
    
    const query = getQuery(event);
    const params = new URLSearchParams({
      pageSize: query.pageSize || '50',
      orderBy: query.orderBy || '-releaseDate'
    });

    const response = await fetchWithRetry(`https://api.pokemontcg.io/v2/sets?${params}`, {
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
    console.log('✅ Sets obtenidos exitosamente desde API:', data.data?.length || 0);
    
    return data;
  } catch (error) {
    console.error('❌ Error con API, usando datos de respaldo:', error.message);
    console.log('🔧 Retornando sets de respaldo para que la app funcione');
    
    // Retornar datos de respaldo en lugar de error
    return fallbackSets;
  }
});
