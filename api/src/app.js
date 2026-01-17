const express = require('express')
const app = express()
const routes = require('./routes')

// Middleware básico para parsear JSON
app.use(express.json({ limit: '10mb' }))

// Rutas
app.use('/api', routes)

// Manejo de errores básico
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message
  })
})

module.exports = app
