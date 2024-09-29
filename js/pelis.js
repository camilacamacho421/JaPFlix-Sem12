document.addEventListener("DOMContentLoaded", () => {
    const url = "https://japceibal.github.io/japflix_api/movies-data.json";
    let peliculas = [];

    // Hacer la solicitud al JSON
    fetch(url)
        .then(response => response.json())
        .then(data => {
            peliculas = data; // Guardar los datos en una variable
        })
        .catch(error => {
            console.error("Error al cargar los datos: ", error);
        });

    document.getElementById("btnBuscar").addEventListener("click", () => {
        const buscar = document.getElementById("inputBuscar").value.toLowerCase();
        if (buscar) {
            const resultados = peliculas.filter(pelicula =>
                pelicula.title.toLowerCase().includes(buscar) ||
                pelicula.genres.some(genre => genre.name.toLowerCase().includes(buscar)) ||
                (pelicula.tagline && pelicula.tagline.toLowerCase().includes(buscar)) ||
                (pelicula.overview && pelicula.overview.toLowerCase().includes(buscar))
            );
            mostrarResultados(resultados);
        }
    });
});

function generarEstrellas(score) {
    let estrellasHTML = '';
    const estrellasContadas = Math.round(score / 2); // Normaliza a 0-5

    for (let i = 1; i <= 5; i++) {
        if (i <= estrellasContadas) {
            estrellasHTML += '<span class="fa fa-star checked"></span>';
        } else {
            estrellasHTML += '<span class="fa fa-star nochecked"></span>';
        }
    }
    return estrellasHTML;
}


function mostrarResultados(resultados) {
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpiar resultados anteriores

    resultados.forEach(pelicula => {
        const vote = Math.max(0, Math.min(10, pelicula.vote_average)); // Asegúrate de que el voto esté entre 0 y 10
        const estrellas = generarEstrellas(vote); // Usar la función para generar estrellas
        
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `<div><strong>${pelicula.title}</strong><br>${pelicula.tagline}<br>${estrellas}</div>`;
        
        // Crear botón "Ver más"
        const verMasBtn = document.createElement("button");
        verMasBtn.className = "btn btn-info";
        verMasBtn.innerText = "Ver más";
        verMasBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Evitar que se dispare el clic en el li
            mostrarDetalles(pelicula);
        });

        item.appendChild(verMasBtn);
        lista.appendChild(item);
    });
}

function mostrarDetalles(pelicula) {
    const overlay = document.getElementById("overlay");
    const detallesContenedor = document.getElementById("detalles");
    const detalleTitulo = document.getElementById("detalleTitulo");
    const detalleOverview = document.getElementById("detalleOverview");
    const detalleGeneros = document.getElementById("detalleGeneros");

    // Limpiar el contenedor de detalles
    detalleTitulo.textContent = '';
    detalleOverview.textContent = '';
    detalleGeneros.innerHTML = '';

    // Agregar título y overview
    detalleTitulo.textContent = pelicula.title;
    detalleOverview.textContent = pelicula.overview;

    // Limpiar y llenar la lista de géneros
    pelicula.genres.forEach(genre => {
        const li = document.createElement("li");
        li.textContent = genre.name;
        detalleGeneros.appendChild(li);
    });

    // Crear botón para mostrar detalles adicionales
    const btnDetallesAdicionales = document.createElement("button");
    btnDetallesAdicionales.textContent = "Ver más detalles";
    btnDetallesAdicionales.className = "btn btn-secondary mt-2";

    // Crear contenedor para los detalles adicionales
    const detallesAdicionales = document.createElement("div");
    detallesAdicionales.className = "detalles-adicionales"; // Clase para el estilo
    detallesAdicionales.style.display = "none"; // Ocultar inicialmente
    detallesAdicionales.innerHTML = `
        <p>Año de lanzamiento: ${new Date(pelicula.release_date).getFullYear()}</p>
        <p>Duración: ${pelicula.runtime} minutos</p>
        <p>Presupuesto: $${pelicula.budget.toLocaleString()}</p>
        <p>Ganancias: $${pelicula.revenue.toLocaleString()}</p>
    `;

    btnDetallesAdicionales.addEventListener("click", () => {
        detallesAdicionales.style.display = detallesAdicionales.style.display === "none" ? "block" : "none";
    });

    // Limpiar contenido anterior
    while (detallesContenedor.firstChild) {
        detallesContenedor.removeChild(detallesContenedor.firstChild);
    }

    // Agregar los nuevos elementos
    detallesContenedor.appendChild(detalleTitulo);
    detallesContenedor.appendChild(detalleOverview);
    detallesContenedor.appendChild(detalleGeneros);
    detallesContenedor.appendChild(btnDetallesAdicionales);
    detallesContenedor.appendChild(detallesAdicionales);
    
    // Crear y agregar el botón de cerrar
    const btnCerrar = document.createElement("button");
    btnCerrar.textContent = "Cerrar";
    btnCerrar.className = "btn btn-secondary mt-2";
    btnCerrar.onclick = () => {
        overlay.style.display = "none";
    };
    detallesContenedor.appendChild(btnCerrar);

    // Mostrar el overlay y el contenedor
    overlay.style.display = "flex"; // Cambiamos a "flex" para centrar
}
