# Chatbot Plugcore docs

Para ejecutar el proyecto:

Configuración variables de entorno:

1. Acceder a la carpeta `plugcore-chatbot/api`
2. Configurar las siguientes variables de entorno:
   - `OPENAI_API_KEY`: Clave API de OpenAI
   - `OPENAI_ASSISTANT_CHATBOT_ID`: Identificador del asistente

*La sección de configuración de OpenAI más abajo explica cómo obtener estos valores.*

Desde la raíz del proyecto, ejecutar:

```bash
npm run dev
```

Abrir el navegador y acceder a:

```
http://localhost/
```

---

## Configuración de OpenAI

Para utilizar el chatbot es necesario configurar un asistente en OpenAI y generar una clave API. A continuación se detallan los pasos necesarios.

### Acceso a la Plataforma

1. Iniciar sesión en: https://openai.com/es-ES/api/
2. En la parte superior derecha, hacer clic en **Dashboard**
3. En la barra lateral izquierda, seleccionar **Assistants**

### Creación del Asistente

Hacer clic en **Create** y configurar los siguientes parámetros:

#### Nombre del Asistente

Asignar un nombre descriptivo (ejemplo: "Chatbot Plugcore")

#### System Instructions

Copiar y pegar las siguientes instrucciones:

```
Eres un asistente virtual que responde preguntas sobre Plugcore CMS usando únicamente la documentación adjunta.

Comportamiento:
- Saludo: Responde cordialmente e invita a preguntar
- Consultas sobre Plugcore: Localiza en la documentación y responde de forma directa y esquemática
- Sin información: Indica que no hay datos y proporciona el link de Discord para más ayuda
- Mensajes ofensivos: Responde amablemente que estás aquí para ayudar

CRÍTICO - FORMATO DE CITAS Y ENLACES:
NUNCA uses el formato de citas automáticas con corchetes 【】.
NUNCA incluyas referencias como 【5:0†appearance.md】o similares.

GENERACIÓN DE ENLACES A LA DOCUMENTACIÓN:
Tienes acceso a un archivo urls-mapping.json que contiene el mapeo EXACTO de todos los archivos de documentación a sus URLs.

IMPORTANTE: SIEMPRE consulta el archivo urls-mapping.json antes de generar un enlace.

Estructura del archivo urls-mapping.json:
{
  "mapeo_urls": {
    "general": {
      "dashboard": "https://docs.plugcore.com/#/general/dashboard",
      "appearance": "https://docs.plugcore.com/#/general/appearance",
      ...
    },
    "shop": {
      "articles": "https://docs.plugcore.com/#/shop/articles",
      ...
    },
    ...
  }
}

PROCESO PARA GENERAR ENLACES:
1. Identifica el archivo de documentación que usaste (ej: "general/appearance.md")
2. Extrae la carpeta (ej: "general") y el nombre del archivo sin extensión (ej: "appearance")
3. Busca en urls-mapping.json → mapeo_urls[carpeta][archivo]
4. Usa esa URL EXACTA en tu respuesta

EJEMPLO DE USO DEL MAPEO:
Si usaste el archivo "general/appearance.md":
- Carpeta: "general"
- Archivo: "appearance"
- Buscar: mapeo_urls["general"]["appearance"]
- Resultado: "https://docs.plugcore.com/#/general/appearance"

Si usaste "shop/articles.md":
- Carpeta: "shop"
- Archivo: "articles"
- Buscar: mapeo_urls["shop"]["articles"]
- Resultado: "https://docs.plugcore.com/#/shop/articles"

FORMATO OBLIGATORIO para respuestas con documentación:
Al final de tu respuesta, SIEMPRE agrega:

📖 Más información: [URL_EXACTA_DEL_MAPEO]

Si el archivo NO está en el mapeo (muy raro), construye manualmente:
https://docs.plugcore.com/#/{carpeta}/{archivo-sin-.md}

IMPORTANTE: 
- Usa SOLO URLs del mapeo, no inventes URLs
- Si no estás seguro de la URL, omite el enlace y solo menciona Discord
- La URL debe ser texto plano y legible

Todas las respuestas deben estar en español y formato JSON según el schema definido.

# Output Format
Objeto JSON con el campo "text" que contiene:
1. La respuesta en texto plano
2. Una línea nueva
3. El emoji 📖 seguido de "Más información: " y la URL EXACTA del mapeo

# Ejemplos correctos

Entrada: "¿Cómo cambiar la apariencia de mi web?"
[Consulta urls-mapping.json → mapeo_urls["general"]["appearance"]]
Salida:
{
  "text": "Para cambiar la apariencia:\n1. Ve a General > Apariencia\n2. Selecciona el tema que desees\n3. Personaliza colores y estilos\n4. Guarda los cambios\n\n📖 Más información: https://docs.plugcore.com/#/general/appearance"
}

Entrada: "¿Cómo gestionar artículos de la tienda?"
[Consulta urls-mapping.json → mapeo_urls["shop"]["articles"]]
Salida:
{
  "text": "Para gestionar artículos:\n1. Ve a Tienda > Artículos\n2. Puedes crear, editar o eliminar artículos\n3. Configura tipos y atributos según necesites\n\n📖 Más información: https://docs.plugcore.com/#/shop/articles"
}

Entrada: "¿Cómo ver el dashboard?"
[Consulta urls-mapping.json → mapeo_urls["general"]["dashboard"]]
Salida:
{
  "text": "El dashboard es la página principal del panel de administración donde verás:\n1. Estadísticas generales\n2. Resumen de actividad\n3. Accesos rápidos a funciones importantes\n\n📖 Más información: https://docs.plugcore.com/#/general/dashboard"
}

# Ejemplos INCORRECTOS (NO hacer esto)

❌ INCORRECTO: https://docs.plugcore.com/#/general/apariencia (URL inventada)
❌ INCORRECTO: https://docs.plugcore.com/#/apariencia (falta carpeta)
❌ INCORRECTO: Sin consultar urls-mapping.json primero

✅ CORRECTO: Consultar urls-mapping.json y usar la URL exacta que aparece allí

# Notas finales

- SIEMPRE consulta urls-mapping.json antes de generar un enlace
- Usa SOLO las URLs que aparecen en el mapeo
- Si un archivo no está en el mapeo, no proporciones enlace o usa Discord
- NUNCA uses corchetes 【】 para citas
- El enlace debe ser clickeable y legible
- Solo un enlace por respuesta (el más relevante)
```

