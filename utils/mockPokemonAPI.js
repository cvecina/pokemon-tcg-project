// Mock API para Pokémon TCG - Base de datos completa de cartas
export const mockPokemonCards = [
  {
    id: "base1-4",
    name: "Charizard",
    supertype: "Pokémon",
    subtypes: ["Stage 2"],
    hp: "120",
    types: ["Fire"],
    evolvesFrom: "Charmeleon",
    attacks: [
      {
        name: "Energy Burn",
        cost: ["Fire"],
        convertedEnergyCost: 1,
        damage: "",
        text: "As often as you like during your turn (before your attack), you may turn all Energy attached to Charizard into Fire Energy for the rest of the turn. This power can't be used if Charizard is Asleep, Confused, or Paralyzed."
      },
      {
        name: "Fire Spin",
        cost: ["Fire", "Fire", "Fire", "Fire"],
        convertedEnergyCost: 4,
        damage: "100",
        text: "Discard 2 Energy cards attached to Charizard in order to use this attack."
      }
    ],
    weaknesses: [{ type: "Water", value: "×2" }],
    retreatCost: ["Colorless", "Colorless", "Colorless"],
    convertedRetreatCost: 3,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "4",
    artist: "Mitsuhiro Arita",
    rarity: "Rare Holo",
    flavorText: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.",
    nationalPokedexNumbers: [6],
    images: {
      small: "https://images.pokemontcg.io/base1/4.png",
      large: "https://images.pokemontcg.io/base1/4_hires.png"
    }
  },
  {
    id: "base1-58",
    name: "Pikachu",
    supertype: "Pokémon",
    subtypes: ["Basic"],
    hp: "40",
    types: ["Lightning"],
    attacks: [
      {
        name: "Gnaw",
        cost: ["Colorless"],
        convertedEnergyCost: 1,
        damage: "10",
        text: ""
      },
      {
        name: "Thunder Jolt",
        cost: ["Lightning", "Colorless"],
        convertedEnergyCost: 2,
        damage: "30",
        text: "Flip a coin. If tails, Pikachu does 10 damage to itself."
      }
    ],
    weaknesses: [{ type: "Fighting", value: "×2" }],
    retreatCost: ["Colorless"],
    convertedRetreatCost: 1,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "58",
    artist: "Mitsuhiro Arita",
    rarity: "Common",
    flavorText: "When several of these Pokémon gather, their electricity could build and cause lightning storms.",
    nationalPokedexNumbers: [25],
    images: {
      small: "https://images.pokemontcg.io/base1/58.png",
      large: "https://images.pokemontcg.io/base1/58_hires.png"
    }
  },
  {
    id: "base1-2",
    name: "Blastoise",
    supertype: "Pokémon",
    subtypes: ["Stage 2"],
    hp: "100",
    types: ["Water"],
    evolvesFrom: "Wartortle",
    attacks: [
      {
        name: "Rain Dance",
        cost: [],
        convertedEnergyCost: 0,
        damage: "",
        text: "As often as you like during your turn (before your attack), you may attach 1 Water Energy card to 1 of your Water Pokémon. If you do this, your turn ends. This power can't be used if Blastoise is Asleep, Confused, or Paralyzed."
      },
      {
        name: "Hydro Pump",
        cost: ["Water", "Water", "Water"],
        convertedEnergyCost: 3,
        damage: "40+",
        text: "Does 40 damage plus 10 more damage for each Water Energy attached to Blastoise but not used to pay for this attack's Energy cost. You can't add more than 20 damage in this way."
      }
    ],
    weaknesses: [{ type: "Lightning", value: "×2" }],
    retreatCost: ["Colorless", "Colorless", "Colorless"],
    convertedRetreatCost: 3,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "2",
    artist: "Mitsuhiro Arita",
    rarity: "Rare Holo",
    flavorText: "A brutal Pokémon with pressurized water jets on its shell. They are used for high speed tackles.",
    nationalPokedexNumbers: [9],
    images: {
      small: "https://images.pokemontcg.io/base1/2.png",
      large: "https://images.pokemontcg.io/base1/2_hires.png"
    }
  },
  {
    id: "base1-15",
    name: "Venusaur",
    supertype: "Pokémon",
    subtypes: ["Stage 2"],
    hp: "100",
    types: ["Grass"],
    evolvesFrom: "Ivysaur",
    attacks: [
      {
        name: "Energy Trans",
        cost: [],
        convertedEnergyCost: 0,
        damage: "",
        text: "As often as you like during your turn (before your attack), you may take 1 Grass Energy card attached to 1 of your Pokémon and attach it to a different one. This power can't be used if Venusaur is Asleep, Confused, or Paralyzed."
      },
      {
        name: "Solarbeam",
        cost: ["Grass", "Grass", "Grass", "Grass"],
        convertedEnergyCost: 4,
        damage: "60",
        text: ""
      }
    ],
    weaknesses: [{ type: "Fire", value: "×2" }],
    retreatCost: ["Colorless", "Colorless"],
    convertedRetreatCost: 2,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "15",
    artist: "Mitsuhiro Arita",
    rarity: "Rare Holo",
    flavorText: "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.",
    nationalPokedexNumbers: [3],
    images: {
      small: "https://images.pokemontcg.io/base1/15.png",
      large: "https://images.pokemontcg.io/base1/15_hires.png"
    }
  },
  {
    id: "base1-1",
    name: "Alakazam",
    supertype: "Pokémon",
    subtypes: ["Stage 2"],
    hp: "80",
    types: ["Psychic"],
    evolvesFrom: "Kadabra",
    attacks: [
      {
        name: "Damage Swap",
        cost: [],
        convertedEnergyCost: 0,
        damage: "",
        text: "As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another as long as you don't Knock Out that Pokémon. This power can't be used if Alakazam is Asleep, Confused, or Paralyzed."
      },
      {
        name: "Confuse Ray",
        cost: ["Psychic", "Psychic", "Psychic"],
        convertedEnergyCost: 3,
        damage: "30",
        text: "Flip a coin. If heads, the Defending Pokémon is now Confused."
      }
    ],
    weaknesses: [{ type: "Psychic", value: "×2" }],
    retreatCost: ["Colorless", "Colorless", "Colorless"],
    convertedRetreatCost: 3,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "1",
    artist: "Mitsuhiro Arita",
    rarity: "Rare Holo",
    flavorText: "Its brain can outperform a supercomputer. Its intelligence quotient is said to be 5,000.",
    nationalPokedexNumbers: [65],
    images: {
      small: "https://images.pokemontcg.io/base1/1.png",
      large: "https://images.pokemontcg.io/base1/1_hires.png"
    }
  },
  {
    id: "base1-16",
    name: "Gyarados",
    supertype: "Pokémon",
    subtypes: ["Stage 1"],
    hp: "100",
    types: ["Water"],
    evolvesFrom: "Magikarp",
    attacks: [
      {
        name: "Dragon Rage",
        cost: ["Water", "Water", "Water"],
        convertedEnergyCost: 3,
        damage: "50",
        text: ""
      },
      {
        name: "Bubblebeam",
        cost: ["Water", "Water", "Water", "Water"],
        convertedEnergyCost: 4,
        damage: "40",
        text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed."
      }
    ],
    weaknesses: [{ type: "Grass", value: "×2" }],
    retreatCost: ["Colorless", "Colorless", "Colorless"],
    convertedRetreatCost: 3,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "6",
    artist: "Mitsuhiro Arita",
    rarity: "Rare Holo",
    flavorText: "Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage.",
    nationalPokedexNumbers: [130],
    images: {
      small: "https://images.pokemontcg.io/base1/6.png",
      large: "https://images.pokemontcg.io/base1/6_hires.png"
    }
  },
  {
    id: "base1-17",
    name: "Mewtwo",
    supertype: "Pokémon",
    subtypes: ["Basic"],
    hp: "60",
    types: ["Psychic"],
    attacks: [
      {
        name: "Psychic",
        cost: ["Psychic", "Colorless"],
        convertedEnergyCost: 2,
        damage: "10+",
        text: "Does 10 damage plus 10 more damage for each Energy card attached to the Defending Pokémon."
      },
      {
        name: "Barrier",
        cost: ["Psychic", "Psychic"],
        convertedEnergyCost: 2,
        damage: "",
        text: "Discard 1 Psychic Energy card attached to Mewtwo in order to use this attack. During your opponent's next turn, prevent all effects of attacks, including damage, done to Mewtwo."
      }
    ],
    weaknesses: [{ type: "Psychic", value: "×2" }],
    retreatCost: ["Colorless", "Colorless", "Colorless"],
    convertedRetreatCost: 3,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "10",
    artist: "Keiji Kinebuchi",
    rarity: "Rare Holo",
    flavorText: "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.",
    nationalPokedexNumbers: [150],
    images: {
      small: "https://images.pokemontcg.io/base1/10.png",
      large: "https://images.pokemontcg.io/base1/10_hires.png"
    }
  },
  {
    id: "base1-25",
    name: "Electabuzz",
    supertype: "Pokémon",
    subtypes: ["Basic"],
    hp: "70",
    types: ["Lightning"],
    attacks: [
      {
        name: "Thundershock",
        cost: ["Lightning"],
        convertedEnergyCost: 1,
        damage: "10",
        text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed."
      },
      {
        name: "Thunderpunch",
        cost: ["Lightning", "Colorless"],
        convertedEnergyCost: 2,
        damage: "30+",
        text: "Flip a coin. If heads, this attack does 30 damage plus 10 more damage; if tails, this attack does 30 damage and Electabuzz does 10 damage to itself."
      }
    ],
    weaknesses: [{ type: "Fighting", value: "×2" }],
    retreatCost: ["Colorless", "Colorless"],
    convertedRetreatCost: 2,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "20",
    artist: "Mitsuhiro Arita",
    rarity: "Rare",
    flavorText: "Normally found near power plants, they can wander away and cause major blackouts in cities.",
    nationalPokedexNumbers: [125],
    images: {
      small: "https://images.pokemontcg.io/base1/20.png",
      large: "https://images.pokemontcg.io/base1/20_hires.png"
    }
  },
  {
    id: "base1-26",
    name: "Magmar",
    supertype: "Pokémon",
    subtypes: ["Basic"],
    hp: "50",
    types: ["Fire"],
    attacks: [
      {
        name: "Fire Punch",
        cost: ["Fire", "Fire"],
        convertedEnergyCost: 2,
        damage: "30",
        text: ""
      },
      {
        name: "Flamethrower",
        cost: ["Fire", "Fire", "Colorless"],
        convertedEnergyCost: 3,
        damage: "50",
        text: "Discard 1 Fire Energy card attached to Magmar in order to use this attack."
      }
    ],
    weaknesses: [{ type: "Water", value: "×2" }],
    retreatCost: ["Colorless", "Colorless"],
    convertedRetreatCost: 2,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "21",
    artist: "Mitsuhiro Arita",
    rarity: "Uncommon",
    flavorText: "Its body always burns with an orange glow that enables it to hide perfectly among flames.",
    nationalPokedexNumbers: [126],
    images: {
      small: "https://images.pokemontcg.io/base1/21.png",
      large: "https://images.pokemontcg.io/base1/21_hires.png"
    }
  },
  {
    id: "base1-27",
    name: "Pinsir",
    supertype: "Pokémon",
    subtypes: ["Basic"],
    hp: "60",
    types: ["Grass"],
    attacks: [
      {
        name: "Seismic Toss",
        cost: ["Colorless", "Colorless"],
        convertedEnergyCost: 2,
        damage: "20",
        text: ""
      },
      {
        name: "Guillotine",
        cost: ["Grass", "Grass", "Colorless"],
        convertedEnergyCost: 3,
        damage: "50",
        text: ""
      }
    ],
    weaknesses: [{ type: "Fire", value: "×2" }],
    retreatCost: ["Colorless"],
    convertedRetreatCost: 1,
    set: {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      releaseDate: "1999/01/09"
    },
    number: "9",
    artist: "Mitsuhiro Arita",
    rarity: "Rare",
    flavorText: "If it fails to crush the victim in its pincers, it will swing it around and toss it hard.",
    nationalPokedexNumbers: [127],
    images: {
      small: "https://images.pokemontcg.io/base1/9.png",
      large: "https://images.pokemontcg.io/base1/9_hires.png"
    }
  }
]

