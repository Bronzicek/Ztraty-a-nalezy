document.addEventListener("DOMContentLoaded", () => {
    const cabinetContainer = document.getElementById("cabinet-container");
    if (cabinetContainer) {
        const positionMap = DataService.getItemsByPosition();
        cabinetContainer.innerHTML = Cabinet.renderCabinet(positionMap, { onItemClick: true });
    }

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

    const activityContainer = document.getElementById("activity-log-container");
    if (activityContainer) {
        const allItems = DataService.getAllItems();
        let events = [];

        allItems.forEach(item => {
            if (item.createdAt) {
                events.push({
                    type: 'add',
                    date: new Date(item.createdAt),
                    text: `<strong>${item.foundBy || 'Někdo'}</strong> přinesl/a <strong>${item.name}</strong> a uložil/a na pozici <strong>${item.cabinetPosition || '?'}</strong>.`
                });
            }

            if (item.status === 'picked_up' && item.pickedUpDate) {
                events.push({
                    type: 'pickup',
                    date: new Date(item.pickedUpDate),
                    text: `<strong>${item.pickedUpBy || 'Někdo'}</strong> si vyzvedl/a <strong>${item.name}</strong> z pozice <strong>${item.cabinetPosition || '?'}</strong>.`
                });
            }
        });

        events.sort((a, b) => b.date - a.date);

        events = events.slice(0, 8);

        if (events.length === 0) {
            activityContainer.innerHTML = '<p class="text-muted">Zatím se nic nestalo.</p>';
        } else {
            let html = '<ul class="activity-list">';
            events.forEach(ev => {
                const dateStr = ev.date.toLocaleString('cs-CZ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const icon = ev.type === 'add' ? '📥' : '📤';

                html += `
                    <li class="activity-item">
                        <span class="activity-icon" aria-hidden="true">${icon}</span>
                        <div class="activity-content">
                            <span class="activity-text">${ev.text}</span>
                            <span class="activity-date">${dateStr}</span>
                        </div>
                    </li>
                `;
            });
            html += '</ul>';
            activityContainer.innerHTML = html;
        }
    }
});
