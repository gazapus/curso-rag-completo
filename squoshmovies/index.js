import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { movies } from "./data.js";
import OpenAI from "openai";
import supabaseClient from "./supabase.js";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const datamovies = movies.results.map((movie) => {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
  };
});

try {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: JSON.stringify(datamovies[0]),
    encoding_format: "float",
  });
  console.log(embedding.data[0].embedding);
} catch (error) {
  console.warn("Error al obtener el embedding: ", error?.message);
}

/**
 * Insertar los datos en la base de datos
 */
const { data, error } = await supabaseClient.from("movies").insert({
  vector: [1, 2, 3], // debería ser el embedding del texto provisto por la API de OPENAI
  content: JSON.stringify(datamovies[0]),
  metadata: { id: datamovies[0].id, title: datamovies[0].title },
});

if (error) {
  console.error(error);
} else {
  console.log(data);
}