// =============================================================================
// Main – inicializace aplikace
// =============================================================================

(function () {
    // Registrace routes
    Router.register('/', () => HomeView.render());
    Router.register('/add', () => AddItemView.render());
    Router.register('/item/:id', (params) => ItemDetailView.render(params));
    Router.register('/admin', () => AdminView.render());

    // Vložit demo data pro testování
    DataService.insertDemoData();

    // Hamburger menu pro mobilní zařízení
    const hamburger = document.getElementById('hamburger-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('navbar__hamburger--active');
            navMenu.classList.toggle('navbar__menu--open');
        });

        // Zavřít menu po kliknutí na odkaz
        navMenu.querySelectorAll('.navbar__link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('navbar__hamburger--active');
                navMenu.classList.remove('navbar__menu--open');
            });
        });
    }

    // Spustit router
    Router.init();

    console.log('App initialized');
})();