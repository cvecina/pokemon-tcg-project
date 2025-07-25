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
        return {
            data: [],
            totalCount: 0
        };
    }
});
