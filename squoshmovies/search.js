import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import supabaseClient from "./supabase.js";
import OpenAI from "openai";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function search(query) {
  let embedding = {
    data: [{ embedding: [1,2,3] }], // default value porque no tengo credito en openai para obtener el embedding
  };
  /** Simulación de obtención de embedding */
  try {
    embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      encoding_format: "float",
    });
  } catch (error) {
    console.warn("Error al obtener el embedding: ", error?.message);
  }
  /** Llamada a la función de búsqueda semantica en Supabase */
  const response = await supabaseClient.rpc("match_movies", {
    query_embedding: embedding.data[0].embedding, // vector obtenido de la API de OPENAI que representa la pregunta del usuario
    match_threshold: 0.2, // valor de coincidencia que tiene que tener la busqueda (0 es nada, 1 es total coincidencia)
    match_count: 2, // cantidad de resultados a obtener
  });

  return response;
}

search("película divertida y loca").then(console.log);
