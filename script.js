const url = "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/pokedex.json";
let allPokemon = []; // Variable global para guardar la lista original

async function getPokemonData() {
    try {
        const response = await fetch(url);
        allPokemon = await response.json(); // Guardamos los datos [cite: 45, 81]
        renderCards(allPokemon);
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

// Función para filtrar (Punto 5 y 6 de la consigna)
function filterPokemon(searchTerm) {
    // Aplicamos los criterios de la mini-especificación[cite: 61, 85]:
    // 1. Trim: elimina espacios al inicio/fin 
    // 2. ToLowerCase: ignora mayúsculas/minúsculas 
    const cleanTerm = searchTerm.trim().toLowerCase();

    const filtered = allPokemon.filter(pokemon => {
        const name = pokemon.name.english.toLowerCase();
        // Búsqueda parcial: verifica si el nombre incluye el texto 
        return name.includes(cleanTerm);
    });

    // Manejo de "Sin coincidencias" 
    const noResultsEl = document.getElementById('no-results');
    if (filtered.length === 0) {
        noResultsEl.classList.remove('d-none');
    } else {
        noResultsEl.classList.add('d-none');
    }

    renderCards(filtered);
}

// Evento keyUp para el filtro [cite: 59]
document.getElementById('filter-input').addEventListener('keyup', (event) => {
    filterPokemon(event.target.value);
});

function renderCards(pokemonList) {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = ""; 

    pokemonList.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = "col";
        card.innerHTML = `
            <div class="card h-100 shadow-sm pokemon-card">
                <img src="${pokemon.thumbnail}" class="card-img-top p-3" alt="${pokemon.name.english}">
                <div class="card-body">
                    <h5 class="card-title text-capitalize">${pokemon.name.english}</h5>
                    <p class="card-text text-muted" style="font-size: 0.85rem;">${pokemon.description.substring(0, 70)}...</p>
                    <div class="mb-2">
                        ${pokemon.type.map(t => `<span class="badge bg-info text-dark me-1">${t}</span>`).join('')}
                    </div>
                    <button class="btn btn-primary w-100 btn-sm">Ver Detalles</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

getPokemonData();