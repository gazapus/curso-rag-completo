import { text } from "./text.js";
import { chunk } from "llm-chunk";

/**
 * chunk es una función que divide el texto en chunks de tamaño variable.
 * minLength es el tamaño mínimo de cada chunk.
 * maxLength es el tamaño máximo de cada chunk.
 * overlap es el número de caracteres que se solapan entre cada chunk, 
 * es decir el siguiente chunk comienza "overlap" caracteres antes del final del chunk anterior.
 */
const chunks = chunk(text, {minLength: 100, maxLength: 120, overlap: 40})

chunks.forEach(chunk => {
  console.log("\n\nCHUUUUUUUUUUUUUUUNK: ", chunk)
})  