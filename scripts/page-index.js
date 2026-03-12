// Logika pro index.html
document.addEventListener("DOMContentLoaded", () => {
    // 1. Vykresleni skrine
    const cabinetContainer = document.getElementById("cabinet-container");
    if (cabinetContainer) {
        const positionMap = DataService.getItemsByPosition();
        // Vykresli vcetne prokliku. cabinet.js ocekava onItemClick. Muzu prepsat.
        // Puvodne onclick="Router.navigate('/item/'+item.id)". Misto toho udelam klasicky odkaz:
        // Ale cabinet.js do statickeho html zaplaty dava onclick.  Upravim ho za moment.
        cabinetContainer.innerHTML = Cabinet.renderCabinet(positionMap, { onItemClick: true });
    }

    // 2. Vykresleni karet
    const itemsCountContainer = document.getElementById("items-count-container");
    const itemsCardsContainer = document.getElementById("items-cards-container");

    if (itemsCountContainer && itemsCardsContainer) {
        const items = DataService.getAvailableItems();

        itemsCountContainer.textContent = items.length === 0
            ? 'Žádné nálezy ve skříni.'
            : `Celkem ${items.length} předmět${items.length === 1 ? '' : items.length < 5 ? 'y' : 'ů'} ve skříni.`;

        if (items.length > 0) {
            let html = '<div class="cards">';
            items.forEach(item => {
                const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('cs-CZ') : 'Neznámé';
                // href="detail.html?id=ID"
                html += `
                    <a href="detail.html?id=${item.id}" class="card card--clickable" style="text-decoration: none; color: inherit;">
                        <div class="card__image-container">
                            ${item.photoBase64
                        ? `<img src="${item.photoBase64}" alt="${item.name}" class="card__image">`
                        : `<div class="card__image-placeholder">📷</div>`
                    }
                        </div>
                        <div class="card__header">
                            <h3 class="card__title">${item.name}</h3>
                            <span class="card__badge">${item.cabinetPosition || '?'}</span>
                        </div>
                        <div class="card__body">
                            <p class="card__description">${item.description || ''}</p>
                            <div class="card__meta">
                                <span class="card__meta-item">📍 ${item.foundLocation || 'Neuvedeno'}</span>
                                <span class="card__meta-item">📅 ${date}</span>
                            </div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
            itemsCardsContainer.innerHTML = html;
        } else {
            itemsCardsContainer.innerHTML = "";
        }
    }
});
