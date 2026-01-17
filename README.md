# 🤖 Chatbot Plugcore

Chatbot inteligente que utiliza OpenAI Assistant API para responder preguntas sobre Plugcore CMS basándose en documentación.

## 🚀 Características

- ✨ Interfaz de chat moderna y responsiva
- 🧠 Powered by OpenAI Assistant API (GPT-4.1-mini)
- 💾 Persistencia de conversaciones mediante threadId en sessionStorage
- 📱 Diseño mobile-first
- 🎨 Animaciones suaves y experiencia de usuario fluida
- 🔗 Redirección a Discord para consultas sin respuesta

## 📋 Requisitos

- Node.js 18+ 
- Cuenta de OpenAI con acceso a la API de Assistants
- Un asistente configurado en OpenAI

## 🛠️ Instalación

### 1. Clonar/descargar el proyecto

```bash
cd plugcore-chatbot
```

### 2. Configurar variables de entorno

```bash
cd api
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
PORT=8080
OPENAI_API_KEY=tu-api-key-aqui
OPENAI_ASSISTANT_CHATBOT_ID=asst_xxxxxxxxxx
```

### 3. Instalar dependencias

```bash
# Instalar dependencias del API
cd api
npm install

# Instalar dependencias del cliente
cd ../client/customer
npm install
```

## 🎯 Configuración del Asistente en OpenAI

Ve a [platform.openai.com/assistants](https://platform.openai.com/assistants) y crea/configura tu asistente:

### System Instructions

```
Eres un asistente virtual que responde preguntas sobre Plugcore CMS usando únicamente la documentación adjunta.

Comportamiento:
- Saludo: Responde cordialmente e invita a preguntar
- Consultas sobre Plugcore: Localiza en la documentación y responde de forma directa y esquemática
- Sin información: Indica que no hay datos y proporciona el link de Discord para más ayuda
- Mensajes ofensivos: Responde amablemente que estás aquí para ayudar

Todas las respuestas deben estar en español y formato JSON según el schema definido.

# Output Format
Objeto JSON con el campo "text" que contiene la respuesta en texto plano.

# Ejemplos

Entrada: "Hola"
Salida: {"text": "¡Hola! ¿En qué puedo ayudarte con Plugcore?"}

Entrada: "¿Cómo crear una página?"
Salida: {"text": "Para crear una página:\n1. Accede al panel de administración\n2. Ve a 'Páginas'\n3. Haz clic en 'Crear nueva'\n4. Completa los campos\n5. Guarda"}

Entrada: "¿Integración con WhatsApp?"
Salida: {"text": "No encuentro información sobre WhatsApp en la documentación. Para consultas adicionales, visita nuestra comunidad: https://discord.com/invite/m4CwNuSehe"}

Entrada: "[Insulto]"
Salida: {"text": "Entiendo tu frustración. Estoy aquí para ayudarte con cualquier duda sobre Plugcore. ¿En qué puedo asistirte?"}
```

### Model
- **gpt-4.1-mini**

### Tools
- **File search** (adjunta tu documentación en formato Markdown)

### Response Format
- **Type:** json_schema
- **Schema name:** respuesta_en_texto
```json
{
  "name": "respuesta_en_texto",
  "strict": true,
  "schema": {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "La respuesta en texto plano"
      }
    },
    "required": ["text"],
    "additionalProperties": false
  }
}
```

## ▶️ Uso

### Desarrollo

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- 🔧 API en `http://localhost:8080`
- 🎨 Cliente en `http://localhost:5177`
- 🌉 Proxy en `http://localhost/`

**Importante:** Accede siempre a través del proxy → `http://localhost/`

### Producción

```bash
# Iniciar API
cd api
npm start

# Iniciar cliente (en otra terminal)
cd client/customer
npm run build
# Servir con tu servidor web preferido
```

## 📂 Estructura del Proyecto

```
plugcore-chatbot/
├── package.json                    # Scripts raíz
├── proxy.js                        # Proxy que une API y cliente
├── api/
│   ├── .env                        # Variables de entorno
│   ├── package.json
│   ├── index.js                    # Punto de entrada
│   └── src/
│       ├── app.js                  # Configuración Express
│       ├── routes/
│       │   ├── index.js
│       │   └── customer/
│       │       └── chats.js        # Rutas del chatbot
│       ├── controllers/
│       │   └── customer/
│       │       └── chat-controller.js
│       └── services/
│           └── openai-service.js   # Servicio OpenAI
└── client/
    └── customer/
        ├── package.json
        ├── index.html
        ├── src/
        │   ├── index.js
        │   └── components/
        │       ├── hello-world-component.js
        │       ├── chatbot-component.js
        │       └── page-component.js
        └── pages/
            └── home.html
```

## 🔌 API Endpoints

### POST `/api/customer/chats`

Envía un mensaje al asistente y obtiene respuesta.

**Request:**
```json
{
  "prompt": "¿Cómo crear una página?",
  "threadId": "thread_abc123" // Opcional
}
```

**Response:**
```json
{
  "threadId": "thread_abc123",
  "answer": {
    "text": "Para crear una página:\n1. Accede al panel..."
  }
}
```

## 🎨 Personalización

### Colores del chatbot

Edita el CSS en `chatbot-component.js`:

```css
/* Color principal (rojo) */
background: linear-gradient(135deg, #e74c3c, #c0392b);

/* Fondo oscuro */
background: hsl(235, 7%, 31%);
```

### Mensajes

```javascript
// En chatbot-component.js
<div class="welcome-message">
  ¡Hola! 👋 Soy su asistente virtual de Plugcore.<br>
  ¿En qué puedo ayudarle hoy?
</div>
```

## 🐛 Solución de Problemas

### El chatbot no responde

1. Verifica que el API esté corriendo (`http://localhost:8080`)
2. Revisa la consola del navegador
3. Verifica que tu `.env` tenga las credenciales correctas
4. Confirma que accedes vía proxy (`http://localhost/`)

### Error "Assistant not found"

1. Verifica tu `OPENAI_ASSISTANT_CHATBOT_ID` en `.env`
2. Asegúrate de que el asistente existe en tu cuenta de OpenAI

### Respuestas vacías o errores de formato

1. Verifica que el Response Format esté configurado correctamente
2. Revisa las System Instructions del asistente
3. Asegúrate de que el schema JSON sea exacto
