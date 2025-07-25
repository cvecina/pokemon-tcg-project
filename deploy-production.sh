#!/bin/bash

echo "🚀 DEPLOY A PRODUCCIÓN - TCG Manager"
echo "======================================"

# 1. Verificar que existe la configuración de producción
if [ ! -f ".env.production" ]; then
    echo "❌ No se encontró .env.production"
    echo "💡 Ejecuta primero: cp .env.production.example .env.production"
    echo "💡 Y configura tus credenciales de Supabase"
    exit 1
fi

# 2. Backup del .env actual
if [ -f ".env" ]; then
    cp .env .env.backup
    echo "📁 Backup de .env creado como .env.backup"
fi

# 3. Usar configuración de producción
cp .env.production .env
echo "🔄 Configuración de producción activada"

# 4. Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# 5. Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# 6. Aplicar migraciones
echo "🗄️ Aplicando esquema a la base de datos..."
npx prisma db push

# 7. Migrar datos (opcional)
read -p "¿Migrar datos desde SQLite local? (y/n): " migrate_data
if [ "$migrate_data" = "y" ]; then
    echo "📋 Migrando datos..."
    node migrate-to-production.js
fi

# 8. Build para producción
echo "🏗️ Construyendo aplicación..."
pnpm build

# 9. Información final
echo ""
echo "✅ DEPLOY COMPLETADO"
echo "===================="
echo "🌐 Base de datos: PostgreSQL (Supabase)"
echo "📁 Build: .output/"
echo "🚀 Para iniciar: pnpm start"
echo ""
echo "📝 Siguiente paso: Deploy a Vercel/Netlify/Railway"
echo "💡 No olvides configurar las variables de entorno en tu plataforma"

# 10. Restaurar configuración local (opcional)
read -p "¿Restaurar configuración local? (y/n): " restore_local
if [ "$restore_local" = "y" ]; then
    if [ -f ".env.backup" ]; then
        cp .env.backup .env
        echo "🔄 Configuración local restaurada"
    fi
fi
