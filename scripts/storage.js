// =============================================================================
// Zpracování fotek – komprese a konverze do Base64
// =============================================================================

const PhotoService = {
    MAX_SIZE: 800,
    QUALITY: 0.7,
    async processPhoto(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.decoding = 'async';
            const objectUrl = URL.createObjectURL(file);

            img.onload = async () => {
                try {
                    // Modern browsers wait until the image is bit-mapped
                    if ('decode' in img) {
                        await img.decode().catch(() => { });
                    }
                    const base64 = this.compressImage(img);
                    URL.revokeObjectURL(objectUrl);
                    resolve(base64);
                } catch (err) {
                    URL.revokeObjectURL(objectUrl);
                    console.error('Compression error:', err);
                    reject(err);
                }
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Nepodařilo se načíst soubor s obrázkem. Je formát správný?'));
            };

            img.src = objectUrl;
        });
    },

    compressImage(img) {
        const canvas = document.createElement('canvas');
        // Prefer natural dimensions, fallback to set dimensions
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
            throw new Error('Obrázek má nulové rozměry.');
        }

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
        // Ensure white background for JPEGs (avoids black background for transparent PNGs converted to JPEG)
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
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
