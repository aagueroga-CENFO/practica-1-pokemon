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
    return types.map(t => `<span class="type-pill bg-${t.toLowerCase()}"><img src="${TYPE_ICONS[t]}" class="type-icon"> ${t}</span>`).join('');
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
    
    noResults.classList.toggle('d-none', list.length > 0);

    list.forEach(pk => {
        const idStr = pk.id.toString().padStart(3, '0');
        const col = document.createElement('div');
        col.className = "col";
        col.innerHTML = `
            <div class="card shadow-sm pokemon-card border-0">
                <div class="img-container"><img src="${URL_THUMB}${idStr}.png" class="img-thumb"></div>
                <div class="card-body d-flex flex-column">
                    <small class="text-muted">#${idStr} • ${pk.species}</small>
                    <h5 class="fw-bold mb-2">${pk.name.english}</h5>
                    <div class="mb-3">${getTypesHtml(pk.type)}</div>
                    <button class="btn btn-primary btn-sm mt-auto rounded-pill fw-bold" onclick="showDetail(${pk.id})">Ver detalles</button>
                </div>
            </div>`;
        container.appendChild(col);
    });
}

document.getElementById('filter-input').addEventListener('keyup', (e) => {
    const val = e.target.value.toLowerCase().trim();
    render(allPokemon.filter(p => p.name.english.toLowerCase().includes(val)));
});

function showDetail(id) {
    const p = allPokemon.find(x => x.id === id);
    const idStr = p.id.toString().padStart(3, '0');
    Swal.fire({
        title: `<span class="fw-bold text-uppercase">${p.name.english}</span>`,
        html: `
            <div class="container-fluid p-0">
                <img src="${URL_HIRES}${idStr}.png" class="modal-img">
                <div class="modal-info-box">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge bg-dark rounded-pill">Nº #${idStr}</span>
                        <div>${getTypesHtml(p.type)}</div>
                    </div>
                    <div class="modal-description"><em>"${p.description}"</em></div>
                    <div class="stat-grid">
                        <div class="stat-box"><span class="stat-label">HP</span><span class="stat-value text-success">${p.base.HP}</span></div>
                        <div class="col-4"><div class="stat-box"><span class="stat-label">ATK</span><span class="stat-value text-danger">${p.base.Attack}</span></div></div>
                        <div class="col-4"><div class="stat-box"><span class="stat-label">DEF</span><span class="stat-value text-primary">${p.base.Defense}</span></div></div>
                        <div class="col-4"><div class="stat-box"><span class="stat-label">S. ATK</span><span class="stat-value text-warning">${p.base["Sp. Attack"]}</span></div></div>
                        <div class="col-4"><div class="stat-box"><span class="stat-label">S. DEF</span><span class="stat-value text-info">${p.base["Sp. Defense"]}</span></div></div>
                        <div class="col-4"><div class="stat-box"><span class="stat-label">SPD</span><span class="stat-value text-dark">${p.base.Speed}</span></div></div>
                    </div>
                </div>
            </div>`,
        confirmButtonText: 'Cerrar Registro',
        confirmButtonColor: '#333',
        width: '450px',
        showCloseButton: true
    });
}

init();