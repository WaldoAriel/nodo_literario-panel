// seed.js

// Importa todos los modelos necesarios desde index.js
import {
  sequelize,
  Categoria,
  Libro,
  Editorial,
  Autor, // Nuevo: Importa el modelo Autor
  ImagenProducto, // Nuevo: Importa el modelo ImagenProducto
  LibroAutor, // Nuevo: Importa el modelo LibroAutor (tabla intermedia)
} from "./src/models/index.js";

async function seedDatabase() {
  try {
    console.log("Limpiando tablas...");

    // Deshabilita las comprobaciones de claves foráneas temporalmente para permitir el truncate
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Limpia las tablas en el orden correcto para evitar problemas de dependencias
    await LibroAutor.destroy({ truncate: true, cascade: false }); // Primero la tabla intermedia
    await ImagenProducto.destroy({ truncate: true, cascade: false }); // Luego las imágenes
    await Libro.destroy({ truncate: true, cascade: false });
    await Autor.destroy({ truncate: true, cascade: false }); // Nuevo: Limpia Autores
    await Editorial.destroy({ truncate: true, cascade: false });
    await Categoria.destroy({ truncate: true, cascade: false });

    // Habilita las comprobaciones de claves foráneas nuevamente
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Insertando categorías...");
    const [
      categoriaNovela,
      categoriaCuento,
      categoriaPoesia,
      categoriaFantastica,
      categoriaEnsayo,
    ] = await Promise.all([
      Categoria.create({
        nombre: "Novela",
        imagen: "https://placehold.co/150x150/00474E/FFFFFF?text=Novela",
        activa: true,
      }),
      Categoria.create({
        nombre: "Cuento",
        imagen: "https://placehold.co/150x150/00474E/FFFFFF?text=Cuento",
        activa: true,
      }),
      Categoria.create({
        nombre: "Poesía",
        imagen: "https://placehold.co/150x150/00474E/FFFFFF?text=Poesia",
        activa: true,
      }),
      Categoria.create({
        nombre: "Fantasía",
        imagen: "https://placehold.co/150x150/00474E/FFFFFF?text=Fantasia",
        activa: true,
      }),
      Categoria.create({
        nombre: "Ensayo",
        imagen: "https://placehold.co/150x150/00474E/FFFFFF?text=Ensayo",
        activa: true,
      }),
    ]);

    console.log("Insertando editoriales...");
    const [
      editorialPlaneta,
      editorialSudamericana,
      editorialEmece,
      editorialMinotauro,
      editorialDeBolsillo,
      editorialLumen,
      editorialSigloXXI,
    ] = await Promise.all([
      Editorial.create({
        nombre: "Planeta",
        ubicacion: "España",
        activa: true,
      }),
      Editorial.create({
        nombre: "Sudamericana",
        ubicacion: "Argentina",
        activa: true,
      }),
      Editorial.create({
        nombre: "Emecé",
        ubicacion: "Argentina",
        activa: true,
      }),
      Editorial.create({
        nombre: "Minotauro",
        ubicacion: "España",
        activa: true,
      }),
      Editorial.create({
        nombre: "De Bolsillo",
        ubicacion: "España",
        activa: true,
      }),
      Editorial.create({
        nombre: "Lumen",
        ubicacion: "España",
        activa: true,
      }),
      Editorial.create({
        nombre: "Siglo XXI",
        ubicacion: "Argentina",
        activa: true,
      }),
    ]);

    console.log("Insertando autores...");
    const [
      autorBorges,
      autorSabato,
      autorRayBradbury,
      autorDolina,
      autorTolstoi,
      autorVictorHugo,
      autorStorni,
      autorGaleano,
      autorAnonimo, // Para El Kybalion
    ] = await Promise.all([
      Autor.create({
        nombre: "Jorge Luis",
        apellido: "Borges",
        biografia: "Escritor argentino, maestro del cuento y el ensayo.",
        fechaNacimiento: "1899-08-24", // Ejemplo de fecha
        nacionalidad: "Argentina",
        activo: true,
      }),
      Autor.create({
        nombre: "Ernesto",
        apellido: "Sábato",
        biografia: "Escritor y pintor argentino, autor de El túnel.",
        fechaNacimiento: "1911-06-24",
        nacionalidad: "Argentina",
        activo: true,
      }),
      Autor.create({
        nombre: "Ray",
        apellido: "Bradbury",
        biografia: "Escritor estadounidense de ciencia ficción y fantasía.",
        fechaNacimiento: "1920-08-22",
        nacionalidad: "Estadounidense",
        activo: true,
      }),
      Autor.create({
        nombre: "Alejandro",
        apellido: "Dolina",
        biografia: "Escritor, músico y conductor de radio argentino.",
        fechaNacimiento: "1944-05-20",
        nacionalidad: "Argentina",
        activo: true,
      }),
      Autor.create({
        nombre: "León",
        apellido: "Tolstói",
        biografia:
          "Novelista ruso, uno de los más grandes autores de la literatura mundial.",
        fechaNacimiento: "1828-09-09",
        nacionalidad: "Rusa",
        activo: true,
      }),
      Autor.create({
        nombre: "Victor",
        apellido: "Hugo",
        biografia: "Poeta, dramaturgo y novelista romántico francés.",
        fechaNacimiento: "1802-02-26",
        nacionalidad: "Francesa",
        activo: true,
      }),
      Autor.create({
        nombre: "Alfonsina",
        apellido: "Storni",
        biografia: "Poetisa argentina del modernismo.",
        fechaNacimiento: "1892-05-29",
        nacionalidad: "Argentina",
        activo: true,
      }),
      Autor.create({
        nombre: "Eduardo",
        apellido: "Galeano",
        biografia:
          "Periodista y escritor uruguayo, autor de Las venas abiertas de América Latina.",
        fechaNacimiento: "1940-09-14",
        nacionalidad: "Uruguaya",
        activo: true,
      }),
      Autor.create({
        nombre: "Anónimo",
        apellido: "(Tres Iniciados)",
        biografia: "Autores del Kybalion.",
        fechaNacimiento: null, // Puedes dejarlo null si no aplica
        nacionalidad: null, // Puedes dejarlo null si no aplica
        activo: true,
      }),
    ]);

    console.log("Insertando libros...");

    // Base URL para las imágenes raw de GitHub
    const GITHUB_IMAGES_BASE_URL =
      "https://raw.githubusercontent.com/WaldoAriel/imagenes-libreria/main/libros/";
    const SHARED_IMAGES_BASE_URL =
      "https://raw.githubusercontent.com/WaldoAriel/imagenes-libreria/main/libros/";

    // URLs de las imágenes compartidas
    const sharedImage1Url = SHARED_IMAGES_BASE_URL + "libros-cuadrados_fin.png";
    const sharedImage2Url =
      SHARED_IMAGES_BASE_URL + "libros-cuadrados_2_fin.png";

    const [
      libroKybalion,
      libroAleph,
      libroTunel,
      libroCronicasMarcianas,
      libroNotasAlPie,
      libroGuerraYPaz,
      libroMiserables,
      libroHistoriasFantasticas,
      libroPoesia,
      libroLibroDelFantasma,
      libroVenasAbiertas,
    ] = await Promise.all([
      Libro.create({
        titulo: "El Kybalion",
        isbn: "9781234567890",
        descripcion:
          "Un libro sobre filosofía hermética y la ley del mentalismo.",
        precio: 12500.0,
        stock: 3,
        // 'imagen' ya no es un campo directo en Libro
        id_categoria: categoriaEnsayo.id,
        id_editorial: editorialSigloXXI.id,
        activa: true,
      }),

      Libro.create({
        titulo: "El Aleph",
        isbn: "9781234567891",
        descripcion:
          "Una obra maestra de Jorge Luis Borges con cuentos filosóficos.",
        precio: 19800.0,
        stock: 10,
        id_categoria: categoriaCuento.id,
        id_editorial: editorialEmece.id,
        activa: true,
      }),

      Libro.create({
        titulo: "El túnel",
        isbn: "9781234567892",
        descripcion: "Una novela psicológica de Ernesto Sábato.",
        precio: 17550.0,
        stock: 12,
        id_categoria: categoriaNovela.id,
        id_editorial: editorialEmece.id,
        activa: true,
      }),

      Libro.create({
        titulo: "Crónicas Marcianas",
        isbn: "9781234567893",
        descripcion: "Colección de relatos cortos de ciencia ficción.",
        precio: 14200.0,
        stock: 0,
        id_categoria: categoriaFantastica.id,
        id_editorial: editorialMinotauro.id,
        activa: true,
      }),

      Libro.create({
        titulo: "Notas al pie",
        isbn: "9781234567894",
        descripcion: "Humor y literatura en este libro de Alejandro Dolina.",
        precio: 13990.0,
        stock: 0,
        id_categoria: categoriaCuento.id,
        id_editorial: editorialPlaneta.id,
        activa: true,
      }),

      Libro.create({
        titulo: "Guerra y Paz",
        isbn: "9781234567895",
        descripcion: "La gran novela histórica de León Tolstói.",
        precio: 19300.0,
        stock: 7,
        id_categoria: categoriaNovela.id,
        id_editorial: editorialLumen.id,
        activa: true,
      }),

      Libro.create({
        titulo: "Los Miserables",
        isbn: "9781234567896",
        descripcion: "Una historia épica sobre redención y justicia.",
        precio: 13500.0,
        stock: 0,
        id_categoria: categoriaNovela.id,
        id_editorial: editorialPlaneta.id,
        activa: true,
      }),

      Libro.create({
        titulo: "Historias Fantásticas",
        isbn: "9781234567897",
        descripcion: "Colección de cuentos de ciencia ficción y fantasía.",
        precio: 8820.0,
        stock: 11,
        id_categoria: categoriaFantastica.id,
        id_editorial: editorialMinotauro.id,
        activa: true,
      }),

      Libro.create({
        titulo: "Poesía",
        isbn: "9781234567898",
        descripcion: "Selección de poemas clásicos de Alfonsina Storni.",
        precio: 6980.0,
        stock: 20,
        id_categoria: categoriaPoesia.id,
        id_editorial: editorialSudamericana.id,
        activa: true,
      }),

      Libro.create({
        titulo: "El libro del fantasma",
        isbn: "9781234567899",
        descripcion: "Colección de cuentos de misterio y humor negro.",
        precio: 14650.0,
        stock: 6,
        id_categoria: categoriaCuento.id,
        id_editorial: editorialDeBolsillo.id,
        activa: true,
      }),

      Libro.create({
        titulo: "Las venas abiertas de América Latina",
        isbn: "978123456789",
        descripcion: "Ensayo histórico sobre la explotación en América Latina.",
        precio: 19800.0,
        stock: 4,
        id_categoria: categoriaEnsayo.id,
        id_editorial: editorialSigloXXI.id,
        activa: true,
      }),
    ]);

    console.log("Asociando imágenes a libros...");
    await Promise.all([
      // Kybalion
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "kibalion.webp",
        id_libro: libroKybalion.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage1Url,
        id_libro: libroKybalion.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage2Url,
        id_libro: libroKybalion.id,
      }),

      // El Aleph
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "aleph.webp",
        id_libro: libroAleph.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage1Url,
        id_libro: libroAleph.id,
      }), // Imagen compartida
      ImagenProducto.create({
        urlImagen: sharedImage2Url,
        id_libro: libroAleph.id,
      }), // Imagen compartida

      // El túnel
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "tunel.webp",
        id_libro: libroTunel.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage1Url,
        id_libro: libroTunel.id,
      }),

      // Crónicas Marcianas
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "cronicas_marcianas.webp",
        id_libro: libroCronicasMarcianas.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage2Url,
        id_libro: libroCronicasMarcianas.id,
      }),

      // Notas al pie
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "notas_al_pie.webp",
        id_libro: libroNotasAlPie.id,
      }),

      // Guerra y Paz
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "guerra_y_paz.webp",
        id_libro: libroGuerraYPaz.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage1Url,
        id_libro: libroGuerraYPaz.id,
      }),

      // Los Miserables
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "miserables.webp",
        id_libro: libroMiserables.id,
      }),

      // Historias Fantásticas
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "historias_fantasticas.webp",
        id_libro: libroHistoriasFantasticas.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage2Url,
        id_libro: libroHistoriasFantasticas.id,
      }),

      // Poesía
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "poesia.webp",
        id_libro: libroPoesia.id,
      }),

      // El libro del fantasma
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "libro_del_fantasma.webp",
        id_libro: libroLibroDelFantasma.id,
      }),

      // Las venas abiertas de América Latina
      ImagenProducto.create({
        urlImagen: GITHUB_IMAGES_BASE_URL + "las_venas_abiertas.webp",
        id_libro: libroVenasAbiertas.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage1Url,
        id_libro: libroVenasAbiertas.id,
      }),
      ImagenProducto.create({
        urlImagen: sharedImage2Url,
        id_libro: libroVenasAbiertas.id,
      }),
    ]);

    console.log("Asociando autores a libros...");
    await Promise.all([
      libroKybalion.addAutores([autorAnonimo.id]),
      libroAleph.addAutores([autorBorges.id]),
      libroTunel.addAutores([autorSabato.id]),
      libroCronicasMarcianas.addAutores([autorRayBradbury.id]),
      libroNotasAlPie.addAutores([autorDolina.id]),
      libroGuerraYPaz.addAutores([autorTolstoi.id]),
      libroMiserables.addAutores([autorVictorHugo.id]),
      libroHistoriasFantasticas.addAutores([autorRayBradbury.id]), // Un autor puede tener varios libros
      libroPoesia.addAutores([autorStorni.id]),
      libroLibroDelFantasma.addAutores([autorDolina.id]), // Un autor puede tener varios libros
      libroVenasAbiertas.addAutores([autorGaleano.id]),
    ]);

    console.log("✅ Base de datos poblada exitosamente.");
  } catch (error) {
    console.error(
      "❌ Error al poblar la base de datos:",
      error.message || error
    );
  } finally {
    await sequelize.close(); // Cierra la conexión a la base de datos al finalizar
  }
}

seedDatabase();
