const API_URL = "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/pokedex.json";
const URL_THUMB = "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/thumbnails/";
const URL_HIRES = "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/";

const TYPE_ICONS = {
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

let allPokemon = [];

function getTypesHtml(types) {
    return types.map(t => `
        <span class="type-pill bg-${t.toLowerCase()}">
            <img src="${TYPE_ICONS[t]}" class="type-icon"> ${t}
        </span>
    `).join('');
}

async function init() {
    try {
        const res = await fetch(API_URL);
        allPokemon = await res.json();
        render(allPokemon);
    } catch (err) { console.error(err); }
}

function render(list) {
    const container = document.getElementById('pokemon-container');
    const noResults = document.getElementById('no-results');
    container.innerHTML = "";
    
    // Implicación Punto 6.a.v: Mostrar/Ocultar mensaje "Sin resultados"
    if (list.length === 0) {
        noResults.classList.remove('d-none');
    } else {
        noResults.classList.add('d-none');
        list.forEach(pk => {
            const idStr = pk.id.toString().padStart(3, '0');
            const col = document.createElement('div');
            col.className = "col";
            col.innerHTML = `
                <div class="card h-100 shadow-sm pokemon-card border-0">
                    <div class="img-container"><img src="${URL_THUMB}${idStr}.png" style="width: 100px;"></div>
                    <div class="card-body d-flex flex-column text-start">
                        <small class="text-muted">#${idStr}</small>
                        <h5 class="fw-bold">${pk.name.english}</h5>
                        <div class="mb-3">${getTypesHtml(pk.type)}</div>
                        <button class="btn btn-primary btn-sm mt-auto rounded-pill fw-bold" onclick="showDetail(${pk.id})">Ver detalles</button>
                    </div>
                </div>`;
            container.appendChild(col);
        });
    }
}

// Implicaciones Casos de Prueba 6.a (i, ii, iii, iv)
document.getElementById('filter-input').addEventListener('keyup', (e) => {
    const val = e.target.value.toLowerCase().trim(); // Case Insensitive (i) y Trim (ii)
    
    if (val === "") {
        render(allPokemon); // Cadena vacía (iii)
    } else {
        const filtered = allPokemon.filter(p => p.name.english.toLowerCase().includes(val)); // Parcial (iv)
        render(filtered);
    }
});

function showDetail(id) {
    const p = allPokemon.find(x => x.id === id);
    const idStr = p.id.toString().padStart(3, '0');
    Swal.fire({
        title: `<span class="fw-bold text-uppercase">${p.name.english}</span>`,
        html: `
            <div class="text-center">
                <img src="${URL_HIRES}${idStr}.png" class="img-fluid mb-4" style="max-height: 200px;">
                <div class="text-start p-3 bg-light rounded-3 shadow-sm">
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Nº:</strong> #${idStr}</span>
                        <div>${getTypesHtml(p.type)}</div>
                    </div>
                    <p class="small text-muted mb-3"><em>${p.description}</em></p>
                    <div class="row g-2 text-center">
                        <div class="col-4"><div class="stat-box"><span class="stat-label">HP</span><span class="stat-value text-success">${p.base.HP}</span></div></div>
                        <div class="col-4"><div class="stat-box"><span class="stat-label">ATK</span><span class="stat-value text-danger">${p.base.Attack}</span></div></div>
                        <div class="col-4"><div class="stat-box"><span class="stat-label">DEF</span><span class="stat-value text-primary">${p.base.Defense}</span></div></div>
                    </div>
                </div>
            </div>`,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#333'
    });
}

init();