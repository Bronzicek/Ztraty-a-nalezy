// Logika pro add.html
let currentPhotoBase64 = null;

document.addEventListener("DOMContentLoaded", () => {
    const cabinetContainer = document.getElementById("cabinet-container");
    if (cabinetContainer) {
        const positionMap = DataService.getItemsByPosition();
        cabinetContainer.innerHTML = Cabinet.renderCabinet(positionMap, { selectable: true });
    }

    const photoInput = document.getElementById("item-photo");
    if (photoInput) {
        photoInput.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const preview = document.getElementById('photo-preview');
            preview.innerHTML = '<p class="photo-preview__loading">Zpracovávám fotku...</p>';

            try {
                currentPhotoBase64 = await PhotoService.processPhoto(file);
                preview.innerHTML = `
                    <img src="${currentPhotoBase64}" alt="Náhled" class="photo-preview__img">
                    <button type="button" class="button button--danger button--small" id="remove-photo-btn">
                        ✕ Odebrat
                    </button>
                `;
                document.getElementById("remove-photo-btn").addEventListener("click", () => {
                    currentPhotoBase64 = null;
                    photoInput.value = '';
                    preview.innerHTML = '';
                });
            } catch (error) {
                preview.innerHTML = '<p class="photo-preview__error">Nepodařilo se načíst fotku.</p>';
                currentPhotoBase64 = null;
            }
        });
    }

    const form = document.getElementById("add-item-form");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const position = document.getElementById('cabinet-position-input').value;
            if (!position) {
                alert('Prosím vyberte pozici ve skříni kliknutím na volnou buňku (zelenou).');
                return;
            }

            const formData = {
                name: document.getElementById('item-name').value.trim(),
                description: document.getElementById('item-description').value.trim(),
                foundLocation: document.getElementById('item-location').value.trim(),
                foundBy: document.getElementById('item-finder').value.trim(),
                cabinetPosition: position,
                photoBase64: currentPhotoBase64
            };

            DataService.addItem(formData);

            // Zobrazit success
            document.getElementById("add-form-container").style.display = "none";
            const successContainer = document.getElementById("success-container");
            successContainer.style.display = "block";
            successContainer.innerHTML = `
                <section class="section success-view">
                    <div class="success-card">
                        <div class="success-card__icon">✅</div>
                        <h1 class="success-card__title">Nález uložen!</h1>
                        <p class="success-card__text">
                            Předmět <strong>${formData.name}</strong> byl zapsán na pozici <strong>${formData.cabinetPosition}</strong>.
                        </p>
                        <div class="success-card__instructions">
                            <h3>📋 Co teď?</h3>
                            <ol>
                                <li>Vezměte předmět do skříně ztrát a nálezů</li>
                                <li>Umístěte ho na pozici <strong>${formData.cabinetPosition}</strong></li>
                                <li>Domluvte se se správcem skříně</li>
                            </ol>
                        </div>
                        <div class="button-group" style="justify-content: center; margin-top: 1.5rem;">
                            <a href="index.html" class="button button--primary">Zpět na přehled</a>
                            <a href="add.html" class="button button--secondary">Přidat další</a>
                        </div>
                    </div>
                </section>
            `;
        });
    }
});
