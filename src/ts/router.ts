// src/ts/router.ts
import { Route } from '../router/routerSPA';
import { RouterOutlet } from '../router/RouterOutlet';
import { HomeView, ModuleView, SubRouteView } from '../views/home';

customElements.define('router-outlet', RouterOutlet);
export const routes: Route[] = [
    {
        path: '/',
        id: 'home',
        view: HomeView,
    },
    {
        path: 'module',
        id: 'module',
        view: ModuleView,
        children: [
            {
                path: 'subroute',
                id: 'subroute',
                view: SubRouteView,
            },
            {
                path: 'subroute2',
                id: 'subroute2',
                view: () => {
                    const el = document.createElement('div');
                    el.innerHTML = /*html*/ `
                        <h1>SubRoute 2</h1>
                        <a data-link href="/" class="text-blue-600 hover:underline">Go Home</a>
                        <a data-link href="/module" class="text-blue-600 hover:underline">Go to Module</a>
                        <a data-link href="/module/subroute" class="text-blue-600 hover:underline">Go to SubRoute</a>
                    `;
                    return el;
                },
            },
        ],
    },
];
