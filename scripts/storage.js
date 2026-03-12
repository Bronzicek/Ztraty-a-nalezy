// =============================================================================
// Zpracování fotek – komprese a konverze do Base64
// =============================================================================

const PhotoService = {
    MAX_SIZE: 800,
    QUALITY: 0.7,
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

    compressImage(img) {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

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

        return canvas.toDataURL('image/jpeg', this.QUALITY);
    },

    createPreview(base64) {
        const img = document.createElement('img');
        img.src = base64;
        img.classList.add('photo-preview__img');
        img.alt = 'Náhled fotky';
        return img;
    }
};

console.log('PhotoService loaded');
