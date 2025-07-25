import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Servicio de autenticación
export class AuthService {
  
  // Registrar nuevo usuario
  static async register(email, username, password) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username }
          ]
        }
      })

      if (existingUser) {
        throw new Error('El usuario ya existe con ese email o username')
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12)

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: 'USER'
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true
        }
      })

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          username: user.username,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      return {
        success: true,
        user,
        token,
        message: 'Usuario registrado exitosamente'
      }
    } catch (error) {
      console.error('Error en registro:', error)
      return {
        success: false,
        message: error.message || 'Error interno del servidor'
      }
    }
  }

  // Login de usuario
  static async login(emailOrUsername, password) {
    try {
      // Buscar usuario por email o username
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: emailOrUsername },
            { username: emailOrUsername }
          ]
        }
      })

      if (!user) {
        throw new Error('Credenciales inválidas')
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password)
      
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas')
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          username: user.username,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt
        },
        token,
        message: 'Login exitoso'
      }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: error.message || 'Error interno del servidor'
      }
    }
  }

  // Verificar token JWT
  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Verificar que el usuario aún existe
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true
        }
      })

      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      return {
        success: true,
        user,
        decoded
      }
    } catch (error) {
      return {
        success: false,
        message: 'Token inválido'
      }
    }
  }

  // Obtener perfil de usuario
  static async getUserProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              createdCards: true,
              decks: true
            }
          }
        }
      })

      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      return {
        success: true,
        user
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  // Middleware para proteger rutas
  static async requireAuth(event) {
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autorización requerido'
      })
    }

    const token = authHeader.substring(7)
    const verification = await AuthService.verifyToken(token)

    if (!verification.success) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token inválido o expirado'
      })
    }

    // Agregar usuario al contexto
    event.context.user = verification.user
    return verification.user
  }

  // Middleware para requerir rol específico
  static async requireRole(event, requiredRole) {
    const user = await AuthService.requireAuth(event)
    
    if (user.role !== requiredRole && user.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Permisos insuficientes'
      })
    }

    return user
  }
}

// Cerrar conexión de Prisma cuando termine el proceso
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default AuthService
