// =============================================================================
// SPA Router – hash-based routing
// =============================================================================

const Router = {
    routes: {},
    currentCleanup: null,

    // Registrace route
    register(path, handler) {
        this.routes[path] = handler;
    },

    // Navigace na novou route
    navigate(path) {
        window.location.hash = path;
    },

    // Zpracování aktuální hash route
    async handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const appRoot = document.getElementById('app-root');

        // Vyčistit předchozí view
        if (this.currentCleanup && typeof this.currentCleanup === 'function') {
            this.currentCleanup();
            this.currentCleanup = null;
        }

        // Najít odpovídající route
        let handler = null;
        let params = {};

        for (const [pattern, routeHandler] of Object.entries(this.routes)) {
            const match = this.matchRoute(pattern, hash);
            if (match) {
                handler = routeHandler;
                params = match.params;
                break;
            }
        }

        // Aktualizovat aktivní nav link
        this.updateNavLinks(hash);

        if (handler) {
            // Zobrazit loading
            appRoot.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Načítání...</p></div>';
            appRoot.classList.add('view-transition');

            try {
                const result = await handler(params);
                if (typeof result === 'string') {
                    appRoot.innerHTML = result;
                }
                // Posunout nahoru
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Route error:', error);
                appRoot.innerHTML = `
                    <section class="section error-view">
                        <h1 class="section__title">😕 Něco se pokazilo</h1>
                        <p class="error-message">${error.message}</p>
                        <a href="#/" class="button button--primary">Zpět na přehled</a>
                    </section>
                `;
            }

            // Odebrat transition třídu po animaci
            requestAnimationFrame(() => {
                appRoot.classList.remove('view-transition');
            });
        } else {
            // 404
            appRoot.innerHTML = `
                <section class="section error-view">
                    <h1 class="section__title">🔍 Stránka nenalezena</h1>
                    <p>Požadovaná stránka neexistuje.</p>
                    <a href="#/" class="button button--primary">Zpět na přehled</a>
                </section>
            `;
        }
    },

    // Pattern matching pro routes (podporuje :param)
    matchRoute(pattern, hash) {
        const patternParts = pattern.split('/').filter(Boolean);
        const hashParts = hash.split('/').filter(Boolean);

        if (patternParts.length !== hashParts.length) return null;

        const params = {};
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].slice(1)] = hashParts[i];
            } else if (patternParts[i] !== hashParts[i]) {
                return null;
            }
        }

        return { params };
    },

    // Aktualizace aktivního nav linku
    updateNavLinks(hash) {
        document.querySelectorAll('.navbar__link').forEach(link => {
            link.classList.remove('navbar__link--active');
            const linkHash = link.getAttribute('href')?.slice(1);
            if (linkHash === hash || (hash.startsWith(linkHash) && linkHash !== '/')) {
                link.classList.add('navbar__link--active');
            } else if (linkHash === '/' && hash === '/') {
                link.classList.add('navbar__link--active');
            }
        });
    },

    // Inicializace routeru
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        // Počáteční route
        if (!window.location.hash) {
            window.location.hash = '#/';
        } else {
            this.handleRoute();
        }
    }
};

console.log('Router loaded');
