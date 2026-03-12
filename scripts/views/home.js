// =============================================================================
// Home View – přehled skříně a seznam nálezů
// =============================================================================

const HomeView = {
    render() {
        const items = DataService.getAvailableItems();
        const positionMap = DataService.getItemsByPosition();

        let html = `
            <section class="section hero-section">
                <div class="hero">
                    <h1 class="hero__title">Ztráty a Nálezy</h1>
                    <p class="hero__subtitle">Našli jste něco? Nahlaste to. Ztratili jste něco? Podívejte se sem.</p>
                    <div class="hero__actions">
                        <a href="#/add" class="button button--primary button--large">
                            ➕ Nahlásit nález
                        </a>
                    </div>
                </div>
            </section>

            <section class="section">
                <h2 class="section__title">📦 Skříň ztrát a nálezů</h2>
                <p class="section__description">Klikněte na obsazenou pozici pro detail předmětu.</p>
                ${Cabinet.renderCabinet(positionMap, { onItemClick: true })}
            </section>

            <section class="section">
                <h2 class="section__title">📋 Aktuální nálezy</h2>
                <p class="section__description">${items.length === 0 ? 'Žádné nálezy ve skříni.' : `Celkem ${items.length} předmět${items.length === 1 ? '' : items.length < 5 ? 'y' : 'ů'} ve skříni.`}</p>
        `;

        if (items.length > 0) {
            html += '<div class="cards">';
            items.forEach(item => {
                const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('cs-CZ') : 'Neznámé';
                html += `
                    <article class="card card--clickable" onclick="Router.navigate('/item/${item.id}')">
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
                    </article>
                `;
            });
            html += '</div>';
        }

        html += '</section>';
        return html;
    }
};

console.log('HomeView loaded');
