const themeToggle = document.querySelector('.navbar__theme-toggle');
const themeIcon = document.querySelector('.navbar__theme-icon');

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
}

function updateIcon(theme) {
    if (themeIcon) {
        themeIcon.src = theme === 'dark' ? 'assets/light-mode.svg' : 'assets/dark-mode.svg';
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

initializeTheme();
