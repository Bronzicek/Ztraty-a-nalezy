// =============================================================================
// Vizualizace skříně – interaktivní grid
// =============================================================================

const Cabinet = {
    rows: 4,
    cols: 8,

    // Generování názvů pozic (A1, A2, ... E10)
    getPositionName(row, col) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, D, E
        return `${rowLetter}${col + 1}`;
    },

    renderCabinet(positionMap = {}, options = {}) {
        const { selectable = false, selectedPosition = null, onSelect = null, onItemClick = null } = options;

        let html = '<div class="cabinet">';
        html += '<div class="cabinet__header"><h3 class="cabinet__title">📦 Skříň ztrát a nálezů</h3></div>';
        html += '<div class="cabinet__grid">';

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const position = this.getPositionName(row, col);
                const item = positionMap[position];
                const isOccupied = !!item;
                const isSelected = position === selectedPosition;

                let cellClass = 'cabinet__cell';
                if (isOccupied) cellClass += ' cabinet__cell--occupied';
                if (isSelected) cellClass += ' cabinet__cell--selected';
                if (selectable && !isOccupied) cellClass += ' cabinet__cell--selectable';

                html += `<div class="${cellClass}" data-position="${position}" 
                    ${selectable && !isOccupied ? `onclick="CabinetUI.selectPosition('${position}')"` : ''}
                    ${isOccupied && onItemClick ? `onclick="window.location.href = 'detail.html?id=${item.id}'"` : ''}
                    role="button" tabindex="0"
                    title="${isOccupied ? item.name : `Pozice ${position} – volná`}">
                    <span class="cabinet__cell-label">${position}</span>
                    ${isOccupied ? `
                        <div class="cabinet__cell-preview">
                            ${item.photoUrl ? `<img src="${item.photoUrl}" alt="${item.name}" class="cabinet__cell-img">` : ''}
                        </div>
                        <span class="cabinet__cell-name">${this.truncate(item.name, 12)}</span>
                    ` : `
                        <span class="cabinet__cell-empty">Volné</span>
                    `}
                </div>`;
            }
        }

        html += '</div></div>';
        return html;
    },

    truncate(str, maxLen) {
        if (!str) return '';
        return str.length > maxLen ? str.substring(0, maxLen) + '…' : str;
    }
};

const CabinetUI = {
    selectedPosition: null,
    onSelectCallback: null,

    selectPosition(position) {
        this.selectedPosition = position;

        document.querySelectorAll('.cabinet__cell--selected').forEach(cell => {
            cell.classList.remove('cabinet__cell--selected');
        });
        const cell = document.querySelector(`[data-position="${position}"]`);
        if (cell) {
            cell.classList.add('cabinet__cell--selected');
        }

        const input = document.getElementById('cabinet-position-input');
        if (input) {
            input.value = position;
        }
        const label = document.getElementById('selected-position-label');
        if (label) {
            label.textContent = `Vybraná pozice: ${position}`;
            label.classList.add('visible');
        }

        if (this.onSelectCallback) {
            this.onSelectCallback(position);
        }
    }
};

console.log('Cabinet loaded');
