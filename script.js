/**
 * Configuración de recursos y constantes
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

function crearHtmlTipos(tipos) {
    return tipos.map(tipo => `
        <span class="etiquetaTipo bg-${tipo.toLowerCase()}">
            <img src="${iconosTipos[tipo]}" class="iconoTipo"> ${tipo}
        </span>
    `).join('');
}

async function cargarPokemonDesdeApi() {
    try {
        const respuesta = await fetch(urlDatos);
        todosLosPokemon = await respuesta.json();
        renderizarListaPokemon(todosLosPokemon);
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

function renderizarListaPokemon(lista) {
    const contenedor = document.getElementById('contenedorPokemon');
    const mensajeVacio = document.getElementById('mensajeSinResultados');
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        mensajeVacio.classList.remove('d-none');
    } else {
        mensajeVacio.classList.add('d-none');
        lista.forEach(pk => {
            const idFormateado = pk.id.toString().padStart(3, '0');
            const tarjetaHtml = `
                <div class="col">
                    <div class="card h-100 shadow-sm tarjetaPokemon">
                        <div class="contenedorImagenCard" onclick="abrirModalDetalle(${pk.id})">
                            <img src="${urlImgMiniatura}${idFormateado}.png" style="width: 110px;">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div onclick="abrirModalDetalle(${pk.id})" style="cursor:pointer">
                                <p class="text-muted mb-1 small fw-bold">Nº ${idFormateado}</p>
                                <h5 class="fw-bold text-dark">${pk.name.english}</h5>
                                <div class="mb-3">${crearHtmlTipos(pk.type)}</div>
                            </div>
                            <button class="btn btn-primary btn-sm rounded-pill mt-auto fw-bold" onclick="abrirModalDetalle(${pk.id})">
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

document.getElementById('campoBusqueda').addEventListener('keyup', (evento) => {
    const busqueda = evento.target.value.toLowerCase().trim();
    const filtrados = todosLosPokemon.filter(p => p.name.english.toLowerCase().includes(busqueda));
    renderizarListaPokemon(filtrados);
});

function abrirModalDetalle(id) {
    const p = todosLosPokemon.find(pokemon => pokemon.id === id);
    const idStr = p.id.toString().padStart(3, '0');

    Swal.fire({
        title: `<strong>${p.name.english}</strong>`,
        // Agregamos el botón de cerrar (la X)
        showCloseButton: true,
        html: `
            <div class="text-center">
                <img src="${urlImgDetalle}${idStr}.png" class="img-fluid mb-3" style="max-height: 220px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));">
                <div class="p-3 rounded bg-white border shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge bg-dark px-3 py-2 rounded-pill">Nº ${idStr}</span>
                        <div>${crearHtmlTipos(p.type)}</div>
                    </div>
                    <p class="text-start small text-muted bg-light p-2 rounded"><em>"${p.description}"</em></p>
                    <hr>
                    <div class="row g-2">
                        <div class="col-4">
                            <div class="p-2 border rounded bg-white">
                                <span class="d-block small text-muted fw-bold">HP</span>
                                <b class="text-success">${p.base.HP}</b>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="p-2 border rounded bg-white">
                                <span class="d-block small text-muted fw-bold">ATAQUE</span>
                                <b class="text-danger">${p.base.Attack}</b>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="p-2 border rounded bg-white">
                                <span class="d-block small text-muted fw-bold">DEFENSA</span>
                                <b class="text-primary">${p.base.Defense}</b>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="p-2 border rounded bg-white">
                                <span class="d-block small text-muted fw-bold">SP. ATK</span>
                                <b class="text-warning">${p.base["Sp. Attack"]}</b>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="p-2 border rounded bg-white">
                                <span class="d-block small text-muted fw-bold">SP. DEF</span>
                                <b class="text-info">${p.base["Sp. Defense"]}</b>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="p-2 border rounded bg-white">
                                <span class="d-block small text-muted fw-bold">VELOC.</span>
                                <b style="color: #6f42c1;">${p.base.Speed}</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#2d3436'
    });
}

cargarPokemonDesdeApi();