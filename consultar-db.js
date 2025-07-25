import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function consultarDB() {
  try {
    console.log('📊 CONSULTA DE BASE DE DATOS\n')
    
    // Usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('👥 USUARIOS:')
    users.forEach(user => {
      console.log(`  ID: ${user.id}`)
      console.log(`  Email: ${user.email}`)
      console.log(`  Username: ${user.username}`)
      console.log(`  Rol: ${user.role}`)
      console.log(`  Creado: ${user.createdAt.toLocaleString()}`)
      console.log('  ---')
    })
    
    // Cartas
    const cardsCount = await prisma.card.count()
    console.log(`\n🃏 CARTAS TOTALES: ${cardsCount}`)
    
    // Mazos
    const decksCount = await prisma.deck.count()
    console.log(`\n🎲 MAZOS TOTALES: ${decksCount}`)
    
    // Sets de cartas
    const setsCount = await prisma.cardSet.count()
    console.log(`\n� SETS DE CARTAS: ${setsCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

consultarDB()
