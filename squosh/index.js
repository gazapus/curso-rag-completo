import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "Hola Mundo, soy mi primer embedding del proyecto Squosh",
  encoding_format: "float",
});

console.log(embedding);