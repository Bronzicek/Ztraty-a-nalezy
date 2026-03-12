document.addEventListener("DOMContentLoaded", () => {
    const appRoot = document.getElementById("app-root");

    function renderLogin() {
        appRoot.innerHTML = `
            <section class="section">
                <div class="page-header">
                    <a href="index.html" class="back-link">← Zpět na přehled</a>
                    <h1 class="section__title">🔐 Správa skříně</h1>
                    <p class="section__description">Zadejte heslo pro přístup k funkcím správce.</p>
                </div>
                <form class="form admin-login-form" id="login-form">
                    <div class="form__group">
                        <label class="form__label" for="admin-password">Heslo</label>
                        <input class="form__input" type="password" id="admin-password" 
                            placeholder="Zadejte heslo správce" required>
                    </div>
                    <p class="form__hint" id="login-error" style="color: var(--color-danger); display: none;">
                        Nesprávné heslo. Zkuste to znovu.
                    </p>
                    <button class="button button--primary" type="submit">Přihlásit se</button>
                </form>
            </section>
        `;

        document.getElementById("login-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            if (DataService.checkAdminPassword(password)) {
                DataService.loginAdmin();
                renderDashboard();
            } else {
                const errorEl = document.getElementById('login-error');
                errorEl.style.display = 'block';
                document.getElementById('admin-password').value = '';
                document.getElementById('admin-password').focus();
            }
        });
    }

    function renderDashboard() {
        const allItems = DataService.getAllItems();
        const available = allItems.filter(i => i.status === 'available');
        const pickedUp = allItems.filter(i => i.status === 'picked_up');

        let html = `
            <section class="section">
                <div class="page-header">
                    <a href="index.html" class="back-link">← Zpět na přehled</a>
                    <div class="admin-header">
                        <h1 class="section__title">🛠️ Správa skříně</h1>
                        <button class="button button--secondary button--small" id="logout-btn">
                            Odhlásit se
                        </button>
                    </div>
                </div>

                <div class="admin-stats">
                    <div class="stat-card">
                        <span class="stat-card__number">${available.length}</span>
                        <span class="stat-card__label">Ve skříni</span>
                    </div>
                    <div class="stat-card stat-card--success">
                        <span class="stat-card__number">${pickedUp.length}</span>
                        <span class="stat-card__label">Vyzvednuto</span>
                    </div>
                    <div class="stat-card stat-card--info">
                        <span class="stat-card__number">${allItems.length}</span>
                        <span class="stat-card__label">Celkem</span>
                    </div>
                </div>

                <h2 class="section__title">📋 Všechny předměty</h2>
                <div class="admin-table-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Název</th>
                                <th>Pozice</th>
                                <th>Nalezeno</th>
                                <th>Status</th>
                                <th>Akce</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        if (allItems.length === 0) {
            html += `<tr><td colspan="5" class="admin-table__empty">Žádné předměty.</td></tr>`;
        } else {
            allItems.forEach(item => {
                const isPickedUp = item.status === 'picked_up';
                html += `
                    <tr class="${isPickedUp ? 'admin-table__row--picked' : ''}">
                        <td>
                            <strong>${item.name}</strong>
                            <br><small class="text-muted">${item.description || ''}</small>
                        </td>
                        <td><span class="table-badge">${item.cabinetPosition || '—'}</span></td>
                        <td>${item.foundLocation || '—'}</td>
                        <td>
                            <span class="status-badge status-badge--${isPickedUp ? 'picked' : 'available'}">
                                ${isPickedUp ? `Vyzvednuto (${item.pickedUpBy || '?'})` : 'Ve skříni'}
                            </span>
                        </td>
                        <td class="admin-table__actions">
                            <button class="button button--secondary button--small edit-btn" data-id="${item.id}">✏️</button>
                            <button class="button button--danger button--small delete-btn" data-id="${item.id}" data-name="${item.name.replace(/'/g, "\\'")}">🗑️</button>
                        </td>
                    </tr>
                `;
            });
        }

        html += `
                        </tbody>
                    </table>
                </div>
            </section>
        `;

        appRoot.innerHTML = html;

        document.getElementById("logout-btn").addEventListener("click", () => {
            DataService.logoutAdmin();
            renderLogin();
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => renderEdit(btn.getAttribute("data-id")));
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const name = btn.getAttribute("data-name");
                if (confirm(`Opravdu chcete smazat "${name}"?`)) {
                    DataService.deleteItem(id);
                    renderDashboard(); // Re-render table
                }
            });
        });
    }

    function renderEdit(id) {
        const item = DataService.getItem(id);
        if (!item) return;

        const positionMap = DataService.getItemsByPosition();
        // Uvolníme aktuální pozici pro editaci
        delete positionMap[item.cabinetPosition];

        appRoot.innerHTML = `
            <section class="section">
                <div class="page-header">
                    <button class="back-link" style="background:none;border:none;cursor:pointer;padding:0;font:inherit;" id="back-to-dash">← Zpět na panel</button>
                    <h1 class="section__title">✏️ Upravit: ${item.name}</h1>
                </div>
                <form class="form" id="edit-form">
                    <div class="form__group">
                        <label class="form__label" for="edit-name">Název</label>
                        <input class="form__input" type="text" id="edit-name" value="${item.name}" required>
                    </div>
                    <div class="form__group">
                        <label class="form__label" for="edit-description">Popis</label>
                        <textarea class="form__input form__textarea" id="edit-description" rows="3">${item.description || ''}</textarea>
                    </div>
                    <div class="form__group">
                        <label class="form__label" for="edit-location">Kde nalezeno</label>
                        <input class="form__input" type="text" id="edit-location" value="${item.foundLocation || ''}">
                    </div>
                    <div class="form__group">
                        <label class="form__label">Pozice ve skříni</label>
                        <input type="hidden" id="cabinet-position-input" value="${item.cabinetPosition || ''}">
                        <span class="selected-position visible" id="selected-position-label">
                            Vybraná pozice: ${item.cabinetPosition || 'žádná'}
                        </span>
                        <div id="cabinet-container">
                            ${Cabinet.renderCabinet(positionMap, { selectable: true, selectedPosition: item.cabinetPosition })}
                        </div>
                    </div>
                    <div class="form__group">
                        <label class="form__label" for="edit-status">Status</label>
                        <select class="form__select" id="edit-status">
                            <option value="available" ${item.status === 'available' ? 'selected' : ''}>Ve skříni</option>
                            <option value="picked_up" ${item.status === 'picked_up' ? 'selected' : ''}>Vyzvednuto</option>
                        </select>
                    </div>
                    <div class="button-group">
                        <button class="button button--primary" type="submit">💾 Uložit změny</button>
                        <button type="button" class="button button--secondary" id="cancel-edit-btn">Zrušit</button>
                    </div>
                </form>
            </section>
        `;

        document.getElementById("back-to-dash").addEventListener("click", () => renderDashboard());
        document.getElementById("cancel-edit-btn").addEventListener("click", () => renderDashboard());
        document.getElementById("edit-form").addEventListener("submit", (e) => {
            e.preventDefault();
            DataService.updateItem(id, {
                name: document.getElementById('edit-name').value.trim(),
                description: document.getElementById('edit-description').value.trim(),
                foundLocation: document.getElementById('edit-location').value.trim(),
                cabinetPosition: document.getElementById('cabinet-position-input').value,
                status: document.getElementById('edit-status').value
            });
            renderDashboard();
        });
    }

    if (!DataService.isAdmin()) {
        renderLogin();
    } else {
        renderDashboard();
    }
});
