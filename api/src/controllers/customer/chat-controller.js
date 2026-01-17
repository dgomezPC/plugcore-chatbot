const OpenAIService = require('../../services/openai-service')

exports.assistantResponse = async (req, res) => {
  try {
    const openai = new OpenAIService()
    const prompt = req.body.prompt

    // Si ya existe un threadId, lo usa; sino, crea uno nuevo
    if (req.body.threadId) {
      openai.setThread(req.body.threadId)
    } else {
      await openai.createThread()
    }

    // Obtener respuesta del asistente
    const rawAnswer = await openai.createMessage(prompt)

    // Parsear la respuesta JSON que viene del asistente
    let answer
    try {
      answer = JSON.parse(rawAnswer)
    } catch (e) {
      // Si no es JSON válido, usar como texto directo
      answer = { text: rawAnswer }
    }

    const response = {
      threadId: openai.threadId,
      answer
    }

    res.status(200).send(response)
  } catch (error) {
    console.error('Error en assistantResponse:', error)
    res.status(500).send({
      message: 'Error al procesar la consulta',
      error: error.message
    })
  }
}
