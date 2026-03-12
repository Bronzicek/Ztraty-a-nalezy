// =============================================================================
// Main – inicializace aplikace
// =============================================================================

(function () {

    DataService.insertDemoData();

    const hamburger = document.getElementById('hamburger-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('navbar__hamburger--active');
            navMenu.classList.toggle('navbar__menu--open');
        });

        navMenu.querySelectorAll('.navbar__link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('navbar__hamburger--active');
                navMenu.classList.remove('navbar__menu--open');
            });
        });
    }


    console.log('App initialized');
})();