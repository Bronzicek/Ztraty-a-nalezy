// =============================================================================
// Data Service – localStorage jako databáze
// =============================================================================

const DataService = {
    STORAGE_KEY: 'ztraty_nalezy_items',
    ADMIN_PASSWORD: 'admin123',

    _getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    _saveAll(items) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    },

    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    addItem(itemData) {
        const items = this._getAll();
        const newItem = {
            id: this._generateId(),
            ...itemData,
            status: 'available',
            pickedUpBy: null,
            pickedUpDate: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.unshift(newItem);
        this._saveAll(items);
        return newItem.id;
    },

    getAvailableItems() {
        return this._getAll().filter(item => item.status === 'available');
    },
    getAllItems() {
        return this._getAll();
    },

    getItem(id) {
        return this._getAll().find(item => item.id === id) || null;
    },
    updateItem(id, data) {
        const items = this._getAll();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
        this._saveAll(items);
        return true;
    },

    pickUpItem(id, pickedUpBy) {
        return this.updateItem(id, {
            status: 'picked_up',
            pickedUpBy: pickedUpBy,
            pickedUpDate: new Date().toISOString()
        });
    },

    deleteItem(id) {
        const items = this._getAll().filter(item => item.id !== id);
        this._saveAll(items);
    },

    getItemsByPosition() {
        const positionMap = {};
        this.getAvailableItems().forEach(item => {
            if (item.cabinetPosition) {
                positionMap[item.cabinetPosition] = item;
            }
        });
        return positionMap;
    },

    checkAdminPassword(password) {
        return password === this.ADMIN_PASSWORD;
    },

    isAdmin() {
        return sessionStorage.getItem('isAdmin') === 'true';
    },

    loginAdmin() {
        sessionStorage.setItem('isAdmin', 'true');
    },
    logoutAdmin() {
        sessionStorage.removeItem('isAdmin');
    },

    insertDemoData() {

        if (this._getAll().length > 0) return;
        const demoItems = [
            {
                name: 'Klíčenka',
                description: 'Klíčenka s několika klíči a modrým přívěskem',
                foundLocation: 'Chodba u jídelny',
                foundBy: 'Jan Novák',
                cabinetPosition: 'A3',
                photoBase64: 'assets/klicenka.webp'
            },
            {
                name: 'Růžová holčičí čepice',
                description: 'Teplá pletená růžová čepice s bambulí',
                foundLocation: 'Tělocvična',
                foundBy: 'Petra Dvořáková',
                cabinetPosition: 'B5',
                photoBase64: 'assets/cepice.webp'
            },
            {
                name: 'Kalkulačka Casio',
                description: 'Vědecká kalkulačka, šedý model',
                foundLocation: 'Učebna 204',
                foundBy: 'Tomáš Kříž',
                cabinetPosition: 'C1',
                photoBase64: 'assets/kalkulacka.jpg'
            }
        ];
        demoItems.forEach(item => this.addItem(item));
    }
};

console.log('DataService loaded (localStorage)');
