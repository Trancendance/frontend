import { NotFoundDefault } from './NotFoundDefault';

type View = () => Node;

export interface Route {
    path: string;
    view: View;
    id: string;
    loader?: () => Promise<void>;
    errorView?: View;
    children?: Route[];
}

const routerRoot = () => document.getElementsByTagName('router-root').item(0);

// Utils
const segs = (path: string) =>
    path
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .filter(Boolean);

function getViews(path: string, routes: Route[]): Route[] {
    const parts = segs(path);
    const out: Route[] = [];
    const addMatch = (level: Route[], i: number, parts: string[]): void => {
        if (i > parts.length) return;
        if (parts.length === 0) {
            out.push(routes[0] ?? NotFoundDefault);
            return;
        }
        const found = level.find((r) => r.path === parts[i]);
        if (!found) return;
        out.push(found);
        if (found.children) addMatch(found.children, i + 1, parts);
    };
    addMatch(routes, 0, parts);
    return out;
}

function routerGetLoader(route: Route) {
    if (route.loader) {
        route
            .loader()
            .then(() => console.log(`Loaded route: ${route.id}`))
            .catch((err) =>
                console.error(`Error loading route ${route.id}:`, err)
            );
        console.log(`Rendering route: ${route.id}`);
    }
}

function mountViews(views: Route[], outlet = routerRoot) {
    let host = outlet();
    if (!host) throw new Error('Router outlet not found');
    let level = 0;
    for (const route of views) {
        const node = route.view();
        if (host?.getAttribute('data-route-id') !== route.id) {
            host.replaceChildren(node);
            routerGetLoader(route);
            host.setAttribute('data-route-id', route.id);
        }
        const next = host.getElementsByTagName('router-outlet');
        if (next.length === 0) return;
        host = next[0] as HTMLElement;
        level++;
        if (level == views.length) {
            host.replaceChildren();
            host.removeAttribute('data-route-id');
            return;
        }
    }
}

function render(routes: Route[], outlet = routerRoot, previousPath?: string) {
    const path = window.location.pathname;
    const views = getViews(path, routes);
    mountViews(views);
}

function navigate(path: string, replace = false) {
    if (replace) history.replaceState({}, '', path);
    else history.pushState({}, '', path);
}

function updateElementsCurrentAttribute(path: string) {
    document.querySelectorAll('[data-router-current]').forEach((el) => {
        el.setAttribute('current', path);
    });
}

function renderAnchorLinks(url: URL, e: Event, routes: Route[]) {
    if (url.origin !== window.location.origin) return;
    e.preventDefault();
    navigate(url.pathname);
    updateElementsCurrentAttribute(url.pathname);
    render(routes);
}
export function startRouter(routes: Route[]) {
    document.addEventListener('click', (e) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(
            'a[data-link]'
        );
        if (!a) return;
        const url = new URL(a.href);
        renderAnchorLinks(url, e, routes);
    });
    document.addEventListener('link-click', (e: any) => {
        const url = new URL(e.detail.href, location.href);
        renderAnchorLinks(url, e, routes);
    });

    window.addEventListener('popstate', () => render(routes));
    render(routes);
    updateElementsCurrentAttribute(window.location.pathname);
}
