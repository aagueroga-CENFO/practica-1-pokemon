/**
 * Configuración de URLs y recursos
 */
const urlDatos = "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/pokedex.json";
const urlImgMiniatura = "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/thumbnails/";
const urlImgDetalle = "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/";

const iconosTipos = {
    "Grass": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/grass.svg",
    "Poison": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/poison.svg",
    "Fire": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fire.svg",
    "Flying": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/flying.svg",
    "Water": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/water.svg",
    "Bug": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/bug.svg",
    "Normal": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/normal.svg",
    "Electric": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/electric.svg",
    "Ground": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ground.svg",
    "Fairy": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fairy.svg",
    "Fighting": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fighting.svg",
    "Psychic": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/psychic.svg",
    "Rock": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/rock.svg",
    "Steel": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/steel.svg",
    "Ice": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ice.svg",
    "Ghost": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ghost.svg",
    "Dragon": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dragon.svg",
    "Dark": "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dark.svg"
};

let todosLosPokemon = [];

/**
 * Genera el HTML para las etiquetas de tipo
 */
function crearHtmlTipos(tipos) {
    return tipos.map(tipo => `
        <span class="etiquetaTipo bg-${tipo.toLowerCase()}">
            <img src="${iconosTipos[tipo]}" class="iconoTipo"> ${tipo}
        </span>
    `).join('');
}

/**
 * Carga inicial de datos desde la API
 */
async function cargarPokemon() {
    try {
        const respuesta = await fetch(urlDatos);
        todosLosPokemon = await respuesta.json();
        renderizarCartas(todosLosPokemon);
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

/**
 * Dibuja las tarjetas en la pantalla principal
 */
function renderizarCartas(lista) {
    const contenedor = document.getElementById('contenedorPokemon');
    const mensajeVacio = document.getElementById('mensajeSinResultados');
    if (!contenedor) return;
    
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        mensajeVacio.classList.remove('d-none');
    } else {
        mensajeVacio.classList.add('d-none');
        lista.forEach(pk => {
            const idStr = pk.id.toString().padStart(3, '0');
            const tarjetaHtml = `
                <div class="col">
                    <div class="card h-100 shadow-sm tarjetaPokemon">
                        <div class="contenedorImagenCard" onclick="abrirModal(${pk.id})">
                            <img src="${urlImgMiniatura}${idStr}.png" style="width: 100px;">
                        </div>
                        <div class="card-body d-flex flex-column text-center pt-2">
                            <p class="text-muted mb-0 small fw-bold">Nº ${idStr}</p>
                            <h5 class="fw-bold text-dark mb-0">${pk.name.english}</h5>
                            <p class="text-muted small mb-2" style="font-size: 0.75rem;">${pk.species}</p>
                            <div class="mb-3">${crearHtmlTipos(pk.type)}</div>
                            <button class="btn btn-primary btn-sm rounded-pill mt-auto fw-bold" onclick="abrirModal(${pk.id})">
                                Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
            contenedor.insertAdjacentHTML('beforeend', tarjetaHtml);
        });
    }
}

/**
 * Filtro de búsqueda por nombre
 */
document.getElementById('campoBusqueda').addEventListener('keyup', (e) => {
    const texto = e.target.value.toLowerCase().trim();
    const filtrados = todosLosPokemon.filter(p => p.name.english.toLowerCase().includes(texto));
    renderizarCartas(filtrados);
});

/**
 * Muestra el modal detallado con espacios corregidos
 */
function abrirModal(id) {
    const p = todosLosPokemon.find(pokemon => pokemon.id === id);
    const idStr = p.id.toString().padStart(3, '0');

    Swal.fire({
        padding: '0.5rem', // Reduce el espacio interior general
        showCloseButton: true,
        // Título y Especie pegaditos eliminando márgenes de h2 y p
        title: `
            <div style="margin-top: 5px;">
                <h2 style="margin: 0; font-weight: 800; color: #333; line-height: 1;">${p.name.english}</h2>
                <p style="margin: 2px 0 0 0; font-size: 0.85rem; color: #6c757d; font-weight: 400;">${p.species}</p>
            </div>
        `,
        html: `
            <div class="text-center">
                <img src="${urlImgDetalle}${idStr}.png" 
                     class="img-fluid" 
                     style="max-height: 160px; margin-top: 5px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));">
                
                <div class="px-3 pb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2 mt-2">
                        <span class="badge bg-dark px-3 py-1 rounded-pill" style="font-size: 0.75rem;">Nº ${idStr}</span>
                        <div>${crearHtmlTipos(p.type)}</div>
                    </div>
                    
                    <p class="text-start small text-muted bg-light p-2 rounded mb-3" style="line-height: 1.2;">
                        <em>"${p.description}"</em>
                    </p>
                    
                    <hr style="margin: 10px 0;">
                    
                    <div class="row g-2">
                        <div class="col-4"><div class="p-1 border rounded bg-white"><span class="d-block text-muted fw-bold" style="font-size: 0.6rem;">HP</span><b class="text-success small">${p.base.HP}</b></div></div>
                        <div class="col-4"><div class="p-1 border rounded bg-white"><span class="d-block text-muted fw-bold" style="font-size: 0.6rem;">ATK</span><b class="text-danger small">${p.base.Attack}</b></div></div>
                        <div class="col-4"><div class="p-1 border rounded bg-white"><span class="d-block text-muted fw-bold" style="font-size: 0.6rem;">DEF</span><b class="text-primary small">${p.base.Defense}</b></div></div>
                        <div class="col-4"><div class="p-1 border rounded bg-white"><span class="d-block text-muted fw-bold" style="font-size: 0.6rem;">S.ATK</span><b class="text-warning small">${p.base["Sp. Attack"]}</b></div></div>
                        <div class="col-4"><div class="p-1 border rounded bg-white"><span class="d-block text-muted fw-bold" style="font-size: 0.6rem;">S.DEF</span><b class="text-info small">${p.base["Sp. Defense"]}</b></div></div>
                        <div class="col-4"><div class="p-1 border rounded bg-white"><span class="d-block text-muted fw-bold" style="font-size: 0.6rem;">SPD</span><b class="small" style="color: #6f42c1;">${p.base.Speed}</b></div></div>
                    </div>
                </div>
            </div>
        `,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#2d3436',
        customClass: {
            title: 'p-0',
            htmlContainer: 'm-0 pt-0'
        }
    });
}

// Inicializar la aplicación
cargarPokemon();