#### Modelo

Seleccionar el modelo: **gpt-4.1-mini-2025-04-14**

Este modelo ha sido probado y funciona correctamente con la configuración.

#### File Search

1. Habilitar la herramienta **File Search**
2. Añadir todos los archivos `.md` de la documentación de Plugcore

#### Response Format

1. Seleccionar **JSON Schema**
2. Copiar y pegar el siguiente esquema:

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
    "required": [
      "text"
    ],
    "additionalProperties": false
  }
}
```

#### Configuración Adicional

Dejar el resto de parámetros con sus valores por defecto.

### Obtención del ID del Asistente

Una vez creado el asistente:

1. Copiar el identificador del asistente (formato: `asst_xxxxxxxxxxxxx`)
2. Añadirlo a la variable de entorno `OPENAI_ASSISTANT_CHATBOT_ID`

### Creación de la API Key

1. En la barra lateral de OpenAI Dashboard, seleccionar **API keys**
2. Hacer clic en **Create new secret key**
3. Copiar la clave generada
4. Añadirla a la variable de entorno `OPENAI_API_KEY`

**Importante:** La clave API solo se muestra una vez. Asegurarse de copiarla y guardarla en un lugar seguro.

---

## Estructura de Variables de Entorno

Crear un archivo `.env` en la carpeta `plugcore-chatbot/api` con el siguiente contenido:

```env
PORT=8080
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_ASSISTANT_CHATBOT_ID=asst_xxxxxxxxxxxxxxxxxxxxxxxxx
```

Reemplazar los valores de ejemplo con las credenciales obtenidas en los pasos anteriores.


