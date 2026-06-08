## VECTORES:
Son multidimensionales
En IA toda información se puede vectorizar.
Para esto se utilizan modelos embeddings.


---
### EMBEDDINGS:
En términos sencillos: un embedding es la traducción de un texto a una lista de números (un vector) que captura su contexto semántico. Gracias a los embeddings, el RAG puede buscar por concepto, permitiendo que el LLM reciba el contexto correcto sin importar qué palabras exactas usó el usuario para preguntar.

Link de embeddings de OPEN AI:
https://developers.openai.com/api/docs/guides/embeddings

----
### BD Vectorial
Una vez generados los embeddings estos deben subirse a una base de datos vectorial.
Cada registro es Vector(Embeddings) + metadata opcional (generalmente en json).
LA BD vectorial permite buscar por similitud semantica,  no coincidencia exacta.

```
TABLA:
ID  |   VECTOR     | METADATA   |   TEXT    |   ETC(opcional)
```

En la columna Texto va el texto que se está almacenando. Por ejemplo la sinopsis de una pelicula.
La columna Metadata es información adicional de la pelicula que sirve para enriquecer el contexto. 

**Para tener columnas de tipo vector se debe tener un plugin en mi BD**
__Por ejemplo en Postgres se utiliza PGvector__
De lo contrario también sirven servicios en la nube de base de datos vectoriales: **Pinecone o supabase**.

### Búsqueda semántica
¿Qué es? Es similar al select de las BD vectoriales
Da resultados similares, no exactos. 
Nosotros decidimos cuántos resultados necesitamos y qué similitud esperamos. Se ordenan por puntaje de similitud.

**Todo texto que se quiera usar para un busqueda debe convertirse a vector y recién ahí se lo envía a buscar a la BD.**

Una vez obtenido el resultado de la búsqueda se lo envía a un LLM para en base a la pregunta devolver la respuesta en formato humano y con el tono correspondiente en base a la pregunta. Se le da algo así al LLM:

```
"Responde la pregunta: ¿Qué película puedo ver sobre romances en un barco que tengan un final trágico?
Estás completamente restringido a construir tu respuesta solo de películas del siguiente array como contexto:[{"text": ...}]"
```

Así nos dará una respuesta limitada a los resultados de mi base de datos vectorial.

---
En este curso se usará la API https://developer.themoviedb.org/reference/movie-top-rated-list de prueba para poblar la BD.
---

### GUARDAR LOS DATOS EN VECTORES
Instalar llm-chunk librería.
Usarlo para tomar texto grande y vidivirlo en pedazos. Aplicar estrategias para esta división. 
Revisar ejemplo de @chunk.js

### CREAR BD VECTORIAL EN SUPABASE:
En un proyecto SUPABASE, ir a BD -> EXTENSIONES -> HABILITAR PGV.
Luego de eso crear las columnas necesarias como: vector de tipo vector, texto de tipo texto, metadata de tipo texto. 
Una vez lista la BD elegir la opción CONNECT de supabase y seguir las instrucciones:
- npm install @supabase/supabase-js @supabase/ssr
- crear .env o constants.js para epxoner claves
- crear cliente supabase para conectar a la BD. Ver supabase.js
- aJUSTAR POLITICA DE SEGURIDAD DE BD DE SUPABASE PARA PERMITIR ACCESO A LOS DATOS
- Insertar registros, ver index.js

### BUSQUEDA SEMANTICA EN BD VECTORIAL: 
[Link Doc](https://supabase.com/docs/guides/ai/vector-columns)
- Crear una función en Supabase para hacer la busqueda semantica en mi bd de la siguiente manera:
```
create or replace function match_movies (
  query_embedding extensions.vector(1536),-- Reeplazar valor por el tamaño de vector (Embeddings) que estoy creando
  match_threshold float, -- valor de coincidencia que tiene que tener la busqueda (0 es nada, 1 es total coincidencia)
  match_count int -- cantidad de resultados a obtener
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    movies.id,
    movies.content,
    movies.metadata,
    1 - (movies.vector <=> query_embedding) as similarity
  from movies
  where 1 - (movies.vector <=> query_embedding) > match_threshold
  order by (movies.vector <=> query_embedding) asc
  limit match_count;
$$;
```
Y luego invocarla desde mi aplicación. Para esto se requiere convertir lo que el usuario busca en un vector y este vector enviarlo en esta función de búsqueda.
Ver search.js

---

