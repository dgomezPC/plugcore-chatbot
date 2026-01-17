class ChatBot extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.threadId = null
    this.isOpen = false
    this.isTyping = false
  }

  connectedCallback () {
    // Recuperar threadId de sessionStorage si existe
    if (sessionStorage.getItem('threadId')) {
      this.threadId = sessionStorage.getItem('threadId')
    }
    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .chatbot-button {
          position: fixed; bottom: 30px; right: 30px;
          background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none;
          padding: 15px 25px; border-radius: 25px; cursor: pointer; font-size: 14px; font-weight: 600;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3); transition: all 0.3s ease; z-index: 1000;
          min-width: 280px; text-align: center; font-family: "SoehneBuch", sans-serif;
        }
        .chatbot-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(231,76,60,.4); background: linear-gradient(135deg, #c0392b, #a93226); }
        .chatbot-button:active { transform: translateY(0); }

        .chat-container {
          position: fixed; bottom: 30px; right: 30px; width: 380px; height: 560px;
          background: hsl(235, 7%, 31%); border: 1px solid hsl(0,0%,40%); border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,.2); display: none; flex-direction: column; z-index: 1001;
          overflow: hidden; animation: slideUp .3s ease-out; font-family: "SoehneBuch", sans-serif; color: #fff;
        }
        .chat-container.active { display: flex; }

        @keyframes slideUp { from {opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }

        .chat-header { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 20px; text-align: center; position: relative; }
        .chat-header h3 { font-size: 18px; font-weight: 600; margin-bottom: 5px; }
        .chat-header p { font-size: 12px; opacity: .9; }
        .close-button {
          position: absolute; top: 15px; right: 15px; background: none; border: none; color: white;
          font-size: 20px; cursor: pointer; width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; transition: background-color .2s;
        }
        .close-button:hover { background-color: rgba(255,255,255,.2); }

        .chat-messages {
          flex: 1; padding: 16px 20px; overflow-y: auto; background-color: hsl(235, 7%, 31%);
          display: flex; flex-direction: column; gap: 1rem;
        }
        .chat-messages::-webkit-scrollbar { width: 6px; }
        .chat-messages::-webkit-scrollbar-track { background: hsl(0,0%,20%); border-radius: 3px; }
        .chat-messages::-webkit-scrollbar-thumb { background: hsl(0,0%,50%); border-radius: 3px; }
        .chat-messages::-webkit-scrollbar-thumb:hover { background: hsl(0,0%,60%); }

        .prompt { display: flex; gap: 1rem; width: 100%; }
        .prompt:first-child { margin-top: 1rem; }
        .prompt:last-child { margin-bottom: 1rem; }

        .message { display: flex; flex-direction: column; gap: .5rem; width: 100%; }
        .message h3 { font-size: .9rem; margin: 0; color: #fff; }
        .message p { font-size: 1rem; margin: 0; color: #fff; line-height: 1.4; white-space: pre-wrap; }

        .avatar {
          align-items: center; border: 1px solid hsl(0,0%,40%); border-radius: 50%;
          display: flex; height: 1.5rem; justify-content: center; min-width: 1.5rem; overflow: hidden; width: 1.5rem;
          background: linear-gradient(135deg, #3498db, #2980b9); color: white; font-size: 12px; font-weight: bold;
        }
        .avatar.assistant { background: linear-gradient(135deg, #27ae60, #229954); }

        .state { align-items: center; display: flex; gap: .5rem; }
        .state-bubble { background-color: #fff; border-radius: 50%; height: 1rem; width: 1rem; }
        .state-bubble.active { animation: pulse 1s infinite; }
        .state-message { font-size: .9rem; color: #fff; }
        @keyframes pulse { 0% { transform: scale(.8);} 50% { transform: scale(1);} 100% { transform: scale(.8);} }

        .chat-input-area {
          padding: 12px 12px 16px 12px; background: hsl(235, 7%, 31%); border-top: 1px solid hsl(0,0%,40%);
          display: flex; gap: 8px; align-items: center;
        }

        .chat-input {
          flex: 1; padding: 12px 16px; border: 1px solid hsl(0,0%,40%); border-radius: 25px; font-size: 14px; outline: none;
          transition: border-color .2s; font-family: "SoehneBuch", sans-serif; background: hsl(235,7%,25%); color: #fff;
        }
        .chat-input:focus { border-color: #e74c3c; }
        .chat-input::placeholder { color: hsl(0,0%,60%); }

        .send-button {
          background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; 
          width: 45px; height: 45px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center; 
          transition: all .2s; font-size: 16px;
        }
        .send-button:hover { transform: scale(1.05); box-shadow: 0 2px 8px rgba(231,76,60,.3); }
        .send-button:disabled { opacity: .6; cursor: not-allowed; transform: none; }

        .welcome-message { text-align: center; padding: 20px; color: hsl(0,0%,80%); font-size: 14px; }

        @media (max-width: 480px) {
          .chat-container { width: calc(100vw - 20px); height: calc(100vh - 40px); bottom: 10px; right: 10px; left: 10px; border-radius: 10px; }
          .chatbot-button { bottom: 20px; right: 20px; min-width: 250px; padding: 12px 20px; font-size: 13px; }
        }
      </style>

      <button class="chatbot-button">¿Alguna duda? Hable con nosotros ahora</button>

      <div class="chat-container">
        <div class="chat-header">
          <button class="close-button">×</button>
          <h3>Asistente Virtual</h3>
          <p>Estamos aquí para ayudarle</p>
        </div>

        <div class="chat-messages">
          <div class="welcome-message">
            ¡Hola! 👋 Soy su asistente virtual de Plugcore.<br>
            ¿En qué puedo ayudarle hoy?
          </div>
        </div>

        <div class="chat-input-area">
          <input type="text" class="chat-input" name="prompt" placeholder="Escriba su mensaje..." required>
          <button class="send-button" title="Enviar" aria-label="Enviar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `

    const chatButton = this.shadow.querySelector('.chatbot-button')
    const closeButton = this.shadow.querySelector('.close-button')
    const chatInput = this.shadow.querySelector('.chat-input')
    const sendButton = this.shadow.querySelector('.send-button')

    chatButton.addEventListener('click', () => this.toggleChat())
    closeButton.addEventListener('click', () => this.closeChat())
    sendButton.addEventListener('click', () => this.sendMessage())
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.sendMessage() })
  }

  toggleChat () { this.isOpen ? this.closeChat() : this.openChat() }

  openChat () {
    const chatContainer = this.shadow.querySelector('.chat-container')
    const chatButton = this.shadow.querySelector('.chatbot-button')
    const chatInput = this.shadow.querySelector('.chat-input')
    chatContainer.classList.add('active')
    chatButton.style.display = 'none'
    this.isOpen = true
    chatInput.focus()
  }

  closeChat () {
    const chatContainer = this.shadow.querySelector('.chat-container')
    const chatButton = this.shadow.querySelector('.chatbot-button')
    chatContainer.classList.remove('active')
    chatButton.style.display = 'block'
    this.isOpen = false
  }

  sendMessage () {
    const chatInput = this.shadow.querySelector('.chat-input')
    const message = chatInput.value.trim()

    if (!message || this.isTyping) return

    this.createUserMessage(message)
    chatInput.value = ''

    const container = this.createAssistantResponseContainer()
    this.createAssistantResponse(message, container)
  }

  createUserMessage = (newPrompt) => {
    const chatMessages = this.shadow.querySelector('.chat-messages')
    const promptContainer = document.createElement('div')
    const avatarContainer = document.createElement('div')
    const messageContainer = document.createElement('div')
    const userName = document.createElement('h3')
    const prompt = document.createElement('p')

    promptContainer.classList.add('prompt')
    avatarContainer.classList.add('avatar')
    messageContainer.classList.add('message', 'user')

    avatarContainer.textContent = 'U'
    userName.textContent = 'Usted'
    prompt.textContent = newPrompt

    messageContainer.appendChild(userName)
    messageContainer.appendChild(prompt)
    promptContainer.appendChild(avatarContainer)
    promptContainer.appendChild(messageContainer)
    chatMessages.appendChild(promptContainer)
    this.scrollToBottom()
  }

  createAssistantResponseContainer = () => {
    const chatMessages = this.shadow.querySelector('.chat-messages')
    const promptContainer = document.createElement('div')
    const avatarContainer = document.createElement('div')
    const messageContainer = document.createElement('div')

    const modelName = document.createElement('h3')
    const container = document.createElement('div')
    const state = document.createElement('div')
    const stateBubble = document.createElement('div')
    const stateMessage = document.createElement('span')

    promptContainer.classList.add('prompt')
    avatarContainer.classList.add('avatar', 'assistant')
    messageContainer.classList.add('message', 'model')
    container.classList.add('contents')
    state.classList.add('state')
    stateBubble.classList.add('state-bubble', 'active')
    stateMessage.classList.add('state-message')

    avatarContainer.textContent = 'A'
    modelName.textContent = 'Asistente'
    stateMessage.textContent = 'Preparando respuesta...'

    container.appendChild(state)
    state.appendChild(stateBubble)
    state.appendChild(stateMessage)
    messageContainer.appendChild(modelName)
    messageContainer.appendChild(container)

    promptContainer.appendChild(avatarContainer)
    promptContainer.appendChild(messageContainer)

    chatMessages.appendChild(promptContainer)
    this.scrollToBottom()
    return container
  }

  createAssistantResponse = async (userMessage, container) => {
    this.isTyping = true
    const sendButton = this.shadow.querySelector('.send-button')
    sendButton.disabled = true

    try {
      const response = await this.generateResponse(userMessage)
      this.writeNewAnswer(response, container, true)
    } catch (err) {
      console.error(err)
      this.writeNewAnswer('Se ha producido un error al enviar el mensaje. Inténtelo de nuevo más tarde.', container, false)
    } finally {
      this.isTyping = false
      sendButton.disabled = false
    }
  }

  writeNewAnswer = async (answer, container, timeInterval) => {
    const state = container.querySelector('.state')
    if (state) state.remove()

    const responseElement = document.createElement('div')
    responseElement.style.fontSize = '1rem'
    responseElement.style.lineHeight = '1.4'
    responseElement.style.whiteSpace = 'pre-wrap'
    responseElement.style.color = '#fff'
    container.appendChild(responseElement)

    const text = answer.text || answer

    if (timeInterval) {
      let i = 0
      let displayText = ''
      const interval = setInterval(() => {
        if (i >= text.length) {
          clearInterval(interval)
          // Convertir URLs en enlaces clickeables amigables
          this.convertUrlsToFriendlyLinks(responseElement)
          return
        }
        displayText += text[i++]
        responseElement.textContent = displayText
        this.scrollToBottom()
      }, 30)
    } else {
      responseElement.textContent = text
      // Convertir URLs en enlaces clickeables amigables
      this.convertUrlsToFriendlyLinks(responseElement)
    }
  }

  convertUrlsToFriendlyLinks = (element) => {
    const text = element.textContent

    // Patrón para detectar "📖 Más información: [URL]"
    const docLinkPattern = /📖\s*Más información:\s*(https?:\/\/[^\s]+)/gi

    // Si encuentra el patrón de documentación
    if (docLinkPattern.test(text)) {
      element.innerHTML = ''

      // Dividir por el patrón
      const parts = text.split(/📖\s*Más información:\s*(https?:\/\/[^\s]+)/gi)

      parts.forEach((part, index) => {
        if (part.match(/^https?:\/\//)) {
          // Es una URL - crear el texto amigable con enlace
          const wrapper = document.createElement('span')
          wrapper.appendChild(document.createTextNode('📖 Para más información, haz click '))

          const link = document.createElement('a')
          link.href = part
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          link.textContent = 'aquí'
          link.style.color = '#3498db'
          link.style.textDecoration = 'underline'
          link.style.cursor = 'pointer'
          link.style.fontWeight = '500'
          link.addEventListener('mouseenter', () => {
            link.style.color = '#2980b9'
          })
          link.addEventListener('mouseleave', () => {
            link.style.color = '#3498db'
          })

          wrapper.appendChild(link)
          element.appendChild(wrapper)
        } else if (part.trim()) {
          // Es texto normal
          element.appendChild(document.createTextNode(part))
        }
      })

      this.scrollToBottom()
    } else {
      // Si no hay patrón de documentación, buscar URLs normales
      const urlRegex = /(https?:\/\/[^\s]+)/g

      if (urlRegex.test(text)) {
        const parts = text.split(urlRegex)
        element.innerHTML = ''

        parts.forEach(part => {
          if (part.match(urlRegex)) {
            // URL genérica - mostrar como enlace normal
            const link = document.createElement('a')
            link.href = part
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.textContent = part
            link.style.color = '#3498db'
            link.style.textDecoration = 'underline'
            link.style.cursor = 'pointer'
            link.addEventListener('mouseenter', () => {
              link.style.color = '#2980b9'
            })
            link.addEventListener('mouseleave', () => {
              link.style.color = '#3498db'
            })
            element.appendChild(link)
          } else if (part) {
            element.appendChild(document.createTextNode(part))
          }
        })

        this.scrollToBottom()
      }
    }
  }

  addLinks = (answer, container) => {
    // Este método ya no se usa, pero lo dejamos por compatibilidad
    if (answer.enlaces && answer.enlaces.length > 0) {
      const linksContainer = document.createElement('div')
      linksContainer.style.marginTop = '12px'
      linksContainer.style.paddingTop = '12px'
      linksContainer.style.borderTop = '1px solid hsl(0,0%,40%)'

      answer.enlaces.forEach(enlace => {
        const link = document.createElement('a')
        link.href = enlace.url
        link.target = '_blank'
        link.textContent = `📖 ${enlace.titulo}`
        link.style.display = 'block'
        link.style.color = '#3498db'
        link.style.textDecoration = 'none'
        link.style.marginTop = '8px'
        link.style.fontSize = '0.9rem'
        link.addEventListener('mouseenter', () => {
          link.style.textDecoration = 'underline'
        })
        link.addEventListener('mouseleave', () => {
          link.style.textDecoration = 'none'
        })
        linksContainer.appendChild(link)
      })

      container.appendChild(linksContainer)
      this.scrollToBottom()
    }
  }

  async generateResponse (userMessage) {
    const response = await fetch('/api/customer/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userMessage,
        threadId: this.threadId
      })
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()
    this.threadId = data.threadId

    // Guardar threadId en sessionStorage
    sessionStorage.setItem('threadId', this.threadId)

    return data.answer
  }

  scrollToBottom () {
    const chatMessages = this.shadow.querySelector('.chat-messages')
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}

customElements.define('chatbot-component', ChatBot)
