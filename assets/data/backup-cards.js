// Cartas de respaldo para cuando la API no esté disponible
export const backupCards = [
  {
    id: "xy1-1",
    name: "Venusaur-EX",
    supertype: "Pokémon",
    hp: "180",
    types: ["Grass"],
    rarity: "Rare Holo EX",
    number: "1",
    set: {
      name: "XY",
      total: "146"
    },
    images: {
      small: "https://images.pokemontcg.io/xy1/1.png",
      large: "https://images.pokemontcg.io/xy1/1_hires.png"
    },
    flavorText: "Una carta poderosa de Venusaur con ataques devastadores."
  },
  {
    id: "base1-4",
    name: "Charizard",
    supertype: "Pokémon",
    hp: "120",
    types: ["Fire"],
    rarity: "Rare Holo",
    number: "4",
    set: {
      name: "Base",
      total: "102"
    },
    images: {
      small: "https://images.pokemontcg.io/base1/4.png",
      large: "https://images.pokemontcg.io/base1/4_hires.png"
    },
    flavorText: "El icónico Charizard de la serie Base, muy codiciado por coleccionistas."
  },
  {
    id: "base1-2",
    name: "Blastoise",
    supertype: "Pokémon",
    hp: "100",
    types: ["Water"],
    rarity: "Rare Holo",
    number: "2",
    set: {
      name: "Base",
      total: "102"
    },
    images: {
      small: "https://images.pokemontcg.io/base1/2.png",
      large: "https://images.pokemontcg.io/base1/2_hires.png"
    },
    flavorText: "Blastoise, el Pokémon tortuga con poderosos ataques de agua."
  },
  {
    id: "base1-58",
    name: "Pikachu",
    supertype: "Pokémon",
    hp: "40",
    types: ["Lightning"],
    rarity: "Common",
    number: "58",
    set: {
      name: "Base",
      total: "102"
    },
    images: {
      small: "https://images.pokemontcg.io/base1/58.png",
      large: "https://images.pokemontcg.io/base1/58_hires.png"
    },
    flavorText: "El adorable Pikachu que robó corazones desde el primer día."
  },
  {
    id: "neo1-17",
    name: "Alakazam",
    supertype: "Pokémon",
    hp: "80",
    types: ["Psychic"],
    rarity: "Rare Holo",
    number: "17",
    set: {
      name: "Neo Genesis",
      total: "111"
    },
    images: {
      small: "https://images.pokemontcg.io/neo1/17.png",
      large: "https://images.pokemontcg.io/neo1/17_hires.png"
    },
    flavorText: "Alakazam, el Pokémon psíquico con increíbles poderes mentales."
  },
  {
    id: "base1-15",
    name: "Beedrill",
    supertype: "Pokémon",
    hp: "80",
    types: ["Grass"],
    rarity: "Rare",
    number: "15",
    set: {
      name: "Base",
      total: "102"
    },
    images: {
      small: "https://images.pokemontcg.io/base1/15.png",
      large: "https://images.pokemontcg.io/base1/15_hires.png"
    },
    flavorText: "Beedrill, el Pokémon abeja con aguijones venenosos."
  }
]

export const getBackupCards = (searchTerm = '') => {
  if (!searchTerm) {
    return {
      data: backupCards,
      totalCount: backupCards.length
    }
  }
  
  const filteredCards = backupCards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  return {
    data: filteredCards,
    totalCount: filteredCards.length
  }
}
