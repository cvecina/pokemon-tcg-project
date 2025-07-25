import { PrismaClient } from '@prisma/client'
import fs from 'fs'

// Cliente para SQLite local
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
})

// Cliente para PostgreSQL producción (cuando esté configurado)
const postgresqlPrisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('🔄 Iniciando migración de datos...')
    
    // 1. Verificar conexión a SQLite
    console.log('📁 Conectando a SQLite local...')
    const localUsers = await sqlitePrisma.user.findMany()
    console.log(`✅ Encontrados ${localUsers.length} usuarios en SQLite`)
    
    if (localUsers.length === 0) {
      console.log('ℹ️ No hay datos para migrar')
      return
    }
    
    // 2. Conectar a PostgreSQL (después de configurar .env.production)
    console.log('🐘 Conectando a PostgreSQL...')
    await postgresqlPrisma.$connect()
    console.log('✅ Conexión a PostgreSQL exitosa')
    
    // 3. Migrar usuarios
    console.log('👥 Migrando usuarios...')
    for (const user of localUsers) {
      try {
        await postgresqlPrisma.user.create({
          data: {
            email: user.email,
            username: user.username,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        })
        console.log(`✅ Usuario migrado: ${user.username}`)
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ Usuario ya existe: ${user.username}`)
        } else {
          console.error(`❌ Error migrando ${user.username}:`, error.message)
        }
      }
    }
    
    console.log('🎉 Migración completada!')
    
  } catch (error) {
    console.error('❌ Error en migración:', error)
    
    if (error.message.includes('Environment variable not found')) {
      console.log('')
      console.log('💡 INSTRUCCIONES:')
      console.log('1. Configura tu base de datos en Supabase')
      console.log('2. Copia las credenciales a .env.production')
      console.log('3. Ejecuta: cp .env.production .env')
      console.log('4. Ejecuta: npx prisma generate')
      console.log('5. Ejecuta: npx prisma db push')
      console.log('6. Vuelve a ejecutar este script')
    }
  } finally {
    await sqlitePrisma.$disconnect()
    await postgresqlPrisma.$disconnect()
  }
}

migrateData()
