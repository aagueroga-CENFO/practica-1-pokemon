// URL del JSON proporcionada en la consigna [cite: 44]
const url = "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/pokedex.json";

// 1. Consumo del JSON usando fetch (Punto 2 de la consigna) [cite: 45]
async function getPokemonData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Llamamos a la función que renderiza las cartas
        renderCards(data);
    } catch (error) {
        console.error("Error al cargar los datos de Pokémon:", error);
    }
}

// 2. Creación dinámica de cartas interactuando con el DOM (Puntos 3 y 4) [cite: 46, 48]
function renderCards(pokemonList) {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = ""; // Limpiamos antes de renderizar

    pokemonList.forEach(pokemon => {
        // Creamos la estructura de la carta (Thumbnail, Nombre, Descripción, Especie, Tipos) [cite: 50, 51, 52, 53, 54]
        const card = document.createElement('div');
        card.className = "col";
        
        // Usamos Template Literals para el diseño de la carta con clases de Bootstrap [cite: 47]
        card.innerHTML = `
            <div class="card h-100 shadow-sm pokemon-card">
                <img src="${pokemon.thumbnail}" class="card-img-top p-3" alt="${pokemon.name.english}">
                <div class="card-body">
                    <h5 class="card-title text-capitalize">${pokemon.name.english}</h5>
                    <p class="card-text text-muted" style="font-size: 0.9rem;">${pokemon.description.substring(0, 80)}...</p>
                    <p class="mb-1"><strong>Especie:</strong> ${pokemon.species}</p>
                    <div class="mb-3">
                        ${pokemon.type.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('')}
                    </div>
                    <button class="btn btn-outline-primary w-100">Ver más</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Ejecutamos la carga al iniciar
getPokemonData();