import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

// Configuración básica del chatbot para la librería
const CONTEXTO_LIBRERIA = `
Eres un asistente virtual especializado para la librería "Nodo Literario".

INFORMACIÓN BÁSICA:
- Somos una librería online con amplio catálogo
- Vendemos libros físicos de todas las categorías
- Tenemos ficción, no ficción, académicos, infantiles
- Realizamos envíos a todo el país

RESPONDE SIEMPRE:
- De manera amable y profesional
- Enfocado en resolver dudas sobre libros
- Si preguntan por precios o stock específico, indica que necesitarías consultar el sistema
- Mantén respuestas concisas

NO INVENTES:
- Precios exactos
- Stock específico
- Fechas de lanzamiento no confirmadas
`;

// Array simple para mantener la conversación
let conversacion = [];

export const chatbotService = {
  async enviarMensaje(mensaje) {
    try {
      // Agregar mensaje del usuario
      conversacion.push(`Cliente: ${mensaje}`);

      // Mantener solo los últimos 3 mensajes para el contexto
      const contextoConversacion = conversacion.slice(-3).join('\n');

      const prompt = `${CONTEXTO_LIBRERIA}

Contexto de la conversación:
${contextoConversacion}

Pregunta actual: "${mensaje}"

Por favor, responde de manera útil:`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const respuesta = response.text;

      // Agregar respuesta a la conversación
      conversacion.push(`Asistente: ${respuesta}`);

      return {
        exito: true,
        respuesta: respuesta
      };

    } catch (error) {
      console.error('Error en chatbot:', error);
      return {
        exito: false,
        respuesta: "Lo siento, estoy teniendo dificultades técnicas. Por favor, intenta nuevamente o contacta con nuestro servicio al cliente."
      };
    }
  },

  limpiarConversacion() {
    conversacion = [];
  },

  obtenerConversacion() {
    return [...conversacion];
  }
};
