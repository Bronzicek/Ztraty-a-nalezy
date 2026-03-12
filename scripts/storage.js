// =============================================================================
// Zpracování fotek – komprese a konverze do Base64
// =============================================================================

const PhotoService = {
    // Maximální rozměr fotky (px) – zmenšíme pro úsporu místa
    MAX_SIZE: 800,
    // Kvalita JPEG komprese (0-1)
    QUALITY: 0.7,

    // Převod souboru na zmenšený Base64 string
    async processPhoto(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const base64 = this.compressImage(img);
                        resolve(base64);
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = () => reject(new Error('Nepodařilo se načíst obrázek'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Nepodařilo se přečíst soubor'));
            reader.readAsDataURL(file);
        });
    },

    // Zmenšení a komprese obrázku
    compressImage(img) {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Zmenšit pokud je moc velký
        if (width > this.MAX_SIZE || height > this.MAX_SIZE) {
            if (width > height) {
                height = Math.round((height * this.MAX_SIZE) / width);
                width = this.MAX_SIZE;
            } else {
                width = Math.round((width * this.MAX_SIZE) / height);
                height = this.MAX_SIZE;
            }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Vrátit jako base64 JPEG
        return canvas.toDataURL('image/jpeg', this.QUALITY);
    },

    // Náhled fotky před uploadem
    createPreview(base64) {
        const img = document.createElement('img');
        img.src = base64;
        img.classList.add('photo-preview__img');
        img.alt = 'Náhled fotky';
        return img;
    }
};

console.log('PhotoService loaded');
