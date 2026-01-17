const OpenAI = require('openai')

module.exports = class OpenAIService {
  constructor () {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.assistantId = process.env.OPENAI_ASSISTANT_CHATBOT_ID
    this.threadId = null
    this.answer = null
  }

  // Crear un nuevo hilo de conversación
  async createThread () {
    try {
      const thread = await this.openai.beta.threads.create()
      this.threadId = thread.id
      return this.threadId
    } catch (error) {
      console.error('Error creando thread:', error)
      throw error
    }
  }

  // Asignar un threadId existente
  setThread (threadId) {
    this.threadId = threadId
  }

  // Crear mensaje y obtener respuesta
  async createMessage (prompt) {
    try {
      // Crear el mensaje del usuario
      await this.openai.beta.threads.messages.create(
        this.threadId,
        {
          role: 'user',
          content: prompt
        }
      )

      // Ejecutar el asistente y esperar respuesta
      const run = await this.openai.beta.threads.runs.createAndPoll(
        this.threadId,
        {
          assistant_id: this.assistantId
        }
      )

      // Esperar a que complete
      await this.waitForCompletion(run)

      return this.answer
    } catch (error) {
      console.error('Error creando mensaje:', error)
      throw error
    }
  }

  // Esperar a que el run se complete
  async waitForCompletion (run) {
    let currentRun = run

    while (currentRun.status === 'queued' || currentRun.status === 'in_progress') {
      await this.sleep(2000)
      currentRun = await this.openai.beta.threads.runs.retrieve(
        currentRun.thread_id,
        currentRun.id
      )
    }

    if (currentRun.status === 'completed') {
      const messages = await this.openai.beta.threads.messages.list(currentRun.thread_id)
      this.answer = messages.data[0].content[0].text.value
    } else {
      throw new Error(`Run terminó con estado: ${currentRun.status}`)
    }
  }

  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
