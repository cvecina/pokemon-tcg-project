import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...')
    
    // Contar usuarios existentes
    const userCount = await prisma.user.count()
    console.log('✅ Conexión exitosa! Usuarios en DB:', userCount)
    
    // Crear un usuario de prueba
    const testUser = await prisma.user.create({
      data: {
        email: 'test-connection@example.com',
        username: 'test-connection',
        password: 'hashed-password-here',
        role: 'USER'
      }
    })
    
    console.log('✅ Usuario de prueba creado:', {
      id: testUser.id,
      email: testUser.email,
      username: testUser.username
    })
    
    // Limpiar - eliminar el usuario de prueba
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    
    console.log('🧹 Usuario de prueba eliminado')
    
  } catch (error) {
    console.error('❌ Error de conexión:', error)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Conexión cerrada')
  }
}

testConnection()