// Mock API functions que simulan la API real
export class MockPokemonAPI {
  static async searchCards(query, page = 1, pageSize = 12) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredCards = mockPokemonCards
    
    if (query) {
      const searchTerm = query.toLowerCase()
      filteredCards = mockPokemonCards.filter(card => 
        card.name.toLowerCase().includes(searchTerm) ||
        card.types.some(type => type.toLowerCase().includes(searchTerm)) ||
        card.supertype.toLowerCase().includes(searchTerm) ||
        card.rarity.toLowerCase().includes(searchTerm)
      )
    }
    
    // Paginación
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedCards = filteredCards.slice(startIndex, endIndex)
    
    return {
      data: paginatedCards,
      page: page,
      pageSize: pageSize,
      count: paginatedCards.length,
      totalCount: filteredCards.length
    }
  }
  
  static async getRandomCards(pageSize = 12) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const shuffled = [...mockPokemonCards].sort(() => 0.5 - Math.random())
    const randomCards = shuffled.slice(0, pageSize)
    
    return {
      data: randomCards,
      page: 1,
      pageSize: pageSize,
      count: randomCards.length,
      totalCount: randomCards.length
    }
  }
  
  static async getCardById(id) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const card = mockPokemonCards.find(card => card.id === id)
    return card ? { card } : null
  }
  
  static async testConnection() {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return {
      status: 'ok',
      message: 'Mock API funcionando correctamente',
      cardsAvailable: mockPokemonCards.length
    }
  }
}
