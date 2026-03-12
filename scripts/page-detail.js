document.addEventListener("DOMContentLoaded", () => {
    const appRoot = document.getElementById("app-root");

    // Ziskej ID predmetu z URL (napr. detail.html?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    if (!itemId) {
        appRoot.innerHTML = `
            <section class="section error-view">
                <h1 class="section__title">😕 ID nebylo zadáno</h1>
                <a href="index.html" class="button button--primary">Zpět na přehled</a>
            </section>
        `;
        return;
    }

    const item = DataService.getItem(itemId);

    if (!item) {
        appRoot.innerHTML = `
            <section class="section error-view">
                <h1 class="section__title">😕 Předmět nenalezen</h1>
                <p>Tento předmět neexistuje nebo byl smazán.</p>
                <a href="index.html" class="button button--primary">Zpět na přehled</a>
            </section>
        `;
        return;
    }

    const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('cs-CZ') : 'Neznámé';
    const isPickedUp = item.status === 'picked_up';
    const pickupDate = item.pickedUpDate ? new Date(item.pickedUpDate).toLocaleDateString('cs-CZ') : '';

    appRoot.innerHTML = `
        <section class="section">
            <div class="page-header">
                <a href="index.html" class="back-link">← Zpět na přehled</a>
            </div>

            <div class="detail">
                <div class="detail__image-section">
                    ${item.photoBase64
            ? `<img src="${item.photoBase64}" alt="${item.name}" class="detail__image">`
            : `<div class="detail__image-placeholder">📷<br>Bez fotky</div>`
        }
                </div>

                <div class="detail__info-section">
                    <div class="detail__header">
                        <h1 class="detail__title">${item.name}</h1>
                        <span class="detail__badge detail__badge--${isPickedUp ? 'picked' : 'available'}">
                            ${isPickedUp ? '✅ Vyzvednuto' : '📦 Ve skříni'}
                        </span>
                    </div>

                    ${item.description ? `<p class="detail__description">${item.description}</p>` : ''}

                    <div class="detail__meta-grid">
                        <div class="detail__meta-card">
                            <span class="detail__meta-icon">📍</span>
                            <div>
                                <span class="detail__meta-label">Nalezeno</span>
                                <span class="detail__meta-value">${item.foundLocation || 'Neuvedeno'}</span>
                            </div>
                        </div>
                        <div class="detail__meta-card">
                            <span class="detail__meta-icon">👤</span>
                            <div>
                                <span class="detail__meta-label">Nálezce</span>
                                <span class="detail__meta-value">${item.foundBy || 'Neuvedeno'}</span>
                            </div>
                        </div>
                        <div class="detail__meta-card">
                            <span class="detail__meta-icon">📅</span>
                            <div>
                                <span class="detail__meta-label">Datum nálezu</span>
                                <span class="detail__meta-value">${date}</span>
                            </div>
                        </div>
                        <div class="detail__meta-card">
                            <span class="detail__meta-icon">📦</span>
                            <div>
                                <span class="detail__meta-label">Pozice ve skříni</span>
                                <span class="detail__meta-value">${item.cabinetPosition || '—'}</span>
                            </div>
                        </div>
                    </div>

                    ${isPickedUp ? `
                        <div class="detail__pickup-info">
                            <h3>✅ Vyzvednuto</h3>
                            <p>Vyzvednul/a: <strong>${item.pickedUpBy}</strong></p>
                            <p>Datum: <strong>${pickupDate}</strong></p>
                        </div>
                    ` : `
                        <div class="detail__pickup-form" id="pickup-section">
                            <h3 class="detail__pickup-title">🤚 Je tento předmět váš?</h3>
                            <p class="detail__pickup-hint">Vezměte si předmět z pozice <strong>${item.cabinetPosition}</strong> ve skříni a vyplňte své jméno.</p>
                            <form id="pickup-form" class="detail__pickup-inline">
                                <input type="text" class="form__input" id="pickup-name" 
                                    placeholder="Vaše jméno" required>
                                <button type="submit" class="button button--primary">
                                    Vyzvednout
                                </button>
                            </form>
                        </div>
                    `}
                </div>
            </div>
        </section>
    `;

    const pickupForm = document.getElementById("pickup-form");
    if (pickupForm) {
        pickupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById('pickup-name').value.trim();
            if (!name) return;

            if (confirm(`Potvrzujete, že si vyzvedáváte tento předmět?\n\nJméno: ${name}`)) {
                DataService.pickUpItem(itemId, name);
                window.location.reload(); // Pro jednduchost znovunačteme stránku
            }
        });
    }
});
