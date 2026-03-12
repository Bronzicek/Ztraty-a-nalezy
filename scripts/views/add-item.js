// =============================================================================
// Add Item View – formulář pro nahlášení nálezu
// =============================================================================

const AddItemView = {
    photoBase64: null,

    render() {
        const positionMap = DataService.getItemsByPosition();

        return `
            <section class="section">
                <div class="page-header">
                    <a href="#/" class="back-link">← Zpět na přehled</a>
                    <h1 class="section__title">📝 Nahlásit nález</h1>
                    <p class="section__description">Našli jste ztracený předmět? Vyplňte formulář a umístěte ho do skříně.</p>
                </div>

                <form class="form" id="add-item-form" onsubmit="AddItemView.handleSubmit(event)">
                    <div class="form__group">
                        <label class="form__label" for="item-name">Název předmětu *</label>
                        <input class="form__input" type="text" id="item-name" name="name" 
                            placeholder="Např. Klíče, Mikina, Kalkulačka..." required>
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="item-description">Popis</label>
                        <textarea class="form__input form__textarea" id="item-description" name="description" 
                            placeholder="Popište předmět – barva, velikost, zvláštní znaky..." rows="3"></textarea>
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="item-location">Kde jste to našli? *</label>
                        <input class="form__input" type="text" id="item-location" name="foundLocation" 
                            placeholder="Např. Chodba u jídelny, Tělocvična..." required>
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="item-finder">Vaše jméno *</label>
                        <input class="form__input" type="text" id="item-finder" name="foundBy" 
                            placeholder="Vaše jméno" required>
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="item-photo">Fotka předmětu</label>
                        <div class="photo-upload" id="photo-upload-area">
                            <input type="file" id="item-photo" name="photo" accept="image/*" capture="environment"
                                class="photo-upload__input" onchange="AddItemView.handlePhotoChange(event)">
                            <label for="item-photo" class="photo-upload__label">
                                <span class="photo-upload__icon">📸</span>
                                <span class="photo-upload__text">Klikněte pro výběr fotky nebo vyfocení</span>
                            </label>
                            <div class="photo-preview" id="photo-preview"></div>
                        </div>
                    </div>

                    <div class="form__group">
                        <label class="form__label">Vyberte pozici ve skříni *</label>
                        <p class="form__hint">Klikněte na volnou (zelenou) pozici ve skříni.</p>
                        <input type="hidden" id="cabinet-position-input" name="cabinetPosition" required>
                        <span class="selected-position" id="selected-position-label"></span>
                        ${Cabinet.renderCabinet(positionMap, { selectable: true })}
                    </div>

                    <div class="form__actions">
                        <button class="button button--primary button--large" type="submit" id="submit-btn">
                            ✅ Uložit nález
                        </button>
                    </div>
                </form>
            </section>
        `;
    },

    async handlePhotoChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        const preview = document.getElementById('photo-preview');
        preview.innerHTML = '<p class="photo-preview__loading">Zpracovávám fotku...</p>';

        try {
            this.photoBase64 = await PhotoService.processPhoto(file);
            preview.innerHTML = `
                <img src="${this.photoBase64}" alt="Náhled" class="photo-preview__img">
                <button type="button" class="button button--danger button--small" onclick="AddItemView.removePhoto()">
                    ✕ Odebrat
                </button>
            `;
        } catch (error) {
            preview.innerHTML = '<p class="photo-preview__error">Nepodařilo se načíst fotku.</p>';
            this.photoBase64 = null;
        }
    },

    removePhoto() {
        this.photoBase64 = null;
        document.getElementById('item-photo').value = '';
        document.getElementById('photo-preview').innerHTML = '';
    },

    handleSubmit(event) {
        event.preventDefault();

        const position = document.getElementById('cabinet-position-input').value;
        if (!position) {
            alert('Prosím vyberte pozici ve skříni kliknutím na volnou buňku.');
            return;
        }

        const formData = {
            name: document.getElementById('item-name').value.trim(),
            description: document.getElementById('item-description').value.trim(),
            foundLocation: document.getElementById('item-location').value.trim(),
            foundBy: document.getElementById('item-finder').value.trim(),
            cabinetPosition: position,
            photoBase64: this.photoBase64
        };

        DataService.addItem(formData);
        this.photoBase64 = null;

        // Zobrazit úspěšnou zprávu
        const appRoot = document.getElementById('app-root');
        appRoot.innerHTML = `
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
                            <li>Domluvte se s moderátorem skříně</li>
                        </ol>
                    </div>
                    <div class="button-group" style="justify-content: center; margin-top: 1.5rem;">
                        <a href="#/" class="button button--primary">Zpět na přehled</a>
                        <a href="#/add" class="button button--secondary">Přidat další</a>
                    </div>
                </div>
            </section>
        `;
    }
};

console.log('AddItemView loaded');
