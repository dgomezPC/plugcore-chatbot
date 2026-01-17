const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/chat-controller.js')

// Ruta única: enviar mensaje al asistente
router.post('/', controller.assistantResponse)

module.exports = router
