import { search } from "../search.js";
import openAI from "../CHAT/openAI.js";
import systemMessage from "../CHAT/systemMessage.js";

const userQuestion = "Quiero una película sobre un caballero de la noche";
const movies = await search(userQuestion);

const response = await openAI.responses.create({
  model: "gpt-4.1",
  input: [
    {
      "role": "system", // Rol del sistema
      "content": [
        {
          "type": "input_text",
          "text": systemMessage
        }
      ]
    },
    {
      "role": "user", // Rol del usuario
      "content": [
        {
          "type": "input_text",
          "text": `Pregunta del usuario: ${userQuestion} \n\n Contexto: ${JSON.stringify(movies)}`
        }
      ]
    }
  ],
  text: {
    "format": {
      "type": "text"
    }
  },
  reasoning: {},
  tools: [],
  temperature: 1,
  max_output_tokens: 2048,
  top_p: 1,
  store: true
});

console.log(response.output_text